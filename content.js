// Edit only this file to change the text on the "About the models" tab.
// Separate paragraphs with a blank line. Simple HTML (<b>, <i>, <sub>, <sup>) works.

const CONTENT = {
  intro: `
Write a short introduction here: what the sliders mean and what the reader should look at.

Second paragraph of the introduction (optional).
`,
  models: [
    {
      title: "1. Dopamine, Reuptake, ADHD, and Methylphenidate",
      text: `
Dopamine is a neurotransmitter in the brain that plays a role in the reward center and many body functions including memory, movement, motivation, mood, attention, and more. 

ADHD is an example of a neurodevelopmental disorder associated with dopamine dysregulation. The dopamine hypothesis of ADHD suggests ADHD is driven by some involvement of reduced levels of DA neurotransmitters, but it is not a defining feature. In our model a dopamine baseline is used, a low dopamine baseline is equal to the reduced signalling associated with ADHD.

When neurotransmitters are released in the synapse, the process of reuptake occurs. Reuptake is the absorption of a neurotransmitter by a neurotransmitter transporter located along the plasma membrane of an axon terminal or glial cell. 

Differences in dopamine reuptake contributes to altered dopamine signalling in people with ADHD. Specific genes result in higher levels of dopamine transporter channels within the brain. More dopamine channels means that dopamine will be removed more effectively from the synapse, meaning it has less chance of binding with receptors. 

Methylphenidate is a CNS stimulant approved for treatment of ADHD. It inhibits the reuptake of dopamine by blocking transporters. This leads to an increased availability of dopamine in the synaptic space. The inhibitors work by physically blocking the channel. 
The methylphenidate in the model is shown with a red circle on the transporters, more methylphenidate means a less transparent circle, showing more transporters are blocked.
`
    },
    {
      title: "2. Working memory and the inverted U",
      text: `
Brain dopamine has long been implicated in cognitive control processes, including working-memory. The relationship of dopamine and working memory can be described as an inverted U-shaped curve. 

There are five main types of dopamine receptors. In our model we primarily focus on D1, because evidence supports an inverted-U relationship with D1 receptor stimulation and working-memory performance. D2 receptor activation also influences working-memory-related neural activity, but the relationship is less well established. 

D1 receptors are involved in memory, attention, impulse control, regulation of renal function, and locomotion. They are primarily located in the striatum and the cerebral cortex. In the prefrontal cortex, D1 receptor stimulation is generally associated with reduced neuronal firing. \n
1. Excessive stimulation: Suppression becomes too strong. The activity representing the preferred location decreases, so the neuron loses useful information and spatial tuning deteriorates. \n
2. Moderate stimulation: Activity for non-preffered locations is reduced more than activity for the preferred location. The relevant information stands out more clearly, potentially improving working memory. \n
3. Too little stimulation: Neuronal activity can be noisy, so the preferred location is not represented clearly. \n

Psychopharmacological studies with human volunteers indicate that the effect of dopaminergic drug administration depends on baseline level of performance. It improved cognition in subjects with lower baseline working-memory, and worsening cognition in those with higher baseline working memory capacity. \n
1. Low baseline (Our ADHD stand-in): There is too little stimulation of the D1 receptors. The dose moves the individual towards the peak, so performance increases. \n
2. Near peak baseline: There is moderate stimulation and the working-memory performance is already in the optimal zone. A dose gives little benefit. \n
3. High baseline: A dose pushes the individual past the peak. Resulting in excessive stimulation of the D1 receptor, and thus worsening working-memory performance. \n

`
    },
    {
      title: "3. The ring attractor model",
      text: `
The ring attractor model is a computational explanation of how the brain can keep information in working-memory even after the original stimulus has disappeared. The circle is a mathematical representation, the neurons are not necessarily physically arranged in a ring in the brain. 

For example, imagine a group of neurons in the brain, each of them is tuned to a different spatial location or direction. When you see something in a certain place, the neuron tuned to that location becomes particularly active. So neurons tuned to the location respond strongly, while neurons tuned to other locations respond less strongly. This produces a localized peak of activity, which is called an activity bump. 

When the stimulus disappears your brain needs a mechanism to keep the activity bump alive, and remember the place. The ring attractor network achieves this through connections between neurons. This is explained using two types of connections: \n
- Excitation: Neurons that prefer similar locations excite one another. \n
- Inhibition: Inhibitory connections prevent the whole network from firing too strongly. They help keep the activity selective, so the remembered location stands out from competing locations. \n

The connectivity can be described by:
$$
W(\Delta\theta)
= J^- + (J^+ - J^-)
\exp\left(-\frac{\Delta\theta^2}{2\sigma^2}\right)
$$

Here, $\Delta\theta = \theta_i - \theta_j$ describes the difference between the preferred directions of two neurons. $J^+$ controls the strength of connections between neurons with similar preference, $J^-$ represents the baseline connection strength, and $\sigma$ determines how far the excitation spreads.

A key mechanism for holding the memory is the slow decay of (NMDA-mediated) recurrent excitation. The dynamics of the NMDA synaptic gating variable can be represented as:
$$
\frac{ds}{dt}
= -\frac{s}{\tau_s}

\alpha_s x(1-s)
$$

Here, $s$ represents the fraction of open NMDA channels, $\tau_s$ is the decay time constant, and $x$ represents the effect of incoming presynaptic spikes. The relatively slow NMDA dynamics allow recurrent excitation to continue a while after the stimulus disappears.
`
    },
    {
      title: "4. The valley model",
      text: `
The ring attractor model describes how neurons form an activity bump to represent a remembered location. The valley model describes the stability of that activity. 
- A deep valley = A stable memory: The ball is stable inside the valley and cannot easily roll out. The remembered location is maintained. The excitation and inhibition are well balanced, and disturbances are small. 
- A shallow valley = A fragile memory: The ball is less stable inside the valley and can easily roll out. The remembered location may drift, producing a less accurate memory. Excitation and inhibition are not well balanced and noise or other disturbances can shift the activity bump more easily. 
How does dopamine connect to this? A deep valley essentially represents a relatively stable working-mempory state, associated with moderate D1 receptor stimulation when it is near the peak of the inverted-U curve. The shallow valley represents a less stable working-memory, linked to either too little or too much D1 stimulation. 

`
    }
  ]
};
