/**
 * Extract initials from a full name
 * @param {string} name - Full name (e.g., "John Doe")
 * @returns {string} Initials (e.g., "JD")
 */
export const getInitials = (name) => {
  if (!name) return '';

  const words = name.trim().split(/\s+/);

  if (words.length === 1) {
    // Single word: take first two characters
    return words[0].substring(0, 2).toUpperCase();
  }

  // Multiple words: take first letter of first and last word
  const firstInitial = words[0][0];
  const lastInitial = words[words.length - 1][0];

  return (firstInitial + lastInitial).toUpperCase();
};
