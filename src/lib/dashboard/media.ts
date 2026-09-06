import { promises as fs } from "fs";
import path from "path";

const MEDIA_ROOT = path.join(process.cwd(), "public", "dashboard-media");

function extensionFromContentType(contentType: string | null, fallbackUrl: string): string {
  if (contentType?.includes("video")) return "mp4";
  if (contentType?.includes("png")) return "png";
  if (contentType?.includes("webp")) return "webp";
  if (contentType?.includes("jpeg") || contentType?.includes("jpg")) return "jpg";
  const fromUrl = fallbackUrl.split("?")[0].split(".").pop();
  return fromUrl && fromUrl.length <= 4 ? fromUrl : "bin";
}

/**
 * Descarga una imagen/video público (por ejemplo, la URL de media que devuelve
 * un actor de Apify) y lo guarda en /public/dashboard-media para tener un
 * respaldo local navegable desde el dashboard, en vez de depender de un link
 * externo que puede caerse.
 */
export async function downloadMedia(
  sourceUrl: string,
  brandId: string,
  entryId: string
): Promise<{ mediaPath: string; mediaType: "image" | "video" }> {
  const res = await fetch(sourceUrl);
  if (!res.ok) {
    throw new Error(`No se pudo descargar el media (${res.status}): ${sourceUrl}`);
  }
  const contentType = res.headers.get("content-type");
  const ext = extensionFromContentType(contentType, sourceUrl);
  const mediaType: "image" | "video" = contentType?.includes("video") || ext === "mp4" ? "video" : "image";

  const dir = path.join(MEDIA_ROOT, brandId);
  await fs.mkdir(dir, { recursive: true });
  const fileName = `${entryId}.${ext}`;
  const filePath = path.join(dir, fileName);

  const buffer = Buffer.from(await res.arrayBuffer());
  await fs.writeFile(filePath, buffer);

  return { mediaPath: `/dashboard-media/${brandId}/${fileName}`, mediaType };
}
