import React from 'react';
import {AbsoluteFill, Audio, Sequence, staticFile, useCurrentFrame, interpolate, Easing} from 'remotion';
import {ThreeCanvas} from '@remotion/three';
import {useThree} from '@react-three/fiber';
import {Scene3D, Step} from 'remotion-bits';
import {Subtitle, ChapterLabel, EraBg, MONO} from './eras';
import {Person, RetroTv, Sofa, LivingRoomLayers} from './people';
import {FONT} from '../theme';

/* 공통: 원본 내레이션 17.69초부터 7.1초 구간 ("70년도 더 전에 / 미국 텔레비전 때문에 생겼습니다 / 1953년 미국") */
export const SAMPLE_FRAMES = 213;
const P1 = 44; // "70년도 더 전에" 끝
const P2 = 142; // "미국 텔레비전 때문에 생겼습니다" 끝
const io = (f: number, a: number, b: number, from: number, to: number) =>
  interpolate(f, [a, b], [from, to], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.inOut(Easing.cubic)});
const subAt = (f: number) => (f < P1 ? '70년도 더 전에' : f < P2 ? '미국 텔레비전 때문에 생겼습니다' : '1953년 미국');
const YEARS = [2026, 2010, 1990, 1970, 1953];

const Shell: React.FC<{children: React.ReactNode; tag: string}> = ({children, tag}) => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{background: '#000'}}>
      <Audio src={staticFile('ep01/narration.mp3')} startFrom={531} />
      {children}
      <ChapterLabel era={f < P1 ? 'now' : 'crt'} />
      <div style={{position: 'absolute', right: 70, top: 56, fontFamily: MONO, fontSize: 26, color: '#FFD27A', zIndex: 40}}>{tag}</div>
      <Subtitle text={subAt(f)} />
    </AbsoluteFill>
  );
};

/** 1953년 거실을 깊이 레이어로 쌓는다. camX는 카메라 좌우 이동 */
const Room3D: React.FC<{camX: number; camZ: number; tvOn?: number}> = ({camX, camZ, tvOn = 1}) => (
  <AbsoluteFill style={{perspective: 1100, overflow: 'hidden'}}>
    <div style={{position: 'absolute', inset: 0, transformStyle: 'preserve-3d', transform: `translate3d(${-camX}px,0,${camZ}px)`}}>
      <div style={{position: 'absolute', left: -600, top: -400, width: 3120, height: 1880, transform: 'translateZ(-900px)'}}>{LivingRoomLayers.wall(3120, 1880)}</div>
      <div style={{position: 'absolute', left: 230, top: -170, transform: 'translateZ(-860px)', fontFamily: MONO, fontSize: 210, color: 'rgba(201,255,244,.85)', textShadow: '0 0 40px rgba(120,255,230,.5)'}}>1953</div>
      <div style={{position: 'absolute', left: 820, top: 300, transform: 'translateZ(-420px)'}}><RetroTv w={420} on={tvOn} /></div>
      <div style={{position: 'absolute', left: 380, top: 760, transform: 'translateZ(120px)'}}><Sofa w={1160} /></div>
      <div style={{position: 'absolute', left: 520, top: 470, transform: 'translateZ(170px)', display: 'flex', gap: 60, alignItems: 'flex-end'}}>
        <Person kind="dad" h={440} nod={0} />
        <Person kind="kid" h={300} nod={1} />
        <Person kind="mom" h={410} nod={2} />
      </div>
      <div style={{position: 'absolute', left: -300, top: 980, width: 2600, height: 300, transform: 'translateZ(260px)', background: 'linear-gradient(180deg,#040c0d,#000)'}} />
    </div>
    <AbsoluteFill style={{background: 'repeating-linear-gradient(0deg, rgba(0,0,0,0.18) 0 2px, transparent 2px 5px)', pointerEvents: 'none'}} />
  </AbsoluteFill>
);

/* ---------------- A. 브라우저 3D (직접 구현) ---------------- */
export const SampleA: React.FC = () => {
  const f = useCurrentFrame();
  const bgT = io(f, 0, P1, 0, 1);
  const camZ = io(f, 0, P1, 0, 2550) + io(f, P1, P2 - 4, 0, 1000);
  const white = interpolate(f, [P2 - 10, P2, P2 + 8], [0, 1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  return (
    <Shell tag="A · 브라우저 3D">
      <AbsoluteFill style={{background: `rgb(${6 * bgT},${19 * bgT},${26 * bgT})`}} />
      {f < P2 && (
        <AbsoluteFill style={{perspective: 1000, overflow: 'hidden'}}>
          <div style={{position: 'absolute', inset: 0, transformStyle: 'preserve-3d', transform: `translateZ(${camZ}px)`}}>
            {YEARS.map((y, i) => {
              const rel = -i * 700 + camZ; // 0 = 카메라 바로 앞 기준 위치, 양수 = 이미 지나감
              const last = i === YEARS.length - 1;
              const op = last
                ? interpolate(rel, [-1400, -300], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}) * interpolate(f, [P1, P1 + 14], [1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'})
                : interpolate(rel, [-1400, -500, 0, 250], [0, 1, 1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
              return (
              <div key={y} style={{position: 'absolute', left: 0, right: 0, top: 330, textAlign: 'center', opacity: op, transform: `translate3d(${(i % 2 ? 1 : -1) * i * 60}px, 0, ${-i * 700 + (last ? Math.min(0, camZ - 2800) : 0)}px)`, fontFamily: MONO, fontSize: 300, color: i === 4 ? '#c9fff4' : 'rgba(255,255,255,.85)', textShadow: i === 4 ? '0 0 40px rgba(120,255,230,.6)' : 'none'}}>
                {y}
              </div>
              );
            })}
            <div style={{position: 'absolute', left: 750, top: 260, transform: 'translateZ(-3500px)', opacity: interpolate(f, [P1 - 6, P1 + 10], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'})}}><RetroTv w={420} /></div>
          </div>
        </AbsoluteFill>
      )}
      {f >= P2 && <Room3D camX={io(f, P2, SAMPLE_FRAMES, -140, 140)} camZ={io(f, P2, SAMPLE_FRAMES, 0, 120)} />}
      <AbsoluteFill style={{background: '#d9fff8', opacity: white}} />
    </Shell>
  );
};

/* ---------------- B. Remotion Bits Scene3D ---------------- */
export const SampleB: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <Shell tag="B · Remotion Bits">
      <EraBg era="crt" />
      <Scene3D perspective={1000} transitionDuration={22} easing="easeInOutCubic" width={1920} height={1080}>
        <Step id="years" x={0} y={0} z={0} duration={P1}>
          <div style={{width: 1400, textAlign: 'center', fontFamily: MONO, fontSize: 300, color: '#fff'}}>{Math.round(io(f, 0, P1, 2026, 1953))}</div>
        </Step>
        <Step id="tv" x={1500} y={-300} z={-900} rotateY={-35} duration={P2 - P1}>
          <div style={{display: 'flex', alignItems: 'center', gap: 60}}>
            <RetroTv w={460} />
            <div style={{fontFamily: FONT, fontWeight: 900, fontSize: 110, color: '#D6FFF6', whiteSpace: 'nowrap', lineHeight: 1.2}}>미국<br />텔레비전</div>
          </div>
        </Step>
        <Step id="room" x={3000} y={0} z={-1800} rotateY={-70} duration={SAMPLE_FRAMES - P2}>
          <div style={{position: 'relative', width: 1700, height: 900, overflow: 'hidden', borderRadius: 30}}>
            <Room3D camX={0} camZ={0} />
          </div>
        </Step>
      </Scene3D>
    </Shell>
  );
};

/* ---------------- C. Three.js 3D ---------------- */
const Rig: React.FC = () => {
  const f = useCurrentFrame();
  const {camera} = useThree();
  // 1) 멀리서 어두운 거실로 다가감  2) 가족 뒤에서 TV 쪽으로 밀고 들어감  3) 옆으로 돌아 TV 불빛에 비친 가족을 봄
  const x = io(f, P2, SAMPLE_FRAMES, 0, 4.6);
  const z = io(f, 0, P2, 14, 6.2) - io(f, P2, SAMPLE_FRAMES, 0, 1.2);
  const y = io(f, 0, P2, 3.2, 1.9);
  camera.position.set(x, y, z);
  camera.lookAt(io(f, P2, SAMPLE_FRAMES, 0, -0.4), 1.2, 0);
  return null;
};
const Human: React.FC<{x: number; h: number; hat?: boolean; hair?: boolean}> = ({x, h, hat, hair}) => (
  <group position={[x, 0.55, 2.2]}>
    <mesh position={[0, h * 0.35, 0]}><capsuleGeometry args={[h * 0.17, h * 0.4, 6, 16]} /><meshStandardMaterial color="#1b2a2c" roughness={0.8} /></mesh>
    <mesh position={[0, h * 0.82, 0]}><sphereGeometry args={[h * 0.13, 24, 24]} /><meshStandardMaterial color="#c99377" roughness={0.7} /></mesh>
    {hat && <mesh position={[0, h * 0.93, 0]}><cylinderGeometry args={[h * 0.12, h * 0.13, h * 0.1, 24]} /><meshStandardMaterial color="#141414" /></mesh>}
    {hat && <mesh position={[0, h * 0.885, 0]}><cylinderGeometry args={[h * 0.22, h * 0.22, h * 0.015, 32]} /><meshStandardMaterial color="#141414" /></mesh>}
    {hair && <mesh position={[0, h * 0.86, 0.02]}><sphereGeometry args={[h * 0.15, 24, 24, 0, Math.PI * 2, 0, Math.PI * 0.6]} /><meshStandardMaterial color="#2b1a10" /></mesh>}
  </group>
);
export const SampleC: React.FC = () => {
  const f = useCurrentFrame();
  const flick = 2.6 + Math.sin(f / 3) * 0.3 + Math.sin(f / 7) * 0.3;
  const yearO = interpolate(f, [0, 6, P1 - 6, P1], [0, 1, 1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  return (
    <Shell tag="C · Three.js">
      <ThreeCanvas width={1920} height={1080} style={{background: '#04090a'}} camera={{fov: 40, position: [0, 3, 14]}}>
        <Rig />
        <fog attach="fog" args={['#04090a', 6, 22]} />
        <ambientLight intensity={0.55} color="#88b4ba" />
        <hemisphereLight args={['#9fd6dc', '#0a1416', 0.6]} />
        <pointLight position={[0, 1.4, -1.2]} intensity={flick * 6} distance={12} decay={1.2} color="#bff8ee" />
        <directionalLight position={[-4, 6, 6]} intensity={0.8} color="#6fa0a8" />
        <mesh rotation={[-Math.PI / 2, 0, 0]}><planeGeometry args={[30, 30]} /><meshStandardMaterial color="#0d1c1f" /></mesh>
        <mesh position={[0, 4, -3]}><planeGeometry args={[30, 10]} /><meshStandardMaterial color="#123138" /></mesh>
        {/* TV */}
        <group position={[0, 0, -2]}>
          <mesh position={[0, 1.25, 0]}><boxGeometry args={[1.7, 1.3, 1]} /><meshStandardMaterial color="#3a2a18" roughness={0.6} /></mesh>
          <mesh position={[-0.15, 1.27, 0.51]}><planeGeometry args={[1.1, 0.9]} /><meshStandardMaterial color="#cffaf2" emissive="#9fe9de" emissiveIntensity={flick * 0.5} /></mesh>
          {[-0.6, 0.6].map((x) => <mesh key={x} position={[x, 0.3, 0]}><cylinderGeometry args={[0.04, 0.04, 0.6]} /><meshStandardMaterial color="#1a130c" /></mesh>)}
        </group>
        {/* 소파와 가족 */}
        <mesh position={[0, 0.3, 2.5]}><boxGeometry args={[3.4, 0.6, 1]} /><meshStandardMaterial color="#0b1714" /></mesh>
        <mesh position={[0, 0.8, 3.0]}><boxGeometry args={[3.4, 1, 0.25]} /><meshStandardMaterial color="#0b1714" /></mesh>
        <Human x={-0.95} h={1.6} hat />
        <Human x={0} h={1.15} />
        <Human x={0.95} h={1.5} hair />
      </ThreeCanvas>
      <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center', opacity: yearO}}>
        <div style={{fontFamily: MONO, fontSize: 300, color: '#c9fff4', textShadow: '0 0 40px rgba(120,255,230,.6)'}}>{Math.round(io(f, 0, P1, 2026, 1953))}</div>
      </AbsoluteFill>
      <AbsoluteFill style={{background: 'repeating-linear-gradient(0deg, rgba(0,0,0,0.16) 0 2px, transparent 2px 5px)'}} />
    </Shell>
  );
};

export const SampleSeq: React.FC = () => (
  <>
    <Sequence durationInFrames={SAMPLE_FRAMES}><SampleA /></Sequence>
    <Sequence from={SAMPLE_FRAMES} durationInFrames={SAMPLE_FRAMES}><SampleB /></Sequence>
    <Sequence from={SAMPLE_FRAMES * 2} durationInFrames={SAMPLE_FRAMES}><SampleC /></Sequence>
  </>
);
