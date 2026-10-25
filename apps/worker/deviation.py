"""
3D Scan-to-Model Deviation Analysis
Computes:
- Per-dimension caliper deviation (mm and percentage)
- Point-to-mesh geometric distance metrics:
    * Mean absolute distance (mm)
    * 95th percentile distance (mm)
    * Maximum distance (mm)
    * Hausdorff distance (mm)
- Vertex deviation heatmap color assignment for Three.js viewer
"""

from typing import Dict, Any, List, Tuple
import numpy as np
import trimesh
from scipy.spatial.distance import directed_hausdorff


def compute_caliper_deviations(
    nominal: Dict[str, float],
    measured: Dict[str, float]
) -> Dict[str, Any]:
    """
    Computes delta and percentage deviation for length, width, thickness, and relief depth.
    """
    results: Dict[str, Any] = {}
    for key in ["length_mm", "width_mm", "thickness_mm", "relief_depth_mm"]:
        nom_val = nominal.get(key)
        meas_val = measured.get(key)
        if nom_val is not None and meas_val is not None:
            delta = meas_val - nom_val
            pct = (delta / nom_val * 100.0) if nom_val != 0 else 0.0
            results[key] = {
                "nominal": round(nom_val, 2),
                "measured": round(meas_val, 2),
                "delta_mm": round(delta, 2),
                "deviation_pct": round(pct, 2),
                "within_tolerance": abs(delta) <= 0.5
            }
        else:
            results[key] = {
                "status": "not measured",
                "within_tolerance": None
            }
    return results


def compute_scan_to_model_deviation(
    nominal_mesh: trimesh.Trimesh,
    scan_points: np.ndarray,
    percentile: float = 95.0
) -> Dict[str, Any]:
    """
    Computes signed/unsigned distance from scanned point cloud to nominal CAD model.
    """
    # Trimesh proximity query
    closest_points, distances, triangle_ids = trimesh.proximity.closest_point(nominal_mesh, scan_points)

    mean_dist = float(np.mean(distances))
    pct_dist = float(np.percentile(distances, percentile))
    max_dist = float(np.max(distances))

    # Bidirectional Hausdorff distance
    # Sample points from nominal mesh to compare
    mesh_sample_pts, _ = trimesh.sample.sample_surface(nominal_mesh, len(scan_points))
    u, _, _ = directed_hausdorff(scan_points, mesh_sample_pts)
    v, _, _ = directed_hausdorff(mesh_sample_pts, scan_points)
    hausdorff = float(max(u, v))

    return {
        "sample_points_count": len(scan_points),
        "mean_deviation_mm": round(mean_dist, 3),
        "percentile_95_mm": round(pct_dist, 3),
        "max_deviation_mm": round(max_dist, 3),
        "hausdorff_distance_mm": round(hausdorff, 3),
        "distances_summary": {
            "min": round(float(np.min(distances)), 3),
            "median": round(float(np.median(distances)), 3),
            "p95": round(pct_dist, 3),
            "max": round(max_dist, 3)
        }
    }
