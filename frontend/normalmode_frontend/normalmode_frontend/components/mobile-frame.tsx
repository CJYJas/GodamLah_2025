import type React from "react"
import { cn } from "@/lib/utils"

interface MobileFrameProps {
  children: React.ReactNode
  className?: string
}

export function MobileFrame({ children, className }: MobileFrameProps) {
  return (
    <div
      className={cn(
        "relative w-full max-w-[390px] h-[844px] bg-card rounded-[3rem] shadow-2xl overflow-hidden",
        "border-[12px] border-foreground/90",
        className,
      )}
    >
      {/* Notch */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[120px] h-[32px] bg-foreground/90 rounded-b-2xl z-50" />

      {/* Screen content */}
      <div className="w-full h-full bg-background overflow-hidden pt-8">{children}</div>

      {/* Home indicator */}
      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-32 h-1 bg-foreground/30 rounded-full" />
    </div>
  )
}
