import { promises as fs } from "fs";
import path from "path";
import type { DashboardData } from "./types";

const DATA_FILE = path.join(process.cwd(), "data", "dashboard-data.json");

export async function readData(): Promise<DashboardData> {
  const raw = await fs.readFile(DATA_FILE, "utf-8");
  return JSON.parse(raw) as DashboardData;
}

export async function writeData(data: DashboardData): Promise<void> {
  await fs.writeFile(DATA_FILE, JSON.stringify(data, null, 2) + "\n", "utf-8");
}
