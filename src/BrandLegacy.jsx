import { useEffect, useRef } from 'react';
import './brand-legacy.css';

const chapters = [
  ['1998', 'ESTABLISHED HERITAGE · 25+ YEARS', 'Bhavna & Avinash Pahwa.', 'Founded in 1998 with a singular mission: blending artistry, trichology, and luxury under one roof. Founder Bhavna Pahwa was honored as Business Person of the Year at the NIER National Excellence Awards.'],
  ['Icons', 'BOLLYWOOD’S CHOICE & NATIONAL HONORS', 'Celebrity-approved artistry.', 'A trusted sanctuary for iconic screen stars with national honors presented on stage by Bollywood legends Gulshan Grover, Mahima Chaudhary, Mukul Dev, Sudha Chandran, and Sana Khan.'],
  ['Next', 'TIMELESS CRAFT · NEW ENERGY', 'Ashna & Hridhan Pahwa.', 'Preserving the family’s established craftsmanship while pioneering modern techniques, academic expansion, and legal enterprise strategy.'],
  ['Academy', 'MARVELOUS SALON ACADEMY', 'Educating future masters.', 'A premier training institute empowering aspiring artists through rigorous technical discipline, live client clinics, and soft-skill mastery.'],
  ['Growth', 'TWO FRANCHISE FORMATS', 'Flagship Salon & Compact Studio.', 'Expanding nationwide with turnkey high-ROI formats: Marvelous Salon (₹75L–₹1Cr) and Marvelous Studio (₹25L–₹50L).'],
];

const CELEBRITIES = [
  { name: 'Gulshan Grover', role: 'Dazzling Star Award Presenter', img: '/assets/celebrities/ashna-gulshan-grover.jpg' },
  { name: 'Mahima Chaudhary', role: 'Glam India BRO Business Award', img: '/assets/celebrities/ashna-mahima-award.jpg' },
  { name: 'Mukul Dev', role: 'Alee National Excellence Award', img: '/assets/celebrities/bhavna-mukul-dev.jpg' },
  { name: 'Sana Khan', role: 'Red-Carpet Couture Muse', img: '/assets/celebrities/bhavna-sana-khan.jpg' },
  { name: 'Sudha Chandran', role: 'National Award-Winning Legend' },
  { name: 'Simran Kaur', role: 'Screen & Pageant Muse' },
];

export default function BrandLegacy() {
  const root = useRef(null);
  useEffect(() => {
    const node = root.current;
    const cards = [...node.querySelectorAll('.legacy-chapter')];
    const reduced = matchMedia('(prefers-reduced-motion: reduce)');
    let frame = 0, current = 0, target = 0;
    const tick = () => {
      current += (target - current) * .11;
      if (Math.abs(current - target) < .0005) current = target;
      node.style.setProperty('--legacy-progress', current);
      cards.forEach((card, index) => {
        const distance = current * 4 - index;
        card.style.setProperty('--distance', distance);
        const active = Math.abs(distance) <= .5;
        card.classList.toggle('legacy-active', active);
        card.setAttribute('aria-hidden', String(!reduced.matches && !active));
      });
      frame = current !== target ? requestAnimationFrame(tick) : 0;
    };
    const update = () => {
      const bounds = node.getBoundingClientRect();
      target = Math.max(0, Math.min(1, -bounds.top / Math.max(1, bounds.height - innerHeight)));
      if (!frame) frame = requestAnimationFrame(tick);
    };
    addEventListener('scroll', update, { passive: true });
    addEventListener('resize', update);
    reduced.addEventListener('change', update);
    update();
    return () => { cancelAnimationFrame(frame); removeEventListener('scroll', update); removeEventListener('resize', update); reduced.removeEventListener('change', update); };
  }, []);

  return (
    <section id="legacy" className="brand-legacy" ref={root} aria-label="Marvelous legacy and franchise expansion">
      <div className="legacy-stage">
        <header className="legacy-header">
          <span>THE MARVELOUS STORY</span>
          <p>
            Founded 1998.<br />
            <em>25+ Years of Trusted Expertise.</em>
          </p>
          <span>HERITAGE / FRANCHISE VISION</span>
        </header>
        <div className="legacy-scenes">
          {chapters.map(([number, label, title, copy], index) => (
            <article
              className={`legacy-chapter ${index === 0 ? 'legacy-active' : ''}`}
              key={label}
            >
              {index === 1 ? (
                <div className="legacy-icons-showcase" aria-label="Bollywood Film & Season Awards Stage Ensemble with Founders">
                  <div className="legacy-icons-card legacy-icons-card--stage">
                    <img
                      src="/assets/celebrities/celebrity-stage-ensemble.jpg"
                      alt="National Bollywood Film & Season Awards Gala: Gulshan Grover, Sana Khan, Mahima Chaudhary, Bhavna Pahwa, Simran Kaur"
                      className="legacy-icons-img"
                    />
                    <div className="legacy-icons-stage-badge">
                      <span>NATIONAL HONORS GALA</span>
                    </div>
                    <span className="legacy-icons-caption">
                      Gulshan Grover · Sana Khan · Mahima Chaudhary · Bhavna Pahwa · Simran Kaur
                    </span>
                  </div>
                  <div className="legacy-icons-card">
                    <img
                      src="/assets/celebrities/bhavna-mahima.jpg"
                      alt="Founder Bhavna Pahwa with Mahima Chaudhary"
                      className="legacy-icons-img"
                    />
                    <span className="legacy-icons-caption">Mahima Chaudhary · Bhavna Pahwa</span>
                  </div>
                  <div className="legacy-icons-card legacy-icons-card--secondary">
                    <img
                      src="/assets/celebrities/ashna-gulshan-grover.jpg"
                      alt="Managing Director Ashna Pahwa with Gulshan Grover"
                      className="legacy-icons-img"
                    />
                    <span className="legacy-icons-caption">Gulshan Grover · Ashna Pahwa</span>
                  </div>
                </div>
              ) : (
                <div className={`legacy-number ${index > 0 ? 'legacy-word' : ''}`}>
                  {number}
                </div>
              )}
              <div className="legacy-caption">
                <span>{label}</span>
                <h2>{title}</h2>
                <p>{copy}</p>
                {index === 1 && (
                  <a href="#gallery" className="legacy-icons-link">
                    Explore Celebrity Archive in Gallery →
                  </a>
                )}
              </div>
              <span className="legacy-edition" aria-hidden="true">
                0{index + 1} / 05
              </span>
            </article>
          ))}
        </div>
        <footer className="legacy-footer">
          <span>1998 FOUNDING</span>
          <div className="legacy-track"><i /></div>
          <span>NATIONWIDE EXPANSION</span>
        </footer>

        {/* Celebrity Client Bar with authentic avatars */}
        <div className="celebrity-bar" aria-label="Celebrity clientele">
          <span className="celebrity-bar__label">BOLLYWOOD CLIENT ARCHIVE:</span>
          <div className="celebrity-bar__names">
            {CELEBRITIES.map((c, i) => (
              <span key={c.name} className="celebrity-bar__item">
                {c.img && (
                  <img
                    src={c.img}
                    alt={c.name}
                    className="celebrity-bar__avatar"
                    loading="lazy"
                  />
                )}
                <span className="celebrity-bar__name">{c.name}</span>
                {i < CELEBRITIES.length - 1 && <span className="celebrity-bar__dot">✦</span>}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
