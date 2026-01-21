import { useState } from "react"
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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { arts, priceSheets, users } from "@/data"
import { PriceSheetCard } from "@/components/profile/PriceSheetCard"
import { Star } from "lucide-react"

interface ArtistProfileProps {
  onRequestCommission: (price: number) => void
}

export function ArtistProfile({ onRequestCommission }: ArtistProfileProps) {
  const [showGallery, setShowGallery] = useState(false)
  const artist = users.find((user) => user.id === "art-1")
  const portfolioIds = new Set(["artwork-1", "artwork-2", "artwork-7", "artwork-8"])
  const portfolio = arts.filter(
    (art) => art.artistId === "art-1" && portfolioIds.has(art.id)
  )
  const gallery = arts.filter((art) => art.artistId === "art-1")
  const following = 312
  const rating = 4.8

  if (!artist) {
    return null
  }

  const initials = artist.nome
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)

  return (
    <section className="space-y-6">
      <div className="relative overflow-hidden rounded-xl border bg-card">
        <div
          className="h-48 w-[calc(100%+3rem)] -mx-6 bg-cover bg-center md:h-56"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1470770841072-f978cf4d019e?auto=format&fit=crop&w=1600&q=80')",
          }}
        />
        <div className="relative mt-5 flex flex-col gap-4 px-6 pb-6 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-4">
            <Avatar className="size-20 border-4 border-background shadow-sm">
              <AvatarImage src={artist.avatarUrl} alt={artist.nome} />
              <AvatarFallback>{initials}</AvatarFallback>
            </Avatar>
            <div className="space-y-2">
              <div>
                <h2 className="text-2xl font-semibold">{artist.nome}</h2>
                <p className="text-sm text-muted-foreground">{artist.bio}</p>
              </div>
              <div className="flex flex-wrap gap-2">
                <Badge variant="secondary">Ilustradora</Badge>
                <Badge variant="outline">Entrega em 7 dias</Badge>
                <Badge variant="outline">Ativo hoje</Badge>
              </div>
            </div>
          </div>
          <div className="w-full max-w-sm space-y-3">
            <div className="grid gap-3 sm:grid-cols-3">
              <Card className="border-border/60 p-0 bg-background/90 h-20">
                  <CardContent className="flex h-full w-full flex-col items-center justify-center p-0 text-center">
                  <p className="text-xs uppercase text-muted-foreground">
                    Seguidores
                  </p>
                  <p className="text-lg font-semibold">
                    {artist.seguidores.toLocaleString("pt-BR")}
                  </p>
                </CardContent>
              </Card>
              <Card className="border-border/60 p-0 bg-background/90 h-20">
                  <CardContent className="flex h-full w-full flex-col items-center justify-center p-0 text-center">
                  <p className="text-xs uppercase text-muted-foreground">
                    Seguindo
                  </p>
                  <p className="text-lg font-semibold">
                    {following.toLocaleString("pt-BR")}
                  </p>
                </CardContent>
              </Card>
              <Card className="border-border/60 p-0 bg-background/90 h-20">
                  <CardContent className="flex h-full w-full flex-col items-center justify-center p-0 text-center">
                  <p className="text-xs uppercase text-muted-foreground">
                    Avaliação
                  </p>
                  <div className="flex items-center justify-center gap-2">
                    <div className="flex items-center gap-0.5">
                      {Array.from({ length: 5 }).map((_, index) => (
                        <Star
                          key={index}
                          className={`h-3.5 w-3.5 ${
                            index < Math.round(rating)
                              ? "fill-foreground text-foreground"
                              : "text-muted-foreground"
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-sm font-semibold">
                      {rating.toFixed(1)}
                    </span>
                  </div>
                </CardContent>
              </Card>
            </div>
            <Button className="w-full">Seguir artista</Button>
          </div>
        </div>
      </div>

      <section className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-0">
          <h3 className="text-lg font-semibold">Portfólio</h3>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              className={!showGallery ? "opacity-60" : undefined}
              aria-pressed={!showGallery}
              onClick={() => setShowGallery(false)}
            >
              Vitrine
            </Button>
            <Button
              variant="outline"
              size="sm"
              className={showGallery ? "opacity-60" : undefined}
              aria-pressed={showGallery}
              onClick={() => setShowGallery(true)}
            >
              Galeria
            </Button>
          </div>
        </div>
        {showGallery ? (
          <div className="columns-1 gap-1 py-1 sm:columns-2 lg:columns-3 mt-4.5">
            {gallery.map((art) => (
              <div key={art.id} className="mb-1 overflow-hidden">
                <img
                  src={art.imageUrl}
                  alt={art.titulo}
                  className="h-auto w-full"
                  loading="lazy"
                />
              </div>
            ))}
          </div>
        ) : (
          <Carousel opts={{ loop: true }} className="relative">
            <CarouselContent className="-ml-2">
              {portfolio.map((art) => (
                <CarouselItem
                  key={art.id}
                  className="basis-full pl-2 sm:basis-full lg:basis-1/2"
                >
                  <Card className="overflow-hidden border-0 shadow-none">
                    <img
                      src={art.imageUrl}
                      alt={art.titulo}
                      className="w-full object-cover"
                      style={{ aspectRatio: "16 / 9" }}
                      loading="lazy"
                    />
                  </Card>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="-left-4" />
            <CarouselNext className="-right-4" />
          </Carousel>
        )}
      </section>

      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Tabela de Preços</h3>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {priceSheets.map((sheet) => (
            <PriceSheetCard
              key={sheet.id}
              sheet={sheet}
              onRequest={onRequestCommission}
            />
          ))}
        </div>
      </section>
    </section>
  )
}
