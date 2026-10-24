/** @typedef {'card' | 'album'} MusicScene */
/** @typedef {{source: AudioBufferSourceNode, gain: GainNode}} Voice */

/** @param {{card: string, album: string}} tracks */
export function createMusic(tracks) {
  const buttons = [];
  const buffers = new Map();
  /** @type {AudioContext | undefined} */
  let context;
  /** @type {Voice | undefined} */
  let voice;
  /** @type {MusicScene} */
  let scene = 'card';
  let enabled = false;
  let loading = false;
  let failed = false;
  let revision = 0;
  let autoplayPending = true;

  /** @returns {void} */
  function render() {
    const label = failed ? '音樂載入失敗，點擊重試' :
      !enabled ? '播放音樂' : loading ? '音樂載入中，點擊取消' : '暫停音樂';
    for (const button of buttons) {
      button.setAttribute('aria-label', label);
      button.title = label;
      button.dataset.playing = String(enabled && !loading);
      button.dataset.loading = String(loading);
    }
  }

  /** @param {MusicScene} selected @returns {Promise<AudioBuffer>} */
  function loadBuffer(selected) {
    if (!buffers.has(selected)) {
      const pending = fetch(tracks[selected])
        .then((response) => {
          if (!response.ok) throw new Error(`Audio request failed: ${response.status}`);
          return response.arrayBuffer();
        })
        .then((data) => context.decodeAudioData(data))
        .catch((error) => { buffers.delete(selected); throw error; });
      buffers.set(selected, pending);
    }
    return buffers.get(selected);
  }

  /** @param {Voice | undefined} previous @returns {void} */
  function fadeOut(previous) {
    if (!previous) return;
    const now = context.currentTime;
    previous.gain.gain.cancelScheduledValues(now);
    previous.gain.gain.setValueAtTime(previous.gain.gain.value, now);
    previous.gain.gain.linearRampToValueAtTime(0, now + 0.45);
    previous.source.stop(now + 0.46);
  }

  /** @param {AudioBuffer} buffer @returns {void} */
  function playBuffer(buffer) {
    const source = context.createBufferSource();
    const gain = context.createGain();
    source.buffer = buffer;
    source.loop = true;
    source.connect(gain).connect(context.destination);
    gain.gain.setValueAtTime(0, context.currentTime);
    gain.gain.linearRampToValueAtTime(0.48, context.currentTime + 0.45);
    source.onended = () => { source.disconnect(); gain.disconnect(); };
    source.start();
    fadeOut(voice);
    voice = { source, gain };
  }

  /** @returns {Promise<void>} */
  async function playScene() {
    const version = ++revision;
    loading = true;
    failed = false;
    render();
    try {
      const buffer = await loadBuffer(scene);
      if (version !== revision || !enabled) return;
      playBuffer(buffer);
      loading = false;
      render();
      void loadBuffer(scene === 'card' ? 'album' : 'card').catch(() => {});
    } catch {
      if (version !== revision) return;
      stop();
      failed = true;
      render();
    }
  }

  /** @returns {void} */
  function stop() {
    cancelAutoplay();
    ++revision;
    enabled = false;
    loading = false;
    fadeOut(voice);
    voice = undefined;
    render();
  }

  /** @returns {Promise<void>} */
  async function toggle() {
    cancelAutoplay();
    if (enabled) { stop(); return; }
    context ??= new AudioContext();
    enabled = true;
    loading = true;
    failed = false;
    const version = ++revision;
    render();
    try {
      // Resume directly from the tap so Safari can allow sound.
      await context.resume();
      if (version === revision && enabled) await playScene();
    } catch {
      if (version !== revision) return;
      stop();
      failed = true;
      render();
    }
  }

  /** @returns {void} */
  function cancelAutoplay() {
    autoplayPending = false;
    document.removeEventListener('click', autoplay);
  }

  /** @returns {Promise<void>} */
  async function autoplay() {
    if (!autoplayPending || document.hidden) return;
    try {
      context ??= new AudioContext();
      await context.resume();
      if (autoplayPending && !document.hidden) await toggle();
    } catch {
      // A blocked autoplay attempt can be retried by the next click.
    }
  }

  document.addEventListener('click', autoplay);
  void autoplay();

  document.addEventListener('visibilitychange', () => {
    if (document.hidden) stop();
  });

  return {
    /** @param {MusicScene} selected @returns {void} */
    setScene(selected) {
      if (scene === selected) return;
      scene = selected;
      if (enabled) void playScene();
    },
    /** @returns {HTMLButtonElement} */
    createButton() {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'music-toggle';
      button.innerHTML = `<svg class="music-icon-playing" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M9 17V5l11-2v12M9 8l11-2"/>
        <ellipse cx="6" cy="17" rx="3" ry="2" fill="currentColor"/>
        <ellipse cx="17" cy="15" rx="3" ry="2" fill="currentColor"/>
      </svg>
      <svg class="music-icon-muted" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M9 17v-4M9 5l11-2v12M13 7.27 20 6"/>
        <ellipse cx="6" cy="17" rx="3" ry="2" fill="currentColor"/>
        <ellipse cx="17" cy="15" rx="3" ry="2" fill="currentColor"/>
        <path d="M3 3 21 21"/>
      </svg>`;
      button.addEventListener('click', () => { void toggle(); });
      buttons.push(button);
      render();
      return button;
    },
  };
}
