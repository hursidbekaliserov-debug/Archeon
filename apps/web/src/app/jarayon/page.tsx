import React from "react";
import Link from "next/link";
import { BRAND_NAME, MICROCOPY, REPLICA_STATEMENT_UZ, REPLICA_STATEMENT_EN } from "@naqshlab/shared";
import { Camera, Cpu, UserCheck, Box, Hammer, ShieldCheck, Award, ArrowRight } from "lucide-react";

export default function ProcessPage() {
  const steps = [
    {
      num: "01",
      icon: Camera,
      title: "Manbani suratga olish va metrik kalibratsiya",
      subtitle: "ArUco nishoni va homografiya orqali perspektivani to'g'rilash",
      details: [
        "Suratga olishda ArUco yoki shaxmat doskasi metrik nishon sifatida ishlatiladi.",
        "Perspektiv buzilishlar homografiya matritsasi orqali to'g'rilanib, aniq px/mm ko'rsatkichi hisoblanadi.",
        "Mijoz huquqiy rozilik bildirmaguncha suratlar qabul qilinmaydi (Rule R7).",
        "Asl fayllar o'zgarmas holatda SHA-256 xeshi bilan saqlanadi.",
      ],
    },
    {
      num: "02",
      icon: Cpu,
      title: "Naqsh va simmetriya tahlili (Geometriya ishchisi)",
      subtitle: "2D FFT davriylik va C2–C8 aylanma simmetriya guruhlari",
      details: [
        "2D FFT va autokorrelyatsiya yordamida naqshning asosiy takrorlanish davri (Tx, Ty) topiladi.",
        "Aylanma simmetriya (C2, C4, C6, C8) va oyna simmetriyasi bo'yicha ishonchlilik koeffitsienti hisoblanadi.",
        "Tizim sirlardagi yoriqlar va qolip choklarini avtomatik ajratib, shikastlanish niqobini taklif qiladi.",
      ],
    },
    {
      num: "03",
      icon: UserCheck,
      title: "AI yordamida rekonstruksiya va Ekspert tasdig'i",
      subtitle: "AI faqat taklif beradi — har bir o'zgarish usta tomonidan tasdiqlanadi (Rule R3)",
      details: [
        "Har bir shikastlangan maydon uchun 3 ta variant taklif qilinadi: simmetriya nusxasi, patch inpainting va katalog motifi.",
        "Ekspert ko'rib chiqib tasdiqlamaguncha model ishlab chiqarishga o'tmaydi.",
        "Har bir tasdiqlash audit jurnaliga (foydalanuvchi, vaqt, xesh) muhrlanadi.",
      ],
    },
    {
      num: "04",
      icon: Box,
      title: "3D modellashtirish va panel bo'laklash",
      subtitle: "Suvo'tkazmas 2-manifold panellar va 300x180mm modullarga bo'lish",
      details: [
        "16-bit relyef xaritasidan 8mm qalinlikdagi asos plitasi bo'lgan monolit 3D mesh quriladi.",
        "Yirik arxitektura panellari CNC ish maydoniga mos ravishda qulflar bilan avtomatik bo'linadi.",
        "Qolipdan ajralish burchagi (draft angle >= 2°) va yupqa devorlar tekshiriladi.",
      ],
    },
    {
      num: "05",
      icon: Hammer,
      title: "Ustaxonada ishlab chiqarish va Majburiy Tamg'a",
      subtitle: "Qisqarish kompensatsiyasi (1+s) va orqa tomoniga majburiy nusxa belgisi (Rule R1)",
      details: [
        "Qisqarish foizi bo'yicha model masshtablanadi (Kashi uchun ~8.5%, Ganch uchun ~0.8%).",
        "CNC router uchun GRBL 1.1 G-code dasturi generatsiya qilinadi.",
        "Pishirishdan oldin koshin orqasiga seriya raqami va 'NUSXA — ASL EMAS' yozuvi o'yilib, fotohisobot yuklanadi.",
      ],
    },
    {
      num: "06",
      icon: ShieldCheck,
      title: "Metrologiya va CIEDE2000 Sifat Nazorati (QC)",
      subtitle: "Shtangensirkul o'lchovlari, 3D skan og'ishi va spektrofotometriya",
      details: [
        "CIEDE2000 formulasi bo'yicha rang farqi dE00 hisoblanadi (o'rtacha <= 2.0, maksimal <= 3.0).",
        "Tayyor buyum o'lchamlari shtangensirkul bilan 0.5 mm aniqlikda tekshiriladi.",
        "O'lchanmagan ko'rsatkichlar hisobotda 'o'lchanmagan' deb xolisona ko'rsatiladi.",
      ],
    },
    {
      num: "07",
      icon: Award,
      title: "Kriptografik Sertifikatlash va Yetkazib berish",
      subtitle: "RFC 8785 Canonical JSON, Ed25519 raqamli imzosi va ommaviy QR kod",
      details: [
        "Har bir buyum uchun alohida serial raqam (NLB-KSH-YYYY-NNNNNN) generatsiya qilinadi.",
        "Ekspert o'zining Ed25519 shaxsiy kaliti bilan o'tgan QC ma'lumotlarini imzolaydi.",
        "Ommaviy /v/{serial} sahifasida buyumning haqiqiyligi, parametrlar to'plami va sinov natijalari ko'rsatiladi.",
      ],
    },
  ];

  return (
    <div className="container max-w-4xl py-12 space-y-12">
      <div className="space-y-4">
        <span className="mono text-xs uppercase text-cyan-400 tracking-wider font-semibold">
          ARCHEON METODOLOGIYASI VA STANDARTLARI
        </span>
        <h1 className="text-3xl lg:text-4xl font-extrabold text-white">
          7 bosqichli sertifikatlangan ishlab chiqarish jarayoni
        </h1>
        <p className="text-base text-[var(--ink-muted)] leading-relaxed">
          {BRAND_NAME} me'moriy muhandislik markazi an'anaviy me'moriy koshin va ganch o'ymakorligini ilmiy asosda tiklash uchun qat'iy tekshirilgan jarayondan foydalanadi.
        </p>
      </div>

      {/* Process Stepper */}
      <div className="space-y-6">
        {steps.map((s, idx) => {
          const Icon = s.icon;
          return (
            <div key={idx} className="card p-6 border-l-4 border-l-cyan-400 space-y-4 hover:border-cyan-500/40 transition-all">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-[var(--radius-sm)] bg-blue-950/70 border border-blue-500/30 text-cyan-400 flex items-center justify-center font-bold shadow-lg shadow-blue-500/10">
                    <Icon size={20} strokeWidth={1.75} />
                  </div>
                  <div>
                    <span className="mono text-xs text-cyan-400 font-bold tracking-wider">{s.num}-BOSQICH</span>
                    <h3 className="text-lg font-bold text-white">{s.title}</h3>
                  </div>
                </div>
              </div>

              <p className="text-sm font-semibold text-cyan-200">{s.subtitle}</p>

              <ul className="text-xs text-[var(--ink-muted)] space-y-2 list-disc list-inside">
                {s.details.map((d, dIdx) => (
                  <li key={dIdx} className="leading-relaxed">{d}</li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>

      <div className="text-center pt-6">
        <Link href="/loyihalar/yangi" className="btn btn-primary px-6 py-3">
          Loyiha boshlash va fayllarni yuklash <ArrowRight size={16} strokeWidth={2} />
        </Link>
      </div>
    </div>
  );
}
