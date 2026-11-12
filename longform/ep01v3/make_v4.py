"""v3 대본에 v4 수정(번역투·예고형 화법 제거, 이름표, 끝 화면)을 얹어 script.v4.json을 만든다.
바뀐 문장은 regen=True. 음성 생성은 승인 뒤에 한다."""
import json
s = json.load(open('longform/ep01v3/script.json'))
L = s['lines']
for i, l in enumerate(L):
    l['aid'] = i  # 음성 파일 번호
    l.pop('silent', None) if i != 16 else None

def ch(i, sub, tts, en, why):
    L[i].update(sub=sub, tts=tts, en=en, regen=True, why=why)

ch(0, '카메라 메뉴를 열면, 23.98이 보입니다.', '카메라 메뉴를 열면, 이십삼 점 구팔이 보입니다.',
   "Open your camera's menu, and you'll see twenty-three point nine eight.", '번역투 존재 구문(~라는 숫자가 있습니다)')
ch(1, '백 년 전으로 거슬러 올라갑니다.', '백 년 전으로 거슬러 올라갑니다.',
   'The story starts a hundred years ago.', '번역투(~에는 ~이 숨어 있습니다)·비유. 사용자 제안 문장')
ch(3, '워너 브라더스 극장에서 영화 〈돈 후안〉이 개봉했습니다.', '워너 브라더스 극장에서 영화 돈 후안이 개봉했습니다.',
   "At the Warners' Theatre, the film Don Juan opens.", '관용 표현(막을 올리다) → 사실 그대로')
ch(7, '그런데 바늘이 한 번 튀면, 소리가 화면보다 앞서거나 뒤처졌습니다.', '그런데 바늘이 한 번 튀면, 소리가 화면보다 앞서거나 뒤처졌습니다.',
   'But if the needle skipped, the sound ran ahead of the picture, or fell behind.', '예고 문장(이 방식에는 약점이 있었습니다) 삭제')
ch(9, '극장마다 영사기를 돌리는 속도도 달랐습니다.', '극장마다 영사기를 돌리는 속도도 달랐습니다.',
   'And every theater ran its projectors at a different speed.', '예고 문장(문제는 하나 더 있었습니다) 삭제')
ch(10, '바이타폰 장비는 웨스턴 일렉트릭이 만들었습니다.', '바이타폰 장비는 웨스턴 일렉트릭이 만들었습니다.',
   'Western Electric built the Vitaphone equipment.', '번역투(~를 만든 회사는 ~였습니다)')
ch(12, '영사 기사는 큰 개봉관은 1분에 80에서 90피트, 작은 극장은 100피트가 넘는다고 답했습니다.', '영사 기사는 큰 개봉관은 일 분에 팔십에서 구십 피트, 작은 극장은 백 피트가 넘는다고 답했습니다.',
   'The projectionist said big first-run houses ran eighty to ninety feet a minute, and small theaters over a hundred.', '주어 없는 피동(답이 돌아왔습니다)')
ch(14, '1970년 인터뷰에서 왓킨스는 이렇게 말했습니다. "짐작일 수밖에 없었습니다."', '천구백칠십 년 인터뷰에서 왓킨스는 이렇게 말했습니다. 짐작일 수밖에 없었습니다.',
   'In a nineteen seventy interview, Watkins put it this way: "That had to be a good guess."', '모호한 시점(훗날)·지시어(이 숫자를)')
ch(17, '이듬해 10월, 영화 〈재즈 싱어〉에서 관객은 배우가 노래하고 말하는 소리를 들었습니다.', '이듬해 시 월, 영화 재즈 싱어에서 관객은 배우가 노래하고 말하는 소리를 들었습니다.',
   'The next October, in The Jazz Singer, audiences heard an actor sing and speak.', '상투 비유(유성영화 시대가 열립니다)')
ch(19, '그 뒤로 1초에 24장은 극장의 기준이 됐습니다.', '그 뒤로 일 초에 스물네 장은 극장의 기준이 됐습니다.',
   'From then on, twenty-four frames a second was the standard in theaters.', '예고 문장(문제는 극장 밖에서 생깁니다) 삭제')
ch(20, '1953년, 미국에서는 흑백 TV가 이미 많이 팔렸습니다.', '천구백오십삼 년, 미국에서는 흑백 티비가 이미 많이 팔렸습니다.',
   'By nineteen fifty-three, Americans had already bought many black-and-white TVs.', '번역투 존재 구문(가정에는 ~팔려 있었습니다)')
ch(25, 'NTSC는 흑백 신호를 그대로 두고, 그 안에 색 정보를 더해 보냈습니다.', '엔티에스씨는 흑백 신호를 그대로 두고, 그 안에 색 정보를 더해 보냈습니다.',
   'NTSC kept the black-and-white signal as it was, and added the color information inside it.', '번역투(비결은 ~데 있었습니다)')
ch(26, '그런데 더한 색 신호의 주파수가 소리 신호와 너무 가까웠습니다.', '그런데 더한 색 신호의 주파수가 소리 신호와 너무 가까웠습니다.',
   'But the added color signal was too close in frequency to the sound signal.', '예고 문장(여기서 문제가 생겼습니다) 삭제')
ch(27, '두 신호의 차이는 흑백 화면 위에 작은 점무늬로 나타났습니다.', '두 신호의 차이는 흑백 화면 위에 작은 점무늬로 나타났습니다.',
   'The difference between the two showed up as a fine pattern of dots on black-and-white screens.', '영어만 수정(clash 비유)')
ch(35, '다시 2026년. 카메라 메뉴를 열면 지금도 23.98이 보입니다.', '다시 이천이십육 년. 카메라 메뉴를 열면 지금도 이십삼 점 구팔이 보입니다.',
   "Back to twenty twenty-six. Open the camera menu, and twenty-three point nine eight is still there.", '예고형 화법(다시 열어 봅니다)')
ch(36, '23.98은 1926년 왓킨스가 고른 24에, 1953년 이미 팔린 TV를 지키려고 늦춘 비율을 곱한 숫자입니다.', '이십삼 점 구팔은 천구백이십육 년 왓킨스가 고른 이십사에, 천구백오십삼 년 이미 팔린 티비를 지키려고 늦춘 비율을 곱한 숫자입니다.',
   'Twenty-three point nine eight is the twenty-four Watkins chose in nineteen twenty-six, multiplied by the slowdown of nineteen fifty-three that protected the TVs already sold.', '1번에서 "두 결정"을 뺐으므로 구체적으로')
ch(37, '다음 편은 코닥입니다. 1975년, 코닥은 디지털카메라를 만들고도 팔지 않았습니다. 왜였을까요?', '다음 편은 코닥입니다. 천구백칠십오 년, 코닥은 디지털카메라를 만들고도 팔지 않았습니다. 왜였을까요?',
   'Next time: Kodak. In nineteen seventy-five, Kodak built a digital camera, and never sold it. Why?', '예고형 화법(남은 기록으로 확인합니다)')

# 화면 이름표: 영어는 그대로, 한국어는 꼭 필요할 때만 영어와 함께
LABEL = {3: ('Don Juan', '1926'), 6: ('Vitaphone', None), 10: ('Western Electric', None), 11: ('Stanley Watkins', None),
         17: ('The Jazz Singer', '1927'), 18: ('Fox Movietone', None), 22: ('CBS', None), 24: ('NTSC', None), 37: ('KODAK', None)}
for i, (en, sub) in LABEL.items():
    L[i]['label'] = {'en': en, 'sub': sub}
L[22]['label2'] = {'en': 'FCC', 'ko': '미국 연방통신위원회'}  # 내레이션은 한국어 이름, 화면은 영어+한국어
L[22]['label'], L[22]['label2'] = L[22]['label2'], L[22]['label']  # FCC가 먼저 나온다

# 끝 화면: 36번(이야기 끝) 뒤, 말없이 2.5초
end = {'ch': 5, 'shot': 'endCard', 'sub': '', 'tts': '', 'en': '', 'silent': 2.5, 'mood': 'calm', 'why': '이야기가 끝났다는 표시'}
L.insert(37, end)
s['lines'] = L
json.dump(s, open('longform/ep01v3/script.v4.json', 'w'), ensure_ascii=False, indent=1)
print(len(L), '문장, 다시 만들 음성', sum(1 for l in L if l.get('regen')))
