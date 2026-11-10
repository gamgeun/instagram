import {Episode} from './types';

export const OUTRO_FRAMES = 90;
export const SCENE_LEAD = 10; // 카드가 바뀌는 구간
export const SCENE_TAIL = 8;
export const OVERLAP = 8; // 앞뒤 장면이 겹치며 바뀌는 프레임

/** 말자막 한 마디가 머무는 프레임. 공백 뺀 글자 수 기준.
 *  나이 든 시청자도 읽을 수 있게 글자당 4.4프레임(약 6.8자/초)으로 잡았다 */
export const chunkFrames = (text: string) => {
  const n = text.replace(/[\s*]/g, '').length;
  return Math.max(45, Math.min(130, Math.round(n * 4.4) + 20));
};

export const sceneFrames = (captions: string[]) =>
  SCENE_LEAD + captions.reduce((a, c) => a + chunkFrames(c), 0) + SCENE_TAIL;

export const layout = (ep: Episode) => {
  const segs: {from: number; dur: number}[] = [];
  let t = 0;
  for (const s of ep.scenes) {
    const d = sceneFrames(s.captions);
    segs.push({from: t, dur: d});
    t += d - OVERLAP;
  }
  segs.push({from: t, dur: OUTRO_FRAMES});
  return {segs, total: t + OUTRO_FRAMES};
};
