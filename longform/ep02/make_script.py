"""2편 코닥 대본 (한국어 먼저). 영어는 한국어 확정 뒤에 옮긴다.
필드: ch, shot(그림 이름, 임시), sub(화면 자막), tts(한글 발음), label(영어 이름표), src(출처 번호)"""
import json
L = []
def a(ch, shot, sub, tts, src='', label=None, join=False, mood=None, silent=None):
    d = {'ch': ch, 'shot': shot, 'sub': sub, 'tts': tts, 'en': '', 'src': src}
    if label: d['label'] = {'en': label[0], 'sub': label[1] if len(label) > 1 else None}
    if join: d['join'] = True
    if mood: d['mood'] = mood
    if silent: d['silent'] = silent
    L.append(d)

# 0. 지금
a(0, 'phoneShot', '휴대폰으로 사진을 찍으면, 필름 대신 파일이 남습니다.', '휴대폰으로 사진을 찍으면, 필름 대신 파일이 남습니다.')
a(0, 'firstFile', '사진을 파일로 남기는 카메라를 처음 만든 곳은 필름 회사, 코닥이었습니다.', '사진을 파일로 남기는 카메라를 처음 만든 곳은 필름 회사, 코닥이었습니다.', 'W', ('KODAK',))
a(0, 'rumor', '코닥이 파산하자, 사람들은 그 이유를 이렇게 설명했죠.', '코닥이 파산하자, 사람들은 그 이유를 이렇게 설명했죠.', 'B')
a(0, 'rumor', '디지털카메라를 만들고도, 필름이 안 팔릴까 봐 숨겼다고.', '디지털카메라를 만들고도, 필름이 안 팔릴까 봐 숨겼다고.', '', join=True, mood='question')
# 1. 1900 필름으로 버는 회사
a(1, 'brownie', '1900년, 미국 로체스터. 코닥은 1달러짜리 카메라를 내놓습니다.', '천구백 년, 미국 로체스터. 코닥은 일 달러짜리 카메라를 내놓습니다.', 'W', ('Brownie', '1900'))
a(1, 'filmRolls', '카메라는 쌌습니다. 코닥은 그 안에 넣을 필름과 현상으로 돈을 벌었죠.', '카메라는 쌌습니다. 코닥은 그 안에 넣을 필름과 현상으로 돈을 벌었죠.', 'W')
a(1, 'eastmanDoc', '창업자 조지 이스트먼은 이렇게 말했습니다. "카메라 한 대마다 필름을 적어도 스무 통은 쓸 것이다."', '창업자 조지 이스트먼은 이렇게 말했습니다. 카메라 한 대마다 필름을 적어도 스무 통은 쓸 것이다.', 'W', ('George Eastman',))
a(1, 'filmEmpire', '그 뒤 코닥은 미국 아마추어 사진 시장에서 가장 큰 회사가 됩니다.', '그 뒤 코닥은 미국 아마추어 사진 시장에서 가장 큰 회사가 됩니다.', 'W')
# 2. 1975 연구소
a(2, 'lab', '1975년, 코닥 연구소. 기술자 스티븐 새슨이 상자 하나를 만들었습니다.', '천구백칠십오 년, 코닥 연구소. 기술자 스티븐 새슨이 상자 하나를 만들었습니다.', 'S', ('Steven Sasson',))
a(2, 'lab', '무게 3.6킬로그램. AA 건전지 열여섯 개로 움직였죠.', '무게 삼 점 육 킬로그램. 에이에이 건전지 열여섯 개로 움직였죠.', 'S', join=True)
a(2, 'sensor', '새슨은 빛을 전기 신호로 바꾸는 센서를 달았습니다. 가로 100칸, 세로 100칸.', '새슨은 빛을 전기 신호로 바꾸는 센서를 달았습니다. 가로 백 칸, 세로 백 칸.', 'S')
a(2, 'tape', '셔터를 누르면 사진 한 장이 카세트테이프에 기록됐습니다. 한 장에 23초.', '셔터를 누르면 사진 한 장이 카세트테이프에 기록됐습니다. 한 장에 이십삼 초.', 'S')
a(2, 'firstPhoto', '그해 12월, 새슨은 연구소 직원 조이 마셜을 찍었습니다. TV에 나온 사진에서 조이 마셜의 얼굴은 보이지 않았습니다.', '그해 십이 월, 새슨은 연구소 직원 조이 마셜을 찍었습니다. 티비에 나온 사진에서 조이 마셜의 얼굴은 보이지 않았습니다.', 'S')
a(2, 'boardroom', '새슨은 경영진 앞에서 이 상자를 여러 번 시연했죠.', '새슨은 경영진 앞에서 이 상자를 여러 번 시연했죠.', 'W')
a(2, 'boardroom', '경영진은 망설였습니다. 사진을 TV로 볼 사람이 있을지 몰랐고, 화질은 필름보다 훨씬 낮았고, 값은 비쌌습니다.', '경영진은 망설였습니다. 사진을 티비로 볼 사람이 있을지 몰랐고, 화질은 필름보다 훨씬 낮았고, 값은 비쌌습니다.', 'W', join=True)
a(2, 'harveyDoc', '1970년대 말, 새슨의 상사 개러스 로이드가 연구를 계속해도 되느냐고 묻자, 기기 사업부 책임자 더글러스 하비는 이렇게 답했습니다. "계속하세요. 그리고 실패하길 바랍니다."', '천구백칠십 년대 말, 새슨의 상사 개러스 로이드가 연구를 계속해도 되느냐고 묻자, 기기 사업부 책임자 더글러스 하비는 이렇게 답했습니다. 계속하세요. 그리고 실패하길 바랍니다.', 'W')
a(2, 'reportDoc', '새슨은 1976년 보고서에 앞으로의 카메라를 적었습니다.', '새슨은 천구백칠십육 년 보고서에 앞으로의 카메라를 적었습니다.', 'W')
a(2, 'reportDoc', '"작은 장치로 아주 어두운 곳에서도 컬러 사진을 찍고, 그 사진을 일반 통신선으로 보낼 수 있을 것이다."', '작은 장치로 아주 어두운 곳에서도 컬러 사진을 찍고, 그 사진을 일반 통신선으로 보낼 수 있을 것이다.', 'W', join=True)
a(2, 'patent', '코닥은 1978년 이 카메라로 특허를 받았습니다. 제품으로는 내놓지 않았고요.', '코닥은 천구백칠십팔 년 이 카메라로 특허를 받았습니다. 제품으로는 내놓지 않았고요.', 'S,W')
a(2, 'patent', '새슨은 이 카메라를 회사 밖에서 보여 줄 수도, 이야기할 수도 없었습니다.', '새슨은 이 카메라를 회사 밖에서 보여 줄 수도, 이야기할 수도 없었습니다.', 'S', join=True)
# 3. 1981~2005 코닥이 만든 디지털
a(3, 'mavica', '1981년, 소니가 전자식 스틸카메라 시제품을 발표합니다.', '천구백팔십일 년, 소니가 전자식 스틸카메라 시제품을 발표합니다.', 'W', ('Sony Mavica', '1981'))
a(3, 'forecast', '코닥은 그보다 앞선 1978년에, 2000년대 어느 해쯤 디지털이 필름을 대신할 거라고 예측해 두었죠.', '코닥은 그보다 앞선 천구백칠십팔 년에, 이천 년대 어느 해쯤 디지털이 필름을 대신할 거라고 예측해 두었죠.', 'W')
a(3, 'products', '그리고 디지털 제품을 하나씩 내놓았습니다. 1991년에는 기자용 디지털카메라를, 1994년에는 애플의 디지털카메라를 만들었죠.', '그리고 디지털 제품을 하나씩 내놓았습니다. 천구백구십일 년에는 기자용 디지털카메라를, 천구백구십사 년에는 애플의 디지털카메라를 만들었죠.', 'D,W', ('Kodak DCS', '1991'))
a(3, 'easyshare', '2005년, 미국에서 가장 많이 팔린 디지털카메라 브랜드는 코닥 이지셰어였습니다.', '이천오 년, 미국에서 가장 많이 팔린 디지털카메라 브랜드는 코닥 이지셰어였습니다.', 'W', ('Kodak EasyShare', 'No.1'), mood='reveal')
a(3, 'easyshare', '디지털카메라를 숨겼다던 회사가, 미국 판매 1위였던 겁니다.', '디지털카메라를 숨겼다던 회사가, 미국 판매 일 위였던 겁니다.', '', join=True)
# 4. 돈이 되지 않은 디지털
a(4, 'margin', '그런데 코닥은 디지털카메라로 돈을 벌지 못했습니다.', '그런데 코닥은 디지털카메라로 돈을 벌지 못했습니다.', 'W')
a(4, 'margin', '필름은 사진을 찍을 때마다 다시 팔렸습니다. 디지털카메라는 한 번 팔면 그걸로 끝이었죠.', '필름은 사진을 찍을 때마다 다시 팔렸습니다. 디지털카메라는 한 번 팔면 그걸로 끝이었죠.', 'W', join=True)
a(4, 'crowd', '1998년 말, 디지털카메라를 파는 회사는 70곳이 넘었습니다.', '천구백구십팔 년 말, 디지털카메라를 파는 회사는 일흔 곳이 넘었습니다.', 'W')
a(4, 'fisherDoc', '1993년 코닥의 최고경영자가 된 조지 피셔는 이렇게 돌아봤습니다. "디지털이 빨리 올 줄 알았습니다. 그렇지 않자, 중간 전략을 세워야 했죠."', '천구백구십삼 년 코닥의 최고경영자가 된 조지 피셔는 이렇게 돌아봤습니다. 디지털이 빨리 올 줄 알았습니다. 그렇지 않자, 중간 전략을 세워야 했죠.', 'W', ('George Fisher',))
a(4, 'inkjet', '2005년부터 코닥은 잉크젯 프린터 사업을 키웠습니다. 잉크를 계속 파는, 필름과 같은 방식이었죠.', '이천오 년부터 코닥은 잉크젯 프린터 사업을 키웠습니다. 잉크를 계속 파는, 필름과 같은 방식이었죠.', 'W')
a(4, 'phones', '그사이 사람들은 디지털카메라 대신 휴대폰으로 사진을 찍기 시작했습니다.', '그사이 사람들은 디지털카메라 대신 휴대폰으로 사진을 찍기 시작했습니다.', 'W')
a(4, 'bankrupt', '2012년 1월 19일, 코닥은 파산 보호를 신청합니다.', '이천십이 년 일 월 십구 일, 코닥은 파산 보호를 신청합니다.', 'B', mood='reveal')
# 5. 다시 지금
a(5, 'phoneShot', '다시 2026년. 휴대폰은 빛을 전기 신호로 바꿔 파일로 남깁니다. 1975년 새슨의 상자와 같은 순서로요.', '다시 이천이십육 년. 휴대폰은 빛을 전기 신호로 바꿔 파일로 남깁니다. 천구백칠십오 년 새슨의 상자와 같은 순서로요.', 'S')
a(5, 'answer', '코닥은 1975년의 시제품을 회사 밖에 보여 주지 않았습니다. 하지만 디지털카메라를 만들었고, 미국에서 가장 많이 팔았습니다.', '코닥은 천구백칠십오 년의 시제품을 회사 밖에 보여 주지 않았습니다. 하지만 디지털카메라를 만들었고, 미국에서 가장 많이 팔았습니다.', 'S,W')
a(5, 'answer', '끝내 찾지 못한 건, 필름처럼 다시 팔리는 상품이었습니다.', '끝내 찾지 못한 건, 필름처럼 다시 팔리는 상품이었습니다.', 'W', join=True)
a(5, 'endCard', '', '', silent=2.5)
a(5, 'next', '다음 편. 한국에서는 셔터를 1/60초로, 유럽에서는 1/50초로 맞추라고 합니다. 두 지역의 전기가 1초에 방향을 바꾸는 횟수가 다르기 때문이죠.', '다음 편. 한국에서는 셔터를 육십 분의 일 초로, 유럽에서는 오십 분의 일 초로 맞추라고 합니다. 두 지역의 전기가 일 초에 방향을 바꾸는 횟수가 다르기 때문이죠.', 'H')

SRC = {
    'W': 'Vinokurova & Kapoor, "Kodak\'s Surprisingly Long Journey towards Strategic Renewal", Wharton draft 2022 — https://web-docs.stern.nyu.edu/management/strategyscience/Kodaks_Surprisingly_Long_Journey.pdf',
    'S': 'IEEE Spectrum, first digital camera history (Sasson prototype specs, Joy Marshall, patent 4,131,919, not allowed to show outside Kodak) — https://spectrum.ieee.org/first-digital-camera-history',
    'B': 'Kodak Chapter 11 filing, 2012-01-19 (Engadget / Kodak press release) — https://www.engadget.com/2012-01-19-kodak-chapter-11-bankruptcy.html',
    'H': '전력 주파수: 한국 60Hz, 유럽 50Hz — https://en.wikipedia.org/wiki/Mains_electricity_by_country',
    'D': 'PetaPixel, Kodak DCS history (DCS 100, 1991) — https://petapixel.com/kodak-dcs-history/',
}
EN = ["When you take a photo on your phone, what's left behind is a file, not film.", 'The first camera to save photos as files was made by a film company: Kodak.', 'When Kodak went bankrupt, people explained it like this.', 'It built a digital camera, then hid it, afraid it would hurt film sales.', 'Nineteen hundred, Rochester, New York. Kodak releases a one-dollar camera.', 'The camera was cheap. Kodak made its money on the film inside it, and on developing it.', 'Founder George Eastman put it this way: "Every camera is good for at least twenty spools of film."', 'Kodak went on to become the biggest name in American amateur photography.', 'Nineteen seventy-five, a Kodak lab. Engineer Steven Sasson built a box.', 'It weighed three point six kilograms, and ran on sixteen AA batteries.', 'Sasson fitted it with a sensor that turned light into an electric signal. A hundred cells across, a hundred down.', 'Press the shutter, and one photo was written to a cassette tape. Twenty-three seconds per picture.', "That December, Sasson photographed lab technician Joy Marshall. On the TV screen, her face didn't show up.", 'Sasson demonstrated the box to management, again and again.', 'Management hesitated. Would anyone want to see photos on a TV? The image was far worse than film, and it was expensive.', 'In the late seventies, when Sasson\'s manager Gareth Lloyd asked whether the work should continue, division head Douglass Harvey answered: "Yes, and I hope you will fail."', 'In a nineteen seventy-six report, Sasson described the camera of the future.', '"A small device capable of taking color pictures under very low light, with pictures that could be sent over conventional communication channels."', 'Kodak patented the camera in nineteen seventy-eight. It never released it as a product.', "Sasson couldn't show the camera outside the company, or even talk about it.", 'Nineteen eighty-one. Sony unveils a prototype electronic still camera.', 'Kodak had already forecast, back in nineteen seventy-eight, that digital would replace film sometime in the two thousands.', 'And it released digital products, one after another: a digital camera for press photographers in ninety-one, a digital camera for Apple in ninety-four.', 'In two thousand five, the best-selling digital camera brand in America was Kodak EasyShare.', 'The company that supposedly hid the digital camera was number one in U.S. sales.', "But Kodak couldn't make money on digital cameras.", 'Film was bought again every time you took pictures. A digital camera was sold once, and that was it.', 'By the end of nineteen ninety-eight, more than seventy companies were selling digital cameras.', 'George Fisher, who became Kodak\'s CEO in nineteen ninety-three, looked back: "We thought that digital would come fast, and when it did not, we had to come up with an interim strategy."', 'From two thousand five, Kodak expanded into inkjet printers, selling ink again and again, the same way it once sold film.', 'Meanwhile, people stopped using digital cameras and started taking pictures with their phones.', 'On January nineteenth, two thousand twelve, Kodak filed for bankruptcy protection.', "Back to twenty twenty-six. Your phone turns light into an electric signal and saves it as a file, in the same order as Sasson's box in nineteen seventy-five.", 'Kodak never showed its nineteen seventy-five prototype outside the company. But it did make digital cameras, and sold more of them than anyone in America.', 'What it never found was a product people would keep buying again, the way they bought film.', '', "Next time: in Korea, you're told to set your shutter to one sixtieth of a second. In Europe, one fiftieth. That's because the electricity changes direction a different number of times each second."]
assert len(EN) == len(L), (len(EN), len(L))
for l, e in zip(L, EN): l['en'] = e
json.dump({'id': 'ep02', 'title': '코닥은 정말 디지털카메라를 숨겼을까?', 'lines': L, 'sources': SRC}, open('longform/ep02/script.json', 'w'), ensure_ascii=False, indent=1)
chars = sum(len(l['tts'].replace(' ', '')) for l in L)
print(len(L), '문장, 말하는 글자', chars, '→ 어림', round(chars / 5.2 + len(L) * 0.8), '초')
