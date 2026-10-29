# Low Pitch Orchestra — sitio de una sola pantalla

Rediseño de https://lowpitchorchestra.com/ bajo un concepto: todo el sitio cabe y se usa en
la pantalla visible, sin scroll vertical, como una app de tablet.

Referente del cliente: https://publicrecords.nyc/, remezclado: un **friso horizontal** de fotos y
clientes que deriva de lado (nunca en vertical), marca y declaración arriba a la izquierda en
`mix-blend-mode: difference`, una **consola** al pie (Now playing · Services / Clients / Contact ·
EN/ES · Dark/Light) y paneles que suben como bandeja. Paleta y tipografía propias de LPO.

- `index.html` — friso (3 capas), marca + declaración, conmutadores, bandeja con 3 paneles, consola, cursor.
- `styles.css` — tokens oscuro/claro en `:root` y `[data-theme="light"]`, friso, consola, bandeja, móvil.
- `app.js` — textos EN/ES (`I18N`), tema y idioma persistidos en localStorage, obras del friso
  (escaladas a la altura libre para que siempre quepan), deriva/puntero/arrastre/rueda en X, bandeja.
- Concepto anterior (escenario + tracklist) en el tag `v1-tracklist`.
- `assets/` — fotos del sitio actual reducidas para web.

Sitio estático: sirve la carpeta tal cual (`python3 -m http.server`) o despliega a Vercel sin build.
Contenido tomado íntegramente del sitio actual (WordPress), incluidos textos de servicios y About.
