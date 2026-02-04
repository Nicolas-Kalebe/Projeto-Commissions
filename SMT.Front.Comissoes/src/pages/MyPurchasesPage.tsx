import { useMemo, useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  BadgeCheck,
  Calendar,
  Clock,
  Download,
  MessageCircle,
  Search,
  SlidersHorizontal,
  Sparkles,
} from "lucide-react"

type OrderStage =
  | "comecando"
  | "lineart"
  | "colorindo"
  | "sombreando"
  | "ajustes"
  | "concluido"

type PurchaseOrder = {
  id: string
  titulo: string
  artista: string
  imagem: string
  preco: number
  data: string
  prazo: string
  stage: OrderStage
  tags: string[]
  entrega: "ativa" | "aguardando" | "concluida"
  revisoes: number
}

const stageOptions: { value: OrderStage; label: string }[] = [
  { value: "comecando", label: "Comecando em breve" },
  { value: "lineart", label: "Lineart" },
  { value: "colorindo", label: "Colorindo" },
  { value: "sombreando", label: "Sombreando" },
  { value: "ajustes", label: "Ajustes finais" },
  { value: "concluido", label: "Concluido" },
]

const ordersSeed: PurchaseOrder[] = [
  {
    id: "PC-4821",
    titulo: "Retrato Neon da Aurora",
    artista: "Nicolas Kalebe",
    imagem: "/mock_arts/mock_2.jpg",
    preco: 220,
    data: new Date().toISOString(),
    prazo: "24/01/2026",
    stage: "lineart",
    tags: ["#Retrato", "#Neon", "#Anime"],
    entrega: "ativa",
    revisoes: 1,
  },
  {
    id: "PC-4758",
    titulo: "Cena Fantastica do Bosque",
    artista: "Renato Kaori",
    imagem: "/mock_arts/mock_1.jpg",
    preco: 420,
    data: new Date(Date.now() - 1000 * 60 * 60 * 6).toISOString(),
    prazo: "26/01/2026",
    stage: "colorindo",
    tags: ["#Fantasy", "#Nature", "#Magic"],
    entrega: "ativa",
    revisoes: 2,
  },
  {
    id: "PC-4682",
    titulo: "Personagem Concept Art",
    artista: "Nicolas Kalebe",
    imagem: "/mock_arts/mock_3.jpg",
    preco: 180,
    data: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
    prazo: "22/01/2026",
    stage: "sombreando",
    tags: ["#Concept", "#Character"],
    entrega: "ativa",
    revisoes: 0,
  },
  {
    id: "PC-4594",
    titulo: "Cartaz Retro 8-bit",
    artista: "Renato Kaori",
    imagem: "/mock_arts/mock_2.jpg",
    preco: 90,
    data: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3).toISOString(),
    prazo: "19/01/2026",
    stage: "concluido",
    tags: ["#PixelArt", "#Retro"],
    entrega: "concluida",
    revisoes: 1,
  },
  {
    id: "PC-4520",
    titulo: "Ilustracao Editorial",
    artista: "Nicolas Kalebe",
    imagem: "/mock_arts/mock_3.jpg",
    preco: 310,
    data: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7).toISOString(),
    prazo: "12/01/2026",
    stage: "ajustes",
    tags: ["#Editorial", "#Moody"],
    entrega: "aguardando",
    revisoes: 3,
  },
]

const entregaLabels: Record<PurchaseOrder["entrega"], string> = {
  ativa: "Em producao",
  aguardando: "Aguardando voce",
  concluida: "Entrega final",
}

const entregaBadgeVariant: Record<
  PurchaseOrder["entrega"],
  "default" | "secondary" | "outline"
> = {
  ativa: "default",
  aguardando: "secondary",
  concluida: "outline",
}

const formatCurrency = (value: number) =>
  `R$ ${value.toFixed(2).replace(".", ",")}`

const formatDateLabel = (value: string) => {
  const date = new Date(value)
  const today = new Date()
  const isSameDay =
    date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear()
  if (isSameDay) return "Hoje"

  const yesterday = new Date()
  yesterday.setDate(today.getDate() - 1)
  const isYesterday =
    date.getDate() === yesterday.getDate() &&
    date.getMonth() === yesterday.getMonth() &&
    date.getFullYear() === yesterday.getFullYear()
  if (isYesterday) return "Ontem"

  const months = [
    "Jan",
    "Fev",
    "Mar",
    "Abr",
    "Mai",
    "Jun",
    "Jul",
    "Ago",
    "Set",
    "Out",
    "Nov",
    "Dez",
  ]
  return `${date.getDate().toString().padStart(2, "0")} ${
    months[date.getMonth()]
  } ${date.getFullYear()}`
}

export function MyPurchasesPage() {
  const [orders] = useState(ordersSeed)
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<"todos" | OrderStage>(
    "todos"
  )
  const [sortBy, setSortBy] = useState("recentes")

  const filteredOrders = useMemo(() => {
    let next = [...orders]

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      next = next.filter(
        (order) =>
          order.titulo.toLowerCase().includes(query) ||
          order.artista.toLowerCase().includes(query) ||
          order.id.toLowerCase().includes(query)
      )
    }

    if (statusFilter !== "todos") {
      next = next.filter((order) => order.stage === statusFilter)
    }

    next.sort((a, b) => {
      const aTime = new Date(a.data).getTime()
      const bTime = new Date(b.data).getTime()
      if (sortBy === "antigos") return aTime - bTime
      return bTime - aTime
    })

    return next
  }, [orders, searchQuery, statusFilter, sortBy])

  const groupedOrders = useMemo(() => {
    return filteredOrders.reduce<Record<string, PurchaseOrder[]>>(
      (acc, order) => {
        const label = formatDateLabel(order.data)
        if (!acc[label]) acc[label] = []
        acc[label].push(order)
        return acc
      },
      {}
    )
  }, [filteredOrders])

  const totals = useMemo(() => {
    const active = orders.filter((order) => order.entrega !== "concluida").length
    const delivered = orders.filter((order) => order.entrega === "concluida").length
    const awaiting = orders.filter((order) => order.entrega === "aguardando").length
    return { active, delivered, awaiting }
  }, [orders])

  const stageProgress = (stage: OrderStage) => {
    const index = stageOptions.findIndex((item) => item.value === stage)
    const percent = Math.round((index / (stageOptions.length - 1)) * 100)
    return percent
  }

  const stageLabel = (stage: OrderStage) =>
    stageOptions.find((option) => option.value === stage)?.label ?? "Em progresso"

  return (
    <section className="space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-wide text-muted-foreground">
            Minhas compras
          </p>
          <h1 className="text-2xl font-semibold">Pedidos por data</h1>
          <p className="mt-2 max-w-xl text-sm text-muted-foreground">
            Acompanhe o andamento das suas comissoes, revise entregas e converse
            com os artistas sem sair da mesma tela.
          </p>
          <div className="mt-4 flex flex-wrap gap-3">
            <div className="flex items-baseline gap-2 rounded-xl border border-border/60 bg-background/80 px-4 py-3">
              <span className="text-2xl font-semibold">{orders.length}</span>
              <span className="text-sm text-muted-foreground">Pedidos</span>
            </div>
            <div className="flex items-baseline gap-2 rounded-xl border border-border/60 bg-background/80 px-4 py-3">
              <span className="text-2xl font-semibold">{totals.active}</span>
              <span className="text-sm text-muted-foreground">Ativos</span>
            </div>
            <div className="flex items-baseline gap-2 rounded-xl border border-border/60 bg-background/80 px-4 py-3">
              <span className="text-2xl font-semibold">{totals.awaiting}</span>
              <span className="text-sm text-muted-foreground">Aguardando</span>
            </div>
            <div className="flex items-baseline gap-2 rounded-xl border border-border/60 bg-background/80 px-4 py-3">
              <span className="text-2xl font-semibold">{totals.delivered}</span>
              <span className="text-sm text-muted-foreground">Entregues</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="gap-2">
            <Download className="size-4" />
            Exportar
          </Button>
          <Button size="sm" className="gap-2">
            <Sparkles className="size-4" />
            Novo pedido
          </Button>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3 rounded-xl border border-border/60 bg-background/80 p-4">
        <div className="relative flex-1 min-w-[220px]">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
            className="pl-9"
            placeholder="Buscar por titulo, artista ou numero do pedido"
          />
        </div>
        <Select
          value={statusFilter}
          onValueChange={(value) => setStatusFilter(value as OrderStage | "todos")}
        >
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Status da arte" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="todos">Todos os status</SelectItem>
            {stageOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={sortBy} onValueChange={setSortBy}>
          <SelectTrigger className="w-[170px]">
            <SelectValue placeholder="Ordenar" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="recentes">Mais recentes</SelectItem>
            <SelectItem value="antigos">Mais antigos</SelectItem>
          </SelectContent>
        </Select>
        <Button variant="outline" size="icon" className="shrink-0">
          <SlidersHorizontal className="size-4" />
        </Button>
      </div>

      <div className="space-y-6">
        {Object.entries(groupedOrders).map(([dateLabel, dateOrders]) => (
          <div key={dateLabel} className="space-y-3">
            <div className="flex items-center gap-2 border-b pb-2 text-sm font-semibold">
              <Calendar className="size-4 text-muted-foreground" />
              {dateLabel}
              <span className="text-xs text-muted-foreground">
                ({dateOrders.length} pedidos)
              </span>
            </div>
            <div className="space-y-4">
              {dateOrders.map((order) => (
                <Card
                  key={order.id}
                  className="border-border/60 bg-background/80"
                >
                  <CardContent className="grid gap-4 p-4 md:grid-cols-[140px_1fr_auto]">
                    <div className="overflow-hidden rounded-lg border bg-muted/20">
                      <img
                        src={order.imagem}
                        alt={order.titulo}
                        className="h-full w-full object-cover"
                      />
                    </div>

                    <div className="space-y-3">
                      <div className="flex flex-wrap items-center gap-2">
                        <Badge variant={entregaBadgeVariant[order.entrega]}>
                          {entregaLabels[order.entrega]}
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          Pedido {order.id}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {order.revisoes} revisoes
                        </span>
                      </div>
                      <div>
                        <p className="text-lg font-semibold">{order.titulo}</p>
                        <p className="text-sm text-muted-foreground">
                          Artista: {order.artista}
                        </p>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {order.tags.map((tag) => (
                          <Badge key={tag} variant="secondary">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                      <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Clock className="size-3.5" />
                          Entrega prevista: {order.prazo}
                        </span>
                        <span className="flex items-center gap-1">
                          <BadgeCheck className="size-3.5" />
                          Pagamento confirmado
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="h-2 w-full rounded-full bg-muted/40">
                          <div
                            className="h-full rounded-full bg-foreground/70"
                            style={{ width: `${stageProgress(order.stage)}%` }}
                          />
                        </div>
                        <span className="text-xs text-muted-foreground">
                          {stageProgress(order.stage)}%
                        </span>
                      </div>
                    </div>

                    <div className="flex w-full flex-col items-start gap-3 md:items-end">
                      <p className="text-lg font-semibold">
                        {formatCurrency(order.preco)}
                      </p>
                      <div className="flex items-center gap-2 rounded-lg border border-border/60 bg-background px-3 py-2 text-xs font-medium text-muted-foreground">
                        <span className="h-1.5 w-1.5 rounded-full bg-foreground/70" />
                        Status: {stageLabel(order.stage)}
                      </div>
                      <div className="flex flex-wrap gap-2">
                        <Button variant="secondary" size="sm">
                          Abrir detalhes
                        </Button>
                        <Button variant="outline" size="sm" className="gap-1.5">
                          <MessageCircle className="size-3.5" />
                          Mensagem
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
