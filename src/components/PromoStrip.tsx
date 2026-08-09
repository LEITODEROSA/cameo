const ITEMS = [
  { title: "Envío gratis", detail: "En compras desde $120.000" },
  { title: "Cuotas sin interés", detail: "3 y 6 pagos con tarjetas seleccionadas" },
  { title: "Cambios sin cargo", detail: "Hasta 30 días desde la compra" },
];

export default function PromoStrip() {
  return (
    <section className="border-b border-line">
      <div className="mx-auto grid max-w-7xl grid-cols-1 divide-y divide-line sm:grid-cols-3 sm:divide-x sm:divide-y-0">
        {ITEMS.map((item) => (
          <div key={item.title} className="px-6 py-8 text-center lg:px-10">
            <p className="text-sm uppercase tracking-widest-plus">{item.title}</p>
            <p className="mt-2 text-xs text-muted">{item.detail}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
