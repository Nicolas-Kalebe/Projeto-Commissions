import { useEffect, useState } from "react"
import type { CarouselApi } from "@/components/ui/carousel"

type CarouselDotsState = {
  index: number
  snaps: number[]
}

export function useCarouselDots(
  carouselApi: CarouselApi | null,
  enabled = true
): CarouselDotsState {
  const [index, setIndex] = useState(0)
  const [snaps, setSnaps] = useState<number[]>([])

  useEffect(() => {
    if (!carouselApi || !enabled) return
    const update = () => {
      setSnaps(carouselApi.scrollSnapList())
      setIndex(carouselApi.selectedScrollSnap())
    }
    update()
    carouselApi.on("select", update)
    carouselApi.on("reInit", update)
    return () => {
      carouselApi.off("select", update)
    }
  }, [carouselApi, enabled])

  return { index, snaps }
}
