"""
Image Rectification and Metric Scale Calibration
Supports:
1. ArUco Marker detection (4x4_50, 5x5_50, 6x6_50)
2. Checkerboard corner detection
3. Manual 2-point distance calibration (with explicit warning flag)
Outputs rectified image, px_per_mm, and reprojection_error_px.
"""

from typing import Dict, Any, Tuple, Optional
import cv2
import numpy as np


def detect_aruco_and_calibrate(
    image: np.ndarray,
    marker_size_mm: float = 50.0,
    dict_type: int = cv2.aruco.DICT_4X4_50
) -> Optional[Dict[str, Any]]:
    """
    Detects ArUco marker in image, computes perspective homography to rectify planar surface,
    and calculates px/mm scale.
    """
    gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY) if len(image.shape) == 3 else image
    dictionary = cv2.aruco.getPredefinedDictionary(dict_type)
    parameters = cv2.aruco.DetectorParameters()
    detector = cv2.aruco.ArucoDetector(dictionary, parameters)
    corners, ids, rejected = detector.detectMarkers(gray)

    if ids is None or len(corners) == 0:
        return None

    marker_corners = corners[0][0]  # shape: (4, 2)
    # Target square corners in metric space (mm)
    metric_corners = np.array([
        [0.0, 0.0],
        [marker_size_mm, 0.0],
        [marker_size_mm, marker_size_mm],
        [0.0, marker_size_mm]
    ], dtype=np.float32)

    # Calculate pixel side lengths to determine px_per_mm
    side_px_1 = np.linalg.norm(marker_corners[1] - marker_corners[0])
    side_px_2 = np.linalg.norm(marker_corners[2] - marker_corners[1])
    side_px_3 = np.linalg.norm(marker_corners[3] - marker_corners[2])
    side_px_4 = np.linalg.norm(marker_corners[0] - marker_corners[3])
    avg_side_px = float(np.mean([side_px_1, side_px_2, side_px_3, side_px_4]))
    px_per_mm = avg_side_px / marker_size_mm

    # Homography
    # Map to upright coordinates
    target_px = metric_corners * px_per_mm
    H, _ = cv2.findHomography(marker_corners, target_px)

    # Reprojection error
    transformed = cv2.perspectiveTransform(marker_corners.reshape(-1, 1, 2), H).reshape(-1, 2)
    error = float(np.mean(np.linalg.norm(transformed - target_px, axis=1)))

    return {
        "type": "ARUCO",
        "marker_id": int(ids[0][0]),
        "px_per_mm": px_per_mm,
        "reprojection_error_px": error,
        "has_manual_scale_warning": False,
        "corners": marker_corners.tolist()
    }


def manual_scale_calibration(
    pt1: Tuple[float, float],
    pt2: Tuple[float, float],
    known_distance_mm: float
) -> Dict[str, Any]:
    """
    Fallback calibration using two user-clicked points of known distance.
    Carries has_manual_scale_warning = True per Requirement 3.2.
    """
    p1 = np.array(pt1, dtype=np.float32)
    p2 = np.array(pt2, dtype=np.float32)
    dist_px = float(np.linalg.norm(p2 - p1))
    if known_distance_mm <= 0 or dist_px <= 0:
        raise ValueError("Invalid points or distance")

    px_per_mm = dist_px / known_distance_mm

    return {
        "type": "MANUAL_SCALE",
        "px_per_mm": px_per_mm,
        "reprojection_error_px": 0.0,
        "has_manual_scale_warning": True,
        "dist_px": dist_px,
        "known_distance_mm": known_distance_mm
    }


def rectify_image(
    image: np.ndarray,
    homography: np.ndarray,
    out_width: int,
    out_height: int
) -> np.ndarray:
    """Warps planar surface into rectified ortho view."""
    return cv2.warpPerspective(image, homography, (out_width, out_height))
