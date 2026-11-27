import { DEMO_USERS } from '../data/demoUsers';
import { apiRequest } from './apiClient';
import {
  mapCategoryToBackend,
  mapUrgencyToBackend,
  normalizeConversation,
  normalizeMessage,
  normalizeNotification,
  normalizeReply,
  normalizeThought,
  normalizeUser,
} from './normalizers';

export { DEMO_USERS };

export const STORAGE_KEYS = {
  JWT_TOKEN: 'overthink_jwt_token',
  SAVED_THOUGHTS_PREFIX: 'overthink_saved_thoughts_',
};

function getSavedStorageKey(userId) {
  return `${STORAGE_KEYS.SAVED_THOUGHTS_PREFIX}${userId || 'guest'}`;
}

export function getSavedThoughtIds(userId) {
  try {
    const raw = localStorage.getItem(getSavedStorageKey(userId));
    if (!raw) return new Set();
    const parsed = JSON.parse(raw);
    return new Set(Array.isArray(parsed) ? parsed : []);
  } catch {
    return new Set();
  }
}

export function toggleSavedThoughtId(userId, thoughtId) {
  const current = getSavedThoughtIds(userId);
  const nextSaved = !current.has(thoughtId);
  if (nextSaved) {
    current.add(thoughtId);
  } else {
    current.delete(thoughtId);
  }
  try {
    localStorage.setItem(
      getSavedStorageKey(userId),
      JSON.stringify(Array.from(current))
    );
  } catch (err) {
    console.warn('[thinkStorage] Could not persist saved bookmark:', err);
  }
  return nextSaved;
}

export async function checkApiHealth() {
  const res = await apiRequest('/health', { skipAuth: true });
  return res.data;
}

export async function getConsultants() {
  const res = await apiRequest('/auth/consultants', { skipAuth: true });
  const list = res.data?.consultants || [];
  return list.map(normalizeUser);
}

export async function getMyThoughts(params = {}, normalizeOpts = {}) {
  const qs = new URLSearchParams();
  if (params.page) qs.set('page', String(params.page));
  if (params.limit) qs.set('limit', String(params.limit));
  if (params.status) qs.set('status', params.status);
  if (params.category) qs.set('category', params.category);

  const query = qs.toString() ? `?${qs.toString()}` : '';
  const res = await apiRequest(`/thoughts/my${query}`);
  const rawList = res.data?.thoughts || [];
  return {
    thoughts: rawList.map((t) => normalizeThought(t, normalizeOpts)),
    pagination: res.data?.pagination || null,
  };
}

export async function getAllThoughts(params = {}, normalizeOpts = {}) {
  const qs = new URLSearchParams();
  if (params.page) qs.set('page', String(params.page));
  if (params.limit) qs.set('limit', String(params.limit));
  if (params.status) qs.set('status', params.status);
  if (params.category) qs.set('category', params.category);
  if (params.solverType) qs.set('solverType', params.solverType);
  if (params.q) qs.set('q', params.q);

  const query = qs.toString() ? `?${qs.toString()}` : '';
  const res = await apiRequest(`/thoughts${query}`);
  const rawList = res.data?.thoughts || [];
  return {
    thoughts: rawList.map((t) => normalizeThought(t, normalizeOpts)),
    pagination: res.data?.pagination || null,
  };
}

export async function getThoughtById(thinkId, normalizeOpts = {}) {
  const res = await apiRequest(`/thoughts/${thinkId}`);
  return normalizeThought(res.data?.thought, normalizeOpts);
}

export async function saveThink(thinkData, normalizeOpts = {}) {
  const title = (thinkData.title || '').trim();
  const description = (thinkData.description || '').trim();
  const message = (thinkData.message || description || title).trim().slice(0, 3000);
  const displayCategory = thinkData.category || 'General Consultation';
  const backendCategory = mapCategoryToBackend(displayCategory);
  const urgency = mapUrgencyToBackend(thinkData.urgency);

  const baseTags = Array.isArray(thinkData.tags) ? thinkData.tags : [];
  const mergedTags = Array.from(
    new Set([displayCategory, ...baseTags].filter(Boolean))
  );

  const attachments = (thinkData.attachments || []).map((att) => ({
    name: att.name,
    size: att.size || '',
    type: att.type || 'document',
    url: att.url || '',
  }));

  const payload = {
    name: thinkData.name || thinkData.clientName,
    email: thinkData.email || thinkData.clientEmail,
    title: title || message.slice(0, 80),
    description: description || message,
    message,
    category: backendCategory,
    solverType: thinkData.solverType || 'human',
    urgency,
    tags: mergedTags,
    attachments,
  };

  const res = await apiRequest('/thoughts', {
    method: 'POST',
    body: payload,
  });

  return normalizeThought(res.data?.thought, normalizeOpts);
}

export async function acceptThink(thinkId, normalizeOpts = {}) {
  const res = await apiRequest(`/thoughts/${thinkId}/accept`, {
    method: 'POST',
    body: {},
  });

  const conversation = res.data?.conversation
    ? normalizeConversation(res.data.conversation)
    : null;
  const think = res.data?.thought
    ? normalizeThought(
        {
          ...res.data.thought,
          assignedConsultantName:
            res.data.thought.assignedConsultantName ||
            conversation?.consultantName,
          assignedConsultantAvatar:
            res.data.thought.assignedConsultantAvatar ||
            conversation?.consultantAvatar,
        },
        normalizeOpts
      )
    : null;

  return {
    think,
    conversation,
    alreadyAccepted: Boolean(res.data?.alreadyAccepted),
  };
}

export async function updateThink(thinkId, updates, normalizeOpts = {}) {
  const body = {
    status: updates.status,
  };
  if (updates.solution !== undefined) body.solution = updates.solution;
  if (updates.aiResponse !== undefined) body.aiResponse = updates.aiResponse;
  if (updates.aiDiagnosticPlan !== undefined) {
    body.aiDiagnosticPlan = updates.aiDiagnosticPlan;
  }

  const res = await apiRequest(`/thoughts/${thinkId}/status`, {
    method: 'PATCH',
    body,
  });

  return normalizeThought(res.data?.thought, normalizeOpts);
}

export async function createReply({
  thoughtId,
  message,
  responderType = 'consultant',
  actionChecklist = [],
}) {
  const res = await apiRequest('/replies', {
    method: 'POST',
    body: {
      thought: thoughtId,
      thoughtId,
      message,
      responderType,
      actionChecklist,
    },
  });

  return {
    reply: normalizeReply(res.data?.reply),
    thought: res.data?.thought ? normalizeThought(res.data.thought) : null,
    emailNotification: res.data?.emailNotification || null,
  };
}

export async function getRepliesForThought(thoughtId) {
  const res = await apiRequest(`/replies/${thoughtId}`);
  const replies = res.data?.replies || [];
  return replies.map((r) => normalizeReply(r));
}

export async function getConversations() {
  const res = await apiRequest('/conversations');
  const list = res.data?.conversations || [];
  return list.map(normalizeConversation);
}

export async function sendMessage(conversationId, text, attachments = []) {
  const cleanAttachments = (attachments || []).map((att) => ({
    name: att.name,
    size: att.size || '',
  }));

  const res = await apiRequest(`/conversations/${conversationId}/messages`, {
    method: 'POST',
    body: {
      text: (text || '').trim(),
      attachments: cleanAttachments,
    },
  });

  return {
    message: normalizeMessage(res.data?.message, conversationId),
    conversation: res.data?.conversation
      ? normalizeConversation(res.data.conversation)
      : null,
  };
}

export async function markMessagesAsRead(conversationId) {
  const res = await apiRequest(`/conversations/${conversationId}/read`, {
    method: 'PATCH',
  });
  return res.data?.updatedCount ?? 0;
}

export async function deleteMessage(conversationId, messageId) {
  const res = await apiRequest(
    `/conversations/${conversationId}/messages/${messageId}`,
    {
      method: 'DELETE',
    }
  );
  return res.data?.deletedMessageId || messageId;
}

export async function getNotifications() {
  const res = await apiRequest('/notifications');
  const list = res.data?.notifications || [];
  return list.map(normalizeNotification);
}

export async function markNotificationRead(notifId) {
  const res = await apiRequest(`/notifications/${notifId}/read`, {
    method: 'PATCH',
  });
  return normalizeNotification(res.data?.notification);
}

export async function markAllNotificationsRead() {
  const res = await apiRequest('/notifications/read-all', {
    method: 'PATCH',
  });
  return res.data?.modifiedCount ?? 0;
}

export async function subscribeNewsletter(email, source = 'landing_footer') {
  const res = await apiRequest('/newsletter', {
    method: 'POST',
    body: { email: (email || '').trim(), source },
    skipAuth: true,
  });
  return {
    subscription: res.data?.subscription || null,
    alreadySubscribed: Boolean(res.data?.alreadySubscribed),
    message: res.message,
  };
}
