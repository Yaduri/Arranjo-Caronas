export function getNextSunday() {
  const now = new Date();
  const day = now.getDay();
  const diff = (7 - day) % 7;
  const nextSunday = new Date(now);
  nextSunday.setDate(now.getDate() + diff);
  nextSunday.setHours(0, 0, 0, 0);
  return nextSunday;
}

export function formatDate(date: Date) {
  return date.toLocaleDateString("pt-BR", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });
}

export function generateWhatsappLink(phone: string | null, message: string) {
  if (!phone) return null;
  const cleanPhone = phone.replace(/\D/g, "");
  return `https://wa.me/55${cleanPhone}?text=${encodeURIComponent(message)}`;
}

export const DEFAULT_DRIVER_TEMPLATE = "Olá {motorista}! Passando para lembrar que você dará carona para {passageiras} na reunião de {data} às {hora}. Combinado?";
export const DEFAULT_PASSENGER_TEMPLATE = "Olá {passageira}! Você vai na reunião de {data}? O {motorista} vai passar para te buscar.";

export function replaceVariables(template: string, variables: Record<string, string>) {
  let result = template;
  Object.entries(variables).forEach(([key, value]) => {
    result = result.replace(new RegExp(`{${key}}`, "g"), value);
  });
  return result;
}
