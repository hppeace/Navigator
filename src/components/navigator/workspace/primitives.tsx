import type { ReactNode } from "react";
import { Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

export function HeroStat({ label, value, hint }: { label: string; value: string; hint: string }) {
  return (
    <div className="rounded-[24px] border border-white/35 bg-white/82 px-4 py-4 text-slate-900 shadow-[0_16px_34px_rgba(15,23,42,0.08)] backdrop-blur-xl">
      <p className="text-xs uppercase tracking-[0.18em] text-slate-500">{label}</p>
      <p className="mt-3 font-heading text-4xl leading-none text-[#0f4c5c]">{value}</p>
      <p className="mt-2 text-sm text-slate-600">{hint}</p>
    </div>
  );
}

export function SummaryStat({ label, value, icon }: { label: string; value: string; icon: ReactNode }) {
  return (
    <div className="rounded-[20px] border border-black/6 bg-slate-50 px-4 py-3">
      <div className="flex items-center justify-between gap-3 text-slate-500">
        <span className="text-xs uppercase tracking-[0.18em]">{label}</span>
        <span className="text-[#0f4c5c]">{icon}</span>
      </div>
      <p className="mt-3 font-heading text-2xl text-slate-900">{value}</p>
    </div>
  );
}

export function SectionCard({
  title,
  description,
  icon,
  children,
  action,
}: {
  title: string;
  description: string;
  icon: ReactNode;
  children: ReactNode;
  action?: ReactNode;
}) {
  return (
    <Card className="navigator-panel">
      <CardHeader className="gap-3">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div className="flex items-start gap-3">
            <div className="flex size-11 items-center justify-center rounded-2xl bg-slate-100">{icon}</div>
            <div>
              <CardTitle className="text-lg text-slate-900">{title}</CardTitle>
              <CardDescription className="mt-1">{description}</CardDescription>
            </div>
          </div>
          {action}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">{children}</CardContent>
    </Card>
  );
}

export function RecordShell({
  title,
  children,
  onRemove,
}: {
  title: string;
  children: ReactNode;
  onRemove: () => void;
}) {
  return (
    <div className="rounded-[24px] border border-black/6 bg-slate-50/78 p-4">
      <div className="mb-4 flex items-center justify-between gap-3">
        <p className="font-medium text-slate-900">{title}</p>
        <Button type="button" variant="ghost" size="icon-sm" onClick={onRemove}>
          <Trash2 />
        </Button>
      </div>
      <div className="space-y-4">{children}</div>
    </div>
  );
}

export function Field({
  label,
  className,
  children,
}: {
  label: string;
  className?: string;
  children: ReactNode;
}) {
  return (
    <div className={cn("space-y-2", className)}>
      <Label className="text-xs uppercase tracking-[0.18em] text-slate-500">{label}</Label>
      {children}
    </div>
  );
}
