"use client";

import { FormEvent, useState } from "react";

type Message = {
  role: "user" | "assistant";
  content: string;
};

export default function DigitalTwinChat() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content:
        "안녕하세요. 저는 Jang Soo Lee 디지털 트윈입니다. 경력, 전문성, 협업 가능 분야를 물어보세요.",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const text = input.trim();
    if (!text || loading) return;

    const nextMessages: Message[] = [...messages, { role: "user", content: text }];
    setMessages(nextMessages);
    setInput("");
    setError("");
    setLoading(true);

    try {
      const response = await fetch("/api/chat/digital-twin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: nextMessages
            .filter((m) => m.role === "user" || m.role === "assistant")
            .slice(-12),
        }),
      });

      const data = (await response.json()) as { content?: string; error?: string };
      if (!response.ok || !data.content) {
        throw new Error(data.error ?? "챗 응답 생성에 실패했습니다.");
      }

      setMessages((prev) => [...prev, { role: "assistant", content: data.content! }]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="rounded-3xl border border-white/10 bg-white/5 p-8">
      <div className="mb-4 space-y-2">
        <p className="text-xs uppercase tracking-[0.3em] text-slate-500">AI Digital Twin</p>
        <h2 className="text-2xl font-semibold text-white">
          Ask about career, safety domains, and collaborations
        </h2>
      </div>

      <div className="h-72 space-y-3 overflow-y-auto rounded-2xl border border-white/10 bg-slate-950/60 p-4">
        {messages.map((message, idx) => (
          <div
            key={`${message.role}-${idx}`}
            className={
              message.role === "assistant"
                ? "max-w-[90%] rounded-xl border border-sky-300/20 bg-sky-300/10 px-3 py-2 text-sm text-slate-100"
                : "ml-auto max-w-[90%] rounded-xl border border-white/10 bg-white/10 px-3 py-2 text-sm text-white"
            }
          >
            {message.content}
          </div>
        ))}
      </div>

      <form className="mt-4 flex gap-3" onSubmit={submit}>
        <input
          className="flex-1 rounded-xl border border-white/15 bg-slate-900/70 px-4 py-3 text-sm text-white outline-none transition focus:border-sky-300/60"
          placeholder="예: 삼성에서 어떤 역할을 했나요?"
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <button
          className="rounded-xl bg-sky-400 px-5 py-3 text-sm font-semibold text-slate-900 transition hover:bg-sky-300 disabled:opacity-60"
          disabled={loading}
          type="submit"
        >
          {loading ? "Thinking..." : "Send"}
        </button>
      </form>

      {error ? <p className="mt-3 text-sm text-rose-300">{error}</p> : null}
    </section>
  );
}
