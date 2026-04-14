# 초보자용 Front-end 튜토리얼 (Next.js + React)

이 문서는 "프론트엔드를 처음 배우는 사람"을 위한 실전 가이드입니다.  
지금 이 프로젝트를 기준으로, 화면이 어떻게 구성되고 어떻게 동작하는지 쉽게 설명합니다.

---

## 1) 프론트엔드가 하는 일

프론트엔드는 사용자가 직접 보는 화면(UI)을 만듭니다.

- 페이지 레이아웃 만들기
- 버튼, 입력창, 메뉴 같은 인터랙션 만들기
- 서버 API와 통신해서 데이터를 받아오기
- 오류/로딩 상태를 사용자에게 친절하게 보여주기

이 프로젝트에서는 다음이 프론트엔드 핵심입니다:

- 메인 프로필 페이지
- Case Study 카드 UI
- 회원가입 폼
- AI 디지털 트윈 채팅 컴포넌트

---

## 2) 이 프로젝트의 프론트엔드 기술

- **Next.js**: React 기반 프레임워크 (라우팅/빌드/배포 편리)
- **React**: 컴포넌트 단위 UI 개발
- **TypeScript**: 타입으로 실수를 줄임
- **Tailwind CSS**: 빠른 스타일링

---

## 3) 프로젝트 구조(프론트엔드 관점)

- `src/app/page.tsx`  
  메인 랜딩 페이지

- `src/components/digital-twin-chat.tsx`  
  채팅 UI 컴포넌트

- `src/app/signup/page.tsx`  
  회원가입 화면

- `src/app/case-studies/*/page.tsx`  
  각 케이스 스터디 화면 (목차 + PDF 뷰어)

---

## 4) 가장 중요한 React 개념 3가지

## A) 컴포넌트

화면을 작은 블록으로 나누는 방식입니다.

예: `DigitalTwinChat` 컴포넌트는 채팅창만 담당합니다.

```tsx
export default function DigitalTwinChat() {
  return <section>...</section>;
}
```

## B) 상태(state)

사용자 행동에 따라 바뀌는 값을 상태로 관리합니다.

예: 채팅에서는 `messages`, `input`, `loading`, `error`를 상태로 둡니다.

```tsx
const [messages, setMessages] = useState<Message[]>([]);
const [input, setInput] = useState("");
const [loading, setLoading] = useState(false);
```

## C) 이벤트 핸들링

버튼 클릭, 폼 제출 같은 이벤트를 함수로 처리합니다.

```tsx
const submit = async (event: FormEvent<HTMLFormElement>) => {
  event.preventDefault();
  // 입력 검증, API 호출, 상태 업데이트
};
```

---

## 5) 메인 페이지 읽는 법 (`src/app/page.tsx`)

초보자가 긴 JSX를 읽을 때는 아래 순서를 추천합니다.

1. **상단 import 확인**
   - 어떤 컴포넌트를 끌어오는지 확인
2. **데이터 배열 확인**
   - `timeline`, `expertise`, `portfolio` 같은 배열이 화면의 원재료
3. **return 내부 섹션 확인**
   - `about`, `journey`, `portfolio` 같은 영역을 큰 덩어리로 파악
4. **map 렌더링 확인**
   - 배열을 반복해 카드 UI 생성하는 패턴 이해

---

## 6) 채팅 UI 동작 이해 (`src/components/digital-twin-chat.tsx`)

흐름은 아래 5단계입니다.

1. 사용자가 입력창에 질문
2. `submit` 함수 실행
3. `/api/chat/digital-twin`로 POST 요청
4. 응답 받으면 `assistant` 메시지 추가
5. 실패하면 에러 문구 표시

핵심 호출 코드:

```tsx
const response = await fetch("/api/chat/digital-twin", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ messages }),
});
```

---

## 7) 스타일링 읽는 법 (Tailwind)

처음 보면 클래스가 길어서 어렵습니다.  
아래처럼 "그룹"으로 해석하면 쉬워집니다.

예시:

```tsx
className="rounded-3xl border border-white/10 bg-white/5 p-8"
```

- `rounded-3xl`: 모서리 둥글게
- `border border-white/10`: 테두리 + 투명도
- `bg-white/5`: 배경색
- `p-8`: 안쪽 여백

팁: 클래스 하나씩 지우고 화면 변화를 확인하면 빨리 늡니다.

---

## 8) 로컬에서 프론트엔드 실행하기

```bash
cd web
npm install
npm run dev
```

브라우저에서 `http://localhost:3000` 열기

---

## 9) 초보자가 자주 하는 실수

1. 상태 업데이트 순서를 고려하지 않음
2. `await`를 빼먹어 비동기 오류 발생
3. `event.preventDefault()` 누락으로 폼 리로드
4. 에러 처리를 안 해서 실패 원인 파악 불가
5. UI 코드와 API 코드를 한 파일에 섞어서 복잡도 증가

---

## 10) 다음 학습 단계 (추천)

1. 현재 채팅 UI에 "추천 질문 버튼" 추가해보기
2. `localStorage`에 채팅 기록 저장해보기
3. 컴포넌트를 더 분리해보기 (`MessageList`, `ChatInput`)
4. 다크/라이트 토글 추가해보기
5. 테스트 코드(React Testing Library) 입문해보기

---

## 요약

이 프로젝트 프론트엔드는 크게 3가지를 연습하기 좋습니다.

- **레이아웃 구성 능력**
- **상태/이벤트 처리 능력**
- **API와 연결하는 실전 감각**

처음에는 한 파일씩 읽고, 작은 수정부터 직접 해보는 것이 가장 빠른 성장 방법입니다.
