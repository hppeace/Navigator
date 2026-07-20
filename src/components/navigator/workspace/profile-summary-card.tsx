"use client";

import { type ChangeEvent, useRef, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { BadgeCheck, Camera, CircleAlert, LoaderCircle, Save } from "lucide-react";

import type { NoticeState } from "@/components/navigator/workspace/types";
import { getInitials } from "@/components/navigator/workspace/utils";
import { cn } from "@/lib/utils";
import type { AttachmentValue, MemberDraft } from "@/lib/navigator-shared";

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
  isAdmin: boolean;
  onAvatarChange: (value: AttachmentValue) => void;
  onReset: () => void;
  onSave: () => void;
};

export function ProfileSummaryCard({
  draft,
  draftStats,
  hasChanges,
  isPending,
  notice,
  isAdmin,
  onAvatarChange,
  onReset,
  onSave,
}: ProfileSummaryCardProps) {
  const avatarInputRef = useRef<HTMLInputElement>(null);
  const [avatarError, setAvatarError] = useState("");
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);

  async function handleAvatarChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    setAvatarError("");

    if (!file.type.startsWith("image/")) {
      setAvatarError("请选择图片文件。");
      event.target.value = "";
      return;
    }

    setIsUploadingAvatar(true);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
      const result = (await response.json()) as AttachmentValue | { error?: string };

      if (!response.ok || !("url" in result)) {
        throw new Error("error" in result ? result.error ?? "头像上传失败。" : "头像上传失败。");
      }

      onAvatarChange({ url: result.url, name: result.name });
    } catch (error) {
      setAvatarError(error instanceof Error ? error.message : "头像上传失败。");
    } finally {
      setIsUploadingAvatar(false);
      event.target.value = "";
    }
  }

  return (
    <Card className="navigator-panel">
      <CardContent className="overflow-x-auto py-4">
        <div className="flex min-w-max items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            <div>
              <input
                ref={avatarInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleAvatarChange}
              />
              <button
                type="button"
                className="group relative block rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#a6192e] focus-visible:ring-offset-2"
                aria-label={draft.avatar.url ? "修改成员头像" : "上传成员头像"}
                title={draft.avatar.url ? "点击修改头像" : "点击上传头像"}
                disabled={isUploadingAvatar}
                onClick={() => avatarInputRef.current?.click()}
              >
                <Avatar className="size-24 border border-black/5 bg-[#fff1ef] shadow-sm">
                  <AvatarImage src={draft.avatar.url} alt={draft.name ? `${draft.name}的头像` : "成员头像"} />
                  <AvatarFallback className="bg-[#fff1ef] text-sm text-[#a6192e]">
                    {getInitials(draft.name)}
                  </AvatarFallback>
                </Avatar>
                <span className="absolute inset-0 flex items-center justify-center rounded-full bg-slate-950/55 text-white opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100">
                  {isUploadingAvatar ? <LoaderCircle className="size-6 animate-spin" /> : <Camera className="size-6" />}
                </span>
              </button>
              {avatarError ? <p className="max-w-28 text-xs text-rose-600">{avatarError}</p> : null}
            </div>

            <div>
              <div className="flex items-center gap-3 whitespace-nowrap">
                <h2 className="font-heading text-3xl text-slate-900">{draft.name || "未命名成员"}</h2>
                <p className="text-sm text-slate-500">
                  {draft.department || "请先填写所在院系"}
                  {draft.researchDirection ? ` · ${draft.researchDirection}` : ""}
                </p>
                <Badge variant="secondary">{draft.politicalStatus || "未设置政治面貌"}</Badge>
                <Badge variant="outline">{draft.workspaceRole || "未设置工作站身份"}</Badge>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 rounded-xl bg-slate-50 px-2.5 py-1.5 text-xs text-slate-500">
              <BadgeCheck className="size-3.5 text-[#a6192e]" />
              <span>完整度</span>
              <strong className="font-medium text-slate-800">{draftStats.completion}%</strong>
            </div>
            <div className="flex items-center gap-1.5 rounded-xl bg-slate-50 px-2.5 py-1.5 text-xs text-slate-500">
              <CircleAlert className="size-3.5 text-[#d94a4a]" />
              <span>关注事项</span>
              <strong className="font-medium text-slate-800">{draftStats.questions}</strong>
            </div>
            <Button type="button" variant="outline" size="sm" disabled={!hasChanges || isPending} onClick={onReset}>
              重置
            </Button>
            <Button
              type="button"
              size="sm"
              className="bg-[#a6192e] text-white hover:bg-[#861527]"
              disabled={isPending}
              onClick={onSave}
            >
              <Save />
              {isPending ? "处理中..." : isAdmin ? "保存档案" : "提交修改"}
            </Button>
          </div>
        </div>

        {notice.message ? (
          <div
            className={cn(
              "mt-3 rounded-2xl border px-4 py-2.5 text-sm",
              notice.tone === "success" && "border-emerald-200 bg-emerald-50 text-emerald-700",
              notice.tone === "error" && "border-rose-200 bg-rose-50 text-rose-700",
              notice.tone === "neutral" && "border-[#a6192e]/10 bg-[#a6192e]/5 text-[#a6192e]",
            )}
          >
            {notice.message}
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
}
