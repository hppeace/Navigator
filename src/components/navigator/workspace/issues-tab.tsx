import { CircleAlert, Plus } from "lucide-react";

import { FileUploadField } from "@/components/navigator/file-upload-field";
import { Field, RecordShell, SectionCard } from "@/components/navigator/workspace/primitives";
import type {
  AppendListItemFn,
  RemoveListItemFn,
  UpdateListItemFn,
} from "@/components/navigator/workspace/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { createEmptyIssue, issueStatusOptions, issueTypeLabels, type IssueType, type MemberDraft } from "@/lib/navigator-shared";

type IssuesTabProps = {
  draft: MemberDraft;
  updateListItem: UpdateListItemFn;
  appendListItem: AppendListItemFn;
  removeListItem: RemoveListItemFn;
};

export function IssuesTab({
  draft,
  updateListItem,
  appendListItem,
  removeListItem,
}: IssuesTabProps) {
  return (
    <div className="space-y-6">
      <SectionCard
        title="问题与建议"
        description="统一收集成员工作和生活中的问题困惑、需求建议及其跟进状态。"
        icon={<CircleAlert className="text-[#d97757]" />}
        action={
          <div className="flex flex-wrap gap-2">
            <Button type="button" variant="outline" size="sm" onClick={() => appendListItem("issueSuggestions", createEmptyIssue("question"))}>
              <Plus />
              新增问题
            </Button>
            <Button type="button" variant="outline" size="sm" onClick={() => appendListItem("issueSuggestions", createEmptyIssue("suggestion"))}>
              <Plus />
              新增建议
            </Button>
          </div>
        }
      >
        <div className="grid gap-4">
          {draft.issueSuggestions.map((item, index) => (
            <RecordShell
              key={`issue-${index}`}
              title={`${issueTypeLabels[item.type]} ${index + 1}`}
              onRemove={() => removeListItem("issueSuggestions", index, () => createEmptyIssue(item.type))}
            >
              <div className="grid gap-4 md:grid-cols-3">
                <Field label="分类">
                  <Select
                    value={item.type}
                    onValueChange={(value) =>
                      updateListItem("issueSuggestions", index, (current) => ({
                        ...current,
                        type: value as IssueType,
                      }))
                    }
                  >
                    <SelectTrigger className="w-full rounded-2xl border-black/10 bg-slate-50">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="question">问题与困惑</SelectItem>
                      <SelectItem value="suggestion">需求与建议</SelectItem>
                    </SelectContent>
                  </Select>
                </Field>
                <Field label="标题" className="md:col-span-2">
                  <Input
                    value={item.title}
                    onChange={(event) =>
                      updateListItem("issueSuggestions", index, (current) => ({
                        ...current,
                        title: event.target.value,
                      }))
                    }
                  />
                </Field>
              </div>

              <div className="grid gap-4 lg:grid-cols-[1fr_240px]">
                <Field label="内容">
                  <Textarea
                    className="min-h-28"
                    value={item.content}
                    onChange={(event) =>
                      updateListItem("issueSuggestions", index, (current) => ({
                        ...current,
                        content: event.target.value,
                      }))
                    }
                  />
                </Field>
                <Field label="跟进状态">
                  <Select
                    value={item.status}
                    onValueChange={(value) =>
                      updateListItem("issueSuggestions", index, (current) => ({
                        ...current,
                        status: value,
                      }))
                    }
                  >
                    <SelectTrigger className="w-full rounded-2xl border-black/10 bg-slate-50">
                      <SelectValue placeholder="请选择状态" />
                    </SelectTrigger>
                    <SelectContent>
                      {issueStatusOptions.map((option) => (
                        <SelectItem key={option} value={option}>
                          {option}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </Field>
              </div>

              <FileUploadField
                label="附件"
                value={item.attachment}
                onChange={(value) =>
                  updateListItem("issueSuggestions", index, (current) => ({
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
