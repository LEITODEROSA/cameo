export type Platform = "Instagram" | "TikTok" | "Facebook";

export type ContentFormat = "Post" | "Reel" | "Historia" | "Video" | "Anuncio";

export type AdNetwork = "Meta (Facebook/Instagram)" | "Google";

export type AdStatus = "Activo" | "Pausado o finalizado" | "Sin verificar";

export type Segment = "Mujer" | "Hombre" | "Unisex" | "Niños";

export interface Brand {
  id: string;
  name: string;
  segment: Segment;
  country: string;
  instagramHandle?: string;
  tiktokHandle?: string;
  isOwn?: boolean;
  notes?: string;
  createdAt: string;
}

export interface ContentMetrics {
  likes?: number;
  comments?: number;
  shares?: number;
  saves?: number;
  views?: number;
}

export interface ContentEntry {
  id: string;
  brandId: string;
  platform: Platform;
  format: ContentFormat;
  aestheticTags: string[];
  url?: string;
  publishedAt: string;
  caption?: string;
  metrics: ContentMetrics;
  isAd: boolean;
  adNetwork?: AdNetwork;
  adStatus?: AdStatus;
  createdAt: string;
}

export interface DashboardData {
  brands: Brand[];
  content: ContentEntry[];
}

export const AESTHETIC_TAGS = [
  "Long book / carta",
  "Estático simple",
  "Collage",
  "Carrusel de fotos",
  "Boomerang",
  "Encuesta interactiva",
  "Cuenta regresiva",
  "Detrás de escena (BTS)",
  "UGC / Repost",
  "Meme / Humor",
  "Antes y después",
  "Producto flotante / still life",
  "Editorial / Campaña",
  "GRWM (Get Ready With Me)",
  "Unboxing",
  "Look del día (OOTD)",
  "Video largo",
] as const;
