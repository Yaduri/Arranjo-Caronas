import { prisma } from "@/lib/prisma";
import { getNextSunday, formatDate } from "@/lib/utils";
import { RideCard } from "@/components/arrangement/RideCard";
import { ArrangementBuilder } from "@/components/arrangement/ArrangementBuilder";
import { Calendar, Info, Plus, ChevronRight } from "lucide-react";
import { AttendanceConfirmation } from "@/components/notifications/AttendanceConfirmation";
import { PrintButton } from "@/components/ui/PrintButton";
import { DEFAULT_DRIVER_TEMPLATE, DEFAULT_PASSENGER_TEMPLATE } from "@/lib/utils";

export default async function Home() {
  const participants = await prisma.participant.findMany();
  const drivers = participants.filter((p) => p.role === "DRIVER");
  const passengers = participants.filter((p) => p.role === "PASSENGER");

  const now = new Date();
  now.setHours(0, 0, 0, 0);

  const rides = await prisma.ride.findMany({
    where: {
      date: {
        gte: now,
      },
    },
    include: {
      driver: true,
      passengers: {
        include: {
          passenger: true,
        },
      },
    },
    orderBy: {
      date: "asc",
    },
  });

  const configs = await prisma.appSetting.findMany();
  const configMap: Record<string, string> = {};
  configs.forEach((c: { key: string; value: string }) => {
    configMap[c.key] = c.value;
  });

  const driverTemplate = configMap.driver_message_template || DEFAULT_DRIVER_TEMPLATE;
  const passengerTemplate = configMap.passenger_message_template || DEFAULT_PASSENGER_TEMPLATE;

  // Group rides by date for better visualization
  const groupedRides = rides.reduce((acc: any, ride) => {
    const d = new Date(ride.date).toDateString();
    if (!acc[d]) acc[d] = [];
    acc[d].push(ride);
    return acc;
  }, {});

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
        <div className="max-w-xl">
          <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tighter mb-4">
            Agenda de Caronas
          </h1>
          <p className="text-slate-500 font-semibold text-lg leading-relaxed print:hidden print-hide">
            Bem-vindo ao seu painel de planejamento. Gerencie os próximos arranjos abaixo.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 print:hidden">
          <PrintButton />
          <div className="h-6 w-px bg-slate-200 hidden sm:block" />
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest sm:hidden">Confirmar presença</span>
          <AttendanceConfirmation passengers={passengers} template={passengerTemplate} driverTemplate={driverTemplate} />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 print:block">
        <div className="lg:col-span-12 xl:col-span-8 order-2 lg:order-1 space-y-12 print:space-y-6">
          {Object.keys(groupedRides).length > 0 ? (
            Object.entries(groupedRides).map(([dateStr, dayRides]: [string, any]) => (
              <section key={dateStr} className="relative pl-6 sm:pl-10 border-l-4 border-blue-50 space-y-6">
                <div className="absolute -left-[11px] top-1.5 h-5 w-5 rounded-full bg-blue-500 border-4 border-white shadow-md shadow-blue-100" />
                <h2 className="text-sm font-black text-slate-400 uppercase tracking-[0.25em] mb-6 flex items-center gap-3">
                  {formatDate(new Date(dateStr))}
                  <div className="h-px flex-1 bg-slate-100 hidden sm:block" />
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {dayRides.map((ride: any) => (
                    <RideCard key={ride.id} ride={ride} drivers={drivers} passengers={passengers} template={driverTemplate} />
                  ))}
                </div>
              </section>
            ))
          ) : (
            <div className="bg-white rounded-3xl border border-slate-100 p-12 sm:p-20 text-center shadow-sm">
              <div className="h-24 w-24 bg-blue-50/50 rounded-full flex items-center justify-center mx-auto mb-8">
                <Info className="h-12 w-12 text-blue-200" />
              </div>
              <h3 className="text-2xl font-black text-slate-900 mb-3 tracking-tight">Agenda vazia</h3>
              <p className="text-slate-500 max-w-xs mx-auto font-medium leading-relaxed">
                Nenhum arranjo cadastrado para os próximos dias. Use o formulário à direita para começar.
              </p>
            </div>
          )}
        </div>

        <div className="lg:col-span-12 xl:col-span-4 order-1 lg:order-2 print:hidden">
          <div className="sticky top-24 space-y-6">
            <div className="bg-blue-600 rounded-3xl p-6 sm:p-7 text-white shadow-xl shadow-blue-500/20 overflow-hidden relative">
              <div className="absolute top-0 right-0 h-32 w-32 bg-white/10 rounded-full -mr-16 -mt-16 blur-2xl" />
              <h3 className="text-xl font-bold mb-1 flex items-center gap-2 relative z-10">
                <Plus className="h-6 w-6" />
                Novo Arranjo
              </h3>
              <p className="text-blue-100 text-sm font-medium mb-6 relative z-10">
                Organize uma nova carona para qualquer reunião do ano.
              </p>
              <div className="relative z-10">
                <ArrangementBuilder drivers={drivers} passengers={passengers} date={now} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
