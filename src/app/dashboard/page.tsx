import Link from "next/link";
import { readData } from "@/lib/dashboard/store";
import { engagementScore, formatDate, sumMetric, topTags } from "@/lib/dashboard/metrics";

export default async function DashboardOverview() {
  const data = await readData();
  const competitors = data.brands.filter((b) => !b.isOwn);
  const content = data.content;

  const totalLikes = sumMetric(content, "likes");
  const totalViews = sumMetric(content, "views");
  const totalShares = sumMetric(content, "shares");
  const activeAds = content.filter((c) => c.isAd && c.adStatus === "Activo").length;

  const byBrand = competitors
    .map((brand) => {
      const items = content.filter((c) => c.brandId === brand.id);
      const engagement = items.reduce((acc, e) => acc + engagementScore(e), 0);
      return { brand, count: items.length, engagement };
    })
    .sort((a, b) => b.engagement - a.engagement);

  const recent = [...content]
    .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
    .slice(0, 6);

  const trending = topTags(content, 5);

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-2xl font-semibold">Resumen</h1>
        <p className="mt-1 text-sm text-neutral-400">
          Todo lo que vas cargando de tus competidores, en un solo lugar.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <StatCard label="Marcas trackeadas" value={competitors.length} />
        <StatCard label="Piezas cargadas" value={content.length} />
        <StatCard label="Likes acumulados" value={totalLikes.toLocaleString("es-AR")} />
        <StatCard label="Anuncios activos" value={activeAds} />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <section className="rounded-xl border border-white/10 bg-white/[0.02] p-5">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-neutral-300">
              Ranking por engagement
            </h2>
            <Link href="/dashboard/marcas" className="text-xs text-neutral-400 hover:text-white">
              Ver marcas →
            </Link>
          </div>
          <ul className="mt-4 flex flex-col gap-3">
            {byBrand.length === 0 && (
              <li className="text-sm text-neutral-500">Todavía no cargaste marcas competidoras.</li>
            )}
            {byBrand.map(({ brand, count, engagement }, i) => (
              <li key={brand.id} className="flex items-center justify-between text-sm">
                <Link href={`/dashboard/marcas/${brand.id}`} className="hover:underline">
                  <span className="text-neutral-500">{i + 1}.</span> {brand.name}
                  <span className="ml-2 text-xs text-neutral-500">({count} piezas)</span>
                </Link>
                <span className="font-medium">{engagement.toLocaleString("es-AR")}</span>
              </li>
            ))}
          </ul>
        </section>

        <section className="rounded-xl border border-white/10 bg-white/[0.02] p-5">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-neutral-300">
              Estéticas / formatos en tendencia
            </h2>
            <Link href="/dashboard/tendencias" className="text-xs text-neutral-400 hover:text-white">
              Ver tendencias →
            </Link>
          </div>
          <ul className="mt-4 flex flex-col gap-3">
            {trending.length === 0 && (
              <li className="text-sm text-neutral-500">Cargá contenido para ver tendencias.</li>
            )}
            {trending.map((t) => (
              <li key={t.tag} className="flex items-center justify-between text-sm">
                <span>{t.tag}</span>
                <span className="text-xs text-neutral-400">
                  {t.count}x · eng. prom. {t.avgEngagement.toLocaleString("es-AR")}
                </span>
              </li>
            ))}
          </ul>
        </section>
      </div>

      <section className="rounded-xl border border-white/10 bg-white/[0.02] p-5">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-neutral-300">
            Últimas piezas cargadas
          </h2>
          <Link href="/dashboard/contenido" className="text-xs text-neutral-400 hover:text-white">
            Ver todo el contenido →
          </Link>
        </div>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead className="text-xs uppercase text-neutral-500">
              <tr>
                <th className="pb-2">Marca</th>
                <th className="pb-2">Formato</th>
                <th className="pb-2">Fecha</th>
                <th className="pb-2">Likes</th>
                <th className="pb-2">Views</th>
                <th className="pb-2">Compartidos</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {recent.length === 0 && (
                <tr>
                  <td colSpan={6} className="py-4 text-neutral-500">
                    Sin contenido cargado todavía.
                  </td>
                </tr>
              )}
              {recent.map((c) => {
                const brand = data.brands.find((b) => b.id === c.brandId);
                return (
                  <tr key={c.id}>
                    <td className="py-2">{brand?.name ?? "—"}</td>
                    <td className="py-2">{c.format}</td>
                    <td className="py-2">{formatDate(c.publishedAt)}</td>
                    <td className="py-2">{c.metrics.likes ?? "—"}</td>
                    <td className="py-2">{c.metrics.views ?? "—"}</td>
                    <td className="py-2">{c.metrics.shares ?? "—"}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <p className="mt-3 text-xs text-neutral-500">
          Compartidos acumulados: {totalShares.toLocaleString("es-AR")} · Views acumuladas:{" "}
          {totalViews.toLocaleString("es-AR")}
        </p>
      </section>
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-xl border border-white/10 bg-white/[0.02] p-4">
      <div className="text-xs uppercase tracking-wide text-neutral-500">{label}</div>
      <div className="mt-1 text-2xl font-semibold">{value}</div>
    </div>
  );
}
