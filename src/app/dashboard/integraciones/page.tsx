import { readData } from "@/lib/dashboard/store";
import { integrationsStatus } from "@/lib/dashboard/integrations";
import { syncBrandFromApify, syncOwnAdsFromWindsor } from "@/lib/dashboard/actions";
import { SyncForm } from "./SyncForm";

export default async function IntegracionesPage() {
  const data = await readData();
  const status = integrationsStatus();
  const competitors = data.brands.filter((b) => !b.isOwn);

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-2xl font-semibold">Integraciones</h1>
        <p className="mt-1 text-sm text-neutral-400 max-w-3xl">
          Estas conexiones no vienen activadas: necesitan que cargues tus propias API keys en{" "}
          <code className="rounded bg-white/10 px-1">.env.local</code>. Sin esto, los botones de abajo te
          van a avisar qué falta en vez de fallar en silencio.
        </p>
      </div>

      <section className="rounded-xl border border-white/10 bg-white/[0.02] p-5">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-neutral-300">Apify</h2>
        <p className="mt-2 text-sm text-neutral-400">
          Trae los últimos posteos públicos de Instagram de una marca (foto/video + likes, comentarios,
          views) y descarga automáticamente la imagen o el video a tu dashboard. No cubre historias: Meta
          no expone historias de terceros sin iniciar sesión como esa cuenta, y automatizar eso viola los
          Términos de Servicio de Instagram, así que las historias se siguen cargando a mano.
        </p>
        <StatusBadge ok={status.apify} envVar="APIFY_TOKEN (y opcional APIFY_IG_ACTOR_ID)" />
        <div className="mt-4 max-w-sm">
          <SyncForm action={syncBrandFromApify} submitLabel="Sincronizar posteos">
            <label className="flex flex-col gap-1 text-sm">
              <span className="text-xs text-neutral-400">Marca</span>
              <select name="brandId" required className="input">
                {competitors.length === 0 && <option value="">Agregá marcas primero</option>}
                {competitors.map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.name} {b.instagramHandle ? `(${b.instagramHandle})` : "(sin @ cargado)"}
                  </option>
                ))}
              </select>
            </label>
          </SyncForm>
        </div>
      </section>

      <section className="rounded-xl border border-white/10 bg-white/[0.02] p-5">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-neutral-300">Supadata</h2>
        <p className="mt-2 text-sm text-neutral-400">
          Extrae el guion/transcripción de un video (Reel, TikTok) a partir de su link. Se dispara pieza
          por pieza desde el detalle de cada marca (botón &quot;Traer guion&quot;), una vez que tengas la
          pieza cargada con su link.
        </p>
        <StatusBadge ok={status.supadata} envVar="SUPADATA_API_KEY" />
      </section>

      <section className="rounded-xl border border-white/10 bg-white/[0.02] p-5">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-neutral-300">Windsor.ai</h2>
        <p className="mt-2 text-sm text-neutral-400">
          Importa el rendimiento real de <strong>tus propias</strong> cuentas de Meta Ads / Google Ads
          (gasto, clics, impresiones) conectadas en tu panel de Windsor. Windsor no scrapea competidores —
          eso lo sigue cubriendo la sección &quot;Anuncios&quot; con los links a Meta Ad Library y Google
          Ads Transparency.
        </p>
        <StatusBadge ok={status.windsor} envVar="WINDSOR_API_KEY" />
        <div className="mt-4">
          <SyncForm action={syncOwnAdsFromWindsor} submitLabel="Importar rendimiento de mis ads" />
        </div>
      </section>

      <section className="rounded-xl border border-white/10 bg-white/[0.02] p-5 text-sm text-neutral-400">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-neutral-300">
          Sincronización diaria/semanal automática
        </h2>
        <p className="mt-2">
          Esta app no tiene un proceso corriendo 24/7 propio. Para que la sincronización de Apify se
          dispare sola todos los días, la forma más simple es un GitHub Action (o un cron de Vercel si
          despliegan ahí) que llame a un endpoint de esta app una vez por día. Si querés, en un próximo
          paso armamos ese endpoint y el workflow — avisame y lo agrego.
        </p>
      </section>
    </div>
  );
}

function StatusBadge({ ok, envVar }: { ok: boolean; envVar: string }) {
  return (
    <p className="mt-3 text-xs">
      <span
        className={`rounded px-2 py-0.5 ${ok ? "bg-emerald-500/20 text-emerald-300" : "bg-white/10 text-neutral-400"}`}
      >
        {ok ? "Configurado" : "Sin configurar"}
      </span>{" "}
      <span className="text-neutral-500">— variable: {envVar}</span>
    </p>
  );
}
