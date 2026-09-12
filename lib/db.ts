import Database from "better-sqlite3";
import path from "path";
import fs from "fs";
import { projects as seedProjects } from "@/data/projects";

export type ProjectRow = {
  id: number;
  slug: string;
  title: string;
  category: string;
  status: string;
  statusTone: string;
  description: string;
  longDescription: string;
  role: string;
  period: string;
  techTags: string; // JSON array
  highlights: string; // JSON array of {title, text}
  images: string; // JSON array of {src, caption}
  path: string;
  liveUrl: string;
  sortOrder: number;
  updatedAt: string;
};

export type PublicProject = {
  id: number;
  slug: string;
  title: string;
  category: string;
  status: string;
  statusTone: "blue" | "green" | "amber" | "purple";
  description: string;
  longDescription: string;
  role: string;
  period: string;
  techTags: string[];
  highlights: { title: string; text: string }[];
  images: { src: string; caption?: string }[];
  path: string;
  liveUrl?: string;
};

export function toPublic(r: ProjectRow): PublicProject {
  return {
    id: r.id,
    slug: r.slug,
    title: r.title,
    category: r.category,
    status: r.status,
    statusTone: (r.statusTone as PublicProject["statusTone"]) || "blue",
    description: r.description,
    longDescription: r.longDescription,
    role: r.role,
    period: r.period,
    techTags: JSON.parse(r.techTags || "[]"),
    highlights: JSON.parse(r.highlights || "[]"),
    images: (JSON.parse(r.images || "[]") as unknown[]).map((im) =>
      typeof im === "string" ? { src: im } : im as { src: string; caption?: string },
    ),
    path: r.path,
    liveUrl: r.liveUrl || undefined,
  };
}

function seedRows(): Omit<ProjectRow, "id" | "updatedAt">[] {
  // Original static data used as one-time seed into SQLite
  return seedProjects.map((p, i) => ({
    slug: p.slug,
    title: p.title,
    category: p.category,
    status: p.status,
    statusTone: p.statusTone,
    description: p.description,
    longDescription: "",
    role: "",
    period: "",
    techTags: JSON.stringify(p.techTags),
    highlights: JSON.stringify([]),
    images: JSON.stringify([]),
    path: p.path,
    liveUrl: p.liveUrl || "",
    sortOrder: i,
  }));
}

let _db: Database.Database | null = null;

export function getDb(): Database.Database {
  if (_db) return _db;
  const dir = process.env.DATA_DIR || path.join(process.cwd(), "data-cms");
  fs.mkdirSync(dir, { recursive: true });
  const db = new Database(path.join(dir, "portfolio.db"));
  db.pragma("journal_mode = WAL");
  db.exec(`
    CREATE TABLE IF NOT EXISTS projects (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      slug TEXT NOT NULL UNIQUE,
      title TEXT NOT NULL,
      category TEXT NOT NULL DEFAULT '',
      status TEXT NOT NULL DEFAULT '',
      statusTone TEXT NOT NULL DEFAULT 'blue',
      description TEXT NOT NULL DEFAULT '',
      longDescription TEXT NOT NULL DEFAULT '',
      role TEXT NOT NULL DEFAULT '',
      period TEXT NOT NULL DEFAULT '',
      techTags TEXT NOT NULL DEFAULT '[]',
      highlights TEXT NOT NULL DEFAULT '[]',
      images TEXT NOT NULL DEFAULT '[]',
      path TEXT NOT NULL DEFAULT '',
      liveUrl TEXT NOT NULL DEFAULT '',
      sortOrder INTEGER NOT NULL DEFAULT 0,
      updatedAt TEXT NOT NULL DEFAULT (datetime('now'))
    );
  `);
  const { c } = db.prepare("SELECT COUNT(*) as c FROM projects").get() as { c: number };
  if (c === 0) {
    const ins = db.prepare(`INSERT INTO projects
      (slug,title,category,status,statusTone,description,longDescription,role,period,techTags,highlights,images,path,liveUrl,sortOrder)
      VALUES (@slug,@title,@category,@status,@statusTone,@description,@longDescription,@role,@period,@techTags,@highlights,@images,@path,@liveUrl,@sortOrder)`);
    const tx = db.transaction((rows: Omit<ProjectRow, "id" | "updatedAt">[]) => {
      for (const r of rows) ins.run(r);
    });
    tx(seedRows());
    console.log("[db] seeded projects from data/projects.ts");
  }
  _db = db;
  return db;
}

export function listProjects(): ProjectRow[] {
  return getDb().prepare("SELECT * FROM projects ORDER BY sortOrder ASC, id ASC").all() as ProjectRow[];
}

export function getProjectBySlug(slug: string): ProjectRow | undefined {
  return getDb().prepare("SELECT * FROM projects WHERE slug = ?").get(slug) as ProjectRow | undefined;
}
