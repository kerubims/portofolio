import { NextRequest, NextResponse } from "next/server";
import { isAuthenticated } from "@/lib/auth";
import { listProjects, getDb } from "@/lib/db";
import { normalize, slugify } from "@/lib/project-io";

export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json({ projects: listProjects() });
}

export async function POST(req: NextRequest) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const body = await req.json().catch(() => null);
  if (!body?.title) return NextResponse.json({ error: "title required" }, { status: 400 });
  const slug = slugify(body.slug || body.title);
  const db = getDb();
  try {
    const info = db
      .prepare(
        `INSERT INTO projects (slug,title,category,status,statusTone,description,longDescription,role,period,techTags,highlights,images,path,liveUrl,sortOrder)
         VALUES (@slug,@title,@category,@status,@statusTone,@description,@longDescription,@role,@period,@techTags,@highlights,@images,@path,@liveUrl,@sortOrder)`
      )
      .run(normalize({ ...body, slug }));
    const row = db.prepare("SELECT * FROM projects WHERE id = ?").get(info.lastInsertRowid);
    return NextResponse.json({ project: row }, { status: 201 });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "insert failed";
    return NextResponse.json({ error: msg.includes("UNIQUE") ? "slug already exists" : msg }, { status: 400 });
  }
}
