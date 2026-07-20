import { NextResponse } from "next/server";
import * as XLSX from "xlsx";

import { auth } from "@/lib/auth";
import { getMemberDrafts } from "@/lib/navigator-data";

export const runtime = "nodejs";

const COLUMN_MAP: Array<{ header: string; key: string }> = [
  { header: "工号", key: "employeeId" },
  { header: "姓名", key: "name" },
  { header: "院系", key: "department" },
  { header: "工作站身份", key: "workspaceRole" },
  { header: "性别", key: "gender" },
  { header: "出生日期", key: "birthDate" },
  { header: "民族", key: "ethnicity" },
  { header: "籍贯", key: "hometown" },
  { header: "政治面貌", key: "politicalStatus" },
  { header: "入党时间", key: "partyAge" },
  { header: "职务", key: "partyRole" },
  { header: "学术职称", key: "academicTitle" },
  { header: "导师类型", key: "mentorType" },
  { header: "研究方向", key: "researchDirection" },
  { header: "参加工作时间", key: "workStartDate" },
  { header: "入校时间", key: "schoolEntryDate" },
  { header: "最高学历", key: "highestDegree" },
  { header: "个人简介", key: "biography" },
  { header: "入选人才项目情况", key: "talentPrograms" },
  { header: "重点重大项目", key: "majorProjects" },
  { header: "人才称号", key: "talentTitles" },
  { header: "省部级及以上奖项", key: "provincialAwards" },
  { header: "社会兼职", key: "socialPartTime" },
  { header: "身份证号", key: "idNumber" },
  { header: "手机", key: "phone" },
  { header: "微信", key: "wechat" },
  { header: "邮箱", key: "email" },
  { header: "婚姻状况", key: "maritalStatus" },
  { header: "爱人子女", key: "spouseChildren" },
  { header: "紧急联系人", key: "emergencyContact" },
  { header: "兴趣爱好", key: "hobbies" },
  { header: "入党意向", key: "partyIntent" },
  { header: "已提交申请", key: "applicationSubmitted" },
  { header: "发展阶段", key: "developmentStage" },
  { header: "政治学习笔记", key: "politicalStudyNotes" },
  { header: "民主评议笔记", key: "democraticReviewNotes" },
];

export async function GET() {
  const session = await auth();
  const user = session?.user as Record<string, unknown> | undefined;

  if (!user?.isAdmin) {
    return NextResponse.json({ error: "无权限执行此操作。" }, { status: 403 });
  }

  const profiles = await getMemberDrafts();

  const rows = profiles.map((profile) => {
    const row: Record<string, string | boolean> = {};

    for (const col of COLUMN_MAP) {
      const value = profile[col.key as keyof typeof profile];
      row[col.header] = typeof value === "boolean" ? (value ? "是" : "否") : (value as string);
    }

    return row;
  });

  const worksheet = XLSX.utils.json_to_sheet(rows, {
    header: COLUMN_MAP.map((col) => col.header),
  });

  // Auto-size columns
  const colWidths = COLUMN_MAP.map((col) => {
    const maxLen = Math.max(
      col.header.length,
      ...rows.map((row) => String(row[col.header] ?? "").length),
    );
    return { wch: Math.min(maxLen + 2, 40) };
  });
  worksheet["!cols"] = colWidths;

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "成员基本信息");

  const buffer = XLSX.write(workbook, { type: "buffer", bookType: "xlsx" });

  return new NextResponse(buffer, {
    headers: {
      "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "Content-Disposition": 'attachment; filename="members.xlsx"',
    },
  });
}
