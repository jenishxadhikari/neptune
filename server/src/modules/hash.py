def pack_hash(f1_idx: int, f2_idx: int, dt: int) -> int:
    """
    Pack (f1, f2, dt) into a 32-bit integer:
      f1: 11 bits (0..2047)
      f2: 11 bits (0..2047)
      dt: 10 bits (0..1023)
    Adjust if your FFT size differs; indices are truncated accordingly.
    """
    f1 = f1_idx & 0x7FF
    f2 = f2_idx & 0x7FF
    dt10 = dt & 0x3FF
    return (f2 << 21) | (f1 << 10) | dt10

def create_hashes(
    constellation: list,
    fan_value: int = 8,
    max_time_delta: int = 200
):
    """
    Shazam-style fan-out hashing from anchor peak to the next 'fan_value' peaks.
    constellation: list[(t_idx, f_idx)]
    Returns dict {hash_int: (query_time, song_id_or_None)}.
    """
    hashes = {}
    n = len(constellation)
    for i in range(n):
        t1, f1 = constellation[i]
        # Pair with next fan_value peaks
        upper = min(n, i + 1 + fan_value)
        for j in range(i + 1, upper):
            t2, f2 = constellation[j]
            dt = t2 - t1
            if 0 < dt <= max_time_delta:
                h = pack_hash(int(f1), int(f2), int(dt))
                # Store earliest time for that hash in this query
                if h not in hashes:
                    hashes[h] = (int(t1), None)
    return hashes