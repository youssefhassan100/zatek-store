import 'server-only';
import { createHash, createHmac, randomBytes, scrypt, timingSafeEqual } from 'node:crypto';
import { cookies } from 'next/headers';
import { db } from './supabase';

const COOKIE_NAME = 'zatek_admin';
const SESSION_SECONDS = 60 * 60 * 8;
const KEY_LENGTH = 64;

const sha256 = (value: string) => createHash('sha256').update(value).digest();
const sign = (value: string) =>
  createHmac('sha256', process.env.ADMIN_SESSION_SECRET ?? '').update(value).digest('hex');
const safeEqual = (a: Buffer, b: Buffer) => a.length === b.length && timingSafeEqual(a, b);

const deriveKey = (password: string, salt: Buffer) =>
  new Promise<Buffer>((resolve, reject) =>
    scrypt(password, salt, KEY_LENGTH, (error, key) => (error ? reject(error) : resolve(key))),
  );

/** Hash saved from the admin panel; null until the password has been changed there. */
async function storedHash(): Promise<string | null> {
  const { data } = await db().from('admin_settings').select('password_hash').eq('id', 1).maybeSingle();
  return data?.password_hash ?? null;
}

/** Ties a session to the current password, so changing it signs every other device out. */
const credentialTag = (hash: string | null) => (hash ? sha256(hash).toString('hex').slice(0, 16) : 'env');

/** Uses the password saved in the database; before the first change, falls back to ADMIN_PASSWORD. */
export async function passwordMatches(input: string) {
  if (!process.env.ADMIN_SESSION_SECRET) return false;
  const hash = await storedHash();
  if (hash) {
    const [salt, key] = hash.split(':');
    return safeEqual(await deriveKey(input, Buffer.from(salt, 'hex')), Buffer.from(key, 'hex'));
  }
  const initial = process.env.ADMIN_PASSWORD;
  if (!initial) return false;
  return safeEqual(sha256(input), sha256(initial));
}

export async function setPassword(password: string) {
  const salt = randomBytes(16);
  const key = await deriveKey(password, salt);
  const { error } = await db().from('admin_settings').upsert({
    id: 1,
    password_hash: `${salt.toString('hex')}:${key.toString('hex')}`,
    updated_at: new Date().toISOString(),
  });
  if (error) throw new Error(error.message);
}

export async function startSession() {
  const payload = `${Date.now() + SESSION_SECONDS * 1000}.${credentialTag(await storedHash())}`;
  cookies().set(COOKIE_NAME, `${payload}.${sign(payload)}`, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: SESSION_SECONDS,
  });
}

export const endSession = () => cookies().delete(COOKIE_NAME);

export async function isAdmin() {
  const [expires, tag, signature] = cookies().get(COOKIE_NAME)?.value.split('.') ?? [];
  if (!expires || !tag || !signature || Number(expires) < Date.now()) return false;
  if (!safeEqual(Buffer.from(sign(`${expires}.${tag}`)), Buffer.from(signature))) return false;
  return tag === credentialTag(await storedHash());
}

export async function requireAdmin() {
  if (!(await isAdmin())) throw new Error('Unauthorized');
}
