import { Search, UserPlus } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import type { MemberDraft } from "@/lib/navigator-shared";
import { cn } from "@/lib/utils";

import {
  calculateCompletionRate,
  countOpenQuestions,
} from "@/components/navigator/workspace/utils";

type MemberSidebarProps = {
  profiles: MemberDraft[];
  activeId: string;
  query: string;
  onQueryChange: (value: string) => void;
  onCreate: () => void;
  onSelectProfile: (profile: MemberDraft) => void;
};

export function MemberSidebar({
  profiles,
  activeId,
  query,
  onQueryChange,
  onCreate,
  onSelectProfile,
}: MemberSidebarProps) {
  return (
    <Card className="navigator-panel">
      <CardHeader className="gap-3">
        <div className="flex items-center justify-between gap-3">
          <div>
            <CardTitle className="text-lg text-slate-900">成员档案库</CardTitle>
            <CardDescription>按成员切换并编辑完整档案。</CardDescription>
          </div>
          <Button
            type="button"
            size="sm"
            className="bg-[#0f4c5c] text-white hover:bg-[#0b3f4e]"
            onClick={onCreate}
          >
            <UserPlus />
            新建
          </Button>
        </div>

        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
          <Input
            value={query}
            onChange={(event) => onQueryChange(event.target.value)}
            placeholder="搜索姓名、院系或工号"
            className="h-10 rounded-2xl border-black/10 bg-slate-50 pl-9"
          />
        </div>
      </CardHeader>

      <CardContent>
        <ScrollArea className="h-[520px] pr-2">
          <div className="space-y-3">
            {profiles.length > 0 ? (
              profiles.map((profile) => {
                const completion = calculateCompletionRate(profile);
                const isActive = profile.id === activeId;
                const questionCount = countOpenQuestions(profile);

                return (
                  <button
                    key={profile.id}
                    type="button"
                    onClick={() => onSelectProfile(profile)}
                    className={cn(
                      "w-full rounded-[24px] border px-4 py-4 text-left transition",
                      isActive
                        ? "border-[#0f4c5c]/15 bg-[#0f4c5c]/5 shadow-[0_14px_30px_rgba(15,76,92,0.12)]"
                        : "border-black/5 bg-white hover:border-[#0f4c5c]/10 hover:bg-slate-50",
                    )}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="font-medium text-slate-900">{profile.name || "未命名成员"}</p>
                        <p className="mt-1 text-xs text-slate-500">{profile.department || "未填写院系"}</p>
                      </div>
                      <Badge variant={isActive ? "default" : "outline"}>{completion}%</Badge>
                    </div>

                    <div className="mt-3 flex flex-wrap gap-2 text-xs">
                      <Badge variant="secondary">{profile.developmentStage || "未设阶段"}</Badge>
                      {questionCount > 0 ? (
                        <Badge variant="outline">{questionCount} 个待跟进问题</Badge>
                      ) : (
                        <Badge variant="outline">问题已归档</Badge>
                      )}
                    </div>

                    <div className="mt-4 h-2 rounded-full bg-slate-100">
                      <div
                        className="h-full rounded-full bg-[linear-gradient(90deg,#0f4c5c,#d97757)]"
                        style={{ width: `${completion}%` }}
                      />
                    </div>
                  </button>
                );
              })
            ) : (
              <div className="rounded-[24px] border border-dashed border-black/10 bg-slate-50 p-6 text-sm text-slate-500">
                未找到匹配成员，可点击右上角“新建”录入新档案。
              </div>
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
