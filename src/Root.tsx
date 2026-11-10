import React from 'react';
import {Composition, registerRoot} from 'remotion';
import {EpisodeVideo} from './Episode';
import {layout} from './timing';
import {Episode} from './types';
import {FPS, W, H} from './theme';
import cq001 from '../scripts/cq-001-slog3-exposure.json';

const EPISODES = [cq001] as Episode[];

const Root: React.FC = () => (
  <>
    {EPISODES.map((ep) => (
      <Composition key={ep.id} id={ep.id} component={EpisodeVideo as any} durationInFrames={layout(ep).total} fps={FPS} width={W} height={H} defaultProps={{ep}} />
    ))}
  </>
);

registerRoot(Root);
