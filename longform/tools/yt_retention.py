"""시청 지속 분석 (youtube-agent-skill의 yt-retention 방식, 코드는 새로 작성)
YouTube 스튜디오 → 분석 → 참여도 → 시청자 유지율 차트 → 내보내기 CSV. 우리 ko.srt를 같이 넣으면 그때 나오던 문장을 보여 준다.
보는 것: 첫 30초 이탈(25% 미만이면 양호), 급하게 떨어지는 지점(구간당 3%p 이상), 중간 구간의 꾸준한 감소
사용법: python3 longform/tools/yt_retention.py retention.csv --duration 273 --srt longform/ep01v3/ko.srt"""
import csv, re, sys
p = sys.argv[1]
dur = float(sys.argv[sys.argv.index('--duration') + 1]) if '--duration' in sys.argv else None
srt = sys.argv[sys.argv.index('--srt') + 1] if '--srt' in sys.argv else None
pts = []
for r in csv.reader(open(p, encoding='utf-8-sig')):
    nums = [x for x in r if re.fullmatch(r'-?[0-9.]+%?', x.strip())]
    if len(nums) >= 2:
        x, y = float(nums[0].rstrip('%')), float(nums[1].rstrip('%'))
        pts.append((x, y))
if not pts: sys.exit('CSV에서 숫자 열을 찾지 못함')
if pts[-1][0] <= 1.0 and dur: pts = [(x * dur, y) for x, y in pts]  # 0~1 비율이면 초로 바꾼다
if max(y for _, y in pts) <= 1.5: pts = [(x, y * 100) for x, y in pts]
subs = []
if srt:
    for blk in open(srt, encoding='utf-8').read().strip().split('\n\n'):
        ls = blk.split('\n')
        if len(ls) >= 3:
            a, b = [sum(float(t) * m for t, m in zip(re.split('[:,]', s.strip())[:3] + [re.split('[:,]', s.strip())[3]], (3600, 60, 1, .001))) for s in ls[1].split('-->')]
            subs.append((a, b, ' '.join(ls[2:])))
def said(t):
    return next((s for a, b, s in subs if a - 1 <= t <= b + 1), '')
y0 = pts[0][1]; y30 = min(pts, key=lambda p: abs(p[0] - 30))[1]
print(f'첫 30초 이탈: {y0 - y30:.1f}%p ' + ('(양호)' if y0 - y30 < 25 else '(첫 15초 대본을 고칠 것)'))
cl = [(pts[i][0], pts[i - 1][1] - pts[i][1]) for i in range(1, len(pts)) if pts[i][0] > 30 and pts[i - 1][1] - pts[i][1] >= 3]
for t, d in sorted(cl, key=lambda c: -c[1])[:5]:
    print(f'급감 {int(t // 60)}:{int(t % 60):02d}  -{d:.1f}%p  {said(t)}')
mid = [p for p in pts if 30 < p[0] < (pts[-1][0] * 0.9)]
if len(mid) > 2:
    slope = (mid[0][1] - mid[-1][1]) / max(1, (mid[-1][0] - mid[0][0]) / 60)
    print(f'중간 구간 감소: 분당 {slope:.1f}%p')
