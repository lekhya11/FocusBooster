
import React from 'react';
import { FocusHistoryItem } from '../types';

interface DashboardCardProps {
  item: FocusHistoryItem;
  index: number;
}

const DashboardCard: React.FC<DashboardCardProps> = ({ item, index }) => {
  const dateObj = new Date(item.date);
  const formattedDate = dateObj.toLocaleDateString(undefined, { 
    weekday: 'short', 
    month: 'short', 
    day: 'numeric' 
  });

  const isCompleted = item.status === 'completed';
  const timeTakenSeconds = isCompleted && item.totalSeconds !== undefined && item.remainingSeconds !== undefined 
    ? item.totalSeconds - item.remainingSeconds 
    : 0;
  
  const takenMins = Math.floor(timeTakenSeconds / 60);
  const takenSecs = timeTakenSeconds % 60;

  const isFastFinish = isCompleted && 
                      item.remainingSeconds !== undefined && 
                      item.totalSeconds !== undefined && 
                      (item.remainingSeconds / item.totalSeconds) > 0.3;

  return (
    <div 
      className="glass-card flex flex-col sm:flex-row sm:items-center justify-between p-6 rounded-[32px] mb-4 transform transition-all duration-500 hover:translate-y-[-8px] hover:shadow-2xl fade-in-up group border border-white/5 hover:border-white/20"
      style={{ animationDelay: `${index * 0.1}s` }}
    >
      <div className="flex flex-col text-left overflow-hidden pr-4 flex-1">
        <div className="flex items-center gap-3 mb-2">
          <p className="text-white/30 text-[10px] uppercase tracking-[0.2em] font-black">
            {formattedDate}
          </p>
        </div>
        <h4 className="text-white font-bold text-lg truncate group-hover:text-indigo-100 transition-colors leading-tight">
          {item.goal}
        </h4>
      </div>
      
      <div className="flex items-center mt-4 sm:mt-0 gap-6">
        {isCompleted && (
          <div className="text-right border-r border-white/10 pr-6">
            <p className="text-white/30 text-[9px] uppercase font-black tracking-widest mb-0.5">Time Spent</p>
            <p className="text-white/80 text-sm font-bold">
              {takenMins > 0 ? `${takenMins}m ` : ''}{takenSecs}s
            </p>
          </div>
        )}
        
        <div className="flex items-center gap-3">
          {isFastFinish && (
            <div className="shimmer bg-gradient-to-r from-amber-400 to-orange-500 text-white text-[9px] px-3 py-1.5 rounded-xl font-black uppercase tracking-tighter shadow-[0_0_15px_rgba(251,191,36,0.4)] animate-bounce">
              ⚡ Speedy
            </div>
          )}
          
          <div className={`px-5 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] flex items-center transition-all duration-700
            ${isCompleted 
              ? 'bg-emerald-400/20 text-emerald-300 border border-emerald-400/30 shadow-[0_0_15px_rgba(52,211,153,0.1)]' 
              : 'bg-white/10 text-white/40 border border-white/10'}`}
          >
            {isCompleted ? (
              <>
                <span className="mr-2 text-sm leading-none">✓</span> Done
              </>
            ) : (
              <>
                <span className="mr-2 text-sm leading-none opacity-50">○</span> Active
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardCard;
