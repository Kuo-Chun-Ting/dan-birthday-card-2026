import { enableSwipe } from './album-swipe.js';

/** @param {{src: string, alt: string}[]} photos @returns {HTMLElement} */
export function createAlbum(photos) {
  const album = document.createElement('section');
  album.className = 'album';
  album.setAttribute('aria-label', '我們的相簿');
  album.innerHTML = `
    <button class="album-open" type="button" aria-label="放大查看照片">
      <img class="album-photo" alt="" draggable="false">
    </button>
    <nav class="album-controls" aria-label="切換相簿照片">
      <button type="button" data-step="-1" aria-label="上一張">‹</button>
      <span class="album-count" role="status" aria-live="polite"></span>
      <button type="button" data-step="1" aria-label="下一張">›</button>
    </nav>`;
  const dialog = createViewer();
  const thumbnail = album.querySelector('.album-photo');
  const fullImage = dialog.querySelector('img');
  let index = 0;
  let renderVersion = 0;
  /** @type {Map<string, Promise<void>>} */
  const photoLoads = new Map();

  /** @returns {Promise<void>} */
  async function render() {
    const version = ++renderVersion;
    const photo = photos[index];
    setStatus('載入中…', true);
    try {
      await loadPhoto(photo.src);
    } catch {
      if (version === renderVersion) setStatus('載入失敗', false);
      return;
    }
    if (version !== renderVersion) return;
    thumbnail.src = photo.src;
    thumbnail.alt = photo.alt;
    thumbnail.classList.toggle('album-cover', index === 0);
    if (dialog.open) {
      fullImage.src = photo.src;
      fullImage.alt = photo.alt;
    }
    setStatus(`${index + 1} / ${photos.length}`, false);
    for (const step of [-1, 1]) {
      const neighbor = photos[(index + step + photos.length) % photos.length];
      void loadPhoto(neighbor.src).catch(() => {});
    }
  }

  /** @param {string} src @returns {Promise<void>} */
  function loadPhoto(src) {
    if (photoLoads.has(src)) return photoLoads.get(src);
    const image = new Image();
    image.src = src;
    const loaded = image.decode().catch((error) => {
      photoLoads.delete(src);
      throw error;
    });
    photoLoads.set(src, loaded);
    return loaded;
  }

  /** @param {string} text @param {boolean} busy @returns {void} */
  function setStatus(text, busy) {
    album.setAttribute('aria-busy', String(busy));
    dialog.setAttribute('aria-busy', String(busy));
    album.querySelector('.album-count').textContent = text;
    dialog.querySelector('.viewer-count').textContent = text;
  }

  /** @param {number} step @returns {void} */
  function changePhoto(step) {
    index = (index + step + photos.length) % photos.length;
    render();
  }

  for (const surface of [album, dialog]) {
    for (const button of surface.querySelectorAll('[data-step]')) {
      button.addEventListener('click', () => changePhoto(Number(button.dataset.step)));
    }
    surface.addEventListener('keydown', (event) => {
      if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return;
      event.preventDefault();
      event.stopPropagation();
      changePhoto(event.key === 'ArrowLeft' ? -1 : 1);
    });
  }
  const opener = album.querySelector('.album-open');
  enableSwipe(opener, changePhoto);
  enableSwipe(fullImage, changePhoto);
  opener.addEventListener('click', () => {
    dialog.showModal();
    render();
  });
  dialog.querySelector('.viewer-close').addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', (event) => {
    if (event.target === dialog) dialog.close();
  });
  render();
  // 放在相框外，避免相框的旋轉影響全螢幕檢視。
  const component = document.createElement('div');
  component.className = 'album-component';
  component.append(album, dialog);
  return component;
}

/** @returns {HTMLDialogElement} */
function createViewer() {
  const dialog = document.createElement('dialog');
  dialog.className = 'album-viewer';
  dialog.setAttribute('aria-label', '放大查看我們的相簿');
  dialog.innerHTML = `
    <div class="viewer-panel">
      <div class="viewer-bar">
        <span class="viewer-count" role="status" aria-live="polite"></span>
        <button class="viewer-close" type="button" autofocus aria-label="關閉相簿">關閉 ×</button>
      </div>
      <img class="viewer-photo" alt="" draggable="false">
      <nav class="viewer-controls" aria-label="切換放大的照片">
        <button type="button" data-step="-1" aria-label="上一張">← 上一張</button>
        <button type="button" data-step="1" aria-label="下一張">下一張 →</button>
      </nav>
    </div>`;
  return dialog;
}
