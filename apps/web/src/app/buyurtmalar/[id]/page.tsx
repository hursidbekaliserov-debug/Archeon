import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { ArrowLeft, Download, CheckCircle2, Clock, CreditCard } from "lucide-react";
import { REPLICA_STATEMENT_UZ, REPLICA_STATEMENT_EN } from "@naqshlab/shared";

export default async function OrderDetailPage({ params }: { params: { id: string } }) {
  const order = await prisma.order.findUnique({
    where: { id: params.id },
    include: {
      project: true,
      quote: {
        include: {
          items: true,
        },
      },
      events: true,
      invoices: true,
    },
  });

  if (!order) {
    return notFound();
  }

  return (
    <div className="container max-w-3xl py-12 space-y-8">
      <Link href="/buyurtmalar" className="text-xs text-[var(--cobalt)] hover:underline flex items-center gap-1">
        <ArrowLeft size={12} /> Barcha buyurtmalarga qaytish
      </Link>

      <div className="card p-6 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[var(--line)] pb-4">
          <div>
            <span className="mono text-xs text-[var(--ink-muted)] block uppercase">
              Shartnoma kodi:
            </span>
            <h1 className="text-2xl font-bold mono text-[var(--cobalt)]">
              BUYURTMA #{order.id.slice(0, 8).toUpperCase()}
            </h1>
          </div>
          <span className="status-chip success text-xs">
            {order.status}
          </span>
        </div>

        {/* Mandatory Replica Banner on Contract */}
        <div className="replica-banner">
          <div>
            <span className="block font-bold text-xs">{REPLICA_STATEMENT_UZ}</span>
            <span className="block text-[11px] text-[var(--ink-muted)]">{REPLICA_STATEMENT_EN}</span>
          </div>
          <span className="mono text-xs bg-[var(--paper)] px-2 py-0.5 border border-[var(--line)]">
            Shartnoma kafolati
          </span>
        </div>

        {/* Invoice Summary */}
        <div className="space-y-3">
          <h3 className="text-sm font-bold text-[var(--ink)]">
            To'lov shartlari va Bank rekvizitlari
          </h3>
          <div className="p-4 bg-[var(--mist)] border border-[var(--line)] rounded-[var(--radius-max)] space-y-2 text-xs">
            <div>Bank: <b>"O'zsanoatqurilishbank" ATB, Bosh ofis</b></div>
            <div>Hisob raqam: <b className="mono">20208000900000123456</b></div>
            <div>MFO: <b className="mono">00440</b> &bull; STIR: <b className="mono">309123456</b></div>
            <div>To'lov maqsadi: <b>Buyurtma #{order.id.slice(0, 8).toUpperCase()} bo'yicha 30% bo'nak to'lovi</b></div>
          </div>
        </div>

        {/* Timeline Events */}
        <div className="space-y-3">
          <h3 className="text-sm font-bold text-[var(--ink)]">
            Ishlab chiqarish va to'lov xronologiyasi
          </h3>
          <div className="space-y-2 border-l-2 border-[var(--line)] pl-4 text-xs">
            <div className="space-y-0.5">
              <span className="font-bold text-[var(--ink)]">Shartnoma rasmiylashtirildi</span>
              <p className="text-[11px] text-[var(--ink-muted)] mono">To'lov jadvali: 30% / 40% / 30% tasdiqlandi</p>
            </div>
            <div className="space-y-0.5 pt-2">
              <span className="font-bold text-[var(--ink)]">3D Model va Qoliplash tasdiqlandi</span>
              <p className="text-[11px] text-[var(--ink-muted)] mono">Ekspert Shomurodov tomonidan tasdiqlangan</p>
            </div>
            <div className="space-y-0.5 pt-2">
              <span className="font-bold text-[var(--success)]">Sifat nazorati (QC) muvaffaqiyatli yakunlandi</span>
              <p className="text-[11px] text-[var(--ink-muted)] mono">Ed25519 raqamli imzosi bilan sertifikat chiqarildi</p>
            </div>
          </div>
        </div>

        <div className="pt-4 border-t border-[var(--line)] flex items-center justify-between">
          <span className="mono text-sm font-bold text-[var(--ink)]">
            Jami: {order.quote.totalUzs.toLocaleString("uz-UZ")} UZS
          </span>
          <button
            onClick={() => alert("Shartnoma hujjati (PDF) yuklab olinmoqda...")}
            className="btn btn-outline text-xs flex items-center gap-1.5"
          >
            <Download size={14} strokeWidth={1.5} /> Shartnoma PDF (A4)
          </button>
        </div>
      </div>
    </div>
  );
}
