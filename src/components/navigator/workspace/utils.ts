import type { MemberDraft } from "@/lib/navigator-shared";

export function cloneDraft(profile: MemberDraft) {
  return JSON.parse(JSON.stringify(profile)) as MemberDraft;
}

export function getInitials(name: string) {
  return name.trim().slice(0, 2) || "LH";
}

export function hasValue(values: string[]) {
  return values.some((value) => value.trim().length > 0);
}

export function countMeaningfulActivities(profile: MemberDraft) {
  return profile.activities.filter((item) =>
    hasValue([item.title, item.category, item.description, item.date, item.attachment.url]),
  ).length;
}

export function countMeaningfulPerformances(profile: MemberDraft) {
  return profile.keyPerformances.filter((item) =>
    hasValue([item.title, item.description, item.externalLink, item.date, item.attachment.url]),
  ).length;
}

export function countMeaningfulConversations(profile: MemberDraft) {
  return profile.conversations.filter((item) =>
    hasValue([item.summary, item.confusion, item.actionPlan, item.date, item.attachment.url]),
  ).length;
}

export function countOpenQuestions(profile: MemberDraft) {
  return profile.issueSuggestions.filter(
    (item) =>
      item.type === "question" &&
      hasValue([item.title, item.content, item.status, item.attachment.url]),
  ).length;
}

export function calculateCompletionRate(profile: MemberDraft) {
  const checks = [
    profile.name,
    profile.department,
    profile.employeeId,
    profile.researchDirection,
    profile.phone,
    profile.email,
    profile.biography,
    profile.politicalStatus,
    profile.developmentStage,
    profile.politicalStudyNotes,
  ];

  const completedFields = checks.filter((value) => value.trim().length > 0).length;
  const relationFields = profile.contacts.filter((item) => hasValue([item.name, item.title, item.note])).length > 0 ? 1 : 0;
  const activityFields = countMeaningfulActivities(profile) > 0 ? 1 : 0;
  const performanceFields = countMeaningfulPerformances(profile) > 0 ? 1 : 0;
  const conversationFields = countMeaningfulConversations(profile) > 0 ? 1 : 0;
  const issueFields = profile.issueSuggestions.filter((item) => hasValue([item.title, item.content])).length > 0 ? 1 : 0;

  const total = checks.length + 5;
  const completed = completedFields + relationFields + activityFields + performanceFields + conversationFields + issueFields;

  return Math.round((completed / total) * 100);
}
