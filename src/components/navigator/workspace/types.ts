import type { MemberDraft } from "@/lib/navigator-shared";

export type EditableListKey =
  | "activities"
  | "keyPerformances"
  | "careerRecords"
  | "conversations"
  | "issueSuggestions"
  | "contacts";

export type EditableListItem<K extends EditableListKey> = MemberDraft[K][number];

export type UpdateFieldFn = <K extends keyof MemberDraft>(key: K, value: MemberDraft[K]) => void;

export type UpdateListItemFn = <K extends EditableListKey>(
  key: K,
  index: number,
  updater: (item: EditableListItem<K>) => EditableListItem<K>,
) => void;

export type AppendListItemFn = <K extends EditableListKey>(key: K, item: EditableListItem<K>) => void;

export type RemoveListItemFn = <K extends Exclude<EditableListKey, "contacts">>(
  key: K,
  index: number,
  fallbackFactory: () => EditableListItem<K>,
) => void;

export type UpdateAttachmentFn = (
  key: "avatar" | "ideologyAttachment",
  value: MemberDraft["avatar"],
) => void;

export type NoticeState = {
  tone: "neutral" | "success" | "error";
  message: string;
};
