"use client"

import { cn } from "@/lib/utils"
import type { Screen } from "@/app/page"
import { Home, Calendar, Car, Pill, FileText } from "lucide-react"
import { useLanguage } from "@/contexts/language-context"

interface BottomNavProps {
  currentScreen: Screen
  onNavigate: (screen: Screen) => void
}

const navItems: { id: Screen; label: string; icon: typeof Home }[] = [
  { id: "home", label: "Home", icon: Home },
  { id: "appointments", label: "Appointments", icon: Calendar },
  { id: "transport", label: "Transport", icon: Car },
  { id: "medicine", label: "Medicine", icon: Pill },
  { id: "records", label: "Records", icon: FileText },
]

export function BottomNav({ currentScreen, onNavigate }: BottomNavProps) {
  const { t } = useLanguage()

  return (
    <nav className="bg-card border-t border-border px-2 pb-6 pt-2 safe-area-bottom">
      <div className="flex items-center justify-around">
        {navItems.map((item) => {
          const isActive = currentScreen === item.id
          const Icon = item.icon

          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={cn(
                "flex flex-col items-center gap-1 px-3 py-2 rounded-xl transition-all duration-200",
                isActive ? "text-primary bg-primary/10" : "text-muted-foreground hover:text-foreground",
              )}
            >
              <Icon className={cn("w-5 h-5", isActive && "scale-110")} />
              <span className="text-[10px] font-medium">{item.label}</span>
            </button>
          )
        })}
      </div>
    </nav>
  )
}
