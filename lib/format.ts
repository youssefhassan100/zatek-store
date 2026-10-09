const dateFormatter = new Intl.DateTimeFormat('en-GB', {
  dateStyle: 'medium',
  timeStyle: 'short',
  timeZone: 'Africa/Cairo',
});

export const formatDate = (iso: string) => dateFormatter.format(new Date(iso));

export const formatEGP = (amount: number) => `${amount.toLocaleString('en-US')} EGP`;

/** Accepts a local Egyptian number (01…) or an international one (20…). */
export function whatsappLink(number: string, text?: string) {
  const international = number.startsWith('0') ? `20${number.slice(1)}` : number;
  return `https://wa.me/${international}${text ? `?text=${encodeURIComponent(text)}` : ''}`;
}

export function normalizePhone(input: string) {
  const digits = input.replace(/\D/g, '');
  return digits.startsWith('20') ? `0${digits.slice(2)}` : digits;
}
