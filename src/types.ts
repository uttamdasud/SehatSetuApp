export type SpecialtyType =
  | 'General Physician'
  | 'Child Specialist'
  | 'Gynecologist'
  | 'Dermatologist'
  | 'Orthopedic'
  | 'Cardiologist'
  | 'Neurologist'
  | 'ENT'
  | 'Eye Specialist'
  | 'Dentist'
  | 'Gastroenterologist'
  | 'Urologist'
  | 'Nephrologist'
  | 'Pulmonologist'
  | 'Endocrinologist/Diabetologist'
  | 'Psychiatrist'
  | 'General Surgeon'
  | 'Oncologist'
  | 'Physiotherapist'
  | 'Other Specialists'
  | 'Pediatrician'
  | 'Ayurveda';

export type QualificationDegree = 'MBBS' | 'MD' | 'MS' | 'DNB' | 'DM' | 'MCh';
export const QUALIFICATION_OPTIONS: QualificationDegree[] = ['MBBS', 'MD', 'MS', 'DNB', 'DM', 'MCh'];

export interface DaySchedule {
  day: 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday' | 'Sunday';
  shortDay: 'Mon' | 'Tue' | 'Wed' | 'Thu' | 'Fri' | 'Sat' | 'Sun';
  isAvailable: boolean;
  clinicTiming: string; // e.g. "09:00 AM - 01:00 PM, 04:30 PM - 07:30 PM"
  videoTiming?: string; // e.g. "05:00 PM - 08:00 PM"
  morningSlots: string[];
  afternoonSlots: string[];
  eveningSlots: string[];
  consultationTypes: ConsultationType[]; // ['IN_CLINIC'] or ['IN_CLINIC', 'VIDEO']
  notes?: string;
}

export interface DoctorReview {
  id: string;
  patientName: string;
  rating: number;
  date: string;
  comment: string;
  verifiedVisit: boolean;
}

export interface Doctor {
  id: string;
  name: string;
  specialty: SpecialtyType;
  qualifications: string;
  experienceYears: number;
  hospital: string;
  hospitalAddress: string;
  city: string;
  location: string;
  languages: string[];
  rating: number;
  reviewCount: number;
  feeVideo: number;
  feeInClinic: number;
  availableForVideo: boolean; // whether doctor offers video consultation or in-clinic only
  availableForInClinic: boolean; // default true
  weeklySchedule: DaySchedule[]; // 7-day schedule Mon-Sun
  nextSlotVideo: string;
  nextSlotClinic: string;
  image: string;
  verified: boolean;
  isAvailableNow: boolean;
  gender: 'Male' | 'Female';
  about: string;
  education: string[];
  specializations: string[];
  registrationNumber: string;
  receptionistName?: string; // Clinic desk / receptionist managing doctor's schedule
  receptionistPhone?: string; // WhatsApp enabled phone for automated manifest delivery
  receptionistEmail?: string; // Clinic email for daily schedule roster
  autoNotifyReceptionist?: boolean; // Default true: sends automated whole day booking roster
  reviews: DoctorReview[];
}

export type ConsultationType = 'VIDEO' | 'IN_CLINIC';

export type AppointmentStatus = 'UPCOMING' | 'COMPLETED' | 'CANCELLED';

export interface PlatformFeeSettings {
  isEnabled: boolean; // Owner toggle (active / disabled)
  feeAmount: number; // e.g. 0 (Free Promo), 10, 20, 30, etc.
  isPromoFreeMode: boolean; // currently true for Free Promotion!
  ownerUpiId: string; // e.g. "uttamdas542@okhdfcbank" or "sehatsetu@upi"
  ownerPayeeName: string; // e.g. "SehatSetu Medical Network"
  promoOfferTagline: string; // "Free Promotional Launch - ₹0 Booking Fee"
}

export interface Appointment {
  id: string;
  doctorId: string;
  doctorName: string;
  doctorSpecialty: string;
  doctorImage: string;
  doctorHospital: string;
  doctorHospitalAddress: string;
  patientName: string;
  patientAge: number;
  patientGender: string;
  patientPhone: string;
  patientAddress?: string; // Patient address / locality (optional)
  relationshipToUser: string;
  type: ConsultationType;
  date: string;
  timeSlot: string;
  status: AppointmentStatus;
  serialNumber: number; // Queue Serial Number for the doctor on this day (#1, #2, #3...)
  fee: number; // Doctor visiting fee (paid at clinic upon visit)
  doctorFeePayableAtClinic: number; // Doctor's consultation fee to be paid in-person
  platformFee: number; // App owner convenience fee (₹0 promo or ₹10/₹20)
  platformFeeStatus: 'WAIVED_PROMO' | 'PAID_VIA_UPI' | 'FREE';
  totalPaid: number; // Total paid online through app (usually ₹0 in promo, or platform fee)
  tokenNumber: string; // e.g. "TK-402" or "#DEB-01"
  paymentMethod: 'UPI' | 'CARD' | 'NET_BANKING' | 'WALLET' | 'CASH_AT_CLINIC';
  paymentId: string;
  upiRefNumber?: string;
  symptoms?: string;
  prescriptionId?: string;
  receptionistNotifiedWhatsApp?: boolean;
  receptionistNotifiedEmail?: boolean;
  receptionistContactPhone?: string;
  receptionistContactName?: string;
  createdDate: string;
}

export interface PrescribedMedicine {
  id: string;
  name: string;
  dosage: string;
  frequency: string; // e.g. "1-0-1 (After Food)"
  duration: string; // e.g. "5 Days"
  instructions: string;
}

export interface DigitalPrescription {
  id: string;
  appointmentId: string;
  doctorName: string;
  doctorSpecialty: string;
  doctorQualifications: string;
  doctorRegNumber: string;
  doctorHospital: string;
  patientName: string;
  patientAge: number;
  patientGender: string;
  date: string;
  diagnosis: string;
  symptomsRecorded: string;
  medicines: PrescribedMedicine[];
  advice: string[];
  followUpIn: string;
}

export type RecordType = 'PRESCRIPTION' | 'LAB_REPORT' | 'MEDICAL_DOC' | 'CONSULTATION';

export interface MedicalRecord {
  id: string;
  title: string;
  type: RecordType;
  date: string;
  doctorOrLab: string;
  patientName: string;
  fileSize: string;
  fileType: 'PDF' | 'IMAGE';
  summary: string;
  tags: string[];
}

export interface FamilyMember {
  id: string;
  name: string;
  relationship: 'Self' | 'Father' | 'Mother' | 'Spouse' | 'Child' | 'Sibling' | 'Other';
  age: number;
  gender: 'Male' | 'Female' | 'Other';
  phone: string;
  bloodGroup: string;
  allergies: string;
  recordsCount: number;
}

export interface Hospital {
  id: string;
  name: string;
  image: string;
  address: string;
  city: string;
  rating: number;
  reviewsCount: number;
  departments: string[];
  doctorsCount: number;
  openingHours: string;
  emergencyAvailable: boolean;
  phone: string;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  time: string;
  dateGroup: 'TODAY' | 'YESTERDAY' | 'EARLIER';
  type: 'REMINDER' | 'CONFIRMATION' | 'PRESCRIPTION' | 'AVAILABILITY' | 'PAYMENT' | 'FOLLOWUP';
  read: boolean;
  appointmentId?: string;
  prescriptionId?: string;
}

export type UrgencyLevel = 'ROUTINE' | 'SOON' | 'URGENT' | 'EMERGENCY';

export interface SymptomAnalysisResult {
  category: SpecialtyType | 'General Physician';
  urgency: UrgencyLevel;
  whyAppropriate: string;
  recommendedTimeframe: string;
  isEmergency: boolean;
  emergencyAdvice?: string;
  suggestedAction: string;
  relevantQuestions?: string[];
  matchedDoctors: Doctor[];
}

export interface UserProfile {
  id: string;
  name: string;
  phone: string;
  email: string;
  city: string;
  state: string;
  avatar: string;
  language: string;
  age: number;
  gender: 'Male' | 'Female' | 'Other';
  bloodGroup: string;
  abhaId: string;
}

export interface BiometricSettings {
  isEnabled: boolean;
  biometricType: 'FINGERPRINT' | 'FACE_ID' | 'BOTH';
  protectRecords: boolean;
  protectPayment: boolean;
  protectProfile: boolean;
  fallbackPin: string;
  autoLockMinutes: number;
  isVaultLocked: boolean;
  lastUnlockedAt: number | null;
}

export type ApplicantType = 'DOCTOR' | 'PHARMACY' | 'CLINIC' | 'HOSPITAL';

export interface DoctorOnboardingRequest {
  id: string;
  applicantType: ApplicantType;
  applicantName: string;
  organizationName: string;
  contactEmail: string;
  contactPhone: string;
  doctorName: string;
  specialty: SpecialtyType;
  qualifications: string;
  experienceYears: number;
  registrationNumber: string;
  hospitalOrClinic: string;
  hospitalAddress: string;
  city: string;
  location: string;
  languages: string[];
  feeVideo: number;
  feeInClinic: number;
  availableForVideo: boolean;
  availableForInClinic: boolean;
  availableDays: string[];
  morningTimings: string;
  eveningTimings: string;
  nextSlotVideo: string;
  nextSlotClinic: string;
  about: string;
  specializations: string[];
  gender: 'Male' | 'Female';
  image: string;
  receptionistName?: string;
  receptionistPhone?: string;
  receptionistEmail?: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  submittedDate: string;
  rejectionReason?: string;
  adminNotes?: string;
}

export type ActiveTab = 'home' | 'find-doctors' | 'appointments' | 'consultations' | 'profile';
