import { NextRequest, NextResponse } from "next/server";
import path from "path";
import fs from "fs/promises";

export const dynamic = "force-dynamic";

const TYPES: Record<string, string> = {
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".webp": "image/webp",
  ".gif": "image/gif",
};

export async function GET(_req: NextRequest, { params }: { params: Promise<{ file: string[] }> }) {
  const { file } = await params;
  const rel = file.join("/");
  // basic traversal guard
  if (rel.includes("..")) return NextResponse.json({ error: "bad path" }, { status: 400 });
  const dir = process.env.UPLOADS_DIR || path.join(process.cwd(), "uploads");
  // Volume-mounted at runtime; ignore from static tracing so the whole repo
  // isn't copied into the standalone output.
  const full = path.join(/* turbopackIgnore: true */ dir, rel);
  try {
    const buf = await fs.readFile(full);
    const ext = path.extname(full).toLowerCase();
    return new NextResponse(buf, {
      headers: {
        "Content-Type": TYPES[ext] || "application/octet-stream",
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch {
    return NextResponse.json({ error: "not found" }, { status: 404 });
  }
}
