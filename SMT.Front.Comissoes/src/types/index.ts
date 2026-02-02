export type UserRole = "artista" | "cliente"

export interface User {
  id: string
  nome: string
  role: UserRole
  avatarUrl: string
  bio: string
  seguidores: number
  destaque?: string
}

export interface Art {
  id: string
  titulo: string
  imageUrl: string
  images?: string[]
  artistId: string
  tags: string[]
  nsfw: boolean
  preco: number
  patrocinado?: boolean
}

export interface PriceSheet {
  id: string
  titulo: string
  preco: number
  descricao: string
  imageUrl?: string
}

export interface CommissionStatus {
  id: string
  titulo: string
  descricao: string
}

export interface ModerationReport {
  id: string
  conteudo: string
  motivo: string
  autor: string
  status: "novo" | "revisado"
}

export type NotificationType = "pedido" | "sistema" | "social"

export type NotificationItem = {
  id: string
  titulo: string
  descricao: string
  data: string // ISO string
  lida: boolean
  tipo: NotificationType
}

export type Conversation = {
  id: string
  userId: string
  lastMessage: string
  time: string
  unread: number
  status: "online" | "offline" | "ocupado"
  label?: string
}

export type Message = {
  id: string
  conversationId: string
  sender: "cliente" | "artista"
  content: string
  time: string
  status?: "enviado" | "entregue" | "lido"
}
