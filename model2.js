// Model 2: steady-state extracellular dopamine as a function of MPH dose.
PKPD.register({
  title: '2. Steady-state dopamine vs methylphenidate',
  description: 'At the current release rate: how extracellular dopamine rises with MPH.',
  draw(canvas, p, K) {
    const xs = K.linspace(0, 50, 100);
    K.plot(canvas, {
      x: xs, y: xs.map(m => K.steadyState(p.da, m)),
      xmax: 50, ymax: 2000, xlabel: 'Methylphenidate (ng/mL)', ylabel: 'Steady-state dopamine (nM)',
      marker: { x: p.mph, y: K.steadyState(p.da, p.mph) }
    });
  }
});
