import React, { useState, useEffect, useCallback, useMemo } from "react";
import { createPortal } from "react-dom";
import { GALLERY_ITEMS, GALLERY_CATEGORIES } from "./galleryData";
import "./art-gallery.css";

export default function ArtGallery() {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [activeLightboxIndex, setActiveLightboxIndex] = useState(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Filter items by category
  const filteredItems = useMemo(() => {
    if (selectedCategory === "all") return GALLERY_ITEMS;
    return GALLERY_ITEMS.filter((item) => item.category === selectedCategory);
  }, [selectedCategory]);

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
            A visual chronicle of bespoke hair couture, pageant crowns, and master artistry.
          </p>
        </header>

        {/* Apple-style Segmented Filter Bar */}
        <nav className="art-gallery-filters" role="tablist" aria-label="Gallery categories">
          <div className="art-gallery-filter-track">
            {GALLERY_CATEGORIES.map((cat) => {
              const isActive = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  role="tab"
                  aria-selected={isActive}
                  className={`art-gallery-filter-pill ${isActive ? "art-gallery-filter-pill--active" : ""}`}
                  onClick={() => setSelectedCategory(cat.id)}
                >
                  {cat.label}
                </button>
              );
            })}
          </div>
        </nav>

        {/* Apple Bento Grid */}
        <div className="art-gallery-grid">
          {filteredItems.map((item) => (
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
