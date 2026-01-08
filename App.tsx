
import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import Focus from './pages/Focus';
import Dashboard from './pages/Dashboard';
import Navbar from './components/Navbar';
import BubbleBackground from './components/BubbleBackground';

const App: React.FC = () => {
  return (
    <HashRouter>
      <div className="relative min-h-screen w-full animated-bg flex flex-col items-center p-4 overflow-y-auto overflow-x-hidden">
        <BubbleBackground />
        <Navbar />
        <div className="relative z-10 w-full flex items-center justify-center py-20 flex-1">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/focus" element={<Focus />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </div>
    </HashRouter>
  );
};

export default App;
