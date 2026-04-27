const NON_DIGIT_REGEX = /[^\d]/g;

export function normalizeWhatsAppNumber(phoneNumber: string) {
  return phoneNumber.replace(NON_DIGIT_REGEX, "");
}

export function buildWhatsAppLink(phoneNumber: string, message: string) {
  const normalizedNumber = normalizeWhatsAppNumber(phoneNumber);
  const encodedMessage = encodeURIComponent(message);

  return `https://wa.me/${normalizedNumber}?text=${encodedMessage}`;
}
