import { AppShell } from "@/components/app-shell"

export default function PlayerLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <AppShell role="player">{children}</AppShell>
}
