import { useState } from "react"
import { FeedBanner } from "@/components/feed/FeedBanner"
import { FeedCategories } from "@/components/feed/FeedCategories"
import { FeedGrid } from "@/components/feed/FeedGrid"
import type { Art, User } from "@/types"
import { categoryFilters } from "@/data"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Eye, EyeOff } from "lucide-react"

type HomeFeedProps = {
  arts: Art[]
  artistMap: Map<string, User>
}

export function HomeFeed({
  arts,
  artistMap,
}: HomeFeedProps) {
  const [activeCategory, setActiveCategory] = useState("categorias")
  const [showNsfw, setShowNsfw] = useState(false)

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

      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-wide text-muted-foreground">
            Destaques do dia
          </p>
          <h1 className="whitespace-nowrap text-2xl font-semibold">
            Feed de Artes
          </h1>
        </div>

        <div className="flex shrink-0 items-center gap-2 rounded-lg border bg-card p-2 px-3 shadow-sm">
          <Switch
            id="nsfw-mode"
            checked={showNsfw}
            onCheckedChange={setShowNsfw}
          />
          <Label htmlFor="nsfw-mode" className="flex items-center gap-2 text-xs font-medium cursor-pointer">
            {showNsfw ? <Eye className="size-3.5" /> : <EyeOff className="size-3.5" />}
            {showNsfw ? "NSFW Visível" : "NSFW Oculto"}
          </Label>
        </div>
      </div>

      <div className="flex-1 overflow-hidden">
        <FeedCategories activeCategory={activeCategory} onCategoryChange={setActiveCategory} />
      </div>

      <FeedGrid arts={filteredArts} artistMap={artistMap} showNsfw={showNsfw} />
    </section>
  )
}

