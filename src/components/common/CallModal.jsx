import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/useApp';
import UserAvatar from './UserAvatar';
import {
  Mic,
  MicOff,
  Video,
  VideoOff,
  PhoneOff,
  Monitor,
  ShieldCheck
} from 'lucide-react';

export default function CallModal() {
  const { activeCall, endCall, currentUser } = useApp();
  if (!activeCall) return null;

  return (
    <ActiveCallSession
      key={activeCall.startTime || activeCall.thoughtId || 'call'}
      activeCall={activeCall}
      endCall={endCall}
      currentUser={currentUser}
    />
  );
}

function ActiveCallSession({ activeCall, endCall, currentUser }) {
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(activeCall?.callType === 'audio');
  const [isSharingScreen, setIsSharingScreen] = useState(false);
  const [callDuration, setCallDuration] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCallDuration(prev => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const formatTimer = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/85 backdrop-blur-md p-2 sm:p-4 animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl h-[92dvh] sm:h-[620px] max-h-[92dvh] bg-slate-900 rounded-2xl shadow-2xl overflow-hidden flex flex-col border border-slate-800">
        <div className="flex items-center justify-between px-3.5 sm:px-6 py-2.5 sm:py-4 bg-slate-900/90 border-b border-slate-800 z-10 gap-2">
          <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
            <span className="flex h-2.5 w-2.5 sm:h-3 sm:w-3 relative flex-shrink-0">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 sm:h-3 sm:w-3 bg-emerald-500"></span>
            </span>
            <div className="min-w-0">
              <h3 className="text-white font-medium text-xs sm:text-sm flex items-center gap-1.5 sm:gap-2 truncate">
                <span className="truncate">Call with {activeCall.participantName}</span>
                <span className="px-1.5 sm:px-2 py-0.5 rounded-full text-[9px] sm:text-[10px] bg-[#020617] text-[#0891b2] border border-[#0891b2]/30 flex-shrink-0">
                  Encrypted
                </span>
              </h3>
              <p className="text-[10px] sm:text-xs text-slate-400">Duration: {formatTimer(callDuration)}</p>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-shrink-0">
            <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 bg-slate-800 rounded-full text-xs text-slate-300">
              <ShieldCheck className="w-3.5 h-3.5 text-[#0891b2]" />
              <span>Contact Privacy Shield</span>
            </div>
          </div>
        </div>

        <div className="flex-1 relative bg-gradient-to-b from-slate-950 to-slate-900 flex items-center justify-center p-6 overflow-hidden">
          {isSharingScreen ? (
            <div className="w-full h-full bg-slate-950 rounded-xl border border-[#020617]/40 flex flex-col items-center justify-center p-6 text-center">
              <div className="w-16 h-16 rounded-2xl bg-[#020617] text-[#0891b2] flex items-center justify-center mb-3">
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
                <UserAvatar
                  src={activeCall.participantAvatar}
                  name={activeCall.participantName}
                  size="2xl"
                  showOnline={true}
                  className="ring-4 ring-[#020617] shadow-2xl"
                />
                <div className="absolute -inset-2 rounded-full border border-[#0891b2]/40 animate-pulse pointer-events-none"></div>
              </div>
              <h2 className="text-white text-xl font-bold">{activeCall.participantName}</h2>
              <p className="text-slate-400 text-sm mt-1 flex items-center gap-1.5">
                <Video className="w-4 h-4 text-cyan-400" />
                Live OverThink Consultation Session
              </p>

              <div className="flex items-center gap-1.5 mt-6">
                {[12, 24, 40, 20, 36, 16, 28, 48, 22, 14].map((h, i) => (
                  <div
                    key={i}
                    style={{ height: `${h}px` }}
                    className="w-1 bg-[#0891b2] rounded-full animate-pulse"
                  />
                ))}
              </div>
            </div>
          )}

          <div className="absolute bottom-2 sm:bottom-4 right-2 sm:right-4 w-28 h-20 sm:w-44 sm:h-32 bg-slate-800 rounded-xl border border-slate-700 overflow-hidden shadow-xl flex items-center justify-center z-10">
            {isVideoOff ? (
              <div className="text-center p-1 sm:p-2">
                <UserAvatar
                  src={currentUser.avatar || currentUser.profileImage}
                  name={currentUser.name}
                  size="sm"
                  className="mx-auto mb-1 opacity-80"
                />
                <p className="text-[9px] sm:text-[10px] text-slate-400">Camera Off</p>
              </div>
            ) : (
              <div className="relative w-full h-full bg-slate-900 flex items-center justify-center">
                <UserAvatar
                  src={currentUser.avatar || currentUser.profileImage}
                  name={currentUser.name}
                  size="md"
                  className="opacity-90"
                />
                <span className="absolute top-1 left-1.5 text-[9px] sm:text-[10px] bg-black/60 px-1.5 py-0.2 rounded text-white font-medium">
                  You
                </span>
              </div>
            )}
          </div>
        </div>

        <div className="px-3 sm:px-6 py-3 sm:py-4 bg-slate-950 border-t border-slate-800 flex items-center justify-between">
          <div className="text-xs text-slate-400 hidden sm:block">
            Connected via WebRTC Relay
          </div>

          <div className="flex items-center gap-2 sm:gap-3 mx-auto sm:mx-0">
            <button
              onClick={() => setIsMuted(!isMuted)}
              className={`p-2.5 sm:p-3.5 rounded-full transition-all cursor-pointer ${
                isMuted
                  ? 'bg-rose-500/20 text-rose-400 hover:bg-rose-500/30'
                  : 'bg-slate-800 text-white hover:bg-slate-700'
              }`}
              title={isMuted ? 'Unmute Mic' : 'Mute Mic'}
            >
              {isMuted ? <MicOff className="w-4 h-4 sm:w-5 sm:h-5" /> : <Mic className="w-4 h-4 sm:w-5 sm:h-5" />}
            </button>

            <button
              onClick={() => setIsVideoOff(!isVideoOff)}
              className={`p-2.5 sm:p-3.5 rounded-full transition-all cursor-pointer ${
                isVideoOff
                  ? 'bg-rose-500/20 text-rose-400 hover:bg-rose-500/30'
                  : 'bg-slate-800 text-white hover:bg-slate-700'
              }`}
              title={isVideoOff ? 'Turn Video On' : 'Turn Video Off'}
            >
              {isVideoOff ? <VideoOff className="w-4 h-4 sm:w-5 sm:h-5" /> : <Video className="w-4 h-4 sm:w-5 sm:h-5" />}
            </button>

            <button
              onClick={() => setIsSharingScreen(!isSharingScreen)}
              className={`p-2.5 sm:p-3.5 rounded-full transition-all cursor-pointer ${
                isSharingScreen
                  ? 'bg-[#020617] text-[#0891b2] shadow-lg'
                  : 'bg-slate-800 text-white hover:bg-slate-700'
              }`}
              title={isSharingScreen ? 'Stop Sharing' : 'Share Screen'}
            >
              <Monitor className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>

            <button
              onClick={endCall}
              className="px-3.5 sm:px-5 py-2.5 sm:py-3 rounded-full bg-rose-600 hover:bg-rose-700 text-white font-medium flex items-center gap-1.5 sm:gap-2 shadow-lg shadow-rose-600/30 transition-all ml-1 sm:ml-2 cursor-pointer"
              title="End Consultation"
            >
              <PhoneOff className="w-4 h-4 sm:w-5 sm:h-5" />
              <span className="text-xs sm:text-sm">Leave</span>
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
