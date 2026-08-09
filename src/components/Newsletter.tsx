export default function Newsletter() {
  return (
    <section id="nosotros" className="border-t border-line bg-black text-white">
      <div className="mx-auto flex max-w-7xl flex-col items-start gap-6 px-6 py-20 lg:px-10">
        <p className="text-xs uppercase tracking-widest-plus text-white/60">
          Sobre nosotros
        </p>
        <h2 className="max-w-2xl text-3xl font-medium leading-tight tracking-tight sm:text-4xl">
          Prendas pensadas para durar, no para una temporada.
        </h2>
        <p className="max-w-xl text-sm text-white/70">
          Sumate a la lista y enterate primero de nuevas colecciones,
          producciones limitadas y eventos.
        </p>
        <form className="flex w-full max-w-md flex-col gap-3 sm:flex-row">
          <input
            type="email"
            required
            placeholder="Tu email"
            className="w-full border border-white/30 bg-transparent px-4 py-3 text-sm placeholder:text-white/50 focus:border-white focus:outline-none"
          />
          <button
            type="submit"
            className="whitespace-nowrap bg-white px-6 py-3 text-xs uppercase tracking-widest-plus text-black hover:bg-white/85"
          >
            Suscribirme
          </button>
        </form>
      </div>
    </section>
  );
}
