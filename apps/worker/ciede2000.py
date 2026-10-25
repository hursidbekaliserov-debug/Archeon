"""
CIEDE2000 Color-Difference Implementation
Reference:
Gaurav Sharma, Wencheng Wu, Edul N. Dalal
"The CIEDE2000 Color-Difference Formula: Implementation Notes, Supplementary Test Data,
and Mathematical Observations", Color Research & Application, Vol. 30, No. 1, Feb 2005.

Equation numbers cited in comments correspond directly to Sharma et al. (2005).
"""

import math
from typing import Tuple


def ciede2000(lab1: Tuple[float, float, float], lab2: Tuple[float, float, float], kl: float = 1.0, kc: float = 1.0, kh: float = 1.0) -> float:
    """
    Computes CIEDE2000 total color difference Delta E 00 between two CIELAB colors.
    lab1: (L1, a1, b1)
    lab2: (L2, a2, b2)
    kl, kc, kh: parametric weighting factors (default 1.0)
    """
    L1, a1, b1 = lab1
    L2, a2, b2 = lab2

    # Step 1: Calculate C_prime, a_prime, and h_prime
    # Eq. (2)
    C1 = math.sqrt(a1 ** 2 + b1 ** 2)
    C2 = math.sqrt(a2 ** 2 + b2 ** 2)
    C_bar = (C1 + C2) / 2.0

    # Eq. (3)
    C_bar_pow7 = C_bar ** 7
    G = 0.5 * (1.0 - math.sqrt(C_bar_pow7 / (C_bar_pow7 + 25.0 ** 7)))

    # Eq. (4)
    a1_prime = (1.0 + G) * a1
    a2_prime = (1.0 + G) * a2

    # Eq. (5)
    C1_prime = math.sqrt(a1_prime ** 2 + b1 ** 2)
    C2_prime = math.sqrt(a2_prime ** 2 + b2 ** 2)

    # Eq. (6)
    def compute_h_prime(a_prime: float, b: float) -> float:
        if a_prime == 0.0 and b == 0.0:
            return 0.0
        angle = math.degrees(math.atan2(b, a_prime))
        return angle % 360.0

    h1_prime = compute_h_prime(a1_prime, b1)
    h2_prime = compute_h_prime(a2_prime, b2)

    # Step 2: Calculate Delta L_prime, Delta C_prime, and Delta H_prime
    # Eq. (7)
    delta_L_prime = L2 - L1

    # Eq. (8)
    delta_C_prime = C2_prime - C1_prime

    # Eq. (9)
    if C1_prime * C2_prime == 0.0:
        delta_h_prime = 0.0
    elif abs(h2_prime - h1_prime) <= 180.0:
        delta_h_prime = h2_prime - h1_prime
    elif (h2_prime - h1_prime) > 180.0:
        delta_h_prime = (h2_prime - h1_prime) - 360.0
    else:
        delta_h_prime = (h2_prime - h1_prime) + 360.0

    # Eq. (10)
    delta_H_prime = 2.0 * math.sqrt(C1_prime * C2_prime) * math.sin(math.radians(delta_h_prime / 2.0))

    # Step 3: Calculate CIEDE2000 Color-Difference Delta E 00
    # Eq. (11)
    L_bar_prime = (L1 + L2) / 2.0

    # Eq. (12)
    C_bar_prime = (C1_prime + C2_prime) / 2.0

    # Eq. (13)
    if C1_prime * C2_prime == 0.0:
        h_bar_prime = h1_prime + h2_prime
    elif abs(h1_prime - h2_prime) <= 180.0:
        h_bar_prime = (h1_prime + h2_prime) / 2.0
    elif (h1_prime + h2_prime) < 360.0:
        h_bar_prime = (h1_prime + h2_prime + 360.0) / 2.0
    else:
        h_bar_prime = (h1_prime + h2_prime - 360.0) / 2.0

    # Eq. (14)
    T = (1.0
         - 0.17 * math.cos(math.radians(h_bar_prime - 30.0))
         + 0.24 * math.cos(math.radians(2.0 * h_bar_prime))
         + 0.32 * math.cos(math.radians(3.0 * h_bar_prime + 6.0))
         - 0.20 * math.cos(math.radians(4.0 * h_bar_prime - 63.0)))

    # Eq. (15)
    delta_theta = 30.0 * math.exp(-(((h_bar_prime - 275.0) / 25.0) ** 2))

    # Eq. (16)
    C_bar_prime_pow7 = C_bar_prime ** 7
    R_C = 2.0 * math.sqrt(C_bar_prime_pow7 / (C_bar_prime_pow7 + 25.0 ** 7))

    # Eq. (17)
    S_L = 1.0 + (0.015 * ((L_bar_prime - 50.0) ** 2)) / math.sqrt(20.0 + ((L_bar_prime - 50.0) ** 2))

    # Eq. (18)
    S_C = 1.0 + 0.045 * C_bar_prime

    # Eq. (19)
    S_H = 1.0 + 0.015 * C_bar_prime * T

    # Eq. (20)
    R_T = -math.sin(math.radians(2.0 * delta_theta)) * R_C

    # Eq. (21)
    term_L = delta_L_prime / (kl * S_L)
    term_C = delta_C_prime / (kc * S_C)
    term_H = delta_H_prime / (kh * S_H)

    delta_E00 = math.sqrt(
        (term_L ** 2) +
        (term_C ** 2) +
        (term_H ** 2) +
        (R_T * term_C * term_H)
    )

    return float(delta_E00)
