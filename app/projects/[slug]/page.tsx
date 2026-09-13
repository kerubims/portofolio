import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { listProjects, getProjectBySlug, toPublic } from "@/lib/db";
import { FadeIn } from "@/components/motion/FadeIn";

export const dynamic = "force-dynamic";

export function generateStaticParams() {
  return []; // dynamic: admin bisa tambah project tanpa rebuild
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const row = getProjectBySlug(slug);
  if (!row) return { title: "Project not found" };
  const p = toPublic(row);
  return {
    title: `${p.title} - Ubim`,
    description: p.description,
  };
}

const toneMap: Record<string, string> = {
  blue: "bg-blue-50 text-blue-700 border-blue-200",
  green: "bg-emerald-50 text-emerald-700 border-emerald-200",
  amber: "bg-amber-50 text-amber-700 border-amber-200",
  purple: "bg-purple-50 text-purple-700 border-purple-200",
};

export default async function ProjectDetail({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const row = getProjectBySlug(slug);
  if (!row) notFound();
  const p = toPublic(row);
  const all = listProjects().map(toPublic);
  const idx = all.findIndex((x) => x.slug === p.slug);
  const prev = idx > 0 ? all[idx - 1] : null;
  const next = idx < all.length - 1 ? all[idx + 1] : null;

  return (
    <main className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-6 py-16">
        <FadeIn>
          <Link href="/#work" className="inline-flex items-center gap-1.5 text-sm text-secondary hover:text-foreground transition-colors">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
            Kembali ke daftar proyek
          </Link>

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <span className="text-[11px] uppercase tracking-widest text-secondary font-mono">{p.category}</span>
            {p.status && (
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono border ${toneMap[p.statusTone] || toneMap.blue}`}>
                {p.status}
              </span>
            )}
          </div>

          <h1 className="mt-2 text-3xl sm:text-5xl font-display font-semibold text-foreground leading-tight">{p.title}</h1>
          <p className="mt-4 text-lg text-secondary font-body max-w-2xl">{p.description}</p>

          {(p.role || p.period) && (
            <dl className="mt-6 flex flex-wrap gap-x-10 gap-y-2 text-sm">
              {p.role && (
                <div>
                  <dt className="text-[11px] uppercase tracking-widest text-secondary font-mono">Peran</dt>
                  <dd className="text-foreground font-medium">{p.role}</dd>
                </div>
              )}
              {p.period && (
                <div>
                  <dt className="text-[11px] uppercase tracking-widest text-secondary font-mono">Periode</dt>
                  <dd className="text-foreground font-medium">{p.period}</dd>
                </div>
              )}
            </dl>
          )}

          {p.techTags.length > 0 && (
            <div className="mt-6 flex flex-wrap gap-2">
              {p.techTags.map((t) => (
                <span key={t} className="px-2.5 py-1 rounded-md bg-surface-container text-foreground text-xs font-mono border border-outline-variant">
                  {t}
                </span>
              ))}
            </div>
          )}

          <div className="mt-8 flex flex-wrap gap-3">
            {p.liveUrl && (
              <a
                href={p.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-sweep inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-primary text-on-primary text-sm font-medium transition-colors hover:text-primary active:scale-[0.99]"
                style={{ "--sweep": "#ffffff", "--shine": "rgba(37, 99, 235, 0.5)" } as React.CSSProperties}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                  <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6M15 3h6v6M10 14 21 3" />
                </svg>
                Kunjungi situs live
              </a>
            )}
            {p.path && (
              <a
                href={p.path.startsWith("http") ? p.path : undefined}
                target="_blank"
                rel="noopener noreferrer"
                className={`btn-sweep inline-flex items-center gap-2 px-5 py-2.5 rounded-lg border border-outline-variant text-sm font-medium text-foreground transition-colors hover:text-primary active:scale-[0.99] ${p.path.startsWith("http") ? "" : "cursor-default"}`}
                style={{ "--sweep": "var(--surface-container)" } as React.CSSProperties}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                  <path d="M12 .3a12 12 0 0 0-3.8 23.38c.6.12.83-.26.83-.57L9 21.07c-3.34.72-4.04-1.61-4.04-1.61-.55-1.39-1.34-1.76-1.34-1.76-1.08-.74.09-.73.09-.73 1.2.09 1.83 1.24 1.83 1.24 1.07 1.83 2.8 1.3 3.49 1 .1-.78.42-1.31.76-1.61-2.66-.3-5.47-1.33-5.47-5.93 0-1.31.47-2.38 1.24-3.22-.14-.3-.54-1.52.1-3.18 0 0 1-.32 3.3 1.23a11.5 11.5 0 0 1 6 0c2.28-1.55 3.29-1.23 3.29-1.23.64 1.66.24 2.88.12 3.18a4.65 4.65 0 0 1 1.23 3.22c0 4.61-2.8 5.63-5.48 5.92.42.36.81 1.1.81 2.22l-.01 2.9c0 .31.2.69.82.57A12 12 0 0 0 12 .3Z" />
                </svg>
                {p.path.startsWith("http") ? "Lihat repositori" : p.path}
              </a>
            )}
          </div>
        </FadeIn>

        {p.longDescription && (
          <FadeIn className="mt-14">
            <h2 className="text-[11px] uppercase tracking-widest text-secondary font-mono mb-3">Ringkasan</h2>
            <div className="prose prose-neutral max-w-none whitespace-pre-line text-foreground/90 font-body leading-relaxed">
              {p.longDescription}
            </div>
          </FadeIn>
        )}

        {p.highlights.length > 0 && (
          <FadeIn className="mt-14">
            <h2 className="text-[11px] uppercase tracking-widest text-secondary font-mono mb-5">Fitur &amp; Fungsi</h2>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {p.highlights.map((h, i) => (
                <li key={i} className="bg-surface-container-lowest border border-outline-variant rounded-xl p-4">
                  <p className="font-medium text-foreground text-sm">{h.title || `Fitur ${i + 1}`}</p>
                  {h.text && <p className="mt-1 text-sm text-secondary font-body leading-relaxed">{h.text}</p>}
                </li>
              ))}
            </ul>
          </FadeIn>
        )}

        {p.images.length > 0 && (
          <FadeIn className="mt-14">
            <h2 className="text-[11px] uppercase tracking-widest text-secondary font-mono mb-5">Tangkapan Layar</h2>
            <div className="space-y-6">
              {p.images.map((im, i) => (
                <figure key={i}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={im.src}
                    alt={im.caption || `${p.title} screenshot ${i + 1}`}
                    className="w-full rounded-xl border border-outline-variant shadow-sm"
                    loading="lazy"
                  />
                  {im.caption && <figcaption className="mt-2 text-xs text-secondary font-mono">{im.caption}</figcaption>}
                </figure>
              ))}
            </div>
          </FadeIn>
        )}

        {(prev || next) && (
          <FadeIn className="mt-16 pt-8 border-t border-outline-variant">
            <div className="flex justify-between gap-6 text-sm">
              {prev ? (
                <Link href={`/projects/${prev.slug}`} className="group flex flex-col">
                  <span className="text-[11px] uppercase tracking-widest text-secondary font-mono">← Sebelumnya</span>
                  <span className="text-foreground font-medium group-hover:underline">{prev.title}</span>
                </Link>
              ) : <span />}
              {next && (
                <Link href={`/projects/${next.slug}`} className="group flex flex-col items-end text-right">
                  <span className="text-[11px] uppercase tracking-widest text-secondary font-mono">Selanjutnya →</span>
                  <span className="text-foreground font-medium group-hover:underline">{next.title}</span>
                </Link>
              )}
            </div>
          </FadeIn>
        )}
      </div>
    </main>
  );
}
