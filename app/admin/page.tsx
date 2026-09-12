"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

type Row = {
  id: number; slug: string; title: string; category: string; status: string;
  statusTone: string; description: string; longDescription: string; role: string;
  period: string; techTags: string; highlights: string; images: string;
  path: string; liveUrl: string; sortOrder: number;
};
type Highlight = { title: string; text: string };
type Image = { src: string; caption?: string };

const empty = (): Row => ({
  id: 0, slug: "", title: "", category: "", status: "LIVE", statusTone: "green",
  description: "", longDescription: "", role: "", period: "",
  techTags: "[]", highlights: "[]", images: "[]", path: "", liveUrl: "", sortOrder: 0,
});

export default function AdminDashboard() {
  const [rows, setRows] = useState<Row[] | null>(null);
  const [draft, setDraft] = useState<Row | null>(null);
  const [msg, setMsg] = useState("");
  const [busy, setBusy] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const load = useCallback(async () => {
    const r = await fetch("/api/projects");
    if (r.status === 401) { router.replace("/admin/login"); return; }
    const d = await r.json();
    setRows(d.projects);
  }, [router]);

  useEffect(() => { load(); }, [load]);

  async function save() {
    if (!draft) return;
    setBusy(true); setMsg("");
    const body = JSON.stringify({ ...draft, slug: draft.slug || slugify(draft.title) });
    const res = draft.id
      ? await fetch(`/api/projects/${draft.id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body })
      : await fetch("/api/projects", { method: "POST", headers: { "Content-Type": "application/json" }, body });
    const d = await res.json();
    setBusy(false);
    if (!res.ok) { setMsg(d.error || "save failed"); return; }
    setMsg("Saved ✓");
    setDraft(null);
    load();
  }

  async function del(r: Row) {
    if (!confirm(`Hapus project "${r.title}"?`)) return;
    const res = await fetch(`/api/projects/${r.id}`, { method: "DELETE" });
    if (res.ok) load(); else setMsg("delete failed");
  }

  async function upload(files: FileList | null) {
    if (!files || !draft) return;
    setBusy(true);
    const imgs: Image[] = JSON.parse(draft.images || "[]");
    for (const f of Array.from(files)) {
      const fd = new FormData();
      fd.append("file", f);
      const res = await fetch("/api/upload", { method: "POST", body: fd });
      const d = await res.json();
      if (res.ok) imgs.push({ src: d.url, caption: "" });
      else setMsg(d.error || "upload failed");
    }
    setDraft({ ...draft, images: JSON.stringify(imgs) });
    setBusy(false);
    if (fileRef.current) fileRef.current.value = "";
  }

  async function logout() {
    await fetch("/api/logout", { method: "POST" });
    router.replace("/admin/login");
  }

  if (!rows) return <main className="p-10 text-secondary">Loading…</main>;

  const tags = draft ? JSON.parse(draft.techTags || "[]") as string[] : [];
  const highlights = draft ? JSON.parse(draft.highlights || "[]") as Highlight[] : [];
  const images = draft ? JSON.parse(draft.images || "[]") as Image[] : [];

  return (
    <main className="min-h-screen bg-background p-6 sm:p-10">
      <div className="max-w-4xl mx-auto">
        <header className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-xl font-semibold text-foreground">Portfolio Admin</h1>
            <p className="text-sm text-secondary">Kelola project portofolio — tanpa sentuh kode.</p>
          </div>
          <div className="flex gap-3 text-sm">
            <Link href="/" className="text-secondary hover:text-foreground">← Site</Link>
            <button onClick={logout} className="text-red-600 hover:underline">Logout</button>
          </div>
        </header>

        {msg && <p className="mb-4 text-sm text-blue-700 bg-blue-50 border border-blue-200 rounded-lg px-3 py-2">{msg}</p>}

        {!draft && (
          <>
            <button onClick={() => setDraft(empty())} className="mb-5 px-4 py-2 rounded-lg bg-primary text-on-primary text-sm font-medium hover:opacity-90">
              + New Project
            </button>
            <ul className="space-y-2">
              {rows.map((r) => (
                <li key={r.id} className="flex items-center justify-between gap-4 bg-surface-container-lowest border border-outline-variant rounded-xl px-4 py-3">
                  <div className="min-w-0">
                    <p className="font-medium text-foreground truncate">{r.title}</p>
                    <p className="text-xs text-secondary font-mono">/{r.slug} · {r.category} · {r.status}</p>
                  </div>
                  <div className="flex items-center gap-3 shrink-0 text-sm">
                    <Link href={`/projects/${r.slug}`} className="text-secondary hover:text-foreground">View</Link>
                    <button onClick={() => setDraft(r)} className="text-blue-700 hover:underline">Edit</button>
                    <button onClick={() => del(r)} className="text-red-600 hover:underline">Delete</button>
                  </div>
                </li>
              ))}
            </ul>
          </>
        )}

        {draft && (
          <div className="bg-surface-container-lowest border border-outline-variant rounded-2xl p-5 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field label="Title"><input className={inp} value={draft.title} onChange={(e) => setDraft({ ...draft, title: e.target.value })} /></Field>
              <Field label="Slug"><input className={inp} value={draft.slug} placeholder={slugify(draft.title)} onChange={(e) => setDraft({ ...draft, slug: e.target.value })} /></Field>
              <Field label="Category"><input className={inp} value={draft.category} onChange={(e) => setDraft({ ...draft, category: e.target.value })} /></Field>
              <Field label="Status (SHIPPED/LIVE/PILOT/BETA)">
                <div className="flex gap-2">
                  <input className={inp} value={draft.status} onChange={(e) => setDraft({ ...draft, status: e.target.value })} />
                  <select className={inp + " w-28"} value={draft.statusTone} onChange={(e) => setDraft({ ...draft, statusTone: e.target.value })}>
                    {["blue", "green", "amber", "purple"].map((t) => <option key={t}>{t}</option>)}
                  </select>
                </div>
              </Field>
              <Field label="Role"><input className={inp} value={draft.role} onChange={(e) => setDraft({ ...draft, role: e.target.value })} /></Field>
              <Field label="Period"><input className={inp} value={draft.period} placeholder="2025 — now" onChange={(e) => setDraft({ ...draft, period: e.target.value })} /></Field>
              <Field label="Live URL"><input className={inp} value={draft.liveUrl} onChange={(e) => setDraft({ ...draft, liveUrl: e.target.value })} /></Field>
              <Field label="Repo / Path"><input className={inp} value={draft.path} onChange={(e) => setDraft({ ...draft, path: e.target.value })} /></Field>
            </div>
            <Field label="Short description (card)"><textarea rows={2} className={inp} value={draft.description} onChange={(e) => setDraft({ ...draft, description: e.target.value })} /></Field>
            <Field label="Long description (detail page)"><textarea rows={4} className={inp} value={draft.longDescription} onChange={(e) => setDraft({ ...draft, longDescription: e.target.value })} /></Field>
            <Field label="Tech tags (comma separated)">
              <input className={inp} value={tags.join(", ")} onChange={(e) => setDraft({ ...draft, techTags: JSON.stringify(e.target.value.split(",").map((s) => s.trim()).filter(Boolean)) })} />
            </Field>

            <div>
              <p className="text-sm font-medium text-foreground mb-2">Fitur / Fungsi (muncul di halaman detail)</p>
              {highlights.map((h, i) => (
                <div key={i} className="flex gap-2 mb-2">
                  <input className={inp + " w-48"} placeholder="Nama fitur" value={h.title} onChange={(e) => { const c = [...highlights]; c[i] = { ...c[i], title: e.target.value }; setDraft({ ...draft, highlights: JSON.stringify(c) }); }} />
                  <input className={inp} placeholder="Deskripsi fungsi" value={h.text} onChange={(e) => { const c = [...highlights]; c[i] = { ...c[i], text: e.target.value }; setDraft({ ...draft, highlights: JSON.stringify(c) }); }} />
                  <button onClick={() => { const c = highlights.filter((_, j) => j !== i); setDraft({ ...draft, highlights: JSON.stringify(c) }); }} className="text-red-600 px-2">✕</button>
                </div>
              ))}
              <button onClick={() => setDraft({ ...draft, highlights: JSON.stringify([...highlights, { title: "", text: "" }]) })} className="text-sm text-blue-700 hover:underline">+ tambah fitur</button>
            </div>

            <div>
              <p className="text-sm font-medium text-foreground mb-2">Gambar halaman (upload)</p>
              <div className="flex flex-wrap gap-3 mb-2">
                {images.map((im, i) => (
                  <div key={i} className="relative w-36">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={im.src} alt="" className="w-36 h-24 object-cover rounded-lg border border-outline-variant" />
                    <button onClick={() => { const c = images.filter((_, j) => j !== i); setDraft({ ...draft, images: JSON.stringify(c) }); }} className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-red-600 text-white text-xs">✕</button>
                    <input className="mt-1 w-full text-xs border border-outline-variant rounded px-1 py-0.5 bg-background" placeholder="caption" value={im.caption || ""} onChange={(e) => { const c = [...images]; c[i] = { ...c[i], caption: e.target.value }; setDraft({ ...draft, images: JSON.stringify(c) }); }} />
                  </div>
                ))}
              </div>
              <input ref={fileRef} type="file" accept="image/jpeg,image/png,image/webp,image/gif" multiple onChange={(e) => upload(e.target.files)} className="text-sm" />
            </div>

            <Field label="Sort order"><input type="number" className={inp + " w-24"} value={draft.sortOrder} onChange={(e) => setDraft({ ...draft, sortOrder: Number(e.target.value) })} /></Field>

            <div className="flex gap-3 pt-2">
              <button onClick={save} disabled={busy || !draft.title} className="px-5 py-2 rounded-lg bg-primary text-on-primary text-sm font-medium hover:opacity-90 disabled:opacity-50">
                {busy ? "Saving…" : draft.id ? "Update" : "Create"}
              </button>
              <button onClick={() => setDraft(null)} className="px-5 py-2 rounded-lg border border-outline-variant text-sm text-secondary hover:text-foreground">Cancel</button>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}

function slugify(s: string) {
  return s.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
}
const inp = "w-full px-3 py-2 rounded-lg border border-outline-variant bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30";
function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="block text-xs font-medium text-secondary mb-1 uppercase tracking-wide">{label}</span>
      {children}
    </label>
  );
}
