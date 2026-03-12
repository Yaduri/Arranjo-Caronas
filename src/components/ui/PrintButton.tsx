"use client";

import { Printer } from "lucide-react";

export function PrintButton() {
  return (
    <button
      onClick={() => window.print()}
      className="flex items-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-2.5 px-4 rounded-xl transition-all shadow-sm"
      title="Imprimir Escala"
    >
      <Printer className="h-4 w-4" />
      <span className="hidden sm:inline">Imprimir</span>
    </button>
  );
}
