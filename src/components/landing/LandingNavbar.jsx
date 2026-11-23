import React, { useState, useEffect } from 'react';
import Logo from '../common/Logo';
import { ArrowRight, User, Menu, X } from 'lucide-react';

/**
 * LandingNavbar
 * Clean, modern SaaS navigation bar:
 * - Professional brand logo
 * - Elegant text links (no ugly step pills)
 * - Sign In & Start Your Think CTAs
 * - Full-bleed responsive width management with smooth backdrop blur
 */
export default function LandingNavbar({
  onNavigateScene,
  onSignIn,
  onStartThink,
  isAuthenticated = false,
  currentUser = null,
  onGoToApp
}) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'The Problem', scene: 1 },
    { label: 'Why AI Falls Short', scene: 2 },
    { label: 'How OverThink Works', scene: 3 },
    { label: 'Human Expertise', scene: 4 },
    { label: 'Results & Impact', scene: 5 }
  ];

  const handleNavClick = (sceneNum) => {
    if (onNavigateScene) onNavigateScene(sceneNum);
    setIsMobileMenuOpen(false);
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 w-full z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-white/35 backdrop-blur-md border-b border-slate-200/30 shadow-[0_4px_20px_rgba(0,0,0,0.03)] py-2.5 sm:py-3'
          : 'bg-transparent py-3 sm:py-4 border-b border-transparent'
      }`}
    >
      <div className="w-full max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-12 xl:px-16 flex items-center justify-between gap-4">
        {/* Brand Logo - Always shows tagline even on scroll */}
        <div
          onClick={() => handleNavClick(1)}
          className="cursor-pointer flex-shrink-0"
        >
          {/* Logo with tagline always visible */}
          <div className="hidden sm:block">
            <Logo size="md" showTagline={true} />
          </div>
          <div className="sm:hidden">
            <Logo size="sm" showTagline={true} />
          </div>
        </div>

        {/* Clean SaaS Navigation Links (Hidden on mobile/tablet, shown on desktop) */}
        <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
          {navLinks.map((link) => (
            <button
              key={link.label}
              type="button"
              onClick={() => handleNavClick(link.scene)}
              className="px-3 py-2 rounded-xl text-xs xl:text-sm font-semibold text-slate-600 hover:text-[#004845] hover:bg-slate-100/70 transition-all cursor-pointer whitespace-nowrap"
            >
              {link.label}
            </button>
          ))}
        </nav>

        {/* Right Action CTAs - Sized perfectly for mobile and desktop */}
        <div className="flex items-center gap-1.5 sm:gap-2.5 flex-shrink-0">
          {/* Sign In / User account pill */}
          {isAuthenticated ? (
            <button
              type="button"
              onClick={onGoToApp}
              className="hidden sm:inline-flex px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-bold text-slate-700 hover:text-[#004845] hover:bg-slate-100 transition-colors items-center gap-1.5 cursor-pointer whitespace-nowrap"
            >
              <User className="w-4 h-4 text-emerald-600" />
              <span>{currentUser?.name?.split(' ')[0] || 'My Account'}</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={onSignIn}
              className="hidden sm:inline-flex px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-bold text-slate-700 hover:text-[#004845] hover:bg-slate-100 transition-colors items-center gap-1.5 cursor-pointer whitespace-nowrap"
            >
              <User className="w-4 h-4 text-slate-500" />
              <span>Sign In</span>
            </button>
          )}

          {/* Primary CTA button - Responsive sizing */}
          <button
            type="button"
            onClick={isAuthenticated ? onGoToApp : onStartThink}
            className="px-3.5 sm:px-5 py-2 sm:py-2.5 rounded-xl bg-[#16a34a] hover:bg-[#15803d] text-white font-bold text-xs sm:text-sm shadow-md shadow-emerald-600/25 hover:shadow-lg hover:shadow-emerald-600/35 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
          >
            <span>{isAuthenticated ? 'Open Workspace' : 'Start Your Think'}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>

          {/* Mobile Menu Toggle Button */}
          <button
            type="button"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 lg:hidden cursor-pointer flex-shrink-0"
            aria-label="Toggle navigation"
          >
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {isMobileMenuOpen && (
        <div className="lg:hidden w-full bg-white/98 backdrop-blur-2xl border-b border-slate-200 px-4 py-4 space-y-3 shadow-xl animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="text-[11px] font-bold text-slate-400 px-3 uppercase tracking-wider">
            Explore OverThink
          </div>
          <div className="grid grid-cols-1 gap-1">
            {navLinks.map((link) => (
              <button
                key={link.label}
                type="button"
                onClick={() => handleNavClick(link.scene)}
                className="w-full text-left px-3 py-2.5 rounded-xl text-xs font-bold text-slate-700 hover:text-[#004845] hover:bg-emerald-50/60 transition-colors"
              >
                {link.label}
              </button>
            ))}
          </div>

          <div className="pt-2 border-t border-slate-100 flex flex-col gap-2">
            {isAuthenticated ? (
              <button
                type="button"
                onClick={onGoToApp}
                className="w-full py-2.5 rounded-xl bg-[#004845] text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md"
              >
                <User className="w-4 h-4 text-emerald-400" />
                <span>Open {currentUser?.role === 'consultant' ? 'Consultant Panel' : 'Client Workspace'}</span>
              </button>
            ) : (
              <>
                <button
                  type="button"
                  onClick={onSignIn}
                  className="w-full py-2.5 rounded-xl border border-slate-200 text-slate-800 font-bold text-xs flex items-center justify-center gap-2 hover:bg-slate-50 transition-colors"
                >
                  <User className="w-4 h-4 text-slate-500" />
                  <span>Sign In to Existing Account</span>
                </button>
                <button
                  type="button"
                  onClick={onStartThink}
                  className="w-full py-2.5 rounded-xl bg-[#16a34a] hover:bg-[#15803d] text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md shadow-emerald-600/25 transition-all"
                >
                  <span>Start Your Think</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
