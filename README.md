# Low Pitch Orchestra — sitio de una sola pantalla

Rediseño de https://lowpitchorchestra.com/ bajo un concepto: todo el sitio cabe y se usa en
la pantalla visible, sin scroll vertical, como una app de tablet.

- `index.html` — estructura: escenario (foto + servicio activo), tracklist de servicios,
  fundas de clientes, pie de contacto, pestañas (solo móvil).
- `styles.css` — tokens de color/tipo en `:root`, grid de `100dvh`, reglas por tamaño.
- `app.js` — selección de servicio (clic y flechas), About, pestañas móviles.
- `assets/` — fotos del sitio actual reducidas para web.

Sitio estático: sirve la carpeta tal cual (`python3 -m http.server`) o despliega a Vercel sin build.
Contenido tomado íntegramente del sitio actual (WordPress), incluidos textos de servicios y About.
