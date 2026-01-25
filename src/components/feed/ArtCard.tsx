import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { useNavigate } from "react-router-dom"
import type { Art, User } from "@/types"

interface ArtCardProps {
  art: Art
  artist: User
  showNsfw: boolean
}

export function ArtCard({ art, artist, showNsfw }: ArtCardProps) {
  const navigate = useNavigate()

  const handleCardClick = () => {
    // Generate SEO friendly slug: artwork-id + title slug
    const slug = art.titulo
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "") // remove accents
      .replace(/[^a-z0-9]+/g, "-") // replace non-alphanumeric with dash
      .replace(/^-+|-+$/g, "") // remove leading/trailing dashes

    navigate(`/art/${art.id}-${slug}`)
  }

  const isBlurred = art.nsfw && !showNsfw
  const isSponsored = art.patrocinado

  return (
    <Card
      className={`group overflow-hidden border bg-card/50 transition hover:shadow-md cursor-pointer ${isSponsored
          ? "border-yellow-500/50 hover:border-yellow-500 shadow-yellow-500/10"
          : "border-border/60 hover:border-primary/50"
        }`}
      onClick={handleCardClick}
    >
      <div className="relative aspect-square w-full overflow-hidden">
        <div className="block h-full w-full">
          <img
            src={art.imageUrl}
            alt={art.titulo}
            className={`h-full w-full object-cover transition-all duration-500 group-hover:scale-105 ${isBlurred ? "blur-xl scale-110" : ""}`}
            loading="lazy"
          />
        </div>

        <div className="absolute right-2 top-2 flex flex-col gap-1 z-10">
          {isSponsored && (
            <div className="rounded bg-yellow-500 px-1.5 py-0.5 text-[10px] font-bold text-black backdrop-blur-sm shadow-sm flex items-center gap-1">
              <span>♛</span> Patrocinado
            </div>
          )}

          {art.nsfw && (
            <div className="self-end rounded bg-black/70 px-1.5 py-0.5 text-[10px] font-bold text-white backdrop-blur-sm">
              NSFW
            </div>
          )}
        </div>

      </div>
      <CardContent className="p-3">
        <div className="flex items-start justify-between gap-2">
          <div>
            <div className="hover:underline">
              <h3 className="line-clamp-1 text-sm font-medium">{art.titulo}</h3>
            </div>
            <div className="mt-1 flex flex-wrap gap-1">
              {art.tags.map((tag) => (
                <Badge key={tag} variant="outline" className="text-[10px] px-1.5 py-0 h-5">
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
          <div className="text-right">
            <p className={`text-sm font-semibold ${isSponsored ? "text-yellow-600 dark:text-yellow-400" : ""}`}>
              {art.preco.toLocaleString("pt-BR", {
                style: "currency",
                currency: "BRL",
              })}
            </p>
            <p className="text-[10px] text-muted-foreground truncate max-w-[80px]">
              {artist.nome}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
