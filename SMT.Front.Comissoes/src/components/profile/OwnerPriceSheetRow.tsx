import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import type { PriceSheet } from "@/types"

type OwnerPriceSheetRowProps = {
  sheet: {
    id: string
    titulo: string
    preco: number
    descricao: string
    imageUrl?: string
  }
  images: string[]
}

type ServiceSheet = PriceSheet & {
  images?: string[]
}

export function OwnerPriceSheetRow({ sheet, images }: OwnerPriceSheetRowProps) {
  const image = images[0] ?? sheet.imageUrl
  return (
    <Card className="border-border/60 bg-card/95 shadow-sm">
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

          <p className="text-sm text-muted-foreground">{sheet.descricao}</p>

          <div className="mt-auto">
            <Button variant="secondary">Editar comissão</Button>
          </div>
        </div>

        <div className="space-y-3 xl:w-[520px] xl:shrink-0">
          <div className="overflow-hidden rounded-xl">
            <div className="aspect-[16/9] h-[220px] w-full">
              {image ? (
                <img
                  src={image}
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
  )
}

export type { OwnerPriceSheetRowProps, ServiceSheet }
