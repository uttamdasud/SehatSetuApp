import React from 'react';
import { Home, Search, Calendar, Video } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { ActiveTab } from '../../types';

export const BottomNav: React.FC = () => {
  const {
    activeTab,
    setActiveTab,
    activeScreen,
    setActiveScreen,
    appointments,
  } = useApp();

  const upcomingCount = appointments.filter((a) => a.status === 'UPCOMING').length;

  const tabs: { id: ActiveTab; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'find-doctors', label: 'Find Doctors', icon: Search },
    { id: 'appointments', label: 'Appointments', icon: Calendar },
    { id: 'consultations', label: 'Consultations', icon: Video },
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
      id="persistent-top-navigation"
      aria-label="Main Navigation"
      className="w-full bg-white/95 border border-slate-200 shadow-sm rounded-2xl px-2 py-2"
    >
      <div className="flex items-center justify-between gap-2 overflow-x-auto">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id && !activeScreen;

          return (
            <button
              key={tab.id}
              id={`nav-tab-${tab.id}`}
              onClick={() => handleTabClick(tab.id)}
              className={`flex min-w-[110px] flex-1 items-center justify-center gap-2 rounded-xl px-3 py-2.5 text-sm font-medium transition-all ${
                isActive
                  ? 'bg-emerald-50 text-emerald-800 shadow-sm ring-1 ring-emerald-100'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <div className="relative">
                <Icon className="w-4 h-4" />
                {tab.id === 'appointments' && upcomingCount > 0 && (
                  <span className="absolute -top-1.5 -right-2 w-4 h-4 bg-emerald-600 text-white text-[9px] font-bold rounded-full flex items-center justify-center border border-white">
                    {upcomingCount}
                  </span>
                )}
              </div>
              <span className="whitespace-nowrap">{tab.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
