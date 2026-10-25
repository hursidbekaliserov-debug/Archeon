import React from "react";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import CatalogMotifGrid from "@/components/CatalogMotifGrid";

interface CatalogPageProps {
  searchParams?: {
    family?: string;
    symmetry?: string;
  };
}

export default async function CatalogPage({ searchParams }: CatalogPageProps) {
  const familyFilter = searchParams?.family;
  const symmetryFilter = searchParams?.symmetry;

  const whereClause: any = {};
  if (familyFilter && familyFilter !== "ALL") {
    whereClause.family = familyFilter;
  }
  if (symmetryFilter && symmetryFilter !== "ALL") {
    whereClause.symmetryGroup = symmetryFilter;
  }

  const motifs = await prisma.motif.findMany({
    where: whereClause,
    orderBy: { code: "asc" },
  });

  return (
    <div className="container py-12 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <span className="mono text-xs uppercase text-cyan-400 tracking-wider block mb-1 font-semibold">
            ARCHEON ME'MORIY MEROSI
          </span>
          <h1 className="text-3xl font-extrabold text-white">An'anaviy Naqshlar Katalogi</h1>
          <p className="text-sm text-[var(--ink-muted)] mt-1">
            Restavratsiya va to'ldirish uchun 20 ta original me'moriy naqshlar fondi
          </p>
        </div>
      </div>

      {/* Interactive Catalog Grid with 3D Modal Preview */}
      <CatalogMotifGrid motifs={motifs} initialFamily={familyFilter} />
    </div>
  );
}
