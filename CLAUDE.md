# modern_rl

Static Next.js site of notes on modern reinforcement learning, deployed to
GitHub Pages. Sibling of peter-chl/analytic_nt (same design and deploy setup,
different subject).

## Structure

- `src/content/nav.ts` — table of contents (parts → lectures). Source of truth
  for numbering, sidebar and prev/next.
- `src/content/<slug>.mdx` — one lecture per file, rendered by
  `src/app/[slug]/page.tsx` via dynamic import.
- `src/components/Shell.tsx` — header + left sidebar (lists the current
  lecture's `##` sections, read from the DOM).
- `src/components/Env.tsx` — Definition / Example / Result / Remark boxes.
- `src/app/globals.css` — lecture typography, section and environment
  numbering (CSS counters).

## Content rules

- Canadian English throughout: -ize (optimize, minimize) but -our, -re and
  doubled l (behaviour, centre, modelling, labelled). Keep slugs as they are.
- Section order: motivation → definitions/formulation → main results and
  methods → research directions/extensions → further reading. The site calls
  each page a "Section".
- Notation is shared across sections (see Section 1 and 2): MDP
  $(\mathcal{S}, \mathcal{A}, P, r, \gamma, \mu)$, policy $\pi_\theta$,
  return $G_t$, $V^\pi$, $Q^\pi$, $A^\pi$, objective $J(\theta)$, importance
  ratio $\rho_t(\theta)$, clip range $\epsilon$, KL coefficient $\beta$,
  reference policy $\pi_{\mathrm{ref}}$, prompt $x$ and response $y$, group
  size $K$.
- No benchmark tables or reported scores. Any number that appears must be
  verified (computed, or checked against the paper). Scratch scripts stay out
  of the repo. Leave out attribution or history claims you can't confirm.
- When a paper is supplied, build on what the PDF says and credit its authors;
  never paraphrase results from an abstract.
- In MDX prose, a bare `<` or `{` is parsed as JSX — use math mode or words.
  `$` always starts math (never use it for currency). No `\label`, `\tag` or
  `\eqref`.
- Run `npm run check` (fast) and `npm run build` before pushing.

## Git workflow

**Always push directly to `main`.** Do not open pull requests unless explicitly asked.

Use `git push origin HEAD:main` after committing.
