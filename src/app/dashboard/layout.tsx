"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useAuth } from "@/hooks/use-auth"
import { cn } from "@/lib/utils"
import {
  LayoutDashboard, Phone, Megaphone, Users, Zap,
  Settings, LogOut, Menu, X, Shield, ChevronRight,
} from "lucide-react"

const navItems = [
  { href: "/dashboard", label: "Overview", icon: LayoutDashboard },
  { href: "/dashboard/calls", label: "Call Logs", icon: Phone },
  { href: "/dashboard/campaigns", label: "Campaigns", icon: Megaphone },
  { href: "/dashboard/contacts", label: "Contacts", icon: Users },
  { href: "/dashboard/quick-call", label: "Quick Call", icon: Zap },
  { href: "/dashboard/settings", label: "Settings", icon: Settings },
]

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user, loading, isAdmin, signOut } = useAuth()
  const pathname = usePathname()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FFF8F0]">
        <div className="w-8 h-8 border-2 border-[#FF8811] border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#FFF8F0] flex">
      {/* Sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-40 w-64 bg-white border-r border-orange-100 flex flex-col transition-transform lg:translate-x-0 lg:static",
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* Logo */}
        <div className="h-16 flex items-center justify-between px-6 border-b border-orange-100">
          <Link href="/dashboard" className="cursor-pointer">
            <span className="font-script text-2xl text-[#FF8811] leading-none">Sociovate</span>
          </Link>
          <button className="lg:hidden cursor-pointer" onClick={() => setSidebarOpen(false)}>
            <X size={20} className="text-gray-500" />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const active = pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href))
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors cursor-pointer",
                  active
                    ? "bg-[#FF8811]/10 text-[#FF8811]"
                    : "text-gray-600 hover:bg-orange-50 hover:text-[#FF8811]"
                )}
                onClick={() => setSidebarOpen(false)}
              >
                <item.icon size={18} />
                {item.label}
              </Link>
            )
          })}

          {/* Admin link */}
          {isAdmin && (
            <>
              <div className="my-4 border-t border-orange-100" />
              <Link
                href="/admin"
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors cursor-pointer",
                  pathname.startsWith("/admin")
                    ? "bg-[#FF8811]/10 text-[#FF8811]"
                    : "text-gray-600 hover:bg-orange-50 hover:text-[#FF8811]"
                )}
                onClick={() => setSidebarOpen(false)}
              >
                <Shield size={18} />
                Admin Panel
                <ChevronRight size={14} className="ml-auto" />
              </Link>
            </>
          )}
        </nav>

        {/* User section */}
        <div className="p-4 border-t border-orange-100">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 rounded-full bg-[#FF8811]/10 flex items-center justify-center">
              <span className="text-sm font-semibold text-[#FF8811]">
                {user?.user_metadata?.full_name?.[0] || user?.email?.[0]?.toUpperCase() || "U"}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">
                {user?.user_metadata?.full_name || "User"}
              </p>
              <p className="text-xs text-gray-500 truncate">{user?.email}</p>
            </div>
          </div>
          <button
            onClick={signOut}
            className="flex items-center gap-2 text-sm text-gray-500 hover:text-red-500 transition-colors w-full px-2 py-1.5 cursor-pointer"
          >
            <LogOut size={16} />
            Sign out
          </button>
        </div>
      </aside>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/20 z-30 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <header className="h-16 bg-white border-b border-orange-100 flex items-center px-6 gap-4 sticky top-0 z-20 shadow-sm shadow-orange-100/40">
          <button className="lg:hidden cursor-pointer" onClick={() => setSidebarOpen(true)}>
            <Menu size={20} className="text-gray-600" />
          </button>
          <div className="flex-1" />
        </header>

        {/* Page content */}
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  )
}
