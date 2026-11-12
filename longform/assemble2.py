"""한국어·영어 문장별 음성을 같은 시간표로 이어 붙인다.
문장 하나의 자리(slot)는 두 언어 중 긴 쪽에 맞춘다. 그래서 두 음성 트랙의 길이가 같고, 그림 타이밍도 하나로 쓴다.
사용법: python3 longform/assemble2.py longform/ep01v3
 입력: <ep>/script.json, public/<ep이름>/{ko,en}/NN.mp3
 출력: public/<ep이름>/narration_ko.wav, narration_en.wav, <ep>/timeline.json, <ep>/ko.srt, <ep>/en.srt"""
import json, os, re, subprocess, sys

ep = sys.argv[1].rstrip('/')
name = os.path.basename(ep)
P = f'public/{name}'
SCRIPT = next((a for a in sys.argv[2:] if a.endswith('.json') and 'script' in a), f'{ep}/script.json')
S = json.load(open(SCRIPT))
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


def place(text, wav, d, maxlen, strip=True):
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
    # 한국어 자막 끝의 온점은 뺀다 (물음표·따옴표는 둔다). 23.976 같은 소수점은 끝이 아니라서 남는다
    if not strip:
        return [(c, b[k], b[k + 1]) for k, c in enumerate(cs)]
    return [(re.sub(r'\.(?=[\s,]|["”’〉]?$)', '', c), b[k], b[k + 1]) for k, c in enumerate(cs)]


# 쉼 규칙 (DECISIONS 2026-11-12). 문장 역할에 따라 쉼 길이를 다르게 둔다
PAUSE = {'flow': 0.35, 'same': 0.6, 'shot': 0.9, 'chapter': 1.4, 'reveal': 1.2}
LEAD = 0.5      # 그림이 바뀔 때 그림이 먼저 나오고 이만큼 뒤에 말이 시작된다
EN_MAX = 1.08   # 영어가 한국어보다 길면 이 배율까지 빠르게 한다. 넘치면 영어 문장을 줄여야 한다
DRY = '--dry' in sys.argv


def fit(src, dst, ratio):
    sh('ffmpeg', '-y', '-loglevel', 'error', '-i', src, '-af', f'atempo={ratio:.4f}', dst)


lines, beats, t = [], [], HEAD
segs = {'ko': [], 'en': []}
prev, report, warn = None, [], []
for i, L in enumerate(S['lines']):
    aid = L.get('aid', i)
    new_shot = not L.get('join')
    if prev is None:
        gap, role = 0, 'start'
    elif prev.get('silent'):
        gap, role = 0.3, 'after-silent'  # 말없는 자리 뒤에는 쉼을 또 두지 않는다
    elif L['ch'] != prev['ch']:
        gap, role = PAUSE['chapter'], 'chapter'
    elif prev['shot'].startswith('reveal') and new_shot:
        gap, role = PAUSE['reveal'], 'reveal'
    elif new_shot:
        gap, role = PAUSE['shot'], 'shot'
    else:
        gap, role = PAUSE['flow' if L.get('flow') else 'same'], 'flow' if L.get('flow') else 'same'
    t += gap
    prev = L
    pic = t - LEAD if (new_shot and i > 0) else t  # 그림 시작
    if L.get('silent'):
        beats.append({'sub': '', 'shot': L['shot'], 'opt': {'mood': L['mood']} if L.get('mood') else {}, 'line': i, 'ch': L['ch'], 'start': round(pic, 3), 'say': round(t, 3), 'end': round(t + L['silent'], 3)})
        lines.append({'i': i, 'start': round(t, 3), 'slot': L['silent'], 'ko': 0, 'en': 0, 'en_subs': []})
        report.append((i, role, gap, 0, 0, 1))
        t += L['silent']
        continue
    d = {}
    for lang in ('ko', 'en'):
        w = f'{P}/{lang}/{aid:02d}.wav'
        if not DRY:
            clean(f'{P}/{lang}/{aid:02d}.mp3', w)
        d[lang] = dur(w)
    ratio = 1.0
    if d['en'] > d['ko']:
        ratio = min(EN_MAX, d['en'] / d['ko'])
        if not DRY:
            fit(f'{P}/en/{aid:02d}.wav', f'{P}/en/{aid:02d}.fit.wav', ratio)
        d['en'] = d['en'] / ratio
        if d['en'] > d['ko'] + 0.3:
            warn.append(f'{i}번 영어가 {d["en"] - d["ko"]:.1f}초 김 → 영어 문장을 줄일 것')
    slot = max(d.values())
    en_w = f'{P}/en/{aid:02d}.fit.wav' if ratio > 1 else f'{P}/en/{aid:02d}.wav'
    segs['ko'].append((t, f'{P}/ko/{aid:02d}.wav'))
    segs['en'].append((t, en_w))
    report.append((i, role, gap, d['ko'], slot - d['ko'], ratio))
    ko = place(L['sub'], f'{P}/ko/{aid:02d}.wav', d['ko'], 34)
    en = place(L['en'], en_w if not DRY else f'{P}/en/{aid:02d}.wav', d['en'], 60, strip=False)
    for k, (c, a, b) in enumerate(ko):
        opt = {'mood': L['mood']} if L.get('mood') else {}
        if k > 0 or L.get('join'): opt['join'] = True
        bt = {'sub': c, 'shot': L['shot'], 'opt': opt, 'line': i, 'ch': L['ch'], 'start': round((pic if k == 0 else t + a), 3), 'say': round(t + a, 3), 'end': round(t + b, 3)}
        if k == 0:
            for key in ('label', 'label2'):
                if L.get(key): bt[key] = L[key]
        beats.append(bt)
    lines.append({'i': i, 'start': round(t, 3), 'slot': round(slot, 3), 'ko': round(d['ko'], 3), 'en': round(d['en'], 3),
                  'en_subs': [(c, round(t + a, 3), round(t + b, 3)) for c, a, b in en]})
    t += slot

print('번호 역할     앞쉼  한국어  뒤빈칸 영어배율')
for i, role, gap, k, tail, r in report:
    flag = '  ← 뒤가 빔' if tail > 0.3 else ''
    role = role[:8]
    print(f'{i:3d} {role:8s} {gap:4.2f}  {k:5.2f}  {tail:4.2f}  {r:4.2f}{flag}')
for w_ in warn: print('경고:', w_)
if DRY:
    # 음성 없이 미리보기용 시간표만 만든다 (바뀐 문장은 옛 음성 길이로 어림)
    for a_, b_ in zip(beats, beats[1:]): a_['end'] = b_['start']
    beats[-1]['end'] = round(t + 2.0, 3)
    json.dump({'duration': round(t + 2.0, 3), 'beats': beats, 'lines': lines}, open(sys.argv[3] if len(sys.argv) > 3 else '/dev/null', 'w'), ensure_ascii=False)
    sys.exit(0)
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
    for b in [x for x in beats if x['line'] == L['i'] and x['sub']]:
        n += 1
        end = min(b['end'], L['start'] + L['ko'] + 0.2)
        ko_srt.append(f"{n}\n{ts(b.get('say', b['start']))} --> {ts(end)}\n{b['sub']}\n")
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
