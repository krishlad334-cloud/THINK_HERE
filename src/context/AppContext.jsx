import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  INITIAL_USERS,
  MOCK_CONSULTANTS,
  INITIAL_THOUGHTS,
  INITIAL_MESSAGES,
  INITIAL_JOBS,
  INITIAL_NOTIFICATIONS,
  INITIAL_AUDIT_LOGS
} from '../data/mockSeedData';
import { analyzeThought, generateAISolution } from '../utils/aiEngine';
import { inspectMessageForPrivacy } from '../utils/contactPrivacy';

const AppContext = createContext(null);

const STORAGE_KEY_PREFIX = 'think_platform_';

function loadFromStorage(key, fallback) {
  try {
    const item = localStorage.getItem(STORAGE_KEY_PREFIX + key);
    return item ? JSON.parse(item) : fallback;
  } catch (e) {
    console.warn('Storage read failed for', key, e);
    return fallback;
  }
}

function saveToStorage(key, value) {
  try {
    localStorage.setItem(STORAGE_KEY_PREFIX + key, JSON.stringify(value));
  } catch (e) {
    console.warn('Storage write failed for', key, e);
  }
}

export function AppProvider({ children }) {
  // Active role: 'client' or 'consultant' (Unified Admin & Consultant)
  const [role, setRole] = useState(() => loadFromStorage('active_role', 'client'));

  // Profiles
  const [clientUser, setClientUser] = useState(() => loadFromStorage('client_user', INITIAL_USERS.client));
  
  // Unified Consultant / Admin User
  const [consultantUser, setConsultantUser] = useState(() => {
    const stored = loadFromStorage('consultant_user', INITIAL_USERS.consultant);
    return {
      ...stored,
      isAdmin: true,
      permissions: ['all_access', 'verify_consultants', 'moderate_thoughts', 'audit_privacy', 'trigger_ai_fallback']
    };
  });

  // Core entities
  const [thoughts, setThoughts] = useState(() => loadFromStorage('thoughts', INITIAL_THOUGHTS));
  const [messages, setMessages] = useState(() => {
    const stored = loadFromStorage('messages', INITIAL_MESSAGES);
    if (!stored || stored.length < INITIAL_MESSAGES.length) {
      return INITIAL_MESSAGES;
    }
    return stored;
  });
  const [consultants, setConsultants] = useState(() => loadFromStorage('consultants', MOCK_CONSULTANTS));
  const [jobs, setJobs] = useState(() => loadFromStorage('jobs', INITIAL_JOBS));
  const [notifications, setNotifications] = useState(() => loadFromStorage('notifications', INITIAL_NOTIFICATIONS));
  const [auditLogs, setAuditLogs] = useState(() => loadFromStorage('audit_logs', INITIAL_AUDIT_LOGS));

  // Navigation & UI States
  const [isAuthenticated, setIsAuthenticated] = useState(() => loadFromStorage('is_authenticated', true));
  const [activeTab, setActiveTab] = useState('chat'); // 'chat' is default ChatGPT workspace
  const [activeChatThoughtId, setActiveChatThoughtId] = useState(null); // null means empty "New Chat"
  const [selectedThoughtId, setSelectedThoughtId] = useState(null);
  const [isNewThoughtModalOpen, setIsNewThoughtModalOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState('login');
  const [privacyAlert, setPrivacyAlert] = useState(null);

  // Interactive Audio/Video Consultation Call modal
  const [activeCall, setActiveCall] = useState(null);

  // Muted consultation chat rooms
  const [mutedThoughtIds, setMutedThoughtIds] = useState(() => loadFromStorage('muted_thoughts', []));
  useEffect(() => { saveToStorage('muted_thoughts', mutedThoughtIds); }, [mutedThoughtIds]);

  // Sync to storage
  useEffect(() => { saveToStorage('is_authenticated', isAuthenticated); }, [isAuthenticated]);
  useEffect(() => { saveToStorage('active_role', role); }, [role]);
  useEffect(() => { saveToStorage('client_user', clientUser); }, [clientUser]);
  useEffect(() => { saveToStorage('consultant_user', consultantUser); }, [consultantUser]);
  useEffect(() => { saveToStorage('thoughts', thoughts); }, [thoughts]);
  useEffect(() => { saveToStorage('messages', messages); }, [messages]);
  useEffect(() => { saveToStorage('consultants', consultants); }, [consultants]);
  useEffect(() => { saveToStorage('jobs', jobs); }, [jobs]);
  useEffect(() => { saveToStorage('notifications', notifications); }, [notifications]);
  useEffect(() => { saveToStorage('audit_logs', auditLogs); }, [auditLogs]);

  // Derived current user based on active role
  const currentUser = role === 'consultant' ? consultantUser : clientUser;

  // Switch between panels
  const switchRole = (newRole) => {
    setRole(newRole);
    if (newRole === 'consultant') {
      setActiveTab('browse_thoughts');
    } else {
      setActiveTab('chat');
    }
  };

  // Dedicated Authentication methods
  const loginUser = (targetRole = 'client', customUser = null) => {
    if (customUser) {
      if (targetRole === 'client') {
        setClientUser(prev => ({ ...prev, ...customUser }));
      } else {
        setConsultantUser(prev => ({ ...prev, ...customUser }));
      }
    }
    setRole(targetRole);
    if (targetRole === 'consultant') {
      setActiveTab('browse_thoughts');
    } else {
      setActiveTab('chat');
    }
    setIsAuthenticated(true);
  };

  const logoutUser = () => {
    setIsAuthenticated(false);
    setAuthMode('login');
  };

  const openAuthPage = (mode = 'login') => {
    setAuthMode(mode);
    setIsAuthenticated(false);
  };

  // Start a fresh new ChatGPT session
  const startNewChat = () => {
    setActiveChatThoughtId(null);
    setActiveTab('chat');
  };

  // Select an existing thought to open in real 1-on-1 consultation chat room
  const openChatWithThought = (thoughtId) => {
    setActiveChatThoughtId(thoughtId);
    setSelectedThoughtId(thoughtId);
    setActiveTab('messages');
  };

  // Add system audit log
  const addAuditLog = (type, details, severity = 'info', actor = currentUser.name) => {
    const newLog = {
      id: 'log-' + Date.now(),
      type,
      actor,
      details,
      severity,
      timestamp: new Date().toISOString()
    };
    setAuditLogs(prev => [newLog, ...prev]);
  };

  // Submit a new Thought (Client side) - also automatically generates AI diagnosis in chat!
  const submitThought = ({ title, description, attachments = [], urgency = 'Standard' }) => {
    const aiAnalysis = analyzeThought(title, description, attachments);

    const newThought = {
      id: 'thought-' + Date.now(),
      clientId: clientUser.id,
      clientName: clientUser.name,
      clientAvatar: clientUser.avatar,
      title,
      description,
      category: aiAnalysis.category,
      urgency: urgency || aiAnalysis.urgency,
      createdAt: new Date().toISOString(),
      deadlineHours: 24,
      status: 'pending_human',
      assignedConsultantId: null,
      assignedConsultantName: null,
      assignedConsultantAvatar: null,
      attachments,
      tags: aiAnalysis.tags,
      aiAnalysis,
      solutions: [],
      isSaved: false
    };

    // Generate immediate initial AI roadmap for the chat experience!
    const immediateAISol = generateAISolution(newThought);
    newThought.solutions = [immediateAISol];

    setThoughts(prev => [newThought, ...prev]);
    setActiveChatThoughtId(newThought.id);

    // Send notification to consultants
    const notif = {
      id: 'notif-' + Date.now(),
      recipientRole: 'consultant',
      title: 'New Client Thought Submitted',
      message: `"${title.slice(0, 50)}..." matches your domain (${aiAnalysis.category}).`,
      type: 'thought_matched',
      linkThoughtId: newThought.id,
      createdAt: new Date().toISOString(),
      isRead: false
    };
    setNotifications(prev => [notif, ...prev]);

    // Initial message in chat
    const initialMsg = {
      id: 'msg-' + Date.now(),
      thoughtId: newThought.id,
      senderId: clientUser.id,
      senderName: clientUser.name,
      senderRole: 'client',
      senderAvatar: clientUser.avatar,
      text: description ? `${title}\n\n${description}` : title,
      timestamp: new Date().toISOString(),
      attachments
    };
    setMessages(prev => [...prev, initialMsg]);

    addAuditLog('NEW_THOUGHT_SUBMISSION', `Client ${clientUser.name} submitted: "${title.slice(0, 45)}..."`, 'info');

    return newThought;
  };

  // Claim/Take Ownership of a Thought (Consultant side)
  const claimThought = (thoughtId) => {
    const target = thoughts.find(t => t.id === thoughtId);
    if (!target) return;

    if (target.assignedConsultantId && target.assignedConsultantId !== consultantUser.id) {
      alert(`This thought is already being handled by ${target.assignedConsultantName}. Multiple consultants cannot claim the same thought.`);
      return;
    }

    setThoughts(prev => prev.map(t => {
      if (t.id === thoughtId) {
        return {
          ...t,
          status: 'in_consultation',
          assignedConsultantId: consultantUser.id,
          assignedConsultantName: consultantUser.name,
          assignedConsultantAvatar: consultantUser.avatar
        };
      }
      return t;
    }));

    // Notify client
    const notif = {
      id: 'notif-' + Date.now(),
      recipientRole: 'client',
      title: 'Consultant Accepted Your Thought',
      message: `${consultantUser.name} accepted your thought "${target.title.slice(0, 40)}..." and is preparing a solution.`,
      type: 'consultant_accepted',
      linkThoughtId: thoughtId,
      createdAt: new Date().toISOString(),
      isRead: false
    };
    setNotifications(prev => [notif, ...prev]);

    addAuditLog('CONSULTANT_CLAIMED', `${consultantUser.name} took ownership of Thought #${thoughtId}`, 'info');
  };

  // Submit Human Consultant Solution
  const submitSolution = (thoughtId, { executiveSummary, actionPlan, recommendedTools, nextStepsPrompt }) => {
    const solution = {
      id: 'sol-h-' + Date.now(),
      isAIGenerated: false,
      author: {
        id: consultantUser.id,
        name: consultantUser.name,
        role: consultantUser.title,
        avatar: consultantUser.avatar,
        badge: 'Verified Consultant'
      },
      createdAt: new Date().toISOString(),
      executiveSummary,
      actionPlan: actionPlan || [],
      recommendedTools: recommendedTools || [],
      nextStepsPrompt: nextStepsPrompt || 'Let us continue the conversation in the consultation chat room.'
    };

    setThoughts(prev => prev.map(t => {
      if (t.id === thoughtId) {
        return {
          ...t,
          status: 'in_consultation',
          solutions: [solution, ...(t.solutions || [])]
        };
      }
      return t;
    }));

    // Add chat message from consultant
    const chatMsg = {
      id: 'msg-' + Date.now(),
      thoughtId,
      senderId: consultantUser.id,
      senderName: consultantUser.name,
      senderRole: 'consultant',
      senderAvatar: consultantUser.avatar,
      text: `Hello! I have reviewed your submission and provided a comprehensive diagnostic solution:\n\n${executiveSummary}`,
      timestamp: new Date().toISOString(),
      attachments: []
    };
    setMessages(prev => [...prev, chatMsg]);

    // Client notification
    const notif = {
      id: 'notif-' + Date.now(),
      recipientRole: 'client',
      title: 'Personalized Human Solution Delivered!',
      message: `${consultantUser.name} provided a structured consultation roadmap for your thought.`,
      type: 'solution_received',
      linkThoughtId: thoughtId,
      createdAt: new Date().toISOString(),
      isRead: false
    };
    setNotifications(prev => [notif, ...prev]);

    addAuditLog('SOLUTION_SUBMITTED', `Consultant ${consultantUser.name} delivered human solution for Thought #${thoughtId}`, 'success');
  };

  // Trigger 24-Hour AI Fallback Solution
  const triggerAIFallback = (thoughtId) => {
    const target = thoughts.find(t => t.id === thoughtId);
    if (!target) return;

    if (target.solutions?.some(s => s.isAIGenerated)) {
      return;
    }

    const aiSolution = generateAISolution(target);

    setThoughts(prev => prev.map(t => {
      if (t.id === thoughtId) {
        return {
          ...t,
          status: 'ai_fallback',
          solutions: [...(t.solutions || []), aiSolution]
        };
      }
      return t;
    }));

    const notif = {
      id: 'notif-' + Date.now(),
      recipientRole: 'client',
      title: '24-Hour AI Fallback Solution Generated',
      message: `THINK AI has generated an instant comprehensive blueprint for "${target.title.slice(0, 40)}...".`,
      type: 'ai_fallback',
      linkThoughtId: thoughtId,
      createdAt: new Date().toISOString(),
      isRead: false
    };
    setNotifications(prev => [notif, ...prev]);

    addAuditLog('AI_FALLBACK_TRIGGERED', `24h Fallback Guarantee activated for Thought #${thoughtId}`, 'warning', 'THINK AI Engine');
  };

  // Send Chat Message with Safety/Privacy Guard
  const sendMessage = (thoughtId, text, attachments = []) => {
    const inspection = inspectMessageForPrivacy(text);

    if (inspection.isViolation) {
      setPrivacyAlert({
        message: inspection.warningMessage,
        violations: inspection.violations
      });

      addAuditLog('PRIVACY_VIOLATION_ATTEMPT', `Masked external contact attempt in Thought #${thoughtId} by ${currentUser.name}: ${inspection.violations.join(', ')}`, 'warning');
    }

    const newMessage = {
      id: 'msg-' + Date.now(),
      thoughtId,
      senderId: currentUser.id,
      senderName: currentUser.name,
      senderRole: role,
      senderAvatar: currentUser.avatar,
      text: inspection.cleanText,
      timestamp: new Date().toISOString(),
      attachments,
      wasMasked: inspection.isViolation
    };

    setMessages(prev => [...prev, newMessage]);

    // If client is chatting in AI mode (no assigned human consultant yet), simulate an instant AI conversational reply!
    const targetThought = thoughts.find(t => t.id === thoughtId);
    if (role === 'client' && (!targetThought?.assignedConsultantId || targetThought?.status === 'ai_fallback')) {
      setTimeout(() => {
        const aiReply = {
          id: 'msg-ai-' + Date.now(),
          thoughtId,
          senderId: 'ai-engine',
          senderName: 'THINK AI Assistant',
          senderRole: 'ai',
          senderAvatar: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=150&auto=format&fit=crop&q=80',
          text: `I analyzed your query: "${inspection.cleanText.slice(0, 80)}...". Based on this context, I recommend focusing on your core bottleneck first. Would you like me to connect you with an expert consultant in ${targetThought?.category || 'this domain'} to review your code or strategy 1-on-1?`,
          timestamp: new Date().toISOString(),
          attachments: []
        };
        setMessages(m => [...m, aiReply]);
      }, 700);
    }

    return newMessage;
  };

  // Delete an individual chat message
  const deleteMessage = (messageId) => {
    setMessages(prev => prev.filter(m => m.id !== messageId));
  };

  // Clear all messages for a specific consultation / thought room
  const clearChat = (thoughtId) => {
    setMessages(prev => prev.filter(m => m.thoughtId !== thoughtId));
  };

  // Toggle mute notifications for a thought consultation room
  const toggleMuteChat = (thoughtId) => {
    setMutedThoughtIds(prev =>
      prev.includes(thoughtId) ? prev.filter(id => id !== thoughtId) : [...prev, thoughtId]
    );
  };

  // Save / Bookmark Thought or Solution
  const toggleSaveThought = (thoughtId) => {
    setThoughts(prev => prev.map(t => {
      if (t.id === thoughtId) {
        return { ...t, isSaved: !t.isSaved };
      }
      return t;
    }));
  };

  // Save Job
  const toggleSaveJob = (jobId) => {
    setJobs(prev => prev.map(j => {
      if (j.id === jobId) {
        return { ...j, isSaved: !j.isSaved };
      }
      return j;
    }));
  };

  // Apply to Job
  const applyJob = (jobId) => {
    setJobs(prev => prev.map(j => {
      if (j.id === jobId) {
        return { ...j, isApplied: true, applicantsCount: (j.applicantsCount || 0) + 1 };
      }
      return j;
    }));
    addAuditLog('JOB_APPLICATION', `${clientUser.name} applied to job position #${jobId}`, 'info');
  };

  // Consultant Verification
  const setConsultantVerification = (consultantId, status) => {
    setConsultants(prev => prev.map(c => {
      if (c.id === consultantId) {
        return { ...c, verificationStatus: status, isVerified: status === 'approved' };
      }
      return c;
    }));
    addAuditLog('VERIFICATION_CHANGE', `Admin changed verification of consultant #${consultantId} to ${status}`, 'info');
  };

  // Update Consultant Profile
  const updateConsultantProfile = (fields) => {
    setConsultantUser(prev => ({ ...prev, ...fields }));
    setConsultants(prev => prev.map(c => c.id === consultantUser.id ? { ...c, ...fields } : c));
    addAuditLog('PROFILE_UPDATED', `Consultant ${consultantUser.name} updated profile details.`, 'info');
  };

  // Notifications
  const markNotificationRead = (id) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
  };

  const markAllNotificationsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
  };

  // Start & End Calls
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

  const value = {
    role,
    switchRole,
    currentUser,
    clientUser,
    setClientUser,
    consultantUser,
    setConsultantUser,
    thoughts,
    submitThought,
    claimThought,
    submitSolution,
    triggerAIFallback,
    toggleSaveThought,
    messages,
    sendMessage,
    deleteMessage,
    clearChat,
    toggleMuteChat,
    mutedThoughtIds,
    consultants,
    setConsultantVerification,
    updateConsultantProfile,
    jobs,
    toggleSaveJob,
    applyJob,
    notifications,
    markNotificationRead,
    markAllNotificationsRead,
    auditLogs,
    addAuditLog,
    activeTab,
    setActiveTab,
    activeChatThoughtId,
    setActiveChatThoughtId,
    startNewChat,
    openChatWithThought,
    selectedThoughtId,
    setSelectedThoughtId,
    isNewThoughtModalOpen,
    setIsNewThoughtModalOpen,
    isAuthModalOpen,
    setIsAuthModalOpen,
    authMode,
    setAuthMode,
    privacyAlert,
    setPrivacyAlert,
    activeCall,
    startCall,
    endCall,
    isAuthenticated,
    setIsAuthenticated,
    loginUser,
    logoutUser,
    openAuthPage,
    INITIAL_USERS
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
