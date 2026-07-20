"use client";

import { useDeferredValue, useEffect, useRef, useState, useTransition } from "react";
import { signOut } from "next-auth/react";
import { ArrowLeft, Check, Download, Search, X, Upload, UserPlus } from "lucide-react";
import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

import { BasicInfoTab } from "@/components/navigator/workspace/basic-info-tab";
import { CollaborationTab } from "@/components/navigator/workspace/collaboration-tab";
import { GrowthTab } from "@/components/navigator/workspace/growth-tab";
import { HeroBanner } from "@/components/navigator/workspace/hero-banner";
import { IdeologyTab } from "@/components/navigator/workspace/ideology-tab";
import { IssuesTab } from "@/components/navigator/workspace/issues-tab";
import { NewMemberDialog } from "@/components/navigator/workspace/new-member-dialog";
import { ProfileSummaryCard } from "@/components/navigator/workspace/profile-summary-card";
import type { EditableListItem, EditableListKey, NoticeState } from "@/components/navigator/workspace/types";
import {
  calculateCompletionRate,
  cloneDraft,
  countMeaningfulActivities,
  countMeaningfulConversations,
  countMeaningfulPerformances,
  countOpenQuestions,
} from "@/components/navigator/workspace/utils";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  createBlankMemberDraft,
  type MemberDraft,
} from "@/lib/navigator-shared";

type NavigatorWorkspaceProps = {
  initialProfiles: MemberDraft[];
  isAdmin: boolean;
  currentEmployeeId?: string;
};

export function NavigatorWorkspace({
  initialProfiles,
  isAdmin,
  currentEmployeeId,
}: NavigatorWorkspaceProps) {
  const [profiles, setProfiles] = useState(initialProfiles);
  const [activeId, setActiveId] = useState(initialProfiles[0]?.id ?? "");
  const [draft, setDraft] = useState<MemberDraft>(() =>
    cloneDraft(initialProfiles[0] ?? createBlankMemberDraft()),
  );
  const [query, setQuery] = useState("");
  const deferredQuery = useDeferredValue(query);
  const [tab, setTab] = useState("basic");
  const [view, setView] = useState<"list" | "detail">(isAdmin ? "list" : "detail");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [importing, setImporting] = useState(false);
  const [importNotice, setImportNotice] = useState("");
  const [notice, setNotice] = useState<NoticeState>({
    tone: "neutral",
    message: "",
  });
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [newMemberName, setNewMemberName] = useState("");
  const [newMemberDepartment, setNewMemberDepartment] = useState("");
  const [newMemberEmployeeId, setNewMemberEmployeeId] = useState("");
  const [dialogError, setDialogError] = useState("");
  const [isPending, startTransition] = useTransition();

  // Delete confirmation state for list items
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [pendingDelete, setPendingDelete] = useState<{
    key: string;
    index: number;
    label: string;
  } | null>(null);

  // Change request state
  const [changeRequests, setChangeRequests] = useState<Array<{
    id: string;
    profileId: string;
    requesterId: string;
    requesterName: string;
    status: string;
    originalData: string;
    snapshotData: string;
    rejectReason: string | null;
    createdAt: string;
    reviewedAt: string | null;
    profile: { id: string; name: string; employeeId: string | null };
  }>>([]);
  const [rejectModalOpen, setRejectModalOpen] = useState(false);
  const [rejectingRequestId, setRejectingRequestId] = useState<string>("");
  const [rejectReason, setRejectReason] = useState("");
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<{
    id: string;
    profileId: string;
    requesterId: string;
    requesterName: string;
    status: string;
    originalData: string;
    snapshotData: string;
    rejectReason: string | null;
    createdAt: string;
    reviewedAt: string | null;
    profile: { id: string; name: string; employeeId: string | null };
  } | null>(null);

  // Fetch change requests for admins
  useEffect(() => {
    if (isAdmin) {
      fetchChangeRequests();
    }
  }, [isAdmin]);

  function fetchChangeRequests() {
    fetch("/api/change-requests")
      .then((res) => res.json())
      .then((data) => setChangeRequests(data.requests || []))
      .catch(console.error);
  }

  function handleApproveRequest(requestId: string) {
    fetch(`/api/change-requests/${requestId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "approve" }),
    })
      .then((res) => res.json())
      .then(() => {
        fetchChangeRequests();
        // Reload profiles to reflect changes
        window.location.reload();
      })
      .catch(console.error);
  }

  function handleRejectRequest() {
    if (!rejectingRequestId) return;

    fetch(`/api/change-requests/${rejectingRequestId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "reject", rejectReason }),
    })
      .then((res) => res.json())
      .then(() => {
        setRejectModalOpen(false);
        setRejectingRequestId("");
        setRejectReason("");
        fetchChangeRequests();
      })
      .catch(console.error);
  }

  // Field labels for display
  const fieldLabels: Record<string, string> = {
    name: "姓名",
    employeeId: "工号",
    department: "院系",
    workspaceRole: "工作站身份",
    gender: "性别",
    birthDate: "出生日期",
    ethnicity: "民族",
    hometown: "籍贯",
    politicalStatus: "政治面貌",
    partyAge: "入党时间",
    partyRole: "职务",
    academicTitle: "学术职称",
    mentorType: "导师类型",
    researchDirection: "研究方向",
    workStartDate: "参加工作时间",
    schoolEntryDate: "入校时间",
    highestDegree: "最高学历",
    biography: "个人简介",
    talentPrograms: "入选人才项目情况",
    majorProjects: "重点重大项目",
    talentTitles: "人才称号",
    provincialAwards: "省部级及以上奖项",
    socialPartTime: "社会兼职",
    idNumber: "身份证号",
    phone: "手机",
    wechat: "微信",
    email: "邮箱",
    maritalStatus: "婚姻状况",
    spouseChildren: "爱人子女",
    emergencyContact: "紧急联系人",
    hobbies: "兴趣爱好",
    partyIntent: "入党意向",
    applicationSubmitted: "已提交申请",
    developmentStage: "发展阶段",
    politicalStudyNotes: "政治学习笔记",
    democraticReviewNotes: "民主评议笔记",
  };

  const listItemLabels: Record<string, { title: string; fields: Record<string, string> }> = {
    activities: {
      title: "活动记录",
      fields: { title: "标题", category: "类别", description: "描述", date: "日期" },
    },
    keyPerformances: {
      title: " key performances",
      fields: { title: "标题", description: "描述", externalLink: "链接", date: "日期" },
    },
    careerRecords: {
      title: "career records",
      fields: { title: "标题", description: "描述", date: "日期" },
    },
    conversations: {
      title: "谈心谈话",
      fields: { summary: "摘要", confusion: "困惑", actionPlan: "行动计划", interviewer: "谈话人", location: "谈话地点", date: "日期" },
    },
    issueSuggestions: {
      title: "发展与诉求",
      fields: { title: "标题", specificIssues: "具体问题", needs: "需求", status: "推进情况" },
    },
  };

  function compareDrafts(original: MemberDraft, modified: MemberDraft) {
    const changes: Array<{ field: string; label: string; oldValue: string; newValue: string }> = [];

    // Compare basic fields
    for (const [key, label] of Object.entries(fieldLabels)) {
      const oldVal = String(original[key as keyof MemberDraft] ?? "");
      const newVal = String(modified[key as keyof MemberDraft] ?? "");

      if (oldVal !== newVal) {
        changes.push({
          field: key,
          label,
          oldValue: oldVal || "（空）",
          newValue: newVal || "（空）",
        });
      }
    }

    // Compare list fields
    for (const [listKey, listConfig] of Object.entries(listItemLabels)) {
      const oldList = original[listKey as keyof MemberDraft] as Array<Record<string, unknown>>;
      const newList = modified[listKey as keyof MemberDraft] as Array<Record<string, unknown>>;

      if (!Array.isArray(oldList) || !Array.isArray(newList)) continue;

      // Check for added/removed items
      if (oldList.length !== newList.length) {
        changes.push({
          field: listKey,
          label: `${listConfig.title}数量`,
          oldValue: `${oldList.length} 条`,
          newValue: `${newList.length} 条`,
        });
      }

      // Compare each item
      const maxLen = Math.max(oldList.length, newList.length);
      for (let i = 0; i < maxLen; i++) {
        const oldItem = oldList[i];
        const newItem = newList[i];

        for (const [fieldKey, fieldLabel] of Object.entries(listConfig.fields)) {
          const oldVal = String(oldItem?.[fieldKey] ?? "");
          const newVal = String(newItem?.[fieldKey] ?? "");

          if (oldVal !== newVal) {
            changes.push({
              field: `${listKey}[${i}].${fieldKey}`,
              label: `${listConfig.title} #${i + 1} - ${fieldLabel}`,
              oldValue: oldVal || "（空）",
              newValue: newVal || "（空）",
            });
          }
        }
      }
    }

    return changes;
  }

  const originalProfile = profiles.find((item) => item.id === activeId);
  const hasChanges =
    JSON.stringify(draft) !== JSON.stringify(originalProfile ?? createBlankMemberDraft());

  const filteredProfiles = profiles.filter((item) => {
    if (!deferredQuery.trim()) {
      return true;
    }

    const keyword = deferredQuery.trim().toLowerCase();
    return [item.name, item.department, item.employeeId]
      .join(" ")
      .toLowerCase()
      .includes(keyword);
  });

  const globalStats = {
    members: profiles.length,
    activities: profiles.reduce((sum, item) => sum + countMeaningfulActivities(item), 0),
    conversations: profiles.reduce((sum, item) => sum + countMeaningfulConversations(item), 0),
    pendingQuestions: profiles.reduce((sum, item) => sum + countOpenQuestions(item), 0),
  };

  const draftStats = {
    completion: calculateCompletionRate(draft),
    activities: countMeaningfulActivities(draft),
    performances: countMeaningfulPerformances(draft),
    questions: countOpenQuestions(draft),
  };

  function hasPendingRequest(profileId: string) {
    return changeRequests.some(
      (r) => r.profileId === profileId && r.status === "pending"
    );
  }

  function updateField<K extends keyof MemberDraft>(key: K, value: MemberDraft[K]) {
    setDraft((current) => ({
      ...current,
      [key]: value,
    }));
  }

  function updateListItem<K extends EditableListKey>(
    key: K,
    index: number,
    updater: (item: EditableListItem<K>) => EditableListItem<K>,
  ) {
    setDraft((current) => {
      const items = current[key] as EditableListItem<K>[];
      const nextItems = items.map((item, itemIndex) =>
        itemIndex === index ? updater(item) : item,
      ) as MemberDraft[K];

      return {
        ...current,
        [key]: nextItems,
      };
    });
  }

  function appendListItem<K extends EditableListKey>(key: K, item: EditableListItem<K>) {
    setDraft((current) => ({
      ...current,
      [key]: [...current[key], item] as MemberDraft[K],
    }));
  }

  function requestRemoveListItem<K extends Exclude<EditableListKey, "contacts">>(
    key: K,
    index: number,
    label: string,
  ) {
    setPendingDelete({ key, index, label });
    setDeleteConfirmOpen(true);
  }

  function confirmRemoveListItem() {
    if (!pendingDelete) return;

    const { key, index } = pendingDelete;
    setDraft((current) => {
      const items = current[key as keyof MemberDraft] as Array<{ id?: string }>;
      const nextItems = items.filter((_, itemIndex) => itemIndex !== index);

      // Allow empty arrays for all list fields
      return {
        ...current,
        [key]: nextItems as never,
      };
    });

    setDeleteConfirmOpen(false);
    setPendingDelete(null);
  }

  // Keep removeListItem for backward compatibility but it now shows confirmation
  function removeListItem<K extends Exclude<EditableListKey, "contacts">>(
    key: K,
    index: number,
    fallbackFactory: () => EditableListItem<K>,
    label?: string,
  ) {
    requestRemoveListItem(key, index, label || "此项");
  }

  function updateTopLevelAttachment(
    key: "avatar" | "ideologyAttachment",
    value: MemberDraft["avatar"],
  ) {
    updateField(key, value);
  }

  function handleSelectProfile(profile: MemberDraft) {
    setActiveId(profile.id);
    setDraft(cloneDraft(profile));
    setNotice({ tone: "neutral", message: "" });
    if (isAdmin) {
      setView("detail");
    }
  }

  function handleBackToList() {
    setView("list");
    setNotice({ tone: "neutral", message: "" });
  }

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

      window.location.reload();
    } catch {
      setImportNotice("导入失败，请检查网络连接");
    } finally {
      setImporting(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  }

  function handleCreateDialogChange(open: boolean) {
    setCreateDialogOpen(open);

    if (!open) {
      setDialogError("");
      setNewMemberName("");
      setNewMemberDepartment("");
      setNewMemberEmployeeId("");
    }
  }

  function persistProfile(profile: MemberDraft, mode: "save" | "create") {
    // Non-admin users submit change requests instead of direct saves (only for existing profiles)
    if (!isAdmin && mode === "save" && profile.id) {
      startTransition(async () => {
        setNotice({
          tone: "neutral",
          message: "正在提交修改申请...",
        });

        try {
          const response = await fetch("/api/change-requests", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              profileId: profile.id,
              snapshotData: profile,
            }),
          });

          const result = await response.json();

          if (!response.ok) {
            throw new Error(result?.error ?? "提交修改申请失败");
          }

          setNotice({
            tone: "success",
            message: "已提交修改申请，管理员审核通过即可修改成功。",
          });
        } catch (error) {
          setNotice({
            tone: "error",
            message: error instanceof Error ? error.message : "提交修改申请失败，请稍后重试。",
          });
        }
      });
      return;
    }

    startTransition(async () => {
      setNotice({
        tone: "neutral",
        message: mode === "create" ? "正在创建成员档案..." : "正在保存档案...",
      });

      try {
        const response = await fetch("/api/members", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(profile),
        });

        const result = (await response.json()) as
          | {
              profile?: MemberDraft;
              error?: string;
            }
          | undefined;

        if (!response.ok || !result?.profile) {
          throw new Error(result?.error ?? "保存失败");
        }

        const savedProfile = result.profile;

        setProfiles((current) => {
          const rest = current.filter((item) => item.id !== savedProfile.id);
          return [savedProfile, ...rest];
        });
        setActiveId(savedProfile.id);
        setDraft(cloneDraft(savedProfile));
        setNotice({
          tone: "success",
          message: `${savedProfile.name || "成员"} 档案已保存。`,
        });

        if (mode === "create") {
          handleCreateDialogChange(false);
        }
      } catch (error) {
        setNotice({
          tone: "error",
          message: error instanceof Error ? error.message : "保存失败，请稍后重试。",
        });
      }
    });
  }

  function handleCreateMember() {
    if (!newMemberEmployeeId.trim()) {
      setDialogError("请先填写工号。");
      return;
    }
    if (!newMemberName.trim()) {
      setDialogError("请先填写成员姓名。");
      return;
    }

    const nextDraft = createBlankMemberDraft();
    nextDraft.employeeId = newMemberEmployeeId.trim();
    nextDraft.name = newMemberName.trim();
    nextDraft.department = newMemberDepartment.trim();
    persistProfile(nextDraft, "create");
  }

  return (
    <main className="navigator-page-bg min-h-screen">
      <div className="navigator-page-grid pointer-events-none absolute inset-0" />

      <div className="relative mx-auto flex w-full max-w-[1440px] flex-col gap-6 px-4 py-5 sm:px-6 lg:px-8 lg:py-8">
        <div className="flex items-center justify-between">
          <div className="text-sm text-slate-600">
            登录工号：{currentEmployeeId}
            {isAdmin && <span className="ml-2 rounded bg-[#a6192e] px-2 py-0.5 text-xs text-white">管理员</span>}
          </div>
          <div className="flex items-center gap-4">
            {isAdmin && (
              <Link href="/admin/users" className="text-sm text-[#a6192e] hover:underline">
                用户管理
              </Link>
            )}
            <button
              onClick={() => signOut({ callbackUrl: "/login" })}
              className="text-sm text-slate-500 hover:text-slate-700"
            >
              退出登录
            </button>
          </div>
        </div>

        {/* 管理员：列表视图 */}
        {isAdmin && view === "list" && (
          <>
            <HeroBanner globalStats={globalStats} />

            <Card className="navigator-panel gap-0 overflow-hidden py-0">
              <CardHeader className="space-y-4 border-b border-[#a6192e]/10 bg-[linear-gradient(135deg,rgba(166,25,46,0.08),rgba(255,255,255,0.96)_55%,rgba(217,74,74,0.06))] px-6 py-5">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-3">
                    <span className="h-9 w-1 rounded-full bg-[#a6192e]" />
                    <div>
                      <CardTitle className="text-xl text-slate-900">成员档案库</CardTitle>
                      <CardDescription className="mt-0.5 text-xs">点击成员查看详情并编辑档案</CardDescription>
                    </div>
                  </div>
                  <div className="flex shrink-0 items-center gap-2">
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
                      className="h-9 gap-1.5 rounded-xl border-[#a6192e]/15 bg-white px-3 text-xs text-[#861527] hover:bg-[#a6192e]/5"
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
                      className="h-9 gap-1.5 rounded-xl border-[#a6192e]/15 bg-white px-3 text-xs text-[#861527] hover:bg-[#a6192e]/5"
                      onClick={handleExport}
                    >
                      <Download />
                      导出
                    </Button>
                    <Button
                      type="button"
                      size="sm"
                      className="h-9 gap-1.5 rounded-xl bg-[#a6192e] px-3 text-xs text-white shadow-[0_8px_20px_rgba(166,25,46,0.2)] hover:bg-[#861527]"
                      onClick={() => {
                        setCreateDialogOpen(true);
                        setDialogError("");
                      }}
                    >
                      <UserPlus />
                      新建
                    </Button>
                  </div>
                </div>
                {importNotice && (
                  <div className="rounded-xl border border-[#a6192e]/10 bg-[#a6192e]/5 px-3 py-2 text-xs text-[#a6192e]">
                    {importNotice}
                  </div>
                )}
                <div className="relative">
                  <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
                  <Input
                    value={query}
                    onChange={(event) => setQuery(event.target.value)}
                    placeholder="搜索姓名、院系或工号"
                    className="h-11 rounded-2xl border-[#a6192e]/12 bg-white/90 pl-10 shadow-sm focus-visible:border-[#a6192e]/40 focus-visible:ring-[#a6192e]/12"
                  />
                </div>
              </CardHeader>

              <CardContent className="bg-[linear-gradient(180deg,#fffdfc,#fff8f6)] p-5">
                {filteredProfiles.length > 0 ? (
                  <div className="space-y-3">
                    {filteredProfiles.map((profile) => {
                      const questionCount = countOpenQuestions(profile);
                      const pending = hasPendingRequest(profile.id);

                      return (
                        <button
                          key={profile.id}
                          type="button"
                          onClick={() => handleSelectProfile(profile)}
                          className="group flex w-full items-center gap-4 rounded-2xl border border-[#a6192e]/8 bg-white px-5 py-4 text-left shadow-[0_5px_18px_rgba(91,20,31,0.04)] transition-all hover:-translate-y-0.5 hover:border-[#a6192e]/25 hover:shadow-[0_12px_28px_rgba(91,20,31,0.1)]"
                        >
                          {/* Red dot indicator for pending requests */}
                          <div className="relative">
                            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-[#a6192e] to-[#d94a4a] text-base font-medium text-white shadow-[0_6px_16px_rgba(166,25,46,0.2)] ring-4 ring-[#a6192e]/5">
                              {(profile.name || "未")[0]}
                            </div>
                            {pending && (
                              <div className="absolute -right-0.5 -top-0.5 h-3 w-3 rounded-full border-2 border-white bg-red-500" />
                            )}
                          </div>

                          {/* Profile info */}
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-2">
                              <p className="truncate text-base font-medium text-slate-900 group-hover:text-[#861527]">{profile.name || "未命名成员"}</p>
                              <Badge variant="secondary" className="shrink-0">{profile.developmentStage || "未设阶段"}</Badge>
                              {pending && (
                                <Badge variant="destructive" className="shrink-0">待审核</Badge>
                              )}
                            </div>
                            <p className="mt-0.5 text-xs text-slate-500">{profile.department || "未填写院系"}</p>
                          </div>

                          {/* Stats */}
                          {questionCount > 0 && (
                            <span className="rounded-full bg-[#a6192e]/6 px-3 py-1.5 text-xs font-medium text-[#861527]">
                              {questionCount} 个待跟进诉求
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                ) : (
                  <div className="rounded-[24px] border border-dashed border-black/10 bg-slate-50 p-6 text-sm text-slate-500">
                    未找到匹配成员，可点击右上角“新建”录入新档案。
                  </div>
                )}
              </CardContent>
            </Card>
          </>
        )}

        {/* 管理员详情视图 / 非管理员直接显示 */}
        {(!isAdmin || view === "detail") && (
          <div className="space-y-6">
            {isAdmin && (
              <button
                type="button"
                onClick={handleBackToList}
                className="flex items-center gap-1.5 text-sm text-[#a6192e] hover:underline"
              >
                <ArrowLeft className="size-4" />
                返回成员列表
              </button>
            )}

            <ProfileSummaryCard
              draft={draft}
              draftStats={draftStats}
              hasChanges={hasChanges}
              isPending={isPending}
              notice={notice}
              isAdmin={isAdmin}
              onAvatarChange={(value) => updateTopLevelAttachment("avatar", value)}
              onReset={() => setDraft(cloneDraft(originalProfile ?? createBlankMemberDraft()))}
              onSave={() => persistProfile(draft, "save")}
            />

            <Tabs value={tab} onValueChange={setTab}>
              <TabsList
                variant="line"
                className="w-full justify-start overflow-x-auto rounded-none border-b border-black/6 bg-transparent p-0"
              >
                <TabsTrigger value="basic" className="rounded-t-2xl px-4 py-3">
                  基本信息
                </TabsTrigger>
                <TabsTrigger value="growth" className="rounded-t-2xl px-4 py-3">
                  成长轨迹
                </TabsTrigger>
                <TabsTrigger value="ideology" className="rounded-t-2xl px-4 py-3">
                  思想动态
                </TabsTrigger>
                <TabsTrigger value="issues" className="rounded-t-2xl px-4 py-3">
                  发展与诉求
                </TabsTrigger>
                <TabsTrigger value="collaboration" className="rounded-t-2xl px-4 py-3">
                  合作需求
                </TabsTrigger>
                {isAdmin && (
                  <TabsTrigger value="approvals" className="rounded-t-2xl px-4 py-3">
                    修改审核
                    {changeRequests.filter((r) => r.status === "pending").length > 0 && (
                      <Badge variant="destructive" className="ml-2 h-5 min-w-5 px-1">
                        {changeRequests.filter((r) => r.status === "pending").length}
                      </Badge>
                    )}
                  </TabsTrigger>
                )}
              </TabsList>

              <TabsContent value="basic" className="pt-4">
                <BasicInfoTab
                  draft={draft}
                  updateField={updateField}
                  updateListItem={updateListItem}
                />
              </TabsContent>

              <TabsContent value="growth" className="pt-4">
                <GrowthTab
                  draft={draft}
                  updateListItem={updateListItem}
                  appendListItem={appendListItem}
                  removeListItem={removeListItem}
                />
              </TabsContent>

              <TabsContent value="ideology" className="pt-4">
                <IdeologyTab
                  draft={draft}
                  updateField={updateField}
                  updateListItem={updateListItem}
                  appendListItem={appendListItem}
                  removeListItem={removeListItem}
                  updateTopLevelAttachment={updateTopLevelAttachment}
                />
              </TabsContent>

              <TabsContent value="issues" className="pt-4">
                <IssuesTab
                  draft={draft}
                  updateListItem={updateListItem}
                  appendListItem={appendListItem}
                  removeListItem={removeListItem}
                />
              </TabsContent>

              <TabsContent value="collaboration" className="pt-4">
                <CollaborationTab
                  currentEmployeeId={currentEmployeeId}
                  isAdmin={isAdmin}
                  department={draft.department}
                />
              </TabsContent>

              {isAdmin && (
                <TabsContent value="approvals" className="pt-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>修改审核</CardTitle>
                      <CardDescription>审核成员提交的档案修改申请。</CardDescription>
                    </CardHeader>
                    <CardContent>
                      {changeRequests.length === 0 ? (
                        <p className="text-sm text-slate-500">暂无修改申请。</p>
                      ) : (
                        <div className="space-y-4">
                          {changeRequests.map((request) => {
                            return (
                              <div
                                key={request.id}
                                className="rounded-xl border border-black/6 p-4"
                              >
                                <div className="flex items-start justify-between">
                                  <div>
                                    <p className="font-medium text-slate-900">
                                      {request.profile.name}
                                      <span className="ml-2 text-sm text-slate-500">
                                        ({request.profile.employeeId})
                                      </span>
                                    </p>
                                    <p className="mt-1 text-sm text-slate-500">
                                      申请人：{request.requesterName} · {new Date(request.createdAt).toLocaleString("zh-CN")}
                                    </p>
                                  </div>
                                  <Badge
                                    variant={
                                      request.status === "pending"
                                        ? "secondary"
                                        : request.status === "approved"
                                          ? "default"
                                          : "destructive"
                                    }
                                  >
                                    {request.status === "pending"
                                      ? "待审核"
                                      : request.status === "approved"
                                        ? "已通过"
                                        : "已拒绝"}
                                  </Badge>
                                </div>

                                <div className="mt-4 flex gap-2">
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => {
                                      setSelectedRequest(request);
                                      setDetailModalOpen(true);
                                    }}
                                  >
                                    查看详情
                                  </Button>
                                  {request.status === "pending" && (
                                    <>
                                      <Button
                                        size="sm"
                                        onClick={() => handleApproveRequest(request.id)}
                                      >
                                        <Check className="mr-1 h-4 w-4" />
                                        通过
                                      </Button>
                                      <Button
                                        size="sm"
                                        variant="outline"
                                        onClick={() => {
                                          setRejectingRequestId(request.id);
                                          setRejectModalOpen(true);
                                        }}
                                      >
                                        <X className="mr-1 h-4 w-4" />
                                        拒绝
                                      </Button>
                                    </>
                                  )}
                                </div>

                                {request.status === "rejected" && request.rejectReason && (
                                  <p className="mt-2 text-sm text-red-600">
                                    拒绝原因：{request.rejectReason}
                                  </p>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>
              )}
            </Tabs>
          </div>
        )}
      </div>

      <NewMemberDialog
        open={createDialogOpen}
        name={newMemberName}
        department={newMemberDepartment}
        employeeId={newMemberEmployeeId}
        error={dialogError}
        isPending={isPending}
        onOpenChange={handleCreateDialogChange}
        onNameChange={setNewMemberName}
        onDepartmentChange={setNewMemberDepartment}
        onEmployeeIdChange={setNewMemberEmployeeId}
        onSubmit={handleCreateMember}
      />

      {/* Reject Modal */}
      {rejectModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
            <h3 className="text-lg font-semibold text-slate-900">拒绝修改申请</h3>
            <p className="mt-2 text-sm text-slate-500">请输入拒绝原因：</p>
            <Textarea
              className="mt-3"
              placeholder="请输入拒绝原因..."
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
            />
            <div className="mt-4 flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => {
                  setRejectModalOpen(false);
                  setRejectingRequestId("");
                  setRejectReason("");
                }}
              >
                取消
              </Button>
              <Button
                variant="destructive"
                onClick={handleRejectRequest}
                disabled={!rejectReason.trim()}
              >
                确认拒绝
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Detail Modal */}
      {detailModalOpen && selectedRequest && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="max-h-[80vh] w-full max-w-3xl overflow-y-auto rounded-2xl bg-white p-6 shadow-xl">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-slate-900">
                修改详情 - {selectedRequest.profile.name}
              </h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setDetailModalOpen(false);
                  setSelectedRequest(null);
                }}
              >
                ✕
              </Button>
            </div>

            {(() => {
              const original = JSON.parse(selectedRequest.originalData) as MemberDraft;
              const modified = JSON.parse(selectedRequest.snapshotData) as MemberDraft;
              const changes = compareDrafts(original, modified);

              if (changes.length === 0) {
                return (
                  <p className="mt-4 text-sm text-slate-500">未检测到修改内容。</p>
                );
              }

              return (
                <div className="mt-4 space-y-3">
                  <p className="text-sm text-slate-500">
                    共 {changes.length} 项修改：
                  </p>
                  <div className="rounded-xl border border-black/6 overflow-hidden">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-black/6 bg-slate-50">
                          <th className="px-4 py-2 text-left font-medium text-slate-600">字段</th>
                          <th className="px-4 py-2 text-left font-medium text-slate-600">修改前</th>
                          <th className="px-4 py-2 text-left font-medium text-slate-600">修改后</th>
                        </tr>
                      </thead>
                      <tbody>
                        {changes.map((change) => (
                          <tr key={change.field} className="border-b border-black/6 last:border-0">
                            <td className="px-4 py-3 font-medium text-slate-900">{change.label}</td>
                            <td className="px-4 py-3 text-slate-500">{change.oldValue}</td>
                            <td className="px-4 py-3 text-green-700">{change.newValue}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              );
            })()}

            <div className="mt-6 flex justify-end">
              <Button
                variant="outline"
                onClick={() => {
                  setDetailModalOpen(false);
                  setSelectedRequest(null);
                }}
              >
                关闭
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal for List Items */}
      {deleteConfirmOpen && pendingDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl">
            <h3 className="text-lg font-semibold text-slate-900">确认删除</h3>
            <p className="mt-2 text-sm text-slate-500">
              确认删除{pendingDelete.label}？删除后无法恢复。
            </p>
            <div className="mt-6 flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => {
                  setDeleteConfirmOpen(false);
                  setPendingDelete(null);
                }}
              >
                取消
              </Button>
              <Button
                variant="destructive"
                onClick={confirmRemoveListItem}
              >
                确认删除
              </Button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
