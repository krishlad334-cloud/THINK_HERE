export const STORAGE_KEYS = {
  USERS: 'think_users',
  THINKS: 'think_data',
  CONVERSATIONS: 'think_conversations',
  NOTIFICATIONS: 'think_notifications',
  ACTIVE_USER: 'think_active_user',
  AUTH_SESSION: 'think_auth_session'
};

import { DEMO_USERS } from '../data/demoUsers';

export { DEMO_USERS };

export const INITIAL_THINKS = [];
export const INITIAL_CONVERSATIONS = [];
export const INITIAL_NOTIFICATIONS = [];

function safeGetItem(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw);
  } catch (err) {
    console.warn(`[thinkStorage] Error reading ${key}:`, err);
    return fallback;
  }
}

function safeSetItem(key, data) {
  try {
    localStorage.setItem(key, JSON.stringify(data));
    window.dispatchEvent(new CustomEvent('think_storage_updated', { detail: { key, data } }));
  } catch (err) {
    console.error(`[thinkStorage] Error writing ${key}:`, err);
  }
}

export function initializeThinkStorage() {
  const existingUsers = safeGetItem(STORAGE_KEYS.USERS, null);
  if (!existingUsers) {
    safeSetItem(STORAGE_KEYS.USERS, DEMO_USERS);
  } else {
    let updated = false;
    const userMap = new Map();

    existingUsers.forEach(u => {
      let email = u.email;
      if (email && email.includes('@think.platform')) {
        email = email.replace('@think.platform', '@overthink.platform');
        updated = true;
      }
      userMap.set(u.id, { ...u, email });
    });

    DEMO_USERS.forEach(demo => {
      if (!userMap.has(demo.id)) {
        userMap.set(demo.id, demo);
        updated = true;
      } else {
        const current = userMap.get(demo.id);
        const missingDemoFields =
          current.email !== demo.email ||
          !current.mobile ||
          !current.password ||
          current.isVerified === undefined ||
          (demo.role === 'consultant' && (!current.skills || !current.services || !current.responseTime));
        if (missingDemoFields) {
          userMap.set(demo.id, {
            ...demo,
            ...current,
            email: demo.email,
            mobile: current.mobile || demo.mobile,
            password: current.password || demo.password,
            isVerified: true,
            responseTime: current.responseTime || demo.responseTime,
            skills: current.skills?.length ? current.skills : demo.skills,
            services: current.services?.length ? current.services : demo.services,
            experience: current.experience?.length ? current.experience : demo.experience,
            education: current.education?.length ? current.education : demo.education,
            certifications: current.certifications?.length ? current.certifications : demo.certifications,
            portfolio: current.portfolio?.length ? current.portfolio : demo.portfolio
          });
          updated = true;
        }
      }
    });

    const merged = Array.from(userMap.values());
    if (updated || merged.length !== existingUsers.length) {
      safeSetItem(STORAGE_KEYS.USERS, merged);
    }
  }

  const rawThinks = localStorage.getItem(STORAGE_KEYS.THINKS);
  if (!rawThinks) {
    safeSetItem(STORAGE_KEYS.THINKS, []);
  } else {
    try {
      const parsed = JSON.parse(rawThinks);
      if (Array.isArray(parsed) && parsed.some(t => t.id === 'thought-1' || t.id === 'thought-2' || t.id === 'think_001')) {
        safeSetItem(STORAGE_KEYS.THINKS, []);
        safeSetItem(STORAGE_KEYS.CONVERSATIONS, []);
        safeSetItem(STORAGE_KEYS.NOTIFICATIONS, []);
      }
    } catch {
      safeSetItem(STORAGE_KEYS.THINKS, []);
    }
  }

  if (!localStorage.getItem(STORAGE_KEYS.CONVERSATIONS)) {
    safeSetItem(STORAGE_KEYS.CONVERSATIONS, []);
  }
  if (!localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS)) {
    safeSetItem(STORAGE_KEYS.NOTIFICATIONS, []);
  }
  if (!localStorage.getItem(STORAGE_KEYS.ACTIVE_USER)) {
    safeSetItem(STORAGE_KEYS.ACTIVE_USER, 'client_001');
  }
}

export function getAuthSession() {
  return safeGetItem(STORAGE_KEYS.AUTH_SESSION, null);
}

export function setAuthSession(sessionData) {
  safeSetItem(STORAGE_KEYS.AUTH_SESSION, sessionData);
}

export function clearAuthSession() {
  try {
    localStorage.removeItem(STORAGE_KEYS.AUTH_SESSION);
    window.dispatchEvent(new CustomEvent('think_storage_updated', { detail: { key: STORAGE_KEYS.AUTH_SESSION, data: null } }));
  } catch (err) {
    console.error('[thinkStorage] Error clearing auth session:', err);
  }
}

export function getUsers() {
  return safeGetItem(STORAGE_KEYS.USERS, DEMO_USERS);
}

export function getUserById(userId) {
  const users = getUsers();
  return users.find(u => u.id === userId) || null;
}

export function getActiveUser() {
  const activeId = safeGetItem(STORAGE_KEYS.ACTIVE_USER, 'client_001');
  const user = getUserById(activeId);
  return user || DEMO_USERS[0];
}

export function setActiveUser(userId) {
  const user = getUserById(userId);
  if (!user) return false;
  safeSetItem(STORAGE_KEYS.ACTIVE_USER, userId);
  return true;
}

export function updateUser(userId, updates) {
  const users = getUsers();
  let updatedUser = null;

  const updated = users.map(u => {
    if (u.id === userId) {
      updatedUser = { ...u, ...updates };
      return updatedUser;
    }
    return u;
  });

  safeSetItem(STORAGE_KEYS.USERS, updated);
  return updatedUser;
}

export function getThinks() {
  return safeGetItem(STORAGE_KEYS.THINKS, []);
}

export function getThinkById(thinkId) {
  const thinks = getThinks();
  return thinks.find(t => t.id === thinkId) || null;
}

export function saveThink(thinkData) {
  const currentThinks = getThinks();
  const activeUser = getActiveUser();

  const newThink = {
    id: thinkData.id || `think_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
    clientId: thinkData.clientId || activeUser.id,
    clientName: thinkData.clientName || activeUser.name,
    clientAvatar: thinkData.clientAvatar || activeUser.profileImage || activeUser.avatar,
    consultantId: null,
    assignedConsultantId: null,
    assignedConsultantName: null,
    assignedConsultantAvatar: null,
    title: thinkData.title.trim(),
    description: (thinkData.description || '').trim(),
    category: thinkData.category || 'General Consultation',
    status: 'pending',
    urgency: thinkData.urgency || 'Standard',
    createdAt: new Date().toISOString(),
    tags: thinkData.tags || [thinkData.category || 'General'],
    attachments: thinkData.attachments || []
  };

  const updated = [newThink, ...currentThinks];
  safeSetItem(STORAGE_KEYS.THINKS, updated);

  addNotification({
    recipientId: null,
    recipientRole: 'consultant',
    title: 'New OverThink Submitted',
    message: `${newThink.clientName} submitted: "${newThink.title.slice(0, 45)}..." in ${newThink.category}`,
    type: 'thought_matched',
    thinkId: newThink.id
  });

  return newThink;
}

export function updateThink(thinkId, updates) {
  const currentThinks = getThinks();
  let updatedThink = null;

  const updated = currentThinks.map(t => {
    if (t.id === thinkId) {
      updatedThink = { ...t, ...updates, updatedAt: new Date().toISOString() };
      return updatedThink;
    }
    return t;
  });

  safeSetItem(STORAGE_KEYS.THINKS, updated);

  if (updates.status) {
    const conv = getConversationByThinkId(thinkId);
    if (conv) {
      updateConversation(conv.id, { status: updates.status });
    }
  }

  return updatedThink;
}

export function deleteThink(thinkId) {
  const currentThinks = getThinks();
  const updated = currentThinks.filter(t => t.id !== thinkId);
  safeSetItem(STORAGE_KEYS.THINKS, updated);
}

export function getConversations() {
  return safeGetItem(STORAGE_KEYS.CONVERSATIONS, []);
}

export function getConversationById(convId) {
  const convs = getConversations();
  return convs.find(c => c.id === convId) || null;
}

export function getConversationByThinkId(thinkId) {
  const convs = getConversations();
  return convs.find(c => c.thinkId === thinkId) || null;
}

export function acceptThink(thinkId, consultantUser) {
  const think = getThinkById(thinkId);
  if (!think) {
    throw new Error('OverThink not found.');
  }

  const consultant = consultantUser || getActiveUser();
  const existingConv = getConversationByThinkId(thinkId);

  if (existingConv && (!think.consultantId || think.consultantId === consultant.id)) {
    return { think, conversation: existingConv, alreadyAccepted: true };
  }

  if (think.status !== 'pending' && think.status !== 'pending_human' && think.consultantId && think.consultantId !== consultant.id) {
    throw new Error(`This OverThink has already been accepted by ${think.assignedConsultantName || 'another consultant'}.`);
  }

  const conversationId = `conversation_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;

  const updatedThink = updateThink(thinkId, {
    status: 'accepted',
    consultantId: consultant.id,
    assignedConsultantId: consultant.id,
    assignedConsultantName: consultant.name,
    assignedConsultantAvatar: consultant.profileImage || consultant.avatar
  });

  const carriedMessages = (think.pendingMessages || []).map(m => ({
    ...m,
    conversationId
  }));

  const initialProblemMessage = {
    id: `msg_problem_${think.id}`,
    conversationId,
    senderId: think.clientId,
    senderName: think.clientName,
    senderAvatar: think.clientAvatar,
    senderRole: 'client',
    isProblemPost: true,
    problemTitle: think.title,
    problemDescription: think.description || '',
    problemCategory: think.category || 'General Consultation',
    problemUrgency: think.urgency || 'Standard',
    text: think.description ? `${think.title}\n\n${think.description}` : think.title,
    attachments: think.attachments || [],
    createdAt: think.createdAt || new Date().toISOString(),
    isRead: true
  };

  const newConversation = {
    id: conversationId,
    thinkId: think.id,
    clientId: think.clientId,
    clientName: think.clientName,
    clientAvatar: think.clientAvatar,
    consultantId: consultant.id,
    consultantName: consultant.name,
    consultantAvatar: consultant.profileImage || consultant.avatar,
    status: 'accepted',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    messages: [
      initialProblemMessage,
      ...carriedMessages,
      {
        id: `msg_${Date.now()}`,
        conversationId,
        senderId: consultant.id,
        senderName: consultant.name,
        senderAvatar: consultant.profileImage || consultant.avatar,
        senderRole: 'consultant',
        text: `Hello ${think.clientName}! I have reviewed your problem and accepted this consultation. Let's work through it together — what extra context would you like to add?`,
        createdAt: new Date().toISOString(),
        isRead: false
      }
    ]
  };

  const currentConvs = getConversations();
  safeSetItem(STORAGE_KEYS.CONVERSATIONS, [newConversation, ...currentConvs]);

  addNotification({
    recipientId: think.clientId,
    recipientRole: 'client',
    title: 'Your OverThink Has Been Accepted!',
    message: `${consultant.name} accepted your OverThink: "${think.title.slice(0, 45)}...". Click to chat.`,
    type: 'consultant_accepted',
    thinkId: think.id,
    conversationId
  });

  return { think: updatedThink, conversation: newConversation };
}

export function updateConversation(conversationId, updates) {
  const currentConvs = getConversations();
  let updatedConv = null;

  const updated = currentConvs.map(c => {
    if (c.id === conversationId) {
      updatedConv = { ...c, ...updates, updatedAt: new Date().toISOString() };
      return updatedConv;
    }
    return c;
  });

  safeSetItem(STORAGE_KEYS.CONVERSATIONS, updated);
  return updatedConv;
}

export function getMessages(conversationId) {
  const conv = getConversationById(conversationId);
  return conv ? conv.messages || [] : [];
}

export function sendMessage(conversationId, senderUser, text, attachments = []) {
  if (!text.trim() && attachments.length === 0) return null;

  const conv = getConversationById(conversationId);
  if (!conv) {
    console.error(`[thinkStorage] Conversation ${conversationId} not found`);
    return null;
  }

  const sender = senderUser || getActiveUser();
  const newMessage = {
    id: `msg_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
    conversationId,
    senderId: sender.id,
    senderName: sender.name,
    senderAvatar: sender.profileImage || sender.avatar,
    senderRole: sender.role,
    text: text.trim(),
    attachments: attachments || [],
    createdAt: new Date().toISOString(),
    isRead: false
  };

  const updatedMessages = [...(conv.messages || []), newMessage];

  const newStatus = (conv.status === 'accepted' || conv.status === 'pending') ? 'in_progress' : conv.status;

  updateConversation(conversationId, {
    messages: updatedMessages,
    status: newStatus
  });

  if (conv.thinkId) {
    const think = getThinkById(conv.thinkId);
    if (think && (think.status === 'accepted' || think.status === 'pending')) {
      updateThink(conv.thinkId, { status: 'in_progress' });
    }
  }

  const recipientId = sender.id === conv.clientId ? conv.consultantId : conv.clientId;
  const recipientRole = sender.role === 'client' ? 'consultant' : 'client';

  addNotification({
    recipientId,
    recipientRole,
    title: `New Message from ${sender.name}`,
    message: text.slice(0, 60) + (text.length > 60 ? '...' : ''),
    type: 'new_message',
    thinkId: conv.thinkId,
    conversationId: conv.id
  });

  return newMessage;
}

export function addPendingThinkMessage(thinkId, senderUser, text, attachments = []) {
  if (!text?.trim() && (!attachments || attachments.length === 0)) return null;
  const think = getThinkById(thinkId);
  if (!think) return null;

  const sender = senderUser || getActiveUser();
  const msg = {
    id: `msg_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
    conversationId: null,
    thoughtId: thinkId,
    senderId: sender.id,
    senderName: sender.name,
    senderAvatar: sender.profileImage || sender.avatar,
    senderRole: sender.role,
    text: (text || '').trim(),
    attachments: attachments || [],
    createdAt: new Date().toISOString(),
    isRead: true
  };

  updateThink(thinkId, {
    pendingMessages: [...(think.pendingMessages || []), msg]
  });

  return msg;
}

export function markMessagesAsRead(conversationId, readerId) {
  const conv = getConversationById(conversationId);
  if (!conv || !conv.messages) return false;

  let hasUnread = false;
  const updatedMessages = conv.messages.map(m => {
    if (m.senderId !== readerId && !m.isRead) {
      hasUnread = true;
      return { ...m, isRead: true };
    }
    return m;
  });

  if (hasUnread) {
    updateConversation(conversationId, { messages: updatedMessages });
  }
  return hasUnread;
}

export function deleteMessage(messageId) {
  const convs = getConversations();
  let found = false;
  const updated = convs.map(c => {
    if ((c.messages || []).some(m => m.id === messageId)) {
      found = true;
      return {
        ...c,
        messages: c.messages.filter(m => m.id !== messageId)
      };
    }
    return c;
  });
  if (found) {
    safeSetItem(STORAGE_KEYS.CONVERSATIONS, updated);
    return true;
  }

  const thinks = getThinks();
  let foundInThink = false;
  const updatedThinks = thinks.map(t => {
    if ((t.pendingMessages || []).some(m => m.id === messageId)) {
      foundInThink = true;
      return {
        ...t,
        pendingMessages: t.pendingMessages.filter(m => m.id !== messageId)
      };
    }
    return t;
  });
  if (foundInThink) {
    safeSetItem(STORAGE_KEYS.THINKS, updatedThinks);
    return true;
  }
  return false;
}

export function clearChatMessages(targetId) {
  const convs = getConversations();
  let found = false;
  const updated = convs.map(c => {
    if (c.id === targetId || c.thinkId === targetId) {
      found = true;
      return {
        ...c,
        messages: []
      };
    }
    return c;
  });
  if (found) {
    safeSetItem(STORAGE_KEYS.CONVERSATIONS, updated);
    return true;
  }

  const thinks = getThinks();
  let foundInThink = false;
  const updatedThinks = thinks.map(t => {
    if (t.id === targetId && (t.pendingMessages || []).length > 0) {
      foundInThink = true;
      return { ...t, pendingMessages: [] };
    }
    return t;
  });
  if (foundInThink) {
    safeSetItem(STORAGE_KEYS.THINKS, updatedThinks);
    return true;
  }
  return false;
}

export function getNotifications(userId, role) {
  const notifs = safeGetItem(STORAGE_KEYS.NOTIFICATIONS, []);
  if (!userId && !role) return notifs;

  return notifs.filter(n => {
    if (n.recipientId && n.recipientId === userId) return true;
    if (!n.recipientId && n.recipientRole === role) return true;
    return false;
  });
}

export function addNotification(notification) {
  const notifs = safeGetItem(STORAGE_KEYS.NOTIFICATIONS, []);
  const newNotif = {
    id: `notif_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
    title: notification.title,
    message: notification.message,
    type: notification.type || 'info',
    recipientId: notification.recipientId || null,
    recipientRole: notification.recipientRole || null,
    thinkId: notification.thinkId || null,
    conversationId: notification.conversationId || null,
    createdAt: new Date().toISOString(),
    isRead: false
  };

  const updated = [newNotif, ...notifs];
  safeSetItem(STORAGE_KEYS.NOTIFICATIONS, updated);
  return newNotif;
}

export function markNotificationRead(notifId) {
  const notifs = safeGetItem(STORAGE_KEYS.NOTIFICATIONS, []);
  const updated = notifs.map(n => n.id === notifId ? { ...n, isRead: true } : n);
  safeSetItem(STORAGE_KEYS.NOTIFICATIONS, updated);
}

export function markAllNotificationsRead(userId, role) {
  const notifs = safeGetItem(STORAGE_KEYS.NOTIFICATIONS, []);
  const updated = notifs.map(n => {
    const isTarget = (!userId && !role) || (n.recipientId === userId) || (!n.recipientId && n.recipientRole === role);
    return isTarget ? { ...n, isRead: true } : n;
  });
  safeSetItem(STORAGE_KEYS.NOTIFICATIONS, updated);
}

export function clearDemoData() {
  safeSetItem(STORAGE_KEYS.THINKS, []);
  safeSetItem(STORAGE_KEYS.CONVERSATIONS, []);
  safeSetItem(STORAGE_KEYS.NOTIFICATIONS, []);
  safeSetItem(STORAGE_KEYS.ACTIVE_USER, 'client_001');
  window.dispatchEvent(new CustomEvent('think_storage_updated', { detail: { key: 'ALL' } }));
}

export function resetDemoData() {
  clearDemoData();
}
