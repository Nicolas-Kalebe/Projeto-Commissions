import { useRef, useState, type ElementType } from "react"
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
  User as UserIcon,
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
}

export function AppHeader({
  active,
  onNavChange,
  notifications,
  currentUser,
}: AppHeaderProps) {
  const [profileMenuOpen, setProfileMenuOpen] = useState(false)
  const profileMenuCloseTimer = useRef<ReturnType<typeof setTimeout> | null>(
    null
  )
  const profileMenuIntent = useRef<"hover" | "click" | null>(null)

  const openProfileMenu = () => {
    if (profileMenuCloseTimer.current) {
      clearTimeout(profileMenuCloseTimer.current)
      profileMenuCloseTimer.current = null
    }
    profileMenuIntent.current = "hover"
    setProfileMenuOpen(true)
  }

  const scheduleCloseProfileMenu = () => {
    if (profileMenuCloseTimer.current) {
      clearTimeout(profileMenuCloseTimer.current)
    }
    profileMenuCloseTimer.current = setTimeout(() => {
      setProfileMenuOpen(false)
      profileMenuCloseTimer.current = null
    }, 200)
  }

  const handleProfileClick = () => {
    if(profileMenuIntent.current === "click"){
    setProfileMenuOpen(false)
    onNavChange("perfil")
    }
  }

  const handleProfileMenuChange = (open: boolean) => {
    if (!open) {
      setProfileMenuOpen(false)
      return
    }
    if (profileMenuIntent.current === "hover") {
      setProfileMenuOpen(true)
    }
    profileMenuIntent.current = null
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
          <DropdownMenu
            open={profileMenuOpen}
            onOpenChange={handleProfileMenuChange}
          >
            <DropdownMenuTrigger asChild>
              <button
                type="button"
                className="-m-2 inline-flex cursor-pointer items-center rounded-full p-2"
                onClick={handleProfileClick}
                onPointerEnter={openProfileMenu}
                onPointerLeave={scheduleCloseProfileMenu}
                onPointerDown={() => {
                  profileMenuIntent.current = "click"
                }}
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
              onPointerEnter={openProfileMenu}
              onPointerLeave={scheduleCloseProfileMenu}
              className="w-48"
            >
              <DropdownMenuLabel>Conta</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Minhas compras</DropdownMenuItem>
              <DropdownMenuItem>Configuracoes</DropdownMenuItem>
              <DropdownMenuItem>Ajuda</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Sair</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}
