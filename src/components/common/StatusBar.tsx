import React, { useState, useEffect } from 'react';
import { Wifi, Battery, Signal } from 'lucide-react';

export const StatusBar: React.FC = () => {
  const [time, setTime] = useState('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTime(
        now.toLocaleTimeString('en-US', {
          hour: '2-digit',
          minute: '2-digit',
          hour12: false,
        })
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 10000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div
      id="android-status-bar"
      className="w-full bg-slate-900 text-slate-100 px-5 pt-2 pb-1.5 flex items-center justify-between text-xs font-semibold select-none z-50 transition-colors"
    >
      <span className="tracking-tight">{time || '09:41'}</span>
      <div className="flex items-center space-x-2 text-slate-300">
        <span className="text-[10px] font-bold bg-emerald-700/80 text-emerald-100 px-1 py-0.5 rounded leading-none">
          5G
        </span>
        <Signal className="w-3.5 h-3.5" />
        <Wifi className="w-3.5 h-3.5" />
        <Battery className="w-4 h-4 fill-slate-200" />
      </div>
    </div>
  );
};
