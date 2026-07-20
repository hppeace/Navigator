import { NextResponse } from "next/server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

// GET: List change requests (admin sees all, user sees own)
export async function GET() {
  const session = await auth();
  const user = session?.user as Record<string, unknown> | undefined;

  if (!user?.employeeId) {
    return NextResponse.json({ error: "请先登录。" }, { status: 401 });
  }

  const isAdmin = user.isAdmin as boolean;
  const employeeId = user.employeeId as string;

  const requests = await prisma.profileChangeRequest.findMany({
    where: isAdmin ? {} : { requesterId: employeeId },
    include: {
      profile: {
        select: { id: true, name: true, employeeId: true },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({ requests });
}

// POST: Submit a change request
export async function POST(request: Request) {
  const session = await auth();
  const user = session?.user as Record<string, unknown> | undefined;

  if (!user?.employeeId) {
    return NextResponse.json({ error: "请先登录。" }, { status: 401 });
  }

  const isAdmin = user.isAdmin as boolean;
  const employeeId = user.employeeId as string;
  const userName = (user.name as string) || employeeId;

  try {
    const payload = await request.json();
    const { profileId, snapshotData } = payload;

    if (!profileId || !snapshotData) {
      return NextResponse.json({ error: "参数不完整。" }, { status: 400 });
    }

    // Verify the profile exists and get the full current data
    const existingProfile = await prisma.memberProfile.findUnique({
      where: { id: profileId },
      include: {
        activities: { orderBy: { sortOrder: "asc" } },
        keyPerformances: { orderBy: { sortOrder: "asc" } },
        careerRecords: { orderBy: { sortOrder: "asc" } },
        contacts: { orderBy: { sortOrder: "asc" } },
        conversations: { orderBy: { sortOrder: "asc" } },
        issueSuggestions: { orderBy: { sortOrder: "asc" } },
      },
    });

    if (!existingProfile) {
      return NextResponse.json({ error: "成员档案不存在。" }, { status: 404 });
    }

    // Non-admin can only submit changes for their own profile
    if (!isAdmin && existingProfile.employeeId && existingProfile.employeeId !== employeeId) {
      return NextResponse.json({ error: "无权修改他人档案。" }, { status: 403 });
    }

    // Get the original data as MemberDraft using inline serialization
    const blank = {
      id: "",
      employeeId: "",
      department: "",
      workspaceRole: "",
      name: "",
      gender: "",
      birthDate: "",
      ethnicity: "",
      hometown: "",
      politicalStatus: "",
      partyAge: "",
      partyRole: "",
      academicTitle: "",
      mentorType: "",
      researchDirection: "",
      workStartDate: "",
      schoolEntryDate: "",
      highestDegree: "",
      biography: "",
      talentPrograms: "",
      majorProjects: "",
      talentTitles: "",
      provincialAwards: "",
      socialPartTime: "",
      idNumber: "",
      phone: "",
      wechat: "",
      email: "",
      maritalStatus: "",
      spouseChildren: "",
      emergencyContact: "",
      hobbies: "",
      partyIntent: "待考虑",
      applicationSubmitted: false,
      developmentStage: "",
      politicalStudyNotes: "",
      democraticReviewNotes: "",
      ideologyAttachment: { url: "", name: "" },
      avatar: { url: "", name: "" },
      activities: [],
      keyPerformances: [],
      careerRecords: [],
      contacts: [],
      conversations: [],
      issueSuggestions: [],
    };

    const contactRoleMap = new Map(existingProfile.contacts.map((c) => [c.role, c]));
    const toDateStr = (d: Date | null) => d ? d.toISOString().slice(0, 10) : "";

    const originalData = {
      ...blank,
      id: existingProfile.id,
      employeeId: existingProfile.employeeId ?? "",
      department: existingProfile.department ?? "",
      workspaceRole: existingProfile.workspaceRole ?? "",
      name: existingProfile.name,
      gender: existingProfile.gender ?? "",
      birthDate: toDateStr(existingProfile.birthDate),
      ethnicity: existingProfile.ethnicity ?? "",
      hometown: existingProfile.hometown ?? "",
      politicalStatus: existingProfile.politicalStatus ?? "",
      partyAge: existingProfile.partyAge ?? "",
      partyRole: existingProfile.partyRole ?? "",
      academicTitle: existingProfile.academicTitle ?? "",
      mentorType: existingProfile.mentorType ?? "",
      researchDirection: existingProfile.researchDirection ?? "",
      workStartDate: toDateStr(existingProfile.workStartDate),
      schoolEntryDate: toDateStr(existingProfile.schoolEntryDate),
      highestDegree: existingProfile.highestDegree ?? "",
      biography: existingProfile.biography ?? "",
      talentPrograms: existingProfile.talentPrograms ?? "",
      majorProjects: existingProfile.majorProjects ?? "",
      talentTitles: existingProfile.talentTitles ?? "",
      provincialAwards: existingProfile.provincialAwards ?? "",
      socialPartTime: existingProfile.socialPartTime ?? "",
      idNumber: existingProfile.idNumber ?? "",
      phone: existingProfile.phone ?? "",
      wechat: existingProfile.wechat ?? "",
      email: existingProfile.email ?? "",
      maritalStatus: existingProfile.maritalStatus ?? "",
      spouseChildren: existingProfile.spouseChildren ?? "",
      emergencyContact: existingProfile.emergencyContact ?? "",
      hobbies: existingProfile.hobbies ?? "",
      partyIntent: existingProfile.partyIntent,
      applicationSubmitted: existingProfile.applicationSubmitted,
      developmentStage: existingProfile.developmentStage ?? "",
      politicalStudyNotes: existingProfile.politicalStudyNotes ?? "",
      democraticReviewNotes: existingProfile.democraticReviewNotes ?? "",
      ideologyAttachment: {
        url: existingProfile.ideologyAttachmentUrl ?? "",
        name: existingProfile.ideologyAttachmentName ?? "",
      },
      avatar: {
        url: existingProfile.avatarUrl ?? "",
        name: existingProfile.avatarName ?? "",
      },
      activities: existingProfile.activities.map((a) => ({
        id: a.id,
        date: toDateStr(a.date),
        title: a.title,
        category: a.category ?? "",
        description: a.description ?? "",
        attachment: { url: a.attachmentUrl ?? "", name: a.attachmentName ?? "" },
      })),
      keyPerformances: existingProfile.keyPerformances.map((p) => ({
        id: p.id,
        date: toDateStr(p.date),
        title: p.title,
        description: p.description ?? "",
        externalLink: p.externalLink ?? "",
        attachment: { url: p.attachmentUrl ?? "", name: p.attachmentName ?? "" },
      })),
      careerRecords: existingProfile.careerRecords.map((c) => ({
        id: c.id,
        date: toDateStr(c.date),
        title: c.title,
        description: c.description ?? "",
        attachment: { url: c.attachmentUrl ?? "", name: c.attachmentName ?? "" },
      })),
      contacts: ["school", "college", "mentor"].map((role) => {
        const c = contactRoleMap.get(role);
        return {
          id: c?.id ?? "",
          role: role as "school" | "college" | "mentor",
          name: c?.name ?? "",
          title: c?.title ?? "",
          talentTitle: c?.talentTitle ?? "",
        };
      }),
      conversations: existingProfile.conversations.map((c) => ({
        id: c.id,
        date: toDateStr(c.date),
        interviewer: c.interviewer ?? "",
        location: c.location ?? "",
        summary: c.summary,
        confusion: c.confusion ?? "",
        actionPlan: c.actionPlan ?? "",
        attachment: { url: c.attachmentUrl ?? "", name: c.attachmentName ?? "" },
      })),
      issueSuggestions: existingProfile.issueSuggestions.map((i) => ({
        id: i.id,
        type: i.type as "question" | "suggestion",
        title: i.title,
        specificIssues: i.specificIssues ?? "",
        needs: i.needs ?? "",
        status: i.status ?? "",
        attachment: { url: i.attachmentUrl ?? "", name: i.attachmentName ?? "" },
      })),
    };

    // Delete any existing pending requests for this profile
    await prisma.profileChangeRequest.deleteMany({
      where: {
        profileId,
        status: "pending",
      },
    });

    // Create new change request with both original and modified data
    const changeRequest = await prisma.profileChangeRequest.create({
      data: {
        profileId,
        requesterId: employeeId,
        requesterName: userName,
        originalData: JSON.stringify(originalData),
        snapshotData: JSON.stringify(snapshotData),
      },
    });

    return NextResponse.json({ request: changeRequest });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "提交修改申请失败。" }, { status: 500 });
  }
}
