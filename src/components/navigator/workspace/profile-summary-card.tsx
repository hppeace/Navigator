import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { BadgeCheck, CircleAlert, Save } from "lucide-react";

import { SummaryStat } from "@/components/navigator/workspace/primitives";
import type { NoticeState } from "@/components/navigator/workspace/types";
import { getInitials } from "@/components/navigator/workspace/utils";
import { cn } from "@/lib/utils";
import type { MemberDraft } from "@/lib/navigator-shared";

type ProfileSummaryCardProps = {
  draft: MemberDraft;
  draftStats: {
    completion: number;
    activities: number;
    performances: number;
    questions: number;
  };
  hasChanges: boolean;
  isPending: boolean;
  notice: NoticeState;
  onReset: () => void;
  onSave: () => void;
};

export function ProfileSummaryCard({
  draft,
  draftStats,
  hasChanges,
  isPending,
  notice,
  onReset,
  onSave,
}: ProfileSummaryCardProps) {
  return (
    <Card className="navigator-panel">
      <CardContent className="pt-6">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
          <div className="flex items-start gap-4">
            <Avatar size="lg" className="size-16 border border-black/5 bg-[#f6f0e5] shadow-sm">
              <AvatarImage src={draft.avatar.url} alt={draft.name || "成员头像"} />
              <AvatarFallback className="bg-[#f6f0e5] text-[#0f4c5c]">
                {getInitials(draft.name)}
              </AvatarFallback>
            </Avatar>

            <div className="space-y-3">
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-slate-400">当前档案</p>
                <h2 className="mt-1 font-heading text-3xl text-slate-900">
                  {draft.name || "未命名成员"}
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  {draft.department || "请先填写所在院系"}
                  {draft.employeeId ? ` · 工号 ${draft.employeeId}` : ""}
                </p>
              </div>

              <div className="flex flex-wrap gap-2">
                <Badge className="bg-[#0f4c5c] text-white">{draft.partyIntent}</Badge>
                <Badge variant="secondary">{draft.developmentStage || "未设置发展阶段"}</Badge>
                <Badge variant="outline">{draftStats.activities} 条成长记录</Badge>
                <Badge variant="outline">{draftStats.performances} 条关键表现</Badge>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-3 sm:items-end">
            <div className="grid grid-cols-2 gap-3 text-sm sm:w-[320px]">
              <SummaryStat label="完整度" value={`${draftStats.completion}%`} icon={<BadgeCheck />} />
              <SummaryStat label="关注事项" value={String(draftStats.questions)} icon={<CircleAlert />} />
            </div>

            <div className="flex flex-wrap gap-2">
              <Button type="button" variant="outline" size="sm" disabled={!hasChanges || isPending} onClick={onReset}>
                重置
              </Button>
              <Button
                type="button"
                size="sm"
                className="bg-[#0f4c5c] text-white hover:bg-[#0b3f4e]"
                disabled={isPending}
                onClick={onSave}
              >
                <Save />
                {isPending ? "处理中..." : "保存档案"}
              </Button>
            </div>
          </div>
        </div>

        {notice.message ? (
          <div
            className={cn(
              "mt-5 rounded-2xl border px-4 py-3 text-sm",
              notice.tone === "success" && "border-emerald-200 bg-emerald-50 text-emerald-700",
              notice.tone === "error" && "border-rose-200 bg-rose-50 text-rose-700",
              notice.tone === "neutral" && "border-[#0f4c5c]/10 bg-[#0f4c5c]/5 text-[#0f4c5c]",
            )}
          >
            {notice.message}
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
}
