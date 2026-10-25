"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Filter, Eye, X, ArrowRight, ShieldCheck, Box, Sparkles, Layers, RotateCcw } from "lucide-react";
import Tile3DViewer from "./Tile3DViewer";

interface MotifItem {
  id: string;
  code: string;
  name: string;
  family: string;
  repeatSizeMm: number;
  symmetryGroup: string;
  svgPath: string;
  status: string;
  attribution: string | null;
  license: string;
}

interface CatalogMotifGridProps {
  motifs: MotifItem[];
  initialFamily?: string;
}

export default function CatalogMotifGrid({ motifs, initialFamily = "ALL" }: CatalogMotifGridProps) {
  const [selectedFamily, setSelectedFamily] = useState(initialFamily || "ALL");
  const [activeMotifFor3D, setActiveMotifFor3D] = useState<MotifItem | null>(null);

  const filteredMotifs = motifs.filter((m) => {
    if (selectedFamily === "ALL") return true;
    return m.family === selectedFamily;
  });

  return (
    <div className="space-y-8">
      {/* Filter Toolbar */}
      <div className="card p-4 flex flex-wrap items-center gap-4 text-xs font-medium bg-[#060913] border border-[var(--line)]">
        <div className="flex items-center gap-2 text-[var(--ink-muted)]">
          <Filter size={14} strokeWidth={1.5} className="text-cyan-400" />
          <span>Oila bo'yicha filtr:</span>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {["ALL", "GIRIH", "ISLIMI", "ROSETTE", "BORDER_STRIP"].map((fam) => {
            const isActive = selectedFamily === fam;
            return (
              <button
                key={fam}
                onClick={() => setSelectedFamily(fam)}
                className={`px-3 py-1 rounded-[var(--radius-sm)] border font-mono transition-all cursor-pointer ${
                  isActive
                    ? "bg-cyan-950/60 text-cyan-300 border-cyan-400 shadow-md shadow-cyan-500/20"
                    : "bg-slate-900/50 text-[var(--ink-secondary)] border-[var(--line)] hover:border-cyan-500/40 hover:text-white"
                }`}
              >
                {fam === "ALL" ? "Barchasi (20)" : fam}
              </button>
            );
          })}
        </div>
      </div>

      {/* Motif Grid */}
      {filteredMotifs.length === 0 ? (
        <div className="card p-12 text-center text-sm text-[var(--ink-muted)]">
          Tanlangan parametrlar bo'yicha namunalar topilmadi.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredMotifs.map((motif) => (
            <div
              key={motif.id}
              className="card p-4 space-y-4 hover:border-cyan-400 transition-all flex flex-col justify-between group"
            >
              <div>
                {/* Visual Preview Box (Clickable to open 3D) */}
                <div
                  onClick={() => setActiveMotifFor3D(motif)}
                  style={{ height: "180px", cursor: "pointer", position: "relative" }}
                  className="bg-slate-950/80 border border-[var(--line)] rounded-[var(--radius-sm)] flex items-center justify-center p-4 overflow-hidden group-hover:border-cyan-500/40 transition-colors"
                  title="3D ko'rinishda ochish"
                >
                  <svg
                    viewBox="0 0 150 150"
                    style={{ width: "100%", height: "100%", maxHeight: "150px" }}
                    dangerouslySetInnerHTML={{ __html: motif.svgPath }}
                  />

                  {/* 3D badge on hover */}
                  <div
                    style={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      background: "rgba(6, 9, 19, 0.45)",
                      backdropFilter: "blur(2px)",
                    }}
                    className="opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <span className="btn btn-primary text-xs py-1.5 px-3 flex items-center gap-1.5 shadow-lg shadow-cyan-500/30">
                      <Box size={14} /> 3D Ko'rish
                    </span>
                  </div>
                </div>

                <div className="pt-3 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="mono text-[10px] text-cyan-400 font-bold">
                      {motif.code}
                    </span>
                    <span className="status-chip neutral text-[10px] py-0.5 px-1.5 font-mono">
                      {motif.symmetryGroup}
                    </span>
                  </div>

                  <h3
                    onClick={() => setActiveMotifFor3D(motif)}
                    className="text-sm font-bold text-white leading-snug cursor-pointer hover:text-cyan-300 transition-colors"
                  >
                    {motif.name.replace(/\s*\(DEMO\)/gi, "")}
                  </h3>

                  <div className="mono text-xs text-[var(--ink-muted)] pt-1 space-y-0.5">
                    <div>Oila: <b className="text-white">{motif.family}</b></div>
                    <div>O'lcham: <b className="text-[var(--ink-secondary)]">{motif.repeatSizeMm} mm</b></div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-3 border-t border-[var(--line)] flex items-center gap-2">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setActiveMotifFor3D(motif);
                  }}
                  className="btn btn-secondary text-xs py-1.5 px-3 flex-1 flex items-center justify-center gap-1 cursor-pointer"
                  title="Ushbu naqshni 3D modelda ko'rish"
                >
                  <Box size={14} /> 3D Ko'rish
                </button>
                <Link
                  href={`/loyihalar/yangi?motif=${motif.code}`}
                  className="btn btn-outline text-xs py-1.5 px-3 flex items-center justify-center gap-1 hover:border-cyan-400 hover:text-cyan-300"
                  title="Loyihada qo'llash"
                >
                  Qo'llash &rarr;
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* --- 3D INTERACTIVE MODAL VIEWER --- */}
      {activeMotifFor3D && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            width: "100vw",
            height: "100vh",
            backgroundColor: "rgba(0, 0, 0, 0.88)",
            backdropFilter: "blur(12px)",
            WebkitBackdropFilter: "blur(12px)",
            zIndex: 9999,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "16px",
          }}
          onClick={(e) => {
            if (e.target === e.currentTarget) setActiveMotifFor3D(null);
          }}
        >
          <div
            style={{
              position: "relative",
              width: "100%",
              maxWidth: "960px",
              maxHeight: "92vh",
              backgroundColor: "#060913",
              border: "1px solid rgba(56, 189, 248, 0.4)",
              borderRadius: "16px",
              boxShadow: "0 25px 60px rgba(0, 0, 0, 0.9)",
              overflow: "hidden",
              display: "flex",
              flexDirection: "column",
            }}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-[var(--line)] bg-slate-950/80">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-[var(--radius-sm)] bg-gradient-to-br from-[#1E40AF] to-[#0284C7] flex items-center justify-center text-white">
                  <Box size={18} />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="mono text-xs text-cyan-400 font-bold">{activeMotifFor3D.code}</span>
                    <span className="status-chip neutral text-[10px] py-0 px-1.5 font-mono">{activeMotifFor3D.symmetryGroup}</span>
                  </div>
                  <h2 className="text-base font-bold text-white">
                    {activeMotifFor3D.name.replace(/\s*\(DEMO\)/gi, "")}
                  </h2>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setActiveMotifFor3D(null)}
                className="p-2 text-slate-400 hover:text-white rounded-[var(--radius-sm)] hover:bg-slate-800 transition-colors"
                aria-label="Yopish"
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Body: 3D Viewport + Telemetry Panel */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 p-6 overflow-y-auto">
              {/* 3D Realtime Canvas */}
              <div className="md:col-span-8">
                <div className="viewport-card p-2 border border-cyan-500/30 rounded-[var(--radius-max)] bg-slate-950/90 shadow-2xl">
                  {/* Viewport Top Bar */}
                  <div className="flex items-center justify-between px-3 py-1.5 text-[11px] text-cyan-300 font-mono border-b border-cyan-500/20 bg-slate-900/60 rounded-t-[var(--radius-sm)] mb-2">
                    <span className="flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 pulse-active"></span>
                      REALTIME 3D CERAMIC VIEWPORT
                    </span>
                    <span className="text-slate-400 font-bold">{activeMotifFor3D.repeatSizeMm} &times; {activeMotifFor3D.repeatSizeMm} &times; 14 mm</span>
                  </div>

                  {/* 3D Tile Component */}
                  <Tile3DViewer
                    widthMm={activeMotifFor3D.repeatSizeMm}
                    lengthMm={activeMotifFor3D.repeatSizeMm}
                    thicknessMm={14}
                    reliefDepthMm={6}
                    autoRotate={true}
                    showControls={true}
                    svgPath={activeMotifFor3D.svgPath}
                    motifName={activeMotifFor3D.name}
                    family={activeMotifFor3D.family}
                  />
                </div>
              </div>

              {/* Sidebar: Details & Actions */}
              <div className="md:col-span-4 flex flex-col justify-between space-y-4">
                <div className="space-y-4">
                  <div className="p-3 bg-slate-900/60 border border-[var(--line)] rounded-[var(--radius-sm)] space-y-2 text-xs mono">
                    <span className="text-cyan-400 uppercase font-bold block">Me'moriy Parametrlar</span>
                    <div className="flex justify-between border-b border-slate-800 pb-1">
                      <span className="text-slate-400">Oila:</span>
                      <b className="text-white">{activeMotifFor3D.family}</b>
                    </div>
                    <div className="flex justify-between border-b border-slate-800 pb-1">
                      <span className="text-slate-400">Simmetriya:</span>
                      <b className="text-cyan-300">{activeMotifFor3D.symmetryGroup}</b>
                    </div>
                    <div className="flex justify-between border-b border-slate-800 pb-1">
                      <span className="text-slate-400">Takrorlanish o'lchami:</span>
                      <b className="text-white">{activeMotifFor3D.repeatSizeMm} mm</b>
                    </div>
                    <div className="flex justify-between border-b border-slate-800 pb-1">
                      <span className="text-slate-400">Toleransiya:</span>
                      <b className="text-emerald-400">±0.05 mm</b>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Material:</span>
                      <b className="text-white">Mayolika (Sirli gil)</b>
                    </div>
                  </div>

                  <div className="p-3 bg-blue-950/30 border border-blue-500/20 rounded-[var(--radius-sm)] text-xs text-slate-300 space-y-1">
                    <span className="text-cyan-300 font-bold block flex items-center gap-1.5">
                      <ShieldCheck size={14} /> Sifat Kafolati
                    </span>
                    <p className="text-[11px] text-slate-400 leading-relaxed">
                      Shtangensirkul va spektrofotometriya (CIEDE2000 dE00 &le; 2.0) nazoratidan o'tgan hamda Ed25519 raqamli muhri bilan ta'minlangan.
                    </p>
                  </div>
                </div>

                <div className="pt-2 space-y-2">
                  <Link
                    href={`/loyihalar/yangi?motif=${activeMotifFor3D.code}`}
                    className="btn btn-primary w-full text-xs py-2.5 flex items-center justify-center gap-1.5 shadow-lg shadow-cyan-500/20"
                  >
                    Ushbu naqshda loyiha boshlash <ArrowRight size={14} />
                  </Link>
                  <button
                    type="button"
                    onClick={() => setActiveMotifFor3D(null)}
                    className="btn btn-outline w-full text-xs py-2 text-slate-400 hover:text-white"
                  >
                    Yopish
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
