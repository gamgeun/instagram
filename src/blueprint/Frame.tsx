import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {C, FONT_KR, FONT_MONO, W, H, prog} from '../theme';

/** 배경 격자. 20px 보조선 + 100px 주선 */
export const Grid: React.FC = () => (
  <AbsoluteFill style={{background: `radial-gradient(ellipse at 50% 40%, ${C.bg} 0%, ${C.bgDeep} 100%)`}}>
    <svg width={W} height={H} style={{position: 'absolute'}}>
      <defs>
        <pattern id="minor" width="20" height="20" patternUnits="userSpaceOnUse">
          <path d="M20 0H0V20" fill="none" stroke={C.grid} strokeWidth="1" />
        </pattern>
        <pattern id="major" width="100" height="100" patternUnits="userSpaceOnUse">
          <rect width="100" height="100" fill="url(#minor)" />
          <path d="M100 0H0V100" fill="none" stroke={C.gridMajor} strokeWidth="1.2" />
        </pattern>
      </defs>
      <rect width={W} height={H} fill="url(#major)" />
      {/* 바깥 테두리 이중선 */}
      <rect x="40" y="40" width={W - 80} height={H - 80} fill="none" stroke={C.lineDim} strokeWidth="2" />
      <rect x="52" y="52" width={W - 104} height={H - 104} fill="none" stroke={C.lineDim} strokeWidth="1" />
      {/* 모서리 맞춤 표시 */}
      {[
        [40, 40],
        [W - 40, 40],
        [40, H - 40],
        [W - 40, H - 40],
      ].map(([x, y], i) => (
        <g key={i} stroke={C.line} strokeWidth="2">
          <line x1={x - 18} y1={y} x2={x + 18} y2={y} />
          <line x1={x} y1={y - 18} x2={x} y2={y + 18} />
        </g>
      ))}
      {/* 왼쪽 눈금자 */}
      {Array.from({length: 18}).map((_, i) => (
        <g key={i}>
          <line x1="52" y1={200 + i * 80} x2={i % 2 ? 64 : 74} y2={200 + i * 80} stroke={C.lineDim} strokeWidth="1.5" />
        </g>
      ))}
    </svg>
  </AbsoluteFill>
);

/** 상단 머리띠: 시리즈명, 편 번호, 도면 번호 */
export const Header: React.FC<{series: string; id: string; sheet: string; label: string}> = ({series, id, sheet, label}) => {
  const f = useCurrentFrame();
  const p = prog(f, 0, 10);
  return (
    <div style={{position: 'absolute', top: 150, left: 90, right: 90, fontFamily: FONT_MONO, color: C.line, opacity: p}}>
      <div style={{display: 'flex', justifyContent: 'space-between', fontSize: 26, letterSpacing: 4}}>
        <span>{series} · {id}</span>
        <span style={{color: C.accent}}>SHEET {sheet}</span>
      </div>
      <div style={{height: 2, background: C.line, marginTop: 14, transform: `scaleX(${p})`, transformOrigin: 'left'}} />
      <div style={{fontSize: 22, letterSpacing: 6, color: C.lineDim, marginTop: 12}}>{label}</div>
    </div>
  );
};

export const Heading: React.FC<{text: string}> = ({text}) => {
  const f = useCurrentFrame();
  const p = prog(f, 4, 12);
  return (
    <div
      style={{
        position: 'absolute',
        top: 290,
        left: 90,
        right: 90,
        fontFamily: FONT_KR,
        fontWeight: 900,
        fontSize: 72,
        lineHeight: 1.18,
        color: C.line,
        letterSpacing: -2,
        opacity: p,
        transform: `translateY(${(1 - p) * 20}px)`,
        whiteSpace: 'pre-line',
      }}
    >
      {text}
    </div>
  );
};

/** 하단 표제란 */
export const TitleBlock: React.FC<{id: string; title: string; date: string; sheet: string}> = ({id, title, date, sheet}) => (
  <div
    style={{
      position: 'absolute',
      left: 90,
      right: 90,
      bottom: 110,
      height: 120,
      border: `2px solid ${C.lineDim}`,
      display: 'grid',
      gridTemplateColumns: '1.2fr 3fr 1.2fr',
      fontFamily: FONT_MONO,
      color: C.lineDim,
      fontSize: 20,
    }}
  >
    {[
      ['DWG NO.', id],
      ['TITLE', title],
      ['SHEET', sheet],
    ].map(([k, v], i) => (
      <div key={k} style={{borderLeft: i ? `1px solid ${C.lineDim}` : 'none', padding: '14px 18px'}}>
        <div style={{fontSize: 16, letterSpacing: 3}}>{k}</div>
        <div style={{color: C.line, fontSize: 22, marginTop: 10, fontFamily: i === 1 ? FONT_KR : FONT_MONO, whiteSpace: 'nowrap', overflow: 'hidden'}}>
          {v}
        </div>
      </div>
    ))}
    <div style={{position: 'absolute', right: 0, top: -30, fontSize: 16, letterSpacing: 3}}>{date}</div>
  </div>
);
