import { useState } from "react"
import ReactMarkdown from "react-markdown"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"
import { Separator } from "@/components/ui/separator"
import { FileText, MessageCircle, Sparkles, X } from "lucide-react"

type CommissionDetailsDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  price: number
  artist: {
    nome: string
    avatarUrl: string
  }
  images: string[]
  descriptionMarkdown: string
  termsMarkdown: string
  onRequest?: (price: number) => void
}

export function CommissionDetailsDialog({
  open,
  onOpenChange,
  title,
  price,
  artist,
  images,
  descriptionMarkdown,
  termsMarkdown,
  onRequest,
}: CommissionDetailsDialogProps) {
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [lightboxIndex, setLightboxIndex] = useState(0)
  const hasImages = images.length > 0
  const isSingleImage = images.length <= 1
  const artistInitials = artist.nome
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
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
                  {title}
                </DialogTitle>
                <div className="flex flex-wrap items-center gap-3 text-lg">
                  <span className="font-semibold">
                    {price.toLocaleString("pt-BR", {
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
                    <Sparkles className="mt-0.5 h-5 w-5 text-muted-foreground" />
                    <div className="space-y-0.5">
                      <div className="text-sm font-semibold">Personalizado (YCH)</div>
                      <div className="text-xs text-muted-foreground">
                        Arte baseada em template com ajustes de pose e cor.
                      </div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 rounded-xl border border-border/60 bg-card/70 px-4 py-3">
                    <MessageCircle className="mt-0.5 h-5 w-5 text-muted-foreground" />
                    <div className="space-y-0.5">
                      <div className="text-sm font-semibold">Comunicacao aberta</div>
                      <div className="text-xs text-muted-foreground">
                        Atualizacoes WIP + revisoes disponiveis.
                      </div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 rounded-xl border border-border/60 bg-card/70 px-4 py-3">
                    <FileText className="mt-0.5 h-5 w-5 text-muted-foreground" />
                    <div className="space-y-0.5">
                      <div className="text-sm font-semibold">Proposta custom</div>
                      <div className="text-xs text-muted-foreground">
                        Pedido ? proposta ? compromisso (pagamento).
                      </div>
                    </div>
                  </div>
                </div>

                <div className="rounded-xl border border-border/60 bg-card/70 px-4 py-3">
                  <div className="text-sm text-muted-foreground [&_ul]:list-disc [&_ul]:pl-5 [&_li]:mt-1 [&_h2]:text-base [&_h2]:font-semibold [&_h2]:text-foreground [&_h2]:mt-2 [&_h3]:text-sm [&_h3]:font-semibold [&_h3]:text-foreground [&_h3]:mt-2">
                    <ReactMarkdown>{descriptionMarkdown}</ReactMarkdown>
                  </div>
                </div>

                <Separator />

                <div className="rounded-xl border border-border/60 bg-card/70 px-4 py-3">
                  <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                    Termos de serviço
                  </p>
                  <div className="mt-2 space-y-2 text-sm text-muted-foreground [&_ul]:list-disc [&_ul]:pl-5 [&_li]:mt-1 [&_h3]:text-sm [&_h3]:font-semibold [&_h3]:text-foreground [&_h3]:mt-2">
                    <ReactMarkdown>{termsMarkdown}</ReactMarkdown>
                  </div>
                </div>

                {isSingleImage ? (
                  <div className="sticky -bottom-5 z-10 mt-6 flex justify-center">
                    <Button onClick={() => onRequest?.(price)}>
                      Pedir Comissao
                    </Button>
                  </div>
                ) : (
                  <div className="sticky bottom-12 z-10 mt-6 flex justify-center">
                    <Button onClick={() => onRequest?.(price)}>
                      Pedir Comissao
                    </Button>
                  </div>
                )}
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
                      alt={`${title} 1`}
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
                              alt={`${title} ${index + 1}`}
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
            {images.length > 1 && (
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
            )}

            <img
              src={(hasImages ? images : [])[lightboxIndex]}
              alt={`${title} ${lightboxIndex + 1}`}
              className="block"
              style={{
                maxHeight: "min(800px, 90vh)",
                maxWidth: "min(2000px, 96vw)",
                height: "auto",
                width: "auto",
              }}
              onClick={(event) => event.stopPropagation()}
            />

            {images.length > 1 && (
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
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
