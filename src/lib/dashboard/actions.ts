"use server";

import { randomUUID } from "crypto";
import { revalidatePath } from "next/cache";
import { readData, writeData } from "./store";
import { downloadMedia } from "./media";
import {
  fetchSupadataTranscript,
  fetchWindsorAdsReport,
  runApifyAdLibraryScraper,
  runApifyInstagramScraper,
  runApifyTikTokScraper,
} from "./integrations";
import type {
  AdNetwork,
  AdStatus,
  Brand,
  ContentEntry,
  ContentFormat,
  Platform,
  Segment,
} from "./types";

function num(value: FormDataEntryValue | null): number | undefined {
  if (value === null || value === "") return undefined;
  const n = Number(value);
  return Number.isFinite(n) ? n : undefined;
}

function str(value: FormDataEntryValue | null): string | undefined {
  if (value === null) return undefined;
  const s = value.toString().trim();
  return s === "" ? undefined : s;
}

export async function createBrand(formData: FormData) {
  const data = await readData();

  const brand: Brand = {
    id: randomUUID(),
    name: String(formData.get("name") ?? "").trim(),
    segment: (formData.get("segment") as Segment) || "Unisex",
    country: str(formData.get("country")) ?? "Argentina",
    instagramHandle: str(formData.get("instagramHandle")),
    tiktokHandle: str(formData.get("tiktokHandle")),
    notes: str(formData.get("notes")),
    createdAt: new Date().toISOString(),
  };

  if (!brand.name) return;

  data.brands.push(brand);
  await writeData(data);
  revalidatePath("/dashboard");
  revalidatePath("/dashboard/marcas");
}

export async function deleteBrand(formData: FormData) {
  const id = String(formData.get("id") ?? "");
  const data = await readData();
  data.brands = data.brands.filter((b) => b.id !== id || b.isOwn);
  data.content = data.content.filter((c) => c.brandId !== id);
  await writeData(data);
  revalidatePath("/dashboard");
  revalidatePath("/dashboard/marcas");
}

export async function saveOwnBrand(formData: FormData) {
  const data = await readData();
  const own = data.brands.find((b) => b.isOwn);
  if (!own) return;

  own.name = String(formData.get("name") ?? own.name).trim() || own.name;
  own.segment = (formData.get("segment") as Segment) || own.segment;
  own.country = str(formData.get("country")) ?? own.country;
  own.instagramHandle = str(formData.get("instagramHandle"));
  own.tiktokHandle = str(formData.get("tiktokHandle"));
  own.notes = str(formData.get("notes"));

  await writeData(data);
  revalidatePath("/dashboard");
  revalidatePath("/dashboard/mi-marca");
}

export async function createContent(formData: FormData) {
  const data = await readData();

  const aestheticTags = formData.getAll("aestheticTags").map(String);
  const isAd = formData.get("isAd") === "on";

  const entry: ContentEntry = {
    id: randomUUID(),
    brandId: String(formData.get("brandId") ?? ""),
    platform: (formData.get("platform") as Platform) || "Instagram",
    format: (formData.get("format") as ContentFormat) || "Post",
    aestheticTags,
    url: str(formData.get("url")),
    publishedAt: str(formData.get("publishedAt")) ?? new Date().toISOString().slice(0, 10),
    caption: str(formData.get("caption")),
    metrics: {
      likes: num(formData.get("likes")),
      comments: num(formData.get("comments")),
      shares: num(formData.get("shares")),
      saves: num(formData.get("saves")),
      views: num(formData.get("views")),
    },
    isAd,
    adNetwork: isAd ? ((formData.get("adNetwork") as AdNetwork) || undefined) : undefined,
    adStatus: isAd ? ((formData.get("adStatus") as AdStatus) || "Sin verificar") : undefined,
    script: str(formData.get("script")),
    analysis: str(formData.get("analysis")),
    source: "Manual",
    createdAt: new Date().toISOString(),
  };

  const mediaUrl = str(formData.get("mediaUrl"));
  if (mediaUrl) {
    try {
      const { mediaPath, mediaType } = await downloadMedia(mediaUrl, entry.brandId, entry.id);
      entry.mediaPath = mediaPath;
      entry.mediaType = mediaType;
    } catch {
      // Si falla la descarga (link privado, vencido, etc.) seguimos guardando el resto de la pieza.
    }
  }

  if (!entry.brandId) return;

  data.content.push(entry);
  await writeData(data);
  revalidatePath("/dashboard");
  revalidatePath("/dashboard/contenido");
  revalidatePath("/dashboard/tendencias");
  revalidatePath("/dashboard/anuncios");
  revalidatePath(`/dashboard/marcas/${entry.brandId}`);
}

export async function deleteContent(formData: FormData) {
  const id = String(formData.get("id") ?? "");
  const data = await readData();
  data.content = data.content.filter((c) => c.id !== id);
  await writeData(data);
  revalidatePath("/dashboard");
  revalidatePath("/dashboard/contenido");
  revalidatePath("/dashboard/tendencias");
  revalidatePath("/dashboard/anuncios");
}

export interface SyncResult {
  ok: boolean;
  message: string;
}

/**
 * Trae los últimos posteos públicos de una marca vía Apify, descarga la
 * imagen/video de cada uno a /public/dashboard-media y los guarda como
 * contenido nuevo (evitando duplicar por url). Requiere APIFY_TOKEN.
 */
export async function syncBrandFromApify(formData: FormData): Promise<SyncResult> {
  const brandId = String(formData.get("brandId") ?? "");
  const data = await readData();
  const brand = data.brands.find((b) => b.id === brandId);
  if (!brand) return { ok: false, message: "Marca no encontrada." };
  if (!brand.instagramHandle) {
    return { ok: false, message: "Esta marca no tiene @ de Instagram cargado." };
  }

  const igUrl = `https://www.instagram.com/${brand.instagramHandle.replace("@", "")}/`;

  try {
    const items = await runApifyInstagramScraper(igUrl);
    const existingUrls = new Set(data.content.map((c) => c.url).filter(Boolean));
    let added = 0;

    for (const item of items) {
      if (!item.url || existingUrls.has(item.url)) continue;

      const id = randomUUID();
      const isVideo = item.type === "Video" && Boolean(item.videoUrl);
      const isReel = item.productType === "clips" || (isVideo && !item.productType);
      const entry: ContentEntry = {
        id,
        brandId,
        platform: "Instagram",
        format: isReel ? "Reel" : isVideo ? "Video" : "Post",
        aestheticTags: [],
        url: item.url,
        publishedAt: item.timestamp ? item.timestamp.slice(0, 10) : new Date().toISOString().slice(0, 10),
        caption: item.caption,
        metrics: {
          likes: item.likesCount,
          comments: item.commentsCount,
          views: item.videoViewCount,
        },
        isAd: false,
        source: "Apify",
        createdAt: new Date().toISOString(),
      };

      const mediaUrl = isVideo ? item.videoUrl : item.displayUrl;
      if (mediaUrl) {
        try {
          const { mediaPath, mediaType } = await downloadMedia(mediaUrl, brandId, id);
          entry.mediaPath = mediaPath;
          entry.mediaType = mediaType;
        } catch {
          // seguimos sin media si la descarga falla
        }
      }

      data.content.push(entry);
      added += 1;
    }

    await writeData(data);
    revalidatePath("/dashboard");
    revalidatePath("/dashboard/contenido");
    revalidatePath("/dashboard/tendencias");
    revalidatePath(`/dashboard/marcas/${brandId}`);

    return { ok: true, message: `Se sincronizaron ${added} piezas nuevas de ${brand.name}.` };
  } catch (err) {
    return { ok: false, message: err instanceof Error ? err.message : "Error desconocido." };
  }
}

/** Trae los últimos videos públicos de TikTok de una marca vía Apify. */
export async function syncBrandTikTokFromApify(formData: FormData): Promise<SyncResult> {
  const brandId = String(formData.get("brandId") ?? "");
  const data = await readData();
  const brand = data.brands.find((b) => b.id === brandId);
  if (!brand) return { ok: false, message: "Marca no encontrada." };
  if (!brand.tiktokHandle) {
    return { ok: false, message: "Esta marca no tiene @ de TikTok cargado." };
  }

  const tiktokUrl = `https://www.tiktok.com/@${brand.tiktokHandle.replace("@", "")}`;

  try {
    const items = await runApifyTikTokScraper(tiktokUrl);
    const existingUrls = new Set(data.content.map((c) => c.url).filter(Boolean));
    let added = 0;

    for (const item of items) {
      const url = item.webVideoUrl;
      if (!url || existingUrls.has(url)) continue;

      const id = randomUUID();
      const entry: ContentEntry = {
        id,
        brandId,
        platform: "TikTok",
        format: "Video",
        aestheticTags: [],
        url,
        publishedAt: item.createTimeISO ? item.createTimeISO.slice(0, 10) : new Date().toISOString().slice(0, 10),
        caption: item.text,
        metrics: {
          likes: item.diggCount,
          comments: item.commentCount,
          shares: item.shareCount,
          views: item.playCount,
        },
        isAd: false,
        source: "Apify",
        createdAt: new Date().toISOString(),
      };

      if (item.videoUrl) {
        try {
          const { mediaPath, mediaType } = await downloadMedia(item.videoUrl, brandId, id);
          entry.mediaPath = mediaPath;
          entry.mediaType = mediaType;
        } catch {
          // seguimos sin media si la descarga falla
        }
      }

      data.content.push(entry);
      added += 1;
    }

    await writeData(data);
    revalidatePath("/dashboard");
    revalidatePath("/dashboard/contenido");
    revalidatePath("/dashboard/tendencias");
    revalidatePath(`/dashboard/marcas/${brandId}`);

    return { ok: true, message: `Se sincronizaron ${added} videos de TikTok de ${brand.name}.` };
  } catch (err) {
    return { ok: false, message: err instanceof Error ? err.message : "Error desconocido." };
  }
}

/**
 * Trae los anuncios activos/inactivos de una marca desde la Meta Ad Library
 * (misma data pública que se ve entrando a la Ad Library a mano) y los
 * guarda como piezas de tipo Anuncio, descargando el creativo.
 */
export async function syncBrandAdsFromApify(formData: FormData): Promise<SyncResult> {
  const brandId = String(formData.get("brandId") ?? "");
  const data = await readData();
  const brand = data.brands.find((b) => b.id === brandId);
  if (!brand) return { ok: false, message: "Marca no encontrada." };

  const query = brand.instagramHandle?.replace("@", "") || brand.name;

  try {
    const items = await runApifyAdLibraryScraper(query);
    const existingIds = new Set(
      data.content.filter((c) => c.brandId === brandId && c.isAd).map((c) => c.url).filter(Boolean)
    );
    let added = 0;

    for (const item of items) {
      const adUrl = item.adArchiveId
        ? `https://www.facebook.com/ads/library/?id=${item.adArchiveId}`
        : undefined;
      if (!adUrl || existingIds.has(adUrl)) continue;

      const id = randomUUID();
      const video = item.snapshot?.videos?.[0];
      const image = item.snapshot?.images?.[0];
      const isVideo = Boolean(video);

      const entry: ContentEntry = {
        id,
        brandId,
        platform: item.publisherPlatform?.includes("instagram") ? "Instagram" : "Facebook",
        format: "Anuncio",
        aestheticTags: [],
        url: adUrl,
        publishedAt: item.startDate ? item.startDate.slice(0, 10) : new Date().toISOString().slice(0, 10),
        caption: item.snapshot?.body?.text,
        metrics: {},
        isAd: true,
        adNetwork: "Meta (Facebook/Instagram)",
        adStatus: item.isActive ? "Activo" : "Pausado o finalizado",
        source: "Apify",
        createdAt: new Date().toISOString(),
      };

      const mediaUrl = isVideo ? video?.video_hd_url ?? video?.video_sd_url : image?.original_image_url;
      if (mediaUrl) {
        try {
          const { mediaPath, mediaType } = await downloadMedia(mediaUrl, brandId, id);
          entry.mediaPath = mediaPath;
          entry.mediaType = mediaType;
        } catch {
          // seguimos sin media si la descarga falla
        }
      }

      data.content.push(entry);
      added += 1;
    }

    await writeData(data);
    revalidatePath("/dashboard");
    revalidatePath("/dashboard/anuncios");
    revalidatePath(`/dashboard/marcas/${brandId}`);

    return { ok: true, message: `Se sincronizaron ${added} anuncios de ${brand.name}.` };
  } catch (err) {
    return { ok: false, message: err instanceof Error ? err.message : "Error desconocido." };
  }
}

/** Pide a Supadata el guion/transcripción de un video y lo guarda en la pieza. */
export async function syncScriptFromSupadata(formData: FormData): Promise<SyncResult> {
  const contentId = String(formData.get("contentId") ?? "");
  const data = await readData();
  const entry = data.content.find((c) => c.id === contentId);
  if (!entry) return { ok: false, message: "Contenido no encontrado." };
  if (!entry.url) return { ok: false, message: "Esta pieza no tiene link cargado." };

  try {
    const { text } = await fetchSupadataTranscript(entry.url);
    entry.script = text;
    await writeData(data);
    revalidatePath(`/dashboard/marcas/${entry.brandId}`);
    revalidatePath("/dashboard/contenido");
    return { ok: true, message: "Guion actualizado." };
  } catch (err) {
    return { ok: false, message: err instanceof Error ? err.message : "Error desconocido." };
  }
}

/** Guarda el análisis manual (por qué funcionó / no funcionó) de una pieza. */
export async function saveContentAnalysis(formData: FormData) {
  const contentId = String(formData.get("contentId") ?? "");
  const data = await readData();
  const entry = data.content.find((c) => c.id === contentId);
  if (!entry) return;
  entry.analysis = str(formData.get("analysis"));
  await writeData(data);
  revalidatePath(`/dashboard/marcas/${entry.brandId}`);
}

/**
 * Trae el reporte de las cuentas de ads propias conectadas en Windsor.ai y
 * las carga como piezas de "Mi marca" marcadas como anuncio.
 */
export async function syncOwnAdsFromWindsor(): Promise<SyncResult> {
  const data = await readData();
  const own = data.brands.find((b) => b.isOwn);
  if (!own) return { ok: false, message: "No hay marca propia configurada." };

  try {
    const rows = await fetchWindsorAdsReport();
    let added = 0;

    for (const row of rows) {
      const id = randomUUID();
      const entry: ContentEntry = {
        id,
        brandId: own.id,
        platform: row.source?.toLowerCase().includes("google") ? "Facebook" : "Instagram",
        format: "Anuncio",
        aestheticTags: [],
        publishedAt: row.date ?? new Date().toISOString().slice(0, 10),
        caption: row.campaign,
        metrics: {
          spend: row.spend,
          clicks: row.clicks,
          impressions: row.impressions,
        },
        isAd: true,
        adNetwork: row.source?.toLowerCase().includes("google") ? "Google" : "Meta (Facebook/Instagram)",
        adStatus: "Activo",
        source: "Windsor.ai",
        createdAt: new Date().toISOString(),
      };
      data.content.push(entry);
      added += 1;
    }

    await writeData(data);
    revalidatePath("/dashboard");
    revalidatePath("/dashboard/mi-marca");
    revalidatePath("/dashboard/anuncios");

    return { ok: true, message: `Se importaron ${added} filas de rendimiento de pauta propia.` };
  } catch (err) {
    return { ok: false, message: err instanceof Error ? err.message : "Error desconocido." };
  }
}
