import Link from "next/link";
import { createBrand, deleteBrand } from "@/lib/dashboard/actions";
import { readData } from "@/lib/dashboard/store";

export default async function MarcasPage() {
  const data = await readData();
  const competitors = data.brands.filter((b) => !b.isOwn);

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-2xl font-semibold">Marcas competidoras</h1>
        <p className="mt-1 text-sm text-neutral-400">
          Agregá cada marca que querés seguir. Después vas a poder cargarle posteos, historias y anuncios.
        </p>
      </div>

      <section className="rounded-xl border border-white/10 bg-white/[0.02] p-5">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-neutral-300">Agregar marca</h2>
        <form action={createBrand} className="mt-4 grid gap-4 sm:grid-cols-2">
          <Field label="Nombre de la marca">
            <input name="name" required className="input" placeholder="Ej: Two Hips" />
          </Field>
          <Field label="Segmento">
            <select name="segment" className="input">
              <option>Mujer</option>
              <option>Hombre</option>
              <option>Unisex</option>
              <option>Niños</option>
            </select>
          </Field>
          <Field label="Instagram (@handle)">
            <input name="instagramHandle" className="input" placeholder="@marca" />
          </Field>
          <Field label="TikTok (@handle)">
            <input name="tiktokHandle" className="input" placeholder="@marca" />
          </Field>
          <Field label="País / mercado">
            <input name="country" className="input" defaultValue="Argentina" />
          </Field>
          <Field label="Notas (posicionamiento, por qué la seguís)">
            <input name="notes" className="input" placeholder="Ej: referente en estética minimal" />
          </Field>
          <div className="sm:col-span-2">
            <button className="btn-primary" type="submit">
              Agregar marca
            </button>
          </div>
        </form>
      </section>

      <section className="rounded-xl border border-white/10 bg-white/[0.02] p-5">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-neutral-300">
          Marcas seguidas ({competitors.length})
        </h2>
        <ul className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {competitors.length === 0 && (
            <li className="text-sm text-neutral-500">Todavía no agregaste ninguna marca.</li>
          )}
          {competitors.map((brand) => (
            <li key={brand.id} className="rounded-lg border border-white/10 p-4">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <Link href={`/dashboard/marcas/${brand.id}`} className="font-medium hover:underline">
                    {brand.name}
                  </Link>
                  <div className="mt-1 text-xs text-neutral-400">
                    {brand.segment} · {brand.country}
                  </div>
                  {brand.instagramHandle && (
                    <div className="mt-1 text-xs text-neutral-500">IG: {brand.instagramHandle}</div>
                  )}
                </div>
                <form action={deleteBrand}>
                  <input type="hidden" name="id" value={brand.id} />
                  <button className="text-xs text-neutral-500 hover:text-red-400" type="submit">
                    Quitar
                  </button>
                </form>
              </div>
              {brand.notes && <p className="mt-2 text-xs text-neutral-400">{brand.notes}</p>}
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="flex flex-col gap-1 text-sm">
      <span className="text-xs text-neutral-400">{label}</span>
      {children}
    </label>
  );
}
