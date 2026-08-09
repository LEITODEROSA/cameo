import Link from "next/link";

const NAV_LINKS = [
  { label: "Nueva Colección", href: "#nueva-coleccion" },
  { label: "Mujer", href: "#mujer" },
  { label: "Hombre", href: "#hombre" },
  { label: "Accesorios", href: "#accesorios" },
  { label: "Sobre Nosotros", href: "#nosotros" },
];

export default function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-line bg-background/90 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6 lg:px-10">
        <Link
          href="/"
          className="text-lg font-semibold tracking-widest-plus uppercase"
        >
          Studio
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-xs uppercase tracking-widest-plus text-foreground/80 transition-colors hover:text-foreground"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-5 text-xs uppercase tracking-widest-plus">
          <button aria-label="Buscar" className="hover:opacity-60">
            Buscar
          </button>
          <button aria-label="Carrito" className="hover:opacity-60">
            Bolsa (0)
          </button>
        </div>
      </div>
    </header>
  );
}
