import { Badge } from "@/components/ui/badge"
import { ArtCard } from "@/components/feed/ArtCard"
import type { Art, User } from "@/types"

type HomeFeedProps = {
  arts: Art[]
  artistMap: Map<string, User>
}

export function HomeFeed({ arts, artistMap }: HomeFeedProps) {
  return (
    <section className="space-y-4">
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
