import { useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { arts, users } from "@/data"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
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
  { key: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { key: "analytics", label: "Analytics", icon: BarChart3 },
  { key: "carteira", label: "Carteira", icon: Wallet },
  { key: "comissoes", label: "Comissoes", icon: FileText },
  { key: "portfolio", label: "Portfolio", icon: FolderKanban },
]

const preferenceItems = [
  { label: "Configuracoes", icon: Settings },
  { label: "Ajuda & Suporte", icon: HelpCircle },
]

const activeOrders = [
  {
    cliente: "Marina Souza",
    status: "Em andamento",
    andamento: "60%",
    prazo: "12 dias",
    valor: "R$ 420,00",
  },
  {
    cliente: "Renato Kaori",
    status: "Revisao",
    andamento: "85%",
    prazo: "4 dias",
    valor: "R$ 780,00",
  },
  {
    cliente: "Luna Azevedo",
    status: "Briefing",
    andamento: "25%",
    prazo: "18 dias",
    valor: "R$ 320,00",
  },
]

const waitlistOrders = [
  {
    cliente: "Paula Mendes",
    tipo: "Ilustracao completa",
    prazo: "5 dias",
    valor: "R$ 560,00",
  },
  {
    cliente: "Joao Pedro",
    tipo: "Arte para capa",
    prazo: "8 dias",
    valor: "R$ 420,00",
  },
  {
    cliente: "Tania Souza",
    tipo: "Character design",
    prazo: "12 dias",
    valor: "R$ 780,00",
  },
]

const walletTransactions = [
  { descricao: "Pagamento #2041", tipo: "Entrada", data: "12/05", valor: "R$ 860,00" },
  { descricao: "Saque solicitado", tipo: "Saida", data: "10/05", valor: "R$ 300,00" },
  { descricao: "Pagamento #2033", tipo: "Entrada", data: "08/05", valor: "R$ 520,00" },
]

const analyticsSummary = [
  { label: "Conversao", value: "12,8%" },
  { label: "Visitas", value: "18.240" },
  { label: "Tempo medio", value: "2m 14s" },
]

const analyticsHighlights = {
  views: {
    label: "Mais visualizada",
    title: "Retrato da Aurora",
    artist: "Camila Rocha",
    total: "12.430 visualizacoes",
    likes: "1.240",
    saves: "480",
    profileEntries: "312",
    tags: ["Retrato", "Pastel", "Luz suave"],
  },
  sales: {
    label: "Mais comprada",
    title: "Neon Garden",
    artist: "Rafael Lima",
    total: "36 compras",
    likes: "980",
    saves: "260",
    profileEntries: "198",
    tags: ["Neon", "Futurista", "Paisagem"],
  },
}

export function DashboardPage() {
  const user = users[1]
  const [activeMenu, setActiveMenu] = useState("dashboard")
  const [highlightMode, setHighlightMode] = useState<"views" | "sales">("views")
  const highlight = analyticsHighlights[highlightMode]
  const [isRangeOpen, setIsRangeOpen] = useState(false)
  const [startDate, setStartDate] = useState("2024-04-01")
  const [endDate, setEndDate] = useState("2024-05-31")
  const [isAnalyticsRangeOpen, setIsAnalyticsRangeOpen] = useState(false)
  const [analyticsStartDate, setAnalyticsStartDate] = useState("2025-12-30")
  const [analyticsEndDate, setAnalyticsEndDate] = useState("2026-01-26")
  const [analyticsTab, setAnalyticsTab] = useState("visao")
  const [channelMetric, setChannelMetric] = useState<"views" | "watchTime" | "subscribers">("views")
  const [portfolioPosts, setPortfolioPosts] = useState(() =>
    arts
      .filter((art) => art.artistId === user.id)
      .map((art, index) => ({
        id: art.id,
        titulo: art.titulo,
        preco: art.preco,
        tags: art.tags ?? [],
        images: [
          art.imageUrl,
          ...(index % 2 === 0 ? ["/mock_arts/mock_2.jpg"] : []),
        ],
      }))
  )
  const [editingPostId, setEditingPostId] = useState<string | null>(null)
  const [draftPost, setDraftPost] = useState<{
    id: string
    titulo: string
    preco: number
    tags: string[]
    images: string[]
  } | null>(null)
  const [newImageUrl, setNewImageUrl] = useState("")

  const formatRangeLabel = (value: string) => {
    const label = format(new Date(value), "MMM yyyy", { locale: ptBR })
    return `${label.charAt(0).toUpperCase()}${label.slice(1)}`.replace(".", "")
  }

  const formatPrice = (value: number) =>
    new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
      minimumFractionDigits: 0,
    }).format(value)

  const channelMetrics = {
    views: {
      label: "Visualizacoes",
      value: "0",
      path: "M0 92 L30 80 L60 76 L90 70 L120 68 L150 62 L180 58 L210 54 L240 46 L270 42 L300 36 L330 30 L360 26 L390 18 L400 14",
    },
    watchTime: {
      label: "Tempo de exibicao",
      value: "0h",
      path: "M0 92 L30 90 L60 84 L90 80 L120 72 L150 66 L180 65 L210 60 L240 52 L270 48 L300 42 L330 38 L360 34 L390 28 L400 24",
    },
    subscribers: {
      label: "Inscritos",
      value: "0",
      path: "M0 96 L30 95 L60 94 L90 92 L120 90 L150 87 L180 84 L210 80 L240 76 L270 72 L300 64 L330 58 L360 52 L390 42 L400 38",
    },
  } as const
  const selectedChannelMetric = channelMetrics[channelMetric]

  return (
    <section className="w-full">
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
                  const isActive = activeMenu === item.key
                  return (
                    <Button
                      key={item.key}
                      variant="ghost"
                      className={`w-full justify-start gap-2 ${
                        isActive
                          ? "bg-muted text-foreground"
                          : "text-muted-foreground hover:text-foreground"
                      }`}
                      onClick={() => setActiveMenu(item.key)}
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
                  )
                })}
              </div>
            </div>

            <div className="pt-2">
              <p className="text-xs font-semibold uppercase text-muted-foreground">
                Avaliacao Media
              </p>
              <div className="mt-2 flex items-center justify-start gap-1 text-yellow-400">
                {Array.from({ length: 5 }).map((_, index) => (
                  <Star key={`rating-${index}`} className="size-4 fill-current" />
                ))}
              </div>
            </div>
          </div>
        </aside>

        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_240px]">
          <div className="space-y-6">
            {activeMenu === "dashboard" && (
              <>
                <div className="rounded-xl border border-border/60 bg-background/80 p-6">
                  <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-muted-foreground">
                    <span>Ganhos Mensais</span>
                    <div className="relative">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setIsRangeOpen((open) => !open)}
                      >
                        {formatRangeLabel(startDate)} - {formatRangeLabel(endDate)}
                      </Button>
                      {isRangeOpen && (
                        <div className="absolute right-0 top-full z-10 mt-2 w-64 rounded-xl border border-border/60 bg-background p-3 text-xs shadow-md">
                          <div className="grid gap-3">
                            <div>
                              <label className="text-[11px] font-semibold uppercase text-muted-foreground">
                                De
                              </label>
                              <input
                                type="date"
                                value={startDate}
                                onChange={(event) => setStartDate(event.target.value)}
                                className="mt-1 w-full rounded-md border border-border/60 bg-background px-2 py-1 text-xs"
                              />
                            </div>
                            <div>
                              <label className="text-[11px] font-semibold uppercase text-muted-foreground">
                                Ate
                              </label>
                              <input
                                type="date"
                                value={endDate}
                                onChange={(event) => setEndDate(event.target.value)}
                                className="mt-1 w-full rounded-md border border-border/60 bg-background px-2 py-1 text-xs"
                              />
                            </div>
                            <Button
                              size="sm"
                              variant="secondary"
                              onClick={() => setIsRangeOpen(false)}
                            >
                              Aplicar
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="mt-4 h-56 rounded-lg bg-[linear-gradient(180deg,rgba(0,0,0,0.25),transparent)]">
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

                <div className="grid gap-6 lg:grid-cols-2">
                  <div className="rounded-xl border border-border/60 bg-background/80 p-6">
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

                  <div className="rounded-xl border border-border/60 bg-background/80 p-6">
                    <p className="text-sm font-semibold">Pedidos</p>
                    <div className="mt-4 flex items-center justify-center">
                      <div className="relative size-28">
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

                <div className="rounded-xl border border-border/60 bg-background/80 p-6">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-semibold">Fila de Espera</p>
                    <Button variant="outline" size="sm">
                      Ver detalhes
                    </Button>
                  </div>
                  <div className="mt-4 rounded-lg border border-border/60">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Cliente</TableHead>
                          <TableHead>Tipo</TableHead>
                          <TableHead>Prazo</TableHead>
                          <TableHead className="text-right">Valor</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {waitlistOrders.map((order) => (
                          <TableRow key={`${order.cliente}-${order.tipo}`}>
                            <TableCell className="font-medium">
                              {order.cliente}
                            </TableCell>
                            <TableCell>{order.tipo}</TableCell>
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
              </>
            )}

            {activeMenu === "carteira" && (
              <>
                <div className="rounded-xl border border-border/60 bg-background/80 p-6">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-semibold">Resumo de Caixa</p>
                    <Button variant="outline" size="sm">
                      Ultimos 30 dias
                    </Button>
                  </div>
                  <div className="mt-4 grid gap-4 md:grid-cols-3">
                    {[
                      { label: "Entradas", value: "R$ 6.420,00" },
                      { label: "Saidas", value: "R$ 2.140,00" },
                      { label: "Saldo Liquido", value: "R$ 4.280,00" },
                    ].map((item) => (
                      <div
                        key={item.label}
                        className="rounded-lg border border-border/60 bg-background/60 p-4"
                      >
                        <p className="text-xs text-muted-foreground">{item.label}</p>
                        <p className="text-lg font-semibold">{item.value}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="rounded-xl border border-border/60 bg-background/80 p-6">
                  <p className="text-sm font-semibold">Historico de Transacoes</p>
                  <div className="mt-4 rounded-lg border border-border/60">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Descricao</TableHead>
                          <TableHead>Tipo</TableHead>
                          <TableHead>Data</TableHead>
                          <TableHead className="text-right">Valor</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {walletTransactions.map((row) => (
                          <TableRow key={`${row.descricao}-${row.data}`}>
                            <TableCell className="font-medium">
                              {row.descricao}
                            </TableCell>
                            <TableCell>{row.tipo}</TableCell>
                            <TableCell>{row.data}</TableCell>
                            <TableCell className="text-right">
                              {row.valor}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </div>
              </>
            )}

            {activeMenu === "analytics" && (
            <>
              <Tabs value={analyticsTab} onValueChange={setAnalyticsTab} className="w-full">
                <div className="rounded-2xl border border-border/60 bg-card/60 p-6">
                  <div className="flex flex-wrap items-center justify-between gap-4">
                    <div>
                      <h2 className="text-lg font-semibold">Estatisticas do canal</h2>
                      <p className="text-xs text-muted-foreground">Resumo geral das ultimas semanas</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <TabsList className="bg-muted/60">
                        <TabsTrigger value="visao">Visao geral</TabsTrigger>
                        <TabsTrigger value="conteudo">Conteudo</TabsTrigger>
                        <TabsTrigger value="publico">Publico</TabsTrigger>
                      </TabsList>
                      <div className="relative">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setIsAnalyticsRangeOpen((open) => !open)}
                        >
                          {formatRangeLabel(analyticsStartDate)} -{" "}
                          {formatRangeLabel(analyticsEndDate)}
                        </Button>
                        {isAnalyticsRangeOpen && (
                          <div className="absolute right-0 top-full z-10 mt-2 w-64 rounded-xl border border-border/60 bg-background p-3 text-xs shadow-md">
                            <div className="grid gap-3">
                              <div>
                                <label className="text-[11px] font-semibold uppercase text-muted-foreground">
                                  De
                                </label>
                                <input
                                  type="date"
                                  value={analyticsStartDate}
                                  onChange={(event) =>
                                    setAnalyticsStartDate(event.target.value)
                                  }
                                  className="mt-1 w-full rounded-md border border-border/60 bg-background px-2 py-1 text-xs"
                                />
                              </div>
                              <div>
                                <label className="text-[11px] font-semibold uppercase text-muted-foreground">
                                  Ate
                                </label>
                                <input
                                  type="date"
                                  value={analyticsEndDate}
                                  onChange={(event) =>
                                    setAnalyticsEndDate(event.target.value)
                                  }
                                  className="mt-1 w-full rounded-md border border-border/60 bg-background px-2 py-1 text-xs"
                                />
                              </div>
                              <Button
                                size="sm"
                                variant="secondary"
                                onClick={() => setIsAnalyticsRangeOpen(false)}
                              >
                                Aplicar
                              </Button>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1fr)_260px]">
                    <div className="rounded-xl border border-border/60 bg-background/60 p-5">
                      <div className="flex items-center justify-between gap-3">
                        <div>
                          <h3 className="text-base font-semibold">Sem visualizacoes no periodo</h3>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <span className="inline-flex h-2 w-2 rounded-full bg-emerald-400" />
                          Atualizando
                        </div>
                      </div>

                      <div className="mt-5 grid gap-3 sm:grid-cols-3">
                        {(
                          [
                            { key: "views", label: "Visualizacoes", value: channelMetrics.views.value },
                            { key: "watchTime", label: "Tempo de exibicao", value: channelMetrics.watchTime.value },
                            { key: "subscribers", label: "Inscritos", value: channelMetrics.subscribers.value },
                          ] as const
                        ).map((item) => (
                          <Button
                            key={item.key}
                            type="button"
                            variant="outline"
                            className={`h-auto flex-col items-start gap-1 border-border/60 p-3 text-left ${
                              channelMetric === item.key ? "bg-muted" : ""
                            }`}
                            onClick={() => setChannelMetric(item.key)}
                          >
                            <span className="text-xs text-muted-foreground">{item.label}</span>
                            <span className="text-lg font-semibold">{item.value}</span>
                          </Button>
                        ))}
                      </div>

                      <div className="mt-6 rounded-lg border border-border/70 bg-background/60 p-3">
                        <div className="mb-2 text-xs text-muted-foreground">
                          {selectedChannelMetric.label}
                        </div>
                        <div className="h-40 w-full">
                          <svg viewBox="0 0 400 120" className="h-full w-full">
                            <path
                              d={`${selectedChannelMetric.path} L400 120 L0 120 Z`}
                              className="fill-primary/15"
                            />
                            <path
                              d={selectedChannelMetric.path}
                              className="fill-none stroke-primary"
                              strokeWidth="3"
                              strokeLinecap="round"
                            />
                          </svg>
                        </div>
                      </div>
                    </div>

                    <div className="rounded-xl border border-border/60 bg-background/60 p-5">
                      <div className="flex items-center justify-between">
                        <h3 className="text-sm font-semibold">Em tempo real</h3>
                        <span className="text-xs text-muted-foreground">0 inscritos</span>
                      </div>
                      <div className="mt-4 space-y-4">
                        <div>
                          <p className="text-xs text-muted-foreground">Visualizacoes - ultimas 48 horas</p>
                          <p className="mt-2 text-2xl font-semibold">0</p>
                        </div>
                        <div className="h-24 rounded-lg border border-dashed border-border/70 bg-muted/30" />
                      </div>
                    </div>
                  </div>
                </div>

                <TabsContent value="visao" className="mt-6 space-y-6">
                  <div className="grid gap-4 md:grid-cols-3">
                    {[
                      { label: "Cliques no perfil", value: "0" },
                      { label: "Mensagens recebidas", value: "0" },
                      { label: "Novos seguidores", value: "0" },
                    ].map((item) => (
                      <div
                        key={item.label}
                        className="rounded-lg border border-border/60 bg-background/80 p-4 text-center"
                      >
                        <p className="text-xs text-muted-foreground">{item.label}</p>
                        <p className="mt-2 text-lg font-semibold">{item.value}</p>
                      </div>
                    ))}
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="rounded-xl border border-border/60 bg-background/60 p-4">
                      <p className="text-xs text-muted-foreground">Performance geral</p>
                      <p className="mt-2 text-2xl font-semibold">74%</p>
                      <p className="text-xs text-muted-foreground">+8% em relacao ao mes passado</p>
                    </div>
                    <div className="rounded-xl border border-border/60 bg-background/60 p-4">
                      <p className="text-xs text-muted-foreground">Meta do mes</p>
                      <p className="mt-2 text-2xl font-semibold">R$ 8.400</p>
                      <p className="text-xs text-muted-foreground">R$ 2.100 restantes</p>
                    </div>
                    <div className="rounded-xl border border-border/60 bg-background/60 p-4">
                      <p className="text-xs text-muted-foreground">Audiencia</p>
                      <p className="mt-2 text-2xl font-semibold">3.4k</p>
                      <p className="text-xs text-muted-foreground">Usuarios unicos</p>
                    </div>
                    <div className="rounded-xl border border-border/60 bg-background/60 p-4">
                      <p className="text-xs text-muted-foreground">Taxa de retorno</p>
                      <p className="mt-2 text-2xl font-semibold">41%</p>
                      <p className="text-xs text-muted-foreground">Visitantes recorrentes</p>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="conteudo" className="mt-6">
                  <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_1.1fr]">
                    <div className="rounded-xl border border-border/60 bg-background/60 p-5">
                      <p className="text-xs text-muted-foreground">Ultima postagem</p>
                      <h3 className="mt-2 text-lg font-semibold">Destaque do portfolio</h3>
                      <div className="mt-4 flex flex-col gap-4 md:flex-row">
                        <div className="md:w-5/12">
                          <div className="h-full w-full overflow-hidden rounded-lg border border-border/60 aspect-video">
                            <img
                              src="/mock_arts/mock_3.jpg"
                              alt="Arte da ultima postagem"
                              className="h-full w-full object-cover"
                            />
                          </div>
                        </div>
                        <div className="flex-1">
                          <div className="grid gap-3 sm:grid-cols-1">
                            {[
                              { label: "Visualizacoes", value: "1.240" },
                              { label: "Curtidas", value: "312" },
                              { label: "Salvos", value: "88" },
                              { label: "Compartilhamentos", value: "41" },
                            ].map((item) => (
                              <div
                                key={item.label}
                                className="rounded-lg border border-border/60 bg-background/80 p-3"
                              >
                                <p className="text-xs text-muted-foreground">{item.label}</p>
                                <p className="text-lg font-semibold">{item.value}</p>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="rounded-xl border border-border/60 bg-background/60 p-5">
                      <div className="flex flex-wrap items-center justify-between gap-3">
                        <div>
                          <p className="text-xs text-muted-foreground">{highlight.label}</p>
                          <h3 className="text-lg font-semibold">{highlight.title}</h3>
                          <p className="text-xs text-muted-foreground">{highlight.artist}</p>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <span>Mais visualizada</span>
                          <Switch
                            checked={highlightMode === "views"}
                            onCheckedChange={(checked) =>
                              setHighlightMode(checked ? "views" : "sales")
                            }
                            size="lg"
                          />
                          <span>Mais comprada</span>
                        </div>
                      </div>
                      <p className="mt-2 text-xs text-muted-foreground">{highlight.total}</p>
                      <img
                        src={
                          highlightMode === "views"
                            ? "/mock_arts/mock_2.jpg"
                            : "/mock_arts/mock_3.jpg"
                        }
                        alt="Arte em destaque"
                        className="mt-4 h-48 w-full rounded-lg object-cover"
                      />
                      <div className="mt-4 grid gap-3 sm:grid-cols-2">
                        {[
                          { label: "Curtidas", value: highlight.likes },
                          { label: "Salvos", value: highlight.saves },
                          { label: "Entradas no perfil", value: highlight.profileEntries },
                          { label: "Tags", value: highlight.tags.join(" • ") },
                        ].map((item) => (
                          <div
                            key={item.label}
                            className="rounded-lg border border-border/60 bg-background/80 p-3"
                          >
                            <p className="text-xs text-muted-foreground">{item.label}</p>
                            <p className="text-sm font-semibold">{item.value}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="publico" className="mt-6">
                  <div className="grid gap-6 lg:grid-cols-2">
                    <div className="rounded-xl border border-border/60 bg-background/60 p-5">
                      <p className="text-xs text-muted-foreground">Idade</p>
                      <div className="mt-4 space-y-3">
                        {[
                          { label: "18-24", value: "42%" },
                          { label: "25-34", value: "34%" },
                          { label: "35-44", value: "16%" },
                        ].map((item) => (
                          <div key={item.label} className="space-y-1">
                            <div className="flex items-center justify-between text-xs">
                              <span>{item.label}</span>
                              <span className="text-muted-foreground">{item.value}</span>
                            </div>
                            <div className="h-2 rounded-full bg-muted/60">
                              <div className="h-2 rounded-full bg-primary/70" style={{ width: item.value }} />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="rounded-xl border border-border/60 bg-background/60 p-5">
                      <p className="text-xs text-muted-foreground">Genero</p>
                      <div className="mt-4 space-y-3">
                        {[
                          { label: "Feminino", value: "62%" },
                          { label: "Masculino", value: "33%" },
                          { label: "Outro", value: "5%" },
                        ].map((item) => (
                          <div key={item.label} className="space-y-1">
                            <div className="flex items-center justify-between text-xs">
                              <span>{item.label}</span>
                              <span className="text-muted-foreground">{item.value}</span>
                            </div>
                            <div className="h-2 rounded-full bg-muted/60">
                              <div className="h-2 rounded-full bg-emerald-400/70" style={{ width: item.value }} />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="rounded-xl border border-border/60 bg-background/60 p-5">
                      <p className="text-xs text-muted-foreground">Tipo de dispositivo</p>
                      <div className="mt-4 space-y-3">
                        {[
                          { label: "Mobile", value: "82%" },
                          { label: "Desktop", value: "14%" },
                          { label: "Tablet", value: "4%" },
                        ].map((item) => (
                          <div key={item.label} className="space-y-1">
                            <div className="flex items-center justify-between text-xs">
                              <span>{item.label}</span>
                              <span className="text-muted-foreground">{item.value}</span>
                            </div>
                            <div className="h-2 rounded-full bg-muted/60">
                              <div className="h-2 rounded-full bg-violet-400/70" style={{ width: item.value }} />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="rounded-xl border border-border/60 bg-background/60 p-5">
                      <p className="text-xs text-muted-foreground">Locais mais acessados</p>
                      <div className="mt-4 space-y-3">
                        {[
                          { label: "Sao Paulo", value: "28%" },
                          { label: "Rio de Janeiro", value: "19%" },
                          { label: "Lisboa", value: "14%" },
                        ].map((item) => (
                          <div key={item.label} className="space-y-1">
                            <div className="flex items-center justify-between text-xs">
                              <span>{item.label}</span>
                              <span className="text-muted-foreground">{item.value}</span>
                            </div>
                            <div className="h-2 rounded-full bg-muted/60">
                              <div className="h-2 rounded-full bg-sky-400/70" style={{ width: item.value }} />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </>
          )}

          {activeMenu === "portfolio" && (
              <div className="rounded-xl border border-border/60 bg-background/80 p-6">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="text-lg font-semibold">Postagens do perfil</p>
                    <p className="text-xs text-muted-foreground">
                      Gerencie imagens e precos das comissoes publicadas.
                    </p>
                  </div>
                  <Button variant="outline" size="sm">
                    Nova postagem
                  </Button>
                </div>

                <div className="mt-4 rounded-lg border border-border/60">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Postagem</TableHead>
                        <TableHead>Imagens</TableHead>
                        <TableHead className="text-right">Preco</TableHead>
                        <TableHead className="text-right">Acoes</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {portfolioPosts.map((post) => {
                        const isEditing = editingPostId === post.id
                        const current = isEditing && draftPost ? draftPost : post

                        return (
                          <TableRow key={post.id}>
                            <TableCell>
                              <div className="flex items-start gap-3">
                                <div className="h-14 w-20 overflow-hidden rounded-md border border-border/60">
                                  <img
                                    src={current.images[0]}
                                    alt={current.titulo}
                                    className="h-full w-full object-cover"
                                  />
                                </div>
                                <div className="space-y-2">
                                  {isEditing ? (
                                    <Input
                                      value={current.titulo}
                                      onChange={(event) =>
                                        setDraftPost((prev) =>
                                          prev
                                            ? { ...prev, titulo: event.target.value }
                                            : prev
                                        )
                                      }
                                    />
                                  ) : (
                                    <>
                                      <p className="text-sm font-semibold">
                                        {current.titulo}
                                      </p>
                                      <div className="flex flex-wrap gap-2 text-[11px] text-muted-foreground">
                                        {current.tags.map((tag) => (
                                          <span
                                            key={`${post.id}-${tag}`}
                                            className="rounded-full border border-border/60 px-2 py-0.5"
                                          >
                                            {tag}
                                          </span>
                                        ))}
                                      </div>
                                    </>
                                  )}
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="space-y-2">
                                <div className="flex flex-wrap gap-2">
                                  {current.images.map((image, index) => (
                                    <div
                                      key={`${post.id}-img-${index}`}
                                      className="relative h-12 w-16 overflow-hidden rounded-md border border-border/60"
                                    >
                                      <img
                                        src={image}
                                        alt={`${current.titulo} ${index + 1}`}
                                        className="h-full w-full object-cover"
                                      />
                                      {isEditing && (
                                        <Button
                                          variant="secondary"
                                          size="sm"
                                          className="absolute right-1 top-1 h-5 px-2 text-[10px]"
                                          onClick={() =>
                                            setDraftPost((prev) =>
                                              prev
                                                ? {
                                                    ...prev,
                                                    images: prev.images.filter(
                                                      (_, imageIndex) =>
                                                        imageIndex !== index
                                                    ),
                                                  }
                                                : prev
                                            )
                                          }
                                        >
                                          Remover
                                        </Button>
                                      )}
                                    </div>
                                  ))}
                                </div>
                                {isEditing && (
                                  <div className="flex flex-wrap items-center gap-2">
                                    <Input
                                      placeholder="URL da imagem"
                                      value={newImageUrl}
                                      onChange={(event) =>
                                        setNewImageUrl(event.target.value)
                                      }
                                      className="h-8 text-xs"
                                    />
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      onClick={() => {
                                        const nextUrl = newImageUrl.trim()
                                        if (!nextUrl) return
                                        setDraftPost((prev) =>
                                          prev
                                            ? {
                                                ...prev,
                                                images: [...prev.images, nextUrl],
                                              }
                                            : prev
                                        )
                                        setNewImageUrl("")
                                      }}
                                    >
                                      Adicionar imagem
                                    </Button>
                                  </div>
                                )}
                              </div>
                            </TableCell>
                            <TableCell className="text-right">
                              {isEditing ? (
                                <Input
                                  type="number"
                                  min={0}
                                  value={current.preco}
                                  onChange={(event) =>
                                    setDraftPost((prev) =>
                                      prev
                                        ? {
                                            ...prev,
                                            preco: Number(event.target.value),
                                          }
                                        : prev
                                    )
                                  }
                                  className="ml-auto h-8 max-w-[120px] text-right text-xs"
                                />
                              ) : (
                                <span className="text-sm font-semibold">
                                  {formatPrice(current.preco)}
                                </span>
                              )}
                            </TableCell>
                            <TableCell className="text-right">
                              <div className="flex justify-end gap-2">
                                {isEditing ? (
                                  <>
                                    <Button
                                      size="sm"
                                      variant="secondary"
                                      onClick={() => {
                                        if (!draftPost) return
                                        setPortfolioPosts((prev) =>
                                          prev.map((item) =>
                                            item.id === draftPost.id
                                              ? {
                                                  ...item,
                                                  titulo: draftPost.titulo,
                                                  preco: draftPost.preco,
                                                  images: draftPost.images,
                                                }
                                              : item
                                          )
                                        )
                                        setEditingPostId(null)
                                        setDraftPost(null)
                                        setNewImageUrl("")
                                      }}
                                    >
                                      Salvar
                                    </Button>
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      onClick={() => {
                                        setEditingPostId(null)
                                        setDraftPost(null)
                                        setNewImageUrl("")
                                      }}
                                    >
                                      Cancelar
                                    </Button>
                                  </>
                                ) : (
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => {
                                      setEditingPostId(post.id)
                                      setDraftPost({
                                        id: post.id,
                                        titulo: post.titulo,
                                        preco: post.preco,
                                        tags: post.tags,
                                        images: [...post.images],
                                      })
                                      setNewImageUrl("")
                                    }}
                                  >
                                    Editar
                                  </Button>
                                )}
                              </div>
                            </TableCell>
                          </TableRow>
                        )
                      })}
                    </TableBody>
                  </Table>
                </div>
              </div>
            )}
          </div>

          <div className="space-y-6">
            {activeMenu === "analytics" && (
              <>
              </>
            )}
          </div>
        </div>
      </div>
</section>
  )
}


