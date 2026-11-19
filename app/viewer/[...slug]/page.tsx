import { notFound } from "next/navigation"
import { AppView } from "@/components/app-views"

const allowedSections = ["dashboard", "teams", "candidates", "auction", "matches", "standings"]

export default async function ViewerPage({ params }: { params: Promise<{ slug: string[] }> }) {
  const { slug } = await params
  if (slug.length !== 1 || !allowedSections.includes(slug[0])) notFound()
  return <AppView role="viewer" section={slug} />
}
