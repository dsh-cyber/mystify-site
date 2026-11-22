(() => {
  const body = document.body;
  // Mobile menu
  const btn = document.querySelector('.menu-btn');
  const nav = document.getElementById('nav');
  const setMenu = open => {
    nav.classList.toggle('open', open);
    body.classList.toggle('menu-open', open);
    btn.setAttribute('aria-expanded', String(open));
    btn.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
  };
  if (btn && nav) {
    btn.addEventListener('click', () => setMenu(!nav.classList.contains('open')));
    window.addEventListener('resize', () => { if (window.innerWidth > 1040) setMenu(false); });
  }
  // Dropdowns
  document.querySelectorAll('[data-dd]').forEach(b => {
    b.addEventListener('click', e => {
      e.stopPropagation();
      const li = b.parentElement, open = !li.classList.contains('open');
      document.querySelectorAll('.nav li.open').forEach(x => { if (x !== li) { x.classList.remove('open'); x.querySelector('[data-dd]')?.setAttribute('aria-expanded', 'false'); } });
      li.classList.toggle('open', open);
      b.setAttribute('aria-expanded', String(open));
    });
  });
  document.addEventListener('click', e => {
    if (!e.target.closest('.nav')) document.querySelectorAll('.nav li.open').forEach(x => { x.classList.remove('open'); x.querySelector('[data-dd]')?.setAttribute('aria-expanded', 'false'); });
  });
  document.addEventListener('keydown', e => {
    if (e.key !== 'Escape') return;
    document.querySelectorAll('.nav li.open').forEach(x => x.classList.remove('open'));
    if (nav?.classList.contains('open')) { setMenu(false); btn.focus(); }
  });
  // Reveal
  const rv = document.querySelectorAll('.rv');
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver(es => es.forEach(en => { if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); } }), { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
    rv.forEach(el => io.observe(el));
  } else rv.forEach(el => el.classList.add('in'));
  // Mystify Studios neon logo: ignite when scrolled into view
  const neons = document.querySelectorAll('.neon');
  if (neons.length && !matchMedia('(prefers-reduced-motion: reduce)').matches && 'IntersectionObserver' in window) {
    neons.forEach(n => n.classList.add('arm'));
    const nio = new IntersectionObserver(es => es.forEach(en => { if (en.isIntersecting) { en.target.classList.add('lit'); nio.unobserve(en.target); } }), { threshold: 0.4 });
    neons.forEach(n => nio.observe(n));
  }
  // Carousels
  document.querySelectorAll('[data-car]').forEach(b => {
    b.addEventListener('click', () => {
      const track = b.closest('section')?.querySelector('.car__track');
      if (!track) return;
      const card = track.firstElementChild;
      const step = card ? card.getBoundingClientRect().width + 16 : track.clientWidth * 0.8;
      track.scrollBy({ left: b.dataset.car === 'next' ? step : -step, behavior: 'smooth' });
    });
  });
  // Media filters
  const fb = document.querySelectorAll('[data-filter]');
  fb.forEach(b => b.addEventListener('click', () => {
    const f = b.dataset.filter;
    fb.forEach(x => x.setAttribute('aria-pressed', String(x === b)));
    document.querySelectorAll('.press li[data-cat]').forEach(li => { li.hidden = !(f === 'All' || li.dataset.cat === f); });
  }));
  // Contact form → mailto
  const form = document.getElementById('cform');
  if (form) form.addEventListener('submit', e => {
    e.preventDefault();
    let ok = true;
    form.querySelectorAll('[required]').forEach(el => {
      const bad = !el.value.trim() || (el.type === 'email' && !/^\S+@\S+\.\S+$/.test(el.value));
      el.setAttribute('aria-invalid', String(bad));
      if (bad && ok) { el.focus(); ok = false; }
    });
    if (!ok) return;
    const d = new FormData(form);
    const subject = `${d.get('topic')} enquiry from ${d.get('name')}`;
    const bodyTxt = `${d.get('message')}\n\n${d.get('name')}\n${d.get('email')}`;
    window.location.href = `mailto:hello@mystify.inc?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(bodyTxt)}`;
    form.classList.add('sent');
  });

  // Manuscript form → mailto
  const mf = document.getElementById('mform');
  if (mf) mf.addEventListener('submit', e => {
    e.preventDefault();
    let ok = true;
    mf.querySelectorAll('[required]').forEach(el => {
      const bad = el.type === 'checkbox' ? !el.checked : (!el.value.trim() || (el.type === 'email' && !/^\S+@\S+\.\S+$/.test(el.value)));
      el.setAttribute('aria-invalid', String(bad));
      if (bad && ok) { el.focus(); ok = false; }
    });
    if (!ok) return;
    const d = new FormData(mf), g = k => (d.get(k) || '').toString().trim() || 'Not provided';
    const subject = `Mystify Publishing manuscript submission: ${g('title')} by ${g('name')}`;
    const bodyTxt = `MANUSCRIPT SUBMISSION\n\nWorking title: ${g('title')}\nAuthor: ${g('name')}\nEmail: ${g('email')}\nCategory: ${g('category')}\nStatus: ${g('stage')}\nWord count: ${g('words')}\nLiterary agent: ${g('agent')}\nSample or manuscript link: ${g('link')}\n\nSYNOPSIS\n${g('synopsis')}\n\nAUTHOR BIO\n${g('bio')}\n\nThe author confirms this is their original work and they hold the rights to submit it.`;
    window.location.href = `mailto:hello@mystify.inc?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(bodyTxt)}`;
    mf.classList.add('sent');
  });
})();
/* homepage hero: crossfade portraits */
document.querySelectorAll('[data-rotate]').forEach((t,ti)=>{if(matchMedia('(prefers-reduced-motion: reduce)').matches)return;
const slots=[...t.querySelectorAll('.hx-rot')];let i=0;
setInterval(()=>{const f=slots[i%slots.length];const imgs=[...f.querySelectorAll('img')];const cur=imgs.findIndex(x=>x.classList.contains('is-on'));const nx=(cur+1)%imgs.length;
imgs[cur].classList.remove('is-on');imgs[cur].setAttribute('aria-hidden','true');imgs[nx].classList.add('is-on');imgs[nx].removeAttribute('aria-hidden');i++;},2000+ti*400);});
/* latest-stories ticker */
(function(){const t=document.querySelector('.tkr');if(!t)return;
const ago=d=>{const m=Math.max(1,Math.round((Date.now()-new Date(d))/60000));if(m<60)return m+'m ago';const h=Math.round(m/60);if(h<24)return h+'h ago';const dd=Math.round(h/24);return dd+'d ago';};
const upd=()=>t.querySelectorAll('[data-ago]').forEach(e=>e.textContent=ago(e.getAttribute('datetime')));upd();setInterval(upd,60000);
const b=t.querySelector('.tkr__pause');b.addEventListener('click',()=>{const p=t.classList.toggle('is-paused');b.setAttribute('aria-pressed',p);b.setAttribute('aria-label',p?'Play ticker':'Pause ticker');});})();
