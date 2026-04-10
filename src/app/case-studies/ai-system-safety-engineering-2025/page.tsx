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
    id: "preface",
    title: "머리말",
    page: 8,
    items: [
      { id: "preface-1", title: "AI 시대의 안전 공학을 향하여", page: 8 },
      { id: "preface-2", title: "AI Risk의 분류와 본서의 논의 범위", page: 10 },
      { id: "preface-3", title: "Logical AI vs Physical AI", page: 11 },
      { id: "preface-4", title: "AI로 인한 재난 가능성", page: 12 },
    ],
  },
  {
    id: "chapter-1",
    title: "제1장 안전 공학에 대한 역사적·산업적 관점",
    page: 16,
    items: [
      { id: "c1-1", title: "I. Apollo 안전 프로그램", page: 17 },
      { id: "c1-2", title: "II. 작업장/제품·시스템 안전의 역사", page: 19 },
      { id: "c1-3", title: "왜 AI 시스템 안전이 중요한가?", page: 21 },
      { id: "c1-4", title: "III. 제품/시스템 안전 정의", page: 24 },
      { id: "c1-5", title: "1) 안전을 위한 설계", page: 26 },
      { id: "c1-6", title: "2) 인간 중심 안전 설계", page: 29 },
      { id: "c1-7", title: "3) 사고조사 및 안전 관리 방법", page: 32 },
      { id: "c1-8", title: "4) 안전 규정 및 인허가", page: 40 },
      { id: "c1-9", title: "IV. 제품/시스템 안전 사례", page: 43 },
      { id: "c1-10", title: "상업용 항공 사례", page: 45 },
      { id: "c1-11", title: "원자력 사례", page: 48 },
      { id: "c1-12", title: "화학산업 사례", page: 52 },
      { id: "c1-13", title: "국방 분야 사례", page: 54 },
    ],
  },
  {
    id: "risk-patterns",
    title: "확장 목차 A - 자동화/중앙집중 리스크",
    page: 132,
    items: [
      { id: "r1", title: "Increasing Automation Risk", page: 132 },
      { id: "r2", title: "Increasing Centralization and Scale Risk", page: 135 },
      { id: "r3", title: "Human-out-of-the-loop 리스크", page: 133 },
      { id: "r4", title: "공통원인실패(CCF) 관점", page: 136 },
    ],
  },
  {
    id: "software-safety",
    title: "확장 목차 B - 소프트웨어/시스템 안전 심화",
    page: 307,
    items: [
      { id: "s1", title: "I. 오늘날 시스템에서의 소프트웨어 사용", page: 307 },
      { id: "s2", title: "소프트웨어 사용 급증과 안전 문제", page: 309 },
      { id: "s3", title: "2. 문제 이해 (Generic Control Loop)", page: 311 },
      { id: "s4", title: "검증 한계와 Continuous Assurance", page: 310 },
    ],
  },
  {
    id: "strategy",
    title: "확장 목차 C - AI 안전 보장 실행 프레임",
    page: 494,
    items: [
      { id: "st1", title: "IV. AI 도입 시 안전 보장 전략 요약", page: 494 },
      { id: "st2", title: "데이터/거버넌스/모듈화 전략", page: 495 },
      { id: "st3", title: "V. STPA-AI 분석 워크플로우", page: 497 },
      { id: "st4", title: "Hazard/Constraint 도출 절차", page: 498 },
    ],
  },
];

export default function AiSystemSafetyEngineering2025Page() {
  const [toc, setToc] = useState<TocSection[]>(fallbackToc);
  const [currentPage, setCurrentPage] = useState<number>(fallbackToc[0].items[0].page);
  const [isAutoExtracted, setIsAutoExtracted] = useState<boolean>(false);

  useEffect(() => {
    let mounted = true;

    const loadToc = async () => {
      try {
        const response = await fetch(
          "/api/docs/ai-system-safety-engineering-2025/toc",
          { cache: "no-store" },
        );
        if (!response.ok) return;

        const payload = (await response.json()) as { toc?: TocSection[] };
        if (!mounted || !payload.toc || payload.toc.length === 0) return;

        setToc(payload.toc);
        setCurrentPage(payload.toc[0].items[0]?.page ?? payload.toc[0].page);
        setIsAutoExtracted(true);
      } catch {
        // Keep fallback TOC when extraction fails.
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
    () =>
      `/api/docs/ai-system-safety-engineering-2025?nav=${currentPage}#page=${currentPage}&zoom=page-fit`,
    [currentPage],
  );

  return (
    <div className="min-h-screen bg-slate-950 px-6 py-10 text-slate-100 lg:px-10">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-8">
        <header className="flex flex-wrap items-center justify-between gap-4 rounded-3xl border border-white/10 bg-white/5 p-6">
          <div className="space-y-2">
            <p className="text-xs uppercase tracking-[0.24em] text-slate-500">
              Curated Case Study 02
            </p>
            <h1 className="text-2xl font-semibold text-white">
              AI System Safety Engineering 2025 - TOC Navigator
            </h1>
            <p className="text-sm text-slate-300">
              좌측 목차의 장/소절을 클릭하면 해당 PDF 페이지로 이동합니다.
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
              title="AI system safety engineering 2025 PDF viewer"
            />
          </div>
        </section>
      </div>
    </div>
  );
}
