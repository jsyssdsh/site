# Comprehensive Code Review

**Project**: Jang Soo Lee – Safety-Critical Systems Portfolio  
**Stack**: Next.js 16 (App Router) · React 19 · TypeScript 5 · Tailwind CSS 4  
**Date**: 2026-04-09  
**Scope**: All 17 source files under `src/`

---

## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [Architecture & Structure](#2-architecture--structure)
3. [Security](#3-security)
4. [Performance](#4-performance)
5. [Reliability & Error Handling](#5-reliability--error-handling)
6. [Code Quality & Maintainability](#6-code-quality--maintainability)
7. [Accessibility (a11y)](#7-accessibility-a11y)
8. [Type Safety](#8-type-safety)
9. [SEO & Metadata](#9-seo--metadata)
10. [File-by-File Findings](#10-file-by-file-findings)
11. [Recommended Remedial Actions (Priority-Ordered)](#11-recommended-remedial-actions-priority-ordered)

---

## 1. Executive Summary

The project is a polished portfolio site with three PDF case-study explorers, cookie-based membership gating, and an OpenRouter-powered AI digital twin chat. The visual design is strong and the feature set is ambitious for a single-developer project.

**Strengths**

- Clean, consistent visual language using Tailwind utility classes
- Smart model-fallback strategy for OpenRouter API cost management
- Proper use of Next.js middleware for route protection
- Good separation of server-only config (`openrouter-config.ts`, `member-auth.ts`)

**Key Concerns (by severity)**

| Severity | Count | Summary |
|----------|-------|---------|
| Critical | 3 | Authentication is client-side only (no real backend); PDF files served from parent directory traversal; API key exposed to server process without rotation |
| High | 5 | Module-level cache invalidation impossible in TOC routes; DRY violations across 3 near-identical pages; no CSRF protection on signup; no rate limiting on chat API; missing `ai-safety-2023` TOC API |
| Medium | 9 | Monolithic 548-line page component; no loading/error UI for case study pages; no input sanitization on chat; hardcoded email in multiple places; inconsistent language mixing; no `Content-Length` on PDF responses; missing `rel="noopener"` on some links; no favicon/OG image; `color-scheme: dark` conflicts with light-mode CSS variables |
| Low | 7 | Type duplication (`TocSection`/`TocSubItem` in 5 files); unused `useEffect` import in one file; no unit tests; docs not linked from app; no `aria-label` on nav links; chat scroll doesn't auto-scroll to bottom; copyright year hardcoded |

---

## 2. Architecture & Structure

### 2.1 Good Decisions

- **App Router convention** is followed correctly: `page.tsx` for pages, `route.ts` for API, `middleware.ts` at `src/` root.
- **`src/lib/`** cleanly separates shared logic from UI.
- **PDF streaming via API routes** keeps file paths server-side.

### 2.2 Issues

**[HIGH] DRY violation across case-study pages**  
All three pages under `src/app/case-studies/*/page.tsx` share ~90% identical layout, TOC sidebar, and PDF viewer logic. Only the title, API endpoint, and fallback TOC differ.

> **Remediation**: Extract a shared `<CaseStudyShell>` component that accepts `title`, `apiBasePath`, and `fallbackToc` as props. Each page becomes a thin wrapper.

**[HIGH] Missing `ai-safety-2023` TOC API route**  
The 2023 case study page uses a hardcoded TOC while the other two have dynamic extraction endpoints. This is an inconsistency that means the 2023 TOC cannot self-correct if the PDF changes.

> **Remediation**: Create `src/app/api/docs/ai-safety-2023/toc/route.ts` mirroring the other two, and update the 2023 page to use `useEffect`-based loading with a fallback.

**[MEDIUM] Monolithic home page (`page.tsx`: 548 lines)**  
All data arrays (`timeline`, `expertise`, `credentials`, `portfolio`) are defined inside the render function. The entire page is a single component.

> **Remediation**: Move data arrays to `src/data/profile.ts`. Extract section components (`HeroSection`, `TimelineSection`, `PortfolioSection`, etc.) into `src/components/`.

**[HIGH] DRY violation across 3 PDF-serving API routes**  
`ai-safety-2023/route.ts`, `ai-safety-policy-2024/route.ts`, and `ai-system-safety-engineering-2025/route.ts` are functionally identical except for the filename string.

> **Remediation**: Create a shared `servePdf(request, filename)` utility in `src/lib/serve-pdf.ts` and call it from each route.

---

## 3. Security

**[CRITICAL] Authentication is client-side only**  
The signup page sets a cookie (`site_member=1`) directly from client JavaScript. There is no server-side session, no password hashing, no persistence. Anyone can set this cookie manually via DevTools to bypass membership.

> **Remediation**: For a demo/portfolio site, this may be acceptable with a clear disclaimer. For production, implement a real auth backend (NextAuth.js, Clerk, or Supabase Auth) with server-side session validation.

**[CRITICAL] PDF files served from parent directory**  
All PDF routes use `path.join(process.cwd(), "..", "filename.pdf")`. This accesses files outside the application directory. While the filenames are hardcoded (not user-supplied), the pattern of reaching outside `cwd` is risky and fragile for deployment.

> **Remediation**: Move PDF files into a `data/` or `private/` directory within the project, or use an absolute path from an environment variable.

**[CRITICAL] API key management**  
The OpenRouter API key is read from `.emv`/`.env` at runtime. The `.gitignore` covers `.env*` but `.emv` is not a standard filename and may not be covered by all deployment platforms.

> **Remediation**: Rename `.emv` to `.env.local` (standard Next.js convention) and ensure `OPENROUTER_API_KEY` is provided via the platform's secret management in production.

**[HIGH] No CSRF protection on signup form**  
The signup form does not use any CSRF token. Since the cookie is set client-side, a cross-origin form submission could set the membership cookie.

> **Remediation**: For demo use this is low-risk. For production, add a server-side signup API route with CSRF tokens.

**[HIGH] No rate limiting on `/api/chat/digital-twin`**  
The chat endpoint makes external API calls to OpenRouter with your API key. Without rate limiting, any client can exhaust your API credits.

> **Remediation**: Implement rate limiting via middleware or an in-memory store (e.g., a `Map` with IP-based counters) or use Vercel/Cloudflare's built-in rate limiting.

**[MEDIUM] No input sanitization on chat messages**  
User messages are passed directly to OpenRouter without sanitization. While prompt injection is an inherent LLM risk, the messages could also contain extremely long strings.

> **Remediation**: Add a maximum message length check (e.g., 2000 characters) and total conversation token budget before forwarding to OpenRouter.

---

## 4. Performance

**[HIGH] Module-level `tocCache` in serverless context**  
Both TOC routes use `let tocCache: TocSection[] | null = null` at module scope. In serverless/edge deployments, each cold start resets this cache, making it ineffective. In long-running dev mode, the cache is never invalidated.

> **Remediation**: Use an LRU cache with TTL (e.g., `lru-cache` package), or pre-generate TOCs at build time using `generateStaticParams` and static JSON files.

**[MEDIUM] Full PDF read into memory on every non-cached request**  
The TOC routes read the entire PDF into a `Buffer`, parse it, then discard the buffer. For large PDFs (the 2025 document appears to be 500+ pages), this consumes significant memory per request.

> **Remediation**: Cache the parsed TOC to disk (`.next/cache/`) or use ISR (Incremental Static Regeneration) for the TOC endpoints.

**[MEDIUM] No `Content-Length` header on PDF responses**  
The PDF streaming routes don't set `Content-Length`, preventing browsers from showing download progress indicators.

> **Remediation**: Add `"Content-Length": String(fileBuffer.byteLength)` to the response headers.

**[LOW] iframe re-mount on every page navigation**  
Using `key={viewerSrc}` on the iframe forces a full re-mount (and re-download) of the PDF on every TOC click. This causes visible flicker and re-fetches the entire PDF.

> **Remediation**: Consider using a client-side PDF viewer library (e.g., `react-pdf` or `pdf.js`) that can navigate to a specific page without re-loading the entire document.

---

## 5. Reliability & Error Handling

**[MEDIUM] No loading state for TOC fetch in case study pages**  
The 2024 and 2025 pages fetch their TOC via `useEffect` but show no loading indicator. The user sees the fallback TOC briefly, then it snaps to the extracted TOC.

> **Remediation**: Add a `loading` state and show a skeleton or spinner while the TOC is being fetched.

**[MEDIUM] Silent error swallowing in TOC `useEffect`**  
The `catch` block in `loadToc()` is empty. If the TOC endpoint fails, the user has no indication that they're viewing potentially stale fallback data.

> **Remediation**: Log the error or show a subtle indicator that automatic TOC extraction failed.

**[LOW] Chat does not auto-scroll to latest message**  
The chat message container has `overflow-y-auto` but no scroll-to-bottom behavior when new messages arrive.

> **Remediation**: Use a `useRef` on the container and call `scrollIntoView()` after message state updates.

**[MEDIUM] `data.content!` non-null assertion in chat component**  
In `digital-twin-chat.tsx` line 49, `data.content!` uses a non-null assertion. Although the preceding check should prevent this path, it's better to be explicit.

> **Remediation**: Replace with `data.content ?? ""` or add an early return.

---

## 6. Code Quality & Maintainability

**[HIGH] Type duplication across files**  
`TocSubItem` and `TocSection` are defined identically in 5 separate files:
- `src/app/case-studies/ai-safety-2023/page.tsx`
- `src/app/case-studies/ai-safety-policy-2024/page.tsx`
- `src/app/case-studies/ai-system-safety-engineering-2025/page.tsx`
- `src/app/api/docs/ai-safety-policy-2024/toc/route.ts`
- `src/app/api/docs/ai-system-safety-engineering-2025/toc/route.ts`

> **Remediation**: Define these types once in `src/types/toc.ts` and import everywhere.

**[MEDIUM] Hardcoded email address in 3 places**  
`jsyssdsh@gmail.com` appears in `page.tsx` lines 207 and 522, and the LinkedIn URL appears twice. Any change requires updating multiple locations.

> **Remediation**: Centralize contact info in `src/data/profile.ts`.

**[MEDIUM] Inconsistent language mixing**  
UI text mixes Korean and English unpredictably:
- Signup page: Korean labels ("회원가입"), English placeholders ("Name", "Email")
- Chat: Korean greeting, English section title
- Case studies: Korean descriptions, English headers

> **Remediation**: Decide on a primary language and use i18n (e.g., `next-intl`) if bilingual support is needed.

**[LOW] No unit or integration tests**  
There are zero test files. The TOC extraction logic (`extractTocFromText`) and the cookie parsing logic are particularly good candidates for unit testing.

> **Remediation**: Add Jest/Vitest with tests for `member-auth.ts`, `openrouter-config.ts`, and the TOC extraction functions.

**[LOW] `addUniqueItem` redundant condition**  
In `ai-system-safety-engineering-2025/toc/route.ts` line 49-51, the check `it.title === item.title || (it.page === item.page && it.title === item.title)` has a redundant second condition (if `title` matches, the `||` short-circuits).

> **Remediation**: Simplify to `it.title === item.title`.

---

## 7. Accessibility (a11y)

**[MEDIUM] No skip-to-content link**  
The main page has no skip navigation link for keyboard users.

> **Remediation**: Add a visually-hidden "Skip to main content" link as the first focusable element.

**[MEDIUM] Navigation links lack `aria-current`**  
Hash-based nav links (`#about`, `#journey`, etc.) don't indicate the current section.

> **Remediation**: Use Intersection Observer to track the active section and set `aria-current="true"`.

**[MEDIUM] Chat message list has no `role` or `aria-live`**  
Screen readers won't announce new messages.

> **Remediation**: Add `role="log"` and `aria-live="polite"` to the messages container.

**[LOW] Form inputs missing `autocomplete` attributes**  
The signup form inputs don't specify `autocomplete` values (`name`, `email`, `new-password`).

> **Remediation**: Add appropriate `autocomplete` attributes.

**[LOW] No `aria-label` on icon-only elements**  
The "JS" initials box in the header has no accessible label.

> **Remediation**: Add `aria-label="Jang Soo Lee initials"` or use `aria-hidden="true"` if decorative.

---

## 8. Type Safety

**[MEDIUM] Loose `as` type assertions on API responses**  
Multiple files use `as { ... }` to type API responses (e.g., `digital-twin/route.ts` line 31, line 89). These assertions bypass runtime validation.

> **Remediation**: Use a validation library (Zod, Valibot) to parse API request bodies and external API responses at runtime.

**[MEDIUM] `portfolio` array type is inferred, not explicit**  
The `portfolio` array in `page.tsx` uses inline object literals. TypeScript infers the type but doesn't enforce the shape, so a missing `href` or `signals` field won't cause a compile error.

> **Remediation**: Define a `PortfolioItem` type and annotate the array.

---

## 9. SEO & Metadata

**[MEDIUM] No OG/Twitter metadata**  
The root layout has `title` and `description` but no Open Graph or Twitter Card tags.

> **Remediation**: Add `openGraph` and `twitter` fields to the `metadata` export in `layout.tsx`.

**[MEDIUM] Case study pages have no page-level metadata**  
All three case study pages are client components (`"use client"`) and export no `metadata`. Search engines will see the root layout title for all of them.

> **Remediation**: Use `generateMetadata` in a parent layout or a server component wrapper to set per-page titles.

**[LOW] No favicon**  
No `favicon.ico` or `icon.tsx` was found in `src/app/`.

> **Remediation**: Add a favicon to `src/app/favicon.ico` or use Next.js's `icon.tsx` convention.

**[LOW] `color-scheme: dark` with light `:root` variables**  
`globals.css` sets `color-scheme: dark` on `:root` alongside `--background: #ffffff` and `--foreground: #171717`. The light values are immediately overridden by the dark media query, but they cause a brief flash of light background on systems preferring light mode.

> **Remediation**: Either remove the light-mode `:root` variables (the site is dark-only) or implement a proper theme toggle.

---

## 10. File-by-File Findings

### `src/app/layout.tsx`
- **Good**: Font optimization with `display: "swap"`.
- **Issue**: `lang="en"` but the site contains significant Korean content. Consider `lang="ko"` or dynamic language detection.

### `src/app/globals.css`
- **Good**: Clean Tailwind v4 `@theme inline` usage.
- **Issue**: The light-mode `:root` variables are dead code since the site forces dark mode.

### `src/middleware.ts`
- **Good**: Clean pattern using `NextRequest.cookies` API.
- **Good**: Preserves the intended destination via `next` query parameter.
- **Issue**: Only protects `/case-studies/:path*`. The PDF API routes (`/api/docs/*`) have their own auth check but use a different mechanism (`hasMemberAccess` with raw cookie header parsing vs. middleware's `request.cookies`).

### `src/lib/member-auth.ts`
- **Good**: Properly handles missing cookie headers and URI-decodes values.
- **Issue**: The `parseCookieHeader` function duplicates what `NextRequest.cookies` already provides in middleware. The dual approach (middleware uses `request.cookies`, API routes use `hasMemberAccess`) is confusing.

### `src/lib/openrouter-config.ts`
- **Good**: Multi-source config resolution (env vars → .emv → .env).
- **Good**: Comma-separated fallback model parsing.
- **Issue**: `path.join(process.cwd(), "..")` to find `.emv`/`.env` is fragile for deployment (same parent-directory concern as PDFs).

### `src/app/page.tsx`
- **Good**: Strong visual hierarchy and responsive grid.
- **Issue (MEDIUM)**: All data is defined inside the component function, re-creating arrays on every render. Move outside or `useMemo`.
- **Issue (LOW)**: `portfolio.map` keys use `item.title`, which is fine since titles are unique, but a dedicated `id` field would be more robust.

### `src/app/signup/page.tsx`
- **Good**: Clean form validation with user-facing Korean error messages.
- **Good**: `window.location.search` avoids the `useSearchParams` Suspense issue.
- **Issue**: Password is stored nowhere — the field creates a false expectation of account security.
- **Issue**: No confirmation that signup succeeded (the redirect is the only feedback).

### `src/components/digital-twin-chat.tsx`
- **Good**: Message history truncation (`.slice(-12)`) limits token usage.
- **Good**: Disabled button during loading prevents double-submit.
- **Issue**: `key={`${message.role}-${idx}`}` uses array index as key — will cause issues if messages are ever reordered or deleted.

### `src/app/api/chat/digital-twin/route.ts`
- **Good**: Robust multi-model fallback with budget-aware token adjustment.
- **Good**: Detailed error logging via `attemptErrors`.
- **Issue**: The 402 error regex `can only afford (\d+)` is fragile — if OpenRouter changes their error message format, the fallback breaks.
- **Issue**: No request body size limit — a client could send megabytes of conversation history.
- **Issue**: `export const runtime = "nodejs"` is correct for `fs` access, but this route doesn't use `fs`. The runtime declaration is unnecessary here.

### `src/app/api/docs/*/route.ts` (3 files)
- **Good**: `Content-Disposition: inline` for in-browser viewing.
- **Good**: `Cache-Control: no-store` prevents stale cached PDFs.
- **Issue**: No `Content-Length` header.
- **Issue**: Entire file is buffered in memory — not streaming.

### `src/app/api/docs/*/toc/route.ts` (2 files)
- **Good**: Noise filtering and normalization of PDF-extracted text.
- **Good**: `slice(0, 18/24)` limits prevent pathologically large TOCs.
- **Issue**: Module-level `tocCache` is unreliable in serverless.
- **Issue**: `import { PDFParse } from "pdf-parse"` — verify this matches the actual export of `pdf-parse@^2.4.5`. The v1.x API uses `default` export; v2.x may differ.
- **Issue**: Duplicate helper functions (`normalizeLine`, `isNoiseLine`, `makeId`, `addUniqueItem`) across both TOC files.

### `src/app/case-studies/ai-safety-2023/page.tsx`
- **Issue**: Uses hardcoded TOC while the other two pages use dynamic extraction. Inconsistent approach.
- **Issue**: No `useEffect`-based TOC loading, no fallback indicator.

### `src/app/case-studies/ai-safety-policy-2024/page.tsx` & `ai-system-safety-engineering-2025/page.tsx`
- **Good**: Fallback TOC provides instant display while dynamic TOC loads.
- **Good**: Mounted flag prevents state updates after unmount.
- **Issue**: Nearly identical to each other — strong candidate for extraction.

---

## 11. Recommended Remedial Actions (Priority-Ordered)

### P0 — Critical (Address before any production deployment)

| # | Action | Files Affected |
|---|--------|----------------|
| 1 | Replace client-side-only auth with a real backend or add a clear "demo only" disclaimer | `signup/page.tsx`, `middleware.ts`, `member-auth.ts` |
| 2 | Move PDF files inside the project directory; stop using `path.join(cwd(), "..")` | All `api/docs/*/route.ts`, `openrouter-config.ts` |
| 3 | Rename `.emv` to `.env.local`; verify `.gitignore` covers it | `.emv`, `.gitignore` |

### P1 — High (Should be resolved in near-term)

| # | Action | Files Affected |
|---|--------|----------------|
| 4 | Add rate limiting to `/api/chat/digital-twin` | `api/chat/digital-twin/route.ts`, possibly `middleware.ts` |
| 5 | Extract shared `<CaseStudyShell>` component to eliminate DRY violation | `case-studies/*/page.tsx` → new `components/case-study-shell.tsx` |
| 6 | Extract shared `servePdf()` helper for PDF API routes | `api/docs/*/route.ts` → new `lib/serve-pdf.ts` |
| 7 | Create `ai-safety-2023/toc/route.ts` for consistency | New file |
| 8 | Define `TocSection`/`TocSubItem` once in `src/types/toc.ts` | 5 files |
| 9 | Replace module-level `tocCache` with TTL-based cache or build-time generation | `api/docs/*/toc/route.ts` |

### P2 — Medium (Quality improvements)

| # | Action | Files Affected |
|---|--------|----------------|
| 10 | Add request body size validation and message length limits to chat API | `api/chat/digital-twin/route.ts` |
| 11 | Add OG/Twitter metadata to root layout | `layout.tsx` |
| 12 | Add per-page metadata for case study pages | `case-studies/*/page.tsx` or parent layout |
| 13 | Extract data arrays from `page.tsx` into `src/data/profile.ts` | `page.tsx` |
| 14 | Add `Content-Length` to PDF responses | `api/docs/*/route.ts` |
| 15 | Add loading/error states for TOC fetching | `case-studies/*/page.tsx` |
| 16 | Add `role="log"` and `aria-live="polite"` to chat messages | `digital-twin-chat.tsx` |
| 17 | Add skip-to-content link | `layout.tsx` or `page.tsx` |
| 18 | Fix `lang` attribute to `"ko"` or add language detection | `layout.tsx` |
| 19 | Remove dead light-mode CSS variables or implement theme toggle | `globals.css` |
| 20 | Add Zod/Valibot runtime validation for API request/response bodies | Multiple API routes |

### P3 — Low (Nice-to-haves)

| # | Action | Files Affected |
|---|--------|----------------|
| 21 | Add auto-scroll-to-bottom on new chat messages | `digital-twin-chat.tsx` |
| 22 | Add `autocomplete` attributes to signup form inputs | `signup/page.tsx` |
| 23 | Add favicon | `src/app/favicon.ico` |
| 24 | Set up Vitest/Jest and write tests for `member-auth`, `openrouter-config`, TOC extraction | New test files |
| 25 | Add `aria-label` to decorative elements | `page.tsx` |
| 26 | Replace array-index keys in chat messages with unique IDs | `digital-twin-chat.tsx` |
| 27 | Consider `react-pdf` or `pdf.js` to avoid iframe re-mount flicker | `case-studies/*/page.tsx` |
| 28 | Make copyright year dynamic (`new Date().getFullYear()`) | `page.tsx` line 541 |

---

## Summary Metrics

| Category | Score | Notes |
|----------|-------|-------|
| Functionality | 8/10 | All features work; minor inconsistencies |
| Security | 4/10 | Auth is cosmetic; no rate limiting; parent-dir file access |
| Performance | 6/10 | Acceptable for demo; cache strategy needs work for production |
| Maintainability | 5/10 | Heavy duplication; monolithic page; no tests |
| Accessibility | 4/10 | Basic semantic HTML present but missing ARIA, skip-nav, live regions |
| Type Safety | 7/10 | TypeScript strict mode on; `as` assertions and duplication reduce score |
| SEO | 5/10 | Basic metadata present; missing OG, per-page titles, sitemap |

**Overall**: Solid demo/portfolio project with a polished visual presentation. The primary risks are all security-related and stem from the client-side-only auth model. For production deployment, items P0 and P1 should be addressed first.
