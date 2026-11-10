"""내레이션 + 배경음악 + 효과음을 섞어 mix.wav를 만든다.
- 음악: 길이에 맞춰 반복, 내레이션이 나올 때 자동으로 작아진다(사이드체인)
- 컷 전환마다 바람 소리, 2장(1953)에는 TV 잡음, 3장(1927)에는 영사기 소리를 아주 작게 깐다
사용법: python3 longform/mix.py longform/ep01"""
import json, os, subprocess, sys
ep = sys.argv[1].rstrip('/'); name = os.path.basename(ep)
P = f'public/{name}'; SFX = f'{P}/sfx'
t = json.load(open(f'{ep}/timeline.json')); T = t['duration']
# 컷 시작 시각 (join 마디는 앞 컷에 붙는다)
starts = []
for b in t['beats']:
    if not b['opt'].get('join'):
        starts.append(b['start'])
starts = starts[1:]
ch = {}
for b in t['beats']:
    a, z = ch.get(b['ch'], (b['start'], b['end']))
    ch[b['ch']] = (min(a, b['start']), max(z, b['end']))
inputs = ['-i', f'{P}/narration.wav', '-i', f'{SFX}/music.mp3', '-i', f'{SFX}/tvstatic.wav', '-i', f'{SFX}/projector.wav']
fc = []
# 음악: 두 번 이어 붙여 길이를 채우고 끝 3초 페이드아웃
fc.append(f"[1]aloop=loop=1:size={int(214*48000)},atrim=0:{T},asetpts=N/SR/TB,aresample=48000,volume=0.22,afade=t=in:d=2,afade=t=out:st={T-3}:d=3[mus]")
fc.append("[0]aresample=48000,asplit=2[nar][key]")
fc.append("[mus][key]sidechaincompress=threshold=0.03:ratio=6:attack=40:release=500[duck]")
# 시대별 바탕 소리
def bed(idx, a, z, vol, tag):
    d = z - a
    fc.append(f"[{idx}]aloop=loop=-1:size={30*48000},atrim=0:{d},asetpts=N/SR/TB,volume={vol},afade=t=in:d=1.2,afade=t=out:st={max(0, d-1.5)}:d=1.5,adelay={int(a*1000)}|{int(a*1000)}[{tag}]")
bed(2, *ch[2], 0.05, 'tv')
bed(3, *ch[3], 0.10, 'proj')
# 전환 바람 소리: 컷이 바뀌기 0.15초 전부터
w = []
for k, s in enumerate(starts):
    inputs += ['-i', f'{SFX}/whoosh.wav']
    idx = 4 + k
    ms = max(0, int((s - 0.15) * 1000))
    fc.append(f"[{idx}]volume=0.12,adelay={ms}|{ms}[w{k}]")
    w.append(f'[w{k}]')
mix_in = '[nar][duck][tv][proj]' + ''.join(w)
fc.append(f"{mix_in}amix=inputs={4+len(w)}:normalize=0:duration=first,alimiter=limit=0.95[out]")
cmd = ['ffmpeg', '-y', '-loglevel', 'error'] + inputs + ['-filter_complex', ';'.join(fc), '-map', '[out]', '-ac', '2', '-ar', '48000', f'{P}/mix.wav']
r = subprocess.run(cmd, capture_output=True, text=True)
if r.returncode: print(r.stderr[-2000:]); sys.exit(1)
# 유튜브 기준 음량(-14 LUFS)으로 맞춘다
tmp = f'{P}/mix_tmp.wav'
subprocess.run(['ffmpeg', '-y', '-loglevel', 'error', '-i', f'{P}/mix.wav', '-af', 'loudnorm=I=-14:TP=-1.5:LRA=11', '-ar', '48000', tmp], check=True)
os.replace(tmp, f'{P}/mix.wav')
print(f'mix.wav {T:.1f}초, 전환 효과음 {len(starts)}개')
