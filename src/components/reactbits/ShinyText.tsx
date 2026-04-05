import { cn } from "@/lib/utils"

interface ShinyTextProps {
  text: string
  className?: string
  disabled?: boolean
  speed?: number
}

export function ShinyText({ text, className, disabled = false, speed = 5 }: ShinyTextProps) {
  return (
    <span
      className={cn(
        "inline-block bg-clip-text",
        !disabled && "animate-shine",
        className
      )}
      style={
        disabled
          ? undefined
          : {
              backgroundImage:
                "linear-gradient(120deg, #6b7280 0%, #6b7280 40%, #6C3CE1 50%, #A78BFA 55%, #6b7280 65%, #6b7280 100%)",
              backgroundSize: "200% auto",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              animation: `shine ${speed}s linear infinite`,
            }
      }
    >
      {text}
    </span>
  )
}
