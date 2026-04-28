import Link from "next/link";
import { siteConfig } from "@/lib/constants";

export function Footer() {
  return (
    <footer className="border-t border-[var(--color-line)] bg-[rgba(255,252,249,0.86)]">
      <div className="mx-auto grid w-full max-w-7xl gap-8 px-5 py-12 md:grid-cols-[1.4fr_1fr_1fr_1fr] md:px-8">
        <div className="space-y-4">
          <p className="font-display text-3xl text-[var(--color-foreground)]">
            {siteConfig.name}
          </p>
          <p className="max-w-md text-sm leading-7 text-[var(--color-muted)]">
            Creazioni artigianali personalizzate per eventi pieni di significato:
            bomboniere, segnaposto, decorazioni e set pronti da regalare.
          </p>
          <div className="flex items-center gap-3 pt-1">
            <Link
              href={siteConfig.instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              className="flex h-9 w-9 items-center justify-center rounded-full border border-[var(--color-line)] bg-white/70 text-[var(--color-muted)] transition hover:border-[var(--color-accent)] hover:text-[var(--color-accent)]"
            >
              <InstagramIcon className="h-4 w-4" />
            </Link>
            <Link
              href={siteConfig.facebookUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Facebook"
              className="flex h-9 w-9 items-center justify-center rounded-full border border-[var(--color-line)] bg-white/70 text-[var(--color-muted)] transition hover:border-[var(--color-accent)] hover:text-[var(--color-accent)]"
            >
              <FacebookIcon className="h-4 w-4" />
            </Link>
            <Link
              href={`https://wa.me/${siteConfig.whatsappNumber}`}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="WhatsApp"
              className="flex h-9 w-9 items-center justify-center rounded-full border border-[var(--color-line)] bg-white/70 text-[var(--color-muted)] transition hover:border-[#25D366] hover:text-[#25D366]"
            >
              <WhatsAppIcon className="h-4 w-4" />
            </Link>
          </div>
        </div>

        <div className="space-y-3 text-sm text-[var(--color-muted)]">
          <p className="font-semibold uppercase tracking-[0.2em] text-[var(--color-foreground)]">
            Contatti
          </p>
          <p>{siteConfig.phone}</p>
          <p>{siteConfig.email}</p>
          <Link
            href={siteConfig.instagramUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="block hover:text-[var(--color-accent)]"
          >
            {siteConfig.instagram}
          </Link>
        </div>

        <div className="space-y-3 text-sm text-[var(--color-muted)]">
          <p className="font-semibold uppercase tracking-[0.2em] text-[var(--color-foreground)]">
            Navigazione
          </p>
          <Link href="/catalogo" className="block hover:text-[var(--color-accent)]">
            Catalogo
          </Link>
          <Link href="/configuratore" className="block hover:text-[var(--color-accent)]">
            Configuratore
          </Link>
          <Link href="/blog" className="block hover:text-[var(--color-accent)]">
            Blog
          </Link>
          <Link href="/admin" className="block hover:text-[var(--color-accent)]">
            Area admin
          </Link>
        </div>

        <div className="space-y-3 text-sm text-[var(--color-muted)]">
          <p className="font-semibold uppercase tracking-[0.2em] text-[var(--color-foreground)]">
            Contatto rapido
          </p>
          <Link
            href={`https://wa.me/${siteConfig.whatsappNumber}?text=${encodeURIComponent(siteConfig.whatsappMessage)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full border border-[#25D366]/40 bg-[#25D366]/10 px-4 py-2 text-sm font-medium text-[#25D366] transition hover:bg-[#25D366]/20"
          >
            <WhatsAppIcon className="h-4 w-4" />
            Scrivici su WhatsApp
          </Link>
        </div>
      </div>
    </footer>
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

function FacebookIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      viewBox="0 0 24 24"
      fill="currentColor"
    >
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
    </svg>
  );
}

function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      viewBox="0 0 24 24"
      fill="currentColor"
    >
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  );
}
