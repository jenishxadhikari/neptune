import librosa
import numpy as np
import psycopg2

# from modules.constellation import create_constellation
from modules.find_peak import find_peaks_2d
from modules.hash import create_hashes
from modules.stft import stft_manual

def connect_db(dbname, user, password, host, port=5432):
    return psycopg2.connect(
        dbname=dbname,
        user=user,
        password=password,
        host=host,
        port=port
    )

def load_wav_mono(filepath: str, target_sr: int = 8192) -> tuple[np.ndarray, int]:
    """Load audio as mono and resample to target_sr using librosa."""
    audio, sr = librosa.load(filepath, sr=target_sr, mono=True)
    return audio.astype(np.float32), sr


def query_recording_api(
    recording_file: str,
    db_params,
    top_n: int = 1,
    target_sr: int = 8192,
    window_length_seconds: float = 0.5,
    hop_fraction: float = 0.25,
    per_frame_top_k: int = 15
):
    audio, sr = load_wav_mono(recording_file, target_sr=target_sr)

    freqs, times, stft = stft_manual(
        audio, sr,
        window_length_seconds=window_length_seconds,
        hop_fraction=hop_fraction
    )

    constellation = find_peaks_2d(
        stft,
        neighborhood_freq=20,
        neighborhood_time=6,
        per_frame_top_k=per_frame_top_k,
        dynamic_percentile=75.0
    )

    hashes = create_hashes(constellation, fan_value=8, max_time_delta=200)
    if not hashes:
        print("[WARN] No hashes extracted from query.")
        return {"status": "fail", "results": []}

    # DB lookup
    conn = connect_db(**db_params)
    results = []
    try:
        with conn.cursor() as cur:
            hash_keys = list(hashes.keys())
            placeholders = ','.join(['%s'] * len(hash_keys))
            print(f"[INFO] Matching {len(hash_keys)} hashes against database...")
            cur.execute(
                f"SELECT hash, time, song_id FROM hashes WHERE hash IN ({placeholders});",
                tuple(hash_keys)
            )
            matches = cur.fetchall()
            print(f"[INFO] Raw matches fetched: {len(matches)}")

            # Group matches by song, build offset histogram
            matches_per_song = {}
            for h, db_time, song_id in matches:
                q_time = hashes[h][0]
                matches_per_song.setdefault(song_id, []).append((h, q_time, db_time))

            # Score via offset histogram (most consistent alignment)
            scores = {}
            for song_id, lst in matches_per_song.items():
                offset_hist = {}
                for _, qt, dt in lst:
                    delta = int(dt) - int(qt)
                    offset_hist[delta] = offset_hist.get(delta, 0) + 1
                if offset_hist:
                    best_offset, best_score = max(offset_hist.items(), key=lambda x: x[1])
                    scores[song_id] = (best_offset, best_score)

            if not scores:
                print("[WARN] No aligned matches found.")
                return {"status": "fail", "results": []}

            top_matches = sorted(scores.items(), key=lambda x: x[1][1], reverse=True)[:top_n]

            for song_id, (offset, score) in top_matches:
                cur.execute("SELECT title FROM songs WHERE id=%s;", (song_id,))
                name = cur.fetchone()[0]
                print(f"[RESULT] {name} | Score={score} | Offset={offset}")
                results.append({
                    "id": song_id,
                    "name": name,
                    "score": score,
                    "offset": offset
                })

    finally:
        conn.close()

    return {"status": "success", "results": results}
