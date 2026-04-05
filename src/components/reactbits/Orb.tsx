import { cn } from "@/lib/utils"

interface OrbProps {
  className?: string
  color?: string
  size?: number
  blur?: number
  opacity?: number
}

export function Orb({
  className,
  color = "rgba(255, 136, 17, 0.20)",
  size = 600,
  blur = 80,
  opacity = 1,
}: OrbProps) {
  return (
    <div
      className={cn("pointer-events-none absolute rounded-full", className)}
      style={{
        width: size,
        height: size,
        background: `radial-gradient(circle, ${color} 0%, transparent 70%)`,
        filter: `blur(${blur}px)`,
        opacity,
        transform: "translate(-50%, -50%)",
      }}
    />
  )
}
