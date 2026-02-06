export type SocialLinkKey =
  | "twitter"
  | "instagram"
  | "tiktok"
  | "youtube"
  | "twitch"
  | "artstation"

export type ProfileDraft = {
  displayName: string
  bio: string
  avatarUrl: string
  coverUrl: string
  pronounsBadge: string
  roleBadge: string
  deliveryBadge: string
  styleDescription: string
  styleTags: string
  socialLinks: Record<SocialLinkKey, string>
}

export type PortfolioPost = {
  id: string
  titulo: string
  descricao: string
  tags: string[]
  images: string[]
  popularidade: number
  likes: number
  saves: number
  createdAt?: string
  backendId?: number
  commissionLink?: string
}
