"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { MEMBER_COOKIE_NAME, MEMBER_COOKIE_VALUE } from "@/lib/member-auth";

export default function SignupPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");

    if (!name.trim() || !email.trim() || !password.trim()) {
      setError("모든 항목을 입력해 주세요.");
      return;
    }

    if (password.length < 6) {
      setError("비밀번호는 6자 이상으로 설정해 주세요.");
      return;
    }

    document.cookie = `${MEMBER_COOKIE_NAME}=${MEMBER_COOKIE_VALUE}; path=/; max-age=31536000; samesite=lax`;
    localStorage.setItem(
      "site_member_profile",
      JSON.stringify({
        name: name.trim(),
        email: email.trim(),
        joinedAt: new Date().toISOString(),
      }),
    );

    const nextPath = new URLSearchParams(window.location.search).get("next") ?? "/";
    router.push(nextPath);
    router.refresh();
  };

  return (
    <div className="min-h-screen bg-slate-950 px-6 py-10 text-slate-100 lg:px-10">
      <div className="mx-auto flex w-full max-w-lg flex-col gap-8 rounded-3xl border border-white/10 bg-white/5 p-8">
        <div className="space-y-3">
          <p className="text-xs uppercase tracking-[0.24em] text-slate-500">
            Member Access
          </p>
          <h1 className="text-3xl font-semibold text-white">회원가입</h1>
          <p className="text-sm text-slate-300">
            Curated 하위 페이지 접근을 위해 간단한 회원가입을 진행해 주세요.
          </p>
        </div>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="space-y-1">
            <label className="text-xs uppercase tracking-[0.2em] text-slate-400" htmlFor="name">
              Name
            </label>
            <input
              className="w-full rounded-xl border border-white/15 bg-slate-900/70 px-4 py-3 text-sm text-white outline-none transition focus:border-sky-300/60"
              id="name"
              value={name}
              onChange={(event) => setName(event.target.value)}
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs uppercase tracking-[0.2em] text-slate-400" htmlFor="email">
              Email
            </label>
            <input
              className="w-full rounded-xl border border-white/15 bg-slate-900/70 px-4 py-3 text-sm text-white outline-none transition focus:border-sky-300/60"
              id="email"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
            />
          </div>

          <div className="space-y-1">
            <label
              className="text-xs uppercase tracking-[0.2em] text-slate-400"
              htmlFor="password"
            >
              Password
            </label>
            <input
              className="w-full rounded-xl border border-white/15 bg-slate-900/70 px-4 py-3 text-sm text-white outline-none transition focus:border-sky-300/60"
              id="password"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
            />
          </div>

          {error ? <p className="text-sm text-rose-300">{error}</p> : null}

          <button
            className="w-full rounded-xl bg-sky-400 px-4 py-3 text-sm font-semibold text-slate-900 transition hover:bg-sky-300"
            type="submit"
          >
            회원가입 후 계속하기
          </button>
        </form>
      </div>
    </div>
  );
}
