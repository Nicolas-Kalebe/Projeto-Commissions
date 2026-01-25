import { Button } from "@/components/ui/button"
import type { NotificationItem, NotificationType } from "@/types"
import { Bell, Heart, Info, ShoppingBag } from "lucide-react"
import { useMemo, useState } from "react"
import { formatDate, getGroupTitle, getIcon } from "@/lib/notifications"

type NotificationsPageProps = {
  notifications: NotificationItem[]
}

export function NotificationsPage({ notifications }: NotificationsPageProps) {
  const [activeFilter, setActiveFilter] = useState<NotificationType | "todos">("todos")

  const filteredNotifications = useMemo(() => {
    return notifications
      .filter((n) => activeFilter === "todos" || n.tipo === activeFilter)
      .sort((a, b) => new Date(b.data).getTime() - new Date(a.data).getTime())
  }, [notifications, activeFilter])

  const groupedNotifications = useMemo(() => {
    const groups: Record<string, NotificationItem[]> = {}

    filteredNotifications.forEach((notification) => {
      const group = getGroupTitle(notification.data)
      if (!groups[group]) groups[group] = []
      groups[group].push(notification)
    })

    // Sort groups order (Today first, etc) logic is implicit if we iterate well, 
    // but better to rely on known keys order or just object insertion order from sorted list
    return groups
  }, [filteredNotifications])

  return (
    <section className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-xs uppercase tracking-wide text-muted-foreground">
            Central
          </p>
          <h1 className="text-2xl font-semibold">Notificações</h1>
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0">
          <Button
            variant={activeFilter === "todos" ? "default" : "outline"}
            size="sm"
            onClick={() => setActiveFilter("todos")}
            className="rounded-full"
          >
            Todos
          </Button>
          <Button
            variant={activeFilter === "pedido" ? "default" : "outline"}
            size="sm"
            onClick={() => setActiveFilter("pedido")}
            className="rounded-full gap-2"
          >
            <ShoppingBag className="h-3 w-3" />
            Pedidos
          </Button>
          <Button
            variant={activeFilter === "sistema" ? "default" : "outline"}
            size="sm"
            onClick={() => setActiveFilter("sistema")}
            className="rounded-full gap-2"
          >
            <Info className="h-3 w-3" />
            Sistema
          </Button>
          <Button
            variant={activeFilter === "social" ? "default" : "outline"}
            size="sm"
            onClick={() => setActiveFilter("social")}
            className="rounded-full gap-2"
          >
            <Heart className="h-3 w-3" />
            Social
          </Button>
        </div>
      </div>

      <div className="space-y-8">
        {Object.entries(groupedNotifications).map(([group, items]) => (
          <div key={group} className="space-y-4">
            <h2 className="text-sm font-medium text-muted-foreground sticky top-0 bg-background/95 backdrop-blur py-2 z-10">
              {group}
            </h2>
            <div className="space-y-2">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="group flex items-start gap-4 rounded-lg border bg-card p-4 transition-colors hover:bg-muted/50"
                >
                  <div className="mt-1 rounded-full bg-secondary p-2">
                    {getIcon(item.tipo)}
                  </div>
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center justify-between">
                      <p className="font-medium text-foreground">{item.titulo}</p>
                      <span className="text-xs text-muted-foreground">
                        {formatDate(item.data)}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {item.descricao}
                    </p>
                  </div>
                  {!item.lida && (
                    <div className="mt-2 h-2 w-2 rounded-full bg-primary" />
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}

        {filteredNotifications.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12 text-center text-muted-foreground">
            <Bell className="h-12 w-12 opacity-20" />
            <p className="mt-4">Nenhuma notificação encontrada</p>
          </div>
        )}
      </div>
    </section>
  )
}
