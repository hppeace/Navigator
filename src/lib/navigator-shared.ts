export type AttachmentValue = {
  url: string;
  name: string;
};

export type ActivityDraft = {
  id: string;
  date: string;
  title: string;
  category: string;
  description: string;
  attachment: AttachmentValue;
};

export type PerformanceDraft = {
  id: string;
  date: string;
  title: string;
  description: string;
  externalLink: string;
  attachment: AttachmentValue;
};

export type CareerDraft = {
  id: string;
  date: string;
  title: string;
  description: string;
};

export type ContactRole = "school" | "college" | "mentor";

export type ContactDraft = {
  id: string;
  role: ContactRole;
  name: string;
  title: string;
  note: string;
};

export type ConversationDraft = {
  id: string;
  date: string;
  summary: string;
  confusion: string;
  actionPlan: string;
  attachment: AttachmentValue;
};

export type IssueType = "question" | "suggestion";

export type IssueDraft = {
  id: string;
  type: IssueType;
  title: string;
  content: string;
  status: string;
  attachment: AttachmentValue;
};

export type MemberDraft = {
  id: string;
  employeeId: string;
  department: string;
  name: string;
  gender: string;
  birthDate: string;
  ethnicity: string;
  hometown: string;
  politicalStatus: string;
  partyAge: string;
  partyRole: string;
  academicTitle: string;
  mentorType: string;
  researchDirection: string;
  workStartDate: string;
  schoolEntryDate: string;
  highestDegree: string;
  biography: string;
  talentPrograms: string;
  idNumber: string;
  phone: string;
  wechat: string;
  email: string;
  maritalStatus: string;
  spouseChildren: string;
  emergencyContact: string;
  hobbies: string;
  partyIntent: "是" | "暂未考虑" | "待考虑";
  applicationSubmitted: boolean;
  developmentStage: string;
  politicalStudyNotes: string;
  democraticReviewNotes: string;
  ideologyAttachment: AttachmentValue;
  avatar: AttachmentValue;
  activities: ActivityDraft[];
  keyPerformances: PerformanceDraft[];
  careerRecords: CareerDraft[];
  contacts: ContactDraft[];
  conversations: ConversationDraft[];
  issueSuggestions: IssueDraft[];
};

export const partyIntentOptions = ["是", "暂未考虑", "待考虑"] as const;

export const developmentStageOptions = [
  "",
  "群众",
  "入党积极分子",
  "发展对象",
  "中共预备党员",
  "正式党员",
] as const;

export const issueTypeLabels: Record<IssueType, string> = {
  question: "问题与困惑",
  suggestion: "需求与建议",
};

export const contactRoleLabels: Record<ContactRole, string> = {
  school: "校级联系人",
  college: "院系联系人",
  mentor: "成长导师",
};

export function createBlankAttachment(): AttachmentValue {
  return {
    url: "",
    name: "",
  };
}

export function createEmptyActivity(): ActivityDraft {
  return {
    id: "",
    date: "",
    title: "",
    category: "",
    description: "",
    attachment: createBlankAttachment(),
  };
}

export function createEmptyPerformance(): PerformanceDraft {
  return {
    id: "",
    date: "",
    title: "",
    description: "",
    externalLink: "",
    attachment: createBlankAttachment(),
  };
}

export function createEmptyCareer(): CareerDraft {
  return {
    id: "",
    date: "",
    title: "",
    description: "",
  };
}

export function createEmptyContact(role: ContactRole): ContactDraft {
  return {
    id: "",
    role,
    name: "",
    title: "",
    note: "",
  };
}

export function createEmptyConversation(): ConversationDraft {
  return {
    id: "",
    date: "",
    summary: "",
    confusion: "",
    actionPlan: "",
    attachment: createBlankAttachment(),
  };
}

export function createEmptyIssue(type: IssueType): IssueDraft {
  return {
    id: "",
    type,
    title: "",
    content: "",
    status: "",
    attachment: createBlankAttachment(),
  };
}

export function createBlankMemberDraft(): MemberDraft {
  return {
    id: "",
    employeeId: "",
    department: "",
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
    ideologyAttachment: createBlankAttachment(),
    avatar: createBlankAttachment(),
    activities: [createEmptyActivity()],
    keyPerformances: [createEmptyPerformance()],
    careerRecords: [createEmptyCareer()],
    contacts: [
      createEmptyContact("school"),
      createEmptyContact("college"),
      createEmptyContact("mentor"),
    ],
    conversations: [createEmptyConversation()],
    issueSuggestions: [createEmptyIssue("question"), createEmptyIssue("suggestion")],
  };
}
