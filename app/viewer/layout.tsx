import { AppShell } from "@/components/app-shell"

export default function ViewerLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <AppShell role="viewer">{children}</AppShell>
}
