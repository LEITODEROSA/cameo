export type Product = {
  id: string;
  name: string;
  price: number;
  category: "Mujer" | "Hombre" | "Accesorios";
  tone: "editorial-block" | "editorial-block-alt" | "editorial-block-dark";
};

export const PRODUCTS: Product[] = [
  { id: "p1", name: "Camisa Oversize Lino", price: 68000, category: "Mujer", tone: "editorial-block" },
  { id: "p2", name: "Pantalón Sastrero Recto", price: 79000, category: "Hombre", tone: "editorial-block-alt" },
  { id: "p3", name: "Blazer Estructurado", price: 129000, category: "Mujer", tone: "editorial-block-dark" },
  { id: "p4", name: "Remera Algodón Pima", price: 34000, category: "Hombre", tone: "editorial-block" },
  { id: "p5", name: "Cinturón Cuero Vegetal", price: 45000, category: "Accesorios", tone: "editorial-block-alt" },
  { id: "p6", name: "Vestido Midi Fluido", price: 95000, category: "Mujer", tone: "editorial-block-dark" },
  { id: "p7", name: "Campera Bomber", price: 145000, category: "Hombre", tone: "editorial-block" },
  { id: "p8", name: "Bolso Tote Minimal", price: 89000, category: "Accesorios", tone: "editorial-block-alt" },
];

export function formatPrice(value: number) {
  return new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    maximumFractionDigits: 0,
  }).format(value);
}
