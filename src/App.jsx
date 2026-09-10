import { useCallback, useEffect, useRef, useState } from "react";

const BRAND_LETTERS = [
  { char: "M", delay: 0 },
  { char: "Λ", delay: 40, isLambda: true },
  { char: "R", delay: 80 },
  { char: "V", delay: 120 },
  { char: "E", delay: 160 },
  { char: "L", delay: 200 },
  { char: "O", delay: 240 },
  { char: "U", delay: 280 },
  { char: "S", delay: 320 },
];

const HOLD_DURATION = 1400;
const ZOOM_DURATION = 1350;

export function App() {
  const initialPhase =
    typeof window !== "undefined"
      ? new URLSearchParams(window.location.search).get("phase")
      : null;

  const [phase, setPhase] = useState(initialPhase || "entering");
  const [letterStates, setLetterStates] = useState(
    initialPhase ? Array(9).fill(true) : Array(9).fill(false),
  );
  const [subVisible, setSubVisible] = useState(Boolean(initialPhase));
  const [taglineVisible, setTaglineVisible] = useState(Boolean(initialPhase));

  const zoomTimer = useRef(null);
  const finishTimer = useRef(null);
  const letterTimers = useRef([]);

  const clearLetterTimers = useCallback(() => {
    letterTimers.current.forEach((t) => window.clearTimeout(t));
    letterTimers.current = [];
  }, []);

  const startZoom = useCallback(() => {
    if (initialPhase || phase !== "entering") return;

    window.clearTimeout(zoomTimer.current);
    clearLetterTimers();
    setLetterStates(Array(9).fill(true));
    setSubVisible(true);
    setTaglineVisible(true);

    setPhase("zooming");
    finishTimer.current = window.setTimeout(() => {
      setPhase("complete");
    }, ZOOM_DURATION);
  }, [clearLetterTimers, initialPhase, phase]);

  const wrapperRef = useRef(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isNearTop, setIsNearTop] = useState(true);
  const isScrolledRef = useRef(false);
  const isNearTopRef = useRef(true);

  // Targets (computed from scroll)
  const targets = useRef({
    scrollY: 0,
    hero: 0,
    char: Array(9).fill(0),
    ticker: 0,
    method: 0,
    chapters: 0,
    atelier: 0,
    cards: [0, 0, 0],
    services: 0,
    rows: [0, 0, 0],
    leadership: 0,
    founders: [0, 0],
    booking: 0,
    footer: 0,
  });

  // Current values (smoothly lerped)
  const current = useRef({
    scrollY: 0,
    hero: 0,
    char: Array(9).fill(0),
    ticker: 0,
    method: 0,
    chapters: 0,
    atelier: 0,
    cards: [0, 0, 0],
    services: 0,
    rows: [0, 0, 0],
    leadership: 0,
    founders: [0, 0],
    booking: 0,
    footer: 0,
  });

  const rafId = useRef(null);
  const isAnimating = useRef(false);

  // Light palette: #FAF7F2 (250, 247, 242)
  // Dark original brand palette: #2C1A0E (44, 26, 14)
  // Subtitle / rules: Light champagne #E5CEB0 (229, 206, 176) -> Original dark bronze #765942 (118, 89, 66)
  const interpolateRgb = (c1, c2, p) => {
    const clamped = Math.min(1, Math.max(0, p));
    const r = Math.round(c1[0] + clamped * (c2[0] - c1[0]));
    const g = Math.round(c1[1] + clamped * (c2[1] - c1[1]));
    const b = Math.round(c1[2] + clamped * (c2[2] - c1[2]));
    return `rgb(${r}, ${g}, ${b})`;
  };

  const LIGHT_MAIN = [255, 255, 255];
  const DARK_MAIN = [44, 26, 14];
  const LIGHT_SUB = [255, 245, 232];
  const DARK_SUB = [118, 89, 66];
  const LIGHT_TAG = [255, 240, 222];
  const DARK_TAG = [90, 62, 43];
  const DARK_BG = [18, 11, 8];
  const LIGHT_BG = [247, 242, 235];

  const applyColors = useCallback(() => {
    const el = wrapperRef.current;
    if (!el) return;
    const c = current.current;

    // Scroll offset & hero progress (both with px and unitless for valid CSS calc arithmetic)
    el.style.setProperty("--scroll-y", `${c.scrollY.toFixed(1)}px`);
    el.style.setProperty("--scroll-y-val", c.scrollY.toFixed(1));
    el.style.setProperty("--color-progress", c.hero.toFixed(4));

    // Hero 9 character colors for letter-by-letter liquid color wave
    for (let i = 0; i < 9; i++) {
      el.style.setProperty(`--char-progress-${i}`, c.char[i].toFixed(4));
      el.style.setProperty(`--char-color-${i}`, interpolateRgb(LIGHT_MAIN, DARK_MAIN, c.char[i]));
    }

    // Hero typography & elements (crisp, high-visibility contrast)
    el.style.setProperty("--hero-text-color", interpolateRgb(LIGHT_MAIN, DARK_MAIN, c.hero));
    el.style.setProperty("--hero-sub-color", interpolateRgb(LIGHT_SUB, DARK_SUB, c.hero));
    el.style.setProperty("--hero-tag-color", interpolateRgb(LIGHT_TAG, DARK_TAG, c.hero));
    el.style.setProperty("--hero-desc-color", interpolateRgb([255, 255, 255], [62, 42, 28], c.hero));
    el.style.setProperty("--hero-footer-color", interpolateRgb(LIGHT_MAIN, DARK_MAIN, c.hero));
    el.style.setProperty("--hero-footer-sub", interpolateRgb(LIGHT_SUB, DARK_SUB, c.hero));

    // Ticker
    el.style.setProperty("--ticker-progress", c.ticker.toFixed(4));
    el.style.setProperty("--ticker-bg", interpolateRgb(DARK_BG, [229, 206, 176], c.ticker));
    el.style.setProperty("--ticker-color", interpolateRgb(LIGHT_MAIN, DARK_MAIN, c.ticker));
    el.style.setProperty("--ticker-dot", interpolateRgb(LIGHT_SUB, DARK_SUB, c.ticker));

    // Beauty Intelligence bento + sticky chapter story
    el.style.setProperty("--method-progress", c.method.toFixed(4));
    el.style.setProperty("--chapters-progress", c.chapters.toFixed(4));

    // Atelier section
    el.style.setProperty("--atelier-progress", c.atelier.toFixed(4));
    el.style.setProperty("--atelier-bg", interpolateRgb(DARK_BG, LIGHT_BG, c.atelier));
    el.style.setProperty("--atelier-title-color", interpolateRgb(LIGHT_MAIN, DARK_MAIN, c.atelier));
    el.style.setProperty("--atelier-sub-color", interpolateRgb(LIGHT_SUB, DARK_SUB, c.atelier));
    el.style.setProperty("--atelier-body-color", interpolateRgb([250, 247, 242], [62, 42, 28], c.atelier));

    // Atelier 3 craft cards individual color motion
    for (let j = 0; j < 3; j++) {
      const cp = c.cards[j];
      el.style.setProperty(`--card-progress-${j}`, cp.toFixed(4));
      el.style.setProperty(`--card-title-${j}`, interpolateRgb(LIGHT_MAIN, DARK_MAIN, cp));
      el.style.setProperty(`--card-sub-${j}`, interpolateRgb(LIGHT_SUB, DARK_SUB, cp));
      el.style.setProperty(`--card-body-${j}`, interpolateRgb([250, 247, 242], [62, 42, 28], cp));
    }

    // Services section
    el.style.setProperty("--services-progress", c.services.toFixed(4));
    el.style.setProperty("--services-bg", interpolateRgb([23, 14, 10], [242, 236, 228], c.services));
    el.style.setProperty("--services-title-color", interpolateRgb(LIGHT_MAIN, DARK_MAIN, c.services));
    el.style.setProperty("--services-sub-color", interpolateRgb(LIGHT_SUB, DARK_SUB, c.services));
    el.style.setProperty("--services-desc-color", interpolateRgb([250, 247, 242], [72, 49, 34], c.services));

    // Services 3 rows individual color motion
    for (let k = 0; k < 3; k++) {
      const rp = c.rows[k];
      el.style.setProperty(`--row-progress-${k}`, rp.toFixed(4));
      el.style.setProperty(`--row-title-${k}`, interpolateRgb(LIGHT_MAIN, DARK_MAIN, rp));
      el.style.setProperty(`--row-sub-${k}`, interpolateRgb(LIGHT_SUB, DARK_SUB, rp));
      el.style.setProperty(`--row-desc-${k}`, interpolateRgb([250, 247, 242], [72, 49, 34], rp));
    }

    // Leadership & Founders section
    el.style.setProperty("--leadership-progress", c.leadership.toFixed(4));
    el.style.setProperty("--leadership-bg", interpolateRgb([20, 12, 8], [245, 239, 232], c.leadership));
    el.style.setProperty("--leadership-title-color", interpolateRgb(LIGHT_MAIN, DARK_MAIN, c.leadership));
    el.style.setProperty("--leadership-sub-color", interpolateRgb(LIGHT_SUB, DARK_SUB, c.leadership));
    el.style.setProperty("--leadership-desc-color", interpolateRgb([250, 247, 242], [72, 49, 34], c.leadership));

    // Founders 2 cards individual color motion
    for (let f = 0; f < 2; f++) {
      const fp = c.founders[f];
      el.style.setProperty(`--founder-card-p-${f}`, fp.toFixed(4));
      el.style.setProperty(`--founder-title-${f}`, interpolateRgb(LIGHT_MAIN, DARK_MAIN, fp));
      el.style.setProperty(`--founder-role-${f}`, interpolateRgb(LIGHT_SUB, DARK_SUB, fp));
      el.style.setProperty(`--founder-desc-${f}`, interpolateRgb([250, 247, 242], [62, 42, 28], fp));
    }

    // Booking section
    el.style.setProperty("--booking-progress", c.booking.toFixed(4));
    el.style.setProperty("--booking-bg", interpolateRgb([18, 11, 8], [245, 239, 231], c.booking));
    el.style.setProperty("--booking-title-color", interpolateRgb(LIGHT_MAIN, DARK_MAIN, c.booking));
    el.style.setProperty("--booking-sub-color", interpolateRgb(LIGHT_SUB, DARK_SUB, c.booking));
    el.style.setProperty("--booking-desc-color", interpolateRgb([250, 247, 242], [82, 58, 40], c.booking));
    el.style.setProperty("--booking-primary-bg", interpolateRgb([250, 247, 242], [44, 26, 14], c.booking));
    el.style.setProperty("--booking-primary-color", interpolateRgb([44, 26, 14], [250, 247, 242], c.booking));
    el.style.setProperty("--booking-secondary-bg", interpolateRgb([20, 13, 8], [240, 232, 222], c.booking));
    el.style.setProperty("--booking-secondary-border", interpolateRgb([229, 206, 176], [118, 89, 66], c.booking));
    el.style.setProperty("--booking-secondary-color", interpolateRgb([250, 247, 242], [44, 26, 14], c.booking));

    // Footer
    el.style.setProperty("--footer-progress", c.footer.toFixed(4));
    el.style.setProperty("--footer-bg", interpolateRgb([13, 7, 5], [236, 228, 218], c.footer));
    el.style.setProperty("--footer-border", interpolateRgb([40, 25, 18], [200, 182, 162], c.footer));
    el.style.setProperty("--footer-name-color", interpolateRgb(LIGHT_MAIN, DARK_MAIN, c.footer));
    el.style.setProperty("--footer-copy-color", interpolateRgb([180, 170, 160], [100, 75, 55], c.footer));
  }, []);

  const tick = useCallback(() => {
    let stillMoving = false;
    const tgt = targets.current;
    const cur = current.current;

    const lerpVal = (cVal, tVal, factor = 0.09) => {
      const diff = tVal - cVal;
      if (Math.abs(diff) > 0.0004) {
        stillMoving = true;
        return cVal + diff * factor;
      }
      return tVal;
    };

    cur.scrollY = lerpVal(cur.scrollY, tgt.scrollY, 0.12);
    cur.hero = lerpVal(cur.hero, tgt.hero, 0.09);

    for (let i = 0; i < 9; i++) {
      cur.char[i] = lerpVal(cur.char[i], tgt.char[i], 0.09);
    }

    cur.ticker = lerpVal(cur.ticker, tgt.ticker, 0.09);
    cur.method = lerpVal(cur.method, tgt.method, 0.08);
    cur.chapters = lerpVal(cur.chapters, tgt.chapters, 0.075);
    cur.atelier = lerpVal(cur.atelier, tgt.atelier, 0.09);

    for (let j = 0; j < 3; j++) {
      cur.cards[j] = lerpVal(cur.cards[j], tgt.cards[j], 0.09);
    }

    cur.services = lerpVal(cur.services, tgt.services, 0.09);

    for (let k = 0; k < 3; k++) {
      cur.rows[k] = lerpVal(cur.rows[k], tgt.rows[k], 0.09);
    }

    cur.leadership = lerpVal(cur.leadership, tgt.leadership, 0.09);

    for (let f = 0; f < 2; f++) {
      cur.founders[f] = lerpVal(cur.founders[f], tgt.founders[f], 0.09);
    }

    cur.booking = lerpVal(cur.booking, tgt.booking, 0.09);
    cur.footer = lerpVal(cur.footer, tgt.footer, 0.09);

    applyColors();

    if (stillMoving) {
      rafId.current = requestAnimationFrame(tick);
    } else {
      isAnimating.current = false;
    }
  }, [applyColors]);

  const startAnimationLoop = useCallback(() => {
    if (!isAnimating.current) {
      isAnimating.current = true;
      rafId.current = requestAnimationFrame(tick);
    }
  }, [tick]);

  useEffect(() => {
    if (phase !== "complete") {
      document.body.style.overflow = "hidden";
      return undefined;
    }
    document.body.style.overflow = "auto";

    // Immediate initial color application
    applyColors();

    const handleScroll = () => {
      const sy = window.scrollY;
      const wh = window.innerHeight;

      const past40 = sy > 40;
      if (past40 !== isScrolledRef.current) {
        isScrolledRef.current = past40;
        setIsScrolled(past40);
      }
      const nearTop = sy < 32;
      if (nearTop !== isNearTopRef.current) {
        isNearTopRef.current = nearTop;
        setIsNearTop(nearTop);
      }

      const tgt = targets.current;
      tgt.scrollY = sy;

      // 1. Hero scroll progress (0 -> 1 over 340px)
      const heroProg = Math.min(1, Math.max(0, sy / 340));
      tgt.hero = heroProg;

      // 1b. Hero 9 letters staggered wave across M-Λ-R-V-E-L-O-U-S
      for (let i = 0; i < 9; i++) {
        const start = i * 0.042;
        tgt.char[i] = Math.min(1, Math.max(0, (heroProg - start) / 0.58));
      }

      // 2. Motion ticker progress
      const tickerEl = document.querySelector(".motion-ticker");
      if (tickerEl) {
        const r = tickerEl.getBoundingClientRect();
        tgt.ticker = Math.min(1, Math.max(0, (wh * 0.95 - r.top) / (wh * 0.55)));
      }

      const calcProgress = (el, enterRatio = 0.92, completeRatio = 0.35) => {
        if (!el) return 0;
        const r = el.getBoundingClientRect();
        return Math.min(1, Math.max(0, (wh * enterRatio - r.top) / (wh * (enterRatio - completeRatio))));
      };

      // 3. The Atelier Philosophy
      const methodEl = document.getElementById("method");
      tgt.method = calcProgress(methodEl, 0.96, 0.28);

      const chaptersEl = document.getElementById("chapters");
      if (chaptersEl) {
        const chapterRect = chaptersEl.getBoundingClientRect();
        const chapterRange = Math.max(1, chapterRect.height - wh);
        tgt.chapters = Math.min(1, Math.max(0, -chapterRect.top / chapterRange));
      }

      // 4. The Atelier Philosophy
      const atelierEl = document.getElementById("atelier");
      tgt.atelier = calcProgress(atelierEl, 0.92, 0.35);

      // 3b. 3 Craft Cards individual progress
      const cardEls = document.querySelectorAll(".editorial-card");
      cardEls.forEach((card, idx) => {
        if (idx < 3) {
          tgt.cards[idx] = calcProgress(card, 0.92, 0.38);
        }
      });

      // 4. Curated Signature Rituals
      const servicesEl = document.getElementById("services");
      tgt.services = calcProgress(servicesEl, 0.92, 0.35);

      // 4b. 3 Service Rows individual progress
      const rowEls = document.querySelectorAll(".service-row");
      rowEls.forEach((row, idx) => {
        if (idx < 3) {
          tgt.rows[idx] = calcProgress(row, 0.92, 0.4);
        }
      });

      // 5. Visionary Leadership & Academy
      const leadershipEl = document.getElementById("leadership");
      tgt.leadership = calcProgress(leadershipEl, 0.92, 0.35);

      // 5b. Founders 2 cards individual progress
      const founderEls = document.querySelectorAll(".founder-card");
      founderEls.forEach((card, idx) => {
        if (idx < 2) {
          tgt.founders[idx] = calcProgress(card, 0.92, 0.38);
        }
      });

      // 6. Booking Concierge
      const bookingEl = document.getElementById("booking");
      tgt.booking = calcProgress(bookingEl, 0.92, 0.36);

      // 7. Site Footer
      const footerEl = document.querySelector(".site-footer");
      tgt.footer = calcProgress(footerEl, 0.98, 0.5);

      startAnimationLoop();
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (rafId.current) cancelAnimationFrame(rafId.current);
      isAnimating.current = false;
      document.body.style.overflow = "";
    };
  }, [phase, applyColors, startAnimationLoop]);

  const replayIntro = useCallback(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
    if (rafId.current) cancelAnimationFrame(rafId.current);
    isAnimating.current = false;
    window.clearTimeout(zoomTimer.current);
    window.clearTimeout(finishTimer.current);
    clearLetterTimers();

    setLetterStates(Array(9).fill(false));
    setSubVisible(false);
    setTaglineVisible(false);
    isScrolledRef.current = false;
    isNearTopRef.current = true;
    setIsScrolled(false);
    setIsNearTop(true);

    const resetValues = {
      scrollY: 0,
      hero: 0,
      char: Array(9).fill(0),
      ticker: 0,
      method: 0,
      chapters: 0,
      atelier: 0,
      cards: [0, 0, 0],
      services: 0,
      rows: [0, 0, 0],
      leadership: 0,
      founders: [0, 0],
      booking: 0,
      footer: 0,
    };
    targets.current = { ...resetValues, char: [...resetValues.char], cards: [...resetValues.cards], rows: [...resetValues.rows], founders: [...resetValues.founders] };
    current.current = { ...resetValues, char: [...resetValues.char], cards: [...resetValues.cards], rows: [...resetValues.rows], founders: [...resetValues.founders] };
    applyColors();

    setPhase("entering");
  }, [clearLetterTimers, applyColors]);

  useEffect(() => {
    if (initialPhase || phase !== "entering") return undefined;

    clearLetterTimers();

    // Fast, crisp entrance for letters
    BRAND_LETTERS.forEach((item, idx) => {
      const t = window.setTimeout(() => {
        setLetterStates((prev) => {
          const next = [...prev];
          next[idx] = true;
          return next;
        });
      }, 140 + item.delay);
      letterTimers.current.push(t);
    });

    // Subtitle salon row
    const subTimer = window.setTimeout(() => {
      setSubVisible(true);
    }, 140 + 320 + 100);
    letterTimers.current.push(subTimer);

    // Tagline
    const tagTimer = window.setTimeout(() => {
      setTaglineVisible(true);
    }, 140 + 320 + 220);
    letterTimers.current.push(tagTimer);

    // Smooth auto-zoom transition
    zoomTimer.current = window.setTimeout(startZoom, HOLD_DURATION);

    return () => {
      window.clearTimeout(zoomTimer.current);
      clearLetterTimers();
    };
  }, [clearLetterTimers, initialPhase, phase, startZoom]);

  useEffect(
    () => () => {
      if (rafId.current) cancelAnimationFrame(rafId.current);
      window.clearTimeout(zoomTimer.current);
      window.clearTimeout(finishTimer.current);
      clearLetterTimers();
    },
    [clearLetterTimers],
  );

  // Restore reliable deep-link positioning after the React tree and intro state mount.
  useEffect(() => {
    if (phase !== "complete" || !window.location.hash) return undefined;
    const targetId = window.location.hash.slice(1);
    const frame = window.requestAnimationFrame(() => {
      window.requestAnimationFrame(() => {
        document.getElementById(targetId)?.scrollIntoView({ block: "start" });
      });
    });
    return () => window.cancelAnimationFrame(frame);
  }, [phase]);

  const isHeroRevealing = phase === "zooming" || phase === "complete";

  return (
    <>
      <div
        ref={wrapperRef}
        className="page-wrapper"
        style={{
          "--scroll-y": "0px",
          "--color-progress": "0",
          "--hero-text-color": "rgb(250, 247, 242)",
          "--hero-sub-color": "rgb(229, 206, 176)",
          "--hero-tag-color": "rgb(217, 186, 143)",
          "--hero-desc-color": "rgb(250, 247, 242)",
          "--hero-footer-color": "rgb(250, 247, 242)",
          "--hero-footer-sub": "rgb(229, 206, 176)",
          "--ticker-progress": "0",
          "--ticker-bg": "rgb(18, 11, 8)",
          "--ticker-color": "rgb(250, 247, 242)",
          "--ticker-dot": "rgb(229, 206, 176)",
          "--method-progress": "0",
          "--chapters-progress": "0",
          "--atelier-progress": "0",
          "--atelier-bg": "rgb(18, 11, 8)",
          "--atelier-title-color": "rgb(250, 247, 242)",
          "--atelier-sub-color": "rgb(229, 206, 176)",
          "--atelier-body-color": "rgb(250, 247, 242)",
          "--services-progress": "0",
          "--services-bg": "rgb(23, 14, 10)",
          "--services-title-color": "rgb(250, 247, 242)",
          "--services-sub-color": "rgb(229, 206, 176)",
          "--services-desc-color": "rgb(250, 247, 242)",
          "--leadership-progress": "0",
          "--leadership-bg": "rgb(20, 12, 8)",
          "--leadership-title-color": "rgb(250, 247, 242)",
          "--leadership-sub-color": "rgb(229, 206, 176)",
          "--leadership-desc-color": "rgb(250, 247, 242)",
          "--booking-progress": "0",
          "--booking-bg": "rgb(18, 11, 8)",
          "--booking-title-color": "rgb(250, 247, 242)",
          "--booking-sub-color": "rgb(229, 206, 176)",
          "--booking-desc-color": "rgb(250, 247, 242)",
          "--booking-primary-bg": "rgb(250, 247, 242)",
          "--booking-primary-color": "rgb(44, 26, 14)",
          "--booking-secondary-bg": "rgb(20, 13, 8)",
          "--booking-secondary-border": "rgb(229, 206, 176)",
          "--booking-secondary-color": "rgb(250, 247, 242)",
          "--footer-progress": "0",
          "--footer-bg": "rgb(13, 7, 5)",
          "--footer-border": "rgb(40, 25, 18)",
          "--footer-name-color": "rgb(250, 247, 242)",
          "--footer-copy-color": "rgb(180, 170, 160)",
        }}
      >
      {/* Main Page: Marvelous Salon Hero Experience */}
      <section
        className={`hero ${
          phase === "zooming"
            ? "hero--zooming"
            : phase === "complete"
              ? "hero--ready"
              : ""
        }`}
        aria-label="Marvelous Salon hero experience"
      >
        {/* Full-bleed Hero Interior Photograph (Parallax Anchored) */}
        <div className="hero__background" aria-hidden="true">
          <img
            className="hero__image"
            src="/assets/marvelous-salon-hero.png"
            alt="Warm ivory Marvelous Salon interior with arched mirrors and cream styling chairs"
            loading="eager"
            fetchPriority="high"
          />
        </div>

        {/* Ambient Luxury Scrim for Readability */}
        <div className="hero__scrim" aria-hidden="true" />

        {/* Luxury Navigation Header (Pinned & Adapts on Scroll) */}
        <header
          className={`hero__header ${
            isHeroRevealing ? "hero__element--visible" : ""
          } ${isScrolled ? "hero__header--scrolled" : ""}`}
        >
          <div className="hero__nav-inner">
            <a href="#" className="hero__logo-mark" aria-label="Marvelous Salon Home">
              <span className="hero__logo-monogram">M</span>
              <span className="hero__logo-divider" aria-hidden="true" />
              <span className="hero__logo-sub">ATELIER</span>
            </a>

            <nav className="hero__nav-links" aria-label="Main Navigation">
              <a href="#services" className="hero__nav-link">
                Services
              </a>
              <a href="#method" className="hero__nav-link">
                Method
              </a>
              <a href="#atelier" className="hero__nav-link">
                The Atelier
              </a>
              <a href="#leadership" className="hero__nav-link">
                Leadership
              </a>
              <a href="#booking" className="hero__nav-link">
                Concierge
              </a>
            </nav>

            <div className="hero__header-actions">
              <a href="#booking" className="hero__btn-reserve">
                Book Appointment
              </a>
            </div>
          </div>
        </header>

        {/* Hero Main Content with Dynamic Motion Scroll Transition */}
        <div
          className={`hero__content ${
            isHeroRevealing ? "hero__content--visible" : ""
          }`}
        >
          <div className="brand-lockup hero__lockup" aria-hidden="true">
            <h1 className="brand-word">
              <span className="brand-char">M</span>
              <span className="brand-char brand-char--lambda">Λ</span>
              <span className="brand-char">R</span>
              <span className="brand-char">V</span>
              <span className="brand-char">E</span>
              <span className="brand-char">L</span>
              <span className="brand-char">O</span>
              <span className="brand-char">U</span>
              <span className="brand-char">S</span>
            </h1>
            <div className="brand-salon-row">
              <span className="brand-rule" />
              <span className="brand-salon">SALON</span>
              <span className="brand-rule" />
            </div>
            <p className="brand-tagline">BEAUTY BEYOND ORDINARY</p>
          </div>

          <p className="hero__description">
            An architectural sanctuary for bespoke hair couture and restorative trichology.
          </p>

          <div className="hero__cta-group">
            <a href="#booking" className="hero__cta-primary">
              Reserve an Experience
            </a>
            <a href="#services" className="hero__cta-secondary">
              Explore Services
              <span className="hero__cta-arrow" aria-hidden="true">→</span>
            </a>
          </div>
        </div>

        {/* Animated Motion Scroll Cue */}
        <div
          className={`hero__scroll-cue ${
            isHeroRevealing && isNearTop ? "hero__scroll-cue--visible" : ""
          }`}
          aria-hidden="true"
        >
          <span className="hero__scroll-cue-text">Scroll to Discover</span>
          <span className="hero__scroll-cue-line" />
        </div>

        {/* Footer Bar with Replay Control */}
        <footer
          className={`hero__footer ${
            isHeroRevealing ? "hero__element--visible" : ""
          }`}
        >
          <div className="hero__footer-inner">
            <div className="hero__footer-actions">
              <button
                className="hero__replay-btn"
                type="button"
                onClick={replayIntro}
                aria-label="Replay Marvelous Salon introduction"
                title="Replay intro animation"
              >
                <svg
                  className="hero__replay-icon"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.75"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
                  <path d="M3 3v5h5" />
                </svg>
                <span>Replay Intro</span>
              </button>
            </div>
          </div>
        </footer>
      </section>

      {/* Kinetic Motion Scroll Ticker */}
      <div className="motion-ticker" aria-hidden="true">
        <div className="motion-ticker__track">
          <span>HAUTE COIFFURE</span>
          <span className="motion-ticker__dot">✦</span>
          <span>BESPOKE BALAYAGE</span>
          <span className="motion-ticker__dot">✦</span>
          <span>RESTORATIVE TRICHOLOGY</span>
          <span className="motion-ticker__dot">✦</span>
          <span>ARCHITECTURAL CUTS</span>
          <span className="motion-ticker__dot">✦</span>
          <span>PRIVATE ATELIER SUITES</span>
          <span className="motion-ticker__dot">✦</span>
          <span>MΛRVELOUS SALON</span>
          <span className="motion-ticker__dot">✦</span>
          <span>HAUTE COIFFURE</span>
          <span className="motion-ticker__dot">✦</span>
          <span>BESPOKE BALAYAGE</span>
          <span className="motion-ticker__dot">✦</span>
          <span>RESTORATIVE TRICHOLOGY</span>
          <span className="motion-ticker__dot">✦</span>
          <span>ARCHITECTURAL CUTS</span>
          <span className="motion-ticker__dot">✦</span>
          <span>PRIVATE ATELIER SUITES</span>
          <span className="motion-ticker__dot">✦</span>
          <span>MΛRVELOUS SALON</span>
          <span className="motion-ticker__dot">✦</span>
        </div>
      </div>

      {/* Beauty Intelligence — editorial bento with original 2D art */}
      <section id="method" className="method-section" aria-labelledby="method-title">
        <div className="editorial-container">
          <header className="method-header">
            <span className="method-eyebrow">BEAUTY, ENGINEERED BEAUTIFULLY</span>
            <h2 id="method-title" className="method-title">
              Precision you can feel.<br />Artistry you can see.
            </h2>
            <p className="method-intro">
              Every Marvelous ritual begins with observation, becomes a bespoke formula,
              and finishes as effortless movement.
            </p>
          </header>

          <div className="method-bento">
            <article className="method-card method-card--portrait">
              <div className="method-card__media">
                <img src="/assets/marvelous-hair-flow-2d.png" alt="Abstract flowing ribbons inspired by dimensional hair" loading="lazy" />
              </div>
              <div className="method-card__copy">
                <span className="method-card__index">01 · FORM</span>
                <h3>Cut around movement.</h3>
                <p>Architectural shapes designed to fall naturally, grow beautifully, and move as one.</p>
              </div>
            </article>

            <article className="method-card method-card--wide">
              <div className="method-card__copy method-card__copy--overlay">
                <span className="method-card__index">02 · LIGHT</span>
                <h3>Colour, mapped to you.</h3>
                <p>Skin tone, eye colour and natural depth become a personalised spectrum—not a preset shade.</p>
              </div>
              <div className="method-card__media">
                <img src="/assets/marvelous-color-prism-2d.png" alt="Abstract prism and ribbons representing bespoke hair colour" loading="lazy" />
              </div>
            </article>

            <article className="method-card method-card--science">
              <div className="method-card__copy">
                <span className="method-card__index">03 · ROOT</span>
                <h3>Beauty starts beneath the surface.</h3>
                <p>Scalp-first diagnostics and restorative rituals build the conditions for stronger, brighter hair.</p>
              </div>
              <div className="method-card__media">
                <img src="/assets/marvelous-follicle-botanical-2d.png" alt="Botanical illustration inspired by hair and scalp science" loading="lazy" />
              </div>
            </article>

            <aside className="method-card method-card--statement">
              <span className="method-card__index">THE MARVELOUS METHOD</span>
              <p className="method-quote">Science sets the foundation. The hand makes it personal.</p>
              <a href="#services" className="method-link">Explore signature rituals <span aria-hidden="true">→</span></a>
            </aside>
          </div>
        </div>
      </section>

      {/* Editorial Section: The Atelier Philosophy */}
      <section id="atelier" className="editorial-section">
        <div className="editorial-container">
          <div className="editorial-header">
            <span className="editorial-eyebrow">THE ATELIER PHILOSOPHY</span>
            <h2 className="editorial-title">
              Architectural Precision Meets Haute Hair Couture
            </h2>
            <div className="editorial-divider" />
          </div>

          <div className="editorial-grid">
            <div className="editorial-card">
              <span className="editorial-card__number">01</span>
              <h3 className="editorial-card__heading">Scalp Trichology Rituals</h3>
              <p className="editorial-card__text">
                Micro-cellular diagnostic analysis and restorative caviar infusions tailored to revitalize follicle density and natural radiance.
              </p>
            </div>

            <div className="editorial-card">
              <span className="editorial-card__number">02</span>
              <h3 className="editorial-card__heading">Bespoke Balayage & Tones</h3>
              <p className="editorial-card__text">
                Hand-painted French gradations harmonized with natural skin undertones, cured with botanical silk glazes for luminous dimension.
              </p>
            </div>

            <div className="editorial-card">
              <span className="editorial-card__number">03</span>
              <h3 className="editorial-card__heading">Private Suite Sculpting</h3>
              <p className="editorial-card__text">
                Quiet luxury private styling sanctuaries designed for personal consultations, architectural cuts, and high-fashion editorial styling.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Curated Services Rituals */}
      <section id="services" className="services-section">
        <div className="editorial-container">
          <div className="editorial-header">
            <span className="editorial-eyebrow">CURATED EXPERIENCES</span>
            <h2 className="editorial-title">Signature Salon Rituals</h2>
            <div className="editorial-divider" />
          </div>

          <div className="services-list">
            <article className="service-row">
              <div className="service-row__info">
                <span className="service-row__category">SIGNATURE COLOR</span>
                <h3 className="service-row__title">French Couture Balayage & Glaze</h3>
                <p className="service-row__desc">
                  Multi-dimensional bespoke placement, root melt, tone harmonization, and cold-pressed botanical seal.
                </p>
              </div>
              <div className="service-row__meta">
                <span className="service-row__time">150 MIN</span>
                <span className="service-row__price">FROM $380</span>
                <a href="#booking" className="service-row__btn">Reserve</a>
              </div>
            </article>

            <article className="service-row">
              <div className="service-row__info">
                <span className="service-row__category">TRICHOLOGY</span>
                <h3 className="service-row__title">Caviar & Keratin Restorative Ritual</h3>
                <p className="service-row__desc">
                  Ultrasonic scalp exfoliation, bio-lipid infusion, ozone steam therapy, and deep cellular hydration mask.
                </p>
              </div>
              <div className="service-row__meta">
                <span className="service-row__time">90 MIN</span>
                <span className="service-row__price">FROM $260</span>
                <a href="#booking" className="service-row__btn">Reserve</a>
              </div>
            </article>

            <article className="service-row">
              <div className="service-row__info">
                <span className="service-row__category">CUT & SCULPT</span>
                <h3 className="service-row__title">Architectural Cut & Atelier Blowout</h3>
                <p className="service-row__desc">
                  Bespoke dry contouring, customized face-framing geometry, tension blowout, and silk finishing gloss.
                </p>
              </div>
              <div className="service-row__meta">
                <span className="service-row__time">75 MIN</span>
                <span className="service-row__price">FROM $190</span>
                <a href="#booking" className="service-row__btn">Reserve</a>
              </div>
            </article>
          </div>
        </div>
      </section>

      {/* Sticky overlap narrative — three layers assemble while the page scrolls */}
      <section id="chapters" className="chapters-section" aria-labelledby="chapters-title">
        <div className="chapters-sticky">
          <div className="chapters-heading">
            <span>ONE APPOINTMENT · THREE ACTS</span>
            <h2 id="chapters-title">Your transformation, choreographed.</h2>
          </div>

          <div className="chapters-stack">
            <article className="chapter-card chapter-card--one">
              <div className="chapter-card__number">01</div>
              <div className="chapter-card__copy">
                <span>DISCOVER</span>
                <h3>We read the whole picture.</h3>
                <p>Texture, lifestyle, face architecture and scalp condition shape the creative brief.</p>
              </div>
              <img src="/assets/marvelous-follicle-botanical-2d.png" alt="" aria-hidden="true" />
            </article>

            <article className="chapter-card chapter-card--two">
              <div className="chapter-card__number">02</div>
              <div className="chapter-card__copy">
                <span>DESIGN</span>
                <h3>Every detail earns its place.</h3>
                <p>Shape and tone are composed together, balancing dimension with long-term wearability.</p>
              </div>
              <img src="/assets/marvelous-color-prism-2d.png" alt="" aria-hidden="true" />
            </article>

            <article className="chapter-card chapter-card--three">
              <div className="chapter-card__number">03</div>
              <div className="chapter-card__copy">
                <span>REVEAL</span>
                <h3>Movement becomes the finish.</h3>
                <p>A final sculpt, gloss and care ritual makes the result distinctly, unmistakably yours.</p>
              </div>
              <img src="/assets/marvelous-hair-flow-2d.png" alt="" aria-hidden="true" />
            </article>
          </div>
        </div>
      </section>

      {/* Visionary Leadership & Academy Section */}
      <section id="leadership" className="leadership-section">
        <img
          className="leadership-art"
          src="/assets/marvelous-color-prism-2d.png"
          alt=""
          aria-hidden="true"
        />
        <div className="editorial-container">
          <header className="leadership-header">
            <div className="leadership-header__title">
              <span className="editorial-eyebrow">THE FOUNDERS · MARVELOUS SALON & ACADEMY</span>
              <h2 className="editorial-title">Two disciplines.<br />One remarkable standard.</h2>
            </div>
            <div className="leadership-header__note">
              <span className="leadership-header__edition">EST. 2026 · INDIA</span>
              <p className="leadership-header-desc">
                Enterprise vision and award-winning artistry meet in one shared pursuit:
                making every Marvelous experience impossible to forget.
              </p>
            </div>
          </header>

          <div className="leadership-manifesto" aria-hidden="true">
            <span>VISION</span>
            <span className="leadership-manifesto__mark">×</span>
            <span>ARTISTRY</span>
          </div>

          <div className="founder-grid">
            {/* Founder 1: Hridhan Pahwa */}
            <article id="founder-hridhan" className="founder-card">
              <span className="founder-card__edition" aria-hidden="true">01 · THE ARCHITECT</span>
              <div className="founder-card__media">
                <img
                  src="/assets/hridhan-pahwa.jpg"
                  alt="Hridhan Pahwa, Founder of Marvelous Salon and Academy, Lawyer & Legal Counsel"
                  className="founder-card__img founder-card__img--hridhan"
                  loading="lazy"
                />
                <div className="founder-card__media-badge">
                  <span>FOUNDER & ADVOCATE</span>
                </div>
              </div>
              <div className="founder-card__content">
                <p className="founder-card__statement">“Structure creates the freedom to build beautifully.”</p>
                <div className="founder-card__header">
                  <span className="founder-card__label">FOUNDER & LEGAL COUNSEL</span>
                  <h3 className="founder-card__name">Hridhan Pahwa</h3>
                  <p className="founder-card__role">
                    Founder, Marvelous Salon & Academy · Advocate & Legal Counsel
                  </p>
                </div>
                <p className="founder-card__bio">
                  Visionary founder directing enterprise strategy, brand elevation, and the rigorous pedagogical standards of Marvelous Salon & Academy. Combining astute legal intellect with an architectural eye for modern salon luxury.
                </p>
                <div className="founder-card__tags">
                  <span className="founder-card__tag">Marvelous Salon & Academy</span>
                  <span className="founder-card__tag">Legal Counsel & Advocate</span>
                  <span className="founder-card__tag">Strategic Enterprise Direction</span>
                </div>
              </div>
            </article>

            {/* Founder 2: Ashna Pahwa */}
            <article id="founder-ashna" className="founder-card">
              <span className="founder-card__edition" aria-hidden="true">02 · THE ARTIST</span>
              <div className="founder-card__media">
                <img
                  src="/assets/ashna-pahwa.jpg"
                  alt="Ashna Pahwa, Managing Director and Celebrity Makeup Artist (MUA) at Marvelous Salon, Glam India Award Winner"
                  className="founder-card__img founder-card__img--ashna"
                  loading="lazy"
                />
                <div className="founder-card__media-badge">
                  <span>MD & CELEBRITY MUA</span>
                </div>
              </div>
              <div className="founder-card__content">
                <p className="founder-card__statement">“Artistry begins where the formula ends.”</p>
                <div className="founder-card__header">
                  <span className="founder-card__label">MANAGING DIRECTOR & ARTISTIC HEAD</span>
                  <h3 className="founder-card__name">Ashna Pahwa</h3>
                  <p className="founder-card__role">
                    Managing Director & Celebrity Makeup Artist · Glam India Awardee
                  </p>
                </div>
                <p className="founder-card__bio">
                  Managing Director and celebrated celebrity makeup artist, recognized on national platforms including the Glam India Award. Master of bespoke bridal transformations, editorial aesthetic design, and premier luxury client experiences.
                </p>
                <div className="founder-card__tags">
                  <span className="founder-card__tag">Managing Director, Marvelous Salon</span>
                  <span className="founder-card__tag">Celebrity Makeup Artist</span>
                  <span className="founder-card__tag">Glam India Award Winner</span>
                </div>
              </div>
            </article>
          </div>
        </div>
      </section>

      {/* Reservation & Atelier Concierge */}
      <section id="booking" className="booking-section">
        <div className="editorial-container">
          <div className="booking-box">
            <span className="editorial-eyebrow">BY APPOINTMENT ONLY</span>
            <h2 className="booking-title">Begin Your Transformation</h2>
            <p className="booking-desc">
              Experience personalized couture consultations in our private atelier suites.
            </p>
            <div className="booking-actions">
              <a href="tel:+12125550198" className="hero__cta-primary booking__cta-primary">
                Call Concierge: (212) 555-0198
              </a>
              <button
                type="button"
                className="hero__cta-secondary booking__cta-secondary"
                onClick={replayIntro}
              >
                Replay Experience
              </button>
            </div>
            <p className="booking-address">
              140 Haute Avenue, Atelier District · Tuesday through Saturday, 9:00 — 19:00
            </p>
          </div>
        </div>
      </section>

      {/* Atelier Site Footer */}
      <footer className="site-footer">
        <div className="editorial-container site-footer__inner">
          <div className="site-footer__brand">
            <span className="hero__logo-monogram site-footer__monogram">M</span>
            <span className="site-footer__name">MΛRVELOUS SALON</span>
          </div>
          <p className="site-footer__copy">
            © 2026 Marvelous Salon Atelier. Beauty Beyond Ordinary.
          </p>
        </div>
      </footer>
    </div>

      {/* Splash Transition Screen (Zooms INTO Logo while Hero Reveals) */}
      {phase !== "complete" && (
        <button
          className={`splash splash--${phase}`}
          type="button"
          onClick={startZoom}
          aria-label="Skip the Marvelous Salon introduction"
        >
          <div className="brand-lockup splash__lockup" aria-hidden="true">
            <span className="brand-word">
              {BRAND_LETTERS.map((item, index) => (
                <span
                  key={index}
                  className={`brand-char photo-text ${
                    item.isLambda ? "brand-char--lambda" : ""
                  } ${letterStates[index] ? "brand-char--visible" : ""}`}
                >
                  {item.char}
                </span>
              ))}
            </span>
            <span className="brand-salon-row splash__salon-row">
              <span
                className={`brand-rule splash__rule-left ${
                  subVisible ? "splash__sub--visible" : ""
                }`}
              />
              <span
                className={`brand-salon photo-text splash__salon ${
                  subVisible ? "splash__sub--visible" : ""
                }`}
              >
                SALON
              </span>
              <span
                className={`brand-rule splash__rule-right ${
                  subVisible ? "splash__sub--visible" : ""
                }`}
              />
            </span>
            <span
              className={`brand-tagline photo-text splash__tagline ${
                taglineVisible ? "splash__sub--visible" : ""
              }`}
            >
              BEAUTY BEYOND ORDINARY
            </span>
          </div>
          <span className="sr-only">
            Marvelous Salon — Beauty Beyond Ordinary
          </span>
        </button>
      )}
    </>
  );
}
