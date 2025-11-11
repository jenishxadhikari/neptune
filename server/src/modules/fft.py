from numba import njit
import numpy as np

@njit(cache=True)
def _bit_reverse_indices(n):
    """Bit-reversal permutation for length n (power of two)."""
    j = 0
    result = np.empty(n, dtype=np.int64)
    for i in range(n):
        result[i] = j
        bit = n >> 1
        while j & bit:
            j ^= bit
            bit >>= 1
        j ^= bit
    return result

@njit(cache=True)
def fft_iterative(x):
    """
    In-place iterative radix-2 Cooley–Tukey FFT.
    x: complex128 array, length must be power of two.
    Returns transformed array (also modified in place).
    """
    N = x.shape[0]
    if N & (N - 1) != 0:
        raise ValueError("FFT length must be a power of 2")

    # Bit-reversal permutation
    rev = _bit_reverse_indices(N)
    for i in range(N):
        if i < rev[i]:
            tmp = x[i]
            x[i] = x[rev[i]]
            x[rev[i]] = tmp

    m = 2
    while m <= N:
        angle = -2.0 * np.pi / m
        wm = np.cos(angle) + 1j * np.sin(angle)
        for k in range(0, N, m):
            w = 1.0 + 0j
            half = m // 2
            for j in range(half):
                t = w * x[k + j + half]
                u = x[k + j]
                x[k + j] = u + t
                x[k + j + half] = u - t
                w = w * wm
        m <<= 1
    return x