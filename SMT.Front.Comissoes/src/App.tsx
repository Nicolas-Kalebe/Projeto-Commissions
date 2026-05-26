import { Toaster } from "@/components/ui/toaster"
import { AppShell } from "@/components/layout/AppShell"
import { useEffect, useState } from "react"
import { getAuth, subscribeAuth } from "@/lib/authStorage"
import { authService } from "@/services/authService"

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => Boolean(getAuth()))

  useEffect(() => {
    const unsub = subscribeAuth((next) => setIsAuthenticated(Boolean(next)))

    const handleStorage = (event: StorageEvent) => {
      if (event.key === "auth" || event.key === null) {
        setIsAuthenticated(Boolean(getAuth()))
      }
    }
    window.addEventListener("storage", handleStorage)

    return () => {
      unsub()
      window.removeEventListener("storage", handleStorage)
    }
  }, [])

  const handleLogin = () => setIsAuthenticated(true)

  const handleLogout = async () => {
    await authService.logout()
    setIsAuthenticated(false)
  }

  return (
    <>
      <AppShell
        isAuthenticated={isAuthenticated}
        onLogin={handleLogin}
        onLogout={handleLogout}
      />
      <Toaster />
    </>
  )
}

export default App
