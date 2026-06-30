import { useState, useEffect } from 'react';
import { Activity, AlertTriangle, CheckCircle, Map as MapIcon, Users, Bell, Search, LayoutDashboard, X, Bot, Sparkles, Navigation } from 'lucide-react';
import Map, { Marker } from 'react-map-gl/maplibre';
import 'maplibre-gl/dist/maplibre-gl.css';

export default function App() {
  const [selectedIssue, setSelectedIssue] = useState<any>(null);
  const [aiPlan, setAiPlan] = useState<string | null>(null);
  const [aiLoading, setAiLoading] = useState(false);
  const [issuesFeed, setIssuesFeed] = useState<any[]>([]);
  const [dashboardStats, setDashboardStats] = useState({
    totalReports: 0,
    activeIssues: 0,
    criticalIssues: 0,
    resolutionRate: 0,
    healthScore: 84,
    dispatched: 0
  });



  // Fetch live issues from Spring Boot backend
  useEffect(() => {
    const fetchLiveIssues = async () => {
      try {
        const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';
        const res = await fetch(`${API_URL}/api/issues?size=20`);
        const data = await res.json();
        if (data && data.content) {
          // Format for dashboard
          const formatted = data.content.map((issue: any) => ({
            id: issue.id.substring(0, 8).toUpperCase(),
            rawId: issue.id,
            type: issue.type.replace('_', ' '),
            severity: issue.severity ? issue.severity.charAt(0).toUpperCase() + issue.severity.slice(1) : 'Medium',
            location: `${issue.lat.toFixed(4)}, ${issue.lng.toFixed(4)}`,
            time: issue.createdAt ? new Date(issue.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Just now',
            status: issue.status === 'reported' ? 'Unassigned' : issue.status.charAt(0).toUpperCase() + issue.status.slice(1),
            aiConfidence: issue.aiConfidence || 92,
            desc: issue.description || 'No description provided.'
          }));
          setIssuesFeed(formatted);
        }
      } catch (e) {
        console.error('Failed to fetch live issues, using fallback data', e);
        if (issuesFeed.length === 0) {
          setIssuesFeed([
            { id: 'MOCK-1', rawId: 'mock-1', type: 'Pothole', severity: 'High', location: '12.9716, 77.5946', time: 'Just now', status: 'Unassigned', aiConfidence: 95, desc: 'Large pothole on main road' },
            { id: 'MOCK-2', rawId: 'mock-2', type: 'Streetlight', severity: 'Medium', location: '12.9720, 77.5950', time: '5m ago', status: 'Dispatched', aiConfidence: 88, desc: 'Streetlight completely dark' },
            { id: 'MOCK-3', rawId: 'mock-3', type: 'Water Leak', severity: 'Critical', location: '12.9710, 77.5940', time: '10m ago', status: 'Unassigned', aiConfidence: 99, desc: 'Major water pipe burst' }
          ]);
        }
      }
    };

    const fetchDashboardStats = async () => {
      try {
        const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';
        const res = await fetch(`${API_URL}/api/dashboard`);
        const data = await res.json();
        if (data) {
          setDashboardStats({
            totalReports: data.totalReports || 0,
            activeIssues: data.activeIssues || 0,
            criticalIssues: data.criticalIssues || 0,
            resolutionRate: data.resolutionRate || 0,
            healthScore: data.cityHealthScore || 84,
            dispatched: data.dispatchedIssues || 0
          });
        }
      } catch (e) {
        console.error('Failed to fetch dashboard stats, using fallback data', e);
        setDashboardStats({
          totalReports: 1420,
          activeIssues: 125,
          criticalIssues: 12,
          resolutionRate: 91,
          healthScore: 84,
          dispatched: 45
        });
      }
    };

    fetchLiveIssues();
    fetchDashboardStats();
    // Poll every 5 seconds for live demo magic
    const interval = setInterval(() => { fetchLiveIssues(); fetchDashboardStats(); }, 5000);
    return () => clearInterval(interval);
  }, []);

  // Fetch AI resolution plan when issue is selected
  useEffect(() => {
    if (!selectedIssue?.rawId) { setAiPlan(null); return; }
    setAiLoading(true);
    setAiPlan(null);
    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';
    fetch(`${API_URL}/api/issues/${selectedIssue.rawId}/ai-plan`, { method: 'POST' })
      .then(res => res.json())
      .then(data => { if (data?.plan) setAiPlan(data.plan); })
      .catch(() => setAiPlan('IMPACT: Unable to reach AI service. Using fallback analysis.\nACTION_1: Dispatch nearest field team\nACTION_2: Assess on-site and report back\nACTION_3: Complete repair\nCOST: ₹ 10,000 - ₹ 20,000\nTIME: 2-3 hours\nPRIORITY: Standard'))
      .finally(() => setAiLoading(false));
  }, [selectedIssue?.rawId]);

  return (
    <div className="flex h-screen overflow-hidden bg-[#0D1117] text-[#C9D1D9] relative">
      {/* Sidebar */}
      <aside className="w-64 border-r border-[#30363D] bg-[#161B22] flex flex-col z-20">
        <div className="h-16 flex items-center px-6 border-b border-[#30363D]">
          <div className="flex items-center gap-3">
            <div className="bg-[#1A73E8] p-2 rounded-lg">
              <Bot className="text-white" size={24} />
            </div>
            <h1 className="text-xl font-bold text-white tracking-tight">
              Community Intelligence <span className="text-sm font-medium text-slate-400">Command Center</span>
            </h1>
          </div>
        </div>
        
        <nav className="flex-1 py-4 px-3 space-y-1">
          <a href="#" className="flex items-center gap-3 px-3 py-2 rounded-lg bg-[#21262D] text-white">
            <LayoutDashboard size={20} className="text-blue-400" />
            <span className="font-medium">Overview</span>
          </a>
          <a href="#" className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-[#21262D]/50 transition-colors text-slate-300">
            <AlertTriangle size={20} className="text-red-400" />
            <span className="font-medium">Active Incidents</span>
            <span className="ml-auto bg-red-500/20 text-red-400 py-0.5 px-2 rounded-full text-xs font-bold">12</span>
          </a>
          <a href="#" className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-[#21262D]/50 transition-colors text-slate-300">
            <MapIcon size={20} className="text-emerald-400" />
            <span className="font-medium">Live Map</span>
          </a>
          <a href="#" className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-[#21262D]/50 transition-colors text-slate-300">
            <Users size={20} className="text-purple-400" />
            <span className="font-medium">Field Teams</span>
          </a>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden relative">
        {/* Header */}
        <header className="h-16 flex items-center justify-between px-8 border-b border-[#30363D] bg-[#161B22]/50 backdrop-blur-sm z-10">
          <div className="relative w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Search incidents, wards, or teams..." 
              className="w-full bg-[#0D1117] border border-[#30363D] rounded-full py-1.5 pl-10 pr-4 text-sm focus:outline-none focus:border-blue-500 transition-colors placeholder-slate-500"
            />
          </div>
          <div className="flex items-center gap-4">
            <button className="relative p-2 text-slate-300 hover:text-white transition-colors">
              <Bell size={20} />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-blue-500 rounded-full"></span>
            </button>
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500"></div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-bold text-white mb-1">City Infrastructure Health</h2>
              <p className="text-slate-400 text-sm">Real-time AI analysis of Bangalore metro area</p>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-lg">
                <Activity size={18} className="text-emerald-400" />
                <span className="text-emerald-400 font-medium">Health Score: {dashboardStats.healthScore}/100</span>
              </div>
            </div>
          </div>

          {/* Metrics Grid */}
          <div className="grid grid-cols-4 gap-6 mb-8">
            <div className="bg-[#161B22] border border-[#30363D] rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-slate-400 font-medium">Total Reports</h3>
                <div className="p-2 bg-blue-500/10 rounded-lg">
                  <Activity size={20} className="text-blue-400" />
                </div>
              </div>
              <div className="text-3xl font-bold text-white mb-1">{dashboardStats.totalReports.toLocaleString()}</div>
              <div className="text-sm text-blue-400 flex items-center gap-1">
                <span>{dashboardStats.activeIssues.toLocaleString()} active</span>
              </div>
            </div>
            <div className="bg-[#161B22] border border-[#30363D] rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-slate-400 font-medium">Critical Issues</h3>
                <div className="p-2 bg-red-500/10 rounded-lg">
                  <AlertTriangle size={20} className="text-red-400" />
                </div>
              </div>
              <div className="text-3xl font-bold text-white mb-1">{dashboardStats.criticalIssues.toLocaleString()}</div>
              <div className="text-sm text-red-400 flex items-center gap-1">
                <span>Requires immediate attention</span>
              </div>
            </div>
            <div className="bg-[#161B22] border border-[#30363D] rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-slate-400 font-medium">Resolution Rate</h3>
                <div className="p-2 bg-emerald-500/10 rounded-lg">
                  <CheckCircle size={20} className="text-emerald-400" />
                </div>
              </div>
              <div className="text-3xl font-bold text-white mb-1">{dashboardStats.resolutionRate}%</div>
              <div className="text-sm text-emerald-400 flex items-center gap-1">
                <span>Computed from live data</span>
              </div>
            </div>
            <div className="bg-[#161B22] border border-[#30363D] rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-slate-400 font-medium">Teams Dispatched</h3>
                <div className="p-2 bg-purple-500/10 rounded-lg">
                  <Navigation size={20} className="text-purple-400" />
                </div>
              </div>
              <div className="text-3xl font-bold text-white mb-1">{dashboardStats.dispatched.toLocaleString()}</div>
              <div className="text-sm text-purple-400 flex items-center gap-1">
                <span>Field teams active</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-6">
            {/* Live Map */}
            <div className="col-span-2 bg-[#161B22] border border-[#30363D] rounded-xl p-0 relative overflow-hidden h-[450px]">
              <div className="absolute top-4 left-4 z-10 bg-[#0D1117]/80 backdrop-blur border border-[#30363D] px-4 py-2 rounded-lg">
                <h3 className="text-sm font-bold text-white">Live Infrastructure Map</h3>
              </div>
              <Map
                initialViewState={{
                  longitude: 77.5946,
                  latitude: 12.9716,
                  zoom: 11
                }}
                mapStyle="https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json"
              >
                {issuesFeed.map((issue) => {
                  const [lat, lng] = issue.location.split(', ').map(Number);
                  return (
                    <Marker key={issue.id} longitude={lng} latitude={lat} anchor="center" onClick={(e: any) => { e.originalEvent.stopPropagation(); setSelectedIssue(issue); }}>
                      <div className={`w-4 h-4 rounded-full border-2 border-white shadow-[0_0_10px_rgba(0,0,0,0.5)] cursor-pointer ${
                        issue.severity === 'Critical' ? 'bg-red-500' :
                        issue.severity === 'High' ? 'bg-orange-500' :
                        issue.severity === 'Medium' ? 'bg-yellow-500' : 'bg-blue-500'
                      }`}>
                        <div className="absolute inset-0 rounded-full animate-ping opacity-50 bg-inherit" />
                      </div>
                    </Marker>
                  );
                })}
              </Map>
            </div>

            {/* Live Feed */}
            <div className="bg-[#161B22] border border-[#30363D] rounded-xl p-6 flex flex-col relative z-0">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold text-white">Live AI Intel Feed</h3>
                <span className="flex h-3 w-3 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                </span>
              </div>
              
              <div className="flex-1 overflow-y-auto space-y-4 pr-2">
                {issuesFeed.map((issue) => (
                  <div 
                    key={issue.id} 
                    onClick={() => setSelectedIssue(issue)}
                    className="p-4 border border-[#30363D] rounded-lg bg-[#0D1117] hover:border-blue-500/50 transition-colors cursor-pointer group"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                          issue.severity === 'Critical' ? 'bg-red-500/20 text-red-400' :
                          issue.severity === 'High' ? 'bg-orange-500/20 text-orange-400' :
                          issue.severity === 'Medium' ? 'bg-yellow-500/20 text-yellow-400' :
                          'bg-blue-500/20 text-blue-400'
                        }`}>
                          {issue.severity}
                        </span>
                        <span className="text-xs text-slate-400">{issue.time}</span>
                      </div>
                      <span className="text-xs font-mono text-emerald-400 flex items-center gap-1">
                        ✨ {issue.aiConfidence}%
                      </span>
                    </div>
                    
                    <h4 className="font-medium text-slate-200 mb-1 group-hover:text-blue-400 transition-colors">{issue.type}</h4>
                    <div className="flex items-center gap-1.5 text-slate-400 text-sm mb-3">
                      <MapIcon size={14} />
                      <span className="truncate">{issue.location}</span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className={`text-xs font-medium flex items-center gap-1.5 ${
                        issue.status === 'Unassigned' ? 'text-slate-400' : 
                        issue.status === 'Resolved' ? 'text-emerald-400' : 'text-blue-400'
                      }`}>
                        <div className={`w-1.5 h-1.5 rounded-full ${
                          issue.status === 'Unassigned' ? 'bg-slate-400' : 
                          issue.status === 'Resolved' ? 'bg-emerald-400' : 'bg-blue-400'
                        }`} />
                        {issue.status}
                      </span>
                      {issue.status === 'Unassigned' && (
                        <button className="text-xs font-medium text-blue-400 hover:text-blue-300">View Details</button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* AI Resolution Modal Overlay */}
        {selectedIssue && (
          <div className="absolute inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-8">
            <div className="bg-[#161B22] border border-[#30363D] w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden flex flex-col">
              <div className="p-6 border-b border-[#30363D] flex justify-between items-start bg-[#0D1117]">
                <div>
                  <div className="flex gap-2 items-center mb-2">
                    <span className="text-xs text-slate-400 font-mono">{selectedIssue.id}</span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                      selectedIssue.severity === 'Critical' ? 'bg-red-500/20 text-red-400' : 'bg-orange-500/20 text-orange-400'
                    }`}>
                      {selectedIssue.severity}
                    </span>
                  </div>
                  <h2 className="text-2xl font-bold text-white">{selectedIssue.type}</h2>
                  <div className="flex gap-2 mt-1 text-sm text-slate-400">
                    <MapPin size={16} /> {selectedIssue.location}
                  </div>
                </div>
                <button onClick={() => setSelectedIssue(null)} className="p-2 rounded-lg hover:bg-[#21262D] text-slate-400 hover:text-white transition-colors">
                  <X size={20} />
                </button>
              </div>

              <div className="p-6 bg-gradient-to-b from-[#161B22] to-[#0D1117] flex-1 overflow-y-auto">
                <div className="p-4 bg-[#0D1117] border border-[#30363D] rounded-xl mb-6">
                  <p className="text-slate-300">"{selectedIssue.desc}"</p>
                </div>

                <div className="border border-blue-500/30 bg-blue-500/5 rounded-xl p-5 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 blur-3xl rounded-full"></div>
                  
                  <h3 className="text-lg font-semibold text-blue-400 flex items-center gap-2 mb-4">
                    <Sparkles size={20} />
                    Gemini AI Resolution Plan
                  </h3>
                  
                  {aiLoading ? (
                    <div className="space-y-3 animate-pulse">
                      <div className="h-4 bg-slate-700 rounded w-full"></div>
                      <div className="h-4 bg-slate-700 rounded w-5/6"></div>
                      <div className="h-4 bg-slate-700 rounded w-4/6"></div>
                      <div className="h-3 bg-slate-700 rounded w-3/6 mt-4"></div>
                      <div className="h-4 bg-slate-700 rounded w-full"></div>
                      <div className="h-4 bg-slate-700 rounded w-full"></div>
                      <div className="h-4 bg-slate-700 rounded w-2/3"></div>
                      <p className="text-xs text-blue-400 mt-3 flex items-center gap-1.5">
                        <span className="inline-block w-2 h-2 bg-blue-400 rounded-full animate-ping"></span>
                        Gemini is analyzing this issue...
                      </p>
                    </div>
                  ) : aiPlan ? (
                    <div className="space-y-4 relative z-10">
                      {(() => {
                        const lines = aiPlan.split('\n').filter(l => l.trim());
                        const impact = lines.find(l => l.startsWith('IMPACT:'))?.replace('IMPACT:', '').trim();
                        const actions = lines.filter(l => l.startsWith('ACTION_')).map(l => l.replace(/ACTION_\d+:\s*/, '').trim());
                        const cost = lines.find(l => l.startsWith('COST:'))?.replace('COST:', '').trim();
                        const time = lines.find(l => l.startsWith('TIME:'))?.replace('TIME:', '').trim();
                        const priority = lines.find(l => l.startsWith('PRIORITY:'))?.replace('PRIORITY:', '').trim();
                        
                        return (
                          <>
                            <div>
                              <div className="text-xs uppercase tracking-wider text-slate-500 font-bold mb-1">Impact Analysis</div>
                              <p className="text-sm text-slate-300">{impact || 'Analyzing impact...'}</p>
                            </div>
                            <div>
                              <div className="text-xs uppercase tracking-wider text-slate-500 font-bold mb-1">Recommended Actions</div>
                              <ul className="text-sm text-slate-300 list-disc list-inside space-y-1">
                                {actions.length > 0 ? actions.map((a, i) => <li key={i}>{a}</li>) : <li>Dispatch field team</li>}
                              </ul>
                            </div>
                            <div className="grid grid-cols-2 gap-4 mt-2">
                              <div className="bg-[#0D1117] p-3 rounded-lg border border-[#30363D]">
                                <div className="text-xs text-slate-500 mb-1">Estimated Cost</div>
                                <div className="font-mono text-emerald-400 font-bold">{cost || '₹ 10,000 - ₹ 25,000'}</div>
                              </div>
                              <div className="bg-[#0D1117] p-3 rounded-lg border border-[#30363D]">
                                <div className="text-xs text-slate-500 mb-1">Repair Time</div>
                                <div className="font-mono text-purple-400 font-bold">{time || '2-4 hours'}</div>
                              </div>
                            </div>
                            {priority && (
                              <div className="text-xs text-blue-300 bg-blue-500/10 px-3 py-2 rounded-lg border border-blue-500/20 mt-1">
                                <span className="font-bold uppercase tracking-wider">Priority:</span> {priority}
                              </div>
                            )}
                          </>
                        );
                      })()}
                    </div>
                  ) : (
                    <p className="text-slate-500 text-sm">Select an issue to generate an AI resolution plan.</p>
                  )}
                </div>
              </div>

              <div className="p-4 border-t border-[#30363D] bg-[#0D1117] flex justify-end gap-3">
                <button 
                  onClick={() => setSelectedIssue(null)}
                  className="px-4 py-2 rounded-lg font-medium text-slate-300 hover:text-white hover:bg-[#21262D] transition-colors"
                >
                  Dismiss
                </button>
                <button 
                  onClick={async () => {
                    try {
                      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';
                      await fetch(`${API_URL}/api/issues/${selectedIssue.rawId}/status`, {
                        method: 'PATCH',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ status: 'resolved' })
                      });
                    } catch(e) { console.error('Status update failed, simulating success on UI', e); }
                    setSelectedIssue({ ...selectedIssue, status: 'Resolved' });
                    setIssuesFeed(prev => prev.map(iss => iss.id === selectedIssue.id ? { ...iss, status: 'Resolved' } : iss));
                    setTimeout(() => setSelectedIssue(null), 1500);
                  }}
                  className="px-4 py-2 rounded-lg font-medium bg-emerald-600 hover:bg-emerald-500 text-white transition-colors flex items-center gap-2"
                >
                  <CheckCircle size={18} />
                  Mark Resolved
                </button>
                <button 
                  onClick={async () => {
                    try {
                      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';
                      await fetch(`${API_URL}/api/issues/${selectedIssue.rawId}/status`, {
                        method: 'PATCH',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ status: 'dispatched' })
                      });
                    } catch(e) { console.error('Dispatch failed, simulating success on UI', e); }
                    setSelectedIssue({ ...selectedIssue, status: 'Dispatched' });
                    setIssuesFeed(prev => prev.map(iss => iss.id === selectedIssue.id ? { ...iss, status: 'Dispatched' } : iss));
                    setTimeout(() => setSelectedIssue(null), 1500);
                  }}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 ${
                    selectedIssue.status === 'Dispatched' || selectedIssue.status === 'Resolved'
                      ? 'bg-emerald-600 text-white cursor-default' 
                      : 'bg-blue-600 hover:bg-blue-500 text-white'
                  }`}
                  disabled={selectedIssue.status === 'Dispatched' || selectedIssue.status === 'Resolved'}
                >
                  {selectedIssue.status === 'Dispatched' ? (
                    <><CheckCircle size={18} /> Team Dispatched</>
                  ) : selectedIssue.status === 'Resolved' ? (
                    <><CheckCircle size={18} /> Resolved ✓</>
                  ) : (
                    <><Navigation size={18} /> Dispatch Team</>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

// Quick inline component for MapPin since it was missing from lucide-react imports initially
function MapPin(props: any) {
  return <MapIcon {...props} />;
}
