# 1편 v4 대본 (검토용, 음성 생성 전)

- 바뀐 문장은 **굵게** 표시. 음성 재생성 대상 = 다시 만들 언어
- `python3 longform/lint_script.py longform/ep01v3/script.v4.json` 결과: 걸린 곳 없음

| 번호 | 장 | 화면 자막(한국어) | 영어 음성 | 이름표 | 재생성 | 바꾼 이유 |
|---|---|---|---|---|---|---|
| 0 | 0 | **카메라 메뉴를 열면, 23.98이 보입니다.** | **Open your camera's menu, and you'll see twenty-three point nine eight.** |  | ko,en | 번역투 존재 구문(~라는 숫자가 있습니다) |
| 1 | 0 | **백 년 전으로 거슬러 올라갑니다.** | **The story starts a hundred years ago.** |  | ko,en | 번역투(~에는 ~이 숨어 있습니다)·비유. 사용자 제안 문장 |
| 2 | 1 | 1926년 8월, 뉴욕. | August, nineteen twenty-six. New York. |  |  |  |
| 3 | 1 | **워너 브라더스 극장에서 영화 〈돈 후안〉이 개봉했습니다.** | **At the Warners' Theatre, the film Don Juan opens.** | Don Juan 1926 | ko,en | 관용 표현(막을 올리다) → 사실 그대로 |
| 4 | 1 | 화면이 밝아지자 오케스트라 소리가 흘러나옵니다. 그런데 무대에는 연주자가 한 명도 없었죠. | As the screen lights up, an orchestra begins to play. But there isn't a single musician in the pit. |  |  |  |
| 5 | 1 | 소리는 영사실에서 나오고 있었습니다. 영사기 옆, 영사기와 같은 모터로 돌아가는 커다란 레코드판에서요. | The music is coming from the projection booth, from a giant record spinning beside the projector, driven by the same motor. |  |  |  |
| 6 | 1 | 워너 브라더스가 '바이타폰'이라고 부른 방식이었습니다. | Warner Bros. called it Vitaphone. | Vitaphone |  |  |
| 7 | 1 | **그런데 바늘이 한 번 튀면, 소리가 화면보다 앞서거나 뒤처졌습니다.** | **But if the needle skipped, the sound ran ahead of the picture, or fell behind.** |  | ko,en | 예고 문장(이 방식에는 약점이 있었습니다) 삭제 |
| 8 | 1 | 그러면 영사 기사가 손으로 바늘 위치를 다시 맞춰야 했습니다. | Then the projectionist had to put the needle back in place by hand. |  |  |  |
| 9 | 1 | **극장마다 영사기를 돌리는 속도도 달랐습니다.** | **And every theater ran its projectors at a different speed.** |  | ko,en | 예고 문장(문제는 하나 더 있었습니다) 삭제 |
| 10 | 2 | **바이타폰 장비는 웨스턴 일렉트릭이 만들었습니다.** | **Western Electric built the Vitaphone equipment.** | Western Electric | ko,en | 번역투(~를 만든 회사는 ~였습니다) |
| 11 | 2 | 이 회사 기술자 스탠리 왓킨스는 영사 기사에게 물었습니다. 극장에서 실제로 필름을 얼마나 빨리 돌리느냐고요. | One of its engineers, Stanley Watkins, asked a projectionist how fast theaters actually ran their film. | Stanley Watkins |  |  |
| 12 | 2 | **영사 기사는 큰 개봉관은 1분에 80에서 90피트, 작은 극장은 100피트가 넘는다고 답했습니다.** | **The projectionist said big first-run houses ran eighty to ninety feet a minute, and small theaters over a hundred.** |  | ko,en | 주어 없는 피동(답이 돌아왔습니다) |
| 13 | 2 | 왓킨스는 그 사이에서 숫자 하나를 골랐습니다. 1분에 90피트. | Watkins picked one number in between. Ninety feet a minute. |  |  |  |
| 14 | 2 | **1970년 인터뷰에서 왓킨스는 이렇게 말했습니다. "짐작일 수밖에 없었습니다."** | **In a nineteen seventy interview, Watkins put it this way: "That had to be a good guess."** |  | ko,en | 모호한 시점(훗날)·지시어(이 숫자를) |
| 15 | 2 | 35mm 필름 1피트에는 그림 16장이 들어갑니다. 1분에 90피트를 돌리면, 1초에 24장이죠. | One foot of thirty-five millimeter film holds sixteen frames. Ninety feet a minute is twenty-four frames a second. |  |  |  |
| 16 | 2 | (말없음 2.0초: reveal24) |  |  |  |  |
| 17 | 2 | **이듬해 10월, 영화 〈재즈 싱어〉에서 관객은 배우가 노래하고 말하는 소리를 들었습니다.** | **The next October, in The Jazz Singer, audiences heard an actor sing and speak.** | The Jazz Singer 1927 | ko,en | 상투 비유(유성영화 시대가 열립니다) |
| 18 | 2 | 필름 위에 소리를 새기는 폭스의 무비톤도 같은 24장을 택했습니다. | Fox Movietone, which printed sound onto the film itself, chose the same twenty-four. | Fox Movietone |  |  |
| 19 | 2 | **그 뒤로 1초에 24장은 극장의 기준이 됐습니다.** | **From then on, twenty-four frames a second was the standard in theaters.** |  | ko,en | 예고 문장(문제는 극장 밖에서 생깁니다) 삭제 |
| 20 | 3 | **1953년, 미국에서는 흑백 TV가 이미 많이 팔렸습니다.** | **By nineteen fifty-three, Americans had already bought many black-and-white TVs.** |  | ko,en | 번역투 존재 구문(가정에는 ~팔려 있었습니다) |
| 21 | 3 | 흑백 방송은 1초에 30장씩 화면을 보냈습니다. 방송국들이 다음으로 준비한 것은 컬러 방송이었죠. | Black-and-white broadcasts sent thirty pictures a second. What broadcasters prepared next was color. |  |  |  |
| 22 | 3 | 연방통신위원회는 1950년에 CBS의 컬러 방식을 먼저 승인했습니다. 그런데 이 방식으로 방송하면, 이미 팔린 흑백 TV로는 볼 수 없었습니다. | In nineteen fifty, the FCC approved CBS's color system. But the sets people already owned couldn't show it. | FCC (미국 연방통신위원회) / CBS |  |  |
| 23 | 3 | CBS는 1953년 3월, 결국 이 방식을 거둬들입니다. | In March nineteen fifty-three, CBS gave it up. |  |  |  |
| 24 | 3 | 같은 해 12월 17일. 연방통신위원회는 흑백 TV로도 볼 수 있는 새 컬러 방식, NTSC를 승인합니다. | On December seventeenth that year, the FCC approved a new color system that old sets could still show: NTSC. | NTSC |  |  |
| 25 | 3 | **NTSC는 흑백 신호를 그대로 두고, 그 안에 색 정보를 더해 보냈습니다.** | **NTSC kept the black-and-white signal as it was, and added the color information inside it.** |  | ko,en | 번역투(비결은 ~데 있었습니다) |
| 26 | 3 | **그런데 더한 색 신호의 주파수가 소리 신호와 너무 가까웠습니다.** | **But the added color signal was too close in frequency to the sound signal.** |  | ko,en | 예고 문장(여기서 문제가 생겼습니다) 삭제 |
| 27 | 3 | 두 신호의 차이는 흑백 화면 위에 작은 점무늬로 나타났습니다. | **The difference between the two showed up as a fine pattern of dots on black-and-white screens.** |  | en | 영어만 수정(clash 비유) |
| 28 | 3 | 소리 신호를 옮기면 해결됩니다. 하지만 그러면 이미 팔린 TV는 소리를 받지 못하죠. 연방통신위원회도 이 안을 받아들이지 않았습니다. | Moving the sound would fix it, but every set already sold would lose its sound. The FCC wouldn't allow it. |  |  |  |
| 29 | 3 | NTSC 위원회 기술자들이 고른 방법은 반대쪽이었습니다. 화면 속도를 아주 조금 늦추는 것. | The NTSC committee's engineers went the other way. They slowed the picture down, just slightly. |  |  |  |
| 30 | 3 | 흑백 TV는 방송 신호에 맞춰 화면 속도를 따라가기 때문에, 0.1% 느려져도 그대로 보였습니다. | Old sets followed the timing of the broadcast signal, so a slowdown of a tenth of a percent didn't bother them. |  |  |  |
| 31 | 3 | 화면 속도는 1001분의 1000으로 줄었고, 1초에 30장이던 화면은 29.97장이 됐습니다. | **The picture slowed to a thousand over a thousand and one. Thirty frames became twenty-nine point nine seven.** |  | en | 영어만 줄임(한국어보다 길어 뒤가 빔) |
| 32 | 4 | 그럼 극장의 영화는 어떻게 됐을까요? | So what happened to the movies? |  |  |  |
| 33 | 4 | 1초에 24장인 영화를 29.97장짜리 TV 방송으로 내보내려면, 영화도 같은 비율로 늦춰야 했습니다. | To broadcast twenty-four frame films on twenty-nine point nine seven TV, the films had to slow down by the same amount. |  |  |  |
| 34 | 4 | 24에 1001분의 1000을 곱하면, 23.976. | **Twenty-four, slowed by a tenth of a percent: twenty-three point nine seven six.** |  | en | 영어만 줄임(한국어보다 1.4초 김) |
| 35 | 5 | **다시 2026년. 카메라 메뉴를 열면 지금도 23.98이 보입니다.** | **Back to twenty twenty-six. Open the camera menu, and twenty-three point nine eight is still there.** |  | ko,en | 예고형 화법(다시 열어 봅니다) |
| 36 | 5 | **23.98은 1926년 왓킨스가 고른 24에, 1953년 이미 팔린 TV를 지키려고 늦춘 비율을 곱한 숫자입니다.** | **Twenty-three point nine eight is the twenty-four Watkins chose in nineteen twenty-six, multiplied by the slowdown of nineteen fifty-three that protected the TVs already sold.** |  | ko,en | 1번에서 "두 결정"을 뺐으므로 구체적으로 |
| 37 | 5 | (말없음 2.5초: endCard) |  |  |  | 이야기가 끝났다는 표시 |
| 38 | 5 | **다음 편은 코닥입니다. 1975년, 코닥은 디지털카메라를 만들고도 팔지 않았습니다. 왜였을까요?** | **Next time: Kodak. In nineteen seventy-five, Kodak built a digital camera, and never sold it. Why?** | KODAK | ko,en | 예고형 화법(남은 기록으로 확인합니다) |
