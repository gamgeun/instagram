import React from 'react';
import {useCurrentFrame, interpolate} from 'remotion';
import {C, FONT_KR} from '../theme';
import {chunkFrames, SCENE_LEAD} from '../timing';

/** *단어* 로 감싼 부분은 노란색으로 칠한다 */
const renderMarked = (t: string) =>
  t.split(/(\*[^*]+\*)/g).map((part, i) =>
    part.startsWith('*') ? (
      <span key={i} style={{color: C.accent}}>
        {part.slice(1, -1)}
      </span>
    ) : (
      <span key={i}>{part}</span>
    ),
  );

/** 자막 마디를 순서대로 교체. 새 마디는 4프레임 동안 올라오며 나타난다 */
export const Caption: React.FC<{captions: string[]}> = ({captions}) => {
  const f = useCurrentFrame();
  let t = SCENE_LEAD;
  let idx = -1;
  let local = 0;
  for (let i = 0; i < captions.length; i++) {
    const d = chunkFrames(captions[i]);
    if (f >= t) {
      idx = i;
      local = f - t;
    }
    t += d;
  }
  if (idx < 0) return null;
  const p = interpolate(local, [0, 4], [0, 1], {extrapolateRight: 'clamp'});
  return (
    <div style={{position: 'absolute', left: 90, right: 90, top: 1330, height: 260}}>
      {/* 진행 눈금: 지금 몇 번째 마디인지 */}
      <div style={{display: 'flex', gap: 8, marginBottom: 22}}>
        {captions.map((_, i) => (
          <div key={i} style={{width: 34, height: 6, background: i <= idx ? C.accent : 'rgba(234,242,255,0.2)'}} />
        ))}
      </div>
      <div
        style={{
          fontFamily: FONT_KR,
          fontWeight: 700,
          fontSize: 52,
          lineHeight: 1.36,
          color: C.line,
          letterSpacing: -1,
          opacity: p,
          transform: `translateY(${(1 - p) * 16}px)`,
          wordBreak: 'keep-all',
        }}
      >
        {renderMarked(captions[idx])}
      </div>
    </div>
  );
};
