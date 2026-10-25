"""
Architectural Panel Grid Splitting & Module Tiling
Divides large architectural panels (up to 3000 x 2000 mm) into manageable modules
conforming to CNC envelope limits (default 300 x 180 mm).
Includes:
- Module matrix numbering (e.g., M-R1-C1)
- Interlocking alignment keys (mortise & tenon / registration notches)
- Joint gap allowance (1.5mm standard joint tolerance)
- Assembly layout metadata for assembly map PDF
"""

import math
from typing import Dict, Any, List, Tuple


def calculate_panel_split(
    panel_width_mm: float,
    panel_length_mm: float,
    max_module_width_mm: float = 280.0,  # 300mm envelope with 20mm margin
    max_module_length_mm: float = 160.0, # 180mm envelope with 20mm margin
    joint_gap_mm: float = 1.5
) -> Dict[str, Any]:
    """
    Computes grid layout, module dimensions, and alignment key positions.
    """
    cols = math.ceil(panel_width_mm / max_module_width_mm)
    rows = math.ceil(panel_length_mm / max_module_length_mm)

    nominal_mod_w = (panel_width_mm - (cols - 1) * joint_gap_mm) / cols
    nominal_mod_l = (panel_length_mm - (rows - 1) * joint_gap_mm) / rows

    modules: List[Dict[str, Any]] = []

    for r in range(rows):
        for c in range(cols):
            code = f"M-R{r+1}-C{c+1}"
            x_start = c * (nominal_mod_w + joint_gap_mm)
            y_start = r * (nominal_mod_l + joint_gap_mm)

            # Alignment keys on interior edges
            has_right_key = (c < cols - 1)
            has_bottom_key = (r < rows - 1)
            has_left_slot = (c > 0)
            has_top_slot = (r > 0)

            modules.append({
                "code": code,
                "row": r + 1,
                "col": c + 1,
                "bbox_mm": {
                    "x": round(x_start, 2),
                    "y": round(y_start, 2),
                    "width": round(nominal_mod_w, 2),
                    "length": round(nominal_mod_l, 2)
                },
                "alignment_features": {
                    "tenon_right": has_right_key,
                    "tenon_bottom": has_bottom_key,
                    "mortise_left": has_left_slot,
                    "mortise_top": has_top_slot,
                    "key_depth_mm": 5.0,
                    "key_width_mm": 15.0
                }
            })

    return {
        "panel_total_width_mm": panel_width_mm,
        "panel_total_length_mm": panel_length_mm,
        "total_modules": len(modules),
        "grid": {"rows": rows, "cols": cols},
        "joint_gap_mm": joint_gap_mm,
        "nominal_module_size_mm": {
            "width": round(nominal_mod_w, 2),
            "length": round(nominal_mod_l, 2)
        },
        "modules": modules
    }
