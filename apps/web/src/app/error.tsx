"use client";

import React from "react";
import Link from "next/link";
import { AlertTriangle, RefreshCw } from "lucide-react";

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="container max-w-md py-24 text-center space-y-6">
      <div className="w-16 h-16 rounded-[var(--radius-max)] bg-[#FDF1F0] text-[var(--danger)] flex items-center justify-center mx-auto">
        <AlertTriangle size={32} strokeWidth={1.5} />
      </div>

      <div className="space-y-2">
        <h1 className="text-3xl font-bold mono text-[var(--danger)]">500</h1>
        <h2 className="text-lg font-semibold text-[var(--ink)]">Kutilmagan tizim xatoligi</h2>
        <p className="text-xs text-[var(--ink-muted)]">
          Xatolik qayd etildi va ma'muriyatga yetkazildi. Iltimos, qayta urinib ko'ring.
        </p>
      </div>

      <div className="flex items-center justify-center gap-3">
        <button
          onClick={() => reset()}
          className="btn btn-primary text-xs inline-flex items-center gap-1.5"
        >
          <RefreshCw size={14} strokeWidth={1.5} /> Qayta yuklash
        </button>
        <Link href="/" className="btn btn-outline text-xs">
          Bosh sahifa
        </Link>
      </div>
    </div>
  );
}
