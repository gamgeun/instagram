/* 롱폼 시간표의 한 구간을 세로(1080x1920) 쇼츠·릴스로 자른다.
   가운데에 롱폼 화면, 위에 제목(영어+한국어), 아래에 큰 자막 */
import React from 'react';
import {AbsoluteFill, Sequence, useCurrentFrame, interpolate} from 'remotion';
import {LongEpisode, Timeline, LFPS} from './LongEpisode';
import {NOW_NUM} from './eras';

export type ShortProps = {tl: Timeline; audio: string; from: number; to: number; titleEn: string; titleKo: string; intro?: [number, number]};

const Subs: React.FC<{tl: Timeline; offset: number}> = ({tl, offset}) => {
  const f = useCurrentFrame();
  const t = (f + offset) / LFPS;
  const b = tl.beats.find((x) => t >= x.start && t < x.end);
  if (!b || !b.sub || (b.say !== undefined && t < b.say)) return null;
  return (
    <div style={{position: 'absolute', left: 60, right: 60, top: 1420, textAlign: 'center', fontFamily: "'Pretendard', sans-serif", fontWeight: 700, fontSize: 58, lineHeight: 1.35, color: '#fff', wordBreak: 'keep-all'}}>
      {b.sub}
    </div>
  );
};

/** 롱폼의 한 구간: 그림과 자막을 그 구간만큼 보여 준다 */
/** XF_A: 앞 구간과 본 구간이 겹치며 소리가 바뀌는 길이 (0.3초) */
const XF_A = 9;
const Seg: React.FC<{tl: Timeline; audio: string; fromF: number; fadeIn?: boolean; fadeOutAt?: number}> = ({tl, audio, fromF, fadeIn, fadeOutAt}) => {
  // Audio의 volume 함수는 구간이 시작된 뒤의 프레임(0부터)을 받는다 (렌더해서 확인함)
  const volume = (local: number) => {
    let v = 1;
    if (fadeIn) v *= interpolate(local, [0, XF_A], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
    if (fadeOutAt !== undefined) v *= interpolate(local, [fadeOutAt, fadeOutAt + XF_A], [1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
    return v;
  };
  return (
  <>
    <div style={{position: 'absolute', left: 0, top: 656, width: 1920, height: 1080, transform: 'scale(0.5625)', transformOrigin: '0 0', overflow: 'hidden'}}>
      <Sequence from={-fromF}>
        <LongEpisode tl={tl} audio={audio} noSubs set="v3" volume={volume} />
      </Sequence>
    </div>
    <Subs tl={tl} offset={fromF} />
  </>
  );
};

/** intro가 있으면 롱폼 첫 문장(카메라 메뉴의 23.98)을 먼저 붙이고 본 구간으로 넘어간다 */
export const LongShort: React.FC<ShortProps> = ({tl, audio, from, to, titleEn, titleKo, intro}) => {
  const f = useCurrentFrame();
  const introF = intro ? Math.round((intro[1] - intro[0]) * LFPS) : 0;
  const dur = introF + Math.round((to - from) * LFPS);
  const out = interpolate(f, [dur - 12, dur], [1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  return (
    <AbsoluteFill style={{background: '#000', opacity: out}}>
      <div style={{position: 'absolute', left: 60, right: 60, top: 230, textAlign: 'center'}}>
        <div style={{fontFamily: NOW_NUM, fontWeight: 700, fontSize: 76, lineHeight: 1.1, color: '#fff', letterSpacing: -1}}>{titleEn}</div>
        <div style={{fontFamily: "'Pretendard', sans-serif", fontWeight: 700, fontSize: 52, marginTop: 18, backgroundImage: 'linear-gradient(90deg,#8E9BFF,#C77DFF)', WebkitBackgroundClip: 'text', color: 'transparent'}}>{titleKo}</div>
      </div>
      {intro && (
        <Sequence durationInFrames={introF + XF_A}>
          <Seg tl={tl} audio={audio} fromF={Math.round(intro[0] * LFPS)} fadeOutAt={introF} />
        </Sequence>
      )}
      <Sequence from={introF}>
        <Seg tl={tl} audio={audio} fromF={Math.round(from * LFPS)} fadeIn={!!intro} />
      </Sequence>
    </AbsoluteFill>
  );
};
