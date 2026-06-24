import { useRef, useState, useCallback } from 'react';
import { useMotionValue, useTransform, motion, PanInfo } from 'framer-motion';
import { useMapStore } from '../store/mapStore';

interface BottomSheetProps {
  children: React.ReactNode;
  peekHeight?: number;
  halfHeight?: number;
}

const SNAP_POINTS = {
  peek: 0,
  half: 1,
  full: 2,
};

export default function BottomSheet({ children, peekHeight = 160, halfHeight = 420 }: BottomSheetProps) {
  const { sheetSnap, setSheetSnap, mode } = useMapStore();
  const [isDragging, setIsDragging] = useState(false);

  const fullHeight = window.innerHeight - 80;
  const bottomNavHeight = mode === 'explore' ? 80 : 0;

  const snapOffsets: Record<string, number> = {
    peek: fullHeight - peekHeight - bottomNavHeight,
    half: fullHeight - halfHeight - bottomNavHeight,
    full: 0,
  };

  const yOffset = snapOffsets[sheetSnap];

  const handleDragEnd = useCallback((_: unknown, info: PanInfo) => {
    setIsDragging(false);
    const velocity = info.velocity.y;
    const offset = info.offset.y;

    if (velocity < -300 || offset < -80) {
      // Swipe up
      if (sheetSnap === 'peek') setSheetSnap('half');
      else if (sheetSnap === 'half') setSheetSnap('full');
    } else if (velocity > 300 || offset > 80) {
      // Swipe down
      if (sheetSnap === 'full') setSheetSnap('half');
      else if (sheetSnap === 'half') setSheetSnap('peek');
    }
  }, [sheetSnap, setSheetSnap]);

  if (mode !== 'place' && mode !== 'directions' && mode !== 'explore') return null;

  return (
    <motion.div
      drag="y"
      dragConstraints={{ top: 0, bottom: snapOffsets.peek }}
      dragElastic={0.05}
      onDragStart={() => setIsDragging(true)}
      onDragEnd={handleDragEnd}
      animate={{ y: yOffset }}
      transition={{ type: 'spring', damping: 28, stiffness: 400, mass: 0.8 }}
      className="absolute left-0 right-0 bg-white z-40 overflow-hidden shadow-2xl"
      style={{
        top: '80px', // start exactly below the top search bar (if any) or just fill from 80px
        height: fullHeight,
        borderRadius: '20px 20px 0 0',
        boxShadow: '0 -2px 20px rgba(0,0,0,.25)',
      }}
    >
      {/* Expanded Drag handle area for easier grabbing */}
      <div 
        className="flex justify-center pt-3 pb-4 flex-shrink-0 cursor-grab active:cursor-grabbing w-full"
        onClick={() => {
          if (sheetSnap === 'peek') setSheetSnap('half');
          else if (sheetSnap === 'half') setSheetSnap('full');
          else if (sheetSnap === 'full') setSheetSnap('half');
        }}
      >
        <div className="drag-handle !mt-0 !w-12 !h-[5px]" />
      </div>

      {/* Content */}
      <div
        className="overflow-y-auto"
        style={{
          height: fullHeight - 24,
          paddingBottom: mode === 'explore' ? '80px' : '0px',
          overscrollBehavior: 'contain',
          WebkitOverflowScrolling: 'touch',
        }}
      >
        {children}
      </div>
    </motion.div>
  );
}
