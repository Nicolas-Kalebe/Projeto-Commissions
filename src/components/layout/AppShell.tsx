import { useMemo, useState } from "react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { ArtistProfile } from "@/pages/ArtistProfile"
import { CommissionModal } from "@/pages/CommissionModal"
import { DashboardPage } from "@/pages/DashboardPage"
import { HomeFeed } from "@/pages/HomeFeed"
import { InboxPage } from "@/pages/InboxPage"
import { NewArtPage } from "@/pages/NewArtPage"
import { NotificationsPage } from "@/pages/NotificationsPage"
import { arts, moderationReports, notifications, users } from "@/data"
import { AppHeader, type NavKey as AppNavKey } from "@/components/layout/AppHeader"

export function AppShell() {
  const [active, setActive] = useState<AppNavKey>("inicio")
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
      {active === "dashboard" && <DashboardPage />}

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
        <AppHeader
          active={active}
          onNavChange={setActive}
          notifications={notifications}
          currentUser={users[2]}
        />

        <ScrollArea className="h-[calc(100svh-3.5rem)]">
          {active === "inicio" ? (
            <main className="w-full px-6 py-8">{homeContent}</main>
          ) : active === "perfil" ? (
            <main className="w-full px-0 py-0">{sectionContent}</main>
          ) : active === "inbox" ? (
            <main className="w-full h-full px-0 py-0">
              <InboxPage />
            </main>
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



