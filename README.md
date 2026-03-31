# 경제금융 용어 그갓이꺼 뭐

경제금융용어 800선을 바탕으로 만든 학습형 퀴즈 웹앱입니다.
경제금융이 낯선 사람도 문제 풀이, 힌트, 친절한 해설, 관련 뉴스 검색, 오답노트, 북마크 복습까지 한 흐름 안에서 쉽게 익힐 수 있도록 구성했습니다.

## 공개 소개

어렵게 느껴지는 경제금융 용어를 퀴즈로 풀고, 해설로 이해하고, 실제 뉴스 검색으로 연결해보는 학습형 웹앱입니다.

이 프로젝트는 아래 흐름에 집중합니다.

- 퀴즈를 풀며 핵심 개념 익히기
- 힌트로 스스로 한 번 더 떠올리기
- 경제 선생님 스타일 해설로 이해하기
- 북마크와 오답노트로 다시 복습하기
- 용어사전과 통계 대시보드로 학습 흐름 관리하기

## 주요 기능

- 홈 화면
  - 전체 랜덤 퀴즈, 오늘의 10문제, 북마크, 오답노트, 통계 진입
- 퀴즈 화면
  - 객관식/주관식 문제 풀이
  - 힌트 살짝 보기
  - 즉시 정답 판정
  - 경제 선생님의 한마디 해설 카드
  - Google / NAVER 관련 검색 연결
- 오늘의 10문제
  - 10문제 완료 후 종합 결과 화면 제공
  - 전체 정답률, 유형별 정답률, 난이도별 결과 요약
- 오답노트
  - 틀린 문제 자동 저장
  - 다시 풀기, 제거, 재도전 횟수 확인
- 북마크
  - 문제 북마크 저장
  - 필터, 정렬, 오답노트 전용 토글
  - 오늘 복습 추천
  - 힌트 / 보기 / 정답 / 해설 미리보기
- 용어사전
  - 초성 색인 탐색
  - 용어 상세 보기
  - 해당 용어 퀴즈 / 카테고리 퀴즈 연결
- 통계 대시보드
  - 전체 풀이 수, 정답률, 최근 학습 이력, 최근 틀린 문제 수 확인

## 기술 스택

- Next.js 15
- React 19
- Tailwind CSS 4
- TypeScript
- localStorage 기반 학습 기록 저장
- PDF 파싱 + JSON 생성 스크립트

## 로컬 실행 방법

```bash
npm install
npm run dev
```

브라우저에서 아래 주소로 접속합니다.

- [http://localhost:3000](http://localhost:3000)

## 주요 스크립트

```bash
npm run dev
npm run build
npm run start
npm run typecheck
npm run extract:terms
npm run refine:terms
npm run generate:quiz-bank
```

설명:

- `extract:terms`: PDF에서 경제금융 용어 초안 추출
- `refine:terms`: 추출 결과 후처리 및 정제
- `generate:quiz-bank`: 정제 데이터를 바탕으로 퀴즈 뱅크 생성
- `typecheck`: TypeScript 타입 검증

## 폴더 구조

```text
app/
  bookmarks/
  dashboard/
  glossary/
  mistakes/
  quiz/
  globals.css
  layout.tsx
  page.tsx
components/
  bookmarks-client.tsx
  dashboard-client-v2.tsx
  explanation-card-v2.tsx
  filter-strip-v2.tsx
  footer.tsx
  glossary-client-v2.tsx
  glossary-question-preview.tsx
  glossary-term-bookmark.tsx
  header-fixed.tsx
  mistakes-client-v2.tsx
  mode-grid-v2.tsx
  question-card-layout-v2.tsx
  quiz-client-layout-v3.tsx
  search-news-card-v2.tsx
  stats-overview-v2.tsx
data/
  generated-quiz-bank.ts
  manual-term-overrides.json
  refined-economic-terms.json
lib/
  quiz-utils-fixed.ts
  storage.ts
  types.ts
scripts/
  extract-economic-terms.mjs
  refine-economic-terms.mjs
  generate-quiz-bank.mjs
```

## 데이터와 학습 기록

- 문제 데이터: `data/generated-quiz-bank.ts`
- 타입 정의: `lib/types.ts`
- 문제 필터링/사전/추천 로직: `lib/quiz-utils-fixed.ts`
- localStorage 저장 로직: `lib/storage.ts`

브라우저 로컬 저장소에는 아래 정보가 저장됩니다.

- 풀이 이력
- 오답노트
- 북마크
- 연속 학습 기록

## GitHub 업로드 준비

현재 프로젝트는 GitHub 공유를 고려해 아래 항목을 정리해 두었습니다.

- 개발 산출물 제외: `.next`, `node_modules`, `.vercel`, 로그 파일 등
- 실행 메타데이터 보강: `package.json`에 `description`, `typecheck`, `engines` 추가
- 공개 문서 정비: 이 README를 공개용 소개 문구 기준으로 재정리

추천 업로드 순서:

1. 새 GitHub 저장소 생성
2. 프로젝트 업로드
3. `README.md`와 스크린샷 또는 배포 링크 추가
4. 필요하면 저장소 설명에 아래 문구 사용

추천 저장소 설명 문구:

`경제금융용어 800선 기반 학습형 퀴즈 웹앱. 힌트, 해설, 뉴스 검색, 오답노트, 북마크 복습 지원.`

## Vercel 배포 준비

이 프로젝트는 Vercel 배포 기준으로 아래를 준비해 두었습니다.

- `vercel.json` 추가
- `npm run build` 기준 설정
- 별도 필수 환경변수 없음
- Next.js 프로젝트 구조 유지

배포 순서:

1. GitHub 저장소를 Vercel에 연결
2. Framework Preset이 `Next.js`인지 확인
3. Build Command가 `npm run build`인지 확인
4. Deploy 실행

배포 후 추천 확인 항목:

- 홈 화면 정상 노출
- `오늘의 10문제` 동작
- 오답노트 / 북마크 localStorage 동작
- 용어사전 / 통계 페이지 렌더링 확인

## 외부 공유 전 체크 포인트

1. `npm run typecheck`
2. `npm run build`
3. PDF 원문 포함 시 저작권과 배포 가능 여부 확인
4. README에 실제 배포 링크 추가
5. 필요하면 대표 화면 캡처 추가

## 제작자

- 제작자: @sisopapa
