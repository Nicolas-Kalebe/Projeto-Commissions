import { format, isToday, isYesterday, subDays, isAfter } from "date-fns"
import { ptBR } from "date-fns/locale"
import { Bell, Heart, Info, ShoppingBag } from "lucide-react"
import type { NotificationType } from "@/types"

export const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  return format(date, "HH:mm", { locale: ptBR })
}

export const getIcon = (type: NotificationType) => {
  switch (type) {
    case "pedido":
      return <ShoppingBag className="h-4 w-4 text-primary" />
    case "sistema":
      return <Info className="h-4 w-4 text-blue-500" />
    case "social":
      return <Heart className="h-4 w-4 text-rose-500" />
    default:
      return <Bell className="h-4 w-4" />
  }
}

export const getGroupTitle = (dateString: string) => {
  const date = new Date(dateString)
  if (isToday(date)) return "Hoje"
  if (isYesterday(date)) return "Ontem"
  if (isAfter(date, subDays(new Date(), 7))) return "Últimos 7 dias"
  if (isAfter(date, subDays(new Date(), 30))) return "Mês atual"
  return format(date, "MMMM yyyy", { locale: ptBR })
}
