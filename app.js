/**
 * 007 // CRAIG ERA (2006-2021)
 * Application Engine: Local Backdrops, Breathing Spotlight Aperture,
 * 2.39:1 Letterbox Climax, Mechanical Vernier Scale, Dual-Deck Crossfade Audio,
 * and Minimalist Sonic Legacy Player.
 */

(function () {
  'use strict';

  // ==========================================
  // 1. STATE & CONSTANTS
  // ==========================================
  const STORAGE_KEY_LANG = 'bond_archive_lang';
  const STORAGE_KEY_VOL = 'bond_archive_master_vol';
  const DEFAULT_LANG = 'zh';
  const DEFAULT_MASTER_VOLUME = 0.3;

  // Exact midpoint targets for 5 equal 20% discrete scroll intervals ((i + 0.5) / 5)
  const ACT_PROGRESS_TARGETS = [0.1, 0.3, 0.5, 0.7, 0.9];

  // Fallback atmospheric linear gradients layered underneath local static backdrops
  const ACT_FALLBACK_GRADIENTS = [
    'linear-gradient(160deg, rgba(12, 29, 26, 0.96) 0%, rgba(9, 19, 18, 0.98) 55%, #060908 100%)',
    'linear-gradient(160deg, rgba(30, 22, 16, 0.96) 0%, rgba(20, 15, 11, 0.98) 55%, #0B0806 100%)',
    'linear-gradient(160deg, rgba(16, 25, 34, 0.96) 0%, rgba(11, 17, 23, 0.98) 55%, #070A0D 100%)',
    'linear-gradient(160deg, rgba(30, 20, 14, 0.96) 0%, rgba(19, 13, 9, 0.98) 55%, #090604 100%)',
    'linear-gradient(160deg, rgba(22, 24, 28, 0.96) 0%, rgba(15, 17, 20, 0.98) 55%, #08090B 100%)'
  ];

  const CROSSFADE_DURATION_MS = 1200;
  const INITIAL_AUDIO_FADE_MS = 800;
  const MAX_AMBIENT_GAIN = 1.0;
  const GAIN_COLLAPSE_DELAY_MS = 300;

  const prefersReducedMotion = Boolean(
    typeof window !== 'undefined' &&
    window.matchMedia &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
  );

  let currentLang = DEFAULT_LANG;
  let currentActIndex = 0;
  let oneShotTimeline = null;
  let lastWindowWidth = typeof window !== 'undefined' ? window.innerWidth : 0;
  let resizeTimerId = null;
  let artifactsRevealed = false;
  let artifactsObserver = null;

  // Dual-deck scroll-synced ambient audio engine + unified master volume
  const deckA = typeof Audio !== 'undefined' ? new Audio() : null;
  const deckB = typeof Audio !== 'undefined' ? new Audio() : null;
  [deckA, deckB].forEach((deck) => {
    if (deck) {
      deck.loop = true;
      deck.preload = 'none';
      deck.volume = 0;
    }
  });
  let masterVolume = DEFAULT_MASTER_VOLUME;
  let deckALogicalGain = 0;
  let deckBLogicalGain = 0;
  let isDraggingGain = false;
  let collapseGainTimer = null;
  let ambientEnabled = true;
  let pendingAutoplayUnlock = false;
  let unlockListenersBound = false;
  let inStageAudioZone = true;
  let inEpilogueZone = false;
  let activeAmbientDeck = deckA;
  let ambientTrackIndex = -1;
  let crossfadeRafId = null;

  // Silent Film Epilogue & 007 -> HN STUDIO Morph State
  const EPILOGUE_AUDIO_FADE_MS = 1800;
  const MORPH_PATHS_007 = [
    'M 96 22 C 81 22 72 39 72 60 C 72 81 81 98 96 98',
    'M 96 22 C 111 22 120 39 120 60 C 120 81 111 98 96 98',
    'M 180 22 C 165 22 156 39 156 60 C 156 81 165 98 180 98',
    'M 180 22 C 195 22 204 39 204 60 C 204 81 195 98 180 98',
    'M 236 22 C 253 22 271 22 288 22 C 273 47 259 73 244 98'
  ];
  const MORPH_PATHS_HN = [
    'M 118 22 C 118 35 118 47 118 60 C 118 73 118 85 118 98',
    'M 118 60 C 126 60 134 60 142 60 C 150 60 158 60 166 60',
    'M 166 22 C 166 35 166 47 166 60 C 166 73 166 85 166 98',
    'M 194 22 C 194 35 194 47 194 60 C 194 73 194 85 194 98',
    'M 194 22 C 210 47 226 73 242 98 C 242 73 242 47 242 22'
  ];
  let epilogueObserver = null;
  let epilogueCreditsStarted = false;
  let epilogueCreditsPlayed = false;
  let epilogueTimeline = null;
  let epilogueMorphTimeline = null;
  let epilogueSfxTimers = [];
  let isHnMorphOpen = false;

  // Interactive Darkroom Exhibit State (persists across bilingual re-renders)
  const gearState = {
    focusedId: null,
    activeHotspotId: null,
    db5LightsOn: false,
    watchAngle: 0,
    watchRatchetStep: 0,
    bezelHideTimer: null,
    ppkUnlocked: false,
    ppkScanning: false,
    ppkHoverTimer: null,
    ppkScanTimer: null
  };
  let gearAudioCtx = null;
  let darkroomInitialized = false;

  // Verify that SITE_DATA is loaded
  const siteData = typeof SITE_DATA !== 'undefined' ? SITE_DATA : (window.SITE_DATA || globalThis.SITE_DATA);
  if (!siteData) {
    console.error('[007 ARCHIVE ERROR] SITE_DATA is missing. Please check data.js.');
    return;
  }

  // ==========================================
  // 2. DOM CACHE
  // ==========================================
  const DOM = {
    html: document.documentElement,
    mainContent: document.getElementById('main-content'),

    // Nav
    navHeader: document.querySelector('.site-header'),
    navHomeBtn: document.getElementById('nav-home-btn'),
    masterAudioControl: document.getElementById('master-audio-control'),
    soundToggleBtn: document.getElementById('global-sound-btn'),
    audioGainMeter: document.getElementById('audio-gain-meter'),
    gainBars: document.querySelectorAll('.gain-bar'),
    langBtnEn: document.getElementById('lang-btn-en'),
    langBtnZh: document.getElementById('lang-btn-zh'),

    // Hero / Prologue
    heroSection: document.getElementById('hero'),
    heroInner: document.querySelector('#hero .hero-inner'),
    heroSilhouetteWrap: document.querySelector('#hero .hero-silhouette-wrap'),
    heroMainTitle: document.getElementById('hero-main-title'),
    heroTitleTranslation: document.getElementById('hero-title-translation'),
    heroSubtitle: document.getElementById('hero-subtitle'),
    heroLead: document.getElementById('hero-lead'),
    heroScrollPrompt: document.getElementById('hero-scroll-prompt'),
    heroScrollHint: document.getElementById('hero-scroll-hint'),

    // Widescreen Cinema Stage
    oneShotStage: document.getElementById('one-shot-stage'),
    cinemaViewport: document.getElementById('cinema-viewport'),
    actBgs: document.querySelectorAll('.act-bg'),
    actBackdrops: document.querySelectorAll('.act-backdrop'),
    skyfallRain: document.querySelector('.skyfall-rain'),

    // L2 / L3 Stage Typography (Centered Two-Line Minimalist HUD)
    hudSubtitlesContent: document.getElementById('hud-subtitles-content'),
    hudFilmTitle: document.getElementById('hud-film-title'),
    hudQuoteText: document.getElementById('hud-quote-text'),

    // Crosshair Dossier Easter Egg
    dossierWidget: document.getElementById('stage-dossier-widget'),
    dossierCrosshairBtn: document.getElementById('dossier-crosshair-btn'),
    dossierPopover: document.getElementById('dossier-popover'),
    dossierLabelDirector: document.getElementById('dossier-label-director'),
    dossierLabelLocation: document.getElementById('dossier-label-location'),
    dossierLabelGear: document.getElementById('dossier-label-gear'),
    dossierValDirector: document.getElementById('dossier-val-director'),
    dossierValLocation: document.getElementById('dossier-val-location'),
    dossierValGear: document.getElementById('dossier-val-gear'),

    // Mechanical Vernier Scale Ruler
    stageRuler: document.getElementById('stage-ruler'),
    vernierMajorTicks: document.querySelectorAll('.vernier-major-tick'),
    rulerNodes: document.querySelectorAll('.ruler-node'),

    // Artifacts Section
    artifactsSectionIdx: document.getElementById('artifacts-section-idx'),
    artifactsSectionCat: document.getElementById('artifacts-section-cat'),
    artifactsTitle: document.getElementById('artifacts-title'),
    artifactsGridContainer: document.getElementById('artifacts-grid-container'),

    // Epilogue Stage & 007 -> HN STUDIO Morph
    epilogueStage: document.getElementById('epilogue-stage'),
    epilogueTribute: document.getElementById('epilogue-tribute'),
    epilogueTributeMain: document.getElementById('epilogue-tribute-main'),
    epilogueTributeCredit: document.getElementById('epilogue-tribute-credit'),
    epilogueReturn: document.getElementById('epilogue-return'),
    epilogueReturnText: document.getElementById('epilogue-return-text'),
    epilogueFinal: document.getElementById('epilogue-final'),
    curtainQuote: document.getElementById('curtain-quote'),
    epilogueHnTrigger: document.getElementById('epilogue-hn-trigger'),
    hnMorphStage: document.getElementById('hn-morph-stage'),
    hnMorphClose: document.getElementById('hn-morph-close'),
    hnMorphSvg: document.getElementById('hn-morph-svg'),
    hnMorphPaths: document.querySelectorAll('.hn-morph-path'),
    hnMorphStrokesSheen: document.getElementById('hn-morph-strokes-sheen'),
    hnSheenMaskRect: document.getElementById('hn-sheen-mask-rect'),
    hnMorphWordmark: document.getElementById('hn-morph-wordmark'),
    hnMorphSubmark: document.getElementById('hn-morph-submark'),
    hnMorphHint: document.getElementById('hn-morph-hint')
  };

  // ==========================================
  // 3. RENDER METHODS
  // ==========================================

  function renderStaticText(data) {
    document.title = data.meta.title;
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute('content', data.meta.description);
    }

    // Navigation & Sound Button
    if (DOM.navHomeBtn && data.curtainCall && data.curtainCall.backToTopAria) {
      DOM.navHomeBtn.setAttribute('aria-label', data.curtainCall.backToTopAria);
    }
    updateSoundToggleUI();

    // Hero Section
    if (DOM.heroMainTitle) DOM.heroMainTitle.textContent = data.hero.mainTitle;
    if (DOM.heroTitleTranslation) DOM.heroTitleTranslation.textContent = data.hero.titleTranslation;
    if (DOM.heroSubtitle) DOM.heroSubtitle.textContent = data.hero.subtitle;
    if (DOM.heroLead) DOM.heroLead.textContent = data.hero.leadParagraph;
    if (DOM.heroScrollPrompt) DOM.heroScrollPrompt.textContent = data.hero.scrollPrompt;
    if (DOM.heroScrollHint) DOM.heroScrollHint.textContent = data.hero.scrollHint;

    // Crosshair Dossier Labels
    if (data.stage && data.stage.dossierLabels) {
      if (DOM.dossierLabelDirector) DOM.dossierLabelDirector.textContent = data.stage.dossierLabels.director;
      if (DOM.dossierLabelLocation) DOM.dossierLabelLocation.textContent = data.stage.dossierLabels.location;
      if (DOM.dossierLabelGear) DOM.dossierLabelGear.textContent = data.stage.dossierLabels.gear;
      if (DOM.dossierCrosshairBtn) {
        DOM.dossierCrosshairBtn.setAttribute('aria-label', data.stage.dossierToggleAria);
      }
    }

    // Artifacts Section Headers (Subtitle omitted for zero-clutter darkroom gallery)
    if (DOM.artifactsSectionIdx) DOM.artifactsSectionIdx.textContent = data.artifactsSection.sectionIndex;
    if (DOM.artifactsSectionCat) DOM.artifactsSectionCat.textContent = data.artifactsSection.sectionCategory;
    if (DOM.artifactsTitle) DOM.artifactsTitle.textContent = data.artifactsSection.title;

    // Silent Film Epilogue & HN Studio Easter Egg Copy
    if (data.curtainCall) {
      if (DOM.epilogueTributeMain && data.curtainCall.tributeMain) {
        DOM.epilogueTributeMain.textContent = data.curtainCall.tributeMain;
      }
      if (DOM.epilogueTributeCredit && data.curtainCall.tributeCredit) {
        DOM.epilogueTributeCredit.textContent = data.curtainCall.tributeCredit;
      }
      if (DOM.epilogueReturnText && data.curtainCall.willReturn) {
        DOM.epilogueReturnText.textContent = data.curtainCall.willReturn;
      }
      if (DOM.curtainQuote) DOM.curtainQuote.textContent = data.curtainCall.quote;
      if (DOM.hnMorphWordmark && data.curtainCall.hnStudioWordmark) {
        DOM.hnMorphWordmark.textContent = data.curtainCall.hnStudioWordmark;
      }
      if (DOM.hnMorphSubmark && data.curtainCall.hnStudioSub) {
        DOM.hnMorphSubmark.textContent = data.curtainCall.hnStudioSub;
      }
      if (DOM.hnMorphHint && data.curtainCall.hnReturnHint) {
        DOM.hnMorphHint.textContent = data.curtainCall.hnReturnHint;
      }
      if (DOM.hnMorphClose && data.curtainCall.hnCloseAria) {
        DOM.hnMorphClose.setAttribute('aria-label', data.curtainCall.hnCloseAria);
      }
    }
  }

  /**
   * Update L2/L3 Editorial Bottom Block & Crosshair Dossier Content
   * @param {number} actIndex - 0 to 4
   * @param {string} lang - 'zh' | 'en'
   */
  function setHudContent(actIndex, lang) {
    const data = siteData[lang];
    if (!data || !data.films || !data.films[actIndex]) return;

    if (DOM.oneShotStage) {
      DOM.oneShotStage.setAttribute('data-act', String(actIndex));
    }

    const film = data.films[actIndex];
    const displayTitle = (lang === 'zh' && film.titleZh) ? `${film.title} · ${film.titleZh}` : film.title;
    const displayQuote = lang === 'zh' ? film.quoteZh : film.quote;

    // L2: Centered Serif Film Title (Year exclusively tracked by right vernier scale)
    if (DOM.hudFilmTitle) DOM.hudFilmTitle.textContent = displayTitle;

    // L3: Iconic Single-Line Quote
    if (DOM.hudQuoteText) DOM.hudQuoteText.textContent = displayQuote;

    // Crosshair Easter Egg Details
    if (DOM.dossierValDirector) DOM.dossierValDirector.textContent = film.director;
    if (DOM.dossierValLocation) DOM.dossierValLocation.textContent = film.location;
    if (DOM.dossierValGear) DOM.dossierValGear.textContent = film.signatureProp;
  }

  // ==========================================
  // 3B. WEB AUDIO API PRECISION MECHANICAL SYNTHESIZER (GearSFX)
  // ==========================================

  function getGearAudioContext(shouldResume = true) {
    if (typeof window === 'undefined') return null;
    if (!gearAudioCtx) {
      const Ctx = window.AudioContext || window.webkitAudioContext;
      if (!Ctx) return null;
      try {
        gearAudioCtx = new Ctx();
      } catch (e) {
        return null;
      }
    }
    if (shouldResume && gearAudioCtx && gearAudioCtx.state === 'suspended' && typeof gearAudioCtx.resume === 'function') {
      gearAudioCtx.resume().catch(() => {});
    }
    return gearAudioCtx;
  }

  function getGearSfxGain() {
    if (!ambientEnabled && !pendingAutoplayUnlock) return 0;
    return Math.min(1, Math.max(0.2, masterVolume)) * 0.45;
  }

  function triggerNoisePulse(ctx, startTime, durationSec, centerHz, qVal, peakGain) {
    if (typeof ctx.createBuffer !== 'function' || typeof ctx.createBiquadFilter !== 'function') return;
    const sampleCount = Math.max(1, Math.floor(ctx.sampleRate * durationSec));
    const buffer = ctx.createBuffer(1, sampleCount, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < sampleCount; i++) {
      data[i] = (Math.random() * 2 - 1) * (1 - i / sampleCount);
    }

    const src = ctx.createBufferSource();
    src.buffer = buffer;

    const filter = ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(centerHz, startTime);
    filter.Q.setValueAtTime(qVal, startTime);

    const gainNode = ctx.createGain();
    gainNode.gain.setValueAtTime(Math.max(0.0001, peakGain), startTime);
    gainNode.gain.exponentialRampToValueAtTime(0.0001, startTime + durationSec);

    src.connect(filter);
    filter.connect(gainNode);
    gainNode.connect(ctx.destination);
    src.start(startTime);
    src.stop(startTime + durationSec);
  }

  function triggerToneSweep(ctx, type, startTime, durationSec, startHz, endHz, peakGain) {
    if (typeof ctx.createOscillator !== 'function') return;
    const osc = ctx.createOscillator();
    const gainNode = ctx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(startHz, startTime);
    osc.frequency.exponentialRampToValueAtTime(Math.max(40, endHz), startTime + durationSec);

    gainNode.gain.setValueAtTime(0.0001, startTime);
    gainNode.gain.linearRampToValueAtTime(Math.max(0.0001, peakGain), startTime + 0.002);
    gainNode.gain.exponentialRampToValueAtTime(0.0001, startTime + durationSec);

    osc.connect(gainNode);
    gainNode.connect(ctx.destination);
    osc.start(startTime);
    osc.stop(startTime + durationSec + 0.005);
  }

  const GEAR_SFX_PATHS = {
    bezel: 'assets/sfx-bezel.mp3',
    switch: 'assets/sfx-switch.mp3',
    unlock: 'assets/sfx-unlock.mp3'
  };
  const gearAudioBuffers = new Map();
  const gearBufferPromises = new Map();

  function base64ToArrayBuffer(b64) {
    if (!b64 || typeof atob !== 'function') return null;
    try {
      const binary = atob(b64);
      const len = binary.length;
      const bytes = new Uint8Array(len);
      for (let i = 0; i < len; i++) {
        bytes[i] = binary.charCodeAt(i);
      }
      return bytes.buffer;
    } catch (e) {
      return null;
    }
  }

  function decodeAudioDataSafe(ctx, arrBuf) {
    if (!ctx || !arrBuf || typeof ctx.decodeAudioData !== 'function') {
      return Promise.resolve(null);
    }
    const copyBuf = typeof arrBuf.slice === 'function' ? arrBuf.slice(0) : arrBuf;
    return new Promise((resolve) => {
      try {
        const ret = ctx.decodeAudioData(
          copyBuf,
          (decoded) => resolve(decoded || null),
          () => resolve(null)
        );
        if (ret && typeof ret.then === 'function') {
          ret.then((decoded) => resolve(decoded || null)).catch(() => resolve(null));
        }
      } catch (e) {
        resolve(null);
      }
    });
  }

  function computeLeadingTrimOffset(audioBuffer) {
    if (!audioBuffer || typeof audioBuffer.getChannelData !== 'function' || !audioBuffer.sampleRate) {
      return 0;
    }
    const ch = audioBuffer.getChannelData(0);
    if (!ch || ch.length === 0) return 0;
    const maxScan = Math.min(ch.length, Math.floor(audioBuffer.sampleRate * 0.15));
    for (let i = 0; i < maxScan; i++) {
      if (Math.abs(ch[i]) > 0.008) {
        const rollBack = Math.floor(audioBuffer.sampleRate * 0.001); // 1ms safety pre-roll
        return Math.max(0, (i - rollBack) / audioBuffer.sampleRate);
      }
    }
    return 0;
  }

  function preloadGearSamples() {
    const ctx = getGearAudioContext(false);
    if (!ctx || typeof ctx.decodeAudioData !== 'function') return;

    const inlineMap = (typeof window !== 'undefined' && window.GEAR_SFX_BASE64) ||
      (typeof globalThis !== 'undefined' && globalThis.GEAR_SFX_BASE64) ||
      null;
    const isFileProtocol = typeof window !== 'undefined' && window.location && window.location.protocol === 'file:';

    Object.keys(GEAR_SFX_PATHS).forEach((key) => {
      if (gearAudioBuffers.has(key) || gearBufferPromises.has(key)) return;

      let bufPromise = null;
      const inlineB64 = inlineMap && typeof inlineMap[key] === 'string' ? inlineMap[key] : '';
      if (inlineB64) {
        const arrBuf = base64ToArrayBuffer(inlineB64);
        if (arrBuf) {
          bufPromise = decodeAudioDataSafe(ctx, arrBuf);
        }
      } else if (!isFileProtocol && typeof fetch === 'function') {
        bufPromise = fetch(GEAR_SFX_PATHS[key])
          .then((res) => (res && res.ok ? res.arrayBuffer() : null))
          .then((arrBuf) => (arrBuf ? decodeAudioDataSafe(ctx, arrBuf) : null))
          .catch(() => null);
      }

      if (!bufPromise) return;

      const wrapped = bufPromise
        .then((decoded) => {
          if (decoded) {
            gearAudioBuffers.set(key, {
              buffer: decoded,
              offsetSec: computeLeadingTrimOffset(decoded)
            });
          }
        })
        .catch(() => {})
        .finally(() => {
          gearBufferPromises.delete(key);
        });
      gearBufferPromises.set(key, wrapped);
    });
  }

  function playSampleBuffer(key, playbackRate = 1.0) {
    const baseVol = getGearSfxGain();
    const ctx = getGearAudioContext();
    if (!ctx || baseVol <= 0) return true; // Muted state: suppress without error

    preloadGearSamples();

    const entry = gearAudioBuffers.get(key);
    if (!entry || !entry.buffer || typeof ctx.createBufferSource !== 'function' || typeof ctx.createGain !== 'function') {
      return false;
    }

    const src = ctx.createBufferSource();
    src.buffer = entry.buffer;
    if (src.playbackRate && typeof src.playbackRate.setValueAtTime === 'function') {
      src.playbackRate.setValueAtTime(playbackRate, ctx.currentTime);
    } else if (src.playbackRate) {
      src.playbackRate.value = playbackRate;
    }

    // Scale real normalized -1 dBFS foley cleanly to global masterVolume (0.2..1.0)
    const sampleGain = Math.min(1, Math.max(0.2, masterVolume)) * 0.85;
    const gainNode = ctx.createGain();
    gainNode.gain.setValueAtTime(Math.max(0.0001, sampleGain), ctx.currentTime);

    src.connect(gainNode);
    gainNode.connect(ctx.destination);
    src.start(ctx.currentTime, entry.offsetSec || 0);
    return true;
  }

  function synthesizeBezelClick(vol, ctx) {
    const t = ctx.currentTime;
    triggerNoisePulse(ctx, t, 0.012, 4200, 2.4, vol * 0.65);
    triggerToneSweep(ctx, 'sine', t, 0.018, 3800, 1600, vol * 0.32);
  }

  function synthesizeToggleSwitch(vol, ctx) {
    const t = ctx.currentTime;
    triggerToneSweep(ctx, 'triangle', t, 0.024, 920, 310, vol * 0.65);
    triggerNoisePulse(ctx, t, 0.012, 1800, 1.8, vol * 0.42);

    const t2 = t + 0.028;
    triggerToneSweep(ctx, 'triangle', t2, 0.026, 1340, 420, vol * 0.72);
    triggerNoisePulse(ctx, t2, 0.012, 2400, 2.1, vol * 0.48);
  }

  function synthesizeSafetyUnlock(vol, ctx) {
    const t = ctx.currentTime;
    if (typeof ctx.createOscillator === 'function') {
      const osc = ctx.createOscillator();
      const g = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(2100, t);
      osc.frequency.exponentialRampToValueAtTime(2650, t + 0.12);
      g.gain.setValueAtTime(0.0001, t);
      g.gain.linearRampToValueAtTime(vol * 0.14, t + 0.03);
      g.gain.exponentialRampToValueAtTime(0.0001, t + 0.12);
      osc.connect(g);
      g.connect(ctx.destination);
      osc.start(t);
      osc.stop(t + 0.125);
    }

    const lockAt = t + 0.12;
    triggerNoisePulse(ctx, lockAt, 0.022, 2800, 2.6, vol * 0.56);
    triggerToneSweep(ctx, 'triangle', lockAt, 0.032, 1150, 460, vol * 0.75);
    triggerToneSweep(ctx, 'sine', lockAt, 0.018, 1900, 720, vol * 0.38);
  }

  const GearSFX = {
    // 1. Omega Seamaster bezel ratchet sample (subtle 0.96–1.04 micro-pitch variation)
    playBezelClick() {
      const rate = 0.96 + Math.random() * 0.08;
      if (playSampleBuffer('bezel', rate)) return;
      const vol = getGearSfxGain();
      const ctx = getGearAudioContext();
      if (ctx && vol > 0) synthesizeBezelClick(vol, ctx);
    },

    // 2. DB5 vintage metallic toggle switch sample
    playToggleSwitch() {
      if (playSampleBuffer('switch', 1.0)) return;
      const vol = getGearSfxGain();
      const ctx = getGearAudioContext();
      if (ctx && vol > 0) synthesizeToggleSwitch(vol, ctx);
    },

    // 3. Walther PPK cold slide-lock / safety sample
    playSafetyUnlock() {
      if (playSampleBuffer('unlock', 1.0)) return;
      const vol = getGearSfxGain();
      const ctx = getGearAudioContext();
      if (ctx && vol > 0) synthesizeSafetyUnlock(vol, ctx);
    }
  };

  function formatBezelReadout(angleDeg, ui) {
    const absDeg = Math.abs(angleDeg % 360);
    const mins = Math.round(absDeg / 6) % 60;
    const prefix = (ui && ui.bezelPrefix) || 'BEZEL';
    const unit = (ui && ui.bezelUnit) || 'MIN';
    return `${prefix} ${String(mins).padStart(2, '0')} ${unit}`;
  }

  function renderArtifactsGrid(artifacts, lang) {
    if (!DOM.artifactsGridContainer || !Array.isArray(artifacts)) return;

    const data = siteData[lang] || siteData[currentLang];
    const ui = (data && data.artifactsSection && data.artifactsSection.ui) || {};
    const revealClass = artifactsRevealed ? 'reveal-item is-revealed' : 'reveal-item';

    DOM.artifactsGridContainer.classList.toggle('has-focus', Boolean(gearState.focusedId));

    const html = artifacts.map((item) => {
      const displayName = (lang === 'zh' && item.nameZh) ? item.nameZh : item.name;
      const isFocused = gearState.focusedId === item.id ? 'is-focused' : '';
      const isLightsOn = (item.id === 'db5' && gearState.db5LightsOn) ? 'is-lights-on' : '';
      const isUnlocked = (item.id === 'walther' && gearState.ppkUnlocked) ? 'is-unlocked' : '';

      let extraMediaHtml = '';
      if (item.id === 'db5') {
        extraMediaHtml = `
          <div class="db5-lights-layer" aria-hidden="true">
            <div class="db5-lamp db5-lamp-left">
              <div class="db5-lamp-beam"></div>
              <div class="db5-lamp-halo"></div>
              <div class="db5-lamp-core"></div>
            </div>
            <div class="db5-lamp db5-lamp-right">
              <div class="db5-lamp-beam"></div>
              <div class="db5-lamp-halo"></div>
              <div class="db5-lamp-core"></div>
            </div>
          </div>
        `;
      } else if (item.id === 'omega') {
        extraMediaHtml = `
          <div class="watch-bezel-rotator" style="transform: rotate(${gearState.watchAngle.toFixed(2)}deg);" aria-hidden="true">
            <img src="${escapeHTML(item.image)}" alt="" class="gear-photo" draggable="false" />
          </div>
        `;
      } else if (item.id === 'walther') {
        extraMediaHtml = `
          <div class="ppk-scan-zone" aria-hidden="true">
            <div class="ppk-scan-beam"></div>
          </div>
        `;
      } else if (item.id === 'tailoring') {
        extraMediaHtml = `
          <div class="tailoring-loupe" style="background-image: url('${escapeHTML(item.image)}');" aria-hidden="true"></div>
        `;
      }

      const hotspotsHtml = Array.isArray(item.hotspots) ? item.hotspots.map((spot) => {
        const alignCls = spot.align === 'left' ? 'gear-hotspot--left' : '';
        const roleCls = spot.role === 'biometric' ? 'gear-hotspot--biometric' : '';
        const activeCls = gearState.activeHotspotId === spot.id ? 'is-active' : '';
        return `
          <button type="button"
                  class="gear-hotspot ${alignCls} ${roleCls} ${activeCls}"
                  data-hotspot-id="${escapeHTML(spot.id)}"
                  data-hotspot-role="${escapeHTML(spot.role || '')}"
                  style="left: ${spot.x}%; top: ${spot.y}%;"
                  aria-label="${escapeHTML(spot.label)}">
            <span class="hotspot-ring" aria-hidden="true"></span>
            <span class="hotspot-core" aria-hidden="true"></span>
            <span class="hotspot-callout" aria-hidden="true">
              <span class="hotspot-line"></span>
              <span class="hotspot-label">${escapeHTML(spot.label)}</span>
            </span>
          </button>
        `;
      }).join('') : '';

      const bezelReadoutHtml = item.id === 'omega'
        ? `<div class="bezel-readout" aria-live="polite">${escapeHTML(formatBezelReadout(gearState.watchAngle, ui))}</div>`
        : '';

      return `
        <article class="gear-item gear-item--${escapeHTML(item.id)} ${revealClass} ${isFocused} ${isLightsOn} ${isUnlocked}"
                 data-gear-id="${escapeHTML(item.id)}"
                 data-interaction="${escapeHTML(item.interactionType || '')}">
          <div class="gear-stage" tabindex="0" aria-label="${escapeHTML(displayName)}">
            <div class="gear-clip">
              <img src="${escapeHTML(item.image)}" alt="${escapeHTML(displayName)}" class="gear-photo" loading="lazy" draggable="false" />
              ${extraMediaHtml}
              <div class="gear-rim-light" aria-hidden="true"></div>
              <div class="gear-edge-vignette" aria-hidden="true"></div>
            </div>
            ${bezelReadoutHtml}
            ${hotspotsHtml}
          </div>
          <div class="gear-meta-bar">
            <h3 class="gear-title">${escapeHTML(displayName)}</h3>
          </div>
        </article>
      `;
    }).join('');

    DOM.artifactsGridContainer.innerHTML = html;
  }

  function initDarkroomGallery() {
    if (darkroomInitialized || !DOM.artifactsGridContainer) return;
    darkroomInitialized = true;

    const container = DOM.artifactsGridContainer;
    const isFinePointerDevice = () => (
      typeof window !== 'undefined' &&
      window.matchMedia &&
      window.matchMedia('(hover: hover) and (pointer: fine)').matches
    );

    const getCurrentUiStrings = () => {
      const d = siteData[currentLang];
      return (d && d.artifactsSection && d.artifactsSection.ui) || {};
    };

    const setGearFocus = (gearId) => {
      gearState.focusedId = gearId;
      container.classList.toggle('has-focus', Boolean(gearId));
      const items = container.querySelectorAll('.gear-item');
      items.forEach((item) => {
        item.classList.toggle('is-focused', item.getAttribute('data-gear-id') === gearId);
      });
    };

    const cancelPpkHoverTimer = () => {
      if (gearState.ppkHoverTimer) {
        clearTimeout(gearState.ppkHoverTimer);
        gearState.ppkHoverTimer = null;
      }
    };

    const triggerPpkBiometricSequence = (itemEl) => {
      if (!itemEl || gearState.ppkScanning) return;

      if (gearState.ppkUnlocked) {
        gearState.ppkUnlocked = false;
        itemEl.classList.remove('is-unlocked');
        return;
      }

      gearState.ppkScanning = true;
      itemEl.classList.add('is-scanning');
      GearSFX.playSafetyUnlock();

      if (gearState.ppkScanTimer) clearTimeout(gearState.ppkScanTimer);
      gearState.ppkScanTimer = setTimeout(() => {
        gearState.ppkScanning = false;
        gearState.ppkUnlocked = true;
        gearState.ppkScanTimer = null;
        const latestWalther = container.querySelector('.gear-item--walther');
        if (latestWalther) {
          latestWalther.classList.remove('is-scanning');
          latestWalther.classList.add('is-unlocked');
        }
      }, 420);
    };

    // Omega Seamaster 300M Bezel Physics State
    let watchDragActive = false;
    let watchCenterX = 0;
    let watchCenterY = 0;
    let watchPrevPtrAngle = 0;
    let watchDragAccum = 0;

    const showBezelReadoutTemporarily = () => {
      const watchItem = container.querySelector('.gear-item--omega');
      if (!watchItem) return;
      const readout = watchItem.querySelector('.bezel-readout');
      if (readout) {
        readout.textContent = formatBezelReadout(gearState.watchAngle, getCurrentUiStrings());
      }
      watchItem.classList.add('is-bezel-active');
      if (gearState.bezelHideTimer) clearTimeout(gearState.bezelHideTimer);
      gearState.bezelHideTimer = setTimeout(() => {
        const latestWatch = container.querySelector('.gear-item--omega');
        if (latestWatch) latestWatch.classList.remove('is-bezel-active');
        gearState.bezelHideTimer = null;
      }, 1200);
    };

    const applyWatchAngle = (nextAngle, snapAnimate = false) => {
      gearState.watchAngle = nextAngle;
      const newStep = Math.floor(Math.abs(gearState.watchAngle) / 6);
      if (newStep !== gearState.watchRatchetStep) {
        gearState.watchRatchetStep = newStep;
        GearSFX.playBezelClick();
      }
      const watchItem = container.querySelector('.gear-item--omega');
      const rotator = watchItem ? watchItem.querySelector('.watch-bezel-rotator') : null;
      if (watchItem && rotator) {
        watchItem.classList.toggle('is-bezel-snap', Boolean(snapAnimate));
        rotator.style.transform = `rotate(${gearState.watchAngle.toFixed(2)}deg)`;
      }
      showBezelReadoutTemporarily();
    };

    // Pre-decode offline Base64 SFX right on first page interaction (zero pre-gesture AudioContext warnings)
    const onFirstAudioGesture = () => preloadGearSamples();
    ['pointerdown', 'keydown', 'touchstart'].forEach((evt) => {
      window.addEventListener(evt, onFirstAudioGesture, { once: true, capture: true, passive: true });
    });

    // Hover & Focus Management
    container.addEventListener('pointerover', (e) => {
      if (gearAudioCtx) preloadGearSamples();
      if (!isFinePointerDevice()) return;
      const item = e.target && e.target.closest ? e.target.closest('.gear-item') : null;
      if (item) {
        setGearFocus(item.getAttribute('data-gear-id'));
      }
    });

    container.addEventListener('pointerleave', () => {
      cancelPpkHoverTimer();
      const loupeItem = container.querySelector('.gear-item--tailoring');
      if (loupeItem) loupeItem.classList.remove('is-loupe-active');
      if (isFinePointerDevice()) {
        setGearFocus(null);
      }
    });

    container.addEventListener('focusin', (e) => {
      const item = e.target && e.target.closest ? e.target.closest('.gear-item') : null;
      if (item) setGearFocus(item.getAttribute('data-gear-id'));
    });

    // Rim Light + Tailoring Optical Loupe + PPK 450ms Grip Dwell + Watch Drag
    container.addEventListener('pointermove', (e) => {
      const item = e.target && e.target.closest ? e.target.closest('.gear-item') : null;

      if (watchDragActive) {
        const currentAngle = Math.atan2(e.clientY - watchCenterY, e.clientX - watchCenterX) * (180 / Math.PI);
        let delta = currentAngle - watchPrevPtrAngle;
        if (delta > 180) delta -= 360;
        if (delta < -180) delta += 360;
        watchPrevPtrAngle = currentAngle;
        // Real diver bezel unidirectional counter-clockwise ratchet (delta < 0)
        if (delta < 0) {
          watchDragAccum += Math.abs(delta);
          applyWatchAngle(gearState.watchAngle + delta, false);
        }
        return;
      }

      if (!item) return;
      const id = item.getAttribute('data-gear-id');
      const clip = item.querySelector('.gear-clip');
      if (!clip || typeof clip.getBoundingClientRect !== 'function') return;

      const rect = clip.getBoundingClientRect();
      if (!rect || rect.width <= 0 || rect.height <= 0) return;

      const u = Math.min(rect.width, Math.max(0, e.clientX - rect.left));
      const v = Math.min(rect.height, Math.max(0, e.clientY - rect.top));
      const uPct = (u / rect.width) * 100;
      const vPct = (v / rect.height) * 100;

      // Subtle darkroom rim-light follows cursor
      const rim = item.querySelector('.gear-rim-light');
      if (rim && rim.style && typeof rim.style.setProperty === 'function') {
        rim.style.setProperty('--mx', `${uPct.toFixed(1)}%`);
        rim.style.setProperty('--my', `${vPct.toFixed(1)}%`);
      }

      // Tailoring 2.1x Savile Row Optical Loupe (Desktop fine pointer only, silent)
      if (id === 'tailoring') {
        const loupe = item.querySelector('.tailoring-loupe');
        if (loupe && isFinePointerDevice()) {
          const zoom = 2.1;
          const radius = 68; // 136px diameter / 2
          item.classList.add('is-loupe-active');
          loupe.style.left = `${u.toFixed(1)}px`;
          loupe.style.top = `${v.toFixed(1)}px`;
          loupe.style.backgroundSize = `${(rect.width * zoom).toFixed(1)}px ${(rect.height * zoom).toFixed(1)}px`;
          loupe.style.backgroundPosition = `${(radius - u * zoom).toFixed(1)}px ${(radius - v * zoom).toFixed(1)}px`;
        }
      }

      // Walther PPK: 450ms dwell over biometric grip triggers scan unlock
      if (id === 'walther' && !gearState.ppkUnlocked && !gearState.ppkScanning) {
        const inGripZone = uPct >= 58 && uPct <= 84 && vPct >= 26 && vPct <= 86;
        if (inGripZone) {
          if (!gearState.ppkHoverTimer) {
            gearState.ppkHoverTimer = setTimeout(() => {
              gearState.ppkHoverTimer = null;
              const waltherEl = container.querySelector('.gear-item--walther');
              if (waltherEl && !gearState.ppkUnlocked) {
                triggerPpkBiometricSequence(waltherEl);
              }
            }, 450);
          }
        } else {
          cancelPpkHoverTimer();
        }
      }
    });

    container.addEventListener('pointerout', (e) => {
      const leftItem = e.target && e.target.closest ? e.target.closest('.gear-item') : null;
      const toItem = e.relatedTarget && e.relatedTarget.closest ? e.relatedTarget.closest('.gear-item') : null;
      if (leftItem && leftItem !== toItem) {
        const id = leftItem.getAttribute('data-gear-id');
        if (id === 'tailoring') leftItem.classList.remove('is-loupe-active');
        if (id === 'walther') cancelPpkHoverTimer();
      }
    });

    // Preload Base64 SFX on pointerdown + Omega Pointer Drag Start (Mouse/Pen, leaves touch scroll completely free)
    container.addEventListener('pointerdown', (e) => {
      preloadGearSamples();
      const omegaItem = e.target && e.target.closest ? e.target.closest('.gear-item--omega') : null;
      if (!omegaItem || e.pointerType === 'touch') return;
      const clip = omegaItem.querySelector('.gear-clip');
      if (!clip || typeof clip.getBoundingClientRect !== 'function') return;

      const rect = clip.getBoundingClientRect();
      if (!rect || rect.width <= 0) return;

      watchCenterX = rect.left + rect.width * 0.5;
      watchCenterY = rect.top + rect.height * 0.482;
      watchPrevPtrAngle = Math.atan2(e.clientY - watchCenterY, e.clientX - watchCenterX) * (180 / Math.PI);
      watchDragAccum = 0;
      watchDragActive = true;
    });

    const stopWatchDrag = () => {
      watchDragActive = false;
    };
    window.addEventListener('pointerup', stopWatchDrag);
    window.addEventListener('pointercancel', stopWatchDrag);

    // Click Handlers: Mobile Focus + Hotspot Toggle + 4 Exhibit Actions
    container.addEventListener('click', (e) => {
      const hotspotBtn = e.target && e.target.closest ? e.target.closest('.gear-hotspot') : null;
      const item = e.target && e.target.closest ? e.target.closest('.gear-item') : null;
      if (!item) return;

      const gearId = item.getAttribute('data-gear-id');
      setGearFocus(gearId);

      // Handle explicit hotspot activation (fine touch / keyboard / explicit dot click)
      if (hotspotBtn) {
        const spotId = hotspotBtn.getAttribute('data-hotspot-id');
        const spotRole = hotspotBtn.getAttribute('data-hotspot-role');
        const wasActive = gearState.activeHotspotId === spotId;
        gearState.activeHotspotId = wasActive ? null : spotId;

        container.querySelectorAll('.gear-hotspot').forEach((btn) => {
          btn.classList.toggle('is-active', btn.getAttribute('data-hotspot-id') === gearState.activeHotspotId);
        });

        if (spotRole === 'bezel') {
          applyWatchAngle(gearState.watchAngle - 18, true);
        } else if (spotRole === 'biometric') {
          cancelPpkHoverTimer();
          triggerPpkBiometricSequence(item);
        } else if (gearId === 'db5') {
          // Clicking DB5 M134/plate/hood also ignites headlights naturally
          gearState.db5LightsOn = !gearState.db5LightsOn;
          item.classList.toggle('is-lights-on', gearState.db5LightsOn);
          GearSFX.playToggleSwitch();
        }
        return;
      }

      // Clear active hotspot pill if clicking empty canvas area of item
      if (gearState.activeHotspotId) {
        gearState.activeHotspotId = null;
        container.querySelectorAll('.gear-hotspot').forEach((btn) => btn.classList.remove('is-active'));
      }

      if (gearId === 'db5') {
        gearState.db5LightsOn = !gearState.db5LightsOn;
        item.classList.toggle('is-lights-on', gearState.db5LightsOn);
        GearSFX.playToggleSwitch();
      } else if (gearId === 'omega') {
        // Click dial/bezel advances -18deg counter-clockwise (3 clicks = 3 minutes)
        if (watchDragAccum < 5) {
          applyWatchAngle(gearState.watchAngle - 18, true);
        }
        watchDragAccum = 0;
      } else if (gearId === 'walther') {
        cancelPpkHoverTimer();
        triggerPpkBiometricSequence(item);
      }
    });

    // Keyboard accessibility on gear stages (Enter/Space triggers primary interaction)
    container.addEventListener('keydown', (e) => {
      if (e.key !== 'Enter' && e.key !== ' ') return;
      const stageEl = e.target && e.target.closest ? e.target.closest('.gear-stage') : null;
      const hotspotBtn = e.target && e.target.closest ? e.target.closest('.gear-hotspot') : null;
      if (stageEl && !hotspotBtn) {
        e.preventDefault();
        stageEl.click();
      }
    });

    // Clear mobile focus when tapping outside darkroom gallery
    document.addEventListener('click', (e) => {
      if (!isFinePointerDevice() && gearState.focusedId && !container.contains(e.target)) {
        setGearFocus(null);
      }
    });
  }

  function initScrollReveals() {
    if (prefersReducedMotion || !('IntersectionObserver' in window)) {
      artifactsRevealed = true;
      document.querySelectorAll('.reveal-item').forEach(el => el.classList.add('is-revealed'));
      return;
    }

    if (DOM.artifactsGridContainer && !artifactsRevealed) {
      if (artifactsObserver) artifactsObserver.disconnect();
      artifactsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            artifactsRevealed = true;
            const cards = DOM.artifactsGridContainer.querySelectorAll('.gear-item');
            cards.forEach((card, idx) => {
              setTimeout(() => {
                card.classList.add('is-revealed');
              }, idx * 80);
            });
            artifactsObserver.unobserve(entry.target);
          }
        });
      }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
      artifactsObserver.observe(DOM.artifactsGridContainer);
    }
  }

  // ==========================================
  // 4. LOCAL STATIC BACKDROP INJECTION
  // ==========================================

  function applyLocalBackdrops() {
    const films = siteData.zh && siteData.zh.films;
    if (!Array.isArray(films) || !DOM.actBgs) return;

    films.forEach((film, index) => {
      const actBg = DOM.actBgs[index];
      if (!actBg) return;

      const targetEl = actBg.querySelector('.act-backdrop') || actBg;
      const fallback = ACT_FALLBACK_GRADIENTS[index] || 'linear-gradient(180deg, #111111 0%, #090909 100%)';

      if (film.localBackdrop) {
        targetEl.style.backgroundImage = `url("${film.localBackdrop}"), ${fallback}`;
      } else {
        targetEl.style.backgroundImage = fallback;
      }
      targetEl.style.backgroundSize = 'cover';
      targetEl.style.backgroundPosition = index === 2 ? '50% 8%' : '50% 10%';
    });
  }

  // ==========================================
  // 5. DUAL-DECK SCROLL CROSSFADE AMBIENT AUDIO ENGINE
  // ==========================================

  function applyMasterVolume() {
    const safeVol = Math.min(1, Math.max(0.2, masterVolume));
    if (deckA) deckA.volume = Math.min(1, Math.max(0, deckALogicalGain * safeVol));
    if (deckB) deckB.volume = Math.min(1, Math.max(0, deckBLogicalGain * safeVol));
  }

  function updateGainMeterUI() {
    if (DOM.audioGainMeter) {
      DOM.audioGainMeter.setAttribute('aria-valuenow', String(Math.round(masterVolume * 100)));
    }
    if (DOM.gainBars && DOM.gainBars.length > 0) {
      DOM.gainBars.forEach((bar) => {
        const level = parseFloat(bar.getAttribute('data-level') || '0');
        bar.classList.toggle('is-lit', level <= masterVolume + 0.05);
      });
    }
  }

  function setMasterVolume(nextVol, unmuteIfSilent = false) {
    const clamped = Math.round(Math.min(1, Math.max(0.2, nextVol)) * 100) / 100;
    masterVolume = clamped;

    try {
      sessionStorage.setItem(STORAGE_KEY_VOL, String(masterVolume));
    } catch (e) {
      // sessionStorage optional
    }

    applyMasterVolume();
    updateGainMeterUI();

    if (unmuteIfSilent && !ambientEnabled) {
      toggleAmbientSound();
    }
  }

  function computeVolumeFromClientX(clientX, fallbackBarEl = null) {
    if (DOM.audioGainMeter && typeof DOM.audioGainMeter.getBoundingClientRect === 'function') {
      const rect = DOM.audioGainMeter.getBoundingClientRect();
      if (rect && rect.width > 4) {
        const ratio = Math.min(1, Math.max(0, (clientX - rect.left) / rect.width));
        return 0.2 + ratio * 0.8;
      }
    }
    if (fallbackBarEl) {
      const level = parseFloat(fallbackBarEl.getAttribute('data-level') || '');
      if (!isNaN(level)) return level;
    }
    return masterVolume;
  }

  function updateSoundToggleUI() {
    const data = siteData[currentLang];
    if (!data || !data.nav) return;
    const isActivelyOn = ambientEnabled && !pendingAutoplayUnlock;
    const isStandby = pendingAutoplayUnlock;

    if (DOM.masterAudioControl) {
      DOM.masterAudioControl.classList.toggle('is-sound-on', isActivelyOn);
      DOM.masterAudioControl.classList.toggle('is-sound-standby', isStandby);
      DOM.masterAudioControl.classList.toggle('is-active', isActivelyOn || isStandby);
    }
    if (DOM.soundToggleBtn) {
      DOM.soundToggleBtn.classList.toggle('is-sound-on', isActivelyOn);
      DOM.soundToggleBtn.classList.toggle('is-sound-standby', isStandby);
      DOM.soundToggleBtn.setAttribute('aria-pressed', isActivelyOn ? 'true' : 'false');
      DOM.soundToggleBtn.setAttribute('aria-label', data.nav.soundToggleAria);
    }
    updateGainMeterUI();
  }

  const UNLOCK_EVENTS = ['pointerdown', 'click', 'keydown', 'touchstart'];

  function unregisterGlobalUnlockListeners() {
    if (!unlockListenersBound) return;
    unlockListenersBound = false;
    UNLOCK_EVENTS.forEach((evt) => {
      window.removeEventListener(evt, handleGlobalAudioUnlock, { capture: true });
    });
  }

  function clearPendingAutoplayUnlock() {
    pendingAutoplayUnlock = false;
    unregisterGlobalUnlockListeners();
  }

  function handleGlobalAudioUnlock(e) {
    if (!pendingAutoplayUnlock) {
      unregisterGlobalUnlockListeners();
      return;
    }

    const target = e && e.target;
    if (target && typeof target.closest === 'function') {
      // Let direct click on sound toggle button activate via its own click handler
      if (target.closest('#global-sound-btn')) {
        return;
      }
    }

    clearPendingAutoplayUnlock();
    ambientEnabled = true;
    updateSoundToggleUI();
    if (inStageAudioZone && !inEpilogueZone) {
      crossfadeAmbientToAct(currentActIndex, INITIAL_AUDIO_FADE_MS);
    }
  }

  function registerGlobalUnlockListeners() {
    if (unlockListenersBound) return;
    unlockListenersBound = true;
    UNLOCK_EVENTS.forEach((evt) => {
      window.addEventListener(evt, handleGlobalAudioUnlock, { capture: true, passive: true });
    });
  }

  /**
   * Cancel any active rAF crossfade and ramp/stop ambient decks linearly
   * @param {boolean} immediate - true to immediately silence & pause both decks
   * @param {number} durationMs - linear fade-out duration in milliseconds
   */
  function fadeOutAmbientDecks(immediate = false, durationMs = 750) {
    if (crossfadeRafId) {
      cancelAnimationFrame(crossfadeRafId);
      crossfadeRafId = null;
    }
    ambientTrackIndex = -1;

    if (!deckA || !deckB) return;

    if (immediate) {
      deckA.pause();
      deckB.pause();
      deckALogicalGain = 0;
      deckBLogicalGain = 0;
      applyMasterVolume();
      return;
    }

    const startGainA = deckALogicalGain;
    const startGainB = deckBLogicalGain;
    if (startGainA === 0 && startGainB === 0) {
      deckA.pause();
      deckB.pause();
      return;
    }

    const startTime = performance.now();
    const fadeDuration = Math.max(100, durationMs);

    function step(now) {
      const t = Math.min(1, (now - startTime) / fadeDuration);
      const ease = 1 - t;
      deckALogicalGain = startGainA * ease;
      deckBLogicalGain = startGainB * ease;
      applyMasterVolume();
      if (t < 1) {
        crossfadeRafId = requestAnimationFrame(step);
      } else {
        deckA.pause();
        deckB.pause();
        deckALogicalGain = 0;
        deckBLogicalGain = 0;
        applyMasterVolume();
        crossfadeRafId = null;
      }
    }

    crossfadeRafId = requestAnimationFrame(step);
  }

  /**
   * Smoothly crossfade ambient background soundtrack to the target chapter index
   * Guarantees zero overlapping audio tracks during rapid scrolling
   * @param {number} targetActIdx
   * @param {number} durationMs
   */
  function crossfadeAmbientToAct(targetActIdx, durationMs = CROSSFADE_DURATION_MS) {
    if (!ambientEnabled || !inStageAudioZone || inEpilogueZone || !deckA || !deckB) return;

    const films = siteData.zh && siteData.zh.films;
    const film = films && films[targetActIdx];
    if (!film || !film.audioSrc) return;

    // Avoid restarting if already playing or crossfading into this exact chapter
    if (targetActIdx === ambientTrackIndex && activeAmbientDeck && !activeAmbientDeck.paused) {
      return;
    }

    if (crossfadeRafId) {
      cancelAnimationFrame(crossfadeRafId);
      crossfadeRafId = null;
    }

    ambientTrackIndex = targetActIdx;

    // Pick deck: reuse if src already matches target, otherwise use quieter deck
    let incomingDeck;
    if (deckA.getAttribute('data-src') === film.audioSrc) {
      incomingDeck = deckA;
    } else if (deckB.getAttribute('data-src') === film.audioSrc) {
      incomingDeck = deckB;
    } else {
      incomingDeck = deckALogicalGain <= deckBLogicalGain ? deckA : deckB;
    }

    const outgoingDeck = incomingDeck === deckA ? deckB : deckA;

    if (incomingDeck.getAttribute('data-src') !== film.audioSrc) {
      incomingDeck.pause();
      incomingDeck.src = film.audioSrc;
      incomingDeck.setAttribute('data-src', film.audioSrc);
      incomingDeck.currentTime = 0;
      if (incomingDeck === deckA) {
        deckALogicalGain = 0;
      } else {
        deckBLogicalGain = 0;
      }
      applyMasterVolume();
    }

    activeAmbientDeck = incomingDeck;

    const playPromise = incomingDeck.play();
    if (playPromise && typeof playPromise.catch === 'function') {
      playPromise.catch((err) => {
        if (err && err.name !== 'AbortError') {
          ambientEnabled = false;
          if (err.name === 'NotAllowedError') {
            pendingAutoplayUnlock = true;
            registerGlobalUnlockListeners();
          }
          updateSoundToggleUI();
          fadeOutAmbientDecks(true);
        }
      });
    }

    const startInGain = incomingDeck === deckA ? deckALogicalGain : deckBLogicalGain;
    const startOutGain = outgoingDeck === deckA ? deckALogicalGain : deckBLogicalGain;
    const startTime = performance.now();
    const fadeMs = Math.max(100, durationMs);

    function step(now) {
      const rawT = Math.min(1, (now - startTime) / fadeMs);
      // Smooth sine ease-in-out
      const t = 0.5 - 0.5 * Math.cos(Math.PI * rawT);

      const inGain = Math.min(MAX_AMBIENT_GAIN, startInGain + (MAX_AMBIENT_GAIN - startInGain) * t);
      const outGain = Math.max(0, startOutGain * (1 - t));

      if (incomingDeck === deckA) {
        deckALogicalGain = inGain;
        deckBLogicalGain = outGain;
      } else {
        deckBLogicalGain = inGain;
        deckALogicalGain = outGain;
      }
      applyMasterVolume();

      if (rawT < 1) {
        crossfadeRafId = requestAnimationFrame(step);
      } else {
        outgoingDeck.pause();
        if (incomingDeck === deckA) {
          deckALogicalGain = MAX_AMBIENT_GAIN;
          deckBLogicalGain = 0;
        } else {
          deckBLogicalGain = MAX_AMBIENT_GAIN;
          deckALogicalGain = 0;
        }
        applyMasterVolume();
        crossfadeRafId = null;
      }
    }

    crossfadeRafId = requestAnimationFrame(step);
  }

  function toggleAmbientSound() {
    if (pendingAutoplayUnlock) {
      clearPendingAutoplayUnlock();
      ambientEnabled = true;
    } else {
      ambientEnabled = !ambientEnabled;
    }
    if (ambientEnabled) {
      updateSoundToggleUI();
      if (inStageAudioZone && !inEpilogueZone) {
        crossfadeAmbientToAct(currentActIndex, INITIAL_AUDIO_FADE_MS);
      }
    } else {
      updateSoundToggleUI();
      fadeOutAmbientDecks(false);
    }
  }

  // ==========================================
  // 6. GSAP GUN BARREL APERTURE & 2.39:1 CLIMAX CHOREOGRAPHY
  // ==========================================

  function initGunBarrelScrollytelling() {
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
      console.warn('[007 ARCHIVE] GSAP or ScrollTrigger not loaded.');
      return;
    }

    gsap.registerPlugin(ScrollTrigger);
    if (typeof ScrollTrigger.config === 'function') {
      ScrollTrigger.config({ ignoreMobileResize: true });
    }
    if (typeof ScrollToPlugin !== 'undefined') {
      gsap.registerPlugin(ScrollToPlugin);
    }

    const stage = DOM.oneShotStage;
    if (!stage) return;

    if (oneShotTimeline) {
      oneShotTimeline.kill();
      const existingST = ScrollTrigger.getById('oneShotScrolly');
      if (existingST) existingST.kill();
    }
    const existingHeroExitST = ScrollTrigger.getById('heroExitFade');
    if (existingHeroExitST) existingHeroExitST.kill();
    const existingEntryST = ScrollTrigger.getById('stageEntryFade');
    if (existingEntryST) existingEntryST.kill();

    const cinemaViewport = DOM.cinemaViewport;
    const actBgs = DOM.actBgs;
    const actBackdrops = DOM.actBackdrops;
    const skyfallRain = DOM.skyfallRain;
    const hudSubtitlesContent = DOM.hudSubtitlesContent;

    if (!cinemaViewport) return;

    // Cross-dissolve: Hero fades into #09090b while #one-shot-stage enters smoothly
    const heroFadeTargets = [DOM.heroInner, DOM.heroSilhouetteWrap].filter(Boolean);
    if (!prefersReducedMotion && DOM.heroSection && heroFadeTargets.length > 0) {
      gsap.set(heroFadeTargets, { opacity: 1 });
      gsap.timeline({
        scrollTrigger: {
          id: 'heroExitFade',
          trigger: DOM.heroSection,
          start: 'top top',
          end: 'bottom 20%',
          scrub: true
        }
      }).to(heroFadeTargets, { opacity: 0, ease: 'none' }, 0);
    }

    gsap.set(cinemaViewport, { opacity: 1 });
    gsap.set(stage, { opacity: prefersReducedMotion ? 1 : 0 });

    if (!prefersReducedMotion) {
      const entryTl = gsap.timeline({
        scrollTrigger: {
          id: 'stageEntryFade',
          trigger: stage,
          start: 'top 90%',
          end: 'top 15%',
          scrub: true
        }
      });
      entryTl.to(stage, { opacity: 1, ease: 'none' }, 0);
    }

    actBgs.forEach((bg, i) => {
      gsap.set(bg, { opacity: i === 0 ? 1 : 0 });
    });

    // Strict scale 1.0 framing anchored cleanly at 50% 10%
    actBackdrops.forEach(backdrop => {
      gsap.set(backdrop, { scale: 1.0 });
    });

    if (skyfallRain) gsap.set(skyfallRain, { opacity: 0 });
    if (hudSubtitlesContent) gsap.set(hudSubtitlesContent, { opacity: 1, y: 0 });

    currentActIndex = 0;
    setHudContent(0, currentLang);

    oneShotTimeline = gsap.timeline({
      scrollTrigger: {
        id: 'oneShotScrolly',
        trigger: stage,
        start: 'top top',
        end: '+=420%',
        pin: true,
        anticipatePin: 1,
        onEnter: () => {
          inStageAudioZone = true;
          if (ambientEnabled) crossfadeAmbientToAct(currentActIndex);
        },
        onEnterBack: () => {
          inStageAudioZone = true;
          if (ambientEnabled) crossfadeAmbientToAct(currentActIndex);
        },
        onLeave: () => {
          inStageAudioZone = false;
          if (ambientEnabled) fadeOutAmbientDecks(false);
        },
        onUpdate: (self) => {
          handleScrollProgress(self.progress);
        }
      }
    });

    console.info('[007 ARCHIVE] Exclusive 5-Act State Machine & 100vh Stage active.');
  }

  /**
   * Exclusive 5-Act Switcher: eliminates double-exposure ghosting by killing
   * in-flight backdrop tweens and ensuring strictly 1 active layer reaches opacity 1.
   * @param {number} index - 0 to 4
   */
  function setActiveAct(index) {
    const actLayers = DOM.actBgs;
    if (!actLayers || actLayers.length === 0) return;

    const targetIdx = Math.min(actLayers.length - 1, Math.max(0, index));
    setHudContent(targetIdx, currentLang);

    if (typeof gsap !== 'undefined') {
      if (typeof gsap.killTweensOf === 'function') {
        gsap.killTweensOf(actLayers);
      }
      const inDuration = prefersReducedMotion ? 0 : 0.45;
      const outDuration = prefersReducedMotion ? 0 : 0.3;

      actLayers.forEach((layer, i) => {
        gsap.to(layer, {
          opacity: i === targetIdx ? 1 : 0,
          duration: i === targetIdx ? inDuration : outDuration,
          ease: 'power2.out',
          overwrite: true
        });
      });

      if (DOM.skyfallRain) {
        if (typeof gsap.killTweensOf === 'function') {
          gsap.killTweensOf(DOM.skyfallRain);
        }
        gsap.to(DOM.skyfallRain, {
          opacity: (targetIdx === 2 && !prefersReducedMotion) ? 0.16 : 0,
          duration: inDuration,
          overwrite: true
        });
      }

      if (DOM.hudSubtitlesContent) {
        if (typeof gsap.killTweensOf === 'function') {
          gsap.killTweensOf(DOM.hudSubtitlesContent);
        }
        if (prefersReducedMotion) {
          gsap.set(DOM.hudSubtitlesContent, { opacity: 1, y: 0 });
        } else {
          gsap.fromTo(
            DOM.hudSubtitlesContent,
            { opacity: 0, y: 6 },
            { opacity: 1, y: 0, duration: 0.4, ease: 'power2.out', overwrite: true }
          );
        }
      }
    } else {
      actLayers.forEach((layer, i) => {
        layer.style.opacity = i === targetIdx ? '1' : '0';
      });
    }
  }

  function handleScrollProgress(progress) {
    const clampedProgress = Math.min(1, Math.max(0, progress));
    const newActIndex = Math.min(4, Math.max(0, Math.floor(clampedProgress * 5)));

    if (DOM.rulerNodes && DOM.rulerNodes.length > 0) {
      DOM.rulerNodes.forEach((node, idx) => {
        node.classList.toggle('active', idx === newActIndex);
      });
    }

    if (DOM.vernierMajorTicks && DOM.vernierMajorTicks.length > 0) {
      DOM.vernierMajorTicks.forEach((tick, idx) => {
        tick.classList.toggle('active', idx === newActIndex);
      });
    }

    if (newActIndex !== currentActIndex) {
      currentActIndex = newActIndex;
      setActiveAct(currentActIndex);

      if (ambientEnabled && inStageAudioZone && !inEpilogueZone) {
        crossfadeAmbientToAct(currentActIndex);
      }
    }
  }

  // ==========================================
  // 6B. SILENT FILM EPILOGUE & 007 -> HN STUDIO MORPH EASTER EGG
  // ==========================================

  function clearEpilogueSfxTimers() {
    epilogueSfxTimers.forEach((tid) => clearTimeout(tid));
    epilogueSfxTimers = [];
  }

  function resetHnMorphPathsTo007() {
    if (!DOM.hnMorphPaths) return;
    DOM.hnMorphPaths.forEach((pathEl, idx) => {
      if (MORPH_PATHS_007[idx]) {
        pathEl.setAttribute('d', MORPH_PATHS_007[idx]);
      }
    });
  }

  function isEpilogueMajorityVisible() {
    if (!DOM.epilogueStage || typeof DOM.epilogueStage.getBoundingClientRect !== 'function') return false;
    const rect = DOM.epilogueStage.getBoundingClientRect();
    const vh = window.innerHeight || document.documentElement.clientHeight || 0;
    if (vh <= 0 || rect.height <= 0) return false;
    const visibleHeight = Math.max(0, Math.min(rect.bottom, vh) - Math.max(rect.top, 0));
    const denominator = Math.min(rect.height, vh);
    return denominator > 0 && (visibleHeight / denominator) >= 0.55;
  }

  function fastForwardEpilogueToEnd(immediate = false) {
    epilogueCreditsStarted = true;
    epilogueCreditsPlayed = true;

    if (epilogueTimeline) {
      epilogueTimeline.kill();
      epilogueTimeline = null;
    }

    if (DOM.epilogueStage) {
      DOM.epilogueStage.classList.remove('is-credits-playing');
    }

    const revealFinalInteractive = () => {
      if (DOM.epilogueFinal) DOM.epilogueFinal.classList.add('is-interactive');
      if (DOM.epilogueHnTrigger) DOM.epilogueHnTrigger.classList.add('is-ready');
    };

    if (immediate || prefersReducedMotion || typeof gsap === 'undefined') {
      if (DOM.epilogueTribute) {
        DOM.epilogueTribute.style.opacity = '0';
        DOM.epilogueTribute.style.visibility = 'hidden';
      }
      if (DOM.epilogueReturn) {
        DOM.epilogueReturn.style.opacity = '0';
        DOM.epilogueReturn.style.visibility = 'hidden';
      }
      if (DOM.epilogueFinal) {
        DOM.epilogueFinal.style.opacity = '1';
        DOM.epilogueFinal.style.visibility = 'visible';
        DOM.epilogueFinal.style.transform = '';
      }
      revealFinalInteractive();
      return;
    }

    if (DOM.epilogueTribute || DOM.epilogueReturn) {
      gsap.to([DOM.epilogueTribute, DOM.epilogueReturn].filter(Boolean), {
        autoAlpha: 0,
        duration: 0.25,
        overwrite: true
      });
    }
    if (DOM.epilogueFinal) {
      gsap.to(DOM.epilogueFinal, {
        autoAlpha: 1,
        y: 0,
        scale: 1,
        filter: 'blur(0px)',
        duration: 0.5,
        ease: 'power2.out',
        overwrite: true,
        onComplete: revealFinalInteractive
      });
    } else {
      revealFinalInteractive();
    }
  }

  function startEpilogueCredits() {
    if (!DOM.epilogueStage) return;

    if (epilogueCreditsPlayed || epilogueCreditsStarted) {
      if (!epilogueCreditsPlayed) {
        fastForwardEpilogueToEnd(true);
      }
      return;
    }

    if (prefersReducedMotion || typeof gsap === 'undefined') {
      fastForwardEpilogueToEnd(true);
      return;
    }

    epilogueCreditsStarted = true;
    DOM.epilogueStage.classList.add('is-credits-playing');

    gsap.set([DOM.epilogueTribute, DOM.epilogueReturn, DOM.epilogueFinal].filter(Boolean), {
      autoAlpha: 0,
      filter: 'blur(0px)',
      scale: 1,
      y: 0
    });
    gsap.set([DOM.epilogueTributeMain, DOM.epilogueTributeCredit].filter(Boolean), {
      autoAlpha: 0,
      filter: 'blur(0px)',
      scale: 1,
      y: 0
    });
    if (DOM.epilogueReturnText) {
      gsap.set(DOM.epilogueReturnText, { autoAlpha: 1, filter: 'blur(0px)', scale: 1, y: 0 });
    }

    epilogueTimeline = gsap.timeline({
      onComplete: () => {
        epilogueCreditsPlayed = true;
        epilogueTimeline = null;
        if (DOM.epilogueStage) DOM.epilogueStage.classList.remove('is-credits-playing');
        if (DOM.epilogueFinal) DOM.epilogueFinal.classList.add('is-interactive');
        if (DOM.epilogueHnTrigger) DOM.epilogueHnTrigger.classList.add('is-ready');
      }
    });

    // Phase 1 (0.0s - 1.9s): Complete #09090b blackout silence pause
    // Phase 2 (1.9s - 6.2s): Tribute Typography inside stationary stacked plane
    if (DOM.epilogueTribute) {
      epilogueTimeline.set(DOM.epilogueTribute, { autoAlpha: 1, filter: 'blur(0px)', scale: 1, y: 0 }, 1.9);
    }
    if (DOM.epilogueTributeMain) {
      epilogueTimeline.fromTo(
        DOM.epilogueTributeMain,
        { autoAlpha: 0, y: 10, filter: 'blur(4px)' },
        { autoAlpha: 1, y: 0, filter: 'blur(0px)', duration: 1.2, ease: 'power2.out' },
        1.9
      );
    }
    if (DOM.epilogueTributeCredit) {
      epilogueTimeline.fromTo(
        DOM.epilogueTributeCredit,
        { autoAlpha: 0, y: 6, filter: 'blur(3px)' },
        { autoAlpha: 0.72, y: 0, filter: 'blur(0px)', duration: 1.0, ease: 'power2.out' },
        3.1
      );
    }

    // Phase 3 (6.2s - 10.15s): Pure In-Place Optical Defocus & 0.35s Overlap Cross-Rack-Focus
    if (DOM.epilogueTribute) {
      epilogueTimeline.to(
        DOM.epilogueTribute,
        {
          autoAlpha: 0,
          filter: 'blur(14px)',
          scale: 1.03,
          duration: 1.0,
          ease: 'power2.inOut'
        },
        6.2
      );
    }

    if (DOM.epilogueReturn) {
      epilogueTimeline.fromTo(
        DOM.epilogueReturn,
        { autoAlpha: 0, filter: 'blur(14px)', scale: 0.97, y: 0 },
        { autoAlpha: 1, filter: 'blur(0px)', scale: 1, y: 0, duration: 1.1, ease: 'power2.out' },
        6.85
      );
      // 7.95s -> 10.15s (2.2s completely stationary hold), then gentle fade-out
      epilogueTimeline.to(
        DOM.epilogueReturn,
        { autoAlpha: 0, filter: 'blur(6px)', duration: 0.85, ease: 'power2.inOut' },
        10.15
      );
    }

    // Phase 4 (10.65s+): Permanent End Screen
    if (DOM.epilogueFinal) {
      epilogueTimeline.fromTo(
        DOM.epilogueFinal,
        { autoAlpha: 0, y: 0, scale: 1, filter: 'blur(0px)' },
        {
          autoAlpha: 1,
          y: 0,
          scale: 1,
          filter: 'blur(0px)',
          duration: 1.35,
          ease: 'power2.out',
          onStart: () => {
            if (DOM.epilogueFinal) DOM.epilogueFinal.classList.add('is-interactive');
          }
        },
        10.65
      );
    }
  }

  function setEpilogueActiveState(active) {
    if (active === inEpilogueZone) return;
    inEpilogueZone = active;

    if (DOM.navHeader) {
      DOM.navHeader.classList.toggle('is-dimmed', active);
    }

    if (active) {
      const hasPlayingDecks = (
        (deckA && !deckA.paused) ||
        (deckB && !deckB.paused) ||
        deckALogicalGain > 0 ||
        deckBLogicalGain > 0
      );
      if (ambientEnabled && hasPlayingDecks) {
        fadeOutAmbientDecks(false, EPILOGUE_AUDIO_FADE_MS);
      }
      startEpilogueCredits();
    } else if (ambientEnabled && inStageAudioZone) {
      crossfadeAmbientToAct(currentActIndex, INITIAL_AUDIO_FADE_MS);
    }
  }

  function openHnMorphEasterEgg() {
    if (!DOM.hnMorphStage || isHnMorphOpen) return;
    isHnMorphOpen = true;

    if (!epilogueCreditsPlayed) {
      fastForwardEpilogueToEnd(true);
    }

    clearEpilogueSfxTimers();
    if (epilogueMorphTimeline) {
      epilogueMorphTimeline.kill();
      epilogueMorphTimeline = null;
    }

    resetHnMorphPathsTo007();
    DOM.hnMorphStage.classList.add('is-open');
    DOM.hnMorphStage.setAttribute('aria-hidden', 'false');
    if (DOM.epilogueHnTrigger) DOM.epilogueHnTrigger.classList.add('is-hidden');
    if (DOM.epilogueFinal) DOM.epilogueFinal.classList.remove('is-interactive');

    getGearAudioContext(true);

    if (prefersReducedMotion || typeof gsap === 'undefined') {
      if (DOM.epilogueFinal) {
        DOM.epilogueFinal.style.opacity = '0';
        DOM.epilogueFinal.style.visibility = 'hidden';
      }
      DOM.hnMorphStage.style.opacity = '1';
      if (DOM.hnMorphPaths) {
        DOM.hnMorphPaths.forEach((pathEl, idx) => {
          if (MORPH_PATHS_HN[idx]) pathEl.setAttribute('d', MORPH_PATHS_HN[idx]);
        });
      }
      if (DOM.hnMorphWordmark) {
        DOM.hnMorphWordmark.style.opacity = '1';
        DOM.hnMorphWordmark.style.transform = 'none';
      }
      if (DOM.hnMorphSubmark) {
        DOM.hnMorphSubmark.style.opacity = '0.58';
        DOM.hnMorphSubmark.style.transform = 'none';
      }
      if (DOM.hnMorphHint) DOM.hnMorphHint.style.opacity = '1';
      GearSFX.playSafetyUnlock();
      return;
    }

    gsap.set(DOM.hnMorphStage, { opacity: 0 });
    if (DOM.hnMorphStrokesSheen) gsap.set(DOM.hnMorphStrokesSheen, { opacity: 0 });
    if (DOM.hnSheenMaskRect) gsap.set(DOM.hnSheenMaskRect, { attr: { x: 62 } });
    if (DOM.hnMorphWordmark) gsap.set(DOM.hnMorphWordmark, { opacity: 0, y: 6 });
    if (DOM.hnMorphSubmark) gsap.set(DOM.hnMorphSubmark, { opacity: 0, y: 4 });
    if (DOM.hnMorphHint) gsap.set(DOM.hnMorphHint, { opacity: 0 });

    if (DOM.epilogueFinal) {
      gsap.to(DOM.epilogueFinal, { autoAlpha: 0, duration: 0.4, ease: 'power2.out', overwrite: true });
    }

    // Real mechanical SFX synchronized with morph motion
    GearSFX.playBezelClick();
    epilogueSfxTimers.push(setTimeout(() => {
      if (isHnMorphOpen) GearSFX.playBezelClick();
    }, 450));
    epilogueSfxTimers.push(setTimeout(() => {
      if (isHnMorphOpen) GearSFX.playSafetyUnlock();
    }, 1350));

    epilogueMorphTimeline = gsap.timeline({
      onComplete: () => {
        epilogueMorphTimeline = null;
      }
    });

    epilogueMorphTimeline.to(DOM.hnMorphStage, { opacity: 1, duration: 0.45, ease: 'power2.out' }, 0);

    if (DOM.hnMorphPaths && DOM.hnMorphPaths.length > 0) {
      DOM.hnMorphPaths.forEach((pathEl, idx) => {
        const targetD = MORPH_PATHS_HN[idx];
        if (!targetD) return;
        epilogueMorphTimeline.to(
          pathEl,
          { attr: { d: targetD }, duration: 1.35, ease: 'power3.inOut' },
          0
        );
      });
    }

    // Lock-in cold silver metallic glint across HN strokes at 1.35s
    if (DOM.hnMorphStrokesSheen && DOM.hnSheenMaskRect) {
      epilogueMorphTimeline.set(DOM.hnMorphStrokesSheen, { opacity: 1 }, 1.35);
      epilogueMorphTimeline.fromTo(
        DOM.hnSheenMaskRect,
        { attr: { x: 68 } },
        { attr: { x: 256 }, duration: 0.72, ease: 'power2.inOut' },
        1.35
      );
      epilogueMorphTimeline.to(DOM.hnMorphStrokesSheen, { opacity: 0, duration: 0.25 }, 1.92);
    }

    if (DOM.hnMorphWordmark) {
      epilogueMorphTimeline.to(DOM.hnMorphWordmark, { opacity: 1, y: 0, duration: 0.7, ease: 'power2.out' }, 1.5);
    }
    if (DOM.hnMorphSubmark) {
      epilogueMorphTimeline.to(DOM.hnMorphSubmark, { opacity: 0.58, y: 0, duration: 0.65, ease: 'power2.out' }, 1.72);
    }
    if (DOM.hnMorphHint) {
      epilogueMorphTimeline.to(DOM.hnMorphHint, { opacity: 1, duration: 0.6, ease: 'power1.out' }, 2.0);
    }
  }

  function closeHnMorphEasterEgg() {
    if (!DOM.hnMorphStage || !isHnMorphOpen) return;
    isHnMorphOpen = false;

    clearEpilogueSfxTimers();
    if (epilogueMorphTimeline) {
      epilogueMorphTimeline.kill();
      epilogueMorphTimeline = null;
    }

    GearSFX.playToggleSwitch();

    const finishClose = () => {
      if (DOM.hnMorphStage) {
        DOM.hnMorphStage.classList.remove('is-open');
        DOM.hnMorphStage.setAttribute('aria-hidden', 'true');
        DOM.hnMorphStage.style.opacity = '0';
      }
      resetHnMorphPathsTo007();
      if (DOM.epilogueHnTrigger) DOM.epilogueHnTrigger.classList.remove('is-hidden');
      if (DOM.epilogueFinal) DOM.epilogueFinal.classList.add('is-interactive');
    };

    if (prefersReducedMotion || typeof gsap === 'undefined') {
      if (DOM.epilogueFinal) {
        DOM.epilogueFinal.style.opacity = '1';
        DOM.epilogueFinal.style.visibility = 'visible';
      }
      finishClose();
      return;
    }

    gsap.to(DOM.hnMorphStage, {
      opacity: 0,
      duration: 0.4,
      ease: 'power2.out',
      overwrite: true,
      onComplete: finishClose
    });
    if (DOM.epilogueFinal) {
      gsap.to(DOM.epilogueFinal, { autoAlpha: 1, y: 0, scale: 1, filter: 'blur(0px)', duration: 0.55, delay: 0.12, ease: 'power2.out', overwrite: true });
    }
  }

  function initEpilogueStage() {
    if (!DOM.epilogueStage) return;

    if ('IntersectionObserver' in window) {
      if (epilogueObserver) epilogueObserver.disconnect();
      epilogueObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            const active = entry.intersectionRatio >= 0.55 || isEpilogueMajorityVisible();
            setEpilogueActiveState(active);
          });
        },
        { threshold: [0, 0.55] }
      );
      epilogueObserver.observe(DOM.epilogueStage);
    }

    // Fallback & high-speed scroll check for environments without active IntersectionObserver ticks
    window.addEventListener(
      'scroll',
      () => {
        if (isEpilogueMajorityVisible()) {
          setEpilogueActiveState(true);
        } else if (inEpilogueZone) {
          setEpilogueActiveState(false);
        }
      },
      { passive: true }
    );

    if (isEpilogueMajorityVisible()) {
      setEpilogueActiveState(true);
    }

    DOM.epilogueStage.addEventListener('click', (e) => {
      if (isHnMorphOpen) {
        const clickedClose = e.target && e.target.closest && e.target.closest('#hn-morph-close');
        if (!clickedClose) closeHnMorphEasterEgg();
        return;
      }

      const clickedTrigger = e.target && e.target.closest && e.target.closest('#epilogue-hn-trigger');
      if (clickedTrigger) return;

      if (epilogueCreditsStarted && !epilogueCreditsPlayed) {
        fastForwardEpilogueToEnd(false);
      }
    });

    if (DOM.epilogueHnTrigger) {
      DOM.epilogueHnTrigger.addEventListener('click', (e) => {
        e.stopPropagation();
        openHnMorphEasterEgg();
      });
    }

    if (DOM.hnMorphClose) {
      DOM.hnMorphClose.addEventListener('click', (e) => {
        e.stopPropagation();
        closeHnMorphEasterEgg();
      });
    }
  }

  // ==========================================
  // 7. BILINGUAL ENGINE (HOT-SWAP)
  // ==========================================

  function setLanguage(newLang) {
    if (newLang !== 'zh' && newLang !== 'en') return;
    if (newLang === currentLang) return;

    currentLang = newLang;

    try {
      localStorage.setItem(STORAGE_KEY_LANG, newLang);
    } catch (e) {
      console.warn('[007 ARCHIVE] localStorage unavailable.');
    }

    DOM.html.setAttribute('lang', currentLang === 'zh' ? 'zh-CN' : 'en');

    if (currentLang === 'zh') {
      if (DOM.langBtnZh) DOM.langBtnZh.classList.add('active');
      if (DOM.langBtnEn) DOM.langBtnEn.classList.remove('active');
    } else {
      if (DOM.langBtnEn) DOM.langBtnEn.classList.add('active');
      if (DOM.langBtnZh) DOM.langBtnZh.classList.remove('active');
    }

    const data = siteData[currentLang];
    if (!data) return;

    renderStaticText(data);
    setHudContent(currentActIndex, currentLang);
    renderArtifactsGrid(data.artifacts, currentLang);
    initDarkroomGallery();
    initScrollReveals();
  }

  // ==========================================
  // 8. EVENT BINDINGS
  // ==========================================

  function setDossierOpen(isOpen) {
    if (!DOM.dossierWidget || !DOM.dossierCrosshairBtn || !DOM.dossierPopover) return;
    DOM.dossierWidget.classList.toggle('is-open', isOpen);
    DOM.dossierCrosshairBtn.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    DOM.dossierPopover.setAttribute('aria-hidden', isOpen ? 'false' : 'true');
  }

  function setupEvents() {
    // Language Switch Buttons
    if (DOM.langBtnZh) DOM.langBtnZh.addEventListener('click', () => setLanguage('zh'));
    if (DOM.langBtnEn) DOM.langBtnEn.addEventListener('click', () => setLanguage('en'));

    // Global Ambient Sound Toggle
    if (DOM.soundToggleBtn) {
      DOM.soundToggleBtn.addEventListener('click', () => {
        toggleAmbientSound();
      });
    }

    // 5-Step Precision Gain Meter (JS .is-expanded + Click/Drag + .blur() & 300ms Auto-Collapse)
    if (DOM.audioGainMeter) {
      const expandGainMeter = () => {
        if (collapseGainTimer) {
          clearTimeout(collapseGainTimer);
          collapseGainTimer = null;
        }
        if (DOM.masterAudioControl) {
          DOM.masterAudioControl.classList.add('is-expanded');
        }
      };

      const blurGainControls = (triggerEl = null) => {
        if (triggerEl && typeof triggerEl.blur === 'function') {
          triggerEl.blur();
        }
        if (DOM.audioGainMeter && typeof DOM.audioGainMeter.blur === 'function') {
          DOM.audioGainMeter.blur();
        }
        if (
          document.activeElement &&
          typeof document.activeElement.blur === 'function' &&
          DOM.masterAudioControl &&
          typeof DOM.masterAudioControl.contains === 'function' &&
          DOM.masterAudioControl.contains(document.activeElement)
        ) {
          document.activeElement.blur();
        }
      };

      const scheduleCollapseGainMeter = (delayMs = GAIN_COLLAPSE_DELAY_MS) => {
        if (collapseGainTimer) clearTimeout(collapseGainTimer);
        collapseGainTimer = setTimeout(() => {
          if (!isDraggingGain && DOM.masterAudioControl) {
            DOM.masterAudioControl.classList.remove('is-expanded');
          }
          collapseGainTimer = null;
        }, delayMs);
      };

      if (DOM.masterAudioControl) {
        DOM.masterAudioControl.addEventListener('pointerenter', expandGainMeter);
        DOM.masterAudioControl.addEventListener('pointerleave', () => {
          if (!isDraggingGain) {
            scheduleCollapseGainMeter(GAIN_COLLAPSE_DELAY_MS);
          }
        });
      }

      const endGainDrag = (e) => {
        if (!isDraggingGain) return;
        isDraggingGain = false;
        if (DOM.masterAudioControl) {
          DOM.masterAudioControl.classList.remove('is-dragging');
        }
        blurGainControls(e && e.target);
        scheduleCollapseGainMeter(GAIN_COLLAPSE_DELAY_MS);
      };

      DOM.audioGainMeter.addEventListener('pointerdown', (e) => {
        expandGainMeter();
        isDraggingGain = true;
        if (DOM.masterAudioControl) {
          DOM.masterAudioControl.classList.add('is-dragging');
        }
        if (typeof DOM.audioGainMeter.setPointerCapture === 'function' && e.pointerId !== undefined) {
          try {
            DOM.audioGainMeter.setPointerCapture(e.pointerId);
          } catch (err) {
            // ignore unsupported pointer capture
          }
        }
        const barEl = e.target && e.target.closest ? e.target.closest('.gain-bar') : null;
        const vol = computeVolumeFromClientX(e.clientX, barEl);
        setMasterVolume(vol, !ambientEnabled);
      });

      DOM.audioGainMeter.addEventListener('pointermove', (e) => {
        if (!isDraggingGain) return;
        const vol = computeVolumeFromClientX(e.clientX);
        setMasterVolume(vol, false);
      });

      DOM.audioGainMeter.addEventListener('pointerup', endGainDrag);
      DOM.audioGainMeter.addEventListener('pointercancel', endGainDrag);
      window.addEventListener('pointerup', endGainDrag);

      DOM.audioGainMeter.addEventListener('click', (e) => {
        expandGainMeter();
        const barEl = e.target && e.target.closest ? e.target.closest('.gain-bar') : null;
        const levelAttr = barEl ? parseFloat(barEl.getAttribute('data-level') || '') : NaN;
        const vol = !isNaN(levelAttr) ? levelAttr : computeVolumeFromClientX(e.clientX, barEl);
        setMasterVolume(vol, !ambientEnabled);
        blurGainControls(barEl || DOM.audioGainMeter);
        scheduleCollapseGainMeter(GAIN_COLLAPSE_DELAY_MS);
      });

      DOM.audioGainMeter.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowRight' || e.key === 'ArrowUp') {
          e.preventDefault();
          expandGainMeter();
          setMasterVolume(Math.min(1, masterVolume + 0.2), !ambientEnabled);
          scheduleCollapseGainMeter(GAIN_COLLAPSE_DELAY_MS);
        } else if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') {
          e.preventDefault();
          expandGainMeter();
          setMasterVolume(Math.max(0.2, masterVolume - 0.2), !ambientEnabled);
          scheduleCollapseGainMeter(GAIN_COLLAPSE_DELAY_MS);
        }
      });
    }

    // Crosshair (+) Dossier Easter Egg Toggle & Outside Close
    if (DOM.dossierCrosshairBtn && DOM.dossierWidget) {
      DOM.dossierCrosshairBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        const isCurrentlyOpen = DOM.dossierWidget.classList.contains('is-open');
        setDossierOpen(!isCurrentlyOpen);
      });

      document.addEventListener('click', (e) => {
        if (DOM.dossierWidget.classList.contains('is-open') && !DOM.dossierWidget.contains(e.target)) {
          setDossierOpen(false);
        }
      });
    }

    const scrollToPageTop = (e) => {
      if (e) e.preventDefault();
      if (prefersReducedMotion) {
        window.scrollTo(0, 0);
      } else if (typeof gsap !== 'undefined' && gsap.plugins && gsap.plugins.scrollTo) {
        gsap.to(window, {
          duration: 1.25,
          scrollTo: 0,
          ease: 'power3.inOut'
        });
      } else {
        window.scrollTo({
          top: 0,
          behavior: 'smooth'
        });
      }
    };

    // Return to Top (Nav 007 Logo)
    if (DOM.navHomeBtn) {
      DOM.navHomeBtn.addEventListener('click', scrollToPageTop);
    }

    // Vernier Scale Milestone Click-to-Jump Navigation
    if (DOM.rulerNodes && DOM.rulerNodes.length > 0) {
      DOM.rulerNodes.forEach((node) => {
        node.addEventListener('click', (e) => {
          e.preventDefault();
          const actIdx = parseInt(node.getAttribute('data-act-index'), 10);
          if (isNaN(actIdx) || !oneShotTimeline || !oneShotTimeline.scrollTrigger) return;

          const st = oneShotTimeline.scrollTrigger;
          const targetProgress = ACT_PROGRESS_TARGETS[actIdx];
          const targetScroll = st.start + targetProgress * (st.end - st.start);

          if (prefersReducedMotion) {
            window.scrollTo(0, targetScroll);
          } else if (typeof gsap !== 'undefined' && gsap.plugins && gsap.plugins.scrollTo) {
            gsap.to(window, {
              duration: 1.1,
              scrollTo: targetScroll,
              ease: 'power2.inOut'
            });
          } else {
            window.scrollTo({
              top: targetScroll,
              behavior: 'smooth'
            });
          }
        });
      });
    }

    // Keyboard Access: Alt + L for language switch, Escape to close dossier or HN Studio morph
    window.addEventListener('keydown', (e) => {
      if (e.altKey && (e.key === 'l' || e.key === 'L')) {
        setLanguage(currentLang === 'zh' ? 'en' : 'zh');
      }
      if (e.key === 'Escape' || e.key === 'Esc') {
        if (isHnMorphOpen) {
          closeHnMorphEasterEgg();
        } else if (DOM.dossierWidget && DOM.dossierWidget.classList.contains('is-open')) {
          setDossierOpen(false);
        }
      }
    });

    // Debounced Width-Aware Resize Handler
    window.addEventListener('resize', () => {
      const currentWidth = window.innerWidth;
      if (currentWidth === lastWindowWidth) return;
      lastWindowWidth = currentWidth;
      if (resizeTimerId) clearTimeout(resizeTimerId);
      resizeTimerId = setTimeout(() => {
        if (typeof ScrollTrigger !== 'undefined') {
          ScrollTrigger.refresh();
        }
      }, 200);
    });
  }

  // ==========================================
  // 9. UTILITIES
  // ==========================================
  function escapeHTML(str) {
    if (!str || typeof str !== 'string') return '';
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  // ==========================================
  // 10. INITIALIZATION
  // ==========================================
  function init() {
    try {
      const cachedLang = localStorage.getItem(STORAGE_KEY_LANG);
      if (cachedLang === 'zh' || cachedLang === 'en') {
        currentLang = cachedLang;
      }
    } catch (e) {
      currentLang = DEFAULT_LANG;
    }

    try {
      const cachedVol = parseFloat(sessionStorage.getItem(STORAGE_KEY_VOL) || '');
      if (!isNaN(cachedVol)) {
        masterVolume = Math.round(Math.min(1, Math.max(0.2, cachedVol)) * 100) / 100;
      }
    } catch (e) {
      masterVolume = DEFAULT_MASTER_VOLUME;
    }

    const data = siteData[currentLang];
    if (!data) return;

    setupEvents();
    applyMasterVolume();
    updateSoundToggleUI();
    updateGainMeterUI();

    DOM.html.setAttribute('lang', currentLang === 'zh' ? 'zh-CN' : 'en');
    if (currentLang === 'zh') {
      if (DOM.langBtnZh) DOM.langBtnZh.classList.add('active');
      if (DOM.langBtnEn) DOM.langBtnEn.classList.remove('active');
    } else {
      if (DOM.langBtnEn) DOM.langBtnEn.classList.add('active');
      if (DOM.langBtnZh) DOM.langBtnZh.classList.remove('active');
    }

    renderStaticText(data);
    applyLocalBackdrops();
    setHudContent(0, currentLang);

    renderArtifactsGrid(data.artifacts, currentLang);
    initDarkroomGallery();
    initScrollReveals();
    initEpilogueStage();

    if (document.readyState === 'complete') {
      initGunBarrelScrollytelling();
    } else {
      window.addEventListener('load', () => {
        initGunBarrelScrollytelling();
      });
    }

    // Attempt default 30% ambient fade-in right on Hero; fall back cleanly to standby unlock if blocked
    if (ambientEnabled && inStageAudioZone && !inEpilogueZone) {
      crossfadeAmbientToAct(0, INITIAL_AUDIO_FADE_MS);
    }

    console.info(`[007 ARCHIVE INITIALIZED] Daniel Craig Era // Language: ${currentLang.toUpperCase()}`);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
