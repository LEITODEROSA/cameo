const COLUMNS = [
  {
    title: "Tienda",
    links: ["Nueva Colección", "Mujer", "Hombre", "Accesorios", "Sale"],
  },
  {
    title: "Ayuda",
    links: ["Envíos", "Cambios y devoluciones", "Guía de talles", "Contacto"],
  },
  {
    title: "Studio",
    links: ["Sobre nosotros", "Sustentabilidad", "Trabajá con nosotros"],
  },
];

export default function Footer() {
  return (
    <footer className="border-t border-line">
      <div className="mx-auto max-w-7xl px-6 py-16 lg:px-10">
        <div className="grid grid-cols-2 gap-10 md:grid-cols-4">
          <div className="col-span-2 md:col-span-1">
            <p className="text-lg font-semibold tracking-widest-plus uppercase">
              Studio
            </p>
            <p className="mt-4 max-w-xs text-sm text-muted">
              Diseño atemporal, materiales nobles y producción responsable.
            </p>
          </div>

          {COLUMNS.map((column) => (
            <div key={column.title}>
              <p className="text-xs uppercase tracking-widest-plus text-muted">
                {column.title}
              </p>
              <ul className="mt-4 space-y-3">
                {column.links.map((link) => (
                  <li key={link}>
                    <a
                      href="#"
                      className="text-sm text-foreground/80 hover:text-foreground"
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-16 flex flex-col items-start justify-between gap-4 border-t border-line pt-8 text-xs text-muted md:flex-row md:items-center">
          <p>© {new Date().getFullYear()} Studio. Todos los derechos reservados.</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-foreground">
              Instagram
            </a>
            <a href="#" className="hover:text-foreground">
              TikTok
            </a>
            <a href="#" className="hover:text-foreground">
              Pinterest
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
