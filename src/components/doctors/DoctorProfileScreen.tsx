import React, { useState } from 'react';
import {
  ShieldCheck,
  Star,
  Clock,
  Building2,
  Video,
  VideoOff,
  MapPin,
  Calendar,
  GraduationCap,
  Award,
  Globe2,
  CheckCircle2,
  ArrowLeft,
  Share2,
  Heart,
  MessageSquare,
  Info,
  MessageCircle,
  FileSpreadsheet,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

type ProfileTab = 'SCHEDULE' | 'ABOUT' | 'EDUCATION' | 'EXPERIENCE' | 'SPECIALIZATIONS' | 'LANGUAGES' | 'REVIEWS';

export const DoctorProfileScreen: React.FC = () => {
  const {
    selectedDoctor,
    setSelectedDoctor,
    setActiveScreen,
    startBooking,
    startInstantConsultation,
    openDoctorRosterModal,
    showToast,
  } = useApp();
  const [activeTab, setActiveTab] = useState<ProfileTab>('SCHEDULE');
  const [selectedDayIndex, setSelectedDayIndex] = useState(0);
  const [isSaved, setIsSaved] = useState(false);

  if (!selectedDoctor) return null;

  const doctor = selectedDoctor;

  const handleShare = () => {
    showToast(`Doctor profile link copied for ${doctor.name}`);
  };

  const handleToggleSave = () => {
    setIsSaved(!isSaved);
    showToast(isSaved ? 'Doctor removed from favorites' : 'Doctor saved to favorites');
  };

  return (
    <div id="doctor-profile-screen" className="bg-slate-50 min-h-screen pb-28 animate-in fade-in duration-200">
      {/* Top Header Bar */}
      <div className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 px-4 py-3 flex items-center justify-between">
        <button
          id="doctor-profile-back-btn"
          onClick={() => setActiveScreen(null)}
          className="p-1.5 -ml-1 text-slate-700 hover:text-slate-900 rounded-full hover:bg-slate-100"
          aria-label="Back"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">Doctor Profile</span>
        <div className="flex items-center space-x-1">
          <button
            onClick={handleToggleSave}
            className="p-2 text-slate-600 hover:text-rose-600 rounded-full"
            aria-label="Favorite"
          >
            <Heart className={`w-4 h-4 ${isSaved ? 'fill-rose-500 text-rose-500' : ''}`} />
          </button>
          <button
            onClick={handleShare}
            className="p-2 text-slate-600 hover:text-slate-900 rounded-full"
            aria-label="Share"
          >
            <Share2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Hero Doctor Card */}
      <div className="bg-white p-5 border-b border-slate-200 shadow-xs">
        <div className="flex items-start space-x-4">
          <div className="relative shrink-0">
            <img
              src={doctor.image}
              alt={doctor.name}
              className="w-20 h-20 rounded-3xl object-cover ring-2 ring-emerald-100 shadow-xs"
              referrerPolicy="no-referrer"
            />
            {doctor.isAvailableNow && (
              <span className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 border-2 border-white rounded-full" />
            )}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-1.5">
              <h2 className="text-base font-bold text-slate-900 font-heading truncate">{doctor.name}</h2>
              {doctor.verified && <ShieldCheck className="w-4 h-4 text-emerald-700 shrink-0" />}
            </div>

            <div className="text-xs font-semibold text-emerald-800 mt-0.5">{doctor.specialty}</div>
            <div className="text-xs text-slate-500 mt-0.5">{doctor.qualifications}</div>
            <div className="text-[11px] text-slate-500 mt-1 flex items-center space-x-1">
              <Building2 className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span className="truncate">{doctor.hospital}</span>
            </div>

            {/* Video vs In-Clinic Badge */}
            <div className="mt-2 flex items-center space-x-1.5">
              {doctor.availableForVideo !== false ? (
                <span className="inline-flex items-center space-x-1 text-[10px] font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200 px-2 py-0.5 rounded-md">
                  <Video className="w-3 h-3 text-emerald-600" />
                  <span>Video & In-Clinic Consultations</span>
                </span>
              ) : (
                <span className="inline-flex items-center space-x-1 text-[10px] font-semibold bg-slate-100 text-slate-700 border border-slate-200 px-2 py-0.5 rounded-md">
                  <Building2 className="w-3 h-3 text-slate-500" />
                  <span>In-Clinic Only (No Video Consultation)</span>
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Highlight Stats Row */}
        <div className="grid grid-cols-3 gap-2 mt-4 pt-3 border-t border-slate-100 text-center">
          <div className="p-2 bg-slate-50 rounded-xl">
            <span className="text-xs font-bold text-slate-900 block">{doctor.experienceYears}+ Years</span>
            <span className="text-[10px] text-slate-500 uppercase font-semibold">Experience</span>
          </div>
          <div className="p-2 bg-slate-50 rounded-xl">
            <div className="flex items-center justify-center space-x-1 text-xs font-bold text-slate-900">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span>{doctor.rating}</span>
            </div>
            <span className="text-[10px] text-slate-500 uppercase font-semibold">{doctor.reviewCount} Reviews</span>
          </div>
          <div className="p-2 bg-slate-50 rounded-xl">
            <span className="text-xs font-bold text-emerald-800 block">Verified</span>
            <span className="text-[10px] text-slate-500 uppercase font-semibold">Medical Reg.</span>
          </div>
        </div>
      </div>

      {/* Consultation Options Cards */}
      <div className="p-4 space-y-3">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Consultation Modes & Fees</h3>

        {/* Video Consultation */}
        {doctor.availableForVideo !== false ? (
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
            <div className="space-y-1">
              <div className="flex items-center space-x-1.5">
                <Video className="w-4 h-4 text-emerald-700" />
                <span className="text-xs font-bold text-slate-900">Video Consultation</span>
              </div>
              <div className="text-[11px] text-slate-500">15–20 mins • Digital Rx Included</div>
              <div className="text-[11px] font-semibold text-emerald-800 flex items-center space-x-1">
                <Clock className="w-3 h-3" />
                <span>Next Slot: {doctor.nextSlotVideo}</span>
              </div>
            </div>

            <div className="text-right">
              <span className="text-base font-extrabold text-emerald-900 block">₹{doctor.feeVideo}</span>
              <button
                id="book-video-consult-btn"
                onClick={() => startBooking(doctor, 'VIDEO')}
                className="mt-1 py-1.5 px-3 bg-emerald-800 hover:bg-emerald-900 text-white rounded-xl text-xs font-bold transition-colors shadow-xs"
              >
                Book Video
              </button>
            </div>
          </div>
        ) : (
          <div className="bg-slate-100/80 p-3.5 rounded-2xl border border-slate-200 flex items-start space-x-2.5">
            <VideoOff className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
            <div>
              <span className="text-xs font-bold text-slate-700 block">Video Consultation Not Available</span>
              <span className="text-[11px] text-slate-500">
                This doctor currently only provides in-person consultations at the hospital clinic.
              </span>
            </div>
          </div>
        )}

        {/* In-Clinic Appointment */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div className="space-y-1">
            <div className="flex items-center space-x-1.5">
              <Building2 className="w-4 h-4 text-emerald-700" />
              <span className="text-xs font-bold text-slate-900">In-Clinic Visit</span>
            </div>
            <div className="text-[11px] text-slate-500 truncate max-w-[180px]">{doctor.hospitalAddress}</div>
            <div className="text-[11px] font-semibold text-emerald-800 flex items-center space-x-1">
              <Clock className="w-3 h-3" />
              <span>Next Slot: {doctor.nextSlotClinic}</span>
            </div>
          </div>

          <div className="text-right">
            <span className="text-base font-extrabold text-emerald-900 block">₹{doctor.feeInClinic}</span>
            <span className="text-[9px] text-slate-400 block -mt-0.5">Pay at clinic</span>
            <button
              id="book-clinic-consult-btn"
              onClick={() => startBooking(doctor, 'IN_CLINIC')}
              className="mt-1 py-1.5 px-3 bg-emerald-800 hover:bg-emerald-900 text-white rounded-xl text-xs font-bold transition-colors shadow-xs"
            >
              Book Clinic
            </button>
          </div>
        </div>

        {/* Visiting Fee Information Banner */}
        <div className="p-3 bg-amber-50 rounded-2xl border border-amber-200 text-xs text-amber-900 flex items-start space-x-2">
          <Info className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
          <p className="text-[11px] leading-relaxed">
            <strong>Doctor Visiting Fee Note:</strong> The doctor's consultation fee is displayed for informational purposes. Patients pay directly when visiting the doctor's clinic.
          </p>
        </div>

        {/* Receptionist Desk & Whole Day Booking Sync Banner */}
        <div className="p-3 bg-emerald-50 rounded-2xl border border-emerald-200 text-xs text-emerald-950 flex items-start justify-between">
          <div className="flex items-start space-x-2">
            <MessageCircle className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold block text-emerald-950">Reception Desk & Queue Sync</span>
              <span className="text-[11px] text-emerald-800">
                Desk Manager: {doctor.receptionistName || 'Pooja Sharma (Front Desk)'} ({doctor.receptionistPhone || '+91 98301 22450'})
              </span>
              <span className="text-[10px] text-emerald-700 block mt-0.5">
                Every booking instantly updates the whole-day patient manifest with contact & serial number.
              </span>
            </div>
          </div>
          <button
            id="view-doctor-roster-profile-btn"
            onClick={() => openDoctorRosterModal(doctor)}
            className="py-1 px-2.5 bg-emerald-800 hover:bg-emerald-900 text-white rounded-xl text-[10px] font-bold shrink-0 shadow-2xs transition-colors"
          >
            Day Roster
          </button>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="px-4">
        <div className="flex space-x-1 bg-white p-1 rounded-2xl border border-slate-200 overflow-x-auto no-scrollbar">
          {(['SCHEDULE', 'ABOUT', 'EDUCATION', 'EXPERIENCE', 'SPECIALIZATIONS', 'LANGUAGES', 'REVIEWS'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`py-1.5 px-3 rounded-xl text-[11px] font-bold whitespace-nowrap transition-all ${
                activeTab === tab
                  ? 'bg-emerald-800 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {tab === 'SCHEDULE' && 'Weekly Schedule'}
              {tab === 'ABOUT' && 'About'}
              {tab === 'EDUCATION' && 'Education'}
              {tab === 'EXPERIENCE' && 'Experience'}
              {tab === 'SPECIALIZATIONS' && 'Specialties'}
              {tab === 'LANGUAGES' && 'Languages'}
              {tab === 'REVIEWS' && `Reviews (${doctor.reviews.length})`}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content Body */}
      <div className="px-4 mt-3">
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          {/* WEEKLY SCHEDULE TAB */}
          {activeTab === 'SCHEDULE' && (
            <div className="space-y-3.5">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Whole Week Availability & Slots
                  </h4>
                  <span className="text-[11px] text-slate-500">Check day-by-day consultation timings</span>
                </div>
              </div>

              {/* 7-Day Selector */}
              <div className="grid grid-cols-7 gap-1">
                {(doctor.weeklySchedule || []).map((sched, idx) => {
                  const isSelected = selectedDayIndex === idx;
                  return (
                    <button
                      key={sched.day}
                      id={`profile-day-tab-${sched.day.toLowerCase()}`}
                      onClick={() => setSelectedDayIndex(idx)}
                      className={`py-2 px-1 rounded-xl text-center border transition-all ${
                        isSelected
                          ? 'bg-emerald-800 text-white border-emerald-800 shadow-xs'
                          : sched.isAvailable
                          ? 'bg-slate-50 hover:bg-slate-100 text-slate-800 border-slate-200'
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

              {/* Selected Day Timings Card */}
              {(() => {
                const currentSched = (doctor.weeklySchedule || [])[selectedDayIndex] || (doctor.weeklySchedule || [])[0];
                if (!currentSched) return null;

                return (
                  <div className="space-y-3 pt-1">
                    <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 flex items-center justify-between">
                      <div>
                        <span className="text-xs font-bold text-slate-900 block">{currentSched.day} Clinic Schedule</span>
                        <span className="text-[11px] text-slate-500">
                          {currentSched.isAvailable ? currentSched.timeRange : 'No clinic timings on this day'}
                        </span>
                      </div>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          currentSched.isAvailable
                            ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                            : 'bg-rose-100 text-rose-800 border border-rose-200'
                        }`}
                      >
                        {currentSched.isAvailable ? 'Consultation Open' : 'Doctor Unavailable'}
                      </span>
                    </div>

                    {currentSched.isAvailable ? (
                      <div className="space-y-3">
                        {/* Morning Slots */}
                        <div>
                          <div className="text-[11px] font-bold text-slate-600 mb-1.5 flex items-center space-x-1">
                            <Clock className="w-3 h-3 text-amber-500" />
                            <span>Morning Slots (09:00 AM - 12:00 PM)</span>
                          </div>
                          <div className="grid grid-cols-3 gap-1.5">
                            {currentSched.morningSlots.map((slot) => (
                              <button
                                key={slot}
                                onClick={() => startBooking(doctor)}
                                className="py-2 px-2 bg-slate-50 hover:bg-emerald-50 hover:border-emerald-600 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 text-center transition-all"
                              >
                                {slot}
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* Afternoon Slots */}
                        {currentSched.afternoonSlots.length > 0 && (
                          <div>
                            <div className="text-[11px] font-bold text-slate-600 mb-1.5 flex items-center space-x-1">
                              <Clock className="w-3 h-3 text-orange-500" />
                              <span>Afternoon Slots (12:00 PM - 04:00 PM)</span>
                            </div>
                            <div className="grid grid-cols-3 gap-1.5">
                              {currentSched.afternoonSlots.map((slot) => (
                                <button
                                  key={slot}
                                  onClick={() => startBooking(doctor)}
                                  className="py-2 px-2 bg-slate-50 hover:bg-emerald-50 hover:border-emerald-600 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 text-center transition-all"
                                >
                                  {slot}
                                </button>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Evening Slots */}
                        {currentSched.eveningSlots.length > 0 && (
                          <div>
                            <div className="text-[11px] font-bold text-slate-600 mb-1.5 flex items-center space-x-1">
                              <Clock className="w-3 h-3 text-indigo-500" />
                              <span>Evening Slots (04:00 PM - 08:00 PM)</span>
                            </div>
                            <div className="grid grid-cols-3 gap-1.5">
                              {currentSched.eveningSlots.map((slot) => (
                                <button
                                  key={slot}
                                  onClick={() => startBooking(doctor)}
                                  className="py-2 px-2 bg-slate-50 hover:bg-emerald-50 hover:border-emerald-600 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 text-center transition-all"
                                >
                                  {slot}
                                </button>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="p-6 bg-slate-50 rounded-2xl text-center space-y-1.5 border border-slate-200">
                        <Calendar className="w-7 h-7 text-slate-400 mx-auto" />
                        <p className="text-xs font-bold text-slate-700">Doctor not available on {currentSched.day}</p>
                        <p className="text-[11px] text-slate-500">Select another day from the weekday list above.</p>
                      </div>
                    )}
                  </div>
                );
              })()}
            </div>
          )}

          {/* ABOUT */}
          {activeTab === 'ABOUT' && (
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">About the Doctor</h4>
              <p className="text-xs text-slate-700 leading-relaxed">{doctor.about}</p>

              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-600">
                <span className="font-medium">Medical Registration:</span>
                <span className="font-mono font-bold text-slate-800">{doctor.registrationNumber}</span>
              </div>
            </div>
          )}

          {/* EDUCATION */}
          {activeTab === 'EDUCATION' && (
            <div className="space-y-2.5">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Medical Qualifications</h4>
              <div className="space-y-2">
                {doctor.education.map((edu, idx) => (
                  <div key={idx} className="flex items-start space-x-2.5 text-xs text-slate-700">
                    <GraduationCap className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                    <span>{edu}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* EXPERIENCE */}
          {activeTab === 'EXPERIENCE' && (
            <div className="space-y-2.5">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Professional Experience</h4>
              <div className="p-3 bg-slate-50 rounded-xl space-y-1 text-xs">
                <div className="font-bold text-slate-900">{doctor.experienceYears}+ Years Clinical Practice</div>
                <div className="text-slate-600">{doctor.hospital}</div>
                <div className="text-[11px] text-slate-500">{doctor.hospitalAddress}</div>
              </div>
            </div>
          )}

          {/* SPECIALIZATIONS */}
          {activeTab === 'SPECIALIZATIONS' && (
            <div className="space-y-2.5">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Areas of Expertise</h4>
              <div className="flex flex-wrap gap-1.5">
                {doctor.specializations.map((spec, idx) => (
                  <span
                    key={idx}
                    className="px-2.5 py-1 bg-emerald-50 text-emerald-900 text-xs font-medium rounded-lg border border-emerald-200"
                  >
                    {spec}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* LANGUAGES */}
          {activeTab === 'LANGUAGES' && (
            <div className="space-y-2.5">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Languages Spoken</h4>
              <div className="flex flex-wrap gap-1.5">
                {doctor.languages.map((lang, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1 bg-slate-100 text-slate-800 text-xs font-semibold rounded-lg"
                  >
                    {lang}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* REVIEWS */}
          {activeTab === 'REVIEWS' && (
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Patient Feedback</h4>
              <div className="space-y-2.5">
                {doctor.reviews.map((rev) => (
                  <div key={rev.id} className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-1.5">
                        <span className="text-xs font-bold text-slate-900">{rev.patientName}</span>
                        {rev.verifiedVisit && (
                          <span className="text-[9px] bg-emerald-100 text-emerald-800 px-1 py-0.2 rounded font-bold">
                            Verified Patient
                          </span>
                        )}
                      </div>
                      <div className="flex items-center space-x-1 text-[11px] font-bold text-amber-700">
                        <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                        <span>{rev.rating}.0</span>
                      </div>
                    </div>
                    <p className="text-xs text-slate-600 mt-1 leading-relaxed">{rev.comment}</p>
                    <span className="text-[10px] text-slate-400 block mt-1">{rev.date}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Sticky Bottom CTA */}
      <div className="fixed bottom-0 left-0 right-0 max-w-md mx-auto z-40 bg-white border-t border-slate-200 p-4 shadow-lg flex items-center space-x-3">
        {doctor.isAvailableNow && doctor.availableForVideo !== false && (
          <button
            id="doctor-profile-instant-btn"
            onClick={() => startInstantConsultation(doctor)}
            className="p-3.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-900 rounded-2xl font-bold text-xs flex items-center justify-center space-x-1.5 transition-colors active:scale-95"
          >
            <Video className="w-4 h-4 text-emerald-700" />
            <span>Instant</span>
          </button>
        )}

        <button
          id="doctor-profile-sticky-book-btn"
          onClick={() => startBooking(doctor)}
          className="flex-1 py-3.5 bg-emerald-800 hover:bg-emerald-900 text-white rounded-2xl font-bold text-xs flex items-center justify-center space-x-2 shadow-xs transition-colors active:scale-[0.98]"
        >
          <Calendar className="w-4 h-4" />
          <span>Book Appointment (Visiting Fee: ₹{doctor.feeInClinic})</span>
        </button>
      </div>
    </div>
  );
};
