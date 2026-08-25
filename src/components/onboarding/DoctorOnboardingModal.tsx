import React, { useState } from 'react';
import {
  X,
  Building2,
  Stethoscope,
  Clock,
  IndianRupee,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
  MapPin,
  FileCheck,
  Calendar,
  Languages,
  UserCheck,
  Store,
  Hospital as HospitalIcon,
  Upload,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { SpecialtyType, ApplicantType } from '../../types';
import { SPECIALTIES, INDIAN_CITIES } from '../../data/mockData';

const DOCTOR_AVATAR_PRESETS = [
  {
    name: 'Male Doctor 1',
    url: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=600',
  },
  {
    name: 'Female Doctor 1',
    url: 'https://images.unsplash.com/photo-1594824813583-1496a77d54b4?auto=format&fit=crop&q=80&w=600',
  },
  {
    name: 'Male Doctor 2',
    url: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&q=80&w=600',
  },
  {
    name: 'Female Doctor 2',
    url: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=600',
  },
];

export const DoctorOnboardingModal: React.FC = () => {
  const {
    showOnboardingModal,
    setShowOnboardingModal,
    submitDoctorOnboardingRequest,
    showToast,
  } = useApp();

  const [step, setStep] = useState<'FORM' | 'SUCCESS'>('FORM');
  const [submittedRequestId, setSubmittedRequestId] = useState<string>('');

  // Form State
  const [applicantType, setApplicantType] = useState<ApplicantType>('PHARMACY');
  const [applicantName, setApplicantName] = useState('Sujit Bhowmik');
  const [organizationName, setOrganizationName] = useState('Tripura Medicos & Wellness Clinic');
  const [contactEmail, setContactEmail] = useState('partner@tripuramedicos.in');
  const [contactPhone, setContactPhone] = useState('+91 94361 20099');

  // Doctor Details
  const [doctorName, setDoctorName] = useState('Dr. Kaushik Saha');
  const [gender, setGender] = useState<'Male' | 'Female'>('Male');
  const [specialty, setSpecialty] = useState<SpecialtyType>('ENT');
  const [qualifications, setQualifications] = useState('MBBS, MS (ENT), DLO');
  const [experienceYears, setExperienceYears] = useState(11);
  const [registrationNumber, setRegistrationNumber] = useState('MCI-TR-88421');
  const [hospitalOrClinic, setHospitalOrClinic] = useState('Tripura Medicos Care Clinic');
  const [hospitalAddress, setHospitalAddress] = useState('Akhaura Road, Banamalipur, Agartala, Tripura');
  const [city, setCity] = useState('Agartala');
  const [location, setLocation] = useState('Banamalipur, Agartala');

  // Fees & Timings
  const [feeVideo, setFeeVideo] = useState(349);
  const [feeInClinic, setFeeInClinic] = useState(450);
  const [availableDays, setAvailableDays] = useState<string[]>(['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']);
  const [morningTimings, setMorningTimings] = useState('09:30 AM - 01:00 PM');
  const [eveningTimings, setEveningTimings] = useState('05:30 PM - 08:30 PM');
  const [selectedImage, setSelectedImage] = useState(DOCTOR_AVATAR_PRESETS[0].url);
  const [languages, setLanguages] = useState<string[]>(['English', 'Bengali', 'Hindi']);
  const [about, setAbout] = useState(
    'Specialist surgeon with extensive experience in outpatient consultations, microsurgeries, and preventive care.'
  );
  const [specializationsText, setSpecializationsText] = useState(
    'Endoscopic Procedures, Pediatric Care, Chronic Management, Emergency Triage'
  );

  if (!showOnboardingModal) return null;

  const handleDayToggle = (day: string) => {
    if (availableDays.includes(day)) {
      if (availableDays.length > 1) {
        setAvailableDays(availableDays.filter((d) => d !== day));
      }
    } else {
      setAvailableDays([...availableDays, day]);
    }
  };

  const handleLanguageToggle = (lang: string) => {
    if (languages.includes(lang)) {
      if (languages.length > 1) {
        setLanguages(languages.filter((l) => l !== lang));
      }
    } else {
      setLanguages([...languages, lang]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!doctorName.trim() || !registrationNumber.trim() || !hospitalOrClinic.trim()) {
      showToast('Please fill all mandatory fields including Doctor Name and MCI Reg Number');
      return;
    }

    const specializationsArray = specializationsText
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

    const newReq = submitDoctorOnboardingRequest({
      applicantType,
      applicantName,
      organizationName,
      contactEmail,
      contactPhone,
      doctorName: doctorName.startsWith('Dr.') ? doctorName : `Dr. ${doctorName}`,
      specialty,
      qualifications,
      experienceYears: Number(experienceYears) || 5,
      registrationNumber,
      hospitalOrClinic,
      hospitalAddress,
      city,
      location,
      languages,
      feeVideo: Number(feeVideo) || 300,
      feeInClinic: Number(feeInClinic) || 400,
      availableDays,
      morningTimings,
      eveningTimings,
      nextSlotVideo: 'Today, 05:30 PM',
      nextSlotClinic: 'Tomorrow, 10:00 AM',
      about,
      specializations: specializationsArray.length > 0 ? specializationsArray : [specialty],
      gender,
      image: selectedImage,
    });

    setSubmittedRequestId(newReq.id);
    setStep('SUCCESS');
    showToast('Application submitted for Owner Review!');
  };

  return (
    <div
      id="doctor-onboarding-modal"
      className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-3 animate-in fade-in duration-200"
    >
      <div className="w-full max-w-lg bg-white rounded-3xl shadow-2xl max-h-[92vh] flex flex-col overflow-hidden border border-slate-200 animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-800 to-teal-900 text-white p-4 shrink-0 flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="w-9 h-9 rounded-xl bg-white/15 flex items-center justify-center text-emerald-200">
              <Stethoscope className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold font-heading">Partner Network Onboarding</h3>
              <p className="text-[11px] text-emerald-200">Request to Add / List a Specialist Doctor</p>
            </div>
          </div>

          <button
            id="close-onboarding-modal-btn"
            onClick={() => setShowOnboardingModal(false)}
            className="p-1.5 text-white/80 hover:text-white rounded-full hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        {step === 'FORM' ? (
          <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-4 space-y-4 text-xs">
            {/* Applicant Category Selector */}
            <div className="space-y-1.5">
              <label className="font-bold text-slate-800 uppercase tracking-wider text-[10px]">
                I am applying as:
              </label>
              <div className="grid grid-cols-4 gap-1.5">
                {[
                  { type: 'PHARMACY' as ApplicantType, label: 'Pharmacy', icon: Store },
                  { type: 'DOCTOR' as ApplicantType, label: 'Doctor', icon: Stethoscope },
                  { type: 'CLINIC' as ApplicantType, label: 'Clinic', icon: Building2 },
                  { type: 'HOSPITAL' as ApplicantType, label: 'Hospital', icon: HospitalIcon },
                ].map(({ type, label, icon: Icon }) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => setApplicantType(type)}
                    className={`py-2 px-1 rounded-xl border flex flex-col items-center justify-center space-y-1 transition-all ${
                      applicantType === type
                        ? 'bg-emerald-50 border-emerald-600 text-emerald-900 font-bold ring-1 ring-emerald-500 shadow-2xs'
                        : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span className="text-[10px]">{label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Applicant Submitter Info */}
            <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 space-y-2.5">
              <div className="font-bold text-slate-800 text-[11px] flex items-center justify-between">
                <span>1. Partner & Contact Details</span>
                <span className="text-[10px] text-emerald-800 font-semibold bg-emerald-100/70 px-2 py-0.5 rounded-md">
                  Required
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[10px] font-semibold text-slate-600 block mb-0.5">Your Name</label>
                  <input
                    type="text"
                    required
                    value={applicantName}
                    onChange={(e) => setApplicantName(e.target.value)}
                    placeholder="e.g. Sujit Bhowmik"
                    className="w-full p-2 bg-white border border-slate-200 rounded-xl text-slate-900 focus:ring-2 focus:ring-emerald-700"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-semibold text-slate-600 block mb-0.5">
                    {applicantType === 'PHARMACY'
                      ? 'Pharmacy / Store Name'
                      : applicantType === 'DOCTOR'
                      ? 'Private Practice / Clinic'
                      : 'Hospital / Clinic Name'}
                  </label>
                  <input
                    type="text"
                    required
                    value={organizationName}
                    onChange={(e) => setOrganizationName(e.target.value)}
                    placeholder="e.g. Tripura Medicos"
                    className="w-full p-2 bg-white border border-slate-200 rounded-xl text-slate-900 focus:ring-2 focus:ring-emerald-700"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[10px] font-semibold text-slate-600 block mb-0.5">Contact Email</label>
                  <input
                    type="email"
                    required
                    value={contactEmail}
                    onChange={(e) => setContactEmail(e.target.value)}
                    placeholder="partner@clinic.in"
                    className="w-full p-2 bg-white border border-slate-200 rounded-xl text-slate-900 focus:ring-2 focus:ring-emerald-700"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-semibold text-slate-600 block mb-0.5">Phone Number</label>
                  <input
                    type="tel"
                    required
                    value={contactPhone}
                    onChange={(e) => setContactPhone(e.target.value)}
                    placeholder="+91 94361 20099"
                    className="w-full p-2 bg-white border border-slate-200 rounded-xl text-slate-900 focus:ring-2 focus:ring-emerald-700"
                  />
                </div>
              </div>
            </div>

            {/* Doctor Profile Details */}
            <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 space-y-2.5">
              <div className="font-bold text-slate-800 text-[11px]">2. Doctor Credentials & Specialty</div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[10px] font-semibold text-slate-600 block mb-0.5">Doctor Full Name</label>
                  <input
                    type="text"
                    required
                    value={doctorName}
                    onChange={(e) => setDoctorName(e.target.value)}
                    placeholder="Dr. Kaushik Saha"
                    className="w-full p-2 bg-white border border-slate-200 rounded-xl text-slate-900 font-semibold focus:ring-2 focus:ring-emerald-700"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-semibold text-slate-600 block mb-0.5">Specialist Category</label>
                  <select
                    value={specialty}
                    onChange={(e) => setSpecialty(e.target.value as SpecialtyType)}
                    className="w-full p-2 bg-white border border-slate-200 rounded-xl text-slate-900 font-semibold focus:ring-2 focus:ring-emerald-700"
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
                  <div className="flex items-center justify-between mb-0.5">
                    <label className="text-[10px] font-semibold text-slate-600">
                      Medical Qualifications / Degrees
                    </label>
                  </div>
                  <input
                    type="text"
                    required
                    value={qualifications}
                    onChange={(e) => setQualifications(e.target.value)}
                    placeholder="MBBS, MD, MS, DNB..."
                    className="w-full p-2 bg-white border border-slate-200 rounded-xl text-slate-900 focus:ring-2 focus:ring-emerald-700"
                  />
                  <div className="flex flex-wrap gap-1 mt-1.5">
                    {(['MBBS', 'MD', 'MS', 'DNB', 'DM', 'MCh'] as const).map((deg) => (
                      <button
                        type="button"
                        key={deg}
                        onClick={() => {
                          if (qualifications.includes(deg)) {
                            setQualifications(
                              qualifications
                                .replace(deg, '')
                                .replace(/,\s*,/g, ',')
                                .replace(/^,\s*|,\s*$/g, '')
                                .trim()
                            );
                          } else {
                            setQualifications(
                              qualifications.trim() ? `${qualifications.trim()}, ${deg}` : deg
                            );
                          }
                        }}
                        className={`px-2 py-0.5 rounded text-[9px] font-bold border transition-colors ${
                          qualifications.includes(deg)
                            ? 'bg-emerald-700 text-white border-emerald-700'
                            : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                        }`}
                      >
                        +{deg}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="text-[10px] font-semibold text-slate-600 block mb-0.5">Experience (Yrs)</label>
                  <input
                    type="number"
                    min="1"
                    max="50"
                    value={experienceYears}
                    onChange={(e) => setExperienceYears(Number(e.target.value))}
                    className="w-full p-2 bg-white border border-slate-200 rounded-xl text-slate-900 focus:ring-2 focus:ring-emerald-700"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[10px] font-semibold text-slate-600 block mb-0.5">
                    State Council / MCI Reg No.
                  </label>
                  <input
                    type="text"
                    required
                    value={registrationNumber}
                    onChange={(e) => setRegistrationNumber(e.target.value)}
                    placeholder="e.g. MCI-TR-88421"
                    className="w-full p-2 bg-white border border-slate-200 rounded-xl text-slate-900 font-mono text-[11px] focus:ring-2 focus:ring-emerald-700"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-semibold text-slate-600 block mb-0.5">Gender</label>
                  <select
                    value={gender}
                    onChange={(e) => setGender(e.target.value as 'Male' | 'Female')}
                    className="w-full p-2 bg-white border border-slate-200 rounded-xl text-slate-900"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                  </select>
                </div>
              </div>

              {/* Doctor Avatar Picker */}
              <div>
                <label className="text-[10px] font-semibold text-slate-600 block mb-1">
                  Profile Photo (Select Preset or Provide URL)
                </label>
                <div className="flex items-center space-x-2">
                  {DOCTOR_AVATAR_PRESETS.map((preset, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setSelectedImage(preset.url)}
                      className={`relative rounded-xl overflow-hidden ring-2 transition-all ${
                        selectedImage === preset.url
                          ? 'ring-emerald-600 scale-105 shadow-xs'
                          : 'ring-transparent opacity-60 hover:opacity-100'
                      }`}
                    >
                      <img
                        src={preset.url}
                        alt={preset.name}
                        className="w-10 h-10 object-cover"
                        referrerPolicy="no-referrer"
                      />
                    </button>
                  ))}
                  <div className="flex-1">
                    <input
                      type="url"
                      value={selectedImage}
                      onChange={(e) => setSelectedImage(e.target.value)}
                      placeholder="Or paste custom image URL"
                      className="w-full p-1.5 bg-white border border-slate-200 rounded-xl text-[10px] text-slate-700"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Practice Location & Affiliation */}
            <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 space-y-2.5">
              <div className="font-bold text-slate-800 text-[11px]">3. Clinic / Pharmacy Affiliation & City</div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[10px] font-semibold text-slate-600 block mb-0.5">
                    Clinic / Pharmacy Facility Name
                  </label>
                  <input
                    type="text"
                    required
                    value={hospitalOrClinic}
                    onChange={(e) => setHospitalOrClinic(e.target.value)}
                    placeholder="Tripura Medicos Clinic"
                    className="w-full p-2 bg-white border border-slate-200 rounded-xl text-slate-900"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-semibold text-slate-600 block mb-0.5">City</label>
                  <select
                    value={city}
                    onChange={(e) => {
                      setCity(e.target.value);
                      setLocation(`${e.target.value}, Tripura`);
                    }}
                    className="w-full p-2 bg-white border border-slate-200 rounded-xl text-slate-900"
                  >
                    {INDIAN_CITIES.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="text-[10px] font-semibold text-slate-600 block mb-0.5">
                  Physical Address for In-Clinic Visits
                </label>
                <input
                  type="text"
                  required
                  value={hospitalAddress}
                  onChange={(e) => setHospitalAddress(e.target.value)}
                  placeholder="Akhaura Road, Banamalipur, Agartala"
                  className="w-full p-2 bg-white border border-slate-200 rounded-xl text-slate-900"
                />
              </div>
            </div>

            {/* Consultation Fees & Slot Timings */}
            <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 space-y-2.5">
              <div className="font-bold text-slate-800 text-[11px]">4. Consultation Fees & Booking Timings</div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[10px] font-semibold text-slate-600 block mb-0.5">
                    Video Consult Fee (₹)
                  </label>
                  <div className="relative">
                    <span className="absolute left-2.5 top-1/2 -translate-y-1/2 font-bold text-slate-400">₹</span>
                    <input
                      type="number"
                      min="99"
                      step="50"
                      required
                      value={feeVideo}
                      onChange={(e) => setFeeVideo(Number(e.target.value))}
                      className="w-full pl-6 pr-2 py-2 bg-white border border-slate-200 rounded-xl text-slate-900 font-bold"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[10px] font-semibold text-slate-600 block mb-0.5">
                    In-Clinic Consult Fee (₹)
                  </label>
                  <div className="relative">
                    <span className="absolute left-2.5 top-1/2 -translate-y-1/2 font-bold text-slate-400">₹</span>
                    <input
                      type="number"
                      min="99"
                      step="50"
                      required
                      value={feeInClinic}
                      onChange={(e) => setFeeInClinic(Number(e.target.value))}
                      className="w-full pl-6 pr-2 py-2 bg-white border border-slate-200 rounded-xl text-slate-900 font-bold"
                    />
                  </div>
                </div>
              </div>

              {/* Working Days */}
              <div>
                <label className="text-[10px] font-semibold text-slate-600 block mb-1">
                  Available Booking Days
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day) => (
                    <button
                      key={day}
                      type="button"
                      onClick={() => handleDayToggle(day)}
                      className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition-all ${
                        availableDays.includes(day)
                          ? 'bg-emerald-800 text-white'
                          : 'bg-white text-slate-600 border border-slate-200'
                      }`}
                    >
                      {day}
                    </button>
                  ))}
                </div>
              </div>

              {/* Timings */}
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[10px] font-semibold text-slate-600 block mb-0.5">Morning Slot Hours</label>
                  <input
                    type="text"
                    value={morningTimings}
                    onChange={(e) => setMorningTimings(e.target.value)}
                    placeholder="09:30 AM - 01:00 PM"
                    className="w-full p-2 bg-white border border-slate-200 rounded-xl text-slate-900"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-semibold text-slate-600 block mb-0.5">Evening Slot Hours</label>
                  <input
                    type="text"
                    value={eveningTimings}
                    onChange={(e) => setEveningTimings(e.target.value)}
                    placeholder="05:30 PM - 08:30 PM"
                    className="w-full p-2 bg-white border border-slate-200 rounded-xl text-slate-900"
                  />
                </div>
              </div>

              {/* Languages */}
              <div>
                <label className="text-[10px] font-semibold text-slate-600 block mb-1">Languages Spoken</label>
                <div className="flex flex-wrap gap-1.5">
                  {['English', 'Bengali', 'Hindi', 'Kokborok', 'Assamese', 'Odia'].map((lang) => (
                    <button
                      key={lang}
                      type="button"
                      onClick={() => handleLanguageToggle(lang)}
                      className={`px-2.5 py-1 rounded-lg text-[10px] font-medium transition-all ${
                        languages.includes(lang)
                          ? 'bg-teal-700 text-white font-bold'
                          : 'bg-white text-slate-600 border border-slate-200'
                      }`}
                    >
                      {lang}
                    </button>
                  ))}
                </div>
              </div>

              {/* Specializations & Bio */}
              <div>
                <label className="text-[10px] font-semibold text-slate-600 block mb-0.5">
                  Key Specializations (Comma separated)
                </label>
                <input
                  type="text"
                  value={specializationsText}
                  onChange={(e) => setSpecializationsText(e.target.value)}
                  placeholder="e.g. Endoscopy, Hearing Loss, Sinus, Allergy"
                  className="w-full p-2 bg-white border border-slate-200 rounded-xl text-slate-900"
                />
              </div>

              <div>
                <label className="text-[10px] font-semibold text-slate-600 block mb-0.5">
                  About Doctor / Clinical Focus
                </label>
                <textarea
                  rows={2}
                  value={about}
                  onChange={(e) => setAbout(e.target.value)}
                  placeholder="Brief clinical background and treatment philosophy..."
                  className="w-full p-2 bg-white border border-slate-200 rounded-xl text-slate-900"
                />
              </div>
            </div>

            {/* Submission Action */}
            <div className="pt-2 flex items-center space-x-2">
              <button
                type="button"
                onClick={() => setShowOnboardingModal(false)}
                className="py-3 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold transition-colors"
              >
                Cancel
              </button>
              <button
                id="submit-doctor-onboarding-btn"
                type="submit"
                className="flex-1 py-3 bg-emerald-800 hover:bg-emerald-900 text-white rounded-xl font-bold shadow-md flex items-center justify-center space-x-1.5 transition-all"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Submit Doctor Listing Request</span>
              </button>
            </div>
          </form>
        ) : (
          /* SUCCESS CONFIRMATION RECEIPT */
          <div className="p-6 space-y-5 text-center my-auto">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-800 rounded-full flex items-center justify-center mx-auto ring-8 ring-emerald-50">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div className="space-y-1">
              <h3 className="text-base font-bold text-slate-900 font-heading">
                Listing Request Submitted Successfully!
              </h3>
              <p className="text-xs text-slate-500 max-w-xs mx-auto">
                Thank you, <strong>{applicantName}</strong>. Your request to add{' '}
                <strong>{doctorName}</strong> ({specialty}) has been sent to the platform owner.
              </p>
            </div>

            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-left space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-500">Tracking Request ID:</span>
                <span className="font-mono font-bold text-emerald-800">{submittedRequestId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Affiliation:</span>
                <span className="font-semibold text-slate-800">{organizationName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">MCI Registration:</span>
                <span className="font-mono font-semibold text-slate-800">{registrationNumber}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Proposed Fees:</span>
                <span className="font-bold text-slate-900">
                  Video: ₹{feeVideo} • Clinic: ₹{feeInClinic}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Status:</span>
                <span className="bg-amber-100 text-amber-900 font-bold px-2 py-0.5 rounded text-[10px]">
                  Under Owner Review
                </span>
              </div>
            </div>

            <div className="text-[11px] text-slate-500 bg-emerald-50/70 p-3 rounded-xl border border-emerald-200">
              As soon as the App Owner approves this profile in the Admin Portal, the doctor will be
              automatically published and open for patient bookings across SehatSetu!
            </div>

            <button
              onClick={() => {
                setShowOnboardingModal(false);
                setStep('FORM');
              }}
              className="w-full py-3 bg-emerald-800 hover:bg-emerald-900 text-white rounded-xl font-bold shadow-xs transition-colors"
            >
              Done & Return to App
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
