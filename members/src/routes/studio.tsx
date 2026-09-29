import { createFileRoute } from "@tanstack/react-router";
import { RedirectToSignIn } from "@/lib/auth/gates";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { Studio } from "@/components/yasha/Studio";

export const Route = createFileRoute("/studio")({ component: StudioRoute });

function StudioRoute() {
  const { user, isPending } = useCurrentUserState();
  if (isPending) {
    return <main className="grid min-h-dvh place-items-center bg-bg text-sm text-muted">Opening YashaFiness</main>;
  }
  if (!user) return <RedirectToSignIn />;
  return <Studio />;
}
