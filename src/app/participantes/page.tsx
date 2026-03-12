import { prisma } from "@/lib/prisma";
import { UserPlus } from "lucide-react";
import { addParticipant } from "@/app/actions";
import { ParticipantList } from "@/components/participants/ParticipantList";

export default async function ParticipantsPage() {
  const participants = await prisma.participant.findMany({
    orderBy: { name: "asc" },
  });

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-4xl font-black text-slate-900 tracking-tight">
          Participantes
        </h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        <div className="lg:col-span-1 order-last lg:order-first">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 sticky top-24 shadow-sm">
            <h3 className="font-bold text-slate-900 mb-5 flex items-center gap-2">
              <UserPlus className="h-5 w-5 text-blue-600" />
              Novo Participante
            </h3>
            <form action={addParticipant} className="space-y-4">
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Nome</label>
                <input name="name" type="text" placeholder="Ex: Rodrigo" className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50 transition-all font-medium" required />
              </div>
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Papel</label>
                <select name="role" className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50 transition-all font-medium" required>
                  <option value="DRIVER">Motorista</option>
                  <option value="PASSENGER">Passageira</option>
                </select>
              </div>
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 ml-1">WhatsApp</label>
                <input name="phone" type="text" placeholder="11999999999" className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50 transition-all font-medium" />
              </div>
              <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 rounded-xl transition-all shadow-lg shadow-blue-100 mt-2">
                Adicionar Participante
              </button>
            </form>
          </div>
        </div>

        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between px-1 mb-2">
            <h3 className="text-lg font-bold text-slate-900">Lista Completa</h3>
            <span className="text-xs font-semibold text-slate-400">{participants.length} pessoas</span>
          </div>
          <ParticipantList participants={participants} />
        </div>
      </div>
    </div>
  );
}
