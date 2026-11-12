import React from 'react';
import {AbsoluteFill, useCurrentFrame, random, interpolate, Easing} from 'remotion';
import {FONT} from '../theme';

export type Era = 'now' | 'crt' | 'sepia';

export const ERA_LABEL: Record<Era, [string, string]> = {
  now: ['CHAPTER 1', '지금 당신 카메라'],
  crt: ['CHAPTER 2', '1953년, 컬러TV'],
  sepia: ['CHAPTER 3', '24는 어디서 왔나'],
};

export const INK: Record<Era, {main: string; sub: string; accent: string; serif?: boolean}> = {
  now: {main: '#FFFFFF', sub: 'rgba(255,255,255,0.65)', accent: '#A99BFF'},
  crt: {main: '#D6FFF6', sub: 'rgba(143,233,220,0.75)', accent: '#8FE9DC'},
  sepia: {main: '#3B2614', sub: '#5C4128', accent: '#7A4A1C', serif: true},
};

export const MONO = "'IBM Plex Mono', monospace";
// 명조체는 쓰지 않는다. 1927 세피아는 포스터·간판 글꼴(A안)
export const SERIF = "'Bebas Neue', 'Black Han Sans', sans-serif";
export const SEPIA_KR = "'Black Han Sans', sans-serif";
export const CRT_NUM = "'VT323', monospace";
export const CRT_KR = "'Do Hyeon', sans-serif";
export const NOW_KR = "'Pretendard', sans-serif";
export const NOW_NUM = "'Space Grotesk', 'Pretendard', sans-serif";

const NowBg: React.FC<{off: number}> = ({off}) => {
  const f = useCurrentFrame() + off;
  return (
    <AbsoluteFill style={{background: '#000'}}>
      <div
        style={{
          position: 'absolute',
          width: 1300,
          height: 1000,
          left: 310 + Math.sin(f / 60) * 80,
          top: 60 + Math.cos(f / 70) * 40,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(90,110,255,0.42), rgba(170,70,255,0.16) 45%, transparent 70%)',
          filter: 'blur(60px)',
        }}
      />
    </AbsoluteFill>
  );
};

const CrtBg: React.FC<{off: number}> = ({off}) => {
  const f = useCurrentFrame() + off;
  return (
    <AbsoluteFill style={{background: 'radial-gradient(ellipse at 50% 45%, #15464f, #06131a 72%)'}}>
      <AbsoluteFill style={{background: 'repeating-linear-gradient(0deg, rgba(0,0,0,0.22) 0 2px, transparent 2px 5px)'}} />
      {/* 화면을 천천히 타고 내려가는 밝은 띠 */}
      <div style={{position: 'absolute', left: 0, right: 0, height: 160, top: ((f * 7) % 1300) - 160, background: 'linear-gradient(180deg, transparent, rgba(160,255,240,0.05), transparent)'}} />
    </AbsoluteFill>
  );
};

/** 필름 구멍 간격. 움직임을 이 간격으로 되풀이해야 구멍이 튀지 않고 이어져 보인다 */
const PITCH = 135;
const SepiaBg: React.FC<{off: number}> = ({off}) => {
  // 컷마다 프레임이 0부터 시작하므로, 영상 전체 프레임(off 더함)으로 움직여야 컷이 바뀌어도 이어진다
  const f = useCurrentFrame() + off;
  const flick = 0.92 + random(`fl${Math.floor(f / 2)}`) * 0.08;
  const sx = 300 + random(`sx${Math.floor(f / 6)}`) * 1300;
  return (
    <AbsoluteFill style={{background: '#2a1d12'}}>
      <AbsoluteFill style={{background: 'radial-gradient(ellipse at 50% 45%, #dcc79f 0%, #b39566 55%, #5c4128 100%)', opacity: flick}} />
      <AbsoluteFill
        style={{
          opacity: 0.2,
          mixBlendMode: 'multiply',
          backgroundImage: `repeating-radial-gradient(circle at ${13 + (f % 7)}% ${27 + (f % 5)}%, #000 0 1px, transparent 1px 3px)`,
        }}
      />
      <div style={{position: 'absolute', top: 0, bottom: 0, left: sx, width: 2, background: 'rgba(40,25,10,0.35)'}} />
      <AbsoluteFill style={{boxShadow: 'inset 0 0 260px rgba(30,15,5,0.85)'}} />
    </AbsoluteFill>
  );
};

/** 세피아 시대 좌우 필름 구멍. 그림 위에 따로 얹어서, 배경을 덮는 컷에서도 끊기지 않는다 */
export const SepiaStrips: React.FC<{opacity: number}> = ({opacity}) => {
  const f = useCurrentFrame();
  if (opacity <= 0) return null;
  return (
    <AbsoluteFill style={{opacity, zIndex: 15, pointerEvents: 'none'}}>
      {[0, 1].map((s) => (
        <div key={s} style={{position: 'absolute', top: 0, bottom: 0, [s ? 'right' : 'left']: 0, width: 70, background: '#1b120a', overflow: 'hidden'}}>
          {Array.from({length: 10}).map((_, i) => (
            <div key={i} style={{position: 'absolute', left: 20, top: (i - 1) * PITCH + 45 + ((f * 6) % PITCH), width: 30, height: 44, borderRadius: 6, background: '#c9b07f'}} />
          ))}
        </div>
      ))}
    </AbsoluteFill>
  );
};

export const EraBg: React.FC<{era: Era; off?: number}> = ({era, off = 0}) => (era === 'now' ? <NowBg off={off} /> : era === 'crt' ? <CrtBg off={off} /> : <SepiaBg off={off} />);

export const CH_LABEL: Record<number, string> = {1: '지금 당신 카메라', 2: '1953년, 컬러TV', 3: '24는 어디서 왔나', 4: '그래서 무엇을 고를까'};
/** v3: 장 이름 대신 연도만 둔다 (언어와 상관없이 읽힌다) */
export const V3_YEAR: Record<number, string> = {0: '2026', 1: '1926', 2: '1926', 3: '1953', 4: '1953', 5: '2026'};
export const ChapterLabel: React.FC<{era: Era; ch?: number; v3?: boolean}> = ({era, ch, v3}) => {
  if (v3) {
    const c = INK[era];
    return <div style={{position: 'absolute', left: era === 'sepia' ? 110 : 80, top: 56, fontFamily: era === 'crt' ? CRT_NUM : era === 'sepia' ? "'Bebas Neue'" : NOW_NUM, fontWeight: 700, fontSize: era === 'crt' ? 44 : 38, letterSpacing: 3, color: c.main, opacity: 0.6, zIndex: 20}}>{V3_YEAR[ch ?? 0]}</div>;
  }
  const [a0, b0] = ERA_LABEL[era];
  const a = ch ? `CHAPTER ${ch}` : a0;
  const b = ch ? CH_LABEL[ch] ?? b0 : b0;
  const c = INK[era];
  return (
    <div style={{position: 'absolute', left: era === 'sepia' ? 110 : 80, top: 60, fontFamily: "'Pretendard', sans-serif", fontWeight: 600, fontSize: 28, letterSpacing: 2, color: c.main, zIndex: 20}}>
      <span style={{opacity: 0.55, marginRight: 16}}>{a}</span>
      {b}
    </div>
  );
};

export const Subtitle: React.FC<{text: string}> = ({text}) => !text ? null : (
  <div style={{position: 'absolute', left: 0, right: 0, bottom: 64, textAlign: 'center', zIndex: 20}}>
    <span
      style={{
        display: 'inline-block',
        padding: '12px 34px',
        borderRadius: 12,
        background: 'rgba(0,0,0,0.62)',
        color: '#fff',
        fontFamily: "'Pretendard', sans-serif",
        fontWeight: 700,
        fontSize: 46,
        letterSpacing: -1,
      }}
    >
      {text}
    </span>
  </div>
);

/** 고유명사 이름표. 영어는 그대로, 한국어는 필요할 때만 영어 아래에 작게 */
export const NameTag: React.FC<{tag: {en: string; sub?: string | null; ko?: string | null}; era: Era; local: number; len: number}> = ({tag, era, local, len}) => {
  const c = INK[era];
  const op = interpolate(local, [0, 8, len - 10, len], [0, 1, 1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const x = interpolate(local, [0, 12], [-16, 0], {extrapolateRight: 'clamp', easing: Easing.out(Easing.cubic)});
  const font = era === 'sepia' ? "'Bebas Neue', sans-serif" : era === 'crt' ? CRT_NUM : NOW_NUM;
  const big = era === 'crt' ? 80 : era === 'sepia' ? 72 : 60;
  const bg = era === 'sepia' ? 'rgba(239,226,196,0.82)' : 'rgba(0,0,0,0.45)';
  return (
    <div style={{position: 'absolute', left: era === 'sepia' ? 120 : 90, bottom: 170, opacity: op, transform: `translateX(${x}px)`, zIndex: 18, padding: '10px 22px 12px', background: bg, borderLeft: `6px solid ${c.accent}`}}>
      <div style={{fontFamily: font, fontWeight: 700, fontSize: big, lineHeight: 1, color: c.main, letterSpacing: era === 'sepia' ? 2 : 0}}>
        {tag.en}
        {tag.sub ? <span style={{fontSize: big * 0.55, opacity: 0.7, marginLeft: 16}}>{tag.sub}</span> : null}
      </div>
      {tag.ko ? <div style={{fontFamily: NOW_KR, fontWeight: 600, fontSize: 36, color: c.sub, marginTop: 8}}>{tag.ko}</div> : null}
    </div>
  );
};
