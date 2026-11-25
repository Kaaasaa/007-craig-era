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
  let soundtracksRevealed = false;
  let artifactsObserver = null;
  let soundtracksObserver = null;

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
  let activeAmbientDeck = deckA;
  let ambientTrackIndex = -1;
  let crossfadeRafId = null;

  // Single manual preview player for Sonic Legacy section
  const manualAudio = typeof Audio !== 'undefined' ? new Audio() : null;
  if (manualAudio) {
    manualAudio.preload = 'none';
    manualAudio.volume = DEFAULT_MASTER_VOLUME;
  }
  let activeManualTrackIndex = -1;
  let isManualPlaying = false;
  let manualProgressPct = 0;

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
    artifactsSubtitle: document.getElementById('artifacts-subtitle'),
    artifactsGridContainer: document.getElementById('artifacts-grid-container'),

    // Soundtracks Section
    soundtracksSectionIdx: document.getElementById('soundtracks-section-idx'),
    soundtracksSectionCat: document.getElementById('soundtracks-section-cat'),
    soundtracksTitle: document.getElementById('soundtracks-title'),
    soundtracksSubtitle: document.getElementById('soundtracks-subtitle'),
    soundtracksContainer: document.getElementById('soundtracks-container'),

    // Curtain Call Footer
    curtainQuote: document.getElementById('curtain-quote'),
    curtainQuoteZh: document.getElementById('curtain-quote-zh'),
    curtainEraMark: document.getElementById('curtain-era-mark'),
    curtainCredit: document.getElementById('curtain-credit'),
    backToTopBtn: document.getElementById('back-to-top')
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

    // Artifacts Section Headers
    if (DOM.artifactsSectionIdx) DOM.artifactsSectionIdx.textContent = data.artifactsSection.sectionIndex;
    if (DOM.artifactsSectionCat) DOM.artifactsSectionCat.textContent = data.artifactsSection.sectionCategory;
    if (DOM.artifactsTitle) DOM.artifactsTitle.textContent = data.artifactsSection.title;
    if (DOM.artifactsSubtitle) DOM.artifactsSubtitle.textContent = data.artifactsSection.subtitle;

    // Soundtracks Section Headers
    if (DOM.soundtracksSectionIdx) DOM.soundtracksSectionIdx.textContent = data.soundtracksSection.sectionIndex;
    if (DOM.soundtracksSectionCat) DOM.soundtracksSectionCat.textContent = data.soundtracksSection.sectionCategory;
    if (DOM.soundtracksTitle) DOM.soundtracksTitle.textContent = data.soundtracksSection.title;
    if (DOM.soundtracksSubtitle) DOM.soundtracksSubtitle.textContent = data.soundtracksSection.subtitle;

    // Curtain Call Footer
    if (data.curtainCall) {
      if (DOM.curtainQuote) DOM.curtainQuote.textContent = data.curtainCall.quote;
      if (DOM.curtainQuoteZh) {
        DOM.curtainQuoteZh.textContent = data.curtainCall.quoteTranslation || '';
        DOM.curtainQuoteZh.style.display = data.curtainCall.quoteTranslation ? 'block' : 'none';
      }
      if (DOM.curtainEraMark) DOM.curtainEraMark.textContent = data.curtainCall.eraMark;
      if (DOM.curtainCredit) DOM.curtainCredit.textContent = data.curtainCall.credit;
      if (DOM.backToTopBtn) DOM.backToTopBtn.setAttribute('aria-label', data.curtainCall.backToTopAria);
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

  function renderArtifactsGrid(artifacts, lang) {
    if (!DOM.artifactsGridContainer || !Array.isArray(artifacts)) return;

    const revealClass = artifactsRevealed ? 'reveal-item is-revealed' : 'reveal-item';

    const html = artifacts.map(item => {
      const displayName = item.name;
      const displayNameZh = (lang === 'zh' && item.nameZh) ? `<div class="artifact-name-zh">${escapeHTML(item.nameZh)}</div>` : '';

      return `
        <article class="artifact-card ${revealClass}" data-artifact-id="${item.id}">
          <div class="artifact-header">
            <span class="artifact-catalog">${escapeHTML(item.catalogNumber)}</span>
            <h3 class="artifact-name">${escapeHTML(displayName)}</h3>
            ${displayNameZh}
            <div class="artifact-specs">${escapeHTML(item.specs)}</div>
          </div>
          <p class="artifact-commentary">${escapeHTML(item.commentary)}</p>
        </article>
      `;
    }).join('');

    DOM.artifactsGridContainer.innerHTML = html;
  }

  function renderSoundtrackCatalog(soundtracks, sectionData, lang) {
    if (!DOM.soundtracksContainer || !Array.isArray(soundtracks)) return;

    const headers = sectionData.headers;
    const headerRowHtml = `
      <div class="soundtrack-header-row" aria-hidden="true">
        <span>${escapeHTML(headers.year)}</span>
        <span>${escapeHTML(headers.track)}</span>
        <span>${escapeHTML(headers.film)}</span>
        <span>${escapeHTML(headers.critique)}</span>
        <span></span>
      </div>
    `;

    const revealClass = soundtracksRevealed ? 'reveal-item is-revealed' : 'reveal-item';

    const rowsHtml = soundtracks.map((track, idx) => {
      const displayFilm = lang === 'zh' ? track.filmZh : track.film;
      const isRowPlaying = isManualPlaying && idx === activeManualTrackIndex;
      const playingClass = isRowPlaying ? 'is-playing' : '';
      const ariaAction = isRowPlaying ? sectionData.pauseAria : sectionData.playAria;
      const progressWidth = isRowPlaying ? manualProgressPct : 0;

      return `
        <div class="soundtrack-row ${revealClass} ${playingClass}"
             data-year="${track.year}"
             data-track-index="${idx}"
             data-audio-src="${escapeHTML(track.audioSrc || '')}"
             role="button"
             tabindex="0"
             aria-pressed="${isRowPlaying ? 'true' : 'false'}"
             aria-label="${escapeHTML(ariaAction)}: ${escapeHTML(track.track)}">
          <div class="track-year">${track.year}</div>
          <div class="track-title-group">
            <div class="track-name">"${escapeHTML(track.track)}"</div>
            <div class="track-artist">${escapeHTML(track.artist)}</div>
          </div>
          <div class="track-film">
            <span>${escapeHTML(displayFilm)}</span>
            <span class="track-film-sub">${track.year}</span>
          </div>
          <div class="track-critique">${escapeHTML(track.critique)}</div>
          <div class="track-audio-ctrl" aria-hidden="true">
            <svg class="icon-play-svg" viewBox="0 0 16 16" width="13" height="13" fill="currentColor">
              <polygon points="3.5,2 13.5,8 3.5,14"></polygon>
            </svg>
            <svg class="eq-bars-svg" viewBox="0 0 20 14" width="20" height="14" fill="currentColor">
              <rect class="eq-bar eq-bar-1" x="1" y="2" width="2.2" height="12"></rect>
              <rect class="eq-bar eq-bar-2" x="6" y="2" width="2.2" height="12"></rect>
              <rect class="eq-bar eq-bar-3" x="11" y="2" width="2.2" height="12"></rect>
              <rect class="eq-bar eq-bar-4" x="16" y="2" width="2.2" height="12"></rect>
            </svg>
            <svg class="icon-pause-svg" viewBox="0 0 16 16" width="12" height="12" fill="currentColor">
              <rect x="3" y="2.5" width="3" height="11"></rect>
              <rect x="10" y="2.5" width="3" height="11"></rect>
            </svg>
          </div>
          <div class="track-progress-bar" aria-hidden="true">
            <div class="track-progress-fill" style="width: ${progressWidth.toFixed(2)}%;"></div>
          </div>
        </div>
      `;
    }).join('');

    DOM.soundtracksContainer.innerHTML = headerRowHtml + rowsHtml;
  }

  function initScrollReveals() {
    if (prefersReducedMotion || !('IntersectionObserver' in window)) {
      artifactsRevealed = true;
      soundtracksRevealed = true;
      document.querySelectorAll('.reveal-item').forEach(el => el.classList.add('is-revealed'));
      return;
    }

    if (DOM.artifactsGridContainer && !artifactsRevealed) {
      if (artifactsObserver) artifactsObserver.disconnect();
      artifactsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            artifactsRevealed = true;
            const cards = DOM.artifactsGridContainer.querySelectorAll('.artifact-card');
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

    if (DOM.soundtracksContainer && !soundtracksRevealed) {
      if (soundtracksObserver) soundtracksObserver.disconnect();
      soundtracksObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            soundtracksRevealed = true;
            const rows = DOM.soundtracksContainer.querySelectorAll('.soundtrack-row');
            rows.forEach((row, idx) => {
              setTimeout(() => {
                row.classList.add('is-revealed');
              }, idx * 80);
            });
            soundtracksObserver.unobserve(entry.target);
          }
        });
      }, { threshold: 0.10, rootMargin: '0px 0px -40px 0px' });
      soundtracksObserver.observe(DOM.soundtracksContainer);
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
  // 5. DUAL-DECK SCROLL CROSSFADE & MANUAL AUDIO ENGINE
  // ==========================================

  function applyMasterVolume() {
    const safeVol = Math.min(1, Math.max(0.2, masterVolume));
    if (deckA) deckA.volume = Math.min(1, Math.max(0, deckALogicalGain * safeVol));
    if (deckB) deckB.volume = Math.min(1, Math.max(0, deckBLogicalGain * safeVol));
    if (manualAudio) manualAudio.volume = safeVol;
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

    if (unmuteIfSilent && !ambientEnabled && !isManualPlaying) {
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
    const isStandby = pendingAutoplayUnlock && !isManualPlaying;

    if (DOM.masterAudioControl) {
      DOM.masterAudioControl.classList.toggle('is-sound-on', isActivelyOn);
      DOM.masterAudioControl.classList.toggle('is-sound-standby', isStandby);
      DOM.masterAudioControl.classList.toggle('is-active', isActivelyOn || isManualPlaying || isStandby);
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
      // If user clicked a manual bottom track row, yield standby to manual playback
      if (target.closest('.soundtrack-row')) {
        clearPendingAutoplayUnlock();
        updateSoundToggleUI();
        return;
      }
    }

    clearPendingAutoplayUnlock();
    ambientEnabled = true;
    updateSoundToggleUI();
    if (inStageAudioZone && !isManualPlaying) {
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
   * Cancel any active rAF crossfade and ramp/stop ambient decks smoothly
   * @param {boolean} immediate - true to immediately silence & pause both decks
   */
  function fadeOutAmbientDecks(immediate = false) {
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
    const fadeDuration = 750;

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
    if (!ambientEnabled || !inStageAudioZone || !deckA || !deckB) return;
    if (isManualPlaying) return;

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
      // Stop any manual soundtrack in Sonic Legacy to guarantee single audio source
      stopManualAudio();
      updateSoundToggleUI();
      if (inStageAudioZone) {
        crossfadeAmbientToAct(currentActIndex, INITIAL_AUDIO_FADE_MS);
      }
    } else {
      updateSoundToggleUI();
      fadeOutAmbientDecks(false);
    }
  }

  function syncAudioRowsUI(resetAllProgress = false) {
    if (!DOM.soundtracksContainer) return;
    const data = siteData[currentLang];
    const sData = data ? data.soundtracksSection : { playAria: 'Preview', pauseAria: 'Pause' };
    const rows = DOM.soundtracksContainer.querySelectorAll('.soundtrack-row');

    rows.forEach((row) => {
      const idx = parseInt(row.getAttribute('data-track-index'), 10);
      const isRowPlaying = isManualPlaying && idx === activeManualTrackIndex;

      row.classList.toggle('is-playing', isRowPlaying);
      row.setAttribute('aria-pressed', isRowPlaying ? 'true' : 'false');

      const trackObj = data && data.soundtracks ? data.soundtracks[idx] : null;
      const trackTitle = trackObj ? trackObj.track : '';
      const actionLabel = isRowPlaying ? sData.pauseAria : sData.playAria;
      row.setAttribute('aria-label', `${actionLabel}: ${trackTitle}`);

      if (resetAllProgress || idx !== activeManualTrackIndex) {
        const fillEl = row.querySelector('.track-progress-fill');
        if (fillEl) fillEl.style.width = '0%';
      }
    });

    if (DOM.masterAudioControl) {
      DOM.masterAudioControl.classList.toggle('is-active', ambientEnabled || isManualPlaying);
    }
  }

  function stopManualAudio() {
    if (!manualAudio) return;
    manualAudio.pause();
    isManualPlaying = false;
    activeManualTrackIndex = -1;
    manualProgressPct = 0;
    syncAudioRowsUI(true);
  }

  function handleTrackRowToggle(row) {
    if (!row || !manualAudio) return;

    const idx = parseInt(row.getAttribute('data-track-index'), 10);
    const src = row.getAttribute('data-audio-src');
    if (isNaN(idx) || !src) return;

    // Immediately yield ambient scroll-synced sound & cancel standby if active (never two tracks simultaneously)
    if (pendingAutoplayUnlock) {
      clearPendingAutoplayUnlock();
    }
    if (ambientEnabled) {
      ambientEnabled = false;
      updateSoundToggleUI();
      fadeOutAmbientDecks(true);
    } else {
      updateSoundToggleUI();
    }

    if (idx === activeManualTrackIndex && isManualPlaying) {
      manualAudio.pause();
      isManualPlaying = false;
      syncAudioRowsUI(false);
      return;
    }

    if (idx === activeManualTrackIndex && !isManualPlaying) {
      isManualPlaying = true;
      manualAudio.volume = Math.min(1, Math.max(0.2, masterVolume));
      syncAudioRowsUI(false);
      const playPromise = manualAudio.play();
      if (playPromise && typeof playPromise.catch === 'function') {
        playPromise.catch((err) => {
          if (err && err.name !== 'AbortError') {
            isManualPlaying = false;
            syncAudioRowsUI(false);
          }
        });
      }
      return;
    }

    manualAudio.pause();
    manualProgressPct = 0;
    activeManualTrackIndex = idx;
    isManualPlaying = true;
    manualAudio.src = src;
    manualAudio.currentTime = 0;
    manualAudio.volume = Math.min(1, Math.max(0.2, masterVolume));
    syncAudioRowsUI(true);

    const playPromise = manualAudio.play();
    if (playPromise && typeof playPromise.catch === 'function') {
      playPromise.catch((err) => {
        if (err && err.name !== 'AbortError') {
          isManualPlaying = false;
          activeManualTrackIndex = -1;
          manualProgressPct = 0;
          syncAudioRowsUI(true);
        }
      });
    }
  }

  function initAudioPlayer() {
    if (DOM.soundtracksContainer) {
      DOM.soundtracksContainer.addEventListener('click', (e) => {
        const row = e.target && e.target.closest ? e.target.closest('.soundtrack-row') : null;
        if (row) handleTrackRowToggle(row);
      });

      DOM.soundtracksContainer.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          const row = e.target && e.target.closest ? e.target.closest('.soundtrack-row') : null;
          if (row) {
            e.preventDefault();
            handleTrackRowToggle(row);
          }
        }
      });
    }

    if (!manualAudio) return;

    manualAudio.addEventListener('timeupdate', () => {
      if (!isManualPlaying || activeManualTrackIndex < 0 || !DOM.soundtracksContainer) return;
      if (manualAudio.duration > 0 && isFinite(manualAudio.duration)) {
        manualProgressPct = Math.min(100, Math.max(0, (manualAudio.currentTime / manualAudio.duration) * 100));
        const activeRow = DOM.soundtracksContainer.querySelector(`.soundtrack-row[data-track-index="${activeManualTrackIndex}"]`);
        const fillEl = activeRow ? activeRow.querySelector('.track-progress-fill') : null;
        if (fillEl) {
          fillEl.style.width = `${manualProgressPct.toFixed(2)}%`;
        }
      }
    });

    manualAudio.addEventListener('ended', () => {
      isManualPlaying = false;
      activeManualTrackIndex = -1;
      manualProgressPct = 0;
      manualAudio.currentTime = 0;
      syncAudioRowsUI(true);
    });

    manualAudio.addEventListener('error', () => {
      isManualPlaying = false;
      activeManualTrackIndex = -1;
      manualProgressPct = 0;
      syncAudioRowsUI(true);
    });
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

      if (ambientEnabled && inStageAudioZone) {
        crossfadeAmbientToAct(currentActIndex);
      }
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
    renderSoundtrackCatalog(data.soundtracks, data.soundtracksSection, currentLang);
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
        setMasterVolume(vol, !ambientEnabled && !isManualPlaying);
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
        setMasterVolume(vol, !ambientEnabled && !isManualPlaying);
        blurGainControls(barEl || DOM.audioGainMeter);
        scheduleCollapseGainMeter(GAIN_COLLAPSE_DELAY_MS);
      });

      DOM.audioGainMeter.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowRight' || e.key === 'ArrowUp') {
          e.preventDefault();
          expandGainMeter();
          setMasterVolume(Math.min(1, masterVolume + 0.2), !ambientEnabled && !isManualPlaying);
          scheduleCollapseGainMeter(GAIN_COLLAPSE_DELAY_MS);
        } else if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') {
          e.preventDefault();
          expandGainMeter();
          setMasterVolume(Math.max(0.2, masterVolume - 0.2), !ambientEnabled && !isManualPlaying);
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

    // Return to Top (Nav 007 Logo + Curtain Call Button)
    if (DOM.navHomeBtn) {
      DOM.navHomeBtn.addEventListener('click', scrollToPageTop);
    }
    if (DOM.backToTopBtn) {
      DOM.backToTopBtn.addEventListener('click', scrollToPageTop);
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

    // Keyboard Access: Alt + L for language switch, Escape to close crosshair dossier
    window.addEventListener('keydown', (e) => {
      if (e.altKey && (e.key === 'l' || e.key === 'L')) {
        setLanguage(currentLang === 'zh' ? 'en' : 'zh');
      }
      if ((e.key === 'Escape' || e.key === 'Esc') && DOM.dossierWidget && DOM.dossierWidget.classList.contains('is-open')) {
        setDossierOpen(false);
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
    renderSoundtrackCatalog(data.soundtracks, data.soundtracksSection, currentLang);
    initScrollReveals();
    initAudioPlayer();

    if (document.readyState === 'complete') {
      initGunBarrelScrollytelling();
    } else {
      window.addEventListener('load', () => {
        initGunBarrelScrollytelling();
      });
    }

    // Attempt default 30% ambient fade-in right on Hero; fall back cleanly to standby unlock if blocked
    if (ambientEnabled && inStageAudioZone && !isManualPlaying) {
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
