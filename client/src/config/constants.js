/**
 * Application constants
 */

// API base URL - uses environment variable if available, otherwise defaults to localhost
export const API_BASE_URL = (import.meta.env.VITE_API_URL || 'https://muncglobal-project-server.onrender.com/api').trim();

export const ACCOMMODATION_OPTIONS = {
  fan: {
    label: '2 in 1 with fan',
    price: 1350,
    rooms: 680,
    beds: 1360
  },
  aircon: {
    label: '2 in 1 with air conditioning',
    price: 1500,
    rooms: 132,
    beds: 264
  }
};

export const getAccommodationFee = (accommodationType = 'fan') => {
  return ACCOMMODATION_OPTIONS[accommodationType]?.price ?? ACCOMMODATION_OPTIONS.fan.price;
};

export const REGISTRATION_FEE = getAccommodationFee();

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
