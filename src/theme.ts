import '@fontsource/noto-sans-kr/400.css';
import '@fontsource/noto-sans-kr/700.css';
import '@fontsource/noto-sans-kr/900.css';
import '@fontsource/noto-serif-kr/700.css';
import '@fontsource/noto-serif-kr/900.css';
import '@fontsource/ibm-plex-mono/400.css';
import '@fontsource/ibm-plex-mono/600.css';
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
  blue: 'var(--solid)',
  good: '#7CF5B4',
  warn: '#FF7A8A',
  grad: 'linear-gradient(90deg,var(--g1),var(--g2))',
  fill: 'linear-gradient(180deg,var(--a1),var(--a2))',
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

/** 난이도별 색. 입문 = 호박색, 중급 = 보라. 노랑 계열과 보라 계열은 색약이 있어도 대부분 구분된다 */
export type Level = 'basic' | 'intermediate';
export const LEVEL: Record<Level, {label: string; vars: Record<string, string>}> = {
  basic: {
    label: '입문',
    vars: {'--solid': '#FFB357', '--g1': '#FFD27A', '--g2': '#FF8E4D', '--a1': '#FFD27A', '--a2': '#FF9548', '--glow1': 'rgba(255,150,60,0.40)', '--glow2': 'rgba(255,80,60,0.14)', '--pill': 'rgba(255,170,80,0.18)'},
  },
  intermediate: {
    label: '중급',
    vars: {'--solid': '#7D8BFF', '--g1': '#8E9BFF', '--g2': '#C77DFF', '--a1': '#9AA4FF', '--a2': '#7D5BFF', '--glow1': 'rgba(90,110,255,0.42)', '--glow2': 'rgba(170,70,255,0.16)', '--pill': 'rgba(140,130,255,0.20)'},
  },
};
