"use client";

import { useState, useEffect } from "react";
import { createRide, updateRide } from "@/app/actions";
import { Plus, User, Users, Calendar, X, Save } from "lucide-react";

interface ArrangementBuilderProps {
  drivers: any[];
  passengers: any[];
  date: Date;
  editRide?: any;
  onClose?: () => void;
}

export function ArrangementBuilder({ drivers, passengers, date, editRide, onClose }: ArrangementBuilderProps) {
  const [selectedDriver, setSelectedDriver] = useState<string>(editRide?.driverId.toString() || "");
  const [selectedPassengers, setSelectedPassengers] = useState<string[]>(
    editRide?.passengers.map((p: any) => p.passengerId.toString()) || []
  );
  const [selectedDate, setSelectedDate] = useState<string>(
    editRide 
      ? new Date(editRide.date).toISOString().slice(0, 16) 
      : new Date().toISOString().slice(0, 10) + "T18:00" // Default to 18:00 today
  );

  const togglePassenger = (id: string) => {
    setSelectedPassengers(prev => 
      prev.includes(id) ? prev.filter(p => p !== id) : [...prev, id]
    );
  };

  const handleSubmit = async (formData: FormData) => {
    if (editRide) {
      await updateRide(editRide.id, formData);
    } else {
      await createRide(formData);
    }
    if (onClose) onClose();
  };

  return (
    <div className={`text-left bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 ${!editRide && 'w-full'}`}>
      {editRide && (
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <Save className="h-5 w-5 text-blue-500" />
            Editar Arranjo
          </h3>
          {onClose && (
            <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
              <X className="h-5 w-5 text-slate-400" />
            </button>
          )}
        </div>
      )}

      <form action={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-bold text-slate-700 mb-2 flex items-center gap-2">
            <Calendar className="h-4 w-4 text-orange-500" />
            Data e Hora
          </label>
          <input
            type="datetime-local"
            name="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="w-full bg-white border-2 border-slate-200 !text-slate-900 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500 transition-all font-bold"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-bold text-slate-700 mb-2 flex items-center gap-2">
            <User className="h-4 w-4 text-blue-500" />
            Escolha o Motorista
          </label>
          <select 
            name="driverId"
            value={selectedDriver}
            onChange={(e) => setSelectedDriver(e.target.value)}
            className="w-full bg-white border-2 border-slate-200 !text-slate-900 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500 transition-all font-bold"
            required
          >
            <option value="">Selecione um irmão...</option>
            {drivers.map(d => (
              <option key={d.id} value={d.id}>{d.name}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-bold text-slate-700 mb-2 flex items-center gap-2">
            <Users className="h-4 w-4 text-purple-500" />
            Escolha as Passageiras
          </label>
          <div className="grid grid-cols-2 gap-2">
            {passengers.map(p => (
              <button
                key={p.id}
                type="button"
                onClick={() => togglePassenger(p.id.toString())}
                className={`flex items-center gap-3 px-4 py-3.5 rounded-xl border text-sm font-bold transition-all ${
                  selectedPassengers.includes(p.id.toString())
                    ? "bg-purple-100 border-purple-400 text-purple-900"
                    : "bg-white border-slate-200 text-slate-600 hover:border-slate-300 shadow-sm"
                }`}
              >
                <div className={`h-5 w-5 rounded-md border-2 flex items-center justify-center shrink-0 ${
                  selectedPassengers.includes(p.id.toString()) ? "bg-purple-600 border-purple-600" : "bg-slate-50 border-slate-200"
                }`}>
                  {selectedPassengers.includes(p.id.toString()) && (
                    <div className="h-1.5 w-1.5 rounded-full bg-white" />
                  )}
                </div>
                <span className="leading-[1.1] text-[13px] text-left">{p.name}</span>
              </button>
            ))}
          </div>
          {selectedPassengers.map(id => (
            <input key={id} type="hidden" name="passengerIds" value={id} />
          ))}
        </div>

        <button
          type="submit"
          disabled={!selectedDriver || selectedPassengers.length === 0}
          className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 text-white font-bold py-4 rounded-xl transition-all shadow-lg shadow-blue-100 mt-4"
        >
          {editRide ? <Save className="h-5 w-5" /> : <Plus className="h-5 w-5" />}
          {editRide ? "Atualizar Arranjo" : "Salvar Arranjo"}
        </button>
      </form>
    </div>
  );
}
