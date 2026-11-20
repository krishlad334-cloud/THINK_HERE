import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Mic,
  MicOff,
  Video,
  VideoOff,
  PhoneOff,
  Monitor,
  MessageSquare,
  Sparkles,
  ShieldCheck,
  Maximize2
} from 'lucide-react';

export default function CallModal() {
  const { activeCall, endCall, currentUser } = useApp();
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(activeCall?.callType === 'audio');
  const [isSharingScreen, setIsSharingScreen] = useState(false);
  const [callDuration, setCallDuration] = useState(0);

  useEffect(() => {
    if (!activeCall) return;
    const interval = setInterval(() => {
      setCallDuration(prev => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [activeCall]);

  if (!activeCall) return null;

  const formatTimer = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/85 backdrop-blur-md p-4 animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl h-[620px] bg-slate-900 rounded-2xl shadow-2xl overflow-hidden flex flex-col border border-slate-800">
        {/* Top bar inside call */}
        <div className="flex items-center justify-between px-6 py-4 bg-slate-900/90 border-b border-slate-800 z-10">
          <div className="flex items-center gap-3">
            <span className="flex h-3 w-3 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
            </span>
            <div>
              <h3 className="text-white font-medium text-sm flex items-center gap-2">
                Consultation Call with {activeCall.participantName}
                <span className="px-2 py-0.5 rounded-full text-[10px] bg-[#004845] text-[#16a34a] border border-[#16a34a]/30">
                  THINK Encrypted
                </span>
              </h3>
              <p className="text-xs text-slate-400">Duration: {formatTimer(callDuration)}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 px-3 py-1 bg-slate-800 rounded-full text-xs text-slate-300">
              <ShieldCheck className="w-3.5 h-3.5 text-[#16a34a]" />
              <span>Contact Privacy Shield Active</span>
            </div>
          </div>
        </div>

        {/* Video / Call stage */}
        <div className="flex-1 relative bg-gradient-to-b from-slate-950 to-slate-900 flex items-center justify-center p-6 overflow-hidden">
          {isSharingScreen ? (
            <div className="w-full h-full bg-slate-950 rounded-xl border border-[#004845]/40 flex flex-col items-center justify-center p-6 text-center">
              <div className="w-16 h-16 rounded-2xl bg-[#004845] text-[#16a34a] flex items-center justify-center mb-3">
                <Monitor className="w-8 h-8 animate-pulse" />
              </div>
              <h4 className="text-white font-semibold text-lg">Screen Sharing Active</h4>
              <p className="text-xs text-slate-400 max-w-md mt-1">
                You are currently presenting your screen to {activeCall.participantName} for architecture & solution review.
              </p>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center text-center">
              <div className="relative mb-4">
                <img
                  src={activeCall.participantAvatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200'}
                  alt={activeCall.participantName}
                  className="w-32 h-32 rounded-full object-cover ring-4 ring-[#004845] shadow-2xl"
                />
                <span className="absolute bottom-1 right-2 w-5 h-5 rounded-full bg-[#16a34a] ring-2 ring-slate-900"></span>
                <div className="absolute -inset-2 rounded-full border border-[#16a34a]/40 animate-pulse pointer-events-none"></div>
              </div>
              <h2 className="text-white text-xl font-bold">{activeCall.participantName}</h2>
              <p className="text-slate-400 text-sm mt-1 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-amber-400" />
                Live THINK Consultation Session
              </p>

              {/* Audio wave simulation */}
              <div className="flex items-center gap-1.5 mt-6">
                {[12, 24, 40, 20, 36, 16, 28, 48, 22, 14].map((h, i) => (
                  <div
                    key={i}
                    style={{ height: `${h}px` }}
                    className="w-1 bg-[#16a34a] rounded-full animate-pulse"
                  />
                ))}
              </div>
            </div>
          )}

          {/* Picture-in-picture self preview */}
          <div className="absolute bottom-4 right-4 w-44 h-32 bg-slate-800 rounded-xl border border-slate-700 overflow-hidden shadow-xl flex items-center justify-center">
            {isVideoOff ? (
              <div className="text-center p-2">
                <img
                  src={currentUser.avatar}
                  alt={currentUser.name}
                  className="w-10 h-10 rounded-full mx-auto mb-1 opacity-80"
                />
                <p className="text-[10px] text-slate-400">Camera Off</p>
              </div>
            ) : (
              <div className="relative w-full h-full bg-slate-900 flex items-center justify-center">
                <img
                  src={currentUser.avatar}
                  alt={currentUser.name}
                  className="w-full h-full object-cover opacity-90"
                />
                <span className="absolute top-1.5 left-2 text-[10px] bg-black/60 px-1.5 py-0.5 rounded text-white font-medium">
                  You
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Bottom Call Controls */}
        <div className="px-6 py-4 bg-slate-950 border-t border-slate-800 flex items-center justify-between">
          <div className="text-xs text-slate-400 hidden sm:block">
            Connected via WebRTC Relay
          </div>

          <div className="flex items-center gap-3 mx-auto sm:mx-0">
            {/* Mic Toggle */}
            <button
              onClick={() => setIsMuted(!isMuted)}
              className={`p-3.5 rounded-full transition-all ${
                isMuted
                  ? 'bg-rose-500/20 text-rose-400 hover:bg-rose-500/30'
                  : 'bg-slate-800 text-white hover:bg-slate-700'
              }`}
              title={isMuted ? 'Unmute Mic' : 'Mute Mic'}
            >
              {isMuted ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
            </button>

            {/* Video Toggle */}
            <button
              onClick={() => setIsVideoOff(!isVideoOff)}
              className={`p-3.5 rounded-full transition-all ${
                isVideoOff
                  ? 'bg-rose-500/20 text-rose-400 hover:bg-rose-500/30'
                  : 'bg-slate-800 text-white hover:bg-slate-700'
              }`}
              title={isVideoOff ? 'Turn Video On' : 'Turn Video Off'}
            >
              {isVideoOff ? <VideoOff className="w-5 h-5" /> : <Video className="w-5 h-5" />}
            </button>

            {/* Screen Share */}
            <button
              onClick={() => setIsSharingScreen(!isSharingScreen)}
              className={`p-3.5 rounded-full transition-all ${
                isSharingScreen
                  ? 'bg-[#004845] text-[#16a34a] shadow-lg'
                  : 'bg-slate-800 text-white hover:bg-slate-700'
              }`}
              title={isSharingScreen ? 'Stop Sharing' : 'Share Screen'}
            >
              <Monitor className="w-5 h-5" />
            </button>

            {/* End Call */}
            <button
              onClick={endCall}
              className="px-5 py-3 rounded-full bg-rose-600 hover:bg-rose-700 text-white font-medium flex items-center gap-2 shadow-lg shadow-rose-600/30 transition-all ml-2"
              title="End Consultation"
            >
              <PhoneOff className="w-5 h-5" />
              <span className="text-sm">Leave Room</span>
            </button>
          </div>

          <div className="text-xs text-slate-400 hidden sm:block">
            HD 1080p
          </div>
        </div>
      </div>
    </div>
  );
}
