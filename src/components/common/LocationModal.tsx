import React, { useState } from 'react';
import { MapPin, Navigation, X, Check, Search } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { INDIAN_CITIES } from '../../data/mockData';

export const LocationModal: React.FC = () => {
  const { showLocationModal, setShowLocationModal, currentLocation, setCurrentLocation, showToast } = useApp();
  const [citySearch, setCitySearch] = useState('');
  const [isDetecting, setIsDetecting] = useState(false);

  if (!showLocationModal) return null;

  const filteredCities = INDIAN_CITIES.filter((city) =>
    city.toLowerCase().includes(citySearch.toLowerCase())
  );

  const handleSelectCity = (city: string) => {
    let state = 'India';
    if (city === 'Agartala') state = 'Tripura';
    else if (city === 'Guwahati' || city === 'Silchar') state = 'Assam';
    else if (city === 'Kolkata') state = 'West Bengal';
    else if (city === 'Delhi') state = 'NCR';
    else if (city === 'Mumbai' || city === 'Pune') state = 'Maharashtra';
    else if (city === 'Bengaluru') state = 'Karnataka';
    else if (city === 'Hyderabad') state = 'Telangana';
    else if (city === 'Chennai') state = 'Tamil Nadu';
    else if (city === 'Jaipur') state = 'Rajasthan';
    else if (city === 'Shillong') state = 'Meghalaya';

    setCurrentLocation({
      city,
      state,
      area: `${city} Central`,
    });
    setShowLocationModal(false);
    showToast(`Location set to ${city}, ${state}`);
  };

  const handleUseCurrentLocation = () => {
    setIsDetecting(true);
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        () => {
          setIsDetecting(false);
          // Set to Agartala or detected city
          handleSelectCity('Agartala');
        },
        () => {
          setIsDetecting(false);
          // Fallback to Agartala default
          handleSelectCity('Agartala');
        },
        { timeout: 3000 }
      );
    } else {
      setTimeout(() => {
        setIsDetecting(false);
        handleSelectCity('Agartala');
      }, 1000);
    }
  };

  return (
    <div
      id="location-permission-modal"
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in duration-200"
    >
      <div
        className="w-full max-w-md bg-white rounded-t-3xl sm:rounded-3xl p-6 shadow-2xl max-h-[85vh] flex flex-col animate-in slide-in-from-bottom duration-250"
      >
        {/* Header */}
        <div className="flex items-start justify-between pb-4 border-b border-slate-100">
          <div>
            <div className="flex items-center space-x-2 text-emerald-800 font-bold">
              <MapPin className="w-5 h-5 text-emerald-600" />
              <h3 className="text-lg font-heading font-bold text-slate-900">Find Doctors Near You</h3>
            </div>
            <p className="text-xs text-slate-600 mt-1">
              Allow SehatSetu to use your location to show nearby doctors, clinics and hospitals.
            </p>
          </div>
          <button
            id="close-location-modal-btn"
            onClick={() => setShowLocationModal(false)}
            className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* GPS Auto-detect button */}
        <div className="pt-4 pb-2">
          <button
            id="allow-gps-location-btn"
            onClick={handleUseCurrentLocation}
            disabled={isDetecting}
            className="w-full bg-emerald-50 hover:bg-emerald-100/80 border border-emerald-200 text-emerald-900 px-4 py-3 rounded-2xl flex items-center justify-between font-semibold text-sm transition-all active:scale-[0.98]"
          >
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center">
                <Navigation className={`w-4 h-4 ${isDetecting ? 'animate-spin' : ''}`} />
              </div>
              <div className="text-left">
                <div className="text-sm font-bold text-emerald-950">
                  {isDetecting ? 'Detecting current GPS location...' : 'Allow Location (Auto-detect)'}
                </div>
                <div className="text-xs text-emerald-700 font-normal">Use device GPS for accurate nearby results</div>
              </div>
            </div>
          </button>
        </div>

        {/* City Search */}
        <div className="py-2">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
            Or Enter Location Manually
          </div>
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              id="city-search-input"
              type="text"
              placeholder="Search Indian city (e.g. Agartala, Kolkata)..."
              value={citySearch}
              onChange={(e) => setCitySearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:bg-white"
            />
          </div>
        </div>

        {/* Popular Cities Grid */}
        <div className="flex-1 overflow-y-auto pt-2 no-scrollbar">
          <div className="grid grid-cols-2 gap-2 pb-4">
            {filteredCities.map((city) => {
              const isSelected = currentLocation.city === city;
              return (
                <button
                  key={city}
                  id={`city-select-${city.toLowerCase()}`}
                  onClick={() => handleSelectCity(city)}
                  className={`p-3 rounded-xl border text-left flex items-center justify-between text-sm transition-all ${
                    isSelected
                      ? 'bg-emerald-800 text-white border-emerald-800 font-semibold shadow-xs'
                      : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-200'
                  }`}
                >
                  <div className="flex items-center space-x-2">
                    <MapPin className={`w-3.5 h-3.5 ${isSelected ? 'text-emerald-300' : 'text-slate-400'}`} />
                    <span>{city}</span>
                  </div>
                  {isSelected && <Check className="w-4 h-4 text-emerald-300" />}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
