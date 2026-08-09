const COLUMNS = [
  {
    title: "Categorías",
    links: ["Nueva Colección", "Mujer", "Hombre", "Accesorios", "Sale"],
  },
  {
    title: "Ayuda",
    links: ["Envíos", "Cambios y devoluciones", "Guía de talles", "Medios de pago", "Contacto"],
  },
  {
    title: "Institucional",
    links: ["Sobre nosotros", "Sustentabilidad", "Trabajá con nosotros", "Términos y condiciones"],
  },
];

const PAYMENT_METHODS = ["Visa", "Mastercard", "Mercado Pago", "Amex"];
const SOCIALS = ["Instagram", "TikTok", "Pinterest"];

export default function Footer() {
  return (
    <footer className="border-t border-line">
      <div className="mx-auto max-w-7xl px-6 py-16 lg:px-10">
        <div className="grid grid-cols-2 gap-10 md:grid-cols-5">
          <div className="col-span-2 md:col-span-2">
            <p className="font-editorial text-2xl italic">Studio</p>
            <p className="mt-4 max-w-xs text-sm text-muted">
              Diseño atemporal, materiales nobles y producción responsable.
            </p>

            <p className="mt-8 text-xs uppercase tracking-widest-plus text-muted">
              Newsletter
            </p>
            <form className="mt-3 flex max-w-xs border-b border-line focus-within:border-foreground">
              <input
                type="email"
                required
                placeholder="Tu email"
                className="w-full bg-transparent py-2 text-sm placeholder:text-muted focus:outline-none"
              />
              <button
                type="submit"
                className="text-xs uppercase tracking-widest-plus text-foreground/70 hover:text-foreground"
              >
                Enviar
              </button>
            </form>
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

        <div className="mt-16 flex flex-col gap-6 border-t border-line pt-8 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-wrap gap-3">
            {PAYMENT_METHODS.map((method) => (
              <span
                key={method}
                className="border border-line px-3 py-1 text-[10px] uppercase tracking-widest-plus text-muted"
              >
                {method}
              </span>
            ))}
          </div>
          <div className="flex gap-6 text-xs uppercase tracking-widest-plus">
            {SOCIALS.map((social) => (
              <a key={social} href="#" className="text-muted hover:text-foreground">
                {social}
              </a>
            ))}
          </div>
        </div>

        <div className="mt-8 flex flex-col items-start justify-between gap-4 border-t border-line pt-8 text-xs text-muted md:flex-row md:items-center">
          <p>© {new Date().getFullYear()} Studio. Todos los derechos reservados.</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-foreground">
              Argentina · Español
            </a>
            <a href="#" className="hover:text-foreground">
              Privacidad
            </a>
            <a href="#" className="hover:text-foreground">
              Términos
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
