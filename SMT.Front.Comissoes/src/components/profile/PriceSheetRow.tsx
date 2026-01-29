import { useMemo, useState } from "react"
import ReactMarkdown from "react-markdown"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import type { PriceSheet } from "@/types"
import { X } from "lucide-react"

interface PriceSheetRowProps {
  sheet: PriceSheet
  images: string[]
  artist: {
    nome: string
    avatarUrl: string
  }
  onRequest: (price: number) => void
}

export function PriceSheetRow({
  sheet,
  images,
  artist,
  onRequest,
}: PriceSheetRowProps) {
  const [detailsOpen, setDetailsOpen] = useState(false)
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [lightboxIndex, setLightboxIndex] = useState(0)
  const hasImages = images.length > 0
  const isSingleImage = images.length <= 1
  const currentImage = hasImages ? images[0] : null
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
        "- Mudancas grandes apos pintura final podem gerar taxa.",
      ].join("\n"),
    []
  )
  const artistInitials = artist.nome
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)

  return (
    <>
      <Card
        className="cursor-pointer border-border/60 bg-card/95 shadow-sm transition hover:shadow-md"
        role="button"
        tabIndex={0}
        onClick={() => setDetailsOpen(true)}
        onKeyDown={(event) => {
          if (event.key === "Enter" || event.key === " ") {
            event.preventDefault()
            setDetailsOpen(true)
          }
        }}
      >
        <CardContent className="flex flex-col gap-6 p-5 xl:flex-row xl:items-stretch">
          <div className="flex flex-1 flex-col gap-4">
            <div className="space-y-2">
              <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                Comissao
              </p>
              <div className="flex flex-wrap items-baseline gap-3">
                <h3 className="text-2xl font-semibold">{sheet.titulo}</h3>
                <span className="text-lg font-semibold text-muted-foreground">
                  {sheet.preco.toLocaleString("pt-BR", {
                    style: "currency",
                    currency: "BRL",
                  })}
                </span>
              </div>
            </div>

            <div
              className="text-lg font-semibold text-foreground/80 [&_ul]:list-disc [&_ul]:pl-5 [&_li]:mt-1 [&_h2]:text-lg [&_h2]:font-semibold [&_h2]:text-foreground [&_h3]:text-base [&_h3]:font-semibold [&_h3]:text-foreground"
              style={{
                display: "-webkit-box",
                WebkitLineClamp: 3,
                WebkitBoxOrient: "vertical",
                overflow: "hidden",
              }}
            >
              <ReactMarkdown>{sheet.descricao}</ReactMarkdown>
            </div>

            <div className="mt-auto">
              <Button
                onClick={(event) => {
                  event.stopPropagation()
                  onRequest(sheet.preco)
                }}
              >
                Pedir Comissao
              </Button>
            </div>
          </div>

          <div className="space-y-3 xl:w-[520px] xl:shrink-0">
            <div className="overflow-hidden rounded-xl">
              <div className="aspect-[16/9] h-[220px] w-full">
                {currentImage ? (
                  <img
                    src={currentImage}
                    alt={sheet.titulo}
                    className="h-full w-full object-cover"
                    loading="lazy"
                  />
                ) : null}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Dialog open={detailsOpen} onOpenChange={setDetailsOpen}>
        <DialogContent className="h-[92vh] max-h-[96vh] w-[98vw] max-w-7xl overflow-hidden p-0">
          <div className={isSingleImage ? "h-full min-h-0" : "h-full overflow-y-auto"}>
            <div
              className={`grid gap-6 px-6 pb-6 pt-6 lg:grid-cols-[minmax(0,1fr)_840px] ${
                isSingleImage ? "h-full min-h-0 lg:items-stretch" : ""
              }`}
            >
            <div
              className={`flex min-h-0 flex-col gap-4 pb-16 pr-2 ${
                isSingleImage
                  ? "h-full max-h-full overflow-y-auto"
                  : "lg:sticky lg:bottom-6 lg:self-end"
              }`}
            >
              <DialogTitle className="text-2xl font-semibold">
                {sheet.titulo}
              </DialogTitle>
              <div className="flex flex-wrap items-center gap-3 text-lg">
                <span className="font-semibold">
                  {sheet.preco.toLocaleString("pt-BR", {
                    style: "currency",
                    currency: "BRL",
                  })}
                </span>
                <span className="text-sm text-muted-foreground">por pedido</span>
              </div>

              <div className="flex items-center gap-3">
                <Avatar className="size-10 border border-border/60">
                  <AvatarImage src={artist.avatarUrl} alt={artist.nome} />
                  <AvatarFallback>{artistInitials}</AvatarFallback>
                </Avatar>
                <div className="text-sm font-medium">{artist.nome}</div>
              </div>

              <div className="grid gap-3">
                <div className="flex items-start gap-3 rounded-xl border border-border/60 bg-card/70 px-4 py-3">
                  <div className="mt-0.5 text-lg">🎨</div>
                  <div className="space-y-0.5">
                    <div className="text-sm font-semibold">Personalizado (YCH)</div>
                    <div className="text-xs text-muted-foreground">
                      Arte baseada em template com ajustes de pose e cor.
                    </div>
                  </div>
                </div>
                <div className="flex items-start gap-3 rounded-xl border border-border/60 bg-card/70 px-4 py-3">
                  <div className="mt-0.5 text-lg">💬</div>
                  <div className="space-y-0.5">
                    <div className="text-sm font-semibold">Comunicacao aberta</div>
                    <div className="text-xs text-muted-foreground">
                      Atualizacoes WIP + revisoes disponiveis.
                    </div>
                  </div>
                </div>
                <div className="flex items-start gap-3 rounded-xl border border-border/60 bg-card/70 px-4 py-3">
                  <div className="mt-0.5 text-lg">✅</div>
                  <div className="space-y-0.5">
                    <div className="text-sm font-semibold">Proposta custom</div>
                    <div className="text-xs text-muted-foreground">
                      Pedido → proposta → compromisso (pagamento).
                    </div>
                  </div>
                </div>
              </div>

              <div className="rounded-xl border border-border/60 bg-card/70 px-4 py-3">
                <div className="text-sm text-muted-foreground [&_ul]:list-disc [&_ul]:pl-5 [&_li]:mt-1 [&_h2]:text-base [&_h2]:font-semibold [&_h2]:text-foreground [&_h2]:mt-2 [&_h3]:text-sm [&_h3]:font-semibold [&_h3]:text-foreground [&_h3]:mt-2">
                  <ReactMarkdown>{sheet.descricao}</ReactMarkdown>
                </div>
              </div>

              <Separator />

              <div className="rounded-xl border border-border/60 bg-card/70 px-4 py-3">
                <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                  Termos de servico
                </p>
                <div className="mt-2 space-y-2 text-sm text-muted-foreground [&_ul]:list-disc [&_ul]:pl-5 [&_li]:mt-1 [&_h3]:text-sm [&_h3]:font-semibold [&_h3]:text-foreground [&_h3]:mt-2">
                  <ReactMarkdown>{terms}</ReactMarkdown>
                </div>
              </div>

              <div className="sticky bottom-[30px] z-10 flex justify-center pt-6">
                <Button onClick={() => onRequest(sheet.preco)}>
                  Pedir Comissao
                </Button>
              </div>
            </div>

            <div
              className={`flex min-h-0 ${
                isSingleImage
                  ? "h-full items-center justify-center"
                  : "flex-col space-y-3 lg:sticky lg:bottom-6 lg:self-end"
              }`}
            >
              {isSingleImage ? (
                <button
                  type="button"
                  className="inline-flex max-h-[70vh] max-w-full items-center justify-center overflow-hidden rounded-lg"
                  onClick={() => {
                    setLightboxIndex(0)
                    setLightboxOpen(true)
                  }}
                >
                  <img
                    src={images[0]}
                    alt={`${sheet.titulo} 1`}
                    className="max-h-[70vh] w-auto max-w-full object-contain"
                    loading="lazy"
                  />
                </button>
              ) : (
                <div className="space-y-3">
                  {(hasImages ? images : []).map((imageUrl, index) => (
                    <div
                      key={`${imageUrl}-${index}`}
                      className="overflow-hidden rounded-lg"
                    >
                      <button
                        type="button"
                        className="block w-full"
                        onClick={() => {
                          setLightboxIndex(index)
                          setLightboxOpen(true)
                        }}
                      >
                        <div className="aspect-[16/9] w-full">
                          <img
                            src={imageUrl}
                            alt={`${sheet.titulo} ${index + 1}`}
                            className="h-full w-full object-contain"
                            loading="lazy"
                          />
                        </div>
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={lightboxOpen} onOpenChange={setLightboxOpen}>
        <DialogContent
          className="fixed left-1/2 top-1/2 flex w-[96vw] max-w-none -translate-x-1/2 -translate-y-1/2 justify-center border-0 bg-transparent p-0 shadow-none [&>button]:hidden"
          onPointerDownOutside={() => setLightboxOpen(false)}
          onClick={() => setLightboxOpen(false)}
        >
          <Button
            variant="secondary"
            size="icon"
            className="absolute right-4 top-4 z-50"
            onClick={() => setLightboxOpen(false)}
          >
            <X className="h-4 w-4" />
            <span className="sr-only">Fechar</span>
          </Button>

          <div
            className="relative flex items-center justify-center"
            style={{
              width: "min(2000px, 96vw)",
              height: "min(800px, 90vh)",
            }}
          >
            <Button
              variant="secondary"
              size="icon"
              className="absolute left-0 top-1/2 z-50 -translate-y-1/2 translate-x-3"
              onClick={(event) => {
                event.stopPropagation()
                setLightboxIndex((prev) =>
                  prev === 0 ? images.length - 1 : prev - 1
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

            <img
              src={(hasImages ? images : [])[lightboxIndex]}
              alt={`${sheet.titulo} ${lightboxIndex + 1}`}
              className="block"
              style={{
                maxHeight: "min(800px, 90vh)",
                maxWidth: "min(2000px, 96vw)",
                height: "auto",
                width: "auto",
              }}
              onClick={(event) => event.stopPropagation()}
            />

            <Button
              variant="secondary"
              size="icon"
              className="absolute right-0 top-1/2 z-50 -translate-y-1/2 -translate-x-3"
              onClick={(event) => {
                event.stopPropagation()
                setLightboxIndex((prev) =>
                  prev === images.length - 1 ? 0 : prev + 1
                )
              }}
            >
              <span className="sr-only">Proximo</span>
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
    </>
  )
}
