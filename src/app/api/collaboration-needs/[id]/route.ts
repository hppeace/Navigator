import { NextResponse } from "next/server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

// PATCH: Update a collaboration need (edit content or close/reopen)
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  const user = session?.user as Record<string, unknown> | undefined;

  if (!user?.employeeId) {
    return NextResponse.json({ error: "请先登录。" }, { status: 401 });
  }

  const { id } = await params;
  const employeeId = user.employeeId as string;
  const isAdmin = user.isAdmin as boolean;

  try {
    const body = await request.json();
    const { status, title, content, requirements } = body;

    const need = await prisma.collaborationNeed.findUnique({
      where: { id },
    });

    if (!need) {
      return NextResponse.json({ error: "需求不存在。" }, { status: 404 });
    }

    // Only author or admin can update
    if (!isAdmin && need.authorId !== employeeId) {
      return NextResponse.json({ error: "无权修改此需求。" }, { status: 403 });
    }

    const updateData: Record<string, string | null> = {};

    if (status !== undefined) {
      updateData.status = status;
    }
    if (title !== undefined) {
      updateData.title = title.trim();
    }
    if (content !== undefined) {
      updateData.content = content.trim();
    }
    if (requirements !== undefined) {
      updateData.requirements = requirements?.trim() || null;
    }

    const updated = await prisma.collaborationNeed.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json({ need: updated });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "更新失败。" }, { status: 500 });
  }
}

// DELETE: Delete a collaboration need
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  const user = session?.user as Record<string, unknown> | undefined;

  if (!user?.employeeId) {
    return NextResponse.json({ error: "请先登录。" }, { status: 401 });
  }

  const { id } = await params;
  const employeeId = user.employeeId as string;
  const isAdmin = user.isAdmin as boolean;

  try {
    const need = await prisma.collaborationNeed.findUnique({
      where: { id },
    });

    if (!need) {
      return NextResponse.json({ error: "需求不存在。" }, { status: 404 });
    }

    // Only author or admin can delete
    if (!isAdmin && need.authorId !== employeeId) {
      return NextResponse.json({ error: "无权删除此需求。" }, { status: 403 });
    }

    await prisma.collaborationNeed.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "删除失败。" }, { status: 500 });
  }
}
