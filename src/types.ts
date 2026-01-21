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
  artistId: string
  tags: string[]
  nsfw: boolean
  preco: number
}

export interface PriceSheet {
  id: string
  titulo: string
  preco: number
  descricao: string
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

export interface NotificationItem {
  id: string
  titulo: string
  descricao: string
  horario: string
}
