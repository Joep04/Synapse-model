// Model 1: DAT uptake kinetics (Michaelis-Menten with competitive inhibition by MPH).
// Each model file gets: canvas, p = {da, mph} from the main sliders, and the PKPD helpers.
PKPD.register({
  title: '1. DAT uptake vs dopamine concentration',
  description: 'Uptake curve shifts right with MPH. Dashed line = release rate; the crossing is steady state.',
  draw(canvas, p, K) {
    const xs = K.linspace(0, 2000, 200);
    K.plot(canvas, {
      x: xs, y: xs.map(C => K.uptake(C, p.mph)),
      xmax: 2000, ymax: 100, xlabel: 'Extracellular dopamine (nM)', ylabel: 'Uptake (nM/s)',
      hline: p.da, marker: { x: K.steadyState(p.da, p.mph), y: p.da }
    });
  }
});
