"use client"

import { useEffect, useState } from "react"
import { useAuth } from "@/hooks/use-auth"
import { apiFetch } from "@/lib/api"
import { Save, CheckCircle, AlertCircle } from "lucide-react"

export default function SystemConfigPage() {
  const { apiKey, loading: authLoading } = useAuth()
  const [config, setConfig] = useState("")
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [msg, setMsg] = useState<{ type: "success" | "error"; text: string } | null>(null)

  useEffect(() => {
    if (authLoading) return
    if (!apiKey) {
      setLoading(false)
      return
    }
    apiFetch<Record<string, unknown>>("/api/config", { apiKey })
      .then((data) => setConfig(JSON.stringify(data, null, 2)))
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [apiKey, authLoading])

  async function save() {
    setMsg(null)
    try {
      JSON.parse(config) // validate
    } catch {
      setMsg({ type: "error", text: "Invalid JSON" })
      return
    }

    setSaving(true)
    try {
      await apiFetch("/api/config", {
        method: "PUT",
        apiKey,
        body: JSON.parse(config),
      })
      setMsg({ type: "success", text: "Configuration saved!" })
    } catch {
      setMsg({ type: "error", text: "Failed to save" })
    }
    setSaving(false)
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-2xl font-bold text-gray-900">System Configuration</h1>
        <button
          onClick={save}
          disabled={saving || loading}
          className="flex items-center gap-2 bg-brand hover:bg-brand-dark text-white px-5 py-2.5 rounded-xl text-sm font-medium transition-colors disabled:opacity-50"
        >
          <Save size={16} />
          {saving ? "Saving..." : "Save Changes"}
        </button>
      </div>

      {msg && (
        <div className={`flex items-center gap-2 text-sm ${msg.type === "success" ? "text-green-600" : "text-red-600"}`}>
          {msg.type === "success" ? <CheckCircle size={16} /> : <AlertCircle size={16} />}
          {msg.text}
        </div>
      )}

      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="flex justify-center py-16">
            <div className="w-8 h-8 border-2 border-brand border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <textarea
            value={config}
            onChange={(e) => setConfig(e.target.value)}
            rows={30}
            spellCheck={false}
            className="w-full p-6 font-mono text-sm text-gray-800 bg-white outline-none resize-y border-none"
          />
        )}
      </div>
    </div>
  )
}
