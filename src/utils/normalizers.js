const UI_CATEGORY_LABELS = [
  'Career & Jobs',
  'Technology & IT',
  'Business & Startups',
  'Product & Innovation',
  'Marketing & Growth',
  'General Consultation',
  'Personal & Mindset',
];

const BACKEND_TO_UI_CATEGORY = {
  career: 'Career & Jobs',
  business: 'Business & Startups',
  personal: 'Personal & Mindset',
  other: 'General Consultation',
};

export function mapCategoryToBackend(category) {
  if (!category || typeof category !== 'string') return 'other';
  const c = category.trim().toLowerCase();

  if (
    c === 'career' ||
    c.includes('career') ||
    c.includes('job') ||
    c.includes('education') ||
    c.includes('learning')
  ) {
    return 'career';
  }
  if (
    c === 'business' ||
    c.includes('business') ||
    c.includes('startup') ||
    c.includes('strategy') ||
    c.includes('product') ||
    c.includes('marketing') ||
    c.includes('growth') ||
    c.includes('technology') ||
    c.includes('it')
  ) {
    return 'business';
  }
  if (c === 'personal' || c.includes('personal') || c.includes('mindset')) {
    return 'personal';
  }
  return 'other';
}

export function mapUrgencyToBackend(urgency) {
  if (!urgency || typeof urgency !== 'string') return 'Standard';
  const u = urgency.trim().toLowerCase();
  if (u.includes('urgent') || u.includes('high')) return 'Urgent';
  if (u.includes('priority')) return 'Priority';
  return 'Standard';
}

export function mapCategoryForDisplay(rawCategory, tags = []) {
  if (Array.isArray(tags)) {
    for (const tag of tags) {
      if (typeof tag !== 'string') continue;
      const found = UI_CATEGORY_LABELS.find(
        (label) => label.toLowerCase() === tag.trim().toLowerCase()
      );
      if (found) return found;
    }
  }

  if (!rawCategory || typeof rawCategory !== 'string') {
    return 'General Consultation';
  }
  const key = rawCategory.trim().toLowerCase();
  return BACKEND_TO_UI_CATEGORY[key] || rawCategory;
}

export function doesCategoryMatchFilter(thought, selectedCategory) {
  if (!selectedCategory || selectedCategory === 'All') return true;
  if (!thought) return false;
  if (thought.category === selectedCategory) return true;

  const selectedBackend = mapCategoryToBackend(selectedCategory);
  if (thought.backendCategory && thought.backendCategory === selectedBackend) {
    const hasSpecificDifferentUiTag =
      thought.category &&
      thought.category !== BACKEND_TO_UI_CATEGORY[thought.backendCategory] &&
      thought.category !== selectedCategory;
    if (!hasSpecificDifferentUiTag) return true;
  }

  if (Array.isArray(thought.tags)) {
    return thought.tags.some(
      (tag) => typeof tag === 'string' && tag.toLowerCase() === selectedCategory.toLowerCase()
    );
  }
  return false;
}

function parseNumericRate(rawRate, fallback) {
  if (rawRate === undefined || rawRate === null || rawRate === '') return fallback;
  if (typeof rawRate === 'number' && !Number.isNaN(rawRate)) return rawRate;
  const cleaned = String(rawRate).replace(/[^0-9.]/g, '');
  if (!cleaned) return fallback;
  const num = Number(cleaned);
  return Number.isNaN(num) ? fallback : num;
}

export function normalizeUser(raw) {
  if (!raw) return null;
  const id = raw._id || raw.id;
  const rawRole = raw.role || 'client';
  const role = rawRole === 'user' ? 'client' : rawRole;
  const isConsultant = role === 'consultant';
  const hourlyRate = parseNumericRate(raw.hourlyRate, isConsultant ? 150 : undefined);

  const rawServices = Array.isArray(raw.services) ? raw.services : [];
  const services = rawServices.map((srv, idx) => {
    if (typeof srv === 'string') {
      return {
        id: `srv-${idx + 1}`,
        title: srv,
        price: hourlyRate || 150,
        duration: '60 min Consultation',
      };
    }
    return {
      ...srv,
      id: srv._id || srv.id || `srv-${idx + 1}`,
    };
  });

  const avatar = raw.avatar || raw.profileImage || null;
  const headline = raw.headline || raw.title || '';

  return {
    ...raw,
    id,
    role,
    backendRole: rawRole,
    title:
      headline ||
      (isConsultant
        ? 'OverThink Domain Specialist'
        : role === 'admin'
          ? 'Platform Administrator'
          : 'Client Member'),
    headline,
    avatar,
    profileImage: avatar,
    hourlyRate,
    skills: Array.isArray(raw.skills) ? raw.skills : [],
    services,
    location: raw.location || 'Remote',
    responseTime: raw.responseTime || (isConsultant ? '< 2 hours' : undefined),
    rating: raw.rating ?? (isConsultant ? 4.95 : undefined),
    reviewsCount: raw.reviewsCount ?? (isConsultant ? 0 : undefined),
    isVerified: Boolean(raw.isVerified),
    assessmentPassed: Boolean(raw.assessmentPassed),
    label:
      raw.label ||
      (isConsultant ? 'Consultant' : role === 'admin' ? 'Admin' : 'Client'),
  };
}

export function normalizeReply(raw, fallbackAvatar = null) {
  if (!raw) return null;
  const id = raw._id || raw.id;
  const responderObj =
    raw.responder && typeof raw.responder === 'object' ? raw.responder : null;
  const responderId =
    raw.responderId ||
    responderObj?._id ||
    responderObj?.id ||
    (typeof raw.responder === 'string' ? raw.responder : null);
  const responderName =
    raw.responderName || responderObj?.name || 'OverThink Specialist';
  const responderType = raw.responderType || responderObj?.role || 'consultant';
  const isAIGenerated = responderType === 'AI' || Boolean(raw.isAIGenerated);
  const actionChecklist = Array.isArray(raw.actionChecklist)
    ? raw.actionChecklist
    : [];

  return {
    ...raw,
    id,
    thoughtId:
      raw.thoughtId ||
      (typeof raw.thought === 'object'
        ? raw.thought?._id || raw.thought?.id
        : raw.thought) ||
      null,
    responderId,
    responderName,
    responderType,
    isAIGenerated,
    actionChecklist,
    author: {
      id: responderId,
      name: responderName,
      role: isAIGenerated
        ? 'Automated OverThink AI Engine'
        : responderType === 'admin'
          ? 'Platform Moderator'
          : 'Verified Consultant',
      avatar: responderObj?.avatar || fallbackAvatar || null,
      badge: isAIGenerated ? 'Certified AI Engine' : 'Verified Consultant',
    },
    executiveSummary: raw.message || '',
    actionPlan: actionChecklist.map((item, idx) =>
      typeof item === 'string'
        ? { step: idx + 1, title: item, details: '' }
        : { step: idx + 1, ...item }
    ),
  };
}

export function normalizeThought(raw, options = {}) {
  if (!raw) return null;
  const { savedIdsSet = null, consultantsById = null } = options;
  const id = raw._id || raw.id;

  const userObj =
    raw.user && typeof raw.user === 'object' ? raw.user : null;
  const clientId =
    raw.clientId ||
    userObj?._id ||
    userObj?.id ||
    (typeof raw.user === 'string' ? raw.user : null);
  const clientName =
    raw.clientName || userObj?.name || raw.name || 'Client';
  const clientEmail =
    raw.clientEmail || userObj?.email || raw.email || null;
  const clientAvatar =
    raw.clientAvatar || userObj?.avatar || userObj?.profileImage || null;

  const consObj =
    raw.assignedConsultant && typeof raw.assignedConsultant === 'object'
      ? raw.assignedConsultant
      : null;
  const assignedConsultantId =
    raw.assignedConsultantId ||
    raw.consultantId ||
    consObj?._id ||
    consObj?.id ||
    (typeof raw.assignedConsultant === 'string' ? raw.assignedConsultant : null);

  const matchedConsultant =
    assignedConsultantId && consultantsById
      ? consultantsById.get(assignedConsultantId)
      : null;

  const assignedConsultantName =
    raw.assignedConsultantName ||
    consObj?.name ||
    matchedConsultant?.name ||
    null;
  const assignedConsultantAvatar =
    raw.assignedConsultantAvatar ||
    consObj?.avatar ||
    consObj?.profileImage ||
    matchedConsultant?.avatar ||
    null;

  const tags = Array.isArray(raw.tags) ? raw.tags : [];
  const backendCategory = raw.category || 'other';
  const category = mapCategoryForDisplay(backendCategory, tags);

  const rawReplies = Array.isArray(raw.replies) ? raw.replies : [];
  const replies = rawReplies.map((r) =>
    normalizeReply(r, assignedConsultantAvatar)
  );

  const solutions = [...replies];
  if (raw.solution && typeof raw.solution === 'object') {
    solutions.push({
      id: raw.solution.id || `sol-${id}`,
      isAIGenerated: false,
      author: {
        id: raw.solution.consultantId || assignedConsultantId,
        name:
          raw.solution.consultantName ||
          assignedConsultantName ||
          'Verified Consultant',
        role: 'Verified Consultant',
        avatar: assignedConsultantAvatar,
        badge: 'Verified Consultant',
      },
      executiveSummary:
        raw.solution.executiveSummary || raw.solution.summary || '',
      actionPlan: Array.isArray(raw.solution.actionPlan)
        ? raw.solution.actionPlan
        : [],
      recommendedTools: Array.isArray(raw.solution.recommendedTools)
        ? raw.solution.recommendedTools
        : [],
      nextStepsPrompt: raw.solution.nextStepsPrompt || '',
      createdAt: raw.solution.submittedAt || raw.updatedAt || raw.createdAt,
    });
  } else if (typeof raw.solution === 'string' && raw.solution.trim()) {
    solutions.push({
      id: `sol-${id}`,
      isAIGenerated: false,
      author: {
        id: assignedConsultantId,
        name: assignedConsultantName || 'Verified Consultant',
        role: 'Verified Consultant',
        avatar: assignedConsultantAvatar,
        badge: 'Verified Consultant',
      },
      executiveSummary: raw.solution,
      actionPlan: [],
      createdAt: raw.updatedAt || raw.createdAt,
    });
  }

  if (raw.aiResponse && typeof raw.aiResponse === 'string' && raw.aiResponse.trim()) {
    solutions.push({
      id: `ai-sol-${id}`,
      isAIGenerated: true,
      author: {
        name: 'OverThink Intelligence AI',
        role: 'Automated 24h Fallback Engine',
        avatar: null,
        badge: 'Certified AI Engine',
      },
      executiveSummary: raw.aiResponse,
      actionPlan: Array.isArray(raw.aiDiagnosticPlan)
        ? raw.aiDiagnosticPlan.map((step, i) =>
            typeof step === 'string'
              ? { step: i + 1, title: step, details: '' }
              : { step: i + 1, ...step }
          )
        : [],
      createdAt: raw.updatedAt || raw.createdAt,
    });
  }

  const title =
    raw.title ||
    (raw.message ? raw.message.slice(0, 80) : 'Untitled OverThink');
  const description = raw.description ?? raw.message ?? '';

  return {
    ...raw,
    id,
    clientId,
    clientName,
    clientEmail,
    clientAvatar,
    consultantId: assignedConsultantId,
    assignedConsultantId,
    assignedConsultantName,
    assignedConsultantAvatar,
    title,
    description,
    backendCategory,
    category,
    tags,
    attachments: Array.isArray(raw.attachments) ? raw.attachments : [],
    replies,
    solutions,
    isSaved: Boolean(raw.isSaved || (savedIdsSet && savedIdsSet.has(id))),
  };
}

export function normalizeMessage(raw, conversationId = null) {
  if (!raw) return null;
  const id = raw._id || raw.id;
  const senderObj =
    raw.sender && typeof raw.sender === 'object' ? raw.sender : null;
  const senderId =
    raw.senderId ||
    senderObj?._id ||
    senderObj?.id ||
    (typeof raw.sender === 'string' ? raw.sender : null);
  const rawSenderRole = raw.senderRole || senderObj?.role || 'client';
  const senderRole = rawSenderRole === 'user' ? 'client' : rawSenderRole;

  return {
    ...raw,
    id,
    conversationId: raw.conversationId || conversationId || null,
    senderId,
    senderName: raw.senderName || senderObj?.name || 'Participant',
    senderAvatar:
      raw.senderAvatar || senderObj?.avatar || senderObj?.profileImage || null,
    senderRole,
    isProblemPost: Boolean(raw.isProblemPost),
    attachments: Array.isArray(raw.attachments) ? raw.attachments : [],
    isRead: Boolean(raw.isRead),
  };
}

export function normalizeConversation(raw) {
  if (!raw) return null;
  const id = raw._id || raw.id;
  const thoughtObj =
    raw.thought && typeof raw.thought === 'object' ? raw.thought : null;
  const thinkId =
    raw.thinkId ||
    thoughtObj?._id ||
    thoughtObj?.id ||
    (typeof raw.thought === 'string' ? raw.thought : null);

  const clientObj =
    raw.client && typeof raw.client === 'object' ? raw.client : null;
  const clientId =
    raw.clientId ||
    clientObj?._id ||
    clientObj?.id ||
    (typeof raw.client === 'string' ? raw.client : null);

  const consultantObj =
    raw.consultant && typeof raw.consultant === 'object' ? raw.consultant : null;
  const consultantId =
    raw.consultantId ||
    consultantObj?._id ||
    consultantObj?.id ||
    (typeof raw.consultant === 'string' ? raw.consultant : null);

  const rawMessages = Array.isArray(raw.messages) ? raw.messages : [];

  return {
    ...raw,
    id,
    thinkId,
    clientId,
    clientName: raw.clientName || clientObj?.name || 'Client',
    clientAvatar:
      raw.clientAvatar || clientObj?.avatar || clientObj?.profileImage || null,
    consultantId,
    consultantName:
      raw.consultantName || consultantObj?.name || 'Consultant',
    consultantAvatar:
      raw.consultantAvatar ||
      consultantObj?.avatar ||
      consultantObj?.profileImage ||
      null,
    status: raw.status || thoughtObj?.status || 'accepted',
    messages: rawMessages.map((m) => normalizeMessage(m, id)),
  };
}

export function normalizeNotification(raw) {
  if (!raw) return null;
  const id = raw._id || raw.id;
  const thinkId =
    raw.thinkId ||
    raw.linkThoughtId ||
    (typeof raw.thought === 'object'
      ? raw.thought?._id || raw.thought?.id
      : raw.thought) ||
    null;
  const conversationId =
    raw.conversationId ||
    (typeof raw.conversation === 'object'
      ? raw.conversation?._id || raw.conversation?.id
      : raw.conversation) ||
    null;
  const recipientId =
    raw.recipientId ||
    (typeof raw.recipient === 'object'
      ? raw.recipient?._id || raw.recipient?.id
      : raw.recipient) ||
    null;

  return {
    ...raw,
    id,
    recipientId,
    thinkId,
    conversationId,
    isRead: Boolean(raw.isRead),
  };
}
