import { promises as fs } from "fs";
import path from "path";
import { NextResponse } from "next/server";
import { MEDIA_ROOT } from "@/lib/dashboard/media";

const CONTENT_TYPES: Record<string, string> = {
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  png: "image/png",
  webp: "image/webp",
  mp4: "video/mp4",
};

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ brandId: string; file: string }> }
) {
  const { brandId, file } = await params;

  // Los params vienen de la URL: nunca confiar en ellos para armar una ruta
  // de archivo sin antes descartar separadores de directorio (path traversal).
  if (brandId.includes("/") || brandId.includes("..") || file.includes("/") || file.includes("..")) {
    return new NextResponse("Not found", { status: 404 });
  }

  const filePath = path.join(/* turbopackIgnore: true */ MEDIA_ROOT, brandId, file);

  try {
    const data = await fs.readFile(filePath);
    const ext = file.split(".").pop()?.toLowerCase() ?? "";
    const contentType = CONTENT_TYPES[ext] ?? "application/octet-stream";
    return new NextResponse(new Uint8Array(data), {
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch {
    return new NextResponse("Not found", { status: 404 });
  }
}
