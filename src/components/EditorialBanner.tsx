export default function EditorialBanner() {
  return (
    <section className="mx-auto grid max-w-7xl grid-cols-1 gap-px bg-line md:grid-cols-2">
      <div className="editorial-block-alt relative aspect-[4/5] md:aspect-auto" />
      <div className="flex flex-col justify-center bg-background px-8 py-16 lg:px-16">
        <p className="text-xs uppercase tracking-widest-plus text-muted">
          Lookbook SS26
        </p>
        <h2 className="font-editorial mt-4 max-w-md text-4xl italic leading-tight sm:text-5xl">
          Siluetas fluidas, materiales naturales.
        </h2>
        <p className="mt-6 max-w-sm text-sm text-muted">
          Una cápsula pensada para el uso diario: lino, algodón orgánico y
          lana liviana en una paleta neutra.
        </p>
        <a
          href="#nueva-coleccion"
          className="mt-8 inline-block w-fit border-b border-foreground pb-1 text-xs uppercase tracking-widest-plus"
        >
          Ver lookbook
        </a>
      </div>
    </section>
  );
}
