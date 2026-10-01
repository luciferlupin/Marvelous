import React, { useState, useEffect, useCallback, useMemo, useRef } from "react";
import { createPortal } from "react-dom";
import { GALLERY_ITEMS, GALLERY_CATEGORIES } from "./galleryData";
import "./art-gallery.css";

const INITIAL_BENTO_LIMIT = 6;

export default function ArtGallery() {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [viewMode, setViewMode] = useState("bento"); // "bento" | "reel"
  const [isExpanded, setIsExpanded] = useState(false);
  const [activeLightboxIndex, setActiveLightboxIndex] = useState(null);
  const [mounted, setMounted] = useState(false);
  
  const reelRef = useRef(null);
  const [reelScrollProgress, setReelScrollProgress] = useState(0);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Filter items by category
  const filteredItems = useMemo(() => {
    if (selectedCategory === "all") return GALLERY_ITEMS;
    return GALLERY_ITEMS.filter((item) => item.category === selectedCategory);
  }, [selectedCategory]);

  // Category counts
  const categoryCounts = useMemo(() => {
    const counts = { all: GALLERY_ITEMS.length };
    GALLERY_ITEMS.forEach((item) => {
      counts[item.category] = (counts[item.category] || 0) + 1;
    });
    return counts;
  }, []);

  // Reset expansion when category changes
  const handleCategoryChange = (catId) => {
    setSelectedCategory(catId);
    setIsExpanded(false);
    if (reelRef.current) {
      reelRef.current.scrollTo({ left: 0, behavior: "smooth" });
    }
  };

  // Items to display in Bento Grid mode (curated 6 items or all when expanded)
  const displayedBentoItems = useMemo(() => {
    if (isExpanded || filteredItems.length <= INITIAL_BENTO_LIMIT) {
      return filteredItems;
    }
    return filteredItems.slice(0, INITIAL_BENTO_LIMIT);
  }, [filteredItems, isExpanded]);

  const hasMoreItems = filteredItems.length > INITIAL_BENTO_LIMIT;

  // Track reel scroll position for indicators and button disable states
  const updateReelScrollStatus = useCallback(() => {
    const el = reelRef.current;
    if (!el) return;
    const maxScroll = el.scrollWidth - el.clientWidth;
    if (maxScroll <= 0) {
      setCanScrollLeft(false);
      setCanScrollRight(false);
      setReelScrollProgress(0);
      return;
    }
    const currentScroll = el.scrollLeft;
    setCanScrollLeft(currentScroll > 10);
    setCanScrollRight(currentScroll < maxScroll - 10);
    setReelScrollProgress(Math.min(1, Math.max(0, currentScroll / maxScroll)));
  }, []);

  useEffect(() => {
    const el = reelRef.current;
    if (!el || viewMode !== "reel") return;
    updateReelScrollStatus();
    el.addEventListener("scroll", updateReelScrollStatus, { passive: true });
    window.addEventListener("resize", updateReelScrollStatus);
    return () => {
      el.removeEventListener("scroll", updateReelScrollStatus);
      window.removeEventListener("resize", updateReelScrollStatus);
    };
  }, [viewMode, filteredItems, updateReelScrollStatus]);

  const scrollReel = (direction) => {
    const el = reelRef.current;
    if (!el) return;
    const scrollAmount = el.clientWidth * 0.75;
    el.scrollBy({
      left: direction === "next" ? scrollAmount : -scrollAmount,
      behavior: "smooth",
    });
  };

  // Lightbox handlers
  const openLightbox = (item) => {
    const idx = filteredItems.findIndex((i) => i.id === item.id);
    if (idx !== -1) {
      setActiveLightboxIndex(idx);
    }
  };

  const closeLightbox = useCallback(() => {
    setActiveLightboxIndex(null);
  }, []);

  const showNext = useCallback(() => {
    if (activeLightboxIndex !== null) {
      setActiveLightboxIndex((prev) => (prev + 1) % filteredItems.length);
    }
  }, [activeLightboxIndex, filteredItems.length]);

  const showPrev = useCallback(() => {
    if (activeLightboxIndex !== null) {
      setActiveLightboxIndex((prev) => (prev - 1 + filteredItems.length) % filteredItems.length);
    }
  }, [activeLightboxIndex, filteredItems.length]);

  // Keyboard navigation for lightbox
  useEffect(() => {
    if (activeLightboxIndex === null) return undefined;

    const handleKeyDown = (e) => {
      if (e.key === "Escape") closeLightbox();
      else if (e.key === "ArrowRight") showNext();
      else if (e.key === "ArrowLeft") showPrev();
    };

    window.addEventListener("keydown", handleKeyDown);
    const origOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = origOverflow;
    };
  }, [activeLightboxIndex, closeLightbox, showNext, showPrev]);

  // Touch swipe support for mobile lightbox
  const [touchStartX, setTouchStartX] = useState(null);
  const handleTouchStart = (e) => {
    setTouchStartX(e.touches[0].clientX);
  };
  const handleTouchEnd = (e) => {
    if (touchStartX === null) return;
    const diff = touchStartX - e.changedTouches[0].clientX;
    if (diff > 40) showNext();
    else if (diff < -40) showPrev();
    setTouchStartX(null);
  };

  const currentLightboxItem = activeLightboxIndex !== null ? filteredItems[activeLightboxIndex] : null;

  return (
    <section id="gallery" className="art-gallery-section" aria-labelledby="gallery-title">
      <div className="art-gallery-container">
        {/* Apple-style Minimalist Header */}
        <header className="art-gallery-header">
          <span className="art-gallery-eyebrow">THE ARCHIVE</span>
          <h2 id="gallery-title" className="art-gallery-title">
            Thirty Years in Light & Form.
          </h2>
          <p className="art-gallery-intro">
            A curated visual chronicle of bespoke hair couture, pageant crowns, and master artistry.
          </p>
        </header>

        {/* Apple-style Toolbar: Categories + View Switcher */}
        <div className="art-gallery-toolbar">
          {/* Category Filter Pills with Counter Badges */}
          <nav className="art-gallery-filters" role="tablist" aria-label="Gallery categories">
            <div className="art-gallery-filter-track">
              {GALLERY_CATEGORIES.map((cat) => {
                const isActive = selectedCategory === cat.id;
                const count = categoryCounts[cat.id] || 0;
                return (
                  <button
                    key={cat.id}
                    role="tab"
                    aria-selected={isActive}
                    className={`art-gallery-filter-pill ${isActive ? "art-gallery-filter-pill--active" : ""}`}
                    onClick={() => handleCategoryChange(cat.id)}
                  >
                    <span className="art-gallery-pill-label">{cat.label}</span>
                    <span className="art-gallery-pill-count">{count}</span>
                  </button>
                );
              })}
            </div>
          </nav>

          {/* Luxury View Mode Toggle Switch */}
          <div className="art-gallery-view-toggle" role="group" aria-label="Gallery view mode">
            <button
              type="button"
              className={`art-gallery-view-btn ${viewMode === "bento" ? "art-gallery-view-btn--active" : ""}`}
              onClick={() => setViewMode("bento")}
              aria-label="Bento Grid layout"
              title="Curated Bento Grid"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M3 3h8v8H3V3zm10 0h8v8h-8V3zM3 13h8v8H3v-8zm10 0h8v8h-8v-8z" />
              </svg>
              <span>Grid</span>
            </button>
            <button
              type="button"
              className={`art-gallery-view-btn ${viewMode === "reel" ? "art-gallery-view-btn--active" : ""}`}
              onClick={() => setViewMode("reel")}
              aria-label="Horizontal Filmstrip Reel layout"
              title="Horizontal Filmstrip Reel"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M4 6H2v12h2V6zm18 0h-2v12h2V6zM6 4h12v16H6V4zm2 2v12h8V6H8z" />
              </svg>
              <span>Reel</span>
            </button>
          </div>
        </div>

        {/* View Mode 1: Curated Apple Bento Grid */}
        {viewMode === "bento" && (
          <div className="art-gallery-bento-wrap">
            <div className="art-gallery-grid">
              {displayedBentoItems.map((item) => (
                <article
                  key={item.id}
                  className={`art-gallery-card ${item.featured ? "art-gallery-card--featured" : ""}`}
                  onClick={() => openLightbox(item)}
                  tabIndex={0}
                  role="button"
                  aria-label={`View ${item.title}`}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      openLightbox(item);
                    }
                  }}
                >
                  <div className="art-gallery-card__media">
                    <img
                      src={item.src}
                      alt={item.title}
                      loading="lazy"
                      decoding="async"
                      className="art-gallery-card__img"
                    />
                    <div className="art-gallery-card__scrim" aria-hidden="true" />
                    <div className="art-gallery-card__hover-badge" aria-hidden="true">
                      <span>View Cinema ↗</span>
                    </div>
                    <div className="art-gallery-card__caption">
                      <div className="art-gallery-card__meta">
                        <h3 className="art-gallery-card__title">{item.title}</h3>
                        <span className="art-gallery-card__sub">{item.subtitle}</span>
                      </div>
                      <span className="art-gallery-card__year">{item.year}</span>
                    </div>
                  </div>
                </article>
              ))}
            </div>

            {/* Curated Archive Progressive Disclosure CTA */}
            {hasMoreItems && (
              <div className="art-gallery-expand-row">
                <button
                  type="button"
                  className={`art-gallery-expand-btn ${isExpanded ? "art-gallery-expand-btn--expanded" : ""}`}
                  onClick={() => setIsExpanded(!isExpanded)}
                  aria-expanded={isExpanded}
                >
                  <span className="art-gallery-expand-icon" aria-hidden="true">
                    {isExpanded ? "↑" : "↓"}
                  </span>
                  <span>
                    {isExpanded
                      ? "Collapse Curated Archive"
                      : `Explore All ${filteredItems.length} Curated Works (+${filteredItems.length - INITIAL_BENTO_LIMIT} More)`}
                  </span>
                </button>
              </div>
            )}
          </div>
        )}

        {/* View Mode 2: Horizontal Apple Filmstrip Reel */}
        {viewMode === "reel" && (
          <div className="art-gallery-reel-section">
            <div className="art-gallery-reel-viewport">
              <button
                type="button"
                className={`art-gallery-reel-arrow art-gallery-reel-arrow--prev ${!canScrollLeft ? "art-gallery-reel-arrow--disabled" : ""}`}
                onClick={() => scrollReel("prev")}
                disabled={!canScrollLeft}
                aria-label="Previous archival works"
              >
                ‹
              </button>

              <div ref={reelRef} className="art-gallery-reel-track" tabIndex={0} role="region" aria-label="Archival works filmstrip">
                {filteredItems.map((item, idx) => (
                  <article
                    key={item.id}
                    className="art-gallery-reel-card"
                    onClick={() => openLightbox(item)}
                    tabIndex={0}
                    role="button"
                    aria-label={`View ${item.title}`}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        openLightbox(item);
                      }
                    }}
                  >
                    <div className="art-gallery-reel-card__media">
                      <img
                        src={item.src}
                        alt={item.title}
                        loading="lazy"
                        decoding="async"
                        className="art-gallery-reel-card__img"
                      />
                      <div className="art-gallery-reel-card__scrim" aria-hidden="true" />
                      <div className="art-gallery-reel-card__index-tag" aria-hidden="true">
                        {String(idx + 1).padStart(2, "0")}
                      </div>
                      <div className="art-gallery-reel-card__caption">
                        <div className="art-gallery-reel-card__meta">
                          <h3 className="art-gallery-reel-card__title">{item.title}</h3>
                          <span className="art-gallery-reel-card__sub">{item.subtitle}</span>
                        </div>
                        <span className="art-gallery-reel-card__year">{item.year}</span>
                      </div>
                    </div>
                  </article>
                ))}
              </div>

              <button
                type="button"
                className={`art-gallery-reel-arrow art-gallery-reel-arrow--next ${!canScrollRight ? "art-gallery-reel-arrow--disabled" : ""}`}
                onClick={() => scrollReel("next")}
                disabled={!canScrollRight}
                aria-label="Next archival works"
              >
                ›
              </button>
            </div>

            {/* Reel Progress Bar & Meta */}
            <div className="art-gallery-reel-footer">
              <div className="art-gallery-reel-progress-track">
                <div
                  className="art-gallery-reel-progress-bar"
                  style={{ width: `${Math.max(12, reelScrollProgress * 100)}%` }}
                />
              </div>
              <div className="art-gallery-reel-hint">
                <span>Swipe or drag horizontally to discover all {filteredItems.length} works</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Apple-Style Cinema Lightbox Modal */}
      {mounted &&
        currentLightboxItem &&
        createPortal(
          <div
            className="art-lightbox-backdrop"
            role="dialog"
            aria-modal="true"
            aria-label={currentLightboxItem.title}
            onClick={closeLightbox}
          >
            <div
              className="art-lightbox-stage"
              onClick={(e) => e.stopPropagation()}
              onTouchStart={handleTouchStart}
              onTouchEnd={handleTouchEnd}
            >
              {/* Top Minimalist Bar */}
              <div className="art-lightbox-top-bar">
                <span className="art-lightbox-counter">
                  {activeLightboxIndex + 1} / {filteredItems.length}
                </span>
                <button
                  className="art-lightbox-close"
                  onClick={closeLightbox}
                  aria-label="Close modal"
                >
                  ✕
                </button>
              </div>

              {/* Centered High-Resolution Visual */}
              <div className="art-lightbox-frame">
                <img
                  src={currentLightboxItem.src}
                  alt={currentLightboxItem.title}
                  className="art-lightbox-photo"
                />
              </div>

              {/* Navigation Chevrons */}
              <button
                className="art-lightbox-arrow art-lightbox-arrow--prev"
                onClick={showPrev}
                aria-label="Previous work"
              >
                ‹
              </button>
              <button
                className="art-lightbox-arrow art-lightbox-arrow--next"
                onClick={showNext}
                aria-label="Next work"
              >
                ›
              </button>

              {/* Bottom Minimalist Floating Pill */}
              <div className="art-lightbox-bottom-bar">
                <div className="art-lightbox-info">
                  <h3 className="art-lightbox-title">{currentLightboxItem.title}</h3>
                  <span className="art-lightbox-sub">
                    {currentLightboxItem.subtitle} · {currentLightboxItem.year}
                  </span>
                </div>
                <a
                  href="#booking"
                  className="art-lightbox-cta"
                  onClick={closeLightbox}
                >
                  Book Experience ↗
                </a>
              </div>
            </div>
          </div>,
          document.body
        )}
    </section>
  );
}

