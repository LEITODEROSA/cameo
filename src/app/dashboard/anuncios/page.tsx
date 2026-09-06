import { readData } from "@/lib/dashboard/store";
import { formatDate } from "@/lib/dashboard/metrics";

function metaAdLibraryUrl(query: string) {
  const params = new URLSearchParams({
    active_status: "active",
    ad_type: "all",
    country: "AR",
    q: query,
    media_type: "all",
  });
  return `https://www.facebook.com/ads/library/?${params.toString()}`;
}

function googleAdsTransparencyUrl(query: string) {
  const params = new URLSearchParams({ region: "AR", query });
  return `https://adstransparency.google.com/?${params.toString()}`;
}

export default async function AnunciosPage() {
  const data = await readData();
  const competitors = data.brands.filter((b) => !b.isOwn);
  const ads = data.content
    .filter((c) => c.isAd)
    .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-2xl font-semibold">Anuncios (Ad Library)</h1>
        <p className="mt-1 text-sm text-neutral-400">
          Meta y Google no permiten traer esto automáticamente, pero sus buscadores de transparencia
          publicitaria son públicos. Un click te lleva a ver qué anuncios tiene activos cada marca; lo que
          te interese, lo cargás en &quot;Contenido&quot; marcando &quot;Es publicidad&quot;.
        </p>
      </div>

      <section className="rounded-xl border border-white/10 bg-white/[0.02] p-5">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-neutral-300">
          Chequear anuncios activos por marca
        </h2>
        <ul className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {competitors.length === 0 && (
            <li className="text-sm text-neutral-500">Agregá marcas en la sección &quot;Marcas&quot; primero.</li>
          )}
          {competitors.map((brand) => {
            const query = brand.instagramHandle?.replace("@", "") || brand.name;
            return (
              <li key={brand.id} className="rounded-lg border border-white/10 p-4">
                <div className="font-medium">{brand.name}</div>
                <div className="mt-3 flex flex-col gap-2 text-sm">
                  <a
                    href={metaAdLibraryUrl(query)}
                    target="_blank"
                    rel="noreferrer"
                    className="text-neutral-300 underline underline-offset-2 hover:text-white"
                  >
                    Ver en Meta Ad Library →
                  </a>
                  <a
                    href={googleAdsTransparencyUrl(query)}
                    target="_blank"
                    rel="noreferrer"
                    className="text-neutral-300 underline underline-offset-2 hover:text-white"
                  >
                    Ver en Google Ads Transparency →
                  </a>
                </div>
              </li>
            );
          })}
        </ul>
      </section>

      <section className="rounded-xl border border-white/10 bg-white/[0.02] p-5">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-neutral-300">
          Anuncios cargados ({ads.length})
        </h2>
        <div className="mt-4 flex flex-col gap-3">
          {ads.length === 0 && (
            <p className="text-sm text-neutral-500">
              Sin anuncios cargados. Cargalos desde &quot;Contenido&quot; tildando &quot;Es publicidad&quot;.
            </p>
          )}
          {ads.map((ad) => {
            const brand = data.brands.find((b) => b.id === ad.brandId);
            return (
              <div key={ad.id} className="rounded-lg border border-white/10 p-4 text-sm">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-medium">{brand?.name}</span>
                  <span className="rounded bg-white/10 px-2 py-0.5 text-xs">{ad.adNetwork}</span>
                  <span
                    className={`rounded px-2 py-0.5 text-xs ${
                      ad.adStatus === "Activo"
                        ? "bg-emerald-500/20 text-emerald-300"
                        : "bg-white/10 text-neutral-400"
                    }`}
                  >
                    {ad.adStatus}
                  </span>
                  <span className="text-neutral-500">{formatDate(ad.publishedAt)}</span>
                </div>
                {ad.caption && <p className="mt-2 text-neutral-300">{ad.caption}</p>}
                {ad.aestheticTags.length > 0 && (
                  <p className="mt-1 text-xs text-neutral-500">{ad.aestheticTags.join(", ")}</p>
                )}
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
