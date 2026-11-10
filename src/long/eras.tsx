import React from 'react';
import {AbsoluteFill, useCurrentFrame, random} from 'remotion';
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
export const SERIF = "'Noto Serif KR', serif";

const NowBg: React.FC = () => {
  const f = useCurrentFrame();
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

const CrtBg: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{background: 'radial-gradient(ellipse at 50% 45%, #15464f, #06131a 72%)'}}>
      <AbsoluteFill style={{background: 'repeating-linear-gradient(0deg, rgba(0,0,0,0.22) 0 2px, transparent 2px 5px)'}} />
      {/* 화면을 천천히 타고 내려가는 밝은 띠 */}
      <div style={{position: 'absolute', left: 0, right: 0, height: 160, top: ((f * 7) % 1300) - 160, background: 'linear-gradient(180deg, transparent, rgba(160,255,240,0.05), transparent)'}} />
    </AbsoluteFill>
  );
};

const SepiaBg: React.FC = () => {
  const f = useCurrentFrame();
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
      {[0, 1].map((s) => (
        <div key={s} style={{position: 'absolute', top: 0, bottom: 0, [s ? 'right' : 'left']: 0, width: 70, background: '#1b120a', display: 'flex', flexDirection: 'column', justifyContent: 'space-around', alignItems: 'center', transform: `translateY(${(f * 6) % 180 - 90}px)`}}>
          {Array.from({length: 8}).map((_, i) => (
            <div key={i} style={{width: 30, height: 44, borderRadius: 6, background: '#c9b07f'}} />
          ))}
        </div>
      ))}
      <AbsoluteFill style={{boxShadow: 'inset 0 0 260px rgba(30,15,5,0.85)'}} />
    </AbsoluteFill>
  );
};

export const EraBg: React.FC<{era: Era}> = ({era}) => (era === 'now' ? <NowBg /> : era === 'crt' ? <CrtBg /> : <SepiaBg />);

export const ChapterLabel: React.FC<{era: Era}> = ({era}) => {
  const [a, b] = ERA_LABEL[era];
  const c = INK[era];
  return (
    <div style={{position: 'absolute', left: era === 'sepia' ? 110 : 80, top: 60, fontFamily: FONT, fontWeight: 700, fontSize: 28, letterSpacing: 2, color: c.main, zIndex: 20}}>
      <span style={{opacity: 0.55, marginRight: 16}}>{a}</span>
      {b}
    </div>
  );
};

export const Subtitle: React.FC<{text: string}> = ({text}) => (
  <div style={{position: 'absolute', left: 0, right: 0, bottom: 64, textAlign: 'center', zIndex: 20}}>
    <span
      style={{
        display: 'inline-block',
        padding: '12px 34px',
        borderRadius: 12,
        background: 'rgba(0,0,0,0.62)',
        color: '#fff',
        fontFamily: FONT,
        fontWeight: 700,
        fontSize: 46,
        letterSpacing: -1,
      }}
    >
      {text}
    </span>
  </div>
);
