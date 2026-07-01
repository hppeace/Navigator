import { NextResponse } from "next/server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { saveMemberDraft } from "@/lib/navigator-data";

export const runtime = "nodejs";

// PATCH: Approve or reject a change request
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  const user = session?.user as Record<string, unknown> | undefined;

  if (!user?.isAdmin) {
    return NextResponse.json({ error: "仅管理员可执行此操作。" }, { status: 403 });
  }

  const { id } = await params;
  const employeeId = user.employeeId as string;

  try {
    const body = await request.json();
    const { action, rejectReason } = body;

    if (action !== "approve" && action !== "reject") {
      return NextResponse.json({ error: "无效的操作。" }, { status: 400 });
    }

    const changeRequest = await prisma.profileChangeRequest.findUnique({
      where: { id },
    });

    if (!changeRequest) {
      return NextResponse.json({ error: "申请不存在。" }, { status: 404 });
    }

    if (changeRequest.status !== "pending") {
      return NextResponse.json({ error: "该申请已处理。" }, { status: 400 });
    }

    if (action === "approve") {
      // Parse the snapshot and save it
      const snapshotData = JSON.parse(changeRequest.snapshotData);
      snapshotData.id = changeRequest.profileId; // Ensure we're updating the right profile
      await saveMemberDraft(snapshotData);
    }

    // Update the change request status
    const updatedRequest = await prisma.profileChangeRequest.update({
      where: { id },
      data: {
        status: action === "approve" ? "approved" : "rejected",
        rejectReason: action === "reject" ? rejectReason : null,
        reviewedAt: new Date(),
        reviewedBy: employeeId,
      },
    });

    return NextResponse.json({ request: updatedRequest });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "处理申请失败。" }, { status: 500 });
  }
}
