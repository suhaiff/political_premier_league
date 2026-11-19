import { notFound } from "next/navigation"
import { AppView } from "@/components/app-views"

const allowedSections = ["dashboard", "profile", "team", "statistics", "fixtures"]

export default async function PlayerPage({ params }: { params: Promise<{ slug: string[] }> }) {
  const { slug } = await params
  if (slug.length !== 1 || !allowedSections.includes(slug[0])) notFound()
  return <AppView role="player" section={slug} />
}
