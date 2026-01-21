import { useState } from "react"
import { ArrowRight, Loader2, Mail, Rocket, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"

const variants = [
  "default",
  "secondary",
  "destructive",
  "outline",
  "ghost",
  "link",
] as const

type VariantType = (typeof variants)[number]

export function ButtonsShowcase() {
  const [clicks, setClicks] = useState(0)
  const { toast } = useToast()

  const handleClick = (label: string) => {
    setClicks((prev) => {
      const next = prev + 1
      toast({
        title: "Clique registrado",
        description: `${label} | Total: ${next}`,
      })
      return next
    })
  }

  return (
    <section id="buttons" className="scroll-mt-24">
      <Card className="shadow-sm">
        <CardHeader className="space-y-3">
          <CardTitle>Playground de Botoes</CardTitle>
          <p className="text-sm text-muted-foreground">
            Teste todas as variantes, estados e combinacoes de icones. Total de
            cliques: <span className="font-semibold text-foreground">{clicks}</span>
          </p>
        </CardHeader>
        <CardContent className="space-y-8">
          <div className="grid gap-4 md:grid-cols-3">
            {variants.map((variant) => (
              <div key={variant} className="space-y-3">
                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  {variant}
                </p>
                <Button
                  variant={variant as VariantType}
                  className="w-full"
                  onClick={() => handleClick(`Variant: ${variant}`)}
                >
                  Testar
                </Button>
              </div>
            ))}
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-3">
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Loading
              </p>
              <Button disabled className="w-full gap-2">
                <Loader2 className="size-4 animate-spin" />
                Processando
              </Button>
            </div>
            <div className="space-y-3">
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Disabled
              </p>
              <Button variant="secondary" className="w-full" disabled>
                Nao disponivel
              </Button>
            </div>
            <div className="space-y-3">
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Link
              </p>
              <Button
                variant="link"
                className="w-full justify-start"
                onClick={() => handleClick("Variant: link")}
              >
                Saiba mais
              </Button>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-3">
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Icone esquerda
              </p>
              <Button className="w-full gap-2" onClick={() => handleClick("Icone esquerda")}
              >
                <Sparkles className="size-4" />
                Destaque
              </Button>
            </div>
            <div className="space-y-3">
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Icone direita
              </p>
              <Button
                variant="outline"
                className="w-full gap-2"
                onClick={() => handleClick("Icone direita")}
              >
                Continuar
                <ArrowRight className="size-4" />
              </Button>
            </div>
            <div className="space-y-3">
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Com icones
              </p>
              <Button
                variant="secondary"
                className="w-full gap-2"
                onClick={() => handleClick("Com icones")}
              >
                <Rocket className="size-4" />
                <span>Lancar campanha</span>
                <Mail className="size-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </section>
  )
}
