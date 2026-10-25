import React from "react";
import Link from "next/link";
import { ArrowLeft, FileQuestion } from "lucide-react";

export default function NotFoundPage() {
  return (
    <div className="container max-w-md py-24 text-center space-y-6">
      <div className="w-16 h-16 rounded-[var(--radius-max)] bg-[var(--mist)] text-[var(--ink-muted)] flex items-center justify-center mx-auto">
        <FileQuestion size={32} strokeWidth={1.5} />
      </div>

      <div className="space-y-2">
        <h1 className="text-3xl font-bold mono">404</h1>
        <h2 className="text-lg font-semibold text-[var(--ink)]">Sahifa topilmadi</h2>
        <p className="text-xs text-[var(--ink-muted)]">
          Siz qidirayotgan sahifa ko'chirilgan, o'chirilgan yoki mavjud bo'lmagan manzil.
        </p>
      </div>

      <div>
        <Link href="/" className="btn btn-primary text-xs inline-flex items-center gap-1.5">
          <ArrowLeft size={14} strokeWidth={1.5} /> Bosh sahifaga qaytish
        </Link>
      </div>
    </div>
  );
}
