"use client"

import { useEffect, useState, useCallback } from "react"
import { useParams } from "next/navigation"
import { useAuth } from "@/hooks/use-auth"
import { apiFetch } from "@/lib/api"
import type { Campaign, CampaignProgress, CampaignContact } from "@/types"
import { ArrowLeft, Play, Pause, RotateCcw, XCircle } from "lucide-react"
import Link from "next/link"
import { cn } from "@/lib/utils"

const statusStyle: Record<string, string> = {
  draft: "bg-gray-100 text-gray-600",
  running: "bg-green-50 text-green-700",
  paused: "bg-yellow-50 text-yellow-700",
  completed: "bg-blue-50 text-blue-700",
  cancelled: "bg-red-50 text-red-600",
}

const contactStatusStyle: Record<string, string> = {
  pending: "bg-gray-50 text-gray-500",
  calling: "bg-blue-50 text-blue-600",
  completed: "bg-green-50 text-green-700",
  failed: "bg-red-50 text-red-600",
  skipped: "bg-gray-50 text-gray-400",
}

export default function CampaignDetailPage() {
  const params = useParams()
  const { apiKey } = useAuth()
  const campaignId = params.id as string

  const [campaign, setCampaign] = useState<Campaign | null>(null)
  const [progress, setProgress] = useState<CampaignProgress | null>(null)
  const [contacts, setContacts] = useState<CampaignContact[]>([])
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState("")

  const loadData = useCallback(async () => {
    if (!apiKey) return
    try {
      const [c, p, ct] = await Promise.all([
        apiFetch<Campaign>(`/api/campaigns/${campaignId}`, { apiKey }),
        apiFetch<CampaignProgress>(`/api/campaigns/${campaignId}/progress`, { apiKey }),
        apiFetch<CampaignContact[]>(`/api/campaigns/${campaignId}/contacts`, { apiKey }),
      ])
      setCampaign(c)
      setProgress(p)
      setContacts(ct)
    } catch (err) {
      console.error(err)
    }
    setLoading(false)
  }, [apiKey, campaignId])

  useEffect(() => {
    loadData()
  }, [loadData])

  // Auto-refresh while running
  useEffect(() => {
    if (campaign?.status !== "running") return
    const interval = setInterval(loadData, 5000)
    return () => clearInterval(interval)
  }, [campaign?.status, loadData])

  async function handleAction(action: string) {
    setActionLoading(action)
    try {
      await apiFetch(`/api/campaigns/${campaignId}/${action}`, {
        method: "POST",
        apiKey,
      })
      await loadData()
    } catch (err) {
      console.error(err)
    }
    setActionLoading("")
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-8 h-8 border-2 border-brand border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (!campaign) {
    return <div className="text-center py-20 text-gray-400">Campaign not found</div>
  }

  const pct = campaign.total_contacts > 0
    ? Math.round((campaign.completed_count / campaign.total_contacts) * 100)
    : 0

  return (
    <div className="space-y-6">
      <Link
        href="/dashboard/campaigns"
        className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-brand transition-colors"
      >
        <ArrowLeft size={16} />
        Back to Campaigns
      </Link>

      {/* Header */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6">
        <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <h1 className="text-2xl font-bold text-gray-900">{campaign.name}</h1>
              <span className={cn("text-xs font-medium px-2.5 py-1 rounded-full capitalize", statusStyle[campaign.status])}>
                {campaign.status}
              </span>
            </div>
            {campaign.client_name && <p className="text-gray-500">{campaign.client_name}</p>}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            {(campaign.status === "draft" || campaign.status === "paused") && (
              <button
                onClick={() => handleAction("start")}
                disabled={!!actionLoading}
                className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-xl text-sm font-medium transition-colors disabled:opacity-50"
              >
                <Play size={16} />
                {actionLoading === "start" ? "Starting..." : campaign.status === "paused" ? "Resume" : "Start"}
              </button>
            )}
            {campaign.status === "running" && (
              <button
                onClick={() => handleAction("pause")}
                disabled={!!actionLoading}
                className="flex items-center gap-2 bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-xl text-sm font-medium transition-colors disabled:opacity-50"
              >
                <Pause size={16} />
                {actionLoading === "pause" ? "Pausing..." : "Pause"}
              </button>
            )}
            {(campaign.status === "completed" || campaign.status === "paused") && (
              <button
                onClick={() => handleAction("retry")}
                disabled={!!actionLoading}
                className="flex items-center gap-2 bg-brand hover:bg-brand-dark text-white px-4 py-2 rounded-xl text-sm font-medium transition-colors disabled:opacity-50"
              >
                <RotateCcw size={16} />
                Retry Failed
              </button>
            )}
            {campaign.status !== "completed" && campaign.status !== "cancelled" && (
              <button
                onClick={() => handleAction("cancel")}
                disabled={!!actionLoading}
                className="flex items-center gap-2 bg-red-50 hover:bg-red-100 text-red-600 px-4 py-2 rounded-xl text-sm font-medium transition-colors disabled:opacity-50"
              >
                <XCircle size={16} />
                Cancel
              </button>
            )}
          </div>
        </div>

        {/* Progress */}
        <div className="mb-4">
          <div className="flex justify-between text-sm text-gray-500 mb-2">
            <span>{campaign.completed_count} / {campaign.total_contacts} completed</span>
            <span>{pct}%</span>
          </div>
          <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-brand rounded-full transition-all duration-700"
              style={{ width: `${pct}%` }}
            />
          </div>
        </div>

        {/* Stats */}
        {progress && (
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mt-4">
            {Object.entries({
              Pending: progress.pending,
              Calling: progress.calling,
              Completed: progress.completed,
              Failed: progress.failed,
              Skipped: progress.skipped,
            }).map(([label, val]) => (
              <div key={label} className="text-center p-3 bg-gray-50 rounded-xl">
                <p className="text-xl font-bold text-gray-900">{val}</p>
                <p className="text-xs text-gray-500">{label}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Contacts */}
      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100">
          <h2 className="font-semibold text-gray-900">Contacts ({contacts.length})</h2>
        </div>
        {contacts.length === 0 ? (
          <div className="px-6 py-12 text-center text-gray-400">No contacts uploaded yet</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left text-xs text-gray-500 uppercase tracking-wider border-b border-gray-100">
                  <th className="px-6 py-3">Phone</th>
                  <th className="px-6 py-3">Name</th>
                  <th className="px-6 py-3">Status</th>
                  <th className="px-6 py-3">Lead Score</th>
                  <th className="px-6 py-3">Summary</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {contacts.map((ct) => (
                  <tr key={ct.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-3 text-sm font-medium text-gray-900">{ct.phone}</td>
                    <td className="px-6 py-3 text-sm text-gray-600">{ct.name || "—"}</td>
                    <td className="px-6 py-3">
                      <span className={cn("text-xs font-medium px-2 py-1 rounded-full capitalize", contactStatusStyle[ct.status])}>
                        {ct.status}
                      </span>
                    </td>
                    <td className="px-6 py-3 text-sm text-gray-600 capitalize">{ct.lead_score || "—"}</td>
                    <td className="px-6 py-3 text-sm text-gray-500 max-w-xs truncate">{ct.summary || "—"}</td>
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
