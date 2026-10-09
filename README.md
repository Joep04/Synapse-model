# Dopamine & methylphenidate models

Static site, no build step.

- `index.html` – sliders, layout, tabs, shared helpers (`PKPD`)
- `content.js` – the text on the "About the models" tab (edit this one)
- `models/model1-4.js` – one model each; each calls `PKPD.register({title, description, draw(canvas, params, PKPD)})`

Deploy: push to GitHub, then Settings > Pages > Deploy from branch > `main` / root.
Local test: `python3 -m http.server` in this folder.
