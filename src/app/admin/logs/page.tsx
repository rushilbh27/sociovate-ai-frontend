"use client"

import { useEffect, useRef, useState, useMemo, useCallback } from "react"
import { useAuth } from "@/hooks/use-auth"
import { apiFetch } from "@/lib/api"
import type { CallLog } from "@/types"
import {
  Pause, Play, Trash2, Phone, Clock, ChevronRight,
  RefreshCw, Search, Terminal, FileText, BarChart3,
  ArrowLeft, Filter, Volume2,
} from "lucide-react"

/* ── Inline Audio Player ── */
function AudioPlayer({ src }: { src: string }) {
  const audioRef = useRef<HTMLAudioElement>(null)
  const [playing, setPlaying] = useState(false)
  const [speed, setSpeed] = useState<1 | 1.5 | 2>(1)
  const [progress, setProgress] = useState(0)
  const [currentTime, setCurrent] = useState(0)
  const [duration, setDuration] = useState(0)

  function togglePlay() {
    const a = audioRef.current
    if (!a) return
    if (playing) { a.pause() } else { a.play() }
    setPlaying(!playing)
  }

  function cycleSpeed() {
    const next = speed === 1 ? 1.5 : speed === 1.5 ? 2 : 1
    setSpeed(next as 1 | 1.5 | 2)
    if (audioRef.current) audioRef.current.playbackRate = next
  }

  function seek(e: React.MouseEvent<HTMLDivElement>) {
    const a = audioRef.current
    if (!a || !duration) return
    const rect = e.currentTarget.getBoundingClientRect()
    const pct = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width))
    a.currentTime = pct * duration
  }

  function fmt(s: number) {
    const m = Math.floor(s / 60)
    const sec = Math.floor(s % 60)
    return `${m}:${sec.toString().padStart(2, "0")}`
  }

  return (
    <div className="flex items-center gap-3 bg-gray-50 border border-gray-200 rounded-xl px-3 py-2">
      <audio
        ref={audioRef}
        src={src}
        preload="metadata"
        onTimeUpdate={() => {
          const a = audioRef.current
          if (a && a.duration) {
            setProgress((a.currentTime / a.duration) * 100)
            setCurrent(a.currentTime)
          }
        }}
        onLoadedMetadata={() => {
          if (audioRef.current) setDuration(audioRef.current.duration)
        }}
        onEnded={() => { setPlaying(false); setProgress(0); setCurrent(0) }}
      />
      <button
        onClick={togglePlay}
        className="w-8 h-8 rounded-full bg-brand text-white flex items-center justify-center shrink-0 hover:bg-brand-dark transition-colors"
      >
        {playing ? <Pause size={14} /> : <Play size={14} className="ml-0.5" />}
      </button>
      <div className="flex-1 min-w-0 flex flex-col gap-1">
        <div
          className="h-1.5 bg-gray-200 rounded-full cursor-pointer relative group"
          onClick={seek}
        >
          <div
            className="h-full bg-brand rounded-full transition-all relative"
            style={{ width: `${progress}%` }}
          >
            <span className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-brand rounded-full shadow opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
        </div>
        <div className="flex justify-between text-[10px] text-gray-400 tabular-nums">
          <span>{fmt(currentTime)}</span>
          <span>{duration ? fmt(duration) : "-:--"}</span>
        </div>
      </div>
      <button
        onClick={cycleSpeed}
        className="text-xs font-semibold text-gray-500 bg-gray-200 hover:bg-gray-300 rounded-lg px-2 py-1 transition-colors shrink-0 tabular-nums min-w-[2.5rem] text-center"
      >
        {speed}x
      </button>
    </div>
  )
}

/* ── Types ── */
interface LogLine {
  id: number
  timestamp: string
  level: string
  message: string
}

interface AgentEvent {
  id: number
  time: string
  level: string
  tag: string
  msg: string
}

/* ── Tag colors (dark bg terminal) ── */
const TAG: Record<string, [string, string]> = {
  "ENTRYPOINT CALLED": ["text-slate-300", "bg-slate-700/40"],
  "ENTRYPOINT":  ["text-slate-300", "bg-slate-700/40"],
  "CONFIG":      ["text-slate-300", "bg-slate-700/40"],
  "METADATA":    ["text-slate-300", "bg-slate-700/40"],
  "TEMPLATE":    ["text-slate-400", "bg-slate-700/30"],
  "PROMPT":      ["text-amber-300", "bg-amber-800/30"],
  "ROOM":        ["text-violet-300", "bg-violet-800/30"],
  "OUTBOUND":    ["text-violet-300", "bg-violet-800/30"],
  "CALLER-CTX":  ["text-teal-300", "bg-teal-800/30"],
  "DYNAMIC":     ["text-teal-300", "bg-teal-800/30"],
  "STT":         ["text-green-300", "bg-green-800/30"],
  "STT-RAW":     ["text-green-300", "bg-green-800/30"],
  "TTS":         ["text-orange-300", "bg-orange-800/30"],
  "LLM":         ["text-yellow-300", "bg-yellow-800/30"],
  "LLM-LATENCY": ["text-yellow-300", "bg-yellow-800/30"],
  "INTENT":      ["text-pink-300", "bg-pink-800/30"],
  "AGENT-STATE": ["text-blue-300", "bg-blue-800/30"],
  "AI SAYS":     ["text-cyan-300", "bg-cyan-800/30"],
  "USER SAYS":   ["text-emerald-300", "bg-emerald-800/30"],
  "RECORDING":   ["text-red-300", "bg-red-800/30"],
  "SMART-GREET": ["text-emerald-300", "bg-emerald-700/30"],
  "LOG":          ["text-gray-400", "bg-gray-700/30"],
  "RAW":          ["text-gray-500", "bg-gray-800/30"],
}

/* ── Filter chip colors (light bg) ── */
const CHIP: Record<string, string> = {
  "ENTRYPOINT CALLED": "border-slate-300 text-slate-600 bg-slate-50",
  "ENTRYPOINT":  "border-slate-300 text-slate-600 bg-slate-50",
  "CONFIG":      "border-slate-300 text-slate-600 bg-slate-50",
  "METADATA":    "border-slate-300 text-slate-600 bg-slate-50",
  "TEMPLATE":    "border-slate-300 text-slate-600 bg-slate-50",
  "PROMPT":      "border-amber-300 text-amber-700 bg-amber-50",
  "ROOM":        "border-violet-300 text-violet-700 bg-violet-50",
  "OUTBOUND":    "border-violet-300 text-violet-700 bg-violet-50",
  "CALLER-CTX":  "border-teal-300 text-teal-700 bg-teal-50",
  "DYNAMIC":     "border-teal-300 text-teal-700 bg-teal-50",
  "STT":         "border-green-300 text-green-700 bg-green-50",
  "STT-RAW":     "border-green-300 text-green-700 bg-green-50",
  "TTS":         "border-orange-300 text-orange-700 bg-orange-50",
  "LLM":         "border-yellow-300 text-yellow-700 bg-yellow-50",
  "LLM-LATENCY": "border-yellow-300 text-yellow-700 bg-yellow-50",
  "INTENT":      "border-pink-300 text-pink-700 bg-pink-50",
  "AGENT-STATE": "border-blue-300 text-blue-700 bg-blue-50",
  "AI SAYS":     "border-cyan-300 text-cyan-700 bg-cyan-50",
  "USER SAYS":   "border-emerald-300 text-emerald-700 bg-emerald-50",
  "RECORDING":   "border-red-300 text-red-700 bg-red-50",
  "SMART-GREET": "border-emerald-300 text-emerald-700 bg-emerald-50",
  "LOG":          "border-gray-300 text-gray-600 bg-gray-50",
  "RAW":          "border-gray-200 text-gray-500 bg-gray-50",
}

const sentimentDot: Record<string, string> = {
  positive: "bg-green-500",
  neutral: "bg-gray-400",
  negative: "bg-red-500",
  frustrated: "bg-orange-500",
  unknown: "bg-gray-300",
}

const leadBadge: Record<string, string> = {
  hot: "text-red-700 bg-red-50",
  warm: "text-orange-700 bg-orange-50",
  cold: "text-blue-700 bg-blue-50",
  not_interested: "text-gray-600 bg-gray-100",
  no_answer: "text-gray-400 bg-gray-50",
}

const lvlColor: Record<string, string> = {
  INFO: "text-blue-400",
  WARNING: "text-yellow-400",
  ERROR: "text-red-400",
  DEBUG: "text-gray-500",
}

function dur(s: number) {
  if (!s) return "0s"
  const m = Math.floor(s / 60), sec = s % 60
  return m > 0 ? `${m}m ${sec}s` : `${sec}s`
}

function fmtTime(iso: string) {
  return new Date(iso).toLocaleString("en-IN", {
    day: "numeric", month: "short",
    hour: "2-digit", minute: "2-digit", second: "2-digit",
  })
}

function parseEvent(raw: string, id: number): AgentEvent | null {
  // Format: "2026-04-05 12:34:56,789 INFO outbound-agent: [TAG] message"
  const m = raw.match(
    /^(\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2},\d{3})\s+(\w+)\s+[\w.-]+:\s*\[([^\]]+)\]\s*(.*)$/
  )
  if (m) return { id, time: m[1], level: m[2], tag: m[3], msg: m[4] }
  // Bare print lines (>>> ROOM, === dividers, etc.)
  const p = raw.match(/^(\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2},\d{3})\s+(\w+)\s+[\w.-]+:\s*(.+)$/)
  if (p) return { id, time: p[1], level: p[2], tag: "LOG", msg: p[3] }
  // Completely raw line (print() without logger)
  if (raw.trim() && !raw.startsWith("===")) {
    return { id, time: "", level: "INFO", tag: "RAW", msg: raw.trim() }
  }
  return null
}

export default function LogsPage() {
  const { apiKey, loading: authLoading } = useAuth()
  const API = process.env.NEXT_PUBLIC_API_URL || ""

  /* Call history */
  const [calls, setCalls] = useState<CallLog[]>([])
  const [callsLoading, setCallsLoading] = useState(true)
  const [selected, setSelected] = useState<CallLog | null>(null)
  const [callQ, setCallQ] = useState("")

  /* Detail tabs */
  type Tab = "overview" | "transcript" | "logs"
  const [tab, setTab] = useState<Tab>("logs")
  const [transcript, setTranscript] = useState("")
  const [events, setEvents] = useState<AgentEvent[]>([])
  const [eventsLoading, setEventsLoading] = useState(false)
  const [tagFilter, setTagFilter] = useState<Set<string>>(new Set())
  const [evtQ, setEvtQ] = useState("")

  /* Live log stream */
  const [logs, setLogs] = useState<LogLine[]>([])
  const [paused, setPaused] = useState(false)
  const [logQ, setLogQ] = useState("")
  const bottom = useRef<HTMLDivElement>(null)
  const idc = useRef(0)

  /* ── Effects ── */

  // Load calls
  useEffect(() => {
    if (authLoading || !apiKey) {
      if (!authLoading) setCallsLoading(false)
      return
    }
    apiFetch<CallLog[]>("/api/logs", { apiKey })
      .then(setCalls)
      .catch(console.error)
      .finally(() => setCallsLoading(false))
  }, [apiKey, authLoading])

  // SSE live stream (with auth + reconnect)
  useEffect(() => {
    if (authLoading || !apiKey || paused) return
    let dead = false
    let es: EventSource | null = null
    let retryTimeout: ReturnType<typeof setTimeout>

    function connect() {
      if (dead) return
      es = new EventSource(
        `${API}/api/logs/stream?api_key=${encodeURIComponent(apiKey)}`
      )
      es.onmessage = (e) => {
        try {
          const d = JSON.parse(e.data)
          setLogs((p) => [
            ...p.slice(-500),
            {
              id: idc.current++,
              timestamp: d.timestamp || new Date().toISOString(),
              level: d.level || "INFO",
              message: d.message || e.data,
            },
          ])
        } catch {
          setLogs((p) => [
            ...p.slice(-500),
            {
              id: idc.current++,
              timestamp: new Date().toISOString(),
              level: "INFO",
              message: e.data,
            },
          ])
        }
      }
      es.onerror = () => {
        es?.close()
        // Reconnect after 3s
        if (!dead) retryTimeout = setTimeout(connect, 3000)
      }
    }
    connect()

    return () => {
      dead = true
      clearTimeout(retryTimeout)
      es?.close()
    }
  }, [apiKey, authLoading, paused, API])

  // Auto-scroll live logs
  useEffect(() => {
    if (!paused && !selected) {
      bottom.current?.scrollIntoView({ behavior: "smooth" })
    }
  }, [logs, paused, selected])

  // Fetch transcript
  useEffect(() => {
    if (!selected || !apiKey) {
      setTranscript("")
      return
    }
    fetch(`${API}/api/logs/${selected.id}/transcript`, {
      headers: { "X-API-Key": apiKey },
    })
      .then((r) => (r.ok ? r.text() : ""))
      .then(setTranscript)
      .catch(() => setTranscript(""))
  }, [selected, apiKey, API])

  // Fetch agent logs for selected call
  useEffect(() => {
    if (!selected?.room_name || !apiKey) {
      setEvents([])
      return
    }
    setEventsLoading(true)
    const room = selected.room_name
    // Use dedicated per-call agent-logs endpoint (DB first, file fallback)
    fetch(
      `${API}/api/calls/${encodeURIComponent(room)}/agent-logs`,
      { headers: { "X-API-Key": apiKey } }
    )
      .then((r) => (r.ok ? r.json() : { lines: [] }))
      .then((d: { lines: string[] }) => {
        let n = 0
        setEvents(
          d.lines
            .map((l) => parseEvent(l, n++))
            .filter((e): e is AgentEvent => !!e)
        )
      })
      .catch(() => setEvents([]))
      .finally(() => setEventsLoading(false))
  }, [selected, apiKey, API])

  /* ── Handlers ── */

  const pick = useCallback((c: CallLog) => {
    setSelected(c)
    setTab("logs")
    setTagFilter(new Set())
    setEvtQ("")
  }, [])

  function refresh() {
    if (!apiKey) return
    setCallsLoading(true)
    apiFetch<CallLog[]>("/api/logs", { apiKey })
      .then(setCalls)
      .catch(console.error)
      .finally(() => setCallsLoading(false))
  }

  const toggleTag = (t: string) =>
    setTagFilter((p) => {
      const n = new Set(p)
      if (n.has(t)) n.delete(t)
      else n.add(t)
      return n
    })

  /* ── Derived ── */

  const fCalls = callQ
    ? calls.filter(
        (c) =>
          c.phone_number.includes(callQ) ||
          c.room_name?.toLowerCase().includes(callQ.toLowerCase()) ||
          c.caller_name?.toLowerCase().includes(callQ.toLowerCase())
      )
    : calls

  const allTags = useMemo(
    () => Array.from(new Set(events.map((e) => e.tag))).sort(),
    [events]
  )

  const fEvents = useMemo(() => {
    let r = events
    if (tagFilter.size) r = r.filter((e) => tagFilter.has(e.tag))
    if (evtQ) {
      const q = evtQ.toLowerCase()
      r = r.filter(
        (e) =>
          e.msg.toLowerCase().includes(q) || e.tag.toLowerCase().includes(q)
      )
    }
    return r
  }, [events, tagFilter, evtQ])

  const fLogs = logQ
    ? logs.filter(
        (l) =>
          l.message.toLowerCase().includes(logQ.toLowerCase()) ||
          l.level.toLowerCase().includes(logQ.toLowerCase())
      )
    : logs

  /* ── Tab renderers ── */

  const renderOverview = () =>
    selected && (
      <div className="p-5 space-y-4 overflow-y-auto">
        <div className="flex flex-wrap gap-2">
          {selected.room_name && (
            <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded font-mono">
              {selected.room_name}
            </span>
          )}
          <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
            {dur(selected.duration_seconds)}
          </span>
          {selected.sentiment && (
            <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded flex items-center gap-1.5">
              <span
                className={`w-2 h-2 rounded-full ${
                  sentimentDot[selected.sentiment] || "bg-gray-300"
                }`}
              />
              {selected.sentiment}
            </span>
          )}
          {selected.lead_score && (
            <span
              className={`text-xs px-2 py-1 rounded font-medium ${
                leadBadge[selected.lead_score] || "text-gray-600 bg-gray-100"
              }`}
            >
              {selected.lead_score}
            </span>
          )}
          {selected.disposition && (
            <span className="text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded font-medium">
              {selected.disposition}
            </span>
          )}
          {selected.was_booked && (
            <span className="text-xs bg-green-50 text-green-700 px-2 py-1 rounded font-medium">
              Booked
            </span>
          )}
          {selected.estimated_cost_inr != null && (
            <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
              ₹{selected.estimated_cost_inr.toFixed(2)}
            </span>
          )}
          {selected.tts_chars != null && (
            <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
              {selected.tts_chars} TTS chars
            </span>
          )}
        </div>
        {selected.recording_url && (
          <div>
            <p className="text-xs font-medium text-gray-500 mb-2 flex items-center gap-1.5">
              <Volume2 size={12} /> Recording
            </p>
            <AudioPlayer src={selected.recording_url} />
          </div>
        )}
        {selected.summary && (
          <div className="p-3 bg-gray-50 rounded-xl">
            <p className="text-xs font-medium text-gray-500 mb-1">Summary</p>
            <p className="text-sm text-gray-700">{selected.summary}</p>
          </div>
        )}
      </div>
    )

  const renderTranscript = () => (
    <div className="p-4 flex-1 overflow-y-auto">
      {transcript ? (
        <div className="bg-gray-900 rounded-xl p-4 font-mono text-xs text-gray-300 whitespace-pre-wrap leading-relaxed">
          {transcript}
        </div>
      ) : (
        <p className="text-xs text-gray-400 text-center py-8">
          No transcript available
        </p>
      )}
    </div>
  )

  const renderAgentLogs = () => {
    if (eventsLoading)
      return (
        <div className="flex items-center justify-center py-16">
          <div className="w-6 h-6 border-2 border-brand border-t-transparent rounded-full animate-spin" />
        </div>
      )
    if (!events.length)
      return (
        <div className="text-center py-16">
          <Terminal size={32} className="mx-auto text-gray-300 mb-2" />
          <p className="text-sm text-gray-400">
            No agent logs found
            {selected?.room_name ? ` for ${selected.room_name}` : ""}
          </p>
        </div>
      )
    return (
      <div className="flex flex-col h-full min-h-0">
        {/* Filter chips */}
        <div className="px-3 py-2 border-b border-gray-200 flex flex-wrap gap-1 items-center shrink-0">
          <Filter size={11} className="text-gray-400 mr-1 shrink-0" />
          {allTags.map((tag) => {
            const active = !tagFilter.size || tagFilter.has(tag)
            return (
              <button
                key={tag}
                onClick={() => toggleTag(tag)}
                className={`text-[10px] px-2 py-0.5 rounded-full border font-medium transition-all ${
                  active
                    ? CHIP[tag] || "border-gray-300 text-gray-600 bg-gray-50"
                    : "border-gray-200 text-gray-300 bg-white"
                }`}
              >
                {tag}
              </button>
            )
          })}
          {tagFilter.size > 0 && (
            <button
              onClick={() => setTagFilter(new Set())}
              className="text-[10px] text-gray-400 hover:text-gray-600 ml-1 underline"
            >
              Clear
            </button>
          )}
        </div>

        {/* Search + count */}
        <div className="px-3 py-2 border-b border-gray-200 flex items-center gap-3 shrink-0">
          <div className="relative flex-1">
            <Search
              size={12}
              className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <input
              type="text"
              placeholder="Search events..."
              value={evtQ}
              onChange={(e) => setEvtQ(e.target.value)}
              className="w-full pl-7 pr-3 py-1.5 rounded-lg border border-gray-200 focus:border-brand outline-none text-xs"
            />
          </div>
          <span className="text-[10px] text-gray-400 shrink-0">
            {fEvents.length}/{events.length}
          </span>
        </div>

        {/* Timeline */}
        <div className="flex-1 overflow-y-auto bg-gray-950 min-h-0">
          <div className="p-2 font-mono text-[11px] leading-relaxed">
            {fEvents.map((e) => {
              const [tc, bg] = TAG[e.tag] || ["text-gray-400", "bg-gray-700/30"]
              const isTalk = e.tag === "AI SAYS" || e.tag === "USER SAYS"
              return (
                <div
                  key={e.id}
                  className={`flex gap-1.5 px-2 py-[3px] rounded hover:bg-white/5 ${
                    isTalk ? "my-0.5 bg-white/[0.03]" : ""
                  } ${
                    e.level === "ERROR"
                      ? "bg-red-900/20"
                      : e.level === "WARNING"
                        ? "bg-yellow-900/10"
                        : ""
                  }`}
                >
                  <span className="text-gray-600 shrink-0 w-20 tabular-nums">
                    {e.time.split(" ")[1]?.replace(",", ".")}
                  </span>
                  <span
                    className={`shrink-0 ${tc} ${bg} px-1.5 rounded text-[10px] font-semibold leading-[18px] inline-flex items-center`}
                  >
                    {e.tag}
                  </span>
                  <span
                    className={
                      isTalk
                        ? e.tag === "AI SAYS"
                          ? "text-cyan-300"
                          : "text-emerald-300"
                        : e.level === "ERROR"
                          ? "text-red-300"
                          : "text-gray-300"
                    }
                  >
                    {e.msg}
                  </span>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    )
  }

  /* ─── Main render ─── */

  return (
    <div className="h-[calc(100vh-8rem)] flex flex-col gap-4">
      <h1 className="text-2xl font-bold text-gray-900">Logs</h1>

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-[340px_1fr] gap-4 min-h-0">
        {/* ── Left: Call List (always visible) ── */}
        <div className="flex flex-col bg-white rounded-2xl border border-gray-100 overflow-hidden min-h-0">
          <div className="px-4 py-3 border-b border-gray-100 flex items-center gap-3 shrink-0">
            <Phone size={16} className="text-brand" />
            <span className="font-semibold text-gray-900 text-sm">Calls</span>
            <span className="text-xs text-gray-400">({calls.length})</span>
            <div className="flex-1" />
            <div className="relative">
              <Search
                size={14}
                className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400"
              />
              <input
                type="text"
                placeholder="Search..."
                value={callQ}
                onChange={(e) => setCallQ(e.target.value)}
                className="pl-8 pr-3 py-1.5 rounded-lg border border-gray-200 focus:border-brand outline-none text-xs w-32"
              />
            </div>
            <button
              onClick={refresh}
              className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors text-gray-400 hover:text-gray-600"
            >
              <RefreshCw
                size={14}
                className={callsLoading ? "animate-spin" : ""}
              />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto min-h-0">
            {callsLoading ? (
              <div className="flex items-center justify-center py-16">
                <div className="w-6 h-6 border-2 border-brand border-t-transparent rounded-full animate-spin" />
              </div>
            ) : fCalls.length === 0 ? (
              <div className="text-center py-16 text-gray-400 text-sm">
                No calls found
              </div>
            ) : (
              <div className="divide-y divide-gray-50">
                {fCalls.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => pick(c)}
                    className={`w-full px-3 py-2.5 flex items-center gap-2.5 hover:bg-gray-50 transition-colors text-left ${
                      selected?.id === c.id
                        ? "bg-brand/5 border-r-2 border-brand"
                        : ""
                    }`}
                  >
                    <div
                      className={`w-2 h-2 rounded-full shrink-0 ${
                        sentimentDot[c.sentiment || "unknown"]
                      }`}
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="text-sm font-medium text-gray-900 truncate">
                          {c.phone_number}
                        </span>
                        {c.lead_score && (
                          <span
                            className={`text-[10px] px-1.5 py-0.5 rounded font-medium shrink-0 ${
                              leadBadge[c.lead_score] ||
                              "text-gray-500 bg-gray-50"
                            }`}
                          >
                            {c.lead_score}
                          </span>
                        )}
                      </div>
                      <span className="text-[10px] text-gray-400 truncate block mt-0.5">
                        {c.room_name || "-"}
                      </span>
                    </div>
                    <div className="text-right shrink-0">
                      <div className="flex items-center gap-1 text-[10px] text-gray-500">
                        <Clock size={10} />
                        {dur(c.duration_seconds)}
                      </div>
                      <p className="text-[10px] text-gray-400 mt-0.5">
                        {fmtTime(c.created_at)}
                      </p>
                    </div>
                    <ChevronRight size={12} className="text-gray-300 shrink-0" />
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* ── Right: Call Detail (with tabs) or Live Logs ── */}
        {selected ? (
          <div className="flex flex-col bg-white rounded-2xl border border-gray-100 overflow-hidden min-h-0">
            {/* Header + Tabs */}
            <div className="px-4 py-3 border-b border-gray-100 flex items-center gap-3 shrink-0">
              <button
                onClick={() => setSelected(null)}
                className="p-1 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600"
              >
                <ArrowLeft size={16} />
              </button>
              <div className="min-w-0">
                <p className="text-sm font-bold text-gray-900 truncate">
                  {selected.phone_number}
                </p>
                {selected.caller_name && (
                  <p className="text-[10px] text-gray-400">
                    {selected.caller_name}
                  </p>
                )}
              </div>
              <span className="text-[10px] text-gray-400 shrink-0">
                {fmtTime(selected.created_at)}
              </span>
              <div className="flex-1" />
              <div className="flex bg-gray-100 rounded-lg p-0.5">
                {(
                  [
                    ["overview", BarChart3, "Overview"],
                    ["transcript", FileText, "Transcript"],
                    ["logs", Terminal, "Agent Logs"],
                  ] as [Tab, typeof BarChart3, string][]
                ).map(([k, Icon, label]) => (
                  <button
                    key={k}
                    onClick={() => setTab(k)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                      tab === k
                        ? "bg-white text-gray-900 shadow-sm"
                        : "text-gray-500 hover:text-gray-700"
                    }`}
                  >
                    <Icon size={12} />
                    {label}
                  </button>
                ))}
              </div>
            </div>

            {/* Tab content */}
            <div className="flex-1 overflow-hidden min-h-0 flex flex-col">
              {tab === "overview" && renderOverview()}
              {tab === "transcript" && renderTranscript()}
              {tab === "logs" && renderAgentLogs()}
            </div>
          </div>
        ) : (
          /* Live Logs (no call selected) */
          <div className="flex flex-col bg-gray-900 rounded-2xl overflow-hidden min-h-0">
            <div className="px-4 py-3 border-b border-gray-800 flex items-center gap-3 shrink-0">
              <div
                className={`w-2 h-2 rounded-full ${
                  paused ? "bg-yellow-500" : "bg-green-500 animate-pulse"
                }`}
              />
              <span className="font-semibold text-gray-200 text-sm">
                Live Logs
              </span>
              <div className="flex-1" />
              <input
                type="text"
                placeholder="Filter..."
                value={logQ}
                onChange={(e) => setLogQ(e.target.value)}
                className="px-3 py-1.5 rounded-lg bg-gray-800 border border-gray-700 text-gray-300 placeholder-gray-600 outline-none text-xs w-36 focus:border-gray-500"
              />
              <button
                onClick={() => setPaused((p) => !p)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                  paused
                    ? "bg-green-600/20 text-green-400 hover:bg-green-600/30"
                    : "bg-yellow-600/20 text-yellow-400 hover:bg-yellow-600/30"
                }`}
              >
                {paused ? <Play size={12} /> : <Pause size={12} />}
                {paused ? "Resume" : "Pause"}
              </button>
              <button
                onClick={() => setLogs([])}
                className="p-1.5 rounded-lg hover:bg-gray-800 transition-colors text-gray-500 hover:text-gray-300"
              >
                <Trash2 size={14} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-3 font-mono text-xs leading-relaxed min-h-0">
              {fLogs.length === 0 ? (
                <p className="text-gray-600 text-center py-8">
                  {paused ? "Stream paused" : "Waiting for logs..."}
                </p>
              ) : (
                fLogs.map((l) => (
                  <div
                    key={l.id}
                    className="flex gap-2 hover:bg-gray-800/50 px-2 py-0.5 rounded"
                  >
                    <span className="text-gray-600 shrink-0">
                      {new Date(l.timestamp).toLocaleTimeString()}
                    </span>
                    <span
                      className={`shrink-0 w-14 ${
                        lvlColor[l.level] || "text-gray-400"
                      }`}
                    >
                      [{l.level}]
                    </span>
                    <span className="text-gray-300 break-all">{l.message}</span>
                  </div>
                ))
              )}
              <div ref={bottom} />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
