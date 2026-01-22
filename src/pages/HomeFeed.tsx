import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Slider } from "@/components/ui/slider"
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
  const banners = [
    {
      title: "Desconto no Premium",
      description: "Assine hoje e ganhe 20% no plano anual para artistas.",
      action: "Ver ofertas",
    },
    {
      title: "Artistas mais requisitados",
      description: "Descubra quem lidera os pedidos de comissoes esta semana.",
      action: "Explorar lista",
    },
    {
      title: "Ranking de artistas",
      description: "Acompanhe o top 10 com mais seguidores e avaliacoes.",
      action: "Ver ranking",
    },
  ]

  return (
    <section className="space-y-6">
      <Carousel opts={{ loop: true }} className="w-full">
        <CarouselContent>
          {banners.map((banner) => (
            <CarouselItem key={banner.title} className="md:basis-full">
              <Card className="border-border/60 bg-card/95">
                <CardContent className="flex flex-col gap-4 p-6 md:flex-row md:items-center md:justify-between">
                  <div>
                    <p className="text-xs uppercase tracking-wide text-muted-foreground">
                      Destaque
                    </p>
                    <h2 className="text-xl font-semibold">{banner.title}</h2>
                    <p className="text-sm text-muted-foreground">
                      {banner.description}
                    </p>
                  </div>
                  <Button variant="secondary">{banner.action}</Button>
                </CardContent>
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
          <Input placeholder="Buscar estilos ou artistas" />
          <Select defaultValue="relevancia">
            <SelectTrigger className="w-full sm:w-57">
              <SelectValue placeholder="Ordenar por" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="relevancia">Relevância</SelectItem>
              <SelectItem value="recentes">Mais recentes</SelectItem>
              <SelectItem value="preco">Menor preço</SelectItem>
            </SelectContent>
          </Select>
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
                  <p className="text-sm font-medium">Estilo</p>
                  <Select defaultValue="anime">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="anime">Anime</SelectItem>
                      <SelectItem value="realismo">Realismo</SelectItem>
                      <SelectItem value="pixel">Pixel Art</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
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
      <div className="columns-1 gap-4 sm:columns-2 xl:columns-4">
        {arts.map((art) => {
          const artist = artistMap.get(art.artistId)
          if (!artist) return null
          return <ArtCard key={art.id} art={art} artist={artist} />
        })}
      </div>
    </section>
  )
}
