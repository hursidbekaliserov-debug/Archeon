import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { sha256Hex, verifyEd25519Signature } from "@/lib/crypto";
import { MICROCOPY, REPLICA_STATEMENT_UZ, REPLICA_STATEMENT_EN } from "@naqshlab/shared";
import { ShieldCheck, AlertOctagon, XCircle, Download, CheckCircle, ExternalLink } from "lucide-react";
import { PrintCertificateButton } from "@/components/PrintCertificateButton";

interface VerificationPageProps {
  params: { serial: string };
}

export default async function PublicVerificationPage({ params }: VerificationPageProps) {
  const serial = decodeURIComponent(params.serial);

  const cert = await prisma.certificate.findUnique({
    where: { serial },
    include: {
      piece: {
        include: {
          qcRuns: true,
        },
      },
    },
  });

  if (!cert) {
    return notFound();
  }

  // 1. Verify Canonical JSON SHA-256 Hash
  const computedHash = sha256Hex(cert.canonicalJson);
  const isHashIntact = computedHash === cert.canonicalJsonSha256;

  // 2. Fetch Expert User to get Public Key
  const expert = await prisma.user.findUnique({
    where: { id: cert.expertId },
  });

  // 3. Verify Ed25519 Digital Signature
  let isSignatureValid = false;
  if (expert?.ed25519PublicKey) {
    isSignatureValid = verifyEd25519Signature(
      expert.ed25519PublicKey,
      cert.canonicalJsonSha256,
      cert.expertSignature
    );
  }

  const isTampered = !isHashIntact || !isSignatureValid;
  const isRevoked = cert.status === "REVOKED";

  // Parse JSON properties safely
  const nominalDims = JSON.parse(cert.nominalDimsJson || "{}");
  const measuredDims = JSON.parse(cert.measuredDimsJson || "{}");
  const colourSummary = JSON.parse(cert.colourSummaryJson || "{}");
  const prodDates = JSON.parse(cert.productionDatesJson || "{}");

  return (
    <div className="container max-w-3xl py-12 space-y-8">
      {/* Mandatory Hard Rule R1 Banner */}
      <div className="replica-banner">
        <div>
          <span className="block font-bold text-sm">{REPLICA_STATEMENT_UZ}</span>
          <span className="block text-xs text-[var(--ink-muted)]">{REPLICA_STATEMENT_EN}</span>
        </div>
        <span className="mono text-xs bg-[var(--paper)] px-2 py-1 border border-[var(--line)]">
          Ommaviy Haqiqiylik Reyestri
        </span>
      </div>

      {/* Tamper Warning Banner if data has been manipulated */}
      {isTampered ? (
        <div className="p-4 bg-rose-950/50 border border-rose-500/40 border-l-4 border-l-rose-500 rounded-r-[var(--radius-max)] flex items-start gap-3 backdrop-blur-md">
          <AlertOctagon className="text-rose-400 flex-shrink-0 mt-0.5" size={24} />
          <div>
            <h3 className="text-sm font-bold text-rose-300">
              {MICROCOPY.tamperWarning}
            </h3>
            <p className="text-xs text-[var(--ink-secondary)] mt-1">
              Kriptografik tekshiruv muvaffaqiyatsiz tugadi. Ushbu sertifikatning SHA-256 xesh kodi yoki ekspert raqamli imzosi mos kelmadi.
            </p>
          </div>
        </div>
      ) : isRevoked ? (
        <div className="p-4 bg-amber-950/50 border border-amber-500/40 border-l-4 border-l-amber-500 rounded-r-[var(--radius-max)] flex items-start gap-3 backdrop-blur-md">
          <XCircle className="text-amber-400 flex-shrink-0 mt-0.5" size={24} />
          <div>
            <h3 className="text-sm font-bold text-amber-300">
              {MICROCOPY.revokedStatus}
            </h3>
            <p className="text-xs text-[var(--ink-secondary)] mt-1">
              Ushbu sertifikat ekspert yoki operator tomonidan bekor qilingan: {cert.revocationReason || "Noma'lum sabab"}.
            </p>
          </div>
        </div>
      ) : (
        <div className="p-4 bg-emerald-950/50 border border-emerald-500/40 border-l-4 border-l-emerald-400 rounded-r-[var(--radius-max)] flex items-start gap-3 backdrop-blur-md shadow-lg shadow-emerald-500/10">
          <CheckCircle className="text-emerald-400 flex-shrink-0 mt-0.5" size={24} />
          <div>
            <h3 className="text-sm font-bold text-emerald-300">
              Sertifikat haqiqiy va tasdiqlangan (VALID)
            </h3>
            <p className="text-xs text-[var(--ink-secondary)] mt-1">
              Kriptografik xesh-zanjir va ekspert raqamli imzosi (Ed25519) to'liq mos keladi.
            </p>
          </div>
        </div>
      )}

      {/* Certificate Details Card */}
      <div className="card space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[var(--line)] pb-4">
          <div>
            <span className="mono text-xs text-[var(--ink-muted)] block uppercase">
              Seriya raqami:
            </span>
            <h1 className="text-2xl font-bold mono text-[var(--cobalt)]">
              {cert.serial}
            </h1>
          </div>
          <div className="flex items-center gap-2">
            <span className={`status-chip ${isTampered ? "danger" : isRevoked ? "warning" : "success"}`}>
              {isTampered ? "XATOLIK / TAMPERED" : cert.status}
            </span>
          </div>
        </div>

        {/* Provenance Metadata Table */}
        <div className="space-y-4">
          <h3 className="text-base font-semibold text-[var(--ink)]">
            Asosiy ishlab chiqarish ma'lumotlari
          </h3>
          <table className="studio-table">
            <tbody>
              <tr>
                <td className="w-1/3 text-[var(--ink-muted)]">Obyekt tavsifi:</td>
                <td className="font-medium">{cert.referenceObjectDesc}</td>
              </tr>
              <tr>
                <td className="text-[var(--ink-muted)]">Ishlab chiqarish yo'nalishi:</td>
                <td className="mono font-semibold">{cert.route}</td>
              </tr>
              <tr>
                <td className="text-[var(--ink-muted)]">Parametrlar to'plami (ParameterSet):</td>
                <td className="mono">Versiya {cert.parametersetVersion} (Muzlatilgan)</td>
              </tr>
              <tr>
                <td className="text-[var(--ink-muted)]">Ishlab chiqaruvchi ustaxona:</td>
                <td>{cert.workshopName}</td>
              </tr>
              <tr>
                <td className="text-[var(--ink-muted)]">Ishlab chiqarish sanalari:</td>
                <td className="mono text-xs">{prodDates.started} &mdash; {prodDates.completed}</td>
              </tr>
              <tr>
                <td className="text-[var(--ink-muted)]">Mas'ul ekspert:</td>
                <td>{cert.expertName}</td>
              </tr>
              <tr>
                <td className="text-[var(--ink-muted)]">Sertifikat berilgan sana:</td>
                <td className="mono text-xs">{new Date(cert.issueDate).toLocaleString("uz-UZ")}</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Metrology & QC Inspection Findings */}
        <div className="space-y-4 pt-2 border-t border-[var(--line)]">
          <h3 className="text-base font-semibold text-[var(--ink)]">
            Metrologiya va Rang Sifat Nazorati (QC)
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-3 bg-[var(--mist)] border border-[var(--line)] rounded-[var(--radius-max)] space-y-1">
              <span className="text-xs text-[var(--ink-muted)] block">Nominal o'lchamlar (CAD):</span>
              <span className="mono text-sm font-semibold">
                {nominalDims.length} &times; {nominalDims.width} &times; {nominalDims.thickness} mm
              </span>
            </div>
            <div className="p-3 bg-[var(--mist)] border border-[var(--line)] rounded-[var(--radius-max)] space-y-1">
              <span className="text-xs text-[var(--ink-muted)] block">Haqiqiy o'lchov (Shtangensirkul):</span>
              <span className="mono text-sm font-semibold text-[var(--cobalt)]">
                {measuredDims.length} &times; {measuredDims.width} &times; {measuredDims.thickness} mm
              </span>
            </div>
            <div className="p-3 bg-[var(--mist)] border border-[var(--line)] rounded-[var(--radius-max)] space-y-1">
              <span className="text-xs text-[var(--ink-muted)] block">CIEDE2000 Rang Farqi (O'rtacha):</span>
              <span className="mono text-sm font-semibold text-[var(--success)]">
                dE00 = {colourSummary.mean_delta_e?.toFixed(2)} (Me'yor: &le; 2.0)
              </span>
            </div>
            <div className="p-3 bg-[var(--mist)] border border-[var(--line)] rounded-[var(--radius-max)] space-y-1">
              <span className="text-xs text-[var(--ink-muted)] block">CIEDE2000 Rang Farqi (Maksimal):</span>
              <span className="mono text-sm font-semibold text-[var(--success)]">
                dE00 = {colourSummary.max_delta_e?.toFixed(2)} (Me'yor: &le; 3.0)
              </span>
            </div>
          </div>
        </div>

        {/* Cryptographic Signature Verification Details */}
        <div className="space-y-3 pt-2 border-t border-[var(--line)]">
          <h3 className="text-base font-semibold text-[var(--ink)]">
            Kriptografik Isbot va Raqamli Imzo
          </h3>
          <div className="space-y-2 text-xs mono bg-[var(--mist)] p-3 rounded-[var(--radius-max)] border border-[var(--line)]">
            <div>
              <span className="text-[var(--ink-muted)] block">Canonical JSON SHA-256 Hash:</span>
              <span className="break-all text-[var(--ink)]">{cert.canonicalJsonSha256}</span>
            </div>
            <div className="pt-2 border-t border-[var(--line)]">
              <span className="text-[var(--ink-muted)] block">Ekspert Ed25519 Raqamli Imzosi:</span>
              <span className="break-all text-[var(--cobalt)]">{cert.expertSignature}</span>
            </div>
            <div className="pt-2 border-t border-[var(--line)] flex items-center justify-between">
              <span className="text-[var(--ink-muted)]">Ed25519 Tekshiruv Holati:</span>
              <span className={isSignatureValid ? "text-[var(--success)] font-bold" : "text-[var(--danger)] font-bold"}>
                {isSignatureValid ? "TO'G'RI (VALID)" : "NOTO'G'RI (INVALID)"}
              </span>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="pt-4 border-t border-[var(--line)] flex flex-wrap items-center justify-between gap-4">
          <Link href="/" className="btn btn-outline text-xs">
            &larr; Bosh sahifaga qaytish
          </Link>
          <PrintCertificateButton />
        </div>
      </div>
    </div>
  );
}
