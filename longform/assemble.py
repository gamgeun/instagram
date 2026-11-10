"""문장별 음성 파일을 이어 붙이고, 자막 마디별 시간표(timeline.json)를 만든다.
사용법: python3 longform/assemble.py longform/ep01
 - <ep>/script.json : 문장 목록
 - <ep>/voice_urls.json : 문장 번호 → 음성 파일 주소
 결과: public/<ep이름>/narration.wav, <ep>/timeline.json"""
import json, os, re, subprocess, sys, urllib.request
ep = sys.argv[1].rstrip('/')
name = os.path.basename(ep)
S = json.load(open(f'{ep}/script.json'))
U = json.load(open(f'{ep}/voice_urls.json'))
out = f'public/{name}'
os.makedirs(f'{out}/lines', exist_ok=True)
GAP, CH_GAP = 0.35, 0.9

def sh(*a):
    return subprocess.run(a, capture_output=True, text=True)

def dur(p):
    return float(sh('ffprobe', '-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', p).stdout)

def silences(p):
    log = sh('ffmpeg', '-hide_banner', '-i', p, '-af', 'silencedetect=noise=-35dB:d=0.15', '-f', 'null', '-').stderr
    st = [float(x) for x in re.findall(r'silence_start: ([0-9.]+)', log)]
    en = [float(x) for x in re.findall(r'silence_end: ([0-9.]+)', log)]
    return [((a + b) / 2) for a, b in zip(st, en)]

def chunks(sub):
    """자막은 문장 끝과 쉼표에서만 끊는다. 한 마디가 34자를 넘으면 가운데에 가장 가까운 띄어쓰기에서 한 번 더 끊는다"""
    parts = [p.rstrip(',') for p in re.split(r'(?<=[.?!,])\s+', sub.strip())]
    res = []
    for p in parts:
        if res and len(res[-1]) + len(p) + 1 <= 22 and not res[-1].endswith(('.', '?', '!')):
            res[-1] += ', ' + p
            continue
        while len(p) > 34:
            sp = [m.start() for m in re.finditer(' ', p)]
            cut = min(sp, key=lambda x: abs(x - len(p) / 2))
            res.append(p[:cut]); p = p[cut + 1:]
        res.append(p)
    # 8자보다 짧은 마디("1926년", "정리하면")는 다음 마디와 합친다
    k = 0
    while k < len(res) - 1:
        if len(res[k]) < 8:
            res[k:k + 2] = [res[k] + ', ' + res[k + 1]]
        else:
            k += 1
    return res

files, beats, t = [], [], 0.0
prev_ch = None
for i, line in enumerate(S['lines']):
    raw = f'{out}/lines/{i:02d}.mp3'
    if not os.path.exists(raw):
        urllib.request.urlretrieve(U[str(i)], raw)
    clean = f'{out}/lines/{i:02d}.wav'
    # 앞뒤 무음을 0.05초만 남기고 자른다
    sh('ffmpeg', '-y', '-loglevel', 'error', '-i', raw, '-af',
       'silenceremove=start_periods=1:start_threshold=-45dB:start_silence=0.05,areverse,silenceremove=start_periods=1:start_threshold=-45dB:start_silence=0.08,areverse',
       '-ar', '48000', '-ac', '1', clean)
    d = dur(clean)
    if prev_ch is not None:
        g = CH_GAP if line['ch'] != prev_ch else GAP
        files.append(('gap', g)); t += g
    prev_ch = line['ch']
    files.append(('file', clean))
    cs = chunks(line['sub'])
    # 마디 경계: 글자 수 비율로 어림한 뒤 문장 안 쉼(무음)에 붙인다
    gaps = silences(clean)
    w = [len(re.sub(r'\s', '', c)) for c in cs]
    tot = sum(w); acc = 0; bnd = [0.0]
    for k in range(len(cs) - 1):
        acc += w[k]; est = d * acc / tot
        cand = [g for g in gaps if abs(g - est) < 1.2 and g > bnd[-1] + 0.6]
        bnd.append(min(cand, key=lambda g: abs(g - est)) if cand else est)
    bnd.append(d)
    for k, c in enumerate(cs):
        opt = dict(line.get('opt', {}))
        if 'mood' in line: opt['mood'] = line['mood']
        if k > 0 or line.get('join'): opt['join'] = True
        beats.append({'sub': c, 'shot': line['shot'], 'opt': opt, 'line': i, 'ch': line['ch'],
                      'start': round(t + bnd[k], 3), 'end': round(t + bnd[k + 1], 3)})
    t += d
# 마디 사이 빈 구간(쉼)은 앞 마디가 이어서 차지한다
for a, b in zip(beats, beats[1:]):
    a['end'] = b['start']
beats[-1]['end'] = round(t + 1.5, 3)
# 이어 붙이기
lst = f'{out}/concat.txt'
with open(lst, 'w') as fp:
    for kind, v in files:
        if kind == 'gap':
            gp = f'{out}/lines/gap_{int(v*1000)}.wav'
            if not os.path.exists(gp):
                sh('ffmpeg', '-y', '-loglevel', 'error', '-f', 'lavfi', '-i', f'anullsrc=r=48000:cl=mono', '-t', str(v), gp)
            fp.write(f"file '{os.path.abspath(gp)}'\n")
        else:
            fp.write(f"file '{os.path.abspath(v)}'\n")
sh('ffmpeg', '-y', '-loglevel', 'error', '-f', 'concat', '-safe', '0', '-i', lst, '-af', 'apad=pad_dur=1.5', f'{out}/narration.wav')
total = dur(f'{out}/narration.wav')
json.dump({'duration': total, 'beats': beats}, open(f'{ep}/timeline.json', 'w'), ensure_ascii=False, indent=1)
print(f'{len(S["lines"])}문장, 자막 마디 {len(beats)}개, 총 {total:.1f}초')
