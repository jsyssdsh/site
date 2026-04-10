import { NextRequest, NextResponse } from "next/server";
import { MEMBER_COOKIE_NAME, MEMBER_COOKIE_VALUE } from "@/lib/member-auth";

function isMember(request: NextRequest): boolean {
  return request.cookies.get(MEMBER_COOKIE_NAME)?.value === MEMBER_COOKIE_VALUE;
}

export function middleware(request: NextRequest) {
  if (isMember(request)) {
    return NextResponse.next();
  }

  const { pathname, search } = request.nextUrl;
  const target = `${pathname}${search}`;
  const signupUrl = new URL("/signup", request.url);
  signupUrl.searchParams.set("next", target);
  return NextResponse.redirect(signupUrl);
}

export const config = {
  matcher: ["/case-studies/:path*"],
};
