import { type ReactNode, useState } from "react";
import { ChevronDown, Trash2 } from "lucide-react";

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
    <div className="rounded-xl border border-white/35 bg-white/82 px-3 py-2 text-slate-900 shadow-sm backdrop-blur-xl">
      <p className="text-[10px] uppercase tracking-[0.15em] text-slate-500">{label}</p>
      <p className="mt-1 font-heading text-xl leading-none text-[#0f4c5c]">{value}</p>
      <p className="mt-0.5 text-[11px] text-slate-600">{hint}</p>
    </div>
  );
}

export function SummaryStat({ label, value, icon }: { label: string; value: string; icon: ReactNode }) {
  return (
    <div className="rounded-[16px] border border-black/6 bg-slate-50 px-3 py-2">
      <div className="flex items-center justify-between gap-2 text-slate-500">
        <span className="text-[10px] uppercase tracking-[0.18em]">{label}</span>
        <span className="text-[#0f4c5c] [&_svg]:size-3.5">{icon}</span>
      </div>
      <p className="mt-1.5 font-heading text-lg text-slate-900">{value}</p>
    </div>
  );
}

export function SectionCard({
  title,
  description,
  icon,
  children,
  action,
  collapsible = false,
  defaultExpanded = true,
}: {
  title: string;
  description: string;
  icon: ReactNode;
  children: ReactNode;
  action?: ReactNode;
  collapsible?: boolean;
  defaultExpanded?: boolean;
}) {
  const [expanded, setExpanded] = useState(defaultExpanded);

  return (
    <Card className="navigator-panel">
      <CardHeader className="gap-3">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <button
            type="button"
            className={cn("flex items-start gap-3 text-left", !collapsible && "cursor-default")}
            onClick={() => collapsible && setExpanded((v) => !v)}
            disabled={!collapsible}
          >
            <div className="flex size-11 items-center justify-center rounded-2xl bg-slate-100">{icon}</div>
            <div>
              <CardTitle className="text-lg text-slate-900">{title}</CardTitle>
              <CardDescription className="mt-1">{description}</CardDescription>
            </div>
            {collapsible && (
              <ChevronDown
                className={cn("size-5 shrink-0 text-slate-400 transition-transform duration-200 mt-0.5", !expanded && "-rotate-90")}
              />
            )}
          </button>
          {action}
        </div>
      </CardHeader>
      {expanded && <CardContent className="space-y-4">{children}</CardContent>}
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
