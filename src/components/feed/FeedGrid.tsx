import { ArtCard } from "@/components/feed/ArtCard"
import type { Art, User } from "@/types"

type FeedGridProps = {
    arts: Art[]
    artistMap: Map<string, User>
    showNsfw: boolean
}

export function FeedGrid({ arts, artistMap, showNsfw }: FeedGridProps) {
    if (arts.length === 0) {
        // ...
    }
    return (
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
            {arts.map((art) => {
                const artist = artistMap.get(art.artistId)
                if (!artist) return null
                return <ArtCard key={art.id} art={art} artist={artist} showNsfw={showNsfw} />
            })}
        </div>
    )
}
