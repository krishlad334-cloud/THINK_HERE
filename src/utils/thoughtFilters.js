export function isClientThought(thought, user) {
  if (!thought || !user) return false;
  const thoughtUserId =
    thought.clientId ||
    (typeof thought.user === 'object' ? thought.user?._id || thought.user?.id : thought.user);
  if (thoughtUserId && user.id && thoughtUserId === user.id) return true;
  if (
    user.id === 'client_001' &&
    (thoughtUserId === 'client_001' || thoughtUserId === 'user-client-1')
  ) {
    return true;
  }
  if (
    user.email &&
    (thought.clientEmail || thought.email) &&
    (thought.clientEmail || thought.email).toLowerCase() === user.email.toLowerCase()
  ) {
    return true;
  }
  if (
    (thought.clientName || thought.name) &&
    user.name &&
    (thought.clientName || thought.name).trim().toLowerCase() === user.name.trim().toLowerCase()
  ) {
    return true;
  }
  return false;
}

export function isConsultantThought(thought, user) {
  if (!thought || !user?.id) return false;
  const consId =
    thought.consultantId ||
    thought.assignedConsultantId ||
    (typeof thought.assignedConsultant === 'object'
      ? thought.assignedConsultant?._id || thought.assignedConsultant?.id
      : thought.assignedConsultant);
  return consId === user.id;
}
