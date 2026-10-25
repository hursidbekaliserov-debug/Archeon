import React from "react";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { ShoppingBag, ArrowRight, FileText, CheckCircle2 } from "lucide-react";
import { REPLICA_STATEMENT_UZ, REPLICA_STATEMENT_EN } from "@naqshlab/shared";

export default async function OrdersPage() {
  const orders = await prisma.order.findMany({
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
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="container py-12 space-y-8">
      {/* Header */}
      <div>
        <span className="mono text-xs uppercase text-[var(--cobalt)] tracking-wider block mb-1">
          Mijoz va Ishlab chiqarish shartnomalari
        </span>
        <h1 className="text-3xl font-bold">Buyurtmalar va Shartnomalar</h1>
        <p className="text-sm text-[var(--ink-muted)] mt-1">
          Hisob-fakturalar, to'lov jadvallari va ishlab chiqarish bosqichlari
        </p>
      </div>

      {/* Orders List */}
      {orders.length === 0 ? (
        <div className="card p-12 text-center text-sm text-[var(--ink-muted)] space-y-3">
          <ShoppingBag size={32} className="mx-auto text-[var(--ink-muted)]" strokeWidth={1.5} />
          <p>Hozircha rasmiylashtirilgan buyurtmalar mavjud emas.</p>
          <Link href="/loyihalar" className="btn btn-primary text-xs">
            Loyihalarga o'tish
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((o) => (
            <div
              key={o.id}
              className="card p-6 flex flex-col md:flex-row md:items-center justify-between gap-6 hover:border-[var(--cobalt)] transition-colors"
            >
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <span className="mono text-xs font-semibold px-2 py-0.5 bg-[var(--mist)] border border-[var(--line)] text-[var(--cobalt)]">
                    BUYURTMA #{o.id.slice(0, 8).toUpperCase()}
                  </span>
                  <span className="status-chip success text-xs">
                    {o.status}
                  </span>
                </div>

                <h3 className="text-lg font-bold text-[var(--ink)]">
                  {o.project.name}
                </h3>

                <p className="text-xs text-[var(--ink-muted)]">
                  Jami summa: <b className="mono text-[var(--ink)]">{o.quote.totalUzs.toLocaleString("uz-UZ")} UZS</b> &bull; Shartnoma: <b>30/40/30 jadvali</b>
                </p>

                <div className="mono text-[11px] text-[var(--cobalt)]">
                  {REPLICA_STATEMENT_UZ} &bull; {REPLICA_STATEMENT_EN}
                </div>
              </div>

              <div className="flex items-center gap-3 self-end md:self-center">
                <Link href={`/buyurtmalar/${o.id}`} className="btn btn-outline text-xs flex items-center gap-1.5">
                  <FileText size={14} strokeWidth={1.5} /> Tafsilotlar
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
