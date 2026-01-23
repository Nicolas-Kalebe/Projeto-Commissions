import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { cn } from "@/lib/utils"
import type { Art, User } from "@/types"

interface ArtCardProps {
  art: Art
  artist: User
}

export function ArtCard({ art, artist }: ArtCardProps) {
  const [revealed, setRevealed] = useState(false)
  const initials = artist.nome
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)

  return (
    <Card className="overflow-hidden border-border/60 bg-card/95 shadow-sm">
      <div className="relative aspect-square w-full overflow-hidden">
        <img
          src={art.imageUrl}
          alt={art.titulo}
          className={cn(
            "h-full w-full object-cover transition",
            art.nsfw && !revealed && "blur-md"
          )}
          loading="lazy"
        />
        {art.nsfw && (
          <div className="absolute left-3 top-3 flex items-center gap-2">
            <Badge variant="secondary">Conteúdo Sensível</Badge>
          </div>
        )}
        {art.nsfw && (
          <Button
            variant="secondary"
            size="sm"
            className="absolute bottom-3 right-3"
            onClick={() => setRevealed((prev) => !prev)}
          >
            {revealed ? "Ocultar" : "Mostrar"}
          </Button>
        )}
      </div>
      <CardContent className="flex flex-col gap-4 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Avatar>
              <AvatarImage src={artist.avatarUrl} alt={artist.nome} />
              <AvatarFallback>{initials}</AvatarFallback>
            </Avatar>
            <div>
              <p className="text-sm font-semibold">{artist.nome}</p>
              <p className="text-xs text-muted-foreground">{art.titulo}</p>
            </div>
          </div>
          <p className="text-sm font-semibold">
            {art.preco.toLocaleString("pt-BR", {
              style: "currency",
              currency: "BRL",
            })}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          {art.tags.map((tag) => (
            <Badge key={tag} variant="outline">
              {tag}
            </Badge>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
