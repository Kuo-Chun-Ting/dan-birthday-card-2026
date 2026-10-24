/** @type {Map<string, Promise<void>>} */
const photoLoads = new Map();
const warmedAlbums = new Set();

/** @param {string} src @param {'high' | 'low'} priority @returns {Promise<void>} */
export function loadPhoto(src, priority = 'high') {
  if (photoLoads.has(src)) return photoLoads.get(src);
  const image = new Image();
  image.fetchPriority = priority;
  image.src = src;
  const loaded = image.decode().catch((error) => {
    photoLoads.delete(src);
    throw error;
  });
  photoLoads.set(src, loaded);
  return loaded;
}

/** @param {{thumbnailSrc: string}[]} photos @returns {void} */
export function warmThumbnails(photos) {
  const key = photos.map((photo) => photo.thumbnailSrc).join('|');
  if (warmedAlbums.has(key)) return;
  warmedAlbums.add(key);
  let next = 0;
  /** @returns {Promise<void>} */
  async function worker() {
    while (next < photos.length) {
      const photo = photos[next++];
      await loadPhoto(photo.thumbnailSrc, 'low').catch(() => {});
    }
  }
  /** @returns {void} */
  function start() {
    void worker();
    void worker();
  }
  if (document.readyState === 'complete') start();
  else window.addEventListener('load', start, { once: true });
}
