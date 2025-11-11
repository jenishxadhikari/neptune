import numpy as np

from modules.fft import fft_iterative

def next_pow2(n: int) -> int:
    return 1 << (n - 1).bit_length()

def stft_manual(
    audio: np.ndarray,
    sample_rate: int,
    window_length_seconds: float = 0.5,
    hop_fraction: float = 0.25
):
    """
    Manual STFT using our iterative FFT.
    Returns (frequencies[Hz], times[s], STFT complex matrix [freq x time]).
    """
    window_len = int(window_length_seconds * sample_rate)
    window_len = next_pow2(max(256, window_len))  # ensure reasonable minimum & power-of-two
    hop = max(1, int(window_len * hop_fraction))
    window = np.hanning(window_len)

    # Zero-pad to fit complete frames
    if audio.ndim > 1:
        audio = audio[:, 0]
    audio = audio.astype(np.float64)
    audio = audio - np.mean(audio) if audio.size > 0 else audio

    total_frames = 0
    if audio.size >= window_len:
        total_frames = 1 + (audio.size - window_len) // hop
    else:
        # Pad short signals
        pad = window_len - audio.size
        audio = np.pad(audio, (0, pad))
        total_frames = 1

    stft_mat = np.empty((total_frames, window_len // 2), dtype=np.complex128)

    for i in range(total_frames):
        start = i * hop
        end = start + window_len
        seg = audio[start:end] * window
        X = fft_iterative(seg.astype(np.complex128))
        stft_mat[i, :] = X[:window_len // 2]

    stft_mat = stft_mat.T  # [freq_bins x time_frames]
    freqs = np.arange(window_len // 2) * (sample_rate / window_len)
    times = (np.arange(total_frames) * hop) / float(sample_rate)

    return freqs, times, stft_mat