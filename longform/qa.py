"""렌더한 영상 파일을 직접 재서 문제를 찾는다 (단계별 테스트가 통과해도 결과물이 틀릴 수 있다).
사용법: python3 longform/qa.py out/LF-01v3_ko.mp4 [out/SH-01a.mp4 ...]
검사: 길이, 평균 음량(-14 LUFS 근처), 0.8초 넘게 조용한 구간(-50dB), 쇼츠는 60초 미만·세로 화면"""
import json, re, subprocess, sys

def sh(*a):
    return subprocess.run(a, capture_output=True, text=True)

bad = 0
for p in sys.argv[1:]:
    info = json.loads(sh('ffprobe', '-v', 'error', '-show_entries', 'format=duration:stream=width,height,codec_type', '-of', 'json', p).stdout)
    dur = float(info['format']['duration'])
    v = next(s for s in info['streams'] if s['codec_type'] == 'video')
    has_audio = any(s['codec_type'] == 'audio' for s in info['streams'])
    vertical = v['height'] > v['width']
    lufs = re.findall(r'I:\s+(-?[0-9.]+) LUFS', sh('ffmpeg', '-hide_banner', '-i', p, '-af', 'ebur128', '-f', 'null', '-').stderr)
    lufs = float(lufs[-1]) if lufs else None
    log = sh('ffmpeg', '-hide_banner', '-i', p, '-af', 'silencedetect=noise=-50dB:d=0.8', '-f', 'null', '-').stderr
    sil = [(float(a), float(b)) for a, b in zip(re.findall(r'silence_start: ([0-9.]+)', log), re.findall(r'silence_end: ([0-9.]+)', log))]
    # 끝 1.5초 안의 무음은 페이드아웃이라 괜찮다
    sil = [s for s in sil if s[0] < dur - 1.5]
    probs = []
    if not has_audio: probs.append('소리 없음')
    if lufs is not None and abs(lufs + 14) > 2: probs.append(f'음량 {lufs} LUFS (기준 -14)')
    if sil: probs.append('무음 ' + ', '.join(f'{a:.1f}~{b:.1f}초' for a, b in sil[:5]))
    if vertical and dur >= 60: probs.append(f'쇼츠 길이 {dur:.1f}초 (60초 미만이어야 함)')
    bad += bool(probs)
    print(f"{'문제' if probs else '통과'}  {p}  {dur:.1f}초  {v['width']}x{v['height']}  {lufs} LUFS" + (''.join('\n   - ' + x for x in probs)))
sys.exit(1 if bad else 0)
