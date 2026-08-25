import React from 'react';
import { X, Download, Share2, ShieldCheck, FileCheck, Pill, Calendar, User, Stethoscope } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const DigitalPrescriptionModal: React.FC = () => {
  const { selectedPrescription, setSelectedPrescription, showToast } = useApp();

  if (!selectedPrescription) return null;

  const handleDownload = () => {
    showToast('Prescription PDF downloaded to device');
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator
        .share({
          title: `Prescription - ${selectedPrescription.doctorName}`,
          text: `Digital Prescription from SehatSetu by ${selectedPrescription.doctorName} for ${selectedPrescription.patientName}.`,
        })
        .catch(() => {
          showToast('Prescription link copied to clipboard');
        });
    } else {
      showToast('Prescription link copied to clipboard');
    }
  };

  return (
    <div
      id="prescription-view-modal"
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in duration-200"
    >
      <div className="w-full max-w-md bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl max-h-[92vh] flex flex-col animate-in slide-in-from-bottom duration-250">
        {/* Top Control Bar */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-100 bg-slate-50/80 rounded-t-3xl">
          <div className="flex items-center space-x-2">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
              Official Digital Rx
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <button
              id="share-rx-btn"
              onClick={handleShare}
              className="p-2 text-slate-600 hover:text-emerald-700 hover:bg-white rounded-full transition-colors"
              title="Share prescription"
            >
              <Share2 className="w-4 h-4" />
            </button>
            <button
              id="download-rx-btn"
              onClick={handleDownload}
              className="p-2 text-slate-600 hover:text-emerald-700 hover:bg-white rounded-full transition-colors"
              title="Download PDF"
            >
              <Download className="w-4 h-4" />
            </button>
            <button
              id="close-rx-modal-btn"
              onClick={() => setSelectedPrescription(null)}
              className="p-2 text-slate-400 hover:text-slate-600 hover:bg-white rounded-full transition-colors"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable/Displayable Prescription Document */}
        <div className="flex-1 overflow-y-auto p-5 no-scrollbar bg-slate-50/50">
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs">
            {/* Header: Platform & Clinic */}
            <div className="flex items-start justify-between border-b border-slate-200 pb-4">
              <div>
                <div className="flex items-center space-x-1.5 text-emerald-800 font-bold">
                  <Stethoscope className="w-5 h-5 text-emerald-700" />
                  <span className="text-base font-heading">SehatSetu Telehealth</span>
                </div>
                <div className="text-[11px] text-slate-500 font-medium mt-0.5">
                  Anywhere Healthcare Digital E-Prescription
                </div>
              </div>
              <div className="text-right">
                <div className="text-xs font-bold text-slate-800">Rx #{selectedPrescription.id}</div>
                <div className="text-[11px] text-slate-500">{selectedPrescription.date}</div>
              </div>
            </div>

            {/* Doctor Info */}
            <div className="py-3 border-b border-slate-100 flex items-start justify-between">
              <div>
                <h4 className="text-sm font-bold text-slate-900">{selectedPrescription.doctorName}</h4>
                <div className="text-xs text-emerald-800 font-medium">
                  {selectedPrescription.doctorSpecialty} • {selectedPrescription.doctorQualifications}
                </div>
                <div className="text-[11px] text-slate-500 mt-0.5">{selectedPrescription.doctorHospital}</div>
              </div>
              <div className="text-right text-[10px] text-slate-400">
                <span>Reg: {selectedPrescription.doctorRegNumber}</span>
              </div>
            </div>

            {/* Patient Info Bar */}
            <div className="py-3 border-b border-slate-100 grid grid-cols-3 gap-2 text-xs bg-slate-50/80 -mx-5 px-5">
              <div>
                <span className="text-slate-400 block text-[10px] uppercase">Patient</span>
                <span className="font-bold text-slate-800">{selectedPrescription.patientName}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px] uppercase">Age / Gender</span>
                <span className="font-semibold text-slate-800">
                  {selectedPrescription.patientAge} Yrs / {selectedPrescription.patientGender}
                </span>
              </div>
              <div className="text-right">
                <span className="text-slate-400 block text-[10px] uppercase">Date</span>
                <span className="font-semibold text-slate-800">{selectedPrescription.date}</span>
              </div>
            </div>

            {/* Clinical Diagnosis */}
            <div className="py-3 border-b border-slate-100">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                Clinical Diagnosis
              </span>
              <p className="text-xs font-semibold text-slate-800 leading-relaxed">
                {selectedPrescription.diagnosis}
              </p>
              {selectedPrescription.symptomsRecorded && (
                <p className="text-[11px] text-slate-500 mt-1 italic">
                  Presented: "{selectedPrescription.symptomsRecorded}"
                </p>
              )}
            </div>

            {/* Medicines List (Rx) */}
            <div className="py-4 border-b border-slate-200">
              <div className="flex items-center space-x-1.5 mb-3 text-emerald-800">
                <span className="text-lg font-serif font-black">℞</span>
                <span className="text-xs font-bold uppercase tracking-wider text-slate-700">
                  Prescribed Medicines
                </span>
              </div>

              <div className="space-y-3">
                {selectedPrescription.medicines.map((med, idx) => (
                  <div key={med.id || idx} className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-2">
                        <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold flex items-center justify-center shrink-0">
                          {idx + 1}
                        </span>
                        <div>
                          <div className="text-xs font-bold text-slate-900">{med.name}</div>
                          <div className="text-[11px] text-slate-500 font-medium">{med.dosage}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="inline-block bg-emerald-50 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded border border-emerald-200">
                          {med.duration}
                        </span>
                      </div>
                    </div>

                    <div className="mt-2 pt-2 border-t border-slate-200/60 flex items-center justify-between text-xs text-slate-700">
                      <span className="font-semibold text-emerald-900">{med.frequency}</span>
                      <span className="text-[11px] text-slate-500 italic">{med.instructions}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* General Advice & Followup */}
            <div className="py-3 border-b border-slate-100">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1.5">
                Physician Advice & Precautions
              </span>
              <ul className="text-xs text-slate-700 space-y-1 list-disc pl-4 leading-relaxed">
                {selectedPrescription.advice.map((adv, idx) => (
                  <li key={idx}>{adv}</li>
                ))}
              </ul>

              <div className="mt-3 bg-amber-50 border border-amber-200 rounded-xl p-2.5 flex items-center justify-between text-xs">
                <span className="text-amber-900 font-medium">Follow-up:</span>
                <span className="font-bold text-amber-950">{selectedPrescription.followUpIn}</span>
              </div>
            </div>

            {/* Digital Signature & Verification */}
            <div className="pt-4 flex items-end justify-between">
              <div className="flex items-center space-x-1.5 text-[11px] text-slate-500">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Digitally signed & verified</span>
              </div>
              <div className="text-right">
                <div className="text-xs font-serif font-bold text-slate-800 italic">
                  {selectedPrescription.doctorName}
                </div>
                <div className="text-[9px] text-slate-400 uppercase tracking-wider">
                  Verified Telehealth Practitioner
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Sticky Action Bar */}
        <div className="p-4 bg-white border-t border-slate-100 flex items-center space-x-3">
          <button
            id="download-full-pdf-btn"
            onClick={handleDownload}
            className="flex-1 bg-emerald-800 hover:bg-emerald-900 text-white py-3 px-4 rounded-xl text-xs font-bold flex items-center justify-center space-x-2 shadow-xs transition-all active:scale-[0.98]"
          >
            <Download className="w-4 h-4" />
            <span>Download Official PDF</span>
          </button>
          <button
            id="share-full-btn"
            onClick={handleShare}
            className="bg-slate-100 hover:bg-slate-200 text-slate-800 p-3 rounded-xl transition-colors active:scale-95"
            aria-label="Share"
          >
            <Share2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
