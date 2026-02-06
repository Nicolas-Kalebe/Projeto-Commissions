import { useState } from "react"
import {
  type CarouselApi,
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel"
import {
  CarouselDots,
  CarouselOverlayNext,
  CarouselOverlayPrevious,
} from "@/components/ui/carousel-overlay"
import { OverlayPill } from "@/components/ui/overlay"
import { useCarouselDots } from "@/hooks/use-carousel-dots"
import type { PortfolioPost } from "@/types/profile"

type PortfolioPreviewCardProps = {
  post: PortfolioPost
  onOpen: () => void
}

export function PortfolioPreviewCard({ post, onOpen }: PortfolioPreviewCardProps) {
  const [carouselApi, setCarouselApi] = useState<CarouselApi | null>(null)
  const hasMultipleImages = post.images.length > 1
  const { index: carouselIndex, snaps: carouselSnaps } = useCarouselDots(
    carouselApi,
    hasMultipleImages
  )

  return (
    <button
      type="button"
      className="group relative h-full w-full cursor-pointer overflow-hidden rounded-xl border bg-card"
      onClick={onOpen}
    >
      <div className="aspect-[4/3] w-full overflow-hidden">
        <div className="relative h-full w-full">
          {hasMultipleImages ? (
            <Carousel
              opts={{ loop: true }}
              setApi={setCarouselApi}
              className="h-full w-full overflow-hidden"
            >
              <CarouselContent viewportClassName="h-full" className="h-full !-ml-0">
                {post.images.map((image, index) => (
                  <CarouselItem key={`${post.id}-${index}`} className="h-full !pl-0">
                    <img
                      src={image}
                      alt={`${post.titulo} ${index + 1}`}
                      className="h-full w-full object-cover"
                      loading="lazy"
                    />
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselOverlayPrevious
                className="left-2 top-1/2 -translate-y-1/2 h-8 w-8"
                onClick={(event) => {
                  event.stopPropagation()
                  carouselApi?.scrollPrev()
                }}
                onPointerDown={(event) => event.stopPropagation()}
                aria-label="Imagem anterior"
              />
              <CarouselOverlayNext
                className="right-2 top-1/2 -translate-y-1/2 h-8 w-8"
                onClick={(event) => {
                  event.stopPropagation()
                  carouselApi?.scrollNext()
                }}
                onPointerDown={(event) => event.stopPropagation()}
                aria-label="Proxima imagem"
              />
              <CarouselDots
                snaps={carouselSnaps}
                activeIndex={carouselIndex}
                onSelect={(index) => carouselApi?.scrollTo(index)}
              />
            </Carousel>
          ) : (
            <img
              src={post.images[0]}
              alt={post.titulo}
              className="h-full w-full object-cover"
              loading="lazy"
            />
          )}
          <OverlayPill className="pointer-events-none absolute left-3 top-3 rounded-full px-3 py-1 text-xs font-semibold opacity-0 transition-opacity group-hover:opacity-100">
            {post.titulo}
          </OverlayPill>
        </div>
      </div>
    </button>
  )
}
