import { notFound } from "next/navigation"
import { PublicModule } from "@/components/public-module"

const sections = ["teams", "candidates", "auction", "matches", "standings"]

export default async function PublicSectionPage({ params }: { params: Promise<{ section: string }> }) {
  const { section } = await params
  if (!sections.includes(section)) notFound()
  return <PublicModule section={section} />
}
