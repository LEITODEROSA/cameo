import { PRODUCTS, formatPrice } from "@/lib/products";

export default function ProductGrid() {
  return (
    <section id="nueva-coleccion" className="mx-auto max-w-7xl px-6 py-20 lg:px-10">
      <div className="mb-10 flex items-end justify-between">
        <h2 className="text-2xl font-medium tracking-tight sm:text-3xl">
          Nueva colección
        </h2>
        <a
          href="#"
          className="hidden text-xs uppercase tracking-widest-plus text-muted hover:text-foreground sm:block"
        >
          Ver todo
        </a>
      </div>

      <div className="grid grid-cols-2 gap-x-4 gap-y-10 sm:grid-cols-3 lg:grid-cols-4">
        {PRODUCTS.map((product) => (
          <article key={product.id} className="group">
            <div className="relative aspect-[3/4] overflow-hidden">
              <div
                className={`${product.tone} absolute inset-0 transition-transform duration-500 group-hover:scale-105`}
              />
            </div>
            <div className="mt-3 flex items-start justify-between gap-2">
              <div>
                <p className="text-sm">{product.name}</p>
                <p className="text-xs text-muted">{product.category}</p>
              </div>
              <p className="text-sm">{formatPrice(product.price)}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
