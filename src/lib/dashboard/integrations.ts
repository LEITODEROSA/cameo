/**
 * Integraciones con proveedores de datos externos.
 *
 * Ninguna de estas funciones tiene credenciales cargadas: leen API keys de
 * variables de entorno que vos configurás (ver .env.local.example). Sin la
 * key correspondiente, cada función devuelve un error controlado que la UI
 * muestra como "falta configurar esta integración".
 *
 * Los nombres de campo de las respuestas (actor de Apify, conector de
 * Windsor.ai) dependen de la configuración exacta de tu cuenta / del actor
 * que uses — están escritos según la forma más común de esas APIs, pero
 * conviene validarlos contra la respuesta real la primera vez que corras
 * una sincronización.
 */

export interface ApifyPostItem {
  url?: string;
  displayUrl?: string;
  videoUrl?: string;
  caption?: string;
  timestamp?: string;
  likesCount?: number;
  commentsCount?: number;
  videoViewCount?: number;
  type?: string; // "Image" | "Video" | "Sidecar"
}

const MISSING_KEY = (name: string) =>
  new Error(
    `Falta configurar ${name}. Agregala en .env.local (ver .env.local.example) y reiniciá el servidor.`
  );

/**
 * Corre un actor de Apify (por defecto pensado para un scraper de posteos
 * públicos de Instagram, ej. "apify/instagram-scraper") y devuelve el
 * dataset resultante directamente, usando el endpoint run-sync-get-dataset-items
 * de Apify (no requiere hacer polling).
 */
export async function runApifyInstagramScraper(instagramUrl: string): Promise<ApifyPostItem[]> {
  const token = process.env.APIFY_TOKEN;
  const actorId = process.env.APIFY_IG_ACTOR_ID || "apify~instagram-scraper";
  if (!token) throw MISSING_KEY("APIFY_TOKEN");

  const endpoint = `https://api.apify.com/v2/acts/${actorId}/run-sync-get-dataset-items?token=${token}`;
  const res = await fetch(endpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      directUrls: [instagramUrl],
      resultsType: "posts",
      resultsLimit: 20,
    }),
  });

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Apify respondió ${res.status}: ${body.slice(0, 300)}`);
  }

  return (await res.json()) as ApifyPostItem[];
}

export interface SupadataTranscriptResult {
  text: string;
  language?: string;
}

/**
 * Pide la transcripción/guion de un video público (Reel, TikTok, etc.) a
 * Supadata, para poder analizar qué dice el guion de las piezas que mejor
 * performance tuvieron.
 */
export async function fetchSupadataTranscript(videoUrl: string): Promise<SupadataTranscriptResult> {
  const apiKey = process.env.SUPADATA_API_KEY;
  if (!apiKey) throw MISSING_KEY("SUPADATA_API_KEY");

  const endpoint = `https://api.supadata.ai/v1/transcript?url=${encodeURIComponent(videoUrl)}`;
  const res = await fetch(endpoint, {
    headers: { "x-api-key": apiKey },
  });

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Supadata respondió ${res.status}: ${body.slice(0, 300)}`);
  }

  const data = await res.json();
  return { text: data.content ?? data.text ?? "", language: data.lang ?? data.language };
}

export interface WindsorAdRow {
  date?: string;
  campaign?: string;
  source?: string;
  spend?: number;
  clicks?: number;
  impressions?: number;
}

/**
 * Trae el reporte de rendimiento de TUS PROPIAS cuentas publicitarias (Meta
 * Ads / Google Ads, etc.) conectadas en Windsor.ai. Windsor no scrapea
 * competidores: agrega, vía las APIs oficiales, la data de las cuentas de
 * ads que vos conectaste en tu panel de Windsor.
 */
export async function fetchWindsorAdsReport(datePreset = "last_30d"): Promise<WindsorAdRow[]> {
  const apiKey = process.env.WINDSOR_API_KEY;
  if (!apiKey) throw MISSING_KEY("WINDSOR_API_KEY");

  const fields = "date,campaign,source,spend,clicks,impressions";
  const endpoint = `https://connectors.windsor.ai/all?api_key=${apiKey}&date_preset=${datePreset}&fields=${fields}&_renderas=json`;
  const res = await fetch(endpoint);

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Windsor.ai respondió ${res.status}: ${body.slice(0, 300)}`);
  }

  const data = await res.json();
  return (data.data ?? data) as WindsorAdRow[];
}

export function integrationsStatus() {
  return {
    apify: Boolean(process.env.APIFY_TOKEN),
    supadata: Boolean(process.env.SUPADATA_API_KEY),
    windsor: Boolean(process.env.WINDSOR_API_KEY),
  };
}
