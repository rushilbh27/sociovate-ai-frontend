"use client"

import { useEffect, useState } from "react"
import { useAuth } from "@/hooks/use-auth"
import { apiFetch } from "@/lib/api"
import type { Campaign } from "@/types"
import { Plus, MoreHorizontal } from "lucide-react"
import Link from "next/link"
import { cn } from "@/lib/utils"

const statusStyle: Record<string, string> = {
  draft: "bg-gray-100 text-gray-600",
  running: "bg-green-50 text-green-700",
  paused: "bg-yellow-50 text-yellow-700",
  completed: "bg-blue-50 text-blue-700",
  cancelled: "bg-red-50 text-red-600",
}

export default function CampaignsPage() {
  const { apiKey, loading: authLoading } = useAuth()
  const [campaigns, setCampaigns] = useState<Campaign[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (authLoading) return
    if (!apiKey) {
      setLoading(false)
      return
    }
    apiFetch<Campaign[]>("/api/campaigns", { apiKey })
      .then(setCampaigns)
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [apiKey, authLoading])

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
          <h1 className="text-2xl font-bold text-gray-900">Campaigns</h1>
          <p className="text-gray-500">{campaigns.length} campaigns</p>
        </div>
        <Link
          href="/dashboard/campaigns/new"
          className="flex items-center gap-2 bg-brand hover:bg-brand-dark text-white px-5 py-2.5 rounded-xl text-sm font-medium transition-colors"
        >
          <Plus size={18} />
          New Campaign
        </Link>
      </div>

      {campaigns.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 px-6 py-16 text-center">
          <p className="text-gray-400 mb-4">No campaigns yet</p>
          <Link
            href="/dashboard/campaigns/new"
            className="inline-flex items-center gap-2 bg-brand text-white px-5 py-2.5 rounded-xl text-sm font-medium hover:bg-brand-dark transition-colors"
          >
            <Plus size={18} />
            Create your first campaign
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {campaigns.map((c) => {
            const progress = c.total_contacts > 0
              ? Math.round((c.completed_count / c.total_contacts) * 100)
              : 0
            return (
              <Link
                key={c.id}
                href={`/dashboard/campaigns/${c.id}`}
                className="bg-white rounded-2xl border border-gray-100 p-6 hover:shadow-md hover:border-brand/20 transition-all"
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="font-semibold text-gray-900">{c.name}</h3>
                    {c.client_name && (
                      <p className="text-sm text-gray-500">{c.client_name}</p>
                    )}
                  </div>
                  <span className={cn("text-xs font-medium px-2.5 py-1 rounded-full capitalize", statusStyle[c.status])}>
                    {c.status}
                  </span>
                </div>

                {/* Progress bar */}
                <div className="mb-3">
                  <div className="flex justify-between text-xs text-gray-500 mb-1">
                    <span>{c.completed_count} / {c.total_contacts} calls</span>
                    <span>{progress}%</span>
                  </div>
                  <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-brand rounded-full transition-all duration-500"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>

                <p className="text-xs text-gray-400">
                  Created {new Date(c.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
                </p>
              </Link>
            )
          })}
        </div>
      )}
    </div>
  )
}
