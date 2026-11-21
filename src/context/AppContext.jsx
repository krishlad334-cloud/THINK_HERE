import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  initializeThinkStorage,
  getUsers,
  getActiveUser,
  setActiveUser as setStorageActiveUser,
  getThinks,
  saveThink as storageSaveThink,
  updateThink as storageUpdateThink,
  acceptThink as storageAcceptThink,
  getConversations,
  sendMessage as storageSendMessage,
  markMessagesAsRead as storageMarkMessagesRead,
  getNotifications,
  markNotificationRead as storageMarkNotifRead,
  markAllNotificationsRead as storageMarkAllNotifsRead,
  resetDemoData as storageResetDemoData,
  updateUser as storageUpdateUser,
  getUserById,
  DEMO_USERS
} from '../utils/thinkStorage';
import {
  MOCK_CONSULTANTS,
  INITIAL_JOBS,
  INITIAL_AUDIT_LOGS
} from '../data/mockSeedData';
import { analyzeThought, generateAISolution } from '../utils/aiEngine';
import { inspectMessageForPrivacy } from '../utils/contactPrivacy';

const AppContext = createContext(null);

export function AppProvider({ children }) {
  // 1. Initialize LocalStorage on initial load
  useEffect(() => {
    initializeThinkStorage();
  }, []);

  // 2. Core Reactive State from LocalStorage
  const [activeUser, setActiveUserState] = useState(() => {
    initializeThinkStorage();
    return getActiveUser();
  });

  const [users, setUsersState] = useState(() => {
    initializeThinkStorage();
    return getUsers();
  });

  const [thinks, setThinksState] = useState(() => {
    initializeThinkStorage();
    return getThinks();
  });

  const [conversations, setConversationsState] = useState(() => {
    initializeThinkStorage();
    return getConversations();
  });

  const [notifications, setNotificationsState] = useState(() => {
    initializeThinkStorage();
    const user = getActiveUser();
    return getNotifications(user?.id, user?.role);
  });

  // UI Toast state
  const [toast, setToast] = useState(null);
  const showToast = useCallback((title, message, type = 'success') => {
    setToast({ title, message, type, id: Date.now() });
    setTimeout(() => {
      setToast(prev => (prev?.id ? null : prev));
    }, 4000);
  }, []);

  const closeToast = useCallback(() => {
    setToast(null);
  }, []);

  // Navigation & UI States
  const role = activeUser.role; // 'client' or 'consultant'
  const [activeTab, setActiveTab] = useState(role === 'consultant' ? 'browse_thoughts' : 'chat');
  const [activeChatThoughtId, setActiveChatThoughtId] = useState(null);
  const [selectedThoughtId, setSelectedThoughtId] = useState(null);
  const [activeConversationId, setActiveConversationId] = useState(null);
  const [isNewThoughtModalOpen, setIsNewThoughtModalOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(true);
  const [authMode, setAuthMode] = useState('login');
  const [privacyAlert, setPrivacyAlert] = useState(null);
  const [activeCall, setActiveCall] = useState(null);
  const [mutedThoughtIds, setMutedThoughtIds] = useState([]);

  // Mock companion states for secondary views
  const [consultants, setConsultants] = useState(MOCK_CONSULTANTS);
  const [jobs, setJobs] = useState(INITIAL_JOBS);
  const [auditLogs, setAuditLogs] = useState(INITIAL_AUDIT_LOGS);

  // Synchronize state when storage changes (Cross-Tab via 'storage', Same-Tab via 'think_storage_updated')
  const reloadFromStorage = useCallback(() => {
    const currentActiveUser = getActiveUser();
    setActiveUserState(currentActiveUser);
    setUsersState(getUsers());
    setThinksState(getThinks());
    setConversationsState(getConversations());
    setNotificationsState(getNotifications(currentActiveUser?.id, currentActiveUser?.role));
  }, []);

  useEffect(() => {
    const handleStorageEvent = (e) => {
      if (!e.key || e.key.startsWith('think_')) {
        reloadFromStorage();
      }
    };

    const handleCustomUpdate = () => {
      reloadFromStorage();
    };

    window.addEventListener('storage', handleStorageEvent);
    window.addEventListener('think_storage_updated', handleCustomUpdate);

    return () => {
      window.removeEventListener('storage', handleStorageEvent);
      window.removeEventListener('think_storage_updated', handleCustomUpdate);
    };
  }, [reloadFromStorage]);

  // Keep notifications fresh when active user changes
  useEffect(() => {
    setNotificationsState(getNotifications(activeUser?.id, activeUser?.role));
  }, [activeUser]);

  // -------------------------------------------------------------
  // DEMO USER SWITCHING (Client, Consultant 1, Consultant 2)
  // -------------------------------------------------------------
  const switchDemoUser = (userId) => {
    const targetUser = DEMO_USERS.find(u => u.id === userId);
    if (!targetUser) return;

    setStorageActiveUser(userId);
    setActiveUserState(targetUser);

    if (targetUser.role === 'consultant') {
      setActiveTab('browse_thoughts');
    } else {
      setActiveTab('chat');
    }

    setNotificationsState(getNotifications(targetUser.id, targetUser.role));
    showToast('Switched User', `Active as ${targetUser.label} (${targetUser.name})`, 'info');
  };

  // Backwards compatibility for role switch button
  const switchRole = (newRole) => {
    if (newRole === 'client') {
      switchDemoUser('client_001');
    } else {
      // Default to Consultant 1
      switchDemoUser('consultant_001');
    }
  };

  // -------------------------------------------------------------
  // 1. CLIENT PANEL: SUBMIT THINK
  // -------------------------------------------------------------
  const submitThink = ({ title, description = '', category = 'General Consultation', attachments = [], urgency = 'Standard' }) => {
    if (!title || !title.trim()) {
      showToast('Validation Error', 'Please enter a title for your Think.', 'error');
      return null;
    }

    const aiAnalysis = analyzeThought(title, description, attachments);
    const assignedCategory = category || aiAnalysis.category || 'General Consultation';

    const newThink = storageSaveThink({
      clientId: activeUser.id,
      clientName: activeUser.name,
      clientAvatar: activeUser.profileImage || activeUser.avatar,
      title: title.trim(),
      description: description.trim(),
      category: assignedCategory,
      urgency,
      tags: aiAnalysis.tags || [assignedCategory],
      attachments
    });

    reloadFromStorage();
    setActiveChatThoughtId(newThink.id);
    setSelectedThoughtId(newThink.id);

    showToast('Think Submitted!', `"${newThink.title.slice(0, 40)}..." is now live for consultants to review. Status: Pending`, 'success');

    return newThink;
  };

  // Legacy alias
  const submitThought = (params) => submitThink(params);

  // -------------------------------------------------------------
  // 2. CONSULTANT PANEL: ACCEPT THINK
  // -------------------------------------------------------------
  const acceptThink = (thinkId) => {
    try {
      const { think, conversation, alreadyAccepted } = storageAcceptThink(thinkId, activeUser);

      reloadFromStorage();

      if (alreadyAccepted) {
        showToast('Already Accepted', 'You have already accepted this Think. Opening conversation...', 'info');
      } else {
        showToast('Think Accepted!', `Assigned to ${activeUser.name}. Shared conversation created.`, 'success');
      }

      // Navigate to chat
      if (conversation) {
        setActiveConversationId(conversation.id);
        setSelectedThoughtId(think.id);
        setActiveChatThoughtId(think.id);
        setActiveTab('messages');
      }

      return { think, conversation };
    } catch (err) {
      showToast('Acceptance Failed', err.message || 'Could not accept Think.', 'error');
      return null;
    }
  };

  // Legacy alias
  const claimThought = (thoughtId) => acceptThink(thoughtId);

  // -------------------------------------------------------------
  // 3 & 4. THINK STATUS MANAGEMENT
  // (Pending, Accepted, In Progress, Resolved, Closed)
  // -------------------------------------------------------------
  const updateThinkStatus = (thinkId, newStatus) => {
    const updated = storageUpdateThink(thinkId, { status: newStatus });
    reloadFromStorage();

    const formattedStatus = newStatus.replace('_', ' ').toUpperCase();
    showToast('Status Updated', `Think status changed to ${formattedStatus}`, 'success');

    return updated;
  };

  // -------------------------------------------------------------
  // SHARED CHAT & MESSAGING
  // -------------------------------------------------------------
  const sendChatMessage = (targetId, text, attachments = []) => {
    if (!text && (!attachments || attachments.length === 0)) return null;

    // targetId can be a conversationId or thoughtId
    let conv = conversations.find(c => c.id === targetId || c.thinkId === targetId);

    if (!conv) {
      // If no conversation exists yet for this thought (e.g. client is typing in thought workspace before human acceptance)
      const think = thinks.find(t => t.id === targetId);
      if (think && think.status === 'pending') {
        // AI / initial diagnostic simulation
        const msg = {
          id: `msg_${Date.now()}`,
          conversationId: null,
          thoughtId: targetId,
          senderId: activeUser.id,
          senderName: activeUser.name,
          senderAvatar: activeUser.profileImage || activeUser.avatar,
          senderRole: activeUser.role,
          text: text.trim(),
          attachments,
          createdAt: new Date().toISOString(),
          isRead: true
        };
        reloadFromStorage();
        return msg;
      }
    }

    if (conv) {
      const msg = storageSendMessage(conv.id, activeUser, text, attachments);
      reloadFromStorage();
      return msg;
    }

    return null;
  };

  // Legacy alias
  const sendMessage = (targetId, text, attachments = []) => sendChatMessage(targetId, text, attachments);

  const markConversationRead = (conversationId) => {
    storageMarkMessagesRead(conversationId, activeUser.id);
    reloadFromStorage();
  };

  // -------------------------------------------------------------
  // NOTIFICATIONS
  // -------------------------------------------------------------
  const markNotificationRead = (notifId) => {
    storageMarkNotifRead(notifId);
    reloadFromStorage();
  };

  const markAllNotificationsRead = () => {
    storageMarkAllNotifsRead(activeUser.id, activeUser.role);
    reloadFromStorage();
  };

  // -------------------------------------------------------------
  // RESET DEMO DATA
  // -------------------------------------------------------------
  const resetAllData = () => {
    storageResetDemoData();
    reloadFromStorage();
    showToast('Demo Data Reset', 'Platform restored to initial sample state.', 'info');
  };

  // Legacy helpers & compatibility
  const clientUser = users.find(u => u.id === 'client_001') || activeUser;
  const consultantUser = (activeUser.role === 'consultant' ? activeUser : users.find(u => u.id === 'consultant_001')) || activeUser;
  const currentUser = activeUser;

  const updateConsultantProfile = (updates) => {
    const targetId = (activeUser.role === 'consultant' ? activeUser.id : consultantUser.id) || 'consultant_001';
    const updated = storageUpdateUser(targetId, updates);
    if (activeUser.id === targetId) {
      setActiveUserState(prev => ({ ...prev, ...updates }));
    }
    reloadFromStorage();
    showToast('Profile Updated', 'Profile changes have been saved successfully.', 'success');
    return updated;
  };

  const setClientUser = (updaterOrObj) => {
    const targetId = 'client_001';
    const current = getUserById(targetId) || clientUser;
    const nextVal = typeof updaterOrObj === 'function' ? updaterOrObj(current) : { ...current, ...updaterOrObj };
    storageUpdateUser(targetId, nextVal);
    if (activeUser.id === targetId) {
      setActiveUserState(prev => ({ ...prev, ...nextVal }));
    }
    reloadFromStorage();
    showToast('Settings Saved', 'Account settings saved successfully.', 'success');
  };

  const updateUserProfile = (userId, updates) => {
    const updated = storageUpdateUser(userId, updates);
    if (activeUser.id === userId) {
      setActiveUserState(prev => ({ ...prev, ...updates }));
    }
    reloadFromStorage();
    showToast('Profile Saved', 'Profile details have been updated.', 'success');
    return updated;
  };

  // Derive flat messages list for legacy components
  const allMessages = conversations.flatMap(c => c.messages || []);

  const openChatWithThought = (thoughtId) => {
    setActiveChatThoughtId(thoughtId);
    setSelectedThoughtId(thoughtId);
    const conv = conversations.find(c => c.thinkId === thoughtId);
    if (conv) {
      setActiveConversationId(conv.id);
    }
    setActiveTab('messages');
  };

  const startNewChat = () => {
    setActiveChatThoughtId(null);
    setSelectedThoughtId(null);
    setActiveConversationId(null);
    setActiveTab('chat');
    setIsNewThoughtModalOpen(false);
  };

  const toggleSaveThought = (thoughtId) => {
    const target = thinks.find(t => t.id === thoughtId);
    if (!target) return;
    storageUpdateThink(thoughtId, { isSaved: !target.isSaved });
    reloadFromStorage();
  };

  const startCall = ({ thoughtId, participantName, participantAvatar, callType = 'video' }) => {
    setActiveCall({
      thoughtId,
      participantName,
      participantAvatar,
      callType,
      startTime: Date.now()
    });
  };

  const endCall = () => {
    setActiveCall(null);
  };

  const logoutUser = () => {
    // Reset to demo client
    switchDemoUser('client_001');
    showToast('Logged Out', 'Returned to Client Workspace', 'info');
  };

  const value = {
    // Core state
    activeUser,
    currentUser,
    clientUser,
    consultantUser,
    demoUsers: DEMO_USERS,
    role,
    switchDemoUser,
    switchRole,

    // Entities
    thinks,
    thoughts: thinks, // alias for backwards compatibility
    conversations,
    messages: allMessages,
    notifications,

    // Actions
    submitThink,
    submitThought,
    acceptThink,
    claimThought,
    updateThinkStatus,
    sendChatMessage,
    sendMessage,
    markConversationRead,
    markNotificationRead,
    markAllNotificationsRead,
    resetAllData,
    updateConsultantProfile,
    setClientUser,
    updateUserProfile,

    // Navigation & UI
    activeTab,
    setActiveTab,
    activeChatThoughtId,
    setActiveChatThoughtId,
    selectedThoughtId,
    setSelectedThoughtId,
    activeConversationId,
    setActiveConversationId,
    isNewThoughtModalOpen,
    setIsNewThoughtModalOpen,
    startNewChat,
    openChatWithThought,
    toggleSaveThought,

    // Toast
    toast,
    showToast,
    closeToast,

    // Call Modal
    activeCall,
    startCall,
    endCall,

    // Compatibility props
    isAuthenticated,
    setIsAuthenticated,
    authMode,
    setAuthMode,
    privacyAlert,
    setPrivacyAlert,
    mutedThoughtIds,
    setMutedThoughtIds,
    consultants,
    jobs,
    auditLogs,
    logoutUser,
    DEMO_USERS
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
