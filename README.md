# Dopamine & methylphenidate models

Static site, no build step.

- `index.html` – sliders, layout, tabs, model list (`MODELS`)
- `bridge.js` – shared constants/helpers + slider link (loaded by every model)
- `content.js` – text of the "About the models" tab (edit this one)
- `models/model1-4.html` – one self-contained HTML file per model; only model code + `PKPD.onUpdate(p => ...)` (p.da, p.mph)

Add a model: create `models/model5.html`, add a line to `MODELS` in `index.html`.
Deploy: push to GitHub, Settings > Pages > Deploy from branch > `main` / root.
Local test: `python3 -m http.server` in this folder (needed, iframes don't load reliably from file://).
