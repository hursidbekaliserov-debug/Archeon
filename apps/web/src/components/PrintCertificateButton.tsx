"use client";

import React from "react";
import { Download } from "lucide-react";

export function PrintCertificateButton() {
  return (
    <button
      onClick={() => window.print()}
      className="btn btn-primary text-xs"
      type="button"
    >
      <Download size={14} strokeWidth={1.5} />
      Sertifikat nusxasini yuklab olish (PDF)
    </button>
  );
}
