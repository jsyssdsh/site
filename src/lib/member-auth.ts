export const MEMBER_COOKIE_NAME = "site_member";
export const MEMBER_SESSION_TTL_SECONDS = 60 * 60 * 24 * 30;
const MEMBER_SECRET_FALLBACK = "dev-only-member-secret-change-this";

function parseCookieHeader(cookieHeader: string | null): Record<string, string> {
  if (!cookieHeader) return {};

  return cookieHeader.split(";").reduce<Record<string, string>>((acc, part) => {
    const [rawKey, ...rawValue] = part.trim().split("=");
    if (!rawKey) return acc;
    acc[rawKey] = decodeURIComponent(rawValue.join("=") ?? "");
    return acc;
  }, {});
}

function getMemberSecret(): string {
  return (
    process.env.MEMBER_AUTH_SECRET ??
    process.env.NEXTAUTH_SECRET ??
    MEMBER_SECRET_FALLBACK
  );
}

function toHex(input: ArrayBuffer): string {
  return Array.from(new Uint8Array(input))
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
}

function timingSafeEqualString(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let result = 0;
  for (let i = 0; i < a.length; i += 1) {
    result |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return result === 0;
}

async function signPayload(payload: string, secret: string): Promise<string> {
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const signature = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(payload));
  return toHex(signature);
}

export async function createMemberSessionToken(): Promise<string> {
  const expiresAt = Math.floor(Date.now() / 1000) + MEMBER_SESSION_TTL_SECONDS;
  const payload = `v1.${expiresAt}`;
  const signature = await signPayload(payload, getMemberSecret());
  return `${payload}.${signature}`;
}

export async function isValidMemberSessionToken(token: string | undefined): Promise<boolean> {
  if (!token) return false;

  const [version, expiresAtRaw, signature] = token.split(".");
  if (version !== "v1" || !expiresAtRaw || !signature) return false;
  if (!/^\d+$/.test(expiresAtRaw)) return false;

  const expiresAt = Number(expiresAtRaw);
  if (!Number.isFinite(expiresAt) || expiresAt <= Math.floor(Date.now() / 1000)) {
    return false;
  }

  const payload = `${version}.${expiresAtRaw}`;
  const expectedSignature = await signPayload(payload, getMemberSecret());
  return timingSafeEqualString(signature, expectedSignature);
}

export async function hasMemberAccess(request: Request): Promise<boolean> {
  const cookieHeader = request.headers.get("cookie");
  const cookies = parseCookieHeader(cookieHeader);
  return isValidMemberSessionToken(cookies[MEMBER_COOKIE_NAME]);
}
