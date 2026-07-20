import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

const registerSchema = z.object({
  employeeId: z.string().min(1, "工号不能为空"),
  password: z.string().min(6, "密码至少6位"),
  name: z.string().min(1, "姓名不能为空"),
  department: z.string().min(1, "院系不能为空"),
  phone: z.string().min(1, "电话不能为空"),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const data = registerSchema.parse(body);

    // Check if employee ID already exists
    const existingUser = await prisma.user.findUnique({
      where: { employeeId: data.employeeId },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "该工号已被注册" },
        { status: 400 }
      );
    }

    // Hash password and create user
    const hashedPassword = await bcrypt.hash(data.password, 10);

    const user = await prisma.user.create({
      data: {
        employeeId: data.employeeId,
        password: hashedPassword,
        name: data.name,
        isAdmin: false,
      },
      select: {
        id: true,
        employeeId: true,
        name: true,
      },
    });

    // Create member profile for the new user
    await prisma.memberProfile.create({
      data: {
        employeeId: data.employeeId,
        name: data.name,
        department: data.department,
        phone: data.phone,
      },
    });

    return NextResponse.json({ user, message: "注册成功" });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.issues[0].message },
        { status: 400 }
      );
    }

    console.error(error);
    return NextResponse.json({ error: "注册失败" }, { status: 500 });
  }
}
