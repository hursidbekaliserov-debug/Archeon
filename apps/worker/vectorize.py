"""
Vectorization & CAD Export (SVG and DXF R2010)
Converts segmented ornament boundaries and toolpath contours into:
1. Scaled SVG with metric millimeter units
2. Standard DXF R2010 via ezdxf library
"""

from typing import List, Tuple, Dict, Any
import ezdxf
import numpy as np
import cv2


def contours_to_svg_paths(contours: List[np.ndarray], px_per_mm: float) -> str:
    """
    Converts list of OpenCV contours into SVG path data with coordinates in millimeters.
    """
    scale = 1.0 / px_per_mm if px_per_mm > 0 else 1.0
    path_strings = []

    for c in contours:
        if len(c) < 3:
            continue
        pts = c.reshape(-1, 2)
        start_x = pts[0][0] * scale
        start_y = pts[0][1] * scale
        d = [f"M {start_x:.3f} {start_y:.3f}"]
        for pt in pts[1:]:
            x = pt[0] * scale
            y = pt[1] * scale
            d.append(f"L {x:.3f} {y:.3f}")
        d.append("Z")
        path_strings.append(" ".join(d))

    return " ".join(path_strings)


def export_svg(
    contours: List[np.ndarray],
    width_mm: float,
    height_mm: float,
    px_per_mm: float,
    title: str = "NaqshLab Reconstruction Vector"
) -> str:
    """
    Generates well-formed SVG string with viewBox and dimensions in millimeters.
    """
    path_data = contours_to_svg_paths(contours, px_per_mm)
    svg = f"""<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg"
     width="{width_mm:.2f}mm" height="{height_mm:.2f}mm"
     viewBox="0 0 {width_mm:.2f} {height_mm:.2f}">
  <title>{title}</title>
  <!-- NUSXA — ASL EMAS | REPLICA — NOT AN ORIGINAL -->
  <g fill="none" stroke="#1D4E9A" stroke-width="0.3">
    <path d="{path_data}" />
  </g>
</svg>
"""
    return svg


def export_dxf_r2010(
    contours: List[np.ndarray],
    output_filepath: str,
    px_per_mm: float
) -> str:
    """
    Creates an AutoCAD DXF R2010 file with metric (mm) polyline contours.
    """
    scale = 1.0 / px_per_mm if px_per_mm > 0 else 1.0
    doc = ezdxf.new(dxfversion="R2010")
    msp = doc.modelspace()

    # Set metric units (4 = Millimeters)
    doc.header["$INSUNITS"] = 4

    # Create dedicated layers
    doc.layers.add(name="ORNAME_OUTLINE", color=5)  # Blue
    doc.layers.add(name="REPLICA_WATERMARK", color=1)

    for c in contours:
        if len(c) < 3:
            continue
        pts = c.reshape(-1, 2)
        metric_pts = [(float(p[0] * scale), float(p[1] * scale), 0.0) for p in pts]
        # Close polyline
        metric_pts.append(metric_pts[0])
        msp.add_lwpolyline(
            [(p[0], p[1]) for p in metric_pts],
            dxfattribs={"layer": "ORNAME_OUTLINE", "closed": True}
        )

    doc.saveas(output_filepath)
    return output_filepath
