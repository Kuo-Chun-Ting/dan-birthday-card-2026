/** @param {{greeting: string}} content @returns {HTMLHeadingElement} */
export function createTitle(content) {
  const title = document.createElement('h1');
  title.className = 'headline';
  title.textContent = content.greeting;
  return title;
}
