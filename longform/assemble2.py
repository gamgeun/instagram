"""한국어·영어 문장별 음성을 같은 시간표로 이어 붙인다.
문장 하나의 자리(slot)는 두 언어 중 긴 쪽에 맞춘다. 그래서 두 음성 트랙의 길이가 같고, 그림 타이밍도 하나로 쓴다.
사용법: python3 longform/assemble2.py longform/ep01v3
 입력: <ep>/script.json, public/<ep이름>/{ko,en}/NN.mp3
 출력: public/<ep이름>/narration_ko.wav, narration_en.wav, <ep>/timeline.json, <ep>/ko.srt, <ep>/en.srt"""
import json, os, re, subprocess, sys

ep = sys.argv[1].rstrip('/')
name = os.path.basename(ep)
P = f'public/{name}'
S = json.load(open(f'{ep}/script.json'))
GAP, CH_GAP, HEAD = 0.45, 1.1, 0.6  # 문장 사이 쉼, 장이 바뀔 때 쉼, 맨 앞 여백


def sh(*a):
    return subprocess.run(a, capture_output=True, text=True)


def dur(p):
    return float(sh('ffprobe', '-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', p).stdout)


def clean(src, dst):
    sh('ffmpeg', '-y', '-loglevel', 'error', '-i', src, '-af',
       'silenceremove=start_periods=1:start_threshold=-45dB:start_silence=0.05,areverse,'
       'silenceremove=start_periods=1:start_threshold=-45dB:start_silence=0.08,areverse',
       '-ar', '48000', '-ac', '1', dst)


def silences(p):
    log = sh('ffmpeg', '-hide_banner', '-i', p, '-af', 'silencedetect=noise=-35dB:d=0.15', '-f', 'null', '-').stderr
    st = [float(x) for x in re.findall(r'silence_start: ([0-9.]+)', log)]
    en = [float(x) for x in re.findall(r'silence_end: ([0-9.]+)', log)]
    return [(a + b) / 2 for a, b in zip(st, en)]


def chunks(text, maxlen):
    """문장 끝·쉼표에서 끊고, 너무 길면 가운데 띄어쓰기에서 한 번 더 끊는다. 너무 짧은 조각은 다음과 합친다"""
    parts = [p.rstrip(',') for p in re.split(r'(?<=[.?!,:])\s+', text.strip())]
    res = []
    for p in parts:
        while len(p) > maxlen:
            sp = [m.start() for m in re.finditer(' ', p)]
            cut = min(sp, key=lambda x: abs(x - len(p) / 2))
            res.append(p[:cut]); p = p[cut + 1:]
        res.append(p)
    k = 0
    while k < len(res) - 1:
        if len(res[k]) < maxlen * 0.25:
            res[k:k + 2] = [res[k] + ', ' + res[k + 1]]
        else:
            k += 1
    return res


def place(text, wav, d, maxlen):
    """자막 조각마다 문장 안에서의 시작·끝 시간(초)"""
    cs = chunks(text, maxlen)
    gaps = silences(wav)
    w = [len(re.sub(r'\s', '', c)) for c in cs]
    tot = sum(w); acc = 0; b = [0.0]
    for k in range(len(cs) - 1):
        acc += w[k]; est = d * acc / tot
        cand = [g for g in gaps if abs(g - est) < 1.2 and g > b[-1] + 0.6]
        b.append(min(cand, key=lambda g: abs(g - est)) if cand else est)
    b.append(d)
    return [(c, b[k], b[k + 1]) for k, c in enumerate(cs)]


lines, beats, t = [], [], HEAD
segs = {'ko': [], 'en': []}
prev = None
for i, L in enumerate(S['lines']):
    if prev is not None:
        t += CH_GAP if L['ch'] != prev else GAP
    prev = L['ch']
    d = {}
    for lang in ('ko', 'en'):
        w = f'{P}/{lang}/{i:02d}.wav'
        clean(f'{P}/{lang}/{i:02d}.mp3', w)
        d[lang] = dur(w)
    slot = max(d.values())
    for lang in ('ko', 'en'):
        segs[lang].append((t, f'{P}/{lang}/{i:02d}.wav'))
    ko = place(L['sub'], f'{P}/ko/{i:02d}.wav', d['ko'], 34)
    en = place(L['en'], f'{P}/en/{i:02d}.wav', d['en'], 60)
    for k, (c, a, b) in enumerate(ko):
        opt = {'mood': L['mood']} if L.get('mood') else {}
        if k > 0 or L.get('join'): opt['join'] = True
        beats.append({'sub': c, 'shot': L['shot'], 'opt': opt, 'line': i, 'ch': L['ch'], 'start': round(t + a, 3), 'end': round(t + b, 3)})
    lines.append({'i': i, 'start': round(t, 3), 'slot': round(slot, 3), 'ko': round(d['ko'], 3), 'en': round(d['en'], 3),
                  'en_subs': [(c, round(t + a, 3), round(t + b, 3)) for c, a, b in en]})
    t += slot
total = t + 2.0
# 자막 마디 사이 빈 시간은 앞 마디가 채운다 (그림 타이밍용)
for a, b in zip(beats, beats[1:]):
    a['end'] = b['start']
beats[-1]['end'] = round(total, 3)

# 음성 트랙: 각 문장을 정해진 시각에 놓는다
for lang in ('ko', 'en'):
    inputs, fc = [], []
    for k, (st, w) in enumerate(segs[lang]):
        inputs += ['-i', w]
        ms = int(st * 1000)
        fc.append(f'[{k}]adelay={ms}|{ms}[a{k}]')
    mix = ''.join(f'[a{k}]' for k in range(len(segs[lang])))
    fc.append(f'{mix}amix=inputs={len(segs[lang])}:normalize=0,apad=whole_dur={total}[out]')
    r = sh('ffmpeg', '-y', '-loglevel', 'error', *inputs, '-filter_complex', ';'.join(fc), '-map', '[out]', '-t', str(total), '-ar', '48000', '-ac', '1', f'{P}/narration_{lang}.wav')
    if r.returncode: print(r.stderr[-1500:]); sys.exit(1)


def ts(x):
    ms = int(round(x * 1000)); h, ms = divmod(ms, 3600000); m, ms = divmod(ms, 60000); s, ms = divmod(ms, 1000)
    return f'{h:02d}:{m:02d}:{s:02d},{ms:03d}'


# 자막 파일: 실제로 말하는 동안만 띄운다
ko_srt, n = [], 0
for L in lines:
    for b in [x for x in beats if x['line'] == L['i']]:
        n += 1
        end = min(b['end'], L['start'] + L['ko'] + 0.2)
        ko_srt.append(f"{n}\n{ts(b['start'])} --> {ts(end)}\n{b['sub']}\n")
en_srt, n = [], 0
for L in lines:
    for c, a, b in L['en_subs']:
        n += 1
        en_srt.append(f"{n}\n{ts(a)} --> {ts(b + 0.2)}\n{c}\n")
open(f'{ep}/ko.srt', 'w').write('\n'.join(ko_srt))
open(f'{ep}/en.srt', 'w').write('\n'.join(en_srt))
json.dump({'duration': round(total, 3), 'beats': beats, 'lines': lines}, open(f'{ep}/timeline.json', 'w'), ensure_ascii=False, indent=1)
over = [L['i'] for L in lines if L['en'] > L['ko'] + 0.3]
print(f'{len(lines)}문장, 자막 마디 {len(beats)}개, 총 {total:.1f}초 / 영어가 더 긴 문장: {over}')
