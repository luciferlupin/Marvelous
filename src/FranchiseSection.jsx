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
    tagline: "Turnkey Salon Orchestration",
    points: [
      "Standard Operating Procedures (SOPs) for every client touchpoint",
      "Optimized daily salon workflows and inventory management",
      "Rigorous quality audits and global hygiene protocols",
    ],
  },
  {
    number: "02",
    name: "Marketing",
    tagline: "High-Visibility Customer Acquisition",
    points: [
      "Omnichannel grand opening campaigns & local PR buzz",
      "Hyper-targeted digital ads, social media creatives & SEO",
      "Celebrity and regional beauty influencer collaborations",
    ],
  },
  {
    number: "03",
    name: "Hiring & Training",
    tagline: "Master-Grade Talent Pipeline",
    points: [
      "Complete recruitment support for master stylists and colorists",
      "Continuous technical training through Marvelous Salon Academy",
      "Soft-skills, luxury hospitality etiquette, and consultation mastery",
    ],
  },
  {
    number: "04",
    name: "Sales Framework",
    tagline: "Maximizing Lifetime Client Value",
    points: [
      "High-retention annual membership & bridal package architectures",
      "Service upsell and bespoke trichology recommendation systems",
      "Tiered loyalty programs driving recurring monthly appointments",
    ],
  },
  {
    number: "05",
    name: "Technology",
    tagline: "Intelligent Real-Time Governance",
    points: [
      "Enterprise Cloud CRM for client history and personalized formulas",
      "Automated billing, inventory reordering, and GST compliance",
      "Real-time analytics dashboard for revenue, margins, and chair occupancy",
    ],
  },
];

const WHY_INVEST = [
  {
    title: "Repeat Customers = Steady Income",
    desc: "Clients visit salons every 3 to 6 weeks for cuts, maintenance color, and care. Annual memberships and curated packages create predictable monthly cash flows.",
  },
  {
    title: "People Never Stop Grooming",
    desc: "Haircuts, gray coverage, balayage, and clinical skincare are essential personal needs that remain resilient across all economic cycles.",
  },
  {
    title: "Business That Runs All Year",
    desc: "Indian bridal seasons, festive celebrations (Diwali, Karwa Chauth), corporate galas, and daily grooming generate consistent, year-round revenue.",
  },
  {
    title: "Shift Towards Branded Salons",
    desc: "Consumers are rapidly departing unorganized local shops in favor of hygienic, certified, professionally trained salon brands with transparent standards.",
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
      <div className="editorial-container">
        {/* Header */}
        <header className="franchise-header">
          <span className="editorial-eyebrow">FRANCHISE & PARTNERSHIP EXPANSION</span>
          <h2 id="franchise-title" className="editorial-title">
            Own A Chapter In India’s<br />Next Luxury Salon Legacy.
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
            <span className="franchise-subhead">CHOOSE YOUR GROWTH MODEL</span>
            <h3 className="franchise-formats-title">Two Scalable Franchise Formats</h3>
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
                <div className="format-card__badge">{fmt.badge}</div>
                <h4 className="format-card__name">{fmt.title}</h4>
                <p className="format-card__sub">{fmt.subtitle}</p>

                <div className="format-card__stats">
                  <div className="format-stat">
                    <span className="format-stat__label">Total Investment</span>
                    <span className="format-stat__value">{fmt.investment}</span>
                  </div>
                  <div className="format-stat">
                    <span className="format-stat__label">Required Area</span>
                    <span className="format-stat__value">{fmt.area}</span>
                  </div>
                  <div className="format-stat">
                    <span className="format-stat__label">Franchise Fee</span>
                    <span className="format-stat__value">{fmt.fee}</span>
                  </div>
                  <div className="format-stat">
                    <span className="format-stat__label">Royalty</span>
                    <span className="format-stat__value">{fmt.royalty}</span>
                  </div>
                </div>

                <div className="format-card__ideal">
                  <strong>Ideal Location:</strong> {fmt.idealFor}
                </div>

                <ul className="format-card__features">
                  {fmt.features.map((feat, idx) => (
                    <li key={idx}>
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
                    Enquire for {fmt.title} →
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
              <div className="pillar-display__header">
                <span className="pillar-display__badge">
                  PILLAR {PILLARS[activePillar].number}
                </span>
                <h4 className="pillar-display__title">
                  {PILLARS[activePillar].name}
                </h4>
                <p className="pillar-display__tagline">
                  {PILLARS[activePillar].tagline}
                </p>
              </div>
              <ul className="pillar-display__list">
                {PILLARS[activePillar].points.map((pt, i) => (
                  <li key={i} className="pillar-point-item">
                    <span className="pillar-point-icon">✓</span>
                    <span>{pt}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Section 3: Why Invest in Beauty */}
        <div className="franchise-why-block">
          <div className="franchise-block-head">
            <span className="franchise-subhead">THE BUSINESS CASE</span>
            <h3 className="franchise-formats-title">Why Invest In The Beauty & Salon Industry</h3>
            <p className="franchise-why-lead">
              “What we handle, so you can focus on growth.”
            </p>
          </div>

          <div className="why-grid">
            {WHY_INVEST.map((item, idx) => (
              <div className="why-card" key={idx}>
                <span className="why-card__num">0{idx + 1}</span>
                <h4 className="why-card__title">{item.title}</h4>
                <p className="why-card__desc">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Banner CTA */}
        <div className="franchise-cta-banner">
          <div className="franchise-cta-content">
            <span className="editorial-eyebrow">CONFIDENTIAL OPPORTUNITIES</span>
            <h3>Ready To Build With Marvelous?</h3>
            <p>
              Speak directly with our expansion leadership. Contact us via our official desk lines or prepare your confidential enquiry.
            </p>
            <div className="franchise-cta-contacts">
              <a href="tel:+919891110587" className="franchise-phone-link">
                📞 +91 9891110587
              </a>
              <a href="tel:+918929121284" className="franchise-phone-link">
                📞 +91 8929121284
              </a>
              <a
                href="https://instagram.com/Marvelous_Salon_Academy"
                target="_blank"
                rel="noreferrer"
                className="franchise-phone-link"
              >
                📸 @Marvelous_Salon_Academy
              </a>
            </div>
          </div>
          <button
            type="button"
            className="hero__cta-primary franchise-btn-large"
            onClick={() => setIsModalOpen(true)}
          >
            Submit Franchise Enquiry →
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
                <span className="editorial-eyebrow">DIRECT INVESTOR ENQUIRY</span>
                <h3 id="modal-title" className="franchise-modal-title">
                  Partner With Marvelous
                </h3>
                <p className="franchise-modal-sub">
                  Fill in your details below to stage your franchise application with our expansion leadership.
                </p>

                <form onSubmit={handleSubmit} className="franchise-form">
                  <div className="form-group">
                    <label htmlFor="franchise-name">Full Name *</label>
                    <input
                      id="franchise-name"
                      type="text"
                      required
                      placeholder="e.g. Rajesh Malhotra"
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                    />
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="franchise-phone">Phone / WhatsApp *</label>
                      <input
                        id="franchise-phone"
                        type="tel"
                        required
                        placeholder="+91 98..."
                        value={formData.phone}
                        onChange={(e) =>
                          setFormData({ ...formData, phone: e.target.value })
                        }
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="franchise-email">Email Address</label>
                      <input
                        id="franchise-email"
                        type="email"
                        placeholder="rajesh@example.com"
                        value={formData.email}
                        onChange={(e) =>
                          setFormData({ ...formData, email: e.target.value })
                        }
                      />
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="franchise-city">Target City / Location *</label>
                      <input
                        id="franchise-city"
                        type="text"
                        required
                        placeholder="e.g. Pitampura, Chandigarh, Jaipur"
                        value={formData.city}
                        onChange={(e) =>
                          setFormData({ ...formData, city: e.target.value })
                        }
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="franchise-format">Preferred Format</label>
                      <select
                        id="franchise-format"
                        value={formData.format}
                        onChange={(e) =>
                          setFormData({ ...formData, format: e.target.value })
                        }
                      >
                        <option value="Marvelous Salon (Flagship)">
                          Marvelous Salon — Flagship (₹75L - ₹1Cr)
                        </option>
                        <option value="Marvelous Studio (Compact)">
                          Marvelous Studio — Compact (₹25L - ₹50L)
                        </option>
                      </select>
                    </div>
                  </div>

                  <div className="franchise-form-notice">
                    <small>
                      ℹ Preparation Mode: Direct WhatsApp link and phone contact will be initiated upon review.
                    </small>
                  </div>

                  <button type="submit" className="hero__cta-primary form-submit-btn">
                    Confirm & Prepare Application
                  </button>
                </form>
              </>
            ) : (
              <div className="franchise-success">
                <span className="franchise-success__icon">✓</span>
                <h3>Application Staged Successfully</h3>
                <p>
                  Thank you, <strong>{formData.name}</strong>. Your enquiry for{" "}
                  <strong>{formData.format}</strong> in <strong>{formData.city}</strong> is prepared.
                </p>
                <div className="franchise-success-actions">
                  <a
                    href={`https://wa.me/919891110587?text=${whatsappMessage}`}
                    target="_blank"
                    rel="noreferrer"
                    className="hero__cta-primary"
                  >
                    Transmit via WhatsApp 💬
                  </a>
                  <a href="tel:+919891110587" className="hero__cta-secondary">
                    Call Desk (+91 9891110587) 📞
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
                  Close Window
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </section>
  );
}
