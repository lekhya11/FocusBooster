
import React, { useState, useEffect, useMemo } from 'react';
import { getFocusHistory } from '../utils/storage';
import { FocusHistoryItem } from '../types';
import DashboardCard from '../components/DashboardCard';

type ViewMode = 'day' | 'week';

interface Badge {
  id: string;
  name: string;
  icon: string;
  description: string;
  isUnlocked: boolean;
  color: string;
}

const Dashboard: React.FC = () => {
  const [history, setHistory] = useState<FocusHistoryItem[]>([]);
  const [viewMode, setViewMode] = useState<ViewMode>('day');

  useEffect(() => {
    const h = getFocusHistory();
    setHistory(h.sort((a, b) => b.date.localeCompare(a.date)));
  }, []);

  const stats = useMemo(() => {
    const totalSeconds = history.reduce((acc, curr) => 
      acc + (curr.totalSeconds || 0) - (curr.remainingSeconds || 0), 0);
    return {
      totalSessions: history.length,
      completed: history.filter(h => h.status === 'completed').length,
      totalSeconds,
      totalMinutes: Math.floor(totalSeconds / 60)
    };
  }, [history]);

  const badges = useMemo<Badge[]>(() => [
    {
      id: 'first_step',
      name: 'Pioneer',
      icon: '🚀',
      description: 'Complete your first focus session',
      isUnlocked: stats.completed >= 1,
      color: 'from-blue-400 to-indigo-600'
    },
    {
      id: 'consistent',
      name: 'Flow Master',
      icon: '🌊',
      description: 'Complete 5 focus sessions',
      isUnlocked: stats.completed >= 5,
      color: 'from-emerald-400 to-teal-600'
    },
    {
      id: 'deep_diver',
      name: 'Deep Diver',
      icon: '💎',
      description: 'Spend over 100 minutes focusing',
      isUnlocked: stats.totalMinutes >= 100,
      color: 'from-purple-400 to-fuchsia-600'
    },
    {
      id: 'speedy',
      name: 'Efficient',
      icon: '⚡',
      description: 'Complete a session with >30% time left',
      isUnlocked: history.some(item => 
        item.status === 'completed' && 
        item.remainingSeconds && item.totalSeconds && 
        (item.remainingSeconds / item.totalSeconds) > 0.3
      ),
      color: 'from-amber-400 to-orange-600'
    }
  ], [stats, history]);

  const hours = Math.floor(stats.totalSeconds / 3600);
  const mins = Math.floor((stats.totalSeconds % 3600) / 60);

  const chartData = useMemo(() => {
    const now = new Date();
    if (viewMode === 'day') {
      return Array.from({ length: 7 }).map((_, i) => {
        const d = new Date();
        d.setDate(now.getDate() - (6 - i));
        const dateStr = d.toISOString().split('T')[0];
        const dayName = d.toLocaleDateString(undefined, { weekday: 'short' });
        const secondsFocused = history
          .filter(item => item.date === dateStr)
          .reduce((acc, curr) => acc + (curr.totalSeconds || 0) - (curr.remainingSeconds || 0), 0);
        return { label: dayName, value: Math.round(secondsFocused / 60) };
      });
    } else {
      return Array.from({ length: 4 }).map((_, i) => {
        const weekEnd = new Date();
        weekEnd.setDate(now.getDate() - (3 - i) * 7);
        const weekStart = new Date(weekEnd);
        weekStart.setDate(weekEnd.getDate() - 6);
        const secondsFocused = history
          .filter(item => {
            const itemDate = new Date(item.date);
            return itemDate >= weekStart && itemDate <= weekEnd;
          })
          .reduce((acc, curr) => acc + (curr.totalSeconds || 0) - (curr.remainingSeconds || 0), 0);
        return { label: `W${4 - (3 - i)}`, value: Math.round(secondsFocused / 60) };
      });
    }
  }, [history, viewMode]);

  const maxValue = Math.max(...chartData.map(d => d.value), 30);

  return (
    <div className="w-full max-w-4xl mx-auto px-4 fade-in-up pb-20">
      <div className="text-center mb-12">
        <p className="text-white/30 uppercase tracking-[0.4em] text-[10px] font-black mb-4">Performance Log</p>
        <h1 className="text-5xl font-bold text-white font-poppins mb-12">Flow Analytics</h1>
        
        {/* Badges Section */}
        <div className="mb-12">
          <div className="flex items-center gap-4 mb-6">
            <h2 className="text-white/40 text-xs font-black uppercase tracking-widest px-2">Achievements</h2>
            <div className="h-[1px] flex-1 bg-white/5" />
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {badges.map(badge => (
              <div 
                key={badge.id}
                className={`glass-card p-4 rounded-3xl border transition-all duration-500 flex flex-col items-center text-center
                  ${badge.isUnlocked ? 'border-white/20' : 'border-white/5 opacity-40 grayscale'}`}
              >
                <div className={`w-12 h-12 rounded-2xl mb-3 flex items-center justify-center text-2xl shadow-lg bg-gradient-to-br ${badge.isUnlocked ? badge.color : 'from-white/10 to-white/5'}`}>
                  {badge.icon}
                </div>
                <h4 className="text-white font-bold text-xs mb-1">{badge.name}</h4>
                <p className="text-[9px] text-white/40 leading-tight uppercase font-black tracking-tighter">{badge.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Graph Section */}
        <div className="glass-card p-8 rounded-[40px] mb-12 border border-white/5 relative overflow-hidden group">
          <div className="flex justify-between items-center mb-10">
            <h3 className="text-white/60 text-xs font-black uppercase tracking-widest">Minutes Focused</h3>
            <div className="flex bg-white/5 rounded-full p-1 border border-white/10">
              <button 
                onClick={() => setViewMode('day')}
                className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-tighter transition-all duration-300
                  ${viewMode === 'day' ? 'bg-white text-indigo-900 shadow-lg scale-105' : 'text-white/40 hover:text-white'}`}
              >Day</button>
              <button 
                onClick={() => setViewMode('week')}
                className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-tighter transition-all duration-300
                  ${viewMode === 'week' ? 'bg-white text-indigo-900 shadow-lg scale-105' : 'text-white/40 hover:text-white'}`}
              >Week</button>
            </div>
          </div>

          <div className="h-48 flex items-end justify-between gap-4 px-2">
            {chartData.map((data, idx) => (
              <div key={idx} className="flex-1 flex flex-col items-center group/bar">
                <div 
                  className="w-full max-w-[40px] rounded-t-xl relative transition-all duration-1000 ease-out overflow-hidden"
                  style={{ 
                    height: `${(data.value / maxValue) * 100}%`,
                    minHeight: data.value > 0 ? '4px' : '0',
                    background: 'linear-gradient(to top, #6366f1, #a855f7)',
                    animationDelay: `${idx * 0.1}s`
                  }}
                >
                  <div className="absolute inset-0 bg-white/20 opacity-0 group-hover/bar:opacity-100 transition-opacity" />
                  <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-white text-indigo-900 text-[9px] font-black px-2 py-1 rounded-md opacity-0 group-hover/bar:opacity-100 transition-all pointer-events-none whitespace-nowrap">
                    {data.value}m
                  </div>
                </div>
                <span className="text-white/20 text-[10px] font-black uppercase mt-4 tracking-tighter">{data.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="glass-card p-6 rounded-[32px] border border-white/5 hover:border-white/10 transition-colors">
            <p className="text-[10px] font-black text-white/30 uppercase tracking-widest mb-1">Total Flow</p>
            <p className="text-3xl font-bold text-white">{stats.totalSessions}</p>
          </div>
          <div className="glass-card p-6 rounded-[32px] border border-white/5 hover:border-white/10 transition-colors">
            <p className="text-[10px] font-black text-white/30 uppercase tracking-widest mb-1">Consistency</p>
            <p className="text-3xl font-bold text-emerald-400">{stats.totalSessions ? Math.round((stats.completed / stats.totalSessions) * 100) : 0}%</p>
          </div>
          <div className="glass-card p-6 rounded-[32px] border border-white/5 hover:border-white/10 transition-colors">
            <p className="text-[10px] font-black text-white/30 uppercase tracking-widest mb-1">Total Effort</p>
            <p className="text-3xl font-bold text-indigo-400">{hours}h {mins}m</p>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-white/30 text-[10px] font-black uppercase tracking-[0.4em] mb-6 px-2">Activity Stream</h2>
        {history.length > 0 ? (
          history.map((item, idx) => (
            <DashboardCard key={item.id} item={item} index={idx} />
          ))
        ) : (
          <div className="glass-card p-20 rounded-[40px] text-center border border-dashed border-white/10">
            <p className="text-white/20 font-black uppercase tracking-[0.2em] text-sm">No history found</p>
            <p className="text-white/10 text-xs mt-2">Start your first session from the home page.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
