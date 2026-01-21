import { Gauge, Gem, ShieldCheck } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const features = [
  {
    title: "Performance real",
    description:
      "Arquitetura leve, carregamento instantaneo e interacoes fluida.",
    icon: Gauge,
  },
  {
    title: "Design premium",
    description:
      "Composicao elegante, espacamento generoso e contraste equilibrado.",
    icon: Gem,
  },
  {
    title: "Confianca e seguranca",
    description:
      "Base tipada, acessibilidade e padroes consistentes em toda pagina.",
    icon: ShieldCheck,
  },
]

export function Features() {
  return (
    <section id="features" className="scroll-mt-24">
      <div className="flex flex-col gap-10">
        <div className="max-w-2xl space-y-3">
          <p className="text-sm font-medium uppercase tracking-[0.25em] text-muted-foreground">
            Diferenciais
          </p>
          <h2 className="text-3xl font-semibold tracking-tight">
            Tudo o que voce precisa para impressionar.
          </h2>
          <p className="text-muted-foreground">
            Cards elegantes com conteudo objetivo, icones claros e leitura leve.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {features.map((feature) => {
            const Icon = feature.icon
            return (
              <Card key={feature.title} className="shadow-sm">
                <CardHeader className="space-y-4">
                  <div className="grid size-11 place-items-center rounded-full bg-secondary text-secondary-foreground">
                    <Icon className="size-5" />
                  </div>
                  <CardTitle>{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>
    </section>
  )
}
