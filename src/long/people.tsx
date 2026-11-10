import React from 'react';
import {useCurrentFrame} from 'remotion';

/** 1950년대 사람 실루엣. 뒷모습/옆모습 단순화 일러스트. 머리 모양으로 인물을 구분한다 */
type Kind = 'dad' | 'mom' | 'kid' | 'engineer';
export const Person: React.FC<{kind: Kind; h: number; color?: string; rim?: string; style?: React.CSSProperties; nod?: number}> = ({kind, h, color = '#0b1b1f', rim = 'rgba(143,233,220,0.6)', style, nod = 0}) => {
  const f = useCurrentFrame();
  const w = h * 0.62;
  const head = h * 0.25;
  const bob = Math.sin((f + nod * 13) / 18) * h * 0.006;
  const glow = `0 0 ${h * 0.04}px ${rim}`;
  return (
    <div style={{position: 'relative', width: w, height: h, ...style}}>
      {/* 몸 */}
      <div style={{position: 'absolute', left: w * 0.06, right: w * 0.06, bottom: 0, height: h * 0.62, borderRadius: `${w * 0.45}px ${w * 0.45}px ${w * 0.08}px ${w * 0.08}px`, background: color, boxShadow: glow}} />
      {/* 머리 */}
      <div style={{position: 'absolute', left: (w - head) / 2, top: h * 0.08 + bob, width: head, height: head * 1.1, borderRadius: '50%', background: color, boxShadow: glow}} />
      {kind === 'dad' && <div style={{position: 'absolute', left: (w - head * 1.7) / 2, top: h * 0.1 + bob, width: head * 1.7, height: head * 0.18, borderRadius: head, background: color}} />}
      {kind === 'dad' && <div style={{position: 'absolute', left: (w - head * 0.95) / 2, top: h * 0.0 + bob, width: head * 0.95, height: head * 0.42, borderRadius: `${head * 0.3}px ${head * 0.3}px 0 0`, background: color}} />}
      {kind === 'mom' && <div style={{position: 'absolute', left: (w - head * 1.5) / 2, top: h * 0.05 + bob, width: head * 1.5, height: head * 0.95, borderRadius: '50% 50% 45% 45%', background: color, boxShadow: glow}} />}
      {kind === 'engineer' && <div style={{position: 'absolute', left: w * 0.5 - head * 0.75, top: h * 0.25 + bob, width: head * 1.5, height: head * 0.09, background: rim, opacity: 0.7}} />}
    </div>
  );
};

/** 1953년 거실: 뒤에서 본 가족이 흑백 TV를 보고 있다. depth(0~1)마다 다른 레이어를 돌려준다 */
export const LivingRoomLayers = {
  wall: (w: number, h: number) => (
    <div style={{width: w, height: h, background: 'linear-gradient(180deg,#123138,#0b2328)'}}>
      <div style={{position: 'absolute', left: w * 0.07, top: h * 0.14, width: w * 0.16, height: h * 0.34, border: '10px solid #0a1d21', background: 'linear-gradient(180deg,#1f4d55,#123138)'}} />
      <div style={{position: 'absolute', right: w * 0.08, top: h * 0.12, width: w * 0.1, height: h * 0.16, borderRadius: 8, border: '8px solid #0a1d21'}} />
      <div style={{position: 'absolute', left: 0, right: 0, bottom: 0, height: h * 0.22, background: '#08191c'}} />
    </div>
  ),
};

export const RetroTv: React.FC<{w: number; on?: number}> = ({w, on = 1}) => {
  const f = useCurrentFrame();
  const flick = 0.85 + Math.sin(f / 3) * 0.05 + Math.sin(f / 7) * 0.05;
  return (
    <div style={{position: 'relative', width: w, height: w * 1.05}}>
      <div style={{position: 'absolute', left: 0, right: 0, top: 0, height: w * 0.8, borderRadius: w * 0.07, background: '#2a2015', boxShadow: '0 20px 60px rgba(0,0,0,.6)'}}>
        <div style={{position: 'absolute', left: w * 0.08, top: w * 0.08, width: w * 0.62, height: w * 0.62, borderRadius: `${w * 0.1}px/${w * 0.08}px`, background: `radial-gradient(ellipse, rgba(220,250,245,${flick * on}), rgba(60,120,125,${on}) 70%, #0b1b1f)`, boxShadow: `0 0 ${w * 0.25 * on}px rgba(170,240,230,${0.55 * on})`}} />
        <div style={{position: 'absolute', right: w * 0.07, top: w * 0.14, width: w * 0.12, height: w * 0.12, borderRadius: '50%', background: '#140f09'}} />
        <div style={{position: 'absolute', right: w * 0.07, top: w * 0.34, width: w * 0.12, height: w * 0.12, borderRadius: '50%', background: '#140f09'}} />
      </div>
      <div style={{position: 'absolute', left: w * 0.15, bottom: 0, width: w * 0.05, height: w * 0.27, background: '#1a130c', transform: 'rotate(8deg)'}} />
      <div style={{position: 'absolute', right: w * 0.15, bottom: 0, width: w * 0.05, height: w * 0.27, background: '#1a130c', transform: 'rotate(-8deg)'}} />
    </div>
  );
};

export const Sofa: React.FC<{w: number}> = ({w}) => (
  <div style={{position: 'relative', width: w, height: w * 0.28}}>
    <div style={{position: 'absolute', left: 0, right: 0, bottom: 0, height: w * 0.2, borderRadius: w * 0.04, background: '#06110f'}} />
    <div style={{position: 'absolute', left: -w * 0.03, bottom: 0, width: w * 0.08, height: w * 0.26, borderRadius: w * 0.03, background: '#06110f'}} />
    <div style={{position: 'absolute', right: -w * 0.03, bottom: 0, width: w * 0.08, height: w * 0.26, borderRadius: w * 0.03, background: '#06110f'}} />
  </div>
);
