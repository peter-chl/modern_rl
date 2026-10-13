import Link from "next/link";
import { parts, lectures } from "@/content/nav";

export default function Contents() {
  return (
    <div className="mx-auto max-w-3xl px-5 py-10 sm:px-8 lg:py-14">
      <header className="mb-12">
        <div className="text-xs font-semibold uppercase tracking-wider text-muted">
          Notes
        </div>
        <h1 className="mt-2 font-serif text-4xl font-semibold leading-tight tracking-tight sm:text-5xl">
          Modern Reinforcement Learning
        </h1>
        <p className="mt-5 font-serif text-lg leading-relaxed text-muted">
          Each section takes one kind of model — a language model, a robot
          policy, a vision-language model, an image or video generator — and
          asks the same questions of it: what the policy, the action and the
          reward are, how the classical objective has to change to fit, which
          algorithms make it work at scale, and where the open problems lie.
        </p>
      </header>

      <div className="space-y-10">
        {parts.map((part, pi) => (
          <section key={part.title}>
            <h2 className="mb-3 border-b border-border pb-2 text-xs font-semibold uppercase tracking-wider text-muted">
              Part {pi + 1} · {part.title}
            </h2>
            <ol className="space-y-1">
              {part.lectures.map((l) => {
                const n = lectures.find((x) => x.slug === l.slug)!.number;
                return (
                  <li key={l.slug}>
                    <Link
                      href={`/${l.slug}`}
                      className="group -mx-3 flex gap-4 rounded-md px-3 py-3 transition-colors hover:bg-surface"
                    >
                      <span className="w-6 shrink-0 pt-0.5 text-right font-serif text-lg tabular-nums text-muted">
                        {n}
                      </span>
                      <span>
                        <span className="block font-serif text-lg font-semibold group-hover:text-accent">
                          {l.title}
                        </span>
                        <span className="mt-0.5 block text-sm leading-relaxed text-muted">
                          {l.summary}
                        </span>
                      </span>
                    </Link>
                  </li>
                );
              })}
            </ol>
          </section>
        ))}
      </div>
    </div>
  );
}
