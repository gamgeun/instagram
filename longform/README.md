# 롱폼 제작 순서

1. `longform/<편>/script.json`에 문장을 쓴다 (sub = 자막, tts = 숫자를 한글로 푼 음성 원고, shot = 그림, src = 출처 번호).
2. 문장마다 AI 음성을 만들고(현재 Artlist, 목소리 Mentor, 한국어), 문장 번호 → 파일 주소를 `voice_urls.json`에 넣는다.
3. `python3 longform/assemble.py longform/<편>` → 음성을 이어 붙이고 자막 시간표(timeline.json)를 만든다.
4. `python3 longform/check_timing.py longform/<편>/timeline.json` → 부족 0개가 될 때까지 그림을 고친다.
5. `python3 longform/mix.py longform/<편>` → 음악·효과음을 섞고 -14 LUFS로 맞춘다.
6. `npx remotion render src/Root.tsx LF-01 out/LF-01.mp4`
7. 썸네일: `npx remotion still src/Root.tsx LF-01-thumb out/LF-01-thumb.png`
8. 업로드 정보: `longform/<편>/youtube.md`

그림 종류는 `src/long/shots.tsx`(1·2장 계열), `src/long/shots2.tsx`(2·3·4장 추가분)에 있다.
