/**
 * Personal contact info filtering for mentor-student messages.
 * Strips phone numbers, emails, and social media handles from message content.
 */

const PHONE_REGEX = /(\+?\d{1,4}[\s.-]?)?(\(?\d{1,4}\)?[\s.-]?)?\d{3,4}[\s.-]?\d{3,4}/g;
const EMAIL_REGEX = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;
const SOCIAL_REGEX = /@[a-zA-Z0-9_]{2,30}/g;
const URL_REGEX = /https?:\/\/[^\s]+/g;

export function filterContactInfo(content: string): string {
  return content
    .replace(EMAIL_REGEX, '[email removed]')
    .replace(URL_REGEX, '[link removed]')
    .replace(PHONE_REGEX, '[phone removed]')
    .replace(SOCIAL_REGEX, '[handle removed]');
}
