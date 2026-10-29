(() => {
  const field = document.getElementById('field');
  const layers = [...field.querySelectorAll('.layer')];
  const tray = document.getElementById('tray');
  const panels = [...tray.querySelectorAll('.panel')];
  const tabs = [...document.querySelectorAll('.console .tab')];
  const statement = document.getElementById('statement');
  const moreBtn = document.getElementById('statement-more');
  const npText = document.getElementById('np-text');
  const cursor = document.getElementById('cursor');
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const phone = () => window.matchMedia('(max-width: 767px)').matches;
  const store = { get: k => { try { return localStorage.getItem(k); } catch (e) { return null; } }, set: (k, v) => { try { localStorage.setItem(k, v); } catch (e) {} } };

  /* ---------- copy, in both languages ---------- */
  const I18N = {
    en: {
      lead: 'believes music is more than background: it’s identity, emotion, and experience. With a reputation for refined taste and creative precision, we specialize in bespoke music curation for brands, spaces, and moments that demand distinction',
      rest1: 'Our work has earned the trust of leading names across fashion, design, hospitality, and media, bringing together culture, nuance, and sound in perfect harmony.',
      rest2: 'Sonic branding and identity, curated playlists for spaces and brands, music direction for events, music supervision for film, fashion and content, and sound strategy.',
      inquiries: 'For inquiries:', phone: 'Phone and WhatsApp:',
      services: 'Services', clients: 'Clients', contact: 'Contact',
      np: 'Now playing', tagline: 'Curated sound. Elevated atmosphere.',
      dark: 'Dark', light: 'Light',
      start: 'Start a conversation', sectors: 'Fashion, design, hospitality and media.',
      's.sonic': 'Sonic Branding & Identity',
      's.sonic.text': 'We collaborate with forward-thinking brands to craft a unique and lasting audio signature. From subtle ambient moods to bold musical statements, our sonic branding is tailored to express your essence across all touchpoints: physical, digital, and experiential.',
      's.consult': 'Creative Consultation & Sound Strategy',
      's.consult.text': 'Need a fresh perspective on your brand’s musical voice? We offer sound strategy sessions and ongoing consultation to guide internal teams or provide external expertise. From one-off audits to long-term collaboration, we help refine your auditory presence.',
      's.playlists': 'Curated Playlists for Spaces & Brands',
      's.playlists.text': 'Custom playlists designed to enhance atmosphere and support brand storytelling. Whether it’s a concept store in Paris, a gallery opening in Berlin, or a luxury retreat in the Mediterranean, we curate music that speaks your language and elevates every moment.',
      's.events': 'Music Direction for Events',
      's.events.text': 'From runway shows and product launches to private gatherings and exhibitions, Low Pitch Orchestra provides full-spectrum music direction. Every track is selected with intention, shaping the emotional arc of the event and creating an immersive, memorable experience.',
      's.supervision': 'Music Supervision for Film, Fashion & Content',
      's.supervision.text': 'We source and license music for campaigns, short films, and branded content, balancing mood, narrative, and originality. Our supervision ensures seamless integration and emotional resonance, working hand-in-hand with directors, editors, and producers.',
      about: 'Low Pitch Orchestra',
    },
    es: {
      lead: 'cree que la música es más que un fondo: es identidad, emoción y experiencia. Con una reputación de gusto refinado y precisión creativa, nos especializamos en curaduría musical a la medida para marcas, espacios y momentos que exigen distinción',
      rest1: 'Nuestro trabajo se ha ganado la confianza de nombres líderes en moda, diseño, hospitalidad y medios, reuniendo cultura, matiz y sonido en perfecta armonía.',
      rest2: 'Identidad y branding sonoro, playlists curadas para espacios y marcas, dirección musical para eventos, supervisión musical para cine, moda y contenido, y estrategia de sonido.',
      inquiries: 'Para consultas:', phone: 'Teléfono y WhatsApp:',
      services: 'Servicios', clients: 'Clientes', contact: 'Contacto',
      np: 'Suena ahora', tagline: 'Sonido curado. Atmósfera elevada.',
      dark: 'Oscuro', light: 'Claro',
      start: 'Empecemos una conversación', sectors: 'Moda, diseño, hospitalidad y medios.',
      's.sonic': 'Identidad y branding sonoro',
      's.sonic.text': 'Colaboramos con marcas visionarias para crear una firma sonora única y duradera. De atmósferas sutiles a declaraciones musicales contundentes, nuestro branding sonoro se diseña para expresar tu esencia en todos los puntos de contacto: físicos, digitales y experienciales.',
      's.consult': 'Consultoría creativa y estrategia de sonido',
      's.consult.text': '¿Necesitas una mirada fresca sobre la voz musical de tu marca? Ofrecemos sesiones de estrategia de sonido y acompañamiento continuo para guiar equipos internos o aportar experiencia externa. De auditorías puntuales a colaboraciones de largo plazo, ayudamos a refinar tu presencia sonora.',
      's.playlists': 'Playlists curadas para espacios y marcas',
      's.playlists.text': 'Playlists a la medida, diseñadas para realzar la atmósfera y sostener la narrativa de la marca. Sea una concept store en París, la inauguración de una galería en Berlín o un retiro de lujo en el Mediterráneo, curamos música que habla tu idioma y eleva cada momento.',
      's.events': 'Dirección musical para eventos',
      's.events.text': 'De pasarelas y lanzamientos de producto a reuniones privadas y exposiciones, Low Pitch Orchestra ofrece dirección musical integral. Cada pista se elige con intención, dando forma al arco emocional del evento y creando una experiencia inmersiva y memorable.',
      's.supervision': 'Supervisión musical para cine, moda y contenido',
      's.supervision.text': 'Buscamos y licenciamos música para campañas, cortometrajes y contenido de marca, equilibrando atmósfera, narrativa y originalidad. Nuestra supervisión garantiza una integración impecable y resonancia emocional, trabajando mano a mano con directores, editores y productores.',
      about: 'Low Pitch Orchestra',
    },
  };
  let lang = document.documentElement.lang === 'es' ? 'es' : 'en';
  const t = k => (I18N[lang][k] ?? I18N.en[k] ?? k);

  function applyLang() {
    document.documentElement.lang = lang;
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.dataset.i18n;
      if (el.classList.contains('row-text') && el.firstElementChild) el.firstElementChild.textContent = t(key);
      else el.textContent = t(key);
    });
    document.querySelectorAll('#switch-lang button').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.lang === lang)));
    field.querySelectorAll('.work').forEach(a => { const w = WORKS.find(x => x.id === a.dataset.id); if (w) a.setAttribute('aria-label', captionOf(w)); });
    setNowPlaying(null);
  }
  document.querySelectorAll('#switch-lang button').forEach(b => b.addEventListener('click', () => { lang = b.dataset.lang; store.set('lpo-lang', lang); applyLang(); }));

  /* ---------- theme ---------- */
  function applyTheme(name) {
    if (name === 'light') document.documentElement.setAttribute('data-theme', 'light'); else document.documentElement.removeAttribute('data-theme');
    document.querySelectorAll('#switch-theme button').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.theme === name)));
    const meta = document.querySelector('meta[name="theme-color"]'); if (meta) meta.content = name === 'light' ? '#efe8dc' : '#161311';
  }
  document.querySelectorAll('#switch-theme button').forEach(b => b.addEventListener('click', () => { store.set('lpo-theme', b.dataset.theme); applyTheme(b.dataset.theme); }));
  applyTheme(document.documentElement.getAttribute('data-theme') === 'light' ? 'light' : 'dark');

  /* ---------- the works on the frieze. Heights follow a golden-ratio scale (φ = 1.618):
     xl : l : m : s : xs  =  φ³ : φ² : φ : 1 : 1/φ  — big photographs, small marks, nothing in between by accident. ---------- */
  const PHI = 1.618;
  const SCALE = { xl: Math.pow(PHI, 3), l: Math.pow(PHI, 2), m: PHI, s: 1, xs: 1 / PHI };
  // ar = width / height; x is a fraction of the band, y a fraction of the free height
  const WORKS = [
    // far layer
    { id: 'playlists', kind: 'service', src: 'assets/w-playlists.jpg', ar: 1.33, size: 'l',  layer: 0, x: .02, y: .06, caption: 's.playlists' },
    { id: 'tokyo',     kind: 'photo',   src: 'assets/ig-tokyo.jpg',    ar: .8,   size: 'm',  layer: 0, x: .30, y: .62, caption: 'Tokyo Music Bar, Mexico City' },
    { id: 'crowd',     kind: 'photo',   src: 'assets/ig-crowd.jpg',    ar: 1,    size: 'xs', layer: 0, x: .50, y: .12, caption: 'Click Clack Hotel, Bogotá' },
    { id: 'about',     kind: 'about',   logo: true,                    ar: 1.55, size: 'm',  layer: 0, x: .64, y: .70, caption: 'about' },
    { id: 'paradisco', kind: 'photo',   src: 'assets/ig-paradisco.jpg', ar: .8,  size: 's',  layer: 0, x: .84, y: .08, caption: 'Paradisco, bar de escucha' },
    // middle layer
    { id: 'sonic',     kind: 'service', src: 'assets/w-sonic.jpg',     ar: .75,  size: 'xl', layer: 1, x: .10, y: .14, caption: 's.sonic' },
    { id: 'atmosphere', kind: 'photo',  src: 'assets/ig-atmosphere.jpg', ar: 1,  size: 'l',  layer: 1, x: .42, y: .40, caption: 'Atmosphere, Medellín' },
    { id: 'events',    kind: 'service', src: 'assets/w-events.jpg',    ar: .667, size: 'l',  layer: 1, x: .72, y: .18, caption: 's.events' },
    { id: 'carnaval',  kind: 'photo',   src: 'assets/ig-carnaval.jpg', ar: .8,   size: 'm',  layer: 1, x: .92, y: .58, caption: 'Carnaval de Barranquilla' },
    // near layer
    { id: 'consult',   kind: 'service', src: 'assets/w-consult.jpg',   ar: .75,  size: 'xl', layer: 2, x: .24, y: .04, caption: 's.consult' },
    { id: 'boavista',  kind: 'photo',   src: 'assets/ig-boavista.jpg', ar: .8,   size: 'xl', layer: 2, x: .56, y: .20, caption: 'Boavista Social Club, Lisbon' },
    { id: 'super-rayo', kind: 'photo',  src: 'assets/ig-super-rayo.jpg', ar: .8, size: 'l',  layer: 2, x: .82, y: .44, caption: 'Super Rayo' },
    { id: 'supervision', kind: 'service', src: 'assets/w-supervision.jpg', ar: .75, size: 'm', layer: 2, x: .06, y: .60, caption: 's.supervision' },
    { id: 'bambino',   kind: 'photo',   src: 'assets/ig-bambino.jpg',  ar: .8,   size: 'm',  layer: 2, x: .40, y: .74, caption: 'Bambino, Paris' },
    { id: 'clickclack', kind: 'photo',  src: 'assets/ig-clickclack.jpg', ar: 1,  size: 's',  layer: 2, x: .70, y: .78, caption: 'Click Clack Hotel' },
    { id: 'about-b',   kind: 'photo',   src: 'assets/w-about.jpg',     ar: .75,  size: 's',  layer: 2, x: .96, y: .10, caption: 'about' },
  ];
  const captionOf = w => (I18N.en[w.caption] ? t(w.caption) : w.caption);

  let TW = 2400, FH = 600;
  function metrics() {
    const w = window.innerWidth, h = field.clientHeight;
    FH = h;
    TW = phone() ? Math.max(1600, w * 3.6) : Math.max(2600, w * 1.9);
    // the unit is a share of the free height, so the whole scale fits above the console on any screen
    const unit = h * (phone() ? 0.10 : 0.125);
    const out = {}; for (const k in SCALE) out[k] = Math.round(unit * SCALE[k]); return out;   // heights, px
  }
  function build() {
    const heights = metrics();
    const pad = 24;   // room for the breathing and the tilt
    layers.forEach((layer, li) => {
      layer.textContent = '';
      for (let dx = -1; dx <= 1; dx++) {
        const tile = document.createElement('div');
        tile.className = 'tile';
        tile.style.transform = `translate(${dx * TW}px, 0)`;
        WORKS.filter(w => w.layer === li).forEach(w => {
          const height = Math.min(heights[w.size], FH - 2 * pad), width = Math.round(height * w.ar);
          const a = document.createElement(w.kind === 'photo' ? 'div' : 'a');
          a.className = 'work' + (w.logo ? ' logo-tile' : '') + (w.kind === 'photo' ? ' photo' : '');
          a.dataset.id = w.id;
          if (w.kind !== 'photo') a.href = '#' + (w.kind === 'client' ? 'clients' : w.kind === 'service' ? 'services' : 'contact');
          a.setAttribute('aria-label', captionOf(w));
          a.style.width = width + 'px'; a.style.height = Math.round(height) + 'px';
          const seed = WORKS.indexOf(w);
          a.style.setProperty('--breathe', (7 + (seed % 5) * 1.3).toFixed(1) + 's');
          a.style.setProperty('--breathe-delay', (-(seed * 1.7) % 9).toFixed(1) + 's');
          a.style.setProperty('--amp', (5 + (seed % 4) * 3) + 'px');
          a.style.left = Math.round(w.x * TW) + 'px';
          a.style.top = Math.round(Math.max(pad, Math.min(w.y * FH, FH - height - pad))) + 'px';
          if (w.logo) { a.appendChild(document.createElement('span')); }
          else {
            const img = document.createElement('img');
            img.src = w.src; img.alt = ''; img.draggable = false; img.decoding = 'async';
            img.style.height = '100%'; img.style.objectFit = 'cover';
            a.appendChild(img);
          }
          a.addEventListener('click', e => { e.preventDefault(); if (dragged) return; openFor(w); });
          a.addEventListener('mouseenter', () => { slow = true; lit(w.id, true); setNowPlaying(captionOf(w)); });
          a.addEventListener('mouseleave', () => { slow = false; lit(w.id, false); setNowPlaying(null); });
          tile.appendChild(a);
        });
        layer.appendChild(tile);
      }
    });
  }
  function lit(id, on) { field.querySelectorAll(`.work[data-id="${id}"]`).forEach(el => el.classList.toggle('is-lit', on)); }
  function setNowPlaying(text) { npText.textContent = text || t('tagline'); }

  /* ---------- motion: horizontal only. A slow drift, steered by the pointer, dragged by touch ---------- */
  let x = 0;
  const BASE = -0.55;
  let vel = BASE, target = BASE;
  let tiltTarget = 0, tilt = 0;   // vertical tilt of the layers, a few px by depth, steered by the pointer
  let slow = false, paused = false, pointerIn = false, dragging = false, dragged = false;
  const EASE = 0.09, MAX = 2.2, TILT = 28;
  const mod = (n, m) => ((n % m) + m) % m;

  function render() {
    layers.forEach(layer => {
      const d = parseFloat(layer.dataset.depth);
      layer.style.transform = `translate3d(${mod(x * d, TW) - TW}px, ${(tilt * (d - 1)).toFixed(2)}px, 0)`;
    });
  }
  function tick() {
    if (!dragging) {
      const want = paused ? 0 : pointerIn ? target : BASE;
      const k = slow ? 0.12 : 1;
      vel += (want * k - vel) * EASE;
      x += vel;
    }
    tilt += (tiltTarget - tilt) * 0.06;
    render();
    requestAnimationFrame(tick);
  }

  window.addEventListener('mousemove', e => {
    cursor.style.translate = `${e.clientX}px ${e.clientY}px`;
    cursor.classList.add('is-on');
    if (reduce || phone()) return;
    const cx = window.innerWidth / 2, cy = window.innerHeight / 2;
    pointerIn = !e.target.closest('.tray, .console, .switches');   // the chrome does not steer the frieze
    target = -((e.clientX - cx) / cx) * MAX;
    tiltTarget = pointerIn ? -((e.clientY - cy) / cy) * TILT : 0;
  });
  document.addEventListener('mouseleave', () => { pointerIn = false; tiltTarget = 0; cursor.classList.remove('is-on'); });
  document.addEventListener('mouseover', e => cursor.classList.toggle('is-big', !!e.target.closest('a, button')));

  let start = null;
  field.addEventListener('pointerdown', e => {
    if (e.button !== undefined && e.button !== 0) return;
    dragging = true; dragged = false; start = { x: e.clientX, px: x };
    field.setPointerCapture(e.pointerId);
  });
  field.addEventListener('pointermove', e => {
    if (!dragging) return;
    const dx = e.clientX - start.x;
    if (Math.abs(dx) > 6) dragged = true;
    const last = x; x = start.px + dx; vel = x - last;
  });
  const endDrag = e => {
    if (!dragging) return;
    dragging = false;
    vel = Math.max(-18, Math.min(18, vel));
    if (!dragged && e && !e.target.closest('.work')) openPanel(null);   // a tap on the empty frieze closes the tray
    setTimeout(() => { dragged = false; }, 50);
  };
  field.addEventListener('pointerup', endDrag);
  field.addEventListener('pointercancel', endDrag);
  // the wheel moves the frieze sideways; the page itself never scrolls
  window.addEventListener('wheel', e => {
    if (e.target.closest('.tray, .statement.is-open')) return;
    e.preventDefault();
    x -= (Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY);
  }, { passive: false });

  /* ---------- tray + tabs ---------- */
  function openPanel(name) {
    const open = !!name;
    panels.forEach(p => p.classList.toggle('is-on', p.dataset.panel === name));
    tabs.forEach(b => b.setAttribute('aria-expanded', String(b.dataset.panel === name)));
    tray.classList.toggle('is-open', open);
    tray.setAttribute('aria-hidden', String(!open));
    document.body.classList.toggle('tray-open', open);
    paused = open && !phone();
    if (open) { history.replaceState(null, '', '#' + name); tray.querySelector('.tray-inner').scrollTop = 0; }
    else history.replaceState(null, '', location.pathname + location.search);
  }
  tabs.forEach(b => b.addEventListener('click', () => openPanel(b.getAttribute('aria-expanded') === 'true' ? null : b.dataset.panel)));
  document.addEventListener('keydown', e => { if (e.key === 'Escape') { openPanel(null); setStatement(false); } });

  const serviceRows = [...document.querySelectorAll('#service-rows .row')];
  serviceRows.forEach(r => {
    const p = r.querySelector('.row-text'); const s = document.createElement('span'); p.textContent = ''; p.appendChild(s);
    r.querySelector('.row-btn').addEventListener('click', () => setRow(r.dataset.id, !r.classList.contains('is-open')));
    r.addEventListener('mouseenter', () => { lit(r.dataset.id, true); setNowPlaying(r.querySelector('.row-btn span').textContent); });
    r.addEventListener('mouseleave', () => { lit(r.dataset.id, false); setNowPlaying(null); });
  });
  function setRow(id, open) {
    serviceRows.forEach(r => {
      const on = r.dataset.id === id && open;
      r.classList.toggle('is-open', on); r.classList.toggle('is-current', on);
      r.querySelector('.row-btn').setAttribute('aria-expanded', String(on));
    });
  }
  const clientRows = [...document.querySelectorAll('#client-rows .sleeve')];
  clientRows.forEach(r => {
    r.addEventListener('mouseenter', () => { lit(r.dataset.id, true); setNowPlaying(r.querySelector('span').textContent); });
    r.addEventListener('mouseleave', () => { lit(r.dataset.id, false); setNowPlaying(null); });
    r.addEventListener('click', () => clientRows.forEach(c => c.classList.toggle('is-current', c === r)));
  });
  function openFor(w) {
    if (w.kind === 'service') { openPanel('services'); setRow(w.id, true); }
    else if (w.kind === 'client') { openPanel('clients'); clientRows.forEach(c => c.classList.toggle('is-current', c.dataset.id === w.id)); }
    else if (w.kind === 'about') { openPanel('contact'); }
  }

  /* ---------- statement ---------- */
  function setStatement(open) {
    statement.classList.toggle('is-open', open);
    moreBtn.setAttribute('aria-expanded', String(open));
  }
  moreBtn.addEventListener('click', () => setStatement(!statement.classList.contains('is-open')));

  /* ---------- boot ---------- */
  build(); render(); applyLang();
  if (!reduce) requestAnimationFrame(tick);
  const hash = location.hash.replace('#', '');
  if (['services', 'clients', 'contact'].includes(hash)) openPanel(hash);
  let rw; window.addEventListener('resize', () => { clearTimeout(rw); rw = setTimeout(() => { build(); render(); }, 150); });
})();
