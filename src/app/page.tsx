import { auth } from "@/lib/auth";
import { NavigatorWorkspace } from "@/components/navigator/navigator-workspace";
import { getMemberDrafts } from "@/lib/navigator-data";

export const dynamic = "force-dynamic";

export default async function Home() {
  const session = await auth();
  const profiles = await getMemberDrafts();

  const user = session?.user as any;
  const isAdmin = user?.isAdmin ?? false;
  const employeeId = user?.employeeId as string | undefined;

  const filteredProfiles = isAdmin
    ? profiles
    : profiles.filter((p) => p.employeeId === employeeId);

  return (
    <NavigatorWorkspace
      initialProfiles={filteredProfiles}
      isAdmin={isAdmin}
      currentEmployeeId={employeeId}
    />
  );
}
