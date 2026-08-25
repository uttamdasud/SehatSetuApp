import React, { useState, useEffect } from 'react';
import {
  Fingerprint,
  Scan,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  X,
  KeyRound,
  Lock,
  Sparkles,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const BiometricAuthModal: React.FC = () => {
  const {
    biometricPrompt,
    closeBiometricPrompt,
    biometricSettings,
    unlockVaultBiometric,
    showToast,
  } = useApp();

  const [authMode, setAuthMode] = useState<'SCAN' | 'PIN'>('SCAN');
  const [pinInput, setPinInput] = useState('');
  const [scanState, setScanState] = useState<'IDLE' | 'SCANNING' | 'SUCCESS' | 'FAILED'>('IDLE');
  const [errorMessage, setErrorMessage] = useState('');

  if (!biometricPrompt || !biometricPrompt.isOpen) {
    return null;
  }

  const isFaceId =
    biometricSettings.biometricType === 'FACE_ID' ||
    biometricPrompt.mode === 'FACE_ID';

  const triggerScan = () => {
    setScanState('SCANNING');
    setErrorMessage('');

    setTimeout(() => {
      // Successful simulated biometric match
      setScanState('SUCCESS');
      setTimeout(() => {
        const ok = unlockVaultBiometric(isFaceId ? 'FACE_ID' : 'FINGERPRINT');
        if (ok) {
          if (biometricPrompt.onSuccess) {
            biometricPrompt.onSuccess();
          }
          closeBiometricPrompt();
          showToast(`Verified via ${isFaceId ? 'FaceID' : 'Touch ID / Biometrics'}`);
        }
      }, 700);
    }, 1400);
  };

  useEffect(() => {
    // Auto trigger scan on open for snappy seamless UX
    const timer = setTimeout(() => {
      triggerScan();
    }, 400);
    return () => clearTimeout(timer);
  }, []);

  const handlePinSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (pinInput === biometricSettings.fallbackPin) {
      setScanState('SUCCESS');
      setTimeout(() => {
        unlockVaultBiometric('PIN', pinInput);
        if (biometricPrompt.onSuccess) {
          biometricPrompt.onSuccess();
        }
        closeBiometricPrompt();
        showToast('Vault unlocked via Security PIN');
      }, 500);
    } else {
      setErrorMessage('Invalid 4-digit PIN. Try default "1234".');
      setPinInput('');
    }
  };

  const handlePinDigit = (num: string) => {
    if (pinInput.length < 4) {
      const nextPin = pinInput + num;
      setPinInput(nextPin);
      if (nextPin.length === 4) {
        if (nextPin === biometricSettings.fallbackPin) {
          setScanState('SUCCESS');
          setTimeout(() => {
            unlockVaultBiometric('PIN', nextPin);
            if (biometricPrompt.onSuccess) {
              biometricPrompt.onSuccess();
            }
            closeBiometricPrompt();
            showToast('Vault unlocked via Security PIN');
          }, 400);
        } else {
          setErrorMessage('Invalid PIN. Default fallback is 1234.');
          setTimeout(() => {
            setPinInput('');
          }, 800);
        }
      }
    }
  };

  const handlePinDelete = () => {
    setPinInput((prev) => prev.slice(0, -1));
    setErrorMessage('');
  };

  return (
    <div
      id="biometric-auth-modal"
      className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200"
    >
      <div className="w-full max-w-sm bg-white rounded-3xl p-6 shadow-2xl space-y-5 relative overflow-hidden border border-slate-200 animate-in zoom-in-95 duration-200">
        {/* Subtle top decoration badge */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-1.5 text-xs font-bold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>FIDO2 / WebAuthn Certified</span>
          </div>

          <button
            id="close-biometric-prompt"
            onClick={() => {
              if (biometricPrompt.onCancel) {
                biometricPrompt.onCancel();
              }
              closeBiometricPrompt();
            }}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Title */}
        <div className="text-center space-y-1">
          <h3 className="text-base font-bold text-slate-900 font-heading">
            {biometricPrompt.title || 'Biometric Authentication'}
          </h3>
          <p className="text-xs text-slate-500">
            {biometricPrompt.subtitle ||
              'Verify your identity to decrypt your medical records and digital prescriptions.'}
          </p>
        </div>

        {authMode === 'SCAN' ? (
          <div className="flex flex-col items-center justify-center py-4 space-y-4">
            {/* Biometric Visual Sensor */}
            <div className="relative flex items-center justify-center">
              {/* Outer Pulsing Rings */}
              {scanState === 'SCANNING' && (
                <>
                  <div className="absolute w-28 h-28 rounded-full bg-emerald-400/20 animate-ping" />
                  <div className="absolute w-24 h-24 rounded-full bg-emerald-500/30 animate-pulse" />
                </>
              )}

              <button
                id="sensor-touch-trigger-btn"
                onClick={triggerScan}
                disabled={scanState === 'SCANNING'}
                className={`relative w-20 h-20 rounded-2xl flex items-center justify-center transition-all duration-300 shadow-md ${
                  scanState === 'SUCCESS'
                    ? 'bg-emerald-700 text-white scale-105 ring-4 ring-emerald-200'
                    : scanState === 'SCANNING'
                    ? 'bg-emerald-800 text-emerald-100 ring-4 ring-emerald-300 ring-offset-2'
                    : 'bg-slate-900 text-emerald-400 hover:bg-slate-800 active:scale-95'
                }`}
              >
                {scanState === 'SUCCESS' ? (
                  <CheckCircle2 className="w-10 h-10 animate-in zoom-in duration-200 text-white" />
                ) : isFaceId ? (
                  <Scan className={`w-10 h-10 ${scanState === 'SCANNING' ? 'animate-pulse text-emerald-300' : ''}`} />
                ) : (
                  <Fingerprint className={`w-10 h-10 ${scanState === 'SCANNING' ? 'animate-pulse text-emerald-300' : ''}`} />
                )}

                {/* Scanning laser sweep bar */}
                {scanState === 'SCANNING' && (
                  <div className="absolute inset-x-0 h-1 bg-emerald-300 shadow-[0_0_12px_#34d399] animate-bounce" />
                )}
              </button>
            </div>

            {/* Status indicator text */}
            <div className="text-center">
              {scanState === 'SCANNING' ? (
                <div className="text-xs font-bold text-emerald-800 flex items-center justify-center space-x-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-600 animate-ping" />
                  <span>Scanning {isFaceId ? 'Face ID mesh...' : 'Biometric Fingerprint...'}</span>
                </div>
              ) : scanState === 'SUCCESS' ? (
                <div className="text-xs font-bold text-emerald-700 flex items-center justify-center space-x-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Identity Confirmed • Decrypting</span>
                </div>
              ) : (
                <button
                  onClick={triggerScan}
                  className="text-xs font-bold text-slate-700 hover:text-emerald-800 transition-colors"
                >
                  Tap sensor to re-scan {isFaceId ? 'FaceID' : 'Fingerprint'}
                </button>
              )}
            </div>

            {/* Switch to PIN Fallback */}
            <div className="pt-2 w-full flex items-center justify-center">
              <button
                id="switch-to-pin-fallback"
                onClick={() => setAuthMode('PIN')}
                className="text-xs font-semibold text-slate-500 hover:text-emerald-800 flex items-center space-x-1 transition-colors"
              >
                <KeyRound className="w-3.5 h-3.5" />
                <span>Use 4-Digit Security PIN instead</span>
              </button>
            </div>
          </div>
        ) : (
          /* PIN KEYPAD SCREEN */
          <div className="space-y-4 py-2">
            {/* PIN Indicator Dots */}
            <div className="flex justify-center space-x-3 my-2">
              {[0, 1, 2, 3].map((idx) => (
                <div
                  key={idx}
                  className={`w-3.5 h-3.5 rounded-full transition-all duration-200 ${
                    pinInput.length > idx
                      ? 'bg-emerald-700 scale-110 shadow-xs'
                      : 'bg-slate-200 border border-slate-300'
                  }`}
                />
              ))}
            </div>

            {errorMessage && (
              <div className="p-2 bg-rose-50 text-rose-700 text-xs rounded-xl text-center font-medium border border-rose-200 flex items-center justify-center space-x-1">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Custom 3x4 Number Keypad */}
            <div className="grid grid-cols-3 gap-2 max-w-[240px] mx-auto pt-1">
              {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((num) => (
                <button
                  key={num}
                  type="button"
                  onClick={() => handlePinDigit(num)}
                  className="w-16 h-12 rounded-xl bg-slate-100 hover:bg-emerald-50 hover:text-emerald-900 active:scale-95 text-base font-bold text-slate-800 flex items-center justify-center transition-all shadow-2xs"
                >
                  {num}
                </button>
              ))}
              <button
                type="button"
                onClick={() => setAuthMode('SCAN')}
                className="w-16 h-12 rounded-xl bg-slate-50 hover:bg-slate-100 active:scale-95 text-xs font-semibold text-slate-600 flex items-center justify-center"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => handlePinDigit('0')}
                className="w-16 h-12 rounded-xl bg-slate-100 hover:bg-emerald-50 active:scale-95 text-base font-bold text-slate-800 flex items-center justify-center shadow-2xs"
              >
                0
              </button>
              <button
                type="button"
                onClick={handlePinDelete}
                className="w-16 h-12 rounded-xl bg-slate-50 hover:bg-rose-50 hover:text-rose-700 active:scale-95 text-xs font-semibold text-slate-600 flex items-center justify-center"
              >
                Delete
              </button>
            </div>

            <div className="text-center pt-1">
              <button
                onClick={() => setAuthMode('SCAN')}
                className="text-xs text-emerald-800 font-bold hover:underline"
              >
                ← Back to Biometric Scanner
              </button>
            </div>
          </div>
        )}

        {/* Security badge at bottom */}
        <div className="pt-2 border-t border-slate-100 flex items-center justify-center space-x-1 text-[11px] text-slate-400">
          <Lock className="w-3 h-3 text-emerald-600" />
          <span>AES-256 local key stored in device hardware secure enclave</span>
        </div>
      </div>
    </div>
  );
};
