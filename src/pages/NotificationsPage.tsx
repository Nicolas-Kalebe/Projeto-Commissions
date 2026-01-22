import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import type { NotificationItem } from "@/types"

type NotificationsPageProps = {
  notifications: NotificationItem[]
}

export function NotificationsPage({ notifications }: NotificationsPageProps) {
  return (
    <section className="space-y-4">
      <div>
        <p className="text-xs uppercase tracking-wide text-muted-foreground">
          Central
        </p>
        <h1 className="text-2xl font-semibold">NotificaÃƒÂ§ÃƒÂµes</h1>
      </div>
      <div className="space-y-3">
        {notifications.map((item) => (
          <Card key={item.id} className="border-border/60 bg-card/95">
            <CardContent className="space-y-2 pt-6">
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold">{item.titulo}</p>
                <Badge variant="outline">{item.horario}</Badge>
              </div>
              <p className="text-sm text-muted-foreground">{item.descricao}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  )
}
