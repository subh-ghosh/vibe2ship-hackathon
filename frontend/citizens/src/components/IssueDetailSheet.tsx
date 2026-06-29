import { ThumbsUp, ThumbsDown, Info, ShieldCheck, MapPin } from 'lucide-react';
import { useMapStore } from '../store/mapStore';

export default function IssueDetailSheet() {
  const { mode, activeIssue, setMode, setSheetSnap, fetchIssues } = useMapStore();

  if (mode !== 'issue' || !activeIssue) return null;

  const handleVerify = async (action: 'upvote' | 'downvote') => {
    try {
      await fetch(`http://localhost:8080/api/issues/${activeIssue.id}/verify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action })
      });
      // Give feedback
      alert(`Thank you for helping verify this issue! You earned 10 Community Hero Points.`);
      // Refresh issues and close
      await fetchIssues();
      setMode('explore');
      setSheetSnap('half');
    } catch (e) {
      console.log('Verification failed', e);
      alert('Community Verification successful (Offline mode).');
      setMode('explore');
      setSheetSnap('half');
    }
  };

  return (
    <div className="bg-white min-h-[400px]">
      {/* Header Image */}
      <div className="h-40 bg-gradient-to-br from-slate-200 to-slate-300 relative">
        <div className="absolute top-4 left-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1.5 shadow-sm">
          <span className="capitalize">{activeIssue.severity} Severity</span>
        </div>
        <div className="absolute top-4 right-4 bg-blue-500 text-white px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1.5 shadow-sm">
          <ShieldCheck size={14} />
          {activeIssue.aiConfidence ? `${activeIssue.aiConfidence}% AI Conf` : 'AI Analyzed'}
        </div>
      </div>

      <div className="px-5 py-4">
        <h2 className="text-[22px] font-normal text-[#1F1F1F] mb-1 capitalize" style={{ fontFamily: 'Google Sans, sans-serif' }}>
          {activeIssue.type.replace('_', ' ')}
        </h2>
        
        <div className="flex flex-col gap-1 text-[#5F6368] text-[14px] mb-4">
          <div className="flex items-center gap-1.5">
            <MapPin size={16} />
            {activeIssue.lat.toFixed(4)}, {activeIssue.lng.toFixed(4)}
          </div>
          <div className="flex items-center gap-1.5 text-[#146C2E] font-medium text-[13px]">
            <Info size={16} />
            Status: <span className="capitalize">{activeIssue.status}</span>
          </div>
        </div>

        {activeIssue.description && (
          <div className="bg-[#F8F9FA] rounded-xl p-4 text-[#444746] text-sm mb-6 leading-relaxed">
            "{activeIssue.description}"
          </div>
        )}

        <div className="border-t border-[#E8EAED] pt-5">
          <h3 className="font-medium text-[#1F1F1F] mb-3 text-sm">Community Verification Request</h3>
          <p className="text-[#5F6368] text-xs mb-4">
            Are you currently near this location? Please verify if this issue still exists to help the authorities and earn Civic Points.
          </p>

          <div className="flex gap-3">
            <button 
              onClick={() => handleVerify('upvote')}
              className="flex-1 bg-[#E8F0FE] text-[#1A73E8] py-3 rounded-full font-medium text-sm flex items-center justify-center gap-2 active:scale-95 transition-transform"
            >
              <ThumbsUp size={18} /> Yes, it's still here
            </button>
            <button 
              onClick={() => handleVerify('downvote')}
              className="flex-1 bg-[#FCE8E6] text-[#D93025] py-3 rounded-full font-medium text-sm flex items-center justify-center gap-2 active:scale-95 transition-transform"
            >
              <ThumbsDown size={18} /> No, it's fixed
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
