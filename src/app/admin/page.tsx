"use client"

import { useEffect, useState } from "react"
import { useAuth } from "@/hooks/use-auth"
import { apiFetch } from "@/lib/api"
import { Calendar, Phone, PhoneCall, TrendingUp } from "lucide-react"

interface AdminStats {
  total_calls: number
  total_bookings: number
  avg_duration: number
  booking_rate: number
}

export default function AdminDashboardPage() {
  const { apiKey, loading: authLoading } = useAuth()
  const [stats, setStats] = useState<AdminStats | null>(null)
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    if (authLoading) return
    if (!apiKey) {
      setLoaded(true)
      return
    }
    apiFetch<AdminStats>("/api/stats", { apiKey })
      .then(setStats)
      .catch(console.error)
      .finally(() => setLoaded(true))
  }, [apiKey, authLoading])

  const cards = stats
    ? [
        { label: "Total Calls", value: stats.total_calls, icon: PhoneCall, color: "text-blue-600 bg-blue-50" },
        { label: "Bookings", value: stats.total_bookings, icon: Calendar, color: "text-green-600 bg-green-50" },
        { label: "Avg Duration", value: `${Math.floor(stats.avg_duration / 60)}m ${stats.avg_duration % 60}s`, icon: Phone, color: "text-orange-600 bg-orange-50" },
        { label: "Booking Rate", value: `${stats.booking_rate}%`, icon: TrendingUp, color: "text-purple-600 bg-purple-50" },
      ]
    : []

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>

      {!loaded ? (
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
                <p className="text-3xl font-bold text-gray-900">{typeof c.value === "number" ? c.value.toLocaleString() : c.value}</p>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
