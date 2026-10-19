import React from 'react';
import {
  MapPin,
  Bell,
  ChevronDown,
  Fingerprint,
  LogIn,
  X,
  ChevronRight,
  FileText,
  Settings,
  CalendarDays,
  Stethoscope,
  LogOut,
  Menu,
} from 'lucide-react';
import { createPortal } from 'react-dom';
import { useApp } from '../../context/AppContext';

interface HeaderProps {
  title?: string;
  showBack?: boolean;
  onBack?: () => void;
  rightAction?: React.ReactNode;
  onSignIn?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  title,
  showBack,
  onBack,
  rightAction,
  onSignIn,
}) => {
  const [isProfileDrawerOpen, setIsProfileDrawerOpen] = React.useState(false);
  const {
    currentLocation,
    setShowLocationModal,
    unreadNotifsCount,
    setShowNotificationsModal,
    activeTab,
    setActiveTab,
    userProfile,
    isAuthenticated,
    activeProfileTab,
    setActiveProfileTab,
    logoutUser,
  } = useApp();

  const navigateFromProfile = (destination: 'profile' | 'vault' | 'settings' | 'appointments' | 'doctors' | 'consultations') => {
    if (destination === 'profile') {
      setActiveProfileTab('OVERVIEW');
      setActiveTab('profile');
    } else if (destination === 'vault' || destination === 'settings') {
      setActiveProfileTab(destination === 'vault' ? 'RECORDS' : 'SETTINGS');
      setActiveTab('profile');
    } else if (destination === 'appointments') {
      setActiveTab('appointments');
    } else if (destination === 'doctors') {
      setActiveTab('find-doctors');
    } else {
      setActiveTab('consult');
    }
    setIsProfileDrawerOpen(false);
  };

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
      className="sticky top-0 z-40 border-b border-slate-200 bg-white/90 backdrop-blur-md"
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 md:px-6">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-600 to-teal-700 text-lg font-black text-white shadow-sm">
            S
          </div>
          <div>
            <div className="text-lg font-black tracking-tight text-slate-900 font-heading">SehatSetu</div>
            <div className="text-[10px] uppercase tracking-[0.18em] text-slate-500">Anywhere healthcare</div>
          </div>
        </div>

        <nav className="hidden items-center gap-6 text-sm font-medium text-slate-600 md:flex">
          <button onClick={() => setActiveTab('home')} className="transition hover:text-emerald-700">Home</button>
          <button onClick={() => setActiveTab('find-doctors')} className="transition hover:text-emerald-700">Find Doctors</button>
          <button onClick={() => setActiveTab('appointments')} className="transition hover:text-emerald-700">Appointments</button>
          <button onClick={() => setActiveTab('consultations')} className="transition hover:text-emerald-700">Consultations</button>
        </nav>

        <div className="flex items-center gap-2 sm:gap-3">
          <button
            id="header-location-pill"
            onClick={() => setShowLocationModal(true)}
            className="hidden items-center gap-1 rounded-full border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-medium text-slate-700 transition hover:border-emerald-200 hover:text-emerald-700 sm:inline-flex"
          >
            <MapPin className="h-3.5 w-3.5" />
            <span>{currentLocation.city}</span>
          </button>

          <button
            id="header-notifications-btn"
            onClick={() => setShowNotificationsModal(true)}
            className="relative rounded-full border border-slate-200 bg-white p-2.5 text-slate-600 transition hover:border-emerald-200 hover:text-emerald-700"
            aria-label="Notifications"
          >
            <Bell className="h-4 w-4" />
            {unreadNotifsCount > 0 && (
              <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-rose-500 text-[9px] font-bold text-white ring-2 ring-white">
                {unreadNotifsCount}
              </span>
            )}
          </button>

          <button
            id="header-primary-cta"
            onClick={() => setActiveTab('find-doctors')}
            className="hidden rounded-full bg-emerald-700 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-800 sm:inline-flex"
          >
            Find Care
          </button>

          {!isAuthenticated && (
            <button
              id="header-sign-in"
              type="button"
              onClick={onSignIn}
              className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-2 text-sm font-semibold text-emerald-800 transition hover:bg-emerald-50 sm:px-3"
            >
              <LogIn className="h-4 w-4" />
              <span>Sign in</span>
            </button>
          )}

          <button
            id="header-avatar-btn"
            onClick={() => setIsProfileDrawerOpen((isOpen) => !isOpen)}
            className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-700 transition hover:border-emerald-300 hover:bg-emerald-50 hover:text-emerald-800"
            aria-label="Open navigation menu"
            aria-expanded={isProfileDrawerOpen}
            aria-haspopup="dialog"
          >
            <Menu className="h-5 w-5" />
          </button>
        </div>
      </div>

      {isProfileDrawerOpen && (
        createPortal(<div className="fixed inset-0 z-[100]">
          <button
            type="button"
            className="absolute inset-0 h-full w-full bg-slate-950/40 backdrop-blur-[2px]"
            onClick={() => setIsProfileDrawerOpen(false)}
            aria-label="Close profile menu"
          />
          <aside
            role="dialog"
            aria-modal="true"
            aria-labelledby="profile-drawer-title"
            className="absolute inset-y-0 right-0 flex w-full max-w-sm flex-col border-l border-slate-200 bg-white shadow-2xl animate-in slide-in-from-right duration-200"
          >
            <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
              <div>
                <h2 id="profile-drawer-title" className="text-lg font-bold text-slate-900">Your account</h2>
                <p className="text-xs text-slate-500">Care and profile shortcuts</p>
              </div>
              <button
                type="button"
                onClick={() => setIsProfileDrawerOpen(false)}
                className="rounded-full p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-900"
                aria-label="Close profile menu"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <button
              type="button"
              onClick={() => navigateFromProfile('profile')}
              aria-label="Open profile"
              className="flex w-full items-center gap-3 border-b border-slate-100 px-5 py-5 text-left transition hover:bg-emerald-50/70"
            >
              <img
                src={userProfile.avatar}
                alt=""
                className="h-12 w-12 rounded-full border border-emerald-100 object-cover"
                referrerPolicy="no-referrer"
              />
              <div className="min-w-0">
                <div className="truncate text-sm font-bold text-slate-900">{userProfile.name}</div>
                <div className="truncate text-xs text-slate-500">
                  {isAuthenticated ? userProfile.email : 'Browsing as a guest'}
                </div>
              </div>
              {activeTab === 'profile' && activeProfileTab === 'OVERVIEW' ? (
                <span className="ml-auto h-2 w-2 rounded-full bg-emerald-600" />
              ) : (
                <ChevronRight className="ml-auto h-4 w-4 text-slate-400" />
              )}
            </button>

            <nav className="flex-1 overflow-y-auto p-3" aria-label="Profile navigation">
              <div className="px-3 pb-2 pt-1 text-[11px] font-bold uppercase tracking-wider text-slate-400">Your care</div>
              <button type="button" onClick={() => navigateFromProfile('vault')} className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-sm font-semibold text-slate-700 transition hover:bg-emerald-50 hover:text-emerald-800">
                <FileText className="h-4 w-4" />
                <span className="flex-1">Medical Vault</span>
                {activeTab === 'profile' && activeProfileTab === 'RECORDS' && <span className="h-1.5 w-1.5 rounded-full bg-emerald-600" />}
                <ChevronRight className="h-4 w-4 text-slate-400" />
              </button>
              <button type="button" onClick={() => navigateFromProfile('appointments')} className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-sm font-semibold text-slate-700 transition hover:bg-emerald-50 hover:text-emerald-800">
                <CalendarDays className="h-4 w-4" />
                <span className="flex-1">Appointments</span>
                <ChevronRight className="h-4 w-4 text-slate-400" />
              </button>
              <button type="button" onClick={() => navigateFromProfile('consultations')} className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-sm font-semibold text-slate-700 transition hover:bg-emerald-50 hover:text-emerald-800">
                <Stethoscope className="h-4 w-4" />
                <span className="flex-1">Consultations</span>
                <ChevronRight className="h-4 w-4 text-slate-400" />
              </button>
              <button type="button" onClick={() => navigateFromProfile('doctors')} className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-sm font-semibold text-slate-700 transition hover:bg-emerald-50 hover:text-emerald-800">
                <Stethoscope className="h-4 w-4" />
                <span className="flex-1">Find a doctor</span>
                <ChevronRight className="h-4 w-4 text-slate-400" />
              </button>

              <div className="px-3 pb-2 pt-5 text-[11px] font-bold uppercase tracking-wider text-slate-400">Account</div>
              <button type="button" onClick={() => navigateFromProfile('settings')} className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-sm font-semibold text-slate-700 transition hover:bg-emerald-50 hover:text-emerald-800">
                <Settings className="h-4 w-4" />
                <span className="flex-1">Settings & Security</span>
                {activeTab === 'profile' && activeProfileTab === 'SETTINGS' && <span className="h-1.5 w-1.5 rounded-full bg-emerald-600" />}
                <ChevronRight className="h-4 w-4 text-slate-400" />
              </button>

            </nav>

            <div className="border-t border-slate-100 p-4">
              {isAuthenticated ? (
                <button
                  type="button"
                  onClick={() => {
                    setIsProfileDrawerOpen(false);
                    logoutUser();
                  }}
                  className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-sm font-semibold text-rose-700 transition hover:bg-rose-50"
                >
                  <LogOut className="h-4 w-4" />
                  Sign out
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => {
                    setIsProfileDrawerOpen(false);
                    onSignIn?.();
                  }}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-700 px-4 py-3 text-sm font-bold text-white transition hover:bg-emerald-800"
                >
                  <LogIn className="h-4 w-4" />
                  Optional sign in
                </button>
              )}
            </div>
          </aside>
        </div>, document.body)
      )}
    </header>
  );
};
