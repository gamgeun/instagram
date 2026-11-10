export type Visual = {type: string; props?: Record<string, any>};

export type Scene = {
  /** 도면 번호 옆에 붙는 짧은 제목 (영문 대문자 권장) */
  label: string;
  /** 화면 상단 큰 제목 (한글) */
  heading: string;
  visual: Visual;
  /** 자막 마디. 한 마디씩 교체된다 */
  captions: string[];
};

export type Episode = {
  id: string; // 예: GN-01
  series: string; // GEAR NOTES
  title: string; // 표지 큰 제목
  subtitle: string;
  date: string; // 표제란에 들어가는 날짜
  scenes: Scene[];
  outro: string[]; // 마지막 장면 문구
};
