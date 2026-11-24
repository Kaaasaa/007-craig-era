/**
 * MI6 DECLASSIFIED ARCHIVE // DANIEL CRAIG 007 ERA (2006-2021)
 * Application Layer, Gun Barrel Aperture Scrollytelling & TMDB Satellite Telemetry Engine
 * 
 * Features:
 * 1. Precision Gun Barrel Aperture: clip-path circle viewport + rotating spiral rifling SVG
 * 2. 5-Act one-shot timeline with mechanical rotational damping and full-screen aperture climax
 * 3. TMDB API integration: pulls 5 HD widescreen backdrops (w1280) with client-side storage & zero-error fallback
 * 4. Bilingual hot-swap engine: in-place updates for HUD, titles, subtitles, and TMDB modal
 * 5. Timeline ruler navigation with click-to-jump smooth scrolling
 */

(function () {
  'use strict';

  // ==========================================
  // 1. STATE & CONSTANTS
  // ==========================================
  const STORAGE_KEY_LANG = 'bond_archive_lang';
  const STORAGE_KEY_TMDB = 'bond_tmdb_api_key';
  const DEFAULT_LANG = 'zh';

  // Scrub progress targets for each of the 5 acts (0.0 to 1.0)
  const ACT_PROGRESS_TARGETS = [0.04, 0.26, 0.50, 0.73, 0.93];

  let currentLang = DEFAULT_LANG;
  let currentActIndex = 0;
  let toastTimeoutId = null;
  let oneShotTimeline = null;
  let tmdbApiKey = '';
  let artifactsRevealed = false;
  let soundtracksRevealed = false;
  let artifactsObserver = null;
  let soundtracksObserver = null;

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
    navStatusBadge: document.getElementById('nav-status-badge'),
    langBtnEn: document.getElementById('lang-btn-en'),
    langBtnZh: document.getElementById('lang-btn-zh'),
    settingsBtn: document.getElementById('api-settings-btn'),

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

    // TMDB Settings Modal
    tmdbModal: document.getElementById('tmdb-modal'),
    tmdbModalCloseBtn: document.getElementById('tmdb-modal-close-btn'),
    tmdbModalBadge: document.getElementById('tmdb-modal-badge'),
    tmdbModalTitle: document.getElementById('tmdb-modal-title'),
    tmdbModalDesc: document.getElementById('tmdb-modal-desc'),
    tmdbForm: document.getElementById('tmdb-form'),
    tmdbInputLabel: document.getElementById('tmdb-input-label'),
    tmdbApiKeyInput: document.getElementById('tmdb-api-key-input'),
    toggleKeyVisibility: document.getElementById('toggle-key-visibility'),
    tmdbStatusDot: document.getElementById('tmdb-status-dot'),
    tmdbStatusBox: document.getElementById('tmdb-status-box'),
    tmdbStatusMsg: document.getElementById('tmdb-status-msg'),
    tmdbSaveBtn: document.getElementById('tmdb-save-btn'),
    tmdbClearBtn: document.getElementById('tmdb-clear-btn'),

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
    backToTopBtn: document.getElementById('back-to-top'),

    // Toast
    toast: document.getElementById('mi6-toast'),
    toastText: document.getElementById('toast-text')
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
    if (DOM.navStatusBadge) DOM.navStatusBadge.textContent = data.nav.statusBadge;
    if (DOM.settingsBtn) DOM.settingsBtn.setAttribute('title', data.nav.settingsTitle);

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
   * Update TMDB Settings Modal Text
   * @param {string} lang - 'zh' | 'en'
   */
  function updateModalText(lang) {
    const data = siteData[lang];
    if (!data || !data.tmdbModal) return;
    const m = data.tmdbModal;

    if (DOM.tmdbModalBadge) DOM.tmdbModalBadge.textContent = m.badge;
    if (DOM.tmdbModalTitle) DOM.tmdbModalTitle.textContent = m.title;
    if (DOM.tmdbModalDesc) DOM.tmdbModalDesc.textContent = m.description;
    if (DOM.tmdbInputLabel) DOM.tmdbInputLabel.textContent = m.inputLabel;
    if (DOM.tmdbApiKeyInput) DOM.tmdbApiKeyInput.setAttribute('placeholder', m.inputPlaceholder);
    if (DOM.tmdbSaveBtn) DOM.tmdbSaveBtn.textContent = m.saveBtn;
    if (DOM.tmdbClearBtn) DOM.tmdbClearBtn.textContent = m.clearBtn;
    if (DOM.tmdbModalCloseBtn) DOM.tmdbModalCloseBtn.setAttribute('title', m.closeBtn);

    // Refresh status text
    if (!tmdbApiKey) {
      setModalStatus(m.statusEmpty, 'empty');
    }
  }

  /**
   * Set TMDB modal status message and indicator
   * @param {string} message 
   * @param {'empty' | 'loading' | 'success' | 'error'} state 
   */
  function setModalStatus(message, state) {
    if (!DOM.tmdbStatusMsg || !DOM.tmdbStatusBox || !DOM.tmdbStatusDot) return;

    DOM.tmdbStatusMsg.textContent = message;
    DOM.tmdbStatusBox.className = `modal-status-box ${state}`;

    if (state === 'success') {
      DOM.tmdbStatusDot.className = 'modal-status-dot active';
    } else {
      DOM.tmdbStatusDot.className = 'modal-status-dot';
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
      </div>
    `;

    const revealClass = soundtracksRevealed ? 'reveal-item is-revealed' : 'reveal-item';

    const rowsHtml = soundtracks.map(track => {
      const displayFilm = lang === 'zh' ? track.filmZh : track.film;

      return `
        <div class="soundtrack-row ${revealClass}" data-year="${track.year}">
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
    if (!('IntersectionObserver' in window)) {
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
  // 4. TMDB SATELLITE TELEMETRY (API FETCHER)
  // ==========================================

  /**
   * Fetch and apply 5-film HD widescreen backdrops from TMDB
   * Supports v3 API Key and v4 Read Access Bearer Token
   * @param {string} key - API Key or Bearer Token
   */
  async function fetchAndApplyTmdbBackdrops(key) {
    const data = siteData[currentLang];
    const m = data ? data.tmdbModal : {};

    if (!key || typeof key !== 'string' || key.trim().length < 10) {
      setModalStatus(m.statusEmpty || 'No key configured.', 'empty');
      return;
    }

    const cleanKey = key.trim();
    setModalStatus(m.statusLoading || 'Connecting to TMDB...', 'loading');

    const isBearer = cleanKey.startsWith('eyJ') || cleanKey.length > 50;
    const films = siteData.zh.films; // canonical 5 films with tmdbId

    let successCount = 0;

    for (const film of films) {
      const backdropEls = document.querySelectorAll(`.act-backdrop[data-tmdb-id="${film.tmdbId}"]`);
      if (!backdropEls || backdropEls.length === 0) continue;

      try {
        const url = isBearer
          ? `https://api.themoviedb.org/3/movie/${film.tmdbId}`
          : `https://api.themoviedb.org/3/movie/${film.tmdbId}?api_key=${cleanKey}`;

        const headers = isBearer
          ? { Authorization: `Bearer ${cleanKey}`, accept: 'application/json' }
          : { accept: 'application/json' };

        const response = await fetch(url, { headers });
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`);
        }

        const movieData = await response.json();
        if (movieData.backdrop_path) {
          const imgUrl = `https://image.tmdb.org/t/p/w1280${movieData.backdrop_path}`;

          // Preload image to ensure smooth fade
          const img = new Image();
          img.onload = () => {
            backdropEls.forEach(el => {
              el.style.backgroundImage = `url("${imgUrl}")`;
              el.classList.add('loaded');
            });
          };
          img.src = imgUrl;

          successCount++;
        }
      } catch (err) {
        console.warn(`[MI6 ARCHIVE TMDB] Failed fetching backdrop for ${film.title} (${film.tmdbId}):`, err.message);
      }
    }

    if (successCount > 0) {
      setModalStatus(m.statusSuccess || 'Backdrops synchronized successfully.', 'success');
      showToast(currentLang === 'zh' ? '五部曲高清剧照已载入光学舞台' : '5-Film HD Backdrops Synchronized');
    } else {
      setModalStatus(m.statusError || 'Failed to authenticate key or network timeout.', 'error');
    }
  }

  /**
   * Clear all TMDB backdrops and restore offline ambient gradients
   */
  function clearTmdbBackdrops() {
    const allBackdrops = document.querySelectorAll('.act-backdrop');
    allBackdrops.forEach(el => {
      el.style.backgroundImage = '';
      el.classList.remove('loaded');
    });

    const data = siteData[currentLang];
    const m = data ? data.tmdbModal : {};
    setModalStatus(m.statusCleared || 'Credentials cleared.', 'empty');
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
        opacity: i === 0 ? 0.14 : 0,
        y: i === 0 ? 0 : 30,
        visibility: i === 0 ? 'visible' : 'hidden'
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

    // Set initial HUD content for Casino Royale
    setHudContent(0, currentLang);

    // Build master timeline with scrub: 1.2 and +=450%
    oneShotTimeline = gsap.timeline({
      scrollTrigger: {
        id: 'oneShotScrolly',
        trigger: stage,
        start: 'top top',
        end: '+=450%',
        pin: true,
        scrub: 1.2,
        anticipatePin: 1,
        onUpdate: (self) => {
          handleScrollProgress(self.progress);
        }
      }
    });

    // Time budget: 0 to 10
    // Act 0 -> Act 1: 1.4 to 2.4 (Casino Royale -> Quantum of Solace)
    oneShotTimeline
      // Rifling spiral rotation
      .to(riflingRotor, { rotation: 28, duration: 2.4, ease: 'none' }, 0)
      .to(giantTitles[0], { y: -30, duration: 1.4, ease: 'none' }, 0)
      .to(actBackdrops[0], { scale: 1.08, duration: 2.0, ease: 'none' }, 0)

      // Transition 0 -> 1: Layered Cross-Cover (actBgs[1] z-index:2 fades in over actBgs[0] z-index:1)
      .to(giantTitles[0], {
        opacity: 0,
        y: -50,
        duration: 0.7,
        ease: 'power2.in',
        onComplete: () => { gsap.set(giantTitles[0], { visibility: 'hidden' }); }
      }, 1.4)
      .to(actBgs[1], { opacity: 1, duration: 1.0, ease: 'power2.inOut' }, 1.4)
      .to(hudSubtitlesContent, { opacity: 0, y: -8, duration: 0.45, ease: 'power2.in' }, 1.35)
      .set(giantTitles[1], { visibility: 'visible' }, 1.8)
      .to(giantTitles[1], { opacity: 0.14, y: 0, duration: 0.7, ease: 'power2.out' }, 1.8)
      .to(hudSubtitlesContent, { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' }, 1.85)

      // Act 1 -> Act 2: 3.6 to 4.6 (Quantum of Solace -> Skyfall)
      .to(riflingRotor, { rotation: 62, duration: 2.2, ease: 'none' }, 2.4)
      .to(giantTitles[1], { y: -30, duration: 1.2, ease: 'none' }, 2.4)
      .to(actBackdrops[1], { scale: 1.08, duration: 2.0, ease: 'none' }, 2.4)

      // Transition 1 -> 2: Layered Cross-Cover (actBgs[2] z-index:3 fades in over actBgs[1] z-index:2)
      .to(giantTitles[1], {
        opacity: 0,
        y: -50,
        duration: 0.7,
        ease: 'power2.in',
        onComplete: () => { gsap.set(giantTitles[1], { visibility: 'hidden' }); }
      }, 3.6)
      .to(actBgs[2], { opacity: 1, duration: 1.0, ease: 'power2.inOut' }, 3.6)
      .to(skyfallRain, { opacity: 0.38, duration: 0.8, ease: 'power2.out' }, 3.8)
      .to(hudSubtitlesContent, { opacity: 0, y: -8, duration: 0.45, ease: 'power2.in' }, 3.55)
      .set(giantTitles[2], { visibility: 'visible' }, 4.0)
      .to(giantTitles[2], { opacity: 0.14, y: 0, duration: 0.7, ease: 'power2.out' }, 4.0)
      .to(hudSubtitlesContent, { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' }, 4.05)

      // Act 2 -> Act 3: 5.8 to 6.8 (Skyfall -> Spectre)
      .to(riflingRotor, { rotation: 92, duration: 2.2, ease: 'none' }, 4.6)
      .to(giantTitles[2], { y: -30, duration: 1.2, ease: 'none' }, 4.6)
      .to(actBackdrops[2], { scale: 1.08, duration: 2.0, ease: 'none' }, 4.6)

      // Transition 2 -> 3: Layered Cross-Cover (actBgs[3] z-index:4 fades in over actBgs[2] z-index:3)
      .to(skyfallRain, { opacity: 0, duration: 0.8, ease: 'power2.in' }, 5.8)
      .to(giantTitles[2], {
        opacity: 0,
        y: -50,
        duration: 0.7,
        ease: 'power2.in',
        onComplete: () => { gsap.set(giantTitles[2], { visibility: 'hidden' }); }
      }, 5.8)
      .to(actBgs[3], { opacity: 1, duration: 1.0, ease: 'power2.inOut' }, 5.8)
      .to(hudSubtitlesContent, { opacity: 0, y: -8, duration: 0.45, ease: 'power2.in' }, 5.75)
      .set(giantTitles[3], { visibility: 'visible' }, 6.2)
      .to(giantTitles[3], { opacity: 0.14, y: 0, duration: 0.7, ease: 'power2.out' }, 6.2)
      .to(hudSubtitlesContent, { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' }, 6.25)

      // Act 3 -> Act 4: 7.8 to 8.8 (Spectre -> No Time to Die)
      .to(riflingRotor, { rotation: 114, duration: 2.0, ease: 'none' }, 6.8)
      .to(giantTitles[3], { y: -30, duration: 1.2, ease: 'none' }, 6.8)
      .to(actBackdrops[3], { scale: 1.08, duration: 2.0, ease: 'none' }, 6.8)

      // Transition 3 -> 4: Layered Cross-Cover (actBgs[4] z-index:5 fades in over actBgs[3] z-index:4)
      .to(giantTitles[3], {
        opacity: 0,
        y: -50,
        duration: 0.7,
        ease: 'power2.in',
        onComplete: () => { gsap.set(giantTitles[3], { visibility: 'hidden' }); }
      }, 7.8)
      .to(actBgs[4], { opacity: 1, duration: 1.0, ease: 'power2.inOut' }, 7.8)
      .to(hudSubtitlesContent, { opacity: 0, y: -8, duration: 0.45, ease: 'power2.in' }, 7.75)
      .set(giantTitles[4], { visibility: 'visible' }, 8.2)
      .to(giantTitles[4], { opacity: 0.14, y: 0, duration: 0.7, ease: 'power2.out' }, 8.2)
      .to(hudSubtitlesContent, { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' }, 8.25)

      // Parallax on Giant Title 4
      .to(giantTitles[4], { y: -25, duration: 1.0, ease: 'none' }, 8.5)
      .to(actBackdrops[4], { scale: 1.10, duration: 1.5, ease: 'none' }, 8.5)

      // Final 20% Climax & Optical Spotlight Curtain Reveal (8.4 to 10.0):
      // Zero clip-path, mask and rifling smoothly fade out to reveal full-screen backdrop
      .to(riflingRotor, { rotation: 135, duration: 1.6, ease: 'power2.out' }, 8.4)
      .to(spotlightMask, {
        opacity: 0,
        scale: 1.35,
        duration: 1.6,
        ease: 'power2.inOut'
      }, 8.4)
      .to(riflingContainer, {
        opacity: 0,
        scale: 1.15,
        duration: 1.2,
        ease: 'power2.inOut'
      }, 8.6)
      .to(giantTitles[4], { opacity: 0, duration: 1.0, ease: 'power2.inOut' }, 8.6)
      .to(hudSubtitlesContent, { opacity: 0.35, y: -4, duration: 1.2, ease: 'power2.inOut' }, 8.8);

    console.info('[MI6 ARCHIVE] Gun Barrel Aperture One-Shot Sequence mounted successfully.');
  }

  /**
   * Deterministic scrub handler: updates HUD text and timeline ruler
   * @param {number} progress - 0.0 to 1.0
   */
  function handleScrollProgress(progress) {
    if (DOM.rulerProgressFill) {
      DOM.rulerProgressFill.style.height = `${Math.min(100, Math.max(0, progress * 100))}%`;
    }

    // Determine current active act index
    let newActIndex = 0;
    if (progress < 0.20) {
      newActIndex = 0;
    } else if (progress < 0.42) {
      newActIndex = 1;
    } else if (progress < 0.64) {
      newActIndex = 2;
    } else if (progress < 0.85) {
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

    // 6. Update TMDB Modal Copy
    updateModalText(currentLang);

    // 7. Render Artifacts Grid & Soundtrack
    renderArtifactsGrid(data.artifacts, currentLang);
    renderSoundtrackCatalog(data.soundtracks, data.soundtracksSection, currentLang);
    initScrollReveals();
  }

  // ==========================================
  // 7. TERMINAL HUD TOAST SYSTEM
  // ==========================================

  /**
   * Display declassified HUD toast notification
   * @param {string} message - text to display
   */
  function showToast(message) {
    if (!DOM.toast || !DOM.toastText) return;

    if (toastTimeoutId) {
      clearTimeout(toastTimeoutId);
    }

    DOM.toastText.textContent = message;
    DOM.toast.classList.add('show');

    toastTimeoutId = setTimeout(() => {
      DOM.toast.classList.remove('show');
    }, 3400);
  }

  // ==========================================
  // 8. EVENT BINDINGS
  // ==========================================
  function setupEvents() {
    // Language Switch Buttons
    if (DOM.langBtnZh) DOM.langBtnZh.addEventListener('click', () => setLanguage('zh'));
    if (DOM.langBtnEn) DOM.langBtnEn.addEventListener('click', () => setLanguage('en'));

    // Settings Button -> Open TMDB Modal
    if (DOM.settingsBtn) {
      DOM.settingsBtn.addEventListener('click', () => {
        openTmdbModal();
      });
    }

    // Close Modal Button
    if (DOM.tmdbModalCloseBtn) {
      DOM.tmdbModalCloseBtn.addEventListener('click', () => {
        closeTmdbModal();
      });
    }

    // Click Outside Modal Card to Close
    if (DOM.tmdbModal) {
      DOM.tmdbModal.addEventListener('click', (e) => {
        if (e.target === DOM.tmdbModal) {
          closeTmdbModal();
        }
      });
    }

    // Toggle API Key Input Masking
    if (DOM.toggleKeyVisibility && DOM.tmdbApiKeyInput) {
      DOM.toggleKeyVisibility.addEventListener('click', () => {
        const isPassword = DOM.tmdbApiKeyInput.getAttribute('type') === 'password';
        DOM.tmdbApiKeyInput.setAttribute('type', isPassword ? 'text' : 'password');
      });
    }

    // Save TMDB Key & Trigger Sync
    if (DOM.tmdbSaveBtn) {
      DOM.tmdbSaveBtn.addEventListener('click', () => {
        const val = DOM.tmdbApiKeyInput ? DOM.tmdbApiKeyInput.value.trim() : '';
        if (val) {
          tmdbApiKey = val;
          try {
            localStorage.setItem(STORAGE_KEY_TMDB, val);
          } catch (e) {}
          fetchAndApplyTmdbBackdrops(val);
        } else {
          clearTmdbBackdrops();
        }
      });
    }

    // Clear TMDB Key
    if (DOM.tmdbClearBtn) {
      DOM.tmdbClearBtn.addEventListener('click', () => {
        tmdbApiKey = '';
        if (DOM.tmdbApiKeyInput) DOM.tmdbApiKeyInput.value = '';
        try {
          localStorage.removeItem(STORAGE_KEY_TMDB);
        } catch (e) {}
        clearTmdbBackdrops();
      });
    }

    // Return to Top
    if (DOM.backToTopBtn) {
      DOM.backToTopBtn.addEventListener('click', (e) => {
        e.preventDefault();
        if (typeof gsap !== 'undefined' && gsap.plugins && gsap.plugins.scrollTo) {
          gsap.to(window, {
            duration: 1.4,
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

          if (typeof gsap !== 'undefined' && gsap.plugins && gsap.plugins.scrollTo) {
            gsap.to(window, {
              duration: 1.3,
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

    // Keyboard Access: Alt + L for language, ESC for modal
    window.addEventListener('keydown', (e) => {
      if (e.altKey && (e.key === 'l' || e.key === 'L')) {
        setLanguage(currentLang === 'zh' ? 'en' : 'zh');
      }
      if ((e.key === 'Escape' || e.key === 'Esc') && DOM.tmdbModal && DOM.tmdbModal.classList.contains('open')) {
        closeTmdbModal();
      }
    });

    // Window Resize Handler with ScrollTrigger Refresh
    window.addEventListener('resize', () => {
      if (typeof ScrollTrigger !== 'undefined') {
        ScrollTrigger.refresh();
      }
    });
  }

  function openTmdbModal() {
    if (!DOM.tmdbModal) return;
    DOM.tmdbModal.classList.add('open');
    DOM.tmdbModal.setAttribute('aria-hidden', 'false');
    if (DOM.tmdbApiKeyInput) {
      DOM.tmdbApiKeyInput.value = tmdbApiKey;
      DOM.tmdbApiKeyInput.focus();
    }
    updateModalText(currentLang);
  }

  function closeTmdbModal() {
    if (!DOM.tmdbModal) return;
    DOM.tmdbModal.classList.remove('open');
    DOM.tmdbModal.setAttribute('aria-hidden', 'true');
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
    // 1. Read cached preferences
    try {
      const cachedLang = localStorage.getItem(STORAGE_KEY_LANG);
      if (cachedLang === 'zh' || cachedLang === 'en') {
        currentLang = cachedLang;
      }
      const cachedKey = localStorage.getItem(STORAGE_KEY_TMDB);
      if (cachedKey) {
        tmdbApiKey = cachedKey.trim();
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

    // 5. Initialize Giant Titles
    updateGiantTitles(currentLang);

    // 6. Initialize HUD Data for Act 0
    setHudContent(0, currentLang);

    // 7. Update Modal Copy
    updateModalText(currentLang);

    // 8. Render Lower Sections & Setup Micro-Interactions
    renderArtifactsGrid(data.artifacts, currentLang);
    renderSoundtrackCatalog(data.soundtracks, data.soundtracksSection, currentLang);
    initScrollReveals();

    // 9. Mount Gun Barrel Aperture Sequence
    if (document.readyState === 'complete') {
      initGunBarrelScrollytelling();
    } else {
      window.addEventListener('load', () => {
        initGunBarrelScrollytelling();
      });
    }

    // 10. Auto-trigger TMDB fetch if Key exists
    if (tmdbApiKey) {
      fetchAndApplyTmdbBackdrops(tmdbApiKey);
    }

    console.info(`[MI6 ARCHIVE INITIALIZED] Daniel Craig 007 Dossier // Language: ${currentLang.toUpperCase()} // Gun Barrel Aperture Active.`);
  }

  // Run on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
