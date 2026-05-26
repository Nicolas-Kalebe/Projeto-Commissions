import { useMemo, useRef, useEffect } from "react"
import { ArtistProfile } from "@/pages/ArtistProfile"
import { CommissionModal } from "@/pages/CommissionModal"
import { DashboardPage } from "@/pages/DashboardPage"
import { HomeFeed } from "@/pages/HomeFeed"
import { InboxPage } from "@/pages/InboxPage"
import { NewArtPage } from "@/pages/NewArtPage"
import { NotificationsPage } from "@/pages/NotificationsPage"
import { LoginPage } from "@/pages/LoginPage"
import { CompleteSignupPage } from "@/pages/CompleteSignupPage"
import { ConfirmEmailPage } from "@/pages/ConfirmEmailPage"
import { MyPurchasesPage } from "@/pages/MyPurchasesPage"
import { AboutPage } from "@/pages/AboutPage"
import { arts, notifications, users } from "@/data"
import { AppHeader } from "@/components/layout/AppHeader"
import { AppFooter } from "@/components/layout/AppFooter"
import { Routes, Route, Navigate, useLocation } from "react-router-dom"
import { useState, type PropsWithChildren } from "react"
import type { User } from "@/types"
import { getAuth, subscribeAuth, type AuthUser } from "@/lib/authStorage"

interface AppShellProps {
  isAuthenticated: boolean
  onLogin: () => void
  onLogout: () => void
}

const resolveUserFromAuth = (user: AuthUser): User => ({
  id: String(user.id),
  nome: user.nomePerfil || user.nome || "Usuario",
  role: user.jaAnunciou ? "artista" : "cliente",
  avatarUrl: user.fotoPerfil ?? "",
  bio: "",
  seguidores: 0,
})

const emptyUser: User = {
  id: "",
  nome: "",
  role: "cliente",
  avatarUrl: "",
  bio: "",
  seguidores: 0,
}

export function AppShell({ isAuthenticated, onLogin, onLogout }: AppShellProps) {
  const [commissionOpen, setCommissionOpen] = useState(false)
  const [selectedPrice, setSelectedPrice] = useState(100)
  const [currentUser, setCurrentUser] = useState<User>(() => {
    const auth = getAuth()
    return auth ? resolveUserFromAuth(auth.user) : emptyUser
  })
  const location = useLocation()
  const viewportRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    viewportRef.current?.scrollTo(0, 0)
  }, [location.pathname])

  useEffect(() => {
    if (!isAuthenticated) {
      setCurrentUser(emptyUser)
      return
    }
    const auth = getAuth()
    if (auth) setCurrentUser(resolveUserFromAuth(auth.user))
  }, [isAuthenticated])

  useEffect(() => {
    return subscribeAuth((next) => {
      setCurrentUser(next ? resolveUserFromAuth(next.user) : emptyUser)
    })
  }, [])

  const showBackground = !["/login", "/cadastro", "/cadastro/confirmar"].includes(location.pathname)
  const hideHeader = ["/login", "/cadastro", "/cadastro/confirmar"].includes(location.pathname)

  const artistMap = useMemo(
    () => new Map(users.map((user) => [user.id, user])),
    []
  )

  const handleRequestCommission = (price: number) => {
    if (!isAuthenticated) {
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
        {!hideHeader && (
          <AppHeader
            notifications={notifications}
            currentUser={currentUser}
            isAuthenticated={isAuthenticated}
            onLogout={onLogout}
          />
        )}

        <div className="h-[calc(100svh-3.5rem)] overflow-y-auto" ref={viewportRef}>
          <Routes>
            <Route path="/" element={<Navigate to="/inicio" replace />} />

            <Route path="/inicio" element={
              <>
                <main className="w-full px-6 py-8">
                  <HomeFeed
                    arts={arts}
                    artistMap={artistMap}
                    scrollContainerRef={viewportRef}
                    onRequestCommission={handleRequestCommission}
                  />
                </main>
                <AppFooter />
              </>
            } />

            <Route path="/sobre" element={
              <>
                <AboutPage />
                <AppFooter />
              </>
            } />

            <Route path="/login" element={
              isAuthenticated ? <Navigate to="/inicio" replace /> : <LoginPage onLogin={onLogin} />
            } />

            <Route path="/cadastro" element={
              isAuthenticated ? <Navigate to="/inicio" replace /> : <CompleteSignupPage onLogin={onLogin} />
            } />

            <Route path="/cadastro/confirmar" element={
              isAuthenticated ? <Navigate to="/inicio" replace /> : <ConfirmEmailPage onLogin={onLogin} />
            } />

            <Route path="/perfil" element={
              <ProtectedRoute>
                <main className="w-full px-0 py-0 bg-background">
                  <ArtistProfile
                    onRequestCommission={handleRequestCommission}
                    currentUser={currentUser}
                    onCurrentUserUpdate={(partial) =>
                      setCurrentUser((prev) => ({ ...prev, ...partial }))
                    }
                  />
                </main>
              </ProtectedRoute>
            } />

            <Route path="/dashboard" element={
              <ProtectedRoute>
                <>
                  <main className="w-full px-6 py-8">
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

            <Route path="/compras" element={
              <ProtectedRoute>
                <>
                  <main className="mx-auto w-full max-w-6xl px-6 py-8">
                    <MyPurchasesPage />
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
        </div>
      </div>

      <CommissionModal
        open={commissionOpen}
        onOpenChange={setCommissionOpen}
        price={selectedPrice}
      />
    </div>
  )
}
