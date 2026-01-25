import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { users } from "@/data"
import {
  BarChart3,
  FileText,
  FolderKanban,
  HelpCircle,
  LayoutDashboard,
  Settings,
  Star,
  Wallet,
} from "lucide-react"

const menuItems = [
  { label: "Dashboard", icon: LayoutDashboard },
  { label: "Carteira", icon: Wallet },
  { label: "Comissoes", icon: FileText },
  { label: "Portfolio", icon: FolderKanban },
  { label: "Analytics", icon: BarChart3 },
]

const preferenceItems = [
  { label: "Configuracoes", icon: Settings },
  { label: "Ajuda & Suporte", icon: HelpCircle },
]

const activeOrders = [
  { cliente: "Marina Souza", status: "Em andamento", andamento: "60%", prazo: "12 dias", valor: "R$ 420,00" },
  { cliente: "Renato Kaori", status: "Revisao", andamento: "85%", prazo: "4 dias", valor: "R$ 780,00" },
  { cliente: "Luna Azevedo", status: "Briefing", andamento: "25%", prazo: "18 dias", valor: "R$ 320,00" },
]

export function DashboardPage() {
  const user = users[1]

  return (
    <section className="relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] w-screen px-6">
      <div className="grid gap-6 lg:grid-cols-[240px_1fr]">
        <aside className="rounded-xl border border-border/60 bg-background/80 p-4">
          <div className="flex items-center justify-between rounded-lg border border-border/60 bg-background px-3 py-2">
            <div className="flex items-center gap-3">
              <Avatar className="size-9">
                <AvatarImage src={user.avatarUrl} alt={user.nome} />
                <AvatarFallback>{user.nome.slice(0, 2)}</AvatarFallback>
              </Avatar>
              <div>
                <p className="text-sm font-semibold">{user.nome}</p>
                <p className="text-xs text-muted-foreground">Trocar de conta</p>
              </div>
            </div>
            <span className="size-0 border-x-6 border-x-transparent border-t-6 border-t-muted-foreground/60" />
          </div>

          <div className="mt-6 space-y-4">
            <div>
              <p className="text-xs font-semibold uppercase text-muted-foreground">
                Menu principal
              </p>
              <div className="mt-2 space-y-1">
                {menuItems.map((item) => {
                  const Icon = item.icon
                  return (
                    <Button
                      key={item.label}
                      variant="ghost"
                      className="w-full justify-start gap-2 text-muted-foreground hover:text-foreground"
                    >
                      <Icon className="size-4" />
                      {item.label}
                    </Button>
                  )
                })}
              </div>
            </div>

            <Separator />

            <div>
              <p className="text-xs font-semibold uppercase text-muted-foreground">
                Preferencias
              </p>
              <div className="mt-2 space-y-1">
                {preferenceItems.map((item) => {
                  const Icon = item.icon
                  return (
                    <Button
                      key={item.label}
                      variant="ghost"
                      className="w-full justify-start gap-2 text-muted-foreground hover:text-foreground"
                    >
                      <Icon className="size-4" />
                      {item.label}
                    </Button>
                  )}
                )}
              </div>
            </div>

            <div className="pt-2">
              <p className="text-xs font-semibold uppercase text-muted-foreground">
                Avaliação Média
              </p>
              <div className="mt-2 flex items-center gap-1 text-foreground">
                {Array.from({ length: 5 }).map((_, index) => (
                  <Star
                    key={`rating-${index}`}
                    className="size-4 fill-current"
                  />
                ))}
              </div>
            </div>
          </div>
        </aside>

        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_240px]">
          <div className="space-y-6">
            <div className="rounded-xl border border-border/60 bg-background/80 p-5">
              <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-muted-foreground">
                <span>Ganhos Mensais</span>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm">
                    Abr 2024
                  </Button>
                  <span className="text-muted-foreground/60">-</span>
                  <Button variant="outline" size="sm">
                    Mai 2024
                  </Button>
                </div>
              </div>
              <div className="mt-4 h-40 rounded-lg bg-[linear-gradient(180deg,rgba(0,0,0,0.25),transparent)]">
                <svg viewBox="0 0 400 120" className="h-full w-full">
                  <path
                    d="M0 95 L30 40 L60 90 L90 35 L120 50 L150 20 L180 70 L210 60 L240 30 L270 55 L300 25 L330 80 L360 50 L390 65 L400 40 V120 H0 Z"
                    className="fill-muted/50"
                  />
                </svg>
              </div>
              <div className="mt-3 flex items-center gap-4 text-[10px] text-muted-foreground">
                <span className="flex items-center gap-2">
                  <span className="size-2 rounded-full bg-foreground/60" />
                  Entradas
                </span>
                <span className="flex items-center gap-2">
                  <span className="size-2 rounded-full bg-muted-foreground/60" />
                  Saidas
                </span>
              </div>
            </div>

            <div className="grid gap-6 lg:grid-cols-[7fr_3fr]">
              <div className="rounded-xl border border-border/60 bg-background/80 p-5">
                <p className="text-sm font-semibold">Pedidos Ativos</p>
                <div className="mt-4 rounded-lg border border-border/60">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Cliente</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Andamento</TableHead>
                        <TableHead>Prazo</TableHead>
                        <TableHead className="text-right">Valor</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {activeOrders.map((order) => (
                        <TableRow key={order.cliente}>
                          <TableCell className="font-medium">
                            {order.cliente}
                          </TableCell>
                          <TableCell>{order.status}</TableCell>
                          <TableCell>{order.andamento}</TableCell>
                          <TableCell>{order.prazo}</TableCell>
                          <TableCell className="text-right">
                            {order.valor}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>

              <div className="rounded-xl border border-border/60 bg-background/80 p-4">
                <p className="text-sm font-semibold">Pedidos</p>
                <div className="mt-4 flex items-center justify-center">
                  <div className="relative size-24">
                    <div className="absolute inset-0 rounded-full border-[10px] border-muted/50" />
                    <div className="absolute inset-0 rotate-[-90deg]">
                      <svg viewBox="0 0 100 100" className="h-full w-full">
                        <circle
                          cx="50"
                          cy="50"
                          r="40"
                          className="fill-none stroke-foreground stroke-[10]"
                          strokeDasharray="180 80"
                        />
                      </svg>
                    </div>
                  </div>
                </div>
                <div className="mt-3 flex justify-center gap-3 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <span className="size-2 rounded-full bg-muted-foreground/60" />
                    Entregues
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="size-2 rounded-full bg-muted/60" />
                    Cancelados
                  </span>
                </div>
              </div>
            </div>

            <div className="rounded-xl border border-border/60 bg-background/80 p-4">
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold">Fila de Espera</p>
                <Button variant="outline" size="sm">
                  Ver detalhes
                </Button>
              </div>
              <div className="mt-3 space-y-2">
                {Array.from({ length: 3 }).map((_, index) => (
                  <div
                    key={`wait-${index}`}
                    className="h-6 rounded-md bg-muted/50"
                  />
                ))}
              </div>
            </div>

          </div>

          <div className="space-y-6">
            <div className="rounded-xl border border-border/60 bg-background/80 p-4">
              <p className="text-sm font-semibold">Saldo da conta</p>
              <p className="mt-2 text-2xl font-semibold">R$ 4.280,90</p>
              <p className="text-xs text-muted-foreground">
                Ultima atualizacao hoje
              </p>
              <div className="mt-3 space-y-2">
                <Button className="w-full" variant="secondary">
                  Ver extrato
                </Button>
                <Button className="w-full" variant="outline">
                  Solicitar saque
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
