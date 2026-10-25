import React from "react";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { verifyAuditChain } from "@/lib/audit";
import { ArrowLeft, CheckCircle2, AlertOctagon, Terminal, Database } from "lucide-react";

export default async function AuditLogViewerPage() {
  const auditLogs = await prisma.auditLog.findMany({
    orderBy: { timestamp: "desc" },
    take: 50,
  });

  const allLogsChronological = await prisma.auditLog.findMany({
    orderBy: { timestamp: "asc" },
  });

  const chainResult = verifyAuditChain(
    allLogsChronological.map((l) => ({
      id: l.id,
      prevHash: l.prevHash,
      currentHash: l.currentHash,
      timestamp: l.timestamp,
      userId: l.userId,
      action: l.action,
      entityType: l.entityType,
      entityId: l.entityId,
      payloadJson: l.payloadJson,
    }))
  );

  return (
    <div className="container py-12 space-y-8">
      <Link href="/admin" className="text-xs text-[var(--cobalt)] hover:underline flex items-center gap-1">
        <ArrowLeft size={12} /> Boshqaruv paneliga qaytish
      </Link>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="mono text-xs uppercase text-[var(--cobalt)] tracking-wider block mb-1">
            Kriptografik Daxlsizlik Jurnali
          </span>
          <h1 className="text-3xl font-bold">Audit Hash-Chain Ko'ruvchisi</h1>
          <p className="text-sm text-[var(--ink-muted)] mt-1">
            Har bir yozuv oldingi yozuvning SHA-256 xeshini o'z ichiga oladi (O'zgarmas Merkle zanjiri)
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="mono text-xs bg-[var(--mist)] border border-[var(--line)] px-3 py-1.5 text-[var(--ink)]">
            CLI: <b className="text-[var(--cobalt)]">make verify-audit</b>
          </span>
        </div>
      </div>

      {/* Chain Integrity Status Card */}
      <div className="card p-6 flex items-start gap-4 border-l-4 border-l-[var(--success)]">
        {chainResult.isValid ? (
          <CheckCircle2 size={28} className="text-[var(--success)] flex-shrink-0 mt-0.5" />
        ) : (
          <AlertOctagon size={28} className="text-[var(--danger)] flex-shrink-0 mt-0.5" />
        )}
        <div className="space-y-1">
          <h3 className="text-base font-bold text-[var(--ink)]">
            {chainResult.isValid ? "Audit zanjiri to'liq va buzilmagan (INTACT)" : "ZANJIRDA BUZILISH ANIQLANDI"}
          </h3>
          <p className="text-xs text-[var(--ink-muted)]">
            {chainResult.message}
          </p>
          <div className="pt-1 mono text-[11px] text-[var(--ink-muted)]">
            Tekshirilgan yozuvlar soni: <b>{allLogsChronological.length}</b> &bull; Boshlang'ich blok: <b>GENESIS (64 nol)</b>
          </div>
        </div>
      </div>

      {/* Audit Log Table */}
      <div className="card p-6 space-y-4">
        <h3 className="text-base font-bold text-[var(--ink)]">So'nggi audit yozuvlari (Oxirgi 50 ta)</h3>

        <div className="overflow-x-auto">
          <table className="studio-table">
            <thead>
              <tr>
                <th>Vaqt (UTC)</th>
                <th>Amal (Action)</th>
                <th>Ob'ekt turi</th>
                <th>Foydalanuvchi ID</th>
                <th>Current Hash (SHA-256)</th>
                <th>Prev Hash</th>
              </tr>
            </thead>
            <tbody>
              {auditLogs.map((log) => (
                <tr key={log.id}>
                  <td className="mono text-xs whitespace-nowrap">
                    {new Date(log.timestamp).toISOString().replace("T", " ").slice(0, 19)}
                  </td>
                  <td>
                    <span className="status-chip neutral text-[10px] mono">
                      {log.action}
                    </span>
                  </td>
                  <td className="text-xs font-semibold">{log.entityType}</td>
                  <td className="mono text-[11px] text-[var(--ink-muted)]">
                    {log.userId.slice(0, 12)}...
                  </td>
                  <td className="mono text-[10px] text-[var(--cobalt)] font-medium max-w-[140px] truncate" title={log.currentHash}>
                    {log.currentHash.slice(0, 16)}...
                  </td>
                  <td className="mono text-[10px] text-[var(--ink-muted)] max-w-[140px] truncate" title={log.prevHash}>
                    {log.prevHash.slice(0, 16)}...
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
