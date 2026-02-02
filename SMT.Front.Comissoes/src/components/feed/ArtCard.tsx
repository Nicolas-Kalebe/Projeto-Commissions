import { useEffect, useMemo, useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import type { Art, User } from "@/types"
import { CommissionDetailsDialog } from "@/components/commission/CommissionDetailsDialog"
import { Megaphone } from "lucide-react"
import {
  type CarouselApi,
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"

interface ArtCardProps {
  art: Art
  artist: User
  showNsfw: boolean
  onRequestCommission?: (price: number) => void
}

export function ArtCard({
  art,
  artist,
  showNsfw,
  onRequestCommission,
}: ArtCardProps) {
  const [detailsOpen, setDetailsOpen] = useState(false)
  const [carouselApi, setCarouselApi] = useState<CarouselApi | null>(null)
  const [carouselIndex, setCarouselIndex] = useState(0)
  const [carouselSnaps, setCarouselSnaps] = useState<number[]>([])
  const images = art.images?.length ? art.images : [art.imageUrl]
  const hasMultipleImages = images.length > 1
  const terms = useMemo(
    () =>
      [
        "### Revisoes",
        "- Ate **2 revisoes** inclusas na etapa de rascunho.",
        "- Ajustes pequenos de pose, expressao e paleta.",
        "",
        "### Comunicacao",
        "- Atendimento via chat da plataforma.",
        "- Prazo de resposta de ate *48h uteis*.",
        "",
        "### Uso e entrega",
        "- Uso pessoal liberado.",
        "- Uso comercial exige **licenca adicional**.",
        "- Entrega em **PNG** e **JPG** (alta resolucao).",
        "",
        "### Observacoes",
        "- Mudancas grandes apos pintura final podem gerar taxa",
      ].join("\n"),
    []
  )
  const description = useMemo(() => {
    const tagLine = art.tags.map((tag) => tag.replace("#", "")).join(", ")
    return [
      "## Sobre esta arte",
      "Arte sob encomenda inspirada neste estilo.",
      "",
      "### Tags",
      `- ${tagLine || "Ilustracao personalizada"}`,
      "",
      "### Como funciona",
      "- Briefing e referencias",
      "- Aprovacao do rascunho",
      "- Entrega final em alta",
    ].join("\n")
  }, [art.tags])

  const isBlurred = art.nsfw && !showNsfw
  const isSponsored = art.patrocinado

  useEffect(() => {
    if (!carouselApi || !hasMultipleImages) return
    setCarouselSnaps(carouselApi.scrollSnapList())
    setCarouselIndex(carouselApi.selectedScrollSnap())
    const onSelect = () => setCarouselIndex(carouselApi.selectedScrollSnap())
    carouselApi.on("select", onSelect)
    carouselApi.on("reInit", onSelect)
    return () => {
      carouselApi.off("select", onSelect)
    }
  }, [carouselApi, hasMultipleImages])

  return (
    <>
      <Card
        className="group overflow-hidden border bg-card/50 transition hover:shadow-md cursor-pointer border-border/60 hover:border-primary/50"
        onClick={() => setDetailsOpen(true)}
        role="button"
        tabIndex={0}
        onKeyDown={(event) => {
          if (event.key === "Enter" || event.key === " ") {
            event.preventDefault()
            setDetailsOpen(true)
          }
        }}
      >
        <div className="relative aspect-square w-full overflow-hidden">
          {hasMultipleImages ? (
            <Carousel
              opts={{ loop: true }}
              setApi={setCarouselApi}
              className="h-full w-full"
            >
              <CarouselContent viewportClassName="h-full" className="h-full -ml-0">
                {images.map((image, index) => (
                  <CarouselItem key={`${art.id}-${index}`} className="h-full pl-0">
                    <img
                      src={image}
                      alt={`${art.titulo} ${index + 1}`}
                      className={`h-full w-full object-cover ${isBlurred ? "blur-xl scale-110" : ""}`}
                      loading="lazy"
                    />
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious
                className="left-2 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full bg-black/60 text-white hover:bg-black/70 border-transparent opacity-0 transition-opacity group-hover:opacity-100 dark:bg-black/60 dark:text-white dark:hover:bg-black/70"
                onClick={(event) => {
                  event.stopPropagation()
                  carouselApi?.scrollPrev()
                }}
                onPointerDown={(event) => event.stopPropagation()}
                aria-label="Imagem anterior"
              />
              <CarouselNext
                className="right-2 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full bg-black/60 text-white hover:bg-black/70 border-transparent opacity-0 transition-opacity group-hover:opacity-100 dark:bg-black/60 dark:text-white dark:hover:bg-black/70"
                onClick={(event) => {
                  event.stopPropagation()
                  carouselApi?.scrollNext()
                }}
                onPointerDown={(event) => event.stopPropagation()}
                aria-label="Próxima imagem"
              />
              <div className="pointer-events-auto absolute bottom-2 left-1/2 z-10 flex -translate-x-1/2 items-center gap-1.5">
                {carouselSnaps.map((_, index) => (
                  <button
                    key={`${art.id}-dot-${index}`}
                    type="button"
                    className={`h-1.5 w-1.5 rounded-full transition ${
                      index === carouselIndex
                        ? "bg-white"
                        : "bg-white/50 hover:bg-white/80"
                    }`}
                    onClick={(event) => {
                      event.stopPropagation()
                      carouselApi?.scrollTo(index)
                    }}
                    onPointerDown={(event) => event.stopPropagation()}
                    aria-label={`Ir para imagem ${index + 1}`}
                  />
                ))}
              </div>
            </Carousel>
          ) : (
            <div className="block h-full w-full">
              <img
                src={art.imageUrl}
                alt={art.titulo}
                className={`h-full w-full object-cover transition-all duration-500 group-hover:scale-105 ${isBlurred ? "blur-xl scale-110" : ""}`}
                loading="lazy"
              />
            </div>
          )}

          <div className="absolute right-2 top-2 flex flex-col gap-1 z-10">
            {isSponsored && (
              <div className="rounded bg-black px-1.5 py-0.5 text-[10px] font-bold text-white backdrop-blur-sm shadow-sm flex items-center gap-1">
                <Megaphone className="h-3 w-3" />
                Impulsionado
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
                  <Badge
                    key={tag}
                    variant="outline"
                    className="text-[10px] px-1.5 py-0 h-5"
                  >
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm font-semibold">
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

      <CommissionDetailsDialog
        open={detailsOpen}
        onOpenChange={setDetailsOpen}
        title={art.titulo}
        price={art.preco}
        artist={{ nome: artist.nome, avatarUrl: artist.avatarUrl }}
        images={images}
        descriptionMarkdown={description}
        termsMarkdown={terms}
        onRequest={onRequestCommission}
      />
    </>
  )
}
