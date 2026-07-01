"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [employeeId, setEmployeeId] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Registration state
  const [showRegister, setShowRegister] = useState(false);
  const [regEmployeeId, setRegEmployeeId] = useState("");
  const [regPassword, setRegPassword] = useState("");
  const [regConfirmPassword, setRegConfirmPassword] = useState("");
  const [regName, setRegName] = useState("");
  const [regDepartment, setRegDepartment] = useState("");
  const [regPhone, setRegPhone] = useState("");
  const [regError, setRegError] = useState("");
  const [regSuccess, setRegSuccess] = useState("");
  const [regLoading, setRegLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const result = await signIn("credentials", {
      employeeId,
      password,
      redirect: false,
    });

    setLoading(false);

    if (result?.error) {
      setError("工号或密码错误");
    } else {
      router.push("/");
      router.refresh();
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setRegError("");
    setRegSuccess("");

    if (regPassword !== regConfirmPassword) {
      setRegError("两次输入的密码不一致");
      return;
    }

    setRegLoading(true);

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          employeeId: regEmployeeId,
          password: regPassword,
          name: regName,
          department: regDepartment,
          phone: regPhone,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setRegError(data.error || "注册失败");
      } else {
        setRegSuccess("注册成功！请登录");
        setRegEmployeeId("");
        setRegPassword("");
        setRegConfirmPassword("");
        setRegName("");
        setRegDepartment("");
        setRegPhone("");
        // Close modal after 2 seconds
        setTimeout(() => {
          setShowRegister(false);
          setRegSuccess("");
        }, 2000);
      }
    } catch {
      setRegError("网络错误，请稍后重试");
    } finally {
      setRegLoading(false);
    }
  };

  const resetRegisterForm = () => {
    setRegEmployeeId("");
    setRegPassword("");
    setRegConfirmPassword("");
    setRegName("");
    setRegDepartment("");
    setRegPhone("");
    setRegError("");
    setRegSuccess("");
    setShowRegister(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-white to-[#0f4c5c]/5 px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-3xl bg-[#0f4c5c] shadow-lg shadow-[#0f4c5c]/20 mb-6">
            <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 8.511c.884.284 1.5 1.128 1.5 2.097v4.286c0 1.136-.847 2.1-1.98 2.193-.34.027-.68.052-1.02.072v3.091l-3-3c-1.355 0-2.697-.056-4.024-.166-1.133-.093-1.98-1.057-1.98-2.189v-4.286c0-.97.616-1.813 1.5-2.097V4.5m0 0L12 12m0 0l-8.25 8.25m8.25 0L12 12m0 0v3.75m0 0c.884.284 1.5 1.128 1.5 2.097v4.286c0 1.136-.847 2.1-1.98 2.193-.34.027-.68.052-1.02.072v3.091l-3-3c-1.355 0-2.697-.056-4.024-.166-1.133-.093-1.98-1.057-1.98-2.189v-4.286c0-.97.616-1.813 1.5-2.097V4.5" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">领航工作站</h1>
          <p className="mt-3 text-slate-500 text-base">一人一策工作台</p>
        </div>

        <div className="bg-white rounded-[32px] shadow-xl shadow-slate-200/50 border border-black/5 overflow-hidden">
          <div className="h-1.5 bg-gradient-to-r from-[#0f4c5c] to-[#d97757]" />

          <div className="px-8 py-10">
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-slate-900">用户登录</h2>
              <p className="mt-1 text-sm text-slate-500">请输入工号和密码登录系统</p>
            </div>

            <form className="space-y-5" onSubmit={handleSubmit}>
              <div>
                <label htmlFor="employeeId" className="block text-sm font-medium text-slate-700 mb-2">
                  工号
                </label>
                <input
                  id="employeeId"
                  name="employeeId"
                  type="text"
                  required
                  value={employeeId}
                  onChange={(e) => setEmployeeId(e.target.value)}
                  placeholder="请输入工号"
                  className="w-full h-12 rounded-2xl border border-black/10 bg-slate-50 px-4 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0f4c5c]/20 focus:border-[#0f4c5c] transition-all"
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-slate-700 mb-2">
                  密码
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="请输入密码"
                  className="w-full h-12 rounded-2xl border border-black/10 bg-slate-50 px-4 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0f4c5c]/20 focus:border-[#0f4c5c] transition-all"
                />
              </div>

              {error && (
                <div className="rounded-2xl bg-red-50 border border-red-200 px-4 py-3">
                  <p className="text-sm text-red-600">{error}</p>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full h-12 rounded-2xl bg-[#0f4c5c] text-white font-medium shadow-lg shadow-[#0f4c5c]/20 hover:bg-[#0d3f4f] hover:shadow-[#0f4c5c]/30 focus:outline-none focus:ring-2 focus:ring-[#0f4c5c]/50 disabled:opacity-50 transition-all mt-2"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    登录中...
                  </span>
                ) : "登 录"}
              </button>
            </form>

            <div className="mt-6 text-center">
              <button
                type="button"
                onClick={() => setShowRegister(true)}
                className="text-sm text-[#0f4c5c] hover:underline font-medium"
              >
                注册新账号
              </button>
            </div>
          </div>
        </div>

        <p className="text-center text-xs text-slate-400 mt-8">
          领航工作站 · 一人一策工作台
        </p>
      </div>

      {/* Registration Modal */}
      {showRegister && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
            <h3 className="text-lg font-semibold text-slate-900">注册新账号</h3>
            <p className="mt-1 text-sm text-slate-500">请输入工号和密码完成注册</p>

            <form className="mt-6 space-y-4" onSubmit={handleRegister}>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  工号 *
                </label>
                <input
                  type="text"
                  required
                  value={regEmployeeId}
                  onChange={(e) => setRegEmployeeId(e.target.value)}
                  placeholder="请输入工号"
                  className="w-full h-12 rounded-2xl border border-black/10 bg-slate-50 px-4 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0f4c5c]/20 focus:border-[#0f4c5c] transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  密码 *
                </label>
                <input
                  type="password"
                  required
                  value={regPassword}
                  onChange={(e) => setRegPassword(e.target.value)}
                  placeholder="请输入密码（至少6位）"
                  minLength={6}
                  className="w-full h-12 rounded-2xl border border-black/10 bg-slate-50 px-4 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0f4c5c]/20 focus:border-[#0f4c5c] transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  确认密码 *
                </label>
                <input
                  type="password"
                  required
                  value={regConfirmPassword}
                  onChange={(e) => setRegConfirmPassword(e.target.value)}
                  placeholder="请再次输入密码"
                  minLength={6}
                  className="w-full h-12 rounded-2xl border border-black/10 bg-slate-50 px-4 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0f4c5c]/20 focus:border-[#0f4c5c] transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  姓名 *
                </label>
                <input
                  type="text"
                  required
                  value={regName}
                  onChange={(e) => setRegName(e.target.value)}
                  placeholder="请输入姓名"
                  className="w-full h-12 rounded-2xl border border-black/10 bg-slate-50 px-4 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0f4c5c]/20 focus:border-[#0f4c5c] transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  院系 *
                </label>
                <input
                  type="text"
                  required
                  value={regDepartment}
                  onChange={(e) => setRegDepartment(e.target.value)}
                  placeholder="请输入所属院系"
                  className="w-full h-12 rounded-2xl border border-black/10 bg-slate-50 px-4 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0f4c5c]/20 focus:border-[#0f4c5c] transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  电话 *
                </label>
                <input
                  type="tel"
                  required
                  value={regPhone}
                  onChange={(e) => setRegPhone(e.target.value)}
                  placeholder="请输入联系电话"
                  className="w-full h-12 rounded-2xl border border-black/10 bg-slate-50 px-4 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0f4c5c]/20 focus:border-[#0f4c5c] transition-all"
                />
              </div>

              {regError && (
                <div className="rounded-2xl bg-red-50 border border-red-200 px-4 py-3">
                  <p className="text-sm text-red-600">{regError}</p>
                </div>
              )}

              {regSuccess && (
                <div className="rounded-2xl bg-green-50 border border-green-200 px-4 py-3">
                  <p className="text-sm text-green-600">{regSuccess}</p>
                </div>
              )}

              <div className="flex gap-3 mt-6">
                <button
                  type="button"
                  onClick={resetRegisterForm}
                  className="flex-1 h-12 rounded-2xl border border-black/10 text-slate-600 font-medium hover:bg-slate-50 transition-all"
                >
                  取消
                </button>
                <button
                  type="submit"
                  disabled={regLoading || !regEmployeeId || !regPassword || !regConfirmPassword || !regName || !regDepartment || !regPhone}
                  className="flex-1 h-12 rounded-2xl bg-[#0f4c5c] text-white font-medium shadow-lg shadow-[#0f4c5c]/20 hover:bg-[#0d3f4f] disabled:opacity-50 transition-all"
                >
                  {regLoading ? "注册中..." : "注册"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
