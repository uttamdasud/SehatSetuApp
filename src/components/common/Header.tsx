import React from 'react';
import { MapPin, Bell, ChevronDown, ShieldCheck, Fingerprint } from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface HeaderProps {
  title?: string;
  showBack?: boolean;
  onBack?: () => void;
  rightAction?: React.ReactNode;
}

export const Header: React.FC<HeaderProps> = ({
  title,
  showBack,
  onBack,
  rightAction,
}) => {
  const {
    currentLocation,
    setShowLocationModal,
    unreadNotifsCount,
    setShowNotificationsModal,
    setActiveTab,
    userProfile,
    setShowAdminPortal,
    isOwnerAuthenticated,
  } = useApp();

  if (title) {
    return (
      <header
        id="app-sub-header"
        className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 px-4 py-3.5 flex items-center justify-between shadow-xs"
      >
        <div className="flex items-center space-x-3">
          {showBack && (
            <button
              id="header-back-button"
              onClick={onBack}
              className="p-1.5 -ml-1.5 text-slate-700 hover:text-emerald-700 hover:bg-emerald-50 rounded-full transition-colors active:scale-95"
              aria-label="Go back"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7" />
              </svg>
            </button>
          )}
          <h1 className="text-lg font-bold text-slate-900 tracking-tight font-heading">{title}</h1>
        </div>
        {rightAction && <div>{rightAction}</div>}
      </header>
    );
  }

  return (
    <header
      id="app-main-header"
      className="sticky top-0 z-40 bg-emerald-800 text-white px-4 pt-3.5 pb-4 shadow-sm"
    >
      <div className="flex items-center justify-between">
        {/* User Greeting & Location */}
        <div className="flex flex-col">
          <div className="flex items-center space-x-1.5">
            <span className="text-xs font-medium text-emerald-100/90 tracking-wide uppercase">
              SehatSetu
            </span>
            <span className="text-[10px] bg-emerald-700/80 text-emerald-100 px-1.5 py-0.2 rounded font-semibold">
              Anywhere Healthcare
            </span>
          </div>

          <h2 className="text-lg font-bold text-white font-heading mt-0.5">
            Good morning, {userProfile.name.split(' ')[0]}
          </h2>

          <button
            id="header-location-pill"
            onClick={() => setShowLocationModal(true)}
            className="flex items-center space-x-1 text-xs text-emerald-100 hover:text-white mt-0.5 group active:scale-95 transition-all text-left"
          >
            <MapPin className="w-3.5 h-3.5 text-emerald-300" />
            <span className="font-medium underline decoration-emerald-400/50 underline-offset-2">
              {currentLocation.city}, {currentLocation.state}
            </span>
            <ChevronDown className="w-3 h-3 text-emerald-300 group-hover:translate-y-0.5 transition-transform" />
          </button>
        </div>

        {/* Right Actions: Admin, Notifications & Avatar */}
        <div className="flex items-center space-x-2">
          {/* Owner Quick Access */}
          <button
            id="header-admin-btn"
            onClick={() => setShowAdminPortal(true)}
            className={`p-2 rounded-full transition-all active:scale-90 ${
              isOwnerAuthenticated
                ? 'bg-amber-400 text-slate-950 ring-2 ring-amber-200'
                : 'text-emerald-100/70 hover:text-white hover:bg-emerald-700/60'
            }`}
            title={isOwnerAuthenticated ? 'Admin Portal (Authenticated)' : 'Owner Admin Access'}
            aria-label="Owner Admin Portal"
          >
            <ShieldCheck className="w-4 h-4" />
          </button>

          <button
            id="header-notifications-btn"
            onClick={() => setShowNotificationsModal(true)}
            className="relative p-2 text-emerald-100 hover:text-white hover:bg-emerald-700/60 rounded-full transition-all active:scale-90"
            aria-label="View notifications"
          >
            <Bell className="w-5 h-5" />
            {unreadNotifsCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-rose-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center ring-2 ring-emerald-800 animate-pulse-subtle">
                {unreadNotifsCount}
              </span>
            )}
          </button>

          <button
            id="header-avatar-btn"
            onClick={() => setActiveTab('profile')}
            className="w-9 h-9 rounded-full ring-2 ring-emerald-400/80 overflow-hidden shadow-xs active:scale-95 transition-transform"
            aria-label="Open profile"
          >
            <img
              src={userProfile.avatar}
              alt={userProfile.name}
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </button>
        </div>
      </div>
    </header>
  );
};
