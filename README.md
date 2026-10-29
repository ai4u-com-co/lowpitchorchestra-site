# Low Pitch Orchestra — sitio de una sola pantalla

Rediseño de https://lowpitchorchestra.com/ bajo un concepto: todo el sitio cabe y se usa en
la pantalla visible, sin scroll vertical, como una app de tablet.

Referente del cliente: https://publicrecords.nyc/ (campo infinito que deriva, declaración fija en
`mix-blend-mode: difference`, acordeón vertical a la derecha). Paleta y tipografía propias de LPO.

- `index.html` — campo (3 capas), marca, declaración, acordeón Services / Clients / Contact, cursor.
- `styles.css` — tokens en `:root`, campo y capas, declaración, acordeón (vertical en escritorio,
  apilado arriba en móvil), cursor, reduced motion.
- `app.js` — obras y su posición en el mosaico, deriva + puntero + arrastre + rueda, acordeón,
  filas de servicios/clientes, declaración expandible.
- Concepto anterior (escenario + tracklist) en el tag `v1-tracklist`.
- `assets/` — fotos del sitio actual reducidas para web.

Sitio estático: sirve la carpeta tal cual (`python3 -m http.server`) o despliega a Vercel sin build.
Contenido tomado íntegramente del sitio actual (WordPress), incluidos textos de servicios y About.
