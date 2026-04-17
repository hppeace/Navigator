import { NextResponse } from "next/server";
import { ZodError } from "zod";

import { saveMemberDraft } from "@/lib/navigator-data";

export async function POST(request: Request) {
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
