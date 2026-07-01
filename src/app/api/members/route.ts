import { NextResponse } from "next/server";
import { ZodError } from "zod";

import { auth } from "@/lib/auth";
import { saveMemberDraft } from "@/lib/navigator-data";

export async function POST(request: Request) {
  const session = await auth();
  const user = session?.user as Record<string, unknown> | undefined;

  if (!user?.employeeId) {
    return NextResponse.json({ error: "请先登录。" }, { status: 401 });
  }

  try {
    const payload = await request.json();
    const profile = await saveMemberDraft(payload);

    return NextResponse.json({ profile });
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        {
          error: "表单数据格式不正确，请检查后重试。",
          details: error.flatten(),
        },
        { status: 400 },
      );
    }

    console.error(error);

    return NextResponse.json(
      {
        error: "保存失败，请稍后重试。",
      },
      { status: 500 },
    );
  }
}
