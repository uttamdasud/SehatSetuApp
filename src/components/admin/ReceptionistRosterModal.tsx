import React, { useState } from 'react';
import {
  Calendar,
  Clock,
  Phone,
  Mail,
  Send,
  Printer,
  Copy,
  Check,
  Building2,
  User,
  MapPin,
  Stethoscope,
  X,
  Share2,
  FileSpreadsheet,
  AlertCircle,
  Sparkles,
  Edit2,
  MessageCircle,
  ExternalLink,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Doctor, Appointment } from '../../types';
import {
  generateDoctorDailyRosterWhatsAppText,
  generateDoctorDailyRosterEmailContent,
  getWhatsAppRosterUrl,
  getEmailRosterUrl,
} from '../../utils/receptionistNotifier';

export const ReceptionistRosterModal: React.FC = () => {
  const {
    showReceptionistRosterModal,
    setShowReceptionistRosterModal,
    rosterDoctor,
    setRosterDoctor,
    rosterDate,
    setRosterDate,
    doctors,
    appointments,
    updateDoctorReceptionistDetails,
    showToast,
  } = useApp();

  const [copied, setCopied] = useState(false);
  const [isEditingReceptionist, setIsEditingReceptionist] = useState(false);
  const [receptionistName, setReceptionistName] = useState('');
  const [receptionistPhone, setReceptionistPhone] = useState('');
  const [receptionistEmail, setReceptionistEmail] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  if (!showReceptionistRosterModal) return null;

  const currentDoctor = rosterDoctor || doctors[0];
  const currentDate = rosterDate || 'Today, 24 Aug';

  // Filter appointments for this doctor on this date
  const doctorAppointments = appointments
    .filter((a) => a.doctorId === currentDoctor?.id && a.date.includes(currentDate.split(' (')[0]) && a.status !== 'CANCELLED')
    .sort((a, b) => (a.serialNumber || 0) - (b.serialNumber || 0));

  const filteredAppointments = doctorAppointments.filter((apt) => {
    if (!searchTerm.trim()) return true;
    const term = searchTerm.toLowerCase();
    return (
      apt.patientName.toLowerCase().includes(term) ||
      apt.patientPhone.includes(term) ||
      (apt.patientAddress && apt.patientAddress.toLowerCase().includes(term)) ||
      (apt.tokenNumber && apt.tokenNumber.toLowerCase().includes(term))
    );
  });

  const handleStartEditReceptionist = () => {
    setReceptionistName(currentDoctor.receptionistName || 'Pooja Sharma (Clinic Desk)');
    setReceptionistPhone(currentDoctor.receptionistPhone || '+91 98301 22450');
    setReceptionistEmail(currentDoctor.receptionistEmail || `desk.${currentDoctor.id}@medpulse.in`);
    setIsEditingReceptionist(true);
  };

  const handleSaveReceptionist = (e: React.FormEvent) => {
    e.preventDefault();
    if (currentDoctor) {
      updateDoctorReceptionistDetails(currentDoctor.id, receptionistName, receptionistPhone, receptionistEmail);
      setIsEditingReceptionist(false);
      showToast('Receptionist contact information updated');
    }
  };

  const handleSendWhatsApp = () => {
    if (!currentDoctor) return;
    const rosterText = generateDoctorDailyRosterWhatsAppText(currentDoctor, currentDate, doctorAppointments);
    const targetPhone = currentDoctor.receptionistPhone || '9830122450';
    const waUrl = getWhatsAppRosterUrl(targetPhone, rosterText);
    window.open(waUrl, '_blank');
    showToast(`Opening WhatsApp to send full-day roster to ${currentDoctor.receptionistName || 'Receptionist'} (${targetPhone})`);
  };

  const handleSendEmail = () => {
    if (!currentDoctor) return;
    const { subject, body } = generateDoctorDailyRosterEmailContent(currentDoctor, currentDate, doctorAppointments);
    const targetEmail = currentDoctor.receptionistEmail || `desk.${currentDoctor.id}@medpulse.in`;
    const mailtoUrl = getEmailRosterUrl(targetEmail, subject, body);
    window.location.href = mailtoUrl;
    showToast(`Prepared daily patient roster email for ${targetEmail}`);
  };

  const handleCopyManifest = () => {
    if (!currentDoctor) return;
    const rosterText = generateDoctorDailyRosterWhatsAppText(currentDoctor, currentDate, doctorAppointments);
    navigator.clipboard.writeText(rosterText);
    setCopied(true);
    showToast('Daily Booking Manifest copied to clipboard');
    setTimeout(() => setCopied(false), 2500);
  };

  const handlePrint = () => {
    window.print();
  };

  const totalVisitingFees = doctorAppointments.reduce((acc, curr) => acc + (curr.doctorFeePayableAtClinic || curr.fee || 0), 0);
  const clinicVisitsCount = doctorAppointments.filter((a) => a.type === 'IN_CLINIC').length;
  const videoCallsCount = doctorAppointments.filter((a) => a.type === 'VIDEO').length;

  const dateOptions = [
    'Today, 24 Aug',
    'Tomorrow, 25 Aug',
    'Wed, 26 Aug',
    'Thu, 27 Aug',
    'Fri, 28 Aug',
    'Sat, 29 Aug',
  ];

  return (
    <div
      id="receptionist-roster-modal"
      className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5 animate-in fade-in duration-200"
    >
      <div className="w-full max-w-3xl bg-white rounded-3xl shadow-2xl max-h-[92vh] flex flex-col overflow-hidden border border-slate-200 animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-800 via-teal-900 to-emerald-950 text-white p-4 shrink-0 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-white/15 backdrop-blur-xs flex items-center justify-center text-emerald-200 shadow-inner">
              <FileSpreadsheet className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="text-base font-bold font-heading">Clinic Receptionist Daily Roster</h3>
                <span className="text-[10px] bg-emerald-400/20 text-emerald-200 font-bold px-2 py-0.5 rounded-full border border-emerald-400/30">
                  Auto-Dispatch Manifest
                </span>
              </div>
              <p className="text-xs text-emerald-200">
                Automated WhatsApp & Email Patient Serial Number Delivery for Reception Desk
              </p>
            </div>
          </div>

          <button
            id="close-roster-modal-btn"
            onClick={() => setShowReceptionistRosterModal(false)}
            className="p-1.5 text-white/80 hover:text-white rounded-full hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Controls Bar */}
        <div className="p-4 bg-slate-50 border-b border-slate-200/80 space-y-3 shrink-0">
          {/* Doctor & Date Selection */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {/* Doctor Picker */}
            <div>
              <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block mb-1">
                Select Specialist Doctor
              </label>
              <select
                id="roster-doctor-select"
                value={currentDoctor?.id || ''}
                onChange={(e) => {
                  const doc = doctors.find((d) => d.id === e.target.value);
                  if (doc) setRosterDoctor(doc);
                }}
                className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs font-bold text-slate-800 focus:ring-2 focus:ring-emerald-600 shadow-xs"
              >
                {doctors.map((doc) => (
                  <option key={doc.id} value={doc.id}>
                    {doc.name} — {doc.specialty} ({doc.hospital})
                  </option>
                ))}
              </select>
            </div>

            {/* Date Picker */}
            <div>
              <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block mb-1">
                Schedule Date
              </label>
              <select
                id="roster-date-select"
                value={currentDate}
                onChange={(e) => setRosterDate(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs font-bold text-slate-800 focus:ring-2 focus:ring-emerald-600 shadow-xs"
              >
                {dateOptions.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Receptionist Desk Details Bar */}
          <div className="bg-white p-3 rounded-2xl border border-slate-200/90 shadow-xs">
            {isEditingReceptionist ? (
              <form onSubmit={handleSaveReceptionist} className="space-y-2.5 text-xs">
                <div className="flex items-center justify-between pb-1 border-b border-slate-100">
                  <span className="font-bold text-slate-800">Configure Doctor's Receptionist Contact</span>
                  <button
                    type="button"
                    onClick={() => setIsEditingReceptionist(false)}
                    className="text-[11px] text-slate-400 hover:text-slate-600"
                  >
                    Cancel
                  </button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <div>
                    <label className="text-[10px] font-bold text-slate-500 block mb-0.5">Receptionist / Desk Name</label>
                    <input
                      type="text"
                      value={receptionistName}
                      onChange={(e) => setReceptionistName(e.target.value)}
                      placeholder="e.g. Pooja Sharma"
                      className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                      required
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-slate-500 block mb-0.5">WhatsApp Mobile Number</label>
                    <input
                      type="tel"
                      value={receptionistPhone}
                      onChange={(e) => setReceptionistPhone(e.target.value)}
                      placeholder="+91 98301 22450"
                      className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                      required
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-slate-500 block mb-0.5">Desk Email Address</label>
                    <input
                      type="email"
                      value={receptionistEmail}
                      onChange={(e) => setReceptionistEmail(e.target.value)}
                      placeholder="desk@hospital.com"
                      className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                      required
                    />
                  </div>
                </div>
                <button
                  type="submit"
                  className="w-full py-1.5 bg-emerald-800 hover:bg-emerald-900 text-white rounded-lg text-xs font-bold transition-colors"
                >
                  Save Receptionist Contacts
                </button>
              </form>
            ) : (
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center space-x-2.5">
                  <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-800 flex items-center justify-center font-bold text-xs shrink-0 border border-emerald-200">
                    <User className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="flex items-center space-x-1.5">
                      <span className="text-xs font-bold text-slate-900">
                        {currentDoctor.receptionistName || 'Pooja Sharma (Clinic Front Desk)'}
                      </span>
                      <span className="text-[10px] bg-emerald-100 text-emerald-900 font-bold px-1.5 py-0.2 rounded-md">
                        Active Desk
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-500 flex items-center space-x-2 mt-0.5">
                      <span>WhatsApp: <strong className="text-slate-800">{currentDoctor.receptionistPhone || '+91 98301 22450'}</strong></span>
                      <span>•</span>
                      <span className="truncate max-w-[180px]">Email: <strong className="text-slate-800">{currentDoctor.receptionistEmail || `desk.${currentDoctor.id}@medpulse.in`}</strong></span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-1.5 shrink-0">
                  <button
                    onClick={handleStartEditReceptionist}
                    className="p-1.5 px-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold flex items-center space-x-1 transition-colors"
                  >
                    <Edit2 className="w-3 h-3" />
                    <span>Edit Desk Info</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-4 gap-2 text-center text-xs">
            <div className="p-2 bg-emerald-50/80 rounded-xl border border-emerald-200">
              <span className="text-[10px] text-emerald-800 font-bold block uppercase">Total Bookings</span>
              <span className="text-base font-extrabold text-emerald-950 font-mono">{doctorAppointments.length}</span>
            </div>
            <div className="p-2 bg-white rounded-xl border border-slate-200">
              <span className="text-[10px] text-slate-500 font-bold block uppercase">In-Clinic Visits</span>
              <span className="text-base font-bold text-slate-900 font-mono">{clinicVisitsCount}</span>
            </div>
            <div className="p-2 bg-white rounded-xl border border-slate-200">
              <span className="text-[10px] text-slate-500 font-bold block uppercase">Video Calls</span>
              <span className="text-base font-bold text-slate-900 font-mono">{videoCallsCount}</span>
            </div>
            <div className="p-2 bg-amber-50/80 rounded-xl border border-amber-200">
              <span className="text-[10px] text-amber-800 font-bold block uppercase">Est. Clinic Fees</span>
              <span className="text-base font-extrabold text-amber-950 font-mono">₹{totalVisitingFees}</span>
            </div>
          </div>

          {/* Automated Dispatch Actions */}
          <div className="flex items-center space-x-2 pt-1">
            <button
              id="send-roster-whatsapp-btn"
              onClick={handleSendWhatsApp}
              className="flex-1 py-2.5 px-3 bg-[#25D366] hover:bg-[#20ba59] text-white rounded-xl text-xs font-bold flex items-center justify-center space-x-1.5 shadow-xs transition-colors"
            >
              <MessageCircle className="w-4 h-4 fill-white" />
              <span>Send Full Day via WhatsApp</span>
            </button>

            <button
              id="send-roster-email-btn"
              onClick={handleSendEmail}
              className="flex-1 py-2.5 px-3 bg-emerald-800 hover:bg-emerald-900 text-white rounded-xl text-xs font-bold flex items-center justify-center space-x-1.5 shadow-xs transition-colors"
            >
              <Mail className="w-4 h-4" />
              <span>Send Full Day via Email</span>
            </button>

            <button
              id="copy-roster-btn"
              onClick={handleCopyManifest}
              className="py-2.5 px-3 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-bold flex items-center space-x-1 transition-colors"
              title="Copy Roster Text"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
              <span className="hidden sm:inline">{copied ? 'Copied' : 'Copy'}</span>
            </button>

            <button
              id="print-roster-btn"
              onClick={handlePrint}
              className="py-2.5 px-3 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-bold flex items-center space-x-1 transition-colors"
              title="Print Manifest Sheet"
            >
              <Printer className="w-4 h-4" />
              <span className="hidden sm:inline">Print</span>
            </button>
          </div>
        </div>

        {/* Patient Queue Manifest List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-600 flex items-center space-x-1.5">
              <span>Patient Queue in Serial Order</span>
              <span className="text-[10px] bg-slate-200 text-slate-700 px-2 py-0.5 rounded-full font-mono font-bold">
                {filteredAppointments.length} Total
              </span>
            </h4>

            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search patient, phone, token..."
              className="px-2.5 py-1 bg-slate-100 border border-slate-200 rounded-lg text-xs w-48 focus:bg-white focus:ring-2 focus:ring-emerald-600"
            />
          </div>

          {filteredAppointments.length === 0 ? (
            <div className="p-8 text-center bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
              <Calendar className="w-8 h-8 text-slate-400 mx-auto" />
              <p className="text-xs font-bold text-slate-700">No Patient Bookings for {currentDate}</p>
              <p className="text-[11px] text-slate-500 max-w-sm mx-auto">
                Appointments booked by patients for {currentDoctor?.name} on this date will automatically appear here maintaining serial numbers and get dispatched to WhatsApp & Email.
              </p>
            </div>
          ) : (
            filteredAppointments.map((apt, idx) => {
              const serial = apt.serialNumber || idx + 1;
              return (
                <div
                  key={apt.id}
                  id={`roster-patient-card-${apt.id}`}
                  className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-xs space-y-2.5 hover:border-slate-300 transition-all"
                >
                  {/* Top Bar: Serial Number & Token */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <span className="px-2.5 py-1 bg-emerald-800 text-white rounded-lg text-xs font-extrabold font-mono shadow-2xs">
                        SL #{serial}
                      </span>
                      <span className="px-2 py-0.5 bg-emerald-50 text-emerald-900 border border-emerald-200 rounded-md text-[11px] font-bold font-mono">
                        Token: {apt.tokenNumber || `#TK-${serial}`}
                      </span>
                    </div>

                    <div className="flex items-center space-x-2">
                      <span
                        className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${
                          apt.type === 'VIDEO'
                            ? 'bg-sky-100 text-sky-800 border border-sky-200'
                            : 'bg-emerald-100 text-emerald-900 border border-emerald-200'
                        }`}
                      >
                        {apt.type === 'VIDEO' ? '📹 Video Call' : '🏥 In-Clinic Visit'}
                      </span>
                      <span className="text-[10px] text-slate-400 font-mono">#{apt.id}</span>
                    </div>
                  </div>

                  {/* Patient Info Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 bg-slate-50/70 p-2.5 rounded-xl text-xs border border-slate-100">
                    <div>
                      <span className="text-[10px] text-slate-400 font-bold block uppercase">Patient Details</span>
                      <div className="font-bold text-slate-900 mt-0.5">{apt.patientName}</div>
                      <div className="text-[11px] text-slate-500">
                        {apt.patientAge} Years • {apt.patientGender} ({apt.relationshipToUser})
                      </div>
                    </div>

                    <div>
                      <span className="text-[10px] text-slate-400 font-bold block uppercase">Contact & WhatsApp</span>
                      <div className="font-bold text-slate-900 mt-0.5 flex items-center space-x-1.5">
                        <span>{apt.patientPhone}</span>
                      </div>
                      <div className="flex items-center space-x-2 mt-1">
                        <a
                          href={`tel:${apt.patientPhone}`}
                          className="text-[10px] font-bold text-emerald-800 hover:underline flex items-center space-x-0.5"
                        >
                          <Phone className="w-2.5 h-2.5" />
                          <span>Call</span>
                        </a>
                        <span>•</span>
                        <a
                          href={`https://wa.me/${apt.patientPhone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
                            `Hello ${apt.patientName}, this is from ${currentDoctor.hospital} regarding your appointment with ${currentDoctor.name} (Serial #${serial}, Slot: ${apt.timeSlot}).`
                          )}`}
                          target="_blank"
                          rel="noreferrer"
                          className="text-[10px] font-bold text-[#25D366] hover:underline flex items-center space-x-0.5"
                        >
                          <MessageCircle className="w-2.5 h-2.5" />
                          <span>WhatsApp</span>
                        </a>
                      </div>
                    </div>

                    <div>
                      <span className="text-[10px] text-slate-400 font-bold block uppercase">Residential Address</span>
                      <div className="text-slate-800 text-xs mt-0.5 flex items-start space-x-1">
                        <MapPin className="w-3 h-3 text-slate-400 shrink-0 mt-0.5" />
                        <span className="truncate">{apt.patientAddress || 'Not specified (Optional)'}</span>
                      </div>
                    </div>
                  </div>

                  {/* Slot and Fee */}
                  <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-100 text-slate-600">
                    <div className="flex items-center space-x-1.5">
                      <Clock className="w-3.5 h-3.5 text-emerald-700" />
                      <span className="font-bold text-slate-800">{apt.timeSlot}</span>
                      {apt.symptoms && (
                        <span className="text-slate-500 truncate max-w-xs">• {apt.symptoms}</span>
                      )}
                    </div>

                    <div className="text-right">
                      <span className="text-[11px] text-slate-500">Visiting Fee: </span>
                      <strong className="text-emerald-950 font-bold">
                        ₹{apt.doctorFeePayableAtClinic || apt.fee}
                      </strong>{' '}
                      <span className="text-[10px] text-slate-500 font-normal">
                        ({apt.type === 'VIDEO' ? 'Paid Online' : 'Pay at Clinic'})
                      </span>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="p-3 bg-slate-100 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500 shrink-0">
          <div className="flex items-center space-x-1.5">
            <Sparkles className="w-4 h-4 text-emerald-700" />
            <span>Automatic manifest synchronizer active</span>
          </div>
          <button
            onClick={() => setShowReceptionistRosterModal(false)}
            className="py-1.5 px-4 bg-slate-800 hover:bg-slate-900 text-white rounded-xl font-bold text-xs"
          >
            Close Roster
          </button>
        </div>
      </div>
    </div>
  );
};
