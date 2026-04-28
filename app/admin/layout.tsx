import Link from "next/link";
import { Home, ImageIcon, Package, Settings, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";

const navItems = [
  { href: "/admin", label: "Dashboard", icon: Home },
  { href: "/admin/prodotti", label: "Prodotti", icon: Package },
  { href: "/admin/lavori-realizzati", label: "Lavori realizzati", icon: ImageIcon },
  { href: "/admin/ordini", label: "Ordini", icon: ShoppingBag },
  { href: "/admin/configuratore", label: "Configuratore", icon: Settings },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[var(--color-background)]">
      <div className="mx-auto grid min-h-screen max-w-7xl gap-6 px-5 py-6 md:px-8 lg:grid-cols-[260px_1fr]">
        <aside className="rounded-[2rem] border border-[var(--color-line)] bg-white/80 p-5 shadow-[0_25px_70px_rgba(129,92,90,0.08)]">
          <div className="space-y-2 border-b border-[var(--color-line)] pb-5">
            <p className="font-display text-3xl text-[var(--color-foreground)]">
              PassionArt Admin
            </p>
            <p className="text-sm text-[var(--color-muted)]">
              Gestione catalogo, vetrina lavori e ordini.
            </p>
          </div>
          <nav className="mt-5 space-y-2">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center gap-3 rounded-[1.5rem] px-4 py-3 text-sm font-medium text-[var(--color-foreground)] transition hover:bg-[var(--color-surface)]"
              >
                <item.icon className="h-4 w-4 text-[var(--color-accent)]" />
                {item.label}
              </Link>
            ))}
          </nav>
          <form
            className="mt-6"
            action="/api/admin/logout"
            method="post"
          >
            <Button type="submit" variant="secondary" className="w-full">
              Esci
            </Button>
          </form>
        </aside>
        <main>{children}</main>
      </div>
    </div>
  );
}