/**
 * MI6 DECLASSIFIED ARCHIVE // DANIEL CRAIG 007 ERA (2006-2021)
 * Application Layer, Gun Barrel Aperture Scrollytelling & Local Archival Backdrop Engine
 * 
 * Features:
 * 1. Precision Gun Barrel Aperture: optical spotlight mask + rotating spiral rifling SVG
 * 2. 5-Act one-shot timeline with mechanical rotational damping and full-screen aperture climax
 * 3. Local static widescreen backdrops (assets/act-1.webp .. act-5.webp) with CSS gradient fallback
 * 4. Bilingual hot-swap engine: in-place updates for HUD, titles, subtitles, and archival sections
 * 5. Timeline ruler navigation with click-to-jump smooth scrolling
 */

(function () {
  'use strict';

  // ==========================================
  // 1. STATE & CONSTANTS
  // ==========================================
  const STORAGE_KEY_LANG = 'bond_archive_lang';
  const DEFAULT_LANG = 'zh';

  // Scrub progress targets for each of the 5 acts (0.0 to 1.0)
  const ACT_PROGRESS_TARGETS = [0.04, 0.27, 0.49, 0.71, 0.90];

  // Fallback atmospheric linear gradients layered underneath local static backdrops
  const ACT_FALLBACK_GRADIENTS = [
    'linear-gradient(160deg, rgba(19, 31, 46, 0.96) 0%, rgba(10, 15, 22, 0.98) 55%, #06090D 100%)',
    'linear-gradient(160deg, rgba(44, 30, 18, 0.96) 0%, rgba(22, 16, 11, 0.98) 55%, #0D0A07 100%)',
    'linear-gradient(160deg, rgba(28, 30, 33, 0.96) 0%, rgba(16, 18, 20, 0.98) 55%, #090A0B 100%)',
    'linear-gradient(160deg, rgba(28, 23, 15, 0.96) 0%, rgba(13, 11, 9, 0.98) 55%, #070605 100%)',
    'linear-gradient(160deg, rgba(15, 28, 26, 0.96) 0%, rgba(9, 16, 18, 0.98) 55%, #05090A 100%)'
  ];

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

  // Single global audio preview instance (Zero native <audio controls>)
  const globalAudio = typeof Audio !== 'undefined' ? new Audio() : null;
  if (globalAudio) {
    globalAudio.preload = 'none';
  }
  let activeTrackIndex = -1;
  let isAudioPlaying = false;
  let audioProgressPct = 0;

  // Verify that SITE_DATA is loaded
  const siteData = typeof SITE_DATA !== 'undefined' ? SITE_DATA : (window.SITE_DATA || globalThis.SITE_DATA);
  if (!siteData) {
    console.error('[MI6 ARCHIVE ERROR] SITE_DATA data layer is missing. Please check data.js inclusion.');
    return;
  }

  // ==========================================
  // 2. DOM CACHE
  // ==========================================
  const DOM = {
    html: document.documentElement,
    mainContent: document.getElementById('main-content'),

    // Nav
    navBrandCode: document.getElementById('nav-brand-code'),
    navBrandSub: document.getElementById('nav-brand-sub'),
    langBtnEn: document.getElementById('lang-btn-en'),
    langBtnZh: document.getElementById('lang-btn-zh'),

    // Hero / Prologue
    heroArchiveHeader: document.getElementById('hero-archive-header'),
    heroClassification: document.getElementById('hero-classification'),
    heroEyebrow: document.getElementById('hero-eyebrow'),
    heroMainTitle: document.getElementById('hero-main-title'),
    heroTitleTranslation: document.getElementById('hero-title-translation'),
    heroSubtitle: document.getElementById('hero-subtitle'),
    heroLead: document.getElementById('hero-lead'),
    heroScrollPrompt: document.getElementById('hero-scroll-prompt'),
    heroScrollHint: document.getElementById('hero-scroll-hint'),

    // Gun Barrel Aperture Stage (Single Backdrop Stack with Optical Spotlight Mask)
    oneShotStage: document.getElementById('one-shot-stage'),
    spotlightMask: document.getElementById('aperture-spotlight-mask'),
    riflingContainer: document.getElementById('rifling-container'),
    riflingRotor: document.getElementById('rifling-rotor'),
    actBgs: document.querySelectorAll('.act-bg'),
    actBackdrops: document.querySelectorAll('.act-backdrop'),
    skyfallRain: document.querySelector('.skyfall-rain'),
    giantTitleNodes: document.querySelectorAll('.giant-title-node'),

    // Viewfinder HUD & Subtitles
    hudTopLeft: document.getElementById('hud-top-left'),
    hudArchiveStamp: document.getElementById('hud-archive-stamp'),
    hudDirector: document.getElementById('hud-director'),
    hudBottomLeft: document.getElementById('hud-bottom-left'),
    hudLocationTag: document.getElementById('hud-location-tag'),
    hudCoords: document.getElementById('hud-coords'),
    hudSubtitlesContent: document.getElementById('hud-subtitles-content'),
    hudQuoteText: document.getElementById('hud-quote-text'),
    hudQuoteContext: document.getElementById('hud-quote-context'),
    hudCommentary: document.getElementById('hud-commentary'),

    // Timeline Progress Ruler
    stageRuler: document.getElementById('stage-ruler'),
    rulerProgressFill: document.getElementById('ruler-progress-fill'),
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

    // Footer
    footerAgentDossier: document.getElementById('footer-agent-dossier'),
    footerJurisdiction: document.getElementById('footer-jurisdiction'),
    footerDisclaimer: document.getElementById('footer-disclaimer'),
    footerBackToTop: document.getElementById('footer-back-to-top'),
    backToTopBtn: document.getElementById('back-to-top')
  };

  // ==========================================
  // 3. RENDER METHODS
  // ==========================================

  /**
   * Render static UI elements based on current locale data
   * @param {Object} data - localized SITE_DATA slice
   */
  function renderStaticText(data) {
    document.title = data.meta.title;
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute('content', data.meta.description);
    }

    // Top Navigation
    if (DOM.navBrandCode) DOM.navBrandCode.textContent = data.nav.brandCode;
    if (DOM.navBrandSub) DOM.navBrandSub.textContent = data.nav.brandSub;

    // Hero Section
    if (DOM.heroArchiveHeader) DOM.heroArchiveHeader.textContent = data.hero.archiveHeader;
    if (DOM.heroClassification) DOM.heroClassification.textContent = data.hero.classification;
    if (DOM.heroMainTitle) DOM.heroMainTitle.textContent = data.hero.mainTitle;
    if (DOM.heroTitleTranslation) DOM.heroTitleTranslation.textContent = data.hero.titleTranslation;
    if (DOM.heroSubtitle) DOM.heroSubtitle.textContent = data.hero.subtitle;
    if (DOM.heroLead) DOM.heroLead.textContent = data.hero.leadParagraph;
    if (DOM.heroScrollPrompt) DOM.heroScrollPrompt.textContent = data.hero.scrollPrompt;
    if (DOM.heroScrollHint) DOM.heroScrollHint.textContent = data.hero.scrollHint;

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

    // Footer
    if (DOM.footerAgentDossier) DOM.footerAgentDossier.textContent = data.footer.agentDossier;
    if (DOM.footerJurisdiction) DOM.footerJurisdiction.textContent = data.footer.jurisdiction;
    if (DOM.footerDisclaimer) DOM.footerDisclaimer.textContent = data.footer.disclaimer;
    if (DOM.footerBackToTop) DOM.footerBackToTop.textContent = data.footer.backToTop;
  }

  /**
   * Update Giant Parallax Film Titles
   * @param {string} lang - 'zh' | 'en'
   */
  function updateGiantTitles(lang) {
    const data = siteData[lang];
    if (!data || !data.films || !DOM.giantTitleNodes) return;

    data.films.forEach((film, index) => {
      const node = document.getElementById(`giant-title-${index}`);
      if (!node) return;

      const titleEl = node.querySelector('.giant-title-text');
      const subEl = node.querySelector('.giant-title-sub');

      if (titleEl) {
        titleEl.textContent = film.title.toUpperCase();
      }

      if (subEl) {
        if (lang === 'zh') {
          subEl.textContent = film.titleZh;
          subEl.style.display = 'block';
        } else {
          subEl.textContent = film.theme;
          subEl.style.display = 'block';
        }
      }
    });
  }

  /**
   * Update Viewfinder HUD Data & Bottom Movie Subtitles (Layer 4)
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
    const displayTheme = lang === 'zh' ? (film.themeZh || film.theme) : film.theme;
    const displayQuote = lang === 'zh' ? film.quoteZh : film.quote;
    const displayQuoteCtx = lang === 'zh' ? film.quoteContextZh : film.quoteContext;
    const displayCommentary = film.arcCommentary;
    const displayLocation = film.coordinates.location;

    // Top-Left Archive & Director
    if (DOM.hudArchiveStamp) {
      DOM.hudArchiveStamp.textContent = `ACT ${film.order} // ${film.year} // ${displayTheme}`;
    }
    if (DOM.hudDirector) {
      DOM.hudDirector.textContent = `DIR. ${film.director.toUpperCase()}`;
    }

    // Bottom-Left Location & Coordinates
    if (DOM.hudLocationTag) {
      DOM.hudLocationTag.textContent = `LOCATION // ${displayLocation.toUpperCase()}`;
    }
    if (DOM.hudCoords) {
      DOM.hudCoords.textContent = film.coordinates.geo;
    }

    // Bottom Centered Subtitle Bar
    if (DOM.hudQuoteText) {
      DOM.hudQuoteText.textContent = displayQuote;
    }
    if (DOM.hudQuoteContext) {
      DOM.hudQuoteContext.textContent = displayQuoteCtx;
    }
    if (DOM.hudCommentary) {
      DOM.hudCommentary.textContent = displayCommentary;
    }
  }

  /**
   * Render Q-Branch & Bespoke Tailoring Swiss 2x2 Grid
   * @param {Array} artifacts - artifacts metadata array
   * @param {string} lang - 'zh' | 'en'
   */
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

  /**
   * Render The Sonic Legacy (Minimalist Track Catalog)
   * @param {Array} soundtracks - soundtrack chronologies
   * @param {Object} sectionData - headers and labels
   * @param {string} lang - 'zh' | 'en'
   */
  function renderSoundtrackCatalog(soundtracks, sectionData, lang) {
    if (!DOM.soundtracksContainer || !Array.isArray(soundtracks)) return;

    const headers = sectionData.headers;
    const headerRowHtml = `
      <div class="soundtrack-header-row" aria-hidden="true">
        <span>${escapeHTML(headers.year)}</span>
        <span>${escapeHTML(headers.track)}</span>
        <span>${escapeHTML(headers.film)}</span>
        <span>${escapeHTML(headers.tag)}</span>
        <span>${escapeHTML(headers.critique)}</span>
        <span></span>
      </div>
    `;

    const revealClass = soundtracksRevealed ? 'reveal-item is-revealed' : 'reveal-item';

    const rowsHtml = soundtracks.map((track, idx) => {
      const displayFilm = lang === 'zh' ? track.filmZh : track.film;
      const isRowPlaying = isAudioPlaying && idx === activeTrackIndex;
      const playingClass = isRowPlaying ? 'is-playing' : '';
      const statusLabel = getAudioStatusLabel(isRowPlaying, lang);
      const progressWidth = isRowPlaying ? audioProgressPct : 0;

      return `
        <div class="soundtrack-row ${revealClass} ${playingClass}"
             data-year="${track.year}"
             data-track-index="${idx}"
             data-audio-src="${escapeHTML(track.audioSrc || '')}"
             role="button"
             tabindex="0"
             aria-pressed="${isRowPlaying ? 'true' : 'false'}"
             aria-label="${escapeHTML(track.track)} — ${escapeHTML(statusLabel)}">
          <div class="track-year">${track.year}</div>
          <div class="track-title-group">
            <div class="track-name">"${escapeHTML(track.track)}"</div>
            <div class="track-artist">${escapeHTML(track.artist)}</div>
          </div>
          <div class="track-film">
            <span>${escapeHTML(displayFilm)}</span>
            <span class="track-film-sub">${track.year}</span>
          </div>
          <div class="track-tag-col">
            <span class="track-tag">${escapeHTML(track.tag)}</span>
          </div>
          <div class="track-critique">${escapeHTML(track.critique)}</div>
          <div class="track-audio-status">
            <span class="audio-pulse-dot" aria-hidden="true"></span>
            <span class="audio-status-label">${escapeHTML(statusLabel)}</span>
          </div>
          <div class="track-progress-bar" aria-hidden="true">
            <div class="track-progress-fill" style="width: ${progressWidth.toFixed(2)}%;"></div>
          </div>
        </div>
      `;
    }).join('');

    DOM.soundtracksContainer.innerHTML = headerRowHtml + rowsHtml;
  }

  /**
   * Soft Scroll Reveal Micro-Interactions for Artifacts and Soundtracks
   * Staggers entrance with 0.08s delays upon entering viewport
   */
  function initScrollReveals() {
    if (prefersReducedMotion || !('IntersectionObserver' in window)) {
      artifactsRevealed = true;
      soundtracksRevealed = true;
      document.querySelectorAll('.reveal-item').forEach(el => el.classList.add('is-revealed'));
      return;
    }

    // Observer for Artifacts Grid
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

    // Observer for Soundtracks Catalog
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
  // 3B. MINIMALIST SONIC LEGACY AUDIO PLAYER
  // ==========================================

  /**
   * Localized playback label for soundtrack rows
   * @param {boolean} playing
   * @param {string} lang
   * @returns {string}
   */
  function getAudioStatusLabel(playing, lang) {
    if (playing) {
      return lang === 'zh' ? '❚❚ 播放中' : '❚❚ PLAYING';
    }
    return lang === 'zh' ? '▶ 试听' : '▶ LISTEN';
  }

  /**
   * Synchronize .is-playing state, status labels, and progress bars across all soundtrack rows
   * @param {boolean} resetAllProgress - whether to reset all progress bar widths to 0%
   */
  function syncAudioRowsUI(resetAllProgress = false) {
    if (!DOM.soundtracksContainer) return;
    const rows = DOM.soundtracksContainer.querySelectorAll('.soundtrack-row');

    rows.forEach((row) => {
      const idx = parseInt(row.getAttribute('data-track-index'), 10);
      const isRowPlaying = isAudioPlaying && idx === activeTrackIndex;

      row.classList.toggle('is-playing', isRowPlaying);
      row.setAttribute('aria-pressed', isRowPlaying ? 'true' : 'false');

      const labelEl = row.querySelector('.audio-status-label');
      if (labelEl) {
        labelEl.textContent = getAudioStatusLabel(isRowPlaying, currentLang);
      }

      if (resetAllProgress || idx !== activeTrackIndex) {
        const fillEl = row.querySelector('.track-progress-fill');
        if (fillEl) fillEl.style.width = '0%';
      }
    });
  }

  /**
   * Toggle play/pause or switch to another soundtrack row via single global Audio instance
   * @param {HTMLElement} row
   */
  function handleTrackRowToggle(row) {
    if (!row || !globalAudio) return;

    const idx = parseInt(row.getAttribute('data-track-index'), 10);
    const src = row.getAttribute('data-audio-src');
    if (isNaN(idx) || !src) return;

    // Clicking currently playing row -> pause
    if (idx === activeTrackIndex && isAudioPlaying) {
      globalAudio.pause();
      isAudioPlaying = false;
      syncAudioRowsUI(false);
      return;
    }

    // Clicking paused active row -> resume
    if (idx === activeTrackIndex && !isAudioPlaying) {
      isAudioPlaying = true;
      syncAudioRowsUI(false);
      const playPromise = globalAudio.play();
      if (playPromise && typeof playPromise.catch === 'function') {
        playPromise.catch((err) => {
          if (err && err.name !== 'AbortError') {
            isAudioPlaying = false;
            syncAudioRowsUI(false);
          }
        });
      }
      return;
    }

    // Clicking a different row -> smooth switch (reset previous progress, load & play new src)
    globalAudio.pause();
    audioProgressPct = 0;
    activeTrackIndex = idx;
    isAudioPlaying = true;
    globalAudio.src = src;
    globalAudio.currentTime = 0;
    syncAudioRowsUI(true);

    const playPromise = globalAudio.play();
    if (playPromise && typeof playPromise.catch === 'function') {
      playPromise.catch((err) => {
        if (err && err.name !== 'AbortError') {
          isAudioPlaying = false;
          activeTrackIndex = -1;
          audioProgressPct = 0;
          syncAudioRowsUI(true);
        }
      });
    }
  }

  /**
   * Bind event delegation and single global Audio lifecycle listeners
   */
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

    if (!globalAudio) return;

    globalAudio.addEventListener('timeupdate', () => {
      if (!isAudioPlaying || activeTrackIndex < 0 || !DOM.soundtracksContainer) return;
      if (globalAudio.duration > 0 && isFinite(globalAudio.duration)) {
        audioProgressPct = Math.min(100, Math.max(0, (globalAudio.currentTime / globalAudio.duration) * 100));
        const activeRow = DOM.soundtracksContainer.querySelector(`.soundtrack-row[data-track-index="${activeTrackIndex}"]`);
        const fillEl = activeRow ? activeRow.querySelector('.track-progress-fill') : null;
        if (fillEl) {
          fillEl.style.width = `${audioProgressPct.toFixed(2)}%`;
        }
      }
    });

    globalAudio.addEventListener('ended', () => {
      isAudioPlaying = false;
      activeTrackIndex = -1;
      audioProgressPct = 0;
      globalAudio.currentTime = 0;
      syncAudioRowsUI(true);
    });

    globalAudio.addEventListener('error', () => {
      isAudioPlaying = false;
      activeTrackIndex = -1;
      audioProgressPct = 0;
      syncAudioRowsUI(true);
    });
  }

  // ==========================================
  // 4. LOCAL STATIC BACKDROP INJECTION
  // ==========================================

  /**
   * Apply local static widescreen backdrops (localBackdrop) with CSS dark gradient fallbacks
   */
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
      targetEl.style.backgroundPosition = '50% 22%';
    });
  }

  // ==========================================
  // 5. GSAP GUN BARREL APERTURE CHOREOGRAPHY
  // ==========================================

  /**
   * Initialize Master GSAP ScrollTrigger Sequence for #one-shot-stage
   * Features:
   * - Gun Barrel Aperture clip-path (circle 34vh -> circle 100% full screen)
   * - Spiral Rifling SVG rotor damping rotation (0deg -> 135deg)
   * - 5-Film widescreen cross-fades & Ken Burns scaling
   * - Parallax on giant background titles
   * - Continuous deterministic HUD subtitle sync
   */
  function initGunBarrelScrollytelling() {
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
      console.warn('[MI6 ARCHIVE] GSAP or ScrollTrigger not loaded. Aperture animation bypassed.');
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

    // Kill any existing timeline
    if (oneShotTimeline) {
      oneShotTimeline.kill();
      const existingST = ScrollTrigger.getById('oneShotScrolly');
      if (existingST) existingST.kill();
    }

    const spotlightMask = DOM.spotlightMask;
    const riflingRotor = DOM.riflingRotor;
    const riflingContainer = DOM.riflingContainer;
    const giantTitles = DOM.giantTitleNodes;
    const actBgs = DOM.actBgs;
    const actBackdrops = DOM.actBackdrops;
    const skyfallRain = DOM.skyfallRain;
    const hudSubtitlesContent = DOM.hudSubtitlesContent;

    if (!spotlightMask || giantTitles.length === 0) return;

    // Reset initial element states (clean opacity & transform only, zero clip-path)
    if (riflingRotor) {
      gsap.set(riflingRotor, { rotation: 0 });
    }
    if (riflingContainer) {
      gsap.set(riflingContainer, { opacity: 1, scale: 1 });
    }
    if (spotlightMask) {
      gsap.set(spotlightMask, { opacity: 1, scale: 1 });
    }

    giantTitles.forEach((node, i) => {
      gsap.set(node, {
        autoAlpha: i === 0 ? 0.15 : 0,
        y: i === 0 ? 0 : (prefersReducedMotion ? 0 : 24)
      });
    });

    actBgs.forEach((bg, i) => {
      gsap.set(bg, { opacity: i === 0 ? 1 : 0 });
    });

    actBackdrops.forEach(backdrop => {
      gsap.set(backdrop, { scale: 1.0 });
    });

    if (skyfallRain) {
      gsap.set(skyfallRain, { opacity: 0 });
    }

    if (hudSubtitlesContent) {
      gsap.set(hudSubtitlesContent, { opacity: 1, y: 0 });
    }

    // Set initial HUD content & chapter chromatic accent for Casino Royale
    setHudContent(0, currentLang);

    // Build master timeline with responsive scrub and +=420% scroll budget
    oneShotTimeline = gsap.timeline({
      scrollTrigger: {
        id: 'oneShotScrolly',
        trigger: stage,
        start: 'top top',
        end: '+=420%',
        pin: true,
        scrub: prefersReducedMotion ? 0.15 : 0.65,
        anticipatePin: 1,
        onUpdate: (self) => {
          handleScrollProgress(self.progress);
        }
      }
    });

    const kenBurnsScale = prefersReducedMotion ? 1.0 : 1.07;
    const finalScale = prefersReducedMotion ? 1.0 : 1.10;
    const rotorAngle = (deg) => (prefersReducedMotion ? 0 : deg);
    const titleShiftY = (px) => (prefersReducedMotion ? 0 : px);

    // Time budget: 0 to 10
    // Giant titles fade out completely BEFORE the next title fades in (zero overlap)
    // Subtitle swap thresholds align strictly inside each fade trough:
    // T0->1: [1.35..1.85] (swap at 0.175)
    // T1->2: [3.55..4.05] (swap at 0.395)
    // T2->3: [5.75..6.25] (swap at 0.615)
    // T3->4: [7.75..8.25] (swap at 0.815)
    oneShotTimeline
      // Act 0: Casino Royale (0.0 -> 2.4)
      .to(riflingRotor, { rotation: rotorAngle(28), duration: 2.4, ease: 'none' }, 0)
      .to(giantTitles[0], { y: titleShiftY(-20), duration: 1.35, ease: 'none' }, 0)
      .to(actBackdrops[0], { scale: kenBurnsScale, duration: 2.0, ease: 'none' }, 0)

      // Transition 0 -> 1: Casino Royale -> Quantum of Solace
      .to(giantTitles[0], { autoAlpha: 0, y: titleShiftY(-36), duration: 0.4, ease: 'power2.in' }, 1.35)
      .to(actBgs[1], { opacity: 1, duration: 1.0, ease: 'power2.inOut' }, 1.4)
      .to(hudSubtitlesContent, { opacity: 0, y: titleShiftY(-6), duration: 0.38, ease: 'power2.in' }, 1.35)
      .to(giantTitles[1], { autoAlpha: 0.15, y: 0, duration: 0.55, ease: 'power2.out' }, 1.85)
      .to(hudSubtitlesContent, { opacity: 1, y: 0, duration: 0.45, ease: 'power2.out' }, 1.85)

      // Act 1: Quantum of Solace (2.4 -> 4.6)
      .to(riflingRotor, { rotation: rotorAngle(62), duration: 2.2, ease: 'none' }, 2.4)
      .to(giantTitles[1], { y: titleShiftY(-20), duration: 1.15, ease: 'none' }, 2.4)
      .to(actBackdrops[1], { scale: kenBurnsScale, duration: 2.0, ease: 'none' }, 2.4)

      // Transition 1 -> 2: Quantum of Solace -> Skyfall
      .to(giantTitles[1], { autoAlpha: 0, y: titleShiftY(-36), duration: 0.4, ease: 'power2.in' }, 3.55)
      .to(actBgs[2], { opacity: 1, duration: 1.0, ease: 'power2.inOut' }, 3.6)
      .to(skyfallRain, { opacity: prefersReducedMotion ? 0 : 0.24, duration: 1.0, ease: 'power2.out' }, 3.8)
      .to(hudSubtitlesContent, { opacity: 0, y: titleShiftY(-6), duration: 0.38, ease: 'power2.in' }, 3.55)
      .to(giantTitles[2], { autoAlpha: 0.15, y: 0, duration: 0.55, ease: 'power2.out' }, 4.05)
      .to(hudSubtitlesContent, { opacity: 1, y: 0, duration: 0.45, ease: 'power2.out' }, 4.05)

      // Act 2: Skyfall (4.6 -> 6.8)
      .to(riflingRotor, { rotation: rotorAngle(92), duration: 2.2, ease: 'none' }, 4.6)
      .to(giantTitles[2], { y: titleShiftY(-20), duration: 1.15, ease: 'none' }, 4.6)
      .to(actBackdrops[2], { scale: kenBurnsScale, duration: 2.0, ease: 'none' }, 4.6)

      // Transition 2 -> 3: Skyfall -> Spectre
      .to(skyfallRain, { opacity: 0, duration: 0.8, ease: 'power2.in' }, 5.8)
      .to(giantTitles[2], { autoAlpha: 0, y: titleShiftY(-36), duration: 0.4, ease: 'power2.in' }, 5.75)
      .to(actBgs[3], { opacity: 1, duration: 1.0, ease: 'power2.inOut' }, 5.8)
      .to(hudSubtitlesContent, { opacity: 0, y: titleShiftY(-6), duration: 0.38, ease: 'power2.in' }, 5.75)
      .to(giantTitles[3], { autoAlpha: 0.15, y: 0, duration: 0.55, ease: 'power2.out' }, 6.25)
      .to(hudSubtitlesContent, { opacity: 1, y: 0, duration: 0.45, ease: 'power2.out' }, 6.25)

      // Act 3: Spectre (6.8 -> 8.8)
      .to(riflingRotor, { rotation: rotorAngle(114), duration: 2.0, ease: 'none' }, 6.8)
      .to(giantTitles[3], { y: titleShiftY(-20), duration: 0.95, ease: 'none' }, 6.8)
      .to(actBackdrops[3], { scale: kenBurnsScale, duration: 2.0, ease: 'none' }, 6.8)

      // Transition 3 -> 4: Spectre -> No Time to Die
      .to(giantTitles[3], { autoAlpha: 0, y: titleShiftY(-36), duration: 0.4, ease: 'power2.in' }, 7.75)
      .to(actBgs[4], { opacity: 1, duration: 1.0, ease: 'power2.inOut' }, 7.8)
      .to(hudSubtitlesContent, { opacity: 0, y: titleShiftY(-6), duration: 0.38, ease: 'power2.in' }, 7.75)
      .to(giantTitles[4], { autoAlpha: 0.15, y: 0, duration: 0.55, ease: 'power2.out' }, 8.25)
      .to(hudSubtitlesContent, { opacity: 1, y: 0, duration: 0.45, ease: 'power2.out' }, 8.25)

      // Parallax on Giant Title 4 & Final Backdrop
      .to(giantTitles[4], { y: titleShiftY(-16), duration: 0.65, ease: 'none' }, 8.8)
      .to(actBackdrops[4], { scale: finalScale, duration: 1.5, ease: 'none' }, 8.5)

      // Final Climax & Optical Aperture Curtain Reveal (8.6 to 10.0):
      // Mask and rifling smoothly open while keeping Act 5 title visible at 0.90 and fading out softly at the end
      .to(riflingRotor, { rotation: rotorAngle(135), duration: 1.4, ease: 'power2.out' }, 8.6)
      .to(spotlightMask, {
        opacity: 0,
        scale: prefersReducedMotion ? 1.0 : 1.32,
        duration: 1.4,
        ease: 'power2.inOut'
      }, 8.6)
      .to(riflingContainer, {
        opacity: 0,
        scale: prefersReducedMotion ? 1.0 : 1.12,
        duration: 1.1,
        ease: 'power2.inOut'
      }, 8.75)
      .to(giantTitles[4], { autoAlpha: 0, duration: 0.55, ease: 'power2.inOut' }, 9.45);

    console.info('[MI6 ARCHIVE] Gun Barrel Aperture One-Shot Sequence mounted successfully.');
  }

  /**
   * Deterministic scrub handler: updates HUD text and timeline ruler
   * Thresholds align strictly with the opacity-0 midpoint of each subtitle fade
   * @param {number} progress - 0.0 to 1.0
   */
  function handleScrollProgress(progress) {
    if (DOM.rulerProgressFill) {
      DOM.rulerProgressFill.style.height = `${Math.min(100, Math.max(0, progress * 100))}%`;
    }

    // Determine current active act index inside subtitle fade trough
    let newActIndex = 0;
    if (progress < 0.175) {
      newActIndex = 0;
    } else if (progress < 0.395) {
      newActIndex = 1;
    } else if (progress < 0.615) {
      newActIndex = 2;
    } else if (progress < 0.815) {
      newActIndex = 3;
    } else {
      newActIndex = 4;
    }

    if (DOM.rulerNodes && DOM.rulerNodes.length > 0) {
      DOM.rulerNodes.forEach((node, idx) => {
        if (idx === newActIndex) {
          node.classList.add('active');
        } else {
          node.classList.remove('active');
        }
      });
    }

    if (newActIndex !== currentActIndex) {
      currentActIndex = newActIndex;
      setHudContent(currentActIndex, currentLang);
    }
  }

  // ==========================================
  // 6. BILINGUAL ENGINE (HOT-SWAP WITH SCROLL PRESERVATION)
  // ==========================================

  /**
   * Switch site language seamlessly without resetting scroll position or killing ScrollTrigger
   * @param {string} newLang - 'zh' or 'en'
   */
  function setLanguage(newLang) {
    if (newLang !== 'zh' && newLang !== 'en') return;
    if (newLang === currentLang) return;

    currentLang = newLang;

    try {
      localStorage.setItem(STORAGE_KEY_LANG, newLang);
    } catch (e) {
      console.warn('[MI6 ARCHIVE] localStorage is unavailable for language preference.');
    }

    // 1. Update Root Language Attribute
    DOM.html.setAttribute('lang', currentLang === 'zh' ? 'zh-CN' : 'en');

    // 2. Update Language Toggle Active Indicator
    if (currentLang === 'zh') {
      if (DOM.langBtnZh) DOM.langBtnZh.classList.add('active');
      if (DOM.langBtnEn) DOM.langBtnEn.classList.remove('active');
    } else {
      if (DOM.langBtnEn) DOM.langBtnEn.classList.add('active');
      if (DOM.langBtnZh) DOM.langBtnZh.classList.remove('active');
    }

    const data = siteData[currentLang];
    if (!data) return;

    // 3. Render Static Text & Headers
    renderStaticText(data);

    // 4. Update Giant Titles
    updateGiantTitles(currentLang);

    // 5. Update Current Viewfinder HUD & Subtitles
    setHudContent(currentActIndex, currentLang);

    // 6. Render Artifacts Grid & Soundtrack
    renderArtifactsGrid(data.artifacts, currentLang);
    renderSoundtrackCatalog(data.soundtracks, data.soundtracksSection, currentLang);
    initScrollReveals();
  }

  // ==========================================
  // 7. EVENT BINDINGS
  // ==========================================
  function setupEvents() {
    // Language Switch Buttons
    if (DOM.langBtnZh) DOM.langBtnZh.addEventListener('click', () => setLanguage('zh'));
    if (DOM.langBtnEn) DOM.langBtnEn.addEventListener('click', () => setLanguage('en'));

    // Return to Top
    if (DOM.backToTopBtn) {
      DOM.backToTopBtn.addEventListener('click', (e) => {
        e.preventDefault();
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
      });
    }

    // Ruler Milestone Click-to-Jump Navigation
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
              duration: 1.15,
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

    // Keyboard Access: Alt + L for language switch
    window.addEventListener('keydown', (e) => {
      if (e.altKey && (e.key === 'l' || e.key === 'L')) {
        setLanguage(currentLang === 'zh' ? 'en' : 'zh');
      }
    });

    // Debounced Width-Aware Resize Handler (prevents mobile Safari address bar resize jitter)
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
  // 8. UTILITIES
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
  // 9. INITIALIZATION
  // ==========================================
  function init() {
    // 1. Read cached language preference
    try {
      const cachedLang = localStorage.getItem(STORAGE_KEY_LANG);
      if (cachedLang === 'zh' || cachedLang === 'en') {
        currentLang = cachedLang;
      }
    } catch (e) {
      currentLang = DEFAULT_LANG;
    }

    const data = siteData[currentLang];
    if (!data) return;

    // 2. Setup events
    setupEvents();

    // 3. Set root lang
    DOM.html.setAttribute('lang', currentLang === 'zh' ? 'zh-CN' : 'en');
    if (currentLang === 'zh') {
      if (DOM.langBtnZh) DOM.langBtnZh.classList.add('active');
      if (DOM.langBtnEn) DOM.langBtnEn.classList.remove('active');
    } else {
      if (DOM.langBtnEn) DOM.langBtnEn.classList.add('active');
      if (DOM.langBtnZh) DOM.langBtnZh.classList.remove('active');
    }

    // 4. Render Static Text & Headers
    renderStaticText(data);

    // 5. Initialize Giant Titles & Local Static Backdrops
    updateGiantTitles(currentLang);
    applyLocalBackdrops();

    // 6. Initialize HUD Data for Act 0
    setHudContent(0, currentLang);

    // 7. Render Lower Sections & Setup Micro-Interactions + Audio Player
    renderArtifactsGrid(data.artifacts, currentLang);
    renderSoundtrackCatalog(data.soundtracks, data.soundtracksSection, currentLang);
    initScrollReveals();
    initAudioPlayer();

    // 8. Mount Gun Barrel Aperture Sequence
    if (document.readyState === 'complete') {
      initGunBarrelScrollytelling();
    } else {
      window.addEventListener('load', () => {
        initGunBarrelScrollytelling();
      });
    }

    console.info(`[MI6 ARCHIVE INITIALIZED] Daniel Craig 007 Dossier // Language: ${currentLang.toUpperCase()} // Local Archival Backdrops Active.`);
  }

  // Run on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
