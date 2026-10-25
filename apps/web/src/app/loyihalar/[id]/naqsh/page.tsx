"use client";

import React, { useState } from "react";
import Link from "next/link";
import { MICROCOPY, REPLICA_STATEMENT_UZ, REPLICA_STATEMENT_EN } from "@naqshlab/shared";
import {
  Undo,
  Redo,
  Check,
  X,
  ShieldCheck,
  Eye,
  Plus,
  Trash2,
  Cpu,
  Layers,
  ArrowLeft,
  Sparkles,
} from "lucide-react";

export default function ReconstructionEditorPage({ params }: { params: { id: string } }) {
  const [selectedCandidate, setSelectedCandidate] = useState<string>("CANDIDATE_A");
  const [isApproved, setIsApproved] = useState<boolean>(true);
  const [expertRole, setExpertRole] = useState<boolean>(true);
  const [activeTool, setActiveTool] = useState<"SELECT" | "PAINT_DAMAGE" | "NODE_EDIT">("SELECT");
  const [historyStep, setHistoryStep] = useState(1);
  const [comment, setComment] = useState("");

  const candidates = [
    {
      id: "CANDIDATE_A",
      name: "Variant A: Simmetriya va Davriylik Ko'chirish",
      method: "Symmetry & Periodicity Copy-Fill (C8)",
      isDeterministic: true,
      confidence: 0.96,
      desc: "Zararlanmagan burchak naqshlarining C8 aylanma simmetriyasi asosida aniq geometrik akslantirish.",
    },
    {
      id: "CANDIDATE_B",
      name: "Variant B: Patch Inpainting (Telea)",
      method: "OpenCV Fast Marching Inpainting",
      isDeterministic: false,
      confidence: 0.82,
      desc: "Silliq gradient davomiyligi bo'yicha yoriqlarni to'ldirish algoritmi.",
    },
    {
      id: "CANDIDATE_C",
      name: "Variant C: Katalogdagi Tarixiy Girih Motifi",
      method: "Heritage Pattern Library (MOTIF-GIR-001)",
      isDeterministic: true,
      confidence: 0.90,
      desc: "Registon davriga xos 8-qirrali rasmiy katalog motifi bilan to'ldirish.",
    },
  ];

  return (
    <div className="container py-8 space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[var(--line)] pb-4">
        <div>
          <Link href={`/loyihalar/${params.id}`} className="text-xs text-[var(--cobalt)] hover:underline flex items-center gap-1 mb-1">
            <ArrowLeft size={12} /> Loyiha ma'lumotlariga qaytish
          </Link>
          <h1 className="text-2xl font-bold">Naqsh Rekonstruksiyasi Muharriri</h1>
          <p className="text-xs text-[var(--ink-muted)]">
            Vektor tahriri, simmetriya tahlili va ekspert tasdig'i (Rule R3)
          </p>
        </div>

        {/* Expert Status Indicator */}
        <div className="flex items-center gap-3">
          <div className="text-right">
            <span className="text-[11px] mono text-[var(--ink-muted)] block">Faol rol:</span>
            <span className="text-xs font-bold text-[var(--cobalt)]">
              {expertRole ? "EKSPERT (Usta Shomurodov)" : "MIJOZ (Ko'rish rejimi)"}
            </span>
          </div>
          <button
            onClick={() => setExpertRole(!expertRole)}
            className="btn btn-outline text-xs py-1 px-2.5"
            title="Rolni almashtirish (Test uchun)"
          >
            Rolni almashtirish
          </button>
        </div>
      </div>

      {/* Editor Toolbar */}
      <div className="card p-3 flex flex-wrap items-center justify-between gap-3 bg-[var(--mist)]">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTool("SELECT")}
            className={`btn btn-outline text-xs py-1 px-3 ${activeTool === "SELECT" ? "bg-[var(--paper)] border-[var(--cobalt)] text-[var(--cobalt)] font-bold" : ""}`}
          >
            Tanlash
          </button>
          <button
            onClick={() => setActiveTool("PAINT_DAMAGE")}
            className={`btn btn-outline text-xs py-1 px-3 ${activeTool === "PAINT_DAMAGE" ? "bg-[var(--paper)] border-[var(--cobalt)] text-[var(--cobalt)] font-bold" : ""}`}
          >
            Zarar niqobini bo'yash
          </button>
          <button
            onClick={() => setActiveTool("NODE_EDIT")}
            className={`btn btn-outline text-xs py-1 px-3 ${activeTool === "NODE_EDIT" ? "bg-[var(--paper)] border-[var(--cobalt)] text-[var(--cobalt)] font-bold" : ""}`}
          >
            Tugunlarni tahrirlash
          </button>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setHistoryStep(Math.max(1, historyStep - 1))}
            className="btn btn-outline text-xs py-1 px-2.5"
            title="Bekor qilish (Undo)"
          >
            <Undo size={14} strokeWidth={1.5} />
          </button>
          <button
            onClick={() => setHistoryStep(historyStep + 1)}
            className="btn btn-outline text-xs py-1 px-2.5"
            title="Qaytarish (Redo)"
          >
            <Redo size={14} strokeWidth={1.5} />
          </button>
          <span className="mono text-xs text-[var(--ink-muted)] px-2">
            Versiya: v1.{historyStep}
          </span>
        </div>
      </div>

      {/* Main Reconstruction Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Visual Vector Canvas */}
        <div className="lg:col-span-8 card p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-[var(--line)] pb-3">
            <h3 className="text-sm font-bold text-[var(--ink)]">
              Vektor chizma va to'ldirish hududlari
            </h3>
            <span className="status-chip neutral text-xs mono">
              Metrik o'lcham: 150.0 &times; 150.0 mm
            </span>
          </div>

          {/* Interactive SVG Canvas */}
          <div className="h-[420px] bg-white border border-[var(--line)] rounded-[var(--radius-max)] relative flex items-center justify-center p-6 overflow-hidden">
            <svg viewBox="0 0 150 150" className="w-full h-full max-h-[380px]">
              {/* Outer tile border */}
              <rect x="2" y="2" width="146" height="146" fill="none" stroke="#D9E3EE" strokeWidth="1" />

              {/* 8-pointed Girih star procedural geometry */}
              <circle cx="75" cy="75" r="45" fill="none" stroke="#1D4E9A" strokeWidth="1.5" />
              <rect x="43" y="43" width="64" height="64" fill="none" stroke="#1D4E9A" strokeWidth="1.2" transform="rotate(45 75 75)" />
              <circle cx="75" cy="75" r="18" fill="none" stroke="#5E9DBE" strokeWidth="1.2" />

              {/* Corner flourishes */}
              <circle cx="15" cy="15" r="12" fill="none" stroke="#1D4E9A" strokeWidth="1" strokeDasharray="3 3" />
              <circle cx="135" cy="15" r="12" fill="none" stroke="#1D4E9A" strokeWidth="1" strokeDasharray="3 3" />
              <circle cx="15" cy="135" r="12" fill="none" stroke="#1D4E9A" strokeWidth="1" strokeDasharray="3 3" />
              <circle cx="135" cy="135" r="12" fill="none" stroke="#1D4E9A" strokeWidth="1" strokeDasharray="3 3" />

              {/* Damaged region indicator (highlighted) */}
              <rect x="25" y="25" width="30" height="30" fill="rgba(163, 55, 45, 0.15)" stroke="#A3372D" strokeWidth="1" strokeDasharray="2 2" />
              <text x="27" y="42" fill="#A3372D" fontSize="7" fontFamily="IBM Plex Mono">ZARAR (CHIP)</text>

              {/* Reconstructed patch overlay */}
              {selectedCandidate && (
                <g stroke="#1F7A5A" strokeWidth="1.2" fill="none">
                  <path d="M 25 40 L 40 25 L 55 40 L 40 55 Z" strokeDasharray="2 2" />
                  <circle cx="40" cy="40" r="5" />
                </g>
              )}
            </svg>

            {/* Canvas overlay badge */}
            <div className="absolute bottom-3 left-3 mono text-[11px] bg-[var(--paper)]/90 border border-[var(--line)] px-2.5 py-1">
              Holat: {isApproved ? MICROCOPY.readyForProduction : MICROCOPY.pendingApproval}
            </div>
          </div>

          <div className="flex items-center justify-between text-xs text-[var(--ink-muted)] mono">
            <span>Asbob: <b>{activeTool}</b></span>
            <span>Simmetriya: <b>C8 aylanma (96%)</b></span>
            <span>Tugunlar soni: <b>48</b></span>
          </div>
        </div>

        {/* Side Panel: Candidates & Expert Approval */}
        <div className="lg:col-span-4 space-y-6">
          {/* Candidates Selection (Section 3.3) */}
          <div className="card p-5 space-y-3">
            <h3 className="text-sm font-bold text-[var(--ink)] flex items-center justify-between">
              <span>To'ldirish variantlari</span>
              <span className="mono text-[10px] text-[var(--ink-muted)]">3 ta taklif</span>
            </h3>

            <div className="space-y-2">
              {candidates.map((cand) => (
                <div
                  key={cand.id}
                  onClick={() => setSelectedCandidate(cand.id)}
                  className={`p-3 border rounded-[var(--radius-max)] cursor-pointer transition-colors space-y-1 ${
                    selectedCandidate === cand.id
                      ? "border-[var(--cobalt)] bg-[var(--mist)]"
                      : "border-[var(--line)] hover:border-[var(--ink-muted)] bg-[var(--paper)]"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[var(--ink)]">{cand.name}</span>
                    <span className="mono text-[10px] text-[var(--success)] font-semibold">
                      {(cand.confidence * 100).toFixed(0)}%
                    </span>
                  </div>
                  <p className="text-[11px] text-[var(--ink-muted)] leading-tight">{cand.desc}</p>
                  <span className="mono text-[10px] text-[var(--cobalt)] block pt-1">
                    {cand.isDeterministic ? "Deterministik nusxa" : "Probabilistik inpainting"}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Hard Rule R3: Expert Approval Barrier */}
          <div className="card p-5 space-y-4 border-l-4 border-l-[var(--cobalt)]">
            <div>
              <span className="mono text-[10px] uppercase text-[var(--cobalt)] font-bold block mb-1">
                Hard Rule R3 &bull; Ekspert nazorati
              </span>
              <h3 className="text-sm font-bold text-[var(--ink)]">
                Rekonstruksiyani tasdiqlash
              </h3>
              <p className="text-xs text-[var(--ink-muted)] mt-1">
                {MICROCOPY.aiSuggestionUnapproved}. Faqatgina EXPERT roli tasdiqlashi mumkin.
              </p>
            </div>

            <div className="form-group mb-0">
              <label className="form-label text-xs">Ekspert xulosasi / Izohi:</label>
              <textarea
                rows={2}
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Variant A me'moriy davrga to'liq mos keladi..."
                className="form-textarea text-xs"
              />
            </div>

            {expertRole ? (
              <div className="space-y-2 pt-2 border-t border-[var(--line)]">
                <button
                  type="button"
                  onClick={() => {
                    setIsApproved(true);
                    alert("Rekonstruksiya Usta tomonidan TASDIQLANDI! Audit jurnaliga muhrlandi.");
                  }}
                  className="btn btn-primary text-xs w-full flex items-center justify-center gap-1.5"
                >
                  <ShieldCheck size={14} strokeWidth={1.5} />
                  Variantni tasdiqlash (EXPERT APPROVE)
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsApproved(false);
                    alert("Variant rad etildi va yangi tahrirga qaytarildi.");
                  }}
                  className="btn btn-outline text-xs w-full text-[var(--danger)] border-[var(--line)] hover:border-[var(--danger)]"
                >
                  Rad etish (REJECT)
                </button>
              </div>
            ) : (
              <div className="p-3 bg-[var(--mist)] border border-[var(--line)] rounded-[var(--radius-max)] text-xs text-[var(--ink-muted)]">
                {MICROCOPY.expertUnapproved}. Siz mijoz rejimidasiz — faqat taklif va fikr qoldirishingiz mumkin.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
