/**
 * OverThink LocalStorage Management Service
 * Pure frontend prototype persistence layer supporting Client and Consultant connection workflow.
 * 
 * Keys used:
 * - think_users
 * - think_data (Thinks collection)
 * - think_conversations
 * - think_notifications
 * - think_active_user
 */

export const STORAGE_KEYS = {
  USERS: 'think_users',
  THINKS: 'think_data',
  CONVERSATIONS: 'think_conversations',
  NOTIFICATIONS: 'think_notifications',
  ACTIVE_USER: 'think_active_user',
  AUTH_SESSION: 'think_auth_session'
};

export const DEMO_USERS = [
  {
    id: 'client_001',
    name: 'Alex Morgan',
    role: 'client',
    title: 'Startup Founder & Client',
    bio: 'Passionate about building scalable digital products and exploring modern solutions. Always looking for expert consultation.',
    profileImage: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
    email: 'alex.morgan@overthink.platform',
    mobile: '9876543210',
    password: 'password123',
    isVerified: true,
    label: 'Demo Client',
    location: 'San Francisco, CA',
    createdAt: '2026-01-15T10:00:00.000Z'
  },
  {
    id: 'client_002',
    name: 'Sarah Jenkins',
    role: 'client',
    title: 'E-commerce & Brand Director',
    bio: 'Managing multichannel e-commerce operations. Seeking expert guidance on performance marketing and conversion optimization.',
    profileImage: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&auto=format&fit=crop&q=80',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&auto=format&fit=crop&q=80',
    email: 'sarah.jenkins@overthink.platform',
    mobile: '9876543213',
    password: 'password123',
    isVerified: true,
    label: 'Demo Client 2',
    location: 'New York, NY',
    createdAt: '2026-01-16T11:00:00.000Z'
  },
  {
    id: 'consultant_001',
    name: 'Dr. Elena Vance',
    role: 'consultant',
    title: 'Principal Product & Cloud Solutions Architect',
    bio: '14+ years designing high-throughput distributed systems and scaling early-stage B2B products.',
    profileImage: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&auto=format&fit=crop&q=80',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&auto=format&fit=crop&q=80',
    email: 'elena.vance@overthink.platform',
    mobile: '9876543211',
    password: 'password123',
    isVerified: true,
    assessmentPassed: true,
    assessmentScore: '15/15',
    label: 'Demo Consultant 1',
    hourlyRate: 150,
    rating: 4.98,
    reviewsCount: 142,
    responseTime: '< 2 hours',
    completedConsultations: 89,
    earningsTotal: 34500,
    location: 'Seattle, WA (Remote)',
    skills: ['System Architecture', 'AWS / Cloud Native', 'PostgreSQL Tuning', 'Go-To-Market', 'Product Strategy', 'Microservices', 'Engineering Leadership'],
    services: [
      { id: 'srv-1', title: 'Deep Architectural Review & Bottleneck Audit', price: 300, duration: '90 min Video + Detailed Report' },
      { id: 'srv-2', title: 'Tech Stack & Cloud Scalability Strategy', price: 180, duration: '60 min Consultation' },
      { id: 'srv-3', title: 'Monthly Fractional CTO & Advisory Retainer', price: 2500, duration: '4 Weekly Sprints' }
    ],
    experience: [
      { id: 'exp-1', company: 'Global Cloud Systems', role: 'Chief Technical Advisor', period: '2023 - Present', description: 'Advising high-growth fintechs and SaaS startups on distributed scale.' },
      { id: 'exp-2', company: 'Stripe Engineering', role: 'Staff Systems Engineer', period: '2019 - 2023', description: 'Led data pipeline reliability and multi-region failover protocols.' },
      { id: 'exp-3', company: 'Amazon Web Services', role: 'Senior Solutions Architect', period: '2015 - 2019', description: 'Consulted Fortune 500 enterprises transitioning to cloud microservices.' }
    ],
    education: [
      { id: 'edu-1', school: 'Stanford University', degree: 'Ph.D. in Computer Systems', year: '2015' },
      { id: 'edu-2', school: 'UC Berkeley', degree: 'B.S. in Electrical Engineering & Computer Sciences', year: '2010' }
    ],
    certifications: [
      'AWS Certified Solutions Architect – Professional',
      'Google Cloud Certified Fellow',
      'Certified Scrum Professional & Agile Mentor'
    ],
    portfolio: [
      {
        id: 'port-1',
        title: 'Fintech High-Frequency Ledger Scaling',
        description: 'Reduced sub-50ms latency across 12M daily transactions via distributed caching and partitioning.',
        tag: 'Fintech / Systems'
      },
      {
        id: 'port-2',
        title: 'B2B HealthTech HIPAA Cloud Migration',
        description: 'Complete architecture redesign ensuring zero downtime and 100% HIPAA compliance.',
        tag: 'Cloud & Security'
      }
    ],
    createdAt: '2026-01-10T08:00:00.000Z'
  },
  {
    id: 'consultant_002',
    name: 'Marcus Sterling',
    role: 'consultant',
    title: 'Tech Career Strategist & Former Senior Recruiter',
    bio: 'Guided 350+ engineers, product managers, and leaders to land top-tier offers. Specializing in technical growth and roadmap execution.',
    profileImage: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&auto=format&fit=crop&q=80',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&auto=format&fit=crop&q=80',
    email: 'marcus.sterling@overthink.platform',
    mobile: '9876543212',
    password: 'password123',
    isVerified: true,
    assessmentPassed: true,
    assessmentScore: '15/15',
    label: 'Demo Consultant 2',
    hourlyRate: 110,
    rating: 4.95,
    reviewsCount: 218,
    responseTime: '< 1 hour',
    completedConsultations: 164,
    earningsTotal: 42000,
    location: 'Austin, TX',
    skills: ['Career Transition', 'Resume ATS Overhaul', 'Executive Compensation', 'FAANG Interview Prep', 'LinkedIn Brand Optimization'],
    services: [
      { id: 'srv-m1', title: 'Complete Resume & LinkedIn Profile Transformation', price: 220, duration: 'Full Rewrite + 45m Call' },
      { id: 'srv-m2', title: 'Mock Technical & Behavioral Interview Intensive', price: 150, duration: '60 min High-Stakes Simulation' }
    ],
    experience: [
      { id: 'exp-m1', company: 'Meta', role: 'Lead Technical Talent Partner', period: '2020 - 2024', description: 'Scaled senior and staff engineering hiring across core infra teams.' },
      { id: 'exp-m2', company: 'Uber', role: 'Senior Talent Acquisition', period: '2017 - 2020', description: 'Built technical recruiting playbooks for distributed backend teams.' }
    ],
    education: [
      { id: 'edu-m1', school: 'University of Texas at Austin', degree: 'B.A. in Organizational Psychology', year: '2014' }
    ],
    certifications: ['SHRM Senior Certified Professional', 'Certified Career Management Coach'],
    portfolio: [
      {
        id: 'port-m1',
        title: 'Senior Developer to Engineering Director Roadmap',
        description: 'Structured 90-day portfolio, interview narrative, and compensation negotiation strategy.',
        tag: 'Career Success'
      }
    ],
    createdAt: '2026-01-12T09:00:00.000Z'
  }
];

// Pure clean initial state: ZERO static fake submissions! Only user-created workflow data!
export const INITIAL_THINKS = [];
export const INITIAL_CONVERSATIONS = [];
export const INITIAL_NOTIFICATIONS = [];

/**
 * Storage read/write helper functions with graceful fallbacks
 */
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

/**
 * Initialize storage. Cleans out any old legacy static mock data so only genuine user-created
 * workflow data is displayed as requested.
 */
export function initializeThinkStorage() {
  const existingUsers = safeGetItem(STORAGE_KEYS.USERS, null);
  if (!existingUsers) {
    safeSetItem(STORAGE_KEYS.USERS, DEMO_USERS);
  } else {
    // Ensure all demo users exist with complete credentials and all new registered users are preserved
    let updated = false;
    const userMap = new Map();

    // 1. Keep existing registered users and migrate any old @think.platform emails
    existingUsers.forEach(u => {
      let email = u.email;
      if (email && email.includes('@think.platform')) {
        email = email.replace('@think.platform', '@overthink.platform');
        updated = true;
      }
      userMap.set(u.id, { ...u, email });
    });

    // 2. Ensure all DEMO_USERS are present with valid email, password & mobile
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
        // Force canonical demo email and backfill rich demo profile metadata if absent
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

  // Check if existing data is contaminated with old static dummy IDs
  const rawThinks = localStorage.getItem(STORAGE_KEYS.THINKS);
  if (!rawThinks) {
    safeSetItem(STORAGE_KEYS.THINKS, []);
  } else {
    try {
      const parsed = JSON.parse(rawThinks);
      // If contains old hardcoded dummy data from previous templates, clean it to empty array
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
    status: 'pending', // Starts as Pending
    urgency: thinkData.urgency || 'Standard',
    createdAt: new Date().toISOString(),
    tags: thinkData.tags || [thinkData.category || 'General'],
    attachments: thinkData.attachments || []
  };

  const updated = [newThink, ...currentThinks];
  safeSetItem(STORAGE_KEYS.THINKS, updated);

  // Notify consultants about new submission
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

/**
 * Accept a Think and create a connected shared conversation.
 * Exclusivity check: only ONE consultant can accept!
 */
export function acceptThink(thinkId, consultantUser) {
  const think = getThinkById(thinkId);
  if (!think) {
    throw new Error('OverThink not found.');
  }

  const consultant = consultantUser || getActiveUser();
  const existingConv = getConversationByThinkId(thinkId);

  // If this consultant already accepted or a conversation already exists for them, open it
  if (existingConv && (!think.consultantId || think.consultantId === consultant.id)) {
    return { think, conversation: existingConv, alreadyAccepted: true };
  }

  // Prevent duplicate acceptance by another consultant
  if (think.status !== 'pending' && think.status !== 'pending_human' && think.consultantId && think.consultantId !== consultant.id) {
    throw new Error(`This OverThink has already been accepted by ${think.assignedConsultantName || 'another consultant'}.`);
  }

  const conversationId = `conversation_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;

  // 1. Update Think in storage
  const updatedThink = updateThink(thinkId, {
    status: 'accepted',
    consultantId: consultant.id,
    assignedConsultantId: consultant.id,
    assignedConsultantName: consultant.name,
    assignedConsultantAvatar: consultant.profileImage || consultant.avatar
  });

  // Carry over any client follow-up notes sent before consultant acceptance
  const carriedMessages = (think.pendingMessages || []).map(m => ({
    ...m,
    conversationId
  }));

  // 2. Create conversation object
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
      ...carriedMessages,
      {
        id: `msg_${Date.now()}`,
        conversationId,
        senderId: consultant.id,
        senderName: consultant.name,
        senderAvatar: consultant.profileImage || consultant.avatar,
        senderRole: 'consultant',
        text: `Hello ${think.clientName}! I have reviewed your submission "${think.title}" and accepted this consultation. How would you like to begin?`,
        createdAt: new Date().toISOString(),
        isRead: false
      }
    ]
  };

  const currentConvs = getConversations();
  safeSetItem(STORAGE_KEYS.CONVERSATIONS, [newConversation, ...currentConvs]);

  // 3. Notify the client
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

  // If conversation was 'accepted', transition to 'in_progress' once chat begins
  const newStatus = (conv.status === 'accepted' || conv.status === 'pending') ? 'in_progress' : conv.status;

  updateConversation(conversationId, {
    messages: updatedMessages,
    status: newStatus
  });

  // Sync think status to in_progress
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
