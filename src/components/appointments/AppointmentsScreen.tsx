import React, { useState } from 'react';
import {
  Calendar,
  Clock,
  Video,
  Building2,
  FileText,
  Navigation,
  RotateCcw,
  XCircle,
  CheckCircle2,
  ChevronRight,
  AlertCircle,
  Search,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Appointment, AppointmentStatus } from '../../types';

export const AppointmentsScreen: React.FC = () => {
  const {
    appointments,
    cancelAppointment,
    rescheduleAppointment,
    setSelectedPrescription,
    prescriptions,
    startInstantConsultation,
    doctors,
    setActiveTab,
    showToast,
  } = useApp();

  const [activeTab, setActiveTabFilter] = useState<AppointmentStatus>('UPCOMING');
  const [rescheduleAptId, setRescheduleAptId] = useState<string | null>(null);
  const [rescheduleDate, setRescheduleDate] = useState('Tomorrow, 25 Aug');
  const [rescheduleTime, setRescheduleTime] = useState('11:00 AM');

  const filteredAppointments = appointments.filter((a) => a.status === activeTab);

  const handleConfirmReschedule = () => {
    if (rescheduleAptId) {
      rescheduleAppointment(rescheduleAptId, rescheduleDate, rescheduleTime);
      setRescheduleAptId(null);
    }
  };

  return (
    <div id="appointments-screen" className="space-y-4 pb-24 animate-in fade-in duration-200">
      {/* Top Header Tabs */}
      <div className="px-4 sticky top-14 z-30 bg-white/95 backdrop-blur-md pt-2 pb-3 border-b border-slate-100">
        <div className="grid grid-cols-3 gap-1 bg-slate-100 p-1 rounded-2xl">
          <button
            id="tab-upcoming-appointments"
            onClick={() => setActiveTabFilter('UPCOMING')}
            className={`py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'UPCOMING'
                ? 'bg-white text-emerald-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Upcoming ({appointments.filter((a) => a.status === 'UPCOMING').length})
          </button>
          <button
            id="tab-completed-appointments"
            onClick={() => setActiveTabFilter('COMPLETED')}
            className={`py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'COMPLETED'
                ? 'bg-white text-emerald-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Completed ({appointments.filter((a) => a.status === 'COMPLETED').length})
          </button>
          <button
            id="tab-cancelled-appointments"
            onClick={() => setActiveTabFilter('CANCELLED')}
            className={`py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'CANCELLED'
                ? 'bg-white text-emerald-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Cancelled ({appointments.filter((a) => a.status === 'CANCELLED').length})
          </button>
        </div>
      </div>

      {/* Appointment Cards List */}
      <div className="px-4 space-y-3">
        {filteredAppointments.length === 0 ? (
          /* Empty State */
          <div className="p-8 bg-white rounded-3xl border border-slate-200 text-center space-y-3 shadow-xs">
            <div className="w-14 h-14 rounded-full bg-slate-100 text-slate-400 mx-auto flex items-center justify-center">
              <Calendar className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-900 font-heading">
                No {activeTab.toLowerCase()} appointments
              </h4>
              <p className="text-xs text-slate-500 mt-1 max-w-xs mx-auto">
                {activeTab === 'UPCOMING'
                  ? 'You have no scheduled consultations. Book an appointment or consult an available doctor now.'
                  : `You have no ${activeTab.toLowerCase()} appointment records.`}
              </p>
            </div>
            {activeTab === 'UPCOMING' && (
              <button
                id="book-new-appointment-btn"
                onClick={() => setActiveTab('find-doctors')}
                className="mt-2 py-2 px-4 bg-emerald-800 hover:bg-emerald-900 text-white rounded-xl text-xs font-bold inline-flex items-center space-x-1.5 shadow-xs transition-colors"
              >
                <span>Find Doctors & Book</span>
              </button>
            )}
          </div>
        ) : (
          filteredAppointments.map((apt) => (
            <div
              key={apt.id}
              id={`appointment-card-${apt.id}`}
              className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-xs space-y-3 hover:border-slate-300 transition-all"
            >
              {/* Card Header: Doctor info & Status */}
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-3">
                  <img
                    src={apt.doctorImage}
                    alt={apt.doctorName}
                    className="w-13 h-13 rounded-2xl object-cover ring-1 ring-slate-100"
                    referrerPolicy="no-referrer"
                  />
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">{apt.doctorName}</h4>
                    <div className="text-[11px] font-semibold text-emerald-800">{apt.doctorSpecialty}</div>
                    <div className="text-[10px] text-slate-500 mt-0.5">{apt.doctorHospital}</div>
                  </div>
                </div>

                <div className="text-right">
                  <span
                    className={`inline-block text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${
                      apt.status === 'UPCOMING'
                        ? 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                        : apt.status === 'COMPLETED'
                        ? 'bg-slate-100 text-slate-700'
                        : 'bg-rose-100 text-rose-800'
                    }`}
                  >
                    {apt.status}
                  </span>
                  <div className="text-[10px] text-slate-400 mt-1 font-mono">#{apt.id}</div>
                </div>
              </div>

              {/* Appointment Schedule Bar */}
              <div className="bg-slate-50 p-3 rounded-xl flex items-center justify-between text-xs">
                <div className="flex items-center space-x-1.5 text-slate-700 font-semibold">
                  <Clock className="w-3.5 h-3.5 text-emerald-700" />
                  <span>
                    {apt.date}, {apt.timeSlot}
                  </span>
                </div>

                <div className="flex items-center space-x-1 text-[11px] font-bold text-emerald-900">
                  {apt.type === 'VIDEO' ? (
                    <>
                      <Video className="w-3.5 h-3.5 text-emerald-700" />
                      <span>Video Call</span>
                    </>
                  ) : (
                    <>
                      <Building2 className="w-3.5 h-3.5 text-emerald-700" />
                      <span>In-Clinic</span>
                    </>
                  )}
                </div>
              </div>

              {/* Patient info */}
              <div className="text-[11px] text-slate-500 flex items-center justify-between">
                <span>
                  Patient: <strong className="text-slate-800">{apt.patientName}</strong> ({apt.relationshipToUser})
                </span>
                <span className="font-semibold text-slate-700">₹{apt.totalPaid} Paid</span>
              </div>

              {/* Actions according to Status */}
              <div className="pt-2 border-t border-slate-100 flex items-center justify-between space-x-2">
                {apt.status === 'UPCOMING' && (
                  <>
                    {apt.type === 'VIDEO' ? (
                      <button
                        id={`join-call-apt-${apt.id}`}
                        onClick={() => {
                          const doc = doctors.find((d) => d.id === apt.doctorId) || doctors[0];
                          startInstantConsultation(doc);
                        }}
                        className="flex-1 py-2 px-3 bg-emerald-800 hover:bg-emerald-900 text-white rounded-xl text-xs font-bold flex items-center justify-center space-x-1.5 shadow-xs transition-colors"
                      >
                        <Video className="w-3.5 h-3.5" />
                        <span>Join Consultation</span>
                      </button>
                    ) : (
                      <button
                        onClick={() => showToast('Opening Clinic Location in Maps...')}
                        className="flex-1 py-2 px-3 bg-emerald-800 hover:bg-emerald-900 text-white rounded-xl text-xs font-bold flex items-center justify-center space-x-1.5 shadow-xs transition-colors"
                      >
                        <Navigation className="w-3.5 h-3.5" />
                        <span>Get Directions</span>
                      </button>
                    )}

                    <button
                      id={`reschedule-btn-${apt.id}`}
                      onClick={() => setRescheduleAptId(apt.id)}
                      className="py-2 px-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-colors"
                    >
                      Reschedule
                    </button>

                    <button
                      id={`cancel-btn-${apt.id}`}
                      onClick={() => cancelAppointment(apt.id)}
                      className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors"
                      title="Cancel appointment"
                    >
                      <XCircle className="w-4 h-4" />
                    </button>
                  </>
                )}

                {apt.status === 'COMPLETED' && (
                  <>
                    {apt.prescriptionId && (
                      <button
                        onClick={() => {
                          const rx = prescriptions.find((p) => p.id === apt.prescriptionId);
                          if (rx) setSelectedPrescription(rx);
                        }}
                        className="flex-1 py-2 px-3 bg-emerald-50 hover:bg-emerald-100 text-emerald-900 rounded-xl text-xs font-bold flex items-center justify-center space-x-1.5 transition-colors"
                      >
                        <FileText className="w-3.5 h-3.5 text-emerald-700" />
                        <span>View Digital Prescription</span>
                      </button>
                    )}
                    <button
                      onClick={() => {
                        const doc = doctors.find((d) => d.id === apt.doctorId) || doctors[0];
                        setActiveTab('find-doctors');
                      }}
                      className="py-2 px-3 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-bold transition-colors"
                    >
                      Book Follow-up
                    </button>
                  </>
                )}

                {apt.status === 'CANCELLED' && (
                  <div className="w-full flex items-center justify-between text-xs text-slate-400">
                    <span>Cancelled on request</span>
                    <button
                      onClick={() => setActiveTab('find-doctors')}
                      className="text-emerald-800 font-bold hover:underline"
                    >
                      Book Again
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Reschedule Bottom Sheet */}
      {rescheduleAptId && (
        <div
          id="reschedule-modal"
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-end justify-center animate-in fade-in duration-200"
        >
          <div className="w-full max-w-md bg-white rounded-t-3xl p-5 shadow-2xl space-y-4 animate-in slide-in-from-bottom duration-250">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="text-sm font-bold text-slate-900 font-heading">Reschedule Appointment</h3>
              <button
                onClick={() => setRescheduleAptId(null)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-full"
              >
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            {/* Select Date */}
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-2">
                Select New Date
              </label>
              <div className="grid grid-cols-3 gap-2">
                {['Tomorrow, 25 Aug', 'Wed, 26 Aug', 'Thu, 27 Aug'].map((d) => (
                  <button
                    key={d}
                    onClick={() => setRescheduleDate(d)}
                    className={`py-2 px-2 rounded-xl text-xs font-semibold border text-center ${
                      rescheduleDate === d
                        ? 'bg-emerald-800 text-white border-emerald-800 shadow-xs'
                        : 'bg-white text-slate-700 border-slate-200'
                    }`}
                  >
                    {d}
                  </button>
                ))}
              </div>
            </div>

            {/* Select Time */}
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-2">
                Select New Time Slot
              </label>
              <div className="grid grid-cols-3 gap-2">
                {['10:00 AM', '11:30 AM', '04:30 PM', '05:45 PM', '06:30 PM', '07:15 PM'].map((t) => (
                  <button
                    key={t}
                    onClick={() => setRescheduleTime(t)}
                    className={`py-2 rounded-xl text-xs font-semibold border text-center ${
                      rescheduleTime === t
                        ? 'bg-emerald-800 text-white border-emerald-800 shadow-xs'
                        : 'bg-white text-slate-700 border-slate-200'
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            <div className="pt-2 flex items-center space-x-2">
              <button
                onClick={() => setRescheduleAptId(null)}
                className="py-3 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold"
              >
                Cancel
              </button>
              <button
                id="confirm-reschedule-btn"
                onClick={handleConfirmReschedule}
                className="flex-1 py-3 bg-emerald-800 hover:bg-emerald-900 text-white rounded-xl text-xs font-bold shadow-xs transition-colors"
              >
                Confirm New Slot
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
