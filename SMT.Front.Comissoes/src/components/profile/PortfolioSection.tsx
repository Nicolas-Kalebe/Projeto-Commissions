import { Button } from "@/components/ui/button"
import { OverlayPill } from "@/components/ui/overlay"
import { PortfolioPreviewCard } from "@/components/profile/PortfolioPreviewCard"
import { Bookmark, Heart } from "lucide-react"
import type { PortfolioPost } from "@/types/profile"

type PortfolioSectionProps = {
  sortedPosts: PortfolioPost[]
  canEditProfile: boolean
  isOwnerProfile: boolean
  likedPosts: Record<string, boolean>
  onAddPortfolio: () => void
  onOpenPost: (index: number) => void
  resolveMetrics: (post: PortfolioPost) => { likes: number; saves: number }
}

export function PortfolioSection({
  sortedPosts,
  canEditProfile,
  isOwnerProfile,
  likedPosts,
  onAddPortfolio,
  onOpenPost,
  resolveMetrics,
}: PortfolioSectionProps) {
  if (sortedPosts.length > 0 || canEditProfile) {
    return (
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {canEditProfile && (
          <button
            type="button"
            className="group flex aspect-[4/3] cursor-pointer items-center justify-center rounded-xl border border-dashed border-zinc-500/60 bg-card/40 text-muted-foreground transition hover:border-zinc-700/70 hover:text-foreground dark:border-border/60 dark:hover:border-foreground/40"
            onClick={onAddPortfolio}
          >
            <div className="flex flex-col items-center gap-2">
              <div className="flex h-12 w-12 items-center justify-center rounded-full border border-dashed border-zinc-500/60 text-3xl font-semibold dark:border-border/60">
                +
              </div>
              <span className="text-sm font-semibold">
                Adicionar imagem
              </span>
            </div>
          </button>
        )}
        {sortedPosts.map((post, index) => {
          const metrics = resolveMetrics(post)
          return (
            <div key={post.id} className="group relative">
              <PortfolioPreviewCard
                post={post}
                onOpen={() => onOpenPost(index)}
              />
              <OverlayPill className="pointer-events-none absolute bottom-3 left-3 z-10 flex items-center gap-1 rounded-full px-2 py-1 text-xs font-semibold">
                <Heart
                  className={`h-3 w-3 ${likedPosts[post.id] ? "fill-red-500 text-red-500" : "text-[color:var(--overlay-text-muted)]"}`}
                />
                <span>{metrics.likes.toLocaleString("pt-BR")}</span>
              </OverlayPill>
              <div className="absolute bottom-3 right-3 z-10 flex gap-2 opacity-0 transition-opacity group-hover:opacity-100">
                {isOwnerProfile ? null : (
                  <>
                    <Button
                      type="button"
                      variant="secondary"
                      size="icon-sm"
                      aria-label="Curtir"
                      onClick={(event) => event.stopPropagation()}
                    >
                      <Heart className="h-4 w-4" />
                    </Button>
                    <Button
                      type="button"
                      variant="secondary"
                      size="icon-sm"
                      aria-label="Salvar"
                      onClick={(event) => event.stopPropagation()}
                    >
                      <Bookmark className="h-4 w-4" />
                    </Button>
                  </>
                )}
              </div>
            </div>
          )
        })}
      </div>
    )
  }

  return (
    <div className="rounded-xl border border-dashed border-border/60 bg-card/50 p-6 text-center text-sm text-muted-foreground">
      Nenhum post no portf?lio ainda.
    </div>
  )
}
