"use client";

import { useDeferredValue, useState, useTransition } from "react";

import { BasicInfoTab } from "@/components/navigator/workspace/basic-info-tab";
import { GrowthTab } from "@/components/navigator/workspace/growth-tab";
import { HeroBanner } from "@/components/navigator/workspace/hero-banner";
import { IdeologyTab } from "@/components/navigator/workspace/ideology-tab";
import { IssuesTab } from "@/components/navigator/workspace/issues-tab";
import { MemberSidebar } from "@/components/navigator/workspace/member-sidebar";
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
};

export function NavigatorWorkspace({ initialProfiles }: NavigatorWorkspaceProps) {
  const [profiles, setProfiles] = useState(initialProfiles);
  const [activeId, setActiveId] = useState(initialProfiles[0]?.id ?? "");
  const [draft, setDraft] = useState<MemberDraft>(() =>
    cloneDraft(initialProfiles[0] ?? createBlankMemberDraft()),
  );
  const [query, setQuery] = useState("");
  const deferredQuery = useDeferredValue(query);
  const [tab, setTab] = useState("basic");
  const [notice, setNotice] = useState<NoticeState>({
    tone: "neutral",
    message: "",
  });
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [newMemberName, setNewMemberName] = useState("");
  const [newMemberDepartment, setNewMemberDepartment] = useState("");
  const [dialogError, setDialogError] = useState("");
  const [isPending, startTransition] = useTransition();

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

  function removeListItem<K extends Exclude<EditableListKey, "contacts">>(
    key: K,
    index: number,
    fallbackFactory: () => EditableListItem<K>,
  ) {
    setDraft((current) => {
      const items = current[key] as EditableListItem<K>[];
      const nextItems = items.filter((_, itemIndex) => itemIndex !== index);

      return {
        ...current,
        [key]: (nextItems.length > 0 ? nextItems : [fallbackFactory()]) as MemberDraft[K],
      };
    });
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
  }

  function handleCreateDialogChange(open: boolean) {
    setCreateDialogOpen(open);

    if (!open) {
      setDialogError("");
      setNewMemberName("");
      setNewMemberDepartment("");
    }
  }

  function persistProfile(profile: MemberDraft, mode: "save" | "create") {
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
    if (!newMemberName.trim()) {
      setDialogError("请先填写成员姓名。");
      return;
    }

    const nextDraft = createBlankMemberDraft();
    nextDraft.name = newMemberName.trim();
    nextDraft.department = newMemberDepartment.trim();
    persistProfile(nextDraft, "create");
  }

  return (
    <main className="navigator-page-bg min-h-screen">
      <div className="navigator-page-grid pointer-events-none absolute inset-0" />

      <div className="relative mx-auto flex w-full max-w-[1440px] flex-col gap-6 px-4 py-5 sm:px-6 lg:px-8 lg:py-8">
        <HeroBanner
          draft={draft}
          draftQuestionCount={draftStats.questions}
          globalStats={globalStats}
        />

        <div className="grid gap-6 xl:grid-cols-[320px_1fr]">
          <MemberSidebar
            profiles={filteredProfiles}
            activeId={activeId}
            query={query}
            onQueryChange={setQuery}
            onCreate={() => {
              setCreateDialogOpen(true);
              setDialogError("");
            }}
            onSelectProfile={handleSelectProfile}
          />

          <div className="space-y-6">
            <ProfileSummaryCard
              draft={draft}
              draftStats={draftStats}
              hasChanges={hasChanges}
              isPending={isPending}
              notice={notice}
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
                  问题与建议
                </TabsTrigger>
              </TabsList>

              <TabsContent value="basic" className="pt-4">
                <BasicInfoTab
                  draft={draft}
                  updateField={updateField}
                  updateTopLevelAttachment={updateTopLevelAttachment}
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
            </Tabs>
          </div>
        </div>
      </div>

      <NewMemberDialog
        open={createDialogOpen}
        name={newMemberName}
        department={newMemberDepartment}
        error={dialogError}
        isPending={isPending}
        onOpenChange={handleCreateDialogChange}
        onNameChange={setNewMemberName}
        onDepartmentChange={setNewMemberDepartment}
        onSubmit={handleCreateMember}
      />
    </main>
  );
}
