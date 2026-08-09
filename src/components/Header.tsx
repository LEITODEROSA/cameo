"use client";

import Link from "next/link";
import { useState } from "react";

type MegaMenu = {
  label: string;
  columns: { title: string; items: string[] }[];
  tone: "editorial-block" | "editorial-block-alt" | "editorial-block-dark";
  promo: string;
};

const MEGA_MENUS: MegaMenu[] = [
  {
    label: "Mujer",
    tone: "editorial-block",
    promo: "Nueva colección SS26",
    columns: [
      { title: "Prendas", items: ["Camisas", "Vestidos", "Pantalones", "Blazers", "Tricot"] },
      { title: "Colecciones", items: ["Cápsula Lino", "Sastrería", "Básicos"] },
    ],
  },
  {
    label: "Hombre",
    tone: "editorial-block-alt",
    promo: "Sastrería de temporada",
    columns: [
      { title: "Prendas", items: ["Camisas", "Pantalones", "Camperas", "Remeras", "Buzos"] },
      { title: "Colecciones", items: ["Trabajo", "Fin de semana", "Básicos"] },
    ],
  },
];

const SIMPLE_LINKS = [
  { label: "Accesorios", href: "#accesorios" },
  { label: "Sobre Nosotros", href: "#nosotros" },
];

export default function Header() {
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  return (
    <header
      className="sticky top-0 z-50 border-b border-line bg-background/95 backdrop-blur"
      onMouseLeave={() => setOpenMenu(null)}
    >
      <div className="relative mx-auto flex h-20 max-w-7xl items-center justify-between px-6 lg:px-10">
        <button
          className="text-xs uppercase tracking-widest-plus md:hidden"
          onClick={() => setMobileOpen((v) => !v)}
          aria-label="Abrir menú"
        >
          Menú
        </button>

        <nav className="hidden items-center gap-8 md:flex">
          {MEGA_MENUS.map((menu) => (
            <button
              key={menu.label}
              onMouseEnter={() => setOpenMenu(menu.label)}
              onFocus={() => setOpenMenu(menu.label)}
              className={`text-xs uppercase tracking-widest-plus transition-colors ${
                openMenu === menu.label ? "text-foreground" : "text-foreground/80 hover:text-foreground"
              }`}
            >
              {menu.label}
            </button>
          ))}
          {SIMPLE_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-xs uppercase tracking-widest-plus text-foreground/80 transition-colors hover:text-foreground"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <Link
          href="/"
          className="font-editorial text-2xl italic tracking-tight md:absolute md:left-1/2 md:-translate-x-1/2"
        >
          Studio
        </Link>

        <div className="flex items-center gap-5 text-xs uppercase tracking-widest-plus">
          <button
            aria-label="Buscar"
            className="hover:opacity-60"
            onClick={() => setSearchOpen((v) => !v)}
          >
            Buscar
          </button>
          <button aria-label="Cuenta" className="hidden hover:opacity-60 sm:block">
            Cuenta
          </button>
          <button aria-label="Carrito" className="hover:opacity-60">
            Bolsa (0)
          </button>
        </div>
      </div>

      {openMenu && (
        <div className="hidden border-t border-line bg-background md:block">
          <div className="mx-auto grid max-w-7xl grid-cols-3 gap-10 px-10 py-10">
            {MEGA_MENUS.filter((m) => m.label === openMenu).map((menu) => (
              <div key={menu.label} className="col-span-3 grid grid-cols-3 gap-10">
                {menu.columns.map((column) => (
                  <div key={column.title}>
                    <p className="text-xs uppercase tracking-widest-plus text-muted">
                      {column.title}
                    </p>
                    <ul className="mt-4 space-y-3">
                      {column.items.map((item) => (
                        <li key={item}>
                          <a
                            href="#"
                            className="text-sm text-foreground/80 hover:text-foreground"
                          >
                            {item}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
                <a href="#" className="group relative block aspect-[4/5] overflow-hidden">
                  <div
                    className={`${menu.tone} absolute inset-0 transition-transform duration-500 group-hover:scale-105`}
                  />
                  <span className="relative z-10 flex h-full w-full items-end bg-gradient-to-t from-black/50 to-transparent p-5 text-xs uppercase tracking-widest-plus text-white">
                    {menu.promo}
                  </span>
                </a>
              </div>
            ))}
          </div>
        </div>
      )}

      {searchOpen && (
        <div className="border-t border-line bg-background px-6 py-6 lg:px-10">
          <div className="mx-auto flex max-w-2xl items-center gap-4">
            <input
              autoFocus
              type="search"
              placeholder="Buscar productos"
              className="w-full border-b border-line bg-transparent py-2 text-lg outline-none focus:border-foreground"
            />
            <button
              onClick={() => setSearchOpen(false)}
              className="text-xs uppercase tracking-widest-plus text-muted hover:text-foreground"
            >
              Cerrar
            </button>
          </div>
        </div>
      )}

      {mobileOpen && (
        <div className="border-t border-line bg-background px-6 py-6 md:hidden">
          <ul className="space-y-4">
            {[...MEGA_MENUS.map((m) => ({ label: m.label, href: "#" })), ...SIMPLE_LINKS].map(
              (link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-sm uppercase tracking-widest-plus"
                    onClick={() => setMobileOpen(false)}
                  >
                    {link.label}
                  </a>
                </li>
              )
            )}
          </ul>
        </div>
      )}
    </header>
  );
}
