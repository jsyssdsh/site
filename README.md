# Jang Soo Lee Professional Site

`Next.js` 기반의 프리미엄 개인 사이트입니다.  
"Enterprise meets edgy" 톤으로 프로필, 커리어, 전문성, 포트폴리오(큐레이션 케이스 스터디)까지 한 번에 보여주도록 구성되어 있습니다.

## 프로젝트 소개

- **메인 페이지**: 소개(About), 커리어 여정(Journey), 전문성(Expertise), 연락처(Contact)
- **Curated Case Studies**: PDF 기반 심화 페이지 3종
  - `AI safety 2023.pdf`
  - `AI system safety engineering 2025.pdf`
  - `AI safety policy 2024.pdf`
- **TOC 네비게이션**: 좌측 목차(장/소절) 클릭 시 해당 PDF 페이지로 이동
- **회원 접근 제어**: 회원가입(간편) 완료 사용자만 `case-studies` 하위 페이지 접근 가능

## 기술 스택

- `Next.js 16` (App Router)
- `React 19`
- `TypeScript`
- `Tailwind CSS`
- `pdf-parse` (PDF 텍스트 파싱/목차 자동 추출 API)

## 로컬 실행 방법

### 1) 설치

```bash
npm install
```

### 2) 개발 서버 실행

```bash
npm run dev
```

브라우저에서 `http://localhost:3000` 접속

### 3) 코드 품질/빌드 확인

```bash
npm run lint
npm run build
```

## 회원가입 접근 흐름

### 1) 회원가입 페이지 진입

- 상단 `Sign Up` 버튼 또는 직접 `/signup` 경로 접근

### 2) 가입 완료 처리

- 이름/이메일/비밀번호 입력 후 제출
- 브라우저 쿠키에 멤버 플래그 저장:
  - `site_member=1`

### 3) 보호 라우트 접근

- 보호 대상: `/case-studies/*`
- 쿠키가 없으면 자동으로:
  - `/signup?next=<원래요청경로>` 로 리다이렉트

### 4) 가입 후 원래 페이지 복귀

- 가입 성공 시 `next` 파라미터 경로로 자동 이동

## 보호 대상 API

아래 API는 멤버 쿠키가 없으면 `401 Unauthorized`를 반환합니다.

- `/api/docs/ai-safety-2023`
- `/api/docs/ai-system-safety-engineering-2025`
- `/api/docs/ai-system-safety-engineering-2025/toc`
- `/api/docs/ai-safety-policy-2024`
- `/api/docs/ai-safety-policy-2024/toc`

## 주요 디렉터리

- `src/app/page.tsx`: 메인 랜딩 페이지
- `src/app/signup/page.tsx`: 회원가입 페이지
- `src/app/case-studies/*`: 큐레이션 하위 페이지
- `src/app/api/docs/*`: PDF 제공 및 TOC 추출 API
- `src/middleware.ts`: `case-studies` 접근 제어
- `src/lib/member-auth.ts`: 멤버 쿠키 검증 유틸
