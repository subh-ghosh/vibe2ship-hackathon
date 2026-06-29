import { Trophy, ShieldCheck, MapPin, Award, Navigation, Star } from 'lucide-react';
import { useMapStore } from '../store/mapStore';

export default function ProfileSheet() {
  const { mode } = useMapStore();

  if (mode !== 'profile') return null;

  return (
    <div className="bg-white min-h-[400px]">
      {/* Header Profile */}
      <div className="bg-gradient-to-br from-blue-500 to-blue-700 px-5 pt-6 pb-12 relative overflow-hidden">
        {/* Decorative circles */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-xl translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-blue-400/20 rounded-full blur-lg -translate-x-1/2 translate-y-1/2" />
        
        <div className="relative z-10 flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-white/20 border-2 border-white/40 flex items-center justify-center backdrop-blur-sm">
            <span className="text-2xl font-bold text-white">S</span>
          </div>
          <div>
            <h2 className="text-xl font-bold text-white mb-1">Subh Ghosh</h2>
            <div className="flex items-center gap-2">
              <span className="bg-white/20 text-white px-2 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider backdrop-blur-sm flex items-center gap-1">
                <Trophy size={12} className="text-yellow-300" />
                Civic Champion
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards - overlapping header */}
      <div className="px-5 -mt-6 relative z-20">
        <div className="bg-white rounded-xl shadow-lg border border-[#E8EAED] p-4 flex justify-between">
          <div className="flex flex-col items-center justify-center flex-1 border-r border-[#E8EAED]">
            <span className="text-[#1A73E8] font-bold text-2xl mb-1">450</span>
            <span className="text-[#5F6368] text-xs font-medium uppercase tracking-wider">Points</span>
          </div>
          <div className="flex flex-col items-center justify-center flex-1 border-r border-[#E8EAED]">
            <span className="text-[#1A73E8] font-bold text-2xl mb-1">12</span>
            <span className="text-[#5F6368] text-xs font-medium uppercase tracking-wider">Reports</span>
          </div>
          <div className="flex flex-col items-center justify-center flex-1">
            <span className="text-[#146C2E] font-bold text-2xl mb-1">28</span>
            <span className="text-[#5F6368] text-xs font-medium uppercase tracking-wider">Verified</span>
          </div>
        </div>
      </div>

      <div className="px-5 py-6">
        <h3 className="font-bold text-[#1F1F1F] mb-4 text-base">Recent Contributions</h3>
        
        <div className="space-y-4">
          <div className="flex gap-4">
            <div className="w-10 h-10 rounded-full bg-[#E8F0FE] flex items-center justify-center flex-shrink-0 text-[#1A73E8]">
              <ShieldCheck size={20} />
            </div>
            <div className="flex-1 border-b border-[#E8EAED] pb-4">
              <div className="flex justify-between items-start mb-1">
                <h4 className="font-medium text-[#1F1F1F] text-sm">Verified Pothole</h4>
                <span className="text-[#1A73E8] font-bold text-xs">+10 pts</span>
              </div>
              <p className="text-[#5F6368] text-xs flex items-center gap-1 mb-1">
                <MapPin size={12} /> Indiranagar 100ft Rd
              </p>
              <p className="text-[#5F6368] text-[11px]">2 days ago</p>
            </div>
          </div>
          
          <div className="flex gap-4">
            <div className="w-10 h-10 rounded-full bg-[#FCE8E6] flex items-center justify-center flex-shrink-0 text-[#D93025]">
              <AlertTriangle size={20} />
            </div>
            <div className="flex-1 pb-2">
              <div className="flex justify-between items-start mb-1">
                <h4 className="font-medium text-[#1F1F1F] text-sm">Reported Flooding</h4>
                <span className="text-[#1A73E8] font-bold text-xs">+50 pts</span>
              </div>
              <p className="text-[#5F6368] text-xs flex items-center gap-1 mb-1">
                <MapPin size={12} /> Koramangala Sec 4
              </p>
              <p className="text-[#5F6368] text-[11px]">1 week ago</p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Spacer for bottom nav */}
      <div className="h-20" />
    </div>
  );
}

function AlertTriangle(props: any) {
  return <svg xmlns="http://www.w3.org/2000/svg" width={props.size || 24} height={props.size || 24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>;
}
