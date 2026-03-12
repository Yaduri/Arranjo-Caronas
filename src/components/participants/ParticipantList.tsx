"use client";

import { useState } from "react";
import { User, Edit, Trash2, Phone, Briefcase, X, Save } from "lucide-react";
import { updateParticipant, deleteParticipant } from "@/app/actions";

interface ParticipantListProps {
  participants: any[];
}

export function ParticipantList({ participants }: ParticipantListProps) {
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editName, setEditName] = useState("");
  const [editRole, setEditRole] = useState("");
  const [editPhone, setEditPhone] = useState("");

  const startEdit = (p: any) => {
    setEditingId(p.id);
    setEditName(p.name);
    setEditRole(p.role);
    setEditPhone(p.phone || "");
  };

  const cancelEdit = () => {
    setEditingId(null);
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId === null) return;
    
    const formData = new FormData();
    formData.append("name", editName);
    formData.append("role", editRole);
    formData.append("phone", editPhone);
    
    await updateParticipant(editingId, formData);
    setEditingId(null);
  };

  const handleDelete = async (id: number, name: string) => {
    if (confirm(`Tem certeza que deseja excluir ${name}? Esta ação não pode ser desfeita.`)) {
      await deleteParticipant(id);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
      <div className="grid grid-cols-1 divide-y divide-slate-100">
        {participants.map((p) => (
          <div key={p.id} className="p-4 flex items-center justify-between hover:bg-slate-50 transition-colors group">
            {editingId === p.id ? (
              <form onSubmit={handleUpdate} className="flex-1 space-y-3 pr-4">
                <div className="flex gap-2">
                  <input 
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className="flex-1 border rounded-lg px-3 py-1.5 text-sm"
                    placeholder="Nome"
                    required
                  />
                  <select 
                    value={editRole}
                    onChange={(e) => setEditRole(e.target.value)}
                    className="border rounded-lg px-3 py-1.5 text-sm w-32"
                  >
                    <option value="DRIVER">Motorista</option>
                    <option value="PASSENGER">Passageira</option>
                  </select>
                </div>
                <div className="flex gap-2">
                  <input 
                    value={editPhone}
                    onChange={(e) => setEditPhone(e.target.value)}
                    className="flex-1 border rounded-lg px-3 py-1.5 text-sm"
                    placeholder="WhatsApp (ex: 11999999999)"
                  />
                  <div className="flex gap-1">
                    <button type="submit" className="bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700">
                      <Save className="h-4 w-4" />
                    </button>
                    <button type="button" onClick={cancelEdit} className="bg-slate-200 text-slate-600 p-2 rounded-lg hover:bg-slate-300">
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </form>
            ) : (
              <>
                <div className="flex items-center gap-4">
                  <div className={`h-10 w-10 rounded-full flex items-center justify-center ${p.role === "DRIVER" ? "bg-blue-50 text-blue-600" : "bg-purple-50 text-purple-600"}`}>
                    <User className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900">{p.name}</h4>
                    <div className="flex items-center gap-3 text-xs text-slate-500 mt-0.5">
                      <span className="flex items-center gap-1 uppercase font-semibold tracking-tighter">
                        <Briefcase className="h-3 w-3" />
                        {p.role === "DRIVER" ? "Motorista" : "Passageira"}
                      </span>
                      {p.phone && (
                        <span className="flex items-center gap-1 font-medium">
                          <Phone className="h-3 w-3 text-green-500" />
                          {p.phone}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => startEdit(p)}
                    className="p-2.5 text-blue-600 bg-blue-50 md:text-slate-400 md:bg-transparent md:hover:text-blue-600 md:hover:bg-blue-50 rounded-full transition-all"
                  >
                    <Edit className="h-5 w-5" />
                  </button>
                  <button 
                    onClick={() => handleDelete(p.id, p.name)}
                    className="p-2.5 text-red-600 bg-red-50 md:text-slate-400 md:bg-transparent md:hover:text-red-500 md:hover:bg-red-50 rounded-full transition-all"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
