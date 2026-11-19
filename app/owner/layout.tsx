import { AppShell } from "@/components/app-shell"

export default function OwnerLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <AppShell role="owner">{children}</AppShell>
}
