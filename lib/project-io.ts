export function normalize(b: Record<string, unknown>) {
  const j = (v: unknown, fb: unknown) => (typeof v === "string" ? v : JSON.stringify(v ?? fb));
  return {
    slug: String(b.slug || ""),
    title: String(b.title || ""),
    category: String(b.category || ""),
    status: String(b.status || ""),
    statusTone: String(b.statusTone || "blue"),
    description: String(b.description || ""),
    longDescription: String(b.longDescription || ""),
    role: String(b.role || ""),
    period: String(b.period || ""),
    techTags: j(b.techTags, []),
    highlights: j(b.highlights, []),
    images: j(b.images, []),
    path: String(b.path || ""),
    liveUrl: String(b.liveUrl || ""),
    sortOrder: Number(b.sortOrder ?? 0),
  };
}

export function slugify(s: string): string {
  return s.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
}
