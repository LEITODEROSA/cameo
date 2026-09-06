import Link from "next/link";

const NAV = [
  { href: "/dashboard", label: "Resumen" },
  { href: "/dashboard/estrategia", label: "Estrategia" },
  { href: "/dashboard/contenido", label: "Contenido" },
  { href: "/dashboard/marcas", label: "Marcas" },
  { href: "/dashboard/tendencias", label: "Tendencias" },
  { href: "/dashboard/anuncios", label: "Anuncios (Ad Library)" },
  { href: "/dashboard/integraciones", label: "Integraciones" },
  { href: "/dashboard/mi-marca", label: "Mi marca" },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#0b0b0c] text-neutral-100">
      <div className="mx-auto flex max-w-7xl">
        <aside className="sticky top-0 hidden h-screen w-60 shrink-0 flex-col border-r border-white/10 px-5 py-6 md:flex">
          <Link href="/dashboard" className="mb-8 text-sm font-semibold tracking-widest-plus uppercase">
            Competitor HQ
          </Link>
          <nav className="flex flex-col gap-1">
            {NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="rounded-md px-3 py-2 text-sm text-neutral-300 transition hover:bg-white/5 hover:text-white"
              >
                {item.label}
              </Link>
            ))}
          </nav>
          <div className="mt-auto pt-6 text-xs text-neutral-500">
            Uso personal · datos cargados a mano + Meta Ad Library
          </div>
        </aside>
        <main className="min-h-screen flex-1 px-5 py-6 md:px-10 md:py-10">{children}</main>
      </div>
    </div>
  );
}
