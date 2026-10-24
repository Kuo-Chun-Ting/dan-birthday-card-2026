import { enableSwipe } from './album-swipe.js';
import { createViewer } from './album-viewer.js';
import { loadPhoto, warmThumbnails } from './photo-loader.js';

/** @param {{src: string, thumbnailSrc: string, alt: string}[]} photos @param {{src: string}} background @returns {HTMLElement} */
export function createAlbum(photos, background) {
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
  const thumbnail = album.querySelector('.album-photo');
  const count = album.querySelector('.album-count');
  const opener = album.querySelector('.album-open');
  const viewer = createViewer(photos, selectPhoto, background);
  let index = 0;
  let renderVersion = 0;

  /** @param {number} selected @returns {Promise<void>} */
  async function selectPhoto(selected) {
    index = selected;
    const version = ++renderVersion;
    const photo = photos[index];
    count.textContent = `${index + 1} / ${photos.length}`;
    album.setAttribute('aria-busy', 'true');
    try {
      await loadPhoto(photo.thumbnailSrc);
      if (version !== renderVersion) return;
      thumbnail.src = photo.thumbnailSrc;
      thumbnail.alt = photo.alt;
      thumbnail.classList.toggle('album-cover', index === 0);
    } catch {
      if (version !== renderVersion) return;
      count.textContent = '輕點重試';
    }
    album.setAttribute('aria-busy', 'false');
  }

  /** @param {number} step @returns {void} */
  function changePhoto(step) {
    void selectPhoto((index + step + photos.length) % photos.length);
  }
  for (const button of album.querySelectorAll('[data-step]')) {
    button.addEventListener('click', () => changePhoto(Number(button.dataset.step)));
  }
  album.addEventListener('keydown', (event) => {
    if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return;
    event.preventDefault();
    changePhoto(event.key === 'ArrowLeft' ? -1 : 1);
  });
  enableSwipe(opener, changePhoto);
  opener.addEventListener('click', () => viewer.show(index));
  void selectPhoto(0);
  warmThumbnails(photos);
  // 放在相框外，避免相框的旋轉影響全螢幕檢視。
  const component = document.createElement('div');
  component.className = 'album-component';
  component.append(album, viewer.dialog);
  return component;
}
