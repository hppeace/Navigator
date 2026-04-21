"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Shield, UserCog, Trash2, KeyRound, ArrowLeft } from "lucide-react";
import Link from "next/link";

interface User {
  id: string;
  employeeId: string;
  name: string | null;
  isAdmin: boolean;
  createdAt: string;
}

export default function AdminUsersPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [resetPasswordId, setResetPasswordId] = useState<string | null>(null);
  const [newPassword, setNewPassword] = useState("");
  const [error, setError] = useState("");
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  useEffect(() => {
    if (session?.user && (session.user as any).isAdmin) {
      fetchUsers();
    }
  }, [session]);

  const fetchUsers = async () => {
    setLoading(true);
    const res = await fetch("/api/users");
    const data = await res.json();
    setUsers(data.users || []);
    setLoading(false);
  };

  const handleResetPassword = async (id: string) => {
    if (!newPassword || newPassword.length < 6) {
      setError("密码至少6位");
      return;
    }

    const res = await fetch(`/api/users/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password: newPassword }),
    });

    if (res.ok) {
      setResetPasswordId(null);
      setNewPassword("");
      setError("");
      fetchUsers();
    } else {
      const data = await res.json();
      setError(data.error || "操作失败");
    }
  };

  const handleDeleteUser = async (id: string) => {
    const res = await fetch(`/api/users/${id}`, { method: "DELETE" });
    if (!res.ok) {
      const data = await res.json();
      alert(data.error || "删除失败");
      return;
    }
    setDeleteConfirmId(null);
    fetchUsers();
  };

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-[#0f4c5c]/10 mb-4">
            <div className="w-6 h-6 border-2 border-[#0f4c5c] border-t-transparent rounded-full animate-spin" />
          </div>
          <p className="text-slate-500">加载中...</p>
        </div>
      </div>
    );
  }

  if (!session?.user || !(session.user as any).isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-100 mb-4">
            <Shield className="w-8 h-8 text-red-500" />
          </div>
          <h2 className="text-xl font-semibold text-slate-900">无权限访问</h2>
          <p className="text-slate-500 mt-2">您没有管理员权限</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-8">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-slate-700 mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            返回工作台
          </Link>

          <div className="flex items-center gap-4">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-[#0f4c5c] shadow-lg shadow-[#0f4c5c]/20">
              <UserCog className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-900">用户管理</h1>
              <p className="text-sm text-slate-500">管理成员账户信息，新建档案时自动创建账户</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-[24px] shadow-sm border border-black/5 overflow-hidden">
          <div className="px-6 py-5 border-b border-black/5 bg-slate-50/50">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-[#0f4c5c]/10 flex items-center justify-center">
                <Shield className="w-4 h-4 text-[#0f4c5c]" />
              </div>
              <div>
                <h2 className="font-semibold text-slate-900">账户列表</h2>
                <p className="text-xs text-slate-500">共 {users.length} 个账户</p>
              </div>
            </div>
          </div>

          <div className="divide-y divide-black/5">
            {users.map((user) => (
              <div key={user.id} className="px-6 py-5 hover:bg-slate-50/50 transition-colors">
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${user.isAdmin ? "bg-[#0f4c5c]/10" : "bg-slate-100"}`}>
                      {user.isAdmin ? (
                        <Shield className="w-5 h-5 text-[#0f4c5c]" />
                      ) : (
                        <div className="w-5 h-5 rounded-full bg-slate-300" />
                      )}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-slate-900">{user.name || "未命名"}</span>
                        {user.isAdmin && (
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-[#0f4c5c]/10 text-[#0f4c5c]">
                            管理员
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-3 mt-1">
                        <span className="text-sm text-slate-500">工号：{user.employeeId}</span>
                        <span className="text-xs text-slate-400">|</span>
                        <span className="text-sm text-slate-400">
                          创建于 {new Date(user.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {resetPasswordId === user.id ? (
                      <div className="flex items-center gap-2">
                        <input
                          type="password"
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          placeholder="新密码"
                          className="w-32 h-9 rounded-xl border border-black/10 bg-slate-50 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#0f4c5c]/20 focus:border-[#0f4c5c]"
                          minLength={6}
                          autoFocus
                        />
                        <button
                          onClick={() => handleResetPassword(user.id)}
                          className="h-9 px-4 rounded-xl bg-[#0f4c5c] text-white text-sm font-medium hover:bg-[#0d3f4f] transition-colors"
                        >
                          确认
                        </button>
                        <button
                          onClick={() => {
                            setResetPasswordId(null);
                            setNewPassword("");
                            setError("");
                          }}
                          className="h-9 px-4 rounded-xl border border-black/10 text-slate-600 text-sm font-medium hover:bg-slate-50 transition-colors"
                        >
                          取消
                        </button>
                      </div>
                    ) : deleteConfirmId === user.id ? (
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-red-600">确认删除？</span>
                        <button
                          onClick={() => handleDeleteUser(user.id)}
                          className="h-9 px-4 rounded-xl bg-red-500 text-white text-sm font-medium hover:bg-red-600 transition-colors"
                        >
                          删除
                        </button>
                        <button
                          onClick={() => setDeleteConfirmId(null)}
                          className="h-9 px-4 rounded-xl border border-black/10 text-slate-600 text-sm font-medium hover:bg-slate-50 transition-colors"
                        >
                          取消
                        </button>
                      </div>
                    ) : (
                      <>
                        <button
                          onClick={() => setResetPasswordId(user.id)}
                          className="inline-flex items-center gap-1.5 h-9 px-4 rounded-xl border border-black/10 text-slate-600 text-sm font-medium hover:bg-slate-50 transition-colors"
                        >
                          <KeyRound className="w-4 h-4" />
                          重置密码
                        </button>
                        {!user.isAdmin && (
                          <button
                            onClick={() => setDeleteConfirmId(user.id)}
                            className="inline-flex items-center gap-1.5 h-9 px-4 rounded-xl border border-red-200 text-red-600 text-sm font-medium hover:bg-red-50 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                            删除
                          </button>
                        )}
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {users.length === 0 && (
            <div className="px-6 py-16 text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-slate-100 mb-4">
                <UserCog className="w-8 h-8 text-slate-400" />
              </div>
              <p className="text-slate-500">暂无用户数据</p>
            </div>
          )}
        </div>

        {error && (
          <div className="mt-4 rounded-xl bg-red-50 border border-red-200 px-4 py-3">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}
      </div>
    </div>
  );
}
