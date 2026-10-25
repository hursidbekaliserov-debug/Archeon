"use client";

import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { Layers, Activity, Ruler, RotateCcw } from "lucide-react";

interface Tile3DViewerProps {
  widthMm?: number;
  lengthMm?: number;
  thicknessMm?: number;
  reliefDepthMm?: number;
  autoRotate?: boolean;
  showControls?: boolean;
  showHeatmap?: boolean;
  className?: string;
  svgPath?: string;
  motifName?: string;
  family?: string;
}

/**
 * Creates authentic Uzbek glazed ceramic tile (Kashi / Mayolika) textures
 * with real cobalt, turquoise, and gold geometric Girih patterns + bump relief.
 */
function createUzbekKashiTextures(svgPath?: string, family?: string) {
  const size = 1024;

  // 1. Color / Diffuse Canvas
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d")!;

  // 2. Bump / Heightmap Canvas
  const bCanvas = document.createElement("canvas");
  bCanvas.width = size;
  bCanvas.height = size;
  const bCtx = bCanvas.getContext("2d")!;

  // Background: Deep Cobalt Blue with radial glaze gradient
  const grad = ctx.createRadialGradient(size / 2, size / 2, 50, size / 2, size / 2, size * 0.7);
  grad.addColorStop(0, "#1A4996");
  grad.addColorStop(0.5, "#103673");
  grad.addColorStop(1, "#0A2452");
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, size, size);

  // Bump background: dark neutral
  bCtx.fillStyle = "#111111";
  bCtx.fillRect(0, 0, size, size);

  const cx = size / 2;
  const cy = size / 2;

  // --- Outer Border ---
  const borderW = 54;
  ctx.strokeStyle = "#D4AF37"; // Gold border
  ctx.lineWidth = 10;
  ctx.strokeRect(borderW / 2, borderW / 2, size - borderW, size - borderW);

  bCtx.strokeStyle = "#EEEEEE";
  bCtx.lineWidth = 10;
  bCtx.strokeRect(borderW / 2, borderW / 2, size - borderW, size - borderW);

  // Inner turquoise border stripe
  ctx.strokeStyle = "#00A896";
  ctx.lineWidth = 14;
  ctx.strokeRect(borderW + 8, borderW + 8, size - (borderW + 8) * 2, size - (borderW + 8) * 2);

  bCtx.strokeStyle = "#888888";
  bCtx.lineWidth = 14;
  bCtx.strokeRect(borderW + 8, borderW + 8, size - (borderW + 8) * 2, size - (borderW + 8) * 2);

  // --- Four Corner Quarter Stars (Traditional Tessellation) ---
  const corners = [
    [0, 0],
    [size, 0],
    [size, size],
    [0, size],
  ];

  corners.forEach(([cornerX, cornerY]) => {
    // Corner star radiating lines
    for (let r = 0; r < 4; r++) {
      ctx.beginPath();
      ctx.arc(cornerX, cornerY, 140 + r * 30, 0, Math.PI * 2);
      ctx.strokeStyle = r % 2 === 0 ? "#D4AF37" : "#02C39A";
      ctx.lineWidth = 4;
      ctx.stroke();

      bCtx.beginPath();
      bCtx.arc(cornerX, cornerY, 140 + r * 30, 0, Math.PI * 2);
      bCtx.strokeStyle = "#AAAAAA";
      bCtx.lineWidth = 4;
      bCtx.stroke();
    }
  });

  if (svgPath) {
    const img = new Image();
    const svgStr = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 150 150" width="1024" height="1024">
      <g stroke="#F6C85F" stroke-width="3.5" fill="rgba(0, 229, 255, 0.22)">
        ${svgPath}
      </g>
    </svg>`;
    const blob = new Blob([svgStr], { type: "image/svg+xml;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    img.onload = () => {
      const pad = 120;
      ctx.drawImage(img, pad, pad, size - pad * 2, size - pad * 2);
      bCtx.drawImage(img, pad, pad, size - pad * 2, size - pad * 2);
      glazeTexture.needsUpdate = true;
      bumpTexture.needsUpdate = true;
      URL.revokeObjectURL(url);
    };
    img.src = url;
  } else {
    // --- Center: 8-Pointed Girih Star Geometry ---
    const outerR = 300;
    const innerR = 150;
    const points: [number, number][] = [];

    for (let i = 0; i < 16; i++) {
      const angle = (i * Math.PI) / 8 - Math.PI / 2;
      const r = i % 2 === 0 ? outerR : innerR;
      points.push([cx + r * Math.cos(angle), cy + r * Math.sin(angle)]);
    }

    // Draw 8-pointed star fill
    ctx.beginPath();
    ctx.moveTo(points[0][0], points[0][1]);
    for (let i = 1; i < points.length; i++) {
      ctx.lineTo(points[i][0], points[i][1]);
    }
    ctx.closePath();

    // Vibrant Turquoise / Ishkor Glaze fill for the star
    const starGrad = ctx.createRadialGradient(cx, cy, 30, cx, cy, outerR);
    starGrad.addColorStop(0, "#00E5FF");
    starGrad.addColorStop(0.4, "#00ACC1");
    starGrad.addColorStop(0.8, "#00838F");
    starGrad.addColorStop(1, "#006064");
    ctx.fillStyle = starGrad;
    ctx.fill();

    // Gold raised relief outline for the star
    ctx.strokeStyle = "#F6C85F";
    ctx.lineWidth = 8;
    ctx.stroke();

    // Bump map for the star
    bCtx.beginPath();
    bCtx.moveTo(points[0][0], points[0][1]);
    for (let i = 1; i < points.length; i++) {
      bCtx.lineTo(points[i][0], points[i][1]);
    }
    bCtx.closePath();
    bCtx.fillStyle = "#666666";
    bCtx.fill();
    bCtx.strokeStyle = "#FFFFFF";
    bCtx.lineWidth = 12;
    bCtx.stroke();

    // --- Central 8-Petal Rosette (Floral Medallion) ---
    const petals = 8;
    const rosetteR = 95;
    for (let p = 0; p < petals; p++) {
      const pAngle = (p * 2 * Math.PI) / petals;
      const petX = cx + Math.cos(pAngle) * 45;
      const petY = cy + Math.sin(pAngle) * 45;

      ctx.save();
      ctx.translate(petX, petY);
      ctx.rotate(pAngle);
      ctx.beginPath();
      ctx.ellipse(0, 0, 24, 45, 0, 0, Math.PI * 2);
      ctx.fillStyle = "#FFF9C4"; // Cream ivory porcelain
      ctx.fill();
      ctx.strokeStyle = "#D4AF37";
      ctx.lineWidth = 3;
      ctx.stroke();
      ctx.restore();

      bCtx.save();
      bCtx.translate(petX, petY);
      bCtx.rotate(pAngle);
      bCtx.beginPath();
      bCtx.ellipse(0, 0, 24, 45, 0, 0, Math.PI * 2);
      bCtx.fillStyle = "#CCCCCC";
      bCtx.fill();
      bCtx.strokeStyle = "#FFFFFF";
      bCtx.lineWidth = 4;
      bCtx.stroke();
      bCtx.restore();
    }

    // Central Gold Boss (Dome / Button)
    ctx.beginPath();
    ctx.arc(cx, cy, 32, 0, Math.PI * 2);
    const bossGrad = ctx.createRadialGradient(cx - 8, cy - 8, 4, cx, cy, 32);
    bossGrad.addColorStop(0, "#FFE082");
    bossGrad.addColorStop(0.7, "#FFA000");
    bossGrad.addColorStop(1, "#E65100");
    ctx.fillStyle = bossGrad;
    ctx.fill();
    ctx.strokeStyle = "#FFE082";
    ctx.lineWidth = 4;
    ctx.stroke();

    bCtx.beginPath();
    bCtx.arc(cx, cy, 32, 0, Math.PI * 2);
    bCtx.fillStyle = "#EEEEEE";
    bCtx.fill();
    bCtx.strokeStyle = "#FFFFFF";
    bCtx.lineWidth = 6;
    bCtx.stroke();

    // Eight Interlaced Arabesque Vines (Islimi scrolls)
    for (let s = 0; s < 8; s++) {
      const sAngle = (s * Math.PI) / 4;
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(sAngle);

      // Decorative palmette curl
      ctx.beginPath();
      ctx.moveTo(160, 0);
      ctx.bezierCurveTo(200, 30, 240, 20, 260, 0);
      ctx.bezierCurveTo(240, -20, 200, -30, 160, 0);
      ctx.fillStyle = "rgba(255, 255, 255, 0.85)";
      ctx.fill();
      ctx.strokeStyle = "#D4AF37";
      ctx.lineWidth = 3;
      ctx.stroke();

      bCtx.save();
      bCtx.translate(cx, cy);
      bCtx.rotate(sAngle);
      bCtx.beginPath();
      bCtx.moveTo(160, 0);
      bCtx.bezierCurveTo(200, 30, 240, 20, 260, 0);
      bCtx.bezierCurveTo(240, -20, 200, -30, 160, 0);
      bCtx.fillStyle = "#BBBBBB";
      bCtx.fill();
      bCtx.strokeStyle = "#FFFFFF";
      bCtx.lineWidth = 4;
      bCtx.stroke();
      bCtx.restore();

      ctx.restore();
    }
  }

  // Fine Crazing / Glaze Highlight Sheen
  const glazeTexture = new THREE.CanvasTexture(canvas);
  glazeTexture.wrapS = THREE.ClampToEdgeWrapping;
  glazeTexture.wrapT = THREE.ClampToEdgeWrapping;
  glazeTexture.generateMipmaps = true;

  const bumpTexture = new THREE.CanvasTexture(bCanvas);
  bumpTexture.wrapS = THREE.ClampToEdgeWrapping;
  bumpTexture.wrapT = THREE.ClampToEdgeWrapping;
  bumpTexture.generateMipmaps = true;

  return { glazeTexture, bumpTexture };
}

/**
 * Creates authentic terracotta clay back/sides texture
 */
function createTerracottaClayTexture() {
  const size = 512;
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d")!;

  // Natural clay base
  ctx.fillStyle = "#A84C2A";
  ctx.fillRect(0, 0, size, size);

  // Noise / grain for fired clay body
  for (let i = 0; i < 40000; i++) {
    const x = Math.random() * size;
    const y = Math.random() * size;
    const shade = Math.random() * 40 - 20;
    ctx.fillStyle = `rgba(${175 + shade}, ${85 + shade}, ${45 + shade}, 0.25)`;
    ctx.fillRect(x, y, 2, 2);
  }

  // Mold texture impression lines on back
  ctx.strokeStyle = "rgba(100, 40, 15, 0.25)";
  ctx.lineWidth = 3;
  for (let y = 30; y < size; y += 40) {
    ctx.beginPath();
    ctx.moveTo(10, y);
    ctx.lineTo(size - 10, y);
    ctx.stroke();
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  return texture;
}

export default function Tile3DViewer({
  widthMm = 150,
  lengthMm = 150,
  thicknessMm = 14,
  reliefDepthMm = 6,
  autoRotate = true,
  showControls = true,
  showHeatmap = false,
  className = "",
  svgPath,
  motifName,
  family,
}: Tile3DViewerProps) {
  const mountRef = useRef<HTMLDivElement>(null);
  const [wireframe, setWireframe] = useState(false);
  const [crossSectionZ, setCrossSectionZ] = useState(thicknessMm);
  const [measurementMode, setMeasurementMode] = useState(false);
  const [measuredDistance, setMeasuredDistance] = useState<number | null>(null);
  const [activeHeatmap, setActiveHeatmap] = useState(showHeatmap);
  const [isRotating, setIsRotating] = useState(autoRotate);

  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const tileGroupRef = useRef<THREE.Group | null>(null);
  const glazedMeshRef = useRef<THREE.Mesh | null>(null);
  const wireframeRef = useRef<THREE.LineSegments | null>(null);
  const clipPlaneRef = useRef<THREE.Plane | null>(null);

  useEffect(() => {
    if (!mountRef.current) return;
    const container = mountRef.current;
    const width = container.clientWidth || 500;
    const height = container.clientHeight || 420;

    // 1. Scene & Camera Setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x060913); // Deep luxury obsidian background
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(40, width / height, 1, 1200);
    camera.position.set(160, 190, 190);
    camera.lookAt(0, 5, 0);

    // 2. Blueprint / Architectural CAD Floor Grid
    const gridHelper = new THREE.GridHelper(320, 32, 0x0284c7, 0x132238);
    gridHelper.position.y = -18;
    scene.add(gridHelper);

    // Subtle contact shadow underneath
    const shadowGeo = new THREE.PlaneGeometry(widthMm * 1.25, lengthMm * 1.25);
    const shadowMat = new THREE.MeshBasicMaterial({
      color: 0x000000,
      transparent: true,
      opacity: 0.5,
    });
    const shadowMesh = new THREE.Mesh(shadowGeo, shadowMat);
    shadowMesh.rotateX(-Math.PI / 2);
    shadowMesh.position.y = -17.8;
    scene.add(shadowMesh);

    // 3. Renderer with Antialiasing & Balanced Tone Mapping
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "high-performance" });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.0;
    renderer.localClippingEnabled = true;
    container.innerHTML = "";
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // 4. Museum & Studio Multi-point Illumination
    // Ambient light for rich colors
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.2);
    scene.add(ambientLight);

    // Warm Key Light
    const keyLight = new THREE.DirectionalLight(0xffffff, 1.3);
    keyLight.position.set(100, 200, 140);
    scene.add(keyLight);

    // Cool Sky Rim Light
    const rimLight = new THREE.DirectionalLight(0x38bdf8, 0.7);
    rimLight.position.set(-140, 140, -100);
    scene.add(rimLight);

    // Soft Point Light for Glaze Specular Highlight
    const pointLight = new THREE.PointLight(0xffffff, 0.9, 400);
    pointLight.position.set(20, 100, 60);
    scene.add(pointLight);

    // 5. Build Group for Tile
    const tileGroup = new THREE.Group();
    scene.add(tileGroup);
    tileGroupRef.current = tileGroup;

    // Optional clipping plane (only applied if slider moved below full thickness)
    const clipPlane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 500); // Start far away so tile is NOT sliced
    clipPlaneRef.current = clipPlane;

    // 6. Generate Authentic Glaze & Terracotta Textures
    const { glazeTexture, bumpTexture } = createUzbekKashiTextures(svgPath, family);
    const clayTexture = createTerracottaClayTexture();

    // 7. Master Solid 3D Ceramic Tile (Single BoxGeometry with 6 face materials — NO Z-fighting)
    const bodyGeom = new THREE.BoxGeometry(widthMm, thicknessMm, lengthMm, 32, 4, 32);

    const glazedMaterial = new THREE.MeshStandardMaterial({
      map: activeHeatmap ? null : glazeTexture,
      bumpMap: bumpTexture,
      bumpScale: 0.6, // Realistic subtle glaze relief
      roughness: 0.18, // Lustrous high-gloss ceramic glaze
      metalness: 0.04,
      clippingPlanes: [clipPlane],
    });

    if (activeHeatmap) {
      glazedMaterial.color = new THREE.Color(0x34d399); // Pass green
    }

    const clayMaterial = new THREE.MeshStandardMaterial({
      map: clayTexture,
      roughness: 0.9, // Unglazed porous baked clay
      metalness: 0.0,
      clippingPlanes: [clipPlane],
    });

    // Materials for [ +X, -X, +Y (Top Glaze), -Y (Bottom Clay), +Z, -Z ]
    const tileMaterials = [
      clayMaterial,   // +X side
      clayMaterial,   // -X side
      glazedMaterial, // +Y TOP GLAZED FACE
      clayMaterial,   // -Y bottom back
      clayMaterial,   // +Z side
      clayMaterial,   // -Z side
    ];

    const masterTile = new THREE.Mesh(bodyGeom, tileMaterials);
    masterTile.position.y = 0;
    tileGroup.add(masterTile);
    glazedMeshRef.current = masterTile;

    // 8. Wireframe Overlay (Toggleable)
    const wireframeGeom = new THREE.WireframeGeometry(bodyGeom);
    const wireframeMat = new THREE.LineBasicMaterial({
      color: 0x38bdf8,
      transparent: true,
      opacity: 0.4,
    });
    const wireframeLines = new THREE.LineSegments(wireframeGeom, wireframeMat);
    wireframeLines.visible = wireframe;
    tileGroup.add(wireframeLines);
    wireframeRef.current = wireframeLines;

    // 9. Interactive Measurement Markers
    const measureSphere1 = new THREE.Mesh(
      new THREE.SphereGeometry(2.5, 16, 16),
      new THREE.MeshBasicMaterial({ color: 0xef4444 })
    );
    measureSphere1.position.set(-widthMm / 2 + 10, thicknessMm / 2 + 1, -lengthMm / 2 + 10);
    measureSphere1.visible = false;
    tileGroup.add(measureSphere1);

    const measureSphere2 = new THREE.Mesh(
      new THREE.SphereGeometry(2.5, 16, 16),
      new THREE.MeshBasicMaterial({ color: 0xef4444 })
    );
    measureSphere2.position.set(widthMm / 2 - 10, thicknessMm / 2 + 1, lengthMm / 2 - 10);
    measureSphere2.visible = false;
    tileGroup.add(measureSphere2);

    // Initial slight angle tilt for striking 3D presentation
    tileGroup.rotation.x = 0.22;
    tileGroup.rotation.y = -0.45;

    // 10. Smooth Render & Animation Loop
    let animationFrameId: number;
    const rotationSpeed = 0.004;

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      if (isRotating && tileGroupRef.current) {
        tileGroupRef.current.rotation.y += rotationSpeed;
      }

      renderer.render(scene, camera);
    };
    animate();

    // Mouse Interaction
    let isDragging = false;
    let prevMouseX = 0;
    let prevMouseY = 0;

    const handleMouseEnter = () => setIsRotating(false);
    const handleMouseLeave = () => {
      if (autoRotate && !isDragging) setIsRotating(true);
    };

    const handleMouseDown = (e: MouseEvent) => {
      isDragging = true;
      prevMouseX = e.clientX;
      prevMouseY = e.clientY;

      if (measurementMode) {
        measureSphere1.visible = true;
        measureSphere2.visible = true;
        // Accurate diagonal distance calculation
        const dx = widthMm - 20;
        const dy = lengthMm - 20;
        const dist = Math.sqrt(dx * dx + dy * dy);
        setMeasuredDistance(Number(dist.toFixed(2)));
      }
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging || !tileGroupRef.current) return;
      const deltaX = e.clientX - prevMouseX;
      const deltaY = e.clientY - prevMouseY;
      prevMouseX = e.clientX;
      prevMouseY = e.clientY;

      tileGroupRef.current.rotation.y += deltaX * 0.009;
      tileGroupRef.current.rotation.x += deltaY * 0.009;
    };

    const handleMouseUp = () => {
      isDragging = false;
    };

    container.addEventListener("mouseenter", handleMouseEnter);
    container.addEventListener("mouseleave", handleMouseLeave);
    container.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);

    // Window Resize
    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener("resize", handleResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      container.removeEventListener("mouseenter", handleMouseEnter);
      container.removeEventListener("mouseleave", handleMouseLeave);
      container.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
      window.removeEventListener("resize", handleResize);

      renderer.dispose();
      bodyGeom.dispose();
      glazeTexture.dispose();
      bumpTexture.dispose();
      clayTexture.dispose();
    };
  }, [widthMm, lengthMm, thicknessMm, reliefDepthMm, activeHeatmap, svgPath, family]);

  // Wireframe visibility toggle
  useEffect(() => {
    if (wireframeRef.current) {
      wireframeRef.current.visible = wireframe;
    }
  }, [wireframe]);

  // Dynamic cross-section plane update
  useEffect(() => {
    if (clipPlaneRef.current) {
      if (crossSectionZ < thicknessMm) {
        // Cut through the tile from top
        clipPlaneRef.current.constant = crossSectionZ - thicknessMm / 2;
      } else {
        // Full uncut tile
        clipPlaneRef.current.constant = 500;
      }
    }
  }, [crossSectionZ, thicknessMm]);

  const resetView = () => {
    if (tileGroupRef.current) {
      tileGroupRef.current.rotation.set(0.22, -0.45, 0);
      setIsRotating(true);
    }
  };

  return (
    <div className={`relative bg-[#060913] border border-cyan-500/30 rounded-[var(--radius-max)] overflow-hidden shadow-2xl ${className}`}>
      {/* 3D Canvas */}
      <div ref={mountRef} className="w-full h-[430px] cursor-grab active:cursor-grabbing bg-[#060913]" />

      {/* Millimeter Metric Badges */}
      <div className="absolute top-3 left-3 flex flex-col gap-1.5 pointer-events-none z-10">
        <span className="mono text-xs bg-slate-900/90 border border-cyan-500/40 px-2.5 py-1 text-cyan-300 rounded shadow-lg backdrop-blur">
          Gabarit: {widthMm} &times; {lengthMm} mm
        </span>
        <span className="mono text-xs bg-slate-900/90 border border-slate-700 px-2.5 py-1 text-slate-300 rounded shadow-lg backdrop-blur">
          Qalinlik: {thicknessMm} mm (Relyef chuqurligi: {reliefDepthMm} mm)
        </span>
      </div>

      {/* Reset & View Controls top right */}
      <div className="absolute top-3 right-3 flex items-center gap-2 z-10">
        <button
          onClick={resetView}
          className="btn btn-outline text-xs p-2 bg-slate-900/80 border-slate-700 text-slate-300 hover:text-white hover:border-cyan-400"
          title="Ko'rinishni tiklash"
        >
          <RotateCcw size={14} />
        </button>
      </div>

      {/* Measurement readout */}
      {measuredDistance !== null && (
        <div className="absolute top-14 right-3 bg-slate-900/95 border border-cyan-400 px-3 py-1.5 text-xs mono text-cyan-300 rounded shadow-xl shadow-cyan-500/20 backdrop-blur z-10">
          O'lchangan diagonal: <b>{measuredDistance} mm</b>
        </div>
      )}

      {/* Viewer Controls Toolbar */}
      {showControls && (
        <div className="absolute bottom-3 left-3 right-3 flex flex-wrap items-center justify-between gap-2 bg-slate-950/90 border border-cyan-500/30 p-2.5 rounded-[var(--radius-sm)] backdrop-blur-md z-10">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setWireframe(!wireframe)}
              className={`btn btn-outline text-xs px-2.5 py-1 ${wireframe ? "border-cyan-400 text-cyan-300 bg-cyan-950/60" : "text-slate-300"}`}
              title="Karkas ko'rinishi (Wireframe)"
            >
              <Layers size={14} strokeWidth={1.5} />
              Karkas
            </button>
            <button
              onClick={() => setActiveHeatmap(!activeHeatmap)}
              className={`btn btn-outline text-xs px-2.5 py-1 ${activeHeatmap ? "border-emerald-400 text-emerald-300 bg-emerald-950/60" : "text-slate-300"}`}
              title="Sirt tahlili (Skan tekshiruvi)"
            >
              <Activity size={14} strokeWidth={1.5} />
              Sirt tahlili
            </button>
            <button
              onClick={() => {
                setMeasurementMode(!measurementMode);
                if (measurementMode) setMeasuredDistance(null);
              }}
              className={`btn btn-outline text-xs px-2.5 py-1 ${measurementMode ? "border-rose-400 text-rose-300 bg-rose-950/60" : "text-slate-300"}`}
              title="O'lchov olish (Click-to-measure)"
            >
              <Ruler size={14} strokeWidth={1.5} />
              {measurementMode ? "O'lchash..." : "O'lchash"}
            </button>
          </div>

          {/* Cross section slider */}
          <div className="flex items-center gap-2 text-xs mono text-slate-300">
            <span>Kesim Z:</span>
            <input
              type="range"
              min="2"
              max={thicknessMm}
              step="0.5"
              value={crossSectionZ}
              onChange={(e) => setCrossSectionZ(parseFloat(e.target.value))}
              className="w-20 cursor-pointer accent-cyan-400"
            />
            <span className="w-8 text-cyan-300 font-bold">{crossSectionZ}mm</span>
          </div>
        </div>
      )}
    </div>
  );
}
