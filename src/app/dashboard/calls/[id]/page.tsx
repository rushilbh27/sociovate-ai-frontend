"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { useAuth } from "@/hooks/use-auth"
import { apiFetch } from "@/lib/api"
import { ArrowLeft, Play, Download, User, Bot } from "lucide-react"
import Link from "next/link"

interface CallDetail {
  id: number
  phone_number: string
  caller_name?: string
  duration_seconds: number
  summary?: string
  sentiment?: string
  lead_score?: string
  disposition?: string
  was_booked?: boolean
  recording_url?: string
  room_name?: string
  estimated_cost_inr?: number
  tts_chars?: number
  created_at: string
}

interface TranscriptLine {
  role: "user" | "assistant"
  content: string
  created_at: string
}

function formatDuration(s: number): string {
  return `${Math.floor(s / 60)}m ${s % 60}s`
}

const badgeColor: Record<string, string> = {
  positive: "bg-green-50 text-green-700 border-green-200",
  neutral: "bg-gray-50 text-gray-700 border-gray-200",
  negative: "bg-red-50 text-red-700 border-red-200",
  frustrated: "bg-orange-50 text-orange-700 border-orange-200",
  hot: "bg-red-50 text-red-700 border-red-200",
  warm: "bg-orange-50 text-orange-700 border-orange-200",
  cold: "bg-blue-50 text-blue-700 border-blue-200",
  not_interested: "bg-gray-50 text-gray-600 border-gray-200",
  no_answer: "bg-gray-50 text-gray-400 border-gray-200",
}

export default function CallDetailPage() {
  const params = useParams()
  const { apiKey, loading: authLoading } = useAuth()
  const [call, setCall] = useState<CallDetail | null>(null)
  const [transcript, setTranscript] = useState<TranscriptLine[]>([])
  const [loading, setLoading] = useState(true)

  const callId = params.id as string

  useEffect(() => {
    if (authLoading) return
    if (!apiKey || !callId) {
      setLoading(false)
      return
    }
    async function load() {
      try {
        // Fetch call logs and find this one
        const logs = await apiFetch<CallDetail[]>("/api/logs", { apiKey })
        const found = logs.find((l) => l.id === Number(callId))
        if (found) {
          setCall(found)
          // Try to fetch transcript
          try {
            const res = await fetch(
              `${process.env.NEXT_PUBLIC_API_URL}/api/logs/${callId}/transcript`,
              { headers: { "X-API-Key": apiKey } }
            )
            if (res.ok) {
              const text = await res.text()
              const lines: TranscriptLine[] = text
                .split("\n")
                .filter((l) => l.trim())
                .map((l) => {
                  const isUser = l.startsWith("[user]") || l.startsWith("User:")
                  return {
                    role: isUser ? "user" : "assistant",
                    content: l.replace(/^\[(user|assistant)\]\s*/, "").replace(/^(User|Assistant):\s*/, ""),
                    created_at: "",
                  }
                })
              setTranscript(lines)
            }
          } catch {}
        }
      } catch (err) {
        console.error(err)
      }
      setLoading(false)
    }
    load()
  }, [apiKey, authLoading, callId])

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-8 h-8 border-2 border-brand border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (!call) {
    return (
      <div className="text-center py-20 text-gray-400">
        Call not found
      </div>
    )
  }

  return (
    <div className="space-y-6 max-w-4xl">
      <Link
        href="/dashboard/calls"
        className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-brand transition-colors"
      >
        <ArrowLeft size={16} />
        Back to Call Logs
      </Link>

      {/* Header */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6">
        <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{call.phone_number}</h1>
            {call.caller_name && <p className="text-gray-500">{call.caller_name}</p>}
            <p className="text-sm text-gray-400 mt-1">
              {new Date(call.created_at).toLocaleString("en-IN")}
            </p>
          </div>
          {call.recording_url && (
            <a
              href={call.recording_url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 bg-brand text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-brand-dark transition-colors"
            >
              <Play size={16} />
              Play Recording
            </a>
          )}
        </div>

        {/* Badges */}
        <div className="flex flex-wrap gap-3">
          <div className="text-sm px-3 py-1.5 rounded-lg border bg-gray-50 text-gray-700">
            <span className="text-gray-400 mr-1">Duration:</span>
            {formatDuration(call.duration_seconds)}
          </div>
          {call.sentiment && (
            <div className={`text-sm px-3 py-1.5 rounded-lg border ${badgeColor[call.sentiment] || ""}`}>
              <span className="opacity-60 mr-1">Sentiment:</span>
              {call.sentiment}
            </div>
          )}
          {call.lead_score && (
            <div className={`text-sm px-3 py-1.5 rounded-lg border ${badgeColor[call.lead_score] || ""}`}>
              <span className="opacity-60 mr-1">Lead:</span>
              {call.lead_score}
            </div>
          )}
          {call.disposition && (
            <div className="text-sm px-3 py-1.5 rounded-lg border bg-gray-50 text-gray-700 capitalize">
              <span className="text-gray-400 mr-1">Disposition:</span>
              {call.disposition}
            </div>
          )}
          {call.was_booked && (
            <div className="text-sm px-3 py-1.5 rounded-lg border bg-green-50 text-green-700 border-green-200">
              Booked
            </div>
          )}
          {call.estimated_cost_inr != null && (
            <div className="text-sm px-3 py-1.5 rounded-lg border bg-gray-50 text-gray-700">
              <span className="text-gray-400 mr-1">Cost:</span>
              ₹{call.estimated_cost_inr.toFixed(2)}
            </div>
          )}
        </div>

        {/* Summary */}
        {call.summary && (
          <div className="mt-6 p-4 bg-gray-50 rounded-xl">
            <p className="text-sm font-medium text-gray-700 mb-1">Summary</p>
            <p className="text-sm text-gray-600 leading-relaxed">{call.summary}</p>
          </div>
        )}
      </div>

      {/* Transcript */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6">
        <h2 className="font-semibold text-gray-900 mb-4">Transcript</h2>
        {transcript.length === 0 ? (
          <p className="text-gray-400 text-sm">No transcript available</p>
        ) : (
          <div className="space-y-4">
            {transcript.map((line, i) => (
              <div
                key={i}
                className={`flex gap-3 ${line.role === "assistant" ? "" : "flex-row-reverse"}`}
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                    line.role === "assistant"
                      ? "bg-brand-50 text-brand"
                      : "bg-gray-100 text-gray-500"
                  }`}
                >
                  {line.role === "assistant" ? <Bot size={16} /> : <User size={16} />}
                </div>
                <div
                  className={`max-w-[75%] px-4 py-3 rounded-2xl text-sm leading-relaxed ${
                    line.role === "assistant"
                      ? "bg-brand-50 text-gray-800 rounded-tl-sm"
                      : "bg-gray-100 text-gray-800 rounded-tr-sm"
                  }`}
                >
                  {line.content}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
