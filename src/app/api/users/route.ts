import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

const createUserSchema = z.object({
  employeeId: z.string().min(1, "工号不能为空"),
  password: z.string().min(6, "密码至少6位"),
  name: z.string().optional(),
  isAdmin: z.boolean().default(false),
});

export async function GET() {
  const session = await auth();

  if (!session?.user || !(session.user as any).isAdmin) {
    return NextResponse.json({ error: "无权限" }, { status: 403 });
  }

  const users = await prisma.user.findMany({
    select: {
      id: true,
      employeeId: true,
      name: true,
      isAdmin: true,
      createdAt: true,
    },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({ users });
}

export async function POST(request: Request) {
  const session = await auth();

  if (!session?.user || !(session.user as any).isAdmin) {
    return NextResponse.json({ error: "无权限" }, { status: 403 });
  }

  try {
    const body = await request.json();
    const data = createUserSchema.parse(body);

    const existing = await prisma.user.findUnique({
      where: { employeeId: data.employeeId },
    });

    if (existing) {
      return NextResponse.json({ error: "工号已存在" }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(data.password, 10);

    const user = await prisma.user.create({
      data: {
        employeeId: data.employeeId,
        password: hashedPassword,
        name: data.name,
        isAdmin: data.isAdmin,
      },
      select: {
        id: true,
        employeeId: true,
        name: true,
        isAdmin: true,
        createdAt: true,
      },
    });

    return NextResponse.json({ user });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.issues[0].message },
        { status: 400 },
      );
    }

    console.error(error);
    return NextResponse.json({ error: "创建失败" }, { status: 500 });
  }
}
