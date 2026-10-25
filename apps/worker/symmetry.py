"""
Symmetry and Periodicity Analysis for Traditional Uzbek Ornaments
Detects:
1. Translational repeat period (via 2D FFT / Autocorrelation)
2. Rotational symmetry (C2, C4, C6, C8) via angular cross-correlation
3. Mirror reflection symmetries
Returns symmetry group name, confidence score, and repeat period (px and mm).
"""

from typing import Dict, Any, List
import numpy as np
import cv2


def detect_translational_period(gray_img: np.ndarray, px_per_mm: float = 1.0) -> Dict[str, Any]:
    """
    Computes 2D autocorrelation using FFT to discover the fundamental repeat period (Tx, Ty).
    """
    img = gray_img.astype(np.float32)
    img = img - np.mean(img)
    h, w = img.shape

    # 2D FFT and power spectrum
    f = np.fft.fft2(img)
    power_spectrum = np.abs(f) ** 2
    autocorr = np.fft.ifft2(power_spectrum).real
    autocorr = np.fft.fftshift(autocorr)

    cy, cx = h // 2, w // 2
    # Normalize autocorrelation peak to 1.0
    norm_autocorr = autocorr / (autocorr[cy, cx] + 1e-7)

    # Exclude central peak by masking
    mask_radius = max(5, int(min(h, w) * 0.05))
    y_grid, x_grid = np.ogrid[:h, :w]
    dist_from_center = np.sqrt((x_grid - cx) ** 2 + (y_grid - cy) ** 2)
    masked_autocorr = norm_autocorr.copy()
    masked_autocorr[dist_from_center < mask_radius] = 0

    # Find prominent secondary peaks along axes
    # Horizontal slice through center
    slice_x = masked_autocorr[cy, cx:]
    slice_y = masked_autocorr[cy:, cx]

    peak_x = int(np.argmax(slice_x)) if len(slice_x) > 0 else 0
    peak_y = int(np.argmax(slice_y)) if len(slice_y) > 0 else 0

    confidence_x = float(slice_x[peak_x]) if len(slice_x) > 0 and peak_x < len(slice_x) else 0.0
    confidence_y = float(slice_y[peak_y]) if len(slice_y) > 0 and peak_y < len(slice_y) else 0.0

    period_x_px = max(peak_x, 1)
    period_y_px = max(peak_y, 1)

    return {
        "period_x_px": period_x_px,
        "period_y_px": period_y_px,
        "period_x_mm": round(period_x_px / px_per_mm, 2) if px_per_mm > 0 else 0.0,
        "period_y_mm": round(period_y_px / px_per_mm, 2) if px_per_mm > 0 else 0.0,
        "confidence": round(float((confidence_x + confidence_y) / 2.0), 3),
        "is_periodic": bool(confidence_x > 0.35 or confidence_y > 0.35)
    }


def detect_rotational_symmetry(gray_img: np.ndarray) -> Dict[str, Any]:
    """
    Tests rotational symmetries C2 (180 deg), C4 (90 deg), C6 (60 deg), C8 (45 deg)
    using normalized 2D cross-correlation against rotated versions.
    """
    # Crop to central square
    h, w = gray_img.shape
    size = min(h, w)
    start_y = (h - size) // 2
    start_x = (w - size) // 2
    square = gray_img[start_y:start_y + size, start_x:start_x + size].astype(np.float32)

    # Circular mask to eliminate square corner bias
    cy, cx = size // 2, size // 2
    y_grid, x_grid = np.ogrid[:size, :size]
    radius = size // 2 - 2
    circle_mask = ((x_grid - cx) ** 2 + (y_grid - cy) ** 2) <= (radius ** 2)
    masked_orig = square * circle_mask
    norm_orig = np.linalg.norm(masked_orig)

    if norm_orig == 0:
        return {"detected_group": "NONE", "confidence": 0.0, "scores": {}}

    candidates = [
        ("C2", [180.0]),
        ("C4", [90.0, 180.0, 270.0]),
        ("C6", [60.0, 120.0, 180.0, 240.0, 300.0]),
        ("C8", [45.0, 90.0, 135.0, 180.0, 225.0, 270.0, 315.0])
    ]

    scores: Dict[str, float] = {}

    for name, angles in candidates:
        corrs = []
        for ang in angles:
            M = cv2.getRotationMatrix2D((cx, cy), ang, 1.0)
            rotated = cv2.warpAffine(square, M, (size, size))
            masked_rot = rotated * circle_mask
            norm_rot = np.linalg.norm(masked_rot)
            if norm_rot > 0:
                corr = np.sum(masked_orig * masked_rot) / (norm_orig * norm_rot)
                corrs.append(float(corr))
            else:
                corrs.append(0.0)
        scores[name] = round(float(np.mean(corrs)), 3)

    # Mirror symmetry (D-groups)
    flipped_horiz = cv2.flip(square, 1) * circle_mask
    norm_flip = np.linalg.norm(flipped_horiz)
    mirror_corr = float(np.sum(masked_orig * flipped_horiz) / (norm_orig * norm_flip)) if norm_flip > 0 else 0.0
    scores["MIRROR"] = round(mirror_corr, 3)

    # Determine highest matching symmetry group
    best_group = "NONE"
    best_score = 0.0
    for grp in ["C8", "C6", "C4", "C2"]:
        if scores.get(grp, 0.0) > 0.75:
            best_group = grp
            best_score = scores[grp]
            break

    if best_group == "NONE" and mirror_corr > 0.8:
        best_group = "MIRROR"
        best_score = mirror_corr

    return {
        "detected_group": best_group,
        "confidence": best_score,
        "scores": scores
    }
