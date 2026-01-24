import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Slider } from "@/components/ui/slider"
import { Card, CardContent } from "@/components/ui/card"
import {
  type CarouselApi,
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/components/ui/input-group"
import { ArtCard } from "@/components/feed/ArtCard"
import { Alert, AlertDescription } from "@/components/ui/alert"
import type { Art, User } from "@/types"
import { cn } from "@/lib/utils"

type HomeFeedProps = {
  arts: Art[]
  artistMap: Map<string, User>
  priceRange: [number, number]
  onPriceRangeChange: (range: [number, number]) => void
}

export function HomeFeed({
  arts,
  artistMap,
  priceRange,
  onPriceRangeChange,
}: HomeFeedProps) {
  const [selectedStyle, setSelectedStyle] = useState("Todos estilos")
  const [activeCategory, setActiveCategory] = useState("categorias")
  const [bannerApi, setBannerApi] = useState<CarouselApi | null>(null)
  const banners = [
    {
      title: "Desconto no Premium",
      description: "Assine hoje e ganhe 20% no plano anual para artistas.",
      action: "Ver ofertas",
      imageUrl:
        "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=1600&auto=format&fit=crop",
    },
    {
      title: "Artistas mais requisitados",
      description: "Descubra quem lidera os pedidos de comissoes esta semana.",
      action: "Explorar lista",
      imageUrl:
        "https://images.unsplash.com/photo-1496318447583-f524534e9ce1?q=80&w=1600&auto=format&fit=crop",
    },
    {
      title: "Ranking de artistas",
      description: "Acompanhe o top 10 com mais seguidores e avaliacoes.",
      action: "Ver ranking",
      imageUrl:
        "https://images.unsplash.com/photo-1501785888041-af3ef285b470?q=80&w=1600&auto=format&fit=crop",
    },
  ]
  const styleOptions = [
    {
      name: "Abstract",
      imageUrl:
        "https://images.unsplash.com/photo-1471879832106-c7ab9e0cee23?q=80&w=400&auto=format&fit=crop",
    },
    {
      name: "Anime & Manga",
      imageUrl:
        "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?q=80&w=400&auto=format&fit=crop",
    },
    {
      name: "Pixel Art",
      imageUrl:
        "https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=400&auto=format&fit=crop",
    },
    {
      name: "Realismo",
      imageUrl:
        "https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=400&auto=format&fit=crop",
    },
    {
      name: "Chibi",
      imageUrl:
        "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=400&auto=format&fit=crop",
    },
    {
      name: "Concept",
      imageUrl:
        "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=400&auto=format&fit=crop",
    },
  ]
  const categoryFilters = [
    { key: "categorias", label: "Categorias", icon: "category" },
    { key: "ilustracao", label: "Ilustracao", icon: "brush", tags: ["#Ilustração"] },
    { key: "anime", label: "Anime", icon: "face", tags: ["#Anime"] },
    { key: "pixel", label: "Pixel Art", icon: "grid_on", tags: ["#PixelArt"] },
    { key: "realismo", label: "Realismo", icon: "visibility", tags: ["#Detail"] },
    { key: "retratos", label: "Retratos", icon: "person", tags: ["#Retrato", "#Portrait"] },
    { key: "fantasia", label: "Fantasia", icon: "auto_stories", tags: ["#Fantasy"] },
    { key: "sci-fi", label: "Sci-Fi", icon: "rocket_launch", tags: ["#SciFi", "#Cyber"] },
    { key: "concept", label: "Concept", icon: "lightbulb", tags: ["#Concept"] },
    { key: "paisagem", label: "Paisagem", icon: "landscape", tags: ["#Landscape", "#Panorama"] },
    { key: "sketch", label: "Sketch", icon: "draw", tags: ["#Sketch"] },
    { key: "chibi", label: "Chibi", icon: "child_friendly", tags: ["#Chibi"] },
    { key: "retrato-empresarial", label: "Retrato Pro", icon: "badge", tags: ["#Portrait"] },
    { key: "mascotes", label: "Mascotes", icon: "pets", tags: ["#Concept"] },
    { key: "cenas", label: "Cenas", icon: "panorama", tags: ["#Panorama"] },
    { key: "emotes", label: "Emotes", icon: "emoji_emotions", tags: ["#Chibi"] },
    { key: "lineart", label: "Lineart", icon: "border_color", tags: ["#Sketch"] },
    { key: "ref-sheet", label: "Ref Sheet", icon: "collections_bookmark", tags: ["#Detail"] },
    { key: "backgrounds", label: "Backgrounds", icon: "filter_hdr", tags: ["#Landscape"] },
    { key: "sticker-pack", label: "Stickers", icon: "local_offer", tags: ["#PixelArt"] },
    { key: "vtuber", label: "VTuber", icon: "face_retouching_natural", tags: ["#Anime"] },
    { key: "props", label: "Props", icon: "extension", tags: ["#Concept"] },
  ]
  const activeFilter = categoryFilters.find(
    (filter) => filter.key === activeCategory
  )
  const filteredArts =
    activeCategory === "categorias" || !activeFilter?.tags
      ? arts
      : arts.filter((art) =>
          art.tags.some((tag) => activeFilter.tags?.includes(tag))
        )

  useEffect(() => {
    if (!bannerApi) return
    const intervalId = window.setInterval(() => {
      bannerApi.scrollNext()
    }, 4000)
    return () => window.clearInterval(intervalId)
  }, [bannerApi])

  return (
    <section className="space-y-6">
      <Carousel
        opts={{ loop: true }}
        setApi={setBannerApi}
        className="group w-full"
      >
        <CarouselContent>
          {banners.map((banner) => (
            <CarouselItem key={banner.title} className="md:basis-full">
              <Card className="overflow-hidden border-border/60 bg-card/95">
                <div className="relative aspect-[16/2] w-full">
                  <img
                    src={banner.imageUrl}
                    alt={banner.title}
                    className="absolute inset-0 h-full w-full scale-110 object-cover"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent" />
                  <CardContent className="relative flex h-full flex-col justify-center gap-4 p-6 md:p-10">
                    <div>
                      <p className="text-xs uppercase tracking-wide text-white/70">
                        Destaque
                      </p>
                      <h2 className="text-2xl font-semibold text-white">
                        {banner.title}
                      </h2>
                      <p className="text-sm text-white/80">
                        {banner.description}
                      </p>
                    </div>
                    <div>
                      <Button variant="secondary">{banner.action}</Button>
                    </div>
                  </CardContent>
                </div>
              </Card>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious
          variant="secondary"
          size="icon"
          className="left-4 top-1/2 -translate-y-1/2 rounded-full opacity-0 transition group-hover:opacity-100"
        />
        <CarouselNext
          variant="secondary"
          size="icon"
          className="right-4 top-1/2 -translate-y-1/2 rounded-full opacity-0 transition group-hover:opacity-100"
        />
      </Carousel>

      <div className="space-y-4">
        <div className="flex items-center gap-6">
          <div className="shrink-0">
            <p className="text-xs uppercase tracking-wide text-muted-foreground">
              Destaques do dia
            </p>
            <h1 className="whitespace-nowrap text-2xl font-semibold">
              Feed de Artes
            </h1>
          </div>
          <div className="w-full max-w-[50vw]">
            <Sheet>
              <InputGroup>
                <InputGroupInput placeholder="Buscar estilos ou artistas" />
                <InputGroupAddon align="inline-end">
                  <SheetTrigger asChild>
                    <InputGroupButton variant="secondary" className="gap-2">
                      <span className="material-symbols-rounded text-[16px] leading-none">
                        tune
                      </span>
                      Filtros
                    </InputGroupButton>
                  </SheetTrigger>
                </InputGroupAddon>
              </InputGroup>
              <SheetContent side="right">
                <SheetHeader>
                  <SheetTitle>Filtros avan??ados</SheetTitle>
                  <SheetDescription>
                    Ajuste o estilo, prazo e faixa de pre??o.
                  </SheetDescription>
                </SheetHeader>
                <div className="mt-6 space-y-4">
                  <div className="space-y-2">
                    <p className="text-sm font-medium">Ordenar por</p>
                    <Select defaultValue="relevancia">
                      <SelectTrigger>
                        <SelectValue placeholder="Ordenar por" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="relevancia">Relev????ncia</SelectItem>
                        <SelectItem value="recentes">Mais recentes</SelectItem>
                        <SelectItem value="preco">Menor pre????o</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm font-medium">Estilo</p>
                    <div className="grid grid-cols-2 gap-3">
                      {styleOptions.map((style) => (
                        <button
                          key={style.name}
                          type="button"
                          className={cn(
                            "group relative aspect-square w-full cursor-pointer overflow-hidden rounded-lg border bg-muted text-white",
                            selectedStyle === style.name &&
                              "ring-2 ring-primary/40"
                          )}
                          onClick={() => setSelectedStyle(style.name)}
                        >
                          <img
                            src={style.imageUrl}
                            alt={style.name}
                            className="absolute inset-0 h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                            loading="lazy"
                          />
                          <div className="absolute inset-0 bg-black/45" />
                          <span className="relative z-10 flex h-full w-full items-center justify-center px-2 text-center text-xs font-semibold uppercase tracking-wide">
                            {style.name}
                          </span>
                        </button>
                      ))}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Selecionado: {selectedStyle}
                    </p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm font-medium">Prazo</p>
                    <Select defaultValue="7dias">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="7dias">At?????????????????? 7 dias</SelectItem>
                        <SelectItem value="15dias">At?????????????????? 15 dias</SelectItem>
                        <SelectItem value="30dias">At?????????????????? 30 dias</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm font-medium">Faixa de pre??????????????????o</p>
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>
                        R${" "}
                        {priceRange[0].toLocaleString("pt-BR", {
                          minimumFractionDigits: 0,
                        })}
                      </span>
                      <span>
                        R${" "}
                        {priceRange[1].toLocaleString("pt-BR", {
                          minimumFractionDigits: 0,
                        })}
                      </span>
                    </div>
                    <Slider
                      value={priceRange}
                      onValueChange={(value) =>
                        onPriceRangeChange([value[0], value[1]])
                      }
                      min={50}
                      max={300}
                      step={10}
                    />
                  </div>
                  <Button className="w-full">Aplicar filtros</Button>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
        <div className="group categories-full-bleed mx-auto w-full max-w-6xl overflow-hidden">
          <Carousel opts={{ align: "start" }} className="w-full">
            <CarouselContent className="categories-carousel-content gap-3">
              {categoryFilters.map((filter) => {
                const isActive = activeCategory === filter.key
                return (
                  <CarouselItem
                    key={filter.key}
                    className="categories-carousel-item basis-auto"
                  >
                    <button
                      type="button"
                      className={cn(
                        "flex shrink-0 cursor-pointer items-center gap-2 rounded-md border px-3 py-2 text-xs font-medium transition",
                        "bg-muted/40 hover:bg-muted",
                        isActive && "border-primary/30 bg-muted text-foreground"
                      )}
                      onClick={() => setActiveCategory(filter.key)}
                    >
                      <span className="flex size-5 items-center justify-center text-foreground">
                        <span className="material-symbols-rounded text-[16px] leading-none">
                          {filter.icon}
                        </span>
                      </span>
                      <span>{filter.label}</span>
                    </button>
                  </CarouselItem>
                )
              })}
            </CarouselContent>
            <CarouselPrevious
              size="icon-sm"
              className="left-0 top-1/2 -translate-y-1/2 opacity-0 transition group-hover:opacity-100 group-hover:pointer-events-auto pointer-events-none disabled:opacity-0"
            />
            <CarouselNext
              size="icon-sm"
              className="right-0 top-1/2 -translate-y-1/2 opacity-0 transition group-hover:opacity-100 group-hover:pointer-events-auto pointer-events-none disabled:opacity-0"
            />
          </Carousel>
        </div>
      </div>
      {filteredArts.length === 0 ? (
        <div className="flex min-h-[40vh] items-center justify-center">
          <Alert className="border-0 bg-transparent p-0 text-center text-muted-foreground">
          <div className="flex flex-col items-center gap-3">
            <span
              className="material-symbols-rounded text-muted-foreground"
              style={{
                fontVariationSettings: "'wght' 200",
                fontSize: "36px",
              }}
            >
              warning
            </span>
            <AlertDescription className="text-lg font-medium">
              Ainda não há publicações para essa categoria.
            </AlertDescription>
          </div>
          </Alert>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
          {filteredArts.map((art) => {
            const artist = artistMap.get(art.artistId)
            if (!artist) return null
            return <ArtCard key={art.id} art={art} artist={artist} />
          })}
        </div>
      )}
    </section>
  )
}

