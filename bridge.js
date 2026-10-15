// Shared core, loaded by index.html and by every model file.
const PKPD = (() => {
  const consts = { Vmax: 100, Km: 200, Ki: 100, ngToNM: 4.28, Kd: 500 }; 
  const params = { da: 60, mph: 10, profile: 'adhd', shared: {} };   // da = baseline dopamine (%, adhd=60%), mph = mg (standaard 10mg)
  const subs = [];
  
  const kApp = mph => consts.Km * (1 + (mph * consts.ngToNM) / consts.Ki);
  const uptake = (C, mph) => consts.Vmax * C / (kApp(mph) + C);
  const steadyState = (R, mph) => R >= consts.Vmax ? Infinity : R * kApp(mph) / (consts.Vmax - R);
  
  // Geschaald naar percentages: max 200%, optimum 100%
  const PAPER = { DA_MAX: 200.0, OPTIMUM: 100.0, CURVE_WIDTH: 32.0, BOOST: 0.0, MPH: { ec50: 15.0, eMax: 1.0, maxInc: 100.0 } };
  
  const PROFILES = {
    typical: { name: 'Typical',           start: 100.0, mph: 0,  wm: 1.0 },
    adhd:    { name: 'ADHD',              start: 60.0,  mph: 10, wm: 1.0 },
    anxiety: { name: 'Anxiety or stress', start: 140.0, mph: 0,  wm: 1.0 }
  };
  
  const clamp = (v, a, c) => Math.min(c, Math.max(a, v));
  const performance = (da, w) => 100 * Math.exp(-Math.pow(da - PAPER.OPTIMUM, 2) / (2 * w * w));
  const occupancy = conc => PAPER.MPH.eMax * conc / (PAPER.MPH.ec50 + conc);
  
  function compute(baseline, conc, profile) {   
    const p = PROFILES[profile] || PROFILES.typical, occ = occupancy(conc), width = PAPER.CURVE_WIDTH * p.wm;
    const start = clamp(baseline, 0, PAPER.DA_MAX);
    const after = clamp(start + PAPER.MPH.maxInc * occ + PAPER.BOOST, 0, PAPER.DA_MAX);
    return { start, after, width, occupancy: occ, p0: performance(start, width), p1: performance(after, width) };
  }
  
  const linspace = (a, b, n) => Array.from({ length: n }, (_, i) => a + (b - a) * i / (n - 1));
  const css = n => getComputedStyle(document.documentElement).getPropertyValue(n).trim();
  const emit = () => subs.forEach(f => f({ ...params }));
  const onUpdate = f => { subs.push(f); };
  
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
  return { consts, params, kApp, uptake, steadyState, linspace, plot, css, onUpdate, share, PAPER, PROFILES, performance, occupancy, compute };
})(); 
