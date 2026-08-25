import React, { useState } from 'react';
import {
  BrainCircuit,
  ShieldAlert,
  ArrowLeft,
  Mic,
  MicOff,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  Clock,
  PhoneCall,
  Building2,
  ChevronRight,
  ShieldCheck,
  RotateCcw,
  Languages,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { analyzeSymptoms } from '../../utils/triageEngine';
import { SymptomAnalysisResult } from '../../types';

export const SymptomCheckerScreen: React.FC = () => {
  const {
    doctors,
    setActiveScreen,
    setSelectedDoctor,
    startBooking,
    startInstantConsultation,
    symptomCheckerInitialQuery,
    setSymptomCheckerInitialQuery,
    showToast,
  } = useApp();

  const [symptomInput, setSymptomInput] = useState(symptomCheckerInitialQuery || '');
  const [selectedLanguage, setSelectedLanguage] = useState<'English' | 'हिन्दी' | 'বাংলা' | 'অসমীয়া'>('English');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isListeningVoice, setIsListeningVoice] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<SymptomAnalysisResult | null>(null);

  const sampleSymptoms = [
    { text: 'Fever and throat pain since yesterday', lang: 'English' },
    { text: 'Severe chest tightness and shortness of breath', lang: 'English' },
    { text: 'Red itchy rash on skin after new lotion', lang: 'English' },
    { text: 'গলা ব্যথা এবং ২ দিন ধরে জ্বর (Throat pain & fever)', lang: 'বাংলা' },
    { text: 'कल से तेज सिरदर्द और बुखार है (Severe headache & fever)', lang: 'हिन्दी' },
    { text: 'Lower back ache and stiff knee joints', lang: 'English' },
  ];

  const handleVoiceInput = () => {
    if (isListeningVoice) {
      setIsListeningVoice(false);
      return;
    }

    setIsListeningVoice(true);
    showToast('Listening... Speak your symptoms');

    // Simulate realistic voice speech recognition
    setTimeout(() => {
      setIsListeningVoice(false);
      setSymptomInput('I have had continuous fever for 2 days with severe headache and weakness.');
      showToast('Voice transcribed successfully');
    }, 2500);
  };

  const handleAnalyze = () => {
    if (!symptomInput.trim()) {
      showToast('Please describe your symptoms first');
      return;
    }

    setIsAnalyzing(true);
    setAnalysisResult(null);

    // Simulate smart triage latency
    setTimeout(() => {
      const result = analyzeSymptoms(symptomInput, doctors);
      setAnalysisResult(result);
      setIsAnalyzing(false);
    }, 1400);
  };

  const handleReset = () => {
    setSymptomInput('');
    setAnalysisResult(null);
    setSymptomCheckerInitialQuery('');
  };

  return (
    <div id="symptom-checker-screen" className="bg-slate-50 min-h-screen pb-24 animate-in fade-in duration-200">
      {/* Top Header Bar */}
      <div className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 px-4 py-3 flex items-center justify-between">
        <button
          id="symptom-checker-back-btn"
          onClick={() => setActiveScreen(null)}
          className="p-1.5 -ml-1 text-slate-700 hover:text-slate-900 rounded-full hover:bg-slate-100"
          aria-label="Back"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">AI Symptom Navigator</span>
        <button
          onClick={handleReset}
          className="p-1.5 text-slate-500 hover:text-slate-800 rounded-full"
          title="Reset"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>

      <div className="p-4 space-y-4 max-w-md mx-auto">
        {/* Title & Introduction */}
        <div className="bg-white p-4.5 rounded-3xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center space-x-2 text-emerald-800 font-bold mb-1">
            <BrainCircuit className="w-5 h-5 text-emerald-700" />
            <h2 className="text-base font-bold text-slate-900 font-heading">AI Symptom Checker</h2>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            Describe your symptoms in your own words. We'll help you navigate to the right type of healthcare specialist.
          </p>

          {/* Language selector chips */}
          <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between">
            <div className="flex items-center space-x-1 text-xs text-slate-500">
              <Languages className="w-3.5 h-3.5 text-slate-400" />
              <span>Language:</span>
            </div>
            <div className="flex space-x-1">
              {(['English', 'हिन्दी', 'বাংলা', 'অসমীয়া'] as const).map((lang) => (
                <button
                  key={lang}
                  onClick={() => setSelectedLanguage(lang)}
                  className={`px-2 py-0.5 rounded-lg text-[10px] font-bold border transition-all ${
                    selectedLanguage === lang
                      ? 'bg-emerald-800 text-white border-emerald-800'
                      : 'bg-slate-50 text-slate-600 border-slate-200'
                  }`}
                >
                  {lang}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Input Card with Voice Action */}
        <div className="bg-white p-4 rounded-3xl border border-slate-200/80 shadow-xs space-y-3">
          <div className="relative">
            <textarea
              id="symptom-input-textarea"
              rows={3}
              value={symptomInput}
              onChange={(e) => setSymptomInput(e.target.value)}
              placeholder="Describe your symptoms (e.g. fever, headache, duration, severity)..."
              className="w-full p-3.5 pr-12 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-medium text-slate-900 placeholder:text-slate-400 focus:bg-white focus:ring-2 focus:ring-emerald-700 focus:outline-none"
            />
            {/* Voice Input Mic Button */}
            <button
              id="voice-input-btn"
              onClick={handleVoiceInput}
              className={`absolute right-3 bottom-3 p-2 rounded-xl transition-all ${
                isListeningVoice
                  ? 'bg-rose-500 text-white animate-pulse'
                  : 'bg-slate-200 hover:bg-emerald-100 text-slate-700 hover:text-emerald-800'
              }`}
              title="Speak symptoms"
            >
              {isListeningVoice ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
            </button>
          </div>

          {/* Quick Suggestions Chips */}
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1.5">
              Or Try Examples:
            </span>
            <div className="flex flex-wrap gap-1.5">
              {sampleSymptoms.map((sample, idx) => (
                <button
                  key={idx}
                  onClick={() => setSymptomInput(sample.text)}
                  className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 text-[11px] rounded-lg text-left transition-colors"
                >
                  {sample.text}
                </button>
              ))}
            </div>
          </div>

          {/* Analyze CTA */}
          <button
            id="run-symptom-analysis-btn"
            onClick={handleAnalyze}
            disabled={isAnalyzing || !symptomInput.trim()}
            className="w-full py-3.5 bg-emerald-800 hover:bg-emerald-900 disabled:opacity-50 text-white font-bold text-xs rounded-2xl flex items-center justify-center space-x-2 shadow-xs transition-all active:scale-[0.98]"
          >
            {isAnalyzing ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Evaluating symptoms clinical context...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 text-emerald-300" />
                <span>Analyze & Find Right Specialist</span>
              </>
            )}
          </button>
        </div>

        {/* ALWAYS-VISIBLE SAFETY DISCLAIMER */}
        <div className="p-3.5 bg-slate-100/90 border border-slate-200 rounded-2xl flex items-start space-x-2.5 text-xs text-slate-600">
          <ShieldAlert className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
          <p className="text-[11px] leading-relaxed">
            <strong>Medical Notice:</strong> This tool does not provide a definitive medical diagnosis. It helps navigate care options. For severe or emergency symptoms, seek immediate emergency medical care.
          </p>
        </div>

        {/* ANALYSIS RESULTS */}
        {analysisResult && (
          <div className="space-y-4 animate-in slide-in-from-bottom-3 duration-250">
            {/* EMERGENCY WARNING STATE */}
            {analysisResult.isEmergency ? (
              <div
                id="emergency-warning-banner"
                className="bg-rose-50 border-2 border-rose-300 rounded-3xl p-5 shadow-md space-y-3 text-rose-950"
              >
                <div className="flex items-start space-x-3">
                  <div className="w-10 h-10 rounded-2xl bg-rose-600 text-white flex items-center justify-center shrink-0">
                    <AlertTriangle className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-rose-700 bg-rose-200/80 px-2 py-0.5 rounded">
                      High Priority Emergency Alert
                    </span>
                    <h3 className="text-sm font-bold text-rose-950 mt-1 font-heading">
                      Your symptoms may require urgent medical attention.
                    </h3>
                  </div>
                </div>

                <p className="text-xs text-rose-900 leading-relaxed bg-white/70 p-3 rounded-xl border border-rose-200">
                  {analysisResult.emergencyAdvice}
                </p>

                {/* Emergency Actions */}
                <div className="space-y-2 pt-1">
                  <a
                    id="emergency-call-112-btn"
                    href="tel:112"
                    className="w-full py-3 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-xl flex items-center justify-center space-x-2 shadow-xs transition-all"
                  >
                    <PhoneCall className="w-4 h-4" />
                    <span>Call India National Emergency (112)</span>
                  </a>

                  <a
                    id="emergency-call-108-btn"
                    href="tel:108"
                    className="w-full py-3 bg-rose-100 hover:bg-rose-200 text-rose-950 font-bold text-xs rounded-xl flex items-center justify-center space-x-2 border border-rose-300 transition-all"
                  >
                    <PhoneCall className="w-4 h-4 text-rose-700" />
                    <span>Call Medical Ambulance (108)</span>
                  </a>

                  <button
                    id="emergency-instant-doctor-btn"
                    onClick={() => startInstantConsultation()}
                    className="w-full py-2.5 bg-white text-slate-800 hover:bg-slate-50 font-bold text-xs rounded-xl border border-slate-200 flex items-center justify-center space-x-1.5"
                  >
                    <span>Talk to an On-Duty Doctor Immediately</span>
                  </button>
                </div>
              </div>
            ) : (
              /* STANDARD TRIAGE RESULT CARD */
              <div className="bg-white rounded-3xl p-5 border border-emerald-200/90 shadow-sm space-y-4">
                {/* Header Category & Urgency */}
                <div className="flex items-start justify-between pb-3 border-b border-slate-100">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      Possible Care Category
                    </span>
                    <h3 className="text-base font-bold text-emerald-950 font-heading">
                      {analysisResult.category}
                    </h3>
                  </div>

                  <div className="text-right">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                      Suggested Urgency
                    </span>
                    <span
                      className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-bold ${
                        analysisResult.urgency === 'URGENT'
                          ? 'bg-amber-100 text-amber-900 border border-amber-300'
                          : analysisResult.urgency === 'SOON'
                          ? 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                          : 'bg-slate-100 text-slate-800 border border-slate-200'
                      }`}
                    >
                      {analysisResult.urgency}
                    </span>
                  </div>
                </div>

                {/* Explanation: WHY THIS MAY BE APPROPRIATE */}
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
                    Why This May Be Appropriate
                  </h4>
                  <p className="text-xs text-slate-700 leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-100">
                    {analysisResult.whyAppropriate}
                  </p>
                </div>

                {/* Timeframe */}
                <div className="flex items-center space-x-2 text-xs text-slate-600 bg-emerald-50/50 p-2.5 rounded-xl border border-emerald-100">
                  <Clock className="w-4 h-4 text-emerald-700 shrink-0" />
                  <span>
                    Recommended consultation timeframe: <strong>{analysisResult.recommendedTimeframe}</strong>
                  </span>
                </div>

                {/* Matching Doctors List */}
                <div className="pt-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2.5">
                    Doctors Who May Help
                  </h4>
                  <div className="space-y-2.5">
                    {analysisResult.matchedDoctors.slice(0, 3).map((doc) => (
                      <div
                        key={doc.id}
                        className="p-3 bg-slate-50 rounded-2xl border border-slate-200/80 flex items-center justify-between"
                      >
                        <div className="flex items-center space-x-3">
                          <img
                            src={doc.image}
                            alt={doc.name}
                            className="w-12 h-12 rounded-xl object-cover"
                            referrerPolicy="no-referrer"
                          />
                          <div>
                            <div className="flex items-center space-x-1">
                              <h5 className="text-xs font-bold text-slate-900">{doc.name}</h5>
                              {doc.verified && <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />}
                            </div>
                            <div className="text-[11px] text-slate-500 truncate max-w-[140px]">
                              {doc.qualifications}
                            </div>
                            <div className="text-[10px] text-emerald-800 font-semibold mt-0.5">
                              ₹{doc.feeVideo} • {doc.nextSlotVideo}
                            </div>
                          </div>
                        </div>

                        <button
                          id={`triage-book-doc-${doc.id}`}
                          onClick={() => startBooking(doc)}
                          className="py-2 px-3 bg-emerald-800 hover:bg-emerald-900 text-white rounded-xl text-xs font-bold shadow-xs transition-colors"
                        >
                          Book
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
