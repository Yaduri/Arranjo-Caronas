"use client";

import { FileSpreadsheet } from "lucide-react";
import { formatDate } from "@/lib/shared-utils";

interface CSVExportButtonProps {
  rides: any[];
}

export function CSVExportButton({ rides }: CSVExportButtonProps) {
  const exportToCSV = () => {
    // Determine max passengers to create headers
    let maxPassengers = 0;
    rides.forEach(r => {
      if (r.passengers.length > maxPassengers) {
        maxPassengers = r.passengers.length;
      }
    });

    // Create headers
    const headers = ["Data", "Motorista"];
    for (let i = 1; i <= maxPassengers; i++) {
      headers.push(`Passageiro ${i}`);
    }

    // Create rows
    const rows = rides.map(r => {
      const row = [
        formatDate(new Date(r.date)),
        r.driver.name
      ];
      
      // Add each passenger name
      r.passengers.forEach((p: any) => {
        row.push(p.passenger.name);
      });
      
      // Fill empty columns if any
      while (row.length < headers.length) {
        row.push("");
      }
      
      return row.join(";"); // Use semicolon for better Excel compatibility in Brazil
    });

    // Combine everything with BOM for UTF-8 Excel support
    const csvContent = "\uFEFF" + [headers.join(";"), ...rows].join("\n");
    
    // Create download link
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `Escala_Caronas_${new Date().toLocaleDateString('pt-BR').replace(/\//g, '-')}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <button
      onClick={exportToCSV}
      className="flex items-center gap-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-bold py-2.5 px-4 rounded-xl transition-all shadow-sm border border-emerald-100"
      title="Exportar para Excel/CSV"
    >
      <FileSpreadsheet className="h-4 w-4" />
      <span className="hidden sm:inline">Exportar Excel</span>
    </button>
  );
}
