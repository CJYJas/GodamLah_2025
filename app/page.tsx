"use client"

import { useState } from "react"
import { MobileFrame } from "@/components/mobile-frame"
import { HomeScreen } from "@/components/screens/home-screen"
import { AppointmentsScreen } from "@/components/screens/appointments-screen"
import { TransportScreen } from "@/components/screens/transport-screen"
import { MedicineScreen } from "@/components/screens/medicine-screen"
import { RecordsScreen } from "@/components/screens/records-screen"
import { BottomNav } from "@/components/bottom-nav"
import { Sidebar } from "@/components/sidebar"

export type Screen = "home" | "appointments" | "transport" | "medicine" | "records"

export default function MyHealth() {
  const [currentScreen, setCurrentScreen] = useState<Screen>("home")
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const handleLogout = () => {
    // Logout logic would go here
    setSidebarOpen(false)
  }

  const renderScreen = () => {
    switch (currentScreen) {
      case "home":
        return <HomeScreen onNavigate={setCurrentScreen} onOpenSidebar={() => setSidebarOpen(true)} />
      case "appointments":
        return <AppointmentsScreen />
      case "transport":
        return <TransportScreen />
      case "medicine":
        return <MedicineScreen />
      case "records":
        return <RecordsScreen />
      default:
        return <HomeScreen onNavigate={setCurrentScreen} onOpenSidebar={() => setSidebarOpen(true)} />
    }
  }

  return (
    <div className="min-h-screen bg-muted flex items-center justify-center p-4">
      <MobileFrame>
        <div className="flex flex-col h-full relative">
          <div className="flex-1 overflow-y-auto overflow-x-hidden">{renderScreen()}</div>
          <BottomNav currentScreen={currentScreen} onNavigate={setCurrentScreen} />
          <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} onLogout={handleLogout} />
        </div>
      </MobileFrame>
    </div>
  )
}
