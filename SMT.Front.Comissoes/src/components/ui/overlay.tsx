import type { HTMLAttributes } from "react"
import { cn } from "@/lib/utils"

type OverlayTone = "strong" | "base" | "soft"

const toneClasses: Record<OverlayTone, string> = {
  strong: "bg-[color:var(--overlay-strong)] text-[color:var(--overlay-text)]",
  base: "bg-[color:var(--overlay)] text-[color:var(--overlay-text)]",
  soft: "bg-[color:var(--overlay-soft)] text-[color:var(--overlay-text)]",
}

type OverlayPillProps = HTMLAttributes<HTMLDivElement> & {
  tone?: OverlayTone
}

function OverlayPill({ tone = "strong", className, ...props }: OverlayPillProps) {
  return <div className={cn(toneClasses[tone], className)} {...props} />
}

export { OverlayPill }
