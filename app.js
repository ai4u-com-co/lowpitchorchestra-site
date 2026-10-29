(() => {
  const field = document.getElementById('field');
  const layers = [...field.querySelectorAll('.layer')];
  const drawer = document.getElementById('drawer');
  const items = [...drawer.querySelectorAll('.drawer-item')];
  const statement = document.getElementById('statement');
  const moreBtn = document.getElementById('statement-more');
  const cursor = document.getElementById('cursor');
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const phone = () => window.matchMedia('(max-width: 767px)').matches;

  /* ---------- the works: photographs and client sleeves, placed on a tile that repeats ---------- */
  const WORKS = [
    // layer 0 — far
    { id: 'playlists', kind: 'service', src: 'assets/w-playlists.jpg', size: 'big',    layer: 0, x: .08, y: .10, caption: 'Curated Playlists for Spaces & Brands' },
    { id: 'luxe',      kind: 'client',  src: 'assets/c-luxe.jpg',      size: 'small',  layer: 0, x: .62, y: .06, caption: 'Luxe Hotel' },
    { id: 'station',   kind: 'client',  src: 'assets/c-station.jpg',   size: 'medium', layer: 0, x: .80, y: .52, caption: 'Station Restaurant' },
    { id: 'about',     kind: 'about',   src: 'assets/w-about.jpg',     size: 'medium', layer: 0, x: .34, y: .60, caption: 'Low Pitch Orchestra' },
    // layer 1 — middle
    { id: 'sonic',     kind: 'service', src: 'assets/w-sonic.jpg',     size: 'big',    layer: 1, x: .55, y: .22, caption: 'Sonic Branding & Identity' },
    { id: 'one-half',  kind: 'client',  src: 'assets/c-one-half.jpg',  size: 'medium', layer: 1, x: .12, y: .66, caption: 'One Half' },
    { id: 'devocion',  kind: 'client',  src: 'assets/c-devocion.jpg',  size: 'medium', layer: 1, x: .86, y: .04, caption: 'Devoción' },
    { id: 'cafe-dragon', kind: 'client', src: 'assets/c-cafe-dragon.jpg', size: 'small', layer: 1, x: .40, y: .04, caption: 'Café Dragón' },
    { id: 'events',    kind: 'service', src: 'assets/w-events.jpg',    size: 'medium', layer: 1, x: .70, y: .68, caption: 'Music Direction for Events' },
    // layer 2 — near
    { id: 'consult',   kind: 'service', src: 'assets/w-consult.jpg',   size: 'big',    layer: 2, x: .26, y: .30, caption: 'Creative Consultation & Sound Strategy' },
    { id: 'torrealta', kind: 'client',  src: 'assets/c-torrealta.jpg', size: 'small',  layer: 2, x: .04, y: .46, caption: 'Torrealta' },
    { id: 'la-rufina', kind: 'client',  src: 'assets/c-la-rufina.jpg', size: 'medium', layer: 2, x: .58, y: .80, caption: 'La Rufina' },
    { id: 'casa-ramal', kind: 'client', src: 'assets/c-casa-ramal.jpg', size: 'small', layer: 2, x: .92, y: .34, caption: 'Casa Ramal' },
    { id: 'supervision', kind: 'service', src: 'assets/w-supervision.jpg', size: 'medium', layer: 2, x: .74, y: .10, caption: 'Music Supervision for Film, Fashion & Content' },
    { id: 'sambombi',  kind: 'client',  src: 'assets/c-sambombi.jpg',  size: 'small',  layer: 2, x: .30, y: .86, caption: 'Sambombi Bistro' },
  ];

  let TW = 1800, TH = 1300;
  function tileSize() {
    const w = window.innerWidth, h = window.innerHeight;
    if (phone()) { TW = Math.max(1000, w * 2.2); TH = Math.max(1500, h * 1.6); }
    else { TW = Math.max(1800, w * 1.15); TH = Math.max(1300, h * 1.35); }
  }

  function build() {
    tileSize();
    layers.forEach((layer, li) => {
      layer.innerHTML = '';
      for (let dx = -1; dx <= 1; dx++) for (let dy = -1; dy <= 1; dy++) {
        const tile = document.createElement('div');
        tile.className = 'tile';
        tile.style.transform = `translate(${dx * TW}px, ${dy * TH}px)`;
        WORKS.filter(w => w.layer === li).forEach(w => {
          const a = document.createElement('a');
          a.className = `work ${w.size}`;
          a.dataset.id = w.id; a.dataset.kind = w.kind;
          a.href = '#' + (w.kind === 'client' ? 'clients' : w.kind === 'service' ? 'services' : 'contact');
          a.style.left = (w.x * TW) + 'px';
          a.style.top = (w.y * TH) + 'px';
          a.innerHTML = `<img src="${w.src}" alt="" draggable="false" decoding="async"><span class="work-caption">${w.caption}</span>`;
          a.addEventListener('click', e => { e.preventDefault(); if (dragged) return; openFor(w); });
          a.addEventListener('mouseenter', () => { slow = true; lit(w.id, true); });
          a.addEventListener('mouseleave', () => { slow = false; lit(w.id, false); });
          tile.appendChild(a);
        });
        layer.appendChild(tile);
      }
    });
  }
  function lit(id, on) { field.querySelectorAll(`.work[data-id="${id}"]`).forEach(el => el.classList.toggle('is-lit', on)); }

  /* ---------- motion: a slow drift, steered by the pointer, dragged by touch ---------- */
  const pos = { x: 0, y: 0 };
  const base = { x: -0.28, y: -0.14 };          // px per frame when nobody touches it
  const vel = { x: base.x, y: base.y };
  let target = { ...base };
  let slow = false, paused = false, pointerIn = false, dragging = false, dragged = false;
  const EASE = 0.09, MAX = 1.4;
  const mod = (n, m) => ((n % m) + m) % m;

  function render() {
    layers.forEach(layer => {
      const d = parseFloat(layer.dataset.depth);
      layer.style.transform = `translate3d(${mod(pos.x * d, TW) - TW}px, ${mod(pos.y * d, TH) - TH}px, 0)`;
    });
  }
  function tick() {
    if (!dragging) {
      const want = paused ? { x: 0, y: 0 } : pointerIn ? target : base;
      const k = slow ? 0.12 : 1;
      vel.x += (want.x * k - vel.x) * EASE;
      vel.y += (want.y * k - vel.y) * EASE;
      pos.x += vel.x; pos.y += vel.y;
    }
    render();
    requestAnimationFrame(tick);
  }

  window.addEventListener('mousemove', e => {
    cursor.style.translate = `${e.clientX}px ${e.clientY}px`;
    cursor.classList.add('is-on');
    if (reduce || phone()) return;
    const cx = window.innerWidth / 2, cy = window.innerHeight / 2;
    pointerIn = true;
    target = { x: -((e.clientX - cx) / cx) * MAX, y: -((e.clientY - cy) / cy) * MAX };
  });
  document.addEventListener('mouseleave', () => { pointerIn = false; cursor.classList.remove('is-on'); });
  document.addEventListener('mouseover', e => cursor.classList.toggle('is-big', !!e.target.closest('a, button')));

  // drag anywhere on the field (touch and mouse), wheel pans too
  let start = null;
  field.addEventListener('pointerdown', e => {
    if (e.button !== undefined && e.button !== 0) return;
    dragging = true; dragged = false; start = { x: e.clientX, y: e.clientY, px: pos.x, py: pos.y, t: performance.now() };
    field.setPointerCapture(e.pointerId); field.classList.add('is-dragging');
  });
  field.addEventListener('pointermove', e => {
    if (!dragging) return;
    const dx = e.clientX - start.x, dy = e.clientY - start.y;
    if (Math.abs(dx) + Math.abs(dy) > 6) dragged = true;
    const last = { x: pos.x, y: pos.y };
    pos.x = start.px + dx; pos.y = start.py + dy;
    vel.x = pos.x - last.x; vel.y = pos.y - last.y;
  });
  const endDrag = () => {
    if (!dragging) return;
    dragging = false; field.classList.remove('is-dragging');
    vel.x = Math.max(-18, Math.min(18, vel.x)); vel.y = Math.max(-18, Math.min(18, vel.y));
    setTimeout(() => { dragged = false; }, 50);
  };
  field.addEventListener('pointerup', endDrag);
  field.addEventListener('pointercancel', endDrag);
  window.addEventListener('wheel', e => {
    if (e.target.closest('.drawer-panel, .statement.is-open')) return;
    e.preventDefault(); pos.x -= e.deltaX; pos.y -= e.deltaY;
  }, { passive: false });

  /* ---------- drawer ---------- */
  const TAB = 52;
  function openPanel(name) {
    const closed = items.filter(it => it.dataset.panel !== name);
    items.forEach(it => {
      const on = it.dataset.panel === name;
      it.classList.toggle('is-open', on);
      it.querySelector('.drawer-trigger').setAttribute('aria-expanded', String(on));
      if (on) it.style.setProperty('--shift', `${-TAB * closed.length}px`);           // sits left of the closed tabs
      else {
        const rank = closed.filter(c => +c.style.getPropertyValue('--i') > +it.style.getPropertyValue('--i')).length;
        it.style.setProperty('--shift', `calc(100% - ${TAB * (rank + 1)}px)`);       // closed tabs compact to the edge
      }
    });
    paused = !!name && !phone();
    document.body.classList.toggle('drawer-open', !!name);
    if (name) history.replaceState(null, '', '#' + name);
    else history.replaceState(null, '', location.pathname);
  }
  items.forEach(it => {
    it.querySelector('.drawer-trigger').addEventListener('click', () => openPanel(it.classList.contains('is-open') ? null : it.dataset.panel));
  });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') { openPanel(null); setStatement(false); } });

  // service rows expand; client rows light their sleeve on the field
  const serviceRows = [...document.querySelectorAll('#service-rows .row')];
  serviceRows.forEach(r => {
    const p = r.querySelector('.row-text'); const s = document.createElement('span'); s.textContent = p.textContent; p.textContent = ''; p.appendChild(s);
    r.querySelector('.row-btn').addEventListener('click', () => setRow(r.dataset.id, !r.classList.contains('is-open')));
    r.addEventListener('mouseenter', () => lit(r.dataset.id, true));
    r.addEventListener('mouseleave', () => lit(r.dataset.id, false));
  });
  function setRow(id, open) {
    serviceRows.forEach(r => {
      const on = r.dataset.id === id && open;
      r.classList.toggle('is-open', on); r.classList.toggle('is-current', on);
      r.querySelector('.row-btn').setAttribute('aria-expanded', String(on));
    });
  }
  const clientRows = [...document.querySelectorAll('#client-rows .row')];
  clientRows.forEach(r => {
    r.addEventListener('mouseenter', () => lit(r.dataset.id, true));
    r.addEventListener('mouseleave', () => lit(r.dataset.id, false));
    r.addEventListener('click', () => clientRows.forEach(c => c.classList.toggle('is-current', c === r)));
  });

  function openFor(w) {
    if (w.kind === 'service') { openPanel('services'); setRow(w.id, true); }
    else if (w.kind === 'client') { openPanel('clients'); clientRows.forEach(c => c.classList.toggle('is-current', c.dataset.id === w.id)); }
    else { setStatement(true); }
  }

  /* ---------- statement ---------- */
  function setStatement(open) {
    statement.classList.toggle('is-open', open);
    moreBtn.setAttribute('aria-expanded', String(open));
  }
  moreBtn.addEventListener('click', () => setStatement(!statement.classList.contains('is-open')));

  /* ---------- boot ---------- */
  build(); render();
  if (!reduce) requestAnimationFrame(tick); else render();
  const hash = location.hash.replace('#', '');
  if (['services', 'clients', 'contact'].includes(hash)) openPanel(hash);
  let rw; window.addEventListener('resize', () => { clearTimeout(rw); rw = setTimeout(() => { build(); render(); }, 150); });
})();
