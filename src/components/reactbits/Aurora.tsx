"use client"

import { cn } from "@/lib/utils"

interface AuroraProps {
  className?: string
  children?: React.ReactNode
}

export function Aurora({ className, children }: AuroraProps) {
  return (
    <div className={cn("relative overflow-hidden", className)}>
      {/* Teal / Ocean Breeze blob */}
      <div
        className="pointer-events-none absolute left-[-15%] top-[-20%] h-[70%] w-[55%] rounded-full blur-[90px]"
        style={{
          background: "radial-gradient(circle, rgba(157,217,210,0.50) 0%, transparent 70%)",
          animation: "aurora1 9s ease-in-out infinite",
        }}
      />
      {/* Golden Nectar blob */}
      <div
        className="pointer-events-none absolute right-[-15%] top-[-10%] h-[65%] w-[50%] rounded-full blur-[90px]"
        style={{
          background: "radial-gradient(circle, rgba(244,208,111,0.40) 0%, transparent 70%)",
          animation: "aurora2 11s ease-in-out infinite",
        }}
      />
      {/* Sunset Ember / peach blob */}
      <div
        className="pointer-events-none absolute bottom-[-10%] left-[20%] h-[55%] w-[50%] rounded-full blur-[80px]"
        style={{
          background: "radial-gradient(circle, rgba(255,200,140,0.35) 0%, transparent 70%)",
          animation: "aurora3 13s ease-in-out infinite",
        }}
      />
      {/* Warm ivory/cream blob */}
      <div
        className="pointer-events-none absolute right-[8%] top-[35%] h-[45%] w-[38%] rounded-full blur-[70px]"
        style={{
          background: "radial-gradient(circle, rgba(255,220,160,0.30) 0%, transparent 70%)",
          animation: "aurora4 10s ease-in-out infinite",
        }}
      />
      {children}
    </div>
  )
}
