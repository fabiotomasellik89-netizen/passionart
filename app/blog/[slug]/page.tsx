import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getArticleBySlug, getAllArticles } from "@/lib/blog";
import { Badge } from "@/components/ui/badge";

export async function generateStaticParams() {
  return getAllArticles().map((article) => ({ slug: article.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const article = getArticleBySlug(slug);
  if (!article) return {};
  return {
    title: article.title,
    description: article.excerpt,
  };
}

function formatDate(date: string) {
  return new Intl.DateTimeFormat("it-IT", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(new Date(date));
}

function renderContent(content: string) {
  const lines = content.split("\n");
  const elements: React.ReactNode[] = [];
  let listBuffer: string[] = [];

  function flushList() {
    if (listBuffer.length === 0) return;
    elements.push(
      <ul key={`list-${elements.length}`} className="my-4 space-y-2 pl-0">
        {listBuffer.map((item, i) => (
          <li key={i} className="flex gap-2 text-base leading-7 text-[var(--color-muted)]">
            <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--color-accent)]" />
            <span>{item}</span>
          </li>
        ))}
      </ul>,
    );
    listBuffer = [];
  }

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    if (line.startsWith("## ")) {
      flushList();
      elements.push(
        <h2
          key={i}
          className="mt-10 font-display text-3xl leading-tight text-[var(--color-foreground)]"
        >
          {line.slice(3)}
        </h2>,
      );
    } else if (line.startsWith("**") && line.endsWith("**")) {
      flushList();
      const text = line.slice(2, -2);
      elements.push(
        <p key={i} className="mt-4 font-semibold text-[var(--color-foreground)]">
          {text}
        </p>,
      );
    } else if (/^\*\*[^*]+\*\*:/.test(line)) {
      flushList();
      const colonIdx = line.indexOf("**:");
      const boldPart = line.slice(2, colonIdx);
      const rest = line.slice(colonIdx + 3);
      elements.push(
        <p key={i} className="mt-4 text-base leading-7 text-[var(--color-muted)]">
          <strong className="font-semibold text-[var(--color-foreground)]">{boldPart}</strong>:{rest}
        </p>,
      );
    } else if (line.startsWith("- ")) {
      listBuffer.push(line.slice(2));
    } else if (line.trim() === "") {
      flushList();
    } else if (line.trim()) {
      flushList();
      elements.push(
        <p key={i} className="mt-4 text-base leading-7 text-[var(--color-muted)]">
          {line}
        </p>,
      );
    }
  }
  flushList();
  return elements;
}

export default async function BlogArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article = getArticleBySlug(slug);

  if (!article) notFound();

  const allArticles = getAllArticles().filter((a) => a.slug !== slug);

  return (
    <div className="px-5 py-12 md:px-8 md:py-20">
      <div className="mx-auto max-w-3xl">
        <Link
          href="/blog"
          className="mb-8 inline-flex items-center gap-2 text-sm font-medium text-[var(--color-muted)] transition hover:text-[var(--color-accent)]"
        >
          <BackIcon className="h-4 w-4" />
          Tutti gli articoli
        </Link>

        <div
          className={`relative mb-10 h-52 w-full overflow-hidden rounded-[2.5rem] bg-gradient-to-br ${article.coverGradient}`}
        >
          <div className="absolute inset-0 flex items-end p-7">
            <Badge>{article.category}</Badge>
          </div>
        </div>

        <div className="mb-2 flex flex-wrap items-center gap-3 text-xs text-[var(--color-muted)]">
          <span>{formatDate(article.publishedAt)}</span>
          <span>&middot;</span>
          <span>{article.readingTime} min di lettura</span>
        </div>

        <h1 className="font-display text-4xl leading-tight text-[var(--color-foreground)] md:text-5xl">
          {article.title}
        </h1>

        <p className="mt-4 text-lg leading-8 text-[var(--color-muted)]">{article.excerpt}</p>

        <hr className="my-10 border-[var(--color-line)]" />

        <div className="prose-passionart">{renderContent(article.content)}</div>

        <div className="mt-14 flex flex-wrap gap-2">
          {article.tags.map((tag) => (
            <span
              key={tag}
              className="rounded-full border border-[var(--color-line)] bg-white/70 px-4 py-1.5 text-xs font-medium text-[var(--color-muted)]"
            >
              #{tag}
            </span>
          ))}
        </div>

        {allArticles.length > 0 && (
          <div className="mt-16">
            <p className="mb-6 font-display text-2xl text-[var(--color-foreground)]">
              Altri articoli
            </p>
            <div className="grid gap-5 sm:grid-cols-2">
              {allArticles.slice(0, 2).map((related) => (
                <Link
                  key={related.slug}
                  href={`/blog/${related.slug}`}
                  className="group flex flex-col overflow-hidden rounded-[2rem] border border-[var(--color-line)] bg-white/78 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md"
                >
                  <div
                    className={`h-28 w-full bg-gradient-to-br ${related.coverGradient}`}
                  />
                  <div className="flex-1 p-5">
                    <p className="text-xs text-[var(--color-muted)]">{related.category}</p>
                    <h3 className="mt-1 font-display text-xl leading-tight text-[var(--color-foreground)] group-hover:text-[var(--color-accent)] transition-colors">
                      {related.title}
                    </h3>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function BackIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m15 18-6-6 6-6" />
    </svg>
  );
}
