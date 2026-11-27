import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { AppContext } from './useApp';
import { getAuthToken } from '../utils/apiClient';
import {
  checkApiHealth,
  getConsultants as apiGetConsultants,
  getMyThoughts as apiGetMyThoughts,
  getAllThoughts as apiGetAllThoughts,
  getThoughtById as apiGetThoughtById,
  saveThink as apiSaveThink,
  updateThink as apiUpdateThink,
  acceptThink as apiAcceptThink,
  createReply as apiCreateReply,
  getRepliesForThought as apiGetRepliesForThought,
  getConversations as apiGetConversations,
  sendMessage as apiSendMessage,
  deleteMessage as apiDeleteMessage,
  markMessagesAsRead as apiMarkMessagesRead,
  getNotifications as apiGetNotifications,
  markNotificationRead as apiMarkNotifRead,
  markAllNotificationsRead as apiMarkAllNotifsRead,
  subscribeNewsletter as apiSubscribeNewsletter,
  getSavedThoughtIds,
  toggleSavedThoughtId,
  DEMO_USERS,
} from '../utils/thinkStorage';
import {
  getCurrentUser as authGetCurrentUser,
  updateCurrentUserProfile as authUpdateProfile,
  registerUser as authRegisterUser,
  quickRegisterUser as authQuickRegisterUser,
  loginUser as authLoginUser,
  logoutUser as authLogoutUser,
  verifyRegistrationOTP,
  generateOTP,
  resendOTP,
  redirectByRole,
} from '../utils/thinkAuth';
import { normalizeThought } from '../utils/normalizers';
import {
  INITIAL_JOBS,
  INITIAL_AUDIT_LOGS,
} from '../data/mockSeedData';
import { analyzeThought, generateAISolution } from '../utils/aiEngine';
import { inspectMessageForPrivacy } from '../utils/contactPrivacy';

function syncJobsCatalog(currentJobs) {
  const existingById = new Map((currentJobs || []).map((job) => [job.id, job]));
  return INITIAL_JOBS.map((seedJob) => {
    const existing = existingById.get(seedJob.id);
    if (!existing) return seedJob;
    return {
      ...seedJob,
      ...existing,
      industry: existing.industry || seedJob.industry,
      qualifications: existing.qualifications || seedJob.qualifications,
      interests: existing.interests || seedJob.interests,
      minYears: existing.minYears ?? seedJob.minYears,
    };
  });
}

function enrichThoughtsFromConversations(thoughtsList, conversationsList) {
  if (!Array.isArray(thoughtsList) || thoughtsList.length === 0) return thoughtsList || [];
  const convByThinkId = new Map();
  (conversationsList || []).forEach((c) => {
    if (c.thinkId) convByThinkId.set(c.thinkId, c);
  });

  return thoughtsList.map((t) => {
    const conv = convByThinkId.get(t.id);
    if (!conv) return t;
    return {
      ...t,
      assignedConsultantId: t.assignedConsultantId || conv.consultantId || null,
      consultantId: t.consultantId || conv.consultantId || null,
      assignedConsultantName: t.assignedConsultantName || conv.consultantName || null,
      assignedConsultantAvatar: t.assignedConsultantAvatar || conv.consultantAvatar || null,
      clientName: t.clientName || conv.clientName,
      clientAvatar: t.clientAvatar || conv.clientAvatar,
    };
  });
}

export function AppProvider({ children }) {
  const [activeUser, setActiveUserState] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAuthLoading, setIsAuthLoading] = useState(() => Boolean(getAuthToken()));
  const [isDataLoading, setIsDataLoading] = useState(false);
  const [apiHealth, setApiHealth] = useState(null);

  const [thinks, setThinksState] = useState([]);
  const [conversations, setConversationsState] = useState([]);
  const [notifications, setNotificationsState] = useState([]);
  const [consultants, setConsultants] = useState([]);

  const [toast, setToast] = useState(null);
  const toastTimerRef = useRef(null);
  const showToast = useCallback((title, message, type = 'success') => {
    const id = Date.now() + Math.random();
    setToast({ title, message, type, id });
    if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    toastTimerRef.current = setTimeout(() => {
      setToast((prev) => (prev?.id === id ? null : prev));
    }, 4000);
  }, []);

  useEffect(() => {
    return () => {
      if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    };
  }, []);

  const closeToast = useCallback(() => {
    if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    setToast(null);
  }, []);

  const role = activeUser?.role || 'client';
  const [activeTab, setActiveTab] = useState('chat');
  const [activeChatThoughtId, setActiveChatThoughtId] = useState(null);
  const [selectedThoughtId, setSelectedThoughtId] = useState(null);
  const [activeConversationId, setActiveConversationId] = useState(null);
  const [isNewThoughtModalOpen, setIsNewThoughtModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState('login');
  const [privacyAlert, setPrivacyAlert] = useState(null);
  const [activeCall, setActiveCall] = useState(null);
  const [mutedThoughtIds, setMutedThoughtIds] = useState([]);

  const [jobs, setJobs] = useState(INITIAL_JOBS);
  const [auditLogs] = useState(INITIAL_AUDIT_LOGS);

  const activeUserRef = useRef(activeUser);
  const conversationsRef = useRef(conversations);
  const thinksRef = useRef(thinks);
  const consultantsRef = useRef(consultants);

  useEffect(() => {
    activeUserRef.current = activeUser;
    conversationsRef.current = conversations;
    thinksRef.current = thinks;
    consultantsRef.current = consultants;
  }, [activeUser, conversations, thinks, consultants]);

  const getNormalizeOpts = useCallback((user = activeUserRef.current, consList = consultantsRef.current) => {
    const consultantsById = new Map();
    (consList || []).forEach((c) => {
      if (c?.id) consultantsById.set(c.id, c);
    });
    return {
      savedIdsSet: getSavedThoughtIds(user?.id),
      consultantsById,
    };
  }, []);

  const checkHealth = useCallback(async () => {
    try {
      const health = await checkApiHealth();
      setApiHealth(health);
      return health;
    } catch {
      setApiHealth({ status: 'offline', database: 'disconnected' });
      return null;
    }
  }, []);

  const loadConsultants = useCallback(async () => {
    try {
      const list = await apiGetConsultants();
      setConsultants(list);
      return list;
    } catch (err) {
      console.warn('[AppContext] Failed to load consultants:', err.message);
      return consultantsRef.current;
    }
  }, []);

  const loadWorkspaceData = useCallback(
    async (userObj = activeUserRef.current, { silent = false } = {}) => {
      if (!userObj || !getAuthToken()) return;
      if (!silent) setIsDataLoading(true);

      try {
        const isQueueViewer = userObj.role === 'consultant' || userObj.role === 'admin';
        const consList = await loadConsultants();
        const normOpts = getNormalizeOpts(userObj, consList);

        const [thoughtsRes, convsRes, notifsRes] = await Promise.allSettled([
          isQueueViewer
            ? apiGetAllThoughts({ limit: 100 }, normOpts)
            : apiGetMyThoughts({ limit: 100 }, normOpts),
          apiGetConversations(),
          apiGetNotifications(),
        ]);

        const fetchedConvs =
          convsRes.status === 'fulfilled' ? convsRes.value : conversationsRef.current;
        if (convsRes.status === 'fulfilled') {
          setConversationsState(fetchedConvs);
        }

        if (thoughtsRes.status === 'fulfilled') {
          const enriched = enrichThoughtsFromConversations(
            thoughtsRes.value.thoughts || [],
            fetchedConvs
          );
          setThinksState(enriched);
        }

        if (notifsRes.status === 'fulfilled') {
          setNotificationsState(notifsRes.value);
        }
      } catch (err) {
        if (!silent) {
          showToast('Sync Warning', err.message || 'Could not load latest workspace data.', 'error');
        }
      } finally {
        if (!silent) setIsDataLoading(false);
      }
    },
    [getNormalizeOpts, loadConsultants, showToast]
  );

  useEffect(() => {
    let cancelled = false;

    async function bootstrap() {
      checkHealth();
      loadConsultants();

      if (!getAuthToken()) {
        if (!cancelled) setIsAuthLoading(false);
        return;
      }

      const user = await authGetCurrentUser();
      if (cancelled) return;

      if (user) {
        setActiveUserState(user);
        setIsAuthenticated(true);
        setActiveTab(redirectByRole(user.role));
        await loadWorkspaceData(user);
      } else {
        setActiveUserState(null);
        setIsAuthenticated(false);
      }
      if (!cancelled) setIsAuthLoading(false);
    }

    bootstrap();

    return () => {
      cancelled = true;
    };
  }, [checkHealth, loadConsultants, loadWorkspaceData]);

  const logoutUser = useCallback(() => {
    authLogoutUser();
    setIsAuthenticated(false);
    setActiveUserState(null);
    setThinksState([]);
    setConversationsState([]);
    setNotificationsState([]);
    setActiveChatThoughtId(null);
    setActiveConversationId(null);
    setSelectedThoughtId(null);
    setIsNewThoughtModalOpen(false);
    setPrivacyAlert(null);
    setActiveCall(null);
    setActiveTab('chat');
    closeToast();
  }, [closeToast]);

  useEffect(() => {
    const handleUnauthorized = () => {
      logoutUser();
      showToast('Session Expired', 'Please sign in again to continue.', 'warning');
    };
    window.addEventListener('overthink_unauthorized', handleUnauthorized);
    return () => window.removeEventListener('overthink_unauthorized', handleUnauthorized);
  }, [logoutUser, showToast]);

  useEffect(() => {
    if (!isAuthenticated || !activeUser?.id) return undefined;

    const refreshIfVisible = () => {
      if (typeof document !== 'undefined' && document.visibilityState !== 'visible') return;
      loadWorkspaceData(activeUserRef.current, { silent: true });
    };

    const intervalId = setInterval(refreshIfVisible, 15000);
    window.addEventListener('focus', refreshIfVisible);

    return () => {
      clearInterval(intervalId);
      window.removeEventListener('focus', refreshIfVisible);
    };
  }, [isAuthenticated, activeUser?.id, loadWorkspaceData]);

  useEffect(() => {
    if (!isAuthenticated || !activeUser?.id) return undefined;
    if (!['browse_thoughts', 'my_thoughts', 'my_consultations', 'messages', 'find_consultants', 'saved_solutions'].includes(activeTab)) {
      return undefined;
    }
    const timer = setTimeout(() => {
      loadWorkspaceData(activeUserRef.current, { silent: true });
    }, 0);
    return () => clearTimeout(timer);
  }, [activeTab, isAuthenticated, activeUser?.id, loadWorkspaceData]);

  const applyAuthenticatedSession = useCallback(
    async (user, toastTitle, toastMessage) => {
      setActiveUserState(user);
      setIsAuthenticated(true);
      setActiveTab(redirectByRole(user?.role));
      await loadWorkspaceData(user);
      if (toastTitle) {
        showToast(toastTitle, toastMessage, 'success');
      }
    },
    [loadWorkspaceData, showToast]
  );

  const performLogin = useCallback(
    async (identifier, password, options = {}) => {
      const { allowDemoProvision = false } = options;
      let res = await authLoginUser(identifier, password);

      if (!res.success && allowDemoProvision) {
        const demoMatch = DEMO_USERS.find(
          (u) =>
            (u.email?.toLowerCase() === identifier?.trim().toLowerCase() ||
              u.mobile === identifier?.trim().replace(/\D/g, '')) &&
            password === (u.password || 'password123')
        );

        if (demoMatch) {
          const regRes = await authRegisterUser({
            name: demoMatch.name,
            email: demoMatch.email,
            mobile: demoMatch.mobile,
            password: demoMatch.password || 'password123',
            role: demoMatch.role,
            headline: demoMatch.title,
            bio: demoMatch.bio,
            skills: demoMatch.skills,
            services: demoMatch.services,
            avatar: demoMatch.avatar || demoMatch.profileImage,
            hourlyRate: demoMatch.hourlyRate,
            assessmentPassed: demoMatch.assessmentPassed,
            assessmentScore: demoMatch.assessmentScore,
            isVerified: demoMatch.isVerified,
          });
          if (regRes.success) {
            res = regRes;
          }
        }
      }

      if (res.success && res.user) {
        await applyAuthenticatedSession(
          res.user,
          'Welcome Back',
          `Signed in successfully as ${res.user.name}.`
        );
      }
      return res;
    },
    [applyAuthenticatedSession]
  );

  const loginUser = useCallback(
    async (identifierOrRole, passwordOrData, options = {}) => {
      if (typeof passwordOrData === 'string') {
        return performLogin(identifierOrRole, passwordOrData, options);
      }

      const userRole = identifierOrRole || 'client';
      const defaultDemo =
        DEMO_USERS.find((u) => u.role === userRole) || DEMO_USERS[0];
      return performLogin(
        defaultDemo.email,
        defaultDemo.password || 'password123',
        { allowDemoProvision: true }
      );
    },
    [performLogin]
  );

  const register = useCallback(
    async (userData) => {
      const res = await authRegisterUser(userData);
      if (res.success && res.user) {
        await applyAuthenticatedSession(
          res.user,
          'Account Created!',
          `Welcome to OverThink, ${res.user.name}!`
        );
      }
      return res;
    },
    [applyAuthenticatedSession]
  );

  const quickRegister = useCallback(
    async (identifier, password, userRole = 'client') => {
      const res = await authQuickRegisterUser(identifier, password, userRole);
      if (res.success && res.user) {
        await applyAuthenticatedSession(
          res.user,
          'Account Created!',
          `Signed in as ${res.user.name}. Ready to get started.`
        );
      }
      return res;
    },
    [applyAuthenticatedSession]
  );

  const switchDemoUser = useCallback(
    async (userId) => {
      const target = DEMO_USERS.find((u) => u.id === userId);
      if (!target) return null;
      return loginUser(target.email, target.password || 'password123', {
        allowDemoProvision: true,
      });
    },
    [loginUser]
  );

  const switchRole = useCallback(
    async (newRole) => {
      if (newRole === 'client') {
        return switchDemoUser('client_001');
      }
      return switchDemoUser('consultant_001');
    },
    [switchDemoUser]
  );

  const fetchThoughtDetails = useCallback(
    async (thoughtId) => {
      if (!thoughtId) return null;
      try {
        const normOpts = getNormalizeOpts();
        const [thoughtRes, repliesRes] = await Promise.allSettled([
          apiGetThoughtById(thoughtId, normOpts),
          apiGetRepliesForThought(thoughtId),
        ]);

        if (thoughtRes.status !== 'fulfilled' || !thoughtRes.value) {
          return null;
        }

        const fetchedThought = thoughtRes.value;
        const replies =
          repliesRes.status === 'fulfilled' && repliesRes.value?.length > 0
            ? repliesRes.value
            : fetchedThought.replies || [];

        const mergedThought = normalizeThought(
          {
            ...fetchedThought,
            replies,
          },
          normOpts
        );

        setThinksState((prev) => {
          const exists = prev.some((t) => t.id === mergedThought.id);
          if (!exists) return [mergedThought, ...prev];
          return prev.map((t) =>
            t.id === mergedThought.id ? { ...t, ...mergedThought } : t
          );
        });

        return mergedThought;
      } catch (err) {
        console.warn('[AppContext] fetchThoughtDetails failed:', err.message);
        return null;
      }
    },
    [getNormalizeOpts]
  );

  const submitThink = useCallback(
    async ({
      title,
      description = '',
      category = null,
      attachments = [],
      urgency = 'Standard',
      solverType = 'human',
    }) => {
      if (!title || !title.trim()) {
        showToast('Validation Error', 'Please enter a title for your OverThink.', 'error');
        return null;
      }

      const user = activeUserRef.current;
      const aiAnalysis = analyzeThought(title, description, attachments);
      const assignedCategory = category || aiAnalysis.category || 'General Consultation';

      try {
        const normOpts = getNormalizeOpts();
        const newThink = await apiSaveThink(
          {
            name: user?.name,
            email: user?.email,
            title: title.trim(),
            description: (description || title).trim(),
            category: assignedCategory,
            urgency,
            solverType,
            tags: aiAnalysis.tags || [assignedCategory],
            attachments,
          },
          normOpts
        );

        const normalizedWithUser = {
          ...newThink,
          clientId: newThink.clientId || user?.id,
          clientName: newThink.clientName || user?.name,
          clientAvatar: newThink.clientAvatar || user?.profileImage || user?.avatar,
        };

        setThinksState((prev) => [normalizedWithUser, ...prev]);
        setActiveChatThoughtId(normalizedWithUser.id);
        setSelectedThoughtId(normalizedWithUser.id);

        showToast(
          'OverThink Submitted!',
          `"${normalizedWithUser.title.slice(0, 40)}..." is now live for consultants to review. Status: Pending`,
          'success'
        );

        loadWorkspaceData(user, { silent: true });
        return normalizedWithUser;
      } catch (err) {
        showToast('Submission Failed', err.message || 'Could not submit OverThink.', 'error');
        return null;
      }
    },
    [getNormalizeOpts, loadWorkspaceData, showToast]
  );

  const submitThought = useCallback((params) => submitThink(params), [submitThink]);

  const acceptThink = useCallback(
    async (thinkId) => {
      try {
        const user = activeUserRef.current;
        const normOpts = getNormalizeOpts();
        const { think, conversation, alreadyAccepted } = await apiAcceptThink(
          thinkId,
          normOpts
        );

        if (think) {
          const enrichedThink = {
            ...think,
            assignedConsultantId: think.assignedConsultantId || user?.id,
            consultantId: think.consultantId || user?.id,
            assignedConsultantName:
              think.assignedConsultantName || conversation?.consultantName || user?.name,
            assignedConsultantAvatar:
              think.assignedConsultantAvatar ||
              conversation?.consultantAvatar ||
              user?.avatar ||
              user?.profileImage,
          };

          setThinksState((prev) => {
            const exists = prev.some((t) => t.id === enrichedThink.id);
            if (!exists) return [enrichedThink, ...prev];
            return prev.map((t) =>
              t.id === enrichedThink.id ? { ...t, ...enrichedThink } : t
            );
          });
        }

        if (conversation) {
          setConversationsState((prev) => {
            const exists = prev.some((c) => c.id === conversation.id);
            if (!exists) return [conversation, ...prev];
            return prev.map((c) => (c.id === conversation.id ? conversation : c));
          });
          setActiveConversationId(conversation.id);
          setSelectedThoughtId(think?.id || thinkId);
          setActiveChatThoughtId(think?.id || thinkId);
          setActiveTab('messages');
        }

        if (alreadyAccepted) {
          showToast(
            'Already Accepted',
            'You have already accepted this OverThink. Opening conversation...',
            'info'
          );
        } else {
          showToast(
            'OverThink Accepted!',
            `Assigned to ${user?.name || 'Consultant'}. Shared conversation created.`,
            'success'
          );
        }

        loadWorkspaceData(user, { silent: true });
        return { think, conversation };
      } catch (err) {
        showToast('Acceptance Failed', err.message || 'Could not accept OverThink.', 'error');
        return null;
      }
    },
    [getNormalizeOpts, loadWorkspaceData, showToast]
  );

  const claimThought = useCallback((thoughtId) => acceptThink(thoughtId), [acceptThink]);

  const updateThinkStatus = useCallback(
    async (thinkId, newStatus, extra = {}) => {
      try {
        const normOpts = getNormalizeOpts();
        const updated = await apiUpdateThink(
          thinkId,
          { status: newStatus, ...extra },
          normOpts
        );

        setThinksState((prev) =>
          prev.map((t) => {
            if (t.id !== thinkId) return t;
            return {
              ...t,
              ...updated,
              assignedConsultantName:
                updated.assignedConsultantName || t.assignedConsultantName,
              assignedConsultantAvatar:
                updated.assignedConsultantAvatar || t.assignedConsultantAvatar,
              replies: updated.replies?.length ? updated.replies : t.replies,
              solutions: updated.solutions?.length ? updated.solutions : t.solutions,
            };
          })
        );

        setConversationsState((prev) =>
          prev.map((c) =>
            c.thinkId === thinkId ? { ...c, status: newStatus } : c
          )
        );

        const formattedStatus = String(newStatus).replace('_', ' ').toUpperCase();
        showToast('Status Updated', `OverThink status changed to ${formattedStatus}`, 'success');
        return updated;
      } catch (err) {
        showToast('Status Update Failed', err.message || 'Could not update status.', 'error');
        return null;
      }
    },
    [getNormalizeOpts, showToast]
  );

  const submitReply = useCallback(
    async (thoughtId, { message, responderType = 'consultant', actionChecklist = [] }) => {
      try {
        const { reply, thought, emailNotification } = await apiCreateReply({
          thoughtId,
          message,
          responderType,
          actionChecklist,
        });

        setThinksState((prev) =>
          prev.map((t) => {
            if (t.id !== thoughtId) return t;
            const nextReplies = [...(t.replies || []), reply].filter(Boolean);
            const merged = normalizeThought(
              {
                ...t,
                ...(thought || {}),
                replies: nextReplies,
                assignedConsultantName:
                  thought?.assignedConsultantName || t.assignedConsultantName,
                assignedConsultantAvatar:
                  thought?.assignedConsultantAvatar || t.assignedConsultantAvatar,
              },
              getNormalizeOpts()
            );
            return merged;
          })
        );

        setConversationsState((prev) =>
          prev.map((c) =>
            c.thinkId === thoughtId ? { ...c, status: 'answered' } : c
          )
        );

        const emailHint = emailNotification?.sent
          ? ' Client notified via email.'
          : '';
        showToast(
          'Solution Reply Delivered!',
          `Your reply has been published and marked as Answered.${emailHint}`,
          'success'
        );

        loadWorkspaceData(activeUserRef.current, { silent: true });
        return { reply, thought, emailNotification };
      } catch (err) {
        showToast('Reply Failed', err.message || 'Could not submit reply.', 'error');
        return null;
      }
    },
    [getNormalizeOpts, loadWorkspaceData, showToast]
  );

  const submitSolution = useCallback(
    async (thoughtId, solutionData) => {
      const user = activeUserRef.current;
      const summary =
        typeof solutionData === 'string'
          ? solutionData
          : solutionData?.executiveSummary ||
            solutionData?.message ||
            'Solution delivered.';
      const checklist = Array.isArray(solutionData?.actionChecklist)
        ? solutionData.actionChecklist
        : Array.isArray(solutionData?.actionPlan)
          ? solutionData.actionPlan.map((s) =>
              typeof s === 'string' ? s : s.title || s.details
            )
          : [];

      let replyRes = null;
      if (summary && summary.trim().length >= 2) {
        replyRes = await submitReply(thoughtId, {
          message: summary.trim(),
          responderType: user?.role === 'admin' ? 'admin' : 'consultant',
          actionChecklist: checklist,
        });
      }

      const statusRes = await updateThinkStatus(thoughtId, 'resolved', {
        solution: {
          ...(typeof solutionData === 'object' ? solutionData : { executiveSummary: summary }),
          submittedAt: new Date().toISOString(),
          consultantId: user?.id,
          consultantName: user?.name,
        },
      });

      return statusRes || replyRes?.thought || null;
    },
    [submitReply, updateThinkStatus]
  );

  const triggerAIFallback = useCallback(
    async (thoughtId) => {
      const target = (thinksRef.current || []).find((t) => t.id === thoughtId);
      if (!target) return null;

      const aiSol = generateAISolution(target);
      const aiSummary = aiSol.executiveSummary || 'Automated diagnostic analysis complete.';
      const aiPlan = (aiSol.actionPlan || []).map((step) =>
        typeof step === 'string'
          ? step
          : `${step.title}${step.details ? `: ${step.details}` : ''}`
      );

      const updated = await updateThinkStatus(thoughtId, 'ai_fallback', {
        aiResponse: aiSummary,
        aiDiagnosticPlan: aiPlan,
      });

      if (updated) {
        showToast(
          'AI Triage Triggered',
          `Generated automated diagnostic response for #${thoughtId}`,
          'info'
        );
      }
      return updated;
    },
    [showToast, updateThinkStatus]
  );

  const sendChatMessage = useCallback(
    async (targetId, text, attachments = []) => {
      const rawText = (text || '').trim();
      if (!rawText && (!attachments || attachments.length === 0)) return null;

      let finalText = rawText;
      if (rawText) {
        const privacy = inspectMessageForPrivacy(rawText);
        if (privacy.isViolation) {
          finalText = privacy.cleanText;
          setPrivacyAlert({
            message: privacy.warningMessage,
            violations: privacy.violations,
          });
        }
      }

      const conv = (conversationsRef.current || []).find(
        (c) => c.id === targetId || c.thinkId === targetId
      );

      if (!conv) {
        showToast(
          'Awaiting Consultant Acceptance',
          'Direct 1-on-1 chat opens automatically as soon as a consultant accepts your OverThink.',
          'info'
        );
        return null;
      }

      const textToSend =
        finalText ||
        (attachments.length > 0
          ? `Shared attachment: ${attachments.map((a) => a.name).join(', ')}`
          : '');

      try {
        const { message, conversation } = await apiSendMessage(
          conv.id,
          textToSend,
          attachments
        );

        if (conversation) {
          setConversationsState((prev) =>
            prev.map((c) => (c.id === conversation.id ? conversation : c))
          );
        } else if (message) {
          setConversationsState((prev) =>
            prev.map((c) =>
              c.id === conv.id
                ? { ...c, messages: [...(c.messages || []), message] }
                : c
            )
          );
        }

        return message;
      } catch (err) {
        showToast('Message Failed', err.message || 'Could not send message.', 'error');
        return null;
      }
    },
    [showToast]
  );

  const sendMessage = useCallback(
    (targetId, text, attachments = []) => sendChatMessage(targetId, text, attachments),
    [sendChatMessage]
  );

  const deleteMessage = useCallback(
    async (messageId, optionalConvId = null) => {
      const targetConv = optionalConvId
        ? (conversationsRef.current || []).find((c) => c.id === optionalConvId)
        : (conversationsRef.current || []).find((c) =>
            (c.messages || []).some((m) => m.id === messageId)
          );

      if (!targetConv) return;

      try {
        await apiDeleteMessage(targetConv.id, messageId);
        setConversationsState((prev) =>
          prev.map((c) =>
            c.id === targetConv.id
              ? {
                  ...c,
                  messages: (c.messages || []).filter((m) => m.id !== messageId),
                }
              : c
          )
        );
        showToast('Message Deleted', 'Message removed from consultation.', 'info');
      } catch (err) {
        showToast('Delete Failed', err.message || 'Could not delete message.', 'error');
      }
    },
    [showToast]
  );

  const clearChat = useCallback(
    async (targetId) => {
      const user = activeUserRef.current;
      const conv = (conversationsRef.current || []).find(
        (c) => c.id === targetId || c.thinkId === targetId
      );
      if (!conv) return;

      const deletable = (conv.messages || []).filter(
        (m) =>
          !m.isProblemPost &&
          (m.senderId === user?.id || user?.role === 'admin')
      );

      if (deletable.length === 0) {
        showToast(
          'Nothing to Clear',
          'Only your own chat messages can be removed from a consultation.',
          'info'
        );
        return;
      }

      try {
        await Promise.all(deletable.map((m) => apiDeleteMessage(conv.id, m.id)));
        const deletedSet = new Set(deletable.map((m) => m.id));
        setConversationsState((prev) =>
          prev.map((c) =>
            c.id === conv.id
              ? {
                  ...c,
                  messages: (c.messages || []).filter((m) => !deletedSet.has(m.id)),
                }
              : c
          )
        );
        showToast('Chat Cleared', 'Your messages were cleared from the consultation.', 'info');
      } catch (err) {
        showToast('Clear Failed', err.message || 'Could not clear messages.', 'error');
      }
    },
    [showToast]
  );

  const activeUserId = activeUser?.id;

  const markConversationRead = useCallback(
    async (conversationId) => {
      if (!conversationId || !activeUserId) return;
      const conv = (conversationsRef.current || []).find((c) => c.id === conversationId);
      if (!conv) return;

      const hasUnread = (conv.messages || []).some(
        (m) => m.senderId !== activeUserId && !m.isRead
      );
      if (!hasUnread) return;

      try {
        await apiMarkMessagesRead(conversationId);
        setConversationsState((prev) =>
          prev.map((c) =>
            c.id === conversationId
              ? {
                  ...c,
                  messages: (c.messages || []).map((m) =>
                    m.senderId !== activeUserId ? { ...m, isRead: true } : m
                  ),
                }
              : c
          )
        );
      } catch (err) {
        console.warn('[AppContext] markConversationRead failed:', err.message);
      }
    },
    [activeUserId]
  );

  const markNotificationRead = useCallback(async (notifId) => {
    if (!notifId) return;
    setNotificationsState((prev) =>
      prev.map((n) => (n.id === notifId ? { ...n, isRead: true } : n))
    );
    try {
      await apiMarkNotifRead(notifId);
    } catch (err) {
      console.warn('[AppContext] markNotificationRead failed:', err.message);
    }
  }, []);

  const markAllNotificationsRead = useCallback(async () => {
    setNotificationsState((prev) => prev.map((n) => ({ ...n, isRead: true })));
    try {
      await apiMarkAllNotifsRead();
    } catch (err) {
      console.warn('[AppContext] markAllNotificationsRead failed:', err.message);
    }
  }, []);

  const updateUserProfile = useCallback(
    async (_userId, updates) => {
      try {
        const updatedUser = await authUpdateProfile(updates);
        const merged = {
          ...updatedUser,
          location: updates.location ?? updatedUser?.location ?? 'Remote',
        };
        setActiveUserState(merged);
        setConsultants((prev) =>
          prev.map((c) => (c.id === merged.id ? { ...c, ...merged } : c))
        );
        if (merged.role === 'consultant') {
          loadConsultants();
        }
        showToast('Profile Saved', 'Profile details have been updated.', 'success');
        return merged;
      } catch (err) {
        showToast('Update Failed', err.message || 'Could not update profile.', 'error');
        return null;
      }
    },
    [loadConsultants, showToast]
  );

  const updateConsultantProfile = useCallback(
    async (updates) => updateUserProfile(activeUserRef.current?.id, updates),
    [updateUserProfile]
  );

  const setClientUser = useCallback(
    async (updaterOrObj) => {
      const current = activeUserRef.current;
      const nextVal =
        typeof updaterOrObj === 'function'
          ? updaterOrObj(current)
          : { ...current, ...updaterOrObj };
      return updateUserProfile(current?.id, nextVal);
    },
    [updateUserProfile]
  );

  const toggleSaveThought = useCallback(
    (thoughtId) => {
      const userId = activeUserRef.current?.id;
      const nextSaved = toggleSavedThoughtId(userId, thoughtId);
      setThinksState((prev) =>
        prev.map((t) => (t.id === thoughtId ? { ...t, isSaved: nextSaved } : t))
      );
    },
    []
  );

  const toggleSaveJob = useCallback(
    (jobId) => {
      setJobs((prev) =>
        syncJobsCatalog(prev).map((j) =>
          j.id === jobId ? { ...j, isSaved: !j.isSaved } : j
        )
      );
      showToast('Job Saved', 'Job listing updated in your saved items.', 'info');
    },
    [showToast]
  );

  const applyJob = useCallback(
    (jobId, applicationDetails = null) => {
      setJobs((prev) =>
        syncJobsCatalog(prev).map((j) =>
          j.id === jobId
            ? {
                ...j,
                isApplied: true,
                applicantsCount: (j.applicantsCount || 0) + 1,
                appliedAt: new Date().toISOString(),
                applicationSummary: applicationDetails,
              }
            : j
        )
      );
      showToast(
        'Application Submitted',
        'Your application has been delivered to the hiring team.',
        'success'
      );
    },
    [showToast]
  );

  const setConsultantVerification = useCallback(
    async (consultantId, status) => {
      const isApproved = status === 'approved';
      if (activeUserRef.current?.id === consultantId) {
        await updateUserProfile(consultantId, {
          isVerified: isApproved,
          assessmentPassed: isApproved,
        });
      } else {
        setConsultants((prev) =>
          prev.map((c) =>
            c.id === consultantId
              ? { ...c, isVerified: isApproved, assessmentPassed: isApproved }
              : c
          )
        );
        showToast(
          'Verification Updated',
          `Consultant credentials ${isApproved ? 'approved' : 'revoked'}.`,
          'info'
        );
      }
    },
    [showToast, updateUserProfile]
  );

  const resetAllData = useCallback(() => {
    loadWorkspaceData(activeUserRef.current);
    showToast('Workspace Refreshed', 'Synced latest records from server.', 'info');
  }, [loadWorkspaceData, showToast]);

  const openChatWithThought = useCallback(
    (thoughtId) => {
      setActiveChatThoughtId(thoughtId);
      setSelectedThoughtId(null);
      const conv = (conversationsRef.current || []).find(
        (c) => c.thinkId === thoughtId
      );
      if (conv) {
        setActiveConversationId(conv.id);
        setActiveTab('messages');
      } else {
        setActiveConversationId(null);
        setActiveTab('chat');
      }
    },
    []
  );

  const startNewChat = useCallback(() => {
    setActiveChatThoughtId(null);
    setSelectedThoughtId(null);
    setActiveConversationId(null);
    setActiveTab('chat');
    setIsNewThoughtModalOpen(false);
  }, []);

  const startCall = useCallback(
    ({ thoughtId, participantName, participantAvatar, callType = 'video' }) => {
      setActiveCall({
        thoughtId,
        participantName,
        participantAvatar,
        callType,
        startTime: Date.now(),
      });
    },
    []
  );

  const endCall = useCallback(() => {
    setActiveCall(null);
  }, []);

  const subscribeNewsletter = useCallback(async (email, source = 'landing_footer') => {
    return apiSubscribeNewsletter(email, source);
  }, []);

  const currentUser = activeUser;
  const clientUser = activeUser?.role === 'client' ? activeUser : null;
  const consultantUser =
    activeUser?.role === 'consultant'
      ? activeUser
      : consultants.find((c) => c.id === activeUser?.id) || activeUser;

  const allMessages = useMemo(
    () => conversations.flatMap((c) => c.messages || []),
    [conversations]
  );

  const syncedJobs = useMemo(() => syncJobsCatalog(jobs), [jobs]);

  const value = {
    activeUser,
    currentUser,
    clientUser,
    consultantUser,
    demoUsers: DEMO_USERS,
    role,
    switchDemoUser,
    switchRole,

    apiHealth,
    checkHealth,
    isAuthLoading,
    isDataLoading,
    refreshData: () => loadWorkspaceData(activeUserRef.current),

    thinks,
    thoughts: thinks,
    conversations,
    messages: allMessages,
    notifications,

    fetchThoughtDetails,
    submitThink,
    submitThought,
    acceptThink,
    claimThought,
    updateThinkStatus,
    submitReply,
    getRepliesForThought: apiGetRepliesForThought,
    sendChatMessage,
    sendMessage,
    deleteMessage,
    clearChat,
    submitSolution,
    triggerAIFallback,
    toggleSaveJob,
    applyJob,
    setConsultantVerification,
    markConversationRead,
    markNotificationRead,
    markAllNotificationsRead,
    resetAllData,
    updateConsultantProfile,
    setClientUser,
    updateUserProfile,
    subscribeNewsletter,

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

    toast,
    showToast,
    closeToast,

    activeCall,
    startCall,
    endCall,

    isAuthenticated,
    setIsAuthenticated,
    authMode,
    setAuthMode,
    privacyAlert,
    setPrivacyAlert,
    mutedThoughtIds,
    setMutedThoughtIds,
    consultants,
    jobs: syncedJobs,
    auditLogs,
    logoutUser,
    loginUser,
    login: loginUser,
    register,
    quickRegister,
    verifyRegistrationOTP,
    generateOTP,
    resendOTP,
    DEMO_USERS,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}
