"""
Damage Mask Proposal & Segmentation
Detects chips, cracks, and surface loss using edge discontinuity and intensity anomaly analysis.
Generates proposed damage mask for user confirmation in the reconstruction editor.
"""

from typing import Dict, Any, List
import cv2
import numpy as np


def propose_damage_mask(
    image: np.ndarray,
    min_area_px: int = 50,
    edge_anomaly_threshold: float = 35.0
) -> Dict[str, Any]:
    """
    Identifies high-frequency edge disruptions, color dropouts, and surface pits
    indicative of ceramic glaze loss (chips) or plaster fracturing (cracks).
    """
    gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY) if len(image.shape) == 3 else image
    h, w = gray.shape

    # 1. Bilateral filter to smooth texture while keeping strong structural edges
    smooth = cv2.bilateralFilter(gray, 9, 75, 75)

    # 2. Local contrast anomaly (Laplacian + morphological gradient)
    laplacian = cv2.Laplacian(smooth, cv2.CV_32F)
    laplacian_abs = np.uint8(np.absolute(laplacian))

    # 3. High gradient thresholding
    _, thresh = cv2.threshold(laplacian_abs, int(edge_anomaly_threshold), 255, cv2.THRESH_BINARY)

    # 4. Morphological closure to connect fragmented crack lines
    kernel = cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (5, 5))
    closed = cv2.morphologyEx(thresh, cv2.MORPH_CLOSE, kernel)

    # 5. Extract contours and filter by minimum area
    contours, _ = cv2.findContours(closed, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
    filtered_mask = np.zeros((h, w), dtype=np.uint8)
    proposals: List[Dict[str, Any]] = []

    for idx, c in enumerate(contours):
        area = cv2.contourArea(c)
        if area >= min_area_px:
            cv2.drawContours(filtered_mask, [c], -1, 255, thickness=cv2.FILLED)
            x, y, cw, ch = cv2.boundingRect(c)
            proposals.append({
                "region_id": idx,
                "bbox": {"x": int(x), "y": int(y), "w": int(cw), "h": int(ch)},
                "area_px": float(area),
                "suggested_type": "CRACK" if cw / max(ch, 1) > 2.5 or ch / max(cw, 1) > 2.5 else "CHIP"
            })

    return {
        "mask_uint8": filtered_mask,
        "proposals_count": len(proposals),
        "proposals": proposals
    }


def segment_tile_boundaries(image: np.ndarray) -> np.ndarray:
    """
    Detects outer perimeter and grout lines to define tile/panel clipping boundary.
    """
    gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY) if len(image.shape) == 3 else image
    edges = cv2.Canny(gray, 50, 150)
    kernel = cv2.getStructuringElement(cv2.MORPH_RECT, (7, 7))
    dilated = cv2.dilate(edges, kernel)
    contours, _ = cv2.findContours(dilated, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)

    mask = np.zeros_like(gray)
    if contours:
        # Largest external contour is the tile body
        largest = max(contours, key=cv2.contourArea)
        cv2.drawContours(mask, [largest], -1, 255, thickness=cv2.FILLED)
    else:
        mask[:] = 255

    return mask
