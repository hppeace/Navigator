import { z } from "zod";

import { Prisma } from "@/generated/prisma/client";
import { prisma } from "@/lib/prisma";
import {
  createBlankMemberDraft,
  type MemberDraft,
  issueTypeLabels,
  partyIntentOptions,
} from "@/lib/navigator-shared";

const textField = z.string().max(5000).default("");
const shortTextField = z.string().max(255).default("");
const dateField = z.string().max(32).default("");

const attachmentSchema = z.object({
  url: z.string().max(1024).default(""),
  name: z.string().max(255).default(""),
});

const activitySchema = z.object({
  id: shortTextField,
  date: dateField,
  title: shortTextField,
  category: shortTextField,
  description: textField,
  attachment: attachmentSchema,
});

const performanceSchema = z.object({
  id: shortTextField,
  date: dateField,
  title: shortTextField,
  description: textField,
  externalLink: z.string().max(1024).default(""),
  attachment: attachmentSchema,
});

const careerSchema = z.object({
  id: shortTextField,
  date: dateField,
  title: shortTextField,
  description: textField,
});

const contactSchema = z.object({
  id: shortTextField,
  role: z.enum(["school", "college", "mentor"]),
  name: shortTextField,
  title: shortTextField,
  note: textField,
});

const conversationSchema = z.object({
  id: shortTextField,
  date: dateField,
  summary: textField,
  confusion: textField,
  actionPlan: textField,
  attachment: attachmentSchema,
});

const issueSchema = z.object({
  id: shortTextField,
  type: z.enum(["question", "suggestion"]),
  title: shortTextField,
  content: textField,
  status: shortTextField,
  attachment: attachmentSchema,
});

export const memberDraftSchema = z.object({
  id: shortTextField,
  employeeId: shortTextField,
  department: shortTextField,
  name: shortTextField,
  gender: shortTextField,
  birthDate: dateField,
  ethnicity: shortTextField,
  hometown: shortTextField,
  politicalStatus: shortTextField,
  partyAge: shortTextField,
  partyRole: shortTextField,
  academicTitle: shortTextField,
  mentorType: shortTextField,
  researchDirection: shortTextField,
  workStartDate: dateField,
  schoolEntryDate: dateField,
  highestDegree: shortTextField,
  biography: textField,
  talentPrograms: textField,
  idNumber: shortTextField,
  phone: shortTextField,
  wechat: shortTextField,
  email: shortTextField,
  maritalStatus: shortTextField,
  spouseChildren: textField,
  emergencyContact: textField,
  hobbies: textField,
  partyIntent: z.enum(["是", "暂未考虑", "待考虑"]).default("待考虑"),
  applicationSubmitted: z.boolean().default(false),
  developmentStage: shortTextField,
  politicalStudyNotes: textField,
  democraticReviewNotes: textField,
  ideologyAttachment: attachmentSchema,
  avatar: attachmentSchema,
  activities: z.array(activitySchema).default([]),
  keyPerformances: z.array(performanceSchema).default([]),
  careerRecords: z.array(careerSchema).default([]),
  contacts: z.array(contactSchema).default([]),
  conversations: z.array(conversationSchema).default([]),
  issueSuggestions: z.array(issueSchema).default([]),
});

const memberProfileInclude = {
  activities: { orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }] },
  keyPerformances: { orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }] },
  careerRecords: { orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }] },
  contacts: { orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }] },
  conversations: { orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }] },
  issueSuggestions: { orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }] },
} satisfies Prisma.MemberProfileInclude;

type ProfileWithRelations = Prisma.MemberProfileGetPayload<{
  include: typeof memberProfileInclude;
}>;

export async function getMemberDrafts() {
  const profiles = await prisma.memberProfile.findMany({
    include: memberProfileInclude,
    orderBy: [{ updatedAt: "desc" }, { name: "asc" }],
  });

  return profiles.map(serializeProfile);
}

export async function saveMemberDraft(input: unknown) {
  const parsed = memberDraftSchema.parse(input);
  const data = createProfileWriteInput(parsed);

  const existing = parsed.id
    ? await prisma.memberProfile.findUnique({
        where: { id: parsed.id },
        select: { id: true },
      })
    : null;

  const profile = existing
    ? await prisma.memberProfile.update({
        where: { id: existing.id },
        data: {
          ...data,
          activities: {
            deleteMany: {},
            create: data.activities.create,
          },
          keyPerformances: {
            deleteMany: {},
            create: data.keyPerformances.create,
          },
          careerRecords: {
            deleteMany: {},
            create: data.careerRecords.create,
          },
          contacts: {
            deleteMany: {},
            create: data.contacts.create,
          },
          conversations: {
            deleteMany: {},
            create: data.conversations.create,
          },
          issueSuggestions: {
            deleteMany: {},
            create: data.issueSuggestions.create,
          },
        },
        include: memberProfileInclude,
      })
    : await prisma.memberProfile.create({
        data,
        include: memberProfileInclude,
      });

  return serializeProfile(profile);
}

function createProfileWriteInput(draft: MemberDraft) {
  return {
    employeeId: optionalString(draft.employeeId),
    department: optionalString(draft.department),
    name: draft.name.trim() || "未命名成员",
    gender: optionalString(draft.gender),
    birthDate: toDate(draft.birthDate),
    ethnicity: optionalString(draft.ethnicity),
    hometown: optionalString(draft.hometown),
    politicalStatus: optionalString(draft.politicalStatus),
    partyAge: optionalString(draft.partyAge),
    partyRole: optionalString(draft.partyRole),
    academicTitle: optionalString(draft.academicTitle),
    mentorType: optionalString(draft.mentorType),
    researchDirection: optionalString(draft.researchDirection),
    workStartDate: toDate(draft.workStartDate),
    schoolEntryDate: toDate(draft.schoolEntryDate),
    highestDegree: optionalString(draft.highestDegree),
    biography: optionalString(draft.biography),
    talentPrograms: optionalString(draft.talentPrograms),
    idNumber: optionalString(draft.idNumber),
    phone: optionalString(draft.phone),
    wechat: optionalString(draft.wechat),
    email: optionalString(draft.email),
    maritalStatus: optionalString(draft.maritalStatus),
    spouseChildren: optionalString(draft.spouseChildren),
    emergencyContact: optionalString(draft.emergencyContact),
    hobbies: optionalString(draft.hobbies),
    partyIntent: draft.partyIntent,
    applicationSubmitted: draft.applicationSubmitted,
    developmentStage: optionalString(draft.developmentStage),
    politicalStudyNotes: optionalString(draft.politicalStudyNotes),
    democraticReviewNotes: optionalString(draft.democraticReviewNotes),
    ideologyAttachmentUrl: optionalString(draft.ideologyAttachment.url),
    ideologyAttachmentName: optionalString(draft.ideologyAttachment.name),
    avatarUrl: optionalString(draft.avatar.url),
    avatarName: optionalString(draft.avatar.name),
    activities: {
      create: draft.activities
        .filter((item) => hasAnyValue([item.title, item.category, item.description, item.date, item.attachment.url]))
        .map((item, index) => ({
          date: toDate(item.date),
          title: item.title.trim() || `活动记录 ${index + 1}`,
          category: optionalString(item.category),
          description: optionalString(item.description),
          attachmentUrl: optionalString(item.attachment.url),
          attachmentName: optionalString(item.attachment.name),
          sortOrder: index,
        })),
    },
    keyPerformances: {
      create: draft.keyPerformances
        .filter((item) => hasAnyValue([item.title, item.description, item.date, item.externalLink, item.attachment.url]))
        .map((item, index) => ({
          date: toDate(item.date),
          title: item.title.trim() || `关键表现 ${index + 1}`,
          description: optionalString(item.description),
          externalLink: optionalString(item.externalLink),
          attachmentUrl: optionalString(item.attachment.url),
          attachmentName: optionalString(item.attachment.name),
          sortOrder: index,
        })),
    },
    careerRecords: {
      create: draft.careerRecords
        .filter((item) => hasAnyValue([item.title, item.description, item.date]))
        .map((item, index) => ({
          date: toDate(item.date),
          title: item.title.trim() || `职业发展 ${index + 1}`,
          description: optionalString(item.description),
          sortOrder: index,
        })),
    },
    contacts: {
      create: draft.contacts.map((item, index) => ({
        role: item.role,
        name: optionalString(item.name),
        title: optionalString(item.title),
        note: optionalString(item.note),
        sortOrder: index,
      })),
    },
    conversations: {
      create: draft.conversations
        .filter((item) => hasAnyValue([item.summary, item.confusion, item.actionPlan, item.date, item.attachment.url]))
        .map((item, index) => ({
          date: toDate(item.date),
          summary: item.summary.trim() || `谈心谈话 ${index + 1}`,
          confusion: optionalString(item.confusion),
          actionPlan: optionalString(item.actionPlan),
          attachmentUrl: optionalString(item.attachment.url),
          attachmentName: optionalString(item.attachment.name),
          sortOrder: index,
        })),
    },
    issueSuggestions: {
      create: draft.issueSuggestions
        .filter((item) => hasAnyValue([item.title, item.content, item.status, item.attachment.url]))
        .map((item, index) => ({
          type: item.type,
          title: item.title.trim() || `${issueTypeLabels[item.type]} ${index + 1}`,
          content: optionalString(item.content),
          status: optionalString(item.status),
          attachmentUrl: optionalString(item.attachment.url),
          attachmentName: optionalString(item.attachment.name),
          sortOrder: index,
        })),
    },
  };
}

function serializeProfile(profile: ProfileWithRelations): MemberDraft {
  const blank = createBlankMemberDraft();
  const contactMap = new Map(profile.contacts.map((item) => [item.role, item]));

  return {
    id: profile.id,
    employeeId: profile.employeeId ?? "",
    department: profile.department ?? "",
    name: profile.name,
    gender: profile.gender ?? "",
    birthDate: toDateInput(profile.birthDate),
    ethnicity: profile.ethnicity ?? "",
    hometown: profile.hometown ?? "",
    politicalStatus: profile.politicalStatus ?? "",
    partyAge: profile.partyAge ?? "",
    partyRole: profile.partyRole ?? "",
    academicTitle: profile.academicTitle ?? "",
    mentorType: profile.mentorType ?? "",
    researchDirection: profile.researchDirection ?? "",
    workStartDate: toDateInput(profile.workStartDate),
    schoolEntryDate: toDateInput(profile.schoolEntryDate),
    highestDegree: profile.highestDegree ?? "",
    biography: profile.biography ?? "",
    talentPrograms: profile.talentPrograms ?? "",
    idNumber: profile.idNumber ?? "",
    phone: profile.phone ?? "",
    wechat: profile.wechat ?? "",
    email: profile.email ?? "",
    maritalStatus: profile.maritalStatus ?? "",
    spouseChildren: profile.spouseChildren ?? "",
    emergencyContact: profile.emergencyContact ?? "",
    hobbies: profile.hobbies ?? "",
    partyIntent: partyIntentOptions.includes(profile.partyIntent as (typeof partyIntentOptions)[number])
      ? (profile.partyIntent as MemberDraft["partyIntent"])
      : "待考虑",
    applicationSubmitted: profile.applicationSubmitted,
    developmentStage: profile.developmentStage ?? "",
    politicalStudyNotes: profile.politicalStudyNotes ?? "",
    democraticReviewNotes: profile.democraticReviewNotes ?? "",
    ideologyAttachment: {
      url: profile.ideologyAttachmentUrl ?? "",
      name: profile.ideologyAttachmentName ?? "",
    },
    avatar: {
      url: profile.avatarUrl ?? "",
      name: profile.avatarName ?? "",
    },
    activities:
      profile.activities.length > 0
        ? profile.activities.map((item) => ({
            id: item.id,
            date: toDateInput(item.date),
            title: item.title,
            category: item.category ?? "",
            description: item.description ?? "",
            attachment: {
              url: item.attachmentUrl ?? "",
              name: item.attachmentName ?? "",
            },
          }))
        : blank.activities,
    keyPerformances:
      profile.keyPerformances.length > 0
        ? profile.keyPerformances.map((item) => ({
            id: item.id,
            date: toDateInput(item.date),
            title: item.title,
            description: item.description ?? "",
            externalLink: item.externalLink ?? "",
            attachment: {
              url: item.attachmentUrl ?? "",
              name: item.attachmentName ?? "",
            },
          }))
        : blank.keyPerformances,
    careerRecords:
      profile.careerRecords.length > 0
        ? profile.careerRecords.map((item) => ({
            id: item.id,
            date: toDateInput(item.date),
            title: item.title,
            description: item.description ?? "",
          }))
        : blank.careerRecords,
    contacts: blank.contacts.map((item) => ({
      id: contactMap.get(item.role)?.id ?? "",
      role: item.role,
      name: contactMap.get(item.role)?.name ?? "",
      title: contactMap.get(item.role)?.title ?? "",
      note: contactMap.get(item.role)?.note ?? "",
    })),
    conversations:
      profile.conversations.length > 0
        ? profile.conversations.map((item) => ({
            id: item.id,
            date: toDateInput(item.date),
            summary: item.summary,
            confusion: item.confusion ?? "",
            actionPlan: item.actionPlan ?? "",
            attachment: {
              url: item.attachmentUrl ?? "",
              name: item.attachmentName ?? "",
            },
          }))
        : blank.conversations,
    issueSuggestions:
      profile.issueSuggestions.length > 0
        ? profile.issueSuggestions.map((item) => ({
            id: item.id,
            type: item.type === "question" ? "question" : "suggestion",
            title: item.title,
            content: item.content ?? "",
            status: item.status ?? "",
            attachment: {
              url: item.attachmentUrl ?? "",
              name: item.attachmentName ?? "",
            },
          }))
        : blank.issueSuggestions,
  };
}

function toDate(value: string) {
  if (!value) {
    return null;
  }

  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

function toDateInput(value: Date | null) {
  if (!value) {
    return "";
  }

  return value.toISOString().slice(0, 10);
}

function optionalString(value: string) {
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : null;
}

function hasAnyValue(values: string[]) {
  return values.some((value) => value.trim().length > 0);
}
