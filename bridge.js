// Shared core, loaded by index.html and by every model file.
// Model files only need:  PKPD.onUpdate(p => { ...draw using p.da, p.mph... });
const PKPD = (() => {
  const consts = { Vmax: 100, Km: 200, Ki: 100, ngToNM: 4.28, Kd: 500 }; // nM/s, nM, nM, nM per ng/mL, nM
  const params = { da: 1, mph: 3, daPct: 100, mg: 20, sens: 100, profile: 'adhd', shared: {} };   // da (0-4) and mph (ng/mL) are legacy units for model 1; daPct (%), mg and sens (%) are the new slider units
  const subs = [];
  const kApp = mph => consts.Km * (1 + (mph * consts.ngToNM) / consts.Ki);
  const uptake = (C, mph) => consts.Vmax * C / (kApp(mph) + C);
  const steadyState = (R, mph) => R >= consts.Vmax ? Infinity : R * kApp(mph) / (consts.Vmax - R);
  // ---- Paper-based model ----
  // Units: baseline dopamine B and receptor sensitivity S in % (100 = typical / optimal), methylphenidate dose in mg.
  // Occupancy: Hill curve, ED50 = 0.25 mg/kg x 70 kg = 17.5 mg (PET data on oral MPH), Emax 0.9, n 1.35.
  // f = share of dopamine clearance that depends on DAT (prefrontal cortex also clears dopamine via NET/COMT).
  // Performance: Gaussian inverted U around the optimum (100 %) with sigma = 32 %.
  const PAPER = { DA_MAX: 200, OPTIMUM: 100, CURVE_WIDTH: 32,
    MPH: { weightKg: 70, edPerKg: 0.25, eMax: 0.9, n: 1.35, f: 0.5, maxMg: 60 } };
  // start = baseline dopamine (%), sens = receptor sensitivity (%), mph = dose (mg) the profile sets on the sliders.
  // ADHD values from Volkow et al. 2009 (PET, adults with ADHD vs controls):
  //   DAT   accumbens 89 %, caudate 80 %, midbrain 56 % of control  -> baseline dopamine (fewer/less active terminals)
  //   D2/D3 accumbens 94 %, caudate 88 %, midbrain 64 % of control  -> receptor sensitivity
  const PROFILES = {
    typical: { name: 'Typical',            start: 100, sens: 100, mph: 0,  wm: 1.0 },
    adhd:    { name: 'ADHD (striatum)',    start: 85,  sens: 90,  mph: 20, wm: 1.0 },
    adhdmid: { name: 'ADHD (midbrain)',    start: 60,  sens: 65,  mph: 20, wm: 1.0 },
    anxiety: { name: 'Anxiety or stress',  start: 140, sens: 100, mph: 0,  wm: 1.0 }
  };
  const clamp = (v, a, c) => Math.min(c, Math.max(a, v));
  const performance = (x, w) => 100 * Math.exp(-Math.pow(x - PAPER.OPTIMUM, 2) / (2 * w * w));
  const occupancy = mg => {              // fraction of transporters blocked (0-1)
    if (mg <= 0) return 0;
    const M = PAPER.MPH, ed = M.edPerKg * M.weightKg, a = Math.pow(mg, M.n), b = Math.pow(ed, M.n);
    return M.eMax * a / (b + a);
  };
  const daMultiplier = mg => 1 / (1 - PAPER.MPH.f * occupancy(mg));
  // Model 1 still uses ng/mL: the concentration that gives the same blocked fraction on its own curve (ec50 4.5, eMax 1)
  const legacyConc = mg => { const o = occupancy(mg); return 4.5 * o / (1 - o); };
  function compute(baseline, mg, sens, profile) {   // start = D1 stimulation unmedicated, after = on MPH
    const p = PROFILES[profile] || PROFILES.typical, occ = occupancy(mg), width = PAPER.CURVE_WIDTH * p.wm;
    const start = clamp(baseline * sens / 100, 0, PAPER.DA_MAX);
    const after = clamp(baseline * daMultiplier(mg) * sens / 100, 0, PAPER.DA_MAX);
    return { start, after, width, occupancy: occ, p0: performance(start, width), p1: performance(after, width) };
  }
  const linspace = (a, b, n) => Array.from({ length: n }, (_, i) => a + (b - a) * i / (n - 1));
  const css = n => getComputedStyle(document.documentElement).getPropertyValue(n).trim();
  const emit = () => subs.forEach(f => f({ ...params }));
  const onUpdate = f => { subs.push(f); };
  // Publish values to the other models (via index.html), e.g. PKPD.share({ perfMedicated: 0.8 }).
  // Other models read them as p.shared.<name> inside onUpdate.
  let lastShared = '';
  const share = values => {
    const j = JSON.stringify(values); if (j === lastShared) return; lastShared = j;
    if (window.parent !== window) parent.postMessage({ type: 'pkpd-share', values }, '*');
  };

  function plot(canvas, o) {
    const dpr = window.devicePixelRatio || 1, W = canvas.clientWidth, H = canvas.clientHeight;
    if (!W) return;
    canvas.width = W * dpr; canvas.height = H * dpr;
    const g = canvas.getContext('2d'); g.scale(dpr, dpr);
    const m = { l: 54, r: 14, t: 12, b: 42 }, pw = W - m.l - m.r, ph = H - m.t - m.b;
    const X = x => m.l + x / o.xmax * pw, Y = y => m.t + ph - Math.min(y, o.ymax) / o.ymax * ph;
    g.font = '12px ' + css('--sans'); g.fillStyle = css('--mute'); g.strokeStyle = css('--line'); g.lineWidth = 1;
    for (let i = 0; i <= 4; i++) {
      const y = o.ymax * i / 4, x = o.xmax * i / 4;
      g.beginPath(); g.moveTo(m.l, Y(y)); g.lineTo(W - m.r, Y(y)); g.stroke();
      g.textAlign = 'right'; g.fillText(+y.toPrecision(3), m.l - 8, Y(y) + 4);
      g.textAlign = 'center'; g.fillText(+x.toPrecision(3), X(x), H - m.b + 18);
    }
    g.fillText(o.xlabel, m.l + pw / 2, H - 6);
    g.save(); g.translate(13, m.t + ph / 2); g.rotate(-Math.PI / 2); g.fillText(o.ylabel, 0, 0); g.restore();
    g.beginPath(); g.moveTo(X(o.x[0]), Y(0));
    o.x.forEach((x, i) => g.lineTo(X(x), Y(o.y[i]))); g.lineTo(X(o.x[o.x.length - 1]), Y(0)); g.closePath();
    g.globalAlpha = .09; g.fillStyle = css('--da'); g.fill(); g.globalAlpha = 1;
    if (o.hline != null) { g.strokeStyle = css('--da'); g.lineWidth = 1.5; g.setLineDash([6, 5]); g.beginPath(); g.moveTo(m.l, Y(o.hline)); g.lineTo(W - m.r, Y(o.hline)); g.stroke(); g.setLineDash([]); }
    g.strokeStyle = css('--curve'); g.lineWidth = 2.5; g.lineJoin = 'round'; g.beginPath();
    o.x.forEach((x, i) => i ? g.lineTo(X(x), Y(o.y[i])) : g.moveTo(X(x), Y(o.y[i]))); g.stroke();
    if (o.marker && isFinite(o.marker.x) && o.marker.x <= o.xmax) {
      const px = X(o.marker.x), py = Y(o.marker.y);
      g.fillStyle = css('--panel'); g.beginPath(); g.arc(px, py, 8, 0, 7); g.fill();
      g.fillStyle = css('--mph'); g.beginPath(); g.arc(px, py, 5.5, 0, 7); g.fill();
    }
  }

  // Inside a model iframe: receive slider values + theme from index.html
  if (!window.PKPD_HOST) {
    const set = t => Object.entries(t).forEach(([k, v]) => document.documentElement.style.setProperty(k, v));
    const dark = matchMedia('(prefers-color-scheme: dark)').matches;
    set(dark ? { '--panel': '#15252a', '--ink': '#e6f0ef', '--mute': '#8fa5a9', '--line': '#27393d', '--da': '#3fc1b8', '--mph': '#a98bff', '--curve': '#e6f0ef' }
             : { '--panel': '#f8faf9', '--ink': '#12262c', '--mute': '#5a6e74', '--line': '#c9d4d6', '--da': '#0b7a75', '--mph': '#6d3fc0', '--curve': '#12262c' });
    set({ '--sans': 'system-ui, sans-serif' });
    const st = document.createElement('style');
    st.textContent = 'html,body{margin:0;height:100%;overflow:hidden;background:transparent}canvas{display:block;width:100%;height:100%}';
    document.head.appendChild(st);
    addEventListener('message', e => {
      const d = e.data; if (!d || d.type !== 'pkpd' || e.source !== parent) return;
      Object.assign(params, d.params); set(d.theme || {}); emit();
    });
    addEventListener('resize', emit);
    addEventListener('load', emit);
  }
  return { consts, params, kApp, uptake, steadyState, linspace, plot, css, onUpdate, share, PAPER, PROFILES, performance, occupancy, daMultiplier, legacyConc, compute };
})();
