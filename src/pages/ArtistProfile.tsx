import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { arts, priceSheets, users } from "@/data"
import { PriceSheetCard } from "@/components/profile/PriceSheetCard"
import {
  Bookmark,
  Heart,
  MessageCircle,
  Star,
  Twitch,
  Twitter,
  X,
  Youtube,
} from "lucide-react"

const isDarkColor = (hexColor: string) => {
  const normalized = hexColor.replace("#", "")
  if (normalized.length !== 6) {
    return false
  }

  const r = Number.parseInt(normalized.slice(0, 2), 16)
  const g = Number.parseInt(normalized.slice(2, 4), 16)
  const b = Number.parseInt(normalized.slice(4, 6), 16)
  const luminance = (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255

  return luminance < 0.6
}

interface ArtistProfileProps {
  onRequestCommission: (price: number) => void
  profileTheme: string
  onThemeChange: (color: string) => void
}

export function ArtistProfile({
  onRequestCommission,
  profileTheme,
  onThemeChange,
}: ArtistProfileProps) {
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [lightboxIndex, setLightboxIndex] = useState(0)
  const [portfolioSort, setPortfolioSort] = useState<"recentes" | "populares">(
    "recentes"
  )
  const [showPriceTable, setShowPriceTable] = useState(false)
  const artist = users.find((user) => user.id === "art-1")
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

  const socialLinks = [
    {
      name: "Twitter",
      href: "https://twitter.com/",
      icon: Twitter,
    },
    {
      name: "TikTok",
      href: "https://www.tiktok.com/",
      icon: (props: React.SVGProps<SVGSVGElement>) => (
        <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
          <path d="M15.5 3.5c.6 1.6 1.9 2.8 3.5 3.2v3.1c-1.5 0-2.9-.5-4-1.3v5.2a4.9 4.9 0 1 1-4.9-4.9c.4 0 .8 0 1.2.1v3.2a1.8 1.8 0 1 0 1.5 1.8V3.5h2.7z" />
        </svg>
      ),
    },
    {
      name: "YouTube",
      href: "https://www.youtube.com/",
      icon: Youtube,
    },
    {
      name: "Twitch",
      href: "https://www.twitch.tv/",
      icon: Twitch,
    },
  ]

  const themeOptions = [
    { name: "Rosa", color: "#F8BBD0" },
    { name: "Menta", color: "#B2DFDB" },
    { name: "Lilas", color: "#D1C4E9" },
    { name: "Damasco", color: "#FFCCBC" },
    { name: "Branco", color: "#FFFFFF" },
    { name: "Pessego", color: "#FFD7BA" },
    { name: "Oceano", color: "#B3E5FC" },
    { name: "Lima", color: "#DCEBB3" },
    { name: "Areia", color: "#F3E5AB" },
    { name: "Neve", color: "#E6EEFF" },
    { name: "Aqua", color: "#B2F1E9" },
    { name: "Lavanda", color: "#E5D0FF" },
    { name: "Coral", color: "#FFC4B3" },
    { name: "Nuvem", color: "#EAEAEA" },
    { name: "Manga", color: "#FFD1A8" },
  ]

  const sortedGallery = [...gallery].sort((a, b) => {
    if (portfolioSort === "populares") {
      return b.preco - a.preco
    }

    return 0
  })
  const themeIsDark = isDarkColor(profileTheme)
  const themeTextColor = themeIsDark ? "#f8fafc" : "#1f2937"
  const themeIsWhite = profileTheme.toLowerCase() === "#ffffff"
  const followButtonStyles = themeIsWhite
    ? undefined
    : {
        backgroundColor: profileTheme,
        color: themeTextColor,
        boxShadow: `0 10px 20px -14px ${profileTheme}`,
      }

  return (
    <section
      className="min-h-[calc(100svh-4rem)] w-full space-y-6 px-6 py-8"
      style={{ backgroundColor: profileTheme }}
    >
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px] lg:items-start">
        <section
          className="space-y-4 rounded-xl border p-4 md:p-5"
          style={{
            backgroundColor: `${profileTheme}33`,
            borderColor: `${profileTheme}66`,
          }}
        >
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-1 rounded-full border bg-background/80 p-1 text-lg font-bold">
              <Button
                type="button"
                size="default"
                variant={showPriceTable ? "ghost" : "default"}
                onClick={() => setShowPriceTable(false)}
                className={
                  showPriceTable
                    ? "rounded-full text-muted-foreground"
                    : "rounded-full"
                }
              >
                Portifolio
              </Button>
              <Button
                type="button"
                size="default"
                variant={showPriceTable ? "default" : "ghost"}
                onClick={() => setShowPriceTable(true)}
                className={
                  showPriceTable
                    ? "rounded-full"
                    : "rounded-full text-muted-foreground"
                }
              >
                Servicos
              </Button>
            </div>
            {!showPriceTable && (
              <Select
                value={portfolioSort}
                onValueChange={(value) =>
                  setPortfolioSort(value as "recentes" | "populares")
                }
              >
                <SelectTrigger className="w-36">
                  <SelectValue placeholder="Ordenar por" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="recentes">Mais recentes</SelectItem>
                  <SelectItem value="populares">Mais populares</SelectItem>
                </SelectContent>
              </Select>
            )}
          </div>
          {showPriceTable ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {priceSheets.map((sheet) => (
                <PriceSheetCard
                  key={sheet.id}
                  sheet={sheet}
                  onRequest={onRequestCommission}
                />
              ))}
            </div>
          ) : (
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {sortedGallery.map((art, index) => (
                <button
                  key={art.id}
                  type="button"
                  className="group relative overflow-hidden rounded-xl border bg-card"
                  style={{ borderColor: `${profileTheme}55` }}
                  onClick={() => {
                    setLightboxIndex(index)
                    setLightboxOpen(true)
                  }}
                >
                  <div className="absolute bottom-3 right-3 z-10 flex gap-2 opacity-0 transition-opacity group-hover:opacity-100">
                    <Button
                      type="button"
                      variant="secondary"
                      size="icon-sm"
                      aria-label="Curtir"
                      onClick={(event) => event.stopPropagation()}
                    >
                      <Heart className="h-4 w-4" />
                    </Button>
                    <Button
                      type="button"
                      variant="secondary"
                      size="icon-sm"
                      aria-label="Salvar"
                      onClick={(event) => event.stopPropagation()}
                    >
                      <Bookmark className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="aspect-[4/3] w-full overflow-hidden">
                    <div className="relative h-full w-full">
                      <img
                        src={art.imageUrl}
                        alt={art.titulo}
                        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.04]"
                        loading="lazy"
                      />
                      <div className="pointer-events-none absolute inset-0 flex items-end bg-gradient-to-t from-black/60 via-black/0 to-transparent opacity-0 transition-opacity group-hover:opacity-100">
                        <span className="p-3 text-sm font-semibold text-white">
                          {art.titulo}
                        </span>
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </section>
        <aside
          className="space-y-4 rounded-xl border bg-card p-5"
          style={{
            borderColor: profileTheme,
            boxShadow: `0 16px 40px -28px ${profileTheme}`,
          }}
        >
          <div className="flex items-start gap-4">
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
                <Badge
                  variant="secondary"
                  style={{ backgroundColor: `${profileTheme}55` }}
                >
                  Ilustradora
                </Badge>
                <Badge
                  variant="outline"
                  style={{ borderColor: `${profileTheme}88` }}
                >
                  Entrega em 7 dias
                </Badge>
                <Badge
                  variant="outline"
                  style={{ borderColor: `${profileTheme}88` }}
                >
                  Ativo hoje
                </Badge>
              </div>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            {socialLinks.map((link) => (
              <Button
                key={link.name}
                asChild
                variant="outline"
                size="icon-sm"
                aria-label={link.name}
              >
                <a href={link.href} target="_blank" rel="noreferrer">
                  <link.icon className="h-4 w-4" />
                </a>
              </Button>
            ))}
          </div>
          <div className="grid gap-3 sm:grid-cols-3">
            <Card
              className="border-border/60 h-20 bg-background/90 p-0"
              style={{ borderColor: `${profileTheme}55` }}
            >
              <CardContent className="flex h-full w-full flex-col items-center justify-center p-0 text-center">
                <p className="text-xs uppercase text-muted-foreground">
                  Seguidores
                </p>
                <p className="text-lg font-semibold">
                  {artist.seguidores.toLocaleString("pt-BR")}
                </p>
              </CardContent>
            </Card>
            <Card
              className="border-border/60 h-20 bg-background/90 p-0"
              style={{ borderColor: `${profileTheme}55` }}
            >
              <CardContent className="flex h-full w-full flex-col items-center justify-center p-0 text-center">
                <p className="text-xs uppercase text-muted-foreground">
                  Seguindo
                </p>
                <p className="text-lg font-semibold">
                  {following.toLocaleString("pt-BR")}
                </p>
              </CardContent>
            </Card>
            <Card
              className="border-border/60 h-20 bg-background/90 p-0"
              style={{ borderColor: `${profileTheme}55` }}
            >
              <CardContent className="flex h-full w-full flex-col items-center justify-center p-0 text-center">
                <p className="text-xs uppercase text-muted-foreground">
                  Avaliacao
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
          <div className="flex gap-2">
            <Button className="flex-1 px-4" style={followButtonStyles}>
              Seguir artista
            </Button>
            <Button variant="outline" size="icon" aria-label="Enviar DM">
              <MessageCircle className="h-4 w-4" />
            </Button>
          </div>
        </aside>
      </div>

      <Dialog open={lightboxOpen} onOpenChange={setLightboxOpen}>
      <DialogContent
        className="fixed left-1/2 top-1/2 flex w-[96vw] max-w-none -translate-x-1/2 -translate-y-1/2 justify-center border-0 bg-transparent p-0 shadow-none [&>button]:hidden"
        onPointerDownOutside={() => setLightboxOpen(false)}
        onClick={() => setLightboxOpen(false)}
      >
    {/* Contador */}
    <div className="absolute left-1/2 top-4 z-50 -translate-x-1/2 text-xs text-white/80">
      {lightboxIndex + 1} / {gallery.length}
    </div>

    {/* Botão fechar */}
    <Button
      variant="secondary"
      size="icon"
      className="absolute right-4 top-4 z-50"
      onClick={() => setLightboxOpen(false)}
    >
      <X className="h-4 w-4" />
      <span className="sr-only">Fechar</span>
    </Button>

    {/* Área da imagem */}
    <div
      className="relative flex items-center justify-center"
      style={{
        width: "min(2000px, 96vw)",
        height: "min(800px, 90vh)",
      }}
    >
      {/* Anterior */}
      <Button
        variant="secondary"
        size="icon"
        className="absolute left-0 top-1/2 z-50 -translate-y-1/2 translate-x-3"
        onClick={(event) => {
          event.stopPropagation()
          setLightboxIndex((prev) =>
            prev === 0 ? gallery.length - 1 : prev - 1
          )
        }}
      >
        <span className="sr-only">Anterior</span>
        <svg
          viewBox="0 0 24 24"
          className="h-4 w-4"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="M15 18l-6-6 6-6" />
        </svg>
      </Button>

      {/* Imagem */}
      <img
        src={gallery[lightboxIndex]?.imageUrl}
        alt={gallery[lightboxIndex]?.titulo}
        className="block"
        style={{
          maxHeight: "min(800px, 90vh)",
          maxWidth: "min(2000px, 96vw)",
          height: "auto",
          width: "auto",
        }}
        onClick={(event) => event.stopPropagation()}
      />

      {/* Próximo */}
      <Button
        variant="secondary"
        size="icon"
        className="absolute right-0 top-1/2 z-50 -translate-y-1/2 -translate-x-3"
        onClick={(event) => {
          event.stopPropagation()
          setLightboxIndex((prev) =>
            prev === gallery.length - 1 ? 0 : prev + 1
          )
        }}
      >
        <span className="sr-only">Próximo</span>
        <svg
          viewBox="0 0 24 24"
          className="h-4 w-4"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="M9 18l6-6-6-6" />
        </svg>
      </Button>
    </div>
  </DialogContent>
</Dialog>

    </section>
  )
}
