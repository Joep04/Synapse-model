// Model 3: time course after release switches on (Euler integration of dC/dt = R - uptake(C)).
PKPD.register({
  title: '3. Dopamine time course',
  description: 'Release switches on at t = 0; dopamine builds toward steady state, slower and higher with MPH.',
  draw(canvas, p, K) {
    const dt = 0.05, T = 30, xs = [], ys = []; let C = 0;
    for (let t = 0; t <= T; t += dt) { xs.push(t); ys.push(C); C += dt * (p.da - K.uptake(C, p.mph)); }
    K.plot(canvas, { x: xs, y: ys, xmax: T, ymax: 2000, xlabel: 'Time (s)', ylabel: 'Dopamine (nM)',
      hline: null });
  }
});
