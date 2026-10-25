"use client";

import React, { useState } from "react";
import Link from "next/link";
import { BRAND_NAME, MICROCOPY, APP_CONFIG } from "@naqshlab/shared";
import { Compass, Box, Hammer, ShieldCheck, FileText, Settings, User, Menu, X, Sparkles } from "lucide-react";

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header
      style={{
        position: "relative",
        top: "auto",
        backgroundColor: "#060913",
        width: "100%",
        zIndex: 30,
      }}
      className="border-b border-[var(--line)]"
    >
      {/* Luminous Architectural Line */}
      <div className="h-[2px] w-full" style={{ height: "2px", background: "linear-gradient(90deg, transparent 0%, rgba(56, 189, 248, 0.4) 50%, transparent 100%)" }} />

      <div className="container flex items-center justify-between h-16">
        {/* Brand Logo & Tagline */}
        <Link href="/" className="flex items-center gap-3 no-underline group">
          <div className="relative w-10 h-10 flex items-center justify-center rounded-[var(--radius-sm)] bg-gradient-to-br from-[#1E40AF] to-[#0284C7] shadow-lg shadow-blue-500/20 border border-[rgba(56,189,248,0.4)]">
            {/* Geometric Girih Star Accent */}
            <svg viewBox="0 0 40 40" className="w-6 h-6 stroke-cyan-300 fill-none" strokeWidth="1.5">
              <polygon points="20,4 25,14 36,15 28,24 30,35 20,30 10,35 12,24 4,15 15,14" strokeOpacity="0.75" />
              <path d="M15 28 L20 12 L25 28 M17 23 L23 23" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-xl tracking-wider text-white block leading-none font-mono" style={{ fontFamily: "var(--font-brand, sans-serif)", letterSpacing: "0.12em" }}>
                {BRAND_NAME.toUpperCase()}
              </span>
            </div>
            <span className="text-[10px] text-[var(--ink-muted)] block leading-none mt-1 tracking-wider uppercase">
              Raqamli Me'moriy Tiklash
            </span>
          </div>
        </Link>

        {/* Navigation Links */}
        <nav className="hidden md:flex items-center gap-1 text-sm font-medium">
          <Link href="/jarayon" className="px-3 py-1.5 rounded-[var(--radius-sm)] text-[var(--ink-secondary)] hover:text-white hover:bg-[rgba(255,255,255,0.06)] transition-all">
            Jarayon
          </Link>
          <Link href="/katalog" className="px-3 py-1.5 rounded-[var(--radius-sm)] text-[var(--ink-secondary)] hover:text-white hover:bg-[rgba(255,255,255,0.06)] transition-all">
            Katalog
          </Link>
          <Link href="/loyihalar" className="px-3 py-1.5 rounded-[var(--radius-sm)] text-[var(--ink-secondary)] hover:text-white hover:bg-[rgba(255,255,255,0.06)] transition-all">
            Loyihalar
          </Link>
          <Link href="/buyurtmalar" className="px-3 py-1.5 rounded-[var(--radius-sm)] text-[var(--ink-secondary)] hover:text-white hover:bg-[rgba(255,255,255,0.06)] transition-all">
            Buyurtmalar
          </Link>
          <Link href="/ustaxona" className="px-3 py-1.5 rounded-[var(--radius-sm)] text-[var(--ink-secondary)] hover:text-white hover:bg-[rgba(255,255,255,0.06)] transition-all">
            Ustaxona
          </Link>
          <Link href="/admin" className="px-3 py-1.5 rounded-[var(--radius-sm)] text-[var(--ink-secondary)] hover:text-white hover:bg-[rgba(255,255,255,0.06)] transition-all">
            Boshqaruv
          </Link>
        </nav>

        {/* Actions */}
        <div className="hidden sm:flex items-center gap-3">
          <Link
            href="/v/NLB-KSH-2026-000001"
            className="btn btn-outline text-xs py-1.5 px-3 flex items-center gap-1.5"
            title="Sertifikatni tekshirish"
          >
            <ShieldCheck size={14} className="text-cyan-400" strokeWidth={1.75} />
            Tekshirish
          </Link>

          <Link href="/loyihalar/yangi" className="btn btn-primary text-xs py-1.5 px-3">
            + Yangi loyiha
          </Link>
        </div>

        {/* Mobile menu trigger */}
        <button
          type="button"
          className="md:hidden p-2 rounded text-[var(--ink-secondary)] hover:text-white"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle Navigation"
        >
          {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-[var(--line)] bg-[#060913] px-4 py-4 space-y-2">
          <Link href="/jarayon" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-sm text-[var(--ink-secondary)] hover:text-white">
            Jarayon
          </Link>
          <Link href="/katalog" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-sm text-[var(--ink-secondary)] hover:text-white">
            Katalog
          </Link>
          <Link href="/loyihalar" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-sm text-[var(--ink-secondary)] hover:text-white">
            Loyihalar
          </Link>
          <Link href="/buyurtmalar" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-sm text-[var(--ink-secondary)] hover:text-white">
            Buyurtmalar
          </Link>
          <Link href="/ustaxona" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-sm text-[var(--ink-secondary)] hover:text-white">
            Ustaxona
          </Link>
          <Link href="/admin" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-sm text-[var(--ink-secondary)] hover:text-white">
            Boshqaruv
          </Link>
          <div className="pt-2 flex flex-col gap-2">
            <Link href="/loyihalar/yangi" onClick={() => setMobileMenuOpen(false)} className="btn btn-primary text-xs py-2 text-center">
              + Yangi loyiha
            </Link>
            <Link href="/v/NLB-KSH-2026-000001" onClick={() => setMobileMenuOpen(false)} className="btn btn-outline text-xs py-2 text-center flex items-center justify-center gap-1.5">
              <ShieldCheck size={14} className="text-cyan-400" />
              Sertifikatni tekshirish
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
