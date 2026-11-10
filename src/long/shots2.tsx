import React from 'react';
import {AbsoluteFill, useCurrentFrame, interpolate, Easing, random} from 'remotion';
import {FONT} from '../theme';
import {Era, MONO, SERIF} from './eras';
import {Person, RetroTv} from './people';

type P = {dur: number; opt: any; marks?: number[]; lineMarks?: number[]};
const center: React.CSSProperties = {display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column'};
const ease = (f: number, a: number, b: number) => interpolate(f, [a, b], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.out(Easing.cubic)});
const pop = (f: number, s = 0) => ({opacity: ease(f, s, s + 6), transform: `scale(${0.88 + 0.12 * ease(f, s, s + 8)})`});
const GRAD = 'linear-gradient(90deg,#8E9BFF,#C77DFF)';
const Grad: React.FC<{size: number; children: React.ReactNode; style?: React.CSSProperties}> = ({size, children, style}) => (
  <div style={{fontFamily: FONT, fontWeight: 900, fontSize: size, lineHeight: 1, letterSpacing: -size * 0.03, background: GRAD, WebkitBackgroundClip: 'text', color: 'transparent', whiteSpace: 'nowrap', ...style}}>{children}</div>
);
const Crt: React.FC<{size: number; children: React.ReactNode; style?: React.CSSProperties}> = ({size, children, style}) => (
  <div style={{fontFamily: MONO, fontSize: size, color: '#c9fff4', lineHeight: 1, whiteSpace: 'nowrap', textShadow: '0 0 26px rgba(120,255,230,.5)', ...style}}>{children}</div>
);
const INK = '#3b2614';
const Serif: React.FC<{size: number; children: React.ReactNode; style?: React.CSSProperties; w?: number}> = ({size, children, style, w = 900}) => (
  <div style={{fontFamily: SERIF, fontWeight: w, fontSize: size, color: INK, lineHeight: 1.1, whiteSpace: 'nowrap', ...style}}>{children}</div>
);
const Card: React.FC<{children: React.ReactNode; style?: React.CSSProperties}> = ({children, style}) => (
  <div style={{borderRadius: 40, background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.16)', padding: '40px 50px', ...style}}>{children}</div>
);
const at = (marks: number[] | undefined, k: number, fb: number) => (marks && marks[k] !== undefined ? marks[k] : fb);

/* ===================== 2장 보강 ===================== */
/** CBS 방식: 원판이 도는 컬러 TV → 흑백 TV에는 화면이 안 나옴 → 철회 도장 */
const CbsWithdraw: React.FC<P> = ({dur, marks}) => {
  const f = useCurrentFrame();
  const m1 = at(marks, 0, dur * 0.4);
  const m2 = at(marks, 1, dur * 0.7);
  return (
    <AbsoluteFill style={{...center, flexDirection: 'row', gap: 120}}>
      <div style={{...center, ...pop(f)}}>
        <div style={{position: 'relative', width: 380, height: 380}}>
          {/* 색 원판 */}
          <div style={{position: 'absolute', inset: 0, borderRadius: '50%', background: 'conic-gradient(#e05050 0 120deg,#50c060 0 240deg,#5070e0 0)', transform: `rotate(${f * 14}deg)`, opacity: 0.9}} />
          <div style={{position: 'absolute', inset: 150, borderRadius: '50%', background: '#0b2a2f'}} />
        </div>
        <Crt size={56} style={{marginTop: 30}}>CBS · 1950</Crt>
      </div>
      <div style={{...center, opacity: ease(f, m1 - 6, m1 + 4)}}>
        <RetroTv w={380} on={0.15} />
        <div style={{fontFamily: FONT, fontWeight: 900, fontSize: 52, color: '#FF7A8A', marginTop: 10}}>흑백 TV ✕</div>
      </div>
      <div style={{position: 'absolute', top: 200, right: 260, padding: '10px 36px', border: '6px solid #FF7A8A', color: '#FF7A8A', fontFamily: FONT, fontWeight: 900, fontSize: 64, transform: `rotate(-8deg) scale(${1.5 - 0.5 * ease(f, m2, m2 + 6)})`, opacity: ease(f, m2, m2 + 4)}}>1953.3 철회</div>
    </AbsoluteFill>
  );
};

/** 흑백 TV 화면 위에 점무늬가 번진다 */
const DotPattern: React.FC<P> = ({dur, marks}) => {
  const f = useCurrentFrame();
  const m = at(marks, 0, dur * 0.4);
  const dots = ease(f, m - 4, m + 14);
  return (
    <AbsoluteFill style={{...center, flexDirection: 'row', gap: 90}}>
      <div style={{...center, gap: 30, opacity: ease(f, 0, 8)}}>
        <div style={{display: 'flex', alignItems: 'center', gap: 24}}>
          <Crt size={60} style={{color: '#ff6fb5'}}>색 3.58</Crt>
        </div>
        <div style={{width: 360, height: 6, background: 'linear-gradient(90deg,#ff6fb5,#FFD27A)'}} />
        <Crt size={60} style={{color: '#FFD27A'}}>소리 4.5</Crt>
        <Crt size={36} style={{color: '#8FE9DC'}}>MHz · 차이 약 0.92</Crt>
      </div>
      <div style={{position: 'relative'}}>
        <RetroTv w={640} />
        <div style={{position: 'absolute', left: 640 * 0.08, top: 640 * 0.08, width: 640 * 0.62, height: 640 * 0.62, borderRadius: `${64}px/${51}px`, overflow: 'hidden', opacity: dots}}>
          <AbsoluteFill style={{background: 'radial-gradient(circle, rgba(20,40,40,.85) 1.6px, transparent 2.2px) 0 0/12px 9px', transform: `translateX(${(f * 2) % 12}px)`}} />
        </div>
        <div style={{position: 'absolute', left: 0, right: 0, bottom: -10, textAlign: 'center', fontFamily: FONT, fontWeight: 900, fontSize: 60, color: '#FF7A8A', opacity: dots}}>점무늬</div>
      </div>
    </AbsoluteFill>
  );
};

/* ===================== 3장 1927 (세피아) ===================== */
/** 손잡이를 돌리는 촬영기사 실루엣 */
const Crank: React.FC<P> = () => {
  const f = useCurrentFrame();
  const a = f * 18;
  return (
    <AbsoluteFill style={center}>
      <div style={{position: 'relative', width: 1100, height: 700}}>
        {/* 삼각대 */}
        {[-14, 14].map((r) => (
          <div key={r} style={{position: 'absolute', left: 430, top: 380, width: 16, height: 320, background: INK, transform: `rotate(${r}deg)`, transformOrigin: 'top'}} />
        ))}
        {/* 카메라 몸통 + 필름 통 */}
        <div style={{position: 'absolute', left: 300, top: 230, width: 300, height: 170, background: INK, borderRadius: 12}} />
        <div style={{position: 'absolute', left: 290, top: 60, width: 170, height: 170, borderRadius: '50%', border: `22px solid ${INK}`, transform: `rotate(${a}deg)`}}>
          <div style={{position: 'absolute', left: '50%', top: 0, bottom: 0, width: 10, marginLeft: -5, background: INK}} />
        </div>
        <div style={{position: 'absolute', left: 600, top: 270, width: 110, height: 90, background: INK, borderRadius: '0 18px 18px 0'}} />
        {/* 손잡이 */}
        <div style={{position: 'absolute', left: 250, top: 300, width: 0, height: 0, transform: `rotate(${a}deg)`}}>
          <div style={{position: 'absolute', left: 0, top: -6, width: 80, height: 12, background: INK, borderRadius: 6}} />
          <div style={{position: 'absolute', left: 70, top: -14, width: 28, height: 28, borderRadius: '50%', background: INK}} />
        </div>
        {/* 촬영기사 */}
        <div style={{position: 'absolute', left: 30, top: 200}}><Person kind="dad" h={500} color={INK} rim="rgba(60,35,15,0.0)" nod={2} /></div>
        <div style={{position: 'absolute', right: 40, top: 120, ...center, opacity: ease(f, 10, 22)}}>
          <Serif size={140}>1920s</Serif>
          <Serif size={50} w={700} style={{marginTop: 10}}>손으로 돌려 찍기</Serif>
        </div>
      </div>
    </AbsoluteFill>
  );
};

/** 극장마다 다른 영사 속도 (1분에 몇 피트) */
const SpeedBars: React.FC<P> = ({dur, marks}) => {
  const f = useCurrentFrame();
  const m = at(marks, 0, dur * 0.4);
  const rows = [
    {label: '큰 개봉관', ft: 85, show: m},
    {label: '작은 극장', ft: 110, show: m + 10},
  ];
  return (
    <AbsoluteFill style={center}>
      <div style={{width: 1300}}>
        {rows.map((r, i) => {
          const p = ease(f, r.show, r.show + 20);
          return (
            <div key={i} style={{display: 'flex', alignItems: 'center', gap: 40, marginBottom: 70, opacity: ease(f, r.show - 4, r.show + 4)}}>
              <Serif size={60} w={700} style={{width: 300}}>{r.label}</Serif>
              <div style={{flex: 1, height: 70, border: `4px solid ${INK}`, position: 'relative'}}>
                <div style={{position: 'absolute', left: 0, top: 0, bottom: 0, width: `${(r.ft / 120) * 100 * p}%`, background: INK, opacity: 0.85}} />
              </div>
              <Serif size={60} style={{width: 260}}>{i === 0 ? '80~90' : '100+'}</Serif>
            </div>
          );
        })}
        <div style={{display: 'flex', justifyContent: 'space-between', opacity: ease(f, 0, 10)}}>
          <Serif size={44} w={700}>영사기마다 다른 속도</Serif>
          <Serif size={44} w={700}>피트 / 1분</Serif>
        </div>
      </div>
    </AbsoluteFill>
  );
};

/** 바이타폰: 레코드판과 영사기가 축으로 이어져 함께 돈다 */
const Vitaphone: React.FC<P> = ({dur, lineMarks}) => {
  const f = useCurrentFrame();
  const m = at(lineMarks, 0, dur * 0.6); // 둘째 문장: 한 면 11분
  const spin = f * 6;
  return (
    <AbsoluteFill style={{...center, flexDirection: 'row', gap: 80}}>
      <div style={{...center, ...pop(f)}}>
        <div style={{width: 460, height: 460, borderRadius: '50%', background: `repeating-radial-gradient(circle, #2a1a0c 0 3px, #3b2614 3px 7px)`, transform: `rotate(${spin}deg)`, position: 'relative'}}>
          <div style={{position: 'absolute', inset: 170, borderRadius: '50%', background: '#c9b07f'}} />
          <div style={{position: 'absolute', left: 225, top: 40, width: 10, height: 60, background: '#c9b07f'}} />
        </div>
        <Serif size={48} w={700} style={{marginTop: 24}}>레코드판 · 33⅓ rpm</Serif>
      </div>
      <div style={{width: 160, height: 12, background: INK, opacity: ease(f, 6, 14)}} />
      <div style={{...center, opacity: ease(f, 8, 16)}}>
        <div style={{display: 'flex', gap: 30}}>
          {[0, 1].map((k) => (
            <div key={k} style={{width: 200, height: 200, borderRadius: '50%', border: `18px solid ${INK}`, transform: `rotate(${spin * 1.3}deg)`, position: 'relative'}}>
              <div style={{position: 'absolute', left: '50%', top: 0, bottom: 0, width: 10, marginLeft: -5, background: INK}} />
            </div>
          ))}
        </div>
        <div style={{width: 420, height: 160, background: INK, borderRadius: 14, marginTop: -20}} />
        <Serif size={48} w={700} style={{marginTop: 24}}>영사기</Serif>
      </div>
      <div style={{position: 'absolute', top: 130, padding: '14px 40px', background: 'rgba(59,38,20,0.9)', borderRadius: 14, opacity: ease(f, m - 6, m + 4)}}>
        <Serif size={64} style={{color: '#f0dfb8'}}>한 면 11분 = 필름 한 릴</Serif>
      </div>
    </AbsoluteFill>
  );
};

/** 입 모양과 소리가 어긋난다 */
const SyncDrift: React.FC<P> = ({dur, marks}) => {
  const f = useCurrentFrame();
  const m = at(marks, 1, dur * 0.6);
  const off = interpolate(f, [0, m], [0, 160], {extrapolateRight: 'clamp'});
  const lock = ease(f, m, m + 14);
  const shift = off * (1 - lock);
  const wave = (k: number) => 30 + Math.abs(Math.sin((f + k) / 3)) * 70;
  return (
    <AbsoluteFill style={center}>
      <div style={{width: 1300, position: 'relative', height: 440}}>
        <Serif size={44} w={700}>화면 (입 모양)</Serif>
        <div style={{display: 'flex', gap: 14, marginTop: 14}}>
          {Array.from({length: 14}).map((_, i) => (
            <div key={i} style={{width: 78, height: 110, background: '#d9c39a', border: `4px solid ${INK}`, ...center}}>
              <div style={{width: 34, height: 6 + ((i % 3) * 14), borderRadius: 20, background: INK}} />
            </div>
          ))}
        </div>
        <Serif size={44} w={700} style={{marginTop: 40}}>소리 (레코드판)</Serif>
        <div style={{display: 'flex', gap: 14, marginTop: 14, transform: `translateX(${shift}px)`}}>
          {Array.from({length: 14}).map((_, i) => (
            <div key={i} style={{width: 78, height: 110, ...center}}>
              <div style={{width: 18, height: wave(i * 5), background: INK, borderRadius: 9}} />
            </div>
          ))}
        </div>
        <div style={{position: 'absolute', right: 0, top: -10, fontFamily: SERIF, fontWeight: 900, fontSize: 64, color: lock > 0.5 ? '#2f6b3a' : '#a3301f'}}>{lock > 0.5 ? '속도 하나로' : '어긋남'}</div>
      </div>
    </AbsoluteFill>
  );
};

/** 기술자와 영사 기사의 대화 장면 */
const EngineerAsk: React.FC<P> = () => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={center}>
      <div style={{position: 'relative', width: 1500, height: 760}}>
        <div style={{position: 'absolute', left: 140, bottom: 0}}><Person kind="engineer" h={600} color={INK} rim="rgba(0,0,0,0)" nod={1} /></div>
        <div style={{position: 'absolute', right: 160, bottom: 0, transform: 'scaleX(-1)'}}><Person kind="dad" h={560} color={INK} rim="rgba(0,0,0,0)" nod={4} /></div>
        {/* 영사기 */}
        <div style={{position: 'absolute', right: 520, bottom: 170, width: 220, height: 130, background: INK, borderRadius: 12, opacity: 0.85}} />
        <div style={{position: 'absolute', right: 560, bottom: 300, width: 130, height: 130, borderRadius: '50%', border: `14px solid ${INK}`, transform: `rotate(${f * 8}deg)`, opacity: 0.85}} />
        <div style={{position: 'absolute', left: 150, top: 10, ...center, opacity: ease(f, 4, 12)}}>
          <Serif size={56}>스탠리 왓킨스</Serif>
          <Serif size={36} w={700} style={{marginTop: 6}}>웨스턴 일렉트릭 기술자</Serif>
        </div>
        <div style={{position: 'absolute', right: 130, top: 10, ...center, opacity: ease(f, 10, 18)}}>
          <Serif size={56}>영사 기사</Serif>
        </div>
        {/* 말풍선 */}
        <div style={{position: 'absolute', left: 560, top: 150, padding: '22px 40px', background: '#f0dfb8', border: `5px solid ${INK}`, borderRadius: 30, opacity: ease(f, 16, 24)}}>
          <Serif size={58}>1분에 몇 피트?</Serif>
        </div>
      </div>
    </AbsoluteFill>
  );
};

/** 90피트 결정 + "짐작이었다" 인용 */
const Ninety: React.FC<P> = ({dur, marks}) => {
  const f = useCurrentFrame();
  const m = at(marks, 1, dur * 0.5);
  const q = ease(f, m - 4, m + 8);
  return (
    <AbsoluteFill style={center}>
      <div style={{...center, transform: `translateY(${-q * 170}px) scale(${1 - q * 0.3})`}}>
        <Serif size={330} style={pop(f)}>90</Serif>
        <Serif size={70} w={700}>피트 / 1분</Serif>
      </div>
      <div style={{position: 'absolute', bottom: 240, padding: '26px 50px', background: 'rgba(240,223,184,0.95)', borderLeft: `14px solid ${INK}`, opacity: q, transform: `translateY(${(1 - q) * 30}px)`}}>
        <Serif size={56}>“That had to be a good guess.”</Serif>
        <Serif size={32} w={700} style={{marginTop: 12}}>스탠리 왓킨스, 1970년 인터뷰 · “짐작일 수밖에 없었다”</Serif>
      </div>
    </AbsoluteFill>
  );
};

/** 90피트 × 16장 ÷ 60초 = 24 */
const FilmCalc: React.FC<P> = ({dur, marks}) => {
  const f = useCurrentFrame();
  const m = at(marks, 1, dur * 0.5);
  return (
    <AbsoluteFill style={center}>
      <div style={{display: 'flex', alignItems: 'center', gap: 30, opacity: ease(f, 0, 8)}}>
        {/* 1피트 = 16장 */}
        <div style={{display: 'grid', gridTemplateColumns: 'repeat(8, 46px)', gap: 8, padding: 16, background: '#1b120a'}}>
          {Array.from({length: 16}).map((_, i) => (
            <div key={i} style={{width: 46, height: 34, background: '#d9c39a', opacity: ease(f, i * 1.2, i * 1.2 + 4)}} />
          ))}
        </div>
        <Serif size={64}>1피트 = 16장</Serif>
      </div>
      <div style={{display: 'flex', alignItems: 'baseline', gap: 30, marginTop: 70, opacity: ease(f, m - 4, m + 6)}}>
        <Serif size={100}>90 × 16 ÷ 60</Serif>
        <Serif size={100}>=</Serif>
        <Serif size={190} style={{color: '#7a3510', ...pop(f, m + 10)}}>24</Serif>
      </div>
    </AbsoluteFill>
  );
};

/** 디스크 방식과 필름 방식 모두 24 */
const Movietone: React.FC<P> = ({dur, marks}) => {
  const f = useCurrentFrame();
  const m = at(marks, 1, dur * 0.55);
  const box = (title: string, sub: string, s: number) => (
    <div style={{...center, width: 520, padding: '40px 0', border: `5px solid ${INK}`, background: 'rgba(240,223,184,0.6)', opacity: ease(f, s, s + 8)}}>
      <Serif size={64}>{title}</Serif>
      <Serif size={36} w={700} style={{marginTop: 10}}>{sub}</Serif>
      <Serif size={140} style={{marginTop: 20}}>24</Serif>
    </div>
  );
  return (
    <AbsoluteFill style={center}>
      <div style={{display: 'flex', gap: 80}}>
        {box('바이타폰', '소리를 레코드판에', 0)}
        {box('무비톤', '소리를 필름에', 8)}
      </div>
      <div style={{marginTop: 50, padding: '12px 40px', background: INK, opacity: ease(f, m - 4, m + 6)}}>
        <Serif size={60} style={{color: '#f0dfb8'}}>유성영화 표준 · 1초에 24장</Serif>
      </div>
    </AbsoluteFill>
  );
};

/* ===================== 4장 지금 ===================== */
/** 1927 → 1953 → 지금, 숫자가 바뀌어 온 길 */
const Chain: React.FC<P> = ({dur}) => {
  const f = useCurrentFrame();
  const steps = [
    {y: '1927', v: '24', c: '#d9c39a'},
    {y: '1953', v: '× 1000/1001', c: '#8FE9DC'},
    {y: '지금', v: '23.976', c: '#C77DFF'},
  ];
  const seg = dur / 3.4;
  return (
    <AbsoluteFill style={{...center, flexDirection: 'row', gap: 40}}>
      {steps.map((s, i) => {
        const t = i * seg;
        return (
          <React.Fragment key={i}>
            {i > 0 && <div style={{width: 120 * ease(f, t - 8, t), height: 6, background: 'rgba(255,255,255,.5)'}} />}
            <div style={{...center, opacity: ease(f, t, t + 8), transform: `translateY(${(1 - ease(f, t, t + 10)) * 40}px)`}}>
              <div style={{fontFamily: MONO, fontSize: 48, color: 'rgba(255,255,255,.6)'}}>{s.y}</div>
              <div style={{fontFamily: i === 1 ? MONO : FONT, fontWeight: 900, fontSize: i === 1 ? 88 : 150, color: s.c, marginTop: 16, whiteSpace: 'nowrap'}}>{s.v}</div>
            </div>
          </React.Fragment>
        );
      })}
    </AbsoluteFill>
  );
};

/** 용도별 고르기: 극장 = 24, 유튜브·SNS = 아무거나, 단 통일 */
const Choose: React.FC<P> = ({dur, marks, lineMarks}) => {
  const f = useCurrentFrame();
  const m = at(lineMarks, 0, dur * 0.5); // 둘째 문장(유튜브)부터 둘째 카드
  const card = (title: string, value: string, note: string, s: number) => (
    <Card style={{width: 640, ...center, opacity: ease(f, s, s + 8), transform: `translateY(${(1 - ease(f, s, s + 10)) * 40}px)`}}>
      <div style={{fontFamily: FONT, fontWeight: 700, fontSize: 50, color: 'rgba(255,255,255,.75)', marginTop: 10}}>{title}</div>
      <Grad size={150} style={{marginTop: 20}}>{value}</Grad>
      <div style={{fontFamily: FONT, fontWeight: 700, fontSize: 38, color: 'rgba(255,255,255,.6)', marginTop: 18}}>{note}</div>
    </Card>
  );
  return (
    <AbsoluteFill style={{...center, flexDirection: 'row', gap: 70}}>
      {card('극장 상영', '24', '23.98은 받지 않음', at(marks, 0, 10))}
      {card('유튜브 · SNS', '23.98 / 24', '한 작업 안에서 통일', m)}
    </AbsoluteFill>
  );
};

/** 24와 23.98을 섞으면 소리가 밀린다 */
const Drift: React.FC<P> = ({dur, marks}) => {
  const f = useCurrentFrame();
  const m = at(marks, 1, dur * 0.4);
  const p = interpolate(f, [m, dur - 10], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const W = 1400;
  return (
    <AbsoluteFill style={center}>
      <div style={{width: W, position: 'relative'}}>
        {['영상 24', '소리 23.98'].map((l, i) => (
          <div key={i} style={{display: 'flex', alignItems: 'center', gap: 30, marginBottom: 50}}>
            <div style={{width: 260, fontFamily: FONT, fontWeight: 700, fontSize: 44, color: '#fff'}}>{l}</div>
            <div style={{flex: 1, height: 70, borderRadius: 14, background: 'rgba(255,255,255,.08)', position: 'relative', overflow: 'hidden'}}>
              <div style={{position: 'absolute', left: 0, top: 0, bottom: 0, width: `${p * (i === 0 ? 100 : 99.9 - 6 * p) }%`, background: i === 0 ? GRAD : 'rgba(255,210,122,.8)'}} />
            </div>
          </div>
        ))}
        <div style={{display: 'flex', justifyContent: 'space-between', marginTop: 10, fontFamily: MONO, fontSize: 36, color: 'rgba(255,255,255,.6)'}}>
          <span>0분</span><span>60분</span>
        </div>
        <div style={{position: 'absolute', right: 0, top: -150, textAlign: 'right', opacity: ease(f, m + 20, m + 34)}}>
          <Grad size={140}>3.6초</Grad>
          <div style={{fontFamily: FONT, fontWeight: 700, fontSize: 40, color: 'rgba(255,255,255,.7)'}}>1시간에 어긋나는 시간</div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

/** 카메라 두 대의 프레임레이트를 맞춘다 */
const TwoCams: React.FC<P> = ({dur}) => {
  const f = useCurrentFrame();
  const sync = ease(f, dur * 0.35, dur * 0.5);
  const cam = (name: string, start: string) => (
    <Card style={{width: 560, ...center}}>
      <div style={{width: 300, height: 180, borderRadius: 20, border: '6px solid #fff', position: 'relative'}}>
        <div style={{position: 'absolute', left: 90, top: 30, width: 120, height: 120, borderRadius: '50%', border: '6px solid #fff'}} />
      </div>
      <div style={{fontFamily: FONT, fontWeight: 700, fontSize: 46, color: '#fff', marginTop: 24}}>{name}</div>
      <div style={{fontFamily: MONO, fontSize: 80, marginTop: 14, color: sync > 0.5 ? '#7CF5B4' : '#FF7A8A', whiteSpace: 'nowrap'}}>{sync > 0.5 ? '23.98p' : start}</div>
    </Card>
  );
  return (
    <AbsoluteFill style={{...center, flexDirection: 'row', gap: 80}}>
      {cam('카메라 A', '23.98p')}
      <div style={{fontFamily: FONT, fontWeight: 900, fontSize: 120, color: sync > 0.5 ? '#7CF5B4' : '#FF7A8A'}}>{sync > 0.5 ? '=' : '≠'}</div>
      {cam('카메라 B', '24p')}
    </AbsoluteFill>
  );
};

/** 셔터 1/60: 실내 조명 깜빡임 */
const Shutter60: React.FC<P> = ({dur, marks}) => {
  const f = useCurrentFrame();
  const m = at(marks, 1, dur * 0.45);
  const band = (f * 11) % 520;
  const room = (bad: boolean) => (
    <div style={{position: 'relative', width: 620, height: 400, borderRadius: 26, overflow: 'hidden', background: 'linear-gradient(180deg,#3a3446,#1c1a24)', border: '1px solid rgba(255,255,255,.16)'}}>
      <div style={{position: 'absolute', left: 250, top: 40, width: 120, height: 120, borderRadius: '50%', background: '#ffe6a8', boxShadow: '0 0 80px #ffd27a'}} />
      <div style={{position: 'absolute', left: 230, bottom: 0}}><Person kind="mom" h={230} color="#0d0c12" rim="rgba(255,220,150,.5)" /></div>
      {bad && <div style={{position: 'absolute', left: 0, right: 0, top: band - 120, height: 140, background: 'linear-gradient(180deg,transparent,rgba(0,0,0,.6),transparent)'}} />}
    </div>
  );
  return (
    <AbsoluteFill style={{...center, flexDirection: 'row', gap: 70}}>
      <div style={{...center, opacity: ease(f, m - 6, m + 4)}}>
        {room(true)}
        <div style={{fontFamily: MONO, fontSize: 64, color: '#FF7A8A', marginTop: 20}}>1/50 · 깜빡임</div>
      </div>
      <div style={{...center, ...pop(f)}}>
        {room(false)}
        <div style={{fontFamily: MONO, fontSize: 64, color: '#7CF5B4', marginTop: 20}}>1/60 · 깨끗함</div>
      </div>
    </AbsoluteFill>
  );
};

/** 마무리: 24 × 1000/1001 = 23.98, 다음 편 예고 */
const EndCard: React.FC<P> = ({dur, lineMarks}) => {
  const f = useCurrentFrame();
  const m = at(lineMarks, 0, dur * 0.65); // 둘째 문장(다음 편 예고)
  const next = ease(f, m, m + 12);
  return (
    <AbsoluteFill style={center}>
      <div style={{...center, opacity: 1 - next, transform: `scale(${1 - next * 0.15})`}}>
        <div style={{display: 'flex', alignItems: 'baseline', gap: 30}}>
          <div style={{fontFamily: SERIF, fontWeight: 900, fontSize: 130, color: '#d9c39a', ...pop(f)}}>24</div>
          <div style={{fontFamily: MONO, fontSize: 80, color: '#8FE9DC', opacity: ease(f, 10, 18)}}>× 1000/1001</div>
        </div>
        <Grad size={230} style={{marginTop: 30, ...pop(f, 24)}}>= 23.98</Grad>
      </div>
      <div style={{position: 'absolute', ...center, opacity: next}}>
        <div style={{fontFamily: FONT, fontWeight: 700, fontSize: 48, color: 'rgba(255,255,255,.7)'}}>다음 편</div>
        <Grad size={150} style={{marginTop: 20}}>셔터 180°</Grad>
      </div>
    </AbsoluteFill>
  );
};

export const SHOT_ERA2: Record<string, Era> = {
  cbsWithdraw: 'crt', dotPattern: 'crt',
  crank: 'sepia', speedBars: 'sepia', vitaphone: 'sepia', syncDrift: 'sepia', engineerAsk: 'sepia', ninety: 'sepia', filmCalc: 'sepia', movietone: 'sepia',
  chain: 'now', choose: 'now', drift: 'now', twoCams: 'now', shutter60: 'now', endCard: 'now',
};
export const SHOTS2: Record<string, React.FC<any>> = {
  cbsWithdraw: CbsWithdraw, dotPattern: DotPattern, crank: Crank, speedBars: SpeedBars, vitaphone: Vitaphone, syncDrift: SyncDrift,
  engineerAsk: EngineerAsk, ninety: Ninety, filmCalc: FilmCalc, movietone: Movietone, chain: Chain, choose: Choose, drift: Drift,
  twoCams: TwoCams, shutter60: Shutter60, endCard: EndCard,
};
