import { readData } from "@/lib/dashboard/store";
import { channelGoalBreakdown, engagementScore, formatBreakdown, topTags } from "@/lib/dashboard/metrics";

export default async function TendenciasPage() {
  const data = await readData();
  const content = data.content;

  const tags = topTags(content, 20);
  const formats = formatBreakdown(content);
  const channelGoals = channelGoalBreakdown(content);

  const byPlatform = new Map<string, number>();
  for (const c of content) byPlatform.set(c.platform, (byPlatform.get(c.platform) ?? 0) + 1);

  const best = [...content].sort((a, b) => engagementScore(b) - engagementScore(a)).slice(0, 8);

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-2xl font-semibold">Tendencias</h1>
        <p className="mt-1 text-sm text-neutral-400">
          Qué estéticas, formatos y plataformas están funcionando mejor en base a lo que cargaste. Usalo
          como inspiración para tu propio contenido.
        </p>
      </div>

      {content.length === 0 && (
        <p className="text-sm text-neutral-500">
          Todavía no hay datos suficientes. Cargá contenido en la sección &quot;Contenido&quot; para ver
          tendencias acá.
        </p>
      )}

      <div className="grid gap-6 lg:grid-cols-2">
        <section className="rounded-xl border border-white/10 bg-white/[0.02] p-5">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-neutral-300">
            Estéticas más usadas por los competidores
          </h2>
          <ul className="mt-4 flex flex-col gap-3">
            {tags.map((t) => (
              <li key={t.tag} className="flex items-center justify-between text-sm">
                <span>{t.tag}</span>
                <span className="text-xs text-neutral-400">
                  {t.count} piezas · eng. prom. {t.avgEngagement.toLocaleString("es-AR")}
                </span>
              </li>
            ))}
          </ul>
        </section>

        <section className="rounded-xl border border-white/10 bg-white/[0.02] p-5">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-neutral-300">
            Formatos y plataformas
          </h2>
          <div className="mt-4">
            <div className="text-xs uppercase text-neutral-500">Por formato</div>
            <ul className="mt-2 flex flex-col gap-2 text-sm">
              {formats.map(([format, count]) => (
                <li key={format} className="flex justify-between">
                  <span>{format}</span>
                  <span className="text-neutral-400">{count}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="mt-5">
            <div className="text-xs uppercase text-neutral-500">Por plataforma</div>
            <ul className="mt-2 flex flex-col gap-2 text-sm">
              {[...byPlatform.entries()].map(([platform, count]) => (
                <li key={platform} className="flex justify-between">
                  <span>{platform}</span>
                  <span className="text-neutral-400">{count}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>
      </div>

      <section className="rounded-xl border border-white/10 bg-white/[0.02] p-5">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-neutral-300">
          Qué objetivo de canal rinde mejor (según el playbook de Cameo)
        </h2>
        <p className="mt-1 text-xs text-neutral-500">
          Cruce clave: no solo qué estética funciona, sino qué está funcionando para el mismo objetivo que
          persigue cada canal de Cameo (ver /dashboard/estrategia).
        </p>
        <ul className="mt-4 flex flex-col gap-3">
          {channelGoals.length === 0 && (
            <li className="text-sm text-neutral-500">
              Clasificá el contenido cargado por &quot;Objetivo de canal&quot; para ver este cruce.
            </li>
          )}
          {channelGoals.map((g) => (
            <li key={g.goal} className="flex items-center justify-between text-sm">
              <span>{g.goal}</span>
              <span className="text-xs text-neutral-400">
                {g.count} piezas · eng. prom. {g.avgEngagement.toLocaleString("es-AR")}
              </span>
            </li>
          ))}
        </ul>
      </section>

      <section className="rounded-xl border border-white/10 bg-white/[0.02] p-5">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-neutral-300">
          Top piezas por engagement
        </h2>
        <ul className="mt-4 flex flex-col gap-3">
          {best.map((c) => {
            const brand = data.brands.find((b) => b.id === c.brandId);
            return (
              <li key={c.id} className="flex items-center justify-between rounded-lg border border-white/10 p-3 text-sm">
                <div>
                  <span className="font-medium">{brand?.name ?? "—"}</span>{" "}
                  <span className="text-neutral-400">
                    · {c.platform} · {c.format}
                  </span>
                  {c.aestheticTags.length > 0 && (
                    <span className="text-neutral-500"> · {c.aestheticTags.join(", ")}</span>
                  )}
                </div>
                <span className="font-semibold">{engagementScore(c).toLocaleString("es-AR")}</span>
              </li>
            );
          })}
        </ul>
      </section>
    </div>
  );
}
