import { useState, useEffect } from 'react';
import { Activity, AlertTriangle, CheckCircle, Clock, Map as MapIcon, Users, Settings, Bell, Search, LayoutDashboard } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const mockChartData = [
  { name: 'Mon', reports: 40, resolved: 24 },
  { name: 'Tue', reports: 30, resolved: 35 },
  { name: 'Wed', reports: 20, resolved: 40 },
  { name: 'Thu', reports: 50, resolved: 30 },
  { name: 'Fri', reports: 65, resolved: 45 },
  { name: 'Sat', reports: 80, resolved: 50 },
  { name: 'Sun', reports: 45, resolved: 60 },
];

const issuesFeed = [
  { id: 'ISS-001', type: 'Flooding', severity: 'Critical', location: 'Koramangala, Bangalore', time: '10 mins ago', status: 'Unassigned', aiConfidence: 98 },
  { id: 'ISS-002', type: 'Pothole', severity: 'High', location: 'Indiranagar 100ft Rd', time: '25 mins ago', status: 'Assigned', aiConfidence: 92 },
  { id: 'ISS-003', type: 'Broken Light', severity: 'Medium', location: 'HSR Layout Sec 4', time: '1 hr ago', status: 'Assigned', aiConfidence: 85 },
  { id: 'ISS-004', type: 'Garbage', severity: 'Low', location: 'Whitefield', time: '2 hrs ago', status: 'Resolved', aiConfidence: 99 },
];

export default function App() {
  return (
    <div className="flex h-screen overflow-hidden bg-[#0D1117] text-[#C9D1D9]">
      {/* Sidebar */}
      <aside className="w-64 border-r border-[#30363D] bg-[#161B22] flex flex-col">
        <div className="h-16 flex items-center px-6 border-b border-[#30363D]">
          <h1 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent">
            CivicOS <span className="text-sm font-medium text-slate-400">Command</span>
          </h1>
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
        
        <div className="p-4 border-t border-[#30363D]">
          <a href="#" className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-[#21262D]/50 transition-colors text-slate-300">
            <Settings size={20} />
            <span className="font-medium">Settings</span>
          </a>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
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
                <span className="text-emerald-400 font-medium">Health Score: 84/100</span>
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
              <div className="text-3xl font-bold text-white mb-1">1,284</div>
              <div className="text-sm text-emerald-400 flex items-center gap-1">
                <span>↑ 12%</span> <span className="text-slate-500">vs last week</span>
              </div>
            </div>
            
            <div className="bg-[#161B22] border border-[#30363D] rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-slate-400 font-medium">Critical Issues</h3>
                <div className="p-2 bg-red-500/10 rounded-lg">
                  <AlertTriangle size={20} className="text-red-400" />
                </div>
              </div>
              <div className="text-3xl font-bold text-white mb-1">42</div>
              <div className="text-sm text-red-400 flex items-center gap-1">
                <span>↑ 4%</span> <span className="text-slate-500">vs last week</span>
              </div>
            </div>
            
            <div className="bg-[#161B22] border border-[#30363D] rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-slate-400 font-medium">Resolution Rate</h3>
                <div className="p-2 bg-emerald-500/10 rounded-lg">
                  <CheckCircle size={20} className="text-emerald-400" />
                </div>
              </div>
              <div className="text-3xl font-bold text-white mb-1">78.5%</div>
              <div className="text-sm text-emerald-400 flex items-center gap-1">
                <span>↑ 2.4%</span> <span className="text-slate-500">vs last week</span>
              </div>
            </div>
            
            <div className="bg-[#161B22] border border-[#30363D] rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-slate-400 font-medium">Avg. Response</h3>
                <div className="p-2 bg-purple-500/10 rounded-lg">
                  <Clock size={20} className="text-purple-400" />
                </div>
              </div>
              <div className="text-3xl font-bold text-white mb-1">2h 15m</div>
              <div className="text-sm text-emerald-400 flex items-center gap-1">
                <span>↓ 18m</span> <span className="text-slate-500">vs last week</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-6">
            {/* Chart */}
            <div className="col-span-2 bg-[#161B22] border border-[#30363D] rounded-xl p-6">
              <h3 className="text-lg font-bold text-white mb-6">Incident Resolution Trend</h3>
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={mockChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorReports" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                      </linearGradient>
                      <linearGradient id="colorResolved" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#30363D" vertical={false} />
                    <XAxis dataKey="name" stroke="#8b949e" tick={{fill: '#8b949e', fontSize: 12}} axisLine={false} tickLine={false} />
                    <YAxis stroke="#8b949e" tick={{fill: '#8b949e', fontSize: 12}} axisLine={false} tickLine={false} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#161B22', borderColor: '#30363D', borderRadius: '8px', color: '#fff' }}
                      itemStyle={{ color: '#e5e7eb' }}
                    />
                    <Area type="monotone" dataKey="reports" stroke="#3b82f6" strokeWidth={2} fillOpacity={1} fill="url(#colorReports)" name="New Reports" />
                    <Area type="monotone" dataKey="resolved" stroke="#10b981" strokeWidth={2} fillOpacity={1} fill="url(#colorResolved)" name="Resolved" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Live Feed */}
            <div className="bg-[#161B22] border border-[#30363D] rounded-xl p-6 flex flex-col">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold text-white">Live AI Intel Feed</h3>
                <span className="flex h-3 w-3 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                </span>
              </div>
              
              <div className="flex-1 overflow-y-auto space-y-4 pr-2">
                {issuesFeed.map((issue) => (
                  <div key={issue.id} className="p-4 border border-[#30363D] rounded-lg bg-[#0D1117] hover:border-blue-500/50 transition-colors cursor-pointer group">
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
                        ✨ AI Conf: {issue.aiConfidence}%
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
                        <button className="text-xs font-medium text-blue-400 hover:text-blue-300">Assign Team</button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
