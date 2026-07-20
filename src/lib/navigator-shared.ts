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
  attachment: AttachmentValue;
};

export type ContactRole = "school" | "college" | "mentor";

export type ContactDraft = {
  id: string;
  role: ContactRole;
  name: string;
  title: string;
  talentTitle: string;
};

export type ConversationDraft = {
  id: string;
  date: string;
  interviewer: string;
  location: string;
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
  specificIssues: string;
  needs: string;
  status: string;
  attachment: AttachmentValue;
};

export type MemberDraft = {
  id: string;
  employeeId: string;
  department: string;
  workspaceRole: string;
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
  majorProjects: string;
  talentTitles: string;
  provincialAwards: string;
  socialPartTime: string;
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
  question: "困难诉求",
  suggestion: "发展建议",
};

export const contactRoleLabels: Record<ContactRole, string> = {
  school: "校级联系人",
  college: "院系联系人",
  mentor: "成长导师",
};

export const genderOptions = ["男", "女"] as const;

export const workspaceRoleOptions = ["站长", "副站长", "成员"] as const;

export const academicTitleOptions = ["助理研究员", "副研究员", "研究员", "副教授", "教授"] as const;

export const mentorTypeOptions = ["无", "硕士生导师", "博士生导师"] as const;

export const ethnicityOptions = [
  "汉族",
  "蒙古族",
  "回族",
  "藏族",
  "维吾尔族",
  "苗族",
  "彝族",
  "壮族",
  "布依族",
  "朝鲜族",
  "满族",
  "侗族",
  "瑶族",
  "白族",
  "土家族",
  "哈尼族",
  "哈萨克族",
  "傣族",
  "黎族",
  "傈僳族",
  "佤族",
  "畲族",
  "高山族",
  "拉祜族",
  "水族",
  "东乡族",
  "纳西族",
  "景颇族",
  "科尔克孜族",
  "土族",
  "达斡尔族",
  "仫佬族",
  "羌族",
  "布朗族",
  "撒拉族",
  "毛南族",
  "仡佬族",
  "锡伯族",
  "阿昌族",
  "普米族",
  "塔吉克族",
  "怒族",
  "乌孜别克族",
  "俄罗斯族",
  "鄂温克族",
  "德昂族",
  "保安族",
  "裕固族",
  "京族",
  "塔塔尔族",
  "独龙族",
  "鄂伦春族",
  "赫哲族",
  "门巴族",
  "珞巴族",
  "基诺族",
] as const;

export const politicalStatusOptions = [
  "群众",
  "共青团员",
  "中共预备党员",
  "中共党员",
] as const;

export const maritalStatusOptions = [
  "未婚",
  "已婚",
  "离异",
  "丧偶",
] as const;

export const highestDegreeOptions = [
  "博士",
  "硕士",
  "学士",
  "专科",
  "高中及以下",
] as const;

export const issueStatusOptions = [
  "处理中",
  "已解决",
  "暂缓",
] as const;

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
    attachment: createBlankAttachment(),
  };
}

export function createEmptyContact(role: ContactRole): ContactDraft {
  return {
    id: "",
    role,
    name: "",
    title: "",
    talentTitle: "",
  };
}

export function createEmptyConversation(): ConversationDraft {
  return {
    id: "",
    date: "",
    interviewer: "",
    location: "",
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
    specificIssues: "",
    needs: "",
    status: "处理中",
    attachment: createBlankAttachment(),
  };
}

export function createBlankMemberDraft(): MemberDraft {
  return {
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
    ideologyAttachment: createBlankAttachment(),
    avatar: createBlankAttachment(),
    activities: [],
    keyPerformances: [],
    careerRecords: [],
    contacts: [
      createEmptyContact("school"),
      createEmptyContact("college"),
      createEmptyContact("mentor"),
    ],
    conversations: [],
    issueSuggestions: [],
  };
}
