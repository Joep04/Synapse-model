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
Dopamine is a neurotransmitter in the brain that plays a role in the reward center and many body functions: Memory, movement, motivation, mood, attention, and more.

ADHD is an example of people with dopamine dysregulation. The dopamine hypothesis of ADHD entails that there is evidence for some involvement of reduced levels of DA neurotransmitters but it is not a defining feature. In our model a dopamine baseline is used, a low dopamine baseline is equal to ADHD dopamine levels. 

When neurotransmitters are released in the synapse, the process of reuptake occurs. Reuptake is the absorption of a neurotransmitter by a neurotransmitter transporter located along the plasma membrane of an axon terminal or glial cell. 

The reuptake problem of dopamine in a person with ADHD entails that specific genes result in higher levels of dopamine transporter channels whitin the brian. More dopamine channels means that dopamine will be removed more effectively from the synapse, meaning it has less chance of binding with receptors. 

Methylphenidate is a CNS stimulant approved for the treatment of ADHD. It inhibits the reuptake of dopamine by blocking transporters. This leads to an increased availability of dopamine in the synaptic space. The inhibitors work by physically blocking the channel. 
`
    },
    {
      title: "Working memory and the inverted U",
      text: `
Brain dopamine has long been implicated in cognitive control processes, including working memory. The relationship of dopamine and working memory is that of an inverted u. 

There are five different types of dopamine receptors, we primarily focus on D1. The reason for this is that strong evidence supports the inverted-U relationship with D1 receptors. D2 receptor activation also influences working-memory-related neural activity, but the relationship is less well established. 

D1 receptors are involved in memory, attention, impulse control, regulation of renal function, and locomotion, they are primarily located in the striatum and the cerebral cortex. When you activate D1 receptors generally the firing rate of prefrontal neurons gets reduced. 
1) Excessive stimulation: Suppression becomes too strong. The activity representing the preferred location decreases, so the neuron loses useful information and spatial tuning deteriorates. 
2) Moderate stimulation: Activity for non-preffered locations is reduced more than activity for the preferred location. The relevant information stands out more clearly, potentially improving working memory. 
3) Too little stimulation: Neuronal activity can be noisy, so the preferred location is not represented clearly. 

Psychopharmacological studies with human volunteers indicate that the effect of dopaminergic drug administration depends on baseline level of performance. It improved cognition in subjects with lower baseline working memory, and worsening cognition in those with higher baseline working memory capacity. 
1) Low baseline (Our ADHD stand-in): There is too little stimulation of the D1 receptors. The dose moves the individual towards the peak, so performance increases. 
2) Near peak baseline: There is moderate stimulation and the working memory performance is already in the optimal zone. A dose gives little benefit. 
3) High baseline: A dose pushes the individual past the peak. Resulting in excessive stimulation of the D1 receptor, and thus worsening working memory performance.

`
    },
    {
      title: "3. The ring attractor model",
      text: `
Explain model 3 here.
`
    },
    {
      title: "4. The valley model",
      text: `
Explain model 4 here.
`
    }
  ]
};
