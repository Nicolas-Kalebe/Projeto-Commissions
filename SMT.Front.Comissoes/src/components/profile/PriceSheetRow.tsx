import { useMemo, useState } from "react"
import ReactMarkdown from "react-markdown"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import type { PriceSheet } from "@/types"
import { CommissionDetailsDialog } from "@/components/commission/CommissionDetailsDialog"

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
  const hasImages = images.length > 0
  const currentImage = hasImages ? images[0] : null
  const defaultTerms = useMemo(
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
  const terms = useMemo(
    () => (sheet.termos?.trim() ? sheet.termos : defaultTerms),
    [sheet.termos, defaultTerms]
  )
  const description = useMemo(() => sheet.descricao, [sheet.descricao])

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

      <CommissionDetailsDialog
        open={detailsOpen}
        onOpenChange={setDetailsOpen}
        title={sheet.titulo}
        price={sheet.preco}
        artist={artist}
        images={images}
        descriptionMarkdown={description}
        termsMarkdown={terms}
        onRequest={onRequest}
      />
    </>
  )
}
