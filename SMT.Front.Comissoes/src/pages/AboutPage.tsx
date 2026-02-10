import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"

const highlights = [
  {
    title: "Comissoes sem friccao",
    description:
      "Do primeiro contato ao pagamento final, organizamos o fluxo para artistas e clientes.",
  },
  {
    title: "Seguranca e confianca",
    description:
      "Protegemos informacoes sensiveis e mantemos um canal claro de suporte e mediacao.",
  },
  {
    title: "Controle criativo",
    description:
      "Briefing, revisoes e aprovacao em etapas para reduzir retrabalho e surpresas.",
  },
]

const values = [
  "Transparencia nas etapas",
  "Respeito ao tempo do artista",
  "Experiencia simples para clientes",
  "Comunidade e colaboracao",
]

export function AboutPage() {
  return (
    <main className="mx-auto w-full max-w-6xl px-6 py-10">
      <section className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
        <div className="space-y-4">
          <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
            Sobre nos
          </p>
          <h1 className="text-3xl font-semibold leading-tight md:text-4xl">
            Projeto Comissoes nasce para dar clareza, ritmo e seguranca ao trabalho
            criativo.
          </h1>
          <p className="text-sm text-muted-foreground md:text-base">
            Somos uma plataforma focada em comissoes artisticas. Conectamos
            clientes e criadores com fluxos organizados, comunicacao objetiva e
            ferramentas que valorizam cada etapa do processo.
          </p>
          <div className="flex flex-wrap items-center gap-3">
            <Button>Falar com o time</Button>
            <Button variant="outline">Baixar media kit</Button>
          </div>
        </div>

        <Card className="border-border/60 bg-card/80">
          <CardContent className="space-y-4 p-6">
            <div className="rounded-xl border border-border/60 bg-muted/40 p-4">
              <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                Nossa missao
              </p>
              <p className="mt-2 text-sm font-semibold md:text-base">
                Simplificar comissoes digitais e valorizar o talento criativo com
                processos claros e confiaveis.
              </p>
            </div>
            <div className="grid gap-3 sm:grid-cols-3">
              <div className="rounded-xl border border-border/60 bg-card/70 p-4">
                <p className="text-2xl font-semibold">+12k</p>
                <p className="text-xs text-muted-foreground">
                  Pedidos finalizados
                </p>
              </div>
              <div className="rounded-xl border border-border/60 bg-card/70 p-4">
                <p className="text-2xl font-semibold">4.9/5</p>
                <p className="text-xs text-muted-foreground">
                  Satisfacao media
                </p>
              </div>
              <div className="rounded-xl border border-border/60 bg-card/70 p-4">
                <p className="text-2xl font-semibold">+3k</p>
                <p className="text-xs text-muted-foreground">
                  Artistas ativos
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      <Separator className="my-10" />

      <section className="space-y-6">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
              O que fazemos
            </p>
            <h2 className="text-2xl font-semibold">Uma jornada organizada</h2>
          </div>
          <p className="text-sm text-muted-foreground">
            Da descoberta ao pagamento, cada passo e acompanhado.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {highlights.map((item) => (
            <Card key={item.title} className="border-border/60 bg-card/70">
              <CardContent className="space-y-2 p-5">
                <p className="text-sm font-semibold">{item.title}</p>
                <p className="text-xs text-muted-foreground">{item.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <Separator className="my-10" />

      <section className="grid gap-8 md:grid-cols-[1fr_1.2fr] md:items-start">
        <div className="space-y-3">
          <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
            Nossos valores
          </p>
          <h3 className="text-2xl font-semibold">Pilares que guiam o produto</h3>
          <p className="text-sm text-muted-foreground">
            Focamos em respeito ao trabalho criativo, eficiencia operacional e
            uma experiencia humana para todos os lados.
          </p>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          {values.map((value) => (
            <div
              key={value}
              className="rounded-xl border border-border/60 bg-card/70 p-4 text-sm font-medium"
            >
              {value}
            </div>
          ))}
        </div>
      </section>

      <Separator className="my-10" />

      <section className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
        <Card className="border-border/60 bg-card/70">
          <CardContent className="space-y-3 p-6">
            <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
              Roadmap
            </p>
            <h4 className="text-xl font-semibold">O que vem a seguir</h4>
            <p className="text-sm text-muted-foreground">
              Painel de progresso em tempo real, recomendacoes inteligentes e
              ferramentas de contratos digitais.
            </p>
            <div className="grid gap-2 text-xs text-muted-foreground">
              <span>Q1: Fluxos de pagamento mais flexiveis</span>
              <span>Q2: Biblioteca de briefs inteligentes</span>
              <span>Q3: Garantias de entrega e escrow</span>
            </div>
          </CardContent>
        </Card>
        <div className="space-y-3">
          <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
            Fale conosco
          </p>
          <h4 className="text-2xl font-semibold">
            Quer colaborar ou anunciar?
          </h4>
          <p className="text-sm text-muted-foreground">
            Nosso time esta disponivel para parcerias, eventos e iniciativas com a
            comunidade criativa.
          </p>
          <Button variant="outline">Enviar proposta</Button>
        </div>
      </section>
    </main>
  )
}
