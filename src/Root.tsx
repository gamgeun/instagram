import React from 'react';
import {Composition, Still, registerRoot} from 'remotion';
import {EpisodeVideo, Cover} from './Episode';
import {layout} from './timing';
import {Episode} from './types';
import {FPS, W, H} from './theme';
import cq001 from '../scripts/cq-001-slog3-exposure.json';
import cq002 from '../scripts/cq-002-shutter-speed.json';

const EPISODES = [cq001, cq002] as Episode[];

const Root: React.FC = () => (
  <>
    {EPISODES.map((ep) => (
      <Composition key={ep.id} id={ep.id} component={EpisodeVideo as any} durationInFrames={layout(ep).total} fps={FPS} width={W} height={H} defaultProps={{ep}} />
    ))}
    {EPISODES.map((ep) => (
      <Still key={ep.id + '-cover'} id={ep.id + '-cover'} component={Cover as any} width={W} height={H} defaultProps={{ep}} />
    ))}
  </>
);

registerRoot(Root);
