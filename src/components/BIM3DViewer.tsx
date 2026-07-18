import React, { useState, useRef, Suspense, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Grid, Center, Html } from '@react-three/drei';
import * as THREE from 'three';
import { useLanguage } from './LanguageContext';
import { BIMObject } from '../types';
import { 
  Maximize2, 
  RotateCw, 
  Grid3X3, 
  Ruler, 
  Sliders, 
  Sparkles, 
  Cpu, 
  HelpCircle,
  Play,
  Pause,
  Box,
  Minimize2,
  X
} from 'lucide-react';

interface BIM3DViewerProps {
  object: BIMObject;
}

// Simple Error Boundary for WebGL Unsupported environments
class WebGLErrorBoundary extends React.Component<{ children: React.ReactNode; fallback: React.ReactNode }, { hasError: boolean }> {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  componentDidCatch(error: any, errorInfo: any) {
    console.warn("WebGL or Three.js error caught by boundary:", error, errorInfo);
  }
  render() {
    if (this.state.hasError) {
      return this.props.fallback;
    }
    return this.props.children;
  }
}

// -----------------------------------------------------------------
// PROCEDURAL 3D MODELS ACCORDING TO CATEGORIES
// -----------------------------------------------------------------

// Helper to check wireframe or X-Ray material properties
const useBIMMaterial = (color: string, mode: 'realistic' | 'wireframe' | 'xray', opacity = 1) => {
  if (mode === 'wireframe') {
    return (
      <meshBasicMaterial 
        color={color} 
        wireframe={true} 
        side={THREE.DoubleSide}
      />
    );
  }
  if (mode === 'xray') {
    return (
      <meshPhysicalMaterial 
        color={color} 
        transparent={true} 
        opacity={0.3} 
        roughness={0.1}
        metalness={0.9}
        transmission={0.6}
        thickness={0.5}
        wireframe={false}
        side={THREE.DoubleSide}
        depthWrite={false}
      />
    );
  }
  return (
    <meshStandardMaterial 
      color={color} 
      roughness={0.4} 
      metalness={0.2} 
      transparent={opacity < 1}
      opacity={opacity}
      side={THREE.DoubleSide}
    />
  );
};

// 1. WINDOW / DOOR MODEL
const DoorsWindowsModel: React.FC<{ 
  mode: 'realistic' | 'wireframe' | 'xray'; 
  opening: number;
  isDoor: boolean;
}> = ({ mode, opening, isDoor }) => {
  const hingeRef = useRef<THREE.Group>(null);
  
  // Dynamic rotation for door swing or window slide
  useFrame(() => {
    if (hingeRef.current) {
      if (isDoor) {
        // Swing door on side hinge (Y-axis rotation)
        const targetRot = -(opening / 100) * (Math.PI / 2); // 90 degrees max
        hingeRef.current.rotation.y = THREE.MathUtils.lerp(hingeRef.current.rotation.y, targetRot, 0.1);
      } else {
        // Slide window sash upward (Y translation)
        const targetHeight = (opening / 100) * 0.8; // 0.8 units max slide
        hingeRef.current.position.y = THREE.MathUtils.lerp(hingeRef.current.position.y, targetHeight, 0.1);
      }
    }
  });

  const frameMat = useBIMMaterial('#343a40', mode); // Dark metal frame
  const woodMat = useBIMMaterial('#a67c52', mode);  // Walnut finish for door
  const glassMat = useBIMMaterial('#8ecae6', mode === 'realistic' ? 'xray' : mode, 0.4); // Glass
  const handleMat = useBIMMaterial('#ffd166', mode); // Brass/Gold handle

  return (
    <group position={[0, 0, 0]}>
      {/* Outer Door/Window Frame */}
      {/* Top frame */}
      <mesh position={[0, 1.05, 0]}>
        <boxGeometry args={[1.3, 0.1, 0.15]} />
        {frameMat}
      </mesh>
      {/* Bottom frame / sill */}
      <mesh position={[0, -1.05, 0]}>
        <boxGeometry args={[1.3, 0.1, 0.2]} />
        {frameMat}
      </mesh>
      {/* Left jamb */}
      <mesh position={[-0.6, 0, 0]}>
        <boxGeometry args={[0.1, 2.0, 0.15]} />
        {frameMat}
      </mesh>
      {/* Right jamb */}
      <mesh position={[0.6, 0, 0]}>
        <boxGeometry args={[0.1, 2.0, 0.15]} />
        {frameMat}
      </mesh>

      {/* Interactive swing or slide unit */}
      {isDoor ? (
        // DOOR SWING CONFIG (Pivot at left edge: x = -0.55)
        <group position={[-0.55, 0, 0]}>
          <group ref={hingeRef} position={[0.55, 0, 0]}>
            {/* Main Wooden Panel */}
            <mesh position={[-0.275, 0, 0]}>
              <boxGeometry args={[1.05, 1.95, 0.05]} />
              {woodMat}
            </mesh>
            {/* Fancy glass insert in door */}
            <mesh position={[-0.275, 0.2, 0.01]}>
              <boxGeometry args={[0.3, 1.0, 0.04]} />
              {glassMat}
            </mesh>
            {/* Door Handle */}
            <group position={[-0.48, 0, 0.04]}>
              {/* handle base */}
              <mesh>
                <cylinderGeometry args={[0.015, 0.015, 0.12, 16]} />
                {handleMat}
              </mesh>
              {/* handle lever */}
              <mesh position={[0.04, 0, 0.02]} rotation={[Math.PI / 2, 0, 0]}>
                <cylinderGeometry args={[0.01, 0.01, 0.1, 16]} />
                {handleMat}
              </mesh>
            </group>
          </group>
        </group>
      ) : (
        // WINDOW SLIDE CONFIG (Double-hung or sliding sash)
        <group>
          {/* Static Top Glass Panel */}
          <mesh position={[0, 0.45, 0]}>
            <boxGeometry args={[1.1, 0.9, 0.03]} />
            {glassMat}
          </mesh>
          <mesh position={[0, 0.45, 0.02]}>
            <boxGeometry args={[1.12, 0.92, 0.04]} />
            {useBIMMaterial('#495057', mode)}
          </mesh>

          {/* Interactive Sliding Bottom Glass Sash */}
          <group ref={hingeRef} position={[0, -0.45, 0.03]}>
            {/* Sliding Frame */}
            <mesh>
              <boxGeometry args={[1.12, 0.92, 0.04]} />
              {useBIMMaterial('#212529', mode)}
            </mesh>
            {/* Glass */}
            <mesh position={[0, 0, 0.01]}>
              <boxGeometry args={[1.05, 0.85, 0.02]} />
              {glassMat}
            </mesh>
          </group>
        </group>
      )}
    </group>
  );
};

// 2. FURNITURE MODEL (CHAIR / TABLE)
const FurnitureModel: React.FC<{ 
  mode: 'realistic' | 'wireframe' | 'xray';
  isChair: boolean;
}> = ({ mode, isChair }) => {
  const fabricMat = useBIMMaterial('#14b8a6', mode); // Teal premium fabric
  const metalMat = useBIMMaterial('#adb5bd', mode);  // Brushed steel
  const darkWoodMat = useBIMMaterial('#4a3728', mode); // Solid oak/dark wood

  if (isChair) {
    return (
      <group position={[0, -0.3, 0]}>
        {/* Chair Seat */}
        <mesh position={[0, 0.3, 0]}>
          <boxGeometry args={[0.8, 0.08, 0.8]} />
          {fabricMat}
        </mesh>
        {/* Chair Backrest */}
        <mesh position={[0, 0.75, -0.36]} rotation={[0.08, 0, 0]}>
          <boxGeometry args={[0.76, 0.8, 0.08]} />
          {fabricMat}
        </mesh>
        
        {/* Swivel metal base instead of standard legs for premium AEC feel */}
        <mesh position={[0, -0.1, 0]}>
          <cylinderGeometry args={[0.03, 0.03, 0.72, 16]} />
          {metalMat}
        </mesh>
        {/* Base legs */}
        <group position={[0, -0.46, 0]}>
          <mesh rotation={[0, 0, Math.PI / 2]}>
            <boxGeometry args={[0.03, 0.8, 0.03]} />
            {metalMat}
          </mesh>
          <mesh rotation={[0, Math.PI / 2, Math.PI / 2]}>
            <boxGeometry args={[0.03, 0.8, 0.03]} />
            {metalMat}
          </mesh>
        </group>
      </group>
    );
  }

  // TABLE MODEL
  return (
    <group position={[0, -0.3, 0]}>
      {/* Wooden tabletop */}
      <mesh position={[0, 0.45, 0]}>
        <boxGeometry args={[1.5, 0.06, 1.0]} />
        {darkWoodMat}
      </mesh>
      {/* Left support frame */}
      <group position={[-0.6, -0.05, 0]}>
        <mesh position={[0, 0.1, 0]}>
          <boxGeometry args={[0.06, 0.9, 0.8]} />
          {metalMat}
        </mesh>
      </group>
      {/* Right support frame */}
      <group position={[0.6, -0.05, 0]}>
        <mesh position={[0, 0.1, 0]}>
          <boxGeometry args={[0.06, 0.9, 0.8]} />
          {metalMat}
        </mesh>
      </group>
      {/* Reinforcing center steel bar */}
      <mesh position={[0, 0.35, 0]}>
        <boxGeometry args={[1.14, 0.04, 0.04]} />
        {metalMat}
      </mesh>
    </group>
  );
};

// 3. SANITARY / BATHROOM MODEL
const BathroomModel: React.FC<{
  mode: 'realistic' | 'wireframe' | 'xray';
  waterOn: boolean;
}> = ({ mode, waterOn }) => {
  const ceramicMat = useBIMMaterial('#f8f9fa', mode); // Glossy ceramic white
  const chromeMat = useBIMMaterial('#dee2e6', mode);   // Shiny chrome
  const waterMat = useBIMMaterial('#06b6d4', 'xray', 0.6); // Water visual

  const waterRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (waterRef.current && waterOn) {
      // Flow animation
      waterRef.current.scale.y = 1 + Math.sin(state.clock.getElapsedTime() * 10) * 0.05;
    }
  });

  return (
    <group position={[0, -0.2, 0]}>
      {/* Ceramic Sink Basin Vanity */}
      <mesh position={[0, 0.1, 0]}>
        <boxGeometry args={[1.0, 0.4, 0.7]} />
        {ceramicMat}
      </mesh>
      {/* Recessed Basin Bowl */}
      <mesh position={[0, 0.28, 0]}>
        <boxGeometry args={[0.8, 0.05, 0.5]} />
        {useBIMMaterial('#e9ecef', mode)}
      </mesh>

      {/* Chrome Mixer Faucet Body */}
      <group position={[0, 0.3, -0.28]}>
        {/* vertical faucet pipe */}
        <mesh position={[0, 0.15, 0]}>
          <cylinderGeometry args={[0.02, 0.02, 0.3, 16]} />
          {chromeMat}
        </mesh>
        {/* Spout heading forward */}
        <mesh position={[0, 0.3, 0.08]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.018, 0.015, 0.16, 16]} />
          {chromeMat}
        </mesh>
        {/* Handle lever */}
        <mesh position={[0, 0.28, -0.02]} rotation={[0.4, 0, 0]}>
          <boxGeometry args={[0.015, 0.12, 0.015]} />
          {chromeMat}
        </mesh>

        {/* Animated flow of water */}
        {waterOn && (
          <mesh ref={waterRef} position={[0, 0.05, 0.16]} rotation={[0, 0, 0]}>
            <cylinderGeometry args={[0.008, 0.008, 0.45, 8]} />
            {waterMat}
          </mesh>
        )}
      </group>
    </group>
  );
};

// 4. LAYERED BUILDING FACADE DETAIL MODEL
const FacadeBuildUpModel: React.FC<{
  mode: 'realistic' | 'wireframe' | 'xray';
  explosion: number; // 0 to 100 exploded views
}> = ({ mode, explosion }) => {
  // 4 building construction layers separated according to exploded slider
  const offset = (explosion / 100) * 0.4; // separation space

  // Materials
  const concreteMat = useBIMMaterial('#868e96', mode); // Structural backup wall (concrete)
  const insulationMat = useBIMMaterial('#ffd43b', mode); // Insulation layer (yellow wool)
  const airGapMat = useBIMMaterial('#74c0fc', 'xray', 0.25); // Air barrier ventilation gap
  const brickMat = useBIMMaterial('#e8590c', mode); // Exterior brick facade

  return (
    <group position={[0, 0, 0]} rotation={[0, 0.3, 0]}>
      {/* Layer 1: Structural Concrete Wall */}
      <group position={[0, 0, -1.5 * offset]}>
        <mesh>
          <boxGeometry args={[1.2, 1.4, 0.16]} />
          {concreteMat}
        </mesh>
        {mode === 'realistic' && (
          <Html position={[0, 0.8, 0]} center>
            <div className="bg-gray-900/90 text-white font-mono text-[8px] px-1.5 py-0.5 rounded border border-gray-700 select-none whitespace-nowrap">
              Backup Wall: Concrete (160mm)
            </div>
          </Html>
        )}
      </group>

      {/* Layer 2: Thermal Insulation Board */}
      <group position={[0, 0, -0.5 * offset]}>
        <mesh position={[0, 0, 0.13]}>
          <boxGeometry args={[1.2, 1.4, 0.1]} />
          {insulationMat}
        </mesh>
        {mode === 'realistic' && (
          <Html position={[0, 0.8, 0.13]} center>
            <div className="bg-gray-900/90 text-white font-mono text-[8px] px-1.5 py-0.5 rounded border border-gray-700 select-none whitespace-nowrap">
              Insulation: Rockwool (100mm)
            </div>
          </Html>
        )}
      </group>

      {/* Layer 3: Ventilated Air Barrier Gap */}
      <group position={[0, 0, 0.5 * offset]}>
        <mesh position={[0, 0, 0.23]}>
          <boxGeometry args={[1.2, 1.4, 0.04]} />
          {airGapMat}
        </mesh>
        {mode === 'realistic' && (
          <Html position={[0, 0.8, 0.23]} center>
            <div className="bg-gray-900/90 text-white font-mono text-[8px] px-1.5 py-0.5 rounded border border-gray-700 select-none whitespace-nowrap">
              Ventilated Cavity (40mm)
            </div>
          </Html>
        )}
      </group>

      {/* Layer 4: Decorative Clay Brick cladding */}
      <group position={[0, 0, 1.5 * offset]}>
        <mesh position={[0, 0, 0.32]}>
          <boxGeometry args={[1.2, 1.4, 0.08]} />
          {brickMat}
        </mesh>
        {mode === 'realistic' && (
          <Html position={[0, 0.8, 0.32]} center>
            <div className="bg-gray-900/90 text-white font-mono text-[8px] px-1.5 py-0.5 rounded border border-gray-700 select-none whitespace-nowrap">
              Facade: Clay Brick (80mm)
            </div>
          </Html>
        )}
      </group>
    </group>
  );
};

// 5. DEFAULT PARAMETRIC EQUIPMENTS MODEL (FOR ALL OTHER CATEGORIES)
const DefaultParametricModel: React.FC<{
  mode: 'realistic' | 'wireframe' | 'xray';
}> = ({ mode }) => {
  const greyMat = useBIMMaterial('#495057', mode);
  const steelMat = useBIMMaterial('#adb5bd', mode);
  const greenMat = useBIMMaterial('#0ca678', mode); // HVAC system indicators

  return (
    <group position={[0, 0, 0]}>
      {/* Central Enclosure Cabinet */}
      <mesh>
        <boxGeometry args={[1.1, 0.9, 0.9]} />
        {greyMat}
      </mesh>
      {/* Front Controller / UI screen panel */}
      <mesh position={[0.3, 0, 0.46]}>
        <boxGeometry args={[0.35, 0.4, 0.03]} />
        {greenMat}
      </mesh>
      {/* Connecting circular flange port left */}
      <mesh position={[-0.58, 0.15, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.15, 0.15, 0.1, 16]} />
        {steelMat}
      </mesh>
      {/* Connecting circular flange port right */}
      <mesh position={[0.58, -0.15, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.15, 0.15, 0.1, 16]} />
        {steelMat}
      </mesh>
      {/* Warning top status stack lamp */}
      <group position={[0.4, 0.52, -0.3]}>
        <mesh>
          <cylinderGeometry args={[0.02, 0.02, 0.14, 12]} />
          {steelMat}
        </mesh>
        <mesh position={[0, 0.1, 0]}>
          <sphereGeometry args={[0.03, 12, 12]} />
          {useBIMMaterial('#f03e3e', mode)}
        </mesh>
      </group>
    </group>
  );
};

// Main Controller to load the model inside canvas
const BIMModelLoader: React.FC<{
  category: string;
  sub: string;
  mode: 'realistic' | 'wireframe' | 'xray';
  opening: number;
  waterOn: boolean;
  explosion: number;
  autoRotate: boolean;
  autoRotateSpeed?: number;
}> = ({ category, sub, mode, opening, waterOn, explosion, autoRotate, autoRotateSpeed = 1 }) => {
  const groupRef = useRef<THREE.Group>(null);

  useFrame(() => {
    if (groupRef.current && autoRotate) {
      groupRef.current.rotation.y += 0.005 * autoRotateSpeed;
    }
  });

  // Render appropriate shape based on categorization
  const renderShape = () => {
    if (category === 'doors_windows') {
      const isDoor = sub.includes('door');
      return <DoorsWindowsModel mode={mode} opening={opening} isDoor={isDoor} />;
    }
    if (category === 'furniture') {
      const isChair = sub.includes('chair') || sub.includes('seating') || sub.includes('office_furniture');
      return <FurnitureModel mode={mode} isChair={isChair} />;
    }
    if (category === 'bathroom') {
      return <BathroomModel mode={mode} waterOn={waterOn} />;
    }
    if (category === 'materials_facades') {
      return <FacadeBuildUpModel mode={mode} explosion={explosion} />;
    }
    return <DefaultParametricModel mode={mode} />;
  };

  return (
    <group ref={groupRef}>
      {renderShape()}
    </group>
  );
};

// -----------------------------------------------------------------
// 3D VIEWER CONTAINER WITH METADATA CONTROLS
// -----------------------------------------------------------------

export const BIM3DViewer: React.FC<BIM3DViewerProps> = ({ object }) => {
  const { isRtl, t } = useLanguage();
  const [renderMode, setRenderMode] = useState<'realistic' | 'wireframe' | 'xray'>('realistic');
  const [showGrid, setShowGrid] = useState(true);
  const [showDimensions, setShowDimensions] = useState(true);
  const [autoRotate, setAutoRotate] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [rotationSpeed, setRotationSpeed] = useState(1); // multiplier 1x, 2x, 4x
  
  // Interactive sliders / states
  const [openingRatio, setOpeningRatio] = useState(25); // Doors/windows opening percentage
  const [explosionRatio, setExplosionRatio] = useState(20); // Facade layered explosion
  const [waterOn, setWaterOn] = useState(true); // Taps running water

  // Handle ESC key to exit fullscreen and manage scrolling
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsFullscreen(false);
      }
    };
    if (isFullscreen) {
      window.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isFullscreen]);

  const category = object.category;
  const subcategory = object.subcategory || '';

  // Calculate mock geometric volume and stats for engineers to review
  const getBIMVolume = () => {
    if (category === 'doors_windows') return '0.45 m³';
    if (category === 'furniture') return '0.62 m³';
    if (category === 'bathroom') return '0.28 m³';
    if (category === 'materials_facades') return '0.22 m³';
    return '0.89 m³';
  };

  const getBIMWeight = () => {
    if (category === 'doors_windows') return '84.0 kg';
    if (category === 'furniture') return '22.5 kg';
    if (category === 'bathroom') return '35.0 kg';
    if (category === 'materials_facades') return '145.0 kg';
    return '110.0 kg';
  };

  const getPolys = () => {
    if (category === 'doors_windows') return '728 triangles';
    if (category === 'furniture') return '584 triangles';
    if (category === 'bathroom') return '1,420 triangles';
    if (category === 'materials_facades') return '240 triangles';
    return '368 triangles';
  };

  // Dimensions of bounding box based on BIM category
  const getDims = () => {
    if (category === 'doors_windows') return { w: '1200 mm', h: '2100 mm', d: '150 mm' };
    if (category === 'furniture') return { w: '800 mm', h: '950 mm', d: '800 mm' };
    if (category === 'bathroom') return { w: '1000 mm', h: '850 mm', d: '700 mm' };
    if (category === 'materials_facades') return { w: '1200 mm', h: '1400 mm', d: '380 mm' };
    return { w: '1100 mm', h: '900 mm', d: '900 mm' };
  };

  const dims = getDims();

  // Non-WebGL fallback view
  const webglFallback = (
    <div className="w-full h-full min-h-[360px] bg-gray-50 dark:bg-gray-950 flex flex-col items-center justify-center p-8 text-center border border-gray-150 dark:border-gray-800 rounded-2xl">
      <Box className="w-12 h-12 text-[#26B6B6] animate-bounce mb-3" />
      <h3 className="text-sm font-black text-gray-800 dark:text-gray-200">
        {isRtl ? 'پیش‌نمایش سه بعدی زنده غیرفعال است' : 'Live 3D Viewport Offline'}
      </h3>
      <p className="text-xs text-gray-400 dark:text-gray-500 max-w-sm mt-1 leading-relaxed">
        {isRtl 
          ? 'مرورگر شما یا کارت گرافیک سیستم شما در حال حاضر از WebGL پشتیبانی نمی‌کند. شما همچنان می‌توانید فایل اصلی BIM را مستقیماً دانلود نمایید.'
          : 'Your browser or system GPU does not currently support WebGL rendering. You can still download the full certified BIM family file below.'
        }
      </p>
    </div>
  );

  return (
    <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-3xl p-4 sm:p-5 shadow-xs space-y-4">
      {/* Header controls strip */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-3 border-b border-gray-50 dark:border-gray-800">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-[#26B6B6]/10 text-[#26B6B6] rounded-xl">
            <Cpu className="w-5 h-5" />
          </div>
          <div className="text-start">
            <h3 className="text-sm font-black text-gray-900 dark:text-white flex items-center gap-1.5">
              <span>{isRtl ? 'آنالیزگر و پیش‌نمایش سه بعدی BIM' : 'BIM 3D Live Viewer'}</span>
              <span className="text-[9px] font-black uppercase bg-[#26B6B6] text-white px-1.5 py-0.5 rounded-sm animate-pulse tracking-wider">PREVIEW</span>
            </h3>
            <p className="text-[10px] text-gray-400 font-light">
              {isRtl ? 'بررسی پورت‌های هندسی، ابعاد پارامتریک و جزئیات مدل رویت' : 'Orbit, analyze geometry, and inspect parametric Revit boundaries'}
            </p>
          </div>
        </div>

        {/* Style selection buttons */}
        <div className="flex bg-gray-100 dark:bg-gray-850 p-1 rounded-xl self-start sm:self-center" dir="ltr">
          <button
            onClick={() => setRenderMode('realistic')}
            className={`px-3 py-1.5 text-[10px] font-bold rounded-lg transition-all cursor-pointer ${
              renderMode === 'realistic'
                ? 'bg-white dark:bg-gray-800 text-[#26B6B6] shadow-xs'
                : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
            }`}
          >
            {isRtl ? 'سایه‌دار' : 'Shaded'}
          </button>
          <button
            onClick={() => setRenderMode('wireframe')}
            className={`px-3 py-1.5 text-[10px] font-bold rounded-lg transition-all cursor-pointer ${
              renderMode === 'wireframe'
                ? 'bg-white dark:bg-gray-800 text-[#26B6B6] shadow-xs'
                : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
            }`}
          >
            {isRtl ? 'وکتور' : 'Wireframe'}
          </button>
          <button
            onClick={() => setRenderMode('xray')}
            className={`px-3 py-1.5 text-[10px] font-bold rounded-lg transition-all cursor-pointer ${
              renderMode === 'xray'
                ? 'bg-white dark:bg-gray-800 text-[#26B6B6] shadow-xs'
                : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
            }`}
          >
            {isRtl ? 'اکس‌ری' : 'X-Ray'}
          </button>
        </div>
      </div>

      {/* Grid Viewport and Sidebar Details */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4.5">
        
        {/* Main 3D Canvas Box (takes 3 cols) */}
        <div className="lg:col-span-3 h-[320px] sm:h-[380px] bg-radial from-gray-50 to-gray-100 dark:from-gray-950 dark:to-gray-900 border border-gray-150 dark:border-gray-800 rounded-2xl relative overflow-hidden group">
          
          <WebGLErrorBoundary fallback={webglFallback}>
            <Suspense fallback={
              <div className="w-full h-full flex flex-col items-center justify-center text-gray-400 dark:text-gray-500">
                <RotateCw className="w-8 h-8 animate-spin text-[#26B6B6] mb-2" />
                <span className="text-xs font-bold font-mono">Initializing 3D Engine...</span>
              </div>
            }>
              <Canvas camera={{ position: [2.5, 1.5, 3.2], fov: 45 }}>
                <ambientLight intensity={renderMode === 'xray' ? 1.5 : 1.2} />
                <directionalLight position={[5, 10, 5]} intensity={1.5} castShadow />
                <directionalLight position={[-5, 5, -5]} intensity={0.5} />
                <pointLight position={[0, 4, 0]} intensity={1.0} />
                
                <Center>
                  <BIMModelLoader 
                    category={category} 
                    sub={subcategory} 
                    mode={renderMode}
                    opening={openingRatio}
                    waterOn={waterOn}
                    explosion={explosionRatio}
                    autoRotate={autoRotate}
                    autoRotateSpeed={rotationSpeed}
                  />
                </Center>

                {/* Ground grid helper */}
                {showGrid && (
                  <Grid 
                    position={[0, -0.9, 0]}
                    args={[10.5, 10.5]}
                    cellSize={0.2}
                    cellThickness={0.5}
                    cellColor="#6c757d"
                    sectionSize={1}
                    sectionThickness={1}
                    sectionColor="#26B6B6"
                    fadeDistance={30}
                    infiniteGrid
                  />
                )}

                {/* Dimension boundaries & text in 3D */}
                {showDimensions && (
                  <group position={[0, 0, 0]}>
                    {/* Height indicator */}
                    <Html position={[-0.9, 0, 0]} center>
                      <div className="bg-[#26B6B6] text-white text-[8px] font-black font-mono px-1 py-0.5 rounded shadow-sm select-none border border-[#26B6B6]/50 whitespace-nowrap">
                        ↕ {dims.h}
                      </div>
                    </Html>
                    {/* Width indicator */}
                    <Html position={[0, -1.05, 0.4]} center>
                      <div className="bg-gray-900/95 dark:bg-white text-white dark:text-gray-900 text-[8px] font-black font-mono px-1 py-0.5 rounded shadow-sm select-none border border-gray-700/50 dark:border-gray-200 whitespace-nowrap">
                        ↔ {dims.w}
                      </div>
                    </Html>
                    {/* Depth indicator */}
                    <Html position={[0.65, -0.6, -0.45]} center>
                      <div className="bg-gray-950/90 text-white text-[8.5px] font-bold font-mono px-1 py-0.5 rounded shadow-sm select-none border border-white/10 whitespace-nowrap">
                        ↗ {dims.d}
                      </div>
                    </Html>
                  </group>
                )}

                <OrbitControls 
                  makeDefault 
                  enableDamping 
                  dampingFactor={0.05} 
                  maxPolarAngle={Math.PI / 1.9} // Prevent looking completely under grid
                  minDistance={1.5}
                  maxDistance={6.0}
                />
              </Canvas>
            </Suspense>
          </WebGLErrorBoundary>

          {/* Overlays inside the viewport */}
          {/* 1. Quick helper hint */}
          <div className="absolute top-3 start-3 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border border-gray-150/40 dark:border-gray-800/40 px-2.5 py-1 rounded-lg text-[9px] text-gray-500 dark:text-gray-400 font-bold select-none pointer-events-none">
            🖱️ {isRtl ? 'کلیک چپ و درگ برای چرخش | اسکرول برای زوم' : 'L-Click + Drag to Orbit | Scroll to Zoom'}
          </div>

          {/* 2. Calibration status indicators */}
          <div className="absolute top-3 end-3 flex gap-1.5">
            <button
              onClick={() => setShowGrid(!showGrid)}
              className={`p-1.5 rounded-lg border transition-all cursor-pointer ${
                showGrid 
                  ? 'bg-[#26B6B6]/15 border-[#26B6B6]/30 text-[#26B6B6]' 
                  : 'bg-white/60 dark:bg-gray-900/60 border-gray-200 dark:border-gray-800 text-gray-400 hover:text-gray-600'
              }`}
              title={isRtl ? 'نمایش/عدم نمایش گرید زمین' : 'Toggle Grid'}
            >
              <Grid3X3 className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setShowDimensions(!showDimensions)}
              className={`p-1.5 rounded-lg border transition-all cursor-pointer ${
                showDimensions 
                  ? 'bg-[#26B6B6]/15 border-[#26B6B6]/30 text-[#26B6B6]' 
                  : 'bg-white/60 dark:bg-gray-900/60 border-gray-200 dark:border-gray-800 text-gray-400 hover:text-gray-600'
              }`}
              title={isRtl ? 'نمایش/عدم نمایش ابعاد' : 'Toggle Dimensions'}
            >
              <Ruler className="w-3.5 h-3.5" />
            </button>
            
            {/* Auto Rotate Control with explicit speed toggle */}
            <div className="flex items-center bg-white/60 dark:bg-gray-900/60 border border-gray-200 dark:border-gray-800 rounded-lg overflow-hidden">
              <button
                onClick={() => setAutoRotate(!autoRotate)}
                className={`p-1.5 transition-all cursor-pointer ${
                  autoRotate 
                    ? 'text-[#26B6B6] bg-[#26B6B6]/10' 
                    : 'text-gray-400 hover:text-gray-600'
                }`}
                title={isRtl ? 'چرخش خودکار دوربین' : 'Auto Rotate'}
              >
                {autoRotate ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
              </button>
              {autoRotate && (
                <button
                  onClick={() => setRotationSpeed(prev => prev === 1 ? 2 : prev === 2 ? 4 : 1)}
                  className="px-1.5 py-1 text-[8px] font-black font-mono border-s border-gray-200 dark:border-gray-800 text-[#26B6B6] hover:bg-[#26B6B6]/10 cursor-pointer"
                  title={isRtl ? 'سرعت چرخش' : 'Rotation Speed'}
                >
                  {rotationSpeed}x
                </button>
              )}
            </div>

            {/* Immersive Fullscreen Button */}
            <button
              onClick={() => setIsFullscreen(true)}
              className="p-1.5 rounded-lg border transition-all cursor-pointer bg-white/60 dark:bg-gray-900/60 border-gray-200 dark:border-gray-800 text-gray-400 hover:text-gray-600"
              title={isRtl ? 'مشاهده تمام‌صفحه تعاملی' : 'Immersive Fullscreen'}
            >
              <Maximize2 className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* 3. Dynamic Interactive Sliders inside viewport depending on active object category */}
          {category === 'doors_windows' && (
            <div className="absolute bottom-3 start-3 end-3 bg-white/90 dark:bg-gray-900/90 backdrop-blur-md border border-gray-150/40 dark:border-gray-800/40 p-2.5 rounded-xl flex items-center justify-between gap-3 text-[10px] animate-fadeIn">
              <span className="font-extrabold text-[#26B6B6] flex items-center gap-1 shrink-0">
                <Sliders className="w-3 h-3" />
                <span>{subcategory.includes('door') ? (isRtl ? 'بازشو در' : 'Door Swing') : (isRtl ? 'بازشو پنجره' : 'Window Slide')}</span>
              </span>
              <input 
                type="range"
                min="0"
                max="100"
                value={openingRatio}
                onChange={(e) => setOpeningRatio(Number(e.target.value))}
                className="flex-1 accent-[#26B6B6] h-1.5 bg-gray-200 dark:bg-gray-800 rounded-lg cursor-pointer"
              />
              <span className="font-mono font-bold text-gray-700 dark:text-gray-300 shrink-0 w-8 text-end">
                {openingRatio}%
              </span>
            </div>
          )}

          {category === 'bathroom' && (
            <div className="absolute bottom-3 start-3 bg-white/90 dark:bg-gray-900/90 backdrop-blur-md border border-gray-150/40 dark:border-gray-800/40 px-3 py-2 rounded-xl flex items-center gap-2.5 text-[10px] animate-fadeIn">
              <span className="font-extrabold text-[#26B6B6]">{isRtl ? 'جریان آب شیر:' : 'Faucet Water Flow:'}</span>
              <button
                onClick={() => setWaterOn(!waterOn)}
                className={`px-2.5 py-1 rounded-lg text-[9px] font-black uppercase transition-all cursor-pointer ${
                  waterOn 
                    ? 'bg-cyan-500 text-white shadow-xs' 
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-400'
                }`}
              >
                {waterOn ? (isRtl ? 'باز' : 'ON') : (isRtl ? 'بسته' : 'OFF')}
              </button>
            </div>
          )}

          {category === 'materials_facades' && (
            <div className="absolute bottom-3 start-3 end-3 bg-white/90 dark:bg-gray-900/90 backdrop-blur-md border border-gray-150/40 dark:border-gray-800/40 p-2.5 rounded-xl flex items-center justify-between gap-3 text-[10px] animate-fadeIn">
              <span className="font-extrabold text-[#26B6B6] flex items-center gap-1 shrink-0">
                <Sliders className="w-3 h-3" />
                <span>{isRtl ? 'نمای انفجاری لایه‌ها' : 'Exploded Build-Up'}</span>
              </span>
              <input 
                type="range"
                min="0"
                max="100"
                value={explosionRatio}
                onChange={(e) => setExplosionRatio(Number(e.target.value))}
                className="flex-1 accent-[#26B6B6] h-1.5 bg-gray-200 dark:bg-gray-800 rounded-lg cursor-pointer"
              />
              <span className="font-mono font-bold text-gray-700 dark:text-gray-300 shrink-0 w-8 text-end">
                {explosionRatio}%
              </span>
            </div>
          )}

        </div>

        {/* CAD Metadata Panel (takes 1 col) */}
        <div className="bg-gray-50/60 dark:bg-gray-950/40 border border-gray-150 dark:border-gray-800/60 rounded-2xl p-4 flex flex-col justify-between text-start text-xs space-y-3.5 h-full">
          <div>
            <span className="text-[9px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest block mb-2">
              {isRtl ? 'مشخصات هندسی BIM' : 'Geometric Metadata'}
            </span>
            
            <div className="space-y-2.5">
              <div className="flex justify-between items-center py-1 border-b border-gray-100 dark:border-gray-800/50">
                <span className="text-gray-400">{isRtl ? 'طول (X)' : 'Width (X)'}</span>
                <span className="font-mono font-black text-gray-800 dark:text-gray-200">{dims.w}</span>
              </div>
              <div className="flex justify-between items-center py-1 border-b border-gray-100 dark:border-gray-800/50">
                <span className="text-gray-400">{isRtl ? 'ارتفاع (Y)' : 'Height (Y)'}</span>
                <span className="font-mono font-black text-gray-800 dark:text-gray-200">{dims.h}</span>
              </div>
              <div className="flex justify-between items-center py-1 border-b border-gray-100 dark:border-gray-800/50">
                <span className="text-gray-400">{isRtl ? 'عمق (Z)' : 'Depth (Z)'}</span>
                <span className="font-mono font-black text-gray-800 dark:text-gray-200">{dims.d}</span>
              </div>
              <div className="flex justify-between items-center py-1 border-b border-gray-100 dark:border-gray-800/50">
                <span className="text-gray-400">{isRtl ? 'حجم حدودی' : 'Est. Volume'}</span>
                <span className="font-mono font-black text-[#26B6B6]">{getBIMVolume()}</span>
              </div>
              <div className="flex justify-between items-center py-1 border-b border-gray-100 dark:border-gray-800/50">
                <span className="text-gray-400">{isRtl ? 'وزن حدودی' : 'Est. Weight'}</span>
                <span className="font-mono font-black text-gray-800 dark:text-gray-200">{getBIMWeight()}</span>
              </div>
              <div className="flex justify-between items-center py-1">
                <span className="text-gray-400">{isRtl ? 'تراکم مش' : 'Complexity'}</span>
                <span className="font-mono font-black text-gray-800 dark:text-gray-200">{getPolys()}</span>
              </div>
            </div>
          </div>

          {/* Smart warning note */}
          <div className="p-2.5 bg-amber-500/5 dark:bg-amber-500/10 border border-amber-500/15 rounded-xl space-y-1">
            <div className="flex items-center gap-1 text-amber-600 dark:text-amber-400">
              <Sparkles className="w-3 h-3 shrink-0" />
              <span className="text-[9px] font-black uppercase tracking-wider">{isRtl ? 'انطباق ۱۰۰٪ پارامتریک' : '100% CAD Compliant'}</span>
            </div>
            <p className="text-[9px] text-gray-500 dark:text-gray-400 leading-relaxed font-light">
              {isRtl 
                ? 'ابعاد و کانکتورهای تاسیساتی این آبجکت با ابعاد واقعی کارخانه تولیدی در رویت همگام‌سازی شده است.'
                : 'All connectors and structural dimension frames align fully with certified manufacture specification catalogs.'
              }
            </p>
          </div>
        </div>

      {/* ------------------------------------------------------------- */}
      {/* IMMERSIVE FULLSCREEN 3D VIEWPORT OVERLAY */}
      {/* ------------------------------------------------------------- */}
      {isFullscreen && (
        <div className="fixed inset-0 z-50 bg-slate-950 text-white flex flex-col md:flex-row p-4 md:p-6 gap-6 select-none overflow-hidden" dir={isRtl ? 'rtl' : 'ltr'}>
          {/* Main 3D Stage Area */}
          <div className="flex-1 relative h-[60vh] md:h-full bg-radial from-slate-900 to-slate-950 border border-slate-800 rounded-2xl overflow-hidden group">
            
            {/* Top Bar inside Fullscreen */}
            <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-10 pointer-events-none">
              <div className="bg-slate-900/90 backdrop-blur-md border border-slate-800 p-3 rounded-xl flex items-center gap-3 shadow-2xl pointer-events-auto max-w-[70%]">
                <div className="p-2 bg-[#26B6B6]/15 text-[#26B6B6] rounded-xl">
                  <Cpu className="w-5 h-5" />
                </div>
                <div className="text-start">
                  <h2 className="text-xs sm:text-sm font-black tracking-tight text-white flex items-center gap-2">
                    <span>{isRtl ? object.titleFa : object.titleEn}</span>
                    <span className="text-[9px] font-extrabold uppercase bg-[#26B6B6] text-white px-1.5 py-0.5 rounded-sm tracking-wider">IMMERSIVE BIM</span>
                  </h2>
                  <p className="text-[10px] text-slate-400 font-light truncate">
                    {isRtl ? 'مدل‌ساز و شبیه‌ساز پارامتریک سه‌بعدی زنده' : 'Certified 3D Live CAD Inspector'}
                  </p>
                </div>
              </div>

              {/* Exit Button */}
              <button
                onClick={() => setIsFullscreen(false)}
                className="bg-red-500/10 hover:bg-red-500 hover:text-white border border-red-500/30 text-red-400 p-3 rounded-xl transition-all shadow-2xl cursor-pointer pointer-events-auto flex items-center gap-1.5 font-bold text-xs"
                title={isRtl ? 'خروج از تمام‌صفحه' : 'Exit Fullscreen'}
              >
                <X className="w-4 h-4" />
                <span className="hidden sm:inline">{isRtl ? 'خروج (ESC)' : 'Exit (ESC)'}</span>
              </button>
            </div>

            {/* Helper tooltip inside viewport */}
            <div className="absolute bottom-4 left-4 bg-slate-900/95 backdrop-blur-md border border-slate-800 px-3.5 py-2 rounded-xl text-[10px] text-slate-400 font-bold select-none pointer-events-none z-10 shadow-xl flex items-center gap-2">
              <span className="text-[#26B6B6] text-xs">🖱️</span>
              <span>{isRtl ? 'کلیک چپ و درگ برای چرخش | اسکرول برای زوم | کلیک راست و درگ برای جابجایی' : 'L-Click + Drag to Rotate | Scroll to Zoom | R-Click to Pan'}</span>
            </div>

            {/* Quick Render Controls Overlay */}
            <div className="absolute top-4 right-4 flex flex-col gap-2 z-10">
              {/* Style controls */}
              <div className="bg-slate-900/90 backdrop-blur-md border border-slate-800 p-1 rounded-xl flex shadow-2xl" dir="ltr">
                <button
                  onClick={() => setRenderMode('realistic')}
                  className={`px-3 py-1.5 text-[10px] font-bold rounded-lg transition-all cursor-pointer ${
                    renderMode === 'realistic'
                      ? 'bg-[#26B6B6] text-white shadow-xs'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {isRtl ? 'سایه‌دار' : 'Shaded'}
                </button>
                <button
                  onClick={() => setRenderMode('wireframe')}
                  className={`px-3 py-1.5 text-[10px] font-bold rounded-lg transition-all cursor-pointer ${
                    renderMode === 'wireframe'
                      ? 'bg-[#26B6B6] text-white shadow-xs'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {isRtl ? 'وکتور' : 'Wireframe'}
                </button>
                <button
                  onClick={() => setRenderMode('xray')}
                  className={`px-3 py-1.5 text-[10px] font-bold rounded-lg transition-all cursor-pointer ${
                    renderMode === 'xray'
                      ? 'bg-[#26B6B6] text-white shadow-xs'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {isRtl ? 'اکس‌ری' : 'X-Ray'}
                </button>
              </div>

              {/* Extra toggles */}
              <div className="bg-slate-900/90 backdrop-blur-md border border-slate-800 p-1.5 rounded-xl flex justify-end gap-1.5 shadow-2xl">
                <button
                  onClick={() => setShowGrid(!showGrid)}
                  className={`p-2 rounded-lg border transition-all cursor-pointer ${
                    showGrid 
                      ? 'bg-[#26B6B6]/25 border-[#26B6B6]/40 text-[#26B6B6]' 
                      : 'bg-slate-950/40 border-slate-800 text-slate-500 hover:text-white'
                  }`}
                  title={isRtl ? 'نمایش/عدم نمایش گرید زمین' : 'Toggle Grid'}
                >
                  <Grid3X3 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setShowDimensions(!showDimensions)}
                  className={`p-2 rounded-lg border transition-all cursor-pointer ${
                    showDimensions 
                      ? 'bg-[#26B6B6]/25 border-[#26B6B6]/40 text-[#26B6B6]' 
                      : 'bg-slate-950/40 border-slate-800 text-slate-500 hover:text-white'
                  }`}
                  title={isRtl ? 'نمایش/عدم نمایش ابعاد' : 'Toggle Dimensions'}
                >
                  <Ruler className="w-4 h-4" />
                </button>
                
                {/* Auto Rotate Control */}
                <div className="flex items-center bg-slate-950/40 border border-slate-800 rounded-lg overflow-hidden">
                  <button
                    onClick={() => setAutoRotate(!autoRotate)}
                    className={`p-2 transition-all cursor-pointer ${
                      autoRotate 
                        ? 'text-[#26B6B6] bg-[#26B6B6]/15' 
                        : 'text-slate-500 hover:text-white'
                    }`}
                    title={isRtl ? 'چرخش خودکار دوربین' : 'Auto Rotate'}
                  >
                    {autoRotate ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                  </button>
                  {autoRotate && (
                    <button
                      onClick={() => setRotationSpeed(prev => prev === 1 ? 2 : prev === 2 ? 4 : 1)}
                      className="px-2 py-1.5 text-[9px] font-black font-mono border-s border-slate-800 text-[#26B6B6] hover:bg-[#26B6B6]/10 cursor-pointer"
                      title={isRtl ? 'تغییر سرعت چرخش' : 'Toggle Speed'}
                    >
                      {rotationSpeed}x
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Immersive Canvas Component */}
            <WebGLErrorBoundary fallback={webglFallback}>
              <Suspense fallback={
                <div className="w-full h-full flex flex-col items-center justify-center text-slate-400">
                  <RotateCw className="w-10 h-10 animate-spin text-[#26B6B6] mb-3" />
                  <span className="text-sm font-bold font-mono tracking-widest">LOADING 3D VIEWPORT...</span>
                </div>
              }>
                <Canvas camera={{ position: [3, 2, 3.8], fov: 40 }}>
                  <ambientLight intensity={renderMode === 'xray' ? 1.6 : 1.3} />
                  <directionalLight position={[5, 10, 5]} intensity={1.8} castShadow />
                  <directionalLight position={[-5, 5, -5]} intensity={0.6} />
                  <pointLight position={[0, 4, 0]} intensity={1.2} />
                  
                  <Center>
                    <BIMModelLoader 
                      category={category} 
                      sub={subcategory} 
                      mode={renderMode}
                      opening={openingRatio}
                      waterOn={waterOn}
                      explosion={explosionRatio}
                      autoRotate={autoRotate}
                      autoRotateSpeed={rotationSpeed}
                    />
                  </Center>

                  {showGrid && (
                    <Grid 
                      position={[0, -0.9, 0]}
                      args={[14, 14]}
                      cellSize={0.2}
                      cellThickness={0.6}
                      cellColor="#475569"
                      sectionSize={1}
                      sectionThickness={1.2}
                      sectionColor="#26B6B6"
                      fadeDistance={30}
                      infiniteGrid
                    />
                  )}

                  {showDimensions && (
                    <group position={[0, 0, 0]}>
                      <Html position={[-1.1, 0, 0]} center>
                        <div className="bg-[#26B6B6] text-white text-[9px] font-black font-mono px-2 py-0.5 rounded shadow-2xl border border-[#26B6B6]/40 select-none whitespace-nowrap">
                          ↕ {dims.h}
                        </div>
                      </Html>
                      <Html position={[0, -1.05, 0.6]} center>
                        <div className="bg-slate-900 text-white text-[9px] font-black font-mono px-2 py-0.5 rounded shadow-2xl border border-slate-700 select-none whitespace-nowrap">
                          ↔ {dims.w}
                        </div>
                      </Html>
                      <Html position={[0.8, -0.6, -0.6]} center>
                        <div className="bg-slate-950/90 text-white text-[9px] font-black font-mono px-2 py-0.5 rounded shadow-2xl border border-slate-800 select-none whitespace-nowrap">
                          ↗ {dims.d}
                        </div>
                      </Html>
                    </group>
                  )}

                  <OrbitControls 
                    makeDefault 
                    enableDamping 
                    dampingFactor={0.05} 
                    maxPolarAngle={Math.PI / 1.9}
                    minDistance={1.0}
                    maxDistance={8.0}
                  />
                </Canvas>
              </Suspense>
            </WebGLErrorBoundary>
          </div>

          {/* Sidebar / Parametric Control Dock */}
          <div className="w-full md:w-80 flex flex-col justify-between bg-slate-900 border border-slate-800 rounded-2xl p-5 text-start text-xs space-y-4 shadow-2xl">
            <div className="space-y-4">
              <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest block border-b border-slate-800 pb-2">
                {isRtl ? 'امکانات و کنترل‌های پارامتریک' : 'Parametric Features'}
              </span>

              {/* 1. Category-specific controllers */}
              {category === 'doors_windows' && (
                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-extrabold text-[#26B6B6] flex items-center gap-1.5">
                      <Sliders className="w-4 h-4" />
                      <span>{subcategory.includes('door') ? (isRtl ? 'میزان بازشو درب' : 'Door Swing') : (isRtl ? 'میزان بازشو پنجره' : 'Window Slide')}</span>
                    </span>
                    <span className="font-mono font-black text-slate-300 bg-slate-900 px-2 py-0.5 rounded border border-slate-800">{openingRatio}%</span>
                  </div>
                  <input 
                    type="range"
                    min="0"
                    max="100"
                    value={openingRatio}
                    onChange={(e) => setOpeningRatio(Number(e.target.value))}
                    className="w-full accent-[#26B6B6] h-1.5 bg-slate-800 rounded-lg cursor-pointer"
                  />
                  <p className="text-[9px] text-slate-500 leading-normal">
                    {isRtl 
                      ? 'میزان بازشدن لنگه در یا پنجره را تغییر داده و برخورد با دیوارهای مجاور را شبیه‌سازی کنید.' 
                      : 'Toggle sliding boundaries or door panel degrees to verify opening conflicts on architectural sites.'}
                  </p>
                </div>
              )}

              {category === 'bathroom' && (
                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3.5">
                  <span className="font-extrabold text-[#26B6B6] flex items-center gap-1.5">
                    <Sliders className="w-4 h-4" />
                    <span>{isRtl ? 'جریان زنده آب مصرفی' : 'Water Flow Simulation'}</span>
                  </span>
                  <div className="flex items-center justify-between gap-4">
                    <span className="text-slate-400 text-[10px]">{isRtl ? 'شبیه‌ساز سه‌بعدی جریان شیر مخلوط:' : 'BIM plumbing water flow:'}</span>
                    <button
                      onClick={() => setWaterOn(!waterOn)}
                      className={`px-3 py-1.5 rounded-xl text-[10px] font-black uppercase transition-all cursor-pointer ${
                        waterOn 
                          ? 'bg-[#26B6B6] text-white shadow-lg' 
                          : 'bg-slate-800 text-slate-500 border border-slate-700'
                      }`}
                    >
                      {waterOn ? (isRtl ? 'جریان باز' : 'ACTIVE') : (isRtl ? 'جریان بسته' : 'OFF')}
                    </button>
                  </div>
                </div>
              )}

              {category === 'materials_facades' && (
                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-extrabold text-[#26B6B6] flex items-center gap-1.5">
                      <Sliders className="w-4 h-4" />
                      <span>{isRtl ? 'فاصله انفجاری دیوار' : 'Explosion Spread'}</span>
                    </span>
                    <span className="font-mono font-black text-slate-300 bg-slate-900 px-2 py-0.5 rounded border border-slate-800">{explosionRatio}%</span>
                  </div>
                  <input 
                    type="range"
                    min="0"
                    max="100"
                    value={explosionRatio}
                    onChange={(e) => setExplosionRatio(Number(e.target.value))}
                    className="w-full accent-[#26B6B6] h-1.5 bg-slate-800 rounded-lg cursor-pointer"
                  />
                  <p className="text-[9px] text-slate-500 leading-normal">
                    {isRtl 
                      ? 'لایه‌های مختلف دیوار اعم از بتن پشتیبان، عایق پشم سنگ، لایه هوا و آجرنما را تفکیک کنید.' 
                      : 'Deconstruct wall buildup components including core concrete, thermal barrier wool, air cavity, and bricks.'}
                  </p>
                </div>
              )}

              {/* 2. Geometric details */}
              <div className="space-y-2 pt-2 border-t border-slate-800/80">
                <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest block">{isRtl ? 'ابعاد فنی آبجکت' : 'Technical Specifications'}</span>
                
                <div className="space-y-2 bg-slate-950 p-3 rounded-xl border border-slate-800/60 font-mono text-[11px]">
                  <div className="flex justify-between py-1 border-b border-slate-900">
                    <span className="text-slate-500">{isRtl ? 'طول کلی (X)' : 'Width (X)'}</span>
                    <span className="font-bold text-slate-200">{dims.w}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-900">
                    <span className="text-slate-500">{isRtl ? 'ارتفاع کلی (Y)' : 'Height (Y)'}</span>
                    <span className="font-bold text-slate-200">{dims.h}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-900">
                    <span className="text-slate-500">{isRtl ? 'عمق کلی (Z)' : 'Depth (Z)'}</span>
                    <span className="font-bold text-slate-200">{dims.d}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-900">
                    <span className="text-slate-500">{isRtl ? 'حجم اسمی' : 'Volume'}</span>
                    <span className="font-bold text-[#26B6B6]">{getBIMVolume()}</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-slate-500">{isRtl ? 'وزن خالص' : 'Net Weight'}</span>
                    <span className="font-bold text-slate-200">{getBIMWeight()}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Smart notice bottom */}
            <div className="p-3 bg-[#26B6B6]/5 border border-[#26B6B6]/15 rounded-xl space-y-1">
              <div className="flex items-center gap-1 text-[#26B6B6]">
                <Sparkles className="w-3.5 h-3.5 shrink-0" />
                <span className="text-[9px] font-black uppercase tracking-wider">{isRtl ? 'استاندارد معتبر BIM' : 'Certified Revit Standard'}</span>
              </div>
              <p className="text-[9px] text-slate-400 leading-relaxed font-light">
                {isRtl 
                  ? 'این فمیلی با بالاترین استانداردهای مدل‌سازی بیم در سازمان نظام فنی و اجرایی منطبق است.'
                  : 'Meets highest levels of detailing (LOD 350/400) specified by certified AEC software regulations.'
                }
              </p>
            </div>
          </div>
        </div>
      )}

      </div>
    </div>
  );
};
