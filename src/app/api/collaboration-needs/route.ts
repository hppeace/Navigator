import { NextResponse } from "next/server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

// GET: List all collaboration needs with author contact info
export async function GET() {
  const session = await auth();
  const user = session?.user as Record<string, unknown> | undefined;

  if (!user?.employeeId) {
    return NextResponse.json({ error: "请先登录。" }, { status: 401 });
  }

  const needs = await prisma.collaborationNeed.findMany({
    orderBy: { createdAt: "desc" },
  });

  // Fetch author contact info from MemberProfile
  const needsWithContact = await Promise.all(
    needs.map(async (need) => {
      const profile = await prisma.memberProfile.findFirst({
        where: { employeeId: need.authorId },
        select: { email: true, phone: true, researchDirection: true },
      });

      return {
        ...need,
        email: profile?.email || null,
        phone: profile?.phone || null,
        researchDirection: profile?.researchDirection || null,
      };
    })
  );

  return NextResponse.json({ needs: needsWithContact });
}

// POST: Create a new collaboration need
export async function POST(request: Request) {
  const session = await auth();
  const user = session?.user as Record<string, unknown> | undefined;

  if (!user?.employeeId) {
    return NextResponse.json({ error: "请先登录。" }, { status: 401 });
  }

  const employeeId = user.employeeId as string;
  const userName = (user.name as string) || employeeId;

  try {
    const payload = await request.json();
    const { title, content, requirements, department } = payload;

    if (!title?.trim() || !content?.trim()) {
      return NextResponse.json({ error: "标题和内容不能为空。" }, { status: 400 });
    }

    const need = await prisma.collaborationNeed.create({
      data: {
        authorId: employeeId,
        authorName: userName,
        department: department || null,
        title: title.trim(),
        content: content.trim(),
        requirements: requirements?.trim() || null,
      },
    });

    return NextResponse.json({ need });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "发布失败。" }, { status: 500 });
  }
}
