import React from 'react';
import {Composition, registerRoot} from 'remotion';
import {EpisodeVideo, layout} from './Episode';
import {Episode} from './types';
import {FPS, W, H} from './theme';
import ep01 from '../scripts/gn-01-zr-r3d-ne.json';
import ep02 from '../scripts/gn-02-fx3-zr-match.json';

const EPISODES = [ep01, ep02] as Episode[];

const Root: React.FC = () => (
  <>
    {EPISODES.map((ep) => (
      <Composition
        key={ep.id}
        id={ep.id}
        component={EpisodeVideo as any}
        durationInFrames={layout(ep).total}
        fps={FPS}
        width={W}
        height={H}
        defaultProps={{ep}}
      />
    ))}
  </>
);

registerRoot(Root);
