import { useState, useEffect } from 'react';
import { X, Volume2, VolumeX, Maximize2, ChevronRight } from 'lucide-react';
import { useMapStore } from '../store/mapStore';
import type { RouteStep } from '../types';

const DIRECTION_ICONS: Record<string, string> = {
  straight: '⬆️',
  left: '⬅️',
  right: '➡️',
  'slight-left': '↖️',
  'slight-right': '↗️',
  'u-turn': '↩️',
  arrive: '🏁',
};

function NavArrow({ direction }: { direction: string }) {
  const icons: Record<string, React.ReactNode> = {
    straight: (
      <svg viewBox="0 0 24 24" width="32" height="32" fill="white">
        <path d="M12 4l-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8z" />
      </svg>
    ),
    right: (
      <svg viewBox="0 0 24 24" width="32" height="32" fill="white" style={{ transform: 'rotate(90deg)' }}>
        <path d="M12 4l-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8z" />
      </svg>
    ),
    left: (
      <svg viewBox="0 0 24 24" width="32" height="32" fill="white" style={{ transform: 'rotate(-90deg)' }}>
        <path d="M12 4l-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8z" />
      </svg>
    ),
    'slight-right': (
      <svg viewBox="0 0 24 24" width="32" height="32" fill="white" style={{ transform: 'rotate(45deg)' }}>
        <path d="M12 4l-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8z" />
      </svg>
    ),
    'slight-left': (
      <svg viewBox="0 0 24 24" width="32" height="32" fill="white" style={{ transform: 'rotate(-45deg)' }}>
        <path d="M12 4l-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8z" />
      </svg>
    ),
    arrive: (
      <svg viewBox="0 0 24 24" width="32" height="32" fill="white">
        <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
      </svg>
    ),
    'u-turn': (
      <svg viewBox="0 0 24 24" width="32" height="32" fill="white">
        <path d="M12 5V1L7 6l5 5V7c3.31 0 6 2.69 6 6s-2.69 6-6 6-6-2.69-6-6H4c0 4.42 3.58 8 8 8s8-3.58 8-8-3.58-8-8-8z" />
      </svg>
    ),
  };
  return icons[direction] || icons.straight;
}

export default function NavigationMode() {
  const {
    mode, navigating, routeSteps, currentStepIndex,
    setCurrentStepIndex, setMode, setNavigating, activeRoute,
    setRoutes, setActiveRoute,
  } = useMapStore();

  const [muted, setMuted] = useState(false);
  const [showSteps, setShowSteps] = useState(false);
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    if (!navigating) return;
    const timer = setInterval(() => setElapsed(e => e + 1), 1000);
    return () => clearInterval(timer);
  }, [navigating]);

  const currentStep: RouteStep | undefined = routeSteps[currentStepIndex];
  const nextStep: RouteStep | undefined = routeSteps[currentStepIndex + 1];

  const exitNavigation = () => {
    setMode('explore');
    setNavigating(false);
    setCurrentStepIndex(0);
    setRoutes([]);
    setActiveRoute(null);
  };

  const nextStepHandler = () => {
    if (currentStepIndex < routeSteps.length - 1) {
      setCurrentStepIndex(currentStepIndex + 1);
    } else {
      exitNavigation();
    }
  };

  if (!navigating || mode !== 'navigate') return null;

  const remainingTime = activeRoute
    ? Math.max(0, Math.round(activeRoute.durationSeconds / 60) - Math.floor(elapsed / 60))
    : 0;

  const eta = new Date(Date.now() + remainingTime * 60000).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });

  return (
    <div className="absolute inset-0 z-50 flex flex-col pointer-events-none">
      {/* Top navigation instruction card */}
      <div
        className="mx-3 mt-3 rounded-2xl overflow-hidden pointer-events-auto"
        style={{ boxShadow: '0 4px 16px rgba(0,0,0,.3)' }}
      >
        {/* Main direction */}
        <div className="bg-[#1A73E8] px-4 py-4 flex items-center gap-4">
          <div className="w-14 h-14 rounded-xl bg-white/20 flex items-center justify-center flex-shrink-0">
            <NavArrow direction={currentStep?.direction || 'straight'} />
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-white text-[22px] font-medium leading-tight truncate">
              {currentStep?.instruction || 'Continue on route'}
            </div>
            {currentStep?.streetName && (
              <div className="text-white/80 text-[14px] mt-0.5 truncate">{currentStep.streetName}</div>
            )}
          </div>
          <div className="text-white/90 text-[15px] font-medium flex-shrink-0">
            {currentStep?.distance}
          </div>
        </div>

        {/* Next step preview */}
        {nextStep && (
          <div className="bg-[#1557B0] px-4 py-2 flex items-center gap-3">
            <span className="text-white/70 text-[12px]">Then</span>
            <span className="text-lg">{DIRECTION_ICONS[nextStep.direction] || '⬆️'}</span>
            <span className="text-white/90 text-[13px] flex-1 truncate">{nextStep.instruction}</span>
            <span className="text-white/70 text-[12px]">{nextStep.distance}</span>
          </div>
        )}
      </div>

      {/* Speed indicator (fake) */}
      <div className="absolute left-3 top-[160px] pointer-events-auto">
        <div className="bg-white rounded-xl px-3 py-2 shadow-lg text-center">
          <div className="text-[24px] font-bold text-[#202124]">{35 + Math.floor(elapsed / 10) % 20}</div>
          <div className="text-[10px] text-[#5F6368]">km/h</div>
        </div>
      </div>

      {/* Right controls */}
      <div className="absolute right-3 top-[130px] flex flex-col gap-2 pointer-events-auto">
        <button
          onClick={() => setMuted(!muted)}
          className="w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center"
        >
          {muted ? <VolumeX size={20} color="#5F6368" /> : <Volume2 size={20} color="#1A73E8" />}
        </button>
        <button
          onClick={() => setShowSteps(!showSteps)}
          className="w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center"
        >
          <Maximize2 size={18} color="#5F6368" />
        </button>
      </div>

      {/* Bottom panel */}
      <div className="mt-auto pointer-events-auto">
        {/* Steps list */}
        {showSteps && (
          <div className="mx-3 mb-2 bg-white rounded-2xl shadow-lg max-h-64 overflow-y-auto">
            <div className="px-4 py-3 border-b border-[#F1F3F4] flex items-center justify-between">
              <span className="font-medium text-[#202124]">Route steps</span>
              <button onClick={() => setShowSteps(false)}><X size={18} color="#5F6368" /></button>
            </div>
            {routeSteps.map((step, i) => (
              <div
                key={i}
                className={`flex items-center gap-3 px-4 py-3 border-b border-[#F1F3F4] ${i === currentStepIndex ? 'bg-[#E8F0FE]' : ''}`}
              >
                <span className="text-lg flex-shrink-0">{DIRECTION_ICONS[step.direction] || '⬆️'}</span>
                <div className="flex-1 min-w-0">
                  <div className="text-[13px] text-[#202124] truncate">{step.instruction}</div>
                  {step.streetName && <div className="text-[11px] text-[#5F6368] truncate">{step.streetName}</div>}
                </div>
                <span className="text-[12px] text-[#5F6368] flex-shrink-0">{step.distance}</span>
              </div>
            ))}
          </div>
        )}

        {/* ETA bar */}
        <div
          className="bg-white mx-3 mb-3 rounded-2xl px-4 py-3 flex items-center gap-4"
          style={{ boxShadow: '0 4px 16px rgba(0,0,0,.2)' }}
        >
          <div className="flex-1">
            <div className="text-[24px] font-medium text-[#202124]">{remainingTime} min</div>
            <div className="flex items-center gap-2 text-[13px] text-[#5F6368]">
              <span>{activeRoute?.distance}</span>
              <span>·</span>
              <span>ETA {eta}</span>
            </div>
          </div>

          <button
            onClick={nextStepHandler}
            className="bg-[#E8F0FE] text-[#1A73E8] px-4 py-2 rounded-full text-[13px] font-medium"
          >
            Next step
          </button>

          <button
            onClick={exitNavigation}
            className="w-10 h-10 rounded-full bg-[#EA4335]/10 flex items-center justify-center"
          >
            <X size={18} color="#EA4335" />
          </button>
        </div>
      </div>
    </div>
  );
}
