/** @param {string} text @param {string} variant @returns {HTMLParagraphElement} */
export function createSubtitle(text, variant = '') {
  const subtitle = document.createElement('p');
  subtitle.className = `subtitle ${variant}`.trim();
  subtitle.textContent = text;
  return subtitle;
}
