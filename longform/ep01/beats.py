"""자막 마디(beat)마다 시작·끝 시간을 잡는다.
글자 수 비율로 위치를 어림한 뒤, 가까운 무음 구간(문장 사이 쉬는 곳)에 붙인다."""
import json, re, subprocess, sys

AUDIO = 'public/ep01/narration.mp3'
# (화면 자막, 음성 원고, 컷 종류, 옵션)
B = [
 ("카메라 동영상 메뉴를 열면", "카메라 동영상 메뉴를 열면", "menuScroll", {"stop": True, "mood": "calm"}),
 ("이런 숫자가 있습니다", "이런 숫자가 있습니다.", "menuScroll", {"join": True}),
 ("23.98", "이십삼 점 구팔.", "bigNum", {"text": "23.98", "mood": "reveal"}),
 ("영화처럼 찍고 싶을 때 고르는 설정입니다", "영화처럼 찍고 싶을 때 고르는 설정입니다.", "filmLook", {"mood": "calm"}),
 ("그런데 이상합니다", "그런데 이상합니다.", "glitchNum", {"mood": "tense"}),
 ("영화는 1초에 24장인데", "영화는 일 초에 스물네 장인데,", "frameCount", {"n": 24, "era": "now"}),
 ("왜 24가 아니라 23.98일까요?", "왜 이십사가 아니라 이십삼 점 구팔일까요?", "versus", {"mood": "question"}),
 ("이 0.02는", "이 영 점 영이는", "diff", {"mood": "reveal"}),
 ("70년도 더 전에", "칠십 년도 더 전에,", "tunnel", {"mood": "travel"}),
 ("미국 텔레비전 때문에 생겼습니다", "미국 텔레비전 때문에 생겼습니다.", "tunnel", {"join": True}),
 ("1953년 미국", "천구백오십삼 년 미국.", "room", {"mood": "calm"}),
 ("집집마다 흑백 텔레비전이 있었습니다", "집집마다 흑백 텔레비전이 있었습니다.", "room", {"join": True}),
 ("흑백 방송은 화면을 1초에 30장씩 보냈습니다", "흑백 방송은 화면을 일 초에 서른 장씩 보냈습니다.", "frameCount", {"n": 30, "era": "crt"}),
 ("그해 미국은 컬러 방송 규격을 정했습니다", "그해 미국은 컬러 방송 규격을 정했습니다.", "colorStandard", {}),
 ("조건이 하나 있었습니다", "조건이 하나 있었습니다.", "condition", {}),
 ("이미 팔린 흑백 TV에서도 컬러 방송이 나와야 했습니다", "이미 팔린 흑백 텔레비전에서도 컬러 방송이 나와야 했습니다.", "bwReceive", {}),
 ("그래서 기존 신호에 색 정보를 덧붙였는데", "그래서 기존 신호에 색 정보를 덧붙였는데,", "signalAdd", {}),
 ("이 색 신호가 소리 신호와 부딪혀 잡음을 냈습니다", "이 색 신호가 소리 신호와 부딪혀 잡음을 냈습니다.", "signalClash", {"mood": "tense"}),
 ("소리 신호를 옮기면", "소리 신호를 옮기면", "soundMove", {}),
 ("집에 있는 TV를 전부 고쳐야 합니다", "집에 있는 텔레비전을 전부 고쳐야 합니다.", "tvGrid", {"mood": "tense"}),
 ("기술자들은 화면 쪽을 아주 조금 늦추기로 했습니다", "기술자들은 화면 쪽을 아주 조금 늦추기로 했습니다.", "slowDial", {}),
 ("1001분의 1000으로", "천일 분의 천으로.", "fraction", {}),
 ("1초에 30장이던 화면은", "일 초에 서른 장이던 화면은", "bigCrt", {"text": "30"}),
 ("29.97장이 됐습니다", "이십구 점 구칠 장이 됐습니다.", "strike", {"from": "30", "to": "29.97", "mood": "reveal"}),
 ("24장짜리 영화를 이 TV로 틀려면", "스물네 장짜리 영화를 이 텔레비전으로 틀려면,", "filmToTv", {}),
 ("영화도 같은 비율로 늦춰야 했습니다", "영화도 같은 비율로 늦춰야 했습니다.", "filmSlow", {}),
 ("24 × 1000/1001 = 23.976", "이십사에 천일 분의 천을 곱하면 이십삼 점 구칠육.", "equation", {"mood": "reveal"}),
 ("지금 카메라에 있는 23.98입니다", "지금 카메라에 있는 이십삼 점 구팔입니다.", "menuHighlight", {}),
 ("그럼 처음의 24라는 숫자는", "그럼 처음의 이십사라는 숫자는", "sepiaTease", {"mood": "question"}),
 ("어디서 왔을까요?", "어디서 왔을까요?", "sepiaTease", {"join": True}),
]

dur = float(subprocess.check_output(['ffprobe','-v','error','-show_entries','format=duration','-of','csv=p=0',AUDIO]).decode())
log = subprocess.run(['ffmpeg','-hide_banner','-i',AUDIO,'-af','silencedetect=noise=-35dB:d=0.18','-f','null','-'],capture_output=True,text=True).stderr
st = [float(x) for x in re.findall(r'silence_start: ([0-9.]+)', log)]
en = [float(x) for x in re.findall(r'silence_end: ([0-9.]+)', log)]
gaps = [(s+e)/2 for s,e in zip(st,en)]
# 문장 끝(.?!)이나 쉼표 뒤에 쉬는 곳이 있다고 보고, 글자 수로 어림한 위치를 가까운 쉬는 곳에 붙인다
w = [len(re.sub(r'[\s.,?!]','',t)) + (3 if t.strip()[-1] in '.?!' else 1.5 if t.strip()[-1]==',' else 0.5) for _,t,_,_ in B]
speech0 = 0.0; speech1 = dur
tot = sum(w); acc = 0; bounds = [speech0]
used = set()
for i in range(len(B)-1):
    acc += w[i]
    est = speech0 + (speech1-speech0)*acc/tot
    cand = [(abs(g-est),k,g) for k,g in enumerate(gaps) if k not in used and abs(g-est) < 1.6 and g > bounds[-1]+0.8]
    if cand:
        _,k,g = min(cand); used.add(k); bounds.append(round(g,3))
    else:
        bounds.append(round(max(est, bounds[-1]+0.9),3))
bounds.append(round(dur,3))
out = [{"sub": s, "shot": k, "opt": o, "start": bounds[i], "end": bounds[i+1]} for i,(s,_,k,o) in enumerate(B)]
json.dump({"duration": dur, "beats": out}, open('longform/ep01/timeline.json','w'), ensure_ascii=False, indent=1)
snapped = sum(1 for b in bounds[1:-1] if any(abs(b-g)<0.001 for g in gaps))
print(f"{len(out)} beats, {snapped}/{len(out)-1} 경계가 쉬는 곳에 맞음, 무음 구간 {len(gaps)}개")
for b in out: print(f"{b['start']:6.2f}-{b['end']:6.2f}  {b['sub']}")
