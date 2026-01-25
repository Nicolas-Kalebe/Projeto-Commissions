import { Alert, AlertDescription } from "@/components/ui/alert"
import { ArtCard } from "@/components/feed/ArtCard"
import type { Art, User } from "@/types"

type FeedGridProps = {
    arts: Art[]
    artistMap: Map<string, User>
}

export function FeedGrid({ arts, artistMap }: FeedGridProps) {
    if (arts.length === 0) {
        return (
            <div className="flex min-h-[40vh] items-center justify-center">
                <Alert className="border-0 bg-transparent p-0 text-center text-muted-foreground">
                    <div className="flex flex-col items-center gap-3">
                        <span
                            className="material-symbols-rounded text-muted-foreground"
                            style={{
                                fontVariationSettings: "'wght' 200",
                                fontSize: "36px",
                            }}
                        >
                            warning
                        </span>
                        <AlertDescription className="text-lg font-medium">
                            Ainda não há publicações para essa categoria.
                        </AlertDescription>
                    </div>
                </Alert>
            </div>
        )
    }
    return (
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
            {arts.map((art) => {
                const artist = artistMap.get(art.artistId)
                if (!artist) return null
                return <ArtCard key={art.id} art={art} artist={artist} />
            })}
        </div>
    )
}
