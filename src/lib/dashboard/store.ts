import { promises as fs } from "fs";
import path from "path";
import type { DashboardData } from "./types";

/**
 * DASHBOARD_DATA_DIR apunta a un disco persistente cuando esto corre en un
 * servidor 24/7 (ej. un volumen montado en Railway/Render). En desarrollo
 * local, sin esa variable, usa la carpeta "data" del proyecto como siempre.
 */
const DATA_DIR = process.env.DASHBOARD_DATA_DIR || path.join(process.cwd(), "data");
const DATA_FILE = path.join(DATA_DIR, "dashboard-data.json");

export async function readData(): Promise<DashboardData> {
  const raw = await fs.readFile(DATA_FILE, "utf-8");
  return JSON.parse(raw) as DashboardData;
}

export async function writeData(data: DashboardData): Promise<void> {
  await fs.mkdir(DATA_DIR, { recursive: true });
  await fs.writeFile(DATA_FILE, JSON.stringify(data, null, 2) + "\n", "utf-8");
}
