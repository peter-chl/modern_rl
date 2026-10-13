import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { lectures, getLecture } from "@/content/nav";

export const dynamicParams = false;

export function generateStaticParams() {
  return lectures.map((l) => ({ slug: l.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const lecture = getLecture(slug);
  if (!lecture) return { title: "Not Found" };
  return {
    title: `${lecture.number}. ${lecture.title}`,
    description: lecture.summary,
    openGraph: {
      title: lecture.title,
      description: lecture.summary,
      type: "article",
    },
  };
}

export default async function LecturePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const lecture = getLecture(slug);
  if (!lecture) notFound();

  const { default: Content } = await import(`@/content/${slug}.mdx`);
  const prev = lectures[lecture.number - 2];
  const next = lectures[lecture.number];

  return (
    <div
      className="mx-auto max-w-3xl px-5 py-10 sm:px-8 lg:py-14"
      style={{ counterReset: `lecture ${lecture.number}` }}
    >
      <header className="mb-10">
        <div className="text-xs font-semibold uppercase tracking-wider text-muted">
          Section {lecture.number} · {lecture.part}
        </div>
        <h1 className="mt-2 font-serif text-3xl font-semibold leading-tight tracking-tight sm:text-4xl">
          {lecture.title}
        </h1>
        <p className="mt-3 font-serif text-lg italic leading-relaxed text-muted">
          {lecture.summary}
        </p>
      </header>

      <article className="lecture">
        <Content />
      </article>

      <nav className="mt-16 grid gap-3 border-t border-border pt-6 sm:grid-cols-2">
        {prev ? (
          <Link
            href={`/${prev.slug}`}
            className="rounded-md border border-border px-4 py-3 transition-colors hover:border-accent"
          >
            <div className="text-xs text-muted">← Section {prev.number}</div>
            <div className="mt-0.5 text-sm font-medium">{prev.title}</div>
          </Link>
        ) : (
          <span />
        )}
        {next && (
          <Link
            href={`/${next.slug}`}
            className="rounded-md border border-border px-4 py-3 text-right transition-colors hover:border-accent"
          >
            <div className="text-xs text-muted">Section {next.number} →</div>
            <div className="mt-0.5 text-sm font-medium">{next.title}</div>
          </Link>
        )}
      </nav>
    </div>
  );
}
