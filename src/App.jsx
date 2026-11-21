import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import Navbar from './components/common/Navbar';
import Sidebar from './components/common/Sidebar';
import NewThoughtModal from './components/client/NewThoughtModal';
import ThoughtDetailModal from './components/client/ThoughtDetailModal';
import CallModal from './components/common/CallModal';
import ContactViolationAlert from './components/common/ContactViolationAlert';
import ToastContainer from './components/common/ToastContainer';
import AuthPage from './components/auth/AuthPage';

// Client Views
import ClientChatView from './components/client/ClientChatView';
import MyThoughtsView from './components/client/MyThoughtsView';
import SavedSolutionsView from './components/client/SavedSolutionsView';
import ClientJobHub from './components/client/ClientJobHub';
import ClientFindConsultants from './components/client/ClientFindConsultants';
import ClientSettings from './components/client/ClientSettings';

// Consultant Views
import BrowseClientThoughts from './components/consultant/BrowseClientThoughts';
import MyConsultations from './components/consultant/MyConsultations';
import ConsultantProfileView from './components/consultant/ConsultantProfileView';
import ConsultantAnalytics from './components/consultant/ConsultantAnalytics';

// Shared Chat & Consultation Room
import ChatWorkspace from './components/chat/ChatWorkspace';

function AppContent() {
  const { role, activeTab, isAuthenticated, toast, closeToast } = useApp();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // If user is not authenticated (or clicked login / logout / switch account), render dedicated AuthPage with zero background chat
  if (!isAuthenticated) {
    return <AuthPage />;
  }

  // Router dispatcher
  const renderCurrentView = () => {
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

    // Consultant Panel
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
        case 'settings':
          return <ClientSettings />;
        default:
          return <BrowseClientThoughts />;
      }
    }

    return <ClientChatView />;
  };

  // Full-bleed responsive layout for dedicated 1-on-1 chat room
  const isEdgeToEdge = activeTab === 'messages';

  return (
    <div className="h-screen h-[100dvh] w-full bg-[#f8fafc] flex flex-col font-sans text-slate-900 antialiased overflow-hidden">
      {/* Top Header - 100% full viewport width */}
      <Navbar onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />

      {/* Main Container - 100% full width, edge-to-edge */}
      <div className="flex-1 flex w-full h-[calc(100vh-4rem)] h-[calc(100dvh-4rem)] overflow-hidden relative">
        {/* Left Sidebar - Fixed drawer on mobile, flush left on desktop */}
        <Sidebar
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
        />

        {/* Viewport Content Area - Fills 100% remaining width */}
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

      {/* Global Interactive Overlays */}
      <ToastContainer toast={toast} onClose={closeToast} />
      <NewThoughtModal />
      <ThoughtDetailModal />
      <CallModal />
      <ContactViolationAlert />
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
