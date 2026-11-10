export type Visual = {type: string; props?: Record<string, any>};

export type Scene = {
  /** 카드 위쪽 단계 이름 (예: "① 감마 표시 어시스트 켜기") */
  step: string;
  visual: Visual;
  /** 말자막 마디. 상단 가운데에 한 마디씩 교체된다. *단어* 는 강조색 */
  captions: string[];
};

export type Episode = {
  id: string; // 예: CQ-001
  tag: string; // 제목 위 작은 알약 라벨
  title: string; // 한 줄 제목. 모든 장면 상단에 고정
  scenes: Scene[];
  outro: string[];
};
