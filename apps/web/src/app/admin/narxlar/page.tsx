import React from "react";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { ArrowLeft, Settings, ShieldCheck, DollarSign } from "lucide-react";
import { APP_CONFIG } from "@naqshlab/shared";

export default async function AdminPricingAndTolerancesPage() {
  const priceRules = await prisma.priceRule.findMany({
    orderBy: { itemType: "asc" },
  });

  return (
    <div className="container py-12 space-y-8">
      <Link href="/admin" className="text-xs text-[var(--cobalt)] hover:underline flex items-center gap-1">
        <ArrowLeft size={12} /> Boshqaruv paneliga qaytish
      </Link>

      <div>
        <span className="mono text-xs uppercase text-[var(--cobalt)] tracking-wider block mb-1">
          Tizim Sozlamalari va Chegaralari
        </span>
        <h1 className="text-3xl font-bold">Narx Qoidalari va Sifat Toleranslari</h1>
        <p className="text-sm text-[var(--ink-muted)] mt-1">
          QC ruxsat etilgan og'ishlari va deterministik narxlash dvigateli parametrlari
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Tolerances Configuration */}
        <div className="card p-6 space-y-4">
          <h3 className="text-base font-bold text-[var(--ink)] flex items-center gap-2">
            <ShieldCheck size={18} className="text-[var(--cobalt)]" />
            Sifat Nazorati Toleranslari (QC Thresholds)
          </h3>
          <p className="text-xs text-[var(--ink-muted)]">
            Ushbu chegaralardan oshgan buyumlar avtomatik ravishda rad etiladi yoki ekspert qayta ko'rib chiqishiga yuboriladi.
          </p>

          <table className="studio-table">
            <tbody>
              <tr>
                <td className="text-[var(--ink-muted)] text-xs">Yagona koshin o'lchami toleransi:</td>
                <td className="mono text-xs font-bold">&plusmn;{APP_CONFIG.tolerances.tileDimensionsMm} mm</td>
              </tr>
              <tr>
                <td className="text-[var(--ink-muted)] text-xs">Panel moduli o'lchami toleransi:</td>
                <td className="mono text-xs font-bold">&plusmn;{APP_CONFIG.tolerances.panelModuleDimensionsMm} mm</td>
              </tr>
              <tr>
                <td className="text-[var(--ink-muted)] text-xs">O'rtacha CIEDE2000 rang farqi (dE00):</td>
                <td className="mono text-xs font-bold">&le; {APP_CONFIG.tolerances.meanDeltaE}</td>
              </tr>
              <tr>
                <td className="text-[var(--ink-muted)] text-xs">Maksimal CIEDE2000 rang farqi (dE00):</td>
                <td className="mono text-xs font-bold">&le; {APP_CONFIG.tolerances.maxDeltaE}</td>
              </tr>
              <tr>
                <td className="text-[var(--ink-muted)] text-xs">3D Skan 95-foiz masofasi:</td>
                <td className="mono text-xs font-bold">&le; {APP_CONFIG.tolerances.scan95thPercentileMm} mm</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Pricing Rules */}
        <div className="card p-6 space-y-4">
          <h3 className="text-base font-bold text-[var(--ink)] flex items-center gap-2">
            <DollarSign size={18} className="text-[var(--cobalt)]" />
            Narx Dvigateli Qoidalari (UZS)
          </h3>
          <p className="text-xs text-[var(--ink-muted)]">
            Standart narxlash koeffitsientlari va bazaviy stavkalar.
          </p>

          <table className="studio-table">
            <thead>
              <tr>
                <th>Element turi</th>
                <th>Narx / Koeffitsient</th>
                <th>Holat</th>
              </tr>
            </thead>
            <tbody>
              {priceRules.map((r) => (
                <tr key={r.id}>
                  <td className="mono text-xs font-semibold">{r.itemType}</td>
                  <td className="mono text-xs">
                    {r.basePriceUzs > 0 ? `${r.basePriceUzs.toLocaleString("uz-UZ")} UZS` : `${r.complexityMultiplier}x`}
                  </td>
                  <td>
                    <span className="status-chip success text-[10px]">FAOL</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
