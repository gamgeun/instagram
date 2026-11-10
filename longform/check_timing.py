"""렌더 전 검사: 컷마다 화면 글자를 다 읽을 시간이 있는지 본다.
읽는 시간 = 컷 길이 - 전환 0.5초 - 마지막 글자가 나타나기까지 걸리는 시간
필요 시간 = 그림 파악 0.6초 + 화면 글자 수 / 초당 6자  (자막은 내레이션과 함께 들리므로 따로 세지 않는다)
사용법: python3 longform/check_timing.py longform/ep01/timeline.json"""
import json, sys
# 그림 종류별 (화면 글자 수, 마지막 글자 등장까지 초). 그림을 고치면 이 표도 같이 고친다
ON = {'menuScroll': (8, 1.2), 'bigNum': (2, 0.2), 'filmLook': (2, 0.7), 'glitchNum': (2, 0.1), 'frameCount': (4, 0.2),
      'versus': (8, 0.3), 'diff': (5, 0.7), 'tunnel': (2, 0.3), 'room': (4, 0.3), 'colorStandard': (6, 0.4), 'condition': (3, 0.2),
      'bwReceive': (0, 0.7), 'signalAdd': (8, 0.9), 'signalClash': (9, 1.0), 'soundMove': (0, 0.0), 'tvGrid': (0, 0.9),
      'slowDial': (2, 0.3), 'fraction': (3, 0.1), 'bigCrt': (1, 0.2), 'strike': (3, 0.6), 'filmToTv': (6, 0.3),
      'filmSlow': (2, 0.3), 'equation': (7, 1.6), 'menuHighlight': (6, 0.2), 'sepiaTease': (6, 0.4),
      'cbsWithdraw': (14, 0.4), 'dotPattern': (14, 0.4), 'crank': (9, 0.7), 'speedBars': (16, 0.8), 'vitaphone': (18, 0.5),
      'syncDrift': (14, 0.3), 'engineerAsk': (24, 0.8), 'ninety': (8, 0.2), 'filmCalc': (12, 0.6), 'movietone': (20, 0.5),
      'chain': (16, 2.0), 'choose': (16, 0.5), 'drift': (12, 0.4), 'twoCams': (14, 0.3), 'shutter60': (16, 0.3), 'endCard': (10, 1.0)}
t = json.load(open(sys.argv[1]))
sh = []
for b in t['beats']:
    if b['opt'].get('join') and sh:
        sh[-1]['to'] = b['end']; sh[-1]['marks'].append(b['start'] - sh[-1]['from']); continue
    sh.append({'shot': b['shot'], 'from': b['start'], 'to': b['end'], 'marks': [], 'sub': b['sub']})
bad = 0
for s in sh:
    d = s['to'] - s['from']; c, delay = ON[s['shot']]
    # 둘째 마디에서 글자가 더 나오는 그림은 그 마디부터 다시 잰다
    if s['shot'] == 'versus' and s['marks']:
        # 0.02는 말보다 0.3초 먼저 나오고 다음 컷 첫 0.7초까지 남는다
        d = s['to'] - s['from'] - s['marks'][0] + 0.4 + 0.7; c = 5
    # 첫 컷은 들어오는 전환이 없어서 나가는 전환(0.2초)만 뺀다
    fade = 0.2 if s is sh[0] else 0.5
    read = d - fade - delay; need = 0.6 + c / 6
    tag = '부족' if read < need - 0.05 else ('12초 넘음(구도 이동만으로 버티는지 확인)' if d > 12 and not s['marks'] else 'OK')
    bad += tag == '부족'
    print(f"{s['from']:6.2f}s {s['shot']:13s} 컷 {d:4.1f}s  읽는 시간 {read:4.1f}s / 필요 {need:3.1f}s  {tag}  | {s['sub']}")
print(f"\n부족 {bad} / {len(sh)}")
sys.exit(1 if bad else 0)
