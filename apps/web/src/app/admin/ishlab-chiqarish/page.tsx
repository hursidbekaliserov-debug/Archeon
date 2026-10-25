import React from "react";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { ArrowLeft, Plus, Layers, Flame, Droplet, Lock } from "lucide-react";

export default async function ProductionParametersPage() {
  const parameterSets = await prisma.parameterSet.findMany({
    include: {
      jobCards: true,
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="container py-12 space-y-8">
      <Link href="/admin" className="text-xs text-[var(--cobalt)] hover:underline flex items-center gap-1">
        <ArrowLeft size={12} /> Boshqaruv paneliga qaytish
      </Link>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="mono text-xs uppercase text-[var(--cobalt)] tracking-wider block mb-1">
            Texnologik Retseptlar va Standartlar
          </span>
          <h1 className="text-3xl font-bold">Parametrlar Kutubxonasi (ParameterSets)</h1>
          <p className="text-sm text-[var(--ink-muted)] mt-1">
            Gil va ganch retseptlari, pishirish jadvallari, qisqarish ko'rsatkichlari va muzlatilgan versiyalar
          </p>
        </div>

        <button className="btn btn-primary text-xs self-start sm:self-auto">
          + Yangi parametrlar to'plami
        </button>
      </div>

      <div className="p-3 bg-[var(--mist)] border border-[var(--line)] rounded-[var(--radius-max)] text-xs text-[var(--ink-muted)] mono">
        Qoida (Section 3.5): Buyurtmaga biriktirilgan parametrlar to'plami o'sha buyurtma uchun abadiy muzlatiladi (isFrozen = true). Yangi o'zgarishlar yangi versiya raqami bilan kiritiladi.
      </div>

      {/* ParameterSets Table */}
      <div className="card p-6 space-y-4">
        <table className="studio-table">
          <thead>
            <tr>
              <th>Yo'nalish</th>
              <th>Versiya</th>
              <th>Qisqarish (Shrinkage)</th>
              <th>Xomashyo retsepti</th>
              <th>Sirlash / Pishirish</th>
              <th>Holat</th>
            </tr>
          </thead>
          <tbody>
            {parameterSets.map((ps) => (
              <tr key={ps.id}>
                <td className="font-bold text-xs mono text-[var(--cobalt)]">{ps.route}</td>
                <td className="mono text-xs">v{ps.version}</td>
                <td className="mono text-xs">
                  X: +{(ps.shrinkageX * 100).toFixed(1)}% &bull; Y: +{(ps.shrinkageY * 100).toFixed(1)}% &bull; Z: +{(ps.shrinkageZ * 100).toFixed(1)}%
                </td>
                <td className="text-xs max-w-xs">{ps.clayPlasterRecipe}</td>
                <td className="text-xs text-[var(--ink-muted)]">
                  {ps.glazeRecipe || "Tabiiy ganch fiksatori"}
                </td>
                <td>
                  <span className={`status-chip ${ps.isFrozen ? "neutral" : "success"} text-[10px]`}>
                    {ps.isFrozen ? "MUZLATILGAN (FROZEN)" : "FAOL"}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
