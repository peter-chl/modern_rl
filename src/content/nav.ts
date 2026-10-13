// Table of contents. Order here defines lecture numbering, the sidebar, and
// prev/next links. Each slug must have a matching src/content/<slug>.mdx.

export interface Lecture {
  slug: string;
  title: string;
  summary: string;
}

export interface Part {
  title: string;
  lectures: Lecture[];
}

export const parts: Part[] = [
  {
    title: "Introduction and Classical RL",
    lectures: [
      {
        slug: "introduction",
        title: "What Is Reinforcement Learning?",
        summary:
          "Learning from reward rather than from labels: Markov decision processes, returns and value functions, the Bellman equations, and the classical families of algorithms built on them.",
      },
      {
        slug: "td-learning",
        title: "Temporal-Difference Learning and Q-Learning",
        summary:
          "Learning values from sampled transitions: TD(0) as stochastic approximation, n-step returns and TD(λ), SARSA and Q-learning with their convergence, maximization bias, function approximation and DQN, and where value learning reappears in large models.",
      },
      {
        slug: "policy-gradients",
        title: "Policy Gradients and PPO",
        summary:
          "Differentiating expected reward directly: the policy gradient theorem, baselines and advantages, actor–critic methods, and the trust-region idea behind TRPO and PPO that every later section reuses.",
      },
    ],
  },
  {
    title: "RL for LLMs",
    lectures: [
      {
        slug: "rlhf",
        title: "Learning from Human Preferences",
        summary:
          "A language model as a policy over tokens: reward models from pairwise comparisons, KL-regularized PPO, reward hacking, and the direct preference methods that skip the reward model altogether.",
      },
      {
        slug: "rlvr",
        title: "Reasoning with Verifiable Rewards",
        summary:
          "Replacing a learned reward with a checker: group-relative advantages and GRPO, the critic-free family it belongs to, process versus outcome rewards, and what RL does and does not add to a pretrained model.",
      },
    ],
  },
  {
    title: "RL for VLAs",
    lectures: [
      {
        slug: "vla",
        title: "Vision-Language-Action Models",
        summary:
          "Robot policies built on vision-language backbones: how actions are represented, why imitation alone falls short, and how RL fine-tuning is done in simulation and on real robots, including for diffusion and flow-matching action heads.",
      },
    ],
  },
  {
    title: "RL for VLMs",
    lectures: [
      {
        slug: "vlm",
        title: "Vision-Language Models",
        summary:
          "Perception adds new failure modes: preference learning against hallucination, verifiable rewards for grounding and visual reasoning, and the question of whether a model reasoning in text is still looking at the image.",
      },
    ],
  },
  {
    title: "RL for Image and Video Generation",
    lectures: [
      {
        slug: "generation",
        title: "Diffusion and Flow Models",
        summary:
          "Denoising as a sequential decision problem: policy gradients over sampling chains, reward backpropagation, Diffusion-DPO, turning flow-matching ODEs into SDEs for GRPO, and the extra difficulties of video.",
      },
    ],
  },
];

export interface NumberedLecture extends Lecture {
  number: number;
  part: string;
}

export const lectures: NumberedLecture[] = parts.flatMap((p) => p.lectures).map(
  (l, i) => ({
    ...l,
    number: i + 1,
    part: parts.find((p) => p.lectures.includes(l))!.title,
  }),
);

export function getLecture(slug: string): NumberedLecture | undefined {
  return lectures.find((l) => l.slug === slug);
}
