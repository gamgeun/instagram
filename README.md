# GEAR NOTES

카메라 정보를 청사진 도면 스타일로 설명하는 세로 릴스(1080x1920, 30fps) 템플릿입니다. Remotion으로 렌더합니다.

## 새 편 만들기

1. `scripts/`에 대본 JSON을 하나 추가합니다. 기존 `gn-01-zr-r3d-ne.json`을 복사해서 고치면 됩니다.
2. `src/Root.tsx`의 `EPISODES` 배열에 그 파일을 import해서 넣습니다.
3. `npm install` 후 `./render.sh GN-03`을 실행하면 `out/GN-03.mp4`가 나옵니다.

미리보기는 `npx remotion studio src/Root.tsx`로 엽니다.

## 대본 JSON

| 필드 | 내용 |
|---|---|
| `id` | 편 번호. 컴포지션 이름과 표제란에 씁니다 (예: `GN-03`) |
| `title` / `subtitle` | 표지 제목. `\n`으로 줄을 나눕니다 |
| `scenes[].label` | 머리띠 아래 영문 라벨 |
| `scenes[].heading` | 장면 큰 제목 |
| `scenes[].visual` | 도식 종류(`type`)와 값(`props`) |
| `scenes[].captions` | 자막 마디. 한 마디씩 교체되고 `*단어*`는 노란색으로 표시합니다 |
| `outro` | 마지막 장면 문구. 첫 줄이 큰 글씨입니다 |

장면 길이는 자막 글자 수로 자동 계산합니다(`src/timing.ts`, 공백 뺀 글자당 4.2프레임 + 18프레임, 최소 42 · 최대 120프레임).

## 도식 11종 (`src/visuals/`)

| type | 그리는 것 | 주요 props |
|---|---|---|
| `cameraSheet` | 카메라 정면 도면 + 치수선 | `name`, `notes[]` |
| `dataStack` | 정보량 비교 층 막대 | `cols[{label, sub, rows}]` |
| `monitorMenu` | 카메라 화면 메뉴, 선택 항목 강조 | `title`, `items[]`, `selected`, `note` |
| `logCurve` | 로그 곡선과 일반 곡선 비교 | `logLabel`, `stdLabel` |
| `dualIso` | 기본 감도 두 개와 노이즈 막대 | `bases[]`, `scale[]` |
| `capacity` | 같은 길이 기준 파일 크기 막대 | `caption`, `items[{label, value, note}]` |
| `partsTable` | 번호 붙은 표 / 확인표 | `title`, `rows[[항목, 값]]` |
| `twoCam` | 두 카메라와 색 샘플 비교 | `a`, `b` (`name`, `profile`, `tint`), `result` |
| `colorChart` | 두 카메라 컬러차트, 맞춰지는 과정 | `aLabel`, `bLabel`, `matched` |
| `nodePipeline` | 순서대로 이어진 처리 단계 | `nodes[{title, sub}]` |
| `vectorscope` | 피부색 선과 두 카메라 점 | `aLabel`, `bLabel` |

## 폰트

Noto Sans KR, IBM Plex Mono를 `@fontsource` 패키지로 프로젝트에 넣었습니다. 렌더할 때 Google Fonts에 접속하지 않습니다.
