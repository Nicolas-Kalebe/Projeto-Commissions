import { useEffect, useRef, useState, type RefObject } from "react"
import { FeedBanner } from "@/components/feed/FeedBanner"
import { FeedGrid } from "@/components/feed/FeedGrid"
import { FilterSidebar } from "@/components/feed/FilterSidebar"
import type { Art, User } from "@/types"
import { categoryFilters } from "@/data"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Eye, EyeOff, Search, SlidersHorizontal } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { FeedCategories } from "@/components/feed/FeedCategories"

type HomeFeedProps = {
  arts: Art[]
  artistMap: Map<string, User>
  scrollContainerRef?: RefObject<HTMLDivElement | null>
  onRequestCommission?: (price: number) => void
}

export function HomeFeed({
  arts,
  artistMap,
  scrollContainerRef,
  onRequestCommission,
}: HomeFeedProps) {
  const [activeCategory, setActiveCategory] = useState("categorias")
  const [showNsfw, setShowNsfw] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [isSearchBarVisible, setIsSearchBarVisible] = useState(true)
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const categoriesRef = useRef<HTMLDivElement | null>(null)

  const activeFilter = categoryFilters.find((filter) => filter.key === activeCategory)

  let filteredArts =
    activeCategory === "categorias" || !activeFilter?.tags
      ? arts
      : arts.filter((art) => art.tags.some((tag) => activeFilter.tags?.includes(tag)))

  if (searchQuery.trim()) {
    filteredArts = filteredArts.filter(
      (art) =>
        art.titulo.toLowerCase().includes(searchQuery.toLowerCase()) ||
        art.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()))
    )
  }

  const sponsoredArts = filteredArts.filter((art) => art.patrocinado)
  const regularArts = filteredArts.filter((art) => !art.patrocinado)

  const mostAccessedArts = regularArts.slice(0, 6)
  const fantasyArts = regularArts
    .filter((art) => art.tags.some((t) => ["#Fantasy", "#Nature", "#Magic", "#Landscape"].includes(t)))
    .slice(0, 10)
  const portraitArts = regularArts
    .filter((art) =>
      art.tags.some((t) => ["#Portrait", "#Character", "#Anime", "#Realism", "#Sensual"].includes(t))
    )
    .slice(0, 10)
  const sciFiArts = regularArts
    .filter((art) => art.tags.some((t) => ["#SciFi", "#Cyber", "#Space", "#Abstract", "#Matte"].includes(t)))
    .slice(0, 10)
  const pixelArts = regularArts
    .filter((art) => art.tags.some((t) => ["#PixelArt", "#Retro", "#8bit"].includes(t)))
    .slice(0, 10)

  const handleApplyFilters = (filters: any) => {
    console.log("Filtros aplicados:", filters)
    setIsFilterOpen(false)
  }

  useEffect(() => {
    if (!categoriesRef.current) return

    const observer = new IntersectionObserver(
      ([entry]) => setIsSearchBarVisible(entry.isIntersecting),
      {
        root: scrollContainerRef?.current ?? null,
        threshold: 0.05,
      }
    )

    observer.observe(categoriesRef.current)
    return () => observer.disconnect()
  }, [scrollContainerRef])

  const renderSearchBar = (className?: string) => (
    <div className={className}>
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
      <Button variant="outline" className="shrink-0" onClick={() => setIsFilterOpen(true)}>
        <SlidersHorizontal className="mr-2 size-4" />
        Filtros
      </Button>
    </div>
  )

  const renderNsfwToggle = (id: string) => (
    <div className="flex shrink-0 items-center gap-2 rounded-lg border bg-card p-2 px-3 shadow-sm">
      <Switch id={id} checked={showNsfw} onCheckedChange={setShowNsfw} />
      <Label htmlFor={id} className="flex cursor-pointer items-center gap-2 text-xs font-medium">
        {showNsfw ? <Eye className="size-3.5" /> : <EyeOff className="size-3.5" />}
        {showNsfw ? "NSFW Visível" : "NSFW Oculto"}
      </Label>
    </div>
  )

  return (
    <section className="space-y-8">
      <FeedBanner />

      <div className="flex flex-wrap items-center gap-4">
        <div>
          <p className="text-xs uppercase tracking-wide text-muted-foreground">Destaques do dia</p>
          <h1 className="whitespace-nowrap text-2xl font-semibold">Feed de Artes</h1>
        </div>

        <div className="flex min-w-[280px] flex-1 items-center gap-2">
          {renderSearchBar("flex w-full items-center gap-2")}
        </div>

        {renderNsfwToggle("nsfw-mode")}
      </div>

      <div ref={categoriesRef} className="flex-1">
        <FeedCategories activeCategory={activeCategory} onCategoryChange={setActiveCategory} />
      </div>

      {!isSearchBarVisible && (
        <div className="pointer-events-none fixed inset-x-0 top-14 z-30 px-6">
          <div className="pointer-events-auto mx-auto w-full rounded-lg border bg-background/95 p-2 shadow-sm backdrop-blur">
            <div className="flex flex-wrap items-center gap-2">
              {renderSearchBar("flex min-w-[280px] flex-1 items-center gap-2")}
              {renderNsfwToggle("nsfw-mode-sticky")}
            </div>
          </div>
        </div>
      )}

      {sponsoredArts.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold">Anúncios Impulsionados</h2>
          </div>
          <FeedGrid
            arts={sponsoredArts}
            artistMap={artistMap}
            showNsfw={showNsfw}
            onRequestCommission={onRequestCommission}
          />
        </div>
      )}

      {mostAccessedArts.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center gap-2 border-b pb-2">
            <h2 className="text-xl font-bold">Mais acessados da semana</h2>
          </div>
          <FeedGrid
            arts={mostAccessedArts}
            artistMap={artistMap}
            showNsfw={showNsfw}
            onRequestCommission={onRequestCommission}
          />
        </div>
      )}

      {fantasyArts.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center gap-2 border-b pb-2">
            <h2 className="text-xl font-bold">Mundos Fantásticos</h2>
          </div>
          <FeedGrid
            arts={fantasyArts}
            artistMap={artistMap}
            showNsfw={showNsfw}
            onRequestCommission={onRequestCommission}
          />
        </div>
      )}

      {portraitArts.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center gap-2 border-b pb-2">
            <h2 className="text-xl font-bold">Retratos & Personagens</h2>
          </div>
          <FeedGrid
            arts={portraitArts}
            artistMap={artistMap}
            showNsfw={showNsfw}
            onRequestCommission={onRequestCommission}
          />
        </div>
      )}

      {sciFiArts.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center gap-2 border-b pb-2">
            <h2 className="text-xl font-bold">Universo Sci-Fi & Cyber</h2>
          </div>
          <FeedGrid arts={sciFiArts} artistMap={artistMap} showNsfw={showNsfw} onRequestCommission={onRequestCommission} />
        </div>
      )}

      {pixelArts.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center gap-2 border-b pb-2">
            <h2 className="text-xl font-bold">Pixel Art & Retro</h2>
          </div>
          <FeedGrid arts={pixelArts} artistMap={artistMap} showNsfw={showNsfw} onRequestCommission={onRequestCommission} />
        </div>
      )}

      <FilterSidebar isOpen={isFilterOpen} onClose={() => setIsFilterOpen(false)} onApply={handleApplyFilters} />
    </section>
  )
}
