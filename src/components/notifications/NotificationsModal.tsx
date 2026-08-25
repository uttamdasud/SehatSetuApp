import React from 'react';
import { X, Bell, Calendar, FileText, CheckCircle2, AlertCircle, CreditCard, Stethoscope, CheckCheck } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { NotificationItem } from '../../types';

export const NotificationsModal: React.FC = () => {
  const {
    showNotificationsModal,
    setShowNotificationsModal,
    notifications,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    setActiveTab,
    setSelectedPrescription,
    prescriptions,
  } = useApp();

  if (!showNotificationsModal) return null;

  const todayNotifs = notifications.filter((n) => n.dateGroup === 'TODAY');
  const yesterdayNotifs = notifications.filter((n) => n.dateGroup === 'YESTERDAY');
  const earlierNotifs = notifications.filter((n) => n.dateGroup === 'EARLIER');

  const getNotifIcon = (type: NotificationItem['type']) => {
    switch (type) {
      case 'REMINDER':
        return <Calendar className="w-4 h-4 text-amber-600" />;
      case 'CONFIRMATION':
        return <CheckCircle2 className="w-4 h-4 text-emerald-600" />;
      case 'PRESCRIPTION':
        return <FileText className="w-4 h-4 text-teal-600" />;
      case 'AVAILABILITY':
        return <Stethoscope className="w-4 h-4 text-blue-600" />;
      case 'PAYMENT':
        return <CreditCard className="w-4 h-4 text-emerald-600" />;
      default:
        return <AlertCircle className="w-4 h-4 text-slate-600" />;
    }
  };

  const handleNotifClick = (notif: NotificationItem) => {
    markNotificationAsRead(notif.id);
    setShowNotificationsModal(false);

    if (notif.prescriptionId) {
      const rx = prescriptions.find((p) => p.id === notif.prescriptionId);
      if (rx) setSelectedPrescription(rx);
    } else if (notif.appointmentId || notif.type === 'CONFIRMATION' || notif.type === 'REMINDER') {
      setActiveTab('appointments');
    }
  };

  const renderGroup = (title: string, items: NotificationItem[]) => {
    if (items.length === 0) return null;

    return (
      <div className="mb-4">
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2 px-1">
          {title}
        </h4>
        <div className="space-y-2">
          {items.map((item) => (
            <button
              key={item.id}
              id={`notif-item-${item.id}`}
              onClick={() => handleNotifClick(item)}
              className={`w-full p-3.5 rounded-2xl border text-left flex items-start space-x-3 transition-all ${
                item.read
                  ? 'bg-white border-slate-200/70 text-slate-700'
                  : 'bg-emerald-50/50 border-emerald-200 text-slate-900 shadow-xs'
              }`}
            >
              <div className={`p-2 rounded-xl shrink-0 mt-0.5 ${item.read ? 'bg-slate-100' : 'bg-white shadow-xs'}`}>
                {getNotifIcon(item.type)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <div className="text-xs font-bold text-slate-900 truncate">{item.title}</div>
                  <span className="text-[10px] text-slate-600 shrink-0 ml-2">{item.time}</span>
                </div>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed">{item.message}</p>
                {!item.read && (
                  <span className="inline-block w-2 h-2 bg-emerald-600 rounded-full mt-1.5" />
                )}
              </div>
            </button>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div
      id="notifications-modal-backdrop"
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in duration-200"
    >
      <div className="w-full max-w-md bg-slate-50 rounded-t-3xl sm:rounded-3xl p-5 shadow-2xl max-h-[85vh] flex flex-col animate-in slide-in-from-bottom duration-250">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-200">
          <div className="flex items-center space-x-2">
            <Bell className="w-5 h-5 text-emerald-700" />
            <h3 className="text-lg font-heading font-bold text-slate-900">Notifications</h3>
          </div>
          <div className="flex items-center space-x-2">
            <button
              id="mark-all-read-btn"
              onClick={markAllNotificationsAsRead}
              className="text-xs font-medium text-emerald-800 hover:text-emerald-900 flex items-center space-x-1 px-2 py-1 rounded-lg hover:bg-emerald-100"
            >
              <CheckCheck className="w-3.5 h-3.5" />
              <span>Mark all read</span>
            </button>
            <button
              id="close-notifs-btn"
              onClick={() => setShowNotificationsModal(false)}
              className="p-1 text-slate-400 hover:text-slate-600 rounded-full"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto pt-4 no-scrollbar">
          {notifications.length === 0 ? (
            <div className="py-12 text-center text-slate-400">
              <Bell className="w-10 h-10 mx-auto text-slate-300 mb-2" />
              <p className="text-sm font-medium">No notifications yet</p>
            </div>
          ) : (
            <>
              {renderGroup('Today', todayNotifs)}
              {renderGroup('Yesterday', yesterdayNotifs)}
              {renderGroup('Earlier', earlierNotifs)}
            </>
          )}
        </div>
      </div>
    </div>
  );
};
