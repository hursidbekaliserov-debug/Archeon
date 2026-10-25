import React from "react";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { ArrowLeft, UserPlus, Shield, UserCheck } from "lucide-react";

export default async function AdminUsersPage() {
  const users = await prisma.user.findMany({
    include: {
      organization: true,
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="container py-12 space-y-8">
      <Link href="/admin" className="text-xs text-[var(--cobalt)] hover:underline flex items-center gap-1">
        <ArrowLeft size={12} /> Boshqaruv paneliga qaytish
      </Link>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="mono text-xs uppercase text-[var(--cobalt)] tracking-wider block mb-1">
            Foydalanuvchilar va Huquqlar
          </span>
          <h1 className="text-3xl font-bold">Foydalanuvchilar Boshqaruvi</h1>
          <p className="text-sm text-[var(--ink-muted)] mt-1">
            RBAC rollari (CLIENT, EXPERT, WORKSHOP, OPERATOR) va kriptografik kalitlar
          </p>
        </div>

        <button className="btn btn-primary text-xs self-start sm:self-auto flex items-center gap-1.5">
          <UserPlus size={14} strokeWidth={1.5} /> Yangi foydalanuvchi qo'shish
        </button>
      </div>

      <div className="card p-6 space-y-4">
        <table className="studio-table">
          <thead>
            <tr>
              <th>F.I.SH. / Ism</th>
              <th>Elektron pochta</th>
              <th>Tizim roli (RBAC)</th>
              <th>Tashkilot / Ustaxona</th>
              <th>Ed25519 Kaliti</th>
              <th>Qo'shilgan sana</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id}>
                <td className="font-semibold text-xs">{u.name}</td>
                <td className="mono text-xs text-[var(--ink-muted)]">{u.email}</td>
                <td>
                  <span
                    className={`status-chip text-[10px] mono ${
                      u.role === "EXPERT"
                        ? "success"
                        : u.role === "OPERATOR"
                        ? "warning"
                        : "neutral"
                    }`}
                  >
                    {u.role}
                  </span>
                </td>
                <td className="text-xs text-[var(--ink-muted)]">
                  {u.organization?.name || "Mustaqil"}
                </td>
                <td className="mono text-[10px]">
                  {u.ed25519PublicKey ? `${u.ed25519PublicKey.slice(0, 16)}...` : "—"}
                </td>
                <td className="mono text-xs text-[var(--ink-muted)]">
                  {new Date(u.createdAt).toLocaleDateString("uz-UZ")}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
