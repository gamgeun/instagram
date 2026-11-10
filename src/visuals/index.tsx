import React from 'react';
import {useCurrentFrame, interpolate, random} from 'remotion';
import {Visual} from '../types';
import {C, prog} from '../theme';

/* 카드 안 도식 영역: 약 796 x 500 */

const Label: React.FC<{children: React.ReactNode; color?: string; size?: number}> = ({children, color = C.sub, size = 30}) => (
  <div style={{fontWeight: 700, fontSize: size, color, textAlign: 'center', marginTop: 18}}>{children}</div>
);

/** 촬영 장면 그림: 하늘, 해, 산, 사람. flat=1 이면 로그 원본처럼 뿌옇다 */
const ScenePane: React.FC<{w: number; h: number; flat: number; noise?: number}> = ({w, h, flat, noise = 0}) => {
  const f = useCurrentFrame();
  const contrast = 1.1 - 0.55 * flat;
  const sat = 1.15 - 0.75 * flat;
  const bright = 1 + 0.15 * flat;
  return (
    <div style={{position: 'relative', width: w, height: h, borderRadius: 24, overflow: 'hidden', border: `1px solid ${C.cardLine}`}}>
      <div style={{position: 'absolute', inset: 0, filter: `contrast(${contrast}) saturate(${sat}) brightness(${bright})`}}>
        <div style={{position: 'absolute', inset: 0, background: 'linear-gradient(180deg,#3f7fd6 0%,#f2a65a 70%,#f7d08a 100%)'}} />
        <div style={{position: 'absolute', width: h * 0.28, height: h * 0.28, borderRadius: '50%', background: '#fff3c4', left: w * 0.62, top: h * 0.3, boxShadow: '0 0 40px #ffe08a'}} />
        <div style={{position: 'absolute', inset: 0, background: '#2b3a2e', clipPath: 'polygon(0 72%,22% 52%,40% 66%,62% 48%,85% 64%,100% 56%,100% 100%,0 100%)'}} />
        <div style={{position: 'absolute', left: w * 0.2, bottom: 0, width: w * 0.18, height: h * 0.42, background: '#1a1a1a', borderRadius: `${w * 0.09}px ${w * 0.09}px 0 0`}} />
        <div style={{position: 'absolute', left: w * 0.235, bottom: h * 0.4, width: w * 0.11, height: w * 0.11, borderRadius: '50%', background: '#c98d6b'}} />
      </div>
      {noise > 0 && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            opacity: noise,
            mixBlendMode: 'screen',
            backgroundImage: Array.from({length: 6})
              .map((_, i) => {
                const x = Math.round(random(`n${f}-${i}`) * 100);
                const y = Math.round(random(`m${f}-${i}`) * 100);
                return `radial-gradient(circle at ${x}% ${y}%, rgba(255,255,255,.9) 0 1px, transparent 1.5px)`;
              })
              .join(','),
            backgroundSize: '7px 7px, 9px 9px, 11px 11px, 5px 5px, 13px 13px, 8px 8px',
          }}
        />
      )}
    </div>
  );
};

/* 1. 로그 원본과 평소 영상 비교 */
const FlatVsNormal: React.FC<{left: string; right: string}> = ({left, right}) => {
  const f = useCurrentFrame();
  return (
    <div style={{display: 'flex', justifyContent: 'space-between', marginTop: 30}}>
      {[
        [left, 1],
        [right, 0],
      ].map(([l, fl], i) => (
        <div key={i} style={{opacity: prog(f, 6 + i * 10, 12)}}>
          <ScenePane w={376} h={300} flat={fl as number} />
          <Label color={i === 0 ? C.dim : C.text}>{l}</Label>
        </div>
      ))}
    </div>
  );
};

/* 2. 밝기 기준 막대 */
const LevelBars: React.FC<{bars: {label: string; value: number; on?: boolean}[]}> = ({bars}) => {
  const f = useCurrentFrame();
  const H = 340;
  return (
    <div style={{position: 'relative', height: H + 90, marginTop: 10}}>
      <div style={{position: 'absolute', left: 0, right: 0, top: 0, height: H, borderLeft: `2px solid ${C.cardLine}`, borderBottom: `2px solid ${C.cardLine}`}} />
      {bars.map((b, i) => {
        const p = prog(f, 8 + i * 8, 16);
        const h = (b.value / 70) * H * p;
        const x = 70 + i * (680 / bars.length);
        return (
          <div key={i}>
            <div
              style={{
                position: 'absolute',
                left: x,
                bottom: 90,
                width: 130,
                height: h,
                borderRadius: '18px 18px 0 0',
                background: b.on ? 'linear-gradient(180deg,#9aa4ff,#7d5bff)' : 'rgba(255,255,255,0.18)',
              }}
            />
            <div style={{position: 'absolute', left: x - 30, width: 190, bottom: 90 + h + 10, textAlign: 'center', fontWeight: 900, fontSize: 40, opacity: p}}>
              {b.value}%
            </div>
            <div style={{position: 'absolute', left: x - 40, width: 210, bottom: 30, textAlign: 'center', fontWeight: 700, fontSize: 28, color: b.on ? C.text : C.dim, opacity: p}}>
              {b.label}
            </div>
          </div>
        );
      })}
    </div>
  );
};

/* 3. 메뉴 켜기 스위치 + 화면 변화 */
const ToggleMenu: React.FC<{label: string; at?: number}> = ({label, at = 30}) => {
  const f = useCurrentFrame();
  const on = prog(f, at, 8);
  return (
    <div>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '22px 30px',
          borderRadius: 24,
          background: 'rgba(255,255,255,0.08)',
          border: `1px solid ${C.cardLine}`,
        }}
      >
        <div style={{fontWeight: 700, fontSize: 36}}>{label}</div>
        <div style={{width: 120, height: 64, borderRadius: 32, background: on > 0.5 ? C.blue : 'rgba(255,255,255,0.2)', position: 'relative'}}>
          <div style={{position: 'absolute', top: 6, left: 6 + 56 * on, width: 52, height: 52, borderRadius: '50%', background: '#fff'}} />
        </div>
      </div>
      <div style={{display: 'flex', justifyContent: 'center', marginTop: 30}}>
        <ScenePane w={560} h={280} flat={1 - on} />
      </div>
      <Label color={on > 0.5 ? C.text : C.dim}>{on > 0.5 ? '화면만 평소처럼 보임' : '켜기 전: 뿌연 화면'}</Label>
    </div>
  );
};

/** 사람 상반신 + 얼굴 위 제브라 줄무늬. cover 0~1 은 줄무늬가 덮는 양 */
const FaceZebraFig: React.FC<{size: number; cover: number}> = ({size, cover}) => (
  <div style={{position: 'relative', width: size, height: size * 1.05, margin: '0 auto'}}>
    <div style={{position: 'absolute', left: size * 0.12, right: size * 0.12, bottom: 0, height: size * 0.38, borderRadius: `${size * 0.3}px ${size * 0.3}px 0 0`, background: '#3a3f55'}} />
    <div style={{position: 'absolute', left: size * 0.27, top: size * 0.04, width: size * 0.46, height: size * 0.56, borderRadius: '46%', background: '#c99377', overflow: 'hidden'}}>
      <div
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          top: 0,
          height: `${cover * 100}%`,
          background: 'repeating-linear-gradient(45deg, rgba(255,255,255,0.95) 0 6px, transparent 6px 14px)',
        }}
      />
    </div>
  </div>
);

/* 4. 제브라 기준값 */
const FaceZebra: React.FC<{level: number}> = ({level}) => {
  const f = useCurrentFrame();
  const cover = interpolate(f, [26, 50], [0, 0.4], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  return (
    <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-around', marginTop: 20}}>
      <FaceZebraFig size={340} cover={cover} />
      <div style={{textAlign: 'center', opacity: prog(f, 8, 12)}}>
        <div style={{fontSize: 30, fontWeight: 700, color: C.dim}}>제브라 기준값</div>
        <div style={{fontSize: 150, fontWeight: 900, lineHeight: 1.1, background: C.grad, WebkitBackgroundClip: 'text', color: 'transparent'}}>{level}</div>
        <div style={{fontSize: 30, fontWeight: 700, color: C.sub}}>얼굴에 줄무늬 살짝</div>
      </div>
    </div>
  );
};

/* 5. 세 가지 상태 비교 */
const ThreeStates: React.FC<{items: {label: string; cover: number; tone: 'dim' | 'good' | 'warn'}[]}> = ({items}) => {
  const f = useCurrentFrame();
  const col = {dim: C.dim, good: C.good, warn: C.warn};
  return (
    <div style={{display: 'flex', justifyContent: 'space-between', marginTop: 40}}>
      {items.map((it, i) => (
        <div key={i} style={{width: 240, opacity: prog(f, 6 + i * 10, 12)}}>
          <div style={{borderRadius: 28, padding: '24px 0 10px', background: it.tone === 'good' ? 'rgba(124,245,180,0.1)' : 'rgba(255,255,255,0.04)', border: `2px solid ${it.tone === 'good' ? C.good : 'transparent'}`}}>
            <FaceZebraFig size={200} cover={it.cover} />
          </div>
          <Label color={col[it.tone]} size={34}>
            {it.label}
          </Label>
        </div>
      ))}
    </div>
  );
};

/* 6. 노이즈 비교 */
const NoiseCompare: React.FC<{left: string; right: string}> = ({left, right}) => {
  const f = useCurrentFrame();
  return (
    <div style={{display: 'flex', justifyContent: 'space-between', marginTop: 30}}>
      <div style={{opacity: prog(f, 6, 12)}}>
        <ScenePane w={376} h={300} flat={0} noise={0.55} />
        <Label color={C.warn}>{left}</Label>
      </div>
      <div style={{opacity: prog(f, 16, 12)}}>
        <ScenePane w={376} h={300} flat={0} />
        <Label color={C.good}>{right}</Label>
      </div>
    </div>
  );
};

/* 7. 정리 체크리스트 */
const Checklist: React.FC<{rows: string[]}> = ({rows}) => {
  const f = useCurrentFrame();
  return (
    <div>
      {rows.map((r, i) => {
        const p = prog(f, 8 + i * 9, 10);
        return (
          <div key={i} style={{display: 'flex', alignItems: 'center', gap: 26, padding: '20px 0', borderBottom: i < rows.length - 1 ? `1px solid ${C.cardLine}` : 'none', opacity: 0.3 + 0.7 * p}}>
            <div
              style={{
                width: 56,
                height: 56,
                flex: '0 0 56px',
                borderRadius: '50%',
                background: p > 0.5 ? 'linear-gradient(180deg,#9aa4ff,#7d5bff)' : 'rgba(255,255,255,0.12)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 900,
                fontSize: 30,
              }}
            >
              {p > 0.5 ? '✓' : i + 1}
            </div>
            <div style={{fontWeight: 700, fontSize: 38, wordBreak: 'keep-all'}}>{r}</div>
          </div>
        );
      })}
    </div>
  );
};

const MAP: Record<string, React.FC<any>> = {
  flatVsNormal: FlatVsNormal,
  levelBars: LevelBars,
  toggleMenu: ToggleMenu,
  faceZebra: FaceZebra,
  threeStates: ThreeStates,
  noiseCompare: NoiseCompare,
  checklist: Checklist,
};

export const RenderVisual: React.FC<{v: Visual}> = ({v}) => {
  const Comp = MAP[v.type];
  if (!Comp) throw new Error(`알 수 없는 도식 종류: ${v.type}`);
  return <Comp {...(v.props ?? {})} />;
};
