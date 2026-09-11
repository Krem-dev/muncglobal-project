const DEFAULT_REGISTRATION_FEE = 970;

const normalizeLevel = (value = '') => String(value || '').trim().toUpperCase();

const parseFee = (value, fallback = DEFAULT_REGISTRATION_FEE) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
};

export const getRegistrationFeeByLevel = (level, env = process.env) => {
  const normalizedLevel = normalizeLevel(level);

  if (normalizedLevel === 'BASIC SCHOOL' || normalizedLevel === 'BASIC_SCHOOL' || normalizedLevel === 'BASIC') {
    return parseFee(env.REGISTRATION_FEE ?? env.BASIC_SCHOOL_REGISTRATION_FEE, DEFAULT_REGISTRATION_FEE);
  }

  if (normalizedLevel === 'SECONDARY') {
    return parseFee(env.SECONDARY_REGISTRATION_FEE, 980);
  }

  if (normalizedLevel === 'TERTIARY') {
    return parseFee(env.TERTIARY_REGISTRATION_FEE, 1000);
  }

  return parseFee(env.REGISTRATION_FEE, DEFAULT_REGISTRATION_FEE);
};

export const getRegistrationFeeAmount = (level, env = process.env) => {
  return getRegistrationFeeByLevel(level, env);
};
