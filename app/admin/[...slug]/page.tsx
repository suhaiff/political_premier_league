import { notFound } from "next/navigation"
import { AppView } from "@/components/app-views"

const allowedSections = ["dashboard", "teams", "candidates", "auction", "sold", "unsold", "users", "matches", "fixtures", "standings", "settings"]

export default async function AdminPage({ params }: { params: Promise<{ slug: string[] }> }) {
  const { slug } = await params
  if (slug.length !== 1 || !allowedSections.includes(slug[0])) notFound()
  return <AppView role="admin" section={slug} />
}
