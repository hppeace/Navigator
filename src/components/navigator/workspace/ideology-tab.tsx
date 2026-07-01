import {
  ClipboardPenLine,
  MessagesSquare,
  Plus,
} from "lucide-react";

import { FileUploadField } from "@/components/navigator/file-upload-field";
import { Field, RecordShell, SectionCard } from "@/components/navigator/workspace/primitives";
import type {
  AppendListItemFn,
  RemoveListItemFn,
  UpdateAttachmentFn,
  UpdateFieldFn,
  UpdateListItemFn,
} from "@/components/navigator/workspace/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import {
  createEmptyConversation,
  developmentStageOptions,
  partyIntentOptions,
  type MemberDraft,
} from "@/lib/navigator-shared";

type IdeologyTabProps = {
  draft: MemberDraft;
  updateField: UpdateFieldFn;
  updateListItem: UpdateListItemFn;
  appendListItem: AppendListItemFn;
  removeListItem: RemoveListItemFn;
  updateTopLevelAttachment: UpdateAttachmentFn;
};

export function IdeologyTab({
  draft,
  updateField,
  updateListItem,
  appendListItem,
  removeListItem,
  updateTopLevelAttachment,
}: IdeologyTabProps) {
  // Check if development stage is full party member or probationary member
  const isFullOrProbationaryMember =
    draft.developmentStage === "正式党员" || draft.developmentStage === "中共预备党员";

  return (
    <div className="space-y-6">
      <SectionCard
        title="思想培养进展"
        description="跟踪入党意愿、申请情况、发展阶段与政治理论学习。"
        icon={<ClipboardPenLine className="text-[#d97757]" />}
      >
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          <Field label="是否有入党意愿">
            <Select
              value={draft.partyIntent}
              onValueChange={(value) => updateField("partyIntent", value as MemberDraft["partyIntent"])}
              disabled={isFullOrProbationaryMember}
            >
              <SelectTrigger className="w-full rounded-2xl border-black/10 bg-slate-50">
                <SelectValue placeholder="请选择意愿" />
              </SelectTrigger>
              <SelectContent>
                {partyIntentOptions.map((option) => (
                  <SelectItem key={option} value={option}>
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>

          <Field label="是否已递交入党申请书">
            <div className={`flex h-10 items-center justify-between rounded-2xl border border-black/10 bg-slate-50 px-3 ${isFullOrProbationaryMember ? "opacity-60" : ""}`}>
              <span className="text-sm text-slate-600">
                {draft.applicationSubmitted ? "已递交" : "未递交"}
              </span>
              <Switch
                checked={draft.applicationSubmitted}
                onCheckedChange={(value) => updateField("applicationSubmitted", value)}
                disabled={isFullOrProbationaryMember}
              />
            </div>
          </Field>

          <Field label="发展阶段">
            <Select
              value={draft.developmentStage || "__empty"}
              onValueChange={(value) => {
                const newStage = value === "__empty" ? "" : value;
                updateField("developmentStage", newStage);

                // Auto-set party intent and application when selecting full/probationary member
                if (newStage === "正式党员" || newStage === "中共预备党员") {
                  updateField("partyIntent", "是");
                  updateField("applicationSubmitted", true);
                }
              }}
            >
              <SelectTrigger className="w-full rounded-2xl border-black/10 bg-slate-50">
                <SelectValue placeholder="请选择阶段" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="__empty">未设置</SelectItem>
                {developmentStageOptions
                  .filter((option) => option)
                  .map((option) => (
                    <SelectItem key={option} value={option}>
                      {option}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
          </Field>
        </div>

        <div className="grid gap-4 xl:grid-cols-2">
          <Field label="政治理论学习">
            <Textarea
              className="min-h-28"
              value={draft.politicalStudyNotes}
              onChange={(event) => updateField("politicalStudyNotes", event.target.value)}
            />
          </Field>
          <Field label="民主评议与培养情况">
            <Textarea
              className="min-h-28"
              value={draft.democraticReviewNotes}
              onChange={(event) => updateField("democraticReviewNotes", event.target.value)}
            />
          </Field>
        </div>

        <FileUploadField
          label="思想培养佐证材料"
          value={draft.ideologyAttachment}
          onChange={(value) => updateTopLevelAttachment("ideologyAttachment", value)}
        />
      </SectionCard>

      <SectionCard
        title="谈心谈话记录"
        description="记录联系人或成长导师的谈话要点、思想困惑与解决举措。"
        icon={<MessagesSquare className="text-[#0f4c5c]" />}
        action={
          <Button type="button" variant="outline" size="sm" onClick={() => appendListItem("conversations", createEmptyConversation())}>
            <Plus />
            新增谈话记录
          </Button>
        }
      >
        <div className="space-y-4">
          {draft.conversations.map((item, index) => (
            <RecordShell
              key={`conversation-${index}`}
              title={`谈心谈话 ${index + 1}`}
              onRemove={() => removeListItem("conversations", index, createEmptyConversation, `谈心谈话 ${index + 1}`)}
            >
              <div className="grid gap-4 md:grid-cols-2">
                <Field label="谈话日期">
                  <Input
                    type="date"
                    value={item.date}
                    onChange={(event) =>
                      updateListItem("conversations", index, (current) => ({
                        ...current,
                        date: event.target.value,
                      }))
                    }
                  />
                </Field>
                <Field label="谈话人">
                  <Input
                    value={item.interviewer}
                    onChange={(event) =>
                      updateListItem("conversations", index, (current) => ({
                        ...current,
                        interviewer: event.target.value,
                      }))
                    }
                  />
                </Field>
              </div>

              <div className="grid gap-4 lg:grid-cols-3">
                <Field label="谈话要点">
                  <Textarea
                    className="min-h-28"
                    value={item.summary}
                    onChange={(event) =>
                      updateListItem("conversations", index, (current) => ({
                        ...current,
                        summary: event.target.value,
                      }))
                    }
                  />
                </Field>
                <Field label="思想困惑">
                  <Textarea
                    className="min-h-28"
                    value={item.confusion}
                    onChange={(event) =>
                      updateListItem("conversations", index, (current) => ({
                        ...current,
                        confusion: event.target.value,
                      }))
                    }
                  />
                </Field>
                <Field label="解决举措">
                  <Textarea
                    className="min-h-28"
                    value={item.actionPlan}
                    onChange={(event) =>
                      updateListItem("conversations", index, (current) => ({
                        ...current,
                        actionPlan: event.target.value,
                      }))
                    }
                  />
                </Field>
              </div>

              <FileUploadField
                label="谈话附件"
                value={item.attachment}
                onChange={(value) =>
                  updateListItem("conversations", index, (current) => ({
                    ...current,
                    attachment: value,
                  }))
                }
              />
            </RecordShell>
          ))}
        </div>
      </SectionCard>
    </div>
  );
}
