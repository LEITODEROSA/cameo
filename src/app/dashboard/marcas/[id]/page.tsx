import Link from "next/link";
import { notFound } from "next/navigation";
import { readData } from "@/lib/dashboard/store";
import { deleteContent } from "@/lib/dashboard/actions";
import { engagementScore, formatDate, sumMetric } from "@/lib/dashboard/metrics";

export default async function BrandDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const data = await readData();
  const brand = data.brands.find((b) => b.id === id);
  if (!brand) notFound();

  const items = data.content
    .filter((c) => c.brandId === id)
    .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());

  const ads = items.filter((c) => c.isAd);

  return (
    <div className="flex flex-col gap-8">
      <div>
        <Link href="/dashboard/marcas" className="text-xs text-neutral-400 hover:text-white">
          ← Volver a marcas
        </Link>
        <h1 className="mt-2 text-2xl font-semibold">{brand.name}</h1>
        <p className="mt-1 text-sm text-neutral-400">
          {brand.segment} · {brand.country}
          {brand.instagramHandle ? ` · IG ${brand.instagramHandle}` : ""}
        </p>
        {brand.notes && <p className="mt-1 text-sm text-neutral-500">{brand.notes}</p>}
        <Link
          href={`/dashboard/contenido?brandId=${brand.id}`}
          className="btn-primary mt-4 inline-block"
        >
          + Cargar contenido de esta marca
        </Link>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <Stat label="Piezas" value={items.length} />
        <Stat label="Likes" value={sumMetric(items, "likes").toLocaleString("es-AR")} />
        <Stat label="Views" value={sumMetric(items, "views").toLocaleString("es-AR")} />
        <Stat label="Anuncios cargados" value={ads.length} />
      </div>

      <section className="rounded-xl border border-white/10 bg-white/[0.02] p-5">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-neutral-300">Contenido</h2>
        <div className="mt-4 flex flex-col gap-3">
          {items.length === 0 && (
            <p className="text-sm text-neutral-500">Sin contenido cargado para esta marca todavía.</p>
          )}
          {items.map((c) => (
            <div key={c.id} className="rounded-lg border border-white/10 p-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex flex-wrap items-center gap-2 text-sm">
                  <span className="rounded bg-white/10 px-2 py-0.5 text-xs">{c.platform}</span>
                  <span className="rounded bg-white/10 px-2 py-0.5 text-xs">{c.format}</span>
                  {c.isAd && (
                    <span className="rounded bg-emerald-500/20 px-2 py-0.5 text-xs text-emerald-300">
                      Anuncio · {c.adStatus}
                    </span>
                  )}
                  <span className="text-neutral-500">{formatDate(c.publishedAt)}</span>
                </div>
                <form action={deleteContent}>
                  <input type="hidden" name="id" value={c.id} />
                  <button className="text-xs text-neutral-500 hover:text-red-400" type="submit">
                    Borrar
                  </button>
                </form>
              </div>
              {c.aestheticTags.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-1">
                  {c.aestheticTags.map((tag) => (
                    <span key={tag} className="rounded-full border border-white/10 px-2 py-0.5 text-xs text-neutral-400">
                      {tag}
                    </span>
                  ))}
                </div>
              )}
              {c.caption && <p className="mt-2 text-sm text-neutral-300">{c.caption}</p>}
              <div className="mt-3 flex flex-wrap gap-4 text-xs text-neutral-400">
                <span>❤️ {c.metrics.likes ?? 0}</span>
                <span>💬 {c.metrics.comments ?? 0}</span>
                <span>↗️ {c.metrics.shares ?? 0} compartidos</span>
                <span>🔖 {c.metrics.saves ?? 0} guardados</span>
                <span>▶️ {c.metrics.views ?? 0} views</span>
                <span className="font-medium text-neutral-200">Score: {engagementScore(c)}</span>
              </div>
              {c.url && (
                <a href={c.url} target="_blank" rel="noreferrer" className="mt-2 inline-block text-xs text-neutral-400 underline">
                  Ver publicación original
                </a>
              )}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-xl border border-white/10 bg-white/[0.02] p-4">
      <div className="text-xs uppercase tracking-wide text-neutral-500">{label}</div>
      <div className="mt-1 text-2xl font-semibold">{value}</div>
    </div>
  );
}
