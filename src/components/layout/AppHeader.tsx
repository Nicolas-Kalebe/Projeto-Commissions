import { useEffect, useState, useRef, useMemo, type ElementType } from "react"
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
import { getGroupTitle, getIcon, formatDate } from "@/lib/notifications"

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

import { MiniChat } from "./MiniChat"

// ... imports anteriores

export function AppHeader({
  notifications,
  currentUser,
  isAuthenticated,
  onLogout,
}: AppHeaderProps) {
  const [profileMenuOpen, setProfileMenuOpen] = useState(false)
  const [isChatOpen, setIsChatOpen] = useState(false)
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false)
  const [isDark, setIsDark] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()
  const chatRef = useRef<HTMLDivElement>(null)

  const groupedNotifications = useMemo(() => {
    // Sort by date first
    const sorted = [...notifications].sort(
      (a, b) => new Date(b.data).getTime() - new Date(a.data).getTime()
    )

    const groups: Record<string, NotificationItem[]> = {}

    sorted.forEach((notification) => {
      const group = getGroupTitle(notification.data)
      if (!groups[group]) groups[group] = []
      groups[group].push(notification)
    })

    return groups
  }, [notifications])

  useEffect(() => {
    setIsDark(document.documentElement.classList.contains("dark"))

    // Fecha o chat ao clicar fora
    const handleClickOutside = (event: MouseEvent) => {
      if (chatRef.current && !chatRef.current.contains(event.target as Node)) {
        setIsChatOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  const handleThemeToggle = () => {
    setIsDark((prev) => {
      const next = !prev
      document.documentElement.classList.toggle("dark", next)
      return next
    })
  }

  // Funções de controle de popup (exclusividade)
  const toggleChat = () => {
    const newState = !isChatOpen
    setIsChatOpen(newState)
    if (newState) {
      setIsNotificationsOpen(false)
      setProfileMenuOpen(false)
    }
  }

  const handleNotificationsOpenChange = (open: boolean) => {
    setIsNotificationsOpen(open)
    if (open) {
      setIsChatOpen(false)
      setProfileMenuOpen(false)
    }
  }

  const handleProfileOpenChange = (open: boolean) => {
    setProfileMenuOpen(open)
    if (open) {
      setIsChatOpen(false)
      setIsNotificationsOpen(false)
    }
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
        {/* ... (Logo e Nav) */}

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
              (item) => item.key !== "perfil" && item.key !== "notificacoes" && item.key !== "inbox"
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
          {/* ... (Dropdown Notificacoes) */}
          <DropdownMenu open={isNotificationsOpen} onOpenChange={handleNotificationsOpenChange} modal={false}>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className={cn(
                  "size-9",
                  (isNotificationsOpen || location.pathname === "/notificacoes") && "bg-muted text-foreground"
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
              <DropdownMenuLabel>Notificações</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <div className="max-h-[350px] custom-scroll">
                <div className="px-2 py-2 text-sm">
                  {Object.entries(groupedNotifications).length === 0 ? (
                    <p className="py-4 text-center text-xs text-muted-foreground">
                      Nenhuma notificação nova
                    </p>
                  ) : (
                    Object.entries(groupedNotifications).map(([group, items]) => (
                      <div key={group} className="mb-3 last:mb-0">
                        <p className="mb-2 px-2 text-xs font-semibold text-muted-foreground">
                          {group}
                        </p>
                        <div className="space-y-1">
                          {items.slice(0, 5).map((item) => ( // Showing max 5 items per group in dropdown to keep it sane
                            <div
                              key={item.id}
                              className="flex items-start gap-3 rounded-md p-2 hover:bg-muted/50 transition-colors cursor-pointer"
                              onClick={() => navigate("/notificacoes")}
                            >
                              <div className="mt-0.5 rounded-full bg-secondary p-1.5 shrink-0">
                                {getIcon(item.tipo)}
                              </div>
                              <div className="flex-1 space-y-1">
                                <p className="text-xs font-medium leading-none">
                                  {item.titulo}
                                </p>
                                <p className="line-clamp-2 text-[10px] text-muted-foreground">
                                  {item.descricao}
                                </p>
                                <p className="text-[10px] text-muted-foreground/70">
                                  {formatDate(item.data)}
                                </p>
                              </div>
                              {!item.lida && (
                                <div className="mt-1 h-1.5 w-1.5 rounded-full bg-primary shrink-0" />
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
              <DropdownMenuSeparator />
              <div className="p-2">
                <Button
                  variant="secondary"
                  className="w-full text-xs"
                  size="sm"
                  onClick={() => navigate("/notificacoes")}
                >
                  Ver todas
                </Button>
              </div>
            </DropdownMenuContent>
          </DropdownMenu>

          <div className="relative" ref={chatRef}>
            <Button
              variant="ghost"
              size="icon"
              className={cn(
                "size-9 mr-2",
                (isChatOpen || location.pathname === "/inbox") && "bg-muted text-foreground"
              )}
              aria-label="Mensagens"
              onClick={toggleChat}
            >
              <Mail className="size-4" />
            </Button>

            {isChatOpen && (
              <div className="absolute right-0 top-12 z-50 animate-in fade-in zoom-in-95 duration-200">
                <MiniChat onClose={() => setIsChatOpen(false)} />
              </div>
            )}
          </div>

          {!isAuthenticated ? (
            <Button onClick={handleLoginClick} variant="default" size="sm">
              Entrar
            </Button>
          ) : (
            <DropdownMenu
              open={profileMenuOpen}
              onOpenChange={handleProfileOpenChange}
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
                <DropdownMenuItem
                  onClick={() => navigate("/compras")}
                  className="cursor-pointer hover:bg-accent hover:text-accent-foreground"
                >
                  Minhas compras
                </DropdownMenuItem>
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
