"""채널 대비 조회수 배수 (youtube-agent-skill의 yt-viral 방식, 코드는 새로 작성)
조회수 ÷ 그 채널 영상들의 중앙값. 큰 채널이 아니라 '평소보다 잘 된 영상'을 찾는다. 채널당 영상 4개 미만이면 뺀다.
입력: yt-dlp --flat-playlist -J 결과 JSON(채널 목록) 여러 개
사용법: yt-dlp --flat-playlist -J "https://www.youtube.com/@채널/videos" > a.json ; python3 longform/tools/yt_outlier.py a.json b.json --min 2"""
import json, statistics, sys
args = [x for x in sys.argv[1:] if not x.startswith('--')]
mn = float(sys.argv[sys.argv.index('--min') + 1]) if '--min' in sys.argv else 2.0
rows = []
for p in args:
    if p.replace('.', '', 1).isdigit(): continue
    d = json.load(open(p)); es = [e for e in d.get('entries', []) if e and e.get('view_count')]
    if len(es) < 4: print(f'건너뜀: {p} (영상 {len(es)}개, 4개 미만)'); continue
    med = statistics.median(e['view_count'] for e in es)
    for e in es: rows.append((e['view_count'] / med, e['view_count'], int(med), d.get('channel') or d.get('title'), e['title']))
for m, v, med, ch, t in sorted(rows, reverse=True):
    if m >= mn: print(f'{m:5.1f}배  {v:>10,} (중앙값 {med:,})  {ch}  |  {t}')
