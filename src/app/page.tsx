import { NavigatorWorkspace } from "@/components/navigator/navigator-workspace";
import { getMemberDrafts } from "@/lib/navigator-data";

export const dynamic = "force-dynamic";

export default async function Home() {
  const profiles = await getMemberDrafts();

  return <NavigatorWorkspace initialProfiles={profiles} />;
}
