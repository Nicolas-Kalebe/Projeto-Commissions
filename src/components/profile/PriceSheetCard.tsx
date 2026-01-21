import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import type { PriceSheet } from "@/types"

interface PriceSheetCardProps {
  sheet: PriceSheet
  onRequest: (price: number) => void
}

export function PriceSheetCard({ sheet, onRequest }: PriceSheetCardProps) {
  return (
    <Card className="flex h-full flex-col border-border/60 bg-card/95 shadow-sm">
      <CardHeader className="space-y-1">
        <p className="text-sm uppercase tracking-wide text-muted-foreground">
          Comissão
        </p>
        <h3 className="text-lg font-semibold">{sheet.titulo}</h3>
      </CardHeader>
      <CardContent className="flex-1 space-y-3">
        <p className="text-sm text-muted-foreground">{sheet.descricao}</p>
        <p className="text-2xl font-semibold">
          {sheet.preco.toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL",
          })}
        </p>
      </CardContent>
      <CardFooter>
        <Button className="w-full" onClick={() => onRequest(sheet.preco)}>
          Pedir Comissão
        </Button>
      </CardFooter>
    </Card>
  )
}
