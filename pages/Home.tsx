
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { addFocusSession } from '../utils/storage';

const Home: React.FC = () => {
  const [goal, setGoal] = useState('');
  const [duration, setDuration] = useState(30);
  const [isError, setIsError] = useState(false);
  const navigate = useNavigate();

  const handleStart = () => {
    if (!goal.trim()) {
      setIsError(true);
      setTimeout(() => setIsError(false), 2000);
      return;
    }

    const sessionId = addFocusSession(goal.trim());
    localStorage.setItem('current_session_id', sessionId);
    localStorage.setItem('daily_focus_goal', goal.trim());
    localStorage.setItem('daily_focus_duration', duration.toString());
    localStorage.setItem('focus_start_time', Date.now().toString());
    navigate('/focus');
  };

  return (
    <div className="flex flex-col items-center w-full max-w-xl mx-auto px-4">
      <div className="glass-card p-10 md:p-14 rounded-[40px] shadow-2xl w-full text-center fade-in-up">
        <p className="text-white/30 uppercase tracking-[0.3em] text-[10px] font-black mb-6">
          Set Your Intention
        </p>
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-10 font-poppins leading-tight">
          What’s your focus?
        </h1>
        
        <div className="space-y-8 mb-10">
          <div className="relative group">
            <input
              type="text"
              value={goal}
              onChange={(e) => setGoal(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleStart()}
              placeholder="e.g., Deep Coding Session"
              className={`w-full bg-white/5 border-2 rounded-[2rem] px-8 py-5 text-white placeholder-white/20 outline-none transition-all duration-300 text-xl font-bold
                ${isError ? 'border-red-500/50 animate-shake' : 'border-white/10 focus:border-indigo-500/50 focus:bg-white/10'}`}
            />
            {isError && (
              <p className="absolute -bottom-6 left-0 right-0 text-red-400 text-[10px] font-black uppercase tracking-widest">
                Target objective is required
              </p>
            )}
          </div>

          <div className="flex flex-col items-center gap-4">
            <p className="text-white/40 text-xs font-black uppercase tracking-widest">Session Duration</p>
            <div className="flex items-center gap-4 w-full">
              <button 
                onClick={() => setDuration(Math.max(5, duration - 5))}
                className="w-12 h-12 rounded-full glass-card flex items-center justify-center text-white text-2xl font-bold hover:bg-white/10 transition-colors"
              >
                -
              </button>
              <div className="flex-1 glass-card py-4 rounded-3xl relative overflow-hidden group">
                <div className="text-3xl font-black text-white">{duration}</div>
                <div className="text-[10px] font-bold text-white/30 uppercase tracking-widest">Minutes</div>
              </div>
              <button 
                onClick={() => setDuration(Math.min(120, duration + 5))}
                className="w-12 h-12 rounded-full glass-card flex items-center justify-center text-white text-2xl font-bold hover:bg-white/10 transition-colors"
              >
                +
              </button>
            </div>
          </div>
        </div>

        <button
          onClick={handleStart}
          className="group relative w-full h-20 rounded-[2rem] overflow-hidden bg-white shadow-[0_20px_40px_rgba(255,255,255,0.1)] transition-all duration-300 hover:scale-[1.02] active:scale-95"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <span className="relative z-10 text-indigo-900 group-hover:text-white font-black uppercase tracking-[0.2em] text-lg">
            Ignite Session
          </span>
        </button>
      </div>

      <div className="mt-12 text-white/20 text-[10px] font-black uppercase tracking-[0.4em] text-center max-w-xs leading-loose">
        One goal. One session. Total presence.
      </div>
    </div>
  );
};

export default Home;
