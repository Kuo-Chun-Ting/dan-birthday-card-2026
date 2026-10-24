import { loadPhoto } from './photo-loader.js';

/**
 * @param {{src: string, thumbnailSrc: string, alt: string}[]} photos
 * @param {(index: number) => void} onSelect
 * @param {{src: string}} background
 * @returns {{dialog: HTMLDialogElement, show: (index: number) => void}}
 */
export function createViewer(photos, onSelect, background) {
  const dialog = createDialog();
  dialog.style.setProperty('--viewer-artwork', `url("${new URL(background.src, document.baseURI).href}")`);
  const track = dialog.querySelector('.viewer-track');
  const count = dialog.querySelector('.viewer-count');
  const status = dialog.querySelector('.viewer-status');
  const retry = dialog.querySelector('.viewer-retry');
  const slides = photos.map(createSlide);
  track.append(...slides);
  let index = 0;
  let settleTimer;

  /** @param {number} selected @returns {void} */
  function selectPhoto(selected) {
    index = selected;
    count.textContent = `${index + 1} / ${photos.length}`;
    retry.hidden = true;
    status.textContent = slides[index].dataset.full ? '' : '正在載入清晰照片…';
    slides.forEach((slide, i) => slide.setAttribute('aria-hidden', String(i !== index)));
    for (const step of [-1, 0, 1]) {
      const neighbor = (index + step + photos.length) % photos.length;
      void showPreview(neighbor);
    }
    onSelect(index);
  }

  /** @param {number} selected @returns {Promise<void>} */
  async function showPreview(selected) {
    const photo = photos[selected];
    const slide = slides[selected];
    if (slide.dataset.full) return;
    try {
      await loadPhoto(photo.thumbnailSrc);
      if (!slide.dataset.full) slide.querySelector('img').src = photo.thumbnailSrc;
      slide.classList.add('has-photo');
    } catch {
      // 清晰照片仍可獨立載入；保留此頁的佔位提示。
    }
  }

  /** @returns {Promise<void>} */
  async function showFullPhoto() {
    if (!dialog.open) return;
    const selected = index;
    const photo = photos[selected];
    const slide = slides[selected];
    try {
      await loadPhoto(photo.src);
      slide.querySelector('img').src = photo.src;
      slide.dataset.full = 'true';
      slide.classList.add('has-photo');
      if (index !== selected || !dialog.open) return;
      status.textContent = '';
      retry.hidden = true;
      const next = photos[(selected + 1) % photos.length];
      void loadPhoto(next.src, 'low').catch(() => {});
    } catch {
      if (index !== selected || !dialog.open) return;
      status.textContent = '清晰照片暫時無法載入';
      retry.hidden = false;
    }
  }

  /** @param {number} selected @returns {void} */
  function goTo(selected) {
    selectPhoto(selected);
    track.scrollTo({ left: index * track.clientWidth, behavior: 'instant' });
    void showFullPhoto();
  }

  track.addEventListener('scroll', () => {
    if (!dialog.open || track.clientWidth === 0) return;
    const selected = Math.max(0, Math.min(photos.length - 1,
      Math.round(track.scrollLeft / track.clientWidth)));
    if (selected !== index) selectPhoto(selected);
    // 手指滑動時先顯示縮圖，停止滑動後才下載清晰照片。
    clearTimeout(settleTimer);
    settleTimer = setTimeout(showFullPhoto, 140);
  }, { passive: true });
  for (const button of dialog.querySelectorAll('[data-step]')) {
    button.addEventListener('click', () => {
      goTo((index + Number(button.dataset.step) + photos.length) % photos.length);
    });
  }
  dialog.addEventListener('keydown', (event) => {
    if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return;
    event.preventDefault();
    event.stopPropagation();
    goTo((index + (event.key === 'ArrowLeft' ? -1 : 1) + photos.length) % photos.length);
  });
  retry.addEventListener('click', () => {
    retry.hidden = true;
    status.textContent = '正在載入清晰照片…';
    void showPreview(index);
    void showFullPhoto();
  });
  dialog.querySelector('.viewer-close').addEventListener('click', () => dialog.close());
  dialog.addEventListener('close', () => clearTimeout(settleTimer));
  new ResizeObserver(() => {
    if (dialog.open) track.scrollTo({ left: index * track.clientWidth, behavior: 'instant' });
  }).observe(track);

  return {
    dialog,
    show(selected) {
      dialog.showModal();
      goTo(selected);
    },
  };
}

/** @param {{alt: string}} photo @param {number} index @returns {HTMLElement} */
function createSlide(photo, index) {
  const slide = document.createElement('div');
  slide.className = 'viewer-slide';
  slide.setAttribute('role', 'group');
  slide.setAttribute('aria-label', `第 ${index + 1} 張照片`);
  const placeholder = document.createElement('span');
  placeholder.className = 'viewer-placeholder';
  placeholder.textContent = '照片載入中…';
  const image = new Image();
  image.className = 'viewer-photo';
  image.alt = photo.alt;
  image.draggable = false;
  slide.append(placeholder, image);
  return slide;
}

/** @returns {HTMLDialogElement} */
function createDialog() {
  const dialog = document.createElement('dialog');
  dialog.className = 'album-viewer';
  dialog.setAttribute('aria-label', 'Along the Way');
  dialog.innerHTML = `
    <div class="viewer-composition">
    <header class="viewer-header">
      <h2 class="viewer-title">Along the Way</h2>
      <button class="viewer-close" type="button" autofocus aria-label="關閉相簿">
        <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m6 6 12 12M18 6 6 18"/></svg>
      </button>
    </header>
    <div class="viewer-track" role="region" aria-label="左右滑動瀏覽照片"></div>
    <footer class="viewer-footer">
      <div class="viewer-loading"><span class="viewer-status" role="status"></span>
        <button class="viewer-retry" type="button" hidden>重試</button>
      </div>
      <nav class="viewer-controls" aria-label="切換放大的照片">
        <button type="button" data-step="-1" aria-label="上一張">
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m14 5-7 7 7 7"/></svg>
        </button>
        <span class="viewer-count" aria-live="polite" aria-atomic="true"></span>
        <button type="button" data-step="1" aria-label="下一張">
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m10 5 7 7-7 7"/></svg>
        </button>
      </nav>
    </footer>
    </div>`;
  return dialog;
}
