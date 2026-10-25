import React from "react";
import Link from "next/link";
import { BRAND_NAME, REPLICA_STATEMENT_UZ, REPLICA_STATEMENT_EN } from "@naqshlab/shared";
import { ShieldCheck, ExternalLink, Cpu, Ruler, Award } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t border-[var(--line)] bg-[rgba(6,9,19,0.92)] mt-24 relative overflow-hidden">
      {/* Decorative Blueprint Line Accent */}
      <div 
        className="w-full"
        style={{
          height: "2px",
          background: "linear-gradient(90deg, transparent 0%, rgba(56, 189, 248, 0.4) 50%, transparent 100%)",
        }}
      />

      <div className="container py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Brand Intro */}
          <div>
            <div className="flex items-center gap-2.5 mb-3">
              <div className="w-8 h-8 rounded-[var(--radius-sm)] bg-gradient-to-br from-[#1E40AF] to-[#0284C7] flex items-center justify-center font-bold text-white text-sm border border-cyan-400/40">
                A
              </div>
              <span className="font-extrabold text-lg tracking-wider text-white font-mono" style={{ fontFamily: "var(--font-brand, sans-serif)" }}>
                {BRAND_NAME.toUpperCase()}
              </span>
            </div>
            <p className="text-xs text-[var(--ink-muted)] leading-relaxed">
              Tarixiy obidalarni tiklash, me'moriy loyihalar va hashamatli qarorgohlar uchun an'anaviy kashi (mayolika) va ganch o'ymakorligining sertifikatlangan, metrik yuqori aniqlikdagi ilmiy nusxalari.
            </p>
          </div>

          {/* Platform Nav */}
          <div>
            <h4 className="text-xs font-semibold text-white uppercase tracking-wider mb-3 font-mono">
              Platforma
            </h4>
            <ul className="text-xs space-y-2 text-[var(--ink-muted)]">
              <li><Link href="/jarayon" className="hover:text-cyan-400 transition-colors">7 bosqichli ishlab chiqarish</Link></li>
              <li><Link href="/katalog" className="hover:text-cyan-400 transition-colors">Naqshlar katalogi (20+)</Link></li>
              <li><Link href="/loyihalar" className="hover:text-cyan-400 transition-colors">Loyihalar kabineti</Link></li>
              <li><Link href="/ustaxona" className="hover:text-cyan-400 transition-colors">Ustaxona & CNC portali</Link></li>
            </ul>
          </div>

          {/* Verification & Trust */}
          <div>
            <h4 className="text-xs font-semibold text-white uppercase tracking-wider mb-3 font-mono">
              Meros va Nazorat
            </h4>
            <ul className="text-xs space-y-2 text-[var(--ink-muted)]">
              <li><Link href="/v/NLB-KSH-2026-000001" className="hover:text-cyan-400 transition-colors">Ommaviy sertifikat tekshiruvi</Link></li>
              <li><Link href="/admin" className="hover:text-cyan-400 transition-colors">Kriptografik audit jurnali</Link></li>
              <li><Link href="/jarayon" className="hover:text-cyan-400 transition-colors">CIEDE2000 rang nazorati</Link></li>
              <li><Link href="/sozlamalar" className="hover:text-cyan-400 transition-colors">Maxfiylik va Huquqlar</Link></li>
            </ul>
          </div>

          {/* Contact & Workshops */}
          <div>
            <h4 className="text-xs font-semibold text-white uppercase tracking-wider mb-3 font-mono">
              Aloqa & Ishlab chiqarish
            </h4>
            <p className="text-xs text-[var(--ink-muted)] leading-relaxed mb-2">
              Hamkor ustaxonalar: Rishton keramika laboratoriyasi, Toshkent badiiy ganchkorlik studiyasi.
            </p>
            <p className="text-xs mono text-cyan-400">info@archeon.uz</p>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="pt-6 border-t border-[var(--line)] flex flex-col md:flex-row items-center justify-between text-xs text-[var(--ink-muted)]">
          <p>&copy; {new Date().getFullYear()} {BRAND_NAME}. Barcha huquqlar himoyalangan.</p>
          <p className="mono text-[11px] mt-2 md:mt-0 text-slate-400">
            Arxitektura va ishlab chiqarish dasturiy ta'minoti &bull; Versiya 1.0.0
          </p>
        </div>
      </div>
    </footer>
  );
}
