import React from "react";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import {
  TrendingUp,
  Activity,
  Layers,
  Settings,
  Users,
  ShieldCheck,
  CheckCircle2,
  Clock,
  ArrowRight,
  Database,
} from "lucide-react";

export default async function AdminDashboardPage() {
  const projectsCount = await prisma.project.count();
  const ordersCount = await prisma.order.count();
  const certsCount = await prisma.certificate.count();
  const auditLogsCount = await prisma.auditLog.count();

  // Metrics (Section 3.11):
  // - first-pass QC yield (~92%)
  // - rework rate (~8%)
  // - average lead time (14 days)
  // - revenue by route
  const stats = [
    { label: "Birinchi o'tish QC rentabelligi (Yield)", val: "92.4%", sub: "Me'yoriy toleransda", color: "var(--success)" },
    { label: "Qayta ishlash darajasi (Rework rate)", val: "7.6%", sub: "Mayda sirlash defektlari", color: "var(--warning)" },
    { label: "O'rtacha ishlab chiqarish muddati", val: "14 kun", sub: "Quritish va pishirish bilan", color: "var(--cobalt)" },
    { label: "Jami koshin tushumi (UZS)", val: "48.5 M", sub: "Kashi va Ganch bo'yicha", color: "var(--ink)" },
  ];

  return (
    <div className="container py-12 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="mono text-xs uppercase text-[var(--cobalt)] tracking-wider block mb-1">
            Operator Boshqaruv Markazi
          </span>
          <h1 className="text-3xl font-bold">Admin va Ishlab Chiqarish Analitikasi</h1>
          <p className="text-sm text-[var(--ink-muted)] mt-1">
            Ustaxonalar yuki, texnologik toleranslar va kriptografik audit nazorati
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link href="/admin/audit" className="btn btn-outline text-xs flex items-center gap-1.5">
            <ShieldCheck size={14} strokeWidth={1.5} /> Audit Jurnali
          </Link>
          <Link href="/admin/ishlab-chiqarish" className="btn btn-primary text-xs">
            Parametrlar to'plami &rarr;
          </Link>
        </div>
      </div>

      {/* Analytics KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s, idx) => (
          <div key={idx} className="card p-5 space-y-2">
            <span className="text-xs text-[var(--ink-muted)] font-medium block">{s.label}</span>
            <div className="text-2xl font-bold mono" style={{ color: s.color }}>{s.val}</div>
            <span className="text-[11px] text-[var(--ink-muted)] block">{s.sub}</span>
          </div>
        ))}
      </div>

      {/* Admin Modules Navigation */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Link href="/admin/ishlab-chiqarish" className="card p-6 space-y-3 hover:border-[var(--cobalt)] transition-colors no-underline">
          <div className="w-10 h-10 rounded-[var(--radius-max)] bg-[var(--mist)] text-[var(--cobalt)] flex items-center justify-center">
            <Layers size={20} strokeWidth={1.5} />
          </div>
          <h3 className="text-base font-bold text-[var(--ink)]">Parametrlar Kutubxonasi</h3>
          <p className="text-xs text-[var(--ink-muted)] leading-relaxed">
            Gil retseptlari, pishirish egri chiziqlari (firing profiles), qisqarish koeffitsientlari (shrinkage factor) va versiyalash.
          </p>
        </Link>

        <Link href="/admin/narxlar" className="card p-6 space-y-3 hover:border-[var(--cobalt)] transition-colors no-underline">
          <div className="w-10 h-10 rounded-[var(--radius-max)] bg-[var(--mist)] text-[var(--cobalt)] flex items-center justify-center">
            <Settings size={20} strokeWidth={1.5} />
          </div>
          <h3 className="text-base font-bold text-[var(--ink)]">Narx Qoidalari va Toleranslar</h3>
          <p className="text-xs text-[var(--ink-muted)] leading-relaxed">
            m² va chiziqli metr bazaviy stavkalari, murakkablik koeffitsientlari (A/B/C), QQS va tolerans chegaralari.
          </p>
        </Link>

        <Link href="/admin/audit" className="card p-6 space-y-3 hover:border-[var(--cobalt)] transition-colors no-underline">
          <div className="w-10 h-10 rounded-[var(--radius-max)] bg-[var(--mist)] text-[var(--cobalt)] flex items-center justify-center">
            <Database size={20} strokeWidth={1.5} />
          </div>
          <h3 className="text-base font-bold text-[var(--ink)]">Kriptografik Audit Jurnali</h3>
          <p className="text-xs text-[var(--ink-muted)] leading-relaxed">
            O'zgarmas SHA-256 xesh zanjiri, harakatlar logi va daxlsizlikni tekshiruvchi CLI utilitasi (make verify-audit).
          </p>
        </Link>
      </div>

      {/* Workshop Workload & Kiln Capacity */}
      <div className="card p-6 space-y-4">
        <h3 className="text-base font-bold text-[var(--ink)]">Ustaxonalar yuki va qoliplash quvvati</h3>
        <table className="studio-table">
          <thead>
            <tr>
              <th>Ustaxona nomi</th>
              <th>Yo'nalish</th>
              <th>Xumdon (Kiln) sig'imi</th>
              <th>Faol buyumlar</th>
              <th>Yuklanish darajasi</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="font-semibold">Rishtan Keramika Markazi (DEMO)</td>
              <td className="mono text-xs">KASHI (Mayolika)</td>
              <td className="mono text-xs">15 joy</td>
              <td className="mono text-xs font-bold text-[var(--cobalt)]">8 buyum</td>
              <td>
                <div className="w-32 h-2 bg-[var(--mist)] rounded-full overflow-hidden">
                  <div className="h-full bg-[var(--cobalt)]" style={{ width: "53%" }} />
                </div>
              </td>
            </tr>
            <tr>
              <td className="font-semibold">Toshkent Badiiy Ganch Studiyasi (DEMO)</td>
              <td className="mono text-xs">GANCH (Plaster)</td>
              <td className="mono text-xs">8 joy</td>
              <td className="mono text-xs font-bold text-[var(--cobalt)]">3 buyum</td>
              <td>
                <div className="w-32 h-2 bg-[var(--mist)] rounded-full overflow-hidden">
                  <div className="h-full bg-[var(--cobalt)]" style={{ width: "37%" }} />
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
