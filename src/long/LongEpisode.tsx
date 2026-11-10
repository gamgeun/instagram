import React from 'react';
import {AbsoluteFill, Audio, Sequence, staticFile, useCurrentFrame, interpolate} from 'remotion';
import {EraBg, ChapterLabel, Subtitle, Era} from './eras';
import {SHOTS, SHOT_ERA} from './shots';

export type Beat = {sub: string; shot: string; opt: any; start: number; end: number};
export type Timeline = {duration: number; beats: Beat[]};
export const LFPS = 30;

/** 컷 안 카메라: 컷 길이 내내 3%만 천천히 다가간다. 컷 중간 급확대는 멀미가 나서 뺐다 */
const Cam: React.FC<{dur: number; seed: number; children: React.ReactNode}> = ({dur, children}) => {
  const f = useCurrentFrame();
  const s = 1 + (f / dur) * 0.03;
  return <AbsoluteFill style={{transform: `scale(${s})`}}>{children}</AbsoluteFill>;
};

/** 시대가 바뀌는 컷 첫 3프레임은 밝게 번쩍인다 */
const Flash: React.FC = () => {
  const f = useCurrentFrame();
  const o = interpolate(f, [0, 3], [0.8, 0], {extrapolateRight: 'clamp'});
  return <AbsoluteFill style={{background: '#fff', opacity: o, zIndex: 30}} />;
};

export const LongEpisode: React.FC<{tl: Timeline; audio: string}> = ({tl, audio}) => {
  let prevEra: Era | null = null;
  return (
    <AbsoluteFill style={{background: '#000'}}>
      <Audio src={staticFile(audio)} />
      {tl.beats.map((b, i) => {
        const from = Math.round(b.start * LFPS);
        const dur = Math.max(1, Math.round(b.end * LFPS) - from);
        const era: Era = (b.opt?.era as Era) ?? SHOT_ERA[b.shot] ?? 'now';
        const changed = prevEra !== null && prevEra !== era;
        prevEra = era;
        const Shot = SHOTS[b.shot];
        return (
          <Sequence key={i} from={from} durationInFrames={dur}>
            <EraBg era={era} />
            <Cam dur={dur} seed={i}>
              <Shot dur={dur} opt={b.opt ?? {}} era={era} />
            </Cam>
            <ChapterLabel era={era} />
            <Subtitle text={b.sub} />
            {changed && <Flash />}
          </Sequence>
        );
      })}
    </AbsoluteFill>
  );
};
