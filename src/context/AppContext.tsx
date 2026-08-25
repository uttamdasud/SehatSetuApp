import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Doctor,
  Appointment,
  DigitalPrescription,
  MedicalRecord,
  FamilyMember,
  NotificationItem,
  Hospital,
  ActiveTab,
  UserProfile,
  ConsultationType,
  SpecialtyType,
  BiometricSettings,
  DoctorOnboardingRequest,
  PlatformFeeSettings,
  DaySchedule,
} from '../types';
import {
  MOCK_DOCTORS,
  MOCK_HOSPITALS,
  INITIAL_APPOINTMENTS,
  INITIAL_PRESCRIPTIONS,
  INITIAL_MEDICAL_RECORDS,
  INITIAL_FAMILY_MEMBERS,
  INITIAL_NOTIFICATIONS,
  INITIAL_ONBOARDING_REQUESTS,
  INITIAL_PLATFORM_FEE_SETTINGS,
  createDoctorWeeklySchedule,
} from '../data/mockData';
import {
  calculateDoctorDaySerialNumber,
  generateDoctorTokenString,
} from '../utils/receptionistNotifier';

export interface BookingDraft {
  doctor: Doctor | null;
  type: ConsultationType;
  date: string;
  timeSlot: string;
  patientId: string;
  patientName: string;
  patientAge: number;
  patientGender: string;
  patientPhone: string;
  patientAddress?: string; // Optional residential address
  relationship: string;
  symptoms: string;
  fee: number; // Visiting fee payable at clinic
  doctorFee: number; // Visiting fee
  convenienceFee: number; // Platform fee
  platformFee: number; // App owner fee (₹0 promo / ₹10 / ₹20)
  isPromoFree: boolean;
  total: number; // Online payable amount (convenience fee)
  upiRefNumber?: string;
  tokenNumber?: string;
}

interface ActiveCallState {
  isActive: boolean;
  isConnecting: boolean;
  doctor: Doctor | null;
  appointmentId: string | null;
  durationSeconds: number;
  isMicMuted: boolean;
  isVideoOff: boolean;
  isSpeakerOn: boolean;
  activeChatDrawer: boolean;
  messages: Array<{
    id: string;
    sender: 'doctor' | 'patient';
    text: string;
    time: string;
    attachmentName?: string;
    attachmentType?: string;
  }>;
}

interface BiometricPromptState {
  isOpen: boolean;
  title?: string;
  subtitle?: string;
  mode?: 'FACE_ID' | 'FINGERPRINT' | 'PIN';
  onSuccess?: () => void;
  onCancel?: () => void;
}

interface AppContextType {
  // Navigation & Tabs
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;

  // Modals & Sub-Screens
  activeScreen: string | null;
  setActiveScreen: (screen: string | null) => void;
  selectedDoctor: Doctor | null;
  setSelectedDoctor: (doctor: Doctor | null) => void;
  selectedHospital: Hospital | null;
  setSelectedHospital: (hospital: Hospital | null) => void;
  selectedPrescription: DigitalPrescription | null;
  setSelectedPrescription: (prescription: DigitalPrescription | null) => void;
  selectedRecord: MedicalRecord | null;
  setSelectedRecord: (record: MedicalRecord | null) => void;

  // User Profile & Location
  userProfile: UserProfile;
  setUserProfile: React.Dispatch<React.SetStateAction<UserProfile>>;
  user: {
    id: string;
    name: string;
    phone: string;
    email: string;
    city: string;
    state: string;
    image: string;
    avatar: string;
    age: number;
    gender: 'Male' | 'Female' | 'Other';
    bloodGroup: string;
    abhaId: string;
    medicalRecords: MedicalRecord[];
    familyMembers: FamilyMember[];
  };
  activePatientId: string;
  setActivePatientId: (id: string) => void;
  currentLocation: { city: string; state: string; area: string };
  setCurrentLocation: (loc: { city: string; state: string; area: string }) => void;
  showLocationModal: boolean;
  setShowLocationModal: (show: boolean) => void;

  // Language
  currentLanguage: string;
  setCurrentLanguage: (lang: string) => void;

  // Biometrics & Health Vault Security
  biometricSettings: BiometricSettings;
  biometricPrompt: BiometricPromptState | null;
  openBiometricPrompt: (options: {
    title?: string;
    subtitle?: string;
    mode?: 'FACE_ID' | 'FINGERPRINT' | 'PIN';
    onSuccess?: () => void;
    onCancel?: () => void;
  }) => void;
  closeBiometricPrompt: () => void;
  toggleBiometrics: (enable: boolean) => void;
  updateBiometricSettings: (settings: Partial<BiometricSettings>) => void;
  lockVaultImmediately: () => void;
  unlockVaultBiometric: (method: 'FACE_ID' | 'FINGERPRINT' | 'PIN', pinInput?: string) => boolean;

  // Partner Onboarding (Doctor / Pharmacy / Clinic)
  showOnboardingModal: boolean;
  setShowOnboardingModal: (show: boolean) => void;
  onboardingRequests: DoctorOnboardingRequest[];
  submitDoctorOnboardingRequest: (
    data: Omit<DoctorOnboardingRequest, 'id' | 'status' | 'submittedDate'>
  ) => DoctorOnboardingRequest;
  approveDoctorOnboardingRequest: (requestId: string) => Doctor | null;
  rejectDoctorOnboardingRequest: (requestId: string, reason?: string) => void;

  // Owner Admin Portal & Monetization
  showAdminPortal: boolean;
  setShowAdminPortal: (show: boolean) => void;
  isOwnerAuthenticated: boolean;
  loginOwner: (passcode: string) => boolean;
  logoutOwner: () => void;
  platformFeeSettings: PlatformFeeSettings;
  updatePlatformFeeSettings: (settings: Partial<PlatformFeeSettings>) => void;

  // Doctors & Search
  doctors: Doctor[];
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedSpecialtyFilter: SpecialtyType | 'ALL';
  setSelectedSpecialtyFilter: (spec: SpecialtyType | 'ALL') => void;
  selectedTypeFilter: 'ALL' | 'VIDEO' | 'IN_CLINIC';
  setSelectedTypeFilter: (type: 'ALL' | 'VIDEO' | 'IN_CLINIC') => void;
  updateDoctorAvailability: (doctorId: string, isAvailable: boolean) => void;
  toggleDoctorVideoAllowed: (doctorId: string, allowed: boolean) => void;
  updateDoctorSchedule: (doctorId: string, schedule: DaySchedule[]) => void;
  updateDoctorFees: (doctorId: string, feeVideo: number, feeInClinic: number) => void;
  updateDoctorReceptionistDetails: (
    doctorId: string,
    receptionistName: string,
    receptionistPhone: string,
    receptionistEmail: string
  ) => void;
  deleteDoctor: (doctorId: string) => void;
  addDoctorDirectly: (doctor: Omit<Doctor, 'id' | 'reviews' | 'reviewCount' | 'rating'>) => Doctor;

  // Receptionist Daily Roster Modal
  showReceptionistRosterModal: boolean;
  setShowReceptionistRosterModal: (show: boolean) => void;
  rosterDoctor: Doctor | null;
  setRosterDoctor: (doc: Doctor | null) => void;
  rosterDate: string;
  setRosterDate: (date: string) => void;
  openDoctorRosterModal: (doctor: Doctor, date?: string) => void;

  // Appointments
  appointments: Appointment[];
  bookAppointment: (
    booking: BookingDraft,
    paymentMethod: 'UPI' | 'CARD' | 'NET_BANKING' | 'WALLET' | 'CASH_AT_CLINIC'
  ) => Appointment;
  cancelAppointment: (id: string) => void;
  rescheduleAppointment: (id: string, newDate: string, newTime: string) => void;

  // Booking Flow
  bookingDraft: BookingDraft;
  setBookingDraft: React.Dispatch<React.SetStateAction<BookingDraft>>;
  startBooking: (doctor: Doctor, type?: ConsultationType) => void;
  isBookingOpen: boolean;
  setIsBookingOpen: (open: boolean) => void;

  // Instant Consultation / Telemedicine Call
  activeCall: ActiveCallState;
  startInstantConsultation: (doctor?: Doctor) => void;
  endCall: () => void;
  toggleMic: () => void;
  toggleVideo: () => void;
  toggleSpeaker: () => void;
  toggleCallChat: (open?: boolean) => void;
  sendCallMessage: (text: string, attachmentName?: string) => void;

  // Medical Records & Prescriptions
  prescriptions: DigitalPrescription[];
  medicalRecords: MedicalRecord[];
  addMedicalRecord: (record: Omit<MedicalRecord, 'id'>) => void;

  // Family Members
  familyMembers: FamilyMember[];
  addFamilyMember: (member: Omit<FamilyMember, 'id' | 'recordsCount'>) => void;
  deleteFamilyMember: (id: string) => void;

  // Notifications
  notifications: NotificationItem[];
  unreadNotifsCount: number;
  markNotificationAsRead: (id: string) => void;
  markAllNotificationsAsRead: () => void;
  showNotificationsModal: boolean;
  setShowNotificationsModal: (show: boolean) => void;

  // Symptom Checker State
  symptomCheckerInitialQuery: string;
  setSymptomCheckerInitialQuery: (q: string) => void;

  // Toast / Feedback
  toastMessage: string | null;
  showToast: (msg: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeTab, setActiveTab] = useState<ActiveTab>('home');
  const [activeScreen, setActiveScreen] = useState<string | null>(null);

  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [selectedHospital, setSelectedHospital] = useState<Hospital | null>(null);
  const [selectedPrescription, setSelectedPrescription] = useState<DigitalPrescription | null>(null);
  const [selectedRecord, setSelectedRecord] = useState<MedicalRecord | null>(null);

  const [currentLocation, setCurrentLocation] = useState({
    city: 'Agartala',
    state: 'Tripura',
    area: 'Capital Complex',
  });
  const [showLocationModal, setShowLocationModal] = useState(false);
  const [currentLanguage, setCurrentLanguage] = useState('English');

  const [userProfile, setUserProfile] = useState<UserProfile>({
    id: 'usr-1',
    name: 'Uttam Das',
    phone: '+91 98765 43210',
    email: 'uttamdas542@gmail.com',
    city: 'Agartala',
    state: 'Tripura',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=200',
    language: 'English',
    age: 32,
    gender: 'Male',
    bloodGroup: 'B+',
    abhaId: '91-8842-9901-4431',
  });

  const [activePatientId, setActivePatientId] = useState<string>('usr-1');

  // Biometric Authentication State
  const [biometricSettings, setBiometricSettings] = useState<BiometricSettings>({
    isEnabled: false,
    biometricType: 'BOTH',
    protectRecords: true,
    protectPayment: true,
    protectProfile: false,
    fallbackPin: '1234',
    autoLockMinutes: 0,
    isVaultLocked: false,
    lastUnlockedAt: null,
  });

  const [biometricPrompt, setBiometricPrompt] = useState<BiometricPromptState | null>(null);

  // Partner Onboarding & Owner Admin State
  const [showOnboardingModal, setShowOnboardingModal] = useState(false);
  const [showAdminPortal, setShowAdminPortal] = useState(false);
  const [isOwnerAuthenticated, setIsOwnerAuthenticated] = useState(false);
  const [platformFeeSettings, setPlatformFeeSettings] = useState<PlatformFeeSettings>(
    INITIAL_PLATFORM_FEE_SETTINGS
  );
  const [onboardingRequests, setOnboardingRequests] = useState<DoctorOnboardingRequest[]>(
    INITIAL_ONBOARDING_REQUESTS
  );

  const [doctors, setDoctors] = useState<Doctor[]>(MOCK_DOCTORS);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSpecialtyFilter, setSelectedSpecialtyFilter] = useState<SpecialtyType | 'ALL'>('ALL');
  const [selectedTypeFilter, setSelectedTypeFilter] = useState<'ALL' | 'VIDEO' | 'IN_CLINIC'>('ALL');

  const [appointments, setAppointments] = useState<Appointment[]>(INITIAL_APPOINTMENTS);
  const [prescriptions, setPrescriptions] = useState<DigitalPrescription[]>(INITIAL_PRESCRIPTIONS);
  const [medicalRecords, setMedicalRecords] = useState<MedicalRecord[]>(INITIAL_MEDICAL_RECORDS);
  const [familyMembers, setFamilyMembers] = useState<FamilyMember[]>(INITIAL_FAMILY_MEMBERS);
  const [notifications, setNotifications] = useState<NotificationItem[]>(INITIAL_NOTIFICATIONS);

  const [showNotificationsModal, setShowNotificationsModal] = useState(false);
  const [symptomCheckerInitialQuery, setSymptomCheckerInitialQuery] = useState('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Receptionist Daily Roster Management State
  const [showReceptionistRosterModal, setShowReceptionistRosterModal] = useState(false);
  const [rosterDoctor, setRosterDoctor] = useState<Doctor | null>(null);
  const [rosterDate, setRosterDate] = useState<string>('Today, 24 Aug');

  // Booking Flow Draft State
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [bookingDraft, setBookingDraft] = useState<BookingDraft>({
    doctor: null,
    type: 'VIDEO',
    date: 'Today, 24 Aug',
    timeSlot: '04:30 PM',
    patientId: 'fam-1',
    patientName: 'Uttam Das',
    patientAge: 32,
    patientGender: 'Male',
    patientPhone: '+91 98765 43210',
    patientAddress: 'Capital Complex VIP Road, Sector 2, Agartala',
    relationship: 'Self',
    symptoms: '',
    fee: 399,
    doctorFee: 399,
    convenienceFee: 0,
    platformFee: 0,
    isPromoFree: true,
    total: 0,
  });

  // Telemedicine Active Call State
  const [activeCall, setActiveCall] = useState<ActiveCallState>({
    isActive: false,
    isConnecting: false,
    doctor: null,
    appointmentId: null,
    durationSeconds: 0,
    isMicMuted: false,
    isVideoOff: false,
    isSpeakerOn: true,
    activeChatDrawer: false,
    messages: [],
  });

  // Call timer effect
  useEffect(() => {
    let timer: any;
    if (activeCall.isActive && !activeCall.isConnecting) {
      timer = setInterval(() => {
        setActiveCall((prev) => ({ ...prev, durationSeconds: prev.durationSeconds + 1 }));
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [activeCall.isActive, activeCall.isConnecting]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3200);
  };

  // Biometrics Handlers
  const toggleBiometrics = (enable: boolean) => {
    setBiometricSettings((prev) => ({
      ...prev,
      isEnabled: enable,
      isVaultLocked: enable,
    }));
    if (enable) {
      showToast('Biometric lock enabled for Medical Vault & Prescriptions');
    } else {
      showToast('Biometric lock disabled');
    }
  };

  const updateBiometricSettings = (settings: Partial<BiometricSettings>) => {
    setBiometricSettings((prev) => ({ ...prev, ...settings }));
    showToast('Biometric preferences updated');
  };

  const lockVaultImmediately = () => {
    setBiometricSettings((prev) => ({
      ...prev,
      isVaultLocked: true,
    }));
    showToast('Medical Vault locked');
  };

  const unlockVaultBiometric = (
    method: 'FACE_ID' | 'FINGERPRINT' | 'PIN',
    pinInput?: string
  ): boolean => {
    if (method === 'PIN' && pinInput !== biometricSettings.fallbackPin) {
      return false;
    }
    setBiometricSettings((prev) => ({
      ...prev,
      isVaultLocked: false,
      lastUnlockedAt: Date.now(),
    }));
    return true;
  };

  const openBiometricPrompt = (options: {
    title?: string;
    subtitle?: string;
    mode?: 'FACE_ID' | 'FINGERPRINT' | 'PIN';
    onSuccess?: () => void;
    onCancel?: () => void;
  }) => {
    if (!biometricSettings.isEnabled || !biometricSettings.isVaultLocked) {
      if (options.onSuccess) options.onSuccess();
      return;
    }
    setBiometricPrompt({
      isOpen: true,
      title: options.title,
      subtitle: options.subtitle,
      mode: options.mode || (biometricSettings.biometricType === 'FACE_ID' ? 'FACE_ID' : 'FINGERPRINT'),
      onSuccess: options.onSuccess,
      onCancel: options.onCancel,
    });
  };

  const closeBiometricPrompt = () => {
    setBiometricPrompt(null);
  };

  // Owner Portal Authentication
  const loginOwner = (passcode: string): boolean => {
    if (passcode === '8899' || passcode.toLowerCase() === 'owner') {
      setIsOwnerAuthenticated(true);
      return true;
    }
    return false;
  };

  const logoutOwner = () => {
    setIsOwnerAuthenticated(false);
    showToast('Owner session locked');
  };

  // Partner Onboarding Application Handlers
  const submitDoctorOnboardingRequest = (
    data: Omit<DoctorOnboardingRequest, 'id' | 'status' | 'submittedDate'>
  ): DoctorOnboardingRequest => {
    const newReq: DoctorOnboardingRequest = {
      ...data,
      id: `req-${Date.now().toString().slice(-4)}`,
      status: 'PENDING',
      submittedDate: 'Today, 24 Aug 2026',
    };

    setOnboardingRequests((prev) => [newReq, ...prev]);

    // Send notification to admin/system
    const notif: NotificationItem = {
      id: `notif-${Date.now()}`,
      title: 'New Doctor Listing Request',
      message: `${data.applicantName} (${data.organizationName}) requested to add ${data.doctorName} for ${data.specialty}.`,
      time: 'Just now',
      dateGroup: 'TODAY',
      type: 'AVAILABILITY',
      read: false,
    };
    setNotifications((prev) => [notif, ...prev]);

    return newReq;
  };

  const approveDoctorOnboardingRequest = (requestId: string): Doctor | null => {
    const req = onboardingRequests.find((r) => r.id === requestId);
    if (!req) return null;

    const newDoctor: Doctor = {
      id: `doc-partner-${Date.now().toString().slice(-4)}`,
      name: req.doctorName,
      specialty: req.specialty,
      qualifications: req.qualifications,
      experienceYears: req.experienceYears,
      hospital: req.hospitalOrClinic,
      hospitalAddress: req.hospitalAddress,
      city: req.city,
      location: req.location || `${req.city}, Tripura`,
      languages: req.languages,
      rating: 4.8,
      reviewCount: 14,
      feeVideo: req.feeVideo,
      feeInClinic: req.feeInClinic,
      nextSlotVideo: req.nextSlotVideo || 'Today, 05:30 PM',
      nextSlotClinic: req.nextSlotClinic || 'Tomorrow, 10:00 AM',
      image: req.image,
      verified: true,
      isAvailableNow: true,
      gender: req.gender,
      about: req.about,
      education: [req.qualifications],
      specializations: req.specializations,
      registrationNumber: req.registrationNumber,
      availableForVideo: req.feeVideo > 0,
      availableForInClinic: true,
      weeklySchedule: createDoctorWeeklySchedule(
        (req.availableDays as ('Mon' | 'Tue' | 'Wed' | 'Thu' | 'Fri' | 'Sat' | 'Sun')[]) || ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
        req.feeVideo > 0,
        `${req.morningTimings}, ${req.eveningTimings}`
      ),
      reviews: [
        {
          id: 'rev-1',
          patientName: 'Verified Patient',
          rating: 5,
          date: 'Recent Visit',
          comment: 'Very attentive specialist, accurate diagnosis and caring advice.',
          verifiedVisit: true,
        },
      ],
    };

    // Add to live doctors list
    setDoctors((prev) => [newDoctor, ...prev]);

    // Update request status
    setOnboardingRequests((prev) =>
      prev.map((r) => (r.id === requestId ? { ...r, status: 'APPROVED' } : r))
    );

    // Add success notification
    const approvedNotif: NotificationItem = {
      id: `notif-${Date.now()}`,
      title: 'Doctor Listing Approved & Published',
      message: `${req.doctorName} (${req.specialty}) is now active in the SehatSetu directory for booking.`,
      time: 'Just now',
      dateGroup: 'TODAY',
      type: 'CONFIRMATION',
      read: false,
    };
    setNotifications((prev) => [approvedNotif, ...prev]);

    return newDoctor;
  };

  const rejectDoctorOnboardingRequest = (requestId: string, reason?: string) => {
    setOnboardingRequests((prev) =>
      prev.map((r) =>
        r.id === requestId
          ? {
              ...r,
              status: 'REJECTED',
              rejectionReason: reason || 'Application declined by administrator.',
            }
          : r
      )
    );
  };

  const updatePlatformFeeSettings = (settings: Partial<PlatformFeeSettings>) => {
    setPlatformFeeSettings((prev) => ({ ...prev, ...settings }));
    showToast('Platform fee preferences updated successfully');
  };

  const updateDoctorAvailability = (doctorId: string, isAvailable: boolean) => {
    setDoctors((prev) =>
      prev.map((d) => (d.id === doctorId ? { ...d, isAvailableNow: isAvailable } : d))
    );
  };

  const toggleDoctorVideoAllowed = (doctorId: string, allowed: boolean) => {
    setDoctors((prev) =>
      prev.map((d) => {
        if (d.id !== doctorId) return d;
        return {
          ...d,
          availableForVideo: allowed,
          weeklySchedule: d.weeklySchedule.map((s) => ({
            ...s,
            consultationTypes: allowed ? (['IN_CLINIC', 'VIDEO'] as ConsultationType[]) : (['IN_CLINIC'] as ConsultationType[]),
            videoTiming: allowed ? (s.videoTiming || '05:00 PM - 08:30 PM') : undefined,
          })),
        };
      })
    );
    showToast(`Doctor video consultation ${allowed ? 'enabled' : 'disabled'}`);
  };

  const updateDoctorSchedule = (doctorId: string, schedule: DaySchedule[]) => {
    setDoctors((prev) =>
      prev.map((d) => (d.id === doctorId ? { ...d, weeklySchedule: schedule } : d))
    );
    showToast('Doctor weekly schedule updated successfully');
  };

  const updateDoctorFees = (doctorId: string, feeVideo: number, feeInClinic: number) => {
    setDoctors((prev) =>
      prev.map((d) => (d.id === doctorId ? { ...d, feeVideo, feeInClinic } : d))
    );
  };

  const updateDoctorReceptionistDetails = (
    doctorId: string,
    receptionistName: string,
    receptionistPhone: string,
    receptionistEmail: string
  ) => {
    setDoctors((prev) =>
      prev.map((d) =>
        d.id === doctorId
          ? {
              ...d,
              receptionistName,
              receptionistPhone,
              receptionistEmail,
            }
          : d
      )
    );
    // If the currently selected roster doctor is updated, sync it
    if (rosterDoctor && rosterDoctor.id === doctorId) {
      setRosterDoctor((prev) =>
        prev
          ? {
              ...prev,
              receptionistName,
              receptionistPhone,
              receptionistEmail,
            }
          : null
      );
    }
    showToast('Receptionist contact information updated successfully');
  };

  const openDoctorRosterModal = (doctor: Doctor, date?: string) => {
    setRosterDoctor(doctor);
    if (date) {
      setRosterDate(date);
    }
    setShowReceptionistRosterModal(true);
  };

  const deleteDoctor = (doctorId: string) => {
    setDoctors((prev) => prev.filter((d) => d.id !== doctorId));
  };

  const addDoctorDirectly = (
    doctor: Omit<Doctor, 'id' | 'reviews' | 'reviewCount' | 'rating'>
  ): Doctor => {
    const newDoc: Doctor = {
      ...doctor,
      id: `doc-direct-${Date.now().toString().slice(-4)}`,
      receptionistName: doctor.receptionistName || 'Clinic Front Desk Assistant',
      receptionistPhone: doctor.receptionistPhone || '+91 98301 22450',
      receptionistEmail: doctor.receptionistEmail || `desk.${Date.now().toString().slice(-4)}@medpulse.in`,
      autoNotifyReceptionist: true,
      rating: 4.9,
      reviewCount: 6,
      reviews: [],
    };
    setDoctors((prev) => [newDoc, ...prev]);
    return newDoc;
  };

  // Booking handlers
  const startBooking = (doctor: Doctor, preferredType?: ConsultationType) => {
    // If doctor doesn't offer video, force in-clinic
    const resolvedType: ConsultationType =
      !doctor.availableForVideo && preferredType === 'VIDEO'
        ? 'IN_CLINIC'
        : preferredType || (doctor.availableForVideo ? 'VIDEO' : 'IN_CLINIC');

    const doctorFee = resolvedType === 'VIDEO' ? doctor.feeVideo : doctor.feeInClinic;
    const isPromo = platformFeeSettings.isPromoFreeMode || !platformFeeSettings.isEnabled;
    const platformFee = isPromo ? 0 : platformFeeSettings.feeAmount;

    setBookingDraft({
      doctor,
      type: resolvedType,
      date: 'Today, 24 Aug',
      timeSlot:
        resolvedType === 'VIDEO'
          ? doctor.nextSlotVideo.split(', ')[1] || '04:30 PM'
          : doctor.nextSlotClinic.split(', ')[1] || '10:00 AM',
      patientId: activePatientId,
      patientName: userProfile.name,
      patientAge: userProfile.age || 32,
      patientGender: userProfile.gender || 'Male',
      patientPhone: userProfile.phone || '+91 98765 43210',
      patientAddress: 'Capital Complex VIP Road, Sector 2, Agartala',
      relationship: 'Self',
      symptoms: '',
      fee: doctorFee,
      doctorFee,
      convenienceFee: platformFee,
      platformFee,
      isPromoFree: isPromo,
      total: platformFee, // Only platform fee is paid online (or ₹0 during promotion)
    });
    setIsBookingOpen(true);
  };

  const bookAppointment = (
    draft: BookingDraft,
    paymentMethod: 'UPI' | 'CARD' | 'NET_BANKING' | 'WALLET' | 'CASH_AT_CLINIC'
  ): Appointment => {
    const doc = draft.doctor || doctors[0] || MOCK_DOCTORS[0];
    const isPromo = draft.isPromoFree || draft.platformFee === 0;

    // Calculate sequential serial number maintaining daily booking queue order
    const serialNumber = calculateDoctorDaySerialNumber(appointments, doc.id, draft.date);
    const token = generateDoctorTokenString(doc, serialNumber);

    const receptionistName = doc.receptionistName || 'Clinic Front Desk Manager';
    const receptionistPhone = doc.receptionistPhone || '+91 98301 22450';

    const newApt: Appointment = {
      id: `apt-${Date.now().toString().slice(-4)}`,
      doctorId: doc.id,
      doctorName: doc.name,
      doctorSpecialty: doc.specialty,
      doctorImage: doc.image,
      doctorHospital: doc.hospital,
      doctorHospitalAddress: doc.hospitalAddress,
      patientName: draft.patientName,
      patientAge: draft.patientAge,
      patientGender: draft.patientGender,
      patientPhone: draft.patientPhone,
      patientAddress: draft.patientAddress || 'Capital Complex, Agartala',
      relationshipToUser: draft.relationship,
      type: draft.type,
      date: draft.date,
      timeSlot: draft.timeSlot,
      status: 'UPCOMING',
      serialNumber,
      fee: draft.doctorFee || draft.fee,
      doctorFeePayableAtClinic: draft.doctorFee || draft.fee,
      platformFee: draft.platformFee,
      platformFeeStatus: isPromo ? 'WAIVED_PROMO' : 'PAID_VIA_UPI',
      totalPaid: draft.total,
      tokenNumber: token,
      paymentMethod,
      paymentId:
        draft.upiRefNumber ||
        `${paymentMethod}/SEHAT/${Math.floor(1000000000 + Math.random() * 9000000000)}`,
      symptoms: draft.symptoms || 'General consultation request',
      receptionistNotifiedWhatsApp: true,
      receptionistNotifiedEmail: true,
      receptionistContactPhone: receptionistPhone,
      receptionistContactName: receptionistName,
      createdDate: 'Today, 24 Aug 2026',
    };

    setAppointments((prev) => [newApt, ...prev]);

    // 1. Add patient confirmation notification
    const patientNotif: NotificationItem = {
      id: `notif-${Date.now()}`,
      title: 'Appointment Booked Successfully',
      message: `${draft.type === 'VIDEO' ? 'Video consultation' : 'Clinic visit'} with ${doc.name} confirmed for ${draft.date} at ${draft.timeSlot} (Queue Serial #${serialNumber}, Token: ${token}). Visiting fee ₹${draft.doctorFee || draft.fee} payable at clinic.`,
      time: 'Just now',
      dateGroup: 'TODAY',
      type: 'CONFIRMATION',
      read: false,
      appointmentId: newApt.id,
    };

    // 2. Add automated receptionist dispatch log notification
    const receptionistDispatchNotif: NotificationItem = {
      id: `notif-disp-${Date.now()}`,
      title: `📲 Daily Roster Dispatched: Serial #${serialNumber}`,
      message: `Patient ${draft.patientName} (Contact: ${draft.patientPhone}, Serial #${serialNumber}) automatically added to Dr. ${doc.name}'s daily schedule manifest. Roster dispatched to Receptionist ${receptionistName} (${receptionistPhone}) via WhatsApp & Email.`,
      time: 'Just now',
      dateGroup: 'TODAY',
      type: 'CONFIRMATION',
      read: false,
      appointmentId: newApt.id,
    };

    setNotifications((prev) => [receptionistDispatchNotif, patientNotif, ...prev]);
    showToast(`Appointment confirmed! Token ${token} (Queue Serial #${serialNumber}) dispatched to Dr. ${doc.name}'s receptionist desk.`);
    return newApt;
  };

  const cancelAppointment = (id: string) => {
    setAppointments((prev) =>
      prev.map((apt) => (apt.id === id ? { ...apt, status: 'CANCELLED' } : apt))
    );
    showToast('Appointment cancelled successfully');
  };

  const rescheduleAppointment = (id: string, newDate: string, newTime: string) => {
    setAppointments((prev) =>
      prev.map((apt) => (apt.id === id ? { ...apt, date: newDate, timeSlot: newTime } : apt))
    );
    showToast('Appointment rescheduled successfully');
  };

  // Instant Telemedicine Call Flow
  const startInstantConsultation = (doctor?: Doctor) => {
    const assignedDoctor =
      doctor || doctors.find((d) => d.isAvailableNow) || doctors[0] || MOCK_DOCTORS[0];
    setActiveCall({
      isActive: true,
      isConnecting: true,
      doctor: assignedDoctor,
      appointmentId: `apt-instant-${Date.now().toString().slice(-4)}`,
      durationSeconds: 0,
      isMicMuted: false,
      isVideoOff: false,
      isSpeakerOn: true,
      activeChatDrawer: false,
      messages: [
        {
          id: 'msg-1',
          sender: 'doctor',
          text: `Namaskar Uttam. I am ${assignedDoctor.name}. How are you feeling today? Please describe what symptoms you are experiencing.`,
          time: 'Just now',
        },
      ],
    });

    setTimeout(() => {
      setActiveCall((prev) => ({ ...prev, isConnecting: false }));
    }, 2800);
  };

  const endCall = () => {
    const activeDoc = activeCall.doctor || doctors[0] || MOCK_DOCTORS[0];
    const newRxId = `rx-${Date.now().toString().slice(-4)}`;

    const newPrescription: DigitalPrescription = {
      id: newRxId,
      appointmentId: activeCall.appointmentId || 'apt-recent',
      doctorName: activeDoc.name,
      doctorSpecialty: activeDoc.specialty,
      doctorQualifications: activeDoc.qualifications,
      doctorRegNumber: activeDoc.registrationNumber,
      doctorHospital: activeDoc.hospital,
      patientName: userProfile.name,
      patientAge: 32,
      patientGender: 'Male',
      date: 'Today, 24 Aug 2026',
      diagnosis: 'Acute Symptomatic Management & Telehealth Review',
      symptomsRecorded: 'Patient consulted via instant video call for seasonal malaise and discomfort.',
      medicines: [
        {
          id: `med-${Date.now()}-1`,
          name: 'Tab. Paracetamol 650mg',
          dosage: '650mg',
          frequency: '1-0-1 (After Food)',
          duration: '3 Days',
          instructions: 'Take if temperature exceeds 99°F or headache occurs.',
        },
        {
          id: `med-${Date.now()}-2`,
          name: 'Tab. Vitamin C + Zinc (Limcee)',
          dosage: '500mg',
          frequency: '1-0-0 (Morning)',
          duration: '10 Days',
          instructions: 'Chewable tablet with water.',
        },
      ],
      advice: [
        'Drink plenty of warm liquids.',
        'Adequate rest for the next 24-48 hours.',
        'Follow up if symptoms do not improve in 3 days.',
      ],
      followUpIn: 'After 3 days if required',
    };

    setPrescriptions((prev) => [newPrescription, ...prev]);

    const completedApt: Appointment = {
      id: activeCall.appointmentId || `apt-${Date.now()}`,
      doctorId: activeDoc.id,
      doctorName: activeDoc.name,
      doctorSpecialty: activeDoc.specialty,
      doctorImage: activeDoc.image,
      doctorHospital: activeDoc.hospital,
      doctorHospitalAddress: activeDoc.hospitalAddress,
      patientName: userProfile.name,
      patientAge: 32,
      patientGender: 'Male',
      patientPhone: userProfile.phone,
      patientAddress: 'Capital Complex VIP Road, Agartala',
      relationshipToUser: 'Self',
      type: 'VIDEO',
      date: 'Today, 24 Aug',
      timeSlot: 'Instant Call',
      status: 'COMPLETED',
      serialNumber: calculateDoctorDaySerialNumber(appointments, activeDoc.id, 'Today, 24 Aug'),
      fee: activeDoc.feeVideo,
      totalPaid: platformFeeSettings.feeAmount,
      doctorFeePayableAtClinic: activeDoc.feeInClinic,
      platformFee: platformFeeSettings.feeAmount,
      platformFeeStatus: platformFeeSettings.feeAmount === 0 ? 'WAIVED_PROMO' : 'PAID_VIA_UPI',
      tokenNumber: `TK-${Math.floor(100 + Math.random() * 900)}`,
      paymentMethod: 'UPI',
      paymentId: `UPI/SEHAT/${Math.floor(1000000000 + Math.random() * 9000000000)}`,
      prescriptionId: newRxId,
      createdDate: 'Today, 24 Aug 2026',
    };

    setAppointments((prev) => [completedApt, ...prev]);

    const newRecord: MedicalRecord = {
      id: `rec-${Date.now()}`,
      title: `Prescription - ${activeDoc.name}`,
      type: 'PRESCRIPTION',
      date: 'Today, 24 Aug 2026',
      doctorOrLab: `${activeDoc.name} (${activeDoc.hospital})`,
      patientName: userProfile.name,
      fileSize: '190 KB',
      fileType: 'PDF',
      summary: `Telehealth consult prescription generated with ${activeDoc.name}.`,
      tags: ['Prescription', activeDoc.specialty, 'Telehealth'],
    };
    setMedicalRecords((prev) => [newRecord, ...prev]);

    setActiveCall({
      isActive: false,
      isConnecting: false,
      doctor: null,
      appointmentId: null,
      durationSeconds: 0,
      isMicMuted: false,
      isVideoOff: false,
      isSpeakerOn: true,
      activeChatDrawer: false,
      messages: [],
    });

    setSelectedPrescription(newPrescription);
    showToast('Consultation ended. Digital prescription generated!');
  };

  const toggleMic = () => {
    setActiveCall((prev) => ({ ...prev, isMicMuted: !prev.isMicMuted }));
  };

  const toggleVideo = () => {
    setActiveCall((prev) => ({ ...prev, isVideoOff: !prev.isVideoOff }));
  };

  const toggleSpeaker = () => {
    setActiveCall((prev) => ({ ...prev, isSpeakerOn: !prev.isSpeakerOn }));
  };

  const toggleCallChat = (open?: boolean) => {
    setActiveCall((prev) => ({
      ...prev,
      activeChatDrawer: open !== undefined ? open : !prev.activeChatDrawer,
    }));
  };

  const sendCallMessage = (text: string, attachmentName?: string) => {
    const newMsg = {
      id: `msg-${Date.now()}`,
      sender: 'patient' as const,
      text,
      time: 'Just now',
      attachmentName,
    };
    setActiveCall((prev) => ({
      ...prev,
      messages: [...prev.messages, newMsg],
    }));

    setTimeout(() => {
      const docReply = {
        id: `msg-${Date.now() + 1}`,
        sender: 'doctor' as const,
        text: attachmentName
          ? `I have received the ${attachmentName}. Reviewing it now.`
          : 'Understood. Let me make a note of this in your prescription.',
        time: 'Just now',
      };
      setActiveCall((prev) => ({
        ...prev,
        messages: [...prev.messages, docReply],
      }));
    }, 2000);
  };

  const addMedicalRecord = (record: Omit<MedicalRecord, 'id'>) => {
    const newRec: MedicalRecord = {
      ...record,
      id: `rec-${Date.now()}`,
    };
    setMedicalRecords((prev) => [newRec, ...prev]);
    showToast('Medical record securely saved');
  };

  const addFamilyMember = (member: Omit<FamilyMember, 'id' | 'recordsCount'>) => {
    const newFam: FamilyMember = {
      ...member,
      id: `fam-${Date.now()}`,
      recordsCount: 0,
    };
    setFamilyMembers((prev) => [...prev, newFam]);
    showToast(`${member.name} added to family members`);
  };

  const deleteFamilyMember = (id: string) => {
    setFamilyMembers((prev) => prev.filter((f) => f.id !== id));
    showToast('Family member removed');
  };

  const markNotificationAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const markAllNotificationsAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    showToast('All notifications marked as read');
  };

  const unreadNotifsCount = notifications.filter((n) => !n.read).length;

  const user = {
    id: userProfile.id || 'usr-1',
    name: userProfile.name,
    phone: userProfile.phone,
    email: userProfile.email,
    city: currentLocation.city,
    state: currentLocation.state,
    image: userProfile.avatar,
    avatar: userProfile.avatar,
    age: userProfile.age || 32,
    gender: userProfile.gender || 'Male',
    bloodGroup: userProfile.bloodGroup || 'B+',
    abhaId: userProfile.abhaId || '91-8842-9901-4431',
    medicalRecords,
    familyMembers,
  };

  return (
    <AppContext.Provider
      value={{
        activeTab,
        setActiveTab,
        activeScreen,
        setActiveScreen,
        selectedDoctor,
        setSelectedDoctor,
        selectedHospital,
        setSelectedHospital,
        selectedPrescription,
        setSelectedPrescription,
        selectedRecord,
        setSelectedRecord,
        userProfile,
        setUserProfile,
        user,
        activePatientId,
        setActivePatientId,
        currentLocation,
        setCurrentLocation,
        showLocationModal,
        setShowLocationModal,
        currentLanguage,
        setCurrentLanguage,
        biometricSettings,
        biometricPrompt,
        openBiometricPrompt,
        closeBiometricPrompt,
        toggleBiometrics,
        updateBiometricSettings,
        lockVaultImmediately,
        unlockVaultBiometric,
        showOnboardingModal,
        setShowOnboardingModal,
        onboardingRequests,
        submitDoctorOnboardingRequest,
        approveDoctorOnboardingRequest,
        rejectDoctorOnboardingRequest,
        showAdminPortal,
        setShowAdminPortal,
        isOwnerAuthenticated,
        loginOwner,
        logoutOwner,
        platformFeeSettings,
        updatePlatformFeeSettings,
        doctors,
        searchQuery,
        setSearchQuery,
        selectedSpecialtyFilter,
        setSelectedSpecialtyFilter,
        selectedTypeFilter,
        setSelectedTypeFilter,
        updateDoctorAvailability,
        toggleDoctorVideoAllowed,
        updateDoctorSchedule,
        updateDoctorFees,
        updateDoctorReceptionistDetails,
        deleteDoctor,
        addDoctorDirectly,
        showReceptionistRosterModal,
        setShowReceptionistRosterModal,
        rosterDoctor,
        setRosterDoctor,
        rosterDate,
        setRosterDate,
        openDoctorRosterModal,
        appointments,
        bookAppointment,
        cancelAppointment,
        rescheduleAppointment,
        bookingDraft,
        setBookingDraft,
        startBooking,
        isBookingOpen,
        setIsBookingOpen,
        activeCall,
        startInstantConsultation,
        endCall,
        toggleMic,
        toggleVideo,
        toggleSpeaker,
        toggleCallChat,
        sendCallMessage,
        prescriptions,
        medicalRecords,
        addMedicalRecord,
        familyMembers,
        addFamilyMember,
        deleteFamilyMember,
        notifications,
        unreadNotifsCount,
        markNotificationAsRead,
        markAllNotificationsAsRead,
        showNotificationsModal,
        setShowNotificationsModal,
        symptomCheckerInitialQuery,
        setSymptomCheckerInitialQuery,
        toastMessage,
        showToast,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
