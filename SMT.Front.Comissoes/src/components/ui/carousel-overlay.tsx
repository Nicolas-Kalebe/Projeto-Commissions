import * as React from "react"
import { CarouselNext, CarouselPrevious } from "@/components/ui/carousel"
import { cn } from "@/lib/utils"

type OverlayButtonProps = React.ComponentProps<typeof CarouselPrevious>

const overlayButtonBase =
  "rounded-full border border-[color:var(--overlay-border)] bg-[color:var(--overlay)] text-[color:var(--overlay-text)] shadow-sm opacity-0 transition-opacity group-hover:opacity-100 hover:bg-[color:var(--overlay-strong)]"

function CarouselOverlayPrevious({ className, ...props }: OverlayButtonProps) {
  return (
    <CarouselPrevious className={cn(overlayButtonBase, className)} {...props} />
  )
}

function CarouselOverlayNext({ className, ...props }: OverlayButtonProps) {
  return <CarouselNext className={cn(overlayButtonBase, className)} {...props} />
}

type CarouselDotsProps = {
  snaps: number[]
  activeIndex: number
  onSelect: (index: number) => void
  className?: string
  dotClassName?: string
}

function CarouselDots({
  snaps,
  activeIndex,
  onSelect,
  className,
  dotClassName,
}: CarouselDotsProps) {
  if (!snaps.length) return null

  return (
    <div
      className={cn(
        "pointer-events-auto absolute bottom-2 left-1/2 z-10 flex -translate-x-1/2 items-center gap-1.5",
        className
      )}
    >
      {snaps.map((_, index) => (
        <button
          key={`carousel-dot-${index}`}
          type="button"
          className={cn(
            "h-1.5 w-1.5 rounded-full transition",
            index === activeIndex
              ? "bg-[color:var(--overlay-text)]"
              : "bg-[color:var(--overlay-text-muted)] hover:bg-[color:var(--overlay-text)]",
            dotClassName
          )}
          onClick={(event) => {
            event.stopPropagation()
            onSelect(index)
          }}
          onPointerDown={(event) => event.stopPropagation()}
          aria-label={`Ir para imagem ${index + 1}`}
        />
      ))}
    </div>
  )
}

export { CarouselOverlayNext, CarouselOverlayPrevious, CarouselDots }
