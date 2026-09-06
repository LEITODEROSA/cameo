import { saveOwnBrand, createContent } from "@/lib/dashboard/actions";
import { readData } from "@/lib/dashboard/store";
import { formatDate } from "@/lib/dashboard/metrics";

export default async function MiMarcaPage() {
  const data = await readData();
  const own = data.brands.find((b) => b.isOwn);
  const ownContent = data.content
    .filter((c) => c.brandId === own?.id)
    .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());

  if (!own) return null;

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-2xl font-semibold">Mi marca</h1>
        <p className="mt-1 text-sm text-neutral-400">
          Esta ficha es tu referencia: comparás lo que publicás vos contra lo que hacen los competidores.
        </p>
      </div>

      <section className="rounded-xl border border-white/10 bg-white/[0.02] p-5">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-neutral-300">Datos de la marca</h2>
        <form action={saveOwnBrand} className="mt-4 grid gap-4 sm:grid-cols-2">
          <Field label="Nombre">
            <input name="name" defaultValue={own.name} className="input" />
          </Field>
          <Field label="Segmento">
            <select name="segment" defaultValue={own.segment} className="input">
              <option>Mujer</option>
              <option>Hombre</option>
              <option>Unisex</option>
              <option>Niños</option>
            </select>
          </Field>
          <Field label="Instagram (@handle)">
            <input name="instagramHandle" defaultValue={own.instagramHandle} className="input" />
          </Field>
          <Field label="TikTok (@handle)">
            <input name="tiktokHandle" defaultValue={own.tiktokHandle} className="input" />
          </Field>
          <Field label="País / mercado">
            <input name="country" defaultValue={own.country} className="input" />
          </Field>
          <Field label="Notas de posicionamiento">
            <input name="notes" defaultValue={own.notes} className="input" placeholder="Público objetivo, propuesta de valor, tono de marca" />
          </Field>
          <div className="sm:col-span-2">
            <button className="btn-primary" type="submit">
              Guardar
            </button>
          </div>
        </form>
      </section>

      <section className="rounded-xl border border-white/10 bg-white/[0.02] p-5">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-neutral-300">
          Cargar mi propio contenido publicado
        </h2>
        <p className="mt-1 text-xs text-neutral-500">
          Así podés comparar tu engagement contra las tendencias de la competencia.
        </p>
        <form action={createContent} className="mt-4 grid gap-4 sm:grid-cols-2">
          <input type="hidden" name="brandId" value={own.id} />
          <Field label="Plataforma">
            <select name="platform" className="input">
              <option>Instagram</option>
              <option>TikTok</option>
              <option>Facebook</option>
            </select>
          </Field>
          <Field label="Formato">
            <select name="format" className="input">
              <option>Post</option>
              <option>Reel</option>
              <option>Historia</option>
              <option>Video</option>
              <option>Anuncio</option>
            </select>
          </Field>
          <Field label="Fecha">
            <input type="date" name="publishedAt" className="input" defaultValue={new Date().toISOString().slice(0, 10)} />
          </Field>
          <Field label="Link">
            <input name="url" className="input" />
          </Field>
          <Field label="Likes">
            <input type="number" min={0} name="likes" className="input" />
          </Field>
          <Field label="Views">
            <input type="number" min={0} name="views" className="input" />
          </Field>
          <Field label="Compartidos">
            <input type="number" min={0} name="shares" className="input" />
          </Field>
          <Field label="Guardados">
            <input type="number" min={0} name="saves" className="input" />
          </Field>
          <div className="sm:col-span-2">
            <button className="btn-primary" type="submit">
              Guardar mi pieza
            </button>
          </div>
        </form>
      </section>

      <section className="rounded-xl border border-white/10 bg-white/[0.02] p-5">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-neutral-300">
          Mi historial ({ownContent.length})
        </h2>
        <ul className="mt-4 flex flex-col gap-2 text-sm">
          {ownContent.length === 0 && <li className="text-neutral-500">Sin piezas propias cargadas.</li>}
          {ownContent.map((c) => (
            <li key={c.id} className="flex justify-between border-b border-white/5 pb-2">
              <span>
                {c.platform} · {c.format} · {formatDate(c.publishedAt)}
              </span>
              <span className="text-neutral-400">
                {c.metrics.likes ?? 0} likes · {c.metrics.views ?? 0} views
              </span>
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
