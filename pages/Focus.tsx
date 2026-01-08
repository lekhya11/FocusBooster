
import React, { useEffect, useState, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Timer from '../components/Timer';
import confetti from 'https://cdn.skypack.dev/canvas-confetti';
import { markSessionCompleted, updateSessionGoal, getSessionById } from '../utils/storage';
import DoneToggleButton from '../components/DoneToggleButton';

const Focus: React.FC = () => {
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [goal, setGoal] = useState<string | null>(null);
  const [duration, setDuration] = useState(30);
  const [isEditing, setIsEditing] = useState(false);
  const [editedGoal, setEditedGoal] = useState('');
  const [isFinishing, setIsFinishing] = useState(false);
  const timerApiRef = useRef<{ getTimeLeft: () => number }>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const currentId = localStorage.getItem('current_session_id');
    const savedGoal = localStorage.getItem('daily_focus_goal');
    const savedDuration = localStorage.getItem('daily_focus_duration');
    
    if (!currentId || !savedGoal) {
      navigate('/');
      return;
    }

    const session = getSessionById(currentId);
    if (!session || session.status === 'completed') {
      navigate('/');
      return;
    }

    setSessionId(currentId);
    setGoal(savedGoal);
    setEditedGoal(savedGoal);
    if (savedDuration) setDuration(parseInt(savedDuration, 10));
  }, [navigate]);

  const handleEditToggle = () => {
    if (isEditing && sessionId) {
      if (editedGoal.trim()) {
        updateSessionGoal(sessionId, editedGoal.trim());
        setGoal(editedGoal.trim());
        setIsEditing(false);
      }
    } else {
      setEditedGoal(goal || '');
      setIsEditing(true);
    }
  };

  const handleDone = useCallback(() => {
    if (isFinishing || isEditing || !sessionId) return;
    setIsFinishing(true);
    
    const remainingSeconds = timerApiRef.current?.getTimeLeft() || 0;
    const totalSeconds = duration * 60; 

    markSessionCompleted(sessionId, remainingSeconds, totalSeconds);
    
    confetti({
      particleCount: 200,
      spread: 90,
      origin: { y: 0.6 },
      colors: ['#6366f1', '#a855f7', '#ec4899', '#ffffff']
    });

    setTimeout(() => {
      localStorage.removeItem('current_session_id');
      localStorage.removeItem('daily_focus_goal');
      localStorage.removeItem('daily_focus_duration');
      localStorage.removeItem('focus_start_time');
      navigate('/dashboard');
    }, 2500);
  }, [navigate, isFinishing, isEditing, duration, sessionId]);

  if (!goal) return null;

  return (
    <div className={`glass-card p-12 md:p-16 rounded-[50px] w-full max-w-xl text-center transition-all duration-1000 
      ${isFinishing ? 'scale-105 opacity-0' : 'fade-in-up'}`}>
      
      <div className="mb-12 relative group">
        <p className="text-white/30 uppercase tracking-[0.3em] text-[9px] font-black mb-4">
          Deep Session in Progress
        </p>
        
        {isEditing ? (
          <div className="flex flex-col gap-5 items-center">
            <input
              autoFocus
              type="text"
              value={editedGoal}
              onChange={(e) => setEditedGoal(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleEditToggle()}
              className="w-full bg-white/5 border border-white/10 rounded-[2rem] px-8 py-5 text-white outline-none focus:border-indigo-500/50 transition-all text-2xl text-center font-bold shadow-inner"
            />
            <div className="flex gap-4">
              <button 
                onClick={handleEditToggle}
                className="bg-indigo-600 px-8 py-2.5 rounded-full text-white text-[11px] font-black uppercase tracking-widest hover:bg-indigo-500 transition-all shadow-[0_0_20px_rgba(99,102,241,0.4)]"
              >
                Apply
              </button>
              <button 
                onClick={() => setIsEditing(false)}
                className="text-white/40 text-[11px] font-black uppercase tracking-widest hover:text-white transition-colors px-3"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <div className="group flex flex-col items-center">
            <h2 className="text-4xl md:text-5xl font-bold text-white font-poppins break-words max-w-full leading-tight tracking-tight">
              {goal}
            </h2>
            {!isFinishing && (
              <button 
                onClick={handleEditToggle}
                className="mt-8 text-white/30 hover:text-white hover:bg-white/10 transition-all text-[10px] flex items-center gap-2 uppercase tracking-[0.2em] font-black bg-white/5 px-5 py-2.5 rounded-full border border-white/5"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                </svg>
                Modify Focus
              </button>
            )}
          </div>
        )}
      </div>

      <div className="flex justify-center mb-16">
        <Timer 
          onComplete={() => {}} 
          durationMinutes={duration} 
          isCompleted={isFinishing}
          timerApiRef={timerApiRef} 
        />
      </div>

      <div className="max-w-xs mx-auto w-full">
        <DoneToggleButton 
          isCompleted={isFinishing} 
          onComplete={handleDone} 
          disabled={isFinishing || isEditing}
        />
        {isEditing && (
          <p className="text-white/20 text-[9px] mt-6 italic tracking-[0.3em] font-black uppercase">Resume focus to complete</p>
        )}
      </div>

      <button 
        onClick={() => {
          localStorage.removeItem('current_session_id');
          navigate('/');
        }}
        className={`mt-14 text-white/20 hover:text-red-400 transition-all duration-300 text-[10px] font-black uppercase tracking-[0.3em]
          ${isFinishing ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
      >
        Discard Session
      </button>
    </div>
  );
};

export default Focus;
