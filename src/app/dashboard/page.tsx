"use client"

import { useEffect, useState } from "react"
import { useAuth } from "@/hooks/use-auth"
import { apiFetch } from "@/lib/api"
import type { CallLog, CallStats } from "@/types"
import {
  Phone,
  Clock,
  Calendar,
  TrendingUp,
  ArrowUpRight,
} from "lucide-react"
import Link from "next/link"

function StatCard({
  label,
  value,
  sub,
  icon: Icon,
  color,
}: {
  label: string
  value: string | number
  sub?: string
  icon: React.ElementType
  color: string
}) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-6 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div className={`w-10 h-10 rounded-xl ${color} flex items-center justify-center`}>
          <Icon size={20} className="text-white" />
        </div>
      </div>
      <p className="text-2xl font-bold text-gray-900">{value}</p>
      <p className="text-sm text-gray-500">{label}</p>
      {sub && <p className="text-xs text-brand mt-1">{sub}</p>}
    </div>
  )
}

function formatDuration(seconds: number): string {
  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  return `${m}m ${s}s`
}

function formatTime(iso: string): string {
  return new Date(iso).toLocaleString("en-IN", {
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  })
}

const sentimentColor: Record<string, string> = {
  positive: "text-green-600 bg-green-50",
  neutral: "text-gray-600 bg-gray-50",
  negative: "text-red-600 bg-red-50",
  frustrated: "text-orange-600 bg-orange-50",
}

const leadColor: Record<string, string> = {
  hot: "text-red-600 bg-red-50",
  warm: "text-orange-600 bg-orange-50",
  cold: "text-blue-600 bg-blue-50",
  not_interested: "text-gray-600 bg-gray-50",
  no_answer: "text-gray-400 bg-gray-50",
}

export default function DashboardPage() {
  const { apiKey } = useAuth()
  const [stats, setStats] = useState<CallStats | null>(null)
  const [recentCalls, setRecentCalls] = useState<CallLog[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!apiKey) return
    async function load() {
      try {
        const [s, logs] = await Promise.all([
          apiFetch<CallStats>("/api/stats", { apiKey }),
          apiFetch<CallLog[]>("/api/logs", { apiKey }),
        ])
        setStats(s)
        setRecentCalls(logs.slice(0, 10))
      } catch (err) {
        console.error("Failed to load dashboard:", err)
      }
      setLoading(false)
    }
    load()
  }, [apiKey])

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-8 h-8 border-2 border-brand border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-500">Overview of your calling activity</p>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Total Calls"
          value={stats?.total_calls || 0}
          icon={Phone}
          color="bg-brand"
        />
        <StatCard
          label="Avg Duration"
          value={stats ? formatDuration(Math.round(stats.avg_duration_seconds)) : "N/A"}
          icon={Clock}
          color="bg-blue-500"
        />
        <StatCard
          label="Appointments Booked"
          value={stats?.total_booked || 0}
          icon={Calendar}
          color="bg-green-500"
        />
        <StatCard
          label="Booking Rate"
          value={stats ? `${Math.round(stats.booking_rate * 100)}%` : "N/A"}
          icon={TrendingUp}
          color="bg-orange-500"
          sub={stats && stats.booking_rate > 0.1 ? "Above average" : undefined}
        />
      </div>

      {/* Recent calls */}
      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <h2 className="font-semibold text-gray-900">Recent Calls</h2>
          <Link
            href="/dashboard/calls"
            className="text-sm text-brand hover:underline flex items-center gap-1"
          >
            View all <ArrowUpRight size={14} />
          </Link>
        </div>

        {recentCalls.length === 0 ? (
          <div className="px-6 py-12 text-center text-gray-400">
            No calls yet. Make your first call from the Quick Call page.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left text-xs text-gray-500 uppercase tracking-wider">
                  <th className="px-6 py-3">Phone</th>
                  <th className="px-6 py-3">Duration</th>
                  <th className="px-6 py-3">Sentiment</th>
                  <th className="px-6 py-3">Lead Score</th>
                  <th className="px-6 py-3">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {recentCalls.map((call) => (
                  <tr
                    key={call.id}
                    className="hover:bg-gray-50 cursor-pointer transition-colors"
                  >
                    <td className="px-6 py-4">
                      <Link href={`/dashboard/calls/${call.id}`} className="font-medium text-gray-900 hover:text-brand">
                        {call.phone_number}
                      </Link>
                      {call.caller_name && (
                        <p className="text-xs text-gray-500">{call.caller_name}</p>
                      )}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {formatDuration(call.duration_seconds)}
                    </td>
                    <td className="px-6 py-4">
                      {call.sentiment && (
                        <span className={`text-xs font-medium px-2 py-1 rounded-full ${sentimentColor[call.sentiment] || "text-gray-600 bg-gray-50"}`}>
                          {call.sentiment}
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      {call.lead_score && (
                        <span className={`text-xs font-medium px-2 py-1 rounded-full ${leadColor[call.lead_score] || "text-gray-600 bg-gray-50"}`}>
                          {call.lead_score}
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {formatTime(call.created_at)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
