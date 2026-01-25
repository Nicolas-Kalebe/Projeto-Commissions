import { ArtCard } from "@/components/feed/ArtCard"
import type { Art, User } from "@/types"
import { SearchX } from "lucide-react"

type FeedGridProps = {
    arts: Art[]
    artistMap: Map<string, User>
    showNsfw: boolean
}

export function FeedGrid({ arts, artistMap, showNsfw }: FeedGridProps) {
    if (arts.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[50vh] text-center space-y-4 p-8">
                <div className="bg-muted/50 p-6 rounded-full">
                    <SearchX className="w-12 h-12 text-muted-foreground" />
                </div>
                <div className="space-y-1">
                    <h3 className="text-xl font-semibold tracking-tight">Nenhuma arte encontrada</h3>
                    <p className="text-sm text-muted-foreground max-w-xs mx-auto">
                        Não encontramos artes com os filtros selecionados. Tente limpar os filtros ou buscar por outro termo.
                    </p>
                </div>
            </div>
        )
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
