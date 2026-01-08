
import React from 'react';

interface DoneToggleButtonProps {
  isCompleted: boolean;
  onComplete: () => void;
  disabled?: boolean;
}

const DoneToggleButton: React.FC<DoneToggleButtonProps> = ({ isCompleted, onComplete, disabled }) => {
  return (
    <button
      onClick={onComplete}
      disabled={disabled || isCompleted}
      className={`relative w-full h-20 rounded-full p-2 transition-all duration-700 ease-in-out shadow-2xl overflow-hidden group focus:outline-none focus:ring-4 focus:ring-white/20 active:scale-95
        ${isCompleted 
          ? 'bg-emerald-500 shadow-emerald-500/40' 
          : 'bg-white/10 hover:bg-white/20 border border-white/20'}`}
    >
      {/* Sliding Knob */}
      <div 
        className={`absolute top-2 bottom-2 aspect-square rounded-full bg-white shadow-lg transition-all duration-700 cubic-bezier(0.68, -0.6, 0.32, 1.6) flex items-center justify-center
          ${isCompleted 
            ? 'translate-x-[calc(100%_-_4px)] left-full -translate-x-full' 
            : 'left-2'}`}
        style={{
          transform: isCompleted ? 'translateX(calc(-100% - 8px))' : 'translateX(0)'
        }}
      >
        <span className="text-2xl transition-transform duration-700">
          {isCompleted ? '🌟' : '🎯'}
        </span>
        
        {/* Inner Glow for Completed State */}
        {isCompleted && (
          <div className="absolute inset-0 rounded-full animate-ping bg-emerald-400 opacity-20" />
        )}
      </div>

      {/* Button Text */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <span className={`text-xl font-bold tracking-wide transition-all duration-500
          ${isCompleted ? 'text-white opacity-100 translate-x-[-12px]' : 'text-white/90 opacity-100 translate-x-[12px]'}`}
        >
          {isCompleted ? 'Completed' : 'Done for Today 🎉'}
        </span>
      </div>

      {/* Subtle Background Glow for Hover */}
      {!isCompleted && (
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
      )}
    </button>
  );
};

export default DoneToggleButton;
