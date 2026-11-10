import React from 'react';
import {AbsoluteFill, Sequence, useCurrentFrame, interpolate} from 'remotion';
import {Episode as Ep, Scene} from './types';
import {C, FONT_KR, FONT_MONO, H, prog} from './theme';
import {Grid, Header, Heading, TitleBlock} from './blueprint/Frame';
import {Caption} from './blueprint/Caption';
import {RenderVisual} from './visuals';
import {TITLE_FRAMES, OUTRO_FRAMES, sceneFrames} from './timing';

export const WIPE = 12;

/** 새 장면이 노란 스캔선을 따라 위에서 아래로 드러난다 */
const ScanReveal: React.FC<{children: React.ReactNode; enabled?: boolean}> = ({children, enabled = true}) => {
  const f = useCurrentFrame();
  if (!enabled) return <AbsoluteFill>{children}</AbsoluteFill>;
  const p = interpolate(f, [0, WIPE], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const y = p * H;
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{clipPath: `inset(0 0 ${(1 - p) * 100}% 0)`}}>{children}</AbsoluteFill>
      {p < 1 && (
        <>
          <div style={{position: 'absolute', left: 0, right: 0, top: y - 3, height: 6, background: C.accent, boxShadow: `0 0 30px ${C.accent}`}} />
          <div style={{position: 'absolute', right: 70, top: y - 34, fontFamily: FONT_MONO, fontSize: 20, color: C.accent, letterSpacing: 3}}>
            SCAN {String(Math.round(p * 100)).padStart(3, '0')}
          </div>
        </>
      )}
    </AbsoluteFill>
  );
};

const TitleCard: React.FC<{ep: Ep}> = ({ep}) => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill>
      <Grid />
      <Header series={ep.series} id={ep.id} sheet="00" label="COVER" />
      <div style={{position: 'absolute', left: 90, right: 90, top: 640, fontFamily: FONT_KR, color: C.line}}>
        <div style={{fontFamily: FONT_MONO, fontSize: 30, color: C.accent, letterSpacing: 6, opacity: prog(f, 4, 10)}}>{ep.id}</div>
        <div
          style={{
            fontSize: 108,
            fontWeight: 900,
            lineHeight: 1.12,
            letterSpacing: -4,
            marginTop: 24,
            whiteSpace: 'pre-line',
            opacity: prog(f, 8, 12),
            transform: `translateY(${(1 - prog(f, 8, 12)) * 30}px)`,
          }}
        >
          {ep.title}
        </div>
        <div style={{height: 4, width: 900 * prog(f, 16, 18), background: C.accent, marginTop: 36}} />
        <div style={{fontSize: 42, fontWeight: 700, color: C.lineDim, marginTop: 30, opacity: prog(f, 22, 12)}}>{ep.subtitle}</div>
      </div>
      <TitleBlock id={ep.id} title={ep.title.replace(/\n/g, ' ')} date={ep.date} sheet="00" />
    </AbsoluteFill>
  );
};

const SceneView: React.FC<{ep: Ep; s: Scene; i: number}> = ({ep, s, i}) => {
  const sheet = String(i + 1).padStart(2, '0');
  return (
    <AbsoluteFill>
      <Grid />
      <Header series={ep.series} id={ep.id} sheet={sheet} label={s.label} />
      <Heading text={s.heading} />
      <RenderVisual v={s.visual} />
      <Caption captions={s.captions} />
      <TitleBlock id={ep.id} title={ep.title.replace(/\n/g, ' ')} date={ep.date} sheet={sheet} />
    </AbsoluteFill>
  );
};

const Outro: React.FC<{ep: Ep}> = ({ep}) => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill>
      <Grid />
      <Header series={ep.series} id={ep.id} sheet="END" label="NEXT SHEET" />
      <div style={{position: 'absolute', left: 90, right: 90, top: 700, fontFamily: FONT_KR, color: C.line}}>
        {ep.outro.map((t, k) => (
          <div
            key={k}
            style={{
              fontSize: k === 0 ? 76 : 44,
              fontWeight: k === 0 ? 900 : 700,
              color: k === 0 ? C.line : C.lineDim,
              marginTop: k ? 30 : 0,
              letterSpacing: -2,
              opacity: prog(f, 6 + k * 8, 12),
              wordBreak: 'keep-all',
              whiteSpace: 'pre-line',
            }}
          >
            {t}
          </div>
        ))}
        <div style={{fontFamily: FONT_MONO, fontSize: 30, letterSpacing: 6, color: C.accent, marginTop: 70, opacity: prog(f, 30, 12)}}>
          {ep.series}
        </div>
      </div>
      <TitleBlock id={ep.id} title={ep.title.replace(/\n/g, ' ')} date={ep.date} sheet="END" />
    </AbsoluteFill>
  );
};

/** 각 구간 시작 프레임. 다음 구간은 앞 구간 끝 WIPE 프레임과 겹친다 */
export const layout = (ep: Ep) => {
  const segs: {from: number; dur: number}[] = [];
  let t = 0;
  const push = (dur: number) => {
    segs.push({from: t, dur});
    t += dur - WIPE;
  };
  push(TITLE_FRAMES);
  ep.scenes.forEach((s) => push(sceneFrames(s.captions)));
  push(OUTRO_FRAMES);
  return {segs, total: t + WIPE};
};

export const EpisodeVideo: React.FC<{ep: Ep}> = ({ep}) => {
  const {segs} = layout(ep);
  return (
    <AbsoluteFill style={{background: C.bgDeep}}>
      <Sequence from={segs[0].from} durationInFrames={segs[0].dur}>
        <TitleCard ep={ep} />
      </Sequence>
      {ep.scenes.map((s, i) => (
        <Sequence key={i} from={segs[i + 1].from} durationInFrames={segs[i + 1].dur}>
          <ScanReveal>
            <SceneView ep={ep} s={s} i={i} />
          </ScanReveal>
        </Sequence>
      ))}
      <Sequence from={segs[segs.length - 1].from} durationInFrames={segs[segs.length - 1].dur}>
        <ScanReveal>
          <Outro ep={ep} />
        </ScanReveal>
      </Sequence>
    </AbsoluteFill>
  );
};
