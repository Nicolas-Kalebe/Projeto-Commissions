import { useMemo, useState } from "react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { ArtistProfile } from "@/pages/ArtistProfile"
import { CommissionModal } from "@/pages/CommissionModal"
import { DashboardPage } from "@/pages/DashboardPage"
import { HomeFeed } from "@/pages/HomeFeed"
import { InboxPage } from "@/pages/InboxPage"
import { NewArtPage } from "@/pages/NewArtPage"
import { NotificationsPage } from "@/pages/NotificationsPage"
import { LoginPage } from "@/pages/LoginPage"
import { arts, notifications, users } from "@/data"
import { AppHeader, type NavKey as AppHeaderNavKey } from "@/components/layout/AppHeader"
import { AppFooter } from "@/components/layout/AppFooter"

// Extend NavKey to include "login" for internal routing
type NavKey = AppHeaderNavKey | "login"

interface AppShellProps {
  isAuthenticated: boolean
  onLogin: () => void
  onLogout: () => void
}

export function AppShell({ isAuthenticated, onLogin, onLogout }: AppShellProps) {
  const [active, setActive] = useState<NavKey>("inicio")
  const [commissionOpen, setCommissionOpen] = useState(false)
  const [selectedPrice, setSelectedPrice] = useState(100)

  const artistMap = useMemo(
    () => new Map(users.map((user) => [user.id, user])),
    []
  )

  const handleRequestCommission = (price: number) => {
    if (!isAuthenticated) {
      setActive("login")
      return
    }
    setSelectedPrice(price)
    setCommissionOpen(true)
  }

  // Handle successful login from LoginPage
  const handleLoginSuccess = () => {
    onLogin()
    setActive("inicio")
  }

  // Handle logout
  const handleLogoutSuccess = () => {
    onLogout()
    setActive("inicio")
  }

  const homeContent = (
    <HomeFeed
      arts={arts}
      artistMap={artistMap}
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
        />
      )}
    </div>
  )
  return (
    <div className="min-h-svh bg-background text-foreground">
      {active !== "perfil" && active !== "login" && (
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(1200px_600px_at_30%_-20%,oklch(0.98_0.02_90),transparent)] dark:bg-[radial-gradient(1200px_600px_at_30%_-20%,oklch(0.18_0_0),transparent)]" />
      )}
      <div className="flex min-h-svh flex-1 flex-col">
        {active !== "login" && (
          <AppHeader
            active={active as AppHeaderNavKey}
            onNavChange={(key) => {
              // Protect routes
              if (!isAuthenticated && (key === "dashboard" || key === "nova" || key === "notificacoes" || key === "inbox")) {
                setActive("login")
                return
              }
              setActive(key)
            }}
            notifications={notifications}
            currentUser={users[2]}
            isAuthenticated={isAuthenticated}
            onLoginClick={() => setActive("login")}
            onLogout={handleLogoutSuccess}
          />
        )}

        <ScrollArea className="h-[calc(100svh-3.5rem)]">
          {active === "inicio" ? (
            <>
              <main className="w-full px-6 py-8">{homeContent}</main>
              <AppFooter />
            </>
          ) : active === "login" ? (
            <LoginPage onLogin={handleLoginSuccess} />
          ) : active === "perfil" ? (
            <main className="w-full px-0 py-0">{sectionContent}</main>
          ) : active === "inbox" ? (
            <main className="w-full h-full px-0 py-0">
              <InboxPage />
            </main>
          ) : active === "dashboard" || active === "nova" || active === "notificacoes" ? (
            <>
              <main className="mx-auto w-full max-w-6xl px-6 py-8">
                {sectionContent}
              </main>
              <AppFooter />
            </>
          ) : null}
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



