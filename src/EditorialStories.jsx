import { useEffect, useRef, useState } from "react";
import "./editorial-stories.css";

const looks = [
  { name: "Dimensional colour", image: "gallery-balayage.jpg", title: "Light, woven into every strand.", copy: "Soft ribbons of colour follow the natural movement of the hair. A considered balance of depth, brightness and an effortless finish.", label: "COLOUR STUDY / 01", alt: "Long dimensional balayage waves in a warm ivory salon" },
  { name: "Bridal artistry", image: "gallery-bridal.jpg", title: "A moment. Made entirely yours.", copy: "Sculpted texture, delicate detail and a silhouette that belongs with your look. Considered from the first consultation to the final pin.", label: "OCCASION STUDY / 02", alt: "Bridal updo with delicate gold floral hair accessories" },
  { name: "Scalp & care", image: "gallery-trichology.jpg", title: "Care is part of the craft.", copy: "A slower ritual with attention to the scalp, lengths and the way your hair feels. Make space for the foundation of your next great hair day.", label: "CARE STUDY / 03", alt: "A stylist carefully applying scalp oil in a warm treatment space" },
];
const care = [
  ["Before your visit", "Bring your hair story.", "Save the looks you love, tell us about your colour history, and share how you style your hair day to day. Your consultation starts with listening."],
  ["In the chair", "Make the details personal.", "Talk through shape, tone and maintenance with your artist. Together, refine the direction before the service begins, with room for questions along the way."],
  ["Between appointments", "Keep the feeling going.", "Ask your artist for a care routine suited to your service, texture and schedule. Thoughtful washing, styling and maintenance help your look stay considered."],
];

export default function EditorialStories() {
  const root = useRef(null);
  const [selected, setSelected] = useState(0);
  const [opened, setOpened] = useState(0);
  useEffect(() => {
    const node = root.current;
    const sections = [...node.querySelectorAll("[data-story-motion]")];
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    let frame = 0;
    const update = () => {
      frame = 0;
      sections.forEach(section => {
        const box = section.getBoundingClientRect();
        const progress = Math.max(0, Math.min(1, (innerHeight - box.top) / (innerHeight + box.height)));
        section.style.setProperty("--story-p", reduced.matches ? ".5" : progress.toFixed(4));
        const sticky = Math.max(0, Math.min(1, -box.top / Math.max(1, box.height - innerHeight)));
        section.style.setProperty("--story-sticky", reduced.matches ? "1" : sticky.toFixed(4));
      });
    };
    const schedule = () => { if (!frame) frame = requestAnimationFrame(update); };
    const observer = new IntersectionObserver(entries => entries.forEach(entry => entry.target.classList.toggle("story-in-view", entry.isIntersecting)), { threshold: .08 });
    sections.forEach(section => observer.observe(section));
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    reduced.addEventListener("change", schedule);
    update();
    return () => { cancelAnimationFrame(frame); observer.disconnect(); window.removeEventListener("scroll", schedule); window.removeEventListener("resize", schedule); reduced.removeEventListener("change", schedule); };
  }, []);
  return <div className="editorial-stories" ref={root}>
    <section id="lookbook" className="lookbook-story" data-story-motion aria-labelledby="lookbook-heading">
      <header className="story-heading"><span className="story-kicker">THE MARVELOUS EDIT</span><h2 id="lookbook-heading">Good hair.<br /><em>Extraordinary feeling.</em></h2><p>A study in texture, tone and the details that make a look your own.</p></header>
      <div className="lookbook-layout">
        <div className="lookbook-image-stage">
          {looks.map((look, index) => <img key={look.image} className={selected === index ? "look-image is-selected" : "look-image"} src={`/assets/${look.image}`} alt={selected === index ? look.alt : ""} aria-hidden={selected !== index} loading="lazy" />)}
        </div>
        <div className="lookbook-copy">
          <div className="lookbook-selector" aria-label="Explore salon looks">{looks.map((look, index) => <button type="button" key={look.name} aria-pressed={selected === index} onClick={() => setSelected(index)}><span>0{index + 1}</span>{look.name}<span aria-hidden="true">↗</span></button>)}</div>
          <div key={selected} className="lookbook-description" aria-live="polite"><span className="story-kicker">{looks[selected].label}</span><h3>{looks[selected].title}</h3><p>{looks[selected].copy}</p><a className="story-link" href="#booking">Discuss your look <span aria-hidden="true">↗</span></a></div>
          <p className="lookbook-footnote">Editorial inspiration. Your final look is tailored in consultation.</p>
        </div>
      </div>
    </section>

    <section id="bridal" className="bridal-story" data-story-motion aria-labelledby="bridal-heading">
      <div className="bridal-sticky">
        <div className="bridal-photo"><img src="/assets/gallery-bridal.jpg" alt="Elegant bridal hair with woven texture and gold floral pins" loading="lazy" /></div>
        <div className="bridal-copy"><span className="story-kicker">THE OCCASION ATELIER</span><h2 id="bridal-heading">For the moments<br />you keep <em>forever.</em></h2><p>Your dress. Your light. Your way of moving.<br />A complete beauty story, composed around you.</p><a href="#booking" className="story-link">Plan your bridal consultation <span aria-hidden="true">↗</span></a></div>
      </div>
    </section>

    <section id="care-notes" className="care-story" data-story-motion aria-labelledby="care-heading">
      <div className="care-art"><img src="/assets/gallery-trichology.jpg" alt="Precise scalp care with a golden oil dropper" loading="lazy" /><img className="care-art-inset" src="/assets/marvelous-follicle-botanical-2d.png" alt="Botanical illustration inspired by hair and scalp care" loading="lazy" /></div>
      <div className="care-copy"><span className="story-kicker">NOTES FROM THE ATELIER</span><h2 id="care-heading">Beautiful care.<br /><em>Beyond the chair.</em></h2><p className="care-intro">The experience begins before you arrive and continues long after you leave.</p><div className="care-accordion">{care.map(([label, title, copy], index) => <div className={`care-item ${opened === index ? "is-open" : ""}`} key={label}><h3><button aria-expanded={opened === index} aria-controls={`care-answer-${index}`} onClick={() => setOpened(opened === index ? -1 : index)} type="button"><span>0{index + 1}</span>{label}<span className="care-plus" aria-hidden="true">+</span></button></h3><div id={`care-answer-${index}`} className="care-answer" inert={opened !== index ? true : undefined}><div><h4>{title}</h4><p>{copy}</p></div></div></div>)}</div><a className="story-link" href="#studio">Find your starting point <span aria-hidden="true">↗</span></a></div>
    </section>
  </div>;
}
