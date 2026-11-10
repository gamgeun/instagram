import '@fontsource/noto-sans-kr/400.css';
import '@fontsource/noto-sans-kr/700.css';
import '@fontsource/noto-sans-kr/900.css';
import '@fontsource/ibm-plex-mono/400.css';
import '@fontsource/ibm-plex-mono/600.css';
import {interpolate, Easing} from 'remotion';

// 폰트 파일은 node_modules에서 함께 묶인다. 렌더할 때 외부 네트워크가 필요 없다
export const FONT_KR = "'Noto Sans KR', sans-serif";
export const FONT_MONO = "'IBM Plex Mono', 'Noto Sans KR', monospace";

export const C = {
  bg: '#0F3057',
  bgDeep: '#0A2342',
  line: '#EAF2FF',
  lineDim: 'rgba(234,242,255,0.55)',
  grid: 'rgba(234,242,255,0.07)',
  gridMajor: 'rgba(234,242,255,0.14)',
  accent: '#FFD23F',
  red: '#FF6B6B',
  cyan: '#7FD8FF',
};

export const W = 1080;
export const H = 1920;
export const FPS = 30;

/** 0→1 진행값. start 프레임부터 dur 프레임 동안 */
export const prog = (f: number, start: number, dur: number) =>
  interpolate(f, [start, start + dur], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.out(Easing.cubic),
  });
