import React from 'react';
import {AbsoluteFill, Audio, Sequence, staticFile, useCurrentFrame, interpolate, Easing, random} from 'remotion';
import {EraBg, ChapterLabel, Subtitle, Era} from './eras';
import {SHOTS, SHOT_ERA} from './shots';

export type Beat = {sub: string; shot: string; opt: any; start: number; end: number};
export type Timeline = {duration: number; beats: Beat[]};
export const LFPS = 30;
/** 앞뒤 컷이 겹치며 바뀌는 프레임 수 (0.5초) */
const XF = 15;
/** 그림 하나의 최소 길이 (2.6초). 화면 글자 12자를 읽고, 0.5초 전환을 빼도 2초가 남는다 */
export const MIN_SHOT = 78;

type Mood = 'calm' | 'tense' | 'reveal' | 'question' | 'travel';
type Shot = {shot: string; opt: any; era: Era; from: number; to: number; marks: number[]; mood: Mood};

const DEFAULT_MOOD: Record<string, Mood> = {
  bigNum: 'reveal', strike: 'reveal', equation: 'reveal', fraction: 'reveal', bigCrt: 'reveal', diff: 'reveal',
  signalClash: 'tense', tvGrid: 'tense', glitchNum: 'tense', soundMove: 'tense',
  versus: 'question', sepiaTease: 'question',
};

/** join 표시가 붙은 마디는 앞 컷에 이어 붙여 한 그림으로 만든다 */
export const buildShots = (tl: Timeline): Shot[] => {
  const shots: Shot[] = [];
  for (const b of tl.beats) {
    const from = Math.round(b.start * LFPS);
    const to = Math.round(b.end * LFPS);
    const last = shots[shots.length - 1];
    if (b.opt?.join && last) {
      last.marks.push(from - last.from);
      last.to = to;
      continue;
    }
    const era: Era = (b.opt?.era as Era) ?? SHOT_ERA[b.shot] ?? 'now';
    shots.push({shot: b.shot, opt: b.opt ?? {}, era, from, to, marks: [], mood: (b.opt?.mood as Mood) ?? DEFAULT_MOOD[b.shot] ?? 'calm'});
  }
  // 그림 하나는 최소 MIN_SHOT 동안 보여야 화면 글자를 읽을 수 있다.
  // 짧은 컷은 같은 시대의 앞 컷에 붙이고(그림은 앞 컷 유지), 앞이 다른 시대면 뒤 컷에 붙인다.
  for (let i = 0; i < shots.length; i++) {
    const s = shots[i];
    if (s.to - s.from >= MIN_SHOT) continue;
    const prev = shots[i - 1];
    const next = shots[i + 1];
    if (prev && prev.era === s.era) {
      prev.marks.push(s.from - prev.from, ...s.marks.map((m) => m + s.from - prev.from));
      prev.to = s.to;
      shots.splice(i, 1);
      i -= 1;
    } else if (next) {
      next.marks = [next.from - s.from, ...next.marks.map((m) => m + next.from - s.from)];
      next.from = s.from;
      shots.splice(i, 1);
      i -= 1;
    }
  }
  return shots;
};

/** 내레이션 분위기에 맞춘 컷 안 움직임 */
const MoodCam: React.FC<{mood: Mood; dur: number; children: React.ReactNode}> = ({mood, dur, children}) => {
  const f = useCurrentFrame();
  const t = Math.min(1, f / dur);
  let tr = '';
  if (mood === 'calm') tr = `translateX(${(t - 0.5) * -30}px) scale(${1 + t * 0.025})`;
  if (mood === 'travel') tr = 'none';
  if (mood === 'reveal') {
    const p = interpolate(f, [0, 18], [0, 1], {extrapolateRight: 'clamp', easing: Easing.out(Easing.back(1.6))});
    tr = `scale(${0.9 + 0.1 * p + t * 0.02})`;
  }
  if (mood === 'question') tr = `scale(${1.05 - t * 0.05})`;
  if (mood === 'tense') {
    // 손으로 든 카메라처럼 아주 작게 흔들린다 (멀미 나지 않게 4px 이내)
    const k = Math.floor(f / 2);
    tr = `translate(${(random(`tx${k}`) - 0.5) * 8}px, ${(random(`ty${k}`) - 0.5) * 6}px) scale(${1.02 + t * 0.03})`;
  }
  return <AbsoluteFill style={{transform: tr}}>{children}</AbsoluteFill>;
};

/** 컷 전환: 나가는 컷은 카메라 쪽으로 다가오며 흐려지고, 들어오는 컷은 깊은 곳에서 다가온다 */
const DepthXfade: React.FC<{dur: number; first: boolean; lastShot: boolean; children: React.ReactNode}> = ({dur, first, lastShot, children}) => {
  const f = useCurrentFrame();
  const e = Easing.inOut(Easing.cubic);
  const inP = first ? 1 : interpolate(f, [0, XF], [0, 1], {extrapolateRight: 'clamp', easing: e});
  const outP = lastShot ? 0 : interpolate(f, [dur - XF, dur], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: e});
  const z = -500 * (1 - inP) + 380 * outP;
  // 나가는 컷은 겹침 앞쪽 40% 안에 사라져서, 두 컷 글자가 동시에 또렷하게 겹치지 않는다
  const op = inP * interpolate(outP, [0, 0.4], [1, 0], {extrapolateRight: 'clamp'});
  const blur = (1 - inP) * 8 + outP * 10;
  return (
    <AbsoluteFill style={{perspective: 1200}}>
      <AbsoluteFill style={{transform: `translateZ(${z}px)`, opacity: op, filter: blur > 0.3 ? `blur(${blur}px)` : undefined}}>{children}</AbsoluteFill>
    </AbsoluteFill>
  );
};

/** 시대가 바뀔 때는 배경도 겹치며 바뀐다 */
const BgFade: React.FC<{dur: number; first: boolean; children: React.ReactNode}> = ({first, children}) => {
  const f = useCurrentFrame();
  const o = first ? 1 : interpolate(f, [0, XF], [0, 1], {extrapolateRight: 'clamp'});
  return <AbsoluteFill style={{opacity: o}}>{children}</AbsoluteFill>;
};

const SubtitleTrack: React.FC<{tl: Timeline}> = ({tl}) => {
  const f = useCurrentFrame();
  const t = f / LFPS;
  const b = tl.beats.find((x) => t >= x.start && t < x.end) ?? tl.beats[tl.beats.length - 1];
  return <Subtitle text={b.sub} />;
};

const LabelTrack: React.FC<{shots: Shot[]}> = ({shots}) => {
  const f = useCurrentFrame();
  const s = [...shots].reverse().find((x) => f >= x.from + XF / 2) ?? shots[0];
  return <ChapterLabel era={s.era} />;
};

export const LongEpisode: React.FC<{tl: Timeline; audio: string}> = ({tl, audio}) => {
  const shots = buildShots(tl);
  return (
    <AbsoluteFill style={{background: '#000'}}>
      <Audio src={staticFile(audio)} />
      {shots.map((s, i) => {
        const first = i === 0;
        const lastShot = i === shots.length - 1;
        // 다음 컷과 XF 프레임 겹치도록 뒤로 늘린다
        const from = first ? 0 : s.from;
        const dur = Math.max(1, (lastShot ? s.to : s.to + XF) - from);
        const eraChanged = !first && shots[i - 1].era !== s.era;
        const Comp = SHOTS[s.shot];
        return (
          <Sequence key={i} from={from} durationInFrames={dur}>
            <BgFade dur={dur} first={first || !eraChanged}>
              <EraBg era={s.era} />
            </BgFade>
            <DepthXfade dur={dur} first={first} lastShot={lastShot}>
              <MoodCam mood={s.mood} dur={dur}>
                <Comp dur={dur} opt={s.opt} era={s.era} marks={s.marks} />
              </MoodCam>
            </DepthXfade>
          </Sequence>
        );
      })}
      <LabelTrack shots={shots} />
      <SubtitleTrack tl={tl} />
    </AbsoluteFill>
  );
};
