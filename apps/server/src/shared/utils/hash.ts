import { createHash, scryptSync, randomBytes, timingSafeEqual } from 'crypto';

export function hashPin(pin: string): string {
  const salt = randomBytes(16).toString('hex');
  const hash = scryptSync(pin, salt, 64).toString('hex');
  return `${salt}:${hash}`;
}

export function verifyPin(pin: string, stored: string): boolean {
  const [salt, hash] = stored.split(':');
  const derived = scryptSync(pin, salt, 64);
  return timingSafeEqual(Buffer.from(hash, 'hex'), derived);
}

export function checksumFile(buffer: Buffer): string {
  return createHash('sha256').update(buffer).digest('hex');
}
