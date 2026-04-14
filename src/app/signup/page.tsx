"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

export default function SignupPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");

    if (!name.trim() || !email.trim()) {
      setError("이름과 이메일을 입력해 주세요.");
      return;
    }

    setSubmitting(true);

    try {
      const nextPath = new URLSearchParams(window.location.search).get("next") ?? "/";
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          nextPath,
        }),
      });

      const payload = (await response.json()) as { nextPath?: string; error?: string };
      if (!response.ok) {
        throw new Error(payload.error ?? "가입 처리에 실패했습니다.");
      }

      localStorage.setItem(
        "site_member_profile",
        JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          joinedAt: new Date().toISOString(),
        }),
      );

      router.push(payload.nextPath ?? nextPath);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "가입 처리 중 오류가 발생했습니다.");
    } finally {
      setSubmitting(false);
    }
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
          <p className="text-xs leading-relaxed text-amber-200/90">
            데모용 접근 제어 페이지입니다. 실제 프로덕션 인증(계정 DB, 비밀번호 해시, OAuth)은
            아직 적용되지 않았습니다.
          </p>
        </div>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="space-y-1">
            <label className="text-xs uppercase tracking-[0.2em] text-slate-400" htmlFor="name">
              Name
            </label>
            <input
              autoComplete="name"
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
              autoComplete="email"
              className="w-full rounded-xl border border-white/15 bg-slate-900/70 px-4 py-3 text-sm text-white outline-none transition focus:border-sky-300/60"
              id="email"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
            />
          </div>

          {error ? <p className="text-sm text-rose-300">{error}</p> : null}

          <button
            className="w-full rounded-xl bg-sky-400 px-4 py-3 text-sm font-semibold text-slate-900 transition hover:bg-sky-300 disabled:opacity-60"
            disabled={submitting}
            type="submit"
          >
            {submitting ? "처리 중..." : "회원가입 후 계속하기"}
          </button>
        </form>
      </div>
    </div>
  );
}
