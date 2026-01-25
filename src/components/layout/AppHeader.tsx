import { useEffect, useRef, useState, type ElementType } from "react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
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

export type NavKey =
  | "inicio"
  | "dashboard"
  | "nova"
  | "notificacoes"
  | "perfil"
  | "inbox"

const navItems: { key: NavKey; label: string; icon: ElementType }[] = [
  { key: "inicio", label: "Inicio", icon: Home },
  { key: "dashboard", label: "Dashboard", icon: ShieldCheck },
  { key: "inbox", label: "Mensagens", icon: Mail },
  { key: "notificacoes", label: "Notificacoes", icon: Bell },
  { key: "perfil", label: "Perfil", icon: UserIcon },
]

type AppHeaderProps = {
  active: NavKey
  onNavChange: (key: NavKey) => void
  notifications: NotificationItem[]
  currentUser: User
  isAuthenticated: boolean
  onLoginClick: () => void
  onLogout: () => void
}

export function AppHeader({
  active,
  onNavChange,
  notifications,
  currentUser,
  isAuthenticated,
  onLoginClick,
  onLogout,
}: AppHeaderProps) {
  const [profileMenuOpen, setProfileMenuOpen] = useState(false)
  const [isDark, setIsDark] = useState(false)
  const profileMenuCloseTimer = useRef<ReturnType<typeof setTimeout> | null>(
    null
  )

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

  // Função para abrir via hover
  const openProfileMenu = () => {
    if (profileMenuCloseTimer.current) {
      clearTimeout(profileMenuCloseTimer.current)
      profileMenuCloseTimer.current = null
    }
    setProfileMenuOpen(true)
  }

  // Função para agendar o fechamento (UX melhor para não fechar instantaneamente)
  const scheduleCloseProfileMenu = () => {
    if (profileMenuCloseTimer.current) {
      clearTimeout(profileMenuCloseTimer.current)
    }
    profileMenuCloseTimer.current = setTimeout(() => {
      setProfileMenuOpen(false)
      profileMenuCloseTimer.current = null
    }, 200)
  }

  // Lógica do clique: navega para o perfil e fecha o menu
  const handleProfileClick = (_e: React.MouseEvent) => {
    // Previne comportamento padrão do trigger se necessário
    // e garante a navegação
    setProfileMenuOpen(false)
    onNavChange("perfil")
  }

  return (
    <header className="sticky top-0 z-20 h-14 border-b bg-background/80 px-6 py-2 backdrop-blur">
      <div className="grid w-full grid-cols-1 items-center gap-3 lg:grid-cols-[1fr_minmax(0,640px)_1fr]">
        <div className="flex items-center gap-3 overflow-x-auto lg:justify-start">
          <button
            type="button"
            className="mr-2 hidden cursor-pointer items-center gap-2 rounded-lg px-2 py-1 transition hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 lg:flex"
            onClick={() => onNavChange("inicio")}
            aria-label="Voltar ao inicio"
          >
            <div className="flex size-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <ShieldCheck className="size-5" />
            </div>
            <div className="text-left">
              <p className="text-sm font-semibold">Atelie Seguro</p>
              <p className="text-xs text-muted-foreground">
                Comissoes protegidas
              </p>
            </div>
          </button>
          {navItems
            .filter(
              (item) => item.key !== "perfil" && item.key !== "notificacoes"
            )
            .map((item) => {
              const Icon = item.icon
              const isActive = active === item.key
              return (
                <Button
                  key={item.key}
                  variant="ghost"
                  size="sm"
                  className={cn(
                    "relative flex items-center gap-2 px-3",
                    isActive &&
                    "text-foreground after:absolute after:bottom-0 after:left-1/2 after:h-0.5 after:w-6 after:-translate-x-1/2 after:rounded-full after:bg-foreground"
                  )}
                  onClick={() => onNavChange(item.key)}
                >
                  <Icon className="size-4" />
                  {item.label}
                </Button>
              )
            })}
        </div>
        <div className="flex w-full justify-center">
          <div className="w-full max-w-xl">
            <Input placeholder="Buscar estilos ou artistas" />
          </div>
        </div>
        <div className="flex items-center justify-end gap-3">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className={cn(
                  "size-9",
                  active === "notificacoes" && "bg-muted text-foreground"
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
                  onClick={() => onNavChange("notificacoes")}
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
              active === "inbox" && "bg-muted text-foreground"
            )}
            aria-label="Mensagens"
            onClick={() => onNavChange("inbox")}
          >
            <Mail className="size-4" />
          </Button>


          {!isAuthenticated ? (
            <Button onClick={onLoginClick} variant="default" size="sm">
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
                  onClick={handleProfileClick}
                  onPointerEnter={openProfileMenu}
                  onPointerLeave={scheduleCloseProfileMenu}
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
                // Mantemos os eventos aqui para não fechar quando o mouse for para o menu
                onPointerEnter={openProfileMenu}
                onPointerLeave={scheduleCloseProfileMenu}
                // Fecha ao clicar em um item
                onClick={() => setProfileMenuOpen(false)}
                className="w-48"
              >
                <DropdownMenuLabel>Conta</DropdownMenuLabel>
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
