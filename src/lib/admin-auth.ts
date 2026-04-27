import { createHmac, timingSafeEqual } from "node:crypto";

import { cookies } from "next/headers";

const COOKIE_NAME = "admin-session";
const SESSION_TTL_MS = 1000 * 60 * 60 * 24 * 7;

function getAdminUsername() {
  return process.env.ADMIN_USERNAME || "admin";
}

function getAdminPassword() {
  return process.env.ADMIN_PASSWORD || "admin12345";
}

function getSessionSecret() {
  return process.env.ADMIN_SESSION_SECRET || `${getAdminPassword()}-session-secret`;
}

function sign(value: string) {
  return createHmac("sha256", getSessionSecret()).update(value).digest("base64url");
}

function createToken(username: string) {
  const expiresAt = Date.now() + SESSION_TTL_MS;
  const payload = `${username}.${expiresAt}`;
  return `${payload}.${sign(payload)}`;
}

function verifyToken(token: string) {
  const parts = token.split(".");

  if (parts.length < 3) {
    return false;
  }

  const signature = parts.pop();
  const payload = parts.join(".");
  const expectedSignature = sign(payload);

  if (!signature) {
    return false;
  }

  const signatureBuffer = Buffer.from(signature);
  const expectedBuffer = Buffer.from(expectedSignature);

  if (signatureBuffer.length !== expectedBuffer.length) {
    return false;
  }

  if (!timingSafeEqual(signatureBuffer, expectedBuffer)) {
    return false;
  }

  const [username, expiresAtRaw] = payload.split(".");
  const expiresAt = Number(expiresAtRaw);

  return username === getAdminUsername() && Number.isFinite(expiresAt) && expiresAt > Date.now();
}

export function validateAdminCredentials(username: string, password: string) {
  return username === getAdminUsername() && password === getAdminPassword();
}

export async function createAdminSession() {
  const store = await cookies();

  store.set(COOKIE_NAME, createToken(getAdminUsername()), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: SESSION_TTL_MS / 1000,
  });
}

export async function clearAdminSession() {
  const store = await cookies();
  store.delete(COOKIE_NAME);
}

export async function isAdminAuthenticated() {
  const store = await cookies();
  const token = store.get(COOKIE_NAME)?.value;

  if (!token) {
    return false;
  }

  return verifyToken(token);
}
