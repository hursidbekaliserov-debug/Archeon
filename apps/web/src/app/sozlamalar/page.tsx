"use client";

import React, { useState } from "react";
import Link from "next/link";
import { BRAND_NAME, APP_CONFIG } from "@naqshlab/shared";
import { User, Globe, Bell, Shield, Save } from "lucide-react";

export default function SettingsPage() {
  const [locale, setLocale] = useState("uz-Latn");
  const [emailNotif, setEmailNotif] = useState(true);
  const [qcAlerts, setQcAlerts] = useState(true);
  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="container max-w-2xl py-12 space-y-8">
      <div>
        <span className="mono text-xs uppercase text-[var(--cobalt)] tracking-wider block mb-1">
          Foydalanuvchi va Tizim Sozlamalari
        </span>
        <h1 className="text-3xl font-bold">Sozlamalar</h1>
        <p className="text-sm text-[var(--ink-muted)] mt-1">
          Profil parametrlari, interfeys tili va bildirishnoma xabarnomalari
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Profile Section */}
        <div className="card p-6 space-y-4">
          <h3 className="text-base font-bold text-[var(--ink)] flex items-center gap-2">
            <User size={18} className="text-[var(--cobalt)]" />
            Foydalanuvchi profili
          </h3>

          <div className="form-group">
            <label className="form-label text-xs">F.I.SH. / Ism:</label>
            <input
              type="text"
              defaultValue="Farhod Karimov"
              className="form-input text-xs"
            />
          </div>

          <div className="form-group mb-0">
            <label className="form-label text-xs">Elektron pochta:</label>
            <input
              type="email"
              disabled
              defaultValue="client@archeon.uz"
              className="form-input text-xs bg-[var(--mist)] mono"
            />
          </div>
        </div>

        {/* Language & Locale Section */}
        <div className="card p-6 space-y-4">
          <h3 className="text-base font-bold text-[var(--ink)] flex items-center gap-2">
            <Globe size={18} className="text-[var(--cobalt)]" />
            Interfeys tili (i18n)
          </h3>
          <p className="text-xs text-[var(--ink-muted)]">
            Tizim barcha interfeys matnlarini to'liq 3 tilda taqdim etadi (Hard Rule Section 4).
          </p>

          <div className="grid grid-cols-3 gap-3">
            {[
              { code: "uz-Latn", label: "O'zbekcha (Lotin)", flag: "UZ" },
              { code: "ru", label: "Русский", flag: "RU" },
              { code: "en", label: "English", flag: "EN" },
            ].map((lang) => (
              <button
                key={lang.code}
                type="button"
                onClick={() => setLocale(lang.code)}
                className={`p-3 text-left border rounded-[var(--radius-max)] transition-colors ${
                  locale === lang.code
                    ? "border-[var(--cobalt)] bg-[var(--mist)] text-[var(--cobalt)] font-bold"
                    : "border-[var(--line)] bg-[var(--paper)] text-[var(--ink)] hover:border-[var(--ink-muted)]"
                }`}
              >
                <span className="mono text-xs block text-[var(--ink-muted)]">{lang.flag}</span>
                <span className="text-xs">{lang.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Notifications Section */}
        <div className="card p-6 space-y-4">
          <h3 className="text-base font-bold text-[var(--ink)] flex items-center gap-2">
            <Bell size={18} className="text-[var(--cobalt)]" />
            Bildirishnomalar
          </h3>

          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <input
                id="notif-email"
                type="checkbox"
                checked={emailNotif}
                onChange={(e) => setEmailNotif(e.target.checked)}
                className="mt-1 accent-[var(--cobalt)]"
              />
              <label htmlFor="notif-email" className="text-xs text-[var(--ink)] cursor-pointer">
                <b>Elektron pochta orqali yangilanishlar (SMTP)</b>
                <span className="block text-[var(--ink-muted)] mt-0.5">
                  Rekonstruksiya tasdiqlanishi va buyurtma holati o'zgarishi haqida xabar olish.
                </span>
              </label>
            </div>

            <div className="flex items-start gap-3">
              <input
                id="notif-qc"
                type="checkbox"
                checked={qcAlerts}
                onChange={(e) => setQcAlerts(e.target.checked)}
                className="mt-1 accent-[var(--cobalt)]"
              />
              <label htmlFor="notif-qc" className="text-xs text-[var(--ink)] cursor-pointer">
                <b>Sifat Nazorati (QC) ogohlantirishlari</b>
                <span className="block text-[var(--ink-muted)] mt-0.5">
                  O'lcham og'ishi yoki rang spektri me'yordan chiqqanda xabardor qilish.
                </span>
              </label>
            </div>
          </div>
        </div>

        {/* Save feedback and button */}
        <div className="flex items-center justify-between">
          {saved ? (
            <span className="text-xs font-semibold text-[var(--success)] mono">
              Sozlamalar saqlandi!
            </span>
          ) : (
            <span />
          )}
          <button type="submit" className="btn btn-primary text-xs flex items-center gap-1.5">
            <Save size={14} strokeWidth={1.5} /> Sozlamalarni saqlash
          </button>
        </div>
      </form>
    </div>
  );
}
