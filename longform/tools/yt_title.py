"""제목·썸네일 문구 검사 (youtube-agent-skill의 yt-package 기준을 한국어에 맞게 다시 씀, 코드는 새로 작성)
화면 폭 어림: 한글·전각 2칸, 영문·숫자·공백 1칸. 모바일 홈 약 40칸, 데스크톱 검색 약 60칸에서 잘린다고 본다(어림값).
사용법: python3 longform/tools/yt_title.py "제목" --thumb "썸네일 문구" """
import argparse, re, unicodedata

def width(s):
    return sum(2 if unicodedata.east_asian_width(c) in 'WF' else 1 for c in s)

ap = argparse.ArgumentParser(); ap.add_argument('titles', nargs='+'); ap.add_argument('--thumb', default='')
a = ap.parse_args()
for t in a.titles:
    w = width(t); notes = []
    if w > 60: notes.append(f'데스크톱에서 잘림({w}칸>60)')
    elif w > 40: notes.append(f'모바일에서 뒤가 잘림({w}칸>40): 앞 40칸에 주제가 들어 있는지 확인 → "{t[:max(1, len(t)*40//w)]}…"')
    if not re.search(r'\d|[A-Z]{2,}|[가-힣]+(이|가)?\s', t): pass
    if not re.search(r'\d', t): notes.append('숫자·연도 없음 (숫자·이름·날짜가 형용사보다 낫다)')
    if a.thumb:
        tw = a.thumb.split()
        if len(tw) > 3: notes.append(f'썸네일 문구 {len(tw)}단어 (3단어 이내)')
        common = set(re.findall(r'[가-힣A-Za-z0-9.]+', a.thumb)) & set(re.findall(r'[가-힣A-Za-z0-9.]+', t))
        if common: notes.append(f'썸네일이 제목과 같은 말 반복: {", ".join(sorted(common))}')
    print(f'{w:3d}칸  {t}' + ''.join('\n      - ' + n for n in notes))
