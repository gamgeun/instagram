import React from 'react';
import {useCurrentFrame} from 'remotion';
import {C, FONT_MONO, FONT_KR, prog} from '../theme';

/** 도식 영역: x 90~990, y 520~1290 (900 x 770) */
export const VW = 900;
export const VH = 770;

export const VisualBox: React.FC<{children: React.ReactNode}> = ({children}) => (
  <svg width={VW} height={VH} viewBox={`0 0 ${VW} ${VH}`} style={{position: 'absolute', left: 90, top: 520, overflow: 'visible'}}>
    {children}
  </svg>
);

/** 길이 len 인 선이 start 프레임부터 dur 동안 그려진다 */
export const useDash = (len: number, start: number, dur = 18) => {
  const f = useCurrentFrame();
  const p = prog(f, start, dur);
  return {strokeDasharray: len, strokeDashoffset: len * (1 - p)};
};

export const useFade = (start: number, dur = 10) => {
  const f = useCurrentFrame();
  return prog(f, start, dur);
};

export const Mono: React.FC<React.SVGProps<SVGTextElement> & {size?: number; color?: string}> = ({size = 22, color = C.lineDim, children, ...rest}) => (
  <text fontFamily={FONT_MONO} fontSize={size} fill={color} letterSpacing={2} {...rest}>
    {children}
  </text>
);

export const Kr: React.FC<React.SVGProps<SVGTextElement> & {size?: number; color?: string; weight?: number}> = ({
  size = 30,
  color = C.line,
  weight = 700,
  children,
  ...rest
}) => (
  <text fontFamily={FONT_KR} fontSize={size} fill={color} fontWeight={weight} {...rest}>
    {children}
  </text>
);

/** 치수선: 양끝 화살표 + 가운데 라벨 */
export const Dim: React.FC<{x1: number; y1: number; x2: number; y2: number; label: string; start: number}> = ({x1, y1, x2, y2, label, start}) => {
  const len = Math.hypot(x2 - x1, y2 - y1);
  const dash = useDash(len, start, 14);
  const o = useFade(start + 8);
  const mx = (x1 + x2) / 2;
  const my = (y1 + y2) / 2;
  return (
    <g>
      <defs>
        <marker id="arr" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="10" markerHeight="10" orient="auto-start-reverse">
          <path d="M0 1L9 5L0 9" fill="none" stroke={C.accent} strokeWidth="1.6" />
        </marker>
      </defs>
      <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={C.accent} strokeWidth="2" markerStart="url(#arr)" markerEnd="url(#arr)" style={dash} />
      <Mono x={mx} y={my - 12} textAnchor="middle" color={C.accent} size={20} opacity={o}>
        {label}
      </Mono>
    </g>
  );
};

/** 부품 번호 풍선 */
export const Balloon: React.FC<{x: number; y: number; n: string | number; start: number}> = ({x, y, n, start}) => {
  const o = useFade(start, 8);
  return (
    <g opacity={o}>
      <circle cx={x} cy={y} r={22} fill={C.bg} stroke={C.accent} strokeWidth="2" />
      <Mono x={x} y={y + 7} textAnchor="middle" color={C.accent} size={20}>
        {n}
      </Mono>
    </g>
  );
};
