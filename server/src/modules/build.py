import os
import tempfile
import subprocess
import numpy as np
from modules.query import connect_db, load_wav_mono
from modules.stft import stft_manual
from modules.find_peak import find_peaks_2d
from modules.hash import create_hashes


def download_youtube_audio(youtube_url: str, output_path: str):
    """
    Downloads audio from YouTube as WAV using yt-dlp.
    """
    try:
        subprocess.run(
            [
                "yt-dlp",
                "-x", "--audio-format", "wav",
                "-o", output_path,
                youtube_url
            ],
            check=True,
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE
        )
    except subprocess.CalledProcessError as e:
        raise RuntimeError(f"yt-dlp failed: {e.stderr.decode()}")


def build_fingerprint_from_youtube(youtube_url: str, target_sr: int = 8192):
    """
    Downloads YouTube audio and generates audio hashes.
    Returns a dict of {hash: (time, None)}.
    """
    tmpdir = tempfile.mkdtemp()
    wav_path = os.path.join(tmpdir, "audio.wav")

    # Step 1: Download
    download_youtube_audio(youtube_url, wav_path)

    # Step 2: Load audio
    audio, sr = load_wav_mono(wav_path, target_sr=target_sr)

    # Step 3: Compute STFT, peaks, hashes
    freqs, times, stft = stft_manual(audio, sr)
    constellation = find_peaks_2d(stft)
    hashes = create_hashes(constellation)

    # Step 4: Clean up
    if os.path.exists(wav_path):
        os.remove(wav_path)

    return hashes


def insert_hashes_to_db(hashes: dict, song_id: int, db_params: dict):
    """
    Inserts generated hashes into PostgreSQL.
    """
    conn = connect_db(**db_params)
    try:
        with conn.cursor() as cur:
            for h, (time, _) in hashes.items():
                cur.execute(
                    "INSERT INTO hashes (hash, time, song_id) VALUES (%s, %s, %s)",
                    (int(h), int(time), song_id)
                )
        conn.commit()
    except Exception as e:
        conn.rollback()
        raise RuntimeError(f"Database insert failed: {e}")
    finally:
        conn.close()
