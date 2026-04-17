import { randomUUID } from "node:crypto";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

import { NextResponse } from "next/server";

export const runtime = "nodejs";

const uploadDirectory = path.join(process.cwd(), "public", "uploads");
const maxFileSize = 10 * 1024 * 1024;

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file");

    if (!(file instanceof File)) {
      return NextResponse.json({ error: "未检测到可上传文件。" }, { status: 400 });
    }

    if (file.size === 0) {
      return NextResponse.json({ error: "文件内容为空。" }, { status: 400 });
    }

    if (file.size > maxFileSize) {
      return NextResponse.json(
        { error: "单个附件不能超过 10MB。" },
        { status: 400 },
      );
    }

    const extension = path.extname(file.name).toLowerCase();
    const basename = sanitizeFilename(path.basename(file.name, extension));
    const filename = `${Date.now()}-${randomUUID().slice(0, 8)}-${basename || "attachment"}${extension}`;
    const buffer = Buffer.from(await file.arrayBuffer());

    await mkdir(uploadDirectory, { recursive: true });
    await writeFile(path.join(uploadDirectory, filename), buffer);

    return NextResponse.json({
      url: `/uploads/${filename}`,
      name: file.name,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json({ error: "附件上传失败，请重试。" }, { status: 500 });
  }
}

function sanitizeFilename(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9\u4e00-\u9fa5-_]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 60);
}
