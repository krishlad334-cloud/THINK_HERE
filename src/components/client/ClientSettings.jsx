import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../../context/useApp';
import UserAvatar from '../common/UserAvatar';
import { isClientThought, isConsultantThought } from '../../utils/thoughtFilters';
import {
  User,
  Shield,
  CheckCircle,
  Lock,
  Save,
  Camera,
  ShieldCheck,
  Clock
} from 'lucide-react';

export default function ClientSettings() {
  const { currentUser, updateUserProfile, thoughts, role } = useApp();

  const fileInputRef = useRef(null);
  const [name, setName] = useState(currentUser?.name || '');
  const [email, setEmail] = useState(currentUser?.email || '');
  const [bio, setBio] = useState(currentUser?.bio || '');
  const [location, setLocation] = useState(currentUser?.location || '');
  const [title, setTitle] = useState(currentUser?.title || '');
  const [avatar, setAvatar] = useState(currentUser?.avatar || currentUser?.profileImage || '');
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [inPlatformMasking, setInPlatformMasking] = useState(true);
  const [timerAlerts, setTimerAlerts] = useState(true);
  const [emailNotifications, setEmailNotifications] = useState(true);

  const prevUserIdRef = useRef(currentUser?.id);
  useEffect(() => {
    if (currentUser && currentUser.id !== prevUserIdRef.current) {
      prevUserIdRef.current = currentUser.id;
      setName(currentUser.name || '');
      setEmail(currentUser.email || '');
      setBio(currentUser.bio || '');
      setLocation(currentUser.location || '');
      setTitle(currentUser.title || '');
      setAvatar(currentUser.avatar || currentUser.profileImage || '');
    }
  }, [currentUser]);

  const handlePhotoUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatar(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (currentUser?.id && updateUserProfile) {
      updateUserProfile(currentUser.id, {
        name: name.trim() || currentUser.name,
        email: email.trim() || currentUser.email,
        bio,
        location,
        title,
        avatar,
        profileImage: avatar
      });
    }
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const userThoughts = (thoughts || []).filter((t) =>
    role === 'consultant' ? isConsultantThought(t, currentUser) : isClientThought(t, currentUser)
  );
  const solutionsCount = userThoughts.filter(
    t => t.status === 'resolved' || t.solution || (t.solutions && t.solutions.length > 0)
  ).length;
  const accountBadge =
    role === 'consultant'
      ? (currentUser?.assessmentPassed || currentUser?.isVerified ? 'Verified Consultant' : 'Verification Pending')
      : 'Verified Client Account';

  return (
    <div className="space-y-6 w-full pb-16">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Profile & Account Settings
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Manage your personal profile, contact privacy safeguards, and notification preferences
          </p>
        </div>

        {savedSuccess && (
          <div className="p-3 bg-cyan-50 border border-cyan-300 rounded-xl text-cyan-800 text-xs font-semibold flex items-center gap-2 animate-in fade-in">
            <CheckCircle className="w-4 h-4 text-[#0891b2]" />
            <span>Profile and privacy settings saved successfully!</span>
          </div>
        )}
      </div>

      <form onSubmit={handleSave} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white rounded-3xl border border-slate-200/90 p-4 sm:p-6 shadow-xs space-y-5 text-center">
            <div className="relative inline-block mx-auto">
              <UserAvatar
                src={avatar || currentUser?.avatar || currentUser?.profileImage}
                name={name || currentUser?.name}
                role={role}
                size="2xl"
                className="ring-4 ring-slate-100 shadow-md mx-auto"
              />
              <input
                type="file"
                ref={fileInputRef}
                onChange={handlePhotoUpload}
                accept="image/*"
                className="hidden"
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="absolute bottom-0 right-0 p-2 rounded-full bg-[#020617] hover:bg-[#091528] text-white shadow-md cursor-pointer transition-transform hover:scale-110"
                title="Upload Photo (or leave empty for first letter initial)"
              >
                <Camera className="w-3.5 h-3.5 text-[#0891b2]" />
              </button>
            </div>

            <div>
              <h2 className="text-lg font-bold text-slate-900">{currentUser?.name}</h2>
              <p className="text-xs text-slate-500 mt-0.5">{currentUser?.email}</p>
              <span className="inline-block mt-2 text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full bg-[#ecfeff] text-[#020617] border border-[#020617]/20">
                {accountBadge}
              </span>
            </div>

            <div className="grid grid-cols-3 gap-2 pt-4 border-t border-slate-100">
              <div className="p-2.5 bg-slate-50 rounded-2xl text-center">
                <span className="text-[10px] font-bold text-slate-400 block uppercase">Thoughts</span>
                <span className="text-base font-black text-slate-900">{userThoughts.length}</span>
              </div>
              <div className="p-2.5 bg-slate-50 rounded-2xl text-center">
                <span className="text-[10px] font-bold text-slate-400 block uppercase">Solutions</span>
                <span className="text-base font-black text-[#0891b2]">{solutionsCount}</span>
              </div>
              <div className="p-2.5 bg-slate-50 rounded-2xl text-center">
                <span className="text-[10px] font-bold text-slate-400 block uppercase">SLA</span>
                <span className="text-base font-black text-[#020617]">24h</span>
              </div>
            </div>

            <div className="pt-2 text-left space-y-2">
              <div className="flex items-center gap-2 text-xs text-slate-600 font-medium">
                <ShieldCheck className="w-4 h-4 text-[#0891b2]" />
                <span>Contact Masking Active</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-600 font-medium">
                <Lock className="w-4 h-4 text-[#020617]" />
                <span>End-to-End Chat Encryption</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-600 font-medium">
                <Clock className="w-4 h-4 text-amber-500" />
                <span>Verified Consultant Connection</span>
              </div>
            </div>
          </div>

          <div className="bg-[#ecfeff] rounded-2xl border border-[#0891b2]/20 p-5 space-y-2">
            <h4 className="text-xs font-bold text-[#020617] flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-[#0891b2]" />
              OverThink Privacy Guarantee
            </h4>
            <p className="text-[11px] text-slate-600 leading-relaxed">
              Your real contact details are strictly shielded. Human consultants only communicate with you through OverThink's internal channels.
            </p>
          </div>
        </div>

        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-3xl border border-slate-200/90 p-4 sm:p-7 space-y-5 shadow-xs">
            <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <User className="w-4 h-4 text-[#020617]" />
                <span>Personal Profile Information</span>
              </h3>
              <span className="text-xs text-slate-400">Public within OverThink consultations</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Full Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#020617]/20 focus:border-[#020617] transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Email Address</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#020617]/20 focus:border-[#020617] transition-all"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Headline / Role</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#020617]/20 focus:border-[#020617] transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Location</label>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#020617]/20 focus:border-[#020617] transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Bio & Areas of Interest</label>
              <textarea
                rows={4}
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#020617]/20 focus:border-[#020617] transition-all leading-relaxed"
              />
              <p className="text-[10px] text-slate-400 mt-1">Brief summary displayed to consultants when they review your submitted thoughts.</p>
            </div>
          </div>

          <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-7 space-y-4 shadow-xs">
            <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Shield className="w-4 h-4 text-[#0891b2]" />
                <span>Contact Privacy & Safeguards (Requirement 10)</span>
              </h3>
              <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-cyan-50 text-cyan-700 border border-cyan-200">
                ENABLED
              </span>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between p-3.5 bg-slate-50/80 rounded-2xl border border-slate-100">
                <div className="pr-4">
                  <p className="text-xs font-bold text-slate-800">In-Platform Masking</p>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Automatically detect and hide personal phone numbers, Telegram IDs, and personal emails during consultation chat.
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={inPlatformMasking}
                  onChange={(e) => setInPlatformMasking(e.target.checked)}
                  className="w-4 h-4 accent-[#020617] rounded cursor-pointer"
                />
              </div>

              <div className="flex items-center justify-between p-3.5 bg-slate-50/80 rounded-2xl border border-slate-100">
                <div className="pr-4">
                  <p className="text-xs font-bold text-slate-800">24-Hour Timer Alerts</p>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Receive urgent notifications when your thought reaches 2 hours prior to the 24-hr consultant SLA deadline.
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={timerAlerts}
                  onChange={(e) => setTimerAlerts(e.target.checked)}
                  className="w-4 h-4 accent-[#020617] rounded cursor-pointer"
                />
              </div>

              <div className="flex items-center justify-between p-3.5 bg-slate-50/80 rounded-2xl border border-slate-100">
                <div className="pr-4">
                  <p className="text-xs font-bold text-slate-800">Email Updates & Roadmap Delivery</p>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Receive full roadmap deliverables and consultation summaries directly to your registered email.
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={emailNotifications}
                  onChange={(e) => setEmailNotifications(e.target.checked)}
                  className="w-4 h-4 accent-[#020617] rounded cursor-pointer"
                />
              </div>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-[#020617] hover:bg-[#091528] text-white text-xs font-bold flex items-center gap-2 shadow-sm shadow-[#020617]/25 cursor-pointer transition-all transform active:scale-98"
            >
              <Save className="w-4 h-4 text-[#0891b2]" />
              <span>Save Settings</span>
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
