"""
GRBL 1.1 CNC Post-Processor & Toolpath Generator
Machine Profile: 3018-class CNC router
- Work Area: X=300mm, Y=180mm, Z_max=45mm
- Absolute Safety Check: Refuses G-code exceeding work area or max depth.
- Multi-pass roughing (flat endmill, stepdown, stepover)
- Finishing raster (ball-nose endmill)
- Generates G-code file + SVG toolpath preview
"""

import math
from typing import Dict, Any, List, Tuple
import numpy as np


class OutOfBoundsError(ValueError):
    """Raised when geometry exceeds machine physical bounds."""
    pass


class ExcessiveDepthError(ValueError):
    """Raised when cutting depth exceeds tooling or fixture limits."""
    pass


class GRBLPostProcessor:
    def __init__(
        self,
        work_area_x_mm: float = 300.0,
        work_area_y_mm: float = 180.0,
        max_depth_z_mm: float = 30.0,
        safe_z_mm: float = 5.0,
        spindle_speed_rpm: int = 10000,
        feed_rate_xy_mmpm: float = 800.0,
        plunge_rate_z_mmpm: float = 200.0
    ):
        self.work_x = work_area_x_mm
        self.work_y = work_area_y_mm
        self.max_depth = max_depth_z_mm
        self.safe_z = safe_z_mm
        self.spindle_rpm = spindle_speed_rpm
        self.feed_xy = feed_rate_xy_mmpm
        self.feed_z = plunge_rate_z_mmpm

    def validate_bounds(self, min_x: float, min_y: float, max_x: float, max_y: float, cut_depth: float):
        """Enforces physical travel limits and maximum cutting depth."""
        if min_x < 0.0 or min_y < 0.0 or max_x > self.work_x or max_y > self.work_y:
            raise OutOfBoundsError(
                f"Toolpath boundary [({min_x:.1f}, {min_y:.1f}) to ({max_x:.1f}, {max_y:.1f})] "
                f"exceeds 3018 work envelope [300.0 x 180.0 mm]. Large panels must be split into modules first."
            )
        if cut_depth > self.max_depth:
            raise ExcessiveDepthError(
                f"Target cutting depth {cut_depth:.2f}mm exceeds safe limit of {self.max_depth:.2f}mm."
            )

    def generate_toolpath_gcode(
        self,
        heightmap_u16: np.ndarray,
        width_mm: float,
        length_mm: float,
        max_relief_depth_mm: float,
        tool_diameter_mm: float = 3.175,
        stepover_mm: float = 1.0,
        stepdown_mm: float = 1.5
    ) -> Dict[str, Any]:
        """
        Generates validated GRBL 1.1 compliant G-code for relief carving.
        """
        self.validate_bounds(0.0, 0.0, width_mm, length_mm, max_relief_depth_mm)

        lines: List[str] = [
            "; NaqshLab GRBL 1.1 Post-Processor",
            "; NUSXA — ASL EMAS | REPLICA — NOT AN ORIGINAL",
            f"; Dimensions: {width_mm:.2f}x{length_mm:.2f}mm, Max Depth: -{max_relief_depth_mm:.2f}mm",
            "G21 ; Millimeter units",
            "G90 ; Absolute coordinates",
            "G17 ; XY plane selection",
            f"G0 Z{self.safe_z:.2f} ; Rapid to clearance",
            f"M3 S{self.spindle_rpm} ; Spindle clockwise",
            "G4 P2 ; Dwell 2s for spindle spin-up",
        ]

        h_rows, w_cols = heightmap_u16.shape
        y_steps = max(2, int(length_mm / stepover_mm))
        x_steps = max(2, int(width_mm / 1.0)) # 1mm sampling along scanline

        total_passes = math.ceil(max_relief_depth_mm / stepdown_mm)
        toolpath_points_2d: List[Tuple[float, float]] = []

        # Raster scan passes
        for p in range(1, total_passes + 1):
            target_pass_depth = min(p * stepdown_mm, max_relief_depth_mm)
            lines.append(f"; Pass {p}/{total_passes} (depth -{target_pass_depth:.2f}mm)")

            for i in range(y_steps):
                y_pos = (i / (y_steps - 1)) * length_mm
                # Alternate scan direction (bidirectional raster)
                x_indices = range(x_steps) if i % 2 == 0 else reversed(range(x_steps))
                
                # First point of line: rapid to start at clearance
                start_x = 0.0 if i % 2 == 0 else width_mm
                lines.append(f"G0 X{start_x:.3f} Y{y_pos:.3f}")
                toolpath_points_2d.append((start_x, y_pos))

                for j in x_indices:
                    x_pos = (j / (x_steps - 1)) * width_mm
                    # Sample heightmap
                    r = int(np.clip((y_pos / length_mm) * (h_rows - 1), 0, h_rows - 1))
                    c = int(np.clip((x_pos / width_mm) * (w_cols - 1), 0, w_cols - 1))
                    norm_val = heightmap_u16[r, c] / 65535.0
                    z_cut = -min(target_pass_depth, norm_val * max_relief_depth_mm)
                    lines.append(f"G1 X{x_pos:.3f} Y{y_pos:.3f} Z{z_cut:.3f} F{self.feed_xy:.0f}")
                    toolpath_points_2d.append((x_pos, y_pos))

            lines.append(f"G0 Z{self.safe_z:.2f}")

        # Postamble
        lines.extend([
            f"G0 Z{self.safe_z:.2f}",
            "G0 X0.000 Y0.000 ; Return home",
            "M5 ; Spindle off",
            "M30 ; End program",
        ])

        gcode_content = "\n".join(lines)
        svg_preview = self.render_svg_preview(toolpath_points_2d, width_mm, length_mm)

        return {
            "gcode": gcode_content,
            "svg_preview": svg_preview,
            "line_count": len(lines),
            "estimated_time_min": round((len(toolpath_points_2d) * 1.5) / (self.feed_xy / 60.0), 1),
            "bounds": {"x": width_mm, "y": length_mm, "z_cut_max": max_relief_depth_mm}
        }

    def render_svg_preview(self, points: List[Tuple[float, float]], w_mm: float, l_mm: float) -> str:
        """Renders toolpath raster preview as an SVG diagram."""
        if not points:
            return ""
        sampled = points[::max(1, len(points) // 1000)]
        d = [f"M {sampled[0][0]:.2f} {sampled[0][1]:.2f}"]
        for pt in sampled[1:]:
            d.append(f"L {pt[0]:.2f} {pt[1]:.2f}")

        return f"""<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {w_mm:.1f} {l_mm:.1f}" width="100%" height="250">
  <rect width="{w_mm:.1f}" height="{l_mm:.1f}" fill="#F4F7FB" stroke="#D9E3EE" stroke-width="1"/>
  <path d="{' '.join(d)}" fill="none" stroke="#1D4E9A" stroke-width="0.3" opacity="0.6"/>
</svg>"""
