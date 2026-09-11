import { useEffect, useRef } from 'react';
import './brand-legacy.css';

const chapters = [
  ['30+', 'YEARS IN THE BUSINESS', 'Experience, beautifully earned.', 'Decades of craft. A lasting commitment to making every person feel their best.'],
  ['50K+', 'CLIENTS SERVED', 'So many stories. Always personal.', 'Over 50,000 clients served—and an individual behind every number.'],
  ['02', 'SALON OUTLETS', 'A growing world of Marvelous.', 'Two outlets, with more destinations on the horizon. Our story keeps moving forward.'],
  ['Academy', 'MARVELOUS SALON ACADEMY', 'The next generation starts here.', 'A place for aspiring artists to develop their craft and discover their own creative voice.'],
  ['Next', 'THE FRANCHISE CHAPTER', 'Our ambition is growing.', 'An upcoming franchise model opens a new chapter for entrepreneurs who want to build with Marvelous.'],
];

export default function BrandLegacy() {
  const root = useRef(null);
  useEffect(() => {
    const node = root.current;
    const cards = [...node.querySelectorAll('.legacy-chapter')];
    const reduced = matchMedia('(prefers-reduced-motion: reduce)');
    const compact = matchMedia('(max-width: 700px), (max-height: 700px)');
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
        card.setAttribute('aria-hidden', String(!compact.matches && !reduced.matches && !active));
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
  return <section id="legacy" className="brand-legacy" ref={root} aria-label="Marvelous in numbers and our next chapter">
    <div className="legacy-stage">
      <header className="legacy-header"><span>THE MARVELOUS STORY</span><p>Built on experience.<br/><em>Moving with ambition.</em></p><span>OUR LEGACY / OUR FUTURE</span></header>
      <div className="legacy-scenes">{chapters.map(([number, label, title, copy], index) => <article className={`legacy-chapter ${index === 0 ? 'legacy-active' : ''}`} key={label}>
        <div className={`legacy-number ${index > 2 ? 'legacy-word' : ''}`}>{number}</div><div className="legacy-caption"><span>{label}</span><h2>{title}</h2><p>{copy}</p></div><span className="legacy-edition" aria-hidden="true">0{index + 1} / 05</span>
      </article>)}</div>
      <footer className="legacy-footer"><span>EXPERIENCE</span><div className="legacy-track"><i /></div><span>THE NEXT CHAPTER</span></footer>
    </div>
  </section>;
}
