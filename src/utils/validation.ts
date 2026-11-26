/**
 * Validates standard email address format.
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email.trim());
}

/**
 * Validates Indian 10-digit mobile number format.
 */
export function isValidPhone(phone: string): boolean {
  const cleaned = phone.replace(/\D/g, '');
  return cleaned.length === 10;
}

/**
 * Validates password strength (minimum 6 characters).
 */
export function isValidPassword(password: string): boolean {
  return password.length >= 6;
}
