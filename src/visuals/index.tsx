import React from 'react';
import {Visual} from '../types';
import {CameraSheet, DataStack, MonitorMenu, LogCurve, DualIso} from './VisualsA';
import {Capacity, PartsTable, TwoCam, ColorChart, NodePipeline, Vectorscope} from './VisualsB';

const MAP: Record<string, React.FC<any>> = {
  cameraSheet: CameraSheet,
  dataStack: DataStack,
  monitorMenu: MonitorMenu,
  logCurve: LogCurve,
  dualIso: DualIso,
  capacity: Capacity,
  partsTable: PartsTable,
  twoCam: TwoCam,
  colorChart: ColorChart,
  nodePipeline: NodePipeline,
  vectorscope: Vectorscope,
};

export const RenderVisual: React.FC<{v: Visual}> = ({v}) => {
  const Comp = MAP[v.type];
  if (!Comp) throw new Error(`알 수 없는 도식 종류: ${v.type}`);
  return <Comp {...(v.props ?? {})} />;
};
