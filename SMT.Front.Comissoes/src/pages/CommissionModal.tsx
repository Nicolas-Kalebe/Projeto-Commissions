import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { commissionStatuses } from "@/data"
import {
  Brush,
  CheckCircle2,
  DownloadCloud,
  ShieldCheck,
} from "lucide-react"

const statusIcons = {
  pagamento: ShieldCheck,
  producao: Brush,
  entrega: DownloadCloud,
  aprovacao: CheckCircle2,
}

interface CommissionModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  price: number
}

export function CommissionModal({
  open,
  onOpenChange,
  price,
}: CommissionModalProps) {
  const fee = price * 0.1
  const total = price + fee

  const formatMoney = (value: number) =>
    value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Fluxo de Comissão</DialogTitle>
          <DialogDescription>
            Pagamento protegido e liberado apenas após aprovação.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-6 md:grid-cols-[1.1fr_0.9fr]">
          <div className="space-y-4 rounded-lg border bg-muted/20 p-4">
            <h3 className="text-sm font-semibold">Resumo do Pedido</h3>
            <div className="space-y-3 text-sm">
              <div className="flex items-center justify-between">
                <span>Preço base</span>
                <span>{formatMoney(price)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Taxa de serviço (10%)</span>
                <span>{formatMoney(fee)}</span>
              </div>
              <Separator />
              <div className="flex items-center justify-between text-base font-semibold">
                <span>Total</span>
                <span>{formatMoney(total)}</span>
              </div>
            </div>
            <Badge className="w-fit">Pagamento bloqueado em segurança</Badge>
          </div>

          <div className="space-y-4">
            <h3 className="text-sm font-semibold">Linha do Tempo</h3>
            <div className="space-y-3">
              {commissionStatuses.map((status, index) => {
                const Icon = statusIcons[status.id as keyof typeof statusIcons]
                return (
                  <div
                    key={status.id}
                    className="flex items-start gap-3 rounded-md border bg-card p-3"
                  >
                    <div className="mt-1 rounded-full bg-primary/10 p-2 text-primary">
                      <Icon className="size-4" />
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-semibold">
                        {index + 1}. {status.titulo}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {status.descricao}
                      </p>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
