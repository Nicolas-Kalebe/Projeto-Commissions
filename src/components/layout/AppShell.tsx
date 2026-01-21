import { useMemo, useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Slider } from "@/components/ui/slider"
import { Textarea } from "@/components/ui/textarea"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ArtCard } from "@/components/feed/ArtCard"
import { ArtistProfile } from "@/pages/ArtistProfile"
import { CommissionModal } from "@/pages/CommissionModal"
import { arts, moderationReports, notifications, users } from "@/data"
import { cn } from "@/lib/utils"
import {
  Bell,
  Compass,
  Home,
  PlusSquare,
  ShieldCheck,
  User,
} from "lucide-react"

type NavKey = "inicio" | "dashboard" | "explorar" | "nova" | "notificacoes" | "perfil"

const navItems: { key: NavKey; label: string; icon: React.ElementType }[] = [
  { key: "inicio", label: "InÃ­cio", icon: Home },
  { key: "dashboard", label: "Dashboard", icon: ShieldCheck },
  { key: "explorar", label: "Explorar", icon: Compass },
  { key: "nova", label: "Nova Arte", icon: PlusSquare },
  { key: "notificacoes", label: "NotificaÃ§Ãµes", icon: Bell },
  { key: "perfil", label: "Perfil", icon: User },
]

export function AppShell() {
  const [active, setActive] = useState<NavKey>("inicio")
  const [commissionOpen, setCommissionOpen] = useState(false)
  const [selectedPrice, setSelectedPrice] = useState(100)
  const [priceRange, setPriceRange] = useState<[number, number]>([50, 300])

  const artistMap = useMemo(
    () => new Map(users.map((user) => [user.id, user])),
    []
  )

  const activeLabel = navItems.find((item) => item.key === active)?.label

  const handleRequestCommission = (price: number) => {
    setSelectedPrice(price)
    setCommissionOpen(true)
  }

  const shellContent = (
    <div className="space-y-10 pb-24 lg:pb-10">
      {active === "inicio" && (
        <>
          <section className="space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-wide text-muted-foreground">
                  Destaques do dia
                </p>
                <h1 className="text-2xl font-semibold">Feed de Artes</h1>
              </div>
              <Badge variant="secondary">Curadoria Segura</Badge>
            </div>
            <div className="columns-1 gap-4 sm:columns-2 xl:columns-3">
              {arts.map((art) => {
                const artist = artistMap.get(art.artistId)
                if (!artist) return null
                return <ArtCard key={art.id} art={art} artist={artist} />
              })}
            </div>
          </section>
        </>
      )}

      {active === "dashboard" && (
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-wide text-muted-foreground">
                Painel interno
              </p>
              <h2 className="text-xl font-semibold">Painel Administrativo</h2>
            </div>
            <Button variant="outline" size="sm">
              Ver relatÇürios
            </Button>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            {[
              { label: "Volume Transacionado", value: "R$ 82.450,00" },
              { label: "Receita (Taxas)", value: "R$ 8.245,00" },
              { label: "Disputas Abertas", value: "12" },
            ].map((metric) => (
              <Card key={metric.label} className="border-border/60 bg-card/95">
                <CardHeader>
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    {metric.label}
                  </CardTitle>
                </CardHeader>
                <CardContent className="pb-6">
                  <p className="text-2xl font-semibold">{metric.value}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card className="border-border/60 bg-card/95">
            <CardHeader>
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Lista de ModeraÇõÇœo
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ConteÇ§do</TableHead>
                    <TableHead>Motivo</TableHead>
                    <TableHead>Autor</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">AÇõÇæes</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {moderationReports.map((report) => (
                    <TableRow key={report.id}>
                      <TableCell>{report.conteudo}</TableCell>
                      <TableCell>{report.motivo}</TableCell>
                      <TableCell>{report.autor}</TableCell>
                      <TableCell>
                        <Badge variant={report.status === "novo" ? "default" : "outline"}>
                          {report.status === "novo" ? "Novo" : "Revisado"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button variant="ghost" size="sm">
                            Ignorar
                          </Button>
                          <Button variant="destructive" size="sm">
                            Banir
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </section>
      )}

      {active === "explorar" && (
        <section className="space-y-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-xs uppercase tracking-wide text-muted-foreground">
                Descoberta
              </p>
              <h1 className="text-2xl font-semibold">Explorar artistas</h1>
            </div>
            <div className="flex w-full flex-col gap-3 sm:flex-row sm:items-center lg:w-auto">
              <Input placeholder="Buscar estilos ou artistas" />
              <Select defaultValue="relevancia">
                <SelectTrigger className="w-full sm:w-48">
                  <SelectValue placeholder="Ordenar por" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="relevancia">RelevÃ¢ncia</SelectItem>
                  <SelectItem value="recentes">Mais recentes</SelectItem>
                  <SelectItem value="preco">Menor preÃ§o</SelectItem>
                </SelectContent>
              </Select>
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="outline">Filtros</Button>
                </SheetTrigger>
                <SheetContent side="right">
                  <SheetHeader>
                    <SheetTitle>Filtros avanÃ§ados</SheetTitle>
                    <SheetDescription>
                      Ajuste o estilo, prazo e faixa de preÃ§o.
                    </SheetDescription>
                  </SheetHeader>
                  <div className="mt-6 space-y-4">
                    <div className="space-y-2">
                      <p className="text-sm font-medium">Estilo</p>
                      <Select defaultValue="anime">
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="anime">Anime</SelectItem>
                          <SelectItem value="realismo">Realismo</SelectItem>
                          <SelectItem value="pixel">Pixel Art</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm font-medium">Prazo</p>
                      <Select defaultValue="7dias">
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="7dias">AtÃ© 7 dias</SelectItem>
                          <SelectItem value="15dias">AtÃ© 15 dias</SelectItem>
                          <SelectItem value="30dias">AtÃ© 30 dias</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm font-medium">Faixa de preÃ§o</p>
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span>
                          R${" "}
                          {priceRange[0].toLocaleString("pt-BR", {
                            minimumFractionDigits: 0,
                          })}
                        </span>
                        <span>
                          R${" "}
                          {priceRange[1].toLocaleString("pt-BR", {
                            minimumFractionDigits: 0,
                          })}
                        </span>
                      </div>
                      <Slider
                        value={priceRange}
                        onValueChange={(value) => setPriceRange([value[0], value[1]])}
                        min={50}
                        max={300}
                        step={10}
                      />
                    </div>
                    <Button className="w-full">Aplicar filtros</Button>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {arts.slice(0, 6).map((art) => {
              const artist = artistMap.get(art.artistId)
              if (!artist) return null
              return <ArtCard key={art.id} art={art} artist={artist} />
            })}
          </div>
        </section>
      )}

      {active === "nova" && (
        <section className="space-y-4">
          <div>
            <p className="text-xs uppercase tracking-wide text-muted-foreground">
              Novo projeto
            </p>
            <h1 className="text-2xl font-semibold">Criar nova arte</h1>
          </div>
          <Card className="border-border/60 bg-card/95">
            <CardContent className="space-y-4 pt-6">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <p className="text-sm font-medium">TÃ­tulo</p>
                  <Input placeholder="Ex: Retrato futurista" />
                </div>
                <div className="space-y-2">
                  <p className="text-sm font-medium">PreÃ§o base</p>
                  <Input placeholder="R$ 120,00" />
                </div>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <p className="text-sm font-medium">Categoria</p>
                  <Select defaultValue="ilustracao">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ilustracao">IlustraÃ§Ã£o</SelectItem>
                      <SelectItem value="pixel">Pixel Art</SelectItem>
                      <SelectItem value="3d">3D Render</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <p className="text-sm font-medium">NÃ­vel de conteÃºdo</p>
                  <Select defaultValue="seguro">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="seguro">Seguro</SelectItem>
                      <SelectItem value="sensivel">SensÃ­vel</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <p className="text-sm font-medium">DescriÃ§Ã£o</p>
                <Textarea placeholder="Descreva seu projeto e referÃªncias" />
              </div>
              <Button className="w-full">Publicar arte</Button>
            </CardContent>
          </Card>
        </section>
      )}

      {active === "notificacoes" && (
        <section className="space-y-4">
          <div>
            <p className="text-xs uppercase tracking-wide text-muted-foreground">
              Central
            </p>
            <h1 className="text-2xl font-semibold">NotificaÃ§Ãµes</h1>
          </div>
          <div className="space-y-3">
            {notifications.map((item) => (
              <Card key={item.id} className="border-border/60 bg-card/95">
                <CardContent className="space-y-2 pt-6">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-semibold">{item.titulo}</p>
                    <Badge variant="outline">{item.horario}</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {item.descricao}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      )}

      {active === "perfil" && (
        <ArtistProfile onRequestCommission={handleRequestCommission} />
      )}
    </div>
  )

  return (
    <div className="min-h-svh bg-background text-foreground">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(1200px_600px_at_30%_-20%,oklch(0.98_0.02_90),transparent)]" />
      <div className="flex">
        <aside className="hidden h-svh w-64 flex-col border-r bg-background/80 px-4 py-6 backdrop-blur lg:flex">
          <div className="flex items-center gap-2 px-2">
            <div className="flex size-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <ShieldCheck className="size-5" />
            </div>
            <div>
              <p className="text-sm font-semibold">AteliÃª Seguro</p>
              <p className="text-xs text-muted-foreground">ComissÃµes protegidas</p>
            </div>
          </div>
          <div className="mt-8 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon
              return (
                <Button
                  key={item.key}
                  variant="ghost"
                  className={cn(
                    "w-full justify-start gap-2",
                    active === item.key && "bg-muted text-foreground"
                  )}
                  onClick={() => setActive(item.key)}
                >
                  <Icon className="size-4" />
                  {item.label}
                </Button>
              )
            })}
          </div>
          <div className="mt-auto flex items-center gap-3 rounded-lg border bg-card p-3">
            <Avatar>
              <AvatarImage src={users[2].avatarUrl} alt={users[2].nome} />
              <AvatarFallback>MS</AvatarFallback>
            </Avatar>
            <div>
              <p className="text-sm font-medium">{users[2].nome}</p>
              <p className="text-xs text-muted-foreground">Conta cliente</p>
            </div>
          </div>
        </aside>

        <div className="flex min-h-svh flex-1 flex-col">
          <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b bg-background/80 px-6 backdrop-blur">
            <div>
              <p className="text-xs uppercase tracking-wide text-muted-foreground">
                {activeLabel}
              </p>
              <h2 className="text-lg font-semibold">
                Plataforma de ComissÃµes
              </h2>
            </div>
            <div className="w-full max-w-xl flex gap-4">
              <Input placeholder="Buscar estilos ou artistas" />
              <Button className="font-['arial']">Search</Button>
            </div>

            <div className="flex items-center gap-3">
              <Badge variant="secondary">Saldo protegido</Badge>
              <Avatar className="size-9">
                <AvatarImage src={users[2].avatarUrl} alt={users[2].nome} />
                <AvatarFallback>MS</AvatarFallback>
              </Avatar>
            </div>
          </header>

          <ScrollArea className="h-[calc(100svh-4rem)]">
            <main className="mx-auto w-full max-w-6xl px-6 py-8">
              {shellContent}
            </main>
          </ScrollArea>
        </div>
      </div>

      <nav className="fixed bottom-0 left-0 right-0 z-30 border-t bg-background/90 backdrop-blur lg:hidden">
        <div className="flex items-center justify-between px-2 py-2">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = active === item.key
            return (
              <Button
                key={item.key}
                variant="ghost"
                size="icon-sm"
                className={cn(
                  "flex size-auto flex-col gap-1 rounded-lg px-3 py-2 text-xs",
                  isActive && "bg-muted text-foreground"
                )}
                onClick={() => setActive(item.key)}
              >
                <Icon className="size-4" />
                {item.label}
              </Button>
            )
          })}
        </div>
      </nav>

      <CommissionModal
        open={commissionOpen}
        onOpenChange={setCommissionOpen}
        price={selectedPrice}
      />
    </div>
  )
}
