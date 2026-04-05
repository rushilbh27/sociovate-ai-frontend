"use client"

import { useEffect, useState } from "react"
import { useAuth } from "@/hooks/use-auth"
import { apiFetch } from "@/lib/api"
import type { AgentConfig } from "@/types"
import { Save, Bot, Key, Globe, Clock, CheckCircle, AlertCircle } from "lucide-react"

type Tab = "agent" | "api" | "webhooks" | "hours"

export default function SettingsPage() {
  const { apiKey, user, loading: authLoading } = useAuth()
  const [tab, setTab] = useState<Tab>("agent")

  const tabs: { id: Tab; label: string; icon: React.ReactNode }[] = [
    { id: "agent", label: "Agent", icon: <Bot size={16} /> },
    { id: "api", label: "API Keys", icon: <Key size={16} /> },
    { id: "webhooks", label: "Webhooks", icon: <Globe size={16} /> },
    { id: "hours", label: "Hours", icon: <Clock size={16} /> },
  ]

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Settings</h1>

      <div className="flex gap-2 flex-wrap">
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
              tab === t.id
                ? "bg-brand text-white"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            {t.icon}
            {t.label}
          </button>
        ))}
      </div>

      {tab === "agent" && <AgentConfigTab apiKey={apiKey} authLoading={authLoading} />}
      {tab === "api" && <ApiKeysTab apiKey={apiKey} />}
      {tab === "webhooks" && <WebhooksTab apiKey={apiKey} authLoading={authLoading} />}
      {tab === "hours" && <BusinessHoursTab apiKey={apiKey} />}
    </div>
  )
}

/* ─── Agent Config ─────────────────────────────────────────── */
function AgentConfigTab({ apiKey, authLoading }: { apiKey: string | null; authLoading: boolean }) {
  const [config, setConfig] = useState<AgentConfig | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [msg, setMsg] = useState<{ type: "success" | "error"; text: string } | null>(null)

  useEffect(() => {
    if (authLoading) return
    if (!apiKey) {
      setLoading(false)
      return
    }
    apiFetch<AgentConfig>("/api/agent-config", { apiKey })
      .then(setConfig)
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [apiKey, authLoading])

  async function save() {
    if (!config || !apiKey) return
    setSaving(true)
    setMsg(null)
    try {
      await apiFetch("/api/agent-config", {
        method: "PUT",
        apiKey,
        body: config,
      })
      setMsg({ type: "success", text: "Configuration saved!" })
    } catch {
      setMsg({ type: "error", text: "Failed to save" })
    }
    setSaving(false)
  }

  if (loading) {
    return <div className="flex justify-center py-12"><div className="w-8 h-8 border-2 border-brand border-t-transparent rounded-full animate-spin" /></div>
  }

  if (!config) {
    return <div className="text-center py-12 text-gray-400">Could not load config</div>
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-6 space-y-5">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <Field label="Agent Name">
          <input
            value={config.agent_name || ""}
            onChange={(e) => setConfig({ ...config, agent_name: e.target.value })}
            className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-brand focus:ring-2 focus:ring-brand/20 outline-none text-sm"
          />
        </Field>
        <Field label="Company Name">
          <input
            value={config.company_name || ""}
            onChange={(e) => setConfig({ ...config, company_name: e.target.value })}
            className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-brand focus:ring-2 focus:ring-brand/20 outline-none text-sm"
          />
        </Field>
        <Field label="TTS Voice">
          <input
            value={config.tts_voice || ""}
            onChange={(e) => setConfig({ ...config, tts_voice: e.target.value })}
            className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-brand focus:ring-2 focus:ring-brand/20 outline-none text-sm"
          />
        </Field>
        <Field label="Language">
          <input
            value={config.language || ""}
            onChange={(e) => setConfig({ ...config, language: e.target.value })}
            className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-brand focus:ring-2 focus:ring-brand/20 outline-none text-sm"
          />
        </Field>
      </div>

      <Field label="System Prompt">
        <textarea
          value={config.system_prompt || ""}
          onChange={(e) => setConfig({ ...config, system_prompt: e.target.value })}
          rows={8}
          className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-brand focus:ring-2 focus:ring-brand/20 outline-none text-sm resize-y font-mono"
        />
      </Field>

      <Field label="Context Block">
        <textarea
          value={config.context_block || ""}
          onChange={(e) => setConfig({ ...config, context_block: e.target.value })}
          rows={6}
          className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-brand focus:ring-2 focus:ring-brand/20 outline-none text-sm resize-y"
        />
      </Field>

      {msg && (
        <div className={`flex items-center gap-2 text-sm ${msg.type === "success" ? "text-green-600" : "text-red-600"}`}>
          {msg.type === "success" ? <CheckCircle size={16} /> : <AlertCircle size={16} />}
          {msg.text}
        </div>
      )}

      <button
        onClick={save}
        disabled={saving}
        className="flex items-center gap-2 bg-brand hover:bg-brand-dark text-white px-6 py-2.5 rounded-xl font-medium transition-colors disabled:opacity-50"
      >
        <Save size={16} />
        {saving ? "Saving..." : "Save Changes"}
      </button>
    </div>
  )
}

/* ─── API Keys ─────────────────────────────────────────────── */
function ApiKeysTab({ apiKey }: { apiKey: string | null }) {
  const [copied, setCopied] = useState(false)

  function copyKey() {
    if (!apiKey) return
    navigator.clipboard.writeText(apiKey)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-6 space-y-4">
      <h2 className="font-semibold text-gray-900">Your API Key</h2>
      <p className="text-sm text-gray-500">Use this key in the <code className="bg-gray-100 px-1.5 py-0.5 rounded text-xs">X-API-Key</code> header when calling the API.</p>
      <div className="flex items-center gap-3">
        <code className="flex-1 bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm font-mono text-gray-700 truncate">
          {apiKey || "No API key found"}
        </code>
        <button
          onClick={copyKey}
          className="shrink-0 bg-brand hover:bg-brand-dark text-white px-4 py-3 rounded-xl text-sm font-medium transition-colors"
        >
          {copied ? "Copied!" : "Copy"}
        </button>
      </div>
    </div>
  )
}

/* ─── Webhooks ─────────────────────────────────────────────── */
function WebhooksTab({ apiKey, authLoading }: { apiKey: string | null; authLoading: boolean }) {
  const [url, setUrl] = useState("")
  const [saving, setSaving] = useState(false)
  const [msg, setMsg] = useState("")

  useEffect(() => {
    if (authLoading || !apiKey) return
    apiFetch<{ webhook_url: string }>("/api/agent-config", { apiKey })
      .then((c) => setUrl(c.webhook_url || ""))
      .catch(console.error)
  }, [apiKey, authLoading])

  async function save() {
    setSaving(true)
    try {
      await apiFetch("/api/agent-config", {
        method: "PUT",
        apiKey,
        body: { webhook_url: url },
      })
      setMsg("Saved!")
      setTimeout(() => setMsg(""), 2000)
    } catch {
      setMsg("Failed to save")
    }
    setSaving(false)
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-6 space-y-4">
      <h2 className="font-semibold text-gray-900">Webhook URL</h2>
      <p className="text-sm text-gray-500">Receive POST notifications when calls complete.</p>
      <input
        type="url"
        placeholder="https://your-app.com/webhook"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-brand focus:ring-2 focus:ring-brand/20 outline-none text-sm"
      />
      {msg && <p className="text-sm text-green-600">{msg}</p>}
      <button
        onClick={save}
        disabled={saving}
        className="flex items-center gap-2 bg-brand hover:bg-brand-dark text-white px-6 py-2.5 rounded-xl font-medium transition-colors disabled:opacity-50"
      >
        <Save size={16} />
        {saving ? "Saving..." : "Save"}
      </button>
    </div>
  )
}

/* ─── Business Hours ───────────────────────────────────────── */
function BusinessHoursTab({ apiKey }: { apiKey: string | null }) {
  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]
  const [hours, setHours] = useState<Record<string, { enabled: boolean; start: string; end: string }>>(
    Object.fromEntries(days.map((d) => [d, { enabled: d !== "Sunday", start: "09:00", end: "18:00" }]))
  )

  function toggle(day: string) {
    setHours((h) => ({ ...h, [day]: { ...h[day], enabled: !h[day].enabled } }))
  }

  function update(day: string, field: "start" | "end", val: string) {
    setHours((h) => ({ ...h, [day]: { ...h[day], [field]: val } }))
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-6 space-y-4">
      <h2 className="font-semibold text-gray-900">Business Hours</h2>
      <p className="text-sm text-gray-500">Calls will only be placed during these hours.</p>

      <div className="space-y-3">
        {days.map((day) => (
          <div key={day} className="flex items-center gap-4">
            <label className="w-28 text-sm text-gray-700 font-medium">{day}</label>
            <button
              onClick={() => toggle(day)}
              className={`w-10 h-5 rounded-full transition-colors relative ${hours[day].enabled ? "bg-brand" : "bg-gray-300"}`}
            >
              <span
                className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${
                  hours[day].enabled ? "translate-x-5" : ""
                }`}
              />
            </button>
            {hours[day].enabled && (
              <div className="flex items-center gap-2 text-sm">
                <input
                  type="time"
                  value={hours[day].start}
                  onChange={(e) => update(day, "start", e.target.value)}
                  className="px-3 py-1.5 rounded-lg border border-gray-200 focus:border-brand outline-none text-sm"
                />
                <span className="text-gray-400">to</span>
                <input
                  type="time"
                  value={hours[day].end}
                  onChange={(e) => update(day, "end", e.target.value)}
                  className="px-3 py-1.5 rounded-lg border border-gray-200 focus:border-brand outline-none text-sm"
                />
              </div>
            )}
          </div>
        ))}
      </div>

      <button
        className="flex items-center gap-2 bg-brand hover:bg-brand-dark text-white px-6 py-2.5 rounded-xl font-medium transition-colors"
      >
        <Save size={16} />
        Save Hours
      </button>
    </div>
  )
}

/* ─── Helper ───────────────────────────────────────────────── */
function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1.5">{label}</label>
      {children}
    </div>
  )
}
