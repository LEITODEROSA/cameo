const CATEGORIES = [
  { id: "mujer", label: "Mujer", tone: "editorial-block" },
  { id: "hombre", label: "Hombre", tone: "editorial-block-alt" },
  { id: "accesorios", label: "Accesorios", tone: "editorial-block-dark" },
];

export default function CategoryGrid() {
  return (
    <section className="mx-auto max-w-7xl px-6 py-20 lg:px-10">
      <div className="mb-10 flex items-end justify-between">
        <h2 className="text-2xl font-medium tracking-tight sm:text-3xl">
          Explorá por categoría
        </h2>
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {CATEGORIES.map((category) => (
          <a
            key={category.id}
            id={category.id}
            href="#"
            className="group relative flex aspect-[3/4] items-end overflow-hidden"
          >
            <div
              className={`${category.tone} absolute inset-0 transition-transform duration-500 group-hover:scale-105`}
            />
            <span className="relative z-10 w-full bg-gradient-to-t from-black/60 to-transparent p-6 text-sm uppercase tracking-widest-plus text-white">
              {category.label}
            </span>
          </a>
        ))}
      </div>
    </section>
  );
}
