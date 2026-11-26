const EMAIL_REGEX = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/gi;
const EMAIL_TEST_REGEX = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/i;
const PHONE_REGEX = /(\+?\d{1,4}[-.\s]?)?(\(?\d{2,4}\)?[-.\s]?)?\d{3,4}[-.\s]?\d{3,4}/g;
const SOCIAL_TEST_REGEX = /(whatsapp|telegram|insta|instagram|skype|call me at|reach me on|dm me at|my number is|ping me on|phone)/i;

export function inspectMessageForPrivacy(text) {
  if (!text || typeof text !== 'string') {
    return { isViolation: false, cleanText: text, violations: [] };
  }

  const violations = [];
  let containsViolation = false;

  if (EMAIL_TEST_REGEX.test(text)) {
    violations.push('Direct Email Address');
    containsViolation = true;
  }

  const phoneMatches = text.match(PHONE_REGEX);
  if (phoneMatches) {
    const realPhones = phoneMatches.filter(m => m.replace(/\D/g, '').length >= 8);
    if (realPhones.length > 0) {
      violations.push('Direct Phone Number');
      containsViolation = true;
    }
  }

  if (SOCIAL_TEST_REGEX.test(text) && /\d/.test(text)) {
    violations.push('External Contact Sharing Intent');
    containsViolation = true;
  }

  let maskedText = text
    .replace(EMAIL_REGEX, ' [EMAIL MASKED FOR PRIVACY] ')
    .replace(/(\+?\d{1,4}[-.\s]?)?(\(?\d{2,4}\)?[-.\s]?)?\d{3,4}[-.\s]?\d{3,4}/g, (match) => {
      if (match.replace(/\D/g, '').length >= 8) {
        return ' [PHONE MASKED FOR PRIVACY] ';
      }
      return match;
    });

  return {
    isViolation: containsViolation,
    cleanText: maskedText,
    violations,
    warningMessage: containsViolation
      ? 'OverThink Safety Guard: Off-platform contact sharing is restricted to protect your security and consultation guarantees.'
      : null
  };
}
