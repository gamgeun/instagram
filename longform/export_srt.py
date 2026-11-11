"""timeline.json의 자막 마디를 유튜브 자막 파일(SRT)로 내보낸다.
유튜브에 한국어 자막을 직접 올리면, 외국 시청자는 이 자막을 바탕으로 자동 번역 자막을 본다.
(음성 인식으로 만든 자동 자막보다 번역 결과가 정확하다)
사용법: python3 longform/export_srt.py longform/ep01 → longform/ep01/ko.srt"""
import json, sys
ep = sys.argv[1].rstrip('/')
t = json.load(open(f'{ep}/timeline.json'))
def ts(x):
    ms = int(round(x * 1000)); h, ms = divmod(ms, 3600000); m, ms = divmod(ms, 60000); s, ms = divmod(ms, 1000)
    return f'{h:02d}:{m:02d}:{s:02d},{ms:03d}'
lines = []
for i, b in enumerate(t['beats'], 1):
    # 마디 끝 쉼(0.35초)에는 자막을 비운다
    end = min(b['end'], b['start'] + max(1.0, b['end'] - b['start'] - 0.2))
    lines.append(f"{i}\n{ts(b['start'])} --> {ts(end)}\n{b['sub']}\n")
open(f'{ep}/ko.srt', 'w').write('\n'.join(lines))
print(f'{ep}/ko.srt  {len(lines)}개')
