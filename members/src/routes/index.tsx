import { createFileRoute } from "@tanstack/react-router";
import { MembersHome } from "@/components/loy/MembersHome";

export const Route = createFileRoute("/")({ component: Home });

function Home() {
  return <MembersHome />;
}
