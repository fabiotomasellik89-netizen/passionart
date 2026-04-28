import { NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import path from "path";

export async function POST(request: Request) {
  const formData = await request.formData();
  const entries = formData.getAll("files");

  if (!entries.length) {
    return NextResponse.json({ error: "Nessun file inviato" }, { status: 400 });
  }

  const uploadDir = path.join(process.cwd(), "public", "images", "products");
  await mkdir(uploadDir, { recursive: true });

  const uploaded: { url: string }[] = [];

  for (const entry of entries) {
    if (!(entry instanceof File) || !entry.size) continue;
    const bytes = await entry.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const rawExt = entry.name.split(".").pop() ?? "jpg";
    const ext = rawExt.toLowerCase().replace(/[^a-z0-9]/g, "") || "jpg";
    const safeName = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
    const filepath = path.join(uploadDir, safeName);
    await writeFile(filepath, buffer);
    uploaded.push({ url: `/images/products/${safeName}` });
  }

  return NextResponse.json({ uploaded });
}
