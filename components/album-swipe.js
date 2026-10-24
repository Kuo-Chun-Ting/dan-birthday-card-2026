/** @param {HTMLElement} surface @param {(step: number) => void} changePhoto @returns {void} */
export function enableSwipe(surface, changePhoto) {
  /** @type {{id: number, x: number, y: number} | null} */
  let start = null;
  let suppressClick = false;

  surface.addEventListener('pointerdown', (event) => {
    suppressClick = false;
    if (event.pointerType !== 'touch' || !event.isPrimary) {
      start = null;
      return;
    }
    start = { id: event.pointerId, x: event.clientX, y: event.clientY };
  });

  surface.addEventListener('pointerup', (event) => {
    if (!start || event.pointerId !== start.id) return;
    const dx = event.clientX - start.x;
    const dy = event.clientY - start.y;
    start = null;
    if (Math.abs(dx) < 35 || Math.abs(dx) < Math.abs(dy) * 1.3) return;
    suppressClick = true;
    changePhoto(dx < 0 ? 1 : -1);
  });

  surface.addEventListener('pointercancel', () => {
    start = null;
    suppressClick = false;
  });

  // 阻止滑動後瀏覽器產生的點擊；新觸碰和鍵盤啟用仍正常運作。
  surface.addEventListener('click', (event) => {
    if (!suppressClick || event.detail === 0) return;
    event.preventDefault();
    event.stopImmediatePropagation();
    suppressClick = false;
  }, { capture: true });
}
