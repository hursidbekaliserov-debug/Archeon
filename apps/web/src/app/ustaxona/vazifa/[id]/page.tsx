"use client";

import React, { useState } from "react";
import Link from "next/link";
import { REPLICA_STATEMENT_UZ, REPLICA_STATEMENT_EN } from "@naqshlab/shared";
import { ArrowLeft, Camera, CheckCircle2, ShieldAlert, AlertTriangle, Upload, Save } from "lucide-react";

export default function WorkshopTaskExecutionPage({ params }: { params: { id: string } }) {
  const [photoUploaded, setPhotoUploaded] = useState(true);
  const [measuredCaliperMm, setMeasuredCaliperMm] = useState("150.2");
  const [replicaMarkingDone, setReplicaMarkingDone] = useState(true);
  const [offlineSynced, setOfflineSynced] = useState(true);

  // Tolerance check (threshold: 0.5mm delta from 150.0mm nominal)
  const val = parseFloat(measuredCaliperMm) || 150.0;
  const isOutOfTolerance = Math.abs(val - 150.0) > 0.5;

  return (
    <div className="container max-w-2xl py-12 space-y-6">
      <Link href="/ustaxona" className="text-xs text-[var(--cobalt)] hover:underline flex items-center gap-1">
        <ArrowLeft size={12} /> Barcha vazifalarga qaytish
      </Link>

      {/* Header */}
      <div className="card p-6 space-y-3">
        <div className="flex items-center justify-between">
          <span className="mono text-xs px-2 py-0.5 bg-[var(--mist)] border border-[var(--line)] text-[var(--cobalt)]">
            NLB-KSH-2026-000001
          </span>
          <span className="status-chip success text-xs">
            IN_PROGRESS
          </span>
        </div>

        <h1 className="text-xl font-bold">Orqa tomoniga nusxa tamg'asini bosish va o'lchash</h1>
        <p className="text-xs text-[var(--ink-muted)]">
          Yo'nalish: <b>KASHI (Keramika)</b> &bull; Usta: <b>Akmal Saidov</b>
        </p>
      </div>

      {/* Mandatory Replica Marking Step (Rule R1) */}
      <div className="card p-6 space-y-4 border-l-4 border-l-[var(--cobalt)]">
        <div>
          <span className="mono text-xs uppercase text-[var(--cobalt)] font-bold block mb-1">
            Majburiy qadam &bull; Rule R1
          </span>
          <h3 className="text-base font-bold text-[var(--ink)]">
            Koshin orqasiga "NUSXA — ASL EMAS" yozuvini kiritish
          </h3>
          <p className="text-xs text-[var(--ink-muted)] mt-1">
            Ushbu qadam fotosuratsiz yakunlanmaydi. Pishirishdan avval koshin orqa tomonidagi tamg'a aniq ko'rinishi shart.
          </p>
        </div>

        {/* Photo Upload Requirement */}
        <div className="p-4 bg-[var(--mist)] border border-[var(--line)] rounded-[var(--radius-max)] space-y-3">
          <div className="flex items-center justify-between text-xs font-semibold">
            <span>Orqa tamg'a fotosurati (Majburiy):</span>
            <span className={photoUploaded ? "text-[var(--success)] mono" : "text-[var(--danger)] mono"}>
              {photoUploaded ? "Yuklangan: replica_backstamp_proof.jpg" : "FOTO YUKLANMAGAN"}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setPhotoUploaded(!photoUploaded)}
              className="btn btn-outline text-xs py-1.5 flex items-center gap-1.5"
            >
              <Camera size={14} strokeWidth={1.5} />
              {photoUploaded ? "Suratni almashtirish" : "Surat yuklash (Kamera)"}
            </button>
            <span className="text-[11px] text-[var(--ink-muted)]">
              JPG / PNG (Maksimal 50 MB, magic bytes tekshiriladi)
            </span>
          </div>
        </div>

        {/* Replica Marking Completed Checkbox */}
        <div className="flex items-start gap-3 p-3 bg-[var(--paper)] border border-[var(--line)] rounded-[var(--radius-max)]">
          <input
            id="mark-step"
            type="checkbox"
            checked={replicaMarkingDone}
            onChange={(e) => {
              if (!photoUploaded && e.target.checked) {
                alert("Fotosurat yuklanmaguncha bu qadamni belgilash mumkin emas (Rule R1)!");
                return;
              }
              setReplicaMarkingDone(e.target.checked);
            }}
            className="mt-1 h-4 w-4 accent-[var(--cobalt)] cursor-pointer"
          />
          <label htmlFor="mark-step" className="text-xs font-semibold text-[var(--ink)] cursor-pointer">
            Men koshin orqa tomoniga "NUSXA — ASL EMAS" va "NLB-KSH-2026-000001" raqamini o'yib, fotoni ilova qilganimni tasdiqlayman.
          </label>
        </div>
      </div>

      {/* Measurement Step with Tolerance Alert */}
      <div className="card p-6 space-y-4">
        <h3 className="text-base font-bold text-[var(--ink)]">
          Shtangensirkul o'lchovi (Tolerans tekshiruvi)
        </h3>
        <p className="text-xs text-[var(--ink-muted)]">
          Nominal o'lcham: <b>150.0 mm</b> &bull; Ruxsat etilgan og'ish: <b>&plusmn;0.5 mm</b>
        </p>

        <div className="form-group mb-0">
          <label className="form-label text-xs">O'lchangan eni (mm):</label>
          <input
            type="number"
            step="0.05"
            value={measuredCaliperMm}
            onChange={(e) => setMeasuredCaliperMm(e.target.value)}
            className="form-input text-xs mono"
          />
        </div>

        {/* Tolerance Alert */}
        {isOutOfTolerance ? (
          <div className="p-3 bg-[#FDF1F0] border border-[var(--danger)] rounded-[var(--radius-max)] flex items-start gap-2 text-xs text-[var(--danger)]">
            <AlertTriangle size={16} className="flex-shrink-0 mt-0.5" />
            <div>
              <b>OGOHLANTIRISH: O'lcham toleransdan tashqarida!</b>
              <p className="text-[11px] text-[var(--ink)] mt-0.5">
                Og'ish &plusmn;0.5mm chegarasidan oshdi. Keyingi qadam bloklanadi yoki qayta ishlashga (REWORK) yuboriladi.
              </p>
            </div>
          </div>
        ) : (
          <div className="p-3 bg-[#EBF5F1] border border-[var(--success)] rounded-[var(--radius-max)] text-xs text-[var(--success)] flex items-center gap-2">
            <CheckCircle2 size={16} />
            <b>O'lcham me'yorida: Og'ish {Math.abs(val - 150.0).toFixed(2)} mm (&le; 0.5 mm)</b>
          </div>
        )}
      </div>

      {/* Actions & Offline Sync Draft */}
      <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
        <button
          onClick={() => {
            setOfflineSynced(true);
            alert("Qoralama mahalliy xotirada saqlandi (Offline Draft Sync)!");
          }}
          className="btn btn-outline text-xs flex items-center gap-1.5"
        >
          <Save size={14} strokeWidth={1.5} />
          Qoralamani saqlash (Offline)
        </button>

        <button
          onClick={() => {
            if (!photoUploaded || !replicaMarkingDone) {
              alert("NUSXA tamg'asi fotosuratsiz yakunlanmaydi!");
              return;
            }
            if (isOutOfTolerance) {
              alert("O'lcham toleransdan oshgani uchun keyingi bosqich bloklangan!");
              return;
            }
            alert("Vazifa muvaffaqiyatli yakunlandi va Sifat Nazorati (QC) bo'limiga yuborildi!");
          }}
          className="btn btn-primary text-xs"
        >
          Sifat nazoratiga topshirish (WAITING_QC) &rarr;
        </button>
      </div>
    </div>
  );
}
