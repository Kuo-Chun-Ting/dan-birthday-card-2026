/** @param {{src: string, alt: string}} content @returns {HTMLImageElement} */
export function createCharacter(content) {
  const character = new Image();
  character.className = 'character';
  character.decoding = 'async';
  character.fetchPriority = 'high';
  character.src = content.src;
  character.alt = content.alt;
  return character;
}
