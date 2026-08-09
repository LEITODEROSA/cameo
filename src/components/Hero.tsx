export default function Hero() {
  return (
    <section className="relative flex h-[92vh] min-h-[560px] w-full items-end overflow-hidden">
      <div className="editorial-block-dark absolute inset-0" />
      <div className="relative z-10 w-full px-6 pb-16 text-white lg:px-10 lg:pb-24">
        <p className="text-xs uppercase tracking-widest-plus text-white/70">
          Colección Primavera / Verano
        </p>
        <h1 className="mt-4 max-w-2xl text-5xl font-medium leading-[1.05] tracking-tight sm:text-6xl lg:text-7xl">
          Menos ruido,
          <br />
          más forma.
        </h1>
        <div className="mt-8 flex flex-wrap gap-4">
          <a
            href="#nueva-coleccion"
            className="bg-white px-8 py-3 text-xs uppercase tracking-widest-plus text-black transition-colors hover:bg-white/85"
          >
            Ver colección
          </a>
          <a
            href="#nosotros"
            className="border border-white/60 px-8 py-3 text-xs uppercase tracking-widest-plus text-white transition-colors hover:border-white"
          >
            Nuestra historia
          </a>
        </div>
      </div>
    </section>
  );
}
