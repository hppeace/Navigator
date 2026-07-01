"use client";

import { useEffect, useState } from "react";
import { Edit, Handshake, Plus, Trash2, X } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";

interface CollaborationNeed {
  id: string;
  authorId: string;
  authorName: string;
  department: string | null;
  title: string;
  content: string;
  requirements: string | null;
  status: string;
  createdAt: string;
  email: string | null;
  phone: string | null;
  researchDirection: string | null;
}

type CollaborationTabProps = {
  currentEmployeeId?: string;
  isAdmin: boolean;
  department?: string;
};

export function CollaborationTab({
  currentEmployeeId,
  isAdmin,
  department,
}: CollaborationTabProps) {
  const [needs, setNeeds] = useState<CollaborationNeed[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [requirements, setRequirements] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  useEffect(() => {
    fetchNeeds();
  }, []);

  const fetchNeeds = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/collaboration-needs");
      const data = await res.json();
      setNeeds(data.needs || []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setTitle("");
    setContent("");
    setRequirements("");
    setEditingId(null);
    setShowForm(false);
  };

  const handleStartEdit = (need: CollaborationNeed) => {
    setEditingId(need.id);
    setTitle(need.title);
    setContent(need.content);
    setRequirements(need.requirements || "");
    setShowForm(true);
  };

  const handleSubmit = async () => {
    if (!title.trim() || !content.trim()) return;

    setSubmitting(true);
    try {
      const url = editingId
        ? `/api/collaboration-needs/${editingId}`
        : "/api/collaboration-needs";
      const method = editingId ? "PATCH" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, content, requirements, department }),
      });

      if (res.ok) {
        resetForm();
        fetchNeeds();
      }
    } catch (error) {
      console.error(error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleClose = async (id: string) => {
    await fetch(`/api/collaboration-needs/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: "closed" }),
    });
    fetchNeeds();
  };

  const handleReopen = async (id: string) => {
    await fetch(`/api/collaboration-needs/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: "open" }),
    });
    fetchNeeds();
  };

  const handleDelete = async () => {
    if (!deleteConfirmId) return;
    await fetch(`/api/collaboration-needs/${deleteConfirmId}`, { method: "DELETE" });
    setDeleteConfirmId(null);
    fetchNeeds();
  };

  const myNeeds = needs.filter((n) => n.authorId === currentEmployeeId);
  const othersNeeds = needs.filter((n) => n.authorId !== currentEmployeeId);

  const renderNeedCard = (need: CollaborationNeed, showActions: boolean) => {
    const isAuthor = need.authorId === currentEmployeeId;
    const isOpen = need.status === "open";

    return (
      <div
        key={need.id}
        className={`rounded-xl border p-4 ${isOpen ? "border-black/6 bg-white" : "border-black/6 bg-slate-50 opacity-70"}`}
      >
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <h4 className="font-medium text-slate-900">{need.title}</h4>
              {!isOpen && (
                <Badge variant="secondary" className="shrink-0">
                  已关闭
                </Badge>
              )}
            </div>
            <p className="mt-1 text-sm text-slate-500">
              {need.authorName}
              {need.department && ` · ${need.department}`}
              {" · "}
              {new Date(need.createdAt).toLocaleDateString("zh-CN")}
            </p>
            {/* Contact info */}
            {(need.email || need.phone || need.researchDirection) && (
              <div className="mt-2 flex flex-wrap gap-3 text-xs text-slate-400">
                {need.researchDirection && <span>研究方向：{need.researchDirection}</span>}
                {need.email && <span>邮箱：{need.email}</span>}
                {need.phone && <span>电话：{need.phone}</span>}
              </div>
            )}
          </div>

          {showActions && (
            <div className="flex shrink-0 gap-2">
              {isAuthor && (
                <>
                  {isOpen && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleStartEdit(need)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                  )}
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => (isOpen ? handleClose(need.id) : handleReopen(need.id))}
                  >
                    {isOpen ? "关闭" : "重新开放"}
                  </Button>
                </>
              )}
              {(isAdmin || isAuthor) && (
                <Button
                  size="sm"
                  variant="outline"
                  className="text-red-600 hover:bg-red-50"
                  onClick={() => setDeleteConfirmId(need.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              )}
            </div>
          )}
        </div>

        <div className="mt-3">
          <p className="text-sm text-slate-700 whitespace-pre-wrap">{need.content}</p>
        </div>

        {need.requirements && (
          <div className="mt-3 rounded-lg bg-slate-50 px-3 py-2">
            <p className="text-xs font-medium text-slate-500">合作需求：</p>
            <p className="mt-1 text-sm text-slate-600 whitespace-pre-wrap">
              {need.requirements}
            </p>
          </div>
        )}
      </div>
    );
  };

  const renderNeedsList = (items: CollaborationNeed[], showActions: boolean) => {
    if (items.length === 0) {
      return (
        <div className="py-8 text-center text-sm text-slate-500">
          暂无合作需求。
        </div>
      );
    }

    return (
      <div className="space-y-3">
        {items.map((need) => renderNeedCard(need, showActions))}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Handshake className="h-5 w-5 text-[#0f4c5c]" />
                合作需求平台
              </CardTitle>
              <CardDescription>
                发布和查看成员间的合作需求，促进跨院系交流与协作。
              </CardDescription>
            </div>
            <Button size="sm" onClick={() => { resetForm(); setShowForm(!showForm); }}>
              {showForm ? (
                <>
                  <X className="mr-1 h-4 w-4" />
                  取消
                </>
              ) : (
                <>
                  <Plus className="mr-1 h-4 w-4" />
                  发布需求
                </>
              )}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {/* Publish/Edit Form */}
          {showForm && (
            <div className="mb-6 rounded-xl border border-black/6 bg-slate-50 p-4">
              <h3 className="mb-3 font-medium text-slate-900">
                {editingId ? "编辑合作需求" : "发布合作需求"}
              </h3>
              <div className="space-y-3">
                <div>
                  <label className="mb-1 block text-sm text-slate-600">合作标题 *</label>
                  <Input
                    placeholder="例如：寻求AI算法优化方向合作"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm text-slate-600">合作内容 *</label>
                  <Textarea
                    placeholder="详细描述合作背景、目标和预期成果..."
                    className="min-h-24"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm text-slate-600">合作需求</label>
                  <Textarea
                    placeholder="对合作伙伴的要求、技能需求等..."
                    className="min-h-20"
                    value={requirements}
                    onChange={(e) => setRequirements(e.target.value)}
                  />
                </div>
                <div className="flex justify-end">
                  <Button
                    onClick={handleSubmit}
                    disabled={!title.trim() || !content.trim() || submitting}
                  >
                    {submitting ? "提交中..." : editingId ? "保存修改" : "发布"}
                  </Button>
                </div>
              </div>
            </div>
          )}

          {loading ? (
            <div className="py-8 text-center text-sm text-slate-500">加载中...</div>
          ) : needs.length === 0 ? (
            <div className="py-8 text-center text-sm text-slate-500">
              暂无合作需求，点击"发布需求"创建第一条。
            </div>
          ) : (
            <Tabs defaultValue="mine" className="w-full">
              <TabsList className="w-full justify-start overflow-x-auto rounded-none border-b border-black/6 bg-transparent p-0">
                <TabsTrigger value="mine" className="rounded-t-2xl px-4 py-3">
                  我发布的 ({myNeeds.length})
                </TabsTrigger>
                <TabsTrigger value="others" className="rounded-t-2xl px-4 py-3">
                  其他成员发布 ({othersNeeds.length})
                </TabsTrigger>
              </TabsList>

              <TabsContent value="mine" className="pt-4">
                {renderNeedsList(myNeeds, true)}
              </TabsContent>

              <TabsContent value="others" className="pt-4">
                {renderNeedsList(othersNeeds, false)}
              </TabsContent>
            </Tabs>
          )}
        </CardContent>
      </Card>
      {/* Delete Confirmation Modal */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl">
            <h3 className="text-lg font-semibold text-slate-900">确认删除</h3>
            <p className="mt-2 text-sm text-slate-500">
              确认删除此合作需求？删除后无法恢复。
            </p>
            <div className="mt-6 flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => setDeleteConfirmId(null)}
              >
                取消
              </Button>
              <Button
                variant="destructive"
                onClick={handleDelete}
              >
                确认删除
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
