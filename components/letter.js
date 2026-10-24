/** @param {string} text @param {{after: string, src: string, alt: string}} [sticker] @returns {HTMLElement} */
export function createLetter(text, sticker) {
  const letter = document.createElement('section');
  letter.className = 'letter';
  letter.setAttribute('aria-label', text ? '寫給你的話' : '留給你親自寫的空白信紙');
  const lines = document.createElement('div');
  lines.className = 'writing-lines';
  lines.setAttribute('aria-hidden', 'true');
  const message = document.createElement('div');
  message.className = 'letter-message';
  message.textContent = text;
  const stickerIndex = sticker ? text.indexOf(sticker.after) : -1;
  if (stickerIndex !== -1) {
    const insertionPoint = stickerIndex + sticker.after.length;
    const image = new Image();
    image.className = 'letter-sticker';
    image.src = sticker.src;
    image.alt = sticker.alt;
    image.width = 28;
    image.height = 28;
    const greeting = document.createElement('span');
    greeting.className = 'letter-sticker-anchor';
    greeting.append(sticker.after, image);
    message.replaceChildren(text.slice(0, stickerIndex), greeting, text.slice(insertionPoint));
  }
  letter.append(lines, message);
  return letter;
}
