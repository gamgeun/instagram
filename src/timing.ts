import {Episode} from './types';

export const TITLE_FRAMES = 75;
export const OUTRO_FRAMES = 96;
export const SCENE_LEAD = 14; // 스캔선 전환 + 도식이 그려지기 시작하는 구간
export const SCENE_TAIL = 10;

/** 자막 한 마디가 화면에 머무는 프레임. 공백 뺀 글자 수 기준 */
export const chunkFrames = (text: string) => {
  const n = text.replace(/\s/g, '').length;
  return Math.max(42, Math.min(120, Math.round(n * 4.2) + 18));
};

export const sceneFrames = (captions: string[]) =>
  SCENE_LEAD + captions.reduce((a, c) => a + chunkFrames(c), 0) + SCENE_TAIL;

export const episodeFrames = (ep: Episode) =>
  TITLE_FRAMES + ep.scenes.reduce((a, s) => a + sceneFrames(s.captions), 0) + OUTRO_FRAMES;
