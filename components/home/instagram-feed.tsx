import Link from "next/link";
import { SectionHeading } from "@/components/ui/section-heading";
import { siteConfig } from "@/lib/constants";

const mockPosts = [
  {
    id: "1",
    gradient: "from-[#f5d0db] via-[#fce8ef] to-[#f2d6e8]",
    label: "Bomboniere matrimonio",
    emoji: "💍",
  },
  {
    id: "2",
    gradient: "from-[#f9f0e8] via-[#f5e6d5] to-[#edd8c8]",
    label: "Set battesimo legno",
    emoji: "🌿",
  },
  {
    id: "3",
    gradient: "from-[#f2ebdf] via-[#eee3d4] to-[#ecc2d2]",
    label: "Tag segnaposto",
    emoji: "🎀",
  },
  {
    id: "4",
    gradient: "from-[#f7e4ea] via-[#f5d6e0] to-[#f4efe5]",
    label: "Comunione stelle",
    emoji: "⭐",
  },
  {
    id: "5",
    gradient: "from-[#f3e4d8] via-[#f6ede4] to-[#f5d0db]",
    label: "Albero della vita",
    emoji: "🌳",
  },
  {
    id: "6",
    gradient: "from-[#edddd4] via-[#f2e8e0] to-[#f5c8d8]",
    label: "Packaging artigianale",
    emoji: "✨",
  },
];

export function InstagramFeed() {
  return (
    <section className="px-5 py-16 md:px-8">
      <div className="mx-auto flex max-w-7xl flex-col gap-10">
        <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
          <SectionHeading
            eyebrow="Instagram"
            title="Seguici per ispirarti ogni giorno."
            description="Bomboniere, allestimenti e lavori in corso: tutta la magia del laboratorio PassionArt su Instagram."
          />
          <Link
            href={siteConfig.instagramUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="shrink-0 inline-flex items-center gap-2 rounded-full border border-[var(--color-line)] bg-white/70 px-5 py-3 text-sm font-semibold text-[var(--color-foreground)] backdrop-blur transition hover:border-[var(--color-accent)] hover:text-[var(--color-accent)]"
          >
            <InstagramIcon className="h-4 w-4" />
            {siteConfig.instagram}
          </Link>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:gap-4">
          {mockPosts.map((post) => (
            <Link
              key={post.id}
              href={siteConfig.instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative aspect-square overflow-hidden rounded-[1.75rem]"
            >
              <div
                className={`absolute inset-0 bg-gradient-to-br ${post.gradient} transition-transform duration-300 group-hover:scale-105`}
              />
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                <div className="rounded-full border border-white/70 bg-white/80 px-4 py-2 shadow backdrop-blur-sm">
                  <p className="text-sm font-semibold text-[var(--color-foreground)]">
                    {post.label}
                  </p>
                </div>
              </div>
              <div className="absolute bottom-3 right-3 text-2xl">{post.emoji}</div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
  );
}
