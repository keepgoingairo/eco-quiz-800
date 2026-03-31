# 자동 퀴즈 뱅크 생성

`data/parsed-economic-terms.json`을 기반으로 객관식 80%, 주관식 20% 비율의 퀴즈 데이터를 자동 생성합니다.

## 실행 방법

```bash
"C:\Program Files\nodejs\node.exe" ./scripts/generate-quiz-bank.mjs
```

기본값:
- 입력: `data/parsed-economic-terms.json`
- JSON 출력: `data/generated-quiz-bank.json`
- TS 출력: `data/generated-quiz-bank.ts`

옵션:
- `--input`: 다른 용어 JSON 입력
- `--json-out`: JSON 출력 경로 변경
- `--ts-out`: TS 출력 경로 변경

## 생성 규칙

- 전체 문제의 약 80%는 객관식, 20%는 주관식으로 생성합니다.
- 객관식은 4지선다입니다.
- 주관식은 공백 제거, 소문자 변환 형태의 허용답안을 함께 생성합니다.
- 난이도는 설명 길이와 연관검색어 수를 기준으로 자동 분류합니다.
- 뉴스 영역은 Google/NAVER 검색 링크용 데이터로 함께 생성합니다.

## 현재 결과

현재 기준 결과:
- 총 문제 수: 562개
- 객관식: 449개
- 주관식: 113개

## 앱 연결

현재 앱의 퀴즈/사전/카테고리 필터는 `data/generated-quiz-bank.ts`를 직접 읽도록 연결되어 있습니다.
