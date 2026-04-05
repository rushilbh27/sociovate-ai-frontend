"use client"

import { useEffect, useState } from "react"
import { useAuth } from "@/hooks/use-auth"
import { apiFetch } from "@/lib/api"
import type { CallLog } from "@/types"
import { Search, Download } from "lucide-react"
import Link from "next/link"

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

function formatDuration(s: number): string {
  return `${Math.floor(s / 60)}m ${s % 60}s`
}

export default function CallLogsPage() {
  const { apiKey, loading: authLoading } = useAuth()
  const [calls, setCalls] = useState<CallLog[]>([])
  const [search, setSearch] = useState("")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (authLoading) return
    if (!apiKey) {
      setLoading(false)
      return
    }
    apiFetch<CallLog[]>("/api/logs", { apiKey })
      .then(setCalls)
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [apiKey, authLoading])

  const filtered = calls.filter(
    (c) =>
      c.phone_number.includes(search) ||
      c.caller_name?.toLowerCase().includes(search.toLowerCase()) ||
      c.summary?.toLowerCase().includes(search.toLowerCase())
  )

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-8 h-8 border-2 border-brand border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Call Logs</h1>
          <p className="text-gray-500">{calls.length} total calls</p>
        </div>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by phone, name, or summary..."
          className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 focus:border-brand focus:ring-2 focus:ring-brand/20 outline-none transition-all bg-white text-sm"
        />
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        {filtered.length === 0 ? (
          <div className="px-6 py-12 text-center text-gray-400">
            {search ? "No calls match your search" : "No calls yet"}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left text-xs text-gray-500 uppercase tracking-wider border-b border-gray-100">
                  <th className="px-6 py-3">Phone / Name</th>
                  <th className="px-6 py-3">Duration</th>
                  <th className="px-6 py-3">Sentiment</th>
                  <th className="px-6 py-3">Lead Score</th>
                  <th className="px-6 py-3">Disposition</th>
                  <th className="px-6 py-3">Summary</th>
                  <th className="px-6 py-3">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filtered.map((call) => (
                  <tr
                    key={call.id}
                    className="hover:bg-gray-50 transition-colors"
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
                        <span className={`text-xs font-medium px-2 py-1 rounded-full ${sentimentColor[call.sentiment] || ""}`}>
                          {call.sentiment}
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      {call.lead_score && (
                        <span className={`text-xs font-medium px-2 py-1 rounded-full ${leadColor[call.lead_score] || ""}`}>
                          {call.lead_score}
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600 capitalize">
                      {call.disposition || "-"}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">
                      {call.summary || "-"}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">
                      {new Date(call.created_at).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
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
