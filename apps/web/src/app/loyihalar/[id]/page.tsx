import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import Tile3DViewer from "@/components/Tile3DViewer";
import { MICROCOPY, REPLICA_STATEMENT_UZ, REPLICA_STATEMENT_EN } from "@naqshlab/shared";
import {
  Folder,
  Layers,
  Box,
  Hammer,
  DollarSign,
  ShoppingCart,
  Award,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  FileText,
  Download,
} from "lucide-react";

interface ProjectDetailsPageProps {
  params: { id: string };
  searchParams?: { tab?: string };
}

export default async function ProjectDetailsPage({ params, searchParams }: ProjectDetailsPageProps) {
  const activeTab = searchParams?.tab || "manbalar";

  const project = await prisma.project.findUnique({
    where: { id: params.id },
    include: {
      client: true,
      sourceAssets: true,
      reconstructionVersions: {
        include: {
          models: true,
        },
      },
      pieces: {
        include: {
          jobCard: {
            include: {
              workshop: true,
              parameterSet: true,
              tasks: {
                include: {
                  checklistSteps: true,
                },
              },
            },
          },
          qcRuns: true,
          certificate: true,
        },
      },
      quotes: {
        include: {
          items: true,
        },
      },
      orders: {
        include: {
          events: true,
          invoices: true,
        },
      },
    },
  });

  if (!project) {
    return notFound();
  }

  const latestRecon = project.reconstructionVersions[0];
  const piece = project.pieces[0];
  const jobCard = piece?.jobCard;
  const quote = project.quotes[0];
  const cert = piece?.certificate;

  return (
    <div className="container py-8 space-y-6">
      {/* Mandatory Hard Rule R1 Banner */}
      <div className="replica-banner">
        <div>
          <span className="block font-bold text-sm">{REPLICA_STATEMENT_UZ}</span>
          <span className="block text-xs text-[var(--ink-muted)]">{REPLICA_STATEMENT_EN}</span>
        </div>
        <span className="mono text-xs bg-[var(--paper)] px-2 py-1 border border-[var(--line)]">
          Loyiha Holati: <b>{project.status}</b>
        </span>
      </div>

      {/* Project Header */}
      <div className="card p-6 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <span className="mono text-xs px-2 py-0.5 bg-[var(--mist)] border border-[var(--line)] text-[var(--cobalt)]">
              {project.objectType}
            </span>
            <span className="status-chip success text-xs">
              {project.status}
            </span>
          </div>

          <h1 className="text-2xl font-bold text-[var(--ink)]">{project.name}</h1>
          <p className="text-xs text-[var(--ink-muted)]">
            Joylashuv: <b>{project.location}</b> &bull; Uslub: <b>{project.periodStyle}</b>
          </p>
        </div>

        <div className="flex items-center gap-3">
          {cert && (
            <Link href={`/v/${cert.serial}`} className="btn btn-outline text-xs flex items-center gap-1.5">
              <ShieldCheck size={14} strokeWidth={1.5} className="text-[var(--success)]" />
              Sertifikatni ko'rish
            </Link>
          )}
          <Link href={`/loyihalar/${project.id}/naqsh`} className="btn btn-primary text-xs">
            Naqsh muharriri &rarr;
          </Link>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-[var(--line)] overflow-x-auto text-xs font-semibold">
        {[
          { id: "manbalar", label: "Manbalar", icon: Folder },
          { id: "naqsh", label: "Naqsh", icon: Layers },
          { id: "3d", label: "3D Model", icon: Box },
          { id: "ishlab-chiqarish", label: "Ishlab chiqarish", icon: Hammer },
          { id: "narx", label: "Narx", icon: DollarSign },
          { id: "buyurtma", label: "Buyurtma", icon: ShoppingCart },
          { id: "sertifikatlar", label: "Sertifikatlar", icon: Award },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <Link
              key={tab.id}
              href={`/loyihalar/${project.id}?tab=${tab.id}`}
              className={`flex items-center gap-2 py-3 px-4 border-b-2 transition-colors whitespace-nowrap ${
                isActive
                  ? "border-[var(--cobalt)] text-[var(--cobalt)]"
                  : "border-transparent text-[var(--ink-muted)] hover:text-[var(--ink)]"
              }`}
            >
              <Icon size={14} strokeWidth={1.5} />
              <span>{tab.label}</span>
            </Link>
          );
        })}
      </div>

      {/* TAB CONTENT: Manbalar (Sources) */}
      {activeTab === "manbalar" && (
        <div className="space-y-6">
          <div className="card p-6 space-y-4">
            <h3 className="text-base font-bold">Yuklangan asl manbalar va metrik kalibratsiya</h3>
            <p className="text-xs text-[var(--ink-muted)]">
              Yuklangan barcha manbalar daxlsiz saqlanadi. Qayta ishlash hosilaviy nusxalarda bajariladi.
            </p>

            <table className="studio-table">
              <thead>
                <tr>
                  <th>Fayl nomi</th>
                  <th>Turi</th>
                  <th>Hajmi</th>
                  <th>SHA-256 Checksum</th>
                  <th>Holati</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="font-medium">kalyan_tile_front_calibrated.png</td>
                  <td className="mono text-xs">PHOTO (ArUco 50mm)</td>
                  <td className="mono text-xs">14.2 MB</td>
                  <td className="mono text-[10px]">7f83b1657ff1fc53b92dc18148a1d65dfc2d4b1fa3d677284addd200126d9069</td>
                  <td>
                    <span className="status-chip success text-[10px]">VERIFIED</span>
                  </td>
                </tr>
                <tr>
                  <td className="font-medium">kalyan_corner_scan.stl</td>
                  <td className="mono text-xs">3D_SCAN (Watertight)</td>
                  <td className="mono text-xs">48.6 MB</td>
                  <td className="mono text-[10px]">e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855</td>
                  <td>
                    <span className="status-chip success text-[10px]">VERIFIED</span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB CONTENT: Naqsh (Ornament Reconstruction) */}
      {activeTab === "naqsh" && (
        <div className="space-y-6">
          <div className="card p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold">Naqsh rekonstruksiyasi holati</h3>
                <p className="text-xs text-[var(--ink-muted)]">
                  Ekspert tasdig'i: <b>{latestRecon?.status || "IN_REVIEW"}</b> &bull; Versiya {latestRecon?.versionNumber || 1}
                </p>
              </div>
              <Link href={`/loyihalar/${project.id}/naqsh`} className="btn btn-primary text-xs">
                Muharrirni ochish
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
              <div className="h-64 bg-[var(--mist)] border border-[var(--line)] rounded-[var(--radius-max)] flex items-center justify-center p-4">
                <svg
                  viewBox="0 0 150 150"
                  className="w-full h-full max-h-56"
                  dangerouslySetInnerHTML={{ __html: latestRecon?.svgData || "" }}
                />
              </div>

              <div className="space-y-3 text-xs">
                <div className="p-3 bg-[var(--mist)] border border-[var(--line)] rounded-[var(--radius-max)] space-y-1">
                  <span className="font-bold text-[var(--ink)] block">Aniqlangan simmetriya:</span>
                  <span className="mono text-[var(--cobalt)]">8-qirrali aylanma simmetriya (C8 guruhi, 96% ishonch)</span>
                </div>
                <div className="p-3 bg-[var(--mist)] border border-[var(--line)] rounded-[var(--radius-max)] space-y-1">
                  <span className="font-bold text-[var(--ink)] block">Tiklash usuli:</span>
                  <span className="mono">Simmetriya va davriylik bo'yicha ko'chirish (Deterministik)</span>
                </div>
                <div className="p-3 bg-[var(--mist)] border border-[var(--line)] rounded-[var(--radius-max)] space-y-1">
                  <span className="font-bold text-[var(--ink)] block">Ekspert imzosi:</span>
                  <span className="mono text-[var(--success)]">Tasdiqlangan &bull; Usta Inomjon Shomurodov</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB CONTENT: 3D Model */}
      {activeTab === "3d" && (
        <div className="space-y-6">
          <div className="card p-6 space-y-4">
            <h3 className="text-base font-bold">Interaktiv 3D Model va Og'ish Xaritasi</h3>
            <p className="text-xs text-[var(--ink-muted)]">
              Suvo'tkazmas 2-manifold CAD mesh. 8mm asos plitasi, 6mm bo'rtma chuqurligi.
            </p>

            <Tile3DViewer
              widthMm={150}
              lengthMm={150}
              thicknessMm={14}
              reliefDepthMm={6}
              showControls={true}
              showHeatmap={true}
            />

            <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
              <span className="mono text-xs text-[var(--ink-muted)]">
                Hajm: 285.4 sm³ &bull; Og'irlik: ~656 g (Fired Clay Stoneware)
              </span>
              <div className="flex items-center gap-2">
                <button className="btn btn-outline text-xs">STL (Binary)</button>
                <button className="btn btn-outline text-xs">OBJ</button>
                <button className="btn btn-outline text-xs">GLB (Preview)</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB CONTENT: Ishlab chiqarish (Production & Job Cards) */}
      {activeTab === "ishlab-chiqarish" && (
        <div className="space-y-6">
          <div className="card p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold">Ishlab chiqarish marshrut kartasi (Job Card)</h3>
                <p className="text-xs text-[var(--ink-muted)]">
                  Yo'nalish: <b>{jobCard?.parameterSet.route || "KASHI"}</b> &bull; Parametrlar to'plami v{jobCard?.parameterSet.version || 1}
                </p>
              </div>
              <span className="status-chip success text-xs">
                {jobCard?.status || "COMPLETED"}
              </span>
            </div>

            {/* Checklist Steps */}
            <div className="space-y-3 pt-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--ink-muted)]">
                Bajarilishi majburiy qadamlar ro'yxati:
              </h4>

              <div className="p-3 bg-[var(--mist)] border border-[var(--line)] rounded-[var(--radius-max)] flex items-center justify-between">
                <div>
                  <span className="text-xs font-semibold block">1. 3D Master modelni CNC frezalash</span>
                  <span className="mono text-[11px] text-[var(--ink-muted)]">Kompensatsiyalangan o'lcham: 162.75 &times; 162.75 mm (+8.5% qisqarish)</span>
                </div>
                <CheckCircle2 size={18} className="text-[var(--success)]" />
              </div>

              <div className="p-3 bg-[var(--mist)] border border-[var(--line)] rounded-[var(--radius-max)] flex items-center justify-between">
                <div>
                  <span className="text-xs font-semibold block">2. Gips matritsa quyish va quritish</span>
                  <span className="mono text-[11px] text-[var(--ink-muted)]">48 soat quritish kamerasida</span>
                </div>
                <CheckCircle2 size={18} className="text-[var(--success)]" />
              </div>

              <div className="p-3 bg-[#EBF5F1] border border-[var(--success)] rounded-[var(--radius-max)] flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-[var(--success)] block">
                    3. NUSXA tamg'asi va seriya raqamini o'yish (Rule R1)
                  </span>
                  <span className="mono text-[11px] text-[var(--ink-muted)]">
                    Foto hisobot yuklangan: replica_backstamp_proof.jpg &bull; Tasdiqlangan
                  </span>
                </div>
                <ShieldCheck size={18} className="text-[var(--success)]" />
              </div>

              <div className="p-3 bg-[var(--mist)] border border-[var(--line)] rounded-[var(--radius-max)] flex items-center justify-between">
                <div>
                  <span className="text-xs font-semibold block">4. Xomaki (950°C) va Sirli (1040°C) pishirish</span>
                  <span className="mono text-[11px] text-[var(--ink-muted)]">Ramp 7h, hold 1.5h, cool 10h</span>
                </div>
                <CheckCircle2 size={18} className="text-[var(--success)]" />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB CONTENT: Narx (Pricing Quote) */}
      {activeTab === "narx" && (
        <div className="space-y-6">
          <div className="card p-6 space-y-4">
            <h3 className="text-base font-bold">Xarajatlar hisob-kitobi (Tafsilotli taklif)</h3>
            <p className="text-xs text-[var(--ink-muted)]">
              Kotirovka taxminiy bo'lib, tasdiqlangan dizayn va aniq o'lchovlarga asoslanadi (Section 3.9).
            </p>

            <table className="studio-table">
              <thead>
                <tr>
                  <th>Tavsif</th>
                  <th>Miqdor</th>
                  <th>Birlik narxi (UZS)</th>
                  <th>Jami (UZS)</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>An'anaviy koshin ishlab chiqarish (A-daraja, KASHI)</td>
                  <td className="mono">0.25 m²</td>
                  <td className="mono">3,150,000</td>
                  <td className="mono">787,500</td>
                </tr>
                <tr>
                  <td>Yangi master qolip quyish (Bir martalik)</td>
                  <td className="mono">1 dona</td>
                  <td className="mono">1,200,000</td>
                  <td className="mono">1,200,000</td>
                </tr>
              </tbody>
              <tfoot>
                <tr>
                  <td colSpan={3} className="text-right font-bold">Oraliq summa:</td>
                  <td className="mono font-bold">1,987,500 UZS</td>
                </tr>
                <tr>
                  <td colSpan={3} className="text-right text-[var(--ink-muted)]">QQS (0%):</td>
                  <td className="mono text-[var(--ink-muted)]">0 UZS</td>
                </tr>
                <tr className="border-t-2 border-[var(--cobalt)]">
                  <td colSpan={3} className="text-right text-base font-bold text-[var(--cobalt)]">Jami hisob:</td>
                  <td className="mono text-base font-bold text-[var(--cobalt)]">1,987,500 UZS (~$155)</td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      )}

      {/* TAB CONTENT: Buyurtma (Order Timeline) */}
      {activeTab === "buyurtma" && (
        <div className="space-y-6">
          <div className="card p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold">Buyurtma va Shartnoma holati</h3>
                <p className="text-xs text-[var(--ink-muted)]">
                  To'lov jadvali: 30% bo'nak, 40% pishirishdan so'ng, 30% yetkazib berishda
                </p>
              </div>
              <span className="status-chip success text-xs">TUGALLANDI</span>
            </div>

            <div className="p-4 bg-[var(--mist)] border border-[var(--line)] rounded-[var(--radius-max)] space-y-2">
              <span className="text-xs font-semibold block text-[var(--ink)]">
                Shartnoma va hisob-faktura (PDF)
              </span>
              <p className="text-xs text-[var(--ink-muted)]">
                Bank o'tkazmasi orqali to'lov (MANUAL_BANK_TRANSFER). Replikatsiya kafolati va huquqiy shartlar mavjud.
              </p>
              <button className="btn btn-outline text-xs py-1.5 flex items-center gap-1.5">
                <Download size={14} strokeWidth={1.5} />
                Shartnoma nusxasi (PDF)
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TAB CONTENT: Sertifikatlar (Certificates) */}
      {activeTab === "sertifikatlar" && (
        <div className="space-y-6">
          <div className="card p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold">Berilgan Haqiqiylik Sertifikati</h3>
                <p className="text-xs text-[var(--ink-muted)]">
                  Ommaviy QR kod va Ed25519 raqamli imzosi bilan ta'minlangan
                </p>
              </div>
              {cert && (
                <Link href={`/v/${cert.serial}`} className="btn btn-primary text-xs flex items-center gap-1.5">
                  <ShieldCheck size={14} strokeWidth={1.5} />
                  Ommaviy sahifa
                </Link>
              )}
            </div>

            {cert ? (
              <div className="p-4 bg-[var(--mist)] border border-[var(--line)] rounded-[var(--radius-max)] space-y-3">
                <div className="flex items-center justify-between">
                  <span className="mono font-bold text-sm text-[var(--cobalt)]">{cert.serial}</span>
                  <span className="status-chip success text-xs">{cert.status}</span>
                </div>
                <div className="text-xs mono space-y-1 text-[var(--ink-muted)]">
                  <div>SHA-256: {cert.canonicalJsonSha256}</div>
                  <div>Ekspert: {cert.expertName}</div>
                  <div>Sana: {new Date(cert.issueDate).toLocaleDateString("uz-UZ")}</div>
                </div>
              </div>
            ) : (
              <div className="text-xs text-[var(--ink-muted)] italic">
                Sertifikat sifat nazorati muvaffaqiyatli o'tgandan so'ng ekspert tomonidan chiqariladi.
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
