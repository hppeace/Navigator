import Image from "next/image";

import { HeroStat } from "@/components/navigator/workspace/primitives";
import logo from "../../../../logo.jpg";

type HeroBannerProps = {
  globalStats: {
    members: number;
    activities: number;
    conversations: number;
    pendingQuestions: number;
  };
};

export function HeroBanner({ globalStats }: HeroBannerProps) {
  return (
    <section className="relative px-2 py-2 sm:px-3">
      <div className="relative grid items-center gap-5 lg:grid-cols-[minmax(0,1fr)_auto]">
        <div className="flex min-w-0 items-center gap-5">
          <div className="flex h-[104px] w-48 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-[#a6192e]/10 bg-white px-2 shadow-[0_8px_22px_rgba(91,20,31,0.08)]">
            <Image src={logo} alt="四川大学校徽" className="h-auto w-full" priority />
          </div>

          <div className="h-11 w-px shrink-0 bg-[#a6192e]/12" />
          <h1 className="truncate font-heading text-2xl font-semibold tracking-[0.02em] text-[#651222] sm:text-3xl xl:text-[2.15rem]">
            领航工作站 · 一人一策工作台
          </h1>
        </div>

        <div className="grid grid-cols-4 divide-x divide-[#a6192e]/10 overflow-hidden rounded-xl border border-[#a6192e]/10 bg-[#fff6f4]">
          <HeroStat label="成员档案" value={String(globalStats.members)} />
          <HeroStat label="活动记录" value={String(globalStats.activities)} />
          <HeroStat label="谈心谈话" value={String(globalStats.conversations)} />
          <HeroStat label="待办诉求" value={String(globalStats.pendingQuestions)} />
        </div>
      </div>
    </section>
  );
}
