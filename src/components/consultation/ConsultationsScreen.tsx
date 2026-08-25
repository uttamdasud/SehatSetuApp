import React, { useState } from 'react';
import {
  Video,
  Clock,
  ShieldCheck,
  Star,
  Users,
  Zap,
  PhoneCall,
  Calendar,
  ChevronRight,
  FileText,
  Building2,
  Sparkles,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const ConsultationsScreen: React.FC = () => {
  const {
    doctors,
    startInstantConsultation,
    appointments,
    setSelectedDoctor,
    setActiveScreen,
    setSelectedPrescription,
    prescriptions,
  } = useApp();

  const [filterMode, setFilterMode] = useState<'NOW' | 'HISTORY'>('NOW');

  const onDutyDoctors = doctors.filter((d) => d.isAvailableNow);
  const completedConsults = appointments.filter((a) => a.status === 'COMPLETED');

  return (
    <div id="consultations-screen" className="space-y-4 pb-24 animate-in fade-in duration-200">
      {/* Header Banner */}
      <div className="px-4 pt-1">
        <div className="bg-gradient-to-r from-emerald-800 to-teal-900 text-white p-5 rounded-3xl shadow-sm">
          <div className="flex items-center space-x-2 text-emerald-200 text-xs font-bold uppercase tracking-wider mb-1">
            <Zap className="w-4 h-4 text-emerald-300" />
            <span>Instant Telemedicine</span>
          </div>
          <h2 className="text-base font-bold font-heading">Consult a Doctor Now</h2>
          <p className="text-xs text-emerald-100/90 mt-1 leading-relaxed">
            Skip the waiting room. Connect with a verified Indian medical specialist in under 2 minutes.
          </p>

          <button
            id="instant-consult-now-action-btn"
            onClick={() => startInstantConsultation()}
            className="mt-4 w-full bg-white hover:bg-emerald-50 text-emerald-950 font-bold text-xs py-3 px-4 rounded-xl flex items-center justify-center space-x-2 shadow-xs active:scale-[0.98] transition-all"
          >
            <Video className="w-4 h-4 text-emerald-700" />
            <span>Start Instant Video Call (₹399)</span>
          </button>
        </div>
      </div>

      {/* Mode Switcher */}
      <div className="px-4">
        <div className="grid grid-cols-2 gap-1.5 bg-slate-100 p-1 rounded-2xl">
          <button
            onClick={() => setFilterMode('NOW')}
            className={`py-2 rounded-xl text-xs font-bold transition-all ${
              filterMode === 'NOW' ? 'bg-white text-emerald-900 shadow-xs' : 'text-slate-600'
            }`}
          >
            Doctors Available Now ({onDutyDoctors.length})
          </button>
          <button
            onClick={() => setFilterMode('HISTORY')}
            className={`py-2 rounded-xl text-xs font-bold transition-all ${
              filterMode === 'HISTORY' ? 'bg-white text-emerald-900 shadow-xs' : 'text-slate-600'
            }`}
          >
            Past Consultations ({completedConsults.length})
          </button>
        </div>
      </div>

      {/* DOCTORS AVAILABLE NOW */}
      {filterMode === 'NOW' && (
        <div className="px-4 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              On-Duty Specialists Ready for Video Call
            </h3>
          </div>

          <div className="space-y-3">
            {onDutyDoctors.map((doc) => (
              <div
                key={doc.id}
                id={`duty-doc-card-${doc.id}`}
                className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs hover:border-slate-300 transition-all"
              >
                <div className="flex items-start space-x-3.5">
                  <div className="relative shrink-0">
                    <img
                      src={doc.image}
                      alt={doc.name}
                      className="w-16 h-16 rounded-2xl object-cover ring-1 ring-slate-100"
                      referrerPolicy="no-referrer"
                    />
                    <span className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-emerald-500 border-2 border-white rounded-full" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-1.5">
                        <h4 className="text-xs font-bold text-slate-900 truncate">{doc.name}</h4>
                        {doc.verified && <ShieldCheck className="w-3.5 h-3.5 text-emerald-700 shrink-0" />}
                      </div>
                      <div className="flex items-center space-x-1 text-[11px] font-bold text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200">
                        <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                        <span>{doc.rating}</span>
                      </div>
                    </div>

                    <div className="text-xs font-medium text-emerald-800 mt-0.5">{doc.specialty}</div>
                    <div className="text-[11px] text-slate-500 mt-0.5 truncate">
                      {doc.qualifications} • {doc.experienceYears} yrs
                    </div>
                    <div className="text-[11px] text-slate-500 mt-0.5 truncate flex items-center space-x-1">
                      <Building2 className="w-3 h-3 text-slate-400 shrink-0" />
                      <span>{doc.hospital}</span>
                    </div>
                  </div>
                </div>

                <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-xs">
                  <div>
                    <span className="text-[10px] text-slate-400 block uppercase">Instant Fee</span>
                    <span className="text-sm font-extrabold text-emerald-900">₹{doc.feeVideo}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => {
                        setSelectedDoctor(doc);
                        setActiveScreen('doctor-profile');
                      }}
                      className="py-2 px-3 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-bold transition-colors"
                    >
                      Profile
                    </button>
                    <button
                      id={`start-call-doc-${doc.id}`}
                      onClick={() => startInstantConsultation(doc)}
                      className="py-2 px-4 bg-emerald-800 hover:bg-emerald-900 text-white rounded-xl text-xs font-bold flex items-center space-x-1.5 shadow-xs transition-all active:scale-95"
                    >
                      <Video className="w-3.5 h-3.5" />
                      <span>Start Consultation</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* PAST CONSULTATIONS HISTORY */}
      {filterMode === 'HISTORY' && (
        <div className="px-4 space-y-3">
          {completedConsults.length === 0 ? (
            <div className="py-12 text-center text-slate-400 bg-white rounded-3xl border border-slate-200 p-6">
              <Video className="w-10 h-10 mx-auto text-slate-300 mb-2" />
              <p className="text-xs font-bold text-slate-700">No past consultations yet</p>
              <p className="text-[11px] text-slate-500 mt-1">
                Completed video and clinic visits will be archived here.
              </p>
            </div>
          ) : (
            completedConsults.map((apt) => (
              <div
                key={apt.id}
                className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-3"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <img
                      src={apt.doctorImage}
                      alt={apt.doctorName}
                      className="w-12 h-12 rounded-xl object-cover"
                      referrerPolicy="no-referrer"
                    />
                    <div>
                      <h4 className="text-xs font-bold text-slate-900">{apt.doctorName}</h4>
                      <div className="text-[11px] text-emerald-800 font-medium">{apt.doctorSpecialty}</div>
                      <div className="text-[10px] text-slate-500 mt-0.5">
                        {apt.date} • {apt.timeSlot}
                      </div>
                    </div>
                  </div>

                  <span className="text-[10px] font-bold uppercase text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    Completed
                  </span>
                </div>

                {apt.prescriptionId && (
                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                    <div className="text-[11px] text-slate-600">
                      Digital Prescription: <strong className="text-slate-800">#{apt.prescriptionId}</strong>
                    </div>
                    <button
                      onClick={() => {
                        const rx = prescriptions.find((p) => p.id === apt.prescriptionId);
                        if (rx) setSelectedPrescription(rx);
                      }}
                      className="py-1.5 px-3 bg-emerald-50 hover:bg-emerald-100 text-emerald-900 rounded-lg text-xs font-bold flex items-center space-x-1 transition-colors"
                    >
                      <FileText className="w-3.5 h-3.5 text-emerald-700" />
                      <span>View Rx</span>
                    </button>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};
