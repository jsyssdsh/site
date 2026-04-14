# 프론트엔드 완전 초보자용 튜토리얼

이 문서는 이 프로젝트에서 구현된 내용을 **프론트엔드 입문자** 관점에서 이해할 수 있도록 단계별로 설명합니다.

---

## 1) 기술 요약

이번 프로젝트는 아래 기술들을 조합해 만들었습니다.

- **Next.js (App Router)**: 페이지, API, 라우팅을 한 프로젝트에서 통합 관리
- **React + TypeScript**: 컴포넌트 기반 UI + 타입 안정성
- **Tailwind CSS**: 유틸리티 클래스 방식 스타일링
- **OpenRouter API**: LLM 모델 호출
- **pdf-parse**: PDF 텍스트 파싱 및 목차 자동 추출
- **쿠키 + 미들웨어 접근제어**: 회원가입 사용자 전용 페이지 보호

---

## 2) 기능을 큰 그림으로 이해하기

이 사이트는 크게 3개 축으로 구성됩니다.

1. **메인 프로필 페이지**
   - 소개, 경력, 전문성, 연락처, curated case studies 카드
2. **Curated 하위 페이지**
   - PDF 문서를 목차 기반으로 탐색할 수 있는 상세 페이지
3. **AI Digital Twin 채팅**
   - 경력 관련 질문에 답하는 챗봇

추가로, curated 하위 페이지는 회원가입 후에만 접근할 수 있도록 보호됩니다.

---

## 3) 요청-응답 흐름 (초보자용)

### A. 디지털 트윈 채팅 흐름

1. 사용자가 메인 페이지에서 질문 입력
2. 프론트엔드가 `/api/chat/digital-twin`으로 POST 요청
3. 서버가 OpenRouter로 모델 호출
4. 모델 응답을 프론트에 반환
5. 프론트가 채팅창에 답변 추가

### B. 회원 접근제어 흐름

1. 사용자가 `/case-studies/*` 접근 시도
2. `middleware.ts`가 멤버 쿠키 확인
3. 쿠키가 없으면 `/signup?next=원래경로`로 이동
4. 회원가입 완료 후 원래 페이지로 자동 복귀

---

## 4) 핵심 코드 리뷰 (파일별)

## `src/app/page.tsx`

메인 랜딩 페이지입니다. 데이터 배열(`timeline`, `expertise`, `portfolio`)을 선언하고 섹션별로 렌더링합니다.

```tsx
import Link from "next/link";
import DigitalTwinChat from "@/components/digital-twin-chat";

// ...
<DigitalTwinChat />
```

핵심 포인트:
- 데이터 중심 렌더링(map)
- `Curated` 버튼은 상세 페이지 링크(`href`)로 연결
- 디지털 트윈 컴포넌트를 메인 페이지에 포함

---

## `src/components/digital-twin-chat.tsx`

채팅 UI 컴포넌트입니다.

```tsx
const response = await fetch("/api/chat/digital-twin", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ messages: nextMessages.slice(-12) }),
});
```

핵심 포인트:
- `messages`, `loading`, `error` 상태 관리
- 최근 메시지만 전송해 비용/토큰 사용량 제어
- 요청 실패 시 에러 메시지 표시

---

## `src/app/api/chat/digital-twin/route.ts`

OpenRouter 호출 서버 API입니다.

```ts
const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${apiKey}`,
  },
  body: JSON.stringify({
    model,
    messages: [{ role: "system", content: DIGITAL_TWIN_SYSTEM_PROMPT }, ...messages],
  }),
});
```

핵심 포인트:
- 시스템 프롬프트에 경력 사실을 넣어 디지털 트윈 정체성 유지
- 크레딧 부족(402) 대응: `max_tokens` 축소 후 1회 재시도
- 성공 시 `{ content, model }` 반환

---

## `src/lib/openrouter-config.ts`

환경설정 로더입니다.

```ts
const apiKey =
  process.env.OPENROUTER_API_KEY ??
  emvVars.OPENROUTER_API_KEY ??
  envVars.OPENROUTER_API_KEY;
```

핵심 포인트:
- 런타임 env > `.emv` > `.env` 우선순위
- 기본 모델 상수(`DEFAULT_OPENROUTER_MODEL`) 사용

---

## `src/middleware.ts` + `src/app/signup/page.tsx`

회원가입 기반 접근제어를 담당합니다.

```ts
export const config = {
  matcher: ["/case-studies/:path*"],
};
```

핵심 포인트:
- 보호 경로를 명확히 지정
- 쿠키 없으면 가입 페이지로 리다이렉트
- 가입 후 `next` 파라미터로 원래 페이지 복귀

---

## 5) 로컬 실행 방법

```bash
cd web
npm install
npm run dev
```

접속: `http://localhost:3000`

검증:

```bash
npm run lint
npm run build
```

---

## 6) 셀프 리뷰 기반 개선 제안 5가지

1. **인증 보안 강화**  
   현재 단순 쿠키 플래그 방식이므로, 추후 서버 세션/서명 쿠키/JWT 도입 권장

2. **채팅 이력 영속화**  
   새로고침 시 대화가 사라지므로 DB 또는 localStorage 저장 옵션 추가 권장

3. **모델 폴백 전략 고도화**  
   기본 모델 실패 시 자동으로 저비용 모델로 폴백하는 다단계 정책 적용

4. **에러 UX 개선**  
   현재는 텍스트 오류 중심이므로, 재시도 버튼/도움말/원인별 안내 강화 권장

5. **코드 분리 및 테스트 강화**  
   OpenRouter 호출부, 프롬프트 빌더, 응답 파서 분리 + 단위 테스트 추가 권장

---

## 7) 마지막 정리

이 프로젝트는 단순한 정적 포트폴리오를 넘어:

- **프로필 + 근거 문서(PDF) + 대화형 AI**를 통합하고,
- 회원 접근제어까지 포함한
- 실무형 Next.js 구조로 확장된 상태입니다.

처음에는 구조가 많아 보여도, 파일별 책임을 나누어 보면 이해하기 쉽습니다.  
`page.tsx`(화면), `route.ts`(서버 API), `lib`(설정/공통 로직), `middleware.ts`(접근제어) 이 4가지 축으로 보면 됩니다.
