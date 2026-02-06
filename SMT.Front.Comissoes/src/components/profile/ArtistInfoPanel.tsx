import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { MessageCircle, Pencil, Star, UserPlus } from "lucide-react"
import type { SocialLinkKey } from "@/types/profile"

type SocialLinkItem = {
  key: SocialLinkKey
  name: string
  handle: string
  icon: React.ComponentType<{ className?: string }>
}

type ArtistInfoPanelProps = {
  resolvedAvatarUrl: string
  resolvedDisplayName: string
  initials: string
  handle: string
  resolvedBio: string
  badgeList: string[]
  canEditProfile: boolean
  isUploadingAvatar: boolean
  onAvatarChange: (event: React.ChangeEvent<HTMLInputElement>) => void
  onEditProfile: () => void
  followersValue: number | null
  ratingValue: number
  socialLinks: SocialLinkItem[]
  resolvedStyleDescription: string
  resolvedStyleTags: string[]
  onOpenSocial: (key: SocialLinkKey, handle: string) => void
}

export function ArtistInfoPanel({
  resolvedAvatarUrl,
  resolvedDisplayName,
  initials,
  handle,
  resolvedBio,
  badgeList,
  canEditProfile,
  isUploadingAvatar,
  onAvatarChange,
  onEditProfile,
  followersValue,
  ratingValue,
  socialLinks,
  resolvedStyleDescription,
  resolvedStyleTags,
  onOpenSocial,
}: ArtistInfoPanelProps) {
  return (
    <aside className="self-start lg:sticky lg:top-8">
      <section className="space-y-6 p-3 lg:-mt-3 lg:min-h-[calc(100svh-14em)]">
        <div className="flex flex-col items-center gap-3 text-center">
          <div className="relative">
            <Avatar className="relative z-10 h-32 w-32">
              <AvatarImage
                src={resolvedAvatarUrl}
                alt={resolvedDisplayName}
              />
              <AvatarFallback>{initials}</AvatarFallback>
            </Avatar>
            {canEditProfile && (
              <>
                <input
                  id="profile-photo-input"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={onAvatarChange}
                />
                <label
                  htmlFor="profile-photo-input"
                  className="group absolute inset-0 z-20 flex cursor-pointer items-center justify-center rounded-full bg-[color:var(--overlay-soft)] text-[color:var(--overlay-text)] opacity-0 transition-opacity hover:opacity-100"
                  aria-label="Editar foto de perfil"
                >
                  <span className="flex items-center gap-2 text-sm font-semibold">
                    <Pencil className="h-4 w-4" />
                    Editar
                  </span>
                </label>
              </>
            )}
            {isUploadingAvatar && (
              <div className="absolute inset-0 z-30 flex items-center justify-center rounded-full bg-[color:var(--overlay)] text-xs font-semibold text-[color:var(--overlay-text)]">
                Enviando...
              </div>
            )}
          </div>
          <div className="space-y-1">
            <h2 className="text-2xl font-semibold">{resolvedDisplayName}</h2>
            <p className="text-sm text-muted-foreground">{handle}</p>
          </div>
          <p className="text-sm text-muted-foreground">{resolvedBio}</p>
        </div>
        <div className="flex w-full flex-wrap justify-center gap-2">
          {badgeList.length > 0 ? (
            badgeList.map((badge) => (
              <Badge key={badge} variant="secondary">
                {badge}
              </Badge>
            ))
          ) : (
            <Badge variant="secondary">Sem badges</Badge>
          )}
        </div>
        <div className="flex">
          {canEditProfile ? (
            <Button
              className="w-full gap-2 px-4 py-6 text-base"
              onClick={onEditProfile}
            >
              <Pencil className="h-5 w-5" />
              Editar perfil
            </Button>
          ) : (
            <>
              <Button className="flex-1 gap-2 px-4">
                <UserPlus className="h-4 w-4" />
                Seguir
              </Button>
              <Button
                variant="secondary"
                className="flex-1 gap-2"
                aria-label="Enviar DM"
              >
                <MessageCircle className="h-4 w-4" />
                Mensagem
              </Button>
            </>
          )}
        </div>
        <div className="space-y-2 text-sm">
          <div className="flex items-baseline gap-2">
            <span className="text-base font-semibold">
              {typeof followersValue === "number"
                ? followersValue.toLocaleString("pt-BR")
                : "--"}
            </span>
            <span className="text-muted-foreground">Seguidores</span>
          </div>
          {!canEditProfile && (
            <div className="flex items-baseline gap-2">
              <span className="text-base font-semibold">312</span>
              <span className="text-muted-foreground">Seguindo</span>
            </div>
          )}
          <div className="flex items-center gap-2">
            <span className="text-base font-semibold">
              {ratingValue.toFixed(1)}
            </span>
            <div className="flex items-center gap-0.5">
              {Array.from({ length: 5 }).map((_, index) => (
                <Star
                  key={index}
                  className={`h-3.5 w-2.5 ${index < Math.round(ratingValue)
                    ? "fill-foreground text-foreground"
                    : "text-muted-foreground"
                    }`}
                />
              ))}
            </div>
            <span className="text-muted-foreground">AvaliaÃ§Ã£o</span>
          </div>
        </div>
        <div className="text-center text-xs font-semibold uppercase text-muted-foreground">
          Redes sociais
        </div>
        <div className="flex flex-wrap justify-center gap-2">
          {socialLinks.map((link) => (
            <Button
              key={link.name}
              variant="ghost"
              size="icon-sm"
              aria-label={link.name}
              onClick={() => onOpenSocial(link.key, link.handle)}
            >
              <link.icon className="h-4 w-4" />
            </Button>
          ))}
        </div>
        <div className="space-y-2 text-sm">
          <div className="text-xs font-semibold uppercase text-muted-foreground">
            Sobre o estilo
          </div>
          <p className="text-muted-foreground">
            {resolvedStyleDescription}
          </p>
          <div className="flex flex-wrap gap-2">
            {resolvedStyleTags.length > 0 ? (
              resolvedStyleTags.map((tag) => (
                <Badge key={tag} variant="secondary">
                  {tag}
                </Badge>
              ))
            ) : (
              <Badge variant="secondary">Sem tags</Badge>
            )}
          </div>
        </div>
      </section>
    </aside>
  )
}
