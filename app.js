(() => {
  const deck = document.querySelector('.deck');
  const tracks = [...document.querySelectorAll('.track')];
  const imgs = document.querySelectorAll('.stage-img');
  const title = document.getElementById('stage-title');
  const kicker = document.getElementById('stage-kicker');
  const stageDesc = document.getElementById('stage-desc');
  const about = document.getElementById('about');
  const aboutBtn = document.querySelector('.nav-btn[data-view="about"]');
  const tabs = [...document.querySelectorAll('.tab')];
  let layer = 0;
  let current = 0;
  stageDesc.textContent = tracks[0].querySelector('.track-desc').textContent;

  // wrap description text so the 0fr → 1fr height animation works
  document.querySelectorAll('.track-desc').forEach(p => {
    const span = document.createElement('span');
    span.textContent = p.textContent;
    p.textContent = '';
    p.appendChild(span);
  });

  // preload stage photos once the first paint is done
  const preload = () => tracks.forEach(t => { const i = new Image(); i.src = t.querySelector('.track-btn').dataset.img; });
  if ('requestIdleCallback' in window) window.requestIdleCallback(preload); else setTimeout(preload, 1);

  function showStage(src) {
    const next = imgs[1 - layer];
    const prev = imgs[layer];
    if (next.getAttribute('src') === src) return;
    next.src = src;
    const swap = () => {
      next.classList.add('is-on');
      prev.classList.remove('is-on');
      layer = 1 - layer;
    };
    next.complete ? swap() : next.addEventListener('load', swap, { once: true });
  }

  function select(i, { focus = false } = {}) {
    i = (i + tracks.length) % tracks.length;
    if (i === current && tracks[i].classList.contains('is-current')) return;
    tracks.forEach((t, k) => {
      const on = k === i;
      t.classList.toggle('is-current', on);
      t.querySelector('.track-btn').setAttribute('aria-expanded', String(on));
    });
    current = i;
    const btn = tracks[i].querySelector('.track-btn');
    title.textContent = tracks[i].querySelector('.track-name').textContent;
    stageDesc.textContent = tracks[i].querySelector('.track-desc').textContent;
    showStage(btn.dataset.img);
    if (focus) btn.focus();
  }

  tracks.forEach((t, i) => {
    const btn = t.querySelector('.track-btn');
    btn.addEventListener('click', () => { setPanel('services'); select(i); });
    btn.addEventListener('keydown', e => {
      if (e.key === 'ArrowDown' || e.key === 'ArrowRight') { e.preventDefault(); select(i + 1, { focus: true }); }
      if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') { e.preventDefault(); select(i - 1, { focus: true }); }
    });
  });

  // About lives inside the stage; on desktop it's a toggle, on phones it's a tab
  function setAbout(on) {
    about.hidden = !on;
    deck.classList.toggle('is-about', on);
    aboutBtn.setAttribute('aria-pressed', String(on));
    kicker.textContent = on ? 'About' : 'Now playing';
    if (on) showStage('assets/stage-about.jpg');
    else showStage(tracks[current].querySelector('.track-btn').dataset.img);
  }
  aboutBtn.addEventListener('click', () => setAbout(about.hidden));
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && !about.hidden) setAbout(false); });

  function setPanel(name) {
    deck.dataset.panel = name;
    tabs.forEach(t => {
      const on = t.dataset.panel === name;
      t.classList.toggle('is-on', on);
      t.setAttribute('aria-pressed', String(on));
    });
    if (window.matchMedia('(max-width: 767px)').matches) setAbout(name === 'about');
  }
  tabs.forEach(t => t.addEventListener('click', () => setPanel(t.dataset.panel)));

  // keep state coherent if the window crosses the phone breakpoint
  window.matchMedia('(max-width: 767px)').addEventListener('change', e => {
    if (!e.matches) { if (deck.dataset.panel === 'about') setAbout(true); else setAbout(false); deck.dataset.panel = 'services'; }
    else setPanel(about.hidden ? 'services' : 'about');
  });
})();
