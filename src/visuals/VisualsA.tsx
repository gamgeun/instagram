import React from 'react';
import {useCurrentFrame} from 'remotion';
import {C, prog} from '../theme';
import {VisualBox, useDash, useFade, Mono, Kr, Dim, Balloon} from './kit';

/* 1. 카메라 정면 도면 */
export const CameraSheet: React.FC<{name: string; notes: string[]}> = ({name, notes}) => {
  const body = useDash(2 * (560 + 360), 6, 26);
  const lens = useDash(2 * Math.PI * 130, 18, 24);
  const lens2 = useDash(2 * Math.PI * 90, 26, 20);
  const o = useFade(34);
  return (
    <VisualBox>
      <rect x={170} y={170} width={560} height={360} rx={18} fill="none" stroke={C.line} strokeWidth="3" style={body} />
      <rect x={250} y={130} width={170} height={40} fill="none" stroke={C.line} strokeWidth="2.5" style={useDash(420, 14, 14)} />
      <circle cx={450} cy={350} r={130} fill="none" stroke={C.line} strokeWidth="3" style={lens} />
      <circle cx={450} cy={350} r={90} fill="none" stroke={C.lineDim} strokeWidth="2" style={lens2} />
      <circle cx={450} cy={350} r={40} fill="none" stroke={C.lineDim} strokeWidth="1.5" style={useDash(260, 32, 14)} />
      {/* 중심선 */}
      <line x1={450} y1={190} x2={450} y2={510} stroke={C.lineDim} strokeWidth="1" strokeDasharray="14 6 3 6" opacity={o} />
      <line x1={290} y1={350} x2={610} y2={350} stroke={C.lineDim} strokeWidth="1" strokeDasharray="14 6 3 6" opacity={o} />
      <Dim x1={170} y1={590} x2={730} y2={590} label="W" start={36} />
      <Dim x1={790} y1={170} x2={790} y2={530} label="H" start={40} />
      <Balloon x={250} y={100} n={1} start={44} />
      <Balloon x={620} y={240} n={2} start={48} />
      <Kr x={170} y={690} size={44} weight={900} opacity={o}>
        {name}
      </Kr>
      {notes.map((n, i) => (
        <Mono key={i} x={170} y={740 + i * 38} size={22} opacity={useFade(50 + i * 4)}>
          {n}
        </Mono>
      ))}
    </VisualBox>
  );
};

/* 2. 정보량 비교: 층 막대 */
export const DataStack: React.FC<{cols: {label: string; sub: string; rows: number}[]; max?: number}> = ({cols, max = 12}) => {
  const f = useCurrentFrame();
  const colW = 260;
  const gap = (900 - cols.length * colW) / (cols.length + 1);
  return (
    <VisualBox>
      <line x1={40} y1={620} x2={860} y2={620} stroke={C.line} strokeWidth="2.5" style={useDash(820, 4, 14)} />
      {cols.map((c, ci) => {
        const x = gap + ci * (colW + gap);
        return (
          <g key={ci}>
            {Array.from({length: max}).map((_, r) => {
              const on = r < c.rows;
              const p = prog(f, 12 + ci * 10 + r * 2, 6);
              return (
                <rect
                  key={r}
                  x={x}
                  y={620 - (r + 1) * 44}
                  width={colW}
                  height={36}
                  fill={on ? (ci === 0 ? 'rgba(255,210,63,0.85)' : 'rgba(127,216,255,0.6)') : 'none'}
                  stroke={on ? 'none' : C.lineDim}
                  strokeDasharray={on ? undefined : '6 6'}
                  strokeWidth="1.5"
                  opacity={p}
                />
              );
            })}
            <Kr x={x + colW / 2} y={680} size={40} weight={900} textAnchor="middle" opacity={useFade(20 + ci * 8)}>
              {c.label}
            </Kr>
            <Mono x={x + colW / 2} y={722} textAnchor="middle" opacity={useFade(26 + ci * 8)}>
              {c.sub}
            </Mono>
          </g>
        );
      })}
      <Mono x={40} y={40} opacity={useFade(8)}>
        DATA PER FRAME
      </Mono>
    </VisualBox>
  );
};

/* 3. 카메라 화면 + 메뉴 */
export const MonitorMenu: React.FC<{title: string; items: string[]; selected: number; note?: string}> = ({title, items, selected, note}) => {
  const f = useCurrentFrame();
  const sel = prog(f, 30, 10);
  return (
    <VisualBox>
      <rect x={60} y={40} width={780} height={520} rx={14} fill="rgba(10,35,66,0.7)" stroke={C.line} strokeWidth="3" style={useDash(2600, 4, 22)} />
      <rect x={90} y={70} width={720} height={460} fill="none" stroke={C.lineDim} strokeWidth="1.5" style={useDash(2360, 10, 18)} />
      <Mono x={120} y={120} color={C.line} size={24} opacity={useFade(16)}>
        {title}
      </Mono>
      <line x1={120} y1={140} x2={780} y2={140} stroke={C.lineDim} opacity={useFade(16)} />
      {items.map((it, i) => {
        const y = 200 + i * 78;
        const isSel = i === selected;
        return (
          <g key={i} opacity={useFade(18 + i * 3)}>
            {isSel && <rect x={110} y={y - 44} width={680 * sel} height={64} fill={C.accent} />}
            <Kr x={136} y={y} size={32} color={isSel && sel > 0.6 ? C.bgDeep : C.line}>
              {it}
            </Kr>
          </g>
        );
      })}
      {note && (
        <g opacity={useFade(40)}>
          <line x1={790} y1={200 + selected * 78 - 12} x2={860} y2={640} stroke={C.accent} strokeWidth="2" />
          <circle cx={860} cy={640} r={6} fill={C.accent} />
          <Kr x={860} y={700} size={34} textAnchor="end" color={C.accent}>
            {note}
          </Kr>
        </g>
      )}
    </VisualBox>
  );
};

/* 4. 밝기 곡선: 입력 빛 → 기록 값 */
export const LogCurve: React.FC<{logLabel: string; stdLabel: string}> = ({logLabel, stdLabel}) => {
  const ox = 100;
  const oy = 640;
  const w = 720;
  const h = 560;
  // 일반 영상: S자, 위에서 일찍 잘림
  const std = Array.from({length: 41}, (_, i) => {
    const x = i / 40;
    const y = Math.min(1, 1 / (1 + Math.exp(-11 * (x - 0.38))) * 1.08 - 0.02);
    return [ox + x * w, oy - Math.max(0, y) * h];
  });
  // 로그: 완만하게 끝까지 올라감
  const log = Array.from({length: 41}, (_, i) => {
    const x = i / 40;
    const y = 0.09 + 0.78 * (Math.log10(1 + 30 * x) / Math.log10(31));
    return [ox + x * w, oy - y * h];
  });
  const path = (pts: number[][]) => 'M' + pts.map((p) => p.join(' ')).join(' L');
  return (
    <VisualBox>
      <line x1={ox} y1={oy} x2={ox + w + 20} y2={oy} stroke={C.line} strokeWidth="2.5" style={useDash(740, 4, 12)} />
      <line x1={ox} y1={oy} x2={ox} y2={oy - h - 20} stroke={C.line} strokeWidth="2.5" style={useDash(580, 4, 12)} />
      {[0.25, 0.5, 0.75, 1].map((g) => (
        <line key={g} x1={ox} y1={oy - g * h} x2={ox + w} y2={oy - g * h} stroke={C.gridMajor} strokeDasharray="4 8" />
      ))}
      <path d={path(std)} fill="none" stroke={C.cyan} strokeWidth="4" style={useDash(1400, 14, 24)} />
      <path d={path(log)} fill="none" stroke={C.accent} strokeWidth="5" style={useDash(1200, 26, 26)} />
      <g opacity={useFade(34)}>
        <rect x={560} y={oy - h - 6} width={220} height={60} fill="none" stroke={C.red} strokeDasharray="6 6" strokeWidth="2" />
        <Kr x={670} y={oy - h + 34} size={24} color={C.red} textAnchor="middle">
          밝은 곳 잘림
        </Kr>
      </g>
      <Kr x={ox + 0.47 * w} y={oy - 0.22 * h} size={30} color={C.cyan} opacity={useFade(30)}>
        {stdLabel}
      </Kr>
      <Kr x={ox + w - 10} y={oy - 0.78 * h} size={34} color={C.accent} textAnchor="end" opacity={useFade(46)}>
        {logLabel}
      </Kr>
      <Mono x={ox + w} y={oy + 44} textAnchor="end" opacity={useFade(10)}>
        들어온 빛 →
      </Mono>
      <Mono x={ox - 10} y={oy - h - 34} opacity={useFade(10)}>
        ↑ 기록되는 밝기
      </Mono>
    </VisualBox>
  );
};

/* 5. 듀얼 기본 감도 */
export const DualIso: React.FC<{bases: number[]; scale: number[]}> = ({bases, scale}) => {
  const f = useCurrentFrame();
  const x0 = 60;
  const x1 = 840;
  const pos = (v: number) => x0 + ((Math.log2(v) - Math.log2(scale[0])) / (Math.log2(scale[scale.length - 1]) - Math.log2(scale[0]))) * (x1 - x0);
  // 노이즈 양: 기본 감도 바로 위에서 낮아지는 톱니 모양
  const noise = (v: number) => {
    const b = [...bases].reverse().find((bb) => v >= bb) ?? bases[0];
    return 0.15 + 0.12 * Math.log2(v / b) + (v < bases[0] ? 0.05 : 0);
  };
  return (
    <VisualBox>
      <line x1={x0} y1={560} x2={x1} y2={560} stroke={C.line} strokeWidth="2.5" style={useDash(800, 4, 14)} />
      {scale.map((v, i) => {
        const x = pos(v);
        const hgt = noise(v) * 520;
        const p = prog(f, 14 + i * 2, 8);
        const isBase = bases.includes(v);
        return (
          <g key={v}>
            <rect x={x - 22} y={560 - hgt * p} width={44} height={hgt * p} fill={isBase ? C.accent : 'rgba(127,216,255,0.45)'} />
            <Mono x={x} y={600} textAnchor="middle" size={18} color={isBase ? C.accent : C.lineDim} opacity={p}>
              {v}
            </Mono>
          </g>
        );
      })}
      {bases.map((b, i) => (
        <g key={b} opacity={useFade(34 + i * 8)}>
          <Balloon x={pos(b)} y={560 - noise(b) * 520 - 50} n={i + 1} start={34 + i * 8} />
          <Kr x={pos(b)} y={680} textAnchor="middle" size={34} color={C.accent}>
            기본 {b}
          </Kr>
        </g>
      ))}
      <Mono x={x0} y={60} opacity={useFade(6)}>
        NOISE ↑ / ISO →
      </Mono>
    </VisualBox>
  );
};
