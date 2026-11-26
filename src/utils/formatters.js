export function calculateTimeRemaining(createdAtTimestamp, deadlineHours = 24) {
  const createdDate = new Date(createdAtTimestamp).getTime();
  const deadlineDate = createdDate + deadlineHours * 60 * 60 * 1000;
  const now = Date.now();
  const diff = deadlineDate - now;

  if (diff <= 0) {
    return {
      isExpired: true,
      hours: 0,
      minutes: 0,
      seconds: 0,
      formatted: '00h 00m 00s (AI Fallback Active)',
      percentRemaining: 0
    };
  }

  const hours = Math.floor(diff / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diff % (1000 * 60)) / 1000);

  const totalDuration = deadlineHours * 60 * 60 * 1000;
  const percentRemaining = Math.max(0, Math.min(100, Math.round((diff / totalDuration) * 100)));

  return {
    isExpired: false,
    hours,
    minutes,
    seconds,
    formatted: `${hours.toString().padStart(2, '0')}h ${minutes.toString().padStart(2, '0')}m ${seconds.toString().padStart(2, '0')}s`,
    percentRemaining
  };
}

export function formatDate(timestamp) {
  if (!timestamp) return '';
  const date = new Date(timestamp);
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date);
}

export function timeAgo(timestamp) {
  if (!timestamp) return '';
  const seconds = Math.floor((Date.now() - new Date(timestamp).getTime()) / 1000);

  let interval = seconds / 31536000;
  if (interval > 1) return Math.floor(interval) + 'y ago';
  interval = seconds / 2592000;
  if (interval > 1) return Math.floor(interval) + 'mo ago';
  interval = seconds / 86400;
  if (interval > 1) return Math.floor(interval) + 'd ago';
  interval = seconds / 3600;
  if (interval > 1) return Math.floor(interval) + 'h ago';
  interval = seconds / 60;
  if (interval > 1) return Math.floor(interval) + 'm ago';
  return 'Just now';
}

export function formatCurrency(amount, currency = 'USD') {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    maximumFractionDigits: 0
  }).format(amount);
}
