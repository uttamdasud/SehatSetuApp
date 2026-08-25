import React from 'react';
import {
  Search,
  Video,
  UserCheck,
  BrainCircuit,
  Calendar,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Star,
  Clock,
  Building2,
  Stethoscope,
  ChevronRight,
  MapPin,
  HeartPulse,
  Baby,
  Activity,
  Bone,
  Ear,
  Smile,
  Brain,
  Leaf,
  Eye,
  Flame,
  Wind,
  Droplets,
  Scissors,
  Dumbbell,
  Grid,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { SPECIALTIES } from '../../data/mockData';
import { Doctor, SpecialtyType } from '../../types';

export const HomeScreen: React.FC = () => {
  const {
    doctors,
    setActiveTab,
    setSelectedDoctor,
    startBooking,
    startInstantConsultation,
    setSelectedSpecialtyFilter,
    setSearchQuery,
    setActiveScreen,
    currentLocation,
    setSelectedHospital,
    setShowOnboardingModal,
    setShowAdminPortal,
  } = useApp();

  const availableDoctors = doctors.slice(0, 5);

  const getSpecialtyIcon = (name: string) => {
    switch (name) {
      case 'General Physician':
        return <Stethoscope className="w-6 h-6 text-emerald-700" />;
      case 'Child Specialist':
      case 'Pediatrician':
        return <Baby className="w-6 h-6 text-sky-600" />;
      case 'Gynecologist':
        return <Activity className="w-6 h-6 text-pink-600" />;
      case 'Dermatologist':
        return <Sparkles className="w-6 h-6 text-amber-600" />;
      case 'Orthopedic':
        return <Bone className="w-6 h-6 text-orange-600" />;
      case 'Cardiologist':
        return <HeartPulse className="w-6 h-6 text-rose-600" />;
      case 'Neurologist':
        return <Brain className="w-6 h-6 text-purple-600" />;
      case 'ENT':
        return <Ear className="w-6 h-6 text-indigo-600" />;
      case 'Eye Specialist':
        return <Eye className="w-6 h-6 text-cyan-600" />;
      case 'Dentist':
        return <Smile className="w-6 h-6 text-teal-600" />;
      case 'Gastroenterologist':
        return <Flame className="w-6 h-6 text-amber-700" />;
      case 'Urologist':
        return <Droplets className="w-6 h-6 text-blue-600" />;
      case 'Nephrologist':
        return <Droplets className="w-6 h-6 text-sky-700" />;
      case 'Pulmonologist':
        return <Wind className="w-6 h-6 text-cyan-700" />;
      case 'Endocrinologist/Diabetologist':
        return <Activity className="w-6 h-6 text-red-600" />;
      case 'Psychiatrist':
        return <Brain className="w-6 h-6 text-violet-600" />;
      case 'General Surgeon':
        return <Scissors className="w-6 h-6 text-emerald-800" />;
      case 'Oncologist':
        return <HeartPulse className="w-6 h-6 text-rose-700" />;
      case 'Physiotherapist':
        return <Dumbbell className="w-6 h-6 text-lime-600" />;
      case 'Other Specialists':
        return <Grid className="w-6 h-6 text-slate-600" />;
      default:
        return <Stethoscope className="w-6 h-6 text-emerald-700" />;
    }
  };

  const handleSpecialtyClick = (specialty: SpecialtyType) => {
    setSelectedSpecialtyFilter(specialty);
    setActiveTab('find-doctors');
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setActiveTab('find-doctors');
  };

  return (
    <div id="home-screen-view" className="space-y-5 pb-24 animate-in fade-in duration-200">
      {/* Search Bar */}
      <div className="px-4 -mt-2">
        <form onSubmit={handleSearchSubmit} className="relative">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            id="home-main-search-input"
            type="text"
            placeholder="Search doctors, specialties, hospitals..."
            onFocus={() => setActiveTab('find-doctors')}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200/90 rounded-2xl text-xs font-medium text-slate-900 placeholder:text-slate-400 shadow-xs focus:outline-none focus:ring-2 focus:ring-emerald-700"
          />
        </form>
      </div>

      {/* Quick Actions 4-Grid */}
      <div className="px-4">
        <div className="grid grid-cols-4 gap-2.5">
          {/* Consult Now */}
          <button
            id="quick-action-consult-now"
            onClick={() => startInstantConsultation()}
            className="bg-white p-3 rounded-2xl border border-slate-200/80 shadow-xs hover:border-emerald-300 flex flex-col items-center justify-center text-center group active:scale-95 transition-all"
          >
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-800 flex items-center justify-center mb-1.5 group-hover:bg-emerald-700 group-hover:text-white transition-colors">
              <Video className="w-5 h-5" />
            </div>
            <span className="text-[11px] font-bold text-slate-900 leading-tight">Consult Now</span>
          </button>

          {/* Find a Doctor */}
          <button
            id="quick-action-find-doctor"
            onClick={() => {
              setSelectedSpecialtyFilter('ALL');
              setActiveTab('find-doctors');
            }}
            className="bg-white p-3 rounded-2xl border border-slate-200/80 shadow-xs hover:border-emerald-300 flex flex-col items-center justify-center text-center group active:scale-95 transition-all"
          >
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-800 flex items-center justify-center mb-1.5 group-hover:bg-emerald-700 group-hover:text-white transition-colors">
              <UserCheck className="w-5 h-5" />
            </div>
            <span className="text-[11px] font-bold text-slate-900 leading-tight">Find Doctor</span>
          </button>

          {/* AI Symptom Checker */}
          <button
            id="quick-action-symptom-checker"
            onClick={() => setActiveScreen('symptom-checker')}
            className="bg-white p-3 rounded-2xl border border-slate-200/80 shadow-xs hover:border-emerald-300 flex flex-col items-center justify-center text-center group active:scale-95 transition-all"
          >
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-800 flex items-center justify-center mb-1.5 group-hover:bg-emerald-700 group-hover:text-white transition-colors">
              <BrainCircuit className="w-5 h-5" />
            </div>
            <span className="text-[11px] font-bold text-slate-900 leading-tight">AI Checker</span>
          </button>

          {/* Book Appointment */}
          <button
            id="quick-action-book-appointment"
            onClick={() => setActiveTab('find-doctors')}
            className="bg-white p-3 rounded-2xl border border-slate-200/80 shadow-xs hover:border-emerald-300 flex flex-col items-center justify-center text-center group active:scale-95 transition-all"
          >
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-800 flex items-center justify-center mb-1.5 group-hover:bg-emerald-700 group-hover:text-white transition-colors">
              <Calendar className="w-5 h-5" />
            </div>
            <span className="text-[11px] font-bold text-slate-900 leading-tight">Book Slot</span>
          </button>
        </div>
      </div>

      {/* Prominent Instant Consultation Banner */}
      <div className="px-4">
        <div
          id="instant-consultation-banner"
          className="relative overflow-hidden bg-gradient-to-br from-emerald-800 to-teal-900 text-white rounded-3xl p-5 shadow-md"
        >
          <div className="relative z-10 max-w-[240px]">
            <div className="inline-flex items-center space-x-1 bg-emerald-700/80 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider mb-2 text-emerald-100">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-300 animate-ping" />
              <span>Doctors Online Now</span>
            </div>
            <h3 className="text-lg font-bold font-heading leading-tight">Need medical help now?</h3>
            <p className="text-xs text-emerald-100/90 mt-1 leading-relaxed">
              Connect with an available doctor for instant video consultation in 2 mins.
            </p>
            <button
              id="instant-consult-banner-btn"
              onClick={() => startInstantConsultation()}
              className="mt-3.5 bg-white text-emerald-950 hover:bg-emerald-50 font-bold text-xs py-2.5 px-4 rounded-xl inline-flex items-center space-x-1.5 shadow-sm active:scale-95 transition-all"
            >
              <Video className="w-4 h-4 text-emerald-700" />
              <span>Consult Now</span>
            </button>
          </div>

          {/* Decorative Visual Elements */}
          <div className="absolute -right-4 -bottom-4 w-32 h-32 bg-emerald-700/30 rounded-full blur-xl pointer-events-none" />
          <div className="absolute right-4 bottom-3 opacity-90">
            <div className="w-20 h-20 rounded-2xl bg-white/10 backdrop-blur-xs border border-white/20 p-2 flex flex-col items-center justify-center text-center shadow-inner">
              <Stethoscope className="w-8 h-8 text-emerald-200 mb-1" />
              <span className="text-[10px] font-bold text-emerald-100">From ₹299</span>
            </div>
          </div>
        </div>
      </div>

      {/* AI Symptom Checker Card */}
      <div className="px-4">
        <div
          id="home-symptom-checker-card"
          className="bg-white rounded-3xl p-4.5 border border-emerald-100/90 shadow-xs flex items-start justify-between space-x-3"
        >
          <div className="flex-1">
            <div className="flex items-center space-x-1.5 text-emerald-800 text-xs font-bold uppercase tracking-wider mb-1">
              <BrainCircuit className="w-4 h-4 text-emerald-700" />
              <span>AI Symptom Navigator</span>
            </div>
            <h4 className="text-sm font-bold text-slate-900 font-heading">Not sure which doctor you need?</h4>
            <p className="text-xs text-slate-600 mt-1 leading-relaxed">
              Describe your symptoms and we'll help you find the right type of healthcare professional.
            </p>
            <div className="mt-3 flex items-center space-x-2">
              <button
                id="home-check-symptoms-cta"
                onClick={() => setActiveScreen('symptom-checker')}
                className="bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs py-2 px-3.5 rounded-xl inline-flex items-center space-x-1.5 transition-colors active:scale-95"
              >
                <span>Check Symptoms</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
              <span className="text-[10px] text-slate-400 font-medium italic">
                *Informational guidance only
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Horizontal Scrolling Specialties */}
      <div>
        <div className="px-4 flex items-center justify-between mb-2.5">
          <div>
            <h3 className="text-sm font-bold text-slate-900 font-heading">Explore Specialties</h3>
            <span className="text-[11px] text-slate-500">Find doctors by medical discipline</span>
          </div>
          <button
            id="view-all-specialties-btn"
            onClick={() => {
              setSelectedSpecialtyFilter('ALL');
              setActiveTab('find-doctors');
            }}
            className="text-xs font-bold text-emerald-800 hover:text-emerald-900 flex items-center space-x-0.5"
          >
            <span>View All</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Scroll Container */}
        <div className="flex space-x-3 overflow-x-auto px-4 pb-2 no-scrollbar">
          {SPECIALTIES.map((spec) => (
            <button
              key={spec.id}
              id={`specialty-card-${spec.id.toLowerCase().replace(/\s+/g, '-')}`}
              onClick={() => handleSpecialtyClick(spec.id)}
              className="min-w-[124px] bg-white p-3.5 rounded-2xl border border-slate-200/80 shadow-xs hover:border-emerald-300 hover:shadow-sm text-center flex flex-col items-center justify-between shrink-0 group active:scale-95 transition-all"
            >
              <div className="w-12 h-12 rounded-2xl bg-emerald-50/80 group-hover:bg-emerald-100/90 flex items-center justify-center mb-2 transition-colors">
                {getSpecialtyIcon(spec.id)}
              </div>
              <div className="w-full">
                <h4 className="text-xs font-bold text-slate-900 truncate leading-tight">{spec.name}</h4>
                <span className="text-[10px] text-emerald-800 font-semibold block mt-0.5">
                  {spec.doctorCount} Doctors
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Available Doctors Near You */}
      <div className="px-4">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h3 className="text-sm font-bold text-slate-900 font-heading">Available Doctors Near You</h3>
            <span className="text-[11px] text-slate-500">
              Verified specialists in {currentLocation.city}
            </span>
          </div>
          <button
            id="see-all-doctors-home-btn"
            onClick={() => setActiveTab('find-doctors')}
            className="text-xs font-bold text-emerald-800 hover:text-emerald-900 flex items-center space-x-0.5"
          >
            <span>See All</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Doctor Cards List */}
        <div className="space-y-3">
          {availableDoctors.map((doc) => (
            <div
              key={doc.id}
              id={`home-doctor-card-${doc.id}`}
              className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs hover:border-slate-300 transition-all"
            >
              {/* Top Row: Photo & Details */}
              <div className="flex items-start space-x-3.5">
                <div className="relative shrink-0">
                  <img
                    src={doc.image}
                    alt={doc.name}
                    className="w-16 h-16 rounded-2xl object-cover ring-1 ring-slate-100"
                    referrerPolicy="no-referrer"
                  />
                  {doc.isAvailableNow && (
                    <span
                      className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-emerald-500 border-2 border-white rounded-full"
                      title="Available now"
                    />
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-1.5">
                      <h4 className="text-xs font-bold text-slate-900 truncate">{doc.name}</h4>
                      {doc.verified && (
                        <ShieldCheck className="w-3.5 h-3.5 text-emerald-700 shrink-0" title="Verified Practitioner" />
                      )}
                    </div>
                    <div className="flex items-center space-x-1 bg-amber-50 px-1.5 py-0.5 rounded text-[11px] font-bold text-amber-900 border border-amber-200">
                      <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                      <span>{doc.rating}</span>
                      <span className="text-[9px] text-amber-700 font-normal">({doc.reviewCount})</span>
                    </div>
                  </div>

                  <div className="text-xs font-medium text-emerald-800 mt-0.5">{doc.specialty}</div>
                  <div className="text-[11px] text-slate-500 truncate mt-0.5">
                    {doc.qualifications} • {doc.experienceYears} yrs exp
                  </div>
                  <div className="text-[11px] text-slate-500 truncate mt-0.5 flex items-center space-x-1">
                    <Building2 className="w-3 h-3 text-slate-400 shrink-0" />
                    <span>{doc.hospital}</span>
                  </div>
                </div>
              </div>

              {/* Tags & Fees Bar */}
              <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-xs">
                <div className="flex items-center space-x-2">
                  <span className="text-[10px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded font-medium">
                    Video ₹{doc.feeVideo}
                  </span>
                  <span className="text-[10px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded font-medium">
                    Clinic ₹{doc.feeInClinic}
                  </span>
                </div>
                <div className="text-[11px] text-emerald-800 font-semibold flex items-center space-x-1">
                  <Clock className="w-3 h-3 text-emerald-700" />
                  <span>{doc.nextSlotVideo}</span>
                </div>
              </div>

              {/* Actions */}
              <div className="mt-3 grid grid-cols-2 gap-2">
                <button
                  id={`home-view-profile-${doc.id}`}
                  onClick={() => {
                    setSelectedDoctor(doc);
                    setActiveScreen('doctor-profile');
                  }}
                  className="py-2 px-3 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-bold text-center transition-colors active:scale-95"
                >
                  View Profile
                </button>
                <button
                  id={`home-book-doctor-${doc.id}`}
                  onClick={() => startBooking(doc)}
                  className="py-2 px-3 bg-emerald-800 hover:bg-emerald-900 text-white rounded-xl text-xs font-bold text-center shadow-xs transition-colors active:scale-95"
                >
                  Book Appointment
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Top Hospitals & Partner Centers */}
      <div className="px-4">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h3 className="text-sm font-bold text-slate-900 font-heading">Hospitals & Clinics</h3>
            <span className="text-[11px] text-slate-500">Partner healthcare facilities</span>
          </div>
        </div>

        <div className="space-y-2.5">
          <div
            id="hospital-card-ils"
            onClick={() => setActiveScreen('hospital-detail')}
            className="p-3.5 bg-white rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between hover:border-slate-300 cursor-pointer transition-all active:scale-[0.99]"
          >
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-800 flex items-center justify-center font-bold">
                <Building2 className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-900">ILS Hospitals Agartala</h4>
                <div className="text-[11px] text-slate-500">Capital Complex • 24/7 Emergency</div>
                <div className="text-[10px] text-emerald-800 font-semibold mt-0.5">28 Specialists Available</div>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-400" />
          </div>

          <div
            id="hospital-card-apollo"
            onClick={() => setActiveScreen('hospital-detail')}
            className="p-3.5 bg-white rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between hover:border-slate-300 cursor-pointer transition-all active:scale-[0.99]"
          >
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-800 flex items-center justify-center font-bold">
                <Building2 className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-900">Apollo Clinic Agartala</h4>
                <div className="text-[11px] text-slate-500">Banamalipur • Diagnostics & OPD</div>
                <div className="text-[10px] text-emerald-800 font-semibold mt-0.5">18 Specialists Available</div>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-400" />
          </div>
        </div>
      </div>

      {/* Doctor & Pharmacy Onboarding Quick Action Banner */}
      <div className="px-4">
        <div className="p-4 bg-gradient-to-r from-teal-900 to-emerald-950 text-white rounded-2xl shadow-sm flex items-center justify-between">
          <div className="space-y-0.5 pr-2">
            <span className="text-[10px] uppercase font-bold tracking-wider text-teal-300">
              Healthcare Partners
            </span>
            <h4 className="text-xs font-bold font-heading text-white">
              Doctor or Pharmacy Practice?
            </h4>
            <p className="text-[11px] text-teal-100/80">
              Submit a request to add doctor listing with custom timings, specialty & fees
            </p>
          </div>
          <button
            id="home-partner-request-btn"
            onClick={() => setShowOnboardingModal(true)}
            className="py-2 px-3 bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs rounded-xl shrink-0 shadow-xs transition-all active:scale-95"
          >
            Request Listing
          </button>
        </div>
      </div>

      {/* Trust & Privacy Security Banner */}
      <div className="px-4">
        <div className="p-4 bg-emerald-50/60 border border-emerald-200/70 rounded-2xl flex items-start space-x-3 text-xs text-emerald-950">
          <ShieldCheck className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
          <div className="space-y-0.5">
            <h5 className="font-bold text-emerald-950">Your Health Data is Confidential</h5>
            <p className="text-[11px] text-emerald-800 leading-relaxed">
              Your health information is private. Consultations are strictly confidential between you and certified practitioners.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
