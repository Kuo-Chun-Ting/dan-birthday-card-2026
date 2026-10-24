/** @param {{src: string, alt: string}} content @returns {HTMLElement} */
export function createBackground(content) {
  const background = document.createElement('div');
  background.className = 'background';
  const image = new Image();
  image.src = content.src;
  image.alt = content.alt;
  background.append(image);
  return background;
}
