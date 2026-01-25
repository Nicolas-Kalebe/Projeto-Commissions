import { useEffect, useState, type ElementType } from "react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import type { NotificationItem, User } from "@/types"
import { cn } from "@/lib/utils"
import {
  Bell,
  Home,
  Mail,
  ShieldCheck,
  ToggleLeft,
  ToggleRight,
  User as UserIcon,
  LogOut,
} from "lucide-react"
import { Link, useLocation, useNavigate } from "react-router-dom"

export type NavKey =
  | "inicio"
  | "dashboard"
  | "nova"
  | "notificacoes"
  | "perfil"
  | "inbox"

const navItems: { key: NavKey; label: string; icon: ElementType; path: string }[] = [
  { key: "inicio", label: "Inicio", icon: Home, path: "/inicio" },
  { key: "dashboard", label: "Dashboard", icon: ShieldCheck, path: "/dashboard" },
  { key: "inbox", label: "Mensagens", icon: Mail, path: "/inbox" },
  { key: "notificacoes", label: "Notificacoes", icon: Bell, path: "/notificacoes" },
  { key: "perfil", label: "Perfil", icon: UserIcon, path: "/perfil" },
]

type AppHeaderProps = {
  notifications: NotificationItem[]
  currentUser: User
  isAuthenticated: boolean
  onLogout: () => void
}

export function AppHeader({
  notifications,
  currentUser,
  isAuthenticated,
  onLogout,
}: AppHeaderProps) {
  const [profileMenuOpen, setProfileMenuOpen] = useState(false)
  const [isDark, setIsDark] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()

  useEffect(() => {
    setIsDark(document.documentElement.classList.contains("dark"))
  }, [])

  const handleThemeToggle = () => {
    setIsDark((prev) => {
      const next = !prev
      document.documentElement.classList.toggle("dark", next)
      return next
    })
  }

  // Navega para a página de perfil
  const handleProfileNavigate = () => {
    setProfileMenuOpen(false)
    navigate('/perfil')
  }

  const isLinkActive = (path: string) => {
    if (path === '/inicio' && location.pathname === '/inicio') return true
    if (path !== '/' && path !== '/inicio' && location.pathname.startsWith(path)) return true
    return false
  }

  const handleLoginClick = () => {
    navigate('/login')
  }

  const handleNavClick = (path: string) => {
    navigate(path)
  }

  return (
    <header className="sticky top-0 z-20 h-14 border-b bg-background/80 px-6 py-2 backdrop-blur">
      <div className="flex w-full items-center justify-between gap-3">
        <div className="flex items-center gap-3 overflow-x-auto lg:justify-start">
          <Link
            to="/inicio"
            className="mr-2 hidden cursor-pointer items-center gap-2 rounded-lg px-2 py-1 transition hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 lg:flex"
            aria-label="Voltar ao inicio"
          >
            <div className="flex size-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <ShieldCheck className="size-5" />
            </div>
            <div className="text-left">
              <p className="text-sm font-semibold">Projeto Comissões</p>
            </div>
          </Link>
          {navItems
            .filter(
              (item) => item.key !== "perfil" && item.key !== "notificacoes"
            )
            .map((item) => {
              const Icon = item.icon
              const isActive = isLinkActive(item.path)
              return (
                <Button
                  key={item.key}
                  variant="ghost"
                  size="sm"
                  className={cn(
                    "relative flex items-center gap-2 px-3",
                    isActive && "text-foreground"
                  )}
                  onClick={() => handleNavClick(item.path)}
                >
                  <Icon className="size-4" />
                  <span className="relative">
                    {item.label}
                    {isActive && (
                      <span className="absolute -bottom-1.5 left-0 h-0.5 w-full rounded-full bg-foreground" />
                    )}
                  </span>
                </Button>
              )
            })}
        </div>
        <div className="flex items-center justify-end gap-3">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className={cn(
                  "size-9",
                  location.pathname === "/notificacoes" && "bg-muted text-foreground"
                )}
                aria-label="Notificacoes"
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
              <DropdownMenuLabel>Notificacoes</DropdownMenuLabel>
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
                  onClick={() => navigate("/notificacoes")}
                >
                  Ver todas
                </Button>
              </div>
            </DropdownMenuContent>
          </DropdownMenu>
          <Button
            variant="ghost"
            size="icon"
            className={cn(
              "size-9 mr-2",
              location.pathname === "/inbox" && "bg-muted text-foreground"
            )}
            aria-label="Mensagens"
            onClick={() => navigate("/inbox")}
          >
            <Mail className="size-4" />
          </Button>


          {!isAuthenticated ? (
            <Button onClick={handleLoginClick} variant="default" size="sm">
              Entrar
            </Button>
          ) : (
            <DropdownMenu
              open={profileMenuOpen}
              onOpenChange={setProfileMenuOpen}
              modal={false} // IMPORTANTE: Impede o piscar/conflito de foco
            >
              <DropdownMenuTrigger asChild>
                <button
                  type="button"
                  className="-m-2 inline-flex cursor-pointer items-center rounded-full p-2 transition-colors hover:bg-muted/80"
                  aria-label="Perfil"
                >
                  <Avatar className="size-9">
                    <AvatarImage src={currentUser.avatarUrl} alt={currentUser.nome} />
                    <AvatarFallback>MS</AvatarFallback>
                  </Avatar>
                </button>
              </DropdownMenuTrigger>

              <DropdownMenuContent
                align="end"
                sideOffset={4}
                showArrow
                className="w-48"
              >
                <DropdownMenuItem onClick={handleProfileNavigate} className="cursor-pointer hover:bg-accent hover:text-accent-foreground font-semibold">Conta</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="cursor-pointer hover:bg-accent hover:text-accent-foreground">Minhas compras</DropdownMenuItem>
                <DropdownMenuItem className="cursor-pointer hover:bg-accent hover:text-accent-foreground">Configuracoes</DropdownMenuItem>
                <DropdownMenuItem className="cursor-pointer hover:bg-accent hover:text-accent-foreground">Ajuda</DropdownMenuItem>
                <DropdownMenuItem onClick={handleThemeToggle} className="cursor-pointer hover:bg-accent hover:text-accent-foreground">
                  <span className="flex w-full items-center justify-between">
                    Modo escuro
                    {isDark ? (
                      <ToggleRight className="size-5" />
                    ) : (
                      <ToggleLeft className="size-5" />
                    )}
                  </span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={onLogout} className="cursor-pointer hover:bg-accent hover:text-accent-foreground">
                  <LogOut className="mr-2 size-4" />
                  Sair
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>
    </header>
  )
}
