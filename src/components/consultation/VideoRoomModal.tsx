import React, { useState } from 'react';
import {
  Mic,
  MicOff,
  Video as VideoIcon,
  VideoOff,
  Volume2,
  VolumeX,
  PhoneOff,
  MessageSquare,
  FileText,
  UploadCloud,
  Send,
  X,
  ShieldCheck,
  CheckCircle,
  Paperclip,
  Clock,
  Sparkles,
  Maximize2,
  Minimize2,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const VideoRoomModal: React.FC = () => {
  const {
    activeCall,
    endCall,
    toggleMic,
    toggleVideo,
    toggleSpeaker,
    toggleCallChat,
    sendCallMessage,
    setSelectedPrescription,
    prescriptions,
    showToast,
  } = useApp();

  const [messageInput, setMessageInput] = useState('');
  const [showToolsDrawer, setShowToolsDrawer] = useState(false);
  const [isPatientPiPMin, setIsPatientPiPMin] = useState(false);

  if (!activeCall.isActive || !activeCall.doctor) return null;

  const doctor = activeCall.doctor;

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageInput.trim()) return;
    sendCallMessage(messageInput);
    setMessageInput('');
  };

  const handleSendReport = (reportName: string) => {
    sendCallMessage(`Uploaded document: ${reportName}`, reportName);
    setShowToolsDrawer(false);
    showToast(`Shared ${reportName} with doctor`);
  };

  return (
    <div
      id="telemedicine-video-room-container"
      className="fixed inset-0 z-50 bg-slate-950 text-white flex flex-col max-w-md mx-auto overflow-hidden animate-in fade-in duration-200"
    >
      {/* 1. WAITING ROOM / CONNECTING STATE */}
      {activeCall.isConnecting ? (
        <div className="flex-1 flex flex-col items-center justify-center p-6 text-center space-y-6">
          <div className="relative">
            <div className="w-28 h-28 rounded-full bg-emerald-500/20 animate-ping absolute inset-0" />
            <div className="w-28 h-28 rounded-full ring-4 ring-emerald-500 overflow-hidden relative shadow-xl">
              <img
                src={doctor.image}
                alt={doctor.name}
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <div className="inline-flex items-center space-x-1.5 bg-emerald-950/80 border border-emerald-500/40 px-3 py-1 rounded-full text-xs font-bold text-emerald-300">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Establishing Encrypted Line</span>
            </div>
            <h2 className="text-lg font-bold font-heading">Connecting to {doctor.name}...</h2>
            <p className="text-xs text-slate-400">
              {doctor.specialty} • {doctor.hospital}
            </p>
          </div>

          <div className="bg-slate-900/80 border border-slate-800 p-4 rounded-2xl max-w-xs w-full text-xs text-slate-300 space-y-2">
            <div className="flex items-center justify-between">
              <span>Estimated Wait:</span>
              <strong className="text-emerald-400">~15 seconds</strong>
            </div>
            <div className="flex items-center justify-between">
              <span>Security Check:</span>
              <strong className="text-emerald-400">Verified Practitioner</strong>
            </div>
          </div>

          <button
            onClick={endCall}
            className="py-2.5 px-6 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-bold transition-colors"
          >
            Cancel Connection
          </button>
        </div>
      ) : (
        /* 2. ACTIVE VIDEO CONSULTATION SESSION */
        <div className="flex-1 flex flex-col relative bg-slate-950">
          {/* Top Session Security Header */}
          <div className="absolute top-0 left-0 right-0 z-30 p-3 bg-gradient-to-b from-black/80 to-transparent flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="flex items-center space-x-1 bg-emerald-900/70 backdrop-blur-md px-2.5 py-1 rounded-full border border-emerald-500/50 text-[11px] font-bold text-emerald-300">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>Secure consultation</span>
              </div>
              <div className="bg-black/40 backdrop-blur-md px-2 py-1 rounded-full text-[11px] font-mono font-bold text-slate-300">
                {formatTimer(activeCall.durationSeconds)}
              </div>
            </div>

            {/* In-Call Actions */}
            <div className="flex items-center space-x-2">
              <button
                id="telehealth-tools-toggle"
                onClick={() => setShowToolsDrawer(!showToolsDrawer)}
                className="p-2 rounded-full bg-black/50 backdrop-blur-md text-slate-200 hover:text-white border border-white/10"
                title="Consultation tools & reports"
              >
                <Paperclip className="w-4 h-4" />
              </button>
              <button
                id="telehealth-chat-toggle"
                onClick={() => toggleCallChat()}
                className="relative p-2 rounded-full bg-black/50 backdrop-blur-md text-slate-200 hover:text-white border border-white/10"
                title="Doctor chat"
              >
                <MessageSquare className="w-4 h-4" />
                {activeCall.messages.length > 0 && !activeCall.activeChatDrawer && (
                  <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-500 rounded-full" />
                )}
              </button>
            </div>
          </div>

          {/* Main Doctor Video Feed */}
          <div className="flex-1 relative flex items-center justify-center overflow-hidden bg-slate-900">
            <img
              src={doctor.image}
              alt={doctor.name}
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />

            {/* Doctor Info Card Overlay */}
            <div className="absolute bottom-24 left-4 z-20 bg-black/60 backdrop-blur-md px-3.5 py-2 rounded-2xl border border-white/10 max-w-[240px]">
              <div className="flex items-center space-x-1.5">
                <h3 className="text-xs font-bold text-white truncate">{doctor.name}</h3>
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              </div>
              <p className="text-[10px] text-slate-300 truncate">
                {doctor.specialty} • {doctor.hospital}
              </p>
            </div>

            {/* Floating Patient Self-View (Picture-in-Picture) */}
            <div
              className={`absolute top-14 right-4 z-20 rounded-2xl overflow-hidden border-2 border-emerald-500/80 shadow-2xl bg-slate-800 transition-all ${
                isPatientPiPMin ? 'w-16 h-20' : 'w-24 h-32'
              }`}
            >
              {activeCall.isVideoOff ? (
                <div className="w-full h-full flex flex-col items-center justify-center bg-slate-900 text-[10px] text-slate-400 p-1 text-center">
                  <VideoOff className="w-4 h-4 text-slate-500 mb-1" />
                  <span>Cam Off</span>
                </div>
              ) : (
                <img
                  src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=300"
                  alt="Patient Self View"
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              )}

              <button
                onClick={() => setIsPatientPiPMin(!isPatientPiPMin)}
                className="absolute top-1 right-1 p-1 bg-black/60 rounded text-slate-300 hover:text-white"
              >
                {isPatientPiPMin ? <Maximize2 className="w-2.5 h-2.5" /> : <Minimize2 className="w-2.5 h-2.5" />}
              </button>
            </div>
          </div>

          {/* Bottom Floating Call Control Bar */}
          <div className="absolute bottom-4 left-4 right-4 z-30 bg-slate-900/90 backdrop-blur-xl border border-slate-700/60 p-3 rounded-3xl shadow-2xl flex items-center justify-around">
            {/* Mic Toggle */}
            <button
              id="call-toggle-mic"
              onClick={toggleMic}
              className={`p-3 rounded-full transition-all active:scale-90 ${
                activeCall.isMicMuted
                  ? 'bg-rose-500/20 text-rose-400 border border-rose-500/50'
                  : 'bg-slate-800 hover:bg-slate-700 text-slate-100'
              }`}
              title={activeCall.isMicMuted ? 'Unmute' : 'Mute'}
            >
              {activeCall.isMicMuted ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
            </button>

            {/* Video Toggle */}
            <button
              id="call-toggle-video"
              onClick={toggleVideo}
              className={`p-3 rounded-full transition-all active:scale-90 ${
                activeCall.isVideoOff
                  ? 'bg-rose-500/20 text-rose-400 border border-rose-500/50'
                  : 'bg-slate-800 hover:bg-slate-700 text-slate-100'
              }`}
              title={activeCall.isVideoOff ? 'Start Video' : 'Stop Video'}
            >
              {activeCall.isVideoOff ? <VideoOff className="w-5 h-5" /> : <VideoIcon className="w-5 h-5" />}
            </button>

            {/* Speaker Toggle */}
            <button
              id="call-toggle-speaker"
              onClick={toggleSpeaker}
              className={`p-3 rounded-full transition-all active:scale-90 ${
                activeCall.isSpeakerOn
                  ? 'bg-slate-800 hover:bg-slate-700 text-slate-100'
                  : 'bg-slate-800 text-slate-500'
              }`}
              title={activeCall.isSpeakerOn ? 'Speaker On' : 'Speaker Off'}
            >
              {activeCall.isSpeakerOn ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
            </button>

            {/* End Call Button */}
            <button
              id="call-end-button"
              onClick={endCall}
              className="p-3.5 bg-rose-600 hover:bg-rose-700 text-white rounded-full shadow-lg active:scale-95 transition-all"
              title="End Consultation"
            >
              <PhoneOff className="w-5 h-5" />
            </button>
          </div>

          {/* DOCTOR CHAT DRAWER (Healthcare Messaging) */}
          {activeCall.activeChatDrawer && (
            <div className="absolute inset-x-0 bottom-0 top-12 z-40 bg-slate-900 border-t border-slate-800 rounded-t-3xl flex flex-col animate-in slide-in-from-bottom duration-250 shadow-2xl">
              {/* Chat Header */}
              <div className="p-3.5 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
                <div className="flex items-center space-x-2.5">
                  <img
                    src={doctor.image}
                    alt={doctor.name}
                    className="w-8 h-8 rounded-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                  <div>
                    <h4 className="text-xs font-bold text-white">{doctor.name}</h4>
                    <span className="text-[10px] text-emerald-400 font-medium">In consultation chat</span>
                  </div>
                </div>
                <button
                  onClick={() => toggleCallChat(false)}
                  className="p-1.5 text-slate-400 hover:text-white rounded-full"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Message History */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3 no-scrollbar text-xs">
                {activeCall.messages.map((msg) => {
                  const isPatient = msg.sender === 'patient';
                  return (
                    <div
                      key={msg.id}
                      className={`flex flex-col ${isPatient ? 'items-end' : 'items-start'}`}
                    >
                      <div
                        className={`p-3 rounded-2xl max-w-[80%] leading-relaxed ${
                          isPatient
                            ? 'bg-emerald-700 text-white rounded-br-xs'
                            : 'bg-slate-800 text-slate-100 rounded-bl-xs border border-slate-700'
                        }`}
                      >
                        {msg.attachmentName && (
                          <div className="mb-1.5 p-1.5 bg-black/20 rounded-lg flex items-center space-x-1.5 text-[11px] font-semibold">
                            <Paperclip className="w-3.5 h-3.5 text-emerald-300" />
                            <span>{msg.attachmentName}</span>
                          </div>
                        )}
                        <p>{msg.text}</p>
                      </div>
                      <span className="text-[9px] text-slate-500 mt-0.5 px-1">{msg.time}</span>
                    </div>
                  );
                })}
              </div>

              {/* Message Composer */}
              <form onSubmit={handleSendMessage} className="p-3 border-t border-slate-800 bg-slate-950 flex items-center space-x-2">
                <input
                  type="text"
                  placeholder="Type clinical notes or response..."
                  value={messageInput}
                  onChange={(e) => setMessageInput(e.target.value)}
                  className="flex-1 px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                />
                <button
                  type="submit"
                  className="p-2.5 bg-emerald-700 hover:bg-emerald-600 text-white rounded-xl transition-colors active:scale-95"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </div>
          )}

          {/* TOOLS & REPORT UPLOAD DRAWER */}
          {showToolsDrawer && (
            <div className="absolute inset-x-0 bottom-24 z-40 bg-slate-900 border border-slate-800 rounded-3xl p-4 m-4 shadow-2xl space-y-3 animate-in slide-in-from-bottom duration-200">
              <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Share Documents with Doctor
                </h4>
                <button onClick={() => setShowToolsDrawer(false)}>
                  <X className="w-4 h-4 text-slate-400" />
                </button>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => handleSendReport('Recent_CBC_Blood_Report.pdf')}
                  className="p-3 bg-slate-800 hover:bg-slate-750 border border-slate-700 rounded-xl text-left text-xs font-semibold text-slate-200 flex items-center space-x-2"
                >
                  <FileText className="w-4 h-4 text-emerald-400" />
                  <span>CBC Blood Report</span>
                </button>

                <button
                  onClick={() => handleSendReport('Chest_XRay_Digital.pdf')}
                  className="p-3 bg-slate-800 hover:bg-slate-750 border border-slate-700 rounded-xl text-left text-xs font-semibold text-slate-200 flex items-center space-x-2"
                >
                  <FileText className="w-4 h-4 text-emerald-400" />
                  <span>Chest X-Ray</span>
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
