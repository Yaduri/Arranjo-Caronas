import { getConfigurations, updateConfiguration } from "@/app/actions";
import { DEFAULT_DRIVER_TEMPLATE, DEFAULT_PASSENGER_TEMPLATE } from "@/lib/utils";
import { MessageSquare, Save, Info } from "lucide-react";

export default async function SettingsPage() {
  const configs = await getConfigurations();

  async function handleSubmit(formData: FormData) {
    "use server";
    const driverTemplate = formData.get("driverTemplate") as string;
    const passengerTemplate = formData.get("passengerTemplate") as string;

    await updateConfiguration("driver_message_template", driverTemplate);
    await updateConfiguration("passenger_message_template", passengerTemplate);
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-12">
        <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tighter mb-4">
          Ajustes do Sistema
        </h1>
        <p className="text-slate-500 font-semibold text-lg leading-relaxed">
          Personalize as mensagens automáticas enviadas via WhatsApp.
        </p>
      </div>

      <form action={handleSubmit} className="space-y-8">
        <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm">
          <div className="flex items-center gap-3 mb-6">
            <div className="h-12 w-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center">
              <MessageSquare className="h-6 w-6" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-slate-900">Mensagem para Motoristas</h3>
              <p className="text-sm text-slate-500">Enviada ao clicar em "Enviar Lembrete"</p>
            </div>
          </div>

          <div className="space-y-4">
            <textarea
              name="driverTemplate"
              rows={4}
              defaultValue={configs.driver_message_template || DEFAULT_DRIVER_TEMPLATE}
              className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 text-slate-900 font-medium outline-none focus:ring-2 focus:ring-blue-500 transition-all resize-none"
            />
            
            <div className="bg-blue-50/50 rounded-xl p-4 flex gap-3 items-start">
              <Info className="h-5 w-5 text-blue-500 shrink-0 mt-0.5" />
              <div className="text-xs text-blue-700 space-y-1">
                <p className="font-bold uppercase tracking-wider mb-1">Variáveis disponíveis:</p>
                <p><code>{`{motorista}`}</code> - Nome do irmão que dirige</p>
                <p><code>{`{passageiras}`}</code> - Lista de passageiras</p>
                <p><code>{`{data}`}</code> - Data da reunião</p>
                <p><code>{`{hora}`}</code> - Horário da reunião</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm">
          <div className="flex items-center gap-3 mb-6">
            <div className="h-12 w-12 bg-purple-50 text-purple-600 rounded-2xl flex items-center justify-center">
              <MessageSquare className="h-6 w-6" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-slate-900">Mensagem para Passageiras</h3>
              <p className="text-sm text-slate-500">Enviada ao clicar em "Confirmar"</p>
            </div>
          </div>

          <div className="space-y-4">
            <textarea
              name="passengerTemplate"
              rows={4}
              defaultValue={configs.passenger_message_template || DEFAULT_PASSENGER_TEMPLATE}
              className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 text-slate-900 font-medium outline-none focus:ring-2 focus:ring-purple-500 transition-all resize-none"
            />
            
            <div className="bg-purple-50/50 rounded-xl p-4 flex gap-3 items-start">
              <Info className="h-5 w-5 text-purple-500 shrink-0 mt-0.5" />
              <div className="text-xs text-purple-700 space-y-1">
                <p className="font-bold uppercase tracking-wider mb-1">Variáveis disponíveis:</p>
                <p><code>{`{passageira}`}</code> - Nome da passageira</p>
                <p><code>{`{motorista}`}</code> - Nome do irmão que dirige</p>
                <p><code>{`{data}`}</code> - Data da reunião</p>
              </div>
            </div>
          </div>
        </div>

        <button
          type="submit"
          className="w-full md:w-auto px-8 py-4 bg-slate-900 hover:bg-black text-white font-bold rounded-2xl transition-all shadow-lg flex items-center justify-center gap-2"
        >
          <Save className="h-5 w-5" />
          Salvar Alterações
        </button>
      </form>
    </div>
  );
}
