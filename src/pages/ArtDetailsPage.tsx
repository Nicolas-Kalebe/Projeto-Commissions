import { useNavigate, useParams } from "react-router-dom"
import { arts, users } from "@/data"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { ArrowLeft, Bookmark, Share2, AlertTriangle } from "lucide-react"
import { useMemo } from "react"

export function ArtDetailsPage() {
    const { id: slugId } = useParams()
    const navigate = useNavigate()

    // Extract the real ID (artwork-X) from the slug (artwork-X-title-slug)
    const realId = useMemo(() => {
        // IDs are always in the format "artwork-" followed by numbers
        const match = slugId?.match(/^(artwork-\d+)/)
        return match ? match[1] : slugId
    }, [slugId])

    const art = useMemo(() => arts.find((a) => a.id === realId), [realId])
    const artist = useMemo(
        () => (art ? users.find((u) => u.id === art.artistId) : null),
        [art]
    )

    if (!art) {
        return (
            <div className="flex flex-col items-center justify-center py-20">
                <h1 className="text-2xl font-bold">Arte não encontrada</h1>
                <Button variant="link" onClick={() => navigate("/inicio")}>
                    Voltar para o início
                </Button>
            </div>
        )
    }

    return (
        <div className="container mx-auto max-w-6xl px-4 py-6 md:py-10">
            <Button
                variant="ghost"
                className="mb-6 gap-2 pl-0 hover:bg-transparent hover:text-primary"
                onClick={() => navigate(-1)}
            >
                <ArrowLeft className="size-4" />
                Voltar
            </Button>

            <div className="grid gap-8 md:grid-cols-[1.5fr_1fr] lg:gap-12">
                {/* Left Column: Image */}
                <div className="space-y-4">
                    <div className="overflow-hidden rounded-xl border bg-muted/20 shadow-sm">
                        <div className="relative aspect-[4/3] w-full">
                            <img
                                src={art.imageUrl}
                                alt={art.titulo}
                                className="absolute inset-0 h-full w-full object-contain"
                            />
                        </div>
                    </div>
                    <div className="flex items-center justify-between">
                        <div className="flex gap-2">
                            <Button variant="outline" size="sm" className="gap-2">
                                <Bookmark className="size-4" />
                                Salvar
                            </Button>
                            <Button variant="outline" size="sm" className="gap-2">
                                <Share2 className="size-4" />
                                Compartilhar
                            </Button>
                        </div>
                        {art.nsfw && (
                            <Badge variant="destructive" className="gap-1">
                                <AlertTriangle className="size-3" />
                                NSFW
                            </Badge>
                        )}
                    </div>
                </div>

                {/* Right Column: Details */}
                <div className="flex flex-col gap-6">
                    <div>
                        <h1 className="text-3xl font-bold md:text-4xl">{art.titulo}</h1>
                        <div className="mt-2 flex flex-wrap gap-2">
                            {art.tags.map((tag) => (
                                <Badge key={tag} variant="secondary" className="text-xs">
                                    {tag}
                                </Badge>
                            ))}
                        </div>
                    </div>

                    <Separator />

                    {artist && (
                        <div className="flex items-center gap-4">
                            <Avatar className="size-12 border">
                                <AvatarImage src={artist.avatarUrl} alt={artist.nome} />
                                <AvatarFallback>{artist.nome[0]}</AvatarFallback>
                            </Avatar>
                            <div className="flex-1">
                                <p className="text-sm font-medium leading-none text-muted-foreground">
                                    Criado por
                                </p>
                                <div className="flex items-center gap-2">
                                    <p className="text-lg font-semibold">{artist.nome}</p>
                                    {artist.role === "artista" && (
                                        <Badge variant="outline" className="text-[10px] h-5 px-1.5">
                                            PRO
                                        </Badge>
                                    )}
                                </div>
                            </div>
                            <Button variant="outline">Ver perfil</Button>
                        </div>
                    )}

                    <div className="rounded-xl border bg-card p-6 shadow-sm">
                        <div className="mb-4">
                            <p className="text-sm font-medium text-muted-foreground">Preço base</p>
                            <p className="text-3xl font-bold text-primary">R$ {art.preco}</p>
                        </div>
                        <div className="space-y-3">
                            <Button className="w-full" size="lg">
                                Encomendar Arte Similar
                            </Button>
                            <Button variant="secondary" className="w-full">
                                Enviar Mensagem
                            </Button>
                        </div>
                        <p className="mt-4 text-center text-xs text-muted-foreground">
                            Proteção garantida. O pagamento só é liberado após a aprovação.
                        </p>
                    </div>

                    <div className="space-y-2">
                        <h3 className="font-semibold">Sobre a arte</h3>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                            Esta é uma obra original criada com técnicas digitais avançadas.
                            O artista focou em trazer uma atmosfera única através do uso de cores e iluminação.
                            Perfeito para uso pessoal, capas ou referência de personagem.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}
