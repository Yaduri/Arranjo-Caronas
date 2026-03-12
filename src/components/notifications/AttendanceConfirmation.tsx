"use client";

import { generateWhatsappLink } from "@/lib/utils";
import { CheckCircle2, MessageSquare } from "lucide-react";

interface AttendanceConfirmationProps {
  passengers: any[];
}

export function AttendanceConfirmation({ passengers }: AttendanceConfirmationProps) {
  return (
    <div className="flex gap-2">
      {passengers.map(p => {
        const message = `Olá irmã ${p.name}, tudo bem? Só confirmando se a senhora vai na reunião este domingo para podermos organizar a carona. 😊`;
        const link = generateWhatsappLink(p.phone || "999999999", message);
        
        return (
          <a
            key={p.id}
            href={link || "#"}
            target="_blank"
            className="flex items-center gap-2 bg-white border border-slate-200 px-4 py-2 rounded-xl text-sm font-bold text-slate-700 hover:bg-slate-50 hover:border-blue-200 transition-all premium-shadow"
          >
            <MessageSquare className="h-4 w-4 text-green-500" />
            Confirmar {p.name}
          </a>
        );
      })}
    </div>
  );
}
