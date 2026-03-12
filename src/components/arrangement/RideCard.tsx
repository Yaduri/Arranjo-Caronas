"use client";

import { useState } from "react";
import { generateWhatsappLink, formatDate } from "@/lib/utils";
import { MessageSquare, Trash2, User, Edit, Clock } from "lucide-react";
import { deleteRide } from "@/app/actions";
import { ArrangementBuilder } from "./ArrangementBuilder";

interface RideCardProps {
  ride: any;
  drivers: any[];
  passengers: any[];
}

export function RideCard({ ride, drivers, passengers }: RideCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  
  const rideDate = new Date(ride.date);
  const isSunday = rideDate.getDay() === 0;
  
  const greeting = `Olá ${ride.driver.name}! Tudo bem?`;
  const dayName = rideDate.toLocaleDateString('pt-BR', { weekday: 'long' });
  const meetingType = isSunday ? "reunião" : `reunião de ${dayName}`;
  const timeStr = rideDate.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });

  const driverMessage = `${greeting} Passando para lembrar da carona de ${dayName} às ${timeStr} para a ${meetingType}. Você leva a ${ride.passengers.map((p: any) => p.passenger.name).join(" e a ")}? Abraço!`;
  
  if (isEditing) {
    return (
      <ArrangementBuilder 
        drivers={drivers} 
        passengers={passengers} 
        date={rideDate} 
        editRide={ride} 
        onClose={() => setIsEditing(false)} 
      />
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6 premium-shadow hover:border-blue-200 transition-all group">
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center gap-4">
          <div className="h-12 w-12 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
            <User className="h-6 w-6" />
          </div>
          <div>
            <div className="flex items-center gap-2 mb-0.5">
              <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest bg-blue-50 px-1.5 py-0.5 rounded">Motorista</span>
              <div className="flex items-center gap-1 text-xs text-slate-400 font-medium">
                <Clock className="h-3 w-3" />
                {timeStr}
              </div>
            </div>
            <h3 className="text-xl font-bold text-slate-900 leading-tight">{ride.driver.name}</h3>
          </div>
        </div>
        
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button 
            onClick={() => setIsEditing(true)}
            className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-all"
            title="Editar"
          >
            <Edit className="h-4 w-4" />
          </button>
          <button 
            onClick={() => deleteRide(ride.id)}
            className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-all"
            title="Excluir"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="space-y-3 mb-6">
        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Passageiras</span>
        <div className="flex flex-wrap gap-2">
          {ride.passengers.map((p: any) => (
            <div key={p.passenger.id} className="bg-slate-50 border border-slate-100 px-3 py-2 rounded-xl text-sm font-semibold text-slate-700 flex items-center gap-2 shadow-sm">
              <div className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse" />
              {p.passenger.name}
            </div>
          ))}
        </div>
      </div>

      <div className="pt-4 border-t border-slate-50">
        <a 
          href={generateWhatsappLink(ride.driver.phone || "999999999", driverMessage) || "#"}
          target="_blank"
          className="w-full flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white font-bold py-3.5 px-4 rounded-xl transition-all shadow-lg shadow-green-100 hover:shadow-green-200 active:scale-[0.98]"
        >
          <MessageSquare className="h-5 w-5" />
          Enviar Lembrete (WhatsApp)
        </a>
      </div>
    </div>
  );
}
