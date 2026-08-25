import React, { useState, useMemo } from 'react';
import {
  Search,
  Filter,
  SlidersHorizontal,
  Star,
  Clock,
  ShieldCheck,
  Building2,
  Video,
  VideoOff,
  MapPin,
  X,
  RotateCcw,
  Check,
  Grid,
  ChevronRight,
  GraduationCap,
  Sparkles,
  Calendar,
  Info,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { SPECIALTIES, INDIAN_CITIES } from '../../data/mockData';
import { Doctor, SpecialtyType, QualificationDegree, QUALIFICATION_OPTIONS, DaySchedule } from '../../types';

type SortOption = 'RECOMMENDED' | 'RATING' | 'FEE_LOW' | 'EXP_HIGH' | 'EARLIEST';

const POPULAR_SPECIALTIES: SpecialtyType[] = [
  'General Physician',
  'Child Specialist',
  'Gynecologist',
  'Dermatologist',
  'Orthopedic',
  'Cardiologist',
  'Neurologist',
  'ENT',
];

export const FindDoctorsScreen: React.FC = () => {
  const {
    doctors,
    searchQuery,
    setSearchQuery,
    selectedSpecialtyFilter,
    setSelectedSpecialtyFilter,
    selectedTypeFilter,
    setSelectedTypeFilter,
    setSelectedDoctor,
    startBooking,
    setActiveScreen,
    currentLocation,
  } = useApp();

  // Filters State
  const [showFilterDrawer, setShowFilterDrawer] = useState(false);
  const [showAllSpecialtiesModal, setShowAllSpecialtiesModal] = useState(false);
  const [scheduleDoctorModal, setScheduleDoctorModal] = useState<Doctor | null>(null);
  const [selectedScheduleDayIndex, setSelectedScheduleDayIndex] = useState<number>(0);
  const [specialtySearchQuery, setSpecialtySearchQuery] = useState('');
  const [selectedQualification, setSelectedQualification] = useState<string>('ALL');
  const [selectedCity, setSelectedCity] = useState<string>('ALL');
  const [selectedGender, setSelectedGender] = useState<'ALL' | 'Male' | 'Female'>('ALL');
  const [selectedLanguage, setSelectedLanguage] = useState<string>('ALL');
  const [minRating, setMinRating] = useState<number>(0);
  const [maxFee, setMaxFee] = useState<number>(1000);
  const [onlyAvailableNow, setOnlyAvailableNow] = useState(false);
  const [sortBy, setSortBy] = useState<SortOption>('RECOMMENDED');

  // Filtered & Sorted Doctors
  const filteredDoctors = useMemo(() => {
    return doctors.filter((doc) => {
      // 1. Search Query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = doc.name.toLowerCase().includes(q);
        const matchesSpec = doc.specialty.toLowerCase().includes(q);
        const matchesHosp = doc.hospital.toLowerCase().includes(q);
        const matchesCity = doc.city.toLowerCase().includes(q);
        const matchesQual = doc.qualifications.toLowerCase().includes(q);
        if (!matchesName && !matchesSpec && !matchesHosp && !matchesCity && !matchesQual) return false;
      }

      // 2. Specialty Filter
      if (selectedSpecialtyFilter !== 'ALL') {
        if (selectedSpecialtyFilter === 'Child Specialist' || selectedSpecialtyFilter === 'Pediatrician') {
          if (doc.specialty !== 'Child Specialist' && doc.specialty !== 'Pediatrician') return false;
        } else if (doc.specialty !== selectedSpecialtyFilter) {
          return false;
        }
      }

      // 3. Qualification Filter (MD / MS / DNB / DM / MCh / MBBS as separate filter)
      if (selectedQualification !== 'ALL') {
        const targetQ = selectedQualification.toUpperCase();
        const qualUpper = (doc.qualifications || '').toUpperCase();
        const eduUpper = (doc.education || []).join(' ').toUpperCase();
        if (!qualUpper.includes(targetQ) && !eduUpper.includes(targetQ)) {
          return false;
        }
      }

      // 4. Consultation Mode Filter
      if (selectedTypeFilter === 'VIDEO' && doc.feeVideo <= 0) return false;
      if (selectedTypeFilter === 'IN_CLINIC' && doc.feeInClinic <= 0) return false;

      // 5. City Filter
      if (selectedCity !== 'ALL' && doc.city !== selectedCity) return false;

      // 6. Gender Filter
      if (selectedGender !== 'ALL' && doc.gender !== selectedGender) return false;

      // 7. Language Filter
      if (selectedLanguage !== 'ALL' && !doc.languages.includes(selectedLanguage)) return false;

      // 8. Rating Filter
      if (minRating > 0 && doc.rating < minRating) return false;

      // 9. Fee Filter
      if (doc.feeVideo > maxFee && doc.feeInClinic > maxFee) return false;

      // 10. Availability Filter
      if (onlyAvailableNow && !doc.isAvailableNow) return false;

      return true;
    }).sort((a, b) => {
      if (sortBy === 'RATING') return b.rating - a.rating;
      if (sortBy === 'FEE_LOW') return a.feeVideo - b.feeVideo;
      if (sortBy === 'EXP_HIGH') return b.experienceYears - a.experienceYears;
      if (sortBy === 'EARLIEST') return (b.isAvailableNow ? 1 : 0) - (a.isAvailableNow ? 1 : 0);
      return 0; // Default recommended
    });
  }, [
    doctors,
    searchQuery,
    selectedSpecialtyFilter,
    selectedQualification,
    selectedTypeFilter,
    selectedCity,
    selectedGender,
    selectedLanguage,
    minRating,
    maxFee,
    onlyAvailableNow,
    sortBy,
  ]);

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedSpecialtyFilter('ALL');
    setSelectedQualification('ALL');
    setSelectedTypeFilter('ALL');
    setSelectedCity('ALL');
    setSelectedGender('ALL');
    setSelectedLanguage('ALL');
    setMinRating(0);
    setMaxFee(1000);
    setOnlyAvailableNow(false);
    setSortBy('RECOMMENDED');
  };

  const activeFiltersCount =
    (selectedSpecialtyFilter !== 'ALL' ? 1 : 0) +
    (selectedQualification !== 'ALL' ? 1 : 0) +
    (selectedCity !== 'ALL' ? 1 : 0) +
    (selectedGender !== 'ALL' ? 1 : 0) +
    (selectedLanguage !== 'ALL' ? 1 : 0) +
    (minRating > 0 ? 1 : 0) +
    (maxFee < 1000 ? 1 : 0) +
    (onlyAvailableNow ? 1 : 0);

  const filteredModalSpecialties = SPECIALTIES.filter((s) => {
    if (!specialtySearchQuery.trim()) return true;
    const q = specialtySearchQuery.toLowerCase();
    return (
      s.name.toLowerCase().includes(q) ||
      s.tagline.toLowerCase().includes(q) ||
      s.commonSymptoms.some((sym) => sym.toLowerCase().includes(q))
    );
  });

  return (
    <div id="find-doctors-screen" className="space-y-4 pb-24 animate-in fade-in duration-200">
      {/* Top Search Bar & Filter Button */}
      <div className="px-4 sticky top-14 z-30 bg-white/95 backdrop-blur-md pt-2 pb-3 border-b border-slate-100 space-y-2.5">
        <div className="flex items-center space-x-2">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              id="find-doctors-search-input"
              type="text"
              placeholder="Search doctors, specialties, degrees (MD, MS), hospitals..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-8 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 placeholder:text-slate-400 focus:bg-white focus:ring-2 focus:ring-emerald-700"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          <button
            id="open-filter-drawer-btn"
            onClick={() => setShowFilterDrawer(true)}
            className={`p-2.5 rounded-xl border flex items-center justify-center transition-all ${
              activeFiltersCount > 0
                ? 'bg-emerald-800 text-white border-emerald-800 shadow-xs'
                : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
            }`}
            aria-label="Open Filters"
          >
            <SlidersHorizontal className="w-4 h-4" />
            {activeFiltersCount > 0 && (
              <span className="ml-1 text-[10px] font-bold bg-white text-emerald-900 px-1 rounded-full">
                {activeFiltersCount}
              </span>
            )}
          </button>
        </div>

        {/* Consultation Mode Tabs: ALL, VIDEO, IN-CLINIC */}
        <div className="grid grid-cols-3 gap-1.5 bg-slate-100 p-1 rounded-xl">
          <button
            id="tab-mode-all"
            onClick={() => setSelectedTypeFilter('ALL')}
            className={`py-1.5 rounded-lg text-xs font-bold transition-all ${
              selectedTypeFilter === 'ALL'
                ? 'bg-white text-emerald-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            ALL MODES
          </button>
          <button
            id="tab-mode-video"
            onClick={() => setSelectedTypeFilter('VIDEO')}
            className={`py-1.5 rounded-lg text-xs font-bold transition-all flex items-center justify-center space-x-1 ${
              selectedTypeFilter === 'VIDEO'
                ? 'bg-white text-emerald-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Video className="w-3.5 h-3.5" />
            <span>VIDEO</span>
          </button>
          <button
            id="tab-mode-clinic"
            onClick={() => setSelectedTypeFilter('IN_CLINIC')}
            className={`py-1.5 rounded-lg text-xs font-bold transition-all flex items-center justify-center space-x-1 ${
              selectedTypeFilter === 'IN_CLINIC'
                ? 'bg-white text-emerald-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Building2 className="w-3.5 h-3.5" />
            <span>IN-CLINIC</span>
          </button>
        </div>

        {/* Horizontal Specialty Chips with prominent "View All Specialties" button */}
        <div>
          <div className="flex items-center justify-between mb-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Specialty Category
            </span>
            <button
              id="view-all-specialties-trigger-btn"
              onClick={() => setShowAllSpecialtiesModal(true)}
              className="text-[11px] font-bold text-emerald-800 hover:text-emerald-900 flex items-center space-x-1 py-0.5"
            >
              <Grid className="w-3 h-3 text-emerald-700" />
              <span>View All ({SPECIALTIES.length} Specialties)</span>
            </button>
          </div>
          <div className="flex space-x-1.5 overflow-x-auto pb-1 no-scrollbar">
            <button
              id="filter-specialty-all"
              onClick={() => setSelectedSpecialtyFilter('ALL')}
              className={`px-3 py-1 rounded-full text-[11px] font-semibold shrink-0 border transition-all ${
                selectedSpecialtyFilter === 'ALL'
                  ? 'bg-emerald-800 text-white border-emerald-800 shadow-xs'
                  : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
              }`}
            >
              All Categories
            </button>
            {POPULAR_SPECIALTIES.map((specId) => {
              const meta = SPECIALTIES.find((s) => s.id === specId);
              if (!meta) return null;
              const isSelected = selectedSpecialtyFilter === specId;
              return (
                <button
                  key={meta.id}
                  onClick={() => setSelectedSpecialtyFilter(meta.id)}
                  className={`px-3 py-1 rounded-full text-[11px] font-semibold shrink-0 border transition-all ${
                    isSelected
                      ? 'bg-emerald-800 text-white border-emerald-800 shadow-xs font-bold'
                      : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  {meta.name}
                </button>
              );
            })}

            {/* If a non-popular specialty is selected, render it here */}
            {selectedSpecialtyFilter !== 'ALL' &&
              !POPULAR_SPECIALTIES.includes(selectedSpecialtyFilter as SpecialtyType) && (
                <button
                  onClick={() => setSelectedSpecialtyFilter(selectedSpecialtyFilter)}
                  className="px-3 py-1 rounded-full text-[11px] font-bold shrink-0 border bg-emerald-800 text-white border-emerald-800 shadow-xs flex items-center space-x-1"
                >
                  <span>{selectedSpecialtyFilter}</span>
                  <X
                    className="w-3 h-3 ml-1"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedSpecialtyFilter('ALL');
                    }}
                  />
                </button>
              )}

            <button
              id="view-all-specialties-chip-btn"
              onClick={() => setShowAllSpecialtiesModal(true)}
              className="px-3 py-1 rounded-full text-[11px] font-bold shrink-0 border border-emerald-300 bg-emerald-50 text-emerald-900 hover:bg-emerald-100 flex items-center space-x-1 transition-all"
            >
              <Grid className="w-3 h-3 text-emerald-700" />
              <span>More Specialties...</span>
            </button>
          </div>
        </div>

        {/* Dedicated Qualifications Filter (Separate from Doctor Categories) */}
        <div className="pt-0.5 border-t border-slate-100/80">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center space-x-1">
              <GraduationCap className="w-3 h-3 text-slate-400" />
              <span>Qualification / Degree Filter:</span>
            </span>
            {selectedQualification !== 'ALL' && (
              <button
                onClick={() => setSelectedQualification('ALL')}
                className="text-[10px] font-semibold text-rose-600 hover:underline"
              >
                Clear Degree Filter
              </button>
            )}
          </div>
          <div className="flex space-x-1.5 overflow-x-auto pb-0.5 no-scrollbar">
            <button
              id="filter-qual-all"
              onClick={() => setSelectedQualification('ALL')}
              className={`px-2.5 py-0.5 rounded-lg text-[10px] font-bold shrink-0 border transition-all ${
                selectedQualification === 'ALL'
                  ? 'bg-slate-800 text-white border-slate-800 shadow-2xs'
                  : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
              }`}
            >
              All Degrees
            </button>
            {QUALIFICATION_OPTIONS.map((deg) => (
              <button
                key={deg}
                id={`filter-qual-${deg.toLowerCase()}`}
                onClick={() => setSelectedQualification(selectedQualification === deg ? 'ALL' : deg)}
                className={`px-2.5 py-0.5 rounded-lg text-[10px] font-bold shrink-0 border transition-all ${
                  selectedQualification === deg
                    ? 'bg-emerald-700 text-white border-emerald-700 shadow-2xs'
                    : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-emerald-50 hover:text-emerald-800'
                }`}
              >
                {deg}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Results Header with Sorting */}
      <div className="px-4 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <span className="text-xs text-slate-500 font-medium">
            Showing <strong className="text-slate-900">{filteredDoctors.length}</strong> doctors
          </span>
          {selectedSpecialtyFilter !== 'ALL' && (
            <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-md">
              {selectedSpecialtyFilter}
            </span>
          )}
          {selectedQualification !== 'ALL' && (
            <span className="text-[10px] font-bold bg-amber-100 text-amber-900 px-2 py-0.5 rounded-md">
              Degree: {selectedQualification}
            </span>
          )}
        </div>

        {/* Sort dropdown */}
        <div className="flex items-center space-x-1 text-xs">
          <span className="text-slate-400">Sort by:</span>
          <select
            id="doctors-sort-select"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as SortOption)}
            className="bg-transparent text-emerald-900 font-bold text-xs focus:outline-none cursor-pointer"
          >
            <option value="RECOMMENDED">Recommended</option>
            <option value="RATING">Highest Rated</option>
            <option value="FEE_LOW">Lowest Fee</option>
            <option value="EXP_HIGH">Most Experienced</option>
            <option value="EARLIEST">Earliest Available</option>
          </select>
        </div>
      </div>

      {/* Doctor Results List */}
      <div className="px-4 space-y-3">
        {filteredDoctors.length === 0 ? (
          /* Empty State */
          <div className="p-8 bg-white rounded-3xl border border-slate-200 text-center space-y-3 my-4 shadow-xs">
            <div className="w-14 h-14 rounded-full bg-slate-100 text-slate-400 mx-auto flex items-center justify-center">
              <Search className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-900 font-heading">No doctors found</h4>
              <p className="text-xs text-slate-500 mt-1 max-w-xs mx-auto">
                No doctors matched your specialty or qualification filter ({selectedSpecialtyFilter !== 'ALL' ? selectedSpecialtyFilter : ''} {selectedQualification !== 'ALL' ? `• Degree: ${selectedQualification}` : ''}).
              </p>
            </div>
            <button
              id="empty-state-reset-btn"
              onClick={handleResetFilters}
              className="mt-2 py-2 px-4 bg-emerald-50 text-emerald-900 hover:bg-emerald-100 rounded-xl text-xs font-bold inline-flex items-center space-x-1.5 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset All Filters</span>
            </button>
          </div>
        ) : (
          filteredDoctors.map((doc) => (
            <div
              key={doc.id}
              id={`doctor-card-${doc.id}`}
              className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs hover:border-slate-300 transition-all space-y-3"
            >
              {/* Doctor Details */}
              <div className="flex items-start space-x-3.5">
                <div className="relative shrink-0">
                  <img
                    src={doc.image}
                    alt={doc.name}
                    className="w-14 h-14 rounded-2xl object-cover border border-slate-100 shadow-2xs"
                    referrerPolicy="no-referrer"
                  />
                  {doc.isAvailableNow && (
                    <span
                      title="Available Now"
                      className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 border-2 border-white rounded-full flex items-center justify-center"
                    >
                      <span className="w-1.5 h-1.5 bg-white rounded-full animate-ping" />
                    </span>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-1.5 truncate">
                      <h4 className="text-sm font-bold text-slate-900 truncate font-heading">{doc.name}</h4>
                      {doc.verified && (
                        <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" title="Verified Specialist" />
                      )}
                    </div>

                    <div className="flex items-center space-x-1 bg-amber-50 px-1.5 py-0.5 rounded-lg text-[11px] font-bold text-amber-900 shrink-0">
                      <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                      <span>{doc.rating}</span>
                      <span className="text-[10px] text-amber-700/80 font-normal">({doc.reviewCount})</span>
                    </div>
                  </div>

                  <div className="flex items-center flex-wrap gap-1 mt-0.5">
                    <span className="text-xs font-semibold text-emerald-800">{doc.specialty}</span>
                    <span className="text-[10px] text-slate-300">•</span>
                    <span className="text-xs text-slate-600 truncate">{doc.qualifications}</span>
                  </div>

                  <div className="flex items-center space-x-2 text-[11px] text-slate-500 mt-1">
                    <span className="font-medium">{doc.experienceYears} yrs experience</span>
                    <span>•</span>
                    <span className="truncate">{doc.hospital}</span>
                  </div>

                  {/* Video vs In-Clinic Badge */}
                  <div className="mt-1.5 flex items-center space-x-1.5">
                    {doc.availableForVideo !== false ? (
                      <span className="inline-flex items-center space-x-1 text-[10px] font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200 px-2 py-0.5 rounded-md">
                        <Video className="w-3 h-3 text-emerald-600" />
                        <span>Video Consult Available</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center space-x-1 text-[10px] font-semibold bg-slate-100 text-slate-700 border border-slate-200 px-2 py-0.5 rounded-md">
                        <Building2 className="w-3 h-3 text-slate-500" />
                        <span>In-Clinic Only (No Video)</span>
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Visiting Fees & Schedule Availability */}
              <div className="pt-2 border-t border-slate-100 grid grid-cols-2 gap-2 text-xs">
                {doc.availableForVideo !== false ? (
                  <div className="bg-slate-50/80 p-2 rounded-xl border border-slate-100">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] text-slate-500 font-medium flex items-center space-x-1">
                        <Video className="w-3 h-3 text-emerald-600" />
                        <span>Video Consult</span>
                      </span>
                      <span className="font-bold text-slate-900">₹{doc.feeVideo}</span>
                    </div>
                    <div className="flex items-center space-x-1 text-[10px] text-emerald-700 font-semibold mt-1 truncate">
                      <Clock className="w-3 h-3 shrink-0" />
                      <span className="truncate">{doc.nextSlotVideo}</span>
                    </div>
                  </div>
                ) : (
                  <div className="bg-slate-50/80 p-2 rounded-xl border border-slate-100 opacity-60">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] text-slate-400 font-medium flex items-center space-x-1">
                        <VideoOff className="w-3 h-3" />
                        <span>Video Call</span>
                      </span>
                      <span className="text-[10px] text-slate-400 font-bold">N/A</span>
                    </div>
                    <div className="text-[10px] text-slate-400 mt-1 truncate">Not offering video</div>
                  </div>
                )}

                <div className="bg-slate-50/80 p-2 rounded-xl border border-slate-100">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] text-slate-500 font-medium flex items-center space-x-1">
                      <Building2 className="w-3 h-3 text-slate-600" />
                      <span>Visiting Fee</span>
                    </span>
                    <span className="font-bold text-slate-900">₹{doc.feeInClinic}</span>
                  </div>
                  <div className="flex items-center space-x-1 text-[10px] text-slate-600 font-medium mt-1 truncate">
                    <MapPin className="w-3 h-3 shrink-0 text-slate-400" />
                    <span className="truncate">{doc.location}</span>
                  </div>
                </div>
              </div>

              {/* Visiting fee disclaimer */}
              <div className="bg-amber-50/70 border border-amber-200/80 p-2 rounded-xl text-[10px] text-amber-900 flex items-center justify-between">
                <span className="flex items-center space-x-1">
                  <Info className="w-3 h-3 text-amber-700 shrink-0" />
                  <span>Doctor visiting fee (₹{doc.feeInClinic}) is payable directly at doctor's clinic.</span>
                </span>
              </div>

              {/* Action Buttons: Schedule, Profile, Book */}
              <div className="grid grid-cols-3 gap-1.5 pt-1">
                <button
                  id={`check-schedule-btn-${doc.id}`}
                  onClick={() => {
                    setScheduleDoctorModal(doc);
                    setSelectedScheduleDayIndex(0);
                  }}
                  className="py-2.5 px-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-900 rounded-xl text-xs font-bold text-center flex items-center justify-center space-x-1 transition-colors"
                  title="Check availability for whole week and timeslots"
                >
                  <Calendar className="w-3.5 h-3.5 text-emerald-700" />
                  <span>Schedule</span>
                </button>
                <button
                  id={`view-profile-btn-${doc.id}`}
                  onClick={() => {
                    setSelectedDoctor(doc);
                    setActiveScreen('doctor-profile');
                  }}
                  className="py-2.5 px-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-bold text-center transition-colors"
                >
                  Profile
                </button>
                <button
                  id={`book-appointment-btn-${doc.id}`}
                  onClick={() => startBooking(doc)}
                  className="py-2.5 px-2 bg-emerald-800 hover:bg-emerald-900 text-white rounded-xl text-xs font-bold text-center shadow-xs transition-colors active:scale-95"
                >
                  Book Slot
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* DOCTOR WEEKLY SCHEDULE MODAL */}
      {scheduleDoctorModal && (
        <div
          id="doctor-weekly-schedule-modal"
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 animate-in fade-in duration-200"
        >
          <div className="w-full max-w-lg bg-white rounded-3xl p-5 shadow-2xl max-h-[88vh] flex flex-col animate-in zoom-in-95 duration-200 border border-slate-200">
            {/* Modal Header */}
            <div className="flex items-start justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center space-x-3">
                <img
                  src={scheduleDoctorModal.image}
                  alt={scheduleDoctorModal.name}
                  className="w-12 h-12 rounded-2xl object-cover ring-1 ring-slate-100"
                  referrerPolicy="no-referrer"
                />
                <div>
                  <div className="flex items-center space-x-1.5">
                    <h3 className="text-sm font-bold text-slate-900 font-heading">{scheduleDoctorModal.name}</h3>
                    {scheduleDoctorModal.verified && (
                      <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                    )}
                  </div>
                  <p className="text-xs text-emerald-800 font-semibold">{scheduleDoctorModal.specialty}</p>
                  <p className="text-[11px] text-slate-500">Weekly Availability & Timeslots</p>
                </div>
              </div>
              <button
                id="close-schedule-modal-btn"
                onClick={() => setScheduleDoctorModal(null)}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-full"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Video Mode Notice */}
            <div className="py-2.5">
              {scheduleDoctorModal.availableForVideo !== false ? (
                <div className="bg-emerald-50 border border-emerald-200 p-2 rounded-xl text-xs text-emerald-900 flex items-center justify-between">
                  <span className="flex items-center space-x-1.5">
                    <Video className="w-4 h-4 text-emerald-700 shrink-0" />
                    <span>Offers both <strong>Video Consultations</strong> and <strong>In-Clinic Visits</strong></span>
                  </span>
                </div>
              ) : (
                <div className="bg-amber-50 border border-amber-200 p-2 rounded-xl text-xs text-amber-900 flex items-center justify-between">
                  <span className="flex items-center space-x-1.5">
                    <Building2 className="w-4 h-4 text-amber-700 shrink-0" />
                    <span>In-Clinic visits only. Video consultations not offered by doctor.</span>
                  </span>
                </div>
              )}
            </div>

            {/* Weekday Selector Tabs (Mon - Sun) */}
            <div className="py-1">
              <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1.5">
                Select Day of the Week
              </label>
              <div className="grid grid-cols-7 gap-1">
                {(scheduleDoctorModal.weeklySchedule || []).map((sched, idx) => {
                  const isSelected = selectedScheduleDayIndex === idx;
                  return (
                    <button
                      key={sched.day}
                      id={`weekly-day-tab-${sched.day.toLowerCase()}`}
                      onClick={() => setSelectedScheduleDayIndex(idx)}
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
            </div>

            {/* Selected Day Availability & Slots Details */}
            {(() => {
              const currentSchedule =
                (scheduleDoctorModal.weeklySchedule || [])[selectedScheduleDayIndex] ||
                (scheduleDoctorModal.weeklySchedule || [])[0];

              if (!currentSchedule) return null;

              return (
                <div className="flex-1 overflow-y-auto py-3 space-y-3 no-scrollbar">
                  <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 flex items-center justify-between">
                    <div>
                      <span className="text-xs font-bold text-slate-900 block">{currentSchedule.day} Timings</span>
                      <span className="text-[11px] text-slate-500">
                        {currentSchedule.isAvailable
                          ? `${currentSchedule.timeRange} • ${scheduleDoctorModal.hospital}`
                          : 'Doctor is not consulting on this day'}
                      </span>
                    </div>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        currentSchedule.isAvailable
                          ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                          : 'bg-rose-100 text-rose-800 border border-rose-200'
                      }`}
                    >
                      {currentSchedule.isAvailable ? 'Available' : 'Day Off'}
                    </span>
                  </div>

                  {currentSchedule.isAvailable ? (
                    <div className="space-y-3">
                      {/* Morning Slots */}
                      <div>
                        <div className="text-[11px] font-bold text-slate-600 mb-1 flex items-center space-x-1">
                          <Clock className="w-3 h-3 text-amber-500" />
                          <span>Morning Slots (09:00 AM - 12:00 PM)</span>
                        </div>
                        <div className="grid grid-cols-3 gap-1.5">
                          {currentSchedule.morningSlots.map((slot) => (
                            <button
                              key={slot}
                              onClick={() => {
                                setScheduleDoctorModal(null);
                                startBooking(scheduleDoctorModal);
                              }}
                              className="py-1.5 px-2 bg-white hover:bg-emerald-50 hover:border-emerald-600 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 text-center transition-all shadow-2xs"
                            >
                              {slot}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Afternoon Slots */}
                      {currentSchedule.afternoonSlots.length > 0 && (
                        <div>
                          <div className="text-[11px] font-bold text-slate-600 mb-1 flex items-center space-x-1">
                            <Clock className="w-3 h-3 text-orange-500" />
                            <span>Afternoon Slots (12:00 PM - 04:00 PM)</span>
                          </div>
                          <div className="grid grid-cols-3 gap-1.5">
                            {currentSchedule.afternoonSlots.map((slot) => (
                              <button
                                key={slot}
                                onClick={() => {
                                  setScheduleDoctorModal(null);
                                  startBooking(scheduleDoctorModal);
                                }}
                                className="py-1.5 px-2 bg-white hover:bg-emerald-50 hover:border-emerald-600 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 text-center transition-all shadow-2xs"
                              >
                                {slot}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Evening Slots */}
                      {currentSchedule.eveningSlots.length > 0 && (
                        <div>
                          <div className="text-[11px] font-bold text-slate-600 mb-1 flex items-center space-x-1">
                            <Clock className="w-3 h-3 text-indigo-500" />
                            <span>Evening Slots (04:00 PM - 08:00 PM)</span>
                          </div>
                          <div className="grid grid-cols-3 gap-1.5">
                            {currentSchedule.eveningSlots.map((slot) => (
                              <button
                                key={slot}
                                onClick={() => {
                                  setScheduleDoctorModal(null);
                                  startBooking(scheduleDoctorModal);
                                }}
                                className="py-1.5 px-2 bg-white hover:bg-emerald-50 hover:border-emerald-600 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 text-center transition-all shadow-2xs"
                              >
                                {slot}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="p-6 bg-slate-50 rounded-2xl text-center space-y-2 border border-slate-200">
                      <Clock className="w-8 h-8 text-slate-400 mx-auto" />
                      <p className="text-xs font-semibold text-slate-700">Doctor has no appointments on {currentSchedule.day}</p>
                      <p className="text-[11px] text-slate-500">Please select another day of the week above to inspect open slots.</p>
                    </div>
                  )}
                </div>
              );
            })()}

            {/* Bottom Modal CTA */}
            <div className="pt-3 border-t border-slate-100 flex items-center space-x-2">
              <button
                onClick={() => setScheduleDoctorModal(null)}
                className="py-2.5 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold"
              >
                Close
              </button>
              <button
                id="schedule-modal-book-direct-btn"
                onClick={() => {
                  const doc = scheduleDoctorModal;
                  setScheduleDoctorModal(null);
                  startBooking(doc);
                }}
                className="flex-1 py-2.5 bg-emerald-800 hover:bg-emerald-900 text-white rounded-xl text-xs font-bold shadow-xs flex items-center justify-center space-x-1.5"
              >
                <Calendar className="w-3.5 h-3.5" />
                <span>Book Appointment with {scheduleDoctorModal.name}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* VIEW ALL SPECIALTIES MODAL (All 20 Categories) */}
      {showAllSpecialtiesModal && (
        <div
          id="all-specialties-modal-backdrop"
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 animate-in fade-in duration-200"
        >
          <div className="w-full max-w-lg bg-white rounded-3xl p-5 shadow-2xl max-h-[85vh] flex flex-col animate-in zoom-in-95 duration-200 border border-slate-200">
            {/* Header */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
                  <Grid className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900 font-heading">
                    All Medical Specialties ({SPECIALTIES.length})
                  </h3>
                  <p className="text-[11px] text-slate-500">Select a discipline to browse specialist doctors</p>
                </div>
              </div>
              <button
                onClick={() => {
                  setShowAllSpecialtiesModal(false);
                  setSpecialtySearchQuery('');
                }}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-full"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Specialty Search Bar */}
            <div className="pt-3 pb-2">
              <div className="relative">
                <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search specialty by name, symptom or organ..."
                  value={specialtySearchQuery}
                  onChange={(e) => setSpecialtySearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:bg-white focus:ring-2 focus:ring-emerald-700"
                />
              </div>
            </div>

            {/* Specialties Grid */}
            <div className="flex-1 overflow-y-auto py-2 grid grid-cols-1 sm:grid-cols-2 gap-2 no-scrollbar">
              <button
                onClick={() => {
                  setSelectedSpecialtyFilter('ALL');
                  setShowAllSpecialtiesModal(false);
                  setSpecialtySearchQuery('');
                }}
                className={`p-3 rounded-2xl border text-left flex items-start space-x-2.5 transition-all ${
                  selectedSpecialtyFilter === 'ALL'
                    ? 'bg-emerald-50 border-emerald-700 ring-1 ring-emerald-700'
                    : 'bg-white border-slate-200 hover:bg-slate-50'
                }`}
              >
                <div className="w-8 h-8 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center shrink-0">
                  <Grid className="w-4 h-4" />
                </div>
                <div>
                  <h5 className="text-xs font-bold text-slate-900">All Specialties</h5>
                  <p className="text-[10px] text-slate-500">Show all verified doctors across disciplines</p>
                </div>
              </button>

              {filteredModalSpecialties.map((s) => {
                const isSelected = selectedSpecialtyFilter === s.id;
                return (
                  <button
                    key={s.id}
                    id={`all-spec-item-${s.id}`}
                    onClick={() => {
                      setSelectedSpecialtyFilter(s.id);
                      setShowAllSpecialtiesModal(false);
                      setSpecialtySearchQuery('');
                    }}
                    className={`p-3 rounded-2xl border text-left flex items-start space-x-2.5 transition-all ${
                      isSelected
                        ? 'bg-emerald-50 border-emerald-700 ring-1 ring-emerald-700 shadow-2xs'
                        : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    <div
                      className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                        isSelected ? 'bg-emerald-700 text-white' : 'bg-emerald-50 text-emerald-800'
                      }`}
                    >
                      <Sparkles className="w-4 h-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h5 className="text-xs font-bold text-slate-900 truncate">{s.name}</h5>
                        <span className="text-[10px] font-bold text-slate-400">{s.doctorCount}+ docs</span>
                      </div>
                      <p className="text-[10px] text-slate-500 truncate mt-0.5">{s.tagline}</p>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Bottom Footer */}
            <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
              <span className="text-slate-500 text-[11px]">
                Showing {filteredModalSpecialties.length} of {SPECIALTIES.length} categories
              </span>
              <button
                onClick={() => {
                  setShowAllSpecialtiesModal(false);
                  setSpecialtySearchQuery('');
                }}
                className="py-1.5 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Comprehensive Filter Bottom Sheet */}
      {showFilterDrawer && (
        <div
          id="filter-drawer-backdrop"
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-end justify-center animate-in fade-in duration-200"
        >
          <div className="w-full max-w-md bg-white rounded-t-3xl p-5 shadow-2xl max-h-[85vh] flex flex-col animate-in slide-in-from-bottom duration-250">
            {/* Header */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center space-x-2">
                <SlidersHorizontal className="w-4 h-4 text-emerald-700" />
                <h3 className="text-base font-bold text-slate-900 font-heading">Filter Doctors</h3>
              </div>
              <button
                onClick={() => setShowFilterDrawer(false)}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-full"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Filter Body */}
            <div className="flex-1 overflow-y-auto py-4 space-y-4 no-scrollbar">
              {/* Doctor Qualification / Degree (Separate from Category) */}
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-2">
                  Doctor Qualification / Degree
                </label>
                <div className="flex flex-wrap gap-1.5">
                  <button
                    onClick={() => setSelectedQualification('ALL')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-medium border ${
                      selectedQualification === 'ALL'
                        ? 'bg-emerald-800 text-white border-emerald-800 font-bold'
                        : 'bg-white text-slate-700 border-slate-200'
                    }`}
                  >
                    All Degrees
                  </button>
                  {QUALIFICATION_OPTIONS.map((deg) => (
                    <button
                      key={deg}
                      onClick={() => setSelectedQualification(deg)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-medium border ${
                        selectedQualification === deg
                          ? 'bg-emerald-800 text-white border-emerald-800 font-bold'
                          : 'bg-white text-slate-700 border-slate-200'
                      }`}
                    >
                      {deg}
                    </button>
                  ))}
                </div>
              </div>

              {/* City / Location */}
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-2">
                  City / Location
                </label>
                <div className="flex flex-wrap gap-1.5">
                  <button
                    onClick={() => setSelectedCity('ALL')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-medium border ${
                      selectedCity === 'ALL'
                        ? 'bg-emerald-800 text-white border-emerald-800 font-bold'
                        : 'bg-white text-slate-700 border-slate-200'
                    }`}
                  >
                    All Cities
                  </button>
                  {INDIAN_CITIES.map((city) => (
                    <button
                      key={city}
                      onClick={() => setSelectedCity(city)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-medium border ${
                        selectedCity === city
                          ? 'bg-emerald-800 text-white border-emerald-800 font-bold'
                          : 'bg-white text-slate-700 border-slate-200'
                      }`}
                    >
                      {city}
                    </button>
                  ))}
                </div>
              </div>

              {/* Gender */}
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-2">
                  Doctor Gender
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(['ALL', 'Male', 'Female'] as const).map((g) => (
                    <button
                      key={g}
                      onClick={() => setSelectedGender(g)}
                      className={`py-2 rounded-xl text-xs font-medium border text-center ${
                        selectedGender === g
                          ? 'bg-emerald-800 text-white border-emerald-800 font-bold'
                          : 'bg-white text-slate-700 border-slate-200'
                      }`}
                    >
                      {g === 'ALL' ? 'Any Gender' : g}
                    </button>
                  ))}
                </div>
              </div>

              {/* Maximum Fee Slider */}
              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Max Consultation Fee
                  </label>
                  <span className="text-xs font-bold text-emerald-900">Up to ₹{maxFee}</span>
                </div>
                <input
                  type="range"
                  min="300"
                  max="1000"
                  step="50"
                  value={maxFee}
                  onChange={(e) => setMaxFee(Number(e.target.value))}
                  className="w-full accent-emerald-700"
                />
              </div>

              {/* Minimum Rating */}
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-2">
                  Rating
                </label>
                <div className="grid grid-cols-4 gap-1.5">
                  {[
                    { label: 'Any', val: 0 },
                    { label: '4.5+', val: 4.5 },
                    { label: '4.8+', val: 4.8 },
                    { label: '4.9+', val: 4.9 },
                  ].map((r) => (
                    <button
                      key={r.label}
                      onClick={() => setMinRating(r.val)}
                      className={`py-2 rounded-xl text-xs font-medium border text-center ${
                        minRating === r.val
                          ? 'bg-emerald-800 text-white border-emerald-800 font-bold'
                          : 'bg-white text-slate-700 border-slate-200'
                      }`}
                    >
                      {r.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Availability Toggle */}
              <div className="flex items-center justify-between p-3 bg-slate-50 rounded-2xl border border-slate-100">
                <div>
                  <span className="text-xs font-bold text-slate-900 block">Available Right Now</span>
                  <span className="text-[10px] text-slate-500">Show only online doctors for instant call</span>
                </div>
                <input
                  type="checkbox"
                  checked={onlyAvailableNow}
                  onChange={(e) => setOnlyAvailableNow(e.target.checked)}
                  className="w-5 h-5 accent-emerald-700 rounded"
                />
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="pt-3 border-t border-slate-100 flex items-center space-x-2">
              <button
                onClick={handleResetFilters}
                className="py-3 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold"
              >
                Reset All
              </button>
              <button
                onClick={() => setShowFilterDrawer(false)}
                className="flex-1 py-3 bg-emerald-800 hover:bg-emerald-900 text-white rounded-xl text-xs font-bold shadow-xs"
              >
                Apply Filters ({filteredDoctors.length} results)
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
