// Shared core, loaded by index.html and by every model file.
// Model files only need:  PKPD.onUpdate(p => { ...draw using p.da, p.mph... });
const PKPD = (() => {
  const consts = { Vmax: 100, Km: 200, Ki: 100, ngToNM: 4.28, Kd: 500 }; // nM/s, nM, nM, nM per ng/mL, nM
  const params = { da: 40, mph: 10 };      // da = release rate (nM/s), mph = plasma conc (ng/mL)
  const subs = [];
  const kApp = mph => consts.Km * (1 + (mph * consts.ngToNM) / consts.Ki);
  const uptake = (C, mph) => consts.Vmax * C / (kApp(mph) + C);
  const steadyState = (R, mph) => R >= consts.Vmax ? Infinity : R * kApp(mph) / (consts.Vmax - R);
  const linspace = (a, b, n) => Array.from({ length: n }, (_, i) => a + (b - a) * i / (n - 1));
  const css = n => getComputedStyle(document.documentElement).getPropertyValue(n).trim();
  const emit = () => subs.forEach(f => f({ ...params }));
  const onUpdate = f => { subs.push(f); };

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
  return { consts, params, kApp, uptake, steadyState, linspace, plot, css, onUpdate };
})();
