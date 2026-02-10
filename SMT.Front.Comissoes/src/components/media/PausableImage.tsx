import { useEffect, useMemo, useState } from "react"
import { cn } from "@/lib/utils"

type PausableImageProps = {
  src: string
  alt: string
  className?: string
  blurred?: boolean
  loading?: "eager" | "lazy"
}

const gifRegex = /\.gif(?:$|[?#])/i

export function PausableImage({
  src,
  alt,
  className,
  blurred = false,
  loading,
}: PausableImageProps) {
  const isGif = useMemo(() => gifRegex.test(src), [src])
  const shouldPause = blurred && isGif
  const [pausedSrc, setPausedSrc] = useState<string | null>(null)

  useEffect(() => {
    let active = true

    if (!shouldPause) {
      setPausedSrc(null)
      return () => {
        active = false
      }
    }

    const image = new Image()
    image.crossOrigin = "anonymous"
    image.onload = () => {
      if (!active) return
      const width = image.naturalWidth || image.width
      const height = image.naturalHeight || image.height
      const canvas = document.createElement("canvas")
      canvas.width = width
      canvas.height = height
      const context = canvas.getContext("2d")
      if (!context) {
        setPausedSrc(src)
        return
      }
      context.drawImage(image, 0, 0, width, height)
      try {
        setPausedSrc(canvas.toDataURL("image/jpeg", 0.92))
      } catch {
        setPausedSrc(src)
      }
    }
    image.onerror = () => {
      if (!active) return
      setPausedSrc(src)
    }
    image.src = src

    return () => {
      active = false
    }
  }, [src, shouldPause])

  if (shouldPause && !pausedSrc) {
    return <div className={cn("h-full w-full bg-muted/40", className)} aria-hidden="true" />
  }

  return (
    <img
      src={shouldPause && pausedSrc ? pausedSrc : src}
      alt={alt}
      className={className}
      loading={loading}
    />
  )
}
