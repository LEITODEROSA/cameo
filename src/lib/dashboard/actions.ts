"use server";

import { randomUUID } from "crypto";
import { revalidatePath } from "next/cache";
import { readData, writeData } from "./store";
import type {
  AdNetwork,
  AdStatus,
  Brand,
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

  const entry = {
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
    createdAt: new Date().toISOString(),
  };

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
