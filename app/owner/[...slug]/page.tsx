import { notFound } from "next/navigation"
import { AppView } from "@/components/app-views"

const allowedSections = ["dashboard", "team", "auction", "squad", "candidates", "transactions", "fixtures", "statistics"]

export default async function OwnerPage({ params }: { params: Promise<{ slug: string[] }> }) {
  const { slug } = await params
  if (slug.length !== 1 || !allowedSections.includes(slug[0])) notFound()
  return <AppView role="owner" section={slug} />
}
