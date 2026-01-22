import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
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
}

export function HomeFeed({ arts, artistMap }: HomeFeedProps) {
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
    <section className="space-y-4">
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

      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-wide text-muted-foreground">
            Destaques do dia
          </p>
          <h1 className="text-2xl font-semibold">Feed de Artes</h1>
        </div>
        <Badge variant="secondary">Curadoria Segura</Badge>
      </div>
      <div className="columns-1 gap-4 sm:columns-2 xl:columns-3">
        {arts.map((art) => {
          const artist = artistMap.get(art.artistId)
          if (!artist) return null
          return <ArtCard key={art.id} art={art} artist={artist} />
        })}
      </div>
    </section>
  )
}
