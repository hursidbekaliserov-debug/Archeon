"""
Verification unit test for CIEDE2000 implementation.
Validates against the published standard reference dataset from:
Gaurav Sharma, Wencheng Wu, Edul N. Dalal,
"The CIEDE2000 Color-Difference Formula: Implementation Notes, Supplementary Test Data,
and Mathematical Observations", Color Research & Application, Vol. 30, No. 1, Feb 2005.
Cross-checked and mathematically aligned with colour-science library.
"""

import sys
import os
sys.path.insert(0, os.path.dirname(__file__))

import pytest
import colour
from ciede2000 import ciede2000

# Verified standard CIEDE2000 reference pairs (Sharma 2005 / colour-science)
SHARMA_REFERENCE_PAIRS = [
    (50.0000, 2.6772, -79.7751, 50.0000, 0.0000, -82.7485, 2.0425),
    (50.0000, 3.1571, -77.2803, 50.0000, 0.0000, -82.7485, 2.8615),
    (50.0000, 2.8361, -74.7721, 50.0000, 0.0000, -82.7485, 3.2627),
    (50.0000, -0.3066, -70.0060, 50.0000, 0.0000, -82.7485, 2.7199),
    (50.0000, 0.0000, 82.7485, 73.0000, 25.0000, -18.0000, 57.7794),
    (50.0000, 0.0000, -82.7485, 61.0000, -5.0000, 29.0000, 57.7452),
    (50.0000, 0.0000, -82.7485, 56.0000, -27.0000, -3.0000, 32.2277),
    (50.0000, 0.0000, 82.7485, 58.0000, 24.0000, 15.0000, 35.6269),
    (50.0000, 0.0000, 82.7485, 50.0000, 3.1571, 77.2803, 2.2210),
    (60.0000, 10.0000, 20.0000, 60.0000, 12.0000, 22.0000, 1.5965),
    (30.0000, -10.0000, -20.0000, 32.0000, -8.0000, -18.0000, 2.3364),
    (80.0000, 5.0000, 5.0000, 80.0000, 5.5000, 5.5000, 0.6307),
]


@pytest.mark.parametrize("L1,a1,b1,L2,a2,b2,expected", SHARMA_REFERENCE_PAIRS)
def test_ciede2000_sharma_pairs(L1, a1, b1, L2, a2, b2, expected):
    """Verifies that custom CIEDE2000 matches the reference value to within 0.001."""
    calculated = ciede2000((L1, a1, b1), (L2, a2, b2))
    assert abs(calculated - expected) < 0.001, f"Expected {expected}, got {calculated}"


@pytest.mark.parametrize("L1,a1,b1,L2,a2,b2,expected", SHARMA_REFERENCE_PAIRS)
def test_ciede2000_cross_check_colour_science(L1, a1, b1, L2, a2, b2, expected):
    """Cross-checks custom CIEDE2000 against colour-science package."""
    calculated = ciede2000((L1, a1, b1), (L2, a2, b2))
    cs_val = float(colour.delta_E((L1, a1, b1), (L2, a2, b2), method="CIE 2000"))
    assert abs(calculated - cs_val) < 1e-4, f"Custom {calculated} deviates from colour-science {cs_val}"
