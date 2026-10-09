# Dopamine & methylphenidate models

Static site, no build step.

- `index.html` – sliders + page layout + shared helpers (`PKPD`)
- `models/model1-4.js` – one model each; each calls `PKPD.register({title, description, draw(canvas, params, PKPD)})`

Deploy: push to GitHub, then Settings > Pages > Deploy from branch > `main` / root.
Local test: `python3 -m http.server` in this folder.
