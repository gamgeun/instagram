# GEAR NOTES

카메라 촬영 질문을 검은 바탕 글로우 카드 스타일로 설명하는 세로 릴스(1080x1920, 30fps) 템플릿입니다. Remotion으로 렌더합니다.

## 새 편 만들기

1. `scripts/`에 대본 JSON을 하나 추가합니다. 기존 `cq-001-slog3-exposure.json`을 복사해서 고치면 됩니다.
2. `src/Root.tsx`의 `EPISODES` 배열에 그 파일을 import해서 넣습니다.
3. `npm install` 후 `./render.sh CQ-002`를 실행하면 `out/CQ-002.mp4`가 나옵니다.

미리보기는 `npx remotion studio src/Root.tsx`로 엽니다.

## 대본 JSON

| 필드 | 내용 |
|---|---|
| `id` | 편 번호 (예: `CQ-002`) |
| `tag` | 제목 위 알약 라벨 |
| `title` | 한 줄 제목. 모든 장면 상단에 고정되고, 길면 글자 크기가 자동으로 줄어듭니다 |
| `scenes[].step` | 카드 위쪽 단계 이름 |
| `scenes[].visual` | 도식 종류(`type`)와 값(`props`) |
| `scenes[].captions` | 상단 가운데 말자막 마디. `*단어*`는 강조색 |
| `outro` | 마지막 카드 문구 |

말자막 한 마디 길이는 공백 뺀 글자당 4.4프레임 + 20프레임입니다(최소 45, 최대 130프레임, `src/timing.ts`).

## 도식 7종 (`src/visuals/index.tsx`)

| type | 그리는 것 | 주요 props |
|---|---|---|
| `flatVsNormal` | 로그 원본과 보정 영상 나란히 | `left`, `right` |
| `levelBars` | 밝기 % 막대 | `bars[{label, value, on}]` |
| `toggleMenu` | 메뉴 스위치가 켜지며 화면이 바뀜 | `label`, `at` |
| `faceZebra` | 얼굴 위 제브라 줄무늬 + 큰 숫자 | `level` |
| `threeStates` | 어두움/알맞음/너무 밝음 비교 | `items[{label, cover, tone}]` |
| `noiseCompare` | 노이즈 낀 화면과 깨끗한 화면 | `left`, `right` |
| `checklist` | 체크 표시가 차례로 켜지는 정리 | `rows[]` |

이전 청사진 스타일 대본은 `scripts/archive/`에 있습니다. 지금 코드로는 렌더되지 않습니다.

## 폰트

Noto Sans KR, IBM Plex Mono를 `@fontsource` 패키지로 프로젝트에 넣었습니다. 렌더할 때 Google Fonts에 접속하지 않습니다.
