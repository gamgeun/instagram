# 새 세션 인수인계 (2026-11-18, 클라우드 세션 → PC 로컬 세션)

## 지금 방향
- 채널: AI로 얼굴 없는 영상 채널을 만들고 운영하는 과정을 실제 숫자와 함께 기록 (`docs/PLAN-6M.md`). 롱폼 주 1, 쇼츠·릴스 주 3.
- 실험: 계약 결혼·재벌 AI 숏드라마 시험 3화 (`drama/`).

## 꼭 지킬 것
- 회사 계정인 Artlist와 Higgsfield는 쓰지 않는다. 음성은 MeloTTS(MIT), 영상은 이 PC의 Wan 2.2 5B(Apache 2.0).
- 회사 Artlist로 만든 1편 음성·음악, 2편 음성은 개인 채널에 올리기 전에 다시 만들지 회사에 확인할지 사용자가 정한다.
- 한국어 글쓰기 규칙: 예고형 화법·번역투 금지, 기록된 사실만 (`docs/PERSONA-LONGFORM.md`, `longform/lint_script.py`).
- 무료·오픈소스 설치와 시험 생성은 사용자가 미리 승인함(2026-11-18): 묻지 말고 바로 진행. 돈이 드는 일(유료 서비스·결제)만 먼저 묻는다.

## 다음 할 일
1. ComfyUI + Wan 2.2 TI2V-5B 설치 (RTX 2080 8GB: 압축 모델 + 메모리 분산). 확인 없이 바로 설치하고, 받은 파일·용량은 끝난 뒤 보고한다.
2. `drama/pilot/script-v1.md` 1화 2번 장면을 480p·9:16·5초로 생성, 걸린 시간·VRAM 기록 → `drama/tests/`.
3. 결과를 보고 3화 전체 제작 여부 결정.
4. 남은 질문: AI 채널 1편 대본(`longform/ai01/script-v1.md`) 고칠 문장, 1인칭/3인칭, 23.98p 업로드 날짜.

## 주요 파일
- 결정 기록 `DECISIONS.md` / 조사 `docs/research/` / 드라마 분석·대본·참고자료 `drama/`
- 롱폼 제작 `longform/assemble2.py`, `mix.py`, `qa.py`, `tools/yt_*.py` / 그래픽 `src/long/`
