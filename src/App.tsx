import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { StatusBar } from './components/common/StatusBar';
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
import { AdminPortalModal } from './components/admin/AdminPortalModal';
import { ReceptionistRosterModal } from './components/admin/ReceptionistRosterModal';

const MainAppContent: React.FC = () => {
  const {
    activeTab,
    activeScreen,
    showLocationModal,
    showNotificationsModal,
    selectedPrescription,
    isBookingOpen,
    activeCall,
    showOnboardingModal,
    showAdminPortal,
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
    <div className="min-h-screen bg-slate-200/70 flex justify-center items-start sm:py-4">
      {/* Mobile Device Frame Container */}
      <div
        id="sehatsetu-mobile-app-root"
        className="w-full max-w-md bg-slate-50 min-h-screen sm:min-h-[844px] sm:max-h-[920px] sm:rounded-4xl shadow-2xl flex flex-col relative overflow-hidden border border-slate-300/60"
      >
        {/* Status Bar */}
        <StatusBar />

        {/* Global App Header (hidden in sub-screen views like doctor profile or symptom checker which have their own headers) */}
        {!isFullScreenSubView && <Header />}

        {/* Dynamic Screen Content with smooth scroll */}
        <main className="flex-1 overflow-y-auto overflow-x-hidden relative no-scrollbar">
          {renderActiveScreen()}
        </main>

        {/* Persistent Bottom Navigation (hidden during sub-screens and active call) */}
        {!isFullScreenSubView && !activeCall.isActive && <BottomNav />}

        {/* Modals & Overlays */}
        {showLocationModal && <LocationModal />}
        {showNotificationsModal && <NotificationsModal />}
        {isBookingOpen && <BookingFlowModal />}
        {selectedPrescription && <DigitalPrescriptionModal />}
        {activeCall.isActive && <VideoRoomModal />}
        {showOnboardingModal && <DoctorOnboardingModal />}
        {showAdminPortal && <AdminPortalModal />}
        {showReceptionistRosterModal && <ReceptionistRosterModal />}
        {biometricPrompt && biometricPrompt.isOpen && <BiometricAuthModal />}

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
