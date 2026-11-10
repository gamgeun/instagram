import React from 'react';
import {AbsoluteFill, useCurrentFrame, interpolate, random, Easing} from 'remotion';
import {FONT, prog} from '../theme';
import {Era, INK, MONO, SERIF} from './eras';

type P = {dur: number; opt: any};
const GRAD = 'linear-gradient(90deg,#8E9BFF,#C77DFF)';
const center: React.CSSProperties = {display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column'};
const ease = (f: number, a: number, b: number) => interpolate(f, [a, b], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.out(Easing.cubic)});
const pop = (f: number, s = 0) => ({opacity: ease(f, s, s + 6), transform: `scale(${0.85 + 0.15 * ease(f, s, s + 8)})`});

const GradText: React.FC<{size: number; children: React.ReactNode; style?: React.CSSProperties}> = ({size, children, style}) => (
  <div style={{fontFamily: FONT, fontWeight: 900, fontSize: size, letterSpacing: -size * 0.04, lineHeight: 1, background: GRAD, WebkitBackgroundClip: 'text', color: 'transparent', ...style}}>{children}</div>
);
const CrtText: React.FC<{size: number; children: React.ReactNode; style?: React.CSSProperties}> = ({size, children, style}) => (
  <div style={{fontFamily: MONO, fontSize: size, color: '#c9fff4', lineHeight: 1, whiteSpace: 'nowrap', textShadow: '3px 0 rgba(255,60,90,.6),-3px 0 rgba(60,160,255,.6),0 0 30px rgba(120,255,230,.5)', ...style}}>{children}</div>
);
const Card: React.FC<{children: React.ReactNode; style?: React.CSSProperties}> = ({children, style}) => (
  <div style={{borderRadius: 44, background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.16)', padding: '44px 52px', ...style}}>{children}</div>
);

/* ---------- 지금 ---------- */
const RATES = ['120p', '60p', '59.94p', '30p', '29.97p', '25p', '24p', '23.98p'];
const MenuScroll: React.FC<P> = ({opt, dur}) => {
  const f = useCurrentFrame();
  const target = RATES.indexOf('23.98p');
  const pos = opt.stop ? interpolate(f, [0, dur * 0.7], [target - 2.5, target], {extrapolateRight: 'clamp', easing: Easing.out(Easing.cubic)}) : (f / 9) % RATES.length;
  return (
    <AbsoluteFill style={center}>
      <Card style={{width: 820, height: 640, position: 'relative', overflow: 'hidden'}}>
        <div style={{fontFamily: MONO, fontSize: 28, color: 'rgba(255,255,255,.55)', letterSpacing: 3}}>REC FRAME RATE</div>
        <div style={{position: 'absolute', left: 0, right: 0, top: 110, bottom: 0, overflow: 'hidden'}}>
        <div style={{position: 'absolute', left: 40, right: 40, top: 190, height: 96, borderRadius: 22, background: GRAD, opacity: opt.stop ? ease(f, dur * 0.6, dur * 0.75) : 0.25}} />
        {RATES.map((r, i) => {
          const y = 190 + (i - pos) * 110;
          const on = opt.stop && i === target && f > dur * 0.65;
          return (
            <div key={r} style={{position: 'absolute', left: 80, top: y + 18, fontFamily: MONO, fontWeight: 600, fontSize: 52, color: on ? '#0a0a14' : '#fff', opacity: Math.max(0, 1 - Math.abs(i - pos) * 0.3)}}>
              {r}
            </div>
          );
        })}
        </div>
      </Card>
    </AbsoluteFill>
  );
};
const BigNum: React.FC<P> = ({opt}) => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={center}>
      <GradText size={420} style={pop(f)}>{opt.text}</GradText>
    </AbsoluteFill>
  );
};
const FilmLook: React.FC<P> = ({dur}) => {
  const f = useCurrentFrame();
  const bar = ease(f, 4, 18) * 130;
  return (
    <AbsoluteFill style={center}>
      <div style={{position: 'relative', width: 1400, height: 720, borderRadius: 28, overflow: 'hidden', background: 'linear-gradient(180deg,#2d4f86 0%,#d9875a 70%,#f2c37f 100%)', transform: `scale(${1 + f / dur * 0.05})`}}>
        <div style={{position: 'absolute', inset: 0, background: '#14241a', clipPath: 'polygon(0 75%,20% 55%,38% 68%,60% 50%,82% 66%,100% 58%,100% 100%,0 100%)'}} />
        <div style={{position: 'absolute', left: 900, top: 260, width: 120, height: 120, borderRadius: '50%', background: '#fff0c0', boxShadow: '0 0 80px #ffd27a'}} />
        <div style={{position: 'absolute', left: 0, right: 0, top: 0, height: bar, background: '#000'}} />
        <div style={{position: 'absolute', left: 0, right: 0, bottom: 0, height: bar, background: '#000'}} />
        <div style={{position: 'absolute', right: 40, top: bar + 30, fontFamily: MONO, fontSize: 30, color: '#fff', opacity: ease(f, 14, 22)}}>● 23.98p</div>
      </div>
    </AbsoluteFill>
  );
};
const GlitchNum: React.FC<P> = () => {
  const f = useCurrentFrame();
  const j = (k: string) => (random(k + Math.floor(f / 2)) - 0.5) * 24;
  return (
    <AbsoluteFill style={center}>
      <div style={{position: 'relative'}}>
        <div style={{position: 'absolute', left: j('a'), top: j('b'), fontFamily: FONT, fontWeight: 900, fontSize: 380, color: 'rgba(255,60,120,.6)', mixBlendMode: 'screen'}}>23.98</div>
        <div style={{position: 'absolute', left: j('c'), top: j('d'), fontFamily: FONT, fontWeight: 900, fontSize: 380, color: 'rgba(60,180,255,.6)', mixBlendMode: 'screen'}}>23.98</div>
        <div style={{fontFamily: FONT, fontWeight: 900, fontSize: 380, color: '#fff'}}>23.98</div>
      </div>
      <div style={{position: 'absolute', right: 220, top: 160, fontFamily: FONT, fontWeight: 900, fontSize: 220, color: '#A99BFF', ...pop(f, 6)}}>?</div>
    </AbsoluteFill>
  );
};
const FrameCount: React.FC<P & {era: Era}> = ({opt, era}) => {
  const f = useCurrentFrame();
  const n: number = opt.n;
  const cols = n === 24 ? 8 : 10;
  const lit = Math.min(n, Math.floor((f / 30) * n * 1.2));
  const ink = INK[era];
  const onColor = era === 'crt' ? '#8FE9DC' : '#A99BFF';
  return (
    <AbsoluteFill style={{...center, flexDirection: 'row', gap: 90}}>
      <div style={{display: 'grid', gridTemplateColumns: `repeat(${cols}, 78px)`, gap: 14}}>
        {Array.from({length: n}).map((_, i) => (
          <div key={i} style={{width: 78, height: 58, borderRadius: 8, border: `2px solid ${onColor}`, background: i < lit ? onColor : 'transparent', opacity: i < lit ? 1 : 0.35}} />
        ))}
      </div>
      <div style={{textAlign: 'left'}}>
        <div style={{fontFamily: era === 'crt' ? MONO : FONT, fontWeight: 900, fontSize: 260, lineHeight: 1, color: ink.main}}>{lit}</div>
        <div style={{fontFamily: FONT, fontWeight: 700, fontSize: 50, color: ink.sub, marginTop: 10}}>장 / 1초</div>
      </div>
    </AbsoluteFill>
  );
};
const Versus: React.FC<P> = () => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{...center, flexDirection: 'row', gap: 80}}>
      <div style={{...pop(f), textAlign: 'center'}}>
        <div style={{fontFamily: FONT, fontWeight: 900, fontSize: 300, color: '#fff'}}>24</div>
        <div style={{fontFamily: FONT, fontWeight: 700, fontSize: 40, color: 'rgba(255,255,255,.6)'}}>영화</div>
      </div>
      <div style={{fontFamily: FONT, fontWeight: 900, fontSize: 200, color: '#FF7A8A', ...pop(f, 10)}}>≠</div>
      <div style={{...pop(f, 18), textAlign: 'center'}}>
        <GradText size={300}>23.98</GradText>
        <div style={{fontFamily: FONT, fontWeight: 700, fontSize: 40, color: 'rgba(255,255,255,.6)', marginTop: 20}}>카메라</div>
      </div>
    </AbsoluteFill>
  );
};
const Diff: React.FC<P> = () => {
  const f = useCurrentFrame();
  const z = ease(f, 6, 22);
  return (
    <AbsoluteFill style={center}>
      <div style={{fontFamily: MONO, fontSize: 120, color: 'rgba(255,255,255,.5)', opacity: 1 - z * 0.7, transform: `translateY(${-z * 120}px)`}}>24.00 − 23.98</div>
      <GradText size={360} style={{transform: `scale(${0.4 + z * 0.6})`, opacity: z}}>0.02</GradText>
    </AbsoluteFill>
  );
};
const MenuHighlight: React.FC<P> = () => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{...center, flexDirection: 'row', gap: 100}}>
      <Card style={{width: 760}}>
        <div style={{fontFamily: MONO, fontSize: 28, color: 'rgba(255,255,255,.55)', letterSpacing: 3, marginBottom: 20}}>REC FRAME RATE</div>
        {['29.97p', '24p', '23.98p'].map((r) => (
          <div key={r} style={{padding: '22px 30px', marginTop: 14, borderRadius: 22, fontFamily: MONO, fontWeight: 600, fontSize: 50, background: r === '23.98p' ? GRAD : 'transparent', color: r === '23.98p' ? '#0a0a14' : '#fff'}}>{r}</div>
        ))}
      </Card>
      <div style={{...pop(f, 10)}}>
        <div style={{fontFamily: MONO, fontSize: 44, color: 'rgba(255,255,255,.6)'}}>24 × 1000/1001</div>
        <GradText size={170} style={{marginTop: 20}}>= 23.976</GradText>
        <div style={{fontFamily: FONT, fontWeight: 700, fontSize: 40, color: 'rgba(255,255,255,.7)', marginTop: 30}}>1953년의 흔적</div>
      </div>
    </AbsoluteFill>
  );
};

/* ---------- 전환 ---------- */
const YearRoll: React.FC<P> = ({opt, dur}) => {
  const f = useCurrentFrame();
  const p = interpolate(f, [0, dur * 0.9], [0, 1], {extrapolateRight: 'clamp', easing: Easing.inOut(Easing.cubic)});
  const y = Math.round(opt.from + (opt.to - opt.from) * p);
  return (
    <AbsoluteFill style={{...center, background: `rgba(6,19,26,${p})`}}>
      <div style={{fontFamily: MONO, fontSize: 340, color: p > 0.5 ? '#c9fff4' : '#fff', filter: `blur(${(1 - Math.abs(p * 2 - 1)) * 6}px)`}}>{y}</div>
      <div style={{fontFamily: FONT, fontWeight: 700, fontSize: 44, color: 'rgba(255,255,255,.6)', marginTop: 10}}>← {opt.from - y}년 전</div>
    </AbsoluteFill>
  );
};
const TvOn: React.FC<P> = () => {
  const f = useCurrentFrame();
  const h = ease(f, 6, 18);
  return (
    <AbsoluteFill style={center}>
      <div style={{width: 1320, height: 780, borderRadius: 60, background: '#1a2b2e', boxShadow: '0 0 0 18px #0e1b1d', position: 'relative'}}>
        <div style={{position: 'absolute', left: 60, top: 50, right: 60, bottom: 50, borderRadius: '120px/60px', background: '#020606', overflow: 'hidden', ...center}}>
          <div style={{width: `${Math.min(1, f / 6) * 100}%`, height: `${Math.max(0.6, h * 100)}%`, background: 'radial-gradient(ellipse,#bff8ee,#2c6f75 60%,#0b2a2f)', opacity: 0.9}} />
        </div>
      </div>
    </AbsoluteFill>
  );
};
const SepiaFlash: React.FC<P> = () => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={center}>
      <div style={{fontFamily: SERIF, fontWeight: 900, fontSize: 460, color: '#3b2614', ...pop(f, 2)}}>24</div>
    </AbsoluteFill>
  );
};
const SepiaTease: React.FC<P> = () => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={center}>
      <div style={{fontFamily: SERIF, fontWeight: 900, fontSize: 240, color: '#3b2614', opacity: ease(f, 0, 10)}}>1927</div>
      <div style={{fontFamily: SERIF, fontWeight: 700, fontSize: 52, color: '#5c4128', marginTop: 20, opacity: ease(f, 8, 16)}}>다음 장 · 손으로 돌리던 카메라</div>
    </AbsoluteFill>
  );
};

/* ---------- 1953 ---------- */
const YearCard: React.FC<P> = ({opt}) => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={center}>
      <CrtText size={300} style={pop(f)}>{opt.year}</CrtText>
      <div style={{fontFamily: FONT, fontWeight: 900, fontSize: 80, color: '#8FE9DC', marginTop: 30, opacity: ease(f, 8, 16)}}>{opt.place}</div>
    </AbsoluteFill>
  );
};
const Houses: React.FC<P> = () => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{...center, flexDirection: 'row', gap: 40, paddingTop: 120}}>
      {Array.from({length: 5}).map((_, i) => {
        const glow = 0.55 + random(`h${i}-${Math.floor(f / 3)}`) * 0.45;
        return (
          <div key={i} style={{position: 'relative', width: 280, height: 320, opacity: ease(f, i * 3, i * 3 + 8)}}>
            <div style={{position: 'absolute', left: 0, right: 0, top: 0, height: 120, background: '#0e2a2f', clipPath: 'polygon(50% 0,100% 100%,0 100%)'}} />
            <div style={{position: 'absolute', left: 20, right: 20, top: 120, bottom: 0, background: '#0e2a2f'}} />
            <div style={{position: 'absolute', left: 80, top: 170, width: 120, height: 90, background: `rgba(220,240,240,${glow})`, boxShadow: `0 0 50px rgba(200,240,240,${glow * 0.6})`}} />
          </div>
        );
      })}
    </AbsoluteFill>
  );
};
const BARS = ['#c0c0c0', '#c0c000', '#00c0c0', '#00c000', '#c000c0', '#c00000', '#0000c0'];
const ColorStandard: React.FC<P> = () => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={center}>
      <div style={{display: 'flex', width: 1300, height: 460}}>
        {BARS.map((c, i) => (
          <div key={i} style={{flex: 1, background: c, transform: `scaleY(${ease(f, i * 2, i * 2 + 8)})`, transformOrigin: 'bottom'}} />
        ))}
      </div>
      <div style={{marginTop: 50, padding: '14px 40px', border: '4px solid #FF7A8A', color: '#FF7A8A', fontFamily: MONO, fontSize: 46, transform: `rotate(-4deg) scale(${1.6 - 0.6 * ease(f, 16, 22)})`, opacity: ease(f, 16, 20)}}>
        COLOR TV STANDARD · 1953
      </div>
    </AbsoluteFill>
  );
};
const Condition: React.FC<P> = () => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{...center, flexDirection: 'row', gap: 60}}>
      <div style={{width: 220, height: 220, borderRadius: '50%', border: '6px solid #8FE9DC', ...center, ...pop(f)}}>
        <CrtText size={140}>1</CrtText>
      </div>
      <div style={{fontFamily: FONT, fontWeight: 900, fontSize: 200, color: '#D6FFF6', ...pop(f, 6)}}>조건</div>
    </AbsoluteFill>
  );
};
const MiniTv: React.FC<{w: number; children?: React.ReactNode; style?: React.CSSProperties}> = ({w, children, style}) => (
  <div style={{width: w, height: w * 0.75, borderRadius: w * 0.08, background: '#1a2b2e', boxShadow: `0 0 0 ${w * 0.02}px #0e1b1d`, position: 'relative', ...style}}>
    <div style={{position: 'absolute', inset: w * 0.06, borderRadius: `${w * 0.1}px/${w * 0.06}px`, overflow: 'hidden', background: '#0b2a2f'}}>{children}</div>
  </div>
);
const BwReceive: React.FC<P> = () => {
  const f = useCurrentFrame();
  const gray = ['#c0c0c0', '#adadad', '#8a8a8a', '#777', '#5a5a5a', '#474747', '#262626'];
  return (
    <AbsoluteFill style={{...center, flexDirection: 'row', gap: 80}}>
      <div style={{display: 'flex', width: 420, height: 300, opacity: ease(f, 0, 8)}}>
        {BARS.map((c, i) => <div key={i} style={{flex: 1, background: c}} />)}
      </div>
      <div style={{fontFamily: MONO, fontSize: 90, color: '#8FE9DC', opacity: ease(f, 6, 12)}}>→</div>
      <MiniTv w={560} style={{opacity: ease(f, 10, 18)}}>
        <div style={{display: 'flex', height: '100%'}}>{gray.map((c, i) => <div key={i} style={{flex: 1, background: c}} />)}</div>
      </MiniTv>
      <div style={{position: 'absolute', right: 230, top: 200, width: 120, height: 120, borderRadius: '50%', background: '#7CF5B4', color: '#06131a', fontFamily: FONT, fontWeight: 900, fontSize: 80, ...center, ...pop(f, 22)}}>✓</div>
    </AbsoluteFill>
  );
};
const wave = (amp: number, freq: number, phase: number, w = 1400, h = 200) =>
  'M' + Array.from({length: 141}, (_, i) => `${(i / 140) * w} ${h / 2 + Math.sin((i / 140) * Math.PI * 2 * freq + phase) * amp}`).join(' L');
const SignalAdd: React.FC<P> = () => {
  const f = useCurrentFrame();
  const c = ease(f, 14, 26);
  return (
    <AbsoluteFill style={center}>
      <svg width={1400} height={500}>
        <path d={wave(70, 3, f / 6, 1400, 300)} fill="none" stroke="#D6FFF6" strokeWidth={5} />
        <path d={wave(26, 22, f / 2, 1400, 300)} fill="none" stroke="#ff6fb5" strokeWidth={4} opacity={c} transform="translate(0,0)" />
        <text x={0} y={420} fill="#8FE9DC" fontFamily={MONO} fontSize={40}>흑백 신호</text>
        <text x={1400} y={420} fill="#ff6fb5" fontFamily={MONO} fontSize={40} textAnchor="end" opacity={c}>+ 색 신호</text>
      </svg>
    </AbsoluteFill>
  );
};
const SignalClash: React.FC<P> = ({dur}) => {
  const f = useCurrentFrame();
  const meet = interpolate(f, [0, dur * 0.4], [0, 1], {extrapolateRight: 'clamp'});
  const hit = f > dur * 0.4;
  const shake = hit ? (random(`s${f}`) - 0.5) * 30 : 0;
  return (
    <AbsoluteFill style={{...center, transform: `translate(${shake}px, ${shake / 2}px)`}}>
      <svg width={1600} height={500}>
        <g transform={`translate(${-500 + meet * 500},0)`}>
          <path d={wave(40, 14, f / 2, 800, 300)} fill="none" stroke="#ff6fb5" strokeWidth={5} />
          <text x={20} y={80} fill="#ff6fb5" fontFamily={FONT} fontWeight={700} fontSize={44}>색 신호</text>
        </g>
        <g transform={`translate(${1300 - meet * 500},0)`}>
          <path d={wave(40, 6, -f / 3, 800, 300)} fill="none" stroke="#FFD27A" strokeWidth={5} />
          <text x={780} y={80} fill="#FFD27A" fontFamily={FONT} fontWeight={700} fontSize={44} textAnchor="end">소리 신호</text>
        </g>
      </svg>
      {hit && (
        <AbsoluteFill style={{opacity: 0.35, backgroundImage: `repeating-radial-gradient(circle at ${random(`x${f}`) * 100}% ${random(`y${f}`) * 100}%, #fff 0 1px, transparent 1px 3px)`}} />
      )}
      {hit && <div style={{position: 'absolute', top: 200, fontFamily: FONT, fontWeight: 900, fontSize: 130, color: '#FF7A8A', ...pop(f, Math.ceil(dur * 0.4))}}>잡음</div>}
    </AbsoluteFill>
  );
};
const SoundMove: React.FC<P> = ({dur}) => {
  const f = useCurrentFrame();
  const x = Math.sin((f / dur) * Math.PI * 2) * 60;
  return (
    <AbsoluteFill style={center}>
      <div style={{display: 'flex', alignItems: 'center', gap: 40, transform: `translateX(${x}px)`}}>
        <svg width={600} height={240}><path d={wave(60, 6, -f / 3, 600, 240)} fill="none" stroke="#FFD27A" strokeWidth={7} /></svg>
        <div style={{fontFamily: MONO, fontSize: 120, color: '#FFD27A'}}>⇄</div>
      </div>
      <div style={{fontFamily: FONT, fontWeight: 900, fontSize: 70, color: '#FFD27A', marginTop: 30}}>소리 신호 위치 바꾸기?</div>
    </AbsoluteFill>
  );
};
const TvGrid: React.FC<P> = () => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{...center, paddingBottom: 60}}>
      <div style={{display: 'grid', gridTemplateColumns: 'repeat(6, 220px)', gap: 30}}>
        {Array.from({length: 18}).map((_, i) => (
          <div key={i} style={{position: 'relative'}}>
            <MiniTv w={220}><div style={{position: 'absolute', inset: 0, background: 'radial-gradient(#9fd,#0b2a2f)', opacity: 0.5}} /></MiniTv>
            <div style={{position: 'absolute', inset: 0, ...center, fontFamily: FONT, fontWeight: 900, fontSize: 120, color: '#FF7A8A', opacity: ease(f, 4 + i * 1.2, 8 + i * 1.2)}}>✕</div>
          </div>
        ))}
      </div>
    </AbsoluteFill>
  );
};
const SlowDial: React.FC<P> = ({dur}) => {
  const f = useCurrentFrame();
  const a = interpolate(f, [dur * 0.3, dur * 0.8], [0, -9], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.inOut(Easing.cubic)});
  return (
    <AbsoluteFill style={center}>
      <svg width={900} height={560} viewBox="0 0 900 560">
        <path d="M100 480 A350 350 0 0 1 800 480" fill="none" stroke="#2c6f75" strokeWidth={30} />
        {Array.from({length: 11}).map((_, i) => {
          const t = Math.PI * (1 - i / 10);
          return <line key={i} x1={450 + Math.cos(t) * 300} y1={480 - Math.sin(t) * 300} x2={450 + Math.cos(t) * 340} y2={480 - Math.sin(t) * 340} stroke="#8FE9DC" strokeWidth={4} />;
        })}
        <g transform={`rotate(${a} 450 480)`}>
          <line x1={450} y1={480} x2={450} y2={170} stroke="#FFD27A" strokeWidth={10} strokeLinecap="round" />
        </g>
        <circle cx={450} cy={480} r={24} fill="#FFD27A" />
        <text x={450} y={120} textAnchor="middle" fill="#c9fff4" fontFamily={MONO} fontSize={56}>{(30 + a * 0.00333).toFixed(2)}</text>
      </svg>
    </AbsoluteFill>
  );
};
const Fraction: React.FC<P> = () => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={center}>
      <div style={{...center, ...pop(f)}}>
        <CrtText size={230}>1000</CrtText>
        <div style={{width: 760, height: 10, background: '#8FE9DC', margin: '30px 0', boxShadow: '0 0 30px #8FE9DC'}} />
        <CrtText size={230}>1001</CrtText>
      </div>
    </AbsoluteFill>
  );
};
const BigCrt: React.FC<P> = ({opt}) => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={center}>
      <MiniTv w={1100}>
        <div style={{...center, height: '100%'}}>
          <CrtText size={420} style={pop(f)}>{opt.text}</CrtText>
        </div>
      </MiniTv>
    </AbsoluteFill>
  );
};
const Strike: React.FC<P> = ({opt}) => {
  const f = useCurrentFrame();
  const s = ease(f, 2, 10);
  return (
    <AbsoluteFill style={{...center, flexDirection: 'row', gap: 70}}>
      <div style={{position: 'relative'}}>
        <CrtText size={260} style={{opacity: 1 - s * 0.55}}>{opt.from}</CrtText>
        <div style={{position: 'absolute', left: -10, top: '50%', height: 12, width: `${s * 105}%`, background: '#FF7A8A'}} />
      </div>
      <CrtText size={140} style={{opacity: ease(f, 8, 14)}}>→</CrtText>
      <CrtText size={300} style={pop(f, 12)}>{opt.to}</CrtText>
    </AbsoluteFill>
  );
};
const FilmStrip: React.FC<{speed: number; f: number; label?: string}> = ({speed, f, label}) => (
  <div style={{position: 'relative', width: 1700, height: 300, overflow: 'hidden', background: '#111', borderTop: '24px solid #111', borderBottom: '24px solid #111'}}>
    <div style={{display: 'flex', gap: 30, transform: `translateX(${-((f * speed) % 330)}px)`}}>
      {Array.from({length: 8}).map((_, i) => (
        <div key={i} style={{flex: '0 0 300px', height: 250, background: 'linear-gradient(180deg,#d9c39a,#8a6a40)', borderRadius: 6}} />
      ))}
    </div>
    {[0, 1].map((s) => (
      <div key={s} style={{position: 'absolute', left: 0, right: 0, [s ? 'bottom' : 'top']: -20, height: 16, backgroundImage: 'repeating-linear-gradient(90deg,#eee 0 18px,transparent 18px 46px)', transform: `translateX(${-((f * speed) % 46)}px)`}} />
    ))}
    {label && <div style={{position: 'absolute', right: 30, top: 20, fontFamily: MONO, fontSize: 40, color: '#fff', background: 'rgba(0,0,0,.6)', padding: '6px 16px'}}>{label}</div>}
  </div>
);
const FilmToTv: React.FC<P> = () => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{...center, flexDirection: 'row', gap: 0}}>
      <div style={{width: 900, overflow: 'hidden', transform: `translateX(${ease(f, 0, 12) * 120 - 120}px)`}}><FilmStrip speed={30} f={f} label="24장/초" /></div>
      <MiniTv w={600} style={{marginLeft: -40, ...pop(f, 4)}}>
        <div style={{...center, height: '100%'}}><CrtText size={90}>29.97</CrtText></div>
      </MiniTv>
    </AbsoluteFill>
  );
};
const FilmSlow: React.FC<P> = ({dur}) => {
  const f = useCurrentFrame();
  const sp = interpolate(f, [0, dur], [30, 18], {extrapolateRight: 'clamp'});
  const v = interpolate(f, [dur * 0.3, dur * 0.8], [24, 23.976], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  return (
    <AbsoluteFill style={center}>
      <FilmStrip speed={sp} f={f} />
      <CrtText size={150} style={{marginTop: 50}}>{v.toFixed(3)}</CrtText>
    </AbsoluteFill>
  );
};
const Equation: React.FC<P> = () => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={center}>
      <div style={{display: 'flex', alignItems: 'baseline', gap: 40}}>
        <CrtText size={180} style={pop(f)}>24</CrtText>
        <CrtText size={120} style={{opacity: ease(f, 8, 14)}}>×</CrtText>
        <CrtText size={120} style={{opacity: ease(f, 12, 18)}}>1000/1001</CrtText>
      </div>
      <CrtText size={260} style={{marginTop: 40, color: '#FFD27A', ...pop(f, 40)}}>= 23.976</CrtText>
    </AbsoluteFill>
  );
};

export const SHOT_ERA: Record<string, Era> = {
  menuScroll: 'now', bigNum: 'now', filmLook: 'now', glitchNum: 'now', versus: 'now', diff: 'now', menuHighlight: 'now',
  yearRoll: 'now', tvOn: 'crt', yearCard: 'crt', houses: 'crt', colorStandard: 'crt', condition: 'crt', bwReceive: 'crt',
  signalAdd: 'crt', signalClash: 'crt', soundMove: 'crt', tvGrid: 'crt', slowDial: 'crt', fraction: 'crt', bigCrt: 'crt',
  strike: 'crt', filmToTv: 'crt', filmSlow: 'crt', equation: 'crt', sepiaFlash: 'sepia', sepiaTease: 'sepia',
};

export const SHOTS: Record<string, React.FC<any>> = {
  menuScroll: MenuScroll, bigNum: BigNum, filmLook: FilmLook, glitchNum: GlitchNum, frameCount: FrameCount, versus: Versus,
  diff: Diff, menuHighlight: MenuHighlight, yearRoll: YearRoll, tvOn: TvOn, sepiaFlash: SepiaFlash, sepiaTease: SepiaTease,
  yearCard: YearCard, houses: Houses, colorStandard: ColorStandard, condition: Condition, bwReceive: BwReceive,
  signalAdd: SignalAdd, signalClash: SignalClash, soundMove: SoundMove, tvGrid: TvGrid, slowDial: SlowDial,
  fraction: Fraction, bigCrt: BigCrt, strike: Strike, filmToTv: FilmToTv, filmSlow: FilmSlow, equation: Equation,
};
