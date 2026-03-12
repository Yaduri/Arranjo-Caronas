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
