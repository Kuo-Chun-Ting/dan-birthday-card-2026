/** @param {string} text @param {{after: string, src: string, alt: string}} [sticker] @returns {HTMLElement} */
export function createLetter(text, sticker) {
  const letter = document.createElement('section');
  letter.className = 'letter';
  letter.setAttribute('aria-label', text ? '寫給你的話' : '留給你親自寫的空白信紙');
  const message = document.createElement('div');
  message.className = 'letter-message';
  message.append(...text.split('\n\n').map(paragraph => createLetterParagraph(paragraph, sticker)));
  letter.append(message);
  return letter;
}

/** @param {string} text @param {{after: string, src: string, alt: string}} [sticker] @returns {HTMLParagraphElement} */
function createLetterParagraph(text, sticker) {
  const paragraph = document.createElement('p');
  paragraph.textContent = text;
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
    paragraph.replaceChildren(text.slice(0, stickerIndex), greeting, text.slice(insertionPoint));
  }
  return paragraph;
}
