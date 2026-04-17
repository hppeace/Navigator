import { UserPlus } from "lucide-react";

import { Field } from "@/components/navigator/workspace/primitives";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

type NewMemberDialogProps = {
  open: boolean;
  name: string;
  department: string;
  error: string;
  isPending: boolean;
  onOpenChange: (open: boolean) => void;
  onNameChange: (value: string) => void;
  onDepartmentChange: (value: string) => void;
  onSubmit: () => void;
};

export function NewMemberDialog({
  open,
  name,
  department,
  error,
  isPending,
  onOpenChange,
  onNameChange,
  onDepartmentChange,
  onSubmit,
}: NewMemberDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg overflow-hidden rounded-[30px] border border-black/5 bg-white/96 p-0 shadow-[0_24px_60px_rgba(15,23,42,0.18)]">
        <DialogHeader className="gap-3 border-b border-black/5 bg-[linear-gradient(180deg,rgba(15,76,92,0.08),rgba(255,255,255,0.82))] px-6 py-5 pr-14">
          <div className="flex size-11 items-center justify-center rounded-2xl bg-[#0f4c5c] text-white shadow-[0_12px_24px_rgba(15,76,92,0.18)]">
            <UserPlus className="size-5" />
          </div>
          <div className="space-y-1">
            <DialogTitle className="text-xl text-slate-900">新建成员档案</DialogTitle>
            <DialogDescription>
              先录入成员姓名与所属院系，创建后可继续补充成长轨迹、思想动态和问题建议。
            </DialogDescription>
          </div>
        </DialogHeader>

        <div className="space-y-5 px-6 py-5">
          <Field label="成员姓名">
            <Input
              value={name}
              onChange={(event) => onNameChange(event.target.value)}
              placeholder="请输入成员姓名"
              className="h-11 rounded-2xl border-black/10 bg-white"
            />
          </Field>
          <Field label="所在院系">
            <Input
              value={department}
              onChange={(event) => onDepartmentChange(event.target.value)}
              placeholder="如：材料学院、信息工程学院"
              className="h-11 rounded-2xl border-black/10 bg-white"
            />
          </Field>

          {error ? (
            <p className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-600">
              {error}
            </p>
          ) : null}
        </div>

        <DialogFooter className="mx-0 mb-0 flex-col gap-3 rounded-none border-t border-black/5 bg-slate-50/85 px-6 py-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-slate-500">将自动进入该成员档案页</p>
          <div className="flex flex-col-reverse gap-2 sm:flex-row">
            <Button
              type="button"
              variant="outline"
              className="rounded-xl border-black/10 bg-white"
              onClick={() => onOpenChange(false)}
            >
            取消
            </Button>
            <Button
              type="button"
              className="rounded-xl bg-[#0f4c5c] text-white hover:bg-[#0b3f4e]"
              disabled={isPending}
              onClick={onSubmit}
            >
              <UserPlus />
              {isPending ? "创建中..." : "创建档案"}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
