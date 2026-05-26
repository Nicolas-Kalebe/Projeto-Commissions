import { useEffect, useRef, type ClipboardEvent, type KeyboardEvent } from "react"
import { cn } from "@/lib/utils"

interface OtpInputProps {
  value: string
  onChange: (next: string) => void
  length?: number
  disabled?: boolean
  autoFocus?: boolean
  className?: string
}

export function OtpInput({
  value,
  onChange,
  length = 6,
  disabled = false,
  autoFocus = true,
  className,
}: OtpInputProps) {
  const refs = useRef<Array<HTMLInputElement | null>>([])
  const chars = value.padEnd(length, " ").slice(0, length).split("")

  useEffect(() => {
    if (autoFocus) refs.current[0]?.focus()
  }, [autoFocus])

  const setDigit = (index: number, digit: string) => {
    const sanitized = digit.replace(/\D/g, "")
    if (!sanitized) {
      const next = (value.slice(0, index) + " " + value.slice(index + 1)).trimEnd()
      onChange(next)
      return
    }
    const newValue = (value.padEnd(length, " ").slice(0, length).split("") as string[])
    newValue[index] = sanitized[0]
    const joined = newValue.join("").trimEnd()
    onChange(joined)
    if (index < length - 1) refs.current[index + 1]?.focus()
  }

  const handleKeyDown = (index: number) => (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace") {
      if (!chars[index]?.trim() && index > 0) {
        refs.current[index - 1]?.focus()
        const cleared = (value.slice(0, index - 1) + " " + value.slice(index)).trimEnd()
        onChange(cleared)
        e.preventDefault()
      }
    } else if (e.key === "ArrowLeft" && index > 0) {
      refs.current[index - 1]?.focus()
    } else if (e.key === "ArrowRight" && index < length - 1) {
      refs.current[index + 1]?.focus()
    }
  }

  const handlePaste = (e: ClipboardEvent<HTMLInputElement>) => {
    const text = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, length)
    if (!text) return
    e.preventDefault()
    onChange(text)
    const target = Math.min(text.length, length - 1)
    refs.current[target]?.focus()
  }

  return (
    <div className={cn("flex justify-center gap-2", className)}>
      {Array.from({ length }, (_, index) => (
        <input
          key={index}
          ref={(el) => {
            refs.current[index] = el
          }}
          inputMode="numeric"
          autoComplete="one-time-code"
          maxLength={1}
          disabled={disabled}
          value={chars[index]?.trim() ?? ""}
          onChange={(e) => setDigit(index, e.target.value)}
          onKeyDown={handleKeyDown(index)}
          onPaste={handlePaste}
          className="border-input dark:bg-input/30 h-12 w-10 rounded-md border bg-transparent text-center text-lg font-semibold shadow-xs outline-none transition-[color,box-shadow] disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]"
        />
      ))}
    </div>
  )
}
