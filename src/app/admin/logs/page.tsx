"use client"

import { useEffect, useRef, useState } from "react"
import { useAuth } from "@/hooks/use-auth"
import { Pause, Play, Trash2 } from "lucide-react"

interface LogLine {
  id: number
  timestamp: string
  level: string
  message: string
}

const levelColor: Record<string, string> = {
  INFO: "text-blue-400",
  WARNING: "text-yellow-400",
  ERROR: "text-red-400",
  DEBUG: "text-gray-500",
}

export default function LiveLogsPage() {
  const { apiKey } = useAuth()
  const [logs, setLogs] = useState<LogLine[]>([])
  const [paused, setPaused] = useState(false)
  const [filter, setFilter] = useState("")
  const bottomRef = useRef<HTMLDivElement>(null)
  const eventSourceRef = useRef<EventSource | null>(null)
  const idCounter = useRef(0)

  useEffect(() => {
    if (!apiKey || paused) return

    const apiUrl = process.env.NEXT_PUBLIC_API_URL || ""
    const url = `${apiUrl}/api/admin/logs/stream`

    const es = new EventSource(url)
    eventSourceRef.current = es

    es.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data)
        const line: LogLine = {
          id: idCounter.current++,
          timestamp: data.timestamp || new Date().toISOString(),
          level: data.level || "INFO",
          message: data.message || event.data,
        }
        setLogs((prev) => [...prev.slice(-500), line])
      } catch {
        const line: LogLine = {
          id: idCounter.current++,
          timestamp: new Date().toISOString(),
          level: "INFO",
          message: event.data,
        }
        setLogs((prev) => [...prev.slice(-500), line])
      }
    }

    es.onerror = () => {
      es.close()
    }

    return () => {
      es.close()
    }
  }, [apiKey, paused])

  // Auto-scroll
  useEffect(() => {
    if (!paused) {
      bottomRef.current?.scrollIntoView({ behavior: "smooth" })
    }
  }, [logs, paused])

  const filtered = filter
    ? logs.filter(
        (l) =>
          l.message.toLowerCase().includes(filter.toLowerCase()) ||
          l.level.toLowerCase().includes(filter.toLowerCase())
      )
    : logs

  return (
    <div className="space-y-4 h-[calc(100vh-8rem)] flex flex-col">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-2xl font-bold text-gray-900">Live Logs</h1>
        <div className="flex items-center gap-3">
          <input
            type="text"
            placeholder="Filter logs..."
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="px-4 py-2 rounded-xl border border-gray-200 focus:border-brand focus:ring-2 focus:ring-brand/20 outline-none text-sm w-48"
          />
          <button
            onClick={() => setPaused((p) => !p)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
              paused
                ? "bg-green-600 hover:bg-green-700 text-white"
                : "bg-yellow-500 hover:bg-yellow-600 text-white"
            }`}
          >
            {paused ? <Play size={16} /> : <Pause size={16} />}
            {paused ? "Resume" : "Pause"}
          </button>
          <button
            onClick={() => setLogs([])}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors"
          >
            <Trash2 size={16} />
            Clear
          </button>
        </div>
      </div>

      <div className="flex-1 bg-gray-900 rounded-2xl overflow-hidden">
        <div className="h-full overflow-y-auto p-4 font-mono text-xs leading-relaxed">
          {filtered.length === 0 ? (
            <p className="text-gray-600 text-center py-8">
              {paused ? "Stream paused" : "Waiting for logs..."}
            </p>
          ) : (
            filtered.map((l) => (
              <div key={l.id} className="flex gap-3 hover:bg-gray-800/50 px-2 py-0.5 rounded">
                <span className="text-gray-600 shrink-0">
                  {new Date(l.timestamp).toLocaleTimeString()}
                </span>
                <span className={`shrink-0 w-16 ${levelColor[l.level] || "text-gray-400"}`}>
                  [{l.level}]
                </span>
                <span className="text-gray-300 break-all">{l.message}</span>
              </div>
            ))
          )}
          <div ref={bottomRef} />
        </div>
      </div>
    </div>
  )
}
