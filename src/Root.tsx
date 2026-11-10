import React from 'react';
import {Composition, Still, registerRoot} from 'remotion';
import {EpisodeVideo, Cover} from './Episode';
import {layout} from './timing';
import {Episode} from './types';
import {FPS, W, H} from './theme';
import {LongEpisode, LFPS} from './long/LongEpisode';
import ep01tl from '../longform/ep01/timeline.json';
import cq001 from '../scripts/cq-001-slog3-exposure.json';
import cq002 from '../scripts/cq-002-shutter-speed.json';

const EPISODES = [cq001, cq002] as Episode[];

const Root: React.FC = () => (
  <>
    {EPISODES.map((ep) => (
      <Composition key={ep.id} id={ep.id} component={EpisodeVideo as any} durationInFrames={layout(ep).total} fps={FPS} width={W} height={H} defaultProps={{ep}} />
    ))}
    <Composition id="LF-01-pilot" component={LongEpisode as any} durationInFrames={Math.ceil(ep01tl.duration * LFPS)} fps={LFPS} width={1920} height={1080} defaultProps={{tl: ep01tl, audio: 'ep01/narration.mp3'}} />
    {EPISODES.map((ep) => (
      <Still key={ep.id + '-cover'} id={ep.id + '-cover'} component={Cover as any} width={W} height={H} defaultProps={{ep}} />
    ))}
  </>
);

registerRoot(Root);
