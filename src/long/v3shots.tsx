/* 1편 v3(연대기 이야기형) 그림. 화면 글자는 결정 장면의 숫자 세 개와 인터뷰 기록 한 장면에만 쓴다. */
import React from 'react';
import {AbsoluteFill, useCurrentFrame, interpolate, Easing, random} from 'remotion';
import {Person, RetroTv} from './people';
import {Room3D} from './samples';
import {SHOTS as S1} from './shots';
import {SHOTS2 as S2} from './shots2';
import {CRT_NUM, NOW_NUM} from './eras';

type P = {dur: number; opt: any; marks?: number[]; lineMarks?: number[]};
const INK = '#3b2614';
const PAPER = '#e6d3ad';
const center: React.CSSProperties = {display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column'};
const ease = (f: number, a: number, b: number) => interpolate(f, [a, b], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.inOut(Easing.cubic)});
const at = (m: number[] | undefined, k: number, fb: number) => (m && m[k] !== undefined ? m[k] : fb);
const Reel: React.FC<{size: number; speed: number; color?: string}> = ({size, speed, color = INK}) => {
  const f = useCurrentFrame();
  return (
    <div style={{width: size, height: size, borderRadius: '50%', border: `${size * 0.09}px solid ${color}`, transform: `rotate(${f * speed}deg)`, position: 'relative'}}>
      {[0, 60, 120].map((r) => (
        <div key={r} style={{position: 'absolute', left: '50%', top: 0, bottom: 0, width: size * 0.06, marginLeft: -size * 0.03, background: color, transform: `rotate(${r}deg)`}} />
      ))}
    </div>
  );
};
const Projector: React.FC<{w: number; speed: number; color?: string}> = ({w, speed, color = INK}) => (
  <div style={{position: 'relative', width: w, height: w * 0.95}}>
    <div style={{position: 'absolute', left: w * 0.05, top: 0}}><Reel size={w * 0.42} speed={speed} color={color} /></div>
    <div style={{position: 'absolute', left: w * 0.52, top: 0}}><Reel size={w * 0.42} speed={speed} color={color} /></div>
    <div style={{position: 'absolute', left: w * 0.1, top: w * 0.4, width: w * 0.8, height: w * 0.32, background: color, borderRadius: w * 0.04}} />
    <div style={{position: 'absolute', left: w * 0.9, top: w * 0.47, width: w * 0.14, height: w * 0.16, background: color, borderRadius: `0 ${w * 0.03}px ${w * 0.03}px 0`}} />
    <div style={{position: 'absolute', left: w * 0.3, top: w * 0.72, width: w * 0.08, height: w * 0.23, background: color}} />
    <div style={{position: 'absolute', left: w * 0.62, top: w * 0.72, width: w * 0.08, height: w * 0.23, background: color}} />
  </div>
);
const Disc: React.FC<{size: number; speed: number}> = ({size, speed}) => {
  const f = useCurrentFrame();
  return (
    <div style={{width: size, height: size, borderRadius: '50%', background: `repeating-radial-gradient(circle, #241608 0 3px, #3b2614 3px 7px)`, transform: `rotate(${f * speed}deg)`, position: 'relative', boxShadow: '0 10px 30px rgba(30,15,5,.4)'}}>
      <div style={{position: 'absolute', inset: size * 0.37, borderRadius: '50%', background: '#c9b07f'}} />
      <div style={{position: 'absolute', left: size * 0.48, top: size * 0.06, width: size * 0.04, height: size * 0.12, background: '#c9b07f', opacity: 0.6}} />
    </div>
  );
};

/* ---------- 0. 여는 장면 ---------- */
const MenuOpen: React.FC<P> = (p) => <S1.menuScroll {...p} opt={{stop: true}} />;

/** 필름 칸이 거꾸로 쏟아져 지나가며 화면이 세피아로 물든다 (지금 → 1926) */
const YearRewind: React.FC<P> = ({dur}) => {
  const f = useCurrentFrame();
  const t = ease(f, 0, dur);
  const r = Math.round(0 + (179 - 0) * t), g = Math.round(0 + (149 - 0) * t), b = Math.round(0 + (102 - 0) * t);
  return (
    <AbsoluteFill style={{background: `rgb(${r},${g},${b})`, perspective: 900, overflow: 'hidden'}}>
      <div style={{position: 'absolute', inset: 0, transformStyle: 'preserve-3d'}}>
        {Array.from({length: 18}).map((_, i) => {
          const z = ((i * 260 + f * 55) % 4680) - 4200;
          const x = (random(`rx${i}`) - 0.5) * 1400;
          const y = (random(`ry${i}`) - 0.5) * 700;
          const op = interpolate(z, [-4200, -2500, 200, 500], [0, 0.9, 0.9, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
          return (
            <div key={i} style={{position: 'absolute', left: 960 + x - 160, top: 540 + y - 110, width: 320, height: 220, transform: `translateZ(${z}px) rotate(${(random(`rr${i}`) - 0.5) * 20}deg)`, opacity: op, background: '#111', border: '10px solid #111', boxShadow: `inset 0 0 0 6px rgba(${200 + 40 * t},${190 + 20 * t},${170},.25)`}}>
              <div style={{position: 'absolute', inset: 12, background: `linear-gradient(180deg, rgba(${120 + 100 * t},${110 + 80 * t},${130 - 30 * t},.6), rgba(40,30,30,.6))`}} />
            </div>
          );
        })}
      </div>
      <AbsoluteFill style={{background: '#fff', opacity: interpolate(f, [dur - 10, dur - 4, dur], [0, 0.5, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'})}} />
    </AbsoluteFill>
  );
};

/* ---------- 1. 1926 뉴욕 ---------- */
const Bulbs: React.FC<{n: number; w: number; phase?: number}> = ({n, w, phase = 0}) => {
  const f = useCurrentFrame();
  return (
    <div style={{display: 'flex', justifyContent: 'space-between', width: w}}>
      {Array.from({length: n}).map((_, i) => {
        const on = (Math.floor(f / 4) + i + phase) % 3 !== 0;
        return <div key={i} style={{width: 14, height: 14, borderRadius: '50%', background: on ? '#fff2c4' : '#7a5a30', boxShadow: on ? '0 0 14px #ffe29a' : 'none'}} />;
      })}
    </div>
  );
};
const Facade: React.FC<{crowd: number; night?: boolean}> = ({crowd, night}) => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{background: night ? 'linear-gradient(180deg,#2a1c10,#5c4128)' : undefined}}>
      <div style={{position: 'absolute', left: 520, top: 120, width: 880, height: 800, background: INK}}>
        <div style={{position: 'absolute', left: 90, top: 40, width: 700, height: 170, border: '8px solid #6b4a26', background: '#4a311a', ...center}}>
          <Bulbs n={22} w={640} />
          <div style={{height: 70}} />
          <Bulbs n={22} w={640} phase={1} />
        </div>
        {Array.from({length: 3}).map((_, i) => (
          <div key={i} style={{position: 'absolute', left: 140 + i * 220, top: 300, width: 150, height: 200, background: night ? '#e9c98a' : '#7a5a30', opacity: night ? 0.85 : 0.6}} />
        ))}
        <div style={{position: 'absolute', left: 290, bottom: 0, width: 300, height: 230, background: night ? '#f3d9a0' : '#2a1a0c', boxShadow: night ? '0 0 80px #f3d9a0' : 'none'}} />
      </div>
      <div style={{position: 'absolute', left: 0, right: 0, bottom: 0, height: 170, background: '#2a1a0c'}} />
      {Array.from({length: crowd}).map((_, i) => (
        <div key={i} style={{position: 'absolute', bottom: 150, left: 180 + i * 95 + Math.sin((f + i * 9) / 20) * 6}}>
          <Person kind={i % 3 === 0 ? 'mom' : 'dad'} h={230 + (i % 2) * 30} color="#1b120a" rim="rgba(0,0,0,0)" nod={i} />
        </div>
      ))}
    </AbsoluteFill>
  );
};
const TheaterOutside: React.FC<P> = () => <Facade crowd={5} />;
const TheaterInside: React.FC<P> = ({dur}) => {
  const f = useCurrentFrame();
  const light = ease(f, 0, dur * 0.5);
  return (
    <AbsoluteFill style={{background: '#1b120a', overflow: 'hidden'}}>
      <div style={{position: 'absolute', left: 460, top: 120, width: 1000, height: 520, background: `rgba(240,225,190,${0.15 + 0.8 * light})`, boxShadow: `0 0 ${200 * light}px rgba(240,225,190,${0.5 * light})`}} />
      {/* 영사실에서 나오는 빛줄기 */}
      <div style={{position: 'absolute', left: 900, top: -40, width: 120, height: 700, background: `linear-gradient(180deg, rgba(255,240,200,${0.5 * light}), rgba(255,240,200,0))`, transform: 'perspective(800px) rotateX(-30deg) scaleX(6)', transformOrigin: 'top', opacity: 0.5 + random(`b${Math.floor(f / 3)}`) * 0.2}} />
      {Array.from({length: 3}).map((_, row) => (
        <div key={row} style={{position: 'absolute', bottom: -80 + row * 120, left: -40 - row * 30, display: 'flex', gap: 30 - row * 4}}>
          {Array.from({length: 13 + row}).map((_, i) => (
            <Person key={i} kind={(i + row) % 3 === 0 ? 'mom' : 'dad'} h={260 - row * 40} color="#0c0805" rim={`rgba(240,225,190,${0.3 * light})`} nod={i + row * 5} />
          ))}
        </div>
      ))}
    </AbsoluteFill>
  );
};
/** 비어 있는 오케스트라석, 소리는 뒤쪽 영사실 창에서 퍼져 나온다 */
const EmptyPit: React.FC<P> = ({dur, marks}) => {
  const f = useCurrentFrame();
  const m = at(marks, 0, dur * 0.45);
  const look = ease(f, m - 10, m + 10);
  return (
    <AbsoluteFill style={{overflow: 'hidden'}}>
      <div style={{position: 'absolute', left: 0, right: 0, top: 0, height: 420, background: 'linear-gradient(180deg,#d9c39a,#b39566)'}} />
      <div style={{position: 'absolute', left: 860, top: 70, width: 200, height: 100, background: '#fff2c4', boxShadow: '0 0 60px #ffe29a', opacity: 0.6 + 0.4 * look}} />
      {[0, 1, 2, 3].map((k) => {
        const r = ((f * 4 + k * 90) % 360);
        return <div key={k} style={{position: 'absolute', left: 960 - r, top: 120 - r * 0.4, width: r * 2, height: r * 0.8, borderRadius: '50%', border: `4px solid rgba(59,38,20,${0.5 * (1 - r / 360) * look})`}} />;
      })}
      <div style={{position: 'absolute', left: 0, right: 0, top: 420, bottom: 0, background: '#5c4128'}} />
      {Array.from({length: 2}).map((_, row) => (
        <div key={row} style={{position: 'absolute', top: 520 + row * 170, left: 160 + row * 60, display: 'flex', gap: 120}}>
          {Array.from({length: 8 - row}).map((_, i) => (
            <div key={i} style={{position: 'relative', width: 90, height: 140}}>
              <div style={{position: 'absolute', left: 30, top: 0, width: 8, height: 90, background: INK}} />
              <div style={{position: 'absolute', left: 0, top: 0, width: 70, height: 44, background: INK, transform: 'skewX(-10deg)'}} />
              <div style={{position: 'absolute', left: 10, top: 90, width: 70, height: 16, background: '#2a1a0c'}} />
              <div style={{position: 'absolute', left: 10, top: 106, width: 10, height: 40, background: '#2a1a0c'}} />
              <div style={{position: 'absolute', left: 70, top: 106, width: 10, height: 40, background: '#2a1a0c'}} />
            </div>
          ))}
        </div>
      ))}
    </AbsoluteFill>
  );
};
/** 영사실: 영사기와 레코드판이 한 축으로 이어져 함께 돈다 */
const Booth: React.FC<P> = ({lineMarks}) => {
  const f = useCurrentFrame();
  const glow = ease(f, at(lineMarks, 0, 9e9), at(lineMarks, 0, 9e9) + 12);
  return (
    <AbsoluteFill style={{...center, flexDirection: 'row', gap: 40}}>
      <div style={{position: 'absolute', left: 140, bottom: 120}}><Person kind="dad" h={520} color={INK} rim="rgba(0,0,0,0)" nod={2} /></div>
      <div style={{marginLeft: 260}}><Projector w={520} speed={12} /></div>
      <div style={{width: 160, height: 14, background: INK, marginTop: 220, position: 'relative', overflow: 'hidden'}}>
        <div style={{position: 'absolute', inset: 0, backgroundImage: 'repeating-linear-gradient(90deg,#6b4a26 0 10px,transparent 10px 30px)', transform: `translateX(${(f * 3) % 30}px)`}} />
      </div>
      <div style={{marginTop: 120, filter: `drop-shadow(0 0 ${40 * glow}px rgba(255,226,154,${glow}))`}}><Disc size={500} speed={5} /></div>
    </AbsoluteFill>
  );
};
/** 바늘이 튀어 소리가 어긋나고, 영사 기사가 손으로 바늘을 되돌린다 */
const Needle: React.FC<P> = ({dur, lineMarks}) => {
  const f = useCurrentFrame();
  const skip = Math.floor(dur * 0.3);
  const fix = at(lineMarks, 0, dur * 0.6);
  const jump = f >= skip && f < skip + 6 ? (random(`j${f}`) - 0.5) * 40 : 0;
  const off = interpolate(f, [skip, skip + 6, fix + 10, fix + 26], [0, 120, 120, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const hand = interpolate(f, [fix - 10, fix + 10, fix + 30], [0, 1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const mouth = (k: number) => 10 + Math.abs(Math.sin((f + k) / 4)) * 40;
  return (
    <AbsoluteFill>
      <div style={{position: 'absolute', left: 120, top: 160}}>
        <Disc size={620} speed={5} />
        <div style={{position: 'absolute', left: 420, top: -40, width: 26, height: 420, background: '#2a1a0c', transformOrigin: 'top', transform: `rotate(${28 + jump * 0.2}deg) translateX(${jump}px)`}}>
          <div style={{position: 'absolute', left: -14, bottom: -20, width: 54, height: 40, background: '#2a1a0c'}} />
        </div>
        <div style={{position: 'absolute', left: 520, top: 230 - hand * 30, opacity: hand}}>
          <div style={{width: 180, height: 60, borderRadius: 30, background: INK, transform: 'rotate(-20deg)'}} />
        </div>
      </div>
      {/* 스크린 속 배우의 입 (위) 과 레코드 소리 (아래) */}
      <div style={{position: 'absolute', left: 1000, top: 200, width: 760, height: 340, background: PAPER, border: `10px solid ${INK}`, ...center}}>
        <Person kind="dad" h={300} color={INK} rim="rgba(0,0,0,0)" />
        <div style={{position: 'absolute', left: 345, top: 150, width: 50, height: mouth(0) * 0.6, borderRadius: 20, background: PAPER}} />
      </div>
      <div style={{position: 'absolute', left: 1000, top: 600, width: 760, display: 'flex', gap: 14, alignItems: 'center', height: 140, overflow: 'hidden'}}>
        <div style={{display: 'flex', gap: 14, transform: `translateX(${off}px)`}}>
          {Array.from({length: 26}).map((_, i) => <div key={i} style={{width: 14, height: mouth(i * 4 - off / 6), background: INK, borderRadius: 7}} />)}
        </div>
      </div>
    </AbsoluteFill>
  );
};
/** 극장 세 곳, 영사기와 스크린 속 사람이 서로 다른 속도로 움직인다 */
const TheaterSpeeds: React.FC<P> = () => {
  const f = useCurrentFrame();
  const sp = [0.7, 1, 1.45];
  return (
    <AbsoluteFill style={{...center, flexDirection: 'row', gap: 60}}>
      {sp.map((s, i) => (
        <div key={i} style={{...center}}>
          <div style={{position: 'relative', width: 480, height: 300, background: PAPER, border: `10px solid ${INK}`, overflow: 'hidden'}}>
            <div style={{position: 'absolute', bottom: 0, left: ((f * 6 * s) % 620) - 120}}><Person kind="dad" h={220} color={INK} rim="rgba(0,0,0,0)" /></div>
          </div>
          <div style={{marginTop: 40}}><Projector w={260} speed={10 * s} /></div>
        </div>
      ))}
    </AbsoluteFill>
  );
};

/* ---------- 2. 영사실의 질문 ---------- */
const Company: React.FC<P> = ({dur}) => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill>
      <div style={{position: 'absolute', left: 0, right: 0, bottom: 0, height: 200, background: '#2a1a0c'}} />
      <div style={{position: 'absolute', left: 420, bottom: 200, width: 1080, height: 640, background: INK}}>
        {Array.from({length: 5}).map((_, r) =>
          Array.from({length: 9}).map((_, c) => {
            const on = f > ((r * 9 + c) / 45) * dur * 0.7;
            return <div key={`${r}${c}`} style={{position: 'absolute', left: 60 + c * 110, top: 60 + r * 110, width: 60, height: 70, background: on ? '#f3d9a0' : '#4a311a', boxShadow: on ? '0 0 20px #f3d9a0' : 'none'}} />;
          }),
        )}
      </div>
      <div style={{position: 'absolute', left: 1380, bottom: 840, width: 70, height: 180, background: INK}} />
      {[0, 1, 2].map((k) => {
        const y = ((f * 2 + k * 60) % 180);
        return <div key={k} style={{position: 'absolute', left: 1380 + y * 0.6, bottom: 1020 + y, width: 80 + y * 0.6, height: 50 + y * 0.3, borderRadius: '50%', background: 'rgba(92,65,40,.35)', opacity: 1 - y / 180}} />;
      })}
    </AbsoluteFill>
  );
};
const WatkinsAsk: React.FC<P> = () => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={center}>
      <div style={{position: 'relative', width: 1500, height: 760}}>
        <div style={{position: 'absolute', left: 160, bottom: 0}}><Person kind="engineer" h={620} color={INK} rim="rgba(0,0,0,0)" nod={1} /></div>
        <div style={{position: 'absolute', right: 170, bottom: 0, transform: 'scaleX(-1)'}}><Person kind="dad" h={580} color={INK} rim="rgba(0,0,0,0)" nod={4} /></div>
        <div style={{position: 'absolute', left: 560, bottom: 80}}><Projector w={380} speed={10} /></div>
        <div style={{position: 'absolute', left: 520, top: 60, width: 170, height: 150, borderRadius: '50%', background: '#f0dfb8', border: `6px solid ${INK}`, ...center, opacity: ease(f, 8, 16)}}>
          <div style={{fontFamily: "'Bebas Neue'", fontSize: 110, color: INK, lineHeight: 1}}>?</div>
        </div>
      </div>
    </AbsoluteFill>
  );
};
/** 필름 세 줄이 서로 다른 속도로 흐르다가, 왓킨스가 고르는 순간 같은 속도로 맞춰진다 */
const SpeedsAlign: React.FC<P> = ({lineMarks}) => {
  const f = useCurrentFrame();
  const m = at(lineMarks, 0, 9e9);
  const a = ease(f, m, m + 20);
  const sp = [6, 8.5, 12];
  return (
    <AbsoluteFill style={{...center, gap: 70}}>
      {sp.map((s, i) => {
        const v = s + (8.5 - s) * a;
        const x = -((f * v) % 130);
        return (
          <div key={i} style={{width: 1500, height: 150, overflow: 'hidden', background: '#1b120a', borderTop: '16px solid #1b120a', borderBottom: '16px solid #1b120a', position: 'relative', boxShadow: i === 1 && a > 0.5 ? '0 0 40px rgba(255,226,154,.8)' : 'none'}}>
            <div style={{display: 'flex', gap: 14, transform: `translateX(${x}px)`}}>
              {Array.from({length: 14}).map((_, k) => <div key={k} style={{flex: '0 0 116px', height: 118, background: '#d9c39a'}} />)}
            </div>
          </div>
        );
      })}
    </AbsoluteFill>
  );
};
/** 인터뷰 기록 문서: 기록된 실제 말만 글자로 보여 주는 장면 */
const InterviewDoc: React.FC<P> = ({dur, marks}) => {
  const f = useCurrentFrame();
  const m = at(marks, 0, dur * 0.4);
  const q = ease(f, m - 6, m + 8);
  return (
    <AbsoluteFill style={center}>
      <div style={{position: 'relative', width: 1100, height: 760, background: '#efe2c4', boxShadow: '0 30px 60px rgba(30,15,5,.4)', transform: `rotate(-2deg) scale(${1 + q * 0.04})`, padding: '80px 90px'}}>
        {Array.from({length: 11}).map((_, i) => (
          <div key={i} style={{height: 16, margin: '22px 0', width: `${70 + random(`w${i}`) * 28}%`, background: 'rgba(59,38,20,.25)'}} />
        ))}
        <div style={{position: 'absolute', left: 70, right: 70, top: 300, padding: '26px 30px', background: `rgba(255,226,154,${0.85 * q})`, opacity: 0.2 + 0.8 * q}}>
          <div style={{fontFamily: "'Courier New', monospace", fontWeight: 700, fontSize: 52, color: INK}}>"That had to be a good guess."</div>
          <div style={{fontFamily: "'Pretendard', sans-serif", fontWeight: 600, fontSize: 32, color: '#5c4128', marginTop: 14}}>“짐작일 수밖에 없었습니다.” — Stanley Watkins, 1970</div>
        </div>
        <div style={{position: 'absolute', right: 40, bottom: 30, fontFamily: "'Pretendard'", fontSize: 24, color: '#5c4128'}}>BEHP Interview no. 727 · 재연 그래픽</div>
      </div>
    </AbsoluteFill>
  );
};
/** 1피트 = 칸 16개 → 영사기 옆 시계가 1분을 도는 동안 필름이 감긴다 → 1초에 24칸이 켜진다 */
const FilmFoot: React.FC<P> = ({dur, marks}) => {
  const f = useCurrentFrame();
  const m0 = at(marks, 0, dur * 0.4);
  const m1 = at(marks, 1, dur * 0.7);
  const s1 = 1 - ease(f, m0 - 10, m0);
  const s2 = ease(f, m0 - 6, m0 + 6) * (1 - ease(f, m1 - 8, m1));
  const s3 = ease(f, m1 - 4, m1 + 8);
  // 시계 초침: 둘째 마디 동안 한 바퀴(1분)
  const sweep = interpolate(f, [m0, m1 - 4], [0, 360], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.inOut(Easing.sin)});
  const wound = sweep / 360;
  const lit = Math.max(0, Math.floor(((f - m1) / 30) * 24) % 25);
  return (
    <AbsoluteFill style={center}>
      <div style={{position: 'absolute', ...center, opacity: s1}}>
        <div style={{display: 'flex', gap: 10, padding: 16, background: '#1b120a'}}>
          {Array.from({length: 16}).map((_, i) => <div key={i} style={{width: 70, height: 52, background: '#d9c39a', opacity: ease(f, i * 1.5, i * 1.5 + 6)}} />)}
        </div>
        <div style={{width: 1300, height: 6, background: INK, marginTop: 30}} />
      </div>
      <div style={{position: 'absolute', display: 'flex', alignItems: 'flex-end', gap: 160, opacity: s2}}>
        <div style={{position: 'relative'}}>
          <Projector w={560} speed={wound > 0 && wound < 1 ? 14 : 0} />
          {/* 감기는 쪽 릴에 필름이 두꺼워진다 */}
          <div style={{position: 'absolute', left: 560 * 0.52 + 118 - (40 + 70 * wound), top: 118 - (40 + 70 * wound), width: (40 + 70 * wound) * 2, height: (40 + 70 * wound) * 2, borderRadius: '50%', background: 'rgba(27,18,10,.55)'}} />
        </div>
        <div style={{position: 'relative', width: 420, height: 420, borderRadius: '50%', background: '#efe2c4', border: `16px solid ${INK}`, marginBottom: 60}}>
          {Array.from({length: 12}).map((_, i) => (
            <div key={i} style={{position: 'absolute', left: 194, top: 14, width: 0, height: 0, transform: `rotate(${i * 30}deg)`, transformOrigin: '0 180px'}}>
              <div style={{width: 6, height: 26, marginLeft: -3, background: INK}} />
            </div>
          ))}
          {/* 지나간 시간만큼 채워지는 부채꼴 */}
          <div style={{position: 'absolute', inset: 30, borderRadius: '50%', background: `conic-gradient(rgba(122,53,16,.35) 0 ${sweep}deg, transparent ${sweep}deg)`}} />
          <div style={{position: 'absolute', left: 191, top: 40, width: 6, height: 154, background: '#7a3510', transformOrigin: '3px 154px', transform: `rotate(${sweep}deg)`}} />
          <div style={{position: 'absolute', left: 178, top: 178, width: 32, height: 32, borderRadius: '50%', background: INK}} />
        </div>
      </div>
      <div style={{position: 'absolute', display: 'grid', gridTemplateColumns: 'repeat(8, 120px)', gap: 18, opacity: s3}}>
        {Array.from({length: 24}).map((_, i) => <div key={i} style={{width: 120, height: 86, background: i < lit ? '#7a3510' : 'rgba(59,38,20,.2)', border: `4px solid ${INK}`}} />)}
      </div>
    </AbsoluteFill>
  );
};
const Reveal24: React.FC<P> = () => {
  const f = useCurrentFrame();
  const p = interpolate(f, [0, 16], [0, 1], {extrapolateRight: 'clamp', easing: Easing.out(Easing.back(1.4))});
  return (
    <AbsoluteFill style={center}>
      <div style={{fontFamily: "'Bebas Neue'", fontSize: 720, lineHeight: 0.85, color: INK, transform: `scale(${0.7 + 0.3 * p})`, opacity: p, textShadow: '0 20px 40px rgba(30,15,5,.3)'}}>24</div>
    </AbsoluteFill>
  );
};
const JazzSinger: React.FC<P> = () => <Facade crowd={14} night />;
/** 레코드판(바이타폰)과 소리 줄이 새겨진 필름(무비톤)이 같은 속도로 돈다 */
const Movietone: React.FC<P> = () => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{...center, flexDirection: 'row', gap: 160}}>
      <Disc size={480} speed={5} />
      <div style={{width: 300, height: 900, background: '#1b120a', position: 'relative', overflow: 'hidden'}}>
        <div style={{transform: `translateY(${-((f * 9) % 220)}px)`}}>
          {Array.from({length: 7}).map((_, k) => (
            <div key={k} style={{display: 'flex', gap: 12, padding: '10px 12px', height: 220}}>
              <div style={{width: 50, background: `repeating-linear-gradient(180deg,#d9c39a 0 ${6 + (k % 3) * 4}px,#1b120a ${6 + (k % 3) * 4}px ${14 + (k % 2) * 6}px)`}} />
              <div style={{flex: 1, background: '#d9c39a'}} />
            </div>
          ))}
        </div>
      </div>
    </AbsoluteFill>
  );
};
const DoorsClose: React.FC<P> = ({dur}) => {
  const f = useCurrentFrame();
  const c = ease(f, dur * 0.35, dur * 0.85);
  return (
    <AbsoluteFill style={{background: '#1b120a', overflow: 'hidden'}}>
      <div style={{position: 'absolute', left: 560, top: 140, width: 800, height: 800, background: '#f3d9a0', boxShadow: '0 0 120px #f3d9a0'}} />
      <div style={{position: 'absolute', left: 560 - 400 + 400 * c, top: 140, width: 400, height: 800, background: INK, borderRight: '6px solid #6b4a26'}} />
      <div style={{position: 'absolute', left: 1360 - 400 * c, top: 140, width: 400, height: 800, background: INK, borderLeft: '6px solid #6b4a26'}} />
    </AbsoluteFill>
  );
};

/* ---------- 3. 1953 ---------- */
const RoomV3: React.FC<P> = ({dur}) => {
  const f = useCurrentFrame();
  const t = interpolate(f, [0, dur], [0, 1], {extrapolateRight: 'clamp', easing: Easing.inOut(Easing.sin)});
  return <Room3D camX={-160 + 320 * t} camZ={140 * t} />;
};
/** 화면 칸 30개가 1초에 한 바퀴 켜지고, 둘째 문장에서 색이 번지려다 사라진다 */
const Frames30: React.FC<P> = ({dur, marks}) => {
  const f = useCurrentFrame();
  const m = at(marks, 0, dur * 0.5);
  const lit = Math.floor(((f % 30) / 30) * 30);
  const col = interpolate(f, [m, m + 20, m + 40, m + 60], [0, 1, 1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  return (
    <AbsoluteFill style={center}>
      <div style={{display: 'grid', gridTemplateColumns: 'repeat(10, 120px)', gap: 18}}>
        {Array.from({length: 30}).map((_, i) => {
          const hue = (i * 12 + f * 3) % 360;
          const base = i <= lit ? 'rgba(201,255,244,.9)' : 'rgba(143,233,220,.18)';
          return <div key={i} style={{width: 120, height: 86, borderRadius: 8, background: col > 0 && i <= lit ? `hsla(${hue},70%,60%,${0.3 + 0.6 * col})` : base, border: '3px solid #8FE9DC'}} />;
        })}
      </div>
    </AbsoluteFill>
  );
};
/** CBS 회전 원판 TV 옆에서 흑백 TV는 꺼져 있고, 철회 순간 큰 X */
const CbsWheel: React.FC<P> = ({dur, lineMarks}) => {
  const f = useCurrentFrame();
  const x = ease(f, at(lineMarks, 0, dur * 0.7), at(lineMarks, 0, dur * 0.7) + 8);
  const tvs = ease(f, dur * 0.25, dur * 0.35);
  return (
    <AbsoluteFill style={{...center, flexDirection: 'row', gap: 140}}>
      <div style={{position: 'relative', width: 420, height: 420, opacity: 1 - x * 0.5}}>
        <div style={{position: 'absolute', inset: 0, borderRadius: '50%', background: 'conic-gradient(#e05050 0 120deg,#50c060 0 240deg,#5070e0 0)', transform: `rotate(${f * 14}deg)`}} />
        <div style={{position: 'absolute', inset: 160, borderRadius: '50%', background: '#0b2a2f'}} />
      </div>
      <div style={{display: 'flex', gap: 30, opacity: tvs}}>
        {[0, 1, 2].map((k) => <RetroTv key={k} w={260} on={0.08} />)}
      </div>
      <div style={{position: 'absolute', ...center, opacity: x, transform: `scale(${1.4 - 0.4 * x})`}}>
        <div style={{width: 560, height: 560, position: 'relative'}}>
          {[45, -45].map((r) => <div key={r} style={{position: 'absolute', left: 250, top: -20, width: 60, height: 600, background: '#FF7A8A', borderRadius: 30, transform: `rotate(${r}deg)`, boxShadow: '0 0 30px rgba(255,122,138,.6)'}} />)}
        </div>
      </div>
    </AbsoluteFill>
  );
};
/** 승인 문서에 도장이 찍히고 컬러바가 올라온다 */
const Approval: React.FC<P> = ({dur}) => {
  const f = useCurrentFrame();
  const st = ease(f, dur * 0.3, dur * 0.36);
  const bars = ['#c0c0c0', '#c0c000', '#00c0c0', '#00c000', '#c000c0', '#c00000', '#0000c0'];
  return (
    <AbsoluteFill style={{...center, flexDirection: 'row', gap: 120}}>
      <div style={{position: 'relative', width: 560, height: 720, background: '#dfeee9', transform: 'rotate(-3deg)', padding: 60}}>
        {Array.from({length: 12}).map((_, i) => <div key={i} style={{height: 14, margin: '22px 0', width: `${60 + random(`a${i}`) * 35}%`, background: 'rgba(11,42,47,.25)'}} />)}
        <div style={{position: 'absolute', right: 60, bottom: 70, width: 170, height: 170, borderRadius: '50%', border: '10px solid #c0392b', opacity: st, transform: `scale(${1.8 - 0.8 * st}) rotate(-12deg)`}}>
          <div style={{position: 'absolute', inset: 22, borderRadius: '50%', border: '4px solid #c0392b'}} />
        </div>
      </div>
      <div style={{display: 'flex', width: 640, height: 420}}>
        {bars.map((c, i) => <div key={i} style={{flex: 1, background: c, transform: `scaleY(${ease(f, dur * 0.4 + i * 2, dur * 0.4 + i * 2 + 10)})`, transformOrigin: 'bottom'}} />)}
      </div>
    </AbsoluteFill>
  );
};
const wave = (amp: number, fr: number, ph: number, w = 1400, h = 300) => 'M' + Array.from({length: 141}, (_, i) => `${(i / 140) * w} ${h / 2 + Math.sin((i / 140) * Math.PI * 2 * fr + ph) * amp}`).join(' L');
/** 흑백 신호에 색 신호가 겹치고, 둘째 문장에서 소리 신호가 색 신호 바로 옆으로 다가온다 */
const Signals: React.FC<P> = ({lineMarks}) => {
  const f = useCurrentFrame();
  const c = ease(f, 10, 30);
  const m = at(lineMarks, 0, 9e9);
  const s = ease(f, m, m + 30);
  return (
    <AbsoluteFill style={center}>
      <svg width={1500} height={700}>
        <path d={wave(80, 3, f / 7, 1500, 420)} fill="none" stroke="#D6FFF6" strokeWidth={6} />
        <path d={wave(28, 22, f / 2, 1500, 420)} fill="none" stroke="#ff6fb5" strokeWidth={5} opacity={c} />
        <g transform={`translate(0, ${260 - s * 200})`} opacity={s}>
          <path d={wave(30, 26, -f / 2, 1500, 420)} fill="none" stroke="#FFD27A" strokeWidth={5} />
        </g>
      </svg>
    </AbsoluteFill>
  );
};
/** 흑백 TV에 점무늬가 번지고 가족이 고개를 갸웃한다 */
const Dots: React.FC<P> = ({dur}) => {
  const f = useCurrentFrame();
  const d = ease(f, dur * 0.2, dur * 0.5);
  const tilt = d * 10;
  return (
    <AbsoluteFill>
      <div style={{position: 'absolute', left: 660, top: 140}}>
        <RetroTv w={600} />
        <div style={{position: 'absolute', left: 48, top: 48, width: 372, height: 372, borderRadius: '60px/48px', overflow: 'hidden', opacity: d}}>
          <AbsoluteFill style={{background: 'radial-gradient(circle, rgba(10,30,30,.9) 1.6px, transparent 2.3px) 0 0/12px 9px', transform: `translateX(${(f * 2) % 12}px)`}} />
        </div>
      </div>
      <div style={{position: 'absolute', left: 420, bottom: 0, display: 'flex', gap: 80, alignItems: 'flex-end'}}>
        {(['dad', 'kid', 'mom'] as const).map((k, i) => (
          <div key={k} style={{transform: `rotate(${(i - 1) * tilt}deg)`, transformOrigin: 'bottom'}}><Person kind={k} h={[460, 320, 430][i]} color="#081a1d" nod={i} /></div>
        ))}
      </div>
    </AbsoluteFill>
  );
};
/** 기술자 둘과 계기판, 바늘이 아주 조금 움직인다 (숫자 없음) */
const Engineers: React.FC<P> = ({dur}) => {
  const f = useCurrentFrame();
  const a = interpolate(f, [dur * 0.2, dur * 0.5], [0, -9], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.inOut(Easing.cubic)});
  return (
    <AbsoluteFill style={center}>
      <svg width={900} height={560} viewBox="0 0 900 560">
        <path d="M100 480 A350 350 0 0 1 800 480" fill="none" stroke="#2c6f75" strokeWidth={30} />
        {Array.from({length: 11}).map((_, i) => {
          const t = Math.PI * (1 - i / 10);
          return <line key={i} x1={450 + Math.cos(t) * 300} y1={480 - Math.sin(t) * 300} x2={450 + Math.cos(t) * 340} y2={480 - Math.sin(t) * 340} stroke="#8FE9DC" strokeWidth={4} />;
        })}
        <g transform={`rotate(${a} 450 480)`}><line x1={450} y1={480} x2={450} y2={170} stroke="#FFD27A" strokeWidth={10} strokeLinecap="round" /></g>
        <circle cx={450} cy={480} r={24} fill="#FFD27A" />
      </svg>
      <div style={{position: 'absolute', left: 170, bottom: 120}}><Person kind="engineer" h={540} color="#081a1d" nod={3} /></div>
      <div style={{position: 'absolute', right: 170, bottom: 120, transform: 'scaleX(-1)'}}><Person kind="engineer" h={500} color="#081a1d" nod={5} /></div>
    </AbsoluteFill>
  );
};
/** 30 → 29.97 (VT323 글꼴) */
const Reveal2997: React.FC<P> = () => {
  const f = useCurrentFrame();
  const s = ease(f, 4, 14);
  const t: React.CSSProperties = {fontFamily: CRT_NUM, color: '#c9fff4', lineHeight: 1, textShadow: '0 0 30px rgba(120,255,230,.6)'};
  return (
    <AbsoluteFill style={{...center, flexDirection: 'row', gap: 80}}>
      <div style={{position: 'relative'}}>
        <div style={{...t, fontSize: 300, opacity: 1 - s * 0.6}}>30</div>
        <div style={{position: 'absolute', left: -10, top: '52%', height: 14, width: `${s * 108}%`, background: '#FF7A8A'}} />
      </div>
      <div style={{...t, fontSize: 160, opacity: ease(f, 10, 18)}}>→</div>
      <div style={{...t, fontSize: 380, opacity: ease(f, 16, 26), transform: `scale(${0.85 + 0.15 * ease(f, 16, 30)})`}}>29.97</div>
    </AbsoluteFill>
  );
};
/** 세피아 필름이 브라운관 TV 쪽으로 다가가고, 둘째 문장에서 느려진다 */
const FilmToTv: React.FC<P> = ({lineMarks}) => {
  const f = useCurrentFrame();
  const m = at(lineMarks, 0, 9e9);
  const sp = 30 - 12 * ease(f, m, m + 40);
  const xs = useFilmX(f, sp);
  return (
    <AbsoluteFill style={{...center, flexDirection: 'row'}}>
      <div style={{width: 1000, height: 300, overflow: 'hidden', background: '#111', borderTop: '24px solid #111', borderBottom: '24px solid #111'}}>
        <div style={{display: 'flex', gap: 30, transform: `translateX(${xs}px)`}}>
          {Array.from({length: 8}).map((_, i) => <div key={i} style={{flex: '0 0 300px', height: 250, background: 'linear-gradient(180deg,#d9c39a,#8a6a40)'}} />)}
        </div>
      </div>
      <div style={{marginLeft: -60}}><RetroTv w={560} /></div>
    </AbsoluteFill>
  );
};
const useFilmX = (f: number, sp: number) => -((f * sp) % 330);
const Reveal23976: React.FC<P> = (p) => <S1.equation {...p} />;

/* ---------- 5. 지금 ---------- */
/** 메뉴로 돌아오고, 둘째 문장에서 세피아 24와 청록 1000/1001이 23.98p 줄로 모인다 */
const MenuReturn: React.FC<P> = ({dur, lineMarks}) => {
  const f = useCurrentFrame();
  const m = at(lineMarks, 0, dur * 0.3);
  const fly = ease(f, m + 20, m + 60);
  const hl = ease(f, m + 55, m + 65);
  const rows = ['29.97p', '24p', '23.98p'];
  const GRAD = 'linear-gradient(90deg,#8E9BFF,#C77DFF)';
  return (
    <AbsoluteFill style={center}>
      <div style={{width: 800, borderRadius: 40, background: 'rgba(255,255,255,.06)', border: '1px solid rgba(255,255,255,.16)', padding: '40px 50px'}}>
        {rows.map((r) => (
          <div key={r} style={{padding: '24px 30px', marginTop: 14, borderRadius: 22, fontFamily: NOW_NUM, fontWeight: 700, fontSize: 56, background: r === '23.98p' ? `rgba(160,140,255,${hl})` : 'transparent', backgroundImage: r === '23.98p' && hl > 0.5 ? GRAD : undefined, color: r === '23.98p' && hl > 0.5 ? '#0a0a14' : '#fff'}}>{r}</div>
        ))}
      </div>
      <div style={{position: 'absolute', left: interpolate(fly, [0, 1], [140, 820]), top: interpolate(fly, [0, 1], [160, 640]), opacity: ease(f, m, m + 10) * (1 - hl), fontFamily: "'Bebas Neue'", fontSize: 120, color: '#d9c39a'}}>24</div>
      <div style={{position: 'absolute', right: interpolate(fly, [0, 1], [120, 760]), top: interpolate(fly, [0, 1], [160, 650]), opacity: ease(f, m + 6, m + 16) * (1 - hl), fontFamily: CRT_NUM, fontSize: 90, color: '#8FE9DC'}}>×1000/1001</div>
    </AbsoluteFill>
  );
};
/** 1975년 상자 모양 시제품 실루엣이 어둠 속에서 서서히 보인다 */
const NextKodak: React.FC<P> = ({dur}) => {
  const f = useCurrentFrame();
  const l = ease(f, 0, dur * 0.6);
  return (
    <AbsoluteFill style={center}>
      <div style={{position: 'relative', width: 760, height: 460, filter: `drop-shadow(0 0 ${60 * l}px rgba(160,140,255,${0.6 * l}))`, opacity: 0.2 + 0.8 * l}}>
        <div style={{position: 'absolute', left: 0, top: 80, width: 560, height: 300, background: '#1c1a24', border: '4px solid rgba(255,255,255,.25)', borderRadius: 16}} />
        <div style={{position: 'absolute', left: 560, top: 150, width: 180, height: 160, borderRadius: '50%', background: '#121118', border: '6px solid rgba(255,255,255,.3)'}} />
        <div style={{position: 'absolute', left: 80, top: 140, width: 220, height: 140, background: '#2a2733', border: '4px solid rgba(255,255,255,.2)'}}>
          {[0, 1].map((k) => <div key={k} style={{position: 'absolute', top: 40, left: 30 + k * 110, width: 50, height: 50, borderRadius: '50%', border: '6px solid rgba(255,255,255,.35)', transform: `rotate(${f * 6}deg)`}} />)}
        </div>
      </div>
    </AbsoluteFill>
  );
};

/** 끝 화면: 이야기가 끝났다는 표시. 제목만 영어·한국어로 */
const EndCard: React.FC<P> = ({dur}) => {
  const f = useCurrentFrame();
  const a = ease(f, 0, 18);
  const b = ease(f, 10, 28);
  const out = 1 - ease(f, dur - 14, dur);
  return (
    <AbsoluteFill style={{...center, opacity: out}}>
      <div style={{fontFamily: NOW_NUM, fontWeight: 700, fontSize: 220, lineHeight: 1, color: '#fff', opacity: a, transform: `translateY(${(1 - a) * 20}px)`, letterSpacing: -4}}>23.98p</div>
      <div style={{fontFamily: NOW_NUM, fontWeight: 700, fontSize: 56, marginTop: 30, opacity: b, backgroundImage: 'linear-gradient(90deg,#8E9BFF,#C77DFF)', WebkitBackgroundClip: 'text', color: 'transparent'}}>Why not 24?</div>
      <div style={{fontFamily: "'Pretendard', sans-serif", fontWeight: 600, fontSize: 34, marginTop: 12, color: 'rgba(255,255,255,.6)', opacity: b}}>왜 24가 아닐까</div>
    </AbsoluteFill>
  );
};

export const V3_ERA: Record<string, 'now' | 'crt' | 'sepia'> = {
  menuOpen: 'now', yearRewind: 'now', theaterOutside: 'sepia', theaterInside: 'sepia', emptyPit: 'sepia', booth: 'sepia', needle: 'sepia', theaterSpeeds: 'sepia',
  company: 'sepia', watkinsAsk: 'sepia', speedsAlign: 'sepia', interviewDoc: 'sepia', filmFoot: 'sepia', reveal24: 'sepia', jazzSinger: 'sepia', movietone: 'sepia', doorsClose: 'sepia',
  room: 'crt', frames30: 'crt', cbsWheel: 'crt', approval: 'crt', signals: 'crt', dots: 'crt', tvGrid: 'crt', engineers: 'crt', reveal2997: 'crt', filmToTv: 'crt', reveal23976: 'crt',
  menuReturn: 'now', endCard: 'now', nextKodak: 'now',
};
export const V3_SHOTS: Record<string, React.FC<any>> = {
  menuOpen: MenuOpen, yearRewind: YearRewind, theaterOutside: TheaterOutside, theaterInside: TheaterInside, emptyPit: EmptyPit, booth: Booth, needle: Needle,
  theaterSpeeds: TheaterSpeeds, company: Company, watkinsAsk: WatkinsAsk, speedsAlign: SpeedsAlign, interviewDoc: InterviewDoc, filmFoot: FilmFoot, reveal24: Reveal24,
  jazzSinger: JazzSinger, movietone: Movietone, doorsClose: DoorsClose, room: RoomV3, frames30: Frames30, cbsWheel: CbsWheel, approval: Approval, signals: Signals,
  dots: Dots, tvGrid: S1.tvGrid, engineers: Engineers, reveal2997: Reveal2997, filmToTv: FilmToTv, reveal23976: Reveal23976, menuReturn: MenuReturn, endCard: EndCard, nextKodak: NextKodak,
};
void S2;
