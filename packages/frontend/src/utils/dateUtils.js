/**
 * Returns true when a todo item is overdue:
 * - has a dueDate set
 * - is not completed
 * - dueDate is strictly before today's local calendar date (today itself is NOT overdue)
 *
 * @param {string|null|undefined} dueDate - ISO 8601 date string (YYYY-MM-DD) or falsy
 * @param {number|boolean} completed - 0/false = incomplete, 1/true = complete
 * @returns {boolean}
 */
export function isOverdue(dueDate, completed) {
  if (completed) return false;
  if (!dueDate) return false;
  return new Date(dueDate) < new Date(new Date().toDateString());
}

/**
 * Formats an ISO 8601 date string into a human-readable locale string.
 *
 * @param {string|null|undefined} dateString - ISO 8601 date string or falsy
 * @returns {string|null} - e.g. "March 25, 2026" or null for absent dates
 */
export function formatDate(dateString) {
  if (!dateString) return null;
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}
