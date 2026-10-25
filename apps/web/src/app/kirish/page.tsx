"use client";

import React, { useState } from "react";
import Link from "next/link";
import { BRAND_NAME, MICROCOPY } from "@naqshlab/shared";
import { Mail, CheckCircle2, ArrowRight } from "lucide-react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [role, setRole] = useState("CLIENT");

  const handleSendMagicLink = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setSent(true);
  };

  return (
    <div className="container max-w-md py-20 space-y-8">
      <div className="text-center space-y-2">
        <div className="w-12 h-12 rounded-[var(--radius-sm)] bg-gradient-to-br from-[#1E40AF] to-[#0284C7] flex items-center justify-center font-bold text-white text-xl mx-auto mb-3 border border-cyan-400/40 shadow-lg shadow-cyan-500/20 font-mono">
          A
        </div>
        <h1 className="text-2xl font-extrabold text-white">{BRAND_NAME}ga kirish</h1>
        <p className="text-sm text-[var(--ink-muted)]">
          Parolsiz xavfsiz seans (Sehrli havola / Magic Link)
        </p>
      </div>

      <div className="card p-6 space-y-6">
        {sent ? (
          <div className="text-center space-y-4 py-4">
            <CheckCircle2 className="text-emerald-400 mx-auto" size={40} strokeWidth={1.5} />
            <h3 className="text-base font-bold text-white">
              Kirish havolasi yuborildi!
            </h3>
            <p className="text-xs text-[var(--ink-muted)] leading-relaxed">
              <b>{email}</b> elektron pochtasiga bir martalik tasdiqlash havolasi jo'natildi (Mailpit test porti: 8025).
            </p>
            <div className="pt-2">
              <Link href="/loyihalar" className="btn btn-primary text-xs w-full">
                Loyihalar kabinetiga o'tish (DEMO) &rarr;
              </Link>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSendMagicLink} className="space-y-4">
            <div className="form-group">
              <label htmlFor="email" className="form-label">
                Elektron pochta manzili:
              </label>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="masalan: farhod@archeon.uz"
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Demo hisobni tanlash:</label>
              <select
                className="form-select"
                onChange={(e) => {
                  const r = e.target.value;
                  setRole(r);
                  if (r === "CLIENT") setEmail("client@archeon.uz");
                  if (r === "EXPERT") setEmail("expert@archeon.uz");
                  if (r === "WORKSHOP") setEmail("workshop@archeon.uz");
                  if (r === "OPERATOR") setEmail("operator@archeon.uz");
                }}
              >
                <option value="CLIENT">Mijoz (client@archeon.uz)</option>
                <option value="EXPERT">Ekspert (expert@archeon.uz)</option>
                <option value="WORKSHOP">Ustaxona (workshop@archeon.uz)</option>
                <option value="OPERATOR">Operator (operator@archeon.uz)</option>
              </select>
            </div>

            <button type="submit" className="btn btn-primary w-full">
              <Mail size={16} strokeWidth={1.5} /> Sehrli havola olish
            </button>
          </form>
        )}

        <div className="border-t border-[var(--line)] pt-4 text-center">
          <p className="text-[11px] text-[var(--ink-muted)]">
            Kirish orqali siz meros qoidalarimiz va maxfiylik siyosatiga rozilik bildirasiz.
          </p>
        </div>
      </div>
    </div>
  );
}
