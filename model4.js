// Model 4: postsynaptic receptor occupancy, Hill/Langmuir: C / (C + Kd).
PKPD.register({
  title: '4. Receptor occupancy',
  description: 'Fraction of receptors bound at the steady-state dopamine level (marker). Edit Kd in the core constants.',
  draw(canvas, p, K) {
    const xs = K.linspace(0, 2000, 200), occ = C => C / (C + K.consts.Kd);
    K.plot(canvas, {
      x: xs, y: xs.map(occ), xmax: 2000, ymax: 1,
      xlabel: 'Extracellular dopamine (nM)', ylabel: 'Occupancy (fraction)',
      marker: { x: K.steadyState(p.da, p.mph), y: occ(K.steadyState(p.da, p.mph)) }
    });
  }
});
