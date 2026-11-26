import React from 'react';
import { MapPin } from 'lucide-react';

export default function EasyApplyContactStep({
  fullName,
  onFullNameChange,
  email,
  onEmailChange,
  phone,
  onPhoneChange,
  city,
  onCityChange,
  userTitle,
  initials,
}) {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80">
        <div className="w-11 h-11 rounded-full bg-[#020617] text-white font-black text-sm flex items-center justify-center flex-shrink-0">
          {initials}
        </div>
        <div className="min-w-0">
          <p className="text-sm font-bold text-slate-900 truncate">{fullName || 'Candidate'}</p>
          <p className="text-xs text-slate-500 truncate">
            {userTitle || 'OverThink Verified Profile'}
          </p>
          <p className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5 truncate">
            <MapPin className="w-3 h-3 flex-shrink-0" />
            <span>{city || 'Remote'}</span>
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
        <div className="sm:col-span-2 space-y-1">
          <label htmlFor="apply-full-name" className="block text-xs font-bold text-slate-700">
            Full Name <span className="text-rose-500">*</span>
          </label>
          <input
            id="apply-full-name"
            type="text"
            value={fullName}
            onChange={(event) => onFullNameChange(event.target.value)}
            placeholder="Enter your full name"
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#020617]/20 focus:border-[#020617]"
          />
        </div>

        <div className="space-y-1">
          <label htmlFor="apply-email" className="block text-xs font-bold text-slate-700">
            Email Address <span className="text-rose-500">*</span>
          </label>
          <input
            id="apply-email"
            type="email"
            value={email}
            onChange={(event) => onEmailChange(event.target.value)}
            placeholder="you@example.com"
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#020617]/20 focus:border-[#020617]"
          />
        </div>

        <div className="space-y-1">
          <label htmlFor="apply-phone" className="block text-xs font-bold text-slate-700">
            Mobile Phone Number <span className="text-rose-500">*</span>
          </label>
          <input
            id="apply-phone"
            type="tel"
            value={phone}
            onChange={(event) => onPhoneChange(event.target.value)}
            placeholder="+1 (555) 000-0000"
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#020617]/20 focus:border-[#020617]"
          />
        </div>

        <div className="sm:col-span-2 space-y-1">
          <label htmlFor="apply-city" className="block text-xs font-bold text-slate-700">
            Current City / Location
          </label>
          <input
            id="apply-city"
            type="text"
            value={city}
            onChange={(event) => onCityChange(event.target.value)}
            placeholder="City, State or Remote"
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#020617]/20 focus:border-[#020617]"
          />
        </div>
      </div>
    </div>
  );
}
