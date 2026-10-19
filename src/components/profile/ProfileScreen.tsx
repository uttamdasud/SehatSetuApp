import React, { useState } from 'react';
import {
  User,
  Users,
  FileText,
  Shield,
  Heart,
  Plus,
  ChevronRight,
  Phone,
  Mail,
  MapPin,
  Sparkles,
  UploadCloud,
  Settings,
  Bell,
  Languages,
  LogOut,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  FolderOpen,
  Eye,
  Trash2,
  X,
  CreditCard,
  QrCode,
  Fingerprint,
  Scan,
  Lock,
  Unlock,
  KeyRound,
  ShieldCheck,
  Building2,
  Store,
  Stethoscope,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { FamilyMember, MedicalRecord } from '../../types';

export const ProfileScreen: React.FC = () => {
  const {
    user,
    prescriptions,
    setSelectedPrescription,
    addFamilyMember,
    deleteFamilyMember,
    activePatientId,
    setActivePatientId,
    addMedicalRecord,
    biometricSettings,
    toggleBiometrics,
    updateBiometricSettings,
    lockVaultImmediately,
    openBiometricPrompt,
    setShowOnboardingModal,
    showToast,
    logoutUser,
    isAuthenticated,
    activeProfileTab,
  } = useApp();

  const [showAddFamilyModal, setShowAddFamilyModal] = useState(false);
  const [showUploadRecordModal, setShowUploadRecordModal] = useState(false);

  // Biometric PIN change modal state
  const [showPinChangeModal, setShowPinChangeModal] = useState(false);
  const [newPin, setNewPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');

  // New Family Member form
  const [newFamName, setNewFamName] = useState('');
  const [newFamRelation, setNewFamRelation] = useState<'Spouse' | 'Parent' | 'Child' | 'Other'>('Spouse');
  const [newFamAge, setNewFamAge] = useState('28');
  const [newFamGender, setNewFamGender] = useState<'Male' | 'Female'>('Female');
  const [newFamBlood, setNewFamBlood] = useState('B+');

  // New Medical Record form
  const [newRecordTitle, setNewRecordTitle] = useState('');
  const [newRecordType, setNewRecordType] = useState<
    'LAB_REPORT' | 'SCAN_REPORT' | 'PRESCRIPTION' | 'DISCHARGE_SUMMARY'
  >('LAB_REPORT');
  const [newRecordHospital, setNewRecordHospital] = useState('ILS Hospital Agartala');

  const handleAddFamily = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFamName.trim()) return;

    addFamilyMember({
      name: newFamName,
      relationship: newFamRelation,
      age: parseInt(newFamAge) || 30,
      gender: newFamGender,
      bloodGroup: newFamBlood,
    });

    setShowAddFamilyModal(false);
    setNewFamName('');
  };

  const handleUploadRecord = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRecordTitle.trim()) return;

    addMedicalRecord({
      title: newRecordTitle,
      type: newRecordType,
      date: 'Today, 24 Aug 2026',
      doctorOrLab: newRecordHospital,
      fileSize: '1.8 MB',
      fileType: 'PDF',
    });

    setShowUploadRecordModal(false);
    setNewRecordTitle('');
    showToast('Medical record securely saved to your health locker');
  };

  const handleSaveNewPin = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPin.length !== 4 || isNaN(Number(newPin))) {
      showToast('PIN must be exactly 4 digits');
      return;
    }
    if (newPin !== confirmPin) {
      showToast('PINs do not match');
      return;
    }
    updateBiometricSettings({ fallbackPin: newPin });
    setShowPinChangeModal(false);
    setNewPin('');
    setConfirmPin('');
    showToast('Fallback PIN updated successfully');
  };

  const isVaultLocked = biometricSettings.isEnabled && biometricSettings.isVaultLocked;

  const handleOpenVault = (callback?: () => void) => {
    if (isVaultLocked) {
      openBiometricPrompt({
        title: 'Unlock Medical Records Vault',
        subtitle: 'Verify with Touch ID, FaceID, or PIN to view your health records',
        onSuccess: () => {
          if (callback) callback();
        },
      });
    } else if (callback) {
      callback();
    }
  };

  return (
    <div id="profile-screen" className="space-y-4 pb-24 animate-in fade-in duration-200">
      {/* Patient Profile Overview */}
      {activeProfileTab === 'OVERVIEW' && (
      <div className="px-4 pt-1">
        <div className="bg-white p-5 rounded-3xl border border-slate-200/90 shadow-xs space-y-4">
          <div className="flex items-start space-x-3.5">
            <div className="relative shrink-0">
              <img
                src={user.image}
                alt={user.name}
                className="w-16 h-16 rounded-2xl object-cover ring-2 ring-emerald-100"
                referrerPolicy="no-referrer"
              />
              <span className="absolute -bottom-1 -right-1 bg-emerald-700 text-white p-0.5 rounded-full ring-2 ring-white">
                <CheckCircle2 className="w-3.5 h-3.5" />
              </span>
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-slate-900 font-heading truncate">
                  {user.name}
                </h3>
                <span className="text-[10px] font-bold uppercase tracking-wider bg-emerald-100/80 text-emerald-900 px-2 py-0.5 rounded-md">
                  Active
                </span>
              </div>
              <div className="text-xs text-slate-500 mt-0.5">
                {user.age} yrs • {user.gender} • Blood Group:{' '}
                <strong className="text-slate-800">{user.bloodGroup}</strong>
              </div>
              <div className="text-[11px] text-slate-500 mt-0.5 flex items-center space-x-1">
                <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                <span>{user.city}</span>
              </div>
            </div>
          </div>

          {/* ABHA / Ayushman Bharat Digital Health ID Card */}
          <div className="p-3 bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200/70 rounded-2xl flex items-center justify-between">
            <div className="space-y-0.5">
              <div className="flex items-center space-x-1.5 text-[10px] font-bold uppercase tracking-wider text-emerald-800">
                <QrCode className="w-3 h-3" />
                <span>ABHA Health ID</span>
              </div>
              <div className="font-mono text-xs font-bold text-slate-900">{user.abhaId}</div>
            </div>
            <span className="text-[10px] font-bold text-emerald-800 bg-white px-2 py-1 rounded-lg border border-emerald-200 shadow-2xs">
              Linked
            </span>
          </div>

          {/* Quick Contact Info */}
          <div className="pt-2 border-t border-slate-100 grid grid-cols-2 gap-2 text-xs text-slate-600">
            <div className="flex items-center space-x-1.5">
              <Phone className="w-3.5 h-3.5 text-slate-400" />
              <span>{user.phone}</span>
            </div>
            <div className="flex items-center space-x-1.5 truncate">
              <Mail className="w-3.5 h-3.5 text-slate-400" />
              <span className="truncate">{user.email}</span>
            </div>
          </div>
        </div>
      </div>
      )}

      {/* 1. MEDICAL RECORDS VAULT */}
      {activeProfileTab === 'RECORDS' && (
        <div className="px-4 space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center space-x-1.5">
                <span>Health Locker & Reports</span>
                {biometricSettings.isEnabled && (
                  <span className="text-[10px] text-emerald-800 bg-emerald-50 border border-emerald-200 px-1.5 py-0.2 rounded-full font-bold flex items-center space-x-1">
                    <Fingerprint className="w-2.5 h-2.5" />
                    <span>Biometric Guarded</span>
                  </span>
                )}
              </h3>
              <span className="text-[11px] text-slate-500">256-bit encrypted medical files</span>
            </div>

            <div className="flex items-center space-x-1.5">
              {biometricSettings.isEnabled && !isVaultLocked && (
                <button
                  id="lock-vault-now-btn"
                  onClick={lockVaultImmediately}
                  className="py-1 px-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold flex items-center space-x-1 transition-colors"
                  title="Lock Medical Vault"
                >
                  <Lock className="w-3 h-3 text-slate-600" />
                  <span>Lock</span>
                </button>
              )}

              <button
                id="upload-record-btn"
                onClick={() => handleOpenVault(() => setShowUploadRecordModal(true))}
                className="py-1.5 px-3 bg-emerald-800 hover:bg-emerald-900 text-white rounded-xl text-xs font-bold flex items-center space-x-1 shadow-xs transition-colors"
              >
                <UploadCloud className="w-3.5 h-3.5" />
                <span>Upload</span>
              </button>
            </div>
          </div>

          {/* VAULT LOCKED STATE BANNER */}
          {isVaultLocked ? (
            <div className="p-6 bg-gradient-to-b from-slate-900 to-slate-950 rounded-3xl border border-slate-800 text-center space-y-4 shadow-xl">
              <div className="w-16 h-16 rounded-2xl bg-emerald-950/80 border border-emerald-500/30 text-emerald-400 flex items-center justify-center mx-auto shadow-inner">
                {biometricSettings.biometricType === 'FACE_ID' ? (
                  <Scan className="w-8 h-8 animate-pulse" />
                ) : (
                  <Fingerprint className="w-8 h-8 animate-pulse" />
                )}
              </div>

              <div className="space-y-1">
                <h4 className="text-sm font-bold text-white font-heading">
                  Medical Vault is Encrypted & Locked
                </h4>
                <p className="text-xs text-slate-400 max-w-xs mx-auto">
                  Your digital prescriptions, diagnostic lab reports, and radiology scans are secured
                  with device biometrics.
                </p>
              </div>

              <button
                id="unlock-vault-biometric-btn"
                onClick={() => handleOpenVault()}
                className="py-3 px-6 bg-emerald-600 hover:bg-emerald-500 active:scale-95 text-white rounded-2xl font-bold text-xs shadow-lg shadow-emerald-950 flex items-center justify-center space-x-2 mx-auto transition-all"
              >
                {biometricSettings.biometricType === 'FACE_ID' ? (
                  <Scan className="w-4 h-4" />
                ) : (
                  <Fingerprint className="w-4 h-4" />
                )}
                <span>
                  Authenticate with {biometricSettings.biometricType === 'FACE_ID' ? 'Face ID' : 'Touch ID / Fingerprint'}
                </span>
              </button>

              <div className="text-[11px] text-slate-500 flex items-center justify-center space-x-1 pt-1">
                <Lock className="w-3 h-3 text-emerald-500" />
                <span>FIDO2 / WebAuthn Hardware Security</span>
              </div>
            </div>
          ) : (
            /* UNLOCKED VAULT CONTENT */
            <>
              {/* Prescriptions Quick Section */}
              <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-2.5">
                <h4 className="text-xs font-bold text-slate-900 flex items-center justify-between">
                  <span>Digital Prescriptions ({prescriptions.length})</span>
                  <span className="text-[10px] text-emerald-800 font-semibold">Government Certified</span>
                </h4>
                <div className="space-y-2">
                  {prescriptions.map((rx) => (
                    <div
                      key={rx.id}
                      onClick={() => setSelectedPrescription(rx)}
                      className="p-3 bg-slate-50 hover:bg-emerald-50/60 rounded-xl border border-slate-200/80 flex items-center justify-between cursor-pointer transition-all active:scale-[0.99]"
                    >
                      <div className="flex items-center space-x-3">
                        <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
                          <FileText className="w-4 h-4" />
                        </div>
                        <div>
                          <h5 className="text-xs font-bold text-slate-900">{rx.doctorName}</h5>
                          <div className="text-[11px] text-slate-500">
                            {rx.date} • {rx.diagnosis}
                          </div>
                        </div>
                      </div>
                      <ChevronRight className="w-4 h-4 text-slate-400" />
                    </div>
                  ))}
                </div>
              </div>

              {/* Uploaded Lab / Diagnostics Reports */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Lab Tests & Radiology Records
                </h4>
                {user.medicalRecords.map((rec) => (
                  <div
                    key={rec.id}
                    className="p-3.5 bg-white rounded-2xl border border-slate-200/90 shadow-xs flex items-center justify-between"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center font-bold">
                        <FolderOpen className="w-5 h-5 text-emerald-700" />
                      </div>
                      <div>
                        <h5 className="text-xs font-bold text-slate-900">{rec.title}</h5>
                        <div className="text-[11px] text-slate-500">
                          {rec.doctorOrLab} • {rec.date}
                        </div>
                        <div className="text-[10px] text-slate-400 mt-0.5">
                          {rec.fileType} • {rec.fileSize}
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => showToast(`Opening ${rec.title}...`)}
                      className="py-1.5 px-3 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg text-xs font-semibold flex items-center space-x-1"
                    >
                      <Eye className="w-3.5 h-3.5 text-slate-600" />
                      <span>View</span>
                    </button>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      )}

      {/* 2. FAMILY MEMBER MANAGEMENT */}
      {activeProfileTab === 'FAMILY' && (
        <div className="px-4 space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Manage Family Profiles
              </h3>
              <span className="text-[11px] text-slate-500">Book consultations for loved ones</span>
            </div>
            <button
              id="add-family-member-btn"
              onClick={() => setShowAddFamilyModal(true)}
              className="py-1.5 px-3 bg-emerald-800 hover:bg-emerald-900 text-white rounded-xl text-xs font-bold flex items-center space-x-1 shadow-xs transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Member</span>
            </button>
          </div>

          {/* Primary User Card */}
          <div
            onClick={() => {
              setActivePatientId(user.id);
              showToast('Active patient switched to Yourself');
            }}
            className={`p-4 rounded-2xl border transition-all cursor-pointer ${
              activePatientId === user.id
                ? 'bg-emerald-50/60 border-emerald-300 ring-2 ring-emerald-600/30'
                : 'bg-white border-slate-200 hover:border-slate-300'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <img
                  src={user.image}
                  alt={user.name}
                  className="w-12 h-12 rounded-2xl object-cover"
                  referrerPolicy="no-referrer"
                />
                <div>
                  <div className="flex items-center space-x-1.5">
                    <h4 className="text-xs font-bold text-slate-900">{user.name}</h4>
                    <span className="text-[9px] bg-slate-200 text-slate-800 px-1.5 py-0.2 rounded font-bold">
                      Primary (Self)
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-500">
                    {user.age} yrs • {user.gender} • Blood Group: {user.bloodGroup}
                  </div>
                </div>
              </div>

              {activePatientId === user.id && (
                <span className="text-[10px] font-bold text-emerald-800 bg-white px-2 py-0.5 rounded border border-emerald-200">
                  Selected
                </span>
              )}
            </div>
          </div>

          {/* Family Members List */}
          <div className="space-y-2.5">
            {user.familyMembers.map((fam) => (
              <div
                key={fam.id}
                onClick={() => {
                  setActivePatientId(fam.id);
                  showToast(`Active patient switched to ${fam.name}`);
                }}
                className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                  activePatientId === fam.id
                    ? 'bg-emerald-50/60 border-emerald-300 ring-2 ring-emerald-600/30'
                    : 'bg-white border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-sm">
                    {fam.name.charAt(0)}
                  </div>
                  <div>
                    <div className="flex items-center space-x-1.5">
                      <h4 className="text-xs font-bold text-slate-900">{fam.name}</h4>
                      <span className="text-[9px] bg-emerald-100 text-emerald-900 px-1.5 py-0.2 rounded font-bold">
                        {fam.relationship}
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-500">
                      {fam.age} yrs • {fam.gender} • Blood Group: {fam.bloodGroup}
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  {activePatientId === fam.id && (
                    <span className="text-[10px] font-bold text-emerald-800 bg-white px-2 py-0.5 rounded border border-emerald-200">
                      Selected
                    </span>
                  )}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteFamilyMember(fam.id);
                    }}
                    className="p-2 text-slate-400 hover:text-rose-600 rounded-lg"
                    title="Delete member"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 3. SETTINGS & SECURITY */}
      {activeProfileTab === 'SETTINGS' && (
        <div className="px-4 space-y-4">
          {/* BIOMETRIC AUTHENTICATION CARD */}
          <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="bg-gradient-to-r from-emerald-800 to-teal-900 text-white p-4 flex items-center justify-between">
              <div className="flex items-center space-x-2.5">
                <div className="w-9 h-9 rounded-xl bg-white/15 flex items-center justify-center text-emerald-200">
                  <Fingerprint className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold font-heading">Biometric Security & Lock</h4>
                  <p className="text-[11px] text-emerald-200">
                    Fingerprint & FaceID Protection
                  </p>
                </div>
              </div>

              {/* Master Toggle */}
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  id="biometrics-master-toggle"
                  type="checkbox"
                  checked={biometricSettings.isEnabled}
                  onChange={(e) => toggleBiometrics(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-400"></div>
              </label>
            </div>

            <div className="p-4 space-y-3.5 text-xs">
              {biometricSettings.isEnabled ? (
                <>
                  {/* Biometric Type Selector */}
                  <div className="space-y-1.5">
                    <label className="font-bold text-slate-700 text-[11px]">Preferred Biometric Sensor</label>
                    <div className="grid grid-cols-3 gap-2">
                      {[
                        { type: 'BOTH' as const, label: 'Auto / Both', icon: ShieldCheck },
                        { type: 'FINGERPRINT' as const, label: 'Touch ID / Fingerprint', icon: Fingerprint },
                        { type: 'FACE_ID' as const, label: 'FaceID', icon: Scan },
                      ].map(({ type, label, icon: Icon }) => (
                        <button
                          key={type}
                          onClick={() => updateBiometricSettings({ biometricType: type })}
                          className={`p-2.5 rounded-xl border flex flex-col items-center justify-center space-y-1 transition-all ${
                            biometricSettings.biometricType === type
                              ? 'bg-emerald-50 border-emerald-600 text-emerald-900 font-bold'
                              : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                          }`}
                        >
                          <Icon className="w-4 h-4" />
                          <span className="text-[10px] text-center">{label}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Scope of protection */}
                  <div className="space-y-2 pt-1 border-t border-slate-100">
                    <label className="font-bold text-slate-700 text-[11px] block">
                      Protected Areas in App
                    </label>

                    <div className="flex items-center justify-between p-2.5 bg-slate-50 rounded-xl">
                      <div className="flex items-center space-x-2">
                        <FileText className="w-4 h-4 text-emerald-700" />
                        <div>
                          <div className="font-semibold text-slate-800">Medical Vault & Prescriptions</div>
                          <div className="text-[10px] text-slate-500">Require biometric scan to access health records</div>
                        </div>
                      </div>
                      <input
                        type="checkbox"
                        checked={biometricSettings.protectRecords}
                        onChange={(e) => updateBiometricSettings({ protectRecords: e.target.checked })}
                        className="accent-emerald-700 w-4 h-4 rounded"
                      />
                    </div>

                    <div className="flex items-center justify-between p-2.5 bg-slate-50 rounded-xl">
                      <div className="flex items-center space-x-2">
                        <CreditCard className="w-4 h-4 text-emerald-700" />
                        <div>
                          <div className="font-semibold text-slate-800">Payment & Appointment Booking</div>
                          <div className="text-[10px] text-slate-500">Confirm consultation checkout with biometrics</div>
                        </div>
                      </div>
                      <input
                        type="checkbox"
                        checked={biometricSettings.protectPayment}
                        onChange={(e) => updateBiometricSettings({ protectPayment: e.target.checked })}
                        className="accent-emerald-700 w-4 h-4 rounded"
                      />
                    </div>
                  </div>

                  {/* Fallback PIN & Test Scan */}
                  <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                    <div className="flex items-center space-x-2">
                      <KeyRound className="w-4 h-4 text-slate-500" />
                      <div>
                        <div className="font-semibold text-slate-800">Fallback Security PIN</div>
                        <div className="text-[10px] text-slate-500 font-mono">
                          Current: •••• ({biometricSettings.fallbackPin})
                        </div>
                      </div>
                    </div>

                    <button
                      id="change-pin-btn"
                      onClick={() => setShowPinChangeModal(true)}
                      className="py-1 px-3 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg text-xs font-semibold"
                    >
                      Change PIN
                    </button>
                  </div>

                  <div className="pt-2">
                    <button
                      id="test-biometric-scan-btn"
                      onClick={() => {
                        openBiometricPrompt({
                          title: 'Test Biometric Authentication',
                          subtitle: 'Simulating biometric sensor authentication on this device',
                          onSuccess: () => {
                            showToast('Biometrics successfully verified on device!');
                          },
                        });
                      }}
                      className="w-full py-2.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-900 border border-emerald-200 rounded-xl font-bold flex items-center justify-center space-x-1.5 transition-colors"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-emerald-700" />
                      <span>Test Biometric Authentication Now</span>
                    </button>
                  </div>
                </>
              ) : (
                <div className="text-center py-3 space-y-2">
                  <p className="text-xs text-slate-500">
                    Enable Biometrics to securely lock your medical prescriptions, diagnostic test reports, and ABHA health data with Touch ID or FaceID.
                  </p>
                  <button
                    onClick={() => toggleBiometrics(true)}
                    className="py-2 px-4 bg-emerald-800 hover:bg-emerald-900 text-white rounded-xl font-bold text-xs inline-flex items-center space-x-1.5"
                  >
                    <Fingerprint className="w-3.5 h-3.5" />
                    <span>Turn On Biometric Security</span>
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* PARTNER ONBOARDING & DOCTOR LISTING REQUEST CARD */}
          <div className="bg-white rounded-3xl border border-slate-200 p-4 shadow-xs space-y-3 text-xs">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-2xl bg-teal-50 text-teal-800 flex items-center justify-center border border-teal-200">
                <Store className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-900 font-heading">
                  Pharmacy & Doctor Partner Network
                </h4>
                <p className="text-[11px] text-slate-500">
                  Are you a Doctor or Pharmacy? Request to list a specialist practice
                </p>
              </div>
            </div>

            <button
              id="open-partner-onboarding-btn"
              onClick={() => setShowOnboardingModal(true)}
              className="w-full py-2.5 bg-teal-700 hover:bg-teal-800 text-white rounded-xl font-bold flex items-center justify-center space-x-1.5 shadow-xs transition-colors"
            >
              <Stethoscope className="w-3.5 h-3.5" />
              <span>Request to Add Doctor / Specialist Category</span>
            </button>
          </div>

          {/* Emergency Helpline Section */}
          <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl space-y-2.5">
            <h4 className="text-xs font-bold text-rose-950 uppercase tracking-wider flex items-center space-x-1.5">
              <Shield className="w-4 h-4 text-rose-600" />
              <span>National Medical Emergency Numbers</span>
            </h4>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <a
                href="tel:112"
                className="p-2.5 bg-white text-rose-950 font-bold rounded-xl border border-rose-200 flex items-center justify-between shadow-2xs"
              >
                <span>National 112</span>
                <Phone className="w-3.5 h-3.5 text-rose-600" />
              </a>
              <a
                href="tel:108"
                className="p-2.5 bg-white text-rose-950 font-bold rounded-xl border border-rose-200 flex items-center justify-between shadow-2xs"
              >
                <span>Ambulance 108</span>
                <Phone className="w-3.5 h-3.5 text-rose-600" />
              </a>
            </div>
          </div>

          {/* Preferences */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs divide-y divide-slate-100 text-xs">
            <div className="p-3.5 flex items-center justify-between">
              <div className="flex items-center space-x-2.5">
                <Languages className="w-4 h-4 text-slate-500" />
                <span className="font-semibold text-slate-800">App Language</span>
              </div>
              <span className="text-emerald-800 font-bold">English (Default)</span>
            </div>

            <div className="p-3.5 flex items-center justify-between">
              <div className="flex items-center space-x-2.5">
                <Bell className="w-4 h-4 text-slate-500" />
                <span className="font-semibold text-slate-800">Appointment Alerts</span>
              </div>
              <input type="checkbox" defaultChecked className="accent-emerald-700 w-4 h-4 rounded" />
            </div>

            <div className="p-3.5 flex items-center justify-between">
              <div className="flex items-center space-x-2.5">
                <CreditCard className="w-4 h-4 text-slate-500" />
                <span className="font-semibold text-slate-800">Saved UPI & Cards</span>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-400" />
            </div>

            <div className="p-3.5 flex items-center justify-between">
              <div className="flex items-center space-x-2.5">
                <HelpCircle className="w-4 h-4 text-slate-500" />
                <span className="font-semibold text-slate-800">Help & Support</span>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-400" />
            </div>

            {isAuthenticated && (
              <button
                type="button"
                onClick={logoutUser}
                className="w-full p-3.5 flex items-center justify-between text-left text-rose-700"
              >
                <div className="flex items-center space-x-2.5">
                  <LogOut className="w-4 h-4" />
                  <span className="font-semibold">Logout</span>
                </div>
                <ChevronRight className="w-4 h-4 text-rose-500" />
              </button>
            )}
          </div>

          {/* About SehatSetu */}
          <div className="p-4 bg-slate-100 rounded-2xl text-center space-y-1 text-xs text-slate-500">
            <div className="font-bold text-slate-800 font-heading">SehatSetu • Anywhere Healthcare</div>
            <div>Version 3.2.0 • ISO 27001 & ABHA Compliant</div>
            <div className="text-[10px] text-slate-400">Proudly built for accessible healthcare in India</div>
          </div>
        </div>
      )}

      {/* CHANGE PIN MODAL */}
      {showPinChangeModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-xs bg-white rounded-3xl p-5 shadow-2xl space-y-4 text-xs">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h4 className="font-bold text-slate-900 font-heading">Change Fallback PIN</h4>
              <button onClick={() => setShowPinChangeModal(false)} className="p-1 text-slate-400">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveNewPin} className="space-y-3">
              <div>
                <label className="text-[11px] font-semibold text-slate-600 block mb-1">
                  Enter New 4-Digit PIN
                </label>
                <input
                  type="password"
                  maxLength={4}
                  required
                  value={newPin}
                  onChange={(e) => setNewPin(e.target.value)}
                  placeholder="••••"
                  className="w-full text-center text-lg font-mono p-2 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              <div>
                <label className="text-[11px] font-semibold text-slate-600 block mb-1">
                  Confirm 4-Digit PIN
                </label>
                <input
                  type="password"
                  maxLength={4}
                  required
                  value={confirmPin}
                  onChange={(e) => setConfirmPin(e.target.value)}
                  placeholder="••••"
                  className="w-full text-center text-lg font-mono p-2 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              <div className="flex space-x-2 pt-1">
                <button
                  type="button"
                  onClick={() => setShowPinChangeModal(false)}
                  className="py-2.5 px-3 bg-slate-100 rounded-xl font-bold text-slate-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-emerald-800 text-white rounded-xl font-bold shadow-xs"
                >
                  Update PIN
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ADD FAMILY MEMBER MODAL */}
      {showAddFamilyModal && (
        <div
          id="add-family-member-modal"
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-end justify-center animate-in fade-in duration-200"
        >
          <div className="w-full max-w-md bg-white rounded-t-3xl p-5 shadow-2xl space-y-4 animate-in slide-in-from-bottom duration-250">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="text-sm font-bold text-slate-900 font-heading">Add Family Member</h3>
              <button
                onClick={() => setShowAddFamilyModal(false)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-full"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddFamily} className="space-y-3">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Priya Debbarma"
                  value={newFamName}
                  onChange={(e) => setNewFamName(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:bg-white focus:ring-2 focus:ring-emerald-700"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Relationship</label>
                  <select
                    value={newFamRelation}
                    onChange={(e) => setNewFamRelation(e.target.value as any)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:bg-white"
                  >
                    <option value="Spouse">Spouse</option>
                    <option value="Parent">Parent</option>
                    <option value="Child">Child</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Age (Years)</label>
                  <input
                    type="number"
                    value={newFamAge}
                    onChange={(e) => setNewFamAge(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:bg-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Gender</label>
                  <select
                    value={newFamGender}
                    onChange={(e) => setNewFamGender(e.target.value as any)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:bg-white"
                  >
                    <option value="Female">Female</option>
                    <option value="Male">Male</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Blood Group</label>
                  <select
                    value={newFamBlood}
                    onChange={(e) => setNewFamBlood(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:bg-white"
                  >
                    {['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'].map((b) => (
                      <option key={b} value={b}>
                        {b}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="pt-2 flex items-center space-x-2">
                <button
                  type="button"
                  onClick={() => setShowAddFamilyModal(false)}
                  className="py-3 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 bg-emerald-800 hover:bg-emerald-900 text-white rounded-xl text-xs font-bold shadow-xs"
                >
                  Save Family Profile
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* UPLOAD MEDICAL RECORD MODAL */}
      {showUploadRecordModal && (
        <div
          id="upload-record-modal"
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-end justify-center animate-in fade-in duration-200"
        >
          <div className="w-full max-w-md bg-white rounded-t-3xl p-5 shadow-2xl space-y-4 animate-in slide-in-from-bottom duration-250">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="text-sm font-bold text-slate-900 font-heading">Upload Medical Document</h3>
              <button
                onClick={() => setShowUploadRecordModal(false)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-full"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleUploadRecord} className="space-y-3">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Document Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Lipid Profile Blood Test"
                  value={newRecordTitle}
                  onChange={(e) => setNewRecordTitle(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:bg-white focus:ring-2 focus:ring-emerald-700"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Record Type</label>
                <select
                  value={newRecordType}
                  onChange={(e) => setNewRecordType(e.target.value as any)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:bg-white"
                >
                  <option value="LAB_REPORT">Lab Test Report</option>
                  <option value="SCAN_REPORT">Radiology / Scan (X-Ray, MRI, CT)</option>
                  <option value="PRESCRIPTION">Previous Prescription</option>
                  <option value="DISCHARGE_SUMMARY">Hospital Discharge Summary</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Hospital or Diagnostic Lab
                </label>
                <input
                  type="text"
                  value={newRecordHospital}
                  onChange={(e) => setNewRecordHospital(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:bg-white"
                />
              </div>

              {/* Upload file placeholder */}
              <div className="p-4 border-2 border-dashed border-emerald-300 rounded-2xl bg-emerald-50/50 text-center space-y-1">
                <UploadCloud className="w-6 h-6 text-emerald-700 mx-auto" />
                <div className="text-xs font-bold text-emerald-950">Tap to select PDF or image</div>
                <div className="text-[10px] text-slate-500">Supports PDF, JPG, PNG up to 25MB</div>
              </div>

              <div className="pt-2 flex items-center space-x-2">
                <button
                  type="button"
                  onClick={() => setShowUploadRecordModal(false)}
                  className="py-3 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 bg-emerald-800 hover:bg-emerald-900 text-white rounded-xl text-xs font-bold shadow-xs"
                >
                  Save to Health Vault
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
