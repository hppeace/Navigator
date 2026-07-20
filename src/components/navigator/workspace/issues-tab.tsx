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
import { createEmptyIssue, issueStatusOptions, type MemberDraft } from "@/lib/navigator-shared";

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
        title="发展与诉求"
        description="统一收集成员工作和发展中的诉求建议及其跟进状态。"
        icon={<CircleAlert className="text-[#d94a4a]" />}
        action={
          <Button type="button" variant="outline" size="sm" onClick={() => appendListItem("issueSuggestions", createEmptyIssue("question"))}>
            <Plus />
            新增发展诉求
          </Button>
        }
      >
        <div className="grid gap-4">
          {draft.issueSuggestions.map((item, index) => (
            <RecordShell
              key={`issue-${index}`}
              title={`发展诉求 ${index + 1}`}
              onRemove={() => removeListItem("issueSuggestions", index, () => createEmptyIssue("question"), `发展诉求 ${index + 1}`)}
            >
              <Field label="近期发展诉求">
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

              <Field label="具体问题">
                <Textarea
                  className="min-h-20"
                  value={item.specificIssues}
                  onChange={(event) =>
                    updateListItem("issueSuggestions", index, (current) => ({
                      ...current,
                      specificIssues: event.target.value,
                    }))
                  }
                />
              </Field>

              <div className="grid gap-4 lg:grid-cols-[1fr_240px]">
                <Field label="需求">
                  <Textarea
                    className="min-h-20"
                    value={item.needs}
                    onChange={(event) =>
                      updateListItem("issueSuggestions", index, (current) => ({
                        ...current,
                        needs: event.target.value,
                      }))
                    }
                  />
                </Field>
                <Field label="推进情况">
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
