const TILES: Array<"editorial-block" | "editorial-block-alt" | "editorial-block-dark"> = [
  "editorial-block",
  "editorial-block-alt",
  "editorial-block-dark",
  "editorial-block-alt",
  "editorial-block",
  "editorial-block-dark",
];

export default function InstagramGrid() {
  return (
    <section className="mx-auto max-w-7xl px-6 py-20 lg:px-10">
      <div className="mb-10 flex items-end justify-between">
        <h2 className="text-2xl font-medium tracking-tight sm:text-3xl">
          Seguinos @studio
        </h2>
      </div>
      <div className="grid grid-cols-3 gap-1 sm:grid-cols-6">
        {TILES.map((tone, index) => (
          <a key={index} href="#" className="group relative block aspect-square overflow-hidden">
            <div className={`${tone} absolute inset-0 transition-transform duration-500 group-hover:scale-105`} />
          </a>
        ))}
      </div>
    </section>
  );
}
