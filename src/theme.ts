import '@fontsource/noto-sans-kr/400.css';
import '@fontsource/noto-sans-kr/700.css';
import '@fontsource/noto-sans-kr/900.css';
import {interpolate, Easing} from 'remotion';

// 폰트 파일은 node_modules에서 함께 묶인다. 렌더할 때 외부 네트워크가 필요 없다
export const FONT = "'Noto Sans KR', sans-serif";

/** C안 "글로우 카드": 검은 바탕 + 보라·파랑 빛 번짐 + 반투명 카드 */
export const C = {
  bg: '#000000',
  text: '#FFFFFF',
  sub: 'rgba(255,255,255,0.72)',
  dim: 'rgba(255,255,255,0.45)',
  card: 'rgba(255,255,255,0.06)',
  cardLine: 'rgba(255,255,255,0.16)',
  blue: '#7D8BFF',
  violet: '#B57BFF',
  good: '#7CF5B4',
  warn: '#FF7A8A',
  grad: 'linear-gradient(90deg,#8E9BFF,#C77DFF)',
};

export const W = 1080;
export const H = 1920;
export const FPS = 30;

export const prog = (f: number, start: number, dur: number) =>
  interpolate(f, [start, start + dur], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.out(Easing.cubic),
  });

/** 제목을 한 줄에 넣기 위한 글자 크기. 한글 1, 영문·숫자 0.6 폭으로 어림한다 */
export const fitOneLine = (t: string, maxW: number, maxSize: number) => {
  const units = [...t].reduce((a, ch) => a + (/[가-힣]/.test(ch) ? 1 : ch === ' ' ? 0.3 : 0.6), 0);
  return Math.min(maxSize, Math.floor(maxW / units));
};
