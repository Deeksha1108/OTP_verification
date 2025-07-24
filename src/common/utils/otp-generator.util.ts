import { randomInt } from 'crypto';

export function generateOtp(length = 6): string {
  const MIN_LENGTH = 1;
  const MAX_LENGTH = 6;

  if (length < MIN_LENGTH || length > MAX_LENGTH) {
    throw new Error(
      `OTP length must be between ${MIN_LENGTH} and ${MAX_LENGTH}`,
    );
  }

  const charset = '0123456789';

  return Array.from(
    { length },
    () => charset[randomInt(0, charset.length)],
  ).join('');
}
