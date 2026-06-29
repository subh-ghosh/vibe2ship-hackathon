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
      <div className={`transition-transform duration-700 ease-[cubic-bezier(0.175,0.885,0.32,1.275)] flex flex-col items-center gap-4 ${fade ? 'scale-[1.2] opacity-0' : 'scale-100 opacity-100'}`}>
        <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center shadow-lg"
             style={{ animation: 'splashPop 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards' }}>
          <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.106 5.553a2 2 0 0 0 1.788 0l3.659-1.83A1 1 0 0 1 21 4.619v12.764a1 1 0 0 1-.553.894l-4.553 2.277a2 2 0 0 1-1.788 0l-4.212-2.106a2 2 0 0 0-1.788 0l-3.659 1.83A1 1 0 0 1 3 19.381V6.618a1 1 0 0 1 .553-.894l4.553-2.277a2 2 0 0 1 1.788 0z"/><path d="M15 5.764v15"/><path d="M9 3.236v15"/></svg>
        </div>
        <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-emerald-500" 
            style={{ animation: 'splashPop 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275) 0.1s both' }}>
          CivicOS
        </h1>
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
