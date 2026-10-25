import React from "react";
import Link from "next/link";
import Tile3DViewer from "../components/Tile3DViewer";
import { BRAND_NAME, MICROCOPY, REPLICA_STATEMENT_UZ, REPLICA_STATEMENT_EN } from "@naqshlab/shared";
import { 
  ArrowRight, ShieldCheck, CheckCircle2, AlertTriangle, Layers, Cpu, Ruler, 
  Sparkles, Compass, ShieldAlert, Award, FileCheck, ArrowUpRight, Check
} from "lucide-react";

export default function HomePage() {
  return (
    <div className="space-y-24 py-8">
      {/* Hero Section */}
      <section className="container pt-4">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-6 space-y-6">
            {/* Center Badge */}
            <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 bg-blue-950/50 border border-cyan-500/30 text-xs font-semibold text-cyan-300 rounded-full shadow-lg shadow-cyan-500/10 backdrop-blur-md">
              <span className="w-2 h-2 rounded-full bg-cyan-400 pulse-active"></span>
              <span className="font-mono tracking-wider">{BRAND_NAME.toUpperCase()} &bull; ME'MORIY REKONSTRUKSIYA MARKAZI</span>
            </div>

            {/* Headline */}
            <h1 className="text-4xl lg:text-5xl font-extrabold leading-tight tracking-tight text-white">
              An'anaviy kashi va ganch san'atining{" "}
              <span className="gradient-text font-black">
                raqamli rekonstruksiyasi
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-base lg:text-lg text-[var(--ink-muted)] leading-relaxed">
              Tarixiy obidalarni tiklash, me'moriy loyihalar va hashamatli qarorgohlar uchun sertifikatlangan, ommaviy kriptografik tekshiruvga ega yuqori aniqlikdagi koshin va ganch ashyolari.
            </p>

            {/* Authentic Heritage Declaration */}
            <div className="p-4 bg-gradient-to-r from-blue-950/40 via-slate-900/60 to-slate-900/40 border border-cyan-500/30 border-l-4 border-l-cyan-400 rounded-r-[var(--radius-max)] space-y-1.5 backdrop-blur-md">
              <div className="mono text-xs font-bold text-cyan-300 tracking-wide flex items-center gap-2">
                <ShieldCheck size={16} className="text-cyan-400" />
                <span>ASL ME'MORIY MEROSNI TIKLASH STANDARTI</span>
              </div>
              <p className="text-xs text-[var(--ink-secondary)] leading-normal">
                Tarixiy obidalar, Samarqand Registoni, Shohizinda va Buxoro me'moriy yodgorliklarining asl naqshlari, kashi sirlari va ganchkorlik uslublari yuqori aniqlikdagi hisoblash geometriyasi orqali asl holiga keltiriladi.
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <Link href="/loyihalar/yangi" className="btn btn-primary text-sm">
                Loyiha boshlash <ArrowRight size={16} strokeWidth={2} />
              </Link>
              <Link href="/katalog" className="btn btn-secondary text-sm">
                Naqshlar katalogi (20+)
              </Link>
              <Link href="/v/NLB-KSH-2026-000001" className="btn btn-outline text-sm">
                <ShieldCheck size={15} className="text-cyan-400" />
                Sertifikat namunasi
              </Link>
            </div>
          </div>

          {/* Interactive 3D Tile Model Viewport */}
          <div className="lg:col-span-6">
            <div className="viewport-card p-2 border border-cyan-500/30 rounded-[var(--radius-max)] bg-slate-950/80 shadow-2xl">
              {/* CAD Viewport Header HUD */}
              <div className="flex items-center justify-between px-3 py-2 text-[11px] text-cyan-300 font-mono border-b border-cyan-500/20 bg-slate-900/60 rounded-t-[var(--radius-sm)] mb-2">
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 pulse-active"></span>
                  <span className="font-semibold tracking-wider">3D REALTIME VIEWPORT</span>
                </div>
                <div className="text-[var(--ink-muted)] flex items-center gap-3">
                  <span>GRID: 10mm</span>
                  <span>SUBDIV: 64x64</span>
                  <span className="text-cyan-400 font-bold">GRBL 1.1</span>
                </div>
              </div>

              {/* 3D Tile Component */}
              <Tile3DViewer
                widthMm={150}
                lengthMm={150}
                thicknessMm={14}
                reliefDepthMm={6}
                autoRotate={true}
                showControls={true}
              />

              {/* CAD Viewport Footer HUD */}
              <div className="flex flex-wrap items-center justify-between px-3 py-2 text-xs text-[var(--ink-muted)] mono border-t border-cyan-500/20 bg-slate-900/60 rounded-b-[var(--radius-sm)] mt-2">
                <span className="text-white font-medium">Model: 8-qirrali Girih Mayolika — Samarqand Registon kashisi</span>
                <span className="text-cyan-300">O'lcham: 150 &times; 150 &times; 14 mm</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Live Telemetry / Metric Indicators */}
      <section className="container">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-6 bg-[var(--bg-card)] border border-[var(--line)] rounded-[var(--radius-max)] shadow-xl backdrop-blur-xl">
          <div className="space-y-1">
            <span className="mono text-[11px] text-cyan-400 uppercase tracking-wider block font-semibold">Toleransiya</span>
            <div className="text-2xl font-bold text-white mono">±0.05 mm</div>
            <p className="text-xs text-[var(--ink-muted)]">CNC va optik shtangensirkul</p>
          </div>
          <div className="space-y-1">
            <span className="mono text-[11px] text-cyan-400 uppercase tracking-wider block font-semibold">Simmetriya Tahlili</span>
            <div className="text-2xl font-bold text-white mono">C2 — C8</div>
            <p className="text-xs text-[var(--ink-muted)]">2D FFT davriylik algoritmi</p>
          </div>
          <div className="space-y-1">
            <span className="mono text-[11px] text-cyan-400 uppercase tracking-wider block font-semibold">Kriptografik Muhr</span>
            <div className="text-2xl font-bold text-white mono">Ed25519</div>
            <p className="text-xs text-[var(--ink-muted)]">O'zgarmas audit va imzo</p>
          </div>
          <div className="space-y-1">
            <span className="mono text-[11px] text-cyan-400 uppercase tracking-wider block font-semibold">Meros Standarti</span>
            <div className="text-2xl font-bold text-emerald-400 mono">100% AUTENTIK</div>
            <p className="text-xs text-[var(--ink-muted)]">Tarixiy kashi va ganch andozasi</p>
          </div>
        </div>
      </section>

      {/* Value Proposition Grid */}
      <section className="container">
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-3">
          <span className="mono text-xs uppercase text-cyan-400 tracking-wider font-semibold block">
            Laboratoriya Aniqligi
          </span>
          <h2 className="text-3xl font-extrabold text-white">Hisoblash geometriyasi va usta qo'l mehnati</h2>
          <p className="text-sm text-[var(--ink-muted)]">
            Hisoblash geometriyasi, CNC frezalash va tajribali ustalarning an'anaviy bilimlari orqali buyumlar asl shakliga qaytariladi.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="card space-y-4 hover:border-cyan-500/40 transition-all">
            <div className="w-12 h-12 rounded-[var(--radius-sm)] bg-blue-950/70 border border-blue-500/30 text-cyan-400 flex items-center justify-center shadow-lg shadow-blue-500/10">
              <Cpu size={24} strokeWidth={1.75} />
            </div>
            <h3 className="text-lg font-bold text-white">Simmetriya va AI tahlili</h3>
            <p className="text-sm text-[var(--ink-muted)] leading-relaxed">
              ArUco metrik kalibratsiyasi, 2D FFT davriylik aniqlash, C2–C8 aylanma simmetriya bo'yicha yo'qolgan bo'laklarni tiklash.
            </p>
            <div className="pt-2 mono text-xs text-cyan-400 font-medium">
              {MICROCOPY.aiSuggestionUnapproved}
            </div>
          </div>

          <div className="card space-y-4 hover:border-cyan-500/40 transition-all">
            <div className="w-12 h-12 rounded-[var(--radius-sm)] bg-blue-950/70 border border-blue-500/30 text-cyan-400 flex items-center justify-center shadow-lg shadow-blue-500/10">
              <Ruler size={24} strokeWidth={1.75} />
            </div>
            <h3 className="text-lg font-bold text-white">Qisqarish va CNC kompensatsiyasi</h3>
            <p className="text-sm text-[var(--ink-muted)] leading-relaxed">
              Pishirishdagi 8.5% gil qisqarishini (1+s) masshtablash. 300&times;180mm ish maydoniga moslashtirilgan GRBL 1.1 toolpath.
            </p>
            <div className="pt-2 mono text-xs text-emerald-400 font-medium">
              {MICROCOPY.readyForProduction}
            </div>
          </div>

          <div className="card space-y-4 hover:border-cyan-500/40 transition-all">
            <div className="w-12 h-12 rounded-[var(--radius-sm)] bg-blue-950/70 border border-blue-500/30 text-cyan-400 flex items-center justify-center shadow-lg shadow-blue-500/10">
              <ShieldCheck size={24} strokeWidth={1.75} />
            </div>
            <h3 className="text-lg font-bold text-white">Ed25519 Kriptografik sertifikat</h3>
            <p className="text-sm text-[var(--ink-muted)] leading-relaxed">
              CIEDE2000 spektrofotometr rang nazorati, 3D skan og'ishi tahlili va ekspert raqamli imzosi bilan ta'minlangan ommaviy sertifikat.
            </p>
            <div className="pt-2 mono text-xs text-cyan-400 font-medium">
              {MICROCOPY.qcPassed}
            </div>
          </div>
        </div>
      </section>

      {/* 7-Step Process Overview */}
      <section className="border-y border-[var(--line)] py-16 bg-slate-950/50 backdrop-blur-sm relative">
        <div className="container space-y-12">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <span className="mono text-xs uppercase text-cyan-400 tracking-wider block mb-1 font-semibold">
                Ishlab chiqarish zanjiri
              </span>
              <h2 className="text-3xl font-extrabold text-white">Asl nusxadan sertifikatlangan yetkazib berishgacha</h2>
            </div>
            <Link href="/jarayon" className="btn btn-outline text-xs">
              Batafsil jarayon xaritasi &rarr;
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-7 gap-4">
            {[
              { num: "01", title: "Tasvirga olish", desc: "ArUco va metrik kalibratsiya bilan suratga olish" },
              { num: "02", title: "Naqsh tahlili", desc: "FFT davriylik va C2-C8 simmetriya guruhlari" },
              { num: "03", title: "Ekspert tasdig'i", desc: "Taklif etilgan variantlarni usta tasdiqlashi" },
              { num: "04", title: "3D Modellashtirish", desc: "Suvo'tkazmas 2-manifold silliq CAD modeli" },
              { num: "05", title: "Ishlab chiqarish", desc: "Qoliplash, bosish, xomaki va sirli pishirish" },
              { num: "06", title: "Sifat nazorati", desc: "CIEDE2000 dE00 va shtangensirkul o'lchovi" },
              { num: "07", title: "Sertifikatlash", desc: "Ommaviy QR kod va Ed25519 raqamli imzosi" },
            ].map((step, idx) => (
              <div key={idx} className="card p-4 space-y-2 hover:border-cyan-500/40 transition-colors">
                <span className="mono font-bold text-sm text-cyan-400 block">{step.num}</span>
                <h4 className="text-sm font-semibold text-white">{step.title}</h4>
                <p className="text-xs text-[var(--ink-muted)] leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Sample Motifs Teaser */}
      <section className="container space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-white">Namunaviy an'anaviy naqshlar</h2>
            <p className="text-sm text-[var(--ink-muted)]">Katalogdan tiklash uchun mos motifni tanlang</p>
          </div>
          <Link href="/katalog" className="btn btn-outline text-xs">
            Barcha naqshlar (20+) &rarr;
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
          {[
            { 
              name: "Girih 8-qirrali yulduz", 
              family: "GIRIH", 
              sym: "C8", 
              size: "150 mm",
              svg: (
                <svg viewBox="0 0 150 150" className="w-full h-full stroke-cyan-400 group-hover:stroke-cyan-300 fill-none transition-colors">
                  <polygon points="75,18 89,52 125,52 97,76 109,112 75,90 41,112 53,76 25,52 61,52" strokeWidth="1.5" />
                  <polygon points="75,32 84,58 112,58 90,74 98,102 75,85 52,102 60,74 38,58 66,58" strokeWidth="1" strokeDasharray="3 3" />
                  <circle cx="75" cy="75" r="16" strokeWidth="1.2" />
                </svg>
              )
            },
            { 
              name: "Islimi novda va palmetta", 
              family: "ISLIMI", 
              sym: "C2", 
              size: "150 mm",
              svg: (
                <svg viewBox="0 0 150 150" className="w-full h-full stroke-cyan-400 group-hover:stroke-cyan-300 fill-none transition-colors">
                  <path d="M 25 75 C 40 30, 60 30, 75 75 C 90 120, 110 120, 125 75 C 110 50, 90 50, 75 75 C 60 100, 40 100, 25 75 Z" strokeWidth="1.5" />
                  <path d="M 75 25 C 60 45, 60 65, 75 75 C 90 65, 90 45, 75 25 Z" strokeWidth="1.2" />
                  <circle cx="75" cy="75" r="7" strokeWidth="1.5" />
                </svg>
              )
            },
            { 
              name: "Shohizinda rozetkasi", 
              family: "ROSETTE", 
              sym: "C8", 
              size: "150 mm",
              svg: (
                <svg viewBox="0 0 150 150" className="w-full h-full stroke-cyan-400 group-hover:stroke-cyan-300 fill-none transition-colors">
                  <circle cx="75" cy="75" r="14" strokeWidth="1.5" />
                  <circle cx="75" cy="75" r="32" strokeWidth="1" strokeDasharray="2 3" />
                  <circle cx="75" cy="75" r="50" strokeWidth="1.5" />
                  <line x1="75" y1="25" x2="75" y2="125" strokeWidth="1" />
                  <line x1="25" y1="75" x2="125" y2="75" strokeWidth="1" />
                  <line x1="40" y1="40" x2="110" y2="110" strokeWidth="1" />
                  <line x1="40" y1="110" x2="110" y2="40" strokeWidth="1" />
                </svg>
              )
            },
            { 
              name: "Friz to'lqinsimon hoshiya", 
              family: "BORDER_STRIP", 
              sym: "D1", 
              size: "50 mm",
              svg: (
                <svg viewBox="0 0 150 150" className="w-full h-full stroke-cyan-400 group-hover:stroke-cyan-300 fill-none transition-colors">
                  <path d="M 15 45 Q 45 15, 75 45 T 135 45" strokeWidth="1.5" />
                  <path d="M 15 75 Q 45 45, 75 75 T 135 75" strokeWidth="1.5" />
                  <path d="M 15 105 Q 45 75, 75 105 T 135 105" strokeWidth="1.5" />
                  <circle cx="75" cy="45" r="4" strokeWidth="1.2" />
                  <circle cx="75" cy="75" r="4" strokeWidth="1.2" />
                  <circle cx="75" cy="105" r="4" strokeWidth="1.2" />
                </svg>
              )
            },
          ].map((m, idx) => (
            <div key={idx} className="card p-4 space-y-3 hover:border-cyan-400 transition-all cursor-pointer group">
              <div className="h-32 bg-slate-950/70 border border-[var(--line)] rounded-[var(--radius-sm)] flex items-center justify-center p-4 group-hover:border-cyan-500/40 transition-colors">
                {m.svg}
              </div>
              <div>
                <span className="mono text-[10px] text-cyan-400 uppercase block font-semibold">{m.family} &bull; {m.sym}</span>
                <h4 className="text-xs font-semibold mt-1 text-white">{m.name}</h4>
                <span className="mono text-[11px] text-[var(--ink-muted)] block mt-1">{m.size}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ & Architectural Restoration Standards */}
      <section className="container max-w-4xl space-y-8">
        <div className="text-center space-y-2">
          <span className="mono text-xs uppercase text-cyan-400 tracking-wider font-semibold block">Meros va Texnologiya</span>
          <h2 className="text-2xl font-bold text-white">Ko'p so'raladigan savollar va Ilmiy Standartlar</h2>
          <p className="text-sm text-[var(--ink-muted)]">Tarixiy obidalarni asliga muvofiq tiklash tamoyillarimiz</p>
        </div>

        <div className="space-y-4">
          <div className="card p-6 space-y-2">
            <h4 className="text-base font-semibold text-white">
              Arxeon me'moriy buyumlari qanday ilmiy standartlar asosida tayyorlanadi?
            </h4>
            <p className="text-sm text-[var(--ink-muted)] leading-relaxed">
              Bizning laboratoriya tarixiy obidalarning asl pigmentlari, kashi sirlari (ishkoriy va qo'rg'oshinli sirlar) hamda ganch qorishmasi retseptlarini saqlagan holda, buyumlarni asl shakli va o'lchamlariga 0.5 mm aniqlikda qayta tiklaydi. Har bir buyum individual raqamli pasport va sifat nazorati bilan ta'minlanadi.
            </p>
          </div>

          <div className="card p-6 space-y-2">
            <h4 className="text-base font-semibold text-white">
              Sun'iy eskirtirish yoki soxta patina bormi?
            </h4>
            <p className="text-sm text-[var(--ink-muted)] leading-relaxed">
              Qat'iyan yo'q. Biz buyumlarga soxta dog'lar yoki sun'iy eskirish qo'llamaymiz. Maqsadimiz — asrlar avval usta qo'lidan chiqqan ilk kungi asl go'zallik va yorqinlikni texnologik va ilmiy aniqlikda namoyon etishdir.
            </p>
          </div>

          <div className="card p-6 space-y-2">
            <h4 className="text-base font-semibold text-white">
              AI nima qiladi va u mustaqil qaror qabul qiladimi?
            </h4>
            <p className="text-sm text-[var(--ink-muted)] leading-relaxed">
              AI va hisoblash geometriyasi faqat taklif beradi (Rule R3). Shikastlangan naqshni simmetriya orqali to'ldirish faqat sertifikatlangan Usta (EXPERT) tomonidan ko'rib chiqilib, ma'qullangandan keyingina ishlab chiqarishga yo'naltiriladi.
            </p>
          </div>

          <div className="card p-6 space-y-2">
            <h4 className="text-base font-semibold text-white">
              Sertifikat qanday tekshiriladi?
            </h4>
            <p className="text-sm text-[var(--ink-muted)] leading-relaxed">
              Har bir buyumdagi QR kod yoki seriya raqami orqali /v/{"{serial}"} ommaviy sahifasiga o'tib, rang spektrometriyasi, 3D o'lchov hisoboti va usta raqamli imzosini (Ed25519) tekshirishingiz mumkin.
            </p>
          </div>
        </div>
      </section>

      {/* Call To Action Banner */}
      <section className="container">
        <div className="p-8 md:p-12 rounded-[var(--radius-xl)] bg-gradient-to-r from-blue-950/80 via-indigo-950/70 to-slate-950/90 border border-cyan-500/30 shadow-2xl relative overflow-hidden text-center space-y-6">
          <div className="max-w-2xl mx-auto space-y-3">
            <h2 className="text-3xl font-extrabold text-white">
              Me'moriy tiklash yoki yangi loyihangizni boshlang
            </h2>
            <p className="text-sm text-[var(--ink-muted)] leading-relaxed">
              Fotografik manba yuklang, hisoblash geometriyasi orqali naqsh simmetriyasini tahlil qiling va sertifikatlangan ishlab chiqarish hisob-kitobini oling.
            </p>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link href="/loyihalar/yangi" className="btn btn-primary text-sm px-6 py-3">
              Yangi loyiha ochish <ArrowRight size={16} />
            </Link>
            <Link href="/katalog" className="btn btn-secondary text-sm px-6 py-3">
              Katalog bilan tanishish
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
