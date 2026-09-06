import type { ContentEntry } from "./types";

export function engagementScore(entry: ContentEntry): number {
  const m = entry.metrics;
  return (m.likes ?? 0) + (m.comments ?? 0) * 2 + (m.shares ?? 0) * 3 + (m.saves ?? 0) * 3 + Math.round((m.views ?? 0) * 0.05);
}

export function sumMetric(entries: ContentEntry[], key: keyof ContentEntry["metrics"]): number {
  return entries.reduce((acc, e) => acc + (e.metrics[key] ?? 0), 0);
}

export function topTags(entries: ContentEntry[], limit = 8) {
  const counts = new Map<string, { count: number; engagement: number }>();
  for (const e of entries) {
    for (const tag of e.aestheticTags) {
      const current = counts.get(tag) ?? { count: 0, engagement: 0 };
      current.count += 1;
      current.engagement += engagementScore(e);
      counts.set(tag, current);
    }
  }
  return [...counts.entries()]
    .map(([tag, v]) => ({ tag, ...v, avgEngagement: Math.round(v.engagement / v.count) }))
    .sort((a, b) => b.count - a.count)
    .slice(0, limit);
}

export function formatBreakdown(entries: ContentEntry[]) {
  const counts = new Map<string, number>();
  for (const e of entries) counts.set(e.format, (counts.get(e.format) ?? 0) + 1);
  return [...counts.entries()].sort((a, b) => b[1] - a[1]);
}

/** Agrupa por objetivo de canal (playbook de estrategia) y promedia el engagement de cada uno. */
export function channelGoalBreakdown(entries: ContentEntry[]) {
  const counts = new Map<string, { count: number; engagement: number }>();
  for (const e of entries) {
    if (!e.channelGoal) continue;
    const current = counts.get(e.channelGoal) ?? { count: 0, engagement: 0 };
    current.count += 1;
    current.engagement += engagementScore(e);
    counts.set(e.channelGoal, current);
  }
  return [...counts.entries()]
    .map(([goal, v]) => ({ goal, ...v, avgEngagement: Math.round(v.engagement / v.count) }))
    .sort((a, b) => b.avgEngagement - a.avgEngagement);
}

export function formatDate(iso: string) {
  try {
    return new Date(iso).toLocaleDateString("es-AR", { day: "2-digit", month: "short", year: "numeric" });
  } catch {
    return iso;
  }
}
