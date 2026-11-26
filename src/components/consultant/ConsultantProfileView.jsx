import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../../context/useApp';
import UserAvatar from '../common/UserAvatar';
import ProfilePortfolioSections from './ProfilePortfolioSections';
import {
  ShieldCheck,
  Star,
  MapPin,
  Clock,
  DollarSign,
  Edit2,
  Save,
  CheckCircle2,
  Camera
} from 'lucide-react';

export default function ConsultantProfileView() {
  const { consultantUser, updateConsultantProfile } = useApp();

  const fileInputRef = useRef(null);
  const [isEditing, setIsEditing] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [headline, setHeadline] = useState(consultantUser?.title || '');
  const [bio, setBio] = useState(consultantUser?.bio || '');
  const [hourlyRate, setHourlyRate] = useState(consultantUser?.hourlyRate || 150);
  const [location, setLocation] = useState(consultantUser?.location || '');
  const [avatar, setAvatar] = useState(consultantUser?.avatar || consultantUser?.profileImage || '');
  const [newSkill, setNewSkill] = useState('');
  const [skills, setSkills] = useState(consultantUser?.skills || []);

  const prevUserIdRef = useRef(consultantUser?.id);
  useEffect(() => {
    if (consultantUser && !isEditing && consultantUser.id !== prevUserIdRef.current) {
      prevUserIdRef.current = consultantUser.id;
      setHeadline(consultantUser.title || '');
      setBio(consultantUser.bio || '');
      setHourlyRate(consultantUser.hourlyRate || 150);
      setLocation(consultantUser.location || '');
      setSkills(consultantUser.skills || []);
      setAvatar(consultantUser.avatar || consultantUser.profileImage || '');
    }
  }, [consultantUser, isEditing]);

  const handlePhotoUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result;
        setAvatar(result);
        if (updateConsultantProfile) {
          updateConsultantProfile({
            avatar: result,
            profileImage: result
          });
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    if (updateConsultantProfile) {
      updateConsultantProfile({
        title: headline,
        bio,
        hourlyRate: Number(hourlyRate),
        location,
        skills,
        avatar,
        profileImage: avatar
      });
    }
    setIsEditing(false);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3500);
  };

  const addSkill = () => {
    if (newSkill.trim() && !skills.includes(newSkill.trim())) {
      setSkills(prev => [...prev, newSkill.trim()]);
      setNewSkill('');
    }
  };

  const removeSkill = (s) => {
    setSkills(prev => prev.filter(item => item !== s));
  };

  const isVerified = Boolean(consultantUser?.isVerified || consultantUser?.assessmentPassed);

  return (
    <div className="space-y-6 w-full pb-16">
      {savedSuccess && (
        <div className="p-4 bg-cyan-50 border border-cyan-300 rounded-2xl text-cyan-800 text-xs font-bold flex items-center gap-2.5 animate-in fade-in duration-200 shadow-xs">
          <CheckCircle2 className="w-5 h-5 text-[#0891b2] flex-shrink-0" />
          <div>
            <p className="font-extrabold text-slate-900">Profile Changes Saved Successfully!</p>
            <p className="text-[11px] text-slate-500 font-medium">Your updated consultant title, rate, location, and bio are now live across OverThink.</p>
          </div>
        </div>
      )}

      <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs">
        <div className="h-40 sm:h-48 bg-gradient-to-r from-[#020617] via-[#082f49] to-[#082f49] relative">
          <div className="absolute top-4 right-4 flex items-center gap-2">
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-white/20 text-white backdrop-blur-md border border-white/20">
              {isVerified ? 'Verified Consultant' : 'Verification Pending'}
            </span>
          </div>
        </div>

        <div className="px-4 sm:px-8 pb-6 sm:pb-8 pt-0 relative">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 -mt-14 sm:-mt-20 mb-4">
            <div className="relative inline-block">
              <UserAvatar
                src={avatar || consultantUser.avatar || consultantUser.profileImage}
                name={consultantUser.name}
                role="consultant"
                size="3xl"
                rounded="3xl"
                className="ring-4 ring-white shadow-xl"
              />
              <span className="absolute bottom-1 right-1 sm:bottom-2 sm:right-2 p-1 sm:p-1.5 bg-[#0891b2] rounded-full text-white ring-2 ring-white z-10">
                <ShieldCheck className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </span>
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
                className="absolute top-1 right-1 p-2 rounded-full bg-[#020617] hover:bg-[#091528] text-white shadow-md cursor-pointer transition-transform hover:scale-110 z-10"
                title="Upload Photo (or leave empty for first letter initial)"
              >
                <Camera className="w-3.5 h-3.5 text-[#0891b2]" />
              </button>
            </div>

            <div className="flex items-center gap-2 self-start sm:self-auto">
              {isEditing && (
                <button
                  type="button"
                  onClick={() => {
                    setIsEditing(false);
                    setHeadline(consultantUser.title || '');
                    setBio(consultantUser.bio || '');
                    setHourlyRate(consultantUser.hourlyRate || 150);
                    setLocation(consultantUser.location || '');
                    setSkills(consultantUser.skills || []);
                  }}
                  className="px-3.5 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold transition-all cursor-pointer"
                >
                  Cancel
                </button>
              )}
              <button
                type="button"
                onClick={() => isEditing ? handleSave() : setIsEditing(true)}
                className="px-4 py-2 rounded-xl bg-[#020617] hover:bg-[#091528] text-white text-xs font-bold shadow-xs flex items-center gap-1.5 transition-all cursor-pointer"
              >
                {isEditing ? (
                  <>
                    <Save className="w-4 h-4 text-[#0891b2]" />
                    <span>Save Profile Changes</span>
                  </>
                ) : (
                  <>
                    <Edit2 className="w-4 h-4 text-[#0891b2]" />
                    <span>Edit Profile Details</span>
                  </>
                )}
              </button>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-2xl font-black text-slate-900">{consultantUser.name}</h1>
              <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${
                isVerified
                  ? 'bg-cyan-50 text-cyan-700 border-cyan-200'
                  : 'bg-amber-50 text-amber-800 border-amber-200'
              }`}>
                {isVerified ? '100% Verified' : 'Exam Pending'}
              </span>
            </div>

            {isEditing ? (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1">
                <input
                  type="text"
                  value={headline}
                  onChange={(e) => setHeadline(e.target.value)}
                  placeholder="Headline..."
                  className="px-3 py-2 rounded-xl border border-slate-200 text-xs font-medium text-slate-900"
                />
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="Location (e.g. San Francisco, CA)..."
                  className="px-3 py-2 rounded-xl border border-slate-200 text-xs font-medium text-slate-900"
                />
                <input
                  type="number"
                  value={hourlyRate}
                  onChange={(e) => setHourlyRate(e.target.value)}
                  placeholder="Hourly Rate ($/hr)..."
                  className="px-3 py-2 rounded-xl border border-slate-200 text-xs font-medium text-slate-900"
                />
              </div>
            ) : (
              <p className="text-sm font-semibold text-slate-700 max-w-3xl leading-snug">
                {headline || 'Verified OverThink Domain Specialist'}
              </p>
            )}

            <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 pt-1">
              <span className="flex items-center gap-1 font-bold text-slate-800">
                <Star className="w-4 h-4 text-amber-500 fill-current" />
                {consultantUser.rating || '5.0'} ({consultantUser.reviewsCount || 0} reviews)
              </span>
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-slate-400" />
                {consultantUser.location || location || 'Remote'}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-slate-400" />
                Avg. Response: {consultantUser.responseTime || '< 2 hours'}
              </span>
              <span className="flex items-center gap-1 font-extrabold text-slate-900">
                <DollarSign className="w-3.5 h-3.5 text-cyan-600" />
                ${hourlyRate}/hr
              </span>
            </div>
          </div>

          <div className="mt-6 pt-6 border-t border-slate-100">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
              About & Value Proposition
            </h2>
            {isEditing ? (
              <textarea
                rows={4}
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-900"
              />
            ) : (
              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed max-w-4xl">
                {bio || 'No bio added yet. Click "Edit Profile Details" to describe your domain expertise and consulting focus.'}
              </p>
            )}
          </div>

          <div className="mt-6 pt-6 border-t border-slate-100">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Skills & Areas of Expertise
              </h2>
            </div>

            {skills.length === 0 && !isEditing ? (
              <p className="text-xs text-slate-400 italic">
                No skills listed yet. Click "Edit Profile Details" to add your areas of expertise.
              </p>
            ) : (
              <div className="flex flex-wrap gap-2">
                {skills.map((skill, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1 rounded-xl text-xs font-semibold bg-[#ecfeff] text-[#020617] border border-[#020617]/20 flex items-center gap-1.5"
                  >
                    <span>{skill}</span>
                    {isEditing && (
                      <button
                        type="button"
                        onClick={() => removeSkill(skill)}
                        className="text-slate-400 hover:text-rose-600 font-bold"
                      >
                        ×
                      </button>
                    )}
                  </span>
                ))}
              </div>
            )}

            {isEditing && (
              <div className="flex items-center gap-2 mt-3 max-w-sm">
                <input
                  type="text"
                  value={newSkill}
                  onChange={(e) => setNewSkill(e.target.value)}
                  placeholder="Add new skill..."
                  className="px-3 py-1.5 rounded-xl border border-slate-200 text-xs flex-1"
                />
                <button
                  type="button"
                  onClick={addSkill}
                  className="px-3 py-1.5 bg-[#020617] text-white rounded-xl text-xs font-bold"
                >
                  Add
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <ProfilePortfolioSections
        consultantUser={consultantUser}
        hourlyRate={hourlyRate}
        isVerified={isVerified}
      />
    </div>
  );
}
