import React, { useState } from 'react';
import {
  X,
  Check,
  Calendar,
  Clock,
  User,
  ShieldCheck,
  Video,
  VideoOff,
  Building2,
  ChevronRight,
  ArrowLeft,
  CreditCard,
  QrCode,
  Smartphone,
  Landmark,
  Wallet,
  AlertCircle,
  FileCheck,
  Share2,
  Navigation,
  Download,
  Info,
  Sparkles,
  Ticket,
  MessageCircle,
  FileSpreadsheet,
  Mail,
  MapPin,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Appointment, ConsultationType, DaySchedule } from '../../types';
import {
  generateDoctorDailyRosterWhatsAppText,
  getWhatsAppRosterUrl,
} from '../../utils/receptionistNotifier';

export const BookingFlowModal: React.FC = () => {
  const {
    isBookingOpen,
    setIsBookingOpen,
    bookingDraft,
    setBookingDraft,
    familyMembers,
    userProfile,
    appointments,
    bookAppointment,
    setActiveTab,
    startInstantConsultation,
    openDoctorRosterModal,
    biometricSettings,
    openBiometricPrompt,
    platformFeeSettings,
    showToast,
  } = useApp();

  const [step, setStep] = useState<number>(1); // 1: Mode/Doctor, 2: Date & Time, 3: Patient, 4: Payment, 5: Confirmation
  const [selectedDayScheduleIndex, setSelectedDayScheduleIndex] = useState<number>(0);
  const [selectedDate, setSelectedDate] = useState('Today, 24 Aug');
  const [selectedTimeSlot, setSelectedTimeSlot] = useState('10:00 AM');
  const [patientMode, setPatientMode] = useState<'SELF' | 'FAMILY'>('SELF');
  const [selectedFamilyId, setSelectedFamilyId] = useState('fam-1');

  // Form Fields
  const [patientName, setPatientName] = useState(userProfile.name);
  const [patientAge, setPatientAge] = useState(32);
  const [patientGender, setPatientGender] = useState<'Male' | 'Female' | 'Other'>('Male');
  const [patientPhone, setPatientPhone] = useState(userProfile.phone);
  const [patientAddress, setPatientAddress] = useState('Capital Complex VIP Road, Sector 2, Agartala');
  const [symptomsReason, setSymptomsReason] = useState('');

  // Payment
  const [paymentMethod, setPaymentMethod] = useState<'UPI' | 'QR_CODE' | 'CARD' | 'NET_BANKING' | 'WALLET'>('UPI');
  const [upiApp, setUpiApp] = useState<'gpay' | 'phonepe' | 'paytm' | 'bhim'>('gpay');
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [confirmedAppointment, setConfirmedAppointment] = useState<Appointment | null>(null);

  if (!isBookingOpen || !bookingDraft.doctor) return null;

  const doctor = bookingDraft.doctor;
  const weeklySchedules: DaySchedule[] = doctor.weeklySchedule || [
    { day: 'Monday', isAvailable: true, timeRange: '09:00 AM - 01:00 PM', morningSlots: ['09:30 AM', '10:00 AM', '11:00 AM'], afternoonSlots: ['12:30 PM'], eveningSlots: ['05:00 PM', '06:00 PM'] },
    { day: 'Tuesday', isAvailable: true, timeRange: '09:00 AM - 01:00 PM', morningSlots: ['09:30 AM', '10:00 AM', '11:00 AM'], afternoonSlots: ['12:30 PM'], eveningSlots: ['05:00 PM', '06:00 PM'] },
    { day: 'Wednesday', isAvailable: true, timeRange: '09:00 AM - 01:00 PM', morningSlots: ['09:30 AM', '10:00 AM', '11:00 AM'], afternoonSlots: ['12:30 PM'], eveningSlots: ['05:00 PM', '06:00 PM'] },
    { day: 'Thursday', isAvailable: true, timeRange: '09:00 AM - 01:00 PM', morningSlots: ['09:30 AM', '10:00 AM', '11:00 AM'], afternoonSlots: ['12:30 PM'], eveningSlots: ['05:00 PM', '06:00 PM'] },
    { day: 'Friday', isAvailable: true, timeRange: '09:00 AM - 01:00 PM', morningSlots: ['09:30 AM', '10:00 AM', '11:00 AM'], afternoonSlots: ['12:30 PM'], eveningSlots: ['05:00 PM', '06:00 PM'] },
    { day: 'Saturday', isAvailable: true, timeRange: '10:00 AM - 02:00 PM', morningSlots: ['10:00 AM', '11:00 AM', '11:30 AM'], afternoonSlots: ['01:00 PM'], eveningSlots: [] },
    { day: 'Sunday', isAvailable: false, timeRange: 'Closed', morningSlots: [], afternoonSlots: [], eveningSlots: [] },
  ];

  const currentDaySchedule = weeklySchedules[selectedDayScheduleIndex] || weeklySchedules[0];

  // Convenience / Platform Fee amount payable online
  const onlinePlatformFee = platformFeeSettings.isEnabled ? platformFeeSettings.feeAmount : 0;
  const doctorVisitingFee = bookingDraft.type === 'VIDEO' ? doctor.feeVideo : doctor.feeInClinic;

  const handleTypeChange = (type: ConsultationType) => {
    if (type === 'VIDEO' && doctor.availableForVideo === false) {
      showToast(`${doctor.name} does not offer video consultations`);
      return;
    }
    const fee = type === 'VIDEO' ? doctor.feeVideo : doctor.feeInClinic;
    setBookingDraft((prev) => ({
      ...prev,
      type,
      fee,
      total: onlinePlatformFee,
    }));
  };

  const handleFamilySelect = (famId: string) => {
    setSelectedFamilyId(famId);
    const fam = familyMembers.find((f) => f.id === famId);
    if (fam) {
      setPatientName(fam.name);
      setPatientAge(fam.age);
      setPatientGender(fam.gender);
      setPatientPhone(fam.phone || userProfile.phone);
    }
  };

  const handleClose = () => {
    setIsBookingOpen(false);
    setStep(1);
    setConfirmedAppointment(null);
  };

  const executePayment = () => {
    setIsProcessingPayment(true);

    setTimeout(() => {
      setIsProcessingPayment(false);

      const finalDraft = {
        ...bookingDraft,
        date: `${currentDaySchedule.day} (${selectedDate})`,
        timeSlot: selectedTimeSlot,
        patientName: patientMode === 'SELF' ? userProfile.name : patientName,
        patientAge: patientMode === 'SELF' ? 32 : patientAge,
        patientGender: patientMode === 'SELF' ? 'Male' : patientGender,
        patientPhone: patientPhone || userProfile.phone,
        patientAddress: patientAddress || 'Capital Complex, Agartala',
        relationship:
          patientMode === 'SELF'
            ? 'Self'
            : familyMembers.find((f) => f.id === selectedFamilyId)?.relationship ||
              'Family Member',
        symptoms: symptomsReason,
        total: onlinePlatformFee,
      };

      const apt = bookAppointment(finalDraft, paymentMethod);
      setConfirmedAppointment(apt);
      setStep(5);
    }, 1200);
  };

  const handleConfirmPay = () => {
    if (onlinePlatformFee > 0 && biometricSettings.isEnabled && biometricSettings.protectPayment) {
      openBiometricPrompt({
        title: 'Authorize Booking Platform Fee',
        subtitle: `Verify identity to confirm payment of ₹${onlinePlatformFee} convenience fee`,
        onSuccess: () => {
          executePayment();
        },
      });
    } else {
      executePayment();
    }
  };

  return (
    <div
      id="booking-flow-backdrop"
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in duration-200"
    >
      <div className="w-full max-w-md bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl max-h-[94vh] flex flex-col animate-in slide-in-from-bottom duration-250">
        {/* Header with Step Indicator */}
        <div className="px-5 py-3.5 border-b border-slate-100 flex items-center justify-between bg-slate-50/90 rounded-t-3xl">
          <div className="flex items-center space-x-2">
            {step > 1 && step < 5 && (
              <button
                id="booking-back-btn"
                onClick={() => setStep(step - 1)}
                className="p-1 -ml-1 text-slate-500 hover:text-slate-800 rounded-full"
                aria-label="Previous step"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>
            )}
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800">
                {step === 5 ? 'Booking Confirmed' : `Step ${step} of 4`}
              </span>
              <h3 className="text-sm font-heading font-bold text-slate-900 leading-tight">
                {step === 1 && 'Consultation Mode'}
                {step === 2 && 'Doctor Weekly Schedule & Slot'}
                {step === 3 && 'Patient Information'}
                {step === 4 && 'Summary & Platform Fee'}
                {step === 5 && 'Appointment Confirmed'}
              </h3>
            </div>
          </div>
          <button
            id="close-booking-modal-btn"
            onClick={handleClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-full"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Step Progress Bar */}
        {step < 5 && (
          <div className="w-full bg-slate-100 h-1">
            <div
              className="bg-emerald-600 h-1 transition-all duration-300"
              style={{ width: `${(step / 4) * 100}%` }}
            />
          </div>
        )}

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-5 no-scrollbar bg-slate-50/40">
          {/* STEP 1: DOCTOR & CONSULTATION MODE */}
          {step === 1 && (
            <div className="space-y-4">
              {/* Doctor Summary Header */}
              <div className="p-4 bg-white rounded-2xl border border-slate-200/80 shadow-xs flex items-center space-x-3.5">
                <img
                  src={doctor.image}
                  alt={doctor.name}
                  className="w-14 h-14 rounded-2xl object-cover ring-1 ring-slate-100"
                  referrerPolicy="no-referrer"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-1.5">
                    <h4 className="text-sm font-bold text-slate-900 truncate">{doctor.name}</h4>
                    {doctor.verified && <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />}
                  </div>
                  <div className="text-xs text-emerald-800 font-medium mt-0.5">{doctor.specialty}</div>
                  <div className="text-[11px] text-slate-500 mt-0.5 truncate">{doctor.hospital}</div>
                </div>
              </div>

              {/* Consultation Type Selection */}
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-2.5">
                  Choose Consultation Mode
                </label>
                <div className="grid grid-cols-1 gap-2.5">
                  {/* Video Consultation */}
                  {doctor.availableForVideo !== false ? (
                    <button
                      id="select-mode-video"
                      onClick={() => handleTypeChange('VIDEO')}
                      className={`p-4 rounded-2xl border text-left transition-all relative flex items-start space-x-3.5 ${
                        bookingDraft.type === 'VIDEO'
                          ? 'bg-emerald-50/70 border-emerald-600 ring-1 ring-emerald-600 shadow-xs'
                          : 'bg-white border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <div
                        className={`p-2.5 rounded-xl shrink-0 ${
                          bookingDraft.type === 'VIDEO'
                            ? 'bg-emerald-600 text-white'
                            : 'bg-slate-100 text-slate-600'
                        }`}
                      >
                        <Video className="w-5 h-5" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-bold text-slate-900">Video Consultation</span>
                          <span className="text-sm font-extrabold text-emerald-800">₹{doctor.feeVideo}</span>
                        </div>
                        <p className="text-xs text-slate-500 mt-0.5">
                          Instant digital Rx, consult from home via video call
                        </p>
                        <div className="text-[11px] font-semibold text-emerald-700 mt-1.5 flex items-center space-x-1">
                          <Clock className="w-3 h-3" />
                          <span>Next available: {doctor.nextSlotVideo}</span>
                        </div>
                      </div>
                      {bookingDraft.type === 'VIDEO' && (
                        <div className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center shrink-0">
                          <Check className="w-3 h-3 stroke-3" />
                        </div>
                      )}
                    </button>
                  ) : (
                    <div className="p-3.5 bg-slate-100 rounded-2xl border border-slate-200 flex items-start space-x-3 opacity-70">
                      <VideoOff className="w-5 h-5 text-slate-400 shrink-0 mt-0.5" />
                      <div>
                        <span className="text-xs font-bold text-slate-700 block">Video Consultation Not Available</span>
                        <span className="text-[11px] text-slate-500">
                          {doctor.name} only offers in-person clinical consultations.
                        </span>
                      </div>
                    </div>
                  )}

                  {/* In-Clinic Appointment */}
                  <button
                    id="select-mode-clinic"
                    onClick={() => handleTypeChange('IN_CLINIC')}
                    className={`p-4 rounded-2xl border text-left transition-all relative flex items-start space-x-3.5 ${
                      bookingDraft.type === 'IN_CLINIC'
                        ? 'bg-emerald-50/70 border-emerald-600 ring-1 ring-emerald-600 shadow-xs'
                        : 'bg-white border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div
                      className={`p-2.5 rounded-xl shrink-0 ${
                        bookingDraft.type === 'IN_CLINIC'
                          ? 'bg-emerald-600 text-white'
                          : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      <Building2 className="w-5 h-5" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-bold text-slate-900">In-Clinic Visit</span>
                        <div className="text-right">
                          <span className="text-sm font-extrabold text-emerald-800">₹{doctor.feeInClinic}</span>
                          <span className="text-[9px] text-slate-400 block -mt-0.5">Pay at Clinic</span>
                        </div>
                      </div>
                      <p className="text-xs text-slate-500 mt-0.5">{doctor.hospitalAddress}</p>
                      <div className="text-[11px] font-semibold text-emerald-700 mt-1.5 flex items-center space-x-1">
                        <Clock className="w-3 h-3" />
                        <span>Next slot: {doctor.nextSlotClinic}</span>
                      </div>
                    </div>
                    {bookingDraft.type === 'IN_CLINIC' && (
                      <div className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center shrink-0">
                        <Check className="w-3 h-3 stroke-3" />
                      </div>
                    )}
                  </button>
                </div>
              </div>

              {/* Visiting fee clarification */}
              <div className="p-3 bg-amber-50 rounded-2xl border border-amber-200 text-xs text-amber-900 flex items-start space-x-2">
                <Info className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                <p className="text-[11px] leading-relaxed">
                  <strong>Doctor Visiting Fee Note:</strong> Doctor's consultation fee (₹{doctorVisitingFee}) is shown for your reference and is paid directly to the doctor during your clinic visit.
                </p>
              </div>
            </div>
          )}

          {/* STEP 2: WHOLE WEEK DOCTOR AVAILABILITY & TIMESLOTS */}
          {step === 2 && (
            <div className="space-y-4">
              {/* Weekly Day Selector (7 Days) */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Select Day of Week
                  </label>
                  <span className="text-[11px] font-semibold text-emerald-800">
                    {doctor.name}'s Schedule
                  </span>
                </div>

                <div className="grid grid-cols-7 gap-1">
                  {weeklySchedules.map((sched, idx) => {
                    const isSelected = selectedDayScheduleIndex === idx;
                    return (
                      <button
                        key={sched.day}
                        id={`booking-day-tab-${sched.day.toLowerCase()}`}
                        onClick={() => {
                          setSelectedDayScheduleIndex(idx);
                          // Auto pick first available slot
                          const firstSlot =
                            sched.morningSlots[0] ||
                            sched.afternoonSlots[0] ||
                            sched.eveningSlots[0] ||
                            '10:00 AM';
                          setSelectedTimeSlot(firstSlot);
                          setSelectedDate(`Day: ${sched.day}`);
                        }}
                        className={`py-2 px-1 rounded-xl text-center border transition-all ${
                          isSelected
                            ? 'bg-emerald-800 text-white border-emerald-800 shadow-xs'
                            : sched.isAvailable
                            ? 'bg-white hover:bg-slate-50 text-slate-800 border-slate-200'
                            : 'bg-slate-100 text-slate-400 border-slate-200 opacity-60'
                        }`}
                      >
                        <span className="text-[10px] font-bold block">{sched.day.slice(0, 3)}</span>
                        <span className="text-[9px] block mt-0.5 font-medium">
                          {sched.isAvailable ? 'Open' : 'Off'}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Day Availability Details */}
              <div className="p-3 bg-white rounded-2xl border border-slate-200 flex items-center justify-between text-xs">
                <div>
                  <span className="font-bold text-slate-900 block">{currentDaySchedule.day} Timings</span>
                  <span className="text-[11px] text-slate-500">
                    {currentDaySchedule.isAvailable ? currentDaySchedule.clinicTiming : 'No clinic sessions'}
                  </span>
                </div>
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    currentDaySchedule.isAvailable
                      ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                      : 'bg-rose-100 text-rose-800 border border-rose-200'
                  }`}
                >
                  {currentDaySchedule.isAvailable ? 'Available' : 'Doctor Day Off'}
                </span>
              </div>

              {/* Timeslots for selected day */}
              {currentDaySchedule.isAvailable ? (
                <div className="space-y-3">
                  {/* Morning Slots */}
                  {currentDaySchedule.morningSlots.length > 0 && (
                    <div>
                      <div className="text-[11px] font-bold text-slate-500 mb-1.5 flex items-center space-x-1">
                        <Clock className="w-3 h-3 text-amber-500" />
                        <span>Morning Slots (09:00 AM - 12:00 PM)</span>
                      </div>
                      <div className="grid grid-cols-3 gap-2">
                        {currentDaySchedule.morningSlots.map((slot) => {
                          const isSelected = selectedTimeSlot === slot;
                          return (
                            <button
                              key={slot}
                              onClick={() => setSelectedTimeSlot(slot)}
                              className={`py-2 px-2 rounded-xl text-xs font-semibold border transition-all text-center ${
                                isSelected
                                  ? 'bg-emerald-800 text-white border-emerald-800 shadow-xs'
                                  : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-200'
                              }`}
                            >
                              {slot}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Afternoon Slots */}
                  {currentDaySchedule.afternoonSlots.length > 0 && (
                    <div>
                      <div className="text-[11px] font-bold text-slate-500 mb-1.5 flex items-center space-x-1">
                        <Clock className="w-3 h-3 text-orange-500" />
                        <span>Afternoon Slots (12:00 PM - 04:00 PM)</span>
                      </div>
                      <div className="grid grid-cols-3 gap-2">
                        {currentDaySchedule.afternoonSlots.map((slot) => {
                          const isSelected = selectedTimeSlot === slot;
                          return (
                            <button
                              key={slot}
                              onClick={() => setSelectedTimeSlot(slot)}
                              className={`py-2 px-2 rounded-xl text-xs font-semibold border transition-all text-center ${
                                isSelected
                                  ? 'bg-emerald-800 text-white border-emerald-800 shadow-xs'
                                  : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-200'
                              }`}
                            >
                              {slot}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Evening Slots */}
                  {currentDaySchedule.eveningSlots.length > 0 && (
                    <div>
                      <div className="text-[11px] font-bold text-slate-500 mb-1.5 flex items-center space-x-1">
                        <Clock className="w-3 h-3 text-indigo-500" />
                        <span>Evening Slots (04:00 PM - 08:00 PM)</span>
                      </div>
                      <div className="grid grid-cols-3 gap-2">
                        {currentDaySchedule.eveningSlots.map((slot) => {
                          const isSelected = selectedTimeSlot === slot;
                          return (
                            <button
                              key={slot}
                              onClick={() => setSelectedTimeSlot(slot)}
                              className={`py-2 px-2 rounded-xl text-xs font-semibold border transition-all text-center ${
                                isSelected
                                  ? 'bg-emerald-800 text-white border-emerald-800 shadow-xs'
                                  : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-200'
                              }`}
                            >
                              {slot}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="p-6 bg-white rounded-2xl text-center space-y-2 border border-slate-200">
                  <Calendar className="w-8 h-8 text-slate-400 mx-auto" />
                  <p className="text-xs font-bold text-slate-700">Doctor not taking appointments on {currentDaySchedule.day}</p>
                  <p className="text-[11px] text-slate-500">Please choose an active day from the weekday list above.</p>
                </div>
              )}
            </div>
          )}

          {/* STEP 3: PATIENT INFORMATION */}
          {step === 3 && (
            <div className="space-y-4">
              {/* Who is this consultation for? */}
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-2">
                  This appointment is for
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    id="patient-mode-myself"
                    onClick={() => {
                      setPatientMode('SELF');
                      setPatientName(userProfile.name);
                      setPatientAge(32);
                      setPatientGender('Male');
                      setPatientPhone(userProfile.phone);
                    }}
                    className={`p-3 rounded-xl border text-center font-bold text-xs transition-all ${
                      patientMode === 'SELF'
                        ? 'bg-emerald-800 text-white border-emerald-800 shadow-xs'
                        : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-200'
                    }`}
                  >
                    Book for myself
                  </button>
                  <button
                    id="patient-mode-family"
                    onClick={() => {
                      setPatientMode('FAMILY');
                      if (familyMembers.length > 1) {
                        handleFamilySelect(familyMembers[1].id);
                      }
                    }}
                    className={`p-3 rounded-xl border text-center font-bold text-xs transition-all ${
                      patientMode === 'FAMILY'
                        ? 'bg-emerald-800 text-white border-emerald-800 shadow-xs'
                        : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-200'
                    }`}
                  >
                    Book for family member
                  </button>
                </div>
              </div>

              {/* Family Member Quick Select */}
              {patientMode === 'FAMILY' && (
                <div>
                  <label className="text-[11px] font-bold text-slate-500 block mb-1.5">
                    Select Family Profile
                  </label>
                  <div className="flex space-x-2 overflow-x-auto pb-1 no-scrollbar">
                    {familyMembers.map((fam) => {
                      const isSelected = selectedFamilyId === fam.id;
                      return (
                        <button
                          key={fam.id}
                          onClick={() => handleFamilySelect(fam.id)}
                          className={`p-2.5 px-3 rounded-xl border text-xs text-left shrink-0 transition-all ${
                            isSelected
                              ? 'bg-emerald-50 border-emerald-600 text-emerald-950 font-bold ring-1 ring-emerald-600'
                              : 'bg-white border-slate-200 text-slate-700'
                          }`}
                        >
                          <div>{fam.name}</div>
                          <div className="text-[10px] text-slate-500 font-normal">
                            {fam.relationship} ({fam.age}y)
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Patient Fields */}
              <div className="bg-white p-4 rounded-2xl border border-slate-200/80 space-y-3 shadow-xs">
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Full Name</label>
                  <input
                    id="booking-patient-name"
                    type="text"
                    value={patientName}
                    onChange={(e) => setPatientName(e.target.value)}
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:bg-white focus:ring-2 focus:ring-emerald-600"
                    placeholder="Patient full name"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-semibold text-slate-700 block mb-1">Age (Years)</label>
                    <input
                      id="booking-patient-age"
                      type="number"
                      value={patientAge}
                      onChange={(e) => setPatientAge(parseInt(e.target.value) || 0)}
                      className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:bg-white focus:ring-2 focus:ring-emerald-600"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-slate-700 block mb-1">Gender</label>
                    <select
                      id="booking-patient-gender"
                      value={patientGender}
                      onChange={(e) => setPatientGender(e.target.value as any)}
                      className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:bg-white focus:ring-2 focus:ring-emerald-600"
                    >
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Mobile Contact Number</label>
                  <input
                    id="booking-patient-phone"
                    type="tel"
                    value={patientPhone}
                    onChange={(e) => setPatientPhone(e.target.value)}
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:bg-white focus:ring-2 focus:ring-emerald-600"
                    placeholder="+91 98765 43210"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">
                    Residential Address / Locality <span className="text-slate-400 font-normal">(Optional for clinic desk roster)</span>
                  </label>
                  <div className="relative">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
                    <input
                      id="booking-patient-address"
                      type="text"
                      value={patientAddress}
                      onChange={(e) => setPatientAddress(e.target.value)}
                      className="w-full pl-9 pr-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:bg-white focus:ring-2 focus:ring-emerald-600 placeholder:text-slate-400"
                      placeholder="e.g. Capital Complex, Sector 2, Agartala"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">
                    Symptoms / Reason for Consultation (Optional)
                  </label>
                  <textarea
                    id="booking-patient-symptoms"
                    rows={2}
                    value={symptomsReason}
                    onChange={(e) => setSymptomsReason(e.target.value)}
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:bg-white focus:ring-2 focus:ring-emerald-600 placeholder:text-slate-400"
                    placeholder="e.g. Fever, body pain, health checkup..."
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 4: SUMMARY & PLATFORM / CONVENIENCE FEE PAYMENT */}
          {step === 4 && (
            <div className="space-y-4">
              {/* Order Summary Card */}
              <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
                <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-100">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Booking Breakdown
                  </h4>
                  <span className="text-[10px] font-bold bg-emerald-100 text-emerald-900 px-2 py-0.5 rounded-full">
                    {bookingDraft.type === 'VIDEO' ? 'Video Consult' : 'In-Clinic Slot'}
                  </span>
                </div>

                <div className="space-y-2 text-xs border-b border-slate-100 pb-3">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Doctor:</span>
                    <span className="font-bold text-slate-800">{doctor.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Specialty:</span>
                    <span className="font-semibold text-slate-800">{doctor.specialty}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Scheduled Day & Time:</span>
                    <span className="font-bold text-slate-900">
                      {currentDaySchedule.day}, {selectedTimeSlot}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Patient:</span>
                    <span className="font-semibold text-slate-800">
                      {patientMode === 'SELF' ? userProfile.name : patientName}
                    </span>
                  </div>
                </div>

                {/* Fee Split */}
                <div className="pt-3 space-y-2 text-xs">
                  {/* Doctor fee to pay at clinic */}
                  <div className="p-2.5 bg-amber-50/70 border border-amber-200 rounded-xl flex items-center justify-between">
                    <div>
                      <span className="font-bold text-amber-950 block">Doctor Visiting Fee</span>
                      <span className="text-[10px] text-amber-800">Pay directly when you visit the clinic</span>
                    </div>
                    <span className="font-extrabold text-amber-950 text-sm">₹{doctorVisitingFee}</span>
                  </div>

                  {/* App Owner Platform / Convenience Fee */}
                  <div className="flex justify-between text-slate-700 py-1">
                    <div className="flex items-center space-x-1">
                      <Sparkles className="w-3.5 h-3.5 text-emerald-700" />
                      <span className="font-semibold">App Platform & Booking Fee:</span>
                    </div>
                    {onlinePlatformFee > 0 ? (
                      <span className="font-bold text-slate-900">₹{onlinePlatformFee}</span>
                    ) : (
                      <span className="text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                        FREE Promo (₹0)
                      </span>
                    )}
                  </div>

                  {/* Total payable now online */}
                  <div className="flex justify-between text-sm font-extrabold text-slate-900 pt-2 border-t border-slate-100 items-center">
                    <span>Payable Now to Confirm:</span>
                    <span className="text-emerald-800 text-lg font-extrabold">₹{onlinePlatformFee}</span>
                  </div>
                </div>
              </div>

              {/* Payment Section (If fee > 0 or for Free Promo) */}
              {onlinePlatformFee > 0 ? (
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-2">
                    Pay Convenience Fee via UPI / QR
                  </label>
                  <div className="space-y-2">
                    {/* UPI App */}
                    <div
                      onClick={() => setPaymentMethod('UPI')}
                      className={`p-3.5 rounded-2xl border cursor-pointer transition-all ${
                        paymentMethod === 'UPI'
                          ? 'bg-emerald-50/80 border-emerald-600 ring-1 ring-emerald-600'
                          : 'bg-white border-slate-200'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <Smartphone className="w-5 h-5 text-emerald-700" />
                          <div>
                            <span className="text-xs font-bold text-slate-900 block">
                              UPI App (GPay, PhonePe, Paytm, BHIM)
                            </span>
                            <span className="text-[10px] text-slate-500">Pay ₹{onlinePlatformFee} to UPI ID: {platformFeeSettings.upiId}</span>
                          </div>
                        </div>
                        <div
                          className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                            paymentMethod === 'UPI' ? 'border-emerald-600 bg-emerald-600' : 'border-slate-300'
                          }`}
                        >
                          {paymentMethod === 'UPI' && <Check className="w-2.5 h-2.5 text-white stroke-3" />}
                        </div>
                      </div>

                      {paymentMethod === 'UPI' && (
                        <div className="mt-3 pt-2.5 border-t border-emerald-200/60 grid grid-cols-4 gap-2">
                          {[
                            { id: 'gpay', name: 'Google Pay' },
                            { id: 'phonepe', name: 'PhonePe' },
                            { id: 'paytm', name: 'Paytm' },
                            { id: 'bhim', name: 'BHIM UPI' },
                          ].map((app) => (
                            <button
                              key={app.id}
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setUpiApp(app.id as any);
                              }}
                              className={`p-2 rounded-xl border text-[10px] font-bold text-center transition-all ${
                                upiApp === app.id
                                  ? 'bg-emerald-800 text-white border-emerald-800 shadow-xs'
                                  : 'bg-white border-slate-200 text-slate-700'
                              }`}
                            >
                              {app.name}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* QR Code */}
                    <div
                      onClick={() => setPaymentMethod('QR_CODE')}
                      className={`p-3.5 rounded-2xl border cursor-pointer transition-all ${
                        paymentMethod === 'QR_CODE'
                          ? 'bg-emerald-50/80 border-emerald-600 ring-1 ring-emerald-600'
                          : 'bg-white border-slate-200'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <QrCode className="w-5 h-5 text-emerald-700" />
                          <div>
                            <span className="text-xs font-bold text-slate-900 block">Scan UPI QR Code</span>
                            <span className="text-[10px] text-slate-500">Scan using any UPI camera app</span>
                          </div>
                        </div>
                        <div
                          className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                            paymentMethod === 'QR_CODE' ? 'border-emerald-600 bg-emerald-600' : 'border-slate-300'
                          }`}
                        >
                          {paymentMethod === 'QR_CODE' && <Check className="w-2.5 h-2.5 text-white stroke-3" />}
                        </div>
                      </div>

                      {paymentMethod === 'QR_CODE' && (
                        <div className="mt-3 pt-3 border-t border-emerald-200/60 text-center space-y-2">
                          <div className="w-36 h-36 mx-auto bg-white p-2 border border-slate-200 rounded-2xl flex flex-col items-center justify-center shadow-xs">
                            <QrCode className="w-28 h-28 text-slate-900" />
                          </div>
                          <span className="text-[10px] text-slate-500 font-mono font-bold block">
                            UPI ID: {platformFeeSettings.upiId}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="p-3.5 bg-emerald-50/80 rounded-2xl border border-emerald-200 text-xs text-emerald-950 flex items-start space-x-2.5">
                  <Sparkles className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold block">Free Booking Promotion Active</span>
                    <span className="text-[11px] text-emerald-800 leading-relaxed">
                      You do not need to pay anything online right now. Your appointment will be confirmed instantly, and you only pay the doctor at the clinic during your visit.
                    </span>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* STEP 5: CONFIRMATION SUCCESS */}
          {step === 5 && confirmedAppointment && (
            <div className="text-center py-2 space-y-4">
              {/* Success Badge */}
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 mx-auto flex items-center justify-center shadow-inner">
                <Check className="w-8 h-8 stroke-3" />
              </div>

              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                  Appointment Confirmed
                </span>
                <h3 className="text-base font-bold text-slate-900 mt-2 font-heading">
                  You're booked with {confirmedAppointment.doctorName}!
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Booking ID: <span className="font-mono font-bold text-slate-800">{confirmedAppointment.id}</span>
                </p>
              </div>

              {/* Summary Details Card */}
              <div className="bg-white p-4 rounded-2xl border border-slate-200 text-left space-y-2.5 text-xs shadow-xs">
                {/* Token & Serial Number */}
                <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 flex items-center justify-between">
                  <div className="flex items-center space-x-2.5">
                    <Ticket className="w-5 h-5 text-emerald-800" />
                    <div>
                      <span className="text-xs font-bold text-emerald-950 block">Sequential Booking Queue</span>
                      <span className="text-[11px] text-emerald-700">Token ID: #{confirmedAppointment.tokenNumber || 'TK-01'}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-sm font-extrabold text-emerald-950 font-mono px-2.5 py-1 bg-white rounded-lg border border-emerald-300 shadow-2xs inline-block">
                      Serial #{confirmedAppointment.serialNumber || 1}
                    </span>
                    <span className="text-[10px] text-emerald-700 block mt-0.5 font-medium">Position for the day</span>
                  </div>
                </div>

                <div className="flex justify-between">
                  <span className="text-slate-500">Consultation Mode:</span>
                  <span className="font-bold text-emerald-800">
                    {confirmedAppointment.type === 'VIDEO' ? 'Video Consultation' : 'In-Clinic Visit'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Date & Slot:</span>
                  <span className="font-bold text-slate-800">
                    {confirmedAppointment.date}, {confirmedAppointment.timeSlot}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Patient Name & Contact:</span>
                  <span className="font-semibold text-slate-800 text-right">
                    {confirmedAppointment.patientName} ({confirmedAppointment.patientPhone})
                  </span>
                </div>
                {confirmedAppointment.patientAddress && (
                  <div className="flex justify-between">
                    <span className="text-slate-500">Patient Address:</span>
                    <span className="font-medium text-slate-700 text-right truncate max-w-[200px]">
                      {confirmedAppointment.patientAddress}
                    </span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-slate-500">Clinic / Hospital:</span>
                  <span className="font-semibold text-slate-800 text-right truncate max-w-[200px]">
                    {confirmedAppointment.doctorHospital}
                  </span>
                </div>

                {/* Doctor Fee Reminder */}
                <div className="pt-2 border-t border-slate-100 flex justify-between items-center text-slate-600">
                  <span>Doctor Visiting Fee:</span>
                  <span className="font-bold text-slate-900">
                    ₹{confirmedAppointment.doctorFee || doctorVisitingFee} (Pay at Clinic)
                  </span>
                </div>

                {/* Platform Fee Paid */}
                <div className="flex justify-between items-center text-slate-600">
                  <span>App Platform Fee:</span>
                  <span className="font-bold text-emerald-800">
                    {confirmedAppointment.platformFee > 0
                      ? `₹${confirmedAppointment.platformFee} (Paid Online)`
                      : 'FREE Promo (₹0)'}
                  </span>
                </div>
              </div>

              {/* Automated Whole Day Booking Roster Dispatch to Receptionist */}
              <div className="p-3.5 bg-emerald-950 text-white rounded-2xl text-left space-y-2.5 shadow-xs border border-emerald-900">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-1.5 text-emerald-300">
                    <Sparkles className="w-4 h-4 text-emerald-400" />
                    <span className="text-xs font-bold uppercase tracking-wider">Automated Receptionist Roster</span>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-800 text-emerald-100 border border-emerald-700">
                    Dispatched
                  </span>
                </div>

                <p className="text-[11px] text-emerald-100/90 leading-relaxed">
                  Whole day booking schedule containing <strong className="text-white">Patient Name</strong>, <strong className="text-white">Contact No.</strong>, <strong className="text-white">Address</strong>, and <strong className="text-white">Serial #{confirmedAppointment.serialNumber || 1}</strong> is synchronized with Dr. {doctor.name}'s receptionist desk.
                </p>

                <div className="p-2.5 bg-white/10 rounded-xl flex items-center justify-between text-xs">
                  <div>
                    <span className="font-bold text-white block">{doctor.receptionistName || 'Pooja Sharma (Clinic Front Desk)'}</span>
                    <span className="text-[11px] text-emerald-200">{doctor.receptionistEmail || 'desk.agartala@medpulse.in'}</span>
                  </div>
                  <span className="font-mono text-emerald-300 font-bold text-xs">{doctor.receptionistPhone || '+91 98301 22450'}</span>
                </div>

                {/* WhatsApp Direct Share and View Roster Actions */}
                <div className="grid grid-cols-2 gap-2 pt-1">
                  <button
                    id="share-whatsapp-roster-btn"
                    onClick={() => {
                      const waText = generateDoctorDailyRosterWhatsAppText(doctor, confirmedAppointment.date, appointments);
                      const url = getWhatsAppRosterUrl(doctor.receptionistPhone || '+91 98301 22450', waText);
                      window.open(url, '_blank');
                    }}
                    className="py-2 px-2 bg-[#25D366] hover:bg-[#20ba59] text-white rounded-xl font-bold text-xs flex items-center justify-center space-x-1.5 transition-all shadow-xs"
                  >
                    <MessageCircle className="w-3.5 h-3.5" />
                    <span>Send via WhatsApp</span>
                  </button>

                  <button
                    id="open-roster-manifest-btn"
                    onClick={() => {
                      openDoctorRosterModal(doctor, confirmedAppointment.date);
                    }}
                    className="py-2 px-2 bg-white/15 hover:bg-white/25 text-white rounded-xl font-bold text-xs flex items-center justify-center space-x-1.5 transition-all border border-white/20"
                  >
                    <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-300" />
                    <span>View Day Roster</span>
                  </button>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-2 gap-2 pt-1">
                {confirmedAppointment.type === 'VIDEO' ? (
                  <button
                    id="join-consultation-now-btn"
                    onClick={() => {
                      handleClose();
                      startInstantConsultation(doctor);
                    }}
                    className="p-3 bg-emerald-800 hover:bg-emerald-900 text-white rounded-xl text-xs font-bold flex items-center justify-center space-x-1.5 shadow-xs transition-all"
                  >
                    <Video className="w-4 h-4" />
                    <span>Join Video Call</span>
                  </button>
                ) : (
                  <button
                    id="get-directions-btn"
                    onClick={() => showToast(`Opening directions to ${doctor.hospital}...`)}
                    className="p-3 bg-emerald-800 hover:bg-emerald-900 text-white rounded-xl text-xs font-bold flex items-center justify-center space-x-1.5 shadow-xs transition-all"
                  >
                    <Navigation className="w-4 h-4" />
                    <span>Get Directions</span>
                  </button>
                )}

                <button
                  id="view-all-appointments-btn"
                  onClick={() => {
                    handleClose();
                    setActiveTab('appointments');
                  }}
                  className="p-3 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-bold flex items-center justify-center space-x-1.5 transition-all"
                >
                  <Calendar className="w-4 h-4" />
                  <span>My Appointments</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Bottom CTA Button */}
        {step < 5 && (
          <div className="p-4 bg-white border-t border-slate-100">
            {step === 1 && (
              <button
                id="booking-step1-continue"
                onClick={() => setStep(2)}
                className="w-full bg-emerald-800 hover:bg-emerald-900 text-white py-3.5 rounded-xl text-xs font-bold flex items-center justify-center space-x-2 shadow-xs transition-all active:scale-[0.98]"
              >
                <span>Continue to Date & Slot</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            )}

            {step === 2 && (
              <button
                id="booking-step2-continue"
                onClick={() => setStep(3)}
                className="w-full bg-emerald-800 hover:bg-emerald-900 text-white py-3.5 rounded-xl text-xs font-bold flex items-center justify-center space-x-2 shadow-xs transition-all active:scale-[0.98]"
              >
                <span>Continue to Patient Details</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            )}

            {step === 3 && (
              <button
                id="booking-step3-continue"
                onClick={() => setStep(4)}
                className="w-full bg-emerald-800 hover:bg-emerald-900 text-white py-3.5 rounded-xl text-xs font-bold flex items-center justify-center space-x-2 shadow-xs transition-all active:scale-[0.98]"
              >
                <span>Review & Confirm Booking</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            )}

            {step === 4 && (
              <button
                id="booking-pay-and-confirm"
                onClick={handleConfirmPay}
                disabled={isProcessingPayment}
                className="w-full bg-emerald-800 hover:bg-emerald-900 text-white py-3.5 rounded-xl text-xs font-bold flex items-center justify-center space-x-2 shadow-xs transition-all active:scale-[0.98]"
              >
                {isProcessingPayment ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Confirming Appointment...</span>
                  </>
                ) : (
                  <>
                    <ShieldCheck className="w-4 h-4" />
                    <span>
                      {onlinePlatformFee > 0
                        ? `Pay ₹${onlinePlatformFee} Platform Fee & Book`
                        : 'Confirm Appointment for Free (₹0)'}
                    </span>
                  </>
                )}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
