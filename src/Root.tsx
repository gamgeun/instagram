import React from 'react';
import {Composition, Still, registerRoot} from 'remotion';
import {EpisodeVideo, Cover} from './Episode';
import {layout} from './timing';
import {Episode} from './types';
import {FPS, W, H} from './theme';
import {LongEpisode, LFPS} from './long/LongEpisode';
import ep01tl from '../longform/ep01/timeline.json';
import ep01v3tl from '../longform/ep01v3/timeline.json';
import {LongShort} from './long/LongShort';
import {Thumb01} from './long/Thumb';
import {SampleSeq, SampleA, SAMPLE_FRAMES} from './long/samples';
import cq001 from '../scripts/cq-001-slog3-exposure.json';
import cq002 from '../scripts/cq-002-shutter-speed.json';

const EPISODES = [cq001, cq002] as Episode[];

const Root: React.FC = () => (
  <>
    {EPISODES.map((ep) => (
      <Composition key={ep.id} id={ep.id} component={EpisodeVideo as any} durationInFrames={layout(ep).total} fps={FPS} width={W} height={H} defaultProps={{ep}} />
    ))}
    <Composition id="LF-01" component={LongEpisode as any} durationInFrames={Math.ceil(ep01tl.duration * LFPS)} fps={LFPS} width={1920} height={1080} defaultProps={{tl: ep01tl, audio: 'ep01/mix.wav'}} />
    <Composition id="LF-01v3" component={LongEpisode as any} durationInFrames={Math.ceil(ep01v3tl.duration * LFPS)} fps={LFPS} width={1920} height={1080} defaultProps={{tl: ep01v3tl, audio: 'ep01v3/mix_ko.wav', set: 'v3'}} />
    {[
      {id: 'SH-01a', from: 54.7, to: 103.0, titleEn: '24 fps was a guess', titleKo: '24프레임은 짐작이었다'},
      {id: 'SH-01b', from: 164.8, to: 219.0, titleEn: 'Why TV runs at 29.97', titleKo: 'TV가 29.97인 이유'},
      {id: 'SH-01c', from: 219.4, to: 263.0, titleEn: 'Why 23.98, not 24', titleKo: '23.98이 24가 아닌 이유'},
    ].map((s) => (
      <Composition key={s.id} id={s.id} component={LongShort as any} durationInFrames={Math.round((s.to - s.from) * LFPS)} fps={LFPS} width={1080} height={1920} defaultProps={{tl: ep01v3tl, audio: 'ep01v3/mix_ko.wav', ...s}} />
    ))}
    <Still id="LF-01-thumb" component={Thumb01} width={1280} height={720} />
    <Composition id="SMP-A" component={SampleA} durationInFrames={SAMPLE_FRAMES} fps={30} width={1920} height={1080} />
    <Composition id="SMP-3D" component={SampleSeq} durationInFrames={SAMPLE_FRAMES * 3} fps={30} width={1920} height={1080} />
    {EPISODES.map((ep) => (
      <Still key={ep.id + '-cover'} id={ep.id + '-cover'} component={Cover as any} width={W} height={H} defaultProps={{ep}} />
    ))}
  </>
);

registerRoot(Root);
