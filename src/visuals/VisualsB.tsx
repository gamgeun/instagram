import React from 'react';
import {useCurrentFrame} from 'remotion';
import {C, prog} from '../theme';
import {VisualBox, useDash, useFade, Mono, Kr, Balloon} from './kit';

/* 6. 용량 게이지 (상대 크기) */
export const Capacity: React.FC<{items: {label: string; value: number; note: string}[]; caption: string}> = ({items, caption}) => {
  const f = useCurrentFrame();
  const max = Math.max(...items.map((i) => i.value));
  return (
    <VisualBox>
      <Mono x={40} y={40} opacity={useFade(6)}>
        {caption}
      </Mono>
      {items.map((it, i) => {
        const y = 110 + i * 190;
        const p = prog(f, 14 + i * 10, 22);
        const w = (it.value / max) * 800;
        return (
          <g key={i}>
            <Kr x={40} y={y} size={36} weight={900} opacity={useFade(10 + i * 10)}>
              {it.label}
            </Kr>
            <rect x={40} y={y + 24} width={800} height={70} fill="none" stroke={C.lineDim} strokeWidth="1.5" strokeDasharray="6 6" />
            <rect x={40} y={y + 24} width={w * p} height={70} fill={i === 0 ? C.accent : 'rgba(127,216,255,0.6)'} />
            {Array.from({length: 9}).map((_, k) => (
              <line key={k} x1={40 + (k + 1) * 80} y1={y + 94} x2={40 + (k + 1) * 80} y2={y + 108} stroke={C.lineDim} />
            ))}
            <Mono x={w > 700 ? 40 + w * p - 14 : 40 + w * p + 14} y={y + 72} textAnchor={w > 700 ? 'end' : 'start'} color={w > 700 ? C.bgDeep : C.line} size={26} opacity={p}>
              {it.note}
            </Mono>
          </g>
        );
      })}
    </VisualBox>
  );
};

/* 7. 부품표 / 체크리스트 */
export const PartsTable: React.FC<{title: string; rows: [string, string][]}> = ({title, rows}) => {
  const rowH = 96;
  const tableH = 80 + rows.length * rowH;
  return (
    <VisualBox>
      <rect x={20} y={20} width={860} height={tableH} fill="rgba(10,35,66,0.55)" stroke={C.line} strokeWidth="2.5" style={useDash(2 * (860 + tableH), 4, 20)} />
      <Mono x={44} y={68} color={C.line} size={24} opacity={useFade(10)}>
        {title}
      </Mono>
      <line x1={20} y1={100} x2={880} y2={100} stroke={C.line} strokeWidth="2" style={useDash(860, 12, 12)} />
      <line x1={110} y1={100} x2={110} y2={tableH + 20} stroke={C.lineDim} style={useDash(tableH, 14, 14)} />
      <line x1={380} y1={100} x2={380} y2={tableH + 20} stroke={C.lineDim} style={useDash(tableH, 16, 14)} />
      {rows.map(([k, v], i) => {
        const y = 100 + i * rowH;
        const o = useFade(20 + i * 7, 8);
        return (
          <g key={i} opacity={o}>
            {i > 0 && <line x1={20} y1={y} x2={880} y2={y} stroke={C.lineDim} strokeWidth="1" />}
            <Mono x={65} y={y + 60} textAnchor="middle" color={C.accent} size={26}>
              {String(i + 1).padStart(2, '0')}
            </Mono>
            <Kr x={134} y={y + 60} size={30} color={C.lineDim} weight={400}>
              {k}
            </Kr>
            <Kr x={404} y={y + 60} size={34} weight={700}>
              {v}
            </Kr>
          </g>
        );
      })}
    </VisualBox>
  );
};

/* 8. 두 카메라 비교: 색이 서로 다르게 나오는 상태 */
export const TwoCam: React.FC<{a: {name: string; profile: string; tint: string}; b: {name: string; profile: string; tint: string}; result?: string}> = ({a, b, result}) => {
  const f = useCurrentFrame();
  const cam = (x: number, c: {name: string; profile: string; tint: string}, s: number) => (
    <g>
      <rect x={x} y={80} width={340} height={220} rx={12} fill="none" stroke={C.line} strokeWidth="3" style={useDash(1120, s, 20)} />
      <circle cx={x + 170} cy={190} r={70} fill="none" stroke={C.line} strokeWidth="3" style={useDash(440, s + 8, 16)} />
      <Kr x={x + 170} y={360} size={40} weight={900} textAnchor="middle" opacity={useFade(s + 14)}>
        {c.name}
      </Kr>
      <Mono x={x + 170} y={398} textAnchor="middle" opacity={useFade(s + 18)}>
        {c.profile}
      </Mono>
      {/* 같은 장면을 찍었을 때 나오는 색 샘플 */}
      <rect x={x + 40} y={440} width={260} height={150} fill={c.tint} opacity={prog(f, s + 24, 12)} />
      <rect x={x + 40} y={440} width={260} height={150} fill="none" stroke={C.line} strokeWidth="2" opacity={prog(f, s + 24, 12)} />
    </g>
  );
  return (
    <VisualBox>
      {cam(40, a, 4)}
      {cam(520, b, 12)}
      <g opacity={useFade(44)}>
        <Kr x={450} y={530} size={60} weight={900} textAnchor="middle" color={C.red}>
          ≠
        </Kr>
        {result && (
          <Kr x={450} y={690} size={34} textAnchor="middle" color={C.accent}>
            {result}
          </Kr>
        )}
      </g>
    </VisualBox>
  );
};

/* 9. 컬러차트: 위 = 카메라 A, 아래 = 카메라 B 촬영본 */
const PATCH = ['#735244', '#c29682', '#627a9d', '#576c43', '#8580b1', '#67bdaa', '#d67e2c', '#505ba6', '#c15a63', '#5e3c6c', '#9dbc40', '#e0a32e'];
const shift = (hex: string, dr: number, dg: number, db: number) => {
  const n = parseInt(hex.slice(1), 16);
  const c = (v: number) => Math.max(0, Math.min(255, v));
  return `rgb(${c((n >> 16) + dr)},${c(((n >> 8) & 255) + dg)},${c((n & 255) + db)})`;
};
export const ColorChart: React.FC<{aLabel: string; bLabel: string; matched?: boolean}> = ({aLabel, bLabel, matched}) => {
  const f = useCurrentFrame();
  const fix = matched ? prog(f, 50, 24) : 0;
  const row = (y: number, label: string, d: [number, number, number], s: number) => (
    <g>
      <Kr x={40} y={y - 20} size={30} opacity={useFade(s)}>
        {label}
      </Kr>
      {PATCH.map((p, i) => {
        const col = i % 6;
        const r = Math.floor(i / 6);
        const pp = prog(f, s + i * 1.5, 6);
        return (
          <rect
            key={i}
            x={40 + col * 140}
            y={y + r * 120}
            width={120}
            height={100}
            fill={shift(p, d[0] * (1 - fix), d[1] * (1 - fix), d[2] * (1 - fix))}
            opacity={pp}
            stroke={C.bgDeep}
            strokeWidth="3"
          />
        );
      })}
    </g>
  );
  return (
    <VisualBox>
      {row(60, aLabel, [0, 0, 0], 6)}
      {row(420, bLabel, [18, 6, -24], 20)}
      <line x1={20} y1={340} x2={880} y2={340} stroke={C.lineDim} strokeDasharray="10 8" opacity={useFade(16)} />
      {matched && (
        <Mono x={880} y={720} textAnchor="end" color={C.accent} size={24} opacity={fix}>
          MATCH {Math.round(fix * 100)}%
        </Mono>
      )}
    </VisualBox>
  );
};

/* 10. 노드 흐름 */
export const NodePipeline: React.FC<{nodes: {title: string; sub: string}[]}> = ({nodes}) => {
  const boxH = 120;
  const gap = (720 - nodes.length * boxH) / Math.max(1, nodes.length - 1);
  return (
    <VisualBox>
      {nodes.map((n, i) => {
        const y = 20 + i * (boxH + gap);
        const s = 6 + i * 12;
        return (
          <g key={i}>
            <rect x={150} y={y} width={600} height={boxH} fill="rgba(10,35,66,0.6)" stroke={i === nodes.length - 1 ? C.accent : C.line} strokeWidth="3" style={useDash(1440, s, 16)} />
            <Balloon x={100} y={y + boxH / 2} n={String(i + 1).padStart(2, '0')} start={s + 4} />
            <Kr x={180} y={y + 54} size={36} weight={900} opacity={useFade(s + 8)}>
              {n.title}
            </Kr>
            <Mono x={180} y={y + 94} opacity={useFade(s + 10)}>
              {n.sub}
            </Mono>
            {i < nodes.length - 1 && (
              <line x1={450} y1={y + boxH} x2={450} y2={y + boxH + gap} stroke={C.accent} strokeWidth="3" style={useDash(gap, s + 12, 8)} />
            )}
          </g>
        );
      })}
    </VisualBox>
  );
};

/* 11. 벡터스코프: 피부색 선 + 두 카메라 점 */
export const Vectorscope: React.FC<{aLabel: string; bLabel: string}> = ({aLabel, bLabel}) => {
  const f = useCurrentFrame();
  const cx = 450;
  const cy = 360;
  const R = 320;
  const skinAng = (-123 * Math.PI) / 180; // 화면 기준 피부색 선 방향 (왼쪽 위 11시)
  // 표준 벡터스코프 각도(반시계, 3시 방향 0°)를 화면 좌표로 뒤집은 값
  const targets = [
    ['R', -103],
    ['MG', -61],
    ['B', 13],
    ['CY', 77],
    ['G', 119],
    ['YL', -167],
  ] as const;
  const move = prog(f, 46, 26);
  const pt = (ang: number, r: number) => [cx + Math.cos(ang) * r, cy + Math.sin(ang) * r];
  const [ax, ay] = pt(skinAng, 150);
  const [bx0, by0] = pt(skinAng + 0.32, 165);
  const bx = bx0 + (ax + 26 - bx0) * move;
  const by = by0 + (ay + 10 - by0) * move;
  return (
    <VisualBox>
      <circle cx={cx} cy={cy} r={R} fill="rgba(10,35,66,0.5)" stroke={C.line} strokeWidth="3" style={useDash(2 * Math.PI * R, 4, 24)} />
      {[0.25, 0.5, 0.75].map((k) => (
        <circle key={k} cx={cx} cy={cy} r={R * k} fill="none" stroke={C.gridMajor} />
      ))}
      <line x1={cx - R} y1={cy} x2={cx + R} y2={cy} stroke={C.gridMajor} />
      <line x1={cx} y1={cy - R} x2={cx} y2={cy + R} stroke={C.gridMajor} />
      {targets.map(([t, a]) => {
        const [x, y] = pt((a * Math.PI) / 180, R * 0.75);
        return (
          <g key={t} opacity={useFade(20)}>
            <rect x={x - 16} y={y - 16} width={32} height={32} fill="none" stroke={C.lineDim} strokeWidth="1.5" />
            <Mono x={x} y={y - 26} textAnchor="middle" size={18}>
              {t}
            </Mono>
          </g>
        );
      })}
      {/* 피부색 선 */}
      <line x1={cx} y1={cy} x2={cx + Math.cos(skinAng) * R} y2={cy + Math.sin(skinAng) * R} stroke={C.accent} strokeWidth="3" style={useDash(R, 24, 14)} />
      <Kr x={cx + Math.cos(skinAng) * R - 10} y={cy + Math.sin(skinAng) * R - 18} size={26} color={C.accent} opacity={useFade(30)}>
        피부색 선
      </Kr>
      <g opacity={useFade(34)}>
        <circle cx={ax} cy={ay} r={18} fill={C.cyan} />
        <circle cx={bx} cy={by} r={18} fill={C.red} />
      </g>
      <g opacity={useFade(36)}>
        <circle cx={60} cy={740} r={12} fill={C.cyan} />
        <Kr x={84} y={750} size={28}>
          {aLabel}
        </Kr>
        <circle cx={500} cy={740} r={12} fill={C.red} />
        <Kr x={524} y={750} size={28}>
          {bLabel}
        </Kr>
      </g>
    </VisualBox>
  );
};
