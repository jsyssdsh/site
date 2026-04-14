import { NextResponse } from "next/server";
import {
  createMemberSessionToken,
  MEMBER_COOKIE_NAME,
  MEMBER_SESSION_TTL_SECONDS,
} from "@/lib/member-auth";

type SignupBody = {
  name?: string;
  email?: string;
  nextPath?: string;
};

function sanitizeNextPath(nextPath: string | undefined): string {
  if (!nextPath || !nextPath.startsWith("/")) return "/";
  if (nextPath.startsWith("//")) return "/";
  return nextPath;
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as SignupBody;
    const name = body.name?.trim() ?? "";
    const email = body.email?.trim() ?? "";
    const nextPath = sanitizeNextPath(body.nextPath);

    if (!name || !email) {
      return NextResponse.json({ error: "이름과 이메일은 필수입니다." }, { status: 400 });
    }

    const token = await createMemberSessionToken();
    const response = NextResponse.json({ ok: true, nextPath });
    response.cookies.set({
      name: MEMBER_COOKIE_NAME,
      value: token,
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: MEMBER_SESSION_TTL_SECONDS,
    });

    return response;
  } catch {
    return NextResponse.json({ error: "회원가입 처리 중 오류가 발생했습니다." }, { status: 500 });
  }
}
