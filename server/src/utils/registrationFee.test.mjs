process.env.REGISTRATION_FEE = '970';
process.env.SECONDARY_REGISTRATION_FEE = '980';
process.env.TERTIARY_REGISTRATION_FEE = '1000';

const { getRegistrationFeeByLevel } = await import('./registrationFee.js');

const checks = [
  ['BASIC SCHOOL', 970],
  ['SECONDARY', 980],
  ['TERTIARY', 1000],
  ['basic_school', 970],
  ['unknown', 970]
];

for (const [level, expected] of checks) {
  const actual = getRegistrationFeeByLevel(level);
  if (actual !== expected) {
    throw new Error(`Expected ${level} -> ${expected}, got ${actual}`);
  }
}

console.log('registrationFee tests passed');
