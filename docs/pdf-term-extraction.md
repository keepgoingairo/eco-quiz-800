# PDF 용어 추출 파이프라인

원본 PDF에서 추출해 둔 `pdf-extract.txt`를 우선 소스로 사용해 경제금융 용어, 설명 본문, 연관검색어를 구조화 JSON으로 정리합니다.

## 실행 방법

```bash
"C:\Program Files\nodejs\node.exe" ./scripts/extract-economic-terms.mjs
```

기본값:
- 텍스트 입력: `pdf-extract.txt`
- 텍스트 출력: `data/extracted-economic-terms.txt`
- JSON 출력: `data/parsed-economic-terms.json`

옵션:
- `--text-in`: 다른 텍스트 덤프를 입력으로 지정
- `--text-out`: 원문 텍스트 출력 경로 변경
- `--json-out`: 구조화 JSON 출력 경로 변경
- `--from-pdf`: 텍스트 덤프 대신 원본 PDF를 직접 읽어 추출
- `--pdf`: 직접 추출 시 PDF 경로 지정

## 출력 구조

최종 JSON에는 다음 필드가 들어갑니다.
- `generatedAt`
- `sourceType`
- `sourcePath`
- `relatedMarkerCount`
- `extractionCoverage`
- `totalTerms`
- `entries`

각 `entry`는 다음 구조를 가집니다.
- `id`
- `term`
- `description`
- `relatedKeywords`
- `source`

## 현재 결과

현재 기준 결과:
- 연관검색어 마커: 606개
- 구조화 용어: 562개
- 추출 커버리지: 약 0.9274

## 메모

- `연관검색어` 줄을 엔트리 경계로 사용합니다.
- 머리말, 찾아보기, 쪽수, 러닝 헤더는 제외합니다.
- 일부 항목은 원본 텍스트 자체의 줄바꿈 영향으로 문장 다듬기가 더 필요할 수 있습니다.
