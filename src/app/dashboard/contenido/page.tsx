import { createContent, deleteContent } from "@/lib/dashboard/actions";
import { readData } from "@/lib/dashboard/store";
import { AESTHETIC_TAGS } from "@/lib/dashboard/types";
import { engagementScore, formatDate } from "@/lib/dashboard/metrics";

export default async function ContenidoPage({
  searchParams,
}: {
  searchParams: Promise<{ brandId?: string; platform?: string; format?: string }>;
}) {
  const { brandId, platform, format } = await searchParams;
  const data = await readData();
  const brands = data.brands;

  const filtered = data.content
    .filter((c) => !brandId || c.brandId === brandId)
    .filter((c) => !platform || c.platform === platform)
    .filter((c) => !format || c.format === format)
    .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-2xl font-semibold">Contenido</h1>
        <p className="mt-1 text-sm text-neutral-400">
          Cargá cada post, historia, video o anuncio que veas de un competidor, con sus métricas.
        </p>
      </div>

      <section className="rounded-xl border border-white/10 bg-white/[0.02] p-5">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-neutral-300">Cargar pieza</h2>
        <form action={createContent} className="mt-4 grid gap-4 sm:grid-cols-2">
          <Field label="Marca">
            <select name="brandId" required className="input" defaultValue={brandId ?? ""}>
              <option value="" disabled>
                Elegí una marca
              </option>
              {brands.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.name}
                  {b.isOwn ? " (mi marca)" : ""}
                </option>
              ))}
            </select>
          </Field>
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
          <Field label="Fecha de publicación">
            <input type="date" name="publishedAt" className="input" defaultValue={new Date().toISOString().slice(0, 10)} />
          </Field>
          <Field label="Link (opcional)">
            <input name="url" className="input" placeholder="https://instagram.com/p/..." />
          </Field>
          <Field label="Caption / descripción">
            <input name="caption" className="input" placeholder="De qué trata la pieza" />
          </Field>
          <Field label="Link a imagen/video para guardar captura (opcional)">
            <input name="mediaUrl" className="input" placeholder="URL directa de la imagen o el video" />
          </Field>

          <div className="sm:col-span-2">
            <span className="text-xs text-neutral-400">Estética / estilo (elegí una o varias)</span>
            <div className="mt-2 flex flex-wrap gap-2">
              {AESTHETIC_TAGS.map((tag) => (
                <label key={tag} className="chip">
                  <input type="checkbox" name="aestheticTags" value={tag} className="sr-only" />
                  {tag}
                </label>
              ))}
            </div>
          </div>

          <Field label="Likes">
            <input type="number" min={0} name="likes" className="input" />
          </Field>
          <Field label="Comentarios">
            <input type="number" min={0} name="comments" className="input" />
          </Field>
          <Field label="Compartidos / enviados">
            <input type="number" min={0} name="shares" className="input" />
          </Field>
          <Field label="Guardados">
            <input type="number" min={0} name="saves" className="input" />
          </Field>
          <Field label="Reproducciones (views)">
            <input type="number" min={0} name="views" className="input" />
          </Field>

          <div className="flex items-center gap-2 sm:col-span-2">
            <input type="checkbox" name="isAd" id="isAd" className="h-4 w-4" />
            <label htmlFor="isAd" className="text-sm">
              Es publicidad (anuncio pago)
            </label>
          </div>
          <Field label="Red del anuncio">
            <select name="adNetwork" className="input">
              <option>Meta (Facebook/Instagram)</option>
              <option>Google</option>
            </select>
          </Field>
          <Field label="Estado del anuncio">
            <select name="adStatus" className="input">
              <option>Activo</option>
              <option>Pausado o finalizado</option>
              <option>Sin verificar</option>
            </select>
          </Field>

          <div className="sm:col-span-2">
            <Field label="Guion / transcripción (si ya la tenés)">
              <textarea name="script" rows={2} className="input" />
            </Field>
          </div>
          <div className="sm:col-span-2">
            <Field label="Análisis: por qué crees que le fue bien o mal">
              <textarea name="analysis" rows={2} className="input" />
            </Field>
          </div>

          <div className="sm:col-span-2">
            <button className="btn-primary" type="submit">
              Guardar pieza
            </button>
          </div>
        </form>
      </section>

      <section className="rounded-xl border border-white/10 bg-white/[0.02] p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-neutral-300">
            Historial ({filtered.length})
          </h2>
          <form className="flex flex-wrap gap-2 text-xs">
            <select name="brandId" defaultValue={brandId ?? ""} className="input !w-auto">
              <option value="">Todas las marcas</option>
              {brands.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.name}
                </option>
              ))}
            </select>
            <select name="platform" defaultValue={platform ?? ""} className="input !w-auto">
              <option value="">Todas las plataformas</option>
              <option>Instagram</option>
              <option>TikTok</option>
              <option>Facebook</option>
            </select>
            <select name="format" defaultValue={format ?? ""} className="input !w-auto">
              <option value="">Todos los formatos</option>
              <option>Post</option>
              <option>Reel</option>
              <option>Historia</option>
              <option>Video</option>
              <option>Anuncio</option>
            </select>
            <button className="btn-primary !py-1.5" type="submit">
              Filtrar
            </button>
          </form>
        </div>

        <div className="mt-4 overflow-x-auto">
          <table className="w-full min-w-[760px] text-left text-sm">
            <thead className="text-xs uppercase text-neutral-500">
              <tr>
                <th className="pb-2">Marca</th>
                <th className="pb-2">Plataforma</th>
                <th className="pb-2">Formato</th>
                <th className="pb-2">Fecha</th>
                <th className="pb-2">Likes</th>
                <th className="pb-2">Views</th>
                <th className="pb-2">Compartidos</th>
                <th className="pb-2">Score</th>
                <th className="pb-2"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={9} className="py-4 text-neutral-500">
                    No hay contenido con esos filtros.
                  </td>
                </tr>
              )}
              {filtered.map((c) => {
                const brand = brands.find((b) => b.id === c.brandId);
                return (
                  <tr key={c.id}>
                    <td className="py-2">{brand?.name ?? "—"}</td>
                    <td className="py-2">{c.platform}</td>
                    <td className="py-2">{c.format}</td>
                    <td className="py-2">{formatDate(c.publishedAt)}</td>
                    <td className="py-2">{c.metrics.likes ?? "—"}</td>
                    <td className="py-2">{c.metrics.views ?? "—"}</td>
                    <td className="py-2">{c.metrics.shares ?? "—"}</td>
                    <td className="py-2">{engagementScore(c)}</td>
                    <td className="py-2">
                      <form action={deleteContent}>
                        <input type="hidden" name="id" value={c.id} />
                        <button className="text-xs text-neutral-500 hover:text-red-400" type="submit">
                          Borrar
                        </button>
                      </form>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
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
