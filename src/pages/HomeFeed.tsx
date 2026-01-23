import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Slider } from "@/components/ui/slider"
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Card, CardContent } from "@/components/ui/card"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import { ArtCard } from "@/components/feed/ArtCard"
import type { Art, User } from "@/types"

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
  const [styleMenuOpen, setStyleMenuOpen] = useState(false)
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

  return (
    <section className="space-y-6">
      <Carousel opts={{ loop: true }} className="w-full">
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
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>

      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-xs uppercase tracking-wide text-muted-foreground">
            Destaques do dia
          </p>
          <h1 className="text-2xl font-semibold">Feed de Artes</h1>
        </div>
        <div className="flex w-full flex-col gap-3 sm:flex-row sm:items-center lg:w-auto">
          <Select defaultValue="relevancia">
            <SelectTrigger className="w-full sm:w-36">
              <SelectValue placeholder="Ordenar por" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="relevancia">Relevância</SelectItem>
              <SelectItem value="recentes">Mais recentes</SelectItem>
              <SelectItem value="preco">Menor preço</SelectItem>
            </SelectContent>
          </Select>
          <DropdownMenu open={styleMenuOpen} onOpenChange={setStyleMenuOpen}>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                className="w-full justify-center px-3 sm:w-36"
              >
                {selectedStyle}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-80 p-3" align="start">
              <div className="grid grid-cols-2 gap-3">
                {styleOptions.map((style) => (
                  <button
                    key={style.name}
                    type="button"
                    className="group relative aspect-square w-full cursor-pointer overflow-hidden rounded-lg border bg-muted text-white"
                    onClick={() => {
                      setSelectedStyle(style.name)
                      setStyleMenuOpen(false)
                    }}
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
            </DropdownMenuContent>
          </DropdownMenu>
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline">Filtros</Button>
            </SheetTrigger>
            <SheetContent side="right">
              <SheetHeader>
                <SheetTitle>Filtros avançados</SheetTitle>
                <SheetDescription>
                  Ajuste o estilo, prazo e faixa de preço.
                </SheetDescription>
              </SheetHeader>
              <div className="mt-6 space-y-4">
                <div className="space-y-2">
                  <p className="text-sm font-medium">Prazo</p>
                  <Select defaultValue="7dias">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="7dias">AtÃƒÆ’Ã‚Â© 7 dias</SelectItem>
                      <SelectItem value="15dias">AtÃƒÆ’Ã‚Â© 15 dias</SelectItem>
                      <SelectItem value="30dias">AtÃƒÆ’Ã‚Â© 30 dias</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <p className="text-sm font-medium">Faixa de preÃƒÆ’Ã‚Â§o</p>
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
                    onValueChange={(value) => onPriceRangeChange([value[0], value[1]])}
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
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
        {arts.map((art) => {
          const artist = artistMap.get(art.artistId)
          if (!artist) return null
          return <ArtCard key={art.id} art={art} artist={artist} />
        })}
      </div>
    </section>
  )
}
