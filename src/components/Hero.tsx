import { ArrowRight, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"

export function Hero() {
  return (
    <section className="pt-10">
      <div className="flex flex-col gap-8">
        <div className="flex max-w-3xl flex-col gap-6">
          <div className="inline-flex w-fit items-center gap-2 rounded-full border border-border/70 bg-background/70 px-4 py-1 text-xs font-medium text-muted-foreground shadow-sm">
            <Sparkles className="size-3" />
            Experiencia premium em cada detalhe
          </div>
          <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl lg:text-6xl">
            Construa landing pages que convertem com estilo e velocidade.
          </h1>
          <p className="text-base text-muted-foreground sm:text-lg">
            Uma base moderna em React, TypeScript e shadcn/ui que entrega
            interface elegante, foco em conversao e performance sem friccao.
          </p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <Button size="lg" className="gap-2">
            Quero acelerar
            <ArrowRight className="size-4" />
          </Button>
          <Button size="lg" variant="outline">
            Ver componentes
          </Button>
        </div>

        <div className="grid gap-6 text-sm text-muted-foreground sm:grid-cols-3">
          <div>
            <p className="text-2xl font-semibold text-foreground">+48%</p>
            <p>Melhora media na taxa de conversao.</p>
          </div>
          <div>
            <p className="text-2xl font-semibold text-foreground">2.1s</p>
            <p>Tempo medio de primeira renderizacao.</p>
          </div>
          <div>
            <p className="text-2xl font-semibold text-foreground">99.9%</p>
            <p>Estabilidade visual com design system.</p>
          </div>
        </div>
      </div>
    </section>
  )
}
