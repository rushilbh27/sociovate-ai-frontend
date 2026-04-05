"use client"

import { useEffect, useState } from "react"
import { useAuth } from "@/hooks/use-auth"
import { apiFetch } from "@/lib/api"
import { Building2, Phone, PhoneCall, TrendingUp } from "lucide-react"

interface AdminStats {
  total_tenants: number
  total_calls: number
  active_calls: number
  total_phone_numbers: number
}

export default function AdminDashboardPage() {
  const { apiKey } = useAuth()
  const [stats, setStats] = useState<AdminStats | null>(null)

  useEffect(() => {
    if (!apiKey) return
    apiFetch<AdminStats>("/api/admin/stats", { apiKey })
      .then(setStats)
      .catch(console.error)
  }, [apiKey])

  const cards = stats
    ? [
        { label: "Tenants", value: stats.total_tenants, icon: Building2, color: "text-purple-600 bg-purple-50" },
        { label: "Total Calls", value: stats.total_calls, icon: PhoneCall, color: "text-blue-600 bg-blue-50" },
        { label: "Active Calls", value: stats.active_calls, icon: TrendingUp, color: "text-green-600 bg-green-50" },
        { label: "Phone Numbers", value: stats.total_phone_numbers, icon: Phone, color: "text-orange-600 bg-orange-50" },
      ]
    : []

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>

      {!stats ? (
        <div className="flex justify-center py-12">
          <div className="w-8 h-8 border-2 border-brand border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {cards.map((c) => {
            const Icon = c.icon
            return (
              <div key={c.label} className="bg-white rounded-2xl border border-gray-100 p-5">
                <div className="flex items-center gap-3 mb-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${c.color}`}>
                    <Icon size={20} />
                  </div>
                  <span className="text-sm text-gray-500">{c.label}</span>
                </div>
                <p className="text-3xl font-bold text-gray-900">{c.value.toLocaleString()}</p>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
