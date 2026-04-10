import Link from "next/link";
import DigitalTwinChat from "@/components/digital-twin-chat";

export default function Home() {
  const timeline = [
    {
      period: "2023.04 – Present",
      role: "Research Professor, SoC",
      org: "KAIST",
      location: "Daejeon, Korea",
      focus: "Safety research for safety-critical SoC systems.",
    },
    {
      period: "2018.06 – 2021.12",
      role: "Senior Advisor (SVP)",
      org: "Samsung Electronics",
      location: "Korea",
      focus:
        "Safety for autonomous car embedded systems (SoC, system software, perception, AI).",
    },
    {
      period: "1986.01 – 2018.05",
      role: "Principal Researcher",
      org: "Korea Atomic Energy Research Institute (KAERI)",
      location: "Daejeon, Korea",
      focus: "Safety-critical computer systems for nuclear, railway, and military.",
    },
  ];

  const expertise = [
    {
      title: "Semiconductor Safety for Automotive",
      description:
        "Functional safety strategies for SoC design, validation, and lifecycle assurance.",
    },
    {
      title: "Software Safety",
      description:
        "Safety-critical software architecture, verification, and compliance readiness.",
    },
    {
      title: "AI Safety",
      description:
        "Trustworthy perception and AI systems with rigorous safety constraints.",
    },
  ];

  const credentials = [
    {
      label: "International P.E. of ICT",
      detail: "1991 – Present",
    },
    {
      label: "Ph.D., Computer Science",
      detail: "KAIST (1995 – 2001)",
    },
  ];

  const portfolio = [
    {
      title: "Case Study 01",
      description:
        "AI Safety 2023 baseline: CPS-centered risk framing and safety engineering translation.",
      status: "Curated",
      href: "/case-studies/ai-safety-2023",
      signals: [
        {
          axis: "Regulation",
          weight: 66,
          note: "Pre-summit policy momentum and national direction setting.",
        },
        {
          axis: "Standards",
          weight: 72,
          note: "AI international standard development trend highlighted.",
        },
        {
          axis: "Governance",
          weight: 84,
          note: "Purpose alignment and misuse control for human-centered AI.",
        },
      ],
      highlights: [
        "Frames AI safety around AI Cyber Physical Systems using real-world control-system experience.",
        "Distinguishes embedded AI physical harm and standalone AI socio-economic harm pathways.",
        "Positions safety engineering concepts from Safeware and Engineering a Safer World as practical foundations.",
      ],
      source: "AI safety 2023.pdf",
    },
    {
      title: "Case Study 02",
      description:
        "AI System Safety Engineering 2025: translating legacy system safety into AI-native practice.",
      status: "Curated",
      href: "/case-studies/ai-system-safety-engineering-2025",
      signals: [
        {
          axis: "Regulation",
          weight: 78,
          note: "Safety-first framing across high-assurance sectors (aviation, nuclear, medical).",
        },
        {
          axis: "Standards",
          weight: 86,
          note: "Strong emphasis on verifiable engineering process over ad-hoc safe coding.",
        },
        {
          axis: "Governance",
          weight: 89,
          note: "AI-assisted safety lifecycle and organizational safety culture integration.",
        },
      ],
      highlights: [
        "Defines two core domains: Logical AI Safety (social systems) and Physical AI Safety (real-world systems).",
        "Prioritizes accidental hazard prevention and separates it from malicious security threats for engineering focus.",
        "Advocates full-lifecycle system safety engineering, not only model-level controls, for AI deployment.",
      ],
      source: "AI system safety engineering 2025.pdf",
    },
    {
      title: "Case Study 03",
      description: "AI Safety Policy SOTA 2024 synthesis and governance blueprint.",
      status: "Curated",
      href: "/case-studies/ai-safety-policy-2024",
      signals: [
        { axis: "Regulation", weight: 88, note: "UN · EU · US · UK · China · Korea" },
        { axis: "Standards", weight: 74, note: "International standards trend and SOTS linkage" },
        { axis: "Governance", weight: 91, note: "Hazard/threat separation and policy controls" },
      ],
      highlights: [
        "Defines AI safety as freedom from unacceptable harm or risk caused by AI systems.",
        "Separates accidental hazard (loss-of-control) and intentional threat (misuse/attack) risks.",
        "Compares policy directions across UN, EU, US, UK, China, and Korea with practical implications.",
      ],
      source: "AI safety policy 2024.pdf",
    },
  ];

  return (
    <div className="relative min-h-screen overflow-hidden bg-slate-950 text-slate-100">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-24 left-1/2 h-[520px] w-[520px] -translate-x-1/2 rounded-full bg-sky-500/20 blur-[140px]" />
        <div className="absolute bottom-0 right-[-5%] h-[420px] w-[420px] rounded-full bg-indigo-500/20 blur-[140px]" />
        <div className="absolute inset-0 bg-[linear-gradient(120deg,rgba(255,255,255,0.06),rgba(255,255,255,0))] opacity-40" />
      </div>

      <div className="relative mx-auto flex w-full max-w-6xl flex-col gap-24 px-6 pb-24 pt-10 lg:px-10">
        <header className="flex flex-wrap items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-sm font-semibold tracking-[0.2em] text-sky-300">
              JS
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-slate-500">
                Safety-Critical Systems
              </p>
              <p className="text-lg font-semibold text-white">Jang Soo Lee</p>
            </div>
          </div>
          <nav className="flex flex-wrap items-center gap-4 text-sm text-slate-300">
            <a className="transition hover:text-white" href="#about">
              About
            </a>
            <a className="transition hover:text-white" href="#journey">
              Journey
            </a>
            <a className="transition hover:text-white" href="#expertise">
              Expertise
            </a>
            <a className="transition hover:text-white" href="#portfolio">
              Portfolio
            </a>
            <a className="transition hover:text-white" href="#contact">
              Contact
            </a>
            <Link
              className="rounded-full border border-white/15 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-sky-100 transition hover:border-sky-300/50 hover:bg-sky-300/10"
              href="/signup"
            >
              Sign Up
            </Link>
          </nav>
        </header>

        <main className="flex flex-col gap-16">
          <section className="grid gap-12 lg:grid-cols-[1.2fr_0.8fr]">
            <div className="flex flex-col gap-8">
              <div className="inline-flex w-fit items-center gap-3 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-sky-200">
                Enterprise meets edgy
              </div>
              <div className="space-y-6">
                <h1 className="text-4xl font-semibold leading-tight text-white md:text-5xl">
                  Building safety for the autonomous era with a lifetime in
                  critical systems.
                </h1>
                <p className="text-lg leading-relaxed text-slate-300">
                  Research Professor at KAIST focused on semiconductor, software,
                  and AI safety. Bridging academia and industry across automotive,
                  nuclear, railway, and defense domains.
                </p>
              </div>
              <div className="flex flex-wrap gap-4">
                <a
                  className="flex items-center justify-center rounded-full bg-sky-400 px-6 py-3 text-sm font-semibold text-slate-900 transition hover:bg-sky-300"
                  href="mailto:jsyssdsh@gmail.com"
                >
                  Contact via Email
                </a>
                <a
                  className="flex items-center justify-center rounded-full border border-white/15 px-6 py-3 text-sm font-semibold text-white transition hover:border-white/40 hover:bg-white/5"
                  href="https://www.linkedin.com/in/jang-soo-lee-a2b592199"
                  target="_blank"
                  rel="noreferrer"
                >
                  LinkedIn Profile
                </a>
              </div>
              <div className="flex flex-wrap gap-3 text-sm text-slate-300">
                <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1">
                  Semiconductor Safety for Automotive
                </span>
                <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1">
                  Software Safety
                </span>
                <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1">
                  AI Safety
                </span>
              </div>
            </div>

            <div className="flex flex-col gap-6 rounded-3xl border border-white/10 bg-white/5 p-8">
              <p className="text-sm uppercase tracking-[0.32em] text-slate-500">
                Snapshot
              </p>
              <div className="space-y-4">
                <div className="space-y-1">
                  <p className="text-2xl font-semibold text-white">
                    30+ years in safety-critical systems
                  </p>
                  <p className="text-sm text-slate-400">
                    From nuclear research to autonomous mobility.
                  </p>
                </div>
                <div className="grid gap-3 text-sm text-slate-300">
                  <div className="flex items-center justify-between border-b border-white/10 pb-3">
                    <span>Current</span>
                    <span className="font-semibold text-white">
                      KAIST Research Professor
                    </span>
                  </div>
                  <div className="flex items-center justify-between border-b border-white/10 pb-3">
                    <span>Previous</span>
                    <span className="font-semibold text-white">
                      Samsung Electronics (SVP)
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Base</span>
                    <span className="font-semibold text-white">
                      Daejeon, Korea
                    </span>
                  </div>
                </div>
              </div>
              <div className="mt-auto rounded-2xl border border-sky-400/30 bg-gradient-to-r from-sky-400/20 to-indigo-400/10 px-5 py-4 text-sm text-slate-200">
                “Designing for safety is designing for trust.”
              </div>
            </div>
          </section>

          <section
            id="about"
            className="grid gap-10 rounded-3xl border border-white/10 bg-white/5 p-10 lg:grid-cols-[1.1fr_0.9fr]"
          >
            <div className="space-y-4">
              <p className="text-xs uppercase tracking-[0.3em] text-slate-500">
                About
              </p>
              <h2 className="text-3xl font-semibold text-white">
                A career dedicated to safe, dependable systems.
              </h2>
              <p className="leading-relaxed text-slate-300">
                Jang Soo Lee is a KAIST Research Professor focused on safety in
                semiconductor, software, and AI systems. He has led safety-critical
                computer system initiatives in nuclear, railway, and defense
                domains, and guided autonomous automotive safety programs in
                industry.
              </p>
            </div>
            <div className="flex flex-col gap-4 rounded-2xl border border-white/10 bg-slate-950/60 p-6">
              <p className="text-xs uppercase tracking-[0.3em] text-slate-500">
                Focus Areas
              </p>
              <div className="space-y-3 text-sm text-slate-300">
                <div className="flex items-start justify-between gap-4 border-b border-white/10 pb-3">
                  <span>Automotive Safety</span>
                  <span className="text-right text-slate-400">
                    SoC, system software, perception, AI
                  </span>
                </div>
                <div className="flex items-start justify-between gap-4 border-b border-white/10 pb-3">
                  <span>Safety-Critical Domains</span>
                  <span className="text-right text-slate-400">
                    Nuclear, railway, military
                  </span>
                </div>
                <div className="flex items-start justify-between gap-4">
                  <span>Professional Credential</span>
                  <span className="text-right text-slate-400">
                    International P.E. of ICT
                  </span>
                </div>
              </div>
            </div>
          </section>

          <section id="journey" className="space-y-8">
            <div className="space-y-3">
              <p className="text-xs uppercase tracking-[0.3em] text-slate-500">
                Career Journey
              </p>
              <h2 className="text-3xl font-semibold text-white">
                From research labs to industry leadership.
              </h2>
            </div>
            <div className="grid gap-6">
              {timeline.map((item) => (
                <div
                  key={`${item.org}-${item.period}`}
                  className="rounded-3xl border border-white/10 bg-white/5 p-6 transition hover:border-white/20"
                >
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <p className="text-lg font-semibold text-white">
                        {item.role}
                      </p>
                      <p className="text-sm text-slate-400">
                        {item.org} · {item.location}
                      </p>
                    </div>
                    <span className="rounded-full border border-white/10 bg-white/5 px-4 py-1 text-xs uppercase tracking-[0.24em] text-slate-300">
                      {item.period}
                    </span>
                  </div>
                  <p className="mt-4 text-sm leading-relaxed text-slate-300">
                    {item.focus}
                  </p>
                </div>
              ))}
            </div>
          </section>

          <section id="expertise" className="space-y-8">
            <div className="space-y-3">
              <p className="text-xs uppercase tracking-[0.3em] text-slate-500">
                Expertise
              </p>
              <h2 className="text-3xl font-semibold text-white">
                Deep technical coverage across the safety stack.
              </h2>
            </div>
            <div className="grid gap-6 md:grid-cols-3">
              {expertise.map((item) => (
                <div
                  key={item.title}
                  className="rounded-3xl border border-white/10 bg-white/5 p-6"
                >
                  <p className="text-lg font-semibold text-white">
                    {item.title}
                  </p>
                  <p className="mt-3 text-sm leading-relaxed text-slate-300">
                    {item.description}
                  </p>
                </div>
              ))}
            </div>
          </section>

          <section className="grid gap-6 lg:grid-cols-[1fr_1fr]">
            <div className="rounded-3xl border border-white/10 bg-white/5 p-8">
              <p className="text-xs uppercase tracking-[0.3em] text-slate-500">
                Education & Credentials
              </p>
              <h2 className="mt-3 text-2xl font-semibold text-white">
                Academic rigor with global certification.
              </h2>
              <div className="mt-6 space-y-4 text-sm text-slate-300">
                {credentials.map((item) => (
                  <div
                    key={item.label}
                    className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-3"
                  >
                    <span className="font-semibold text-white">
                      {item.label}
                    </span>
                    <span className="text-slate-400">{item.detail}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="rounded-3xl border border-sky-400/30 bg-gradient-to-br from-sky-400/15 to-indigo-400/10 p-8">
              <p className="text-xs uppercase tracking-[0.3em] text-slate-500">
                Collaboration
              </p>
              <h2 className="mt-3 text-2xl font-semibold text-white">
                Open to research partnerships and advisory roles.
              </h2>
              <p className="mt-4 text-sm leading-relaxed text-slate-300">
                For universities, labs, and enterprise R&amp;D teams seeking
                safety leadership, connect to explore joint programs, reviews, or
                keynote engagements.
              </p>
              <a
                className="mt-6 inline-flex items-center justify-center rounded-full bg-white/10 px-5 py-2 text-sm font-semibold text-white transition hover:bg-white/20"
                href="mailto:jsyssdsh@gmail.com"
              >
                Start a conversation
              </a>
            </div>
          </section>

          <section id="portfolio" className="space-y-8">
            <div className="space-y-3">
              <p className="text-xs uppercase tracking-[0.3em] text-slate-500">
                Portfolio (Future)
              </p>
              <h2 className="text-3xl font-semibold text-white">
                Curated case studies and policy briefs.
              </h2>
            </div>
            <div className="grid gap-6 md:grid-cols-3">
              {portfolio.map((item) => (
                <div
                  key={item.title}
                  className="rounded-3xl border border-white/10 bg-white/5 p-6"
                >
                  <p className="text-sm uppercase tracking-[0.24em] text-slate-500">
                    {item.title}
                  </p>
                  <p className="mt-3 text-lg font-semibold text-white">
                    {item.description}
                  </p>
                  {"highlights" in item && (
                    <ul className="mt-4 space-y-2 text-sm leading-relaxed text-slate-300">
                      {item.highlights.map((point) => (
                        <li key={point} className="flex gap-2">
                          <span className="mt-[7px] h-1.5 w-1.5 rounded-full bg-sky-300" />
                          <span>{point}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                  {"signals" in item && (
                    <div className="mt-5 rounded-2xl border border-sky-300/20 bg-slate-950/60 p-4">
                      <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-sky-200">
                        Key Policy Signals
                      </p>
                      <div className="mt-3 space-y-3">
                        {item.signals.map((signal) => (
                          <div key={signal.axis} className="space-y-1">
                            <div className="flex items-center justify-between text-xs text-slate-300">
                              <span className="font-semibold text-white">{signal.axis}</span>
                              <span>{signal.weight}%</span>
                            </div>
                            <div className="h-1.5 overflow-hidden rounded-full bg-white/10">
                              <div
                                className="h-full rounded-full bg-gradient-to-r from-sky-300 to-indigo-300"
                                style={{ width: `${signal.weight}%` }}
                              />
                            </div>
                            <p className="text-[11px] leading-relaxed text-slate-400">
                              {signal.note}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  {"source" in item && (
                    <p className="mt-4 text-xs uppercase tracking-[0.2em] text-slate-500">
                      Source · {item.source}
                    </p>
                  )}
                  {typeof item.href === "string" ? (
                    <Link
                      className="mt-6 inline-flex rounded-full border border-sky-300/30 bg-sky-300/10 px-3 py-1 text-xs uppercase tracking-[0.24em] text-sky-100 transition hover:border-sky-200/60 hover:bg-sky-300/20"
                      href={item.href}
                    >
                      {item.status}
                    </Link>
                  ) : (
                    <span className="mt-6 inline-flex rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs uppercase tracking-[0.24em] text-slate-300">
                      {item.status}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </section>

          <section
            id="contact"
            className="rounded-3xl border border-white/10 bg-white/5 p-10"
          >
            <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
              <div className="space-y-4">
                <p className="text-xs uppercase tracking-[0.3em] text-slate-500">
                  Contact
                </p>
                <h2 className="text-3xl font-semibold text-white">
                  Let&#39;s talk about safe, trustworthy systems.
                </h2>
                <p className="text-sm leading-relaxed text-slate-300">
                  For collaborations, advisory roles, or conference invitations,
                  reach out directly or connect on LinkedIn.
                </p>
              </div>
              <div className="flex flex-col gap-3 text-sm text-slate-300">
                <a
                  className="rounded-2xl border border-white/10 bg-slate-950/60 px-5 py-4 transition hover:border-white/30"
                  href="mailto:jsyssdsh@gmail.com"
                >
                  jsyssdsh@gmail.com
                </a>
                <a
                  className="rounded-2xl border border-white/10 bg-slate-950/60 px-5 py-4 transition hover:border-white/30"
                  href="https://www.linkedin.com/in/jang-soo-lee-a2b592199"
                  target="_blank"
                  rel="noreferrer"
                >
                  linkedin.com/in/jang-soo-lee-a2b592199
                </a>
              </div>
            </div>
          </section>

          <DigitalTwinChat />
        </main>

        <footer className="flex flex-wrap items-center justify-between gap-4 border-t border-white/10 pt-8 text-xs text-slate-500">
          <span>© 2026 Jang Soo Lee. All rights reserved.</span>
          <span>Enterprise-grade safety with an edge.</span>
        </footer>
      </div>
    </div>
  );
}
