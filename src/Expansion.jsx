import {useState, useEffect, useRef} from 'react';
import './expansion.css';
import './roadmap-motion.css';
const places=[['Ashok Vihar','NOW OPEN','Our story begins here. The established home of the Marvelous experience.','OPEN'],['Model Town','OPENING 22 SEPTEMBER','A new address. The same attention to every detail. Our next chapter opens on 22 September.','22 / SEP'],['Pitampura','COMING SOON','The next neighbourhood in our growing story. Opening details will be announced here.','SOON'],['Punjabi Bagh','COMING SOON','Another Marvelous destination is on its way. More location and opening details to follow.','SOON']];
export default function Expansion(){const [active,setActive]=useState(1);const [open,setOpen]=useState(false);const [brief,setBrief]=useState('');const roadmap = useRef(null);
useEffect(() => {
  const node = roadmap.current;
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const compact = matchMedia('(max-width: 700px), (max-height: 700px)');
  let frame = 0, current = 0, target = 0, chapter = -1;
  const clamp = value => Math.max(0, Math.min(1, value));
  const tick = () => {
    current += (target - current) * .12;
    if (Math.abs(target - current) < .0005) current = target;
    node.style.setProperty('--road-p', current.toFixed(4));
    node.querySelectorAll('.exp-rail button').forEach((button, index) => {
      button.style.setProperty('--stop-p', clamp(current * 4.2 - index * .75 + .45).toFixed(4));
    });
    const nextChapter = Math.min(3, Math.floor(current * 4));
    if (!reduced.matches && !compact.matches && nextChapter !== chapter) {
      chapter = nextChapter;
      setActive(nextChapter);
    }
    frame = current !== target ? requestAnimationFrame(tick) : 0;
  };
  const update = () => {
    const rect = node.getBoundingClientRect();
    target = reduced.matches ? 1 : compact.matches
      ? clamp((innerHeight - rect.top) / (rect.height + innerHeight))
      : clamp(-rect.top / Math.max(1, rect.height - innerHeight));
    if (!frame) frame = requestAnimationFrame(tick);
  };
  addEventListener('scroll', update, {passive:true});
  addEventListener('resize', update);
  reduced.addEventListener('change', update);
  update();
  return () => {cancelAnimationFrame(frame);removeEventListener('scroll', update);removeEventListener('resize', update);reduced.removeEventListener('change', update);};
}, []);
return <>
<div className="roadmap-scroll" ref={roadmap} id="destinations">
<section className="expansion"><span className="exp-kicker">THE MARVELOUS ROADMAP / OUR GROWING WORLD</span><h2>New addresses.<br/><em>One unmistakable feeling.</em></h2><p className="exp-intro">Rooted in Ashok Vihar. Arriving in Model Town.<br/>And already imagining what comes next.</p><div className="exp-rail">{places.map((p,i)=><button key={p[0]} type="button" aria-pressed={active===i} onClick={()=>setActive(i)}><span className="exp-index">0{i+1}</span><span className="exp-dot" aria-hidden="true"/><small>{p[1]}</small><strong>{p[0]}</strong><span className="exp-explore">Explore this chapter ↗</span></button>)}</div><div className="exp-detail" key={active} aria-live="polite"><div><span className="exp-kicker">CHAPTER 0{active+1} / {places[active][1]}</span><h3>{places[active][0]}</h3><p>{places[active][2]}</p></div><div className="exp-stamp">{places[active][3]}<small>{active===1?'THE NEXT OPENING':'MARVELOUS SALON'}</small></div></div><div className="exp-footer"><span>01 OPEN</span><span>01 OPENING THIS SEPTEMBER</span><span>02 COMING SOON</span></div><div className="roadmap-meter" aria-hidden="true"><span>THE JOURNEY CONTINUES</span><i /></div></section></div>
<section className="franchise" id="franchise"><div className="franchise-image"><img src="/assets/marvelous-salon-hero.png" alt="Warm architectural salon interior illustrating the Marvelous atmosphere" loading="lazy"/><div><span className="exp-kicker">THE MARVELOUS WORLD</span><p>Your ambition.<br/><em>Our next chapter.</em></p></div></div><div className="franchise-content"><span className="exp-kicker">FRANCHISE OPPORTUNITIES / NOW AVAILABLE</span><h2>Bring Marvelous<br/>to <em>your city.</em></h2><p>For entrepreneurs who see beauty as a business worth building. Explore the opportunity to become part of the Marvelous Salon story.</p><ol><li><strong>Introduce yourself</strong><span>Share your vision and preferred location.</span></li><li><strong>Explore the fit</strong><span>Discuss the format, investment and opportunity.</span></li><li><strong>Shape the next chapter</strong><span>Agree the details directly with the team.</span></li></ol><button className="franchise-button" type="button" aria-expanded={open} aria-controls="franchise-enquiry" onClick={()=>setOpen(!open)}>Start your franchise enquiry <span>↗</span></button>{open&&<form id="franchise-enquiry" onSubmit={e=>{e.preventDefault();const d=new FormData(e.currentTarget);setBrief(`Marvelous Salon franchise enquiry\nName: ${d.get('name')}\nContact: ${d.get('contact')}\nCity / area: ${d.get('city')}\nVision: ${d.get('vision')}`)}}><p>Prepare an introduction to copy and share with the team. This form does not send your details.</p><label>Your name<input name="name" required autoComplete="name"/></label><label>Email or phone<input name="contact" required/></label><label>Preferred city / area<input name="city" required/></label><label>Your vision<textarea name="vision" rows="2"/></label><button className="franchise-button" type="submit">Prepare my enquiry ↗</button>{brief&&<label aria-live="polite">Ready to copy — not submitted<textarea readOnly rows="7" value={brief} onFocus={e=>e.target.select()}/></label>}</form>}</div></section></>}
