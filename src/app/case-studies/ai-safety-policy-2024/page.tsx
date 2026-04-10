"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

type TocSubItem = {
  id: string;
  title: string;
  page: number;
};

type TocSection = {
  id: string;
  title: string;
  page: number;
  items: TocSubItem[];
};

const fallbackToc: TocSection[] = [
  {
    id: "part-1",
    title: "PART 1 AI 안전 개요",
    page: 6,
    items: [
      { id: "p1-1", title: "1. AI 안전 기본 개념", page: 10 },
      { id: "p1-2", title: "2. AI 안전 과연 보장할 수 있을까?", page: 20 },
      { id: "p1-3", title: "3. 각국의 AI 안전 정의", page: 31 },
    ],
  },
  {
    id: "part-2",
    title: "PART 2 국가별 AI 안전 정책",
    page: 55,
    items: [
      { id: "p2-1", title: "1. UN AI 안전 정책", page: 55 },
      { id: "p2-2", title: "2. EU AI 안전 정책", page: 65 },
      { id: "p2-3", title: "3. 미국 AI 안전 정책", page: 163 },
      { id: "p2-4", title: "4. 영국 AI 안전 정책", page: 234 },
      { id: "p2-5", title: "5. 중국 AI 안전 정책", page: 256 },
      { id: "p2-6", title: "6. 한국 AI 안전 정책 제언", page: 263 },
    ],
  },
  {
    id: "part-3",
    title: "PART 3 기업 및 민간 단체의 AI 안전 정책",
    page: 275,
    items: [
      { id: "p3-1", title: "1. Asilomar AI 안전 원칙", page: 275 },
      { id: "p3-2", title: "2. OpenAI, AI 안전 정책", page: 283 },
      { id: "p3-3", title: "3. Microsoft AI 안전 정책", page: 292 },
      { id: "p3-4", title: "4. Google AI 안전 정책", page: 296 },
      { id: "p3-5", title: "5. Anthropic AI 안전 정책", page: 301 },
      { id: "p3-6", title: "6. METR AI 안전 정책", page: 306 },
      { id: "p3-7", title: "7. AI 안전 국제표준 동향", page: 310 },
    ],
  },
  {
    id: "part-4",
    title: "PART 4 맺음말",
    page: 319,
    items: [{ id: "p4-1", title: "맺음말", page: 319 }],
  },
];

export default function AiSafetyPolicy2024Page() {
  const [toc, setToc] = useState<TocSection[]>(fallbackToc);
  const [currentPage, setCurrentPage] = useState<number>(fallbackToc[0].items[0].page);
  const [isAutoExtracted, setIsAutoExtracted] = useState<boolean>(false);

  useEffect(() => {
    let mounted = true;

    const loadToc = async () => {
      try {
        const response = await fetch("/api/docs/ai-safety-policy-2024/toc", {
          cache: "no-store",
        });
        if (!response.ok) return;

        const payload = (await response.json()) as { toc?: TocSection[] };
        if (!mounted || !payload.toc || payload.toc.length === 0) return;

        setToc(payload.toc);
        setCurrentPage(payload.toc[0].items[0]?.page ?? payload.toc[0].page);
        setIsAutoExtracted(true);
      } catch {
        // Keep fallback TOC.
      }
    };

    void loadToc();
    return () => {
      mounted = false;
    };
  }, []);

  const activeLabel = useMemo(() => {
    for (const section of toc) {
      if (section.page === currentPage) {
        return `${section.title} (p.${section.page})`;
      }
      const sub = section.items.find((item) => item.page === currentPage);
      if (sub) {
        return `${section.title} > ${sub.title} (p.${sub.page})`;
      }
    }
    return `Page ${currentPage}`;
  }, [currentPage, toc]);

  const viewerSrc = useMemo(
    () => `/api/docs/ai-safety-policy-2024?nav=${currentPage}#page=${currentPage}&zoom=page-fit`,
    [currentPage],
  );

  return (
    <div className="min-h-screen bg-slate-950 px-6 py-10 text-slate-100 lg:px-10">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-8">
        <header className="flex flex-wrap items-center justify-between gap-4 rounded-3xl border border-white/10 bg-white/5 p-6">
          <div className="space-y-2">
            <p className="text-xs uppercase tracking-[0.24em] text-slate-500">
              Curated Case Study 03
            </p>
            <h1 className="text-2xl font-semibold text-white">
              AI Safety Policy 2024 - TOC Navigator
            </h1>
            <p className="text-sm text-slate-300">
              좌측 장/소절을 클릭하면 해당 PDF 페이지로 이동합니다.
            </p>
            <p className="text-xs text-slate-500">
              {isAutoExtracted
                ? "실제 PDF에서 자동 추출된 목차를 표시 중입니다."
                : "초기 목차를 먼저 표시하고, 자동 추출 결과로 갱신합니다."}
            </p>
          </div>
          <Link
            className="inline-flex rounded-full border border-white/15 px-4 py-2 text-sm font-semibold text-white transition hover:border-white/40 hover:bg-white/5"
            href="/"
          >
            Back to Main Page
          </Link>
        </header>

        <section className="grid gap-6 lg:grid-cols-[0.34fr_0.66fr]">
          <aside className="max-h-[78vh] overflow-y-auto rounded-3xl border border-white/10 bg-white/5 p-5">
            <p className="text-xs uppercase tracking-[0.24em] text-slate-500">
              Contents
            </p>
            <div className="mt-4 space-y-4">
              {toc.map((section) => {
                const sectionActive = currentPage === section.page;
                return (
                  <div
                    key={section.id}
                    className="rounded-2xl border border-white/10 bg-slate-900/35 p-3"
                  >
                    <button
                      className={`w-full rounded-xl border px-3 py-3 text-left transition ${
                        sectionActive
                          ? "border-sky-300/45 bg-sky-300/10 text-sky-100"
                          : "border-white/10 bg-slate-900/40 text-slate-200 hover:border-white/30"
                      }`}
                      onClick={() => setCurrentPage(section.page)}
                      type="button"
                    >
                      <p className="text-sm font-semibold">{section.title}</p>
                      <p className="mt-1 text-xs text-slate-400">
                        Part start: {section.page}
                      </p>
                    </button>

                    <div className="mt-2 space-y-2 pl-2">
                      {section.items.map((item) => {
                        const active = currentPage === item.page;
                        return (
                          <button
                            key={item.id}
                            className={`w-full rounded-lg border px-3 py-2 text-left text-xs transition ${
                              active
                                ? "border-sky-300/45 bg-sky-300/10 text-sky-100"
                                : "border-white/10 bg-slate-950/40 text-slate-300 hover:border-white/30"
                            }`}
                            onClick={() => setCurrentPage(item.page)}
                            type="button"
                          >
                            <p>{item.title}</p>
                            <p className="mt-1 text-[11px] text-slate-500">
                              Start page: {item.page}
                            </p>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </aside>

          <div className="rounded-3xl border border-white/10 bg-black/30 p-3">
            <div className="mb-3 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs text-slate-300">
              Now viewing: <span className="font-semibold text-white">{activeLabel}</span>
            </div>
            <iframe
              key={viewerSrc}
              className="h-[72vh] w-full rounded-2xl bg-slate-900"
              src={viewerSrc}
              title="AI safety policy 2024 PDF viewer"
            />
          </div>
        </section>
      </div>
    </div>
  );
}
