import React from "react";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Plus, Folder, ArrowRight, Clock, ShieldCheck } from "lucide-react";

export default async function ProjectsPage() {
  const projects = await prisma.project.findMany({
    include: {
      client: true,
      pieces: {
        include: {
          certificate: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="container py-12 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="mono text-xs uppercase text-[var(--cobalt)] tracking-wider block mb-1">
            Buyurtmachi va Obidalar Kabineti
          </span>
          <h1 className="text-3xl font-bold">Loyihalar Ro'yxati</h1>
          <p className="text-sm text-[var(--ink-muted)] mt-1">
            Restavratsiya va ishlab chiqarish holatidagi barcha arxitektura loyihalari
          </p>
        </div>

        <Link href="/loyihalar/yangi" className="btn btn-primary self-start sm:self-auto">
          <Plus size={16} strokeWidth={1.5} /> Yangi loyiha boshlash
        </Link>
      </div>

      {/* Projects List or Empty State */}
      {projects.length === 0 ? (
        <div className="card p-12 text-center space-y-4">
          <div className="w-12 h-12 rounded-[var(--radius-max)] bg-[var(--mist)] text-[var(--ink-muted)] flex items-center justify-center mx-auto">
            <Folder size={24} strokeWidth={1.5} />
          </div>
          <div>
            <h3 className="text-base font-bold text-[var(--ink)]">
              Hozircha faol loyihalar mavjud emas
            </h3>
            <p className="text-xs text-[var(--ink-muted)] max-w-sm mx-auto mt-1">
              Birinchi restavratsiya koshinini tiklash uchun yangi loyiha qo'shing.
            </p>
          </div>
          <Link href="/loyihalar/yangi" className="btn btn-primary text-xs">
            + Yangi loyiha yaratish
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {projects.map((proj) => (
            <div
              key={proj.id}
              className="card p-6 hover:border-[var(--cobalt)] transition-colors flex flex-col md:flex-row md:items-center justify-between gap-6"
            >
              <div className="space-y-2 max-w-2xl">
                <div className="flex flex-wrap items-center gap-3">
                  <span className="mono text-xs font-semibold px-2 py-0.5 bg-[var(--mist)] border border-[var(--line)] text-[var(--cobalt)]">
                    {proj.objectType}
                  </span>
                  <span className="status-chip success text-xs">
                    {proj.status}
                  </span>
                  {proj.allowExternalAi && (
                    <span className="status-chip neutral text-xs">
                      AI Ruxsat berilgan
                    </span>
                  )}
                </div>

                <h3 className="text-xl font-bold text-[var(--ink)]">
                  <Link href={`/loyihalar/${proj.id}`} className="hover:text-[var(--cobalt)] text-[var(--ink)] no-underline">
                    {proj.name}
                  </Link>
                </h3>

                <p className="text-xs text-[var(--ink-muted)]">
                  Joylashuv: <b>{proj.location}</b> &bull; Davr va uslub: <b>{proj.periodStyle}</b>
                </p>

                {proj.notes && (
                  <p className="text-xs text-[var(--ink-muted)] line-clamp-1 italic">
                    "{proj.notes}"
                  </p>
                )}
              </div>

              {/* Actions & Status */}
              <div className="flex items-center gap-4 self-end md:self-center">
                {proj.pieces[0]?.certificate && (
                  <Link
                    href={`/v/${proj.pieces[0].certificate.serial}`}
                    className="btn btn-outline text-xs flex items-center gap-1.5"
                  >
                    <ShieldCheck size={14} strokeWidth={1.5} className="text-[var(--success)]" />
                    Sertifikat
                  </Link>
                )}
                <Link
                  href={`/loyihalar/${proj.id}`}
                  className="btn btn-primary text-xs flex items-center gap-1.5"
                >
                  Loyihani ochish <ArrowRight size={14} strokeWidth={1.5} />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
