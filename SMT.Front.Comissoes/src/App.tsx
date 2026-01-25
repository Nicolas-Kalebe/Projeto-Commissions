import { Toaster } from "@/components/ui/toaster"
import { AppShell } from "@/components/layout/AppShell"
import { useState } from "react"

function App() {
  // Mock authentication state
  // In a real app, this would check a token or auth provider status
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false)

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
