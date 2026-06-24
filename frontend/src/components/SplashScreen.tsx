import { useState, useEffect } from 'react';

export default function SplashScreen() {
  const [show, setShow] = useState(true);
  const [fade, setFade] = useState(false);

  useEffect(() => {
    // Start fading out after 1.5s
    const t1 = setTimeout(() => setFade(true), 1500);
    // Remove from DOM after 1.8s
    const t2 = setTimeout(() => setShow(false), 1800);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);

  if (!show) return null;

  return (
    <div 
      className={`absolute inset-0 z-[100] bg-white flex flex-col items-center justify-center transition-opacity duration-300 ${fade ? 'opacity-0' : 'opacity-100'}`}
    >
      <div className={`transition-transform duration-700 ease-[cubic-bezier(0.175,0.885,0.32,1.275)] ${fade ? 'scale-[1.2] opacity-0' : 'scale-100 opacity-100'}`}>
        <img 
          src="https://maps.gstatic.com/mapfiles/maps_lite/pwa/icons/maps15_bnuw3a_round_192x192.png" 
          alt="Google Maps"
          className="w-24 h-24 shadow-sm rounded-full"
          style={{ animation: 'splashPop 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards' }}
        />
      </div>

      <style>{`
        @keyframes splashPop {
          0% { transform: scale(0.6); opacity: 0; }
          100% { transform: scale(1); opacity: 1; }
        }
      `}</style>
    </div>
  );
}
