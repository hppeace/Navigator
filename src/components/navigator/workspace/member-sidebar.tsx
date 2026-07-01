import { useRef, useState } from "react";
import { Download, Search, Upload, UserPlus } from "lucide-react";

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
  isAdmin: boolean;
  onQueryChange: (value: string) => void;
  onCreate: () => void;
  onSelectProfile: (profile: MemberDraft) => void;
  onImportComplete: () => void;
};

export function MemberSidebar({
  profiles,
  activeId,
  query,
  isAdmin,
  onQueryChange,
  onCreate,
  onSelectProfile,
  onImportComplete,
}: MemberSidebarProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [importing, setImporting] = useState(false);
  const [importNotice, setImportNotice] = useState("");

  function handleExport() {
    const link = document.createElement("a");
    link.href = "/api/members/export";
    link.download = "members.xlsx";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  async function handleImportFile(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    setImporting(true);
    setImportNotice("");

    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/members/import", {
        method: "POST",
        body: formData,
      });

      const result = (await response.json()) as {
        success?: number;
        errors?: Array<{ row: number; message: string }>;
        error?: string;
      };

      if (!response.ok) {
        setImportNotice(result.error ?? "导入失败");
        return;
      }

      const parts: string[] = [];
      if (result.success) parts.push(`成功导入 ${result.success} 条`);
      if (result.errors?.length) parts.push(`${result.errors.length} 条跳过`);
      setImportNotice(parts.join("，") || "导入完成");

      onImportComplete();
    } catch {
      setImportNotice("导入失败，请检查网络连接");
    } finally {
      setImporting(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  }

  return (
    <Card className="navigator-panel">
      <CardHeader className="space-y-3">
        <div className="flex items-center justify-between gap-2">
          <CardTitle className="text-lg text-slate-900">成员档案库</CardTitle>
          {isAdmin && (
            <div className="flex items-center gap-1 shrink-0">
              <input
                ref={fileInputRef}
                type="file"
                accept=".xlsx,.xls"
                className="hidden"
                onChange={handleImportFile}
              />
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="h-7 px-2 text-xs gap-1"
                disabled={importing}
                onClick={() => fileInputRef.current?.click()}
              >
                <Upload />
                导入
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="h-7 px-2 text-xs gap-1"
                onClick={handleExport}
              >
                <Download />
                导出
              </Button>
              <Button
                type="button"
                size="sm"
                className="h-7 px-2 text-xs gap-1 bg-[#0f4c5c] text-white hover:bg-[#0b3f4e]"
                onClick={onCreate}
              >
                <UserPlus />
                新建
              </Button>
            </div>
          )}
        </div>
        <CardDescription>按成员切换并编辑完整档案。</CardDescription>
        {importNotice && (
          <div className="rounded-xl border border-[#0f4c5c]/10 bg-[#0f4c5c]/5 px-3 py-2 text-xs text-[#0f4c5c]">
            {importNotice}
          </div>
        )}

        {isAdmin && (
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
            <Input
              value={query}
              onChange={(event) => onQueryChange(event.target.value)}
              placeholder="搜索姓名、院系或工号"
              className="h-10 rounded-2xl border-black/10 bg-slate-50 pl-9"
            />
          </div>
        )}
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
                        <Badge variant="outline">{questionCount} 个待跟进诉求</Badge>
                      ) : (
                        <Badge variant="outline">诉求已归档</Badge>
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
