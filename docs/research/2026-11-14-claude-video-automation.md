# Claude 영상 편집 자동화 사례 조사 — 2026-11-14

방법: YouTube 검색 상위 영상(조회수), 설명란, 관련 글. 영상 자막은 YouTube 봇 확인 때문에 받지 못함(우회 안 함).

## 조회수 높은 영상
| 조회수 | 채널 | 제목 | 방식 |
|---|---|---|---|
| 92.5만 | Christian Peverelli | I Fully Automated My Video Editing Using Claude Code | 실사 컷편집 + HyperFrames |
| 39.7만 | Nate Herk | Claude Just Destroyed Every Video Editing Tool | 도구 비교 |
| 38.4만 | Grow With Kaz | VIRAL Animation Videos Using Claude Code | 플러그인 애니메이션 |
| 30.1만 | Matt Loui | Automate Your CapCut Editing With Claude | CapCut + 스킬 |
| 27.0만 | MoSidd | Vox-Style Motion Graphics Using Only Claude Code & Remotion | Remotion 모션그래픽 (우리와 가장 가까움) |
| 26.1만 | Chronixel | Claude + Remotion ULTIMATE REMOTION TUTORIAL | Remotion |
| 22.6만 | 스마트대디 | Claude로 영상 편집 완전 자동화 셋업 | 한국어 |
| 12.4만 | 빌더 조쉬 | 클로드 코드가 기획자이자 편집자, 100% 자동화 | 한국어 |
| 10.9만 | 임효성 | 1시간 넘는 컷편집·자막·쇼츠 맡겨봄 | 프리미어 + SRT → 컷편집 |

## 공통으로 쓰는 방법
1. 편집 판단을 글(마크다운 규칙)로 적고 Claude가 그 규칙을 대본에 적용한다. 예: 구간을 normal/emphasis/critical로 나누고 비율 40/35/25, 구간 길이 3~7초 (chrislema.com).
2. 한 명령으로 전체를 돌린다: 무음 정리 → 자막 → 판단 표시 → 렌더 → 소리 정리.
3. Claude는 직접 편집하지 않고 ffmpeg·Whisper·Remotion에 일을 맡긴다.
4. Remotion 공식 에이전트 스킬: `npx remotion skills add` (remotion-best-practices, remotion-captions 등).
5. HyperFrames(HeyGen 오픈소스): HTML+GSAP로 쓰고 MP4로 렌더. Remotion 대안.
6. 한계: 단계별 테스트가 다 통과해도 결과물이 틀린 경우가 있다 → 결과 영상을 직접 재서 확인해야 한다. 취향 판단은 사람이 한다.

## 출처
- https://chrislema.com/claude-code-skills-for-video-editing
- https://www.remotion.dev/docs/ai/skills
- https://github.com/heygen-com/hyperframes
- https://www.mindstudio.ai/blog/automate-video-editing-claude-code
