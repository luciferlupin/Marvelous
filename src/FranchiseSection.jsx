import { useState } from "react";
import "./franchise.css";

const FORMATS = [
  {
    id: "salon",
    badge: "FLAGSHIP / FULL-SERVICE",
    title: "Marvelous Salon",
    subtitle: "The Ultimate Luxury Beauty Sanctuary",
    idealFor: "Prime Metropolitan Markets, Flagship High-Street Real Estate, Luxury Catchments",
    area: "1,100 – 4,000 sq. ft.",
    investment: "₹75 Lakhs – ₹1 Crore",
    fee: "₹20 Lakhs",
    royalty: "7%",
    features: [
      "Full spectrum: Hair Couture, Trichology, Aesthetic Skin, Bridal & Grooming Suites",
      "Private VIP Atelier Suites & VIP Wash Stations",
      "Expansive retail bar featuring international brand formulations",
      "High volume capacity with 12–25 styling chairs",
      "Dedicated Academy training and guest masterclasses",
    ],
    highlight: "Maximum Prestige & Comprehensive Revenue Streams",
  },
  {
    id: "studio",
    badge: "COMPACT / HIGH-EFFICIENCY",
    title: "Marvelous Studio",
    subtitle: "High-Velocity Boutique Coiffure & Express Care",
    idealFor: "Malls, Premium Commercial Complexes, Compact Markets, Tier 2 & Tier 3 Growth Cities",
    area: "500 – 1,100 sq. ft.",
    investment: "₹25 – ₹50 Lakhs",
    fee: "₹10 Lakhs",
    royalty: "5%",
    features: [
      "Streamlined high-demand menu: Precision Cuts, Balayage, Express Blowouts & Trichology",
      "Optimized footprint with 6–10 styling stations",
      "Faster buildout timeline and lower overhead costs",
      "Curated essential international retail display",
      "Standardized operational rhythms for rapid break-even",
    ],
    highlight: "Capital-Efficient Entry with Rapid Scalability",
  },
];

const PILLARS = [
  {
    number: "01",
    name: "Operations",
    subtitle: "Turnkey Salon Orchestration",
    points: [
      {
        title: "Comprehensive Standard Operating Procedures (SOPs)",
        desc: "Exhaustive step-by-step service manuals covering client intake, consultation protocols, and treatment delivery.",
      },
      {
        title: "Optimized Daily Workflows & Inventory Control",
        desc: "Real-time stock governance, automated re-ordering, and wastage minimization for maximum gross margin.",
      },
      {
        title: "Rigorous Quality Audits & Global Hygiene",
        desc: "Quarterly mystery audits, international sterilization standards, and verified client satisfaction indices.",
      },
    ],
  },
  {
    number: "02",
    name: "Marketing",
    subtitle: "High-Visibility Customer Acquisition",
    points: [
      {
        title: "Omnichannel Launch Campaigns & Local PR",
        desc: "Curated grand opening buzz, press coverage, and VIP invitation evenings in prime regional catchments.",
      },
      {
        title: "Hyper-Targeted Digital Advertising & Social Creatives",
        desc: "Continuous performance marketing, localized SEO, and high-conversion aesthetic Instagram campaigns.",
      },
      {
        title: "Celebrity & Regional Beauty Influencer Alliances",
        desc: "National PR backing, bridal trade shows, and brand-building activations driven by central leadership.",
      },
    ],
  },
  {
    number: "03",
    name: "Hiring & Training",
    subtitle: "Master-Grade Talent Pipeline",
    points: [
      {
        title: "End-to-End Senior Stylist & Colorist Recruitment",
        desc: "Screening, practical trade testing, and placement of experienced salon professionals.",
      },
      {
        title: "Continuous Marvelous Salon Academy Certification",
        desc: "Mandatory seasonal masterclasses in balayage chemistry, bridal couture, and trichological diagnostics.",
      },
      {
        title: "Luxury Hospitality & Consultation Etiquette",
        desc: "Elevated guest relations training ensuring every client experiences world-class white-glove service.",
      },
    ],
  },
  {
    number: "04",
    name: "Sales Framework",
    subtitle: "Maximizing Lifetime Client Value",
    points: [
      {
        title: "High-Retention Annual Membership Architectures",
        desc: "Predictable recurring monthly revenue through structured annual grooming and hair care subscriptions.",
      },
      {
        title: "Bespoke Bridal & Occasion Transformations",
        desc: "High-ticket bridal party packages, pre-wedding rituals, and seasonal event pricing systems.",
      },
      {
        title: "Curated Retail Upsell & Prescription Programs",
        desc: "Personalized take-home trichology regimens generating 18–25% incremental retail margins.",
      },
    ],
  },
  {
    number: "05",
    name: "Technology",
    subtitle: "Intelligent Real-Time Governance",
    points: [
      {
        title: "Enterprise Cloud CRM & Client Formula Vault",
        desc: "Digitized client color histories, scalp health records, and preferences synchronized across branches.",
      },
      {
        title: "Automated Billing, Staff Payouts & Compliance",
        desc: "Frictionless POS, automated stylist commissions, dynamic booking calendars, and full GST automation.",
      },
      {
        title: "Executive Analytics Dashboard",
        desc: "Real-time visibility into chair occupancy, revenue per hour, client return rates, and outlet profitability.",
      },
    ],
  },
];

const WHY_INVEST = [
  {
    number: "01",
    title: "Repeat Customers & Predictable Cash Flow",
    desc: "Clients visit salons every 3 to 6 weeks for cuts, maintenance color, and care. Annual memberships and curated packages create recurring, predictable revenue.",
    stat: "Every 3–6 Weeks",
    statLabel: "Average Client Visit Frequency",
  },
  {
    number: "02",
    title: "Essential & Non-Cyclical Demand",
    desc: "Haircuts, gray coverage, balayage, and clinical skincare are essential personal grooming needs that remain completely resilient across all economic cycles.",
    stat: "365 Days",
    statLabel: "Year-Round Consumer Essential",
  },
  {
    number: "03",
    title: "Multi-Season High-Ticket Spikes",
    desc: "Indian wedding seasons, festive celebrations (Diwali, Karwa Chauth), corporate galas, and pre-bridal transformations generate immense revenue surges.",
    stat: "High Margin",
    statLabel: "Bridal & Festive Spikes",
  },
  {
    number: "04",
    title: "Secular Shift to Branded Luxury",
    desc: "Consumers are rapidly departing unorganized local shops in favor of hygienic, certified, professionally trained luxury salon brands with transparent standards.",
    stat: "25+ Years",
    statLabel: "Established Brand Trust",
  },
];

export default function FranchiseSection() {
  const [selectedFormat, setSelectedFormat] = useState("salon");
  const [activePillar, setActivePillar] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    city: "",
    format: "Marvelous Salon (Flagship)",
    budget: "₹75 Lakhs - ₹1 Crore",
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  const whatsappMessage = encodeURIComponent(
    `Hello Marvelous Expansion Team! I am interested in franchise opportunities for ${formData.format} in ${formData.city || "my city"}. Name: ${formData.name || "Prospective Partner"}, Phone: ${formData.phone || "Direct"}.`
  );

  return (
    <section id="franchise" className="franchise-section" aria-labelledby="franchise-title">
      <div className="franchise-ambient-glow" aria-hidden="true" />
      <div className="editorial-container">
        {/* Header */}
        <header className="franchise-header">
          <span className="franchise-eyebrow">FRANCHISE & PARTNERSHIP EXPANSION</span>
          <h2 id="franchise-title" className="franchise-title">
            Own A Chapter In India’s<br />
            <span className="franchise-title__accent">Next Luxury Salon Legacy.</span>
          </h2>
          <p className="franchise-lead">
            Backed by 25+ years of operational excellence, world-class brand alliances, and a proven high-ROI framework. Partner with Marvelous Salon & Academy to build an enduring, profitable salon enterprise.
          </p>

          <div className="franchise-value-strip">
            <span className="franchise-value-item">✦ High Return On Investment</span>
            <span className="franchise-value-item">✦ 25+ Years Proven Track Record</span>
            <span className="franchise-value-item">✦ Turnkey 360° Support</span>
            <span className="franchise-value-item">✦ Established Bollywood Reputation</span>
          </div>
        </header>

        {/* Section 1: Formats Comparison */}
        <div className="franchise-formats-block">
          <div className="franchise-block-head">
            <span className="franchise-subhead">CHOOSE YOUR INVESTMENT MODEL</span>
            <h3 className="franchise-formats-title">Two Scalable Franchise Formats</h3>
            <p className="franchise-formats-desc">
              Tailored investment models engineered for prime flagship catchments or compact high-efficiency retail footfalls.
            </p>
          </div>

          <div className="franchise-cards-grid">
            {FORMATS.map((fmt) => (
              <article
                key={fmt.id}
                className={`format-card ${
                  selectedFormat === fmt.id ? "format-card--active" : ""
                }`}
                onClick={() => setSelectedFormat(fmt.id)}
              >
                <div className="format-card__sheen" aria-hidden="true" />
                <div className="format-card__top">
                  <span className="format-card__badge">{fmt.badge}</span>
                  <h4 className="format-card__name">{fmt.title}</h4>
                  <p className="format-card__sub">{fmt.subtitle}</p>
                </div>

                <div className="format-card__stats-grid">
                  <div className="format-stat-box">
                    <span className="format-stat-box__label">TOTAL INVESTMENT</span>
                    <strong className="format-stat-box__value">{fmt.investment}</strong>
                  </div>
                  <div className="format-stat-box">
                    <span className="format-stat-box__label">REQUIRED AREA</span>
                    <strong className="format-stat-box__value">{fmt.area}</strong>
                  </div>
                  <div className="format-stat-box">
                    <span className="format-stat-box__label">FRANCHISE FEE</span>
                    <strong className="format-stat-box__value">{fmt.fee}</strong>
                  </div>
                  <div className="format-stat-box">
                    <span className="format-stat-box__label">ROYALTY</span>
                    <strong className="format-stat-box__value">{fmt.royalty}</strong>
                  </div>
                </div>

                <div className="format-card__ideal">
                  <span className="format-card__ideal-label">PRIME CATCHMENTS</span>
                  <p className="format-card__ideal-text">{fmt.idealFor}</p>
                </div>

                <ul className="format-card__features">
                  {fmt.features.map((feat, idx) => (
                    <li key={idx} className="format-feature-item">
                      <span className="format-feature-bullet">✦</span>
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>

                <div className="format-card__action">
                  <button
                    type="button"
                    className="hero__cta-primary format-card__btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      setFormData((prev) => ({
                        ...prev,
                        format: fmt.title,
                        budget: fmt.investment,
                      }));
                      setIsModalOpen(true);
                    }}
                  >
                    <span>Enquire For {fmt.title}</span>
                    <span className="format-card__btn-arrow">→</span>
                  </button>
                </div>
              </article>
            ))}
          </div>
        </div>

        {/* Section 2: 5 Pillars of Support */}
        <div className="franchise-pillars-block">
          <div className="franchise-block-head">
            <span className="franchise-subhead">COMPLETE OPERATING SYSTEM</span>
            <h3 className="franchise-formats-title">5 Pillars of Franchise Support</h3>
            <p className="franchise-pillars-sub">
              Marvelous doesn’t just license its name — we deploy a comprehensive, turnkey operating ecosystem so our partners focus entirely on community leadership and expansion.
            </p>
          </div>

          <div className="pillars-layout">
            <div className="pillars-nav" role="tablist" aria-label="Franchise Support Pillars">
              {PILLARS.map((p, idx) => (
                <button
                  key={p.number}
                  role="tab"
                  aria-selected={activePillar === idx}
                  className={`pillar-tab ${activePillar === idx ? "pillar-tab--active" : ""}`}
                  onClick={() => setActivePillar(idx)}
                >
                  <span className="pillar-tab__num">{p.number}</span>
                  <span className="pillar-tab__name">{p.name}</span>
                </button>
              ))}
            </div>

            <div className="pillar-display" role="tabpanel">
              <span className="pillar-display__watermark" aria-hidden="true">
                {PILLARS[activePillar].number}
              </span>
              <div className="pillar-display__header">
                <div className="pillar-display__badge-row">
                  <span className="pillar-display__badge">
                    PILLAR {PILLARS[activePillar].number} · {PILLARS[activePillar].name.toUpperCase()}
                  </span>
                </div>
                <h4 className="pillar-display__title">
                  {PILLARS[activePillar].subtitle}
                </h4>
              </div>

              <div className="pillar-display__points-grid">
                {PILLARS[activePillar].points.map((pt, i) => (
                  <div key={i} className="pillar-point-card">
                    <div className="pillar-point-card__header">
                      <span className="pillar-point-icon">✦</span>
                      <h5 className="pillar-point-card__title">{pt.title}</h5>
                    </div>
                    <p className="pillar-point-card__desc">{pt.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Section 3: Why Invest in Beauty */}
        <div className="franchise-why-block">
          <div className="franchise-block-head">
            <span className="franchise-subhead">THE INVESTMENT CASE</span>
            <h3 className="franchise-formats-title">Why Invest In The Luxury Salon Industry</h3>
            <p className="franchise-why-lead">
              “Essential luxury, non-cyclical demand, and 365-day recurring cash flows.”
            </p>
          </div>

          <div className="why-grid">
            {WHY_INVEST.map((item, idx) => (
              <div className="why-card" key={idx}>
                <div className="why-card__top">
                  <span className="why-card__num">{item.number}</span>
                  <div className="why-card__stat-chip">
                    <span>{item.stat}</span>
                  </div>
                </div>
                <h4 className="why-card__title">{item.title}</h4>
                <p className="why-card__desc">{item.desc}</p>
                <div className="why-card__footer">
                  <span className="why-card__stat-label">{item.statLabel}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Banner CTA */}
        <div className="franchise-cta-banner">
          <div className="franchise-cta-content">
            <span className="franchise-cta-eyebrow">CONFIDENTIAL OPPORTUNITIES</span>
            <h3 className="franchise-cta-title">Ready To Build With Marvelous?</h3>
            <p className="franchise-cta-desc">
              Speak directly with our expansion leadership. Contact us via our official desk lines or prepare your confidential franchise application.
            </p>
            <div className="franchise-cta-contacts">
              <a href="tel:+919891110587" className="franchise-phone-link">
                <span>📞</span>
                <strong>+91 9891110587</strong>
              </a>
              <a href="tel:+918929121284" className="franchise-phone-link">
                <span>📞</span>
                <strong>+91 8929121284</strong>
              </a>
              <a
                href="https://instagram.com/Marvelous_Salon_Academy"
                target="_blank"
                rel="noreferrer"
                className="franchise-phone-link"
              >
                <span>📸</span>
                <strong>@Marvelous_Salon_Academy</strong>
              </a>
            </div>
          </div>
          <button
            type="button"
            className="hero__cta-primary franchise-btn-large"
            onClick={() => setIsModalOpen(true)}
          >
            <span>Submit Franchise Enquiry</span>
            <span>→</span>
          </button>
        </div>
      </div>

      {/* Modal / Drawer for Franchise Enquiry */}
      {isModalOpen && (
        <div className="franchise-modal-backdrop" onClick={() => setIsModalOpen(false)}>
          <div
            className="franchise-modal-dialog"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-title"
          >
            <button
              type="button"
              className="franchise-modal-close"
              onClick={() => setIsModalOpen(false)}
              aria-label="Close modal"
            >
              ✕
            </button>

            {!submitted ? (
              <>
                <div className="franchise-modal-header">
                  <span className="franchise-modal-eyebrow">OFFICIAL EXPANSION DESK</span>
                  <h3 id="modal-title" className="franchise-modal-title">
                    Franchise Enquiry Preparation
                  </h3>
                  <p className="franchise-modal-sub">
                    Please prepare your profile details. Our franchise director will review your catchment and connect within 24 hours.
                  </p>
                </div>

                <form className="franchise-form" onSubmit={handleSubmit}>
                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="franchise-name">Full Name *</label>
                      <input
                        id="franchise-name"
                        type="text"
                        required
                        placeholder="e.g. Rohini Sharma"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="franchise-phone">Phone / WhatsApp *</label>
                      <input
                        id="franchise-phone"
                        type="tel"
                        required
                        placeholder="+91 98765 43210"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="franchise-email">Email Address</label>
                      <input
                        id="franchise-email"
                        type="email"
                        placeholder="rohini@example.com"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="franchise-city">Target City / Locality *</label>
                      <input
                        id="franchise-city"
                        type="text"
                        required
                        placeholder="e.g. South Delhi / Gurgaon / Chandigarh"
                        value={formData.city}
                        onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="franchise-format">Preferred Format</label>
                      <select
                        id="franchise-format"
                        value={formData.format}
                        onChange={(e) => setFormData({ ...formData, format: e.target.value })}
                      >
                        <option value="Marvelous Salon (Flagship 1,100–4,000 sq ft)">
                          Marvelous Salon (Flagship: ₹75L – ₹1Cr)
                        </option>
                        <option value="Marvelous Studio (Compact 500–1,100 sq ft)">
                          Marvelous Studio (Compact: ₹25L – ₹50L)
                        </option>
                      </select>
                    </div>
                    <div className="form-group">
                      <label htmlFor="franchise-budget">Investment Readiness</label>
                      <select
                        id="franchise-budget"
                        value={formData.budget}
                        onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                      >
                        <option value="₹25 - ₹50 Lakhs">₹25 – ₹50 Lakhs</option>
                        <option value="₹50 - ₹75 Lakhs">₹50 – ₹75 Lakhs</option>
                        <option value="₹75 Lakhs - ₹1 Crore">₹75 Lakhs – ₹1 Crore</option>
                        <option value="₹1 Crore+ (Multi-Unit / City Master)">₹1 Crore+ (Master Franchise)</option>
                      </select>
                    </div>
                  </div>

                  <p className="franchise-form-notice">
                    Note: Enquiry preparation is client-side in this release. Submitting will generate a direct priority WhatsApp connection with our expansion desk.
                  </p>

                  <button type="submit" className="hero__cta-primary form-submit-btn">
                    Generate & Send Confidential Enquiry →
                  </button>
                </form>
              </>
            ) : (
              <div className="franchise-success">
                <div className="franchise-success__icon">✓</div>
                <h3>Enquiry Prepared Successfully</h3>
                <p>
                  Thank you, <strong>{formData.name || "Partner"}</strong>. Your enquiry for <strong>{formData.format}</strong> in <strong>{formData.city || "your catchment"}</strong> is ready to transmit directly to our expansion desk.
                </p>
                <div className="franchise-success-actions">
                  <a
                    href={`https://wa.me/919891110587?text=${whatsappMessage}`}
                    target="_blank"
                    rel="noreferrer"
                    className="hero__cta-primary"
                    style={{ textDecoration: "none", textAlign: "center" }}
                  >
                    💬 Connect Via WhatsApp Direct (+91 9891110587)
                  </a>
                  <a
                    href="tel:+918929121284"
                    className="hero__cta-secondary"
                    style={{ textDecoration: "none", textAlign: "center" }}
                  >
                    📞 Call Alternate Line (+91 8929121284)
                  </a>
                </div>
                <button
                  type="button"
                  className="franchise-reset-btn"
                  onClick={() => {
                    setSubmitted(false);
                    setIsModalOpen(false);
                  }}
                >
                  ← Close & Return
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </section>
  );
}
