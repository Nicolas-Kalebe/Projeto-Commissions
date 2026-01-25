import { useState } from "react"
import { FeedBanner } from "@/components/feed/FeedBanner"
import { FeedCategories } from "@/components/feed/FeedCategories"
import { FeedGrid } from "@/components/feed/FeedGrid"
import { FilterSidebar } from "@/components/feed/FilterSidebar"
import type { Art, User } from "@/types"
import { categoryFilters } from "@/data"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Eye, EyeOff, Search, SlidersHorizontal } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

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
  const [searchQuery, setSearchQuery] = useState("")

  const activeFilter = categoryFilters.find(
    (filter) => filter.key === activeCategory
  )

  // Filter by category and search
  let filteredArts =
    activeCategory === "categorias" || !activeFilter?.tags
      ? arts
      : arts.filter((art) =>
        art.tags.some((tag) => activeFilter.tags?.includes(tag))
      )

  // Apply search filter
  if (searchQuery.trim()) {
    filteredArts = filteredArts.filter((art) =>
      art.titulo.toLowerCase().includes(searchQuery.toLowerCase()) ||
      art.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()))
    )
  }

  // Filter Modal State
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const handleApplyFilters = (filters: any) => {
    // Aqui você aplicaria a lógica real de filtragem com os dados
    console.log("Filtros aplicados:", filters)
    setIsFilterOpen(false)
  }

  return (
    <section className="space-y-6">
      <FeedBanner />

      <div className="flex items-center gap-4 flex-wrap">
        <div>
          <p className="text-xs uppercase tracking-wide text-muted-foreground">
            Destaques do dia
          </p>
          <h1 className="whitespace-nowrap text-2xl font-semibold">
            Feed de Artes
          </h1>
        </div>

        <div className="flex items-center gap-2 flex-1">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Buscar artes, artistas, tags..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
          <Button
            variant="outline"
            className="shrink-0"
            onClick={() => setIsFilterOpen(true)}
          >
            <SlidersHorizontal className="size-4 mr-2" />
            Filtros
          </Button>
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

      <FilterSidebar
        isOpen={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
        onApply={handleApplyFilters}
      />
    </section>
  )
}

