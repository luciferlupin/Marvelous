import { useState } from "react";
import "./brand-partners.css";

const PARTNERS = [
  {
    id: "kerastase",
    name: "Kérastase Paris",
    origin: "Paris, France",
    category: "hair",
    categoryLabel: "Hair Couture & Trichology",
    tagline: "Customized Luxury Scalp & Fiber Rituals",
    description: "Pioneering cellular-level diagnostics and bespoke salon prescriptions that restore hair integrity from root to tip.",
  },
  {
    id: "redken",
    name: "Redken 5th Avenue NYC",
    origin: "New York, USA",
    category: "hair",
    categoryLabel: "Hair Couture & Trichology",
    tagline: "Acidic Bonding & High-Performance Color",
    description: "Scientifically engineered pH-balanced formulations designed for vibrant tone longevity and structural bond fortification.",
  },
  {
    id: "loreal",
    name: "L’Oréal Paris Professional",
    origin: "Paris, France",
    category: "hair",
    categoryLabel: "Hair Couture & Trichology",
    tagline: "Global Vanguard of Color Chemistry",
    description: "Iconic European pigment artistry delivering ultra-dimensional gloss, chromatic depth, and radiant fiber protection.",
  },
  {
    id: "kevin-murphy",
    name: "Kevin.Murphy",
    origin: "Melbourne, Australia",
    category: "hair",
    categoryLabel: "Hair Couture & Trichology",
    tagline: "Skincare for Your Hair",
    description: "Weightless botanical formulations infused with micro-algae and essential oils for touchable runway texture and natural movement.",
  },
  {
    id: "wella",
    name: "Wella Professionals",
    origin: "Darmstadt, Germany",
    category: "hair",
    categoryLabel: "Hair Couture & Trichology",
    tagline: "Master-Grade Lightening & Tone Mastery",
    description: "Over a century of German precision engineering in salon color craft, luminous glossing, and fiber-safe lightening.",
  },
  {
    id: "olaplex",
    name: "Olaplex",
    origin: "California, USA",
    category: "hair",
    categoryLabel: "Hair Couture & Trichology",
    tagline: "Patented Molecular Bond Multipliers",
    description: "Revolutionary bis-aminopropyl diglycol dimaleate technology repairing broken disulfide bonds from chemical and thermal styling.",
  },
  {
    id: "schwarzkopf",
    name: "Schwarzkopf Professional",
    origin: "Berlin, Germany",
    category: "hair",
    categoryLabel: "Hair Couture & Trichology",
    tagline: "High-Performance Blonde & Fiber Clinix",
    description: "Tri-bond technology and targeted restorative therapies delivering structural reinforcement and luminous reflections.",
  },
  {
    id: "dermalogica",
    name: "Dermalogica",
    origin: "Los Angeles, USA",
    category: "skin",
    categoryLabel: "Clinical Skincare",
    tagline: "Custom Micro-Zone Dermal Therapy",
    description: "Certified clean, medical-grade botanical actives prescribed through professional face-mapping for radiant skin barrier health.",
  },
  {
    id: "hydrafacial",
    name: "HydraFacial",
    origin: "Long Beach, USA",
    category: "skin",
    categoryLabel: "Clinical Skincare",
    tagline: "Vortex-Fusion Dermal Rejuvenation",
    description: "Patented 3-step ritual: deeply cleanse, extract impurities, and saturate skin with targeted peptides and hyaluronic hydration.",
  },
  {
    id: "mounir",
    name: "Mounir",
    origin: "Beirut & Paris",
    category: "hair",
    categoryLabel: "Hair Couture & Trichology",
    tagline: "Haute Balayage & Dramatic Transformations",
    description: "Celebrity-grade tone neutralization and seamless transition pigments developed for breathtaking, high-fashion color reveals.",
  },
];

const CATEGORIES = [
  { id: "all", label: "All Houses (10)" },
  { id: "hair", label: "Hair Couture & Trichology (8)" },
  { id: "skin", label: "Clinical Skincare (2)" },
];

export default function BrandPartners() {
  const [activeFilter, setActiveFilter] = useState("all");

  const filteredPartners =
    activeFilter === "all"
      ? PARTNERS
      : PARTNERS.filter((p) => p.category === activeFilter);

  return (
    <section id="partners" className="brand-partners" aria-labelledby="partners-title">
      <div className="editorial-container">
        {/* Editorial Header */}
        <header className="partners-header">
          <div className="partners-header__left">
            <span className="editorial-eyebrow">CURATED GLOBAL BRAND PORTFOLIO</span>
            <h2 id="partners-title" className="editorial-title">
              Partnering With The World’s<br />Leading Beauty Houses.
            </h2>
          </div>
          <div className="partners-header__right">
            <p className="partners-quote">
              “To establish a salon that blends artistry, expertise, and world-class products under one roof.”
            </p>
            <span className="partners-quote-author">
              — The Marvelous Founding Mission · Est. 1998
            </span>
          </div>
        </header>

        {/* Filter Bar */}
        <div className="partners-filter" role="tablist" aria-label="Brand category filters">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              role="tab"
              aria-selected={activeFilter === cat.id}
              className={`partners-filter__btn ${
                activeFilter === cat.id ? "partners-filter__btn--active" : ""
              }`}
              onClick={() => setActiveFilter(cat.id)}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Brand Grid */}
        <div className="partners-grid">
          {filteredPartners.map((item, index) => (
            <article className="partner-card" key={item.id}>
              <div className="partner-card__header">
                <span className="partner-card__index">
                  0{index + 1}
                </span>
                <span className="partner-card__category">
                  {item.categoryLabel}
                </span>
              </div>
              <div className="partner-card__body">
                <h3 className="partner-card__name">{item.name}</h3>
                <span className="partner-card__origin">{item.origin}</span>
                <p className="partner-card__tagline">{item.tagline}</p>
                <p className="partner-card__desc">{item.description}</p>
              </div>
              <div className="partner-card__footer">
                <span className="partner-card__status">In-Salon Formulation</span>
                <span className="partner-card__dot" aria-hidden="true">✦</span>
              </div>
            </article>
          ))}
        </div>

        {/* Editorial Note on Global Portfolio */}
        <div className="partners-note">
          <span className="partners-note__badge">OFFICIAL ATELIER STOCKIST</span>
          <p className="partners-note__text">
            Every ritual at Marvelous Salon & Academy utilizes authentic, certified formulations directly sourced from our authorized international partners.
          </p>
        </div>
      </div>
    </section>
  );
}
