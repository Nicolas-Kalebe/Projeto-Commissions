import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { arts, priceSheets, users } from "@/data"
import { PriceSheetCard } from "@/components/profile/PriceSheetCard"

interface ArtistProfileProps {
  onRequestCommission: (price: number) => void
}

export function ArtistProfile({ onRequestCommission }: ArtistProfileProps) {
  const artist = users.find((user) => user.id === "art-1")
  const portfolio = arts.filter((art) => art.artistId === "art-1")

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
        <div className="h-40 w-full bg-[linear-gradient(120deg,oklch(0.92_0.04_80),oklch(0.86_0.02_20),oklch(0.95_0.02_240))]" />
        <div className="relative -mt-10 flex flex-col gap-4 px-6 pb-6 md:flex-row md:items-end md:justify-between">
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
          <Card className="w-full max-w-xs border-border/60 bg-background/90">
            <CardContent className="space-y-2 p-4">
              <p className="text-xs uppercase text-muted-foreground">
                Seguidores
              </p>
              <p className="text-2xl font-semibold">
                {artist.seguidores.toLocaleString("pt-BR")}
              </p>
              <Button className="w-full">Seguir artista</Button>
            </CardContent>
          </Card>
        </div>
      </div>

      <Tabs defaultValue="portfolio" className="w-full">
        <TabsList>
          <TabsTrigger value="portfolio">Portfólio</TabsTrigger>
          <TabsTrigger value="precos">Tabela de Preços</TabsTrigger>
        </TabsList>

        <TabsContent value="portfolio">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {portfolio.map((art) => (
              <Card key={art.id} className="overflow-hidden">
                <img
                  src={art.imageUrl}
                  alt={art.titulo}
                  className="h-44 w-full object-cover"
                  loading="lazy"
                />
                <CardContent className="space-y-2 p-4">
                  <p className="text-sm font-semibold">{art.titulo}</p>
                  <div className="flex flex-wrap gap-2">
                    {art.tags.map((tag) => (
                      <Badge key={tag} variant="outline">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="precos">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {priceSheets.map((sheet) => (
              <PriceSheetCard
                key={sheet.id}
                sheet={sheet}
                onRequest={onRequestCommission}
              />
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </section>
  )
}
