import { useState } from "react"
import { FeedBanner } from "@/components/feed/FeedBanner"
import { FeedCategories } from "@/components/feed/FeedCategories"
import { FeedGrid } from "@/components/feed/FeedGrid"
import type { Art, User } from "@/types"
import { categoryFilters } from "@/data"

type HomeFeedProps = {
  arts: Art[]
  artistMap: Map<string, User>
}

export function HomeFeed({
  arts,
  artistMap,
}: HomeFeedProps) {
  const [activeCategory, setActiveCategory] = useState("categorias")

  const activeFilter = categoryFilters.find(
    (filter) => filter.key === activeCategory
  )
  const filteredArts =
    activeCategory === "categorias" || !activeFilter?.tags
      ? arts
      : arts.filter((art) =>
        art.tags.some((tag) => activeFilter.tags?.includes(tag))
      )

  return (
    <section className="space-y-6">
      <FeedBanner />
      <FeedCategories activeCategory={activeCategory} onCategoryChange={setActiveCategory} />
      <FeedGrid arts={filteredArts} artistMap={artistMap} />
    </section>
  )
}

