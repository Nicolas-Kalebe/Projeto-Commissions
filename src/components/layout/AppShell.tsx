import { useMemo, useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
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
  PlusSquare,
  ShieldCheck,
  User,
} from "lucide-react"

type NavKey = "inicio" | "dashboard" | "nova" | "notificacoes" | "perfil"

const navItems: { key: NavKey; label: string; icon: React.ElementType }[] = [
  { key: "inicio", label: "Iní­cio", icon: Home },
  { key: "dashboard", label: "Dashboard", icon: ShieldCheck },
  { key: "nova", label: "Nova Arte", icon: PlusSquare },
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
      <div className="flex">
        <aside className="hidden h-svh w-64 flex-col border-r bg-background/80 px-4 py-6 backdrop-blur lg:flex">
          <div className="flex items-center gap-2 px-2">
            <div className="flex size-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <ShieldCheck className="size-5" />
            </div>
            <div>
              <p className="text-sm font-semibold">Ateliê Seguro</p>
              <p className="text-xs text-muted-foreground">Comissões protegidas</p>
            </div>
          </div>
          <div className="mt-2 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon
              return (
                <Button
                  key={item.key}
                  variant="ghost"
                  className={cn(
                    "w-full justify-start gap-2 py-1",
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
        </aside>
        <div className="flex min-h-svh flex-1 flex-col">
          <header className="sticky top-0 z-20 flex h-16 items-center justify-center border-b bg-background/80 px-6 backdrop-blur">
            <div className="w-full max-w-xl flex gap-4">
              <Input placeholder="Buscar estilos ou artistas" />
            </div>

            <div className="absolute right-6 flex items-center gap-3">
              <Avatar
                className="size-9 cursor-pointer"
                onClick={() => setActive("perfil")}
                role="button"
              >
                <AvatarImage src={users[2].avatarUrl} alt={users[2].nome} />
                <AvatarFallback>MS</AvatarFallback>
              </Avatar>
            </div>
          </header>

          <ScrollArea className="h-[calc(100svh-4rem)]">
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


