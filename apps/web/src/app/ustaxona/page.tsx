import React from "react";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Hammer, CheckCircle2, AlertCircle, Camera, Ruler, ArrowRight, ShieldCheck } from "lucide-react";
import { REPLICA_STATEMENT_UZ, REPLICA_STATEMENT_EN } from "@naqshlab/shared";

export default async function WorkshopPortalPage() {
  const tasks = await prisma.task.findMany({
    include: {
      workshop: true,
      jobCard: {
        include: {
          piece: true,
          parameterSet: true,
        },
      },
      checklistSteps: true,
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="container py-12 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="mono text-xs uppercase text-[var(--cobalt)] tracking-wider block mb-1">
            Usta va Hamkor Ustaxonalar Portali
          </span>
          <h1 className="text-3xl font-bold">Ustaxona Vazifalar Doskasi</h1>
          <p className="text-sm text-[var(--ink-muted)] mt-1">
            Replikatsiya bosqichlari, texnologik cheklistlar va majburiy fotohisobotlar
          </p>
        </div>

        <span className="mono text-xs bg-[var(--mist)] border border-[var(--line)] px-3 py-1.5 self-start sm:self-auto text-[var(--ink)]">
          Usta: <b>Akmal Saidov (Rishtan Laboratoriyasi)</b>
        </span>
      </div>

      {/* Mandatory Replica Marking Notice */}
      <div className="replica-banner">
        <div>
          <span className="block font-bold text-sm">
            Majburiy qoida: Koshin orqa tamg'asi fotosuratsiz yakunlanmaydi (Rule R1)
          </span>
          <span className="block text-xs text-[var(--ink-muted)]">
            "{REPLICA_STATEMENT_UZ}" va seriya raqami loy holatida o'yilishi shart.
          </span>
        </div>
        <span className="mono text-xs bg-[var(--paper)] px-2 py-1 border border-[var(--line)]">
          QC imzosi taqiqlangan (Faqat EXPERT)
        </span>
      </div>

      {/* Task List */}
      <div className="space-y-4">
        {tasks.map((t) => {
          const completedSteps = t.checklistSteps.filter((s) => s.isCompleted).length;
          const totalSteps = t.checklistSteps.length;
          const piece = t.jobCard.piece;
          const isDone = t.status === "DONE";

          return (
            <div
              key={t.id}
              className="card p-6 hover:border-[var(--cobalt)] transition-colors flex flex-col md:flex-row md:items-center justify-between gap-6"
            >
              <div className="space-y-2 max-w-xl">
                <div className="flex flex-wrap items-center gap-3">
                  <span className="mono text-xs font-semibold px-2 py-0.5 bg-[var(--mist)] border border-[var(--line)] text-[var(--cobalt)]">
                    {piece.serial}
                  </span>
                  <span className={`status-chip ${isDone ? "success" : "neutral"} text-xs`}>
                    {t.status}
                  </span>
                  <span className="text-xs text-[var(--ink-muted)]">
                    {t.workshop.name}
                  </span>
                </div>

                <h3 className="text-lg font-bold text-[var(--ink)]">
                  {t.title}
                </h3>

                <p className="text-xs text-[var(--ink-muted)]">
                  Yo'nalish: <b>{t.jobCard.parameterSet.route}</b> &bull; Parametrlar to'plami: v{t.jobCard.parameterSet.version}
                </p>

                {/* Progress bar */}
                <div className="space-y-1 pt-1">
                  <div className="flex items-center justify-between text-[11px] mono text-[var(--ink-muted)]">
                    <span>Cheklist bajarilishi:</span>
                    <span>{completedSteps}/{totalSteps} qadam ({totalSteps > 0 ? Math.round((completedSteps / totalSteps) * 100) : 100}%)</span>
                  </div>
                  <div className="w-full h-1.5 bg-[var(--mist)] rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[var(--cobalt)]"
                      style={{ width: `${totalSteps > 0 ? (completedSteps / totalSteps) * 100 : 100}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-3 self-end md:self-center">
                <Link
                  href={`/ustaxona/vazifa/${t.id}`}
                  className="btn btn-primary text-xs flex items-center gap-1.5"
                >
                  Cheklistni ochish <ArrowRight size={14} strokeWidth={1.5} />
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
