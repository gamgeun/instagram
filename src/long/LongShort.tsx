/* 롱폼 시간표의 한 구간을 세로(1080x1920) 쇼츠·릴스로 자른다.
   가운데에 롱폼 화면, 위에 제목(영어+한국어), 아래에 큰 자막 */
import React from 'react';
import {AbsoluteFill, Sequence, useCurrentFrame, interpolate} from 'remotion';
import {LongEpisode, Timeline, LFPS} from './LongEpisode';
import {NOW_NUM} from './eras';

export type ShortProps = {tl: Timeline; audio: string; from: number; to: number; titleEn: string; titleKo: string};

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

export const LongShort: React.FC<ShortProps> = ({tl, audio, from, to, titleEn, titleKo}) => {
  const f = useCurrentFrame();
  const fromF = Math.round(from * LFPS);
  const dur = Math.round((to - from) * LFPS);
  const out = interpolate(f, [dur - 12, dur], [1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  return (
    <AbsoluteFill style={{background: '#000', opacity: out}}>
      <div style={{position: 'absolute', left: 60, right: 60, top: 230, textAlign: 'center'}}>
        <div style={{fontFamily: NOW_NUM, fontWeight: 700, fontSize: 76, lineHeight: 1.1, color: '#fff', letterSpacing: -1}}>{titleEn}</div>
        <div style={{fontFamily: "'Pretendard', sans-serif", fontWeight: 700, fontSize: 52, marginTop: 18, backgroundImage: 'linear-gradient(90deg,#8E9BFF,#C77DFF)', WebkitBackgroundClip: 'text', color: 'transparent'}}>{titleKo}</div>
      </div>
      {/* 롱폼 1920x1080을 폭 1080에 맞춰 0.5625배로 */}
      <div style={{position: 'absolute', left: 0, top: 656, width: 1920, height: 1080, transform: 'scale(0.5625)', transformOrigin: '0 0', overflow: 'hidden'}}>
        <Sequence from={-fromF}>
          <LongEpisode tl={tl} audio={audio} noSubs set="v3" />
        </Sequence>
      </div>
      <Subs tl={tl} offset={fromF} />
    </AbsoluteFill>
  );
};
