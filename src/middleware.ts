import { NextRequest, NextResponse } from "next/server";
import { MEMBER_COOKIE_NAME, isValidMemberSessionToken } from "@/lib/member-auth";

async function isMember(request: NextRequest): Promise<boolean> {
  return isValidMemberSessionToken(request.cookies.get(MEMBER_COOKIE_NAME)?.value);
}

export async function middleware(request: NextRequest) {
  if (await isMember(request)) {
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
