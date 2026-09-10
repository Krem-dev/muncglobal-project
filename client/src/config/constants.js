/**
 * Application constants
 */

const envRegistrationFee = Number(import.meta.env.VITE_REGISTRATION_FEE ?? 970);

// API base URL - uses environment variable if available, otherwise defaults to localhost
export const API_BASE_URL = (import.meta.env.VITE_API_URL || 'https://muncglobal-project-server.onrender.com/api').trim();

export const REGISTRATION_FEE = Number.isFinite(envRegistrationFee) && envRegistrationFee > 0 ? envRegistrationFee : 970;

export const REGISTRATION_FEE_BY_LEVEL = {
  BASIC_SCHOOL: 970,
  SECONDARY: 980,
  TERTIARY: 1000,
  DEFAULT: 970
};

// Date constants
export const REGISTRATION_DEADLINE = 'December 26, 2026';
export const REFUND_POLICY_DATE = 'December 16, 2026';
export const TRANSFER_POLICY_DATE = 'December 26, 2026';


// Social media links
export const SOCIAL_MEDIA = {
  facebook: 'https://www.facebook.com/muncglobal',
  linkedin: 'https://www.linkedin.com/company/muncglobal',
  twitter: 'https://x.com/muncglobal?s=21',
  instagram: 'https://www.instagram.com/muncglobal?igsh=MXV4d2I0ZjdxNXBv&utm_source=qr',
  tiktok: 'https://www.tiktok.com/@muncglobal'
};
