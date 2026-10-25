"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { BRAND_NAME, MICROCOPY, ObjectType } from "@naqshlab/shared";
import { Check, UploadCloud, ShieldCheck, ArrowRight, ArrowLeft } from "lucide-react";

export default function NewProjectWizardPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form State
  const [name, setName] = useState("");
  const [location, setLocation] = useState("");
  const [objectType, setObjectType] = useState<ObjectType>("KASHI_TILE");
  const [periodStyle, setPeriodStyle] = useState("");
  const [notes, setNotes] = useState("");
  const [allowExternalAi, setAllowExternalAi] = useState(false);
  const [hasConsent, setHasConsent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!hasConsent) {
      alert("Huquqiy rozilik bildirish majburiy (Rule R7)!");
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch("/api/v1/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          location,
          objectType,
          periodStyle,
          notes,
          allowExternalAi,
          hasConsent,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        router.push(`/loyihalar/${data.project.id}`);
      } else {
        const err = await res.json();
        alert(`Xatolik: ${err.message || "Loyiha saqlanmadi"}`);
      }
    } catch (error) {
      // Fallback redirect for offline demo
      router.push("/loyihalar");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container max-w-3xl py-12 space-y-8">
      <div>
        <span className="mono text-xs uppercase text-[var(--cobalt)] tracking-wider block mb-1">
          Loyiha yaratish ustasi
        </span>
        <h1 className="text-3xl font-bold">Yangi obida restavratsiyasi loyihasi</h1>
      </div>

      {/* Wizard Progress Stepper */}
      <div className="grid grid-cols-3 gap-2 border-b border-[var(--line)] pb-4 text-xs font-semibold">
        <div className={`flex items-center gap-2 ${step >= 1 ? "text-[var(--cobalt)]" : "text-[var(--ink-muted)]"}`}>
          <span className="w-6 h-6 rounded-full border flex items-center justify-center mono">1</span>
          <span>Asosiy ma'lumotlar</span>
        </div>
        <div className={`flex items-center gap-2 ${step >= 2 ? "text-[var(--cobalt)]" : "text-[var(--ink-muted)]"}`}>
          <span className="w-6 h-6 rounded-full border flex items-center justify-center mono">2</span>
          <span>Huquqiy rozilik (R7)</span>
        </div>
        <div className={`flex items-center gap-2 ${step >= 3 ? "text-[var(--cobalt)]" : "text-[var(--ink-muted)]"}`}>
          <span className="w-6 h-6 rounded-full border flex items-center justify-center mono">3</span>
          <span>Manba fayllari</span>
        </div>
      </div>

      <div className="card p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* STEP 1: Basic Project Info */}
          {step === 1 && (
            <div className="space-y-4">
              <div className="form-group">
                <label className="form-label" htmlFor="proj-name">
                  Loyiha / Obida nomi: *
                </label>
                <input
                  id="proj-name"
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="masalan: Registon Tillakori Madrassa burchak koshini"
                  className="form-input"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="form-group">
                  <label className="form-label" htmlFor="proj-loc">
                    Joylashuv / Bino: *
                  </label>
                  <input
                    id="proj-loc"
                    type="text"
                    required
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="masalan: Samarqand shahri, Registon"
                    className="form-input"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="proj-type">
                    Obyekt turi: *
                  </label>
                  <select
                    id="proj-type"
                    value={objectType}
                    onChange={(e) => setObjectType(e.target.value as ObjectType)}
                    className="form-select"
                  >
                    <option value="KASHI_TILE">Sirlangan Koshin (Kashi Tile)</option>
                    <option value="GANCH_PANEL">O'yma Ganch Paneli (Ganch Panel)</option>
                    <option value="MIXED">Aralash me'moriy modul (Mixed)</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="proj-style">
                  Tarixiy davr va naqsh uslubi:
                </label>
                <input
                  id="proj-style"
                  type="text"
                  value={periodStyle}
                  onChange={(e) => setPeriodStyle(e.target.value)}
                  placeholder="masalan: XV asr Temuriylar davri girih va islimi mayolika"
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="proj-notes">
                  Qo'shimcha izohlar:
                </label>
                <textarea
                  id="proj-notes"
                  rows={3}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Shikastlanish darajasi, qolip ehtiyoji yoki o'ziga xos talablar..."
                  className="form-textarea"
                />
              </div>

              {/* External AI Flag Checkbox */}
              <div className="p-3 bg-[var(--mist)] border border-[var(--line)] rounded-[var(--radius-max)] flex items-start gap-3">
                <input
                  id="allow-ai"
                  type="checkbox"
                  checked={allowExternalAi}
                  onChange={(e) => setAllowExternalAi(e.target.checked)}
                  className="mt-1 accent-[var(--cobalt)] cursor-pointer"
                />
                <label htmlFor="allow-ai" className="text-xs text-[var(--ink)] cursor-pointer">
                  <b>Tashqi AI tahliliga ruxsat berish (Google Gemini Vision)</b>
                  <span className="block text-[var(--ink-muted)] mt-0.5">
                    Standart holatda o'chirilgan (OFF). Faqat rozilik berilganda ornoment xususiyatlarini aniqlash uchun tashqi modelga maslahat so'rovi yuboriladi.
                  </span>
                </label>
              </div>

              <div className="flex justify-end pt-4">
                <button
                  type="button"
                  onClick={() => {
                    if (!name || !location) {
                      alert("Loyiha nomi va joylashuvini kiriting.");
                      return;
                    }
                    setStep(2);
                  }}
                  className="btn btn-primary text-xs"
                >
                  Keyingi bosqich: Huquqiy rozilik &rarr;
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: Rights Consent (Rule R7) */}
          {step === 2 && (
            <div className="space-y-6">
              <div className="p-4 bg-[var(--mist)] border-l-4 border-[var(--cobalt)] rounded-r-[var(--radius-max)] space-y-2">
                <h3 className="text-sm font-bold text-[var(--ink)]">
                  Meros va intellektual huquqlar kafolati (Rule R7)
                </h3>
                <p className="text-xs text-[var(--ink-muted)] leading-relaxed">
                  {BRAND_NAME} milliy meros obidalarining daxlsizligini hurmat qiladi. Tizimga fotosuratlar, 3D skanlar yoki o'lchov hujjatlarini yuklashdan avval siz yuklanayotgan materiallarga qonuniy egalik huquqiga ega ekanligingizni tasdiqlashingiz shart.
                </p>
              </div>

              <div className="p-4 bg-[var(--paper)] border border-[var(--line)] rounded-[var(--radius-max)] space-y-3">
                <div className="flex items-start gap-3">
                  <input
                    id="consent-check"
                    type="checkbox"
                    required
                    checked={hasConsent}
                    onChange={(e) => setHasConsent(e.target.checked)}
                    className="mt-1 h-4 w-4 accent-[var(--cobalt)] cursor-pointer"
                  />
                  <label htmlFor="consent-check" className="text-xs font-semibold text-[var(--ink)] cursor-pointer leading-normal">
                    "Men yuklanayotgan fotosuratlar, 3D skanlar va o'lchov materiallarini qayta ishlash, geometrik tahlil qilish va nusxa ishlab chiqarish huquqiga ega ekanligimni tasdiqlayman."
                  </label>
                </div>
                <div className="text-[11px] mono text-[var(--ink-muted)] pl-7">
                  Rozilik qayd etilganda foydalanuvchi ID, vaqt va SHA-256 xeshlangan IP manzil audit jurnaliga muhrlanadi.
                </div>
              </div>

              <div className="flex justify-between pt-4">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="btn btn-outline text-xs"
                >
                  &larr; Orqaga
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (!hasConsent) {
                      alert(MICROCOPY.consentRequired);
                      return;
                    }
                    setStep(3);
                  }}
                  className="btn btn-primary text-xs"
                >
                  Keyingi bosqich: Manba yuklash &rarr;
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: Source Ingestion */}
          {step === 3 && (
            <div className="space-y-6">
              <div className="p-6 border-2 border-dashed border-[var(--line)] rounded-[var(--radius-max)] text-center space-y-3 bg-[var(--mist)]">
                <UploadCloud size={36} className="text-[var(--cobalt)] mx-auto" strokeWidth={1.5} />
                <div>
                  <h3 className="text-sm font-bold text-[var(--ink)]">
                    Original fotosuratlar va 3D skanlarni yuklash
                  </h3>
                  <p className="text-xs text-[var(--ink-muted)] mt-1">
                    JPG, PNG, TIFF (50 MB gacha) yoki OBJ, PLY, STL (500 MB gacha). Magic bytes tekshiriladi.
                  </p>
                </div>
                <input type="file" multiple className="text-xs mono" />
              </div>

              <div className="p-3 bg-[var(--mist)] border border-[var(--line)] rounded-[var(--radius-max)] text-xs text-[var(--ink-muted)] mono">
                Nishon: ArUco / Shaxmat doskasi aniqlanganda avtomatik metrik kalibratsiya qo'llanadi.
              </div>

              <div className="flex justify-between pt-4">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="btn btn-outline text-xs"
                >
                  &larr; Orqaga
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="btn btn-primary text-xs"
                >
                  {isSubmitting ? "Saqlanmoqda..." : "Loyihani tasdiqlash va yaratish"}
                </button>
              </div>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
