import { NextRequest, NextResponse } from "next/server";
import { isAuthenticated } from "@/lib/auth";
import { getDb } from "@/lib/db";
import { normalize } from "@/lib/project-io";

export const dynamic = "force-dynamic";

type Ctx = { params: Promise<{ id: string }> };

export async function PUT(req: NextRequest, { params }: Ctx) {
  if (!(await isAuthenticated())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;
  const body = await req.json().catch(() => null);
  if (!body?.title) return NextResponse.json({ error: "title required" }, { status: 400 });
  const db = getDb();
  try {
    db.prepare(
      `UPDATE projects SET slug=@slug,title=@title,category=@category,status=@status,statusTone=@statusTone,
        description=@description,longDescription=@longDescription,role=@role,period=@period,
        techTags=@techTags,highlights=@highlights,images=@images,path=@path,liveUrl=@liveUrl,
        sortOrder=@sortOrder,updatedAt=datetime('now')
       WHERE id=@id`
    ).run({ ...normalize(body), id: Number(id) });
    const row = db.prepare("SELECT * FROM projects WHERE id = ?").get(Number(id));
    return NextResponse.json({ project: row });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "update failed";
    return NextResponse.json({ error: msg.includes("UNIQUE") ? "slug already exists" : msg }, { status: 400 });
  }
}

export async function DELETE(_req: NextRequest, { params }: Ctx) {
  if (!(await isAuthenticated())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;
  getDb().prepare("DELETE FROM projects WHERE id = ?").run(Number(id));
  return NextResponse.json({ ok: true });
}
