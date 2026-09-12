import crypto from "crypto";
import { cookies } from "next/headers";

const COOKIE = "porto_admin";
const MAX_AGE = 60 * 60 * 24 * 7; // 7 days

function secret(): string {
  return process.env.SESSION_SECRET || process.env.ADMIN_PASSWORD || "porto-dev-secret";
}

function sign(payload: string): string {
  return crypto.createHmac("sha256", secret()).update(payload).digest("hex");
}

export function makeToken(): string {
  const payload = `admin.${Date.now()}`;
  return `${Buffer.from(payload).toString("base64url")}.${sign(payload)}`;
}

export function validToken(token: string | undefined): boolean {
  if (!token) return false;
  const [b64, sig] = token.split(".");
  if (!b64 || !sig) return false;
  let payload: string;
  try {
    payload = Buffer.from(b64, "base64url").toString("utf8");
  } catch {
    return false;
  }
  const expected = sign(payload);
  if (!crypto.timingSafeEqual(Buffer.from(sig), Buffer.from(expected))) return false;
  const ts = Number(payload.split(".")[1]);
  return Number.isFinite(ts) && Date.now() - ts < MAX_AGE * 1000;
}

export async function isAuthenticated(): Promise<boolean> {
  const store = await cookies();
  return validToken(store.get(COOKIE)?.value);
}

export const AUTH_COOKIE = COOKIE;
export const AUTH_MAX_AGE = MAX_AGE;
