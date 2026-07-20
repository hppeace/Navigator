import { NextResponse } from "next/server";
import * as XLSX from "xlsx";
import bcrypt from "bcryptjs";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { saveMemberDraft } from "@/lib/navigator-data";
import {
  createBlankMemberDraft,
  partyIntentOptions,
  type MemberDraft,
} from "@/lib/navigator-shared";

export const runtime = "nodejs";

const COLUMN_MAP: Record<string, keyof MemberDraft> = {
  工号: "employeeId",
  姓名: "name",
  院系: "department",
  工作站身份: "workspaceRole",
  性别: "gender",
  出生日期: "birthDate",
  民族: "ethnicity",
  籍贯: "hometown",
  政治面貌: "politicalStatus",
  入党时间: "partyAge",
  职务: "partyRole",
  党内职务: "partyRole",
  党內职务: "partyRole",
  学术职称: "academicTitle",
  导师类型: "mentorType",
  研究方向: "researchDirection",
  参加工作时间: "workStartDate",
  入校时间: "schoolEntryDate",
  最高学历: "highestDegree",
  个人简介: "biography",
  人才工程: "talentPrograms",
  入选人才项目情况: "talentPrograms",
  重点重大项目: "majorProjects",
  人才称号: "talentTitles",
  省部级及以上奖项: "provincialAwards",
  社会兼职: "socialPartTime",
  身份证号: "idNumber",
  手机: "phone",
  微信: "wechat",
  邮箱: "email",
  婚姻状况: "maritalStatus",
  爱人子女: "spouseChildren",
  紧急联系人: "emergencyContact",
  兴趣爱好: "hobbies",
  入党意向: "partyIntent",
  已提交申请: "applicationSubmitted",
  发展阶段: "developmentStage",
  政治学习笔记: "politicalStudyNotes",
  民主评议笔记: "democraticReviewNotes",
};

const BOOLEAN_FIELDS = new Set<string>(["applicationSubmitted"]);

const VALID_PARTY_INTENTS = new Set(partyIntentOptions);

function parseBoolean(value: unknown): boolean {
  if (typeof value === "boolean") return value;
  const str = String(value ?? "").trim();
  return str === "是" || str === "true" || str === "1";
}

function parseDate(value: unknown): string {
  if (!value) return "";
  if (value instanceof Date) {
    return value.toISOString().slice(0, 10);
  }
  const str = String(value).trim();
  // Already YYYY-MM-DD
  if (/^\d{4}-\d{2}-\d{2}$/.test(str)) return str;
  // Try parsing as date
  const parsed = new Date(str);
  if (!Number.isNaN(parsed.getTime())) {
    return parsed.toISOString().slice(0, 10);
  }
  return str;
}

function rowToDraft(row: Record<string, unknown>): MemberDraft {
  const draft = createBlankMemberDraft();

  for (const [excelCol, fieldKey] of Object.entries(COLUMN_MAP)) {
    const value = row[excelCol];
    if (value === undefined || value === null) continue;

    if (BOOLEAN_FIELDS.has(fieldKey)) {
      (draft as Record<string, unknown>)[fieldKey] = parseBoolean(value);
    } else if (fieldKey === "partyIntent") {
      const str = String(value).trim();
      (draft as Record<string, unknown>)[fieldKey] = VALID_PARTY_INTENTS.has(
        str as (typeof partyIntentOptions)[number],
      )
        ? str
        : "待考虑";
    } else if (fieldKey.includes("Date") || fieldKey.includes("date")) {
      (draft as Record<string, unknown>)[fieldKey] = parseDate(value);
    } else {
      (draft as Record<string, unknown>)[fieldKey] = String(value).trim();
    }
  }

  return draft;
}

export async function POST(request: Request) {
  const session = await auth();
  const user = session?.user as Record<string, unknown> | undefined;

  if (!user?.isAdmin) {
    return NextResponse.json({ error: "无权限执行此操作。" }, { status: 403 });
  }

  try {
    const formData = await request.formData();
    const file = formData.get("file");

    if (!(file instanceof File)) {
      return NextResponse.json({ error: "未检测到上传文件。" }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const workbook = XLSX.read(buffer, { type: "buffer" });
    const sheetName = workbook.SheetNames[0];

    if (!sheetName) {
      return NextResponse.json({ error: "Excel 文件中没有找到工作表。" }, { status: 400 });
    }

    const worksheet = workbook.Sheets[sheetName];
    const rows = XLSX.utils.sheet_to_json<Record<string, unknown>>(worksheet);

    if (rows.length === 0) {
      return NextResponse.json({ error: "Excel 文件中没有数据行。" }, { status: 400 });
    }

    let success = 0;
    const errors: Array<{ row: number; message: string }> = [];

    for (let i = 0; i < rows.length; i++) {
      try {
        const draft = rowToDraft(rows[i]);

        if (!draft.name.trim()) {
          errors.push({ row: i + 2, message: "姓名为空，已跳过。" });
          continue;
        }

        await saveMemberDraft(draft);

        // Set default password for imported members
        if (draft.employeeId.trim()) {
          const hashedPassword = await bcrypt.hash("12345678", 10);
          await prisma.user.update({
            where: { employeeId: draft.employeeId.trim() },
            data: { password: hashedPassword },
          }).catch(() => {
            // User may not exist yet if employeeId was empty during save
          });
        }

        success++;
      } catch (error) {
        errors.push({
          row: i + 2,
          message: error instanceof Error ? error.message : "保存失败",
        });
      }
    }

    return NextResponse.json({ success, errors });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "导入失败，请检查文件格式。" }, { status: 500 });
  }
}
