/**
 * Contact Privacy & Moderation Guard
 * Requirement 10: Clients and consultants must communicate exclusively inside THINK.
 * Automatically detects attempts to share personal mobile numbers, emails, WhatsApp, etc.
 */

// Patterns to detect phone numbers, emails, social handles
const EMAIL_REGEX = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/gi;
const PHONE_REGEX = /(\+?\d{1,4}[-.\s]?)?(\(?\d{2,4}\)?[-.\s]?)?\d{3,4}[-.\s]?\d{3,4}/g;
const SOCIAL_REGEX = /(whatsapp|telegram|insta|instagram|skype|call me at|reach me on|dm me at|my number is|ping me on|phone)/gi;

export function inspectMessageForPrivacy(text) {
  if (!text || typeof text !== 'string') {
    return { isViolation: false, cleanText: text, violations: [] };
  }

  const violations = [];
  let containsViolation = false;

  // Check email
  if (EMAIL_REGEX.test(text)) {
    violations.push('Direct Email Address');
    containsViolation = true;
  }

  // Check phone number (look for at least 7-10 consecutive or hyphenated digits)
  const phoneMatches = text.match(PHONE_REGEX);
  if (phoneMatches) {
    // Filter out simple small numbers like "10 days" or "step 1"
    const realPhones = phoneMatches.filter(m => m.replace(/\D/g, '').length >= 8);
    if (realPhones.length > 0) {
      violations.push('Direct Phone Number');
      containsViolation = true;
    }
  }

  // Check off-platform keywords with digits or links
  if (SOCIAL_REGEX.test(text) && /\d/.test(text)) {
    violations.push('External Contact Sharing Intent');
    containsViolation = true;
  }

  // Generate masked text
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
      ? 'THINK Safety Guard: Off-platform contact sharing is restricted to protect your security and consultation guarantees.'
      : null
  };
}
