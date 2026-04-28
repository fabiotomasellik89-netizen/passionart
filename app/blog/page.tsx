import type { Metadata } from "next";
import Link from "next/link";
import { getAllArticles } from "@/lib/blog";
import { SectionHeading } from "@/components/ui/section-heading";
import { Badge } from "@/components/ui/badge";
import { siteConfig } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Blog",
  description:
    "Articoli, guide e ispirazioni per rendere ogni evento unico. Consigli sulle bomboniere, tendenze e molto altro dal laboratorio PassionArt.",
};

function formatDate(date: string) {
  return new Intl.DateTimeFormat("it-IT", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(new Date(date));
}

export default function BlogPage() {
  const articles = getAllArticles();

  return (
    <div className="px-5 py-12 md:px-8 md:py-20">
      <div className="mx-auto max-w-7xl">
        <div className="mb-14">
          <SectionHeading
            eyebrow="Blog"
            title="Ispirazioni e consigli dal laboratorio."
            description="Guide pratiche, tendenze e storie artigianali per aiutarti a creare un evento indimenticabile."
          />
        </div>

        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {articles.map((article) => (
            <Link
              key={article.slug}
              href={`/blog/${article.slug}`}
              className="group flex flex-col overflow-hidden rounded-[2rem] border border-[var(--color-line)] bg-white/78 shadow-[0_25px_70px_rgba(129,92,90,0.08)] backdrop-blur-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-[0_32px_80px_rgba(129,92,90,0.14)]"
            >
              <div
                className={`h-44 w-full bg-gradient-to-br ${article.coverGradient} relative overflow-hidden`}
              >
                <div className="absolute inset-0 flex items-end p-5">
                  <Badge>{article.category}</Badge>
                </div>
              </div>
              <div className="flex flex-1 flex-col gap-3 p-6">
                <p className="text-xs text-[var(--color-muted)]">
                  {formatDate(article.publishedAt)} &middot; {article.readingTime} min di lettura
                </p>
                <h2 className="font-display text-2xl leading-tight text-[var(--color-foreground)] group-hover:text-[var(--color-accent)] transition-colors">
                  {article.title}
                </h2>
                <p className="flex-1 text-sm leading-6 text-[var(--color-muted)]">
                  {article.excerpt}
                </p>
                <span className="mt-2 inline-flex items-center gap-1 text-sm font-semibold text-[var(--color-accent)]">
                  Leggi l&apos;articolo
                  <ArrowRight className="h-3.5 w-3.5" />
                </span>
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-20 rounded-[2rem] border border-[var(--color-line)] bg-gradient-to-br from-[#f5d0db] via-[#fce8ef] to-[#f8f0e5] p-10 text-center">
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.3em] text-[var(--color-accent)]">
            Rimani aggiornato
          </p>
          <h3 className="font-display text-3xl text-[var(--color-foreground)]">
            Vuoi ricevere ispirazione direttamente?
          </h3>
          <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-[var(--color-muted)]">
            Seguici su Instagram per non perderti i nuovi articoli, i lavori in corso e le offerte
            esclusive.
          </p>
          <Link
            href={siteConfig.instagramUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-6 inline-flex items-center gap-2 rounded-full bg-[var(--color-accent)] px-6 py-3 text-sm font-semibold text-white shadow-[0_18px_40px_rgba(191,79,123,0.25)] transition hover:-translate-y-0.5 hover:bg-[var(--color-accent-strong)]"
          >
            {siteConfig.instagram}
          </Link>
        </div>
      </div>
    </div>
  );
}

function ArrowRight({ className }: { className?: string }) {
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
      <path d="M5 12h14" />
      <path d="m12 5 7 7-7 7" />
    </svg>
  );
}
