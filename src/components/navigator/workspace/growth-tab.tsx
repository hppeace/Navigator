import { BookOpenText, BriefcaseBusiness, FlaskConical, Plus } from "lucide-react";

import { FileUploadField } from "@/components/navigator/file-upload-field";
import { Field, RecordShell, SectionCard } from "@/components/navigator/workspace/primitives";
import type {
  AppendListItemFn,
  RemoveListItemFn,
  UpdateListItemFn,
} from "@/components/navigator/workspace/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  createEmptyActivity,
  createEmptyCareer,
  createEmptyPerformance,
  type MemberDraft,
} from "@/lib/navigator-shared";

type GrowthTabProps = {
  draft: MemberDraft;
  updateListItem: UpdateListItemFn;
  appendListItem: AppendListItemFn;
  removeListItem: RemoveListItemFn;
};

export function GrowthTab({
  draft,
  updateListItem,
  appendListItem,
  removeListItem,
}: GrowthTabProps) {
  return (
    <div className="space-y-6">
      <SectionCard
        title="活动情况记录"
        description="记录工作站活动参与、主题分享、科普活动和志愿服务。"
        icon={<BookOpenText className="text-[#0f4c5c]" />}
        action={
          <Button type="button" variant="outline" size="sm" onClick={() => appendListItem("activities", createEmptyActivity())}>
            <Plus />
            新增活动
          </Button>
        }
      >
        <div className="space-y-4">
          {draft.activities.map((item, index) => (
            <RecordShell
              key={`activity-${index}`}
              title={`活动记录 ${index + 1}`}
              onRemove={() => removeListItem("activities", index, createEmptyActivity)}
            >
              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                <Field label="活动日期">
                  <Input
                    type="date"
                    value={item.date}
                    onChange={(event) =>
                      updateListItem("activities", index, (current) => ({
                        ...current,
                        date: event.target.value,
                      }))
                    }
                  />
                </Field>
                <Field label="活动标题">
                  <Input
                    value={item.title}
                    onChange={(event) =>
                      updateListItem("activities", index, (current) => ({
                        ...current,
                        title: event.target.value,
                      }))
                    }
                  />
                </Field>
                <Field label="活动分类">
                  <Input
                    value={item.category}
                    onChange={(event) =>
                      updateListItem("activities", index, (current) => ({
                        ...current,
                        category: event.target.value,
                      }))
                    }
                  />
                </Field>
              </div>

              <Field label="活动说明">
                <Textarea
                  className="min-h-24"
                  value={item.description}
                  onChange={(event) =>
                    updateListItem("activities", index, (current) => ({
                      ...current,
                      description: event.target.value,
                    }))
                  }
                />
              </Field>

              <FileUploadField
                label="活动照片或附件"
                value={item.attachment}
                onChange={(value) =>
                  updateListItem("activities", index, (current) => ({
                    ...current,
                    attachment: value,
                  }))
                }
              />
            </RecordShell>
          ))}
        </div>
      </SectionCard>

      <SectionCard
        title="关键表现记录"
        description="重点记录重大项目突破、成果转化和急难险重任务中的担当作为。"
        icon={<FlaskConical className="text-[#d97757]" />}
        action={
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => appendListItem("keyPerformances", createEmptyPerformance())}
          >
            <Plus />
            新增表现
          </Button>
        }
      >
        <div className="space-y-4">
          {draft.keyPerformances.map((item, index) => (
            <RecordShell
              key={`performance-${index}`}
              title={`关键表现 ${index + 1}`}
              onRemove={() => removeListItem("keyPerformances", index, createEmptyPerformance)}
            >
              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                <Field label="时间">
                  <Input
                    type="date"
                    value={item.date}
                    onChange={(event) =>
                      updateListItem("keyPerformances", index, (current) => ({
                        ...current,
                        date: event.target.value,
                      }))
                    }
                  />
                </Field>
                <Field label="主题">
                  <Input
                    value={item.title}
                    onChange={(event) =>
                      updateListItem("keyPerformances", index, (current) => ({
                        ...current,
                        title: event.target.value,
                      }))
                    }
                  />
                </Field>
                <Field label="报道链接">
                  <Input
                    type="url"
                    value={item.externalLink}
                    onChange={(event) =>
                      updateListItem("keyPerformances", index, (current) => ({
                        ...current,
                        externalLink: event.target.value,
                      }))
                    }
                  />
                </Field>
              </div>

              <Field label="内容说明">
                <Textarea
                  className="min-h-24"
                  value={item.description}
                  onChange={(event) =>
                    updateListItem("keyPerformances", index, (current) => ({
                      ...current,
                      description: event.target.value,
                    }))
                  }
                />
              </Field>

              <FileUploadField
                label="佐证材料"
                value={item.attachment}
                onChange={(value) =>
                  updateListItem("keyPerformances", index, (current) => ({
                    ...current,
                    attachment: value,
                  }))
                }
              />
            </RecordShell>
          ))}
        </div>
      </SectionCard>

      <SectionCard
        title="职业发展记录"
        description="记录职务职称变化、人才计划和重大项目进展。"
        icon={<BriefcaseBusiness className="text-[#0f4c5c]" />}
        action={
          <Button type="button" variant="outline" size="sm" onClick={() => appendListItem("careerRecords", createEmptyCareer())}>
            <Plus />
            新增发展记录
          </Button>
        }
      >
        <div className="space-y-4">
          {draft.careerRecords.map((item, index) => (
            <RecordShell
              key={`career-${index}`}
              title={`职业发展 ${index + 1}`}
              onRemove={() => removeListItem("careerRecords", index, createEmptyCareer)}
            >
              <div className="grid gap-4 md:grid-cols-[220px_1fr]">
                <Field label="时间">
                  <Input
                    type="date"
                    value={item.date}
                    onChange={(event) =>
                      updateListItem("careerRecords", index, (current) => ({
                        ...current,
                        date: event.target.value,
                      }))
                    }
                  />
                </Field>
                <Field label="事项标题">
                  <Input
                    value={item.title}
                    onChange={(event) =>
                      updateListItem("careerRecords", index, (current) => ({
                        ...current,
                        title: event.target.value,
                      }))
                    }
                  />
                </Field>
              </div>

              <Field label="说明">
                <Textarea
                  className="min-h-24"
                  value={item.description}
                  onChange={(event) =>
                    updateListItem("careerRecords", index, (current) => ({
                      ...current,
                      description: event.target.value,
                    }))
                  }
                />
              </Field>
            </RecordShell>
          ))}
        </div>
      </SectionCard>
    </div>
  );
}
