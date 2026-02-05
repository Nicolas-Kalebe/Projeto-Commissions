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
import { MyPurchasesPage } from "@/pages/MyPurchasesPage"
import { arts, notifications, users } from "@/data"
import { AppHeader } from "@/components/layout/AppHeader"
import { AppFooter } from "@/components/layout/AppFooter"
import { Routes, Route, Navigate, useLocation } from "react-router-dom"
import { useState, type PropsWithChildren } from "react"
import type { User } from "@/types"
import { API_ROUTES } from "@/constants/apiRoutes"

interface AppShellProps {
  isAuthenticated: boolean
  onLogin: () => void
  onLogout: () => void
}

const normalizeHttpUrl = (value: unknown) => {
  if (typeof value !== "string") return ""
  const trimmed = value.trim()
  if (!trimmed) return ""
  try {
    const url = new URL(trimmed)
    if (url.protocol !== "http:" && url.protocol !== "https:") return ""
    return url.toString()
  } catch {
    return ""
  }
}

const resolveDisplayName = (nomePerfil: unknown, nome: unknown, googleName: string) => {
  if (typeof nomePerfil === "string" && nomePerfil.trim()) return nomePerfil.trim()
  if (typeof nome === "string" && nome.trim()) return nome.trim()
  if (googleName) return googleName
  return "Usuario"
}

const resolveUserRole = (jaAnunciou: unknown) =>
  jaAnunciou === true ? "artista" : "cliente"

const isLikelyJwt = (value: string) => value.split(".").length === 3

export function AppShell({ isAuthenticated, onLogin, onLogout }: AppShellProps) {
  const [commissionOpen, setCommissionOpen] = useState(false)
  const [selectedPrice, setSelectedPrice] = useState(100)
  const emptyUser: User = {
    id: "",
    nome: "",
    role: "cliente",
    avatarUrl: "",
    bio: "",
    seguidores: 0,
  }
  const [currentUser, setCurrentUser] = useState<User>(() => (
    isAuthenticated ? emptyUser : users[2]
  ))
  const isMockUser = !isAuthenticated
  const location = useLocation()
  const viewportRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    viewportRef.current?.scrollTo(0, 0)
  }, [location.pathname])

  useEffect(() => {
    if (!isAuthenticated) {
      setCurrentUser(users[2])
      return
    }
    const googleName = localStorage.getItem("google_name")?.trim() ?? ""
    const googlePhoto = localStorage.getItem("google_photo")?.trim() ?? ""
    setCurrentUser({
      id: "",
      nome: resolveDisplayName("", "", googleName),
      role: "cliente",
      avatarUrl: normalizeHttpUrl(googlePhoto),
      bio: "",
      seguidores: 0,
    })
  }, [isAuthenticated])

  useEffect(() => {
    if (!isAuthenticated) return
    let isActive = true
    const tokenGoogleRaw = localStorage.getItem("google_token")
    const tokenGoogle = tokenGoogleRaw?.trim() ?? ""
    if (!tokenGoogle || !isLikelyJwt(tokenGoogle)) return

    const loadUser = async () => {
      try {
        const googleName = localStorage.getItem("google_name")?.trim() ?? ""
        const googlePhoto = localStorage.getItem("google_photo")?.trim() ?? ""
        const fallbackUser: User = {
          id: "",
          nome: resolveDisplayName("", "", googleName),
          role: "cliente",
          avatarUrl: normalizeHttpUrl(googlePhoto),
          bio: "",
          seguidores: 0,
        }
        const response = await fetch(API_ROUTES.Usuario.obterUsuarioPorToken, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ tokenGoogle }),
        })
        if (!response.ok) return
        const body = await response.json().catch(() => null)
        const resultado = body?.resultado ?? body?.Resultado
        if (!resultado || typeof resultado !== "object") return

        const fotoPerfil = (resultado as { fotoPerfil?: unknown; FotoPerfil?: unknown }).fotoPerfil
          ?? (resultado as { FotoPerfil?: unknown }).FotoPerfil
        const nomePerfil = (resultado as { nomePerfil?: unknown; NomePerfil?: unknown }).nomePerfil
          ?? (resultado as { NomePerfil?: unknown }).NomePerfil
        const nome = (resultado as { nome?: unknown; Nome?: unknown }).nome
          ?? (resultado as { Nome?: unknown }).Nome
        const id = (resultado as { id?: unknown; Id?: unknown }).id
          ?? (resultado as { Id?: unknown }).Id
        const jaAnunciou = (resultado as { jaAnunciou?: unknown; JaAnunciou?: unknown }).jaAnunciou
          ?? (resultado as { JaAnunciou?: unknown }).JaAnunciou
        const bio = (resultado as { bio?: unknown; Bio?: unknown }).bio
          ?? (resultado as { Bio?: unknown }).Bio
        const seguidores = (resultado as { seguidores?: unknown; Seguidores?: unknown }).seguidores
          ?? (resultado as { Seguidores?: unknown }).Seguidores

        if (!isActive) return
        const displayName = resolveDisplayName(nomePerfil, nome, googleName)
        const avatarUrl = normalizeHttpUrl(fotoPerfil) || normalizeHttpUrl(googlePhoto)
        setCurrentUser({
          id: id ? String(id) : fallbackUser.id,
          nome: displayName || fallbackUser.nome,
          role: typeof jaAnunciou === "boolean"
            ? resolveUserRole(jaAnunciou)
            : fallbackUser.role,
          avatarUrl: avatarUrl || fallbackUser.avatarUrl,
          bio: typeof bio === "string" ? bio : fallbackUser.bio,
          seguidores: typeof seguidores === "number" ? seguidores : fallbackUser.seguidores,
        })
      } catch {
        // Silent fallback to existing user data
      }
    }

    loadUser()
    return () => {
      isActive = false
    }
  }, [isAuthenticated])

  // Determine if we should show the radial background
  const showBackground = !["/perfil", "/login", "/cadastro"].includes(location.pathname)

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
        {location.pathname !== '/login' && location.pathname !== '/cadastro' && (
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

            <Route path="/login" element={
              isAuthenticated ? <Navigate to="/inicio" replace /> : <LoginPage onLogin={onLogin} />
            } />

            <Route path="/cadastro" element={
              isAuthenticated ? <Navigate to="/inicio" replace /> : <CompleteSignupPage onLogin={onLogin} />
            } />

            <Route path="/perfil" element={
              <ProtectedRoute>
                <main className="w-full px-0 py-0">
                  <ArtistProfile
                    onRequestCommission={handleRequestCommission}
                    currentUser={currentUser}
                    isMockUser={isMockUser}
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



