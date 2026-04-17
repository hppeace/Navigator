import { Badge } from "@/components/ui/badge";
import type { MemberDraft } from "@/lib/navigator-shared";

import { HeroStat } from "@/components/navigator/workspace/primitives";

type HeroBannerProps = {
  draft: MemberDraft;
  draftQuestionCount: number;
  globalStats: {
    members: number;
    activities: number;
    conversations: number;
    pendingQuestions: number;
  };
};

export function HeroBanner({ draft, draftQuestionCount, globalStats }: HeroBannerProps) {
  return (
    <section className="navigator-hero relative overflow-hidden rounded-[36px] px-6 py-8 sm:px-8 lg:px-10">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.32),transparent_28%),radial-gradient(circle_at_bottom_right,rgba(217,119,87,0.24),transparent_22%)]" />
      <div className="relative grid gap-8 xl:grid-cols-[1.1fr_0.9fr] xl:items-end">
        <div className="navigator-hero-content max-w-3xl">
          <Badge className="mb-4 bg-white/12 text-white backdrop-blur-sm">领航工作站 · 一人一策工作台</Badge>
          <h1 className="max-w-2xl font-heading text-4xl leading-tight text-white sm:text-5xl">
            聚合成员画像、成长轨迹与思想动态，形成长期可维护的数字档案。
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-7 text-white/88 sm:text-lg">
            围绕成员培养、联系帮扶与问题收集，统一沉淀每位成员的关键信息、阶段进展和后续跟进记录。
          </p>
          <div className="mt-5 flex flex-wrap gap-2 text-xs">
            <span className="rounded-full border border-white/15 bg-white/10 px-3 py-1 text-white/86 backdrop-blur-sm">
              当前焦点：{draft.name || "待新建成员"}
            </span>
            <span className="rounded-full border border-white/15 bg-white/10 px-3 py-1 text-white/86 backdrop-blur-sm">
              思想培养阶段：{draft.developmentStage || "未设置"}
            </span>
            <span className="rounded-full border border-white/15 bg-white/10 px-3 py-1 text-white/86 backdrop-blur-sm">
              待跟进问题：{draftQuestionCount}
            </span>
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <HeroStat label="成员档案" value={String(globalStats.members)} hint="已录入成员数" />
          <HeroStat label="活动记录" value={String(globalStats.activities)} hint="成长轨迹总条目" />
          <HeroStat label="谈心谈话" value={String(globalStats.conversations)} hint="思想动态记录" />
          <HeroStat label="待办问题" value={String(globalStats.pendingQuestions)} hint="需要组织跟进" />
        </div>
      </div>
    </section>
  );
}
