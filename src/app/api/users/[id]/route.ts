import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

const resetPasswordSchema = z.object({
  password: z.string().min(6, "密码至少6位"),
});

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();

  if (!session?.user || !(session.user as any).isAdmin) {
    return NextResponse.json({ error: "无权限" }, { status: 403 });
  }

  const { id } = await params;

  try {
    const body = await request.json();
    const { password } = resetPasswordSchema.parse(body);

    const hashedPassword = await bcrypt.hash(password, 10);

    await prisma.user.update({
      where: { id },
      data: { password: hashedPassword },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.issues[0].message },
        { status: 400 },
      );
    }

    console.error(error);
    return NextResponse.json({ error: "操作失败" }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();

  if (!session?.user || !(session.user as any).isAdmin) {
    return NextResponse.json({ error: "无权限" }, { status: 403 });
  }

  const { id } = await params;

  // Get user to find their employeeId
  const user = await prisma.user.findUnique({
    where: { id },
    select: { employeeId: true, isAdmin: true },
  });

  if (!user) {
    return NextResponse.json({ error: "用户不存在" }, { status: 404 });
  }

  if (user.isAdmin) {
    return NextResponse.json({ error: "不能删除管理员账户" }, { status: 400 });
  }

  // Delete user and their profile in a transaction
  await prisma.$transaction([
    prisma.user.delete({ where: { id } }),
    prisma.memberProfile.deleteMany({ where: { employeeId: user.employeeId } }),
  ]);

  return NextResponse.json({ success: true });
}
