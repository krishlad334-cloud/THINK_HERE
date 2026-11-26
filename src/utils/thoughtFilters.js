export function isClientThought(thought, user) {
  if (!thought || !user) return false;
  if (thought.clientId && user.id && thought.clientId === user.id) return true;
  if (
    user.id === 'client_001' &&
    (thought.clientId === 'client_001' || thought.clientId === 'user-client-1')
  ) {
    return true;
  }
  if (
    user.email &&
    thought.clientEmail &&
    thought.clientEmail.toLowerCase() === user.email.toLowerCase()
  ) {
    return true;
  }
  if (
    thought.clientName &&
    user.name &&
    thought.clientName.trim().toLowerCase() === user.name.trim().toLowerCase()
  ) {
    return true;
  }
  return false;
}

export function isConsultantThought(thought, user) {
  if (!thought || !user?.id) return false;
  return thought.consultantId === user.id || thought.assignedConsultantId === user.id;
}
