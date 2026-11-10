import React from 'react';
import {AbsoluteFill, Sequence, useCurrentFrame, interpolate} from 'remotion';
import {Episode as Ep, Scene} from './types';
import {C, FONT, prog, fitOneLine} from './theme';
import {RenderVisual} from './visuals';
import {chunkFrames, layout, SCENE_LEAD, OVERLAP} from './timing';

/** *단어* 부분은 그라데이션 강조 */
const marked = (t: string) =>
  t.split(/(\*[^*]+\*)/g).map((p, i) =>
    p.startsWith('*') ? (
      <span key={i} style={{background: C.grad, WebkitBackgroundClip: 'text', color: 'transparent'}}>
        {p.slice(1, -1)}
      </span>
    ) : (
      <span key={i}>{p}</span>
    ),
  );

/** 검은 바탕 위 빛 번짐. 천천히 위치가 움직인다 */
const Glow: React.FC = () => {
  const f = useCurrentFrame();
  const x = Math.sin(f / 90) * 60;
  const y = Math.cos(f / 110) * 50;
  return (
    <AbsoluteFill style={{background: C.bg}}>
      <div
        style={{
          position: 'absolute',
          width: 1000,
          height: 1000,
          left: 40 + x,
          top: 560 + y,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(90,110,255,0.42), rgba(170,70,255,0.16) 45%, transparent 70%)',
          filter: 'blur(50px)',
        }}
      />
    </AbsoluteFill>
  );
};

/** 상단 고정: 알약 라벨 + 한 줄 제목 */
const TopTitle: React.FC<{ep: Ep}> = ({ep}) => {
  const f = useCurrentFrame();
  const p = prog(f, 0, 12);
  const size = fitOneLine(ep.title, 920, 80);
  return (
    <div style={{position: 'absolute', top: 220, left: 80, right: 80, textAlign: 'center', fontFamily: FONT, color: C.text, opacity: p}}>
      <div
        style={{
          display: 'inline-block',
          padding: '10px 28px',
          borderRadius: 40,
          background: 'rgba(255,255,255,0.1)',
          border: `1px solid ${C.cardLine}`,
          fontWeight: 700,
          fontSize: 28,
        }}
      >
        {ep.tag}
      </div>
      <div style={{fontWeight: 900, fontSize: size, letterSpacing: -3, marginTop: 24, whiteSpace: 'nowrap'}}>{ep.title}</div>
    </div>
  );
};

/** 상단 가운데 말자막. 새 마디는 4프레임 동안 올라오며 나타난다 */
const TopCaption: React.FC<{captions: string[]}> = ({captions}) => {
  const f = useCurrentFrame();
  let t = SCENE_LEAD;
  let idx = -1;
  let local = 0;
  captions.forEach((c, i) => {
    if (f >= t) {
      idx = i;
      local = f - t;
    }
    t += chunkFrames(c);
  });
  if (idx < 0) return null;
  const p = interpolate(local, [0, 4], [0, 1], {extrapolateRight: 'clamp'});
  return (
    <div
      style={{
        position: 'absolute',
        top: 420,
        left: 70,
        right: 70,
        textAlign: 'center',
        fontFamily: FONT,
        fontWeight: 700,
        fontSize: 54,
        lineHeight: 1.38,
        color: C.sub,
        letterSpacing: -1,
        opacity: p,
        transform: `translateY(${(1 - p) * 14}px)`,
        wordBreak: 'keep-all',
      }}
    >
      {marked(captions[idx])}
    </div>
  );
};

/** 가운데 반투명 카드. 들어올 때 살짝 커지고, 나갈 때 흐려진다 */
export const GlassCard: React.FC<{dur: number; children: React.ReactNode; title?: string}> = ({dur, children, title}) => {
  const f = useCurrentFrame();
  const inP = prog(f, 0, SCENE_LEAD);
  const outP = interpolate(f, [dur - OVERLAP, dur], [1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  return (
    <div
      style={{
        position: 'absolute',
        left: 90,
        right: 90,
        top: 690,
        height: 720,
        borderRadius: 48,
        background: C.card,
        border: `1px solid ${C.cardLine}`,
        backdropFilter: 'blur(20px)',
        opacity: inP * outP,
        transform: `scale(${0.96 + 0.04 * inP})`,
        fontFamily: FONT,
        color: C.text,
        overflow: 'hidden',
      }}
    >
      {title && (
        <div style={{position: 'absolute', top: 44, left: 52, right: 52, fontWeight: 900, fontSize: 40, letterSpacing: -1}}>{title}</div>
      )}
      <div style={{position: 'absolute', top: title ? 120 : 40, left: 52, right: 52, bottom: 40, display: 'flex', flexDirection: 'column', justifyContent: 'center'}}>
        <div>{children}</div>
      </div>
    </div>
  );
};

const SceneView: React.FC<{s: Scene; dur: number}> = ({s, dur}) => (
  <AbsoluteFill>
    <GlassCard dur={dur} title={s.step}>
      <RenderVisual v={s.visual} />
    </GlassCard>
    <TopCaption captions={s.captions} />
  </AbsoluteFill>
);

const Outro: React.FC<{ep: Ep}> = ({ep}) => {
  const f = useCurrentFrame();
  return (
    <GlassCard dur={9999}>
      <div style={{display: 'flex', flexDirection: 'column', justifyContent: 'center', height: '100%', textAlign: 'center'}}>
        {ep.outro.map((t, i) => (
          <div
            key={i}
            style={{
              fontWeight: i === 0 ? 900 : 700,
              fontSize: i === 0 ? 60 : 40,
              color: i === 0 ? C.text : C.sub,
              marginTop: i ? 28 : 0,
              opacity: prog(f, 4 + i * 8, 12),
              wordBreak: 'keep-all',
              lineHeight: 1.35,
            }}
          >
            {marked(t)}
          </div>
        ))}
      </div>
    </GlassCard>
  );
};

export const EpisodeVideo: React.FC<{ep: Ep}> = ({ep}) => {
  const {segs} = layout(ep);
  const last = segs[segs.length - 1];
  return (
    <AbsoluteFill>
      <Glow />
      <TopTitle ep={ep} />
      {ep.scenes.map((s, i) => (
        <Sequence key={i} from={segs[i].from} durationInFrames={segs[i].dur}>
          <SceneView s={s} dur={segs[i].dur} />
        </Sequence>
      ))}
      <Sequence from={last.from} durationInFrames={last.dur}>
        <Outro ep={ep} />
      </Sequence>
    </AbsoluteFill>
  );
};
