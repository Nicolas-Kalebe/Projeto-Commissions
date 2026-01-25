import { useMemo } from "react"
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
import { AppHeader } from "@/components/layout/AppHeader"
import { AppFooter } from "@/components/layout/AppFooter"
import { Routes, Route, Navigate, useLocation } from "react-router-dom"
import { useState, type PropsWithChildren } from "react"

interface AppShellProps {
  isAuthenticated: boolean
  onLogin: () => void
  onLogout: () => void
}

export function AppShell({ isAuthenticated, onLogin, onLogout }: AppShellProps) {
  const [commissionOpen, setCommissionOpen] = useState(false)
  const [selectedPrice, setSelectedPrice] = useState(100)
  const location = useLocation()

  // Determine if we should show the radial background
  const showBackground = location.pathname !== '/perfil' && location.pathname !== '/login'

  const artistMap = useMemo(
    () => new Map(users.map((user) => [user.id, user])),
    []
  )

  const handleRequestCommission = (price: number) => {
    // This logic might need adjustment depending on how we handle redirects
    // ideally navigate('/login') if not authenticated
    if (!isAuthenticated) {
      // Ideally we would redirect here, but for now we might rely on the protected route logic or parent
      return <Navigate to="/login" />
    }
    setSelectedPrice(price)
    setCommissionOpen(true)
  }

  const ProtectedRoute = ({ children }: PropsWithChildren) => {
    if (!isAuthenticated) {
      return <Navigate to="/login" replace />
    }
    return children
  }

  return (
    <div className="min-h-svh bg-background text-foreground">
      {showBackground && (
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(1200px_600px_at_30%_-20%,oklch(0.98_0.02_90),transparent)] dark:bg-[radial-gradient(1200px_600px_at_30%_-20%,oklch(0.18_0_0),transparent)]" />
      )}
      <div className="flex min-h-svh flex-1 flex-col">
        {location.pathname !== '/login' && (
          <AppHeader
            notifications={notifications}
            currentUser={users[2]}
            isAuthenticated={isAuthenticated}
            onLogout={onLogout}
          />
        )}

        <ScrollArea className="h-[calc(100svh-3.5rem)]">
          <Routes>
            <Route path="/" element={<Navigate to="/inicio" replace />} />

            <Route path="/inicio" element={
              <>
                <main className="w-full px-6 py-8">
                  <HomeFeed arts={arts} artistMap={artistMap} />
                </main>
                <AppFooter />
              </>
            } />

            <Route path="/login" element={
              isAuthenticated ? <Navigate to="/inicio" replace /> : <LoginPage onLogin={onLogin} />
            } />

            <Route path="/perfil" element={
              <ProtectedRoute>
                <main className="w-full px-0 py-0">
                  <ArtistProfile onRequestCommission={handleRequestCommission} />
                </main>
              </ProtectedRoute>
            } />

            <Route path="/dashboard" element={
              <ProtectedRoute>
                <>
                  <main className="mx-auto w-full max-w-6xl px-6 py-8">
                    <DashboardPage />
                  </main>
                  <AppFooter />
                </>
              </ProtectedRoute>
            } />

            <Route path="/nova" element={
              <ProtectedRoute>
                <>
                  <main className="mx-auto w-full max-w-6xl px-6 py-8">
                    <NewArtPage />
                  </main>
                  <AppFooter />
                </>
              </ProtectedRoute>
            } />

            <Route path="/notificacoes" element={
              <ProtectedRoute>
                <>
                  <main className="mx-auto w-full max-w-6xl px-6 py-8">
                    <NotificationsPage notifications={notifications} />
                  </main>
                  <AppFooter />
                </>
              </ProtectedRoute>
            } />

            <Route path="/inbox" element={
              <ProtectedRoute>
                <main className="w-full h-full px-0 py-0">
                  <InboxPage />
                </main>
              </ProtectedRoute>
            } />

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
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



