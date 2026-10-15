// Edit only this file to change the text on the "About the models" tab.
// Separate paragraphs with a blank line. Simple HTML (<b>, <i>, <sub>, <sup>) works.
// NOTE: every text block uses String.raw so LaTeX backslashes (\theta, \tau, \Delta) survive.

const CONTENT = {
  intro: String.raw`
This page explains the four ideas behind the simulation. Three sliders drive the model: <b>baseline dopamine</b> (0–200%, where 100% is the typical, optimal level), <b>methylphenidate dose</b> (0–60 mg) and <b>receptor sensitivity</b> (0–200%, where 100% is typical). A lower baseline and lower receptor sensitivity are used to mimic ADHD.

Follow the chain from left to right: the dose blocks dopamine transporters (model 1), the resulting dopamine signal acts on D1 receptors and sets working-memory performance on an inverted U (model 2), which determines how well the activity bump in the ring attractor is held (model 3) and how deep the memory valley is (model 4).

<i>This is a conceptual teaching model, not a clinical tool. Parameter values are simplified from the literature.</i>
`,
  models: [
    {
      title: "1. Dopamine, reuptake, ADHD and methylphenidate",
      text: String.raw`
<b>Dopamine</b> is a neurotransmitter involved in reward, memory, movement, motivation, mood and attention.

<b>ADHD</b> is a neurodevelopmental disorder associated with dopamine dysregulation. The dopamine hypothesis suggests that reduced dopamine signalling is involved, although it is not a defining feature. In the model, a low <i>dopamine baseline</i> stands in for this reduced signalling.

<b>Reuptake.</b> After release into the synapse, dopamine is taken back up by dopamine transporters (DAT) in the membrane of the axon terminal or glial cells. In ADHD, genetic variation can lead to more transporters, so dopamine is cleared faster and has less time to bind receptors.

<b>Methylphenidate (MPH)</b> is a CNS stimulant approved for ADHD. It physically blocks the transporters, so dopamine stays longer in the synaptic space. In the model, MPH is drawn as a red circle on the transporters: a higher dose gives a less transparent circle, meaning more transporters are blocked.

<b>Key formulas and values</b>

Fraction of transporters blocked (dose in mg, simple binding curve):
$$
\text{Occ}(d) = \frac{d}{d + ED_{50}}
$$

Dopamine clearance rate (Michaelis–Menten uptake, reduced by the blocked fraction):
$$
\frac{d[DA]}{dt} = \text{release} - \frac{V_{max}\,[DA]}{K_m + [DA]}\,\bigl(1 - \text{Occ}\bigr)
$$

Simplified steady state used in the sliders (100% = typical):
$$
DA_{eff} = \frac{B}{1 - f\cdot \text{Occ}}
$$

• <b>d</b>: dose in mg (0–60). <b>ED<sub>50</sub></b> ≈ 20 mg (about 50% DAT occupancy at ~0.25 mg/kg, ≈ 70% at ~0.5 mg/kg in PET studies of oral MPH).<br>
• <b>B</b>: baseline dopamine signalling (%), typical = 100%. It stands for how much dopamine the terminals can release. In adults with ADHD, PET shows 11% fewer transporters in the nucleus accumbens, 20% fewer in the caudate and 44% fewer in the midbrain (transporter availability is lower, which points to fewer or less active dopamine terminals), so the ADHD preset is B ≈ 85% (striatum) down to ≈ 60% (midbrain-weighted).<br>
• <b>f</b>: share of clearance that depends on DAT, 0.5 (in prefrontal cortex a lot of dopamine is cleared by other routes, so f is below 1).
`
    },
    {
      title: "2. Working memory and the inverted U",
      text: String.raw`
Dopamine has long been implicated in cognitive control, including working memory. The link follows an <b>inverted U</b>: too little and too much dopamine both impair performance, and a moderate level is best.

There are five dopamine receptor types. The model focuses on <b>D1</b>, because the evidence for an inverted U is strongest there. D2 also influences working-memory-related activity, but that relationship is less well established. D1 receptors sit mainly in the striatum and cerebral cortex, and in prefrontal cortex they generally reduce neuronal firing.

<b>What D1 stimulation does to a neuron</b>

1. <b>Too little:</b> activity is noisy and the preferred location is not represented clearly.<br>
2. <b>Moderate:</b> activity for non-preferred locations drops more than for the preferred one, so the relevant information stands out and working memory can improve.<br>
3. <b>Too much:</b> suppression is too strong. Activity for the preferred location falls as well, information is lost and spatial tuning deteriorates.

<b>Baseline dependence.</b> In human drug studies, dopaminergic drugs improved cognition in people with lower baseline working memory and worsened it in people with higher baseline capacity.

1. <b>Low baseline (our ADHD stand-in):</b> D1 stimulation is too low. A dose moves the person towards the peak, so performance rises.<br>
2. <b>Near the peak:</b> already optimal, so a dose adds little.<br>
3. <b>High baseline:</b> a dose pushes the person past the peak, causing excessive D1 stimulation and worse performance.

<b>How the three sliders combine.</b> Baseline, dose and receptor sensitivity are merged into one D1 stimulation value, which is placed on the inverted U:

$$
x = DA_{eff}\cdot S
$$

$$
P(x) = \max\!\left(0,\; 1 - \left(\frac{x - x_0}{w}\right)^{2}\right)
$$

• <b>S</b>: receptor sensitivity (%), typical = 100%. It is set from D2/D3 receptor availability measured with PET in 53 unmedicated adults with ADHD and 44 controls (Volkow et al., 2009): accumbens 2.68 vs 2.85 (S ≈ 94%), caudate 2.47 vs 2.80 (S ≈ 88%), midbrain 0.18 vs 0.28 (S ≈ 64%). The ADHD preset is S ≈ 90% (striatum) down to ≈ 65% (midbrain-weighted).<br>
• <b>x<sub>0</sub> = 100%</b>: the optimum (peak performance, P = 1). <b>w = 100%</b>: half-width, so P reaches 0 at x = 0% and x = 200%, matching the slider range.<br>
• A <b>quadratic</b> curve is used because a meta-analysis of 75 studies found a negative quadratic relationship between prefrontal dopamine or D1 stimulation and working memory (about 26% of variance explained for D1 receptors, 10% for dopamine alone).

<b>Limits of the data.</b> The PET study measured D2/D3 receptors and transporters in the striatum and midbrain, not D1 receptors or the prefrontal cortex (where levels are too low for these tracers). D2/D3 availability is therefore used as a proxy for overall receptor sensitivity. Group differences were moderate (effect sizes about 0.6), so a group average sits only mildly below the typical value, and individuals vary a lot.

<b>Example outputs</b>

• Typical (B = 100, S = 100): 0 mg → P = 1.00, 20 mg → 0.89, 40 mg → 0.75, 60 mg → 0.64 (a dose overshoots the peak).<br>
• ADHD, striatal values (B = 85, S = 90): 0 mg → P = 0.95, 20 mg → 1.00, 40 mg → 0.98, 60 mg → 0.95 (small gain, peak near 20 mg, then a slow decline).<br>
• ADHD, midbrain-weighted (B = 60, S = 65): 0 mg → P = 0.63, 20 mg → 0.77, 40 mg → 0.83, 60 mg → 0.86 (a dose moves clearly towards the peak).
`
    },
    {
      title: "3. The ring attractor model",
      text: String.raw`
The ring attractor is a computational explanation of how the brain keeps information in working memory after the stimulus has disappeared. The ring is a mathematical device: the neurons are not necessarily arranged in a ring in the brain.

Imagine a group of neurons, each tuned to a different location or direction. When you see something at a certain place, the neurons tuned to that place respond strongly and others respond weakly. This creates a localised peak of activity, the <b>activity bump</b>.

When the stimulus is gone, the network must keep the bump alive. It does this through two kinds of connections:

• <b>Excitation:</b> neurons with similar preferences excite each other.<br>
• <b>Inhibition:</b> prevents the whole network from firing too strongly and keeps the remembered location standing out from competing locations.

<b>Key formulas and values</b>

Connectivity between two neurons depends on the difference in their preferred directions:
$$
W(\Delta\theta) = J^- + (J^+ - J^-)\exp\left(-\frac{\Delta\theta^2}{2\sigma^2}\right)
$$

Here $\Delta\theta = \theta_i - \theta_j$, $J^+$ is the strength between neurons with similar preference, $J^-$ is the baseline connection strength and $\sigma$ sets how far excitation spreads.

Slow NMDA-mediated recurrent excitation holds the memory. The gating variable follows:
$$
\frac{ds}{dt} = -\frac{s}{\tau_s} + \alpha_s\, x\,(1 - s)
$$

Here $s$ is the fraction of open NMDA channels, $\tau_s$ the decay time constant and $x$ the effect of incoming presynaptic spikes. Because NMDA decay is slow, recurrent excitation continues after the stimulus disappears.

• Typical literature values for this kind of network: $\tau_s \approx 100$ ms, $\sigma \approx 15^\circ$ (about 0.25 rad), $J^+ \approx 1.6$ with $J^-$ set so the total connectivity averages 1.<br>
• In the simulation, the D1 performance value P from model 2 scales the effective strength of the recurrent excitation.
`
    },
    {
      title: "4. The valley model",
      text: String.raw`
The ring attractor describes how neurons form a bump to represent a remembered location. The valley model describes how <b>stable</b> that bump is, picturing the memory as a ball in a valley.

• <b>Deep valley = stable memory.</b> The ball stays in the valley and cannot easily roll out. Excitation and inhibition are well balanced and noise does not disturb the memory.<br>
• <b>Shallow valley = fragile memory.</b> The ball can easily roll out. The remembered location may drift and noise can shift the bump more easily, giving a less accurate memory.

<b>Link to dopamine.</b> A deep valley corresponds to moderate D1 stimulation, near the top of the inverted U. A shallow valley corresponds to too little or too much D1 stimulation.

<b>Key formulas and values</b>

The bump position $y$ moves in a valley with stiffness $k$ while noise pushes it around:
$$
dy = -k\,y\,dt + \sigma_n\,dW, \qquad k = k_{max}\,P(x)
$$

The valley depth and the typical drift of the memory then follow:
$$
V(y) = \tfrac{1}{2}\,k\,y^{2}, \qquad SD_{drift} = \frac{\sigma_n}{\sqrt{2k}}
$$

• <b>P(x)</b> comes from model 2, so a high performance value gives a deep valley (large k) and a small drift.<br>
• When P approaches 0 (too little or too much D1 stimulation), k approaches 0, the valley becomes flat and the drift grows without bound.<br>
• <b>k<sub>max</sub></b> and <b>σ<sub>n</sub></b> are illustrative scaling constants chosen for a clear visual, not measured values.
`
    }
  ]
};
