"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

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

const toc: TocSection[] = [
  {
    id: "part-1",
    title: "I. AI 안전 개요",
    page: 5,
    items: [
      { id: "part-1-1", title: "1) AI 안전 연구 분야", page: 5 },
      { id: "part-1-2", title: "2) AI 안전 국제표준 개발 동향", page: 28 },
    ],
  },
  {
    id: "part-2",
    title: "II. AI 시대 안전 정책 동향",
    page: 41,
    items: [
      { id: "part-2-1", title: "1) 글로벌 정상회의와 정책 프레임", page: 41 },
      { id: "part-2-2", title: "2) 규제 및 가이드라인 동향", page: 52 },
      { id: "part-2-3", title: "3) 산업/민간의 대응 흐름", page: 64 },
    ],
  },
  {
    id: "part-3",
    title: "III. SW·AI 안전 기본 개념",
    page: 72,
    items: [
      { id: "part-3-1", title: "1) 시스템 안전 정의와 범위", page: 72 },
      { id: "part-3-2", title: "2) Hazard vs Threat 구분", page: 79 },
      { id: "part-3-3", title: "3) 안전공학 방법론(STAMP/STPA) 연결", page: 84 },
    ],
  },
  {
    id: "part-4",
    title: "IV. AI 안전 연구 동향",
    page: 88,
    items: [
      { id: "part-4-1", title: "1) 기술 안전성(견고성/신뢰성)", page: 88 },
      { id: "part-4-2", title: "2) 모니터링/설명가능성/오용 탐지", page: 99 },
      { id: "part-4-3", title: "3) 사회·정책 연계 연구", page: 110 },
    ],
  },
  {
    id: "part-5",
    title: "V. AI 안전을 보장할 수 있는가?",
    page: 119,
    items: [
      { id: "part-5-1", title: "1) 보장 가능성의 한계와 현실", page: 119 },
      { id: "part-5-2", title: "2) 검증·평가·거버넌스 연계", page: 131 },
      { id: "part-5-3", title: "3) 향후 연구 과제와 질문", page: 143 },
    ],
  },
  {
    id: "part-6",
    title: "VI. 생명 AI 안전 연구 동향",
    page: 151,
    items: [
      { id: "part-6-1", title: "1) Bio-AI 위험 시나리오", page: 151 },
      { id: "part-6-2", title: "2) 생명안전 관점의 통제 전략", page: 157 },
    ],
  },
  {
    id: "part-7",
    title: "VII. 참고자료",
    page: 164,
    items: [
      { id: "part-7-1", title: "1) Articles", page: 164 },
      { id: "part-7-2", title: "2) Youtube/강의 자료", page: 168 },
    ],
  },
];

export default function AiSafety2023CaseStudyPage() {
  const [currentPage, setCurrentPage] = useState<number>(toc[0].items[0].page);

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
  }, [currentPage]);

  const viewerSrc = useMemo(
    () =>
      `/api/docs/ai-safety-2023?nav=${currentPage}#page=${currentPage}&zoom=page-fit`,
    [currentPage],
  );

  return (
    <div className="min-h-screen bg-slate-950 px-6 py-10 text-slate-100 lg:px-10">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-8">
        <header className="flex flex-wrap items-center justify-between gap-4 rounded-3xl border border-white/10 bg-white/5 p-6">
          <div className="space-y-2">
            <p className="text-xs uppercase tracking-[0.24em] text-slate-500">
              Curated Case Study 01
            </p>
            <h1 className="text-2xl font-semibold text-white">
              AI Safety 2023 - Table of Contents Explorer
            </h1>
            <p className="text-sm text-slate-300">
              장과 소절을 클릭하면 해당 시작 페이지로 PDF가 이동합니다.
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
              title="AI safety 2023 PDF viewer"
            />
          </div>
        </section>
      </div>
    </div>
  );
}
