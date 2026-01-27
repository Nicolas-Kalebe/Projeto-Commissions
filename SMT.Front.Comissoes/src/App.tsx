import { Toaster } from "@/components/ui/toaster"
import { AppShell } from "@/components/layout/AppShell"
import { useEffect, useState } from "react"

function App() {
  // Mock authentication state
  // In a real app, this would check a token or auth provider status
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    try {
      return Boolean(localStorage.getItem("google_token"))
    } catch {
      return false
    }
  })

  useEffect(() => {
    const handleStorage = (event: StorageEvent) => {
      if (event.key === "google_token") {
        setIsAuthenticated(Boolean(event.newValue))
        return
      }
      if (event.key === null) {
        setIsAuthenticated(Boolean(localStorage.getItem("google_token")))
      }
    }

    window.addEventListener("storage", handleStorage)
    return () => {
      window.removeEventListener("storage", handleStorage)
    }
  }, [])

  const handleLogin = () => {
    setIsAuthenticated(true)
  }

  const handleLogout = () => {
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
