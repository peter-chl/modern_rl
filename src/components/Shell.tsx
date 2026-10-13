"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { parts, lectures } from "@/content/nav";

interface Section {
  id: string;
  text: string;
}

// Visible text of a heading. KaTeX renders math twice (MathML for screen
// readers plus HTML), so drop the MathML copy before reading textContent.
function headingText(h: HTMLElement): string {
  const clone = h.cloneNode(true) as HTMLElement;
  clone.querySelectorAll(".katex-mathml").forEach((m) => m.remove());
  return clone.textContent ?? "";
}

// Reads the current lecture's <h2> headings from the DOM so the sidebar can
// list them without each MDX file declaring its own outline.
function useSections(pathname: string) {
  const [sections, setSections] = useState<Section[]>([]);
  const [active, setActive] = useState<string | null>(null);

  useEffect(() => {
    const headings = Array.from(
      document.querySelectorAll<HTMLHeadingElement>(".lecture h2[id]"),
    );
    // eslint-disable-next-line react-hooks/set-state-in-effect -- syncing from DOM
    setSections(headings.map((h) => ({ id: h.id, text: headingText(h) })));
    setActive(headings[0]?.id ?? null);
    if (headings.length === 0) return;

    const onScroll = () => {
      let current = headings[0].id;
      for (const h of headings) {
        if (h.getBoundingClientRect().top <= 120) current = h.id;
      }
      setActive(current);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [pathname]);

  return { sections, active };
}

function Sidebar({
  pathname,
  onNavigate,
}: {
  pathname: string;
  onNavigate: () => void;
}) {
  const { sections, active } = useSections(pathname);
  // Strip slashes and a trailing ".html" (static hosts may serve either form).
  const currentSlug = pathname
    .replace(/^\/|\/$|\.html$/g, "")
    .replace(/^index$/, "");

  return (
    <nav className="space-y-6 text-sm" aria-label="Sections">
      <Link
        href="/"
        onClick={onNavigate}
        className={`block rounded px-2 py-1 transition-colors ${
          currentSlug === ""
            ? "bg-accent-soft font-medium text-accent"
            : "text-muted hover:text-foreground"
        }`}
      >
        Contents
      </Link>
      {parts.map((part, pi) => (
        <div key={part.title}>
          <div className="mb-2 px-2 text-[0.7rem] font-semibold uppercase tracking-wider text-muted">
            Part {pi + 1} · {part.title}
          </div>
          <ul className="space-y-0.5">
            {part.lectures.map((l) => {
              const n = lectures.find((x) => x.slug === l.slug)!.number;
              const isCurrent = currentSlug === l.slug;
              return (
                <li key={l.slug}>
                  <Link
                    href={`/${l.slug}`}
                    onClick={onNavigate}
                    aria-current={isCurrent ? "page" : undefined}
                    className={`flex gap-2 rounded px-2 py-1.5 leading-snug transition-colors ${
                      isCurrent
                        ? "bg-accent-soft font-medium text-accent"
                        : "text-foreground/80 hover:bg-surface hover:text-foreground"
                    }`}
                  >
                    <span className="w-5 shrink-0 text-right tabular-nums text-muted">
                      {n}
                    </span>
                    <span>{l.title}</span>
                  </Link>
                  {isCurrent && sections.length > 0 && (
                    <ul className="mt-1 mb-2 ml-[1.15rem] space-y-0.5 border-l border-border pl-3">
                      {sections.map((s, si) => (
                        <li key={s.id}>
                          <a
                            href={`#${s.id}`}
                            onClick={onNavigate}
                            className={`flex gap-2 py-0.5 leading-snug transition-colors ${
                              active === s.id
                                ? "text-accent"
                                : "text-muted hover:text-foreground"
                            }`}
                          >
                            <span className="shrink-0 tabular-nums">
                              {n}.{si + 1}
                            </span>
                            <span>{s.text}</span>
                          </a>
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </nav>
  );
}

export default function Shell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
  }, [open]);

  return (
    <>
      <header className="sticky top-0 z-30 h-14 border-b border-border bg-background/90 backdrop-blur">
        <div className="flex h-full items-center gap-3 px-4 lg:px-6">
          <button
            type="button"
            onClick={() => setOpen((o) => !o)}
            className="-ml-1 rounded p-1.5 text-muted hover:bg-surface hover:text-foreground lg:hidden"
            aria-label={open ? "Close navigation" : "Open navigation"}
            aria-expanded={open}
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
              {open ? (
                <path d="M5 5l10 10M15 5L5 15" />
              ) : (
                <path d="M3 6h14M3 10h14M3 14h14" />
              )}
            </svg>
          </button>
          <Link href="/" onClick={close} className="flex items-baseline gap-2">
            <span className="font-serif text-lg font-semibold tracking-tight">
              Modern Reinforcement Learning
            </span>
            <span className="hidden text-xs text-muted sm:inline">
              Notes
            </span>
          </Link>
          <a
            href="https://github.com/peter-chl/modern_rl"
            target="_blank"
            rel="noopener noreferrer"
            className="ml-auto text-sm text-muted transition-colors hover:text-foreground"
          >
            GitHub
          </a>
        </div>
      </header>

      <div className="flex">
        {/* Desktop sidebar */}
        <aside className="sticky top-14 hidden h-[calc(100vh-3.5rem)] w-72 shrink-0 overflow-y-auto border-r border-border px-4 py-6 lg:block">
          <Sidebar pathname={pathname} onNavigate={() => {}} />
        </aside>

        {/* Mobile drawer */}
        {open && (
          <div className="fixed inset-0 top-14 z-20 lg:hidden">
            <div className="absolute inset-0 bg-black/30" onClick={close} />
            <aside className="absolute inset-y-0 left-0 w-80 max-w-[85vw] overflow-y-auto border-r border-border bg-background px-4 py-6">
              <Sidebar pathname={pathname} onNavigate={close} />
            </aside>
          </div>
        )}

        <main className="min-w-0 flex-1">{children}</main>
      </div>
    </>
  );
}
