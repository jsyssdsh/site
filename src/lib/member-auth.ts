export const MEMBER_COOKIE_NAME = "site_member";
export const MEMBER_COOKIE_VALUE = "1";

function parseCookieHeader(cookieHeader: string | null): Record<string, string> {
  if (!cookieHeader) return {};

  return cookieHeader.split(";").reduce<Record<string, string>>((acc, part) => {
    const [rawKey, ...rawValue] = part.trim().split("=");
    if (!rawKey) return acc;
    acc[rawKey] = decodeURIComponent(rawValue.join("=") ?? "");
    return acc;
  }, {});
}

export function hasMemberAccess(request: Request): boolean {
  const cookieHeader = request.headers.get("cookie");
  const cookies = parseCookieHeader(cookieHeader);
  return cookies[MEMBER_COOKIE_NAME] === MEMBER_COOKIE_VALUE;
}
