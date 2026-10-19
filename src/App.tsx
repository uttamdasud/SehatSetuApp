import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/common/Header';
import { BottomNav } from './components/common/BottomNav';
import { Toast } from './components/common/Toast';
import { LocationModal } from './components/common/LocationModal';
import { NotificationsModal } from './components/notifications/NotificationsModal';
import { DigitalPrescriptionModal } from './components/prescription/DigitalPrescriptionModal';
import { BookingFlowModal } from './components/booking/BookingFlowModal';
import { HomeScreen } from './components/home/HomeScreen';
import { FindDoctorsScreen } from './components/doctors/FindDoctorsScreen';
import { DoctorProfileScreen } from './components/doctors/DoctorProfileScreen';
import { SymptomCheckerScreen } from './components/symptomChecker/SymptomCheckerScreen';
import { ConsultationsScreen } from './components/consultation/ConsultationsScreen';
import { VideoRoomModal } from './components/consultation/VideoRoomModal';
import { AppointmentsScreen } from './components/appointments/AppointmentsScreen';
import { ProfileScreen } from './components/profile/ProfileScreen';
import { HospitalDetailModal } from './components/hospitals/HospitalDetailModal';
import { BiometricAuthModal } from './components/biometrics/BiometricAuthModal';
import { DoctorOnboardingModal } from './components/onboarding/DoctorOnboardingModal';
import { ReceptionistRosterModal } from './components/admin/ReceptionistRosterModal';
import { AuthScreen } from './components/auth/AuthScreen';

const MainAppContent: React.FC = () => {
  const [showAuthScreen, setShowAuthScreen] = useState(false);
  const {
    activeTab,
    activeScreen,
    showLocationModal,
    showNotificationsModal,
    selectedPrescription,
    isBookingOpen,
    activeCall,
    showOnboardingModal,
    showReceptionistRosterModal,
    biometricPrompt,
  } = useApp();

  const renderActiveScreen = () => {
    // If a full-screen sub-view is open
    if (activeScreen === 'doctor-profile') {
      return <DoctorProfileScreen />;
    }
    if (activeScreen === 'symptom-checker') {
      return <SymptomCheckerScreen />;
    }
    if (activeScreen === 'hospital-detail') {
      return <HospitalDetailModal />;
    }

    // Otherwise render primary bottom nav tabs
    switch (activeTab) {
      case 'home':
        return <HomeScreen />;
      case 'find-doctors':
        return <FindDoctorsScreen />;
      case 'consult':
        return <ConsultationsScreen />;
      case 'appointments':
        return <AppointmentsScreen />;
      case 'profile':
        return <ProfileScreen />;
      default:
        return <HomeScreen />;
    }
  };

  const isFullScreenSubView =
    activeScreen === 'doctor-profile' ||
    activeScreen === 'symptom-checker' ||
    activeScreen === 'hospital-detail';

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900">
      <div className="mx-auto w-full max-w-7xl">
        {/* Global App Header (hidden in sub-screen views like doctor profile or symptom checker which have their own headers) */}
        {!isFullScreenSubView && <Header onSignIn={() => setShowAuthScreen(true)} />}

        {!isFullScreenSubView && !activeCall.isActive && (
          <div className="sticky top-0 z-30 px-4 pt-2 pb-3 bg-slate-100/90 backdrop-blur-sm">
            <BottomNav />
          </div>
        )}

        {/* Dynamic Screen Content */}
        <main className="px-4 pb-10 md:px-6">
          {renderActiveScreen()}
        </main>

        {/* Modals & Overlays */}
        {showLocationModal && <LocationModal />}
        {showNotificationsModal && <NotificationsModal />}
        {isBookingOpen && <BookingFlowModal />}
        {selectedPrescription && <DigitalPrescriptionModal />}
        {activeCall.isActive && <VideoRoomModal />}
        {showOnboardingModal && <DoctorOnboardingModal />}
        {showReceptionistRosterModal && <ReceptionistRosterModal />}
        {biometricPrompt && biometricPrompt.isOpen && <BiometricAuthModal />}
        {showAuthScreen && <AuthScreen onDismiss={() => setShowAuthScreen(false)} />}

        {/* System Toast Alerts */}
        <Toast />
      </div>
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainAppContent />
    </AppProvider>
  );
}
