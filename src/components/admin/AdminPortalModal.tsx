import React, { useState } from 'react';
import {
  Shield,
  ShieldCheck,
  X,
  CheckCircle2,
  AlertCircle,
  Stethoscope,
  Users,
  Calendar,
  IndianRupee,
  Plus,
  Trash2,
  Edit2,
  Check,
  Clock,
  Building2,
  Store,
  MapPin,
  Lock,
  LogOut,
  Fingerprint,
  FileText,
  Search,
  ChevronRight,
  Eye,
  Video,
  VideoOff,
  Sparkles,
  QrCode,
  Sliders,
  FileSpreadsheet,
  MessageCircle,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Doctor, DoctorOnboardingRequest, SpecialtyType, DaySchedule } from '../../types';
import { SPECIALTIES, INDIAN_CITIES } from '../../data/mockData';

export const AdminPortalModal: React.FC = () => {
  const {
    showAdminPortal,
    setShowAdminPortal,
    isOwnerAuthenticated,
    loginOwner,
    logoutOwner,
    onboardingRequests,
    approveDoctorOnboardingRequest,
    rejectDoctorOnboardingRequest,
    doctors,
    updateDoctorAvailability,
    updateDoctorFees,
    deleteDoctor,
    addDoctorDirectly,
    openDoctorRosterModal,
    appointments,
    platformFeeSettings,
    updatePlatformFeeSettings,
    toggleDoctorVideoAllowed,
    updateDoctorSchedule,
    showToast,
  } = useApp();

  const [passcode, setPasscode] = useState('');
  const [authError, setAuthError] = useState('');
  const [activeAdminTab, setActiveAdminTab] = useState<'REQUESTS' | 'DOCTORS' | 'FEES' | 'APPOINTMENTS' | 'ADD_DIRECT'>('REQUESTS');
  const [requestFilter, setRequestFilter] = useState<'ALL' | 'PENDING' | 'APPROVED' | 'REJECTED'>('PENDING');
  const [doctorSearch, setDoctorSearch] = useState('');
  const [rejectionModalRequest, setRejectionModalRequest] = useState<DoctorOnboardingRequest | null>(null);
  const [rejectionReason, setRejectionReason] = useState('Qualifications or registration number could not be verified.');

  // Quick Fee Edit state
  const [editingDoctorId, setEditingDoctorId] = useState<string | null>(null);
  const [editFeeVideo, setEditFeeVideo] = useState<number>(399);
  const [editFeeClinic, setEditFeeClinic] = useState<number>(500);

  // Doctor Schedule editing modal state
  const [scheduleDoctor, setScheduleDoctor] = useState<Doctor | null>(null);
  const [editableSchedule, setEditableSchedule] = useState<DaySchedule[]>([]);

  // Platform Fee Settings State
  const [feeEnabled, setFeeEnabled] = useState(platformFeeSettings?.isEnabled ?? false);
  const [feeAmount, setFeeAmount] = useState(platformFeeSettings?.feeAmount ?? 10);
  const [feeUpiId, setFeeUpiId] = useState(platformFeeSettings?.upiId ?? 'owner.medpulse@okhdfcbank');
  const [feePromoName, setFeePromoName] = useState(platformFeeSettings?.promoNote ?? 'Free Launch Promotion (₹0 Fee)');

  // Direct Add Doctor Form State
  const [directName, setDirectName] = useState('');
  const [directSpecialty, setDirectSpecialty] = useState<SpecialtyType>('General Physician');
  const [directQual, setDirectQual] = useState('MBBS, MD');
  const [directExp, setDirectExp] = useState(8);
  const [directHospital, setDirectHospital] = useState('ILS Hospital Agartala');
  const [directAddress, setDirectAddress] = useState('Capital Complex, Agartala');
  const [directCity, setDirectCity] = useState('Agartala');
  const [directReg, setDirectReg] = useState('MCI-TR-99881');
  const [directFeeVideo, setDirectFeeVideo] = useState(399);
  const [directFeeClinic, setDirectFeeClinic] = useState(500);
  const [directVideoAllowed, setDirectVideoAllowed] = useState(true);
  const [directImage, setDirectImage] = useState(
    'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=600'
  );

  if (!showAdminPortal) return null;

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (loginOwner(passcode)) {
      setAuthError('');
      setPasscode('');
      showToast('Owner Master Access Granted');
    } else {
      setAuthError('Incorrect Passcode. Try default owner PIN: 8899');
    }
  };

  const handleQuickBiometricOwner = () => {
    loginOwner('8899');
    showToast('Authenticated as App Owner via Biometrics');
  };

  const filteredRequests = onboardingRequests.filter((r) => {
    if (requestFilter === 'ALL') return true;
    return r.status === requestFilter;
  });

  const filteredDoctors = doctors.filter((d) => {
    const q = doctorSearch.toLowerCase();
    return (
      d.name.toLowerCase().includes(q) ||
      d.specialty.toLowerCase().includes(q) ||
      d.hospital.toLowerCase().includes(q)
    );
  });

  const handleSaveFees = (doctorId: string) => {
    updateDoctorFees(doctorId, editFeeVideo, editFeeClinic);
    setEditingDoctorId(null);
    showToast('Doctor consultation fees updated');
  };

  const handleSavePlatformFeeSettings = (e: React.FormEvent) => {
    e.preventDefault();
    updatePlatformFeeSettings({
      isEnabled: feeEnabled,
      feeAmount: Number(feeAmount) || 0,
      upiId: feeUpiId,
      promoNote: feePromoName,
    });
    showToast(
      feeEnabled
        ? `Platform Fee set to ₹${feeAmount}/booking`
        : 'Free Promotion Enabled (₹0 Convenience Fee)'
    );
  };

  const handleOpenScheduleEditor = (doc: Doctor) => {
    setScheduleDoctor(doc);
    setEditableSchedule(
      doc.weeklySchedule || [
        { day: 'Monday', isAvailable: true, timeRange: '09:00 AM - 01:00 PM', morningSlots: ['09:30 AM', '10:00 AM', '11:00 AM'], afternoonSlots: ['12:30 PM'], eveningSlots: ['05:00 PM', '06:00 PM'] },
        { day: 'Tuesday', isAvailable: true, timeRange: '09:00 AM - 01:00 PM', morningSlots: ['09:30 AM', '10:00 AM', '11:00 AM'], afternoonSlots: ['12:30 PM'], eveningSlots: ['05:00 PM', '06:00 PM'] },
        { day: 'Wednesday', isAvailable: true, timeRange: '09:00 AM - 01:00 PM', morningSlots: ['09:30 AM', '10:00 AM', '11:00 AM'], afternoonSlots: ['12:30 PM'], eveningSlots: ['05:00 PM', '06:00 PM'] },
        { day: 'Thursday', isAvailable: true, timeRange: '09:00 AM - 01:00 PM', morningSlots: ['09:30 AM', '10:00 AM', '11:00 AM'], afternoonSlots: ['12:30 PM'], eveningSlots: ['05:00 PM', '06:00 PM'] },
        { day: 'Friday', isAvailable: true, timeRange: '09:00 AM - 01:00 PM', morningSlots: ['09:30 AM', '10:00 AM', '11:00 AM'], afternoonSlots: ['12:30 PM'], eveningSlots: ['05:00 PM', '06:00 PM'] },
        { day: 'Saturday', isAvailable: true, timeRange: '10:00 AM - 02:00 PM', morningSlots: ['10:00 AM', '11:00 AM', '11:30 AM'], afternoonSlots: ['01:00 PM'], eveningSlots: [] },
        { day: 'Sunday', isAvailable: false, timeRange: 'Closed', morningSlots: [], afternoonSlots: [], eveningSlots: [] },
      ]
    );
  };

  const handleSaveSchedule = () => {
    if (!scheduleDoctor) return;
    updateDoctorSchedule(scheduleDoctor.id, editableSchedule);
    setScheduleDoctor(null);
    showToast(`Weekly schedule updated for ${scheduleDoctor.name}`);
  };

  const handleDirectAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!directName.trim()) return;

    addDoctorDirectly({
      name: directName.startsWith('Dr.') ? directName : `Dr. ${directName}`,
      specialty: directSpecialty,
      qualifications: directQual,
      experienceYears: Number(directExp) || 5,
      hospital: directHospital,
      hospitalAddress: directAddress,
      city: directCity,
      location: `${directCity}, Tripura`,
      languages: ['English', 'Bengali', 'Hindi'],
      feeVideo: Number(directFeeVideo) || 350,
      feeInClinic: Number(directFeeClinic) || 450,
      nextSlotVideo: 'Today, 05:00 PM',
      nextSlotClinic: 'Tomorrow, 10:30 AM',
      image: directImage,
      verified: true,
      isAvailableNow: true,
      availableForVideo: directVideoAllowed,
      gender: 'Male',
      about: 'Experienced specialist delivering high-quality healthcare and compassionate patient treatment.',
      education: [directQual],
      specializations: [directSpecialty, 'Preventive Health', 'Clinical Consultation'],
      registrationNumber: directReg,
    });

    setDirectName('');
    setActiveAdminTab('DOCTORS');
    showToast('Doctor published directly to live directory');
  };

  const pendingCount = onboardingRequests.filter((r) => r.status === 'PENDING').length;
  const totalRevenue = appointments.reduce((sum, a) => sum + (a.totalPaid || a.fee), 0);

  return (
    <div
      id="admin-portal-modal"
      className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 animate-in fade-in duration-200"
    >
      <div className="w-full max-w-2xl bg-slate-900 text-slate-100 rounded-3xl shadow-2xl max-h-[94vh] flex flex-col overflow-hidden border border-slate-700 animate-in zoom-in-95 duration-200">
        {/* Top Header */}
        <div className="bg-slate-950 px-5 py-4 border-b border-slate-800 flex items-center justify-between shrink-0">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/40">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-base font-bold text-white font-heading">Owner Admin Portal</h2>
                <span className="text-[10px] font-bold uppercase tracking-wider bg-rose-950 text-rose-300 border border-rose-800/80 px-2 py-0.5 rounded-md">
                  Owner Controls
                </span>
              </div>
              <p className="text-xs text-slate-400">Doctor Network Operations, Weekly Schedules & Platform Fee Settings</p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            {isOwnerAuthenticated && (
              <button
                id="owner-logout-btn"
                onClick={logoutOwner}
                className="p-2 text-slate-400 hover:text-rose-400 hover:bg-slate-800 rounded-xl text-xs flex items-center space-x-1"
                title="Lock / Logout Owner Portal"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline">Lock</span>
              </button>
            )}
            <button
              id="close-admin-modal-btn"
              onClick={() => setShowAdminPortal(false)}
              className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* AUTHENTICATION GATE */}
        {!isOwnerAuthenticated ? (
          <div className="p-8 flex flex-col items-center justify-center space-y-5 my-auto text-center">
            <div className="w-16 h-16 rounded-3xl bg-slate-800 border border-slate-700 flex items-center justify-center text-emerald-400 shadow-inner">
              <Lock className="w-8 h-8" />
            </div>

            <div className="space-y-1">
              <h3 className="text-lg font-bold text-white font-heading">Owner Authorization Required</h3>
              <p className="text-xs text-slate-400 max-w-sm">
                Enter your secure Owner Passcode to manage doctors, weekly schedules, and configure platform booking fees.
              </p>
            </div>

            <form onSubmit={handleLoginSubmit} className="w-full max-w-xs space-y-3">
              <div>
                <input
                  id="admin-passcode-input"
                  type="password"
                  value={passcode}
                  onChange={(e) => setPasscode(e.target.value)}
                  placeholder="Enter Master PIN (Default: 8899)"
                  className="w-full text-center tracking-widest text-lg font-mono p-3 bg-slate-800 border border-slate-700 rounded-2xl text-white focus:ring-2 focus:ring-emerald-500 focus:outline-none placeholder:text-slate-500"
                />
              </div>

              {authError && (
                <div className="text-xs text-rose-400 bg-rose-950/60 p-2.5 rounded-xl border border-rose-800 flex items-center justify-center space-x-1.5">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{authError}</span>
                </div>
              )}

              <button
                id="owner-unlock-submit-btn"
                type="submit"
                className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-2xl font-bold text-sm shadow-lg shadow-emerald-950 transition-colors"
              >
                Authenticate as Owner
              </button>

              <button
                type="button"
                onClick={handleQuickBiometricOwner}
                className="w-full py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-2xl text-xs font-semibold flex items-center justify-center space-x-2 border border-slate-700 transition-colors"
              >
                <Fingerprint className="w-4 h-4 text-emerald-400" />
                <span>Quick Biometric Owner Unlock</span>
              </button>
            </form>
          </div>
        ) : (
          /* AUTHENTICATED ADMIN DASHBOARD */
          <div className="flex-1 flex flex-col overflow-hidden">
            {/* Analytics Metric Bar */}
            <div className="p-4 bg-slate-950/60 border-b border-slate-800 grid grid-cols-4 gap-2 text-xs">
              <div className="p-2.5 bg-slate-800/80 rounded-2xl border border-slate-700/80 flex flex-col">
                <span className="text-[10px] text-slate-400 uppercase font-bold">Active Doctors</span>
                <span className="text-lg font-bold text-emerald-400 mt-0.5">{doctors.length}</span>
              </div>
              <div className="p-2.5 bg-slate-800/80 rounded-2xl border border-slate-700/80 flex flex-col">
                <span className="text-[10px] text-slate-400 uppercase font-bold">Pending Requests</span>
                <span className="text-lg font-bold text-amber-400 mt-0.5">{pendingCount}</span>
              </div>
              <div className="p-2.5 bg-slate-800/80 rounded-2xl border border-slate-700/80 flex flex-col">
                <span className="text-[10px] text-slate-400 uppercase font-bold">Platform Fee</span>
                <span className="text-sm font-bold text-emerald-400 mt-1">
                  {platformFeeSettings.isEnabled ? `₹${platformFeeSettings.feeAmount}/bk` : 'Free (₹0)'}
                </span>
              </div>
              <div className="p-2.5 bg-slate-800/80 rounded-2xl border border-slate-700/80 flex flex-col">
                <span className="text-[10px] text-slate-400 uppercase font-bold">Bookings</span>
                <span className="text-lg font-bold text-white mt-0.5">{appointments.length}</span>
              </div>
            </div>

            {/* Admin Tabs */}
            <div className="px-4 pt-3 flex items-center justify-between border-b border-slate-800 overflow-x-auto no-scrollbar">
              <div className="flex space-x-1 shrink-0">
                <button
                  id="admin-tab-requests"
                  onClick={() => setActiveAdminTab('REQUESTS')}
                  className={`pb-2.5 px-3 text-xs font-bold border-b-2 flex items-center space-x-1.5 transition-all ${
                    activeAdminTab === 'REQUESTS'
                      ? 'border-emerald-500 text-emerald-400'
                      : 'border-transparent text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <Store className="w-3.5 h-3.5" />
                  <span>Partner Requests</span>
                  {pendingCount > 0 && (
                    <span className="bg-amber-500 text-slate-950 text-[10px] font-extrabold px-1.5 py-0.2 rounded-full">
                      {pendingCount}
                    </span>
                  )}
                </button>

                <button
                  id="admin-tab-doctors"
                  onClick={() => setActiveAdminTab('DOCTORS')}
                  className={`pb-2.5 px-3 text-xs font-bold border-b-2 flex items-center space-x-1.5 transition-all ${
                    activeAdminTab === 'DOCTORS'
                      ? 'border-emerald-500 text-emerald-400'
                      : 'border-transparent text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <Stethoscope className="w-3.5 h-3.5" />
                  <span>Doctors & Schedules ({doctors.length})</span>
                </button>

                <button
                  id="admin-tab-fees"
                  onClick={() => setActiveAdminTab('FEES')}
                  className={`pb-2.5 px-3 text-xs font-bold border-b-2 flex items-center space-x-1.5 transition-all ${
                    activeAdminTab === 'FEES'
                      ? 'border-emerald-500 text-emerald-400'
                      : 'border-transparent text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <IndianRupee className="w-3.5 h-3.5" />
                  <span>Platform Fee & UPI</span>
                </button>

                <button
                  id="admin-tab-appointments"
                  onClick={() => setActiveAdminTab('APPOINTMENTS')}
                  className={`pb-2.5 px-3 text-xs font-bold border-b-2 flex items-center space-x-1.5 transition-all ${
                    activeAdminTab === 'APPOINTMENTS'
                      ? 'border-emerald-500 text-emerald-400'
                      : 'border-transparent text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <Calendar className="w-3.5 h-3.5" />
                  <span>Bookings ({appointments.length})</span>
                </button>
              </div>

              <button
                id="admin-add-doctor-direct-btn"
                onClick={() => setActiveAdminTab('ADD_DIRECT')}
                className={`py-1.5 px-3 rounded-xl text-xs font-bold flex items-center space-x-1 transition-all shrink-0 ml-2 ${
                  activeAdminTab === 'ADD_DIRECT'
                    ? 'bg-emerald-600 text-white'
                    : 'bg-slate-800 text-emerald-400 hover:bg-slate-700'
                }`}
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Doctor</span>
              </button>
            </div>

            {/* TAB 1: PARTNER ONBOARDING REQUESTS */}
            {activeAdminTab === 'REQUESTS' && (
              <div className="flex-1 overflow-y-auto p-4 space-y-3 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] text-slate-400 font-semibold uppercase tracking-wider">
                    Doctor & Pharmacy Submissions
                  </span>
                  <div className="flex space-x-1 bg-slate-800 p-0.5 rounded-xl">
                    {(['PENDING', 'APPROVED', 'REJECTED', 'ALL'] as const).map((filter) => (
                      <button
                        key={filter}
                        onClick={() => setRequestFilter(filter)}
                        className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition-all ${
                          requestFilter === filter
                            ? 'bg-emerald-600 text-white'
                            : 'text-slate-400 hover:text-slate-200'
                        }`}
                      >
                        {filter}
                      </button>
                    ))}
                  </div>
                </div>

                {filteredRequests.length === 0 ? (
                  <div className="p-8 text-center bg-slate-800/40 rounded-2xl border border-slate-800 text-slate-400">
                    No requests found matching "{requestFilter}".
                  </div>
                ) : (
                  filteredRequests.map((req) => (
                    <div
                      key={req.id}
                      className="p-4 bg-slate-800/90 rounded-2xl border border-slate-700/90 space-y-3"
                    >
                      {/* Submitter & Type Header */}
                      <div className="flex items-start justify-between">
                        <div className="flex items-center space-x-2">
                          <span
                            className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider ${
                              req.applicantType === 'PHARMACY'
                                ? 'bg-amber-950 text-amber-300 border border-amber-800'
                                : req.applicantType === 'DOCTOR'
                                ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                                : 'bg-sky-950 text-sky-300 border border-sky-800'
                            }`}
                          >
                            {req.applicantType} Partner
                          </span>
                          <span className="text-[11px] text-slate-400 font-mono">#{req.id}</span>
                          <span className="text-[11px] text-slate-500">• {req.submittedDate}</span>
                        </div>

                        <span
                          className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                            req.status === 'APPROVED'
                              ? 'bg-emerald-900/80 text-emerald-200 border border-emerald-700'
                              : req.status === 'PENDING'
                              ? 'bg-amber-900/80 text-amber-200 border border-amber-700'
                              : 'bg-rose-900/80 text-rose-200 border border-rose-700'
                          }`}
                        >
                          {req.status}
                        </span>
                      </div>

                      {/* Doctor Profile Details */}
                      <div className="flex items-start space-x-3 bg-slate-900/70 p-3 rounded-xl border border-slate-800">
                        <img
                          src={req.image}
                          alt={req.doctorName}
                          className="w-14 h-14 rounded-xl object-cover ring-1 ring-slate-700"
                          referrerPolicy="no-referrer"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center space-x-1.5">
                            <h4 className="text-sm font-bold text-white font-heading">{req.doctorName}</h4>
                            <span className="text-[10px] bg-emerald-950 text-emerald-400 px-1.5 py-0.2 rounded font-bold">
                              {req.specialty}
                            </span>
                          </div>
                          <div className="text-[11px] text-slate-300 mt-0.5">
                            {req.qualifications} • {req.experienceYears} yrs exp
                          </div>
                          <div className="text-[10px] font-mono text-emerald-400 mt-0.5">
                            MCI Registration: {req.registrationNumber}
                          </div>
                          <div className="text-[11px] text-slate-400 mt-1 flex items-center space-x-1">
                            <Building2 className="w-3 h-3 text-slate-500 shrink-0" />
                            <span>{req.hospitalOrClinic} ({req.city})</span>
                          </div>
                        </div>
                      </div>

                      {/* Timings and Fees Matrix */}
                      <div className="grid grid-cols-2 gap-2 text-[11px] bg-slate-900/40 p-2.5 rounded-xl border border-slate-800/80">
                        <div>
                          <span className="text-slate-500 block">Proposed Fees:</span>
                          <span className="font-bold text-white">
                            Video: ₹{req.feeVideo} • Clinic: ₹{req.feeInClinic}
                          </span>
                        </div>
                        <div>
                          <span className="text-slate-500 block">Slot Hours:</span>
                          <span className="font-medium text-slate-300">
                            {req.morningTimings} / {req.eveningTimings}
                          </span>
                        </div>
                        <div className="col-span-2 text-slate-400 text-[10px] pt-1 border-t border-slate-800">
                          <span className="text-slate-500">Submitted by:</span>{' '}
                          <strong className="text-slate-300">{req.applicantName}</strong> (
                          {req.organizationName}) • {req.contactPhone} • {req.contactEmail}
                        </div>
                      </div>

                      {/* Actions */}
                      {req.status === 'PENDING' && (
                        <div className="flex items-center space-x-2 pt-1">
                          <button
                            id={`approve-req-${req.id}`}
                            onClick={() => {
                              approveDoctorOnboardingRequest(req.id);
                              showToast(`Approved! ${req.doctorName} is now published live`);
                            }}
                            className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold flex items-center justify-center space-x-1.5 shadow-md shadow-emerald-950 transition-colors"
                          >
                            <CheckCircle2 className="w-4 h-4" />
                            <span>Approve & Publish to Directory</span>
                          </button>

                          <button
                            id={`reject-req-${req.id}`}
                            onClick={() => setRejectionModalRequest(req)}
                            className="py-2.5 px-3 bg-rose-950/80 hover:bg-rose-900 text-rose-300 border border-rose-800 rounded-xl font-bold transition-colors"
                          >
                            Reject
                          </button>
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
            )}

            {/* TAB 2: LIVE DOCTOR DIRECTORY & SCHEDULE MANAGEMENT */}
            {activeAdminTab === 'DOCTORS' && (
              <div className="flex-1 overflow-y-auto p-4 space-y-3 text-xs">
                {/* Search Bar */}
                <div className="relative">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                  <input
                    type="text"
                    value={doctorSearch}
                    onChange={(e) => setDoctorSearch(e.target.value)}
                    placeholder="Filter doctors by name, specialty, hospital..."
                    className="w-full pl-9 pr-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white placeholder:text-slate-500 focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div className="space-y-2.5">
                  {filteredDoctors.map((doc) => (
                    <div
                      key={doc.id}
                      className="p-3.5 bg-slate-800/90 rounded-2xl border border-slate-700/80 space-y-2.5"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-center space-x-3">
                          <img
                            src={doc.image}
                            alt={doc.name}
                            className="w-12 h-12 rounded-xl object-cover ring-1 ring-slate-700"
                            referrerPolicy="no-referrer"
                          />
                          <div>
                            <div className="flex items-center space-x-1.5">
                              <h4 className="font-bold text-white">{doc.name}</h4>
                              <span className="text-[10px] bg-slate-900 text-emerald-400 px-1.5 py-0.2 rounded font-bold">
                                {doc.specialty}
                              </span>
                            </div>
                            <div className="text-[11px] text-slate-400">{doc.hospital}</div>
                            <div className="text-[10px] text-slate-500 font-mono">
                              Reg: {doc.registrationNumber || 'MCI-TR-Verified'}
                            </div>
                          </div>
                        </div>

                        {/* Video Consult Toggle & Online Toggle */}
                        <div className="flex items-center space-x-1.5">
                          {/* Video Consult Status */}
                          <button
                            onClick={() => {
                              toggleDoctorVideoAllowed(doc.id);
                              showToast(
                                `${doc.name} video consult: ${doc.availableForVideo !== false ? 'Disabled' : 'Enabled'}`
                              );
                            }}
                            className={`px-2 py-1 rounded-xl text-[10px] font-bold border transition-all flex items-center space-x-1 ${
                              doc.availableForVideo !== false
                                ? 'bg-emerald-950 text-emerald-300 border-emerald-700'
                                : 'bg-slate-900 text-slate-500 border-slate-800'
                            }`}
                            title="Toggle Video Consult Capability"
                          >
                            {doc.availableForVideo !== false ? (
                              <>
                                <Video className="w-3 h-3 text-emerald-400" />
                                <span>Video On</span>
                              </>
                            ) : (
                              <>
                                <VideoOff className="w-3 h-3 text-slate-500" />
                                <span>Clinic Only</span>
                              </>
                            )}
                          </button>

                          {/* Availability Toggle */}
                          <button
                            onClick={() => {
                              updateDoctorAvailability(doc.id, !doc.isAvailableNow);
                              showToast(
                                `${doc.name} marked ${!doc.isAvailableNow ? 'Available Now' : 'Offline'}`
                              );
                            }}
                            className={`px-2 py-1 rounded-xl text-[10px] font-bold border transition-all ${
                              doc.isAvailableNow
                                ? 'bg-emerald-950 text-emerald-300 border-emerald-700'
                                : 'bg-slate-900 text-slate-500 border-slate-800'
                            }`}
                          >
                            {doc.isAvailableNow ? '● Online' : '○ Offline'}
                          </button>
                        </div>
                      </div>

                      {/* Schedule and Fees Control Bar */}
                      {editingDoctorId === doc.id ? (
                        <div className="p-2.5 bg-slate-900 rounded-xl border border-slate-700 flex items-center justify-between space-x-2">
                          <div className="flex items-center space-x-2">
                            <div>
                              <span className="text-[9px] text-slate-400 block">Video Fee (₹)</span>
                              <input
                                type="number"
                                value={editFeeVideo}
                                onChange={(e) => setEditFeeVideo(Number(e.target.value))}
                                className="w-20 p-1 bg-slate-800 border border-slate-600 rounded text-white text-xs font-bold"
                              />
                            </div>
                            <div>
                              <span className="text-[9px] text-slate-400 block">In-Clinic Fee (₹)</span>
                              <input
                                type="number"
                                value={editFeeClinic}
                                onChange={(e) => setEditFeeClinic(Number(e.target.value))}
                                className="w-20 p-1 bg-slate-800 border border-slate-600 rounded text-white text-xs font-bold"
                              />
                            </div>
                          </div>

                          <div className="flex items-center space-x-1 pt-3">
                            <button
                              onClick={() => handleSaveFees(doc.id)}
                              className="p-1.5 bg-emerald-600 text-white rounded-lg hover:bg-emerald-500"
                            >
                              <Check className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => setEditingDoctorId(null)}
                              className="p-1.5 bg-slate-800 text-slate-400 rounded-lg hover:bg-slate-700"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-center justify-between text-[11px] bg-slate-900/60 p-2 rounded-xl border border-slate-800">
                          <div className="text-slate-300">
                            Visiting Fee: <strong className="text-emerald-400">₹{doc.feeInClinic}</strong> (Clinic) •{' '}
                            <span className="text-slate-400">Video: ₹{doc.feeVideo}</span>
                          </div>
                          <div className="flex items-center space-x-1.5">
                            {/* Receptionist Desk & Daily Roster */}
                            <button
                              onClick={() => openDoctorRosterModal(doc)}
                              className="py-1 px-2 bg-emerald-950 hover:bg-emerald-900 text-emerald-300 rounded-lg text-[10px] font-bold flex items-center space-x-1 border border-emerald-700"
                              title="Manage receptionist contact and view/send whole day booking manifest"
                            >
                              <FileSpreadsheet className="w-3 h-3 text-emerald-400" />
                              <span>Reception Desk</span>
                            </button>

                            {/* Manage Schedule Button */}
                            <button
                              onClick={() => handleOpenScheduleEditor(doc)}
                              className="py-1 px-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-[10px] font-bold flex items-center space-x-1 border border-slate-700"
                            >
                              <Calendar className="w-3 h-3 text-emerald-400" />
                              <span>Hours</span>
                            </button>

                            <button
                              onClick={() => {
                                setEditingDoctorId(doc.id);
                                setEditFeeVideo(doc.feeVideo);
                                setEditFeeClinic(doc.feeInClinic);
                              }}
                              className="p-1 text-slate-400 hover:text-emerald-400"
                              title="Edit consultation fees"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => {
                                deleteDoctor(doc.id);
                                showToast(`Removed ${doc.name} from directory`);
                              }}
                              className="p-1 text-slate-400 hover:text-rose-400"
                              title="Delete doctor"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB 3: PLATFORM CONVENIENCE FEE & UPI SETTINGS */}
            {activeAdminTab === 'FEES' && (
              <form onSubmit={handleSavePlatformFeeSettings} className="flex-1 overflow-y-auto p-4 space-y-4 text-xs">
                <div className="bg-slate-800/80 p-4 rounded-2xl border border-slate-700 space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-bold text-white">Platform / Convenience Fee Settings</h3>
                      <p className="text-[11px] text-slate-400 mt-0.5">
                        Charge ₹10, ₹20 or zero rupees per booking to monetize the platform via UPI/QR.
                      </p>
                    </div>
                    <span
                      className={`px-2.5 py-1 rounded-full font-bold text-[10px] ${
                        feeEnabled
                          ? 'bg-emerald-950 text-emerald-300 border border-emerald-700'
                          : 'bg-amber-950 text-amber-300 border border-amber-700'
                      }`}
                    >
                      {feeEnabled ? `Active: ₹${feeAmount}` : 'Free Promotion (₹0)'}
                    </span>
                  </div>

                  {/* Mode Toggle Switch */}
                  <div className="grid grid-cols-2 gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setFeeEnabled(false)}
                      className={`p-3 rounded-xl border text-left transition-all ${
                        !feeEnabled
                          ? 'bg-emerald-950 border-emerald-600 text-emerald-200'
                          : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-300'
                      }`}
                    >
                      <span className="font-bold text-xs block">Free Promotion (₹0 Fee)</span>
                      <span className="text-[10px] opacity-80 mt-0.5 block">
                        Owner offers 100% free appointment bookings to grow users and promote the app.
                      </span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setFeeEnabled(true)}
                      className={`p-3 rounded-xl border text-left transition-all ${
                        feeEnabled
                          ? 'bg-emerald-950 border-emerald-600 text-emerald-200'
                          : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-300'
                      }`}
                    >
                      <span className="font-bold text-xs block">Enable Convenience Fee</span>
                      <span className="text-[10px] opacity-80 mt-0.5 block">
                        Collect nominal booking fee (e.g. ₹10 or ₹20) into your UPI account.
                      </span>
                    </button>
                  </div>

                  {/* Fee Amount & UPI Configuration */}
                  <div className="space-y-3 pt-2">
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-slate-300 font-semibold block mb-1">
                          Booking Convenience Fee (₹)
                        </label>
                        <input
                          type="number"
                          value={feeAmount}
                          onChange={(e) => setFeeAmount(Number(e.target.value))}
                          disabled={!feeEnabled}
                          min={0}
                          placeholder="e.g. 10 or 20"
                          className="w-full p-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white font-bold disabled:opacity-50"
                        />
                        <span className="text-[10px] text-slate-500 mt-1 block">
                          Suggested: ₹10 or ₹20 per booking
                        </span>
                      </div>

                      <div>
                        <label className="text-slate-300 font-semibold block mb-1">
                          Owner UPI ID for Payments
                        </label>
                        <input
                          type="text"
                          value={feeUpiId}
                          onChange={(e) => setFeeUpiId(e.target.value)}
                          placeholder="yourname@okhdfcbank"
                          className="w-full p-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white font-mono text-xs"
                        />
                        <span className="text-[10px] text-slate-500 mt-1 block">
                          Patients pay via UPI Apps or QR Code scan
                        </span>
                      </div>
                    </div>

                    <div>
                      <label className="text-slate-300 font-semibold block mb-1">
                        Promotion Banner / Badge Text
                      </label>
                      <input
                        type="text"
                        value={feePromoName}
                        onChange={(e) => setFeePromoName(e.target.value)}
                        placeholder="Free Launch Promotion (₹0 Fee)"
                        className="w-full p-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white"
                      />
                    </div>
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold shadow-md shadow-emerald-950 transition-colors"
                    >
                      Save Platform Fee Settings
                    </button>
                  </div>
                </div>

                {/* Info Note on Visiting Fees vs Platform Fees */}
                <div className="p-3.5 bg-slate-800/50 rounded-2xl border border-slate-700/60 text-slate-300 space-y-1.5">
                  <div className="font-bold text-white flex items-center space-x-1.5">
                    <Sparkles className="w-4 h-4 text-emerald-400" />
                    <span>How App Owner Pricing Works</span>
                  </div>
                  <p className="text-[11px] leading-relaxed text-slate-400">
                    • <strong>Doctor Visiting Fee:</strong> Shown only for the patient's reference. Patients pay this directly to the doctor or clinic when they arrive for the visit.
                  </p>
                  <p className="text-[11px] leading-relaxed text-slate-400">
                    • <strong>Platform Booking Fee:</strong> Collected by you (the app owner) through UPI Apps (GPay, PhonePe, Paytm, BHIM) or dynamic UPI QR Code. You can keep this at ₹0 (Free Promotion) to gain maximum word-of-mouth adoption, or enable ₹10 / ₹20 whenever you choose.
                  </p>
                </div>
              </form>
            )}

            {/* TAB 4: PLATFORM APPOINTMENTS MONITOR */}
            {activeAdminTab === 'APPOINTMENTS' && (
              <div className="flex-1 overflow-y-auto p-4 space-y-2.5 text-xs">
                <span className="text-[11px] text-slate-400 font-semibold uppercase tracking-wider">
                  Patient Bookings Across Doctors
                </span>

                {appointments.length === 0 ? (
                  <div className="p-8 text-center bg-slate-800/40 rounded-2xl border border-slate-800 text-slate-400">
                    No active appointments booked yet.
                  </div>
                ) : (
                  appointments.map((apt) => (
                    <div
                      key={apt.id}
                      className="p-3.5 bg-slate-800/90 rounded-2xl border border-slate-700/80 space-y-2"
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="flex items-center space-x-1.5">
                            <span className="font-bold text-white">{apt.patientName}</span>
                            <span className="text-[10px] text-slate-400">({apt.patientAge}y • {apt.patientGender})</span>
                          </div>
                          <div className="text-[11px] text-emerald-400 mt-0.5">
                            Doctor: {apt.doctorName} ({apt.doctorSpecialty})
                          </div>
                          <div className="text-[10px] text-slate-400 font-mono mt-0.5">
                            Txn: {apt.paymentId}
                          </div>
                        </div>

                        <div className="text-right">
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                              apt.status === 'UPCOMING'
                                ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                                : 'bg-slate-900 text-slate-400'
                            }`}
                          >
                            {apt.status}
                          </span>
                          <div className="text-xs font-bold text-white mt-1">
                            {apt.platformFee > 0 ? `Platform: ₹${apt.platformFee}` : 'Free Booking'}
                          </div>
                        </div>
                      </div>

                      <div className="text-[11px] text-slate-400 border-t border-slate-700/60 pt-1 flex justify-between">
                        <span>{apt.date} • {apt.timeSlot} ({apt.type})</span>
                        <span className="text-slate-500">{apt.doctorHospital}</span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}

            {/* TAB 5: DIRECT ADD DOCTOR */}
            {activeAdminTab === 'ADD_DIRECT' && (
              <form onSubmit={handleDirectAddSubmit} className="flex-1 overflow-y-auto p-4 space-y-3 text-xs">
                <div className="font-bold text-white text-sm">Directly Add Doctor to Directory</div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-slate-400 block mb-0.5">Doctor Name</label>
                    <input
                      type="text"
                      required
                      value={directName}
                      onChange={(e) => setDirectName(e.target.value)}
                      placeholder="Dr. Rajesh Debnath"
                      className="w-full p-2 bg-slate-800 border border-slate-700 rounded-xl text-white"
                    />
                  </div>
                  <div>
                    <label className="text-slate-400 block mb-0.5">Specialty (All Categories)</label>
                    <select
                      value={directSpecialty}
                      onChange={(e) => setDirectSpecialty(e.target.value as SpecialtyType)}
                      className="w-full p-2 bg-slate-800 border border-slate-700 rounded-xl text-white"
                    >
                      {SPECIALTIES.map((s) => (
                        <option key={s.id} value={s.id}>
                          {s.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2">
                  <div className="col-span-2">
                    <label className="text-slate-400 block mb-0.5">Qualifications (MBBS, MD, MS, etc.)</label>
                    <input
                      type="text"
                      value={directQual}
                      onChange={(e) => setDirectQual(e.target.value)}
                      placeholder="MBBS, MD, DNB"
                      className="w-full p-2 bg-slate-800 border border-slate-700 rounded-xl text-white"
                    />
                  </div>
                  <div>
                    <label className="text-slate-400 block mb-0.5">Exp (Yrs)</label>
                    <input
                      type="number"
                      value={directExp}
                      onChange={(e) => setDirectExp(Number(e.target.value))}
                      className="w-full p-2 bg-slate-800 border border-slate-700 rounded-xl text-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-slate-400 block mb-0.5">Hospital / Clinic</label>
                    <input
                      type="text"
                      value={directHospital}
                      onChange={(e) => setDirectHospital(e.target.value)}
                      className="w-full p-2 bg-slate-800 border border-slate-700 rounded-xl text-white"
                    />
                  </div>
                  <div>
                    <label className="text-slate-400 block mb-0.5">City</label>
                    <select
                      value={directCity}
                      onChange={(e) => setDirectCity(e.target.value)}
                      className="w-full p-2 bg-slate-800 border border-slate-700 rounded-xl text-white"
                    >
                      {INDIAN_CITIES.map((c) => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-slate-400 block mb-0.5">Doctor Visiting Fee (₹)</label>
                    <input
                      type="number"
                      value={directFeeClinic}
                      onChange={(e) => setDirectFeeClinic(Number(e.target.value))}
                      className="w-full p-2 bg-slate-800 border border-slate-700 rounded-xl text-white"
                    />
                  </div>
                  <div>
                    <label className="text-slate-400 block mb-0.5">Video Fee (₹)</label>
                    <input
                      type="number"
                      value={directFeeVideo}
                      onChange={(e) => setDirectFeeVideo(Number(e.target.value))}
                      className="w-full p-2 bg-slate-800 border border-slate-700 rounded-xl text-white"
                    />
                  </div>
                </div>

                {/* Video Consult Checkbox */}
                <div className="p-3 bg-slate-800 rounded-xl border border-slate-700 flex items-center justify-between">
                  <div>
                    <span className="font-bold text-white block">Available for Video Consultation?</span>
                    <span className="text-[10px] text-slate-400">Uncheck if doctor only does in-clinic physical visits</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={directVideoAllowed}
                    onChange={(e) => setDirectVideoAllowed(e.target.checked)}
                    className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500"
                  />
                </div>

                <div className="pt-2 flex items-center space-x-2">
                  <button
                    type="button"
                    onClick={() => setActiveAdminTab('DOCTORS')}
                    className="py-2.5 px-4 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl font-bold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold shadow-md shadow-emerald-950"
                  >
                    Publish Doctor Instantly
                  </button>
                </div>
              </form>
            )}
          </div>
        )}

        {/* REJECTION REASON MODAL DIALOG */}
        {rejectionModalRequest && (
          <div className="fixed inset-0 z-60 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="w-full max-w-sm bg-slate-900 rounded-2xl p-5 border border-slate-700 space-y-4 text-xs">
              <h4 className="font-bold text-white text-sm">
                Reject Listing Request for {rejectionModalRequest.doctorName}?
              </h4>
              <p className="text-slate-400">
                Please provide feedback for {rejectionModalRequest.applicantName} ({rejectionModalRequest.organizationName}):
              </p>

              <textarea
                rows={3}
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                className="w-full p-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white"
              />

              <div className="flex items-center space-x-2 pt-2">
                <button
                  onClick={() => setRejectionModalRequest(null)}
                  className="py-2 px-3 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    rejectDoctorOnboardingRequest(rejectionModalRequest.id, rejectionReason);
                    setRejectionModalRequest(null);
                    showToast(`Rejected request #${rejectionModalRequest.id}`);
                  }}
                  className="flex-1 py-2 bg-rose-600 hover:bg-rose-500 text-white rounded-xl font-bold"
                >
                  Confirm Rejection
                </button>
              </div>
            </div>
          </div>
        )}

        {/* WEEKLY SCHEDULE EDITOR MODAL */}
        {scheduleDoctor && (
          <div className="fixed inset-0 z-60 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="w-full max-w-md bg-slate-900 rounded-3xl p-5 border border-slate-700 space-y-4 text-xs max-h-[85vh] flex flex-col">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div>
                  <h4 className="font-bold text-white text-sm">Manage Weekly Schedule</h4>
                  <span className="text-[11px] text-emerald-400">{scheduleDoctor.name}</span>
                </div>
                <button
                  onClick={() => setScheduleDoctor(null)}
                  className="p-1 text-slate-400 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto space-y-2.5 pr-1">
                {editableSchedule.map((dayItem, dayIdx) => (
                  <div
                    key={dayItem.day}
                    className="p-3 bg-slate-800/90 rounded-2xl border border-slate-700/80 space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-white text-xs">{dayItem.day}</span>
                      <button
                        type="button"
                        onClick={() => {
                          const updated = [...editableSchedule];
                          updated[dayIdx] = {
                            ...updated[dayIdx],
                            isAvailable: !updated[dayIdx].isAvailable,
                            timeRange: !updated[dayIdx].isAvailable ? '09:00 AM - 01:00 PM' : 'Closed',
                          };
                          setEditableSchedule(updated);
                        }}
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold border transition-all ${
                          dayItem.isAvailable
                            ? 'bg-emerald-950 text-emerald-300 border-emerald-700'
                            : 'bg-rose-950 text-rose-300 border-rose-800'
                        }`}
                      >
                        {dayItem.isAvailable ? 'Active' : 'Off / Closed'}
                      </button>
                    </div>

                    {dayItem.isAvailable && (
                      <div className="space-y-1.5 pt-1">
                        <label className="text-[10px] text-slate-400 block">Clinic Hours</label>
                        <input
                          type="text"
                          value={dayItem.timeRange}
                          onChange={(e) => {
                            const updated = [...editableSchedule];
                            updated[dayIdx] = { ...updated[dayIdx], timeRange: e.target.value };
                            setEditableSchedule(updated);
                          }}
                          placeholder="e.g. 09:00 AM - 01:00 PM"
                          className="w-full p-1.5 bg-slate-900 border border-slate-700 rounded-lg text-white text-[11px]"
                        />
                      </div>
                    )}
                  </div>
                ))}
              </div>

              <div className="flex items-center space-x-2 pt-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setScheduleDoctor(null)}
                  className="py-2.5 px-4 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl font-bold"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSaveSchedule}
                  className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold"
                >
                  Save Weekly Schedule
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

