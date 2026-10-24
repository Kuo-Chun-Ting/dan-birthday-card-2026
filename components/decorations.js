/** @returns {HTMLDivElement} */
export function createDecorations() {
  const decorations = document.createElement('div');
  decorations.className = 'decorations';
  decorations.setAttribute('aria-hidden', 'true');
  decorations.innerHTML = '<span class="star star-one">✧</span><span class="star star-two">✦</span><div class="border"></div>';
  return decorations;
}
