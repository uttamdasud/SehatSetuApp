import React from 'react';
import { CheckCircle, Info } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const Toast: React.FC = () => {
  const { toastMessage } = useApp();

  if (!toastMessage) return null;

  return (
    <div
      id="app-floating-toast"
      className="fixed top-14 left-1/2 -translate-x-1/2 z-50 w-11/12 max-w-sm bg-slate-900/95 text-white backdrop-blur-md px-4 py-3 rounded-2xl shadow-xl border border-slate-700/50 flex items-center space-x-3 text-sm animate-in fade-in slide-in-from-top-4 duration-200"
    >
      <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0" />
      <span className="font-medium text-slate-100 flex-1">{toastMessage}</span>
    </div>
  );
};
