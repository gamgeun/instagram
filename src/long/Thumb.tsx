import React from 'react';
import {AbsoluteFill} from 'remotion';
import {FONT} from '../theme';
import {MONO, SERIF} from './eras';

/** 유튜브 썸네일 1280x720: 세 시대 톤을 한 장에 띠로 나란히 놓고, 큰 숫자 23.98 */
export const Thumb01: React.FC = () => (
  <AbsoluteFill style={{background: '#000', fontFamily: FONT}}>
    <div style={{position: 'absolute', left: 0, top: 0, bottom: 0, width: 300, background: 'radial-gradient(ellipse at 50% 50%, #dcc79f, #8a6a40)', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
      <div style={{fontFamily: SERIF, fontWeight: 900, fontSize: 120, color: '#3b2614', transform: 'rotate(-90deg)', whiteSpace: 'nowrap'}}>1927</div>
    </div>
    <div style={{position: 'absolute', left: 300, top: 0, bottom: 0, width: 220, background: 'radial-gradient(ellipse, #15464f, #06131a)', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
      <div style={{fontFamily: MONO, fontSize: 96, color: '#c9fff4', transform: 'rotate(-90deg)', whiteSpace: 'nowrap', textShadow: '0 0 20px rgba(120,255,230,.6)'}}>1953</div>
    </div>
    <div style={{position: 'absolute', left: 520, right: 0, top: 0, bottom: 0, background: 'radial-gradient(circle at 60% 50%, rgba(90,110,255,.5), rgba(170,70,255,.18) 45%, #000 75%)'}} />
    <div style={{position: 'absolute', left: 560, top: 130}}>
      <div style={{fontWeight: 900, fontSize: 64, color: '#fff'}}>왜 24가 아닐까?</div>
      <div style={{fontWeight: 900, fontSize: 250, lineHeight: 1, letterSpacing: -10, background: 'linear-gradient(90deg,#8E9BFF,#C77DFF)', WebkitBackgroundClip: 'text', color: 'transparent', marginTop: 10}}>23.98</div>
      <div style={{fontWeight: 700, fontSize: 44, color: 'rgba(255,255,255,.8)', marginTop: 20}}>카메라 메뉴에 남은 70년 전 숫자</div>
    </div>
  </AbsoluteFill>
);
