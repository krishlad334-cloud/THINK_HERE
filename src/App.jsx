import React, { useState } from 'react';
import { AppProvider } from './context/AppContext';
import { useApp } from './context/useApp';
import Navbar from './components/common/Navbar';
import Sidebar from './components/common/Sidebar';
import NewThoughtModal from './components/client/NewThoughtModal';
import ThoughtDetailModal from './components/client/ThoughtDetailModal';
import CallModal from './components/common/CallModal';
import ContactViolationAlert from './components/common/ContactViolationAlert';
import ToastContainer from './components/common/ToastContainer';
import AuthPage from './components/auth/AuthPage';
import LandingPage from './components/landing/LandingPage';
import Loader from './components/landing/Loader';
import { useReducedMotion } from './hooks/useReducedMotion';

import ClientChatView from './components/client/ClientChatView';
import MyThoughtsView from './components/client/MyThoughtsView';
import SavedSolutionsView from './components/client/SavedSolutionsView';
import ClientJobHub from './components/client/ClientJobHub';
import ClientFindConsultants from './components/client/ClientFindConsultants';
import ClientSettings from './components/client/ClientSettings';

import BrowseClientThoughts from './components/consultant/BrowseClientThoughts';
import MyConsultations from './components/consultant/MyConsultations';
import ConsultantProfileView from './components/consultant/ConsultantProfileView';
import ConsultantAnalytics from './components/consultant/ConsultantAnalytics';
import ConsultantAssessmentView from './components/consultant/ConsultantAssessmentView';

import ChatWorkspace from './components/chat/ChatWorkspace';

function AppContent() {
  const {
    role,
    activeTab,
    setActiveTab,
    isAuthenticated,
    currentUser,
    toast,
    closeToast,
    logoutUser,
  } = useApp();
  const reducedMotion = useReducedMotion();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [currentView, setCurrentView] = useState('landing');
  const [authInitialMode, setAuthInitialMode] = useState('login');
  const [transitionKey, setTransitionKey] = useState(0);
  const [isPageLoading, setIsPageLoading] = useState(false);

  const isConsultantUncertified =
    isAuthenticated &&
    role === 'consultant' &&
    !currentUser?.assessmentPassed &&
    !currentUser?.isVerified;

  const navigateView = (nextView, authMode) => {
    if (authMode) setAuthInitialMode(authMode);
    setIsSidebarOpen(false);
    if (!reducedMotion) {
      setTransitionKey((k) => k + 1);
      setIsPageLoading(true);
    }
    setCurrentView(nextView);
    if (typeof window !== 'undefined') {
      window.scrollTo(0, 0);
    }
  };

  const effectiveView =
    !isAuthenticated && (currentView === 'app' || currentView === 'consultant_test')
      ? 'landing'
      : (currentView === 'app' && isConsultantUncertified ? 'consultant_test' : currentView);

  React.useEffect(() => {
    if (!isAuthenticated) return;
    if (role === 'client') {
      const consultantTabs = ['browse_thoughts', 'my_consultations', 'profile', 'analytics', 'completed', 'assessment'];
      if (consultantTabs.includes(activeTab)) {
        setActiveTab('chat');
      }
    } else if (role === 'consultant') {
      const clientTabs = ['my_thoughts', 'consultant_responses', 'ai_responses', 'saved_solutions', 'jobs', 'find_consultants'];
      if (clientTabs.includes(activeTab)) {
        setActiveTab('browse_thoughts');
      }
    }
  }, [role, activeTab, isAuthenticated, setActiveTab]);

  const renderCurrentView = () => {
    if (activeTab === 'landing') {
      return (
        <div className="w-full h-full overflow-y-auto">
          <LandingPage
            skipLoader={true}
            onSignIn={() => setActiveTab(role === 'consultant' ? 'browse_thoughts' : 'chat')}
            onStartThink={() => setActiveTab('chat')}
          />
        </div>
      );
    }

    if (activeTab === 'messages') {
      return <ChatWorkspace />;
    }

    if (role === 'client') {
      switch (activeTab) {
        case 'chat':
        case 'dashboard':
          return <ClientChatView />;
        case 'my_thoughts':
          return <MyThoughtsView filterMode="all" />;
        case 'consultant_responses':
          return <MyThoughtsView filterMode="consultant_responses" />;
        case 'ai_responses':
          return <MyThoughtsView filterMode="ai_responses" />;
        case 'saved_solutions':
          return <SavedSolutionsView />;
        case 'jobs':
          return <ClientJobHub />;
        case 'find_consultants':
          return <ClientFindConsultants />;
        case 'settings':
        case 'help':
          return <ClientSettings />;
        default:
          return <ClientChatView />;
      }
    }

    if (role === 'consultant') {
      switch (activeTab) {
        case 'browse_thoughts':
          return <BrowseClientThoughts />;
        case 'my_consultations':
        case 'completed':
          return <MyConsultations />;
        case 'profile':
          return <ConsultantProfileView />;
        case 'analytics':
          return <ConsultantAnalytics />;
        case 'assessment':
          return (
            <ConsultantAssessmentView
              isStandalone={false}
              onComplete={() => setActiveTab('browse_thoughts')}
            />
          );
        case 'settings':
          return <ClientSettings />;
        default:
          return <BrowseClientThoughts />;
      }
    }

    return <ClientChatView />;
  };

  const isEdgeToEdge = activeTab === 'messages';

  const renderShell = () => {
    if (effectiveView === 'landing') {
      return (
        <LandingPage
          isAuthenticated={isAuthenticated}
          currentUser={currentUser}
          skipLoader={transitionKey > 0}
          onGoToApp={() => navigateView(isConsultantUncertified ? 'consultant_test' : 'app')}
          onSignIn={() => navigateView('auth', 'login')}
          onStartThink={() => navigateView('auth', 'register')}
          onLogout={() => {
            logoutUser();
            navigateView('landing');
          }}
        />
      );
    }

    if (effectiveView === 'auth') {
      return (
        <AuthPage
          initialMode={authInitialMode}
          onBackToLanding={() => navigateView('landing')}
          onSuccess={(userObj, isNewRegistration) => {
            const nextRole = userObj?.role || role;
            const needsTest =
              nextRole === 'consultant' &&
              (isNewRegistration || (!userObj?.assessmentPassed && !userObj?.isVerified));
            if (needsTest) {
              navigateView('consultant_test');
            } else {
              navigateView('app');
            }
          }}
        />
      );
    }

    if (effectiveView === 'consultant_test') {
      return (
        <ConsultantAssessmentView
          isStandalone={true}
          onBackToLanding={() => navigateView('landing')}
          onComplete={() => {
            setActiveTab('browse_thoughts');
            navigateView('app');
          }}
        />
      );
    }

    if (!isAuthenticated) {
      return (
        <LandingPage
          isAuthenticated={false}
          currentUser={null}
          skipLoader={transitionKey > 0}
          onGoToApp={() => navigateView('auth', 'login')}
          onSignIn={() => navigateView('auth', 'login')}
          onStartThink={() => navigateView('auth', 'register')}
        />
      );
    }

    return (
      <div className="h-screen h-[100dvh] w-full bg-[#f8fafc] flex flex-col font-sans text-slate-900 antialiased overflow-hidden">
        <Navbar
          onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
          onGoToLanding={() => navigateView('landing')}
        />

        <div className="flex-1 flex w-full h-[calc(100vh-4rem)] h-[calc(100dvh-4rem)] overflow-hidden relative">
          <Sidebar
            isOpen={isSidebarOpen}
            onClose={() => setIsSidebarOpen(false)}
          />

          <main
            className={`flex-1 min-w-0 h-full flex flex-col ${
              isEdgeToEdge
                ? 'p-0 bg-white overflow-hidden'
                : 'p-3.5 sm:p-6 lg:p-8 bg-slate-50/60 overflow-y-auto overflow-x-hidden'
            }`}
          >
            {renderCurrentView()}
          </main>
        </div>

        <ToastContainer toast={toast} onClose={closeToast} />
        <NewThoughtModal />
        <ThoughtDetailModal />
        <CallModal />
        <ContactViolationAlert />
      </div>
    );
  };

  return (
    <>
      {isPageLoading && (
        <Loader
          key={transitionKey}
          duration={460}
          reducedMotion={reducedMotion}
          onComplete={() => setIsPageLoading(false)}
        />
      )}
      {renderShell()}
    </>
  );
}

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
