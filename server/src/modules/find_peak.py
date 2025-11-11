import numpy as np
from numba import njit

@njit(cache=True)
def is_local_max(mag, f, t, f_radius, t_radius):
    """
    Check if mag[f,t] is a strict local maximum in its (2*f_radius+1)x(2*t_radius+1) neighborhood.
    """
    center = mag[f, t]
    # Reject zeros quickly
    if center <= 0:
        return False

    f0 = max(0, f - f_radius)
    f1 = min(mag.shape[0] - 1, f + f_radius)
    t0 = max(0, t - t_radius)
    t1 = min(mag.shape[1] - 1, t + t_radius)

    for ff in range(f0, f1 + 1):
        for tt in range(t0, t1 + 1):
            if ff == f and tt == t:
                continue
            if mag[ff, tt] >= center:
                return False
    return True

def find_peaks_2d(
    stft_matrix: np.ndarray,
    neighborhood_freq: int = 20,
    neighborhood_time: int = 6,
    per_frame_top_k: int = 15,
    dynamic_percentile: float = 75.0
):
    """
    2D local-maxima peak detection with a dynamic per-frame threshold.
    Returns list of (t_idx, f_idx) peaks sorted by time, then frequency.
    """
    mag = np.abs(stft_matrix)
    F, T = mag.shape
    peaks = []

    # Compute per-frame dynamic thresholds (percentile)
    thresholds = np.empty(T, dtype=np.float64)
    for t in range(T):
        col = mag[:, t]
        # Simple percentile w/o numpy.percentile (portable)
        sorted_col = np.sort(col)
        idx = int((dynamic_percentile / 100.0) * (sorted_col.size - 1))
        thresholds[t] = sorted_col[idx] if sorted_col.size > 0 else 0.0

    # Local maxima test
    for t in range(T):
        local_candidates = []
        thr = thresholds[t]
        for f in range(F):
            if mag[f, t] <= thr:
                continue
            if is_local_max(mag, f, t, neighborhood_freq, neighborhood_time):
                local_candidates.append((f, mag[f, t]))

        # Keep top-K per frame by magnitude
        if local_candidates:
            local_candidates.sort(key=lambda x: x[1], reverse=True)
            for f_idx, _ in local_candidates[:per_frame_top_k]:
                peaks.append((t, f_idx))

    # Sort by time then frequency (stable order for hashing)
    peaks.sort(key=lambda p: (p[0], p[1]))
    return peaks