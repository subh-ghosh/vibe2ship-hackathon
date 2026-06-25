import { useState } from 'react';
import { useMapStore } from '../store/mapStore';
import { Camera, MapPin, CheckCircle2 } from 'lucide-react';
import type { Issue } from '../types';

const CATEGORIES = [
  { id: 'pothole', icon: '🕳️', label: 'Pothole' },
  { id: 'garbage', icon: '🗑️', label: 'Garbage' },
  { id: 'water_leak', icon: '💧', label: 'Water Leak' },
  { id: 'broken_light', icon: '💡', label: 'Broken Light' },
  { id: 'road_damage', icon: '🚧', label: 'Road Damage' },
  { id: 'flooding', icon: '🌊', label: 'Flooding' },
  { id: 'manhole', icon: '⚠️', label: 'Open Manhole' },
];

export default function IssueReportSheet() {
  const { mode, setMode, setActiveTab, setSheetSnap, userLocation, issues, setIssues, center } = useMapStore();
  const [step, setStep] = useState<1 | 2>(1);
  const [selectedCat, setSelectedCat] = useState<string | null>(null);
  const [desc, setDesc] = useState('');

  if (mode !== 'report') return null;

  const handleSubmit = () => {
    if (!selectedCat) return;
    
    const newIssue: Issue = {
      id: `issue-${Date.now()}`,
      type: selectedCat as Issue['type'],
      lat: userLocation ? userLocation.lat : center.lat,
      lng: userLocation ? userLocation.lng : center.lng,
      status: 'reported',
      severity: 'medium', // Mock AI classification
      upvotes: 1,
      downvotes: 0,
      createdAt: new Date().toISOString(),
      description: desc
    };

    setIssues([newIssue, ...issues]);
    setStep(2);
    
    // Auto close after 2 seconds
    setTimeout(() => {
      setMode('explore');
      setActiveTab('explore');
      setSheetSnap('half');
      setStep(1);
      setSelectedCat(null);
      setDesc('');
    }, 2000);
  };

  return (
    <div className="w-full h-full bg-white flex flex-col pt-2 pb-6 px-4">
      {step === 1 ? (
        <>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-full bg-[#E8F0FE] flex items-center justify-center text-[#1A73E8]">
              <MapPin size={20} />
            </div>
            <div>
              <h2 className="text-[18px] font-medium text-[#1F1F1F]" style={{ fontFamily: 'Google Sans, sans-serif' }}>Report Civic Issue</h2>
              <p className="text-[13px] text-[#5F6368]">Help improve your city's infrastructure</p>
            </div>
          </div>

          <div className="grid grid-cols-4 gap-3 mb-6">
            {CATEGORIES.map(cat => (
              <button
                key={cat.id}
                onClick={() => setSelectedCat(cat.id)}
                className={`flex flex-col items-center justify-center gap-1.5 p-2 rounded-xl transition-colors ${
                  selectedCat === cat.id ? 'bg-[#E8F0FE] border border-[#1A73E8]' : 'bg-[#F8F9FA] border border-transparent'
                }`}
              >
                <span className="text-2xl">{cat.icon}</span>
                <span className="text-[11px] font-medium text-center leading-tight" style={{ color: selectedCat === cat.id ? '#1A73E8' : '#3C4043' }}>
                  {cat.label}
                </span>
              </button>
            ))}
          </div>

          <div className="mb-4">
            <textarea
              value={desc}
              onChange={e => setDesc(e.target.value)}
              placeholder="Add details for the authorities... (optional)"
              className="w-full h-24 p-3 rounded-xl border border-[#DADCE0] text-[14px] outline-none focus:border-[#1A73E8] resize-none"
            />
          </div>

          <div className="flex gap-3 mb-6 mt-auto">
            <button className="flex-1 flex items-center justify-center gap-2 h-12 rounded-full bg-[#F1F3F4] text-[#1F1F1F] font-medium text-[14px]">
              <Camera size={18} />
              Add Photo
            </button>
            <button 
              onClick={handleSubmit}
              disabled={!selectedCat}
              className={`flex-1 h-12 rounded-full font-medium text-[14px] transition-colors ${
                selectedCat ? 'bg-[#1A73E8] text-white' : 'bg-[#E8EAED] text-[#9AA0A6]'
              }`}
            >
              Submit Report
            </button>
          </div>
        </>
      ) : (
        <div className="flex-1 flex flex-col items-center justify-center text-center pb-12">
          <CheckCircle2 size={64} className="text-[#34A853] mb-4" />
          <h2 className="text-[22px] font-medium text-[#1F1F1F] mb-2" style={{ fontFamily: 'Google Sans, sans-serif' }}>Issue Reported</h2>
          <p className="text-[14px] text-[#5F6368]">Thank you for contributing! Our AI has categorized this report and alerted local authorities.</p>
        </div>
      )}
    </div>
  );
}
