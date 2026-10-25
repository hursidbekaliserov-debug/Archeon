"""
16-bit Depth Heightmap Generation
Produces single-channel 16-bit PNGs where grayscale intensity represents relief displacement.
0 = baseplate surface, 65535 = maximum relief depth in millimeters.
"""

from typing import Tuple
import cv2
import numpy as np


def generate_16bit_heightmap(
    gray_image: np.ndarray,
    relief_depth_mm: float = 6.0,
    base_plate_thickness_mm: float = 8.0,
    smooth_sigma: float = 1.0
) -> Tuple[np.ndarray, dict]:
    """
    Transforms ornament intensity profile into a 16-bit metric heightmap.
    """
    img = gray_image.astype(np.float32)

    # Normalize to [0.0, 1.0]
    min_val, max_val = img.min(), img.max()
    if max_val > min_val:
        normalized = (img - min_val) / (max_val - min_val)
    else:
        normalized = np.zeros_like(img)

    # Slight Gaussian smoothing to eliminate micro-chatter
    if smooth_sigma > 0:
        normalized = cv2.GaussianBlur(normalized, (0, 0), smooth_sigma)

    # Scale to 16-bit integer range [0, 65535]
    heightmap_u16 = (normalized * 65535.0).astype(np.uint16)

    metadata = {
        "depth_range_mm": relief_depth_mm,
        "base_plate_thickness_mm": base_plate_thickness_mm,
        "total_height_mm": base_plate_thickness_mm + relief_depth_mm,
        "mm_per_unit": relief_depth_mm / 65535.0,
        "dtype": "uint16"
    }

    return heightmap_u16, metadata


def save_heightmap_png(heightmap_u16: np.ndarray, filepath: str) -> str:
    """Saves 16-bit uncompressed PNG heightmap."""
    cv2.imwrite(filepath, heightmap_u16)
    return filepath
