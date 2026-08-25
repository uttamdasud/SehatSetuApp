import React from 'react';
import {
  Building2,
  MapPin,
  Phone,
  Clock,
  ShieldCheck,
  Star,
  ChevronRight,
  ArrowLeft,
  Navigation,
  CheckCircle2,
  Stethoscope,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const HospitalDetailModal: React.FC = () => {
  const { setActiveScreen, doctors, startBooking, showToast } = useApp();

  const hospitalDoctors = doctors.slice(0, 4);

  return (
    <div id="hospital-detail-screen" className="bg-slate-50 min-h-screen pb-24 animate-in fade-in duration-200">
      {/* Top Header Bar */}
      <div className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 px-4 py-3 flex items-center justify-between">
        <button
          onClick={() => setActiveScreen(null)}
          className="p-1.5 -ml-1 text-slate-700 hover:text-slate-900 rounded-full hover:bg-slate-100"
          aria-label="Back"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">Hospital Facility</span>
        <button
          onClick={() => showToast('Opening Hospital Location in Google Maps...')}
          className="p-1.5 text-emerald-800 hover:text-emerald-950 font-bold text-xs flex items-center space-x-1"
        >
          <Navigation className="w-3.5 h-3.5" />
          <span>Maps</span>
        </button>
      </div>

      <div className="p-4 space-y-4 max-w-md mx-auto">
        {/* Hospital Card */}
        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs space-y-3">
          <div className="flex items-start space-x-3.5">
            <div className="w-14 h-14 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold shrink-0">
              <Building2 className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center space-x-1.5">
                <h3 className="text-base font-bold text-slate-900 font-heading">ILS Hospitals Agartala</h3>
                <ShieldCheck className="w-4 h-4 text-emerald-700 shrink-0" />
              </div>
              <div className="text-xs text-slate-500 mt-0.5">Capital Complex, Kunjaban, Agartala, Tripura</div>
              <div className="flex items-center space-x-2 mt-1.5 text-[11px] font-semibold text-emerald-800">
                <span className="bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  NABH Accredited
                </span>
                <span className="bg-rose-50 text-rose-800 px-2 py-0.5 rounded border border-rose-200">
                  24/7 Emergency
                </span>
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 grid grid-cols-2 gap-2 text-xs text-slate-600">
            <div className="flex items-center space-x-1.5">
              <Phone className="w-3.5 h-3.5 text-slate-400" />
              <span>+91 381 241 0500</span>
            </div>
            <div className="flex items-center space-x-1.5">
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              <span>OPD: 08:00 AM - 08:00 PM</span>
            </div>
          </div>
        </div>

        {/* Available Specialists at Facility */}
        <div className="space-y-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Available Specialists at this Hospital
          </h4>

          <div className="space-y-2.5">
            {hospitalDoctors.map((doc) => (
              <div
                key={doc.id}
                className="bg-white p-3.5 rounded-2xl border border-slate-200/90 shadow-xs flex items-center justify-between"
              >
                <div className="flex items-center space-x-3">
                  <img
                    src={doc.image}
                    alt={doc.name}
                    className="w-12 h-12 rounded-xl object-cover"
                    referrerPolicy="no-referrer"
                  />
                  <div>
                    <h5 className="text-xs font-bold text-slate-900">{doc.name}</h5>
                    <div className="text-[11px] text-emerald-800 font-semibold">{doc.specialty}</div>
                    <div className="text-[10px] text-slate-500">{doc.qualifications}</div>
                  </div>
                </div>

                <button
                  onClick={() => startBooking(doc, 'IN_CLINIC')}
                  className="py-1.5 px-3 bg-emerald-800 hover:bg-emerald-900 text-white rounded-xl text-xs font-bold shadow-xs transition-colors"
                >
                  Book OPD
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
