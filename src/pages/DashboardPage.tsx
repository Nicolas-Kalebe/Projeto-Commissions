import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { users } from "@/data"

const projectItems = [
  "Comissao retrato cyberpunk",
  "Pacote banners Twitch",
  "Mascote para startup",
  "Ilustracao editorial",
  "Identidade visual",
  "Capa de album",
]

export function DashboardPage() {
  const user = users[0]

  return (
    <section className="grid gap-6 lg:grid-cols-[280px_1fr]">
      <aside className="space-y-4 lg:border-r lg:pr-6">
        <div className="flex items-center gap-2">
          <Avatar className="size-9">
            <AvatarImage src={user.avatarUrl} alt={user.nome} />
            <AvatarFallback>{user.nome.slice(0, 2)}</AvatarFallback>
          </Avatar>
          <Button variant="ghost" className="px-2 text-sm font-semibold">
            {user.nome}
          </Button>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold text-muted-foreground">
              Projetos
            </p>
            <Button size="sm" variant="secondary">
              Novo
            </Button>
          </div>
          <Input placeholder="Buscar projetos..." />
          <div className="space-y-1">
            {projectItems.map((project) => (
              <Button
                key={project}
                variant="ghost"
                className="w-full justify-start cursor-pointer"
              >
                {project}
              </Button>
            ))}
          </div>
          <Button variant="ghost" className="px-2 text-xs text-muted-foreground">
            Ver mais
          </Button>
        </div>
      </aside>

      <div className="space-y-6">
        <div className="space-y-2">
          <h1 className="text-xl font-semibold">Dashboard</h1>
          <div className="rounded-lg border border-border/60 bg-background/60 px-4 py-3">
            <p className="text-sm text-muted-foreground">
              Pergunte algo ou escolha um projeto para comecar.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          {["Tarefas", "Criar briefing", "Relatorios", "Arquivos", "Feedback"].map(
            (item) => (
              <Button key={item} variant="outline" size="sm">
                {item}
              </Button>
            )
          )}
        </div>

        <div className="space-y-3">
          <Separator />
          <div className="rounded-lg border border-border/60 bg-background/60 p-4">
            <p className="text-sm font-semibold">Atualizacoes recentes</p>
            <p className="text-xs text-muted-foreground">
              Sem atividade nas ultimas 24 horas.
            </p>
          </div>
          <div className="rounded-lg border border-border/60 bg-background/60 p-4">
            <p className="text-sm font-semibold">Resumo do projeto</p>
            <p className="text-xs text-muted-foreground">
              Selecione um projeto a esquerda para visualizar detalhes.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
