/** @param {string} text @returns {HTMLElement} */
export function createLetter(text) {
  const letter = document.createElement('section');
  letter.className = 'letter';
  letter.setAttribute('aria-label', text ? '寫給你的話' : '留給你親自寫的空白信紙');
  const lines = document.createElement('div');
  lines.className = 'writing-lines';
  lines.setAttribute('aria-hidden', 'true');
  const message = document.createElement('div');
  message.className = 'letter-message';
  message.textContent = text;
  letter.append(lines, message);
  return letter;
}
