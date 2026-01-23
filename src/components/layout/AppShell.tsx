import { useMemo, useState } from "react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ArtistProfile } from "@/pages/ArtistProfile"
import { CommissionModal } from "@/pages/CommissionModal"
import { DashboardPage } from "@/pages/DashboardPage"
import { HomeFeed } from "@/pages/HomeFeed"
import { NewArtPage } from "@/pages/NewArtPage"
import { NotificationsPage } from "@/pages/NotificationsPage"
import { arts, moderationReports, notifications, users } from "@/data"
import { cn } from "@/lib/utils"
import {
  Bell,
  Home,
  ShieldCheck,
  User,
} from "lucide-react"

type NavKey = "inicio" | "dashboard" | "nova" | "notificacoes" | "perfil"

const navItems: { key: NavKey; label: string; icon: React.ElementType }[] = [
  { key: "inicio", label: "Iní­cio", icon: Home },
  { key: "dashboard", label: "Dashboard", icon: ShieldCheck },
  { key: "notificacoes", label: "Notificações", icon: Bell },
  { key: "perfil", label: "Perfil", icon: User },
]

export function AppShell() {
  const [active, setActive] = useState<NavKey>("inicio")
  const [commissionOpen, setCommissionOpen] = useState(false)
  const [selectedPrice, setSelectedPrice] = useState(100)
  const [priceRange, setPriceRange] = useState<[number, number]>([50, 300])
  const [profileTheme, setProfileTheme] = useState("#FFFFFF")

  const artistMap = useMemo(
    () => new Map(users.map((user) => [user.id, user])),
    []
  )

  const handleRequestCommission = (price: number) => {
    setSelectedPrice(price)
    setCommissionOpen(true)
  }

  const homeContent = (
    <HomeFeed
      arts={arts}
      artistMap={artistMap}
      priceRange={priceRange}
      onPriceRangeChange={setPriceRange}
    />
  )

  const sectionContent = (
    <div className="space-y-10 pb-24 lg:pb-10">
      {active === "dashboard" && (
        <DashboardPage moderationReports={moderationReports} />
      )}

      {active === "nova" && <NewArtPage />}

      {active === "notificacoes" && (
        <NotificationsPage notifications={notifications} />
      )}

      {active === "perfil" && (
        <ArtistProfile
          onRequestCommission={handleRequestCommission}
          profileTheme={profileTheme}
          onThemeChange={setProfileTheme}
        />
      )}
    </div>
  )
  return (
    <div
      className="min-h-svh bg-background text-foreground"
      style={active === "perfil" ? { backgroundColor: profileTheme } : undefined}
    >
      {active !== "perfil" && (
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(1200px_600px_at_30%_-20%,oklch(0.98_0.02_90),transparent)]" />
      )}
      <div className="flex min-h-svh flex-1 flex-col">
        <header className="sticky top-0 z-20 h-14 border-b bg-background/80 px-6 py-2 backdrop-blur">
          <div className="grid w-full grid-cols-1 items-center gap-3 lg:grid-cols-[1fr_minmax(0,640px)_1fr]">
            <div className="flex items-center gap-3 overflow-x-auto lg:justify-start">
              <div className="mr-2 hidden items-center gap-2 lg:flex">
                <div className="flex size-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                  <ShieldCheck className="size-5" />
                </div>
                <div>
                  <p className="text-sm font-semibold">Atelie Seguro</p>
                  <p className="text-xs text-muted-foreground">
                    Comissoes protegidas
                  </p>
                </div>
              </div>
              {navItems
                .filter((item) => item.key !== "perfil" && item.key !== "notificacoes")
                .map((item) => {
                const Icon = item.icon
                const isActive = active === item.key
                return (
                  <Button
                    key={item.key}
                    variant="ghost"
                    size="sm"
                    className={cn(
                      "flex items-center gap-2 px-3",
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
            <div className="flex w-full justify-center">
              <div className="w-full max-w-xl">
                <Input placeholder="Buscar estilos ou artistas" />
              </div>
            </div>
            <div className="flex items-center justify-end gap-3">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className={cn(
                      "size-9",
                      active === "notificacoes" && "bg-muted text-foreground"
                    )}
                    aria-label="Notificações"
                  >
                    <Bell className="size-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="end"
                  sideOffset={10}
                  showArrow
                  className="w-80"
                >
                  <DropdownMenuLabel>Notificações</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <div className="space-y-3 px-2 py-2 text-sm">
                    {notifications.slice(0, 3).map((item) => (
                      <div key={item.id} className="space-y-1">
                        <p className="text-sm font-semibold">{item.titulo}</p>
                        <p className="text-xs text-muted-foreground">
                          {item.descricao}
                        </p>
                        <p className="text-[11px] text-muted-foreground">
                          {item.horario}
                        </p>
                      </div>
                    ))}
                  </div>
                  <DropdownMenuSeparator />
                  <div className="p-2">
                    <Button
                      variant="secondary"
                      className="w-full"
                      onClick={() => setActive("notificacoes")}
                    >
                      Ver todas
                    </Button>
                  </div>
                </DropdownMenuContent>
              </DropdownMenu>
              <Avatar
                className="size-9 cursor-pointer"
                onClick={() => setActive("perfil")}
                role="button"
              >
                <AvatarImage src={users[2].avatarUrl} alt={users[2].nome} />
                <AvatarFallback>MS</AvatarFallback>
              </Avatar>
            </div>
          </div>
        </header>

        <ScrollArea className="h-[calc(100svh-3.5rem)]">
          {active === "inicio" ? (
            <main className="w-full px-6 py-8">{homeContent}</main>
          ) : active === "perfil" ? (
            <main className="w-full px-0 py-0">{sectionContent}</main>
          ) : (
            <main className="mx-auto w-full max-w-6xl px-6 py-8">
              {sectionContent}
            </main>
          )}
        </ScrollArea>
      </div>

      <CommissionModal
        open={commissionOpen}
        onOpenChange={setCommissionOpen}
        price={selectedPrice}
      />
    </div>
  )
}


