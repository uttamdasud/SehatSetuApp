import React from 'react';
import { Home, Search, Calendar, Video, User } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { ActiveTab } from '../../types';

export const BottomNav: React.FC = () => {
  const { activeTab, setActiveTab, activeScreen, setActiveScreen, appointments } = useApp();

  const upcomingCount = appointments.filter((a) => a.status === 'UPCOMING').length;

  const tabs: { id: ActiveTab; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'find-doctors', label: 'Find Doctors', icon: Search },
    { id: 'appointments', label: 'Appointments', icon: Calendar },
    { id: 'consultations', label: 'Consultations', icon: Video },
    { id: 'profile', label: 'Profile', icon: User },
  ];

  const handleTabClick = (tabId: ActiveTab) => {
    // If a sub-screen was open, closing it returns directly to the main tab
    if (activeScreen) {
      setActiveScreen(null);
    }
    setActiveTab(tabId);
  };

  return (
    <nav
      id="persistent-bottom-navigation"
      aria-label="Main Navigation"
      className="fixed bottom-0 left-0 right-0 max-w-md mx-auto z-40 bg-white border-t border-slate-200/90 shadow-[0_-4px_12px_rgba(0,0,0,0.05)] px-2 py-1.5"
    >
      <div className="flex items-center justify-around">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id && !activeScreen;

          return (
            <button
              key={tab.id}
              id={`nav-tab-${tab.id}`}
              onClick={() => handleTabClick(tab.id)}
              className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-xl transition-all relative ${
                isActive
                  ? 'text-emerald-800 font-bold'
                  : 'text-slate-500 hover:text-slate-800 font-medium'
              }`}
            >
              <div
                className={`relative p-1 rounded-full transition-transform ${
                  isActive ? 'bg-emerald-50 text-emerald-800 scale-110' : ''
                }`}
              >
                <Icon className="w-5 h-5" />
                {tab.id === 'appointments' && upcomingCount > 0 && (
                  <span className="absolute -top-0.5 -right-1 w-4 h-4 bg-emerald-600 text-white text-[9px] font-bold rounded-full flex items-center justify-center border border-white">
                    {upcomingCount}
                  </span>
                )}
              </div>
              <span className="text-[11px] mt-0.5 tracking-tight leading-none whitespace-nowrap">
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
