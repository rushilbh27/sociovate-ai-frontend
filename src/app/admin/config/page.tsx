"use client"

import { useEffect, useState } from "react"
import { useAuth } from "@/hooks/use-auth"
import { apiFetch } from "@/lib/api"
import { Save, CheckCircle, AlertCircle, Bot, Volume2, Brain, Phone, Globe, Mic, Gauge } from "lucide-react"

const VOICES = [
  "shubh","ritu","rahul","pooja","simran","kavya","amit","ratan","rohan",
  "dev","ishita","shreya","manan","sumit","priya","aditya","kabir","neha",
  "varun","roopa","aayan","ashutosh","advait","amelia","sophia",
]

interface Config {
  first_line: string
  agent_instructions: string
  context: string
  objective: string
  client_name: string
  voicemail_message: string
  transfer_number: string
  custom_post_call_url: string
  custom_action_webhook_url: string
  tts_voice: string
  tts_language: string
  llm_provider: string
  llm_model: string
  llm_temperature: number
  llm_max_tokens: number
  stt_mode: string
  greeting_delay_seconds: number
  silence_timeout_seconds: number
  max_call_duration_minutes: number
  max_cost_per_call_inr: number
  [key: string]: unknown
}

function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      {hint && <p className="text-xs text-gray-400 mb-1.5">{hint}</p>}
      {children}
    </div>
  )
}

const input = "w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-brand focus:ring-2 focus:ring-brand/20 outline-none text-sm"
const textarea = `${input} resize-y font-mono`

export default function SystemConfigPage() {
  const { apiKey, loading: authLoading } = useAuth()
  const [config, setConfig] = useState<Config | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [msg, setMsg] = useState<{ type: "success" | "error"; text: string } | null>(null)

  useEffect(() => {
    if (authLoading) return
    if (!apiKey) { setLoading(false); return }
    apiFetch<Config>("/api/config", { apiKey })
      .then(setConfig)
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [apiKey, authLoading])

  async function save() {
    if (!config || !apiKey) return
    setSaving(true)
    setMsg(null)
    try {
      await apiFetch("/api/config", { method: "POST", apiKey, body: config })
      setMsg({ type: "success", text: "Configuration saved!" })
    } catch {
      setMsg({ type: "error", text: "Failed to save" })
    }
    setSaving(false)
  }

  function set<K extends keyof Config>(key: K, val: Config[K]) {
    setConfig((c) => c ? { ...c, [key]: val } : c)
  }

  if (loading) {
    return (
      <div className="flex justify-center py-16">
        <div className="w-8 h-8 border-2 border-brand border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (!config) return <div className="text-center py-12 text-gray-400">Could not load config</div>

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-2xl font-bold text-gray-900">System Configuration</h1>
        <button
          onClick={save}
          disabled={saving}
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

      {/* Agent Identity */}
      <Section icon={<Bot size={16} />} title="Agent Identity">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Field label="Client / Company Name" hint="Used in prompts as {client_name}">
            <input value={config.client_name || ""} onChange={(e) => set("client_name", e.target.value)} className={input} />
          </Field>
          <Field label="Objective" hint="High-level mission for the AI agent">
            <input value={config.objective || ""} onChange={(e) => set("objective", e.target.value)} className={input} />
          </Field>
        </div>
        <Field label="First Line" hint="Opening greeting when call connects">
          <textarea value={config.first_line || ""} onChange={(e) => set("first_line", e.target.value)} rows={2} className={textarea} />
        </Field>
        <Field label="Voicemail Message">
          <textarea value={config.voicemail_message || ""} onChange={(e) => set("voicemail_message", e.target.value)} rows={2} className={textarea} />
        </Field>
        <Field label="Agent Instructions (System Prompt)" hint="Full behavioral instructions for the AI">
          <textarea value={config.agent_instructions || ""} onChange={(e) => set("agent_instructions", e.target.value)} rows={12} className={textarea} />
        </Field>
        <Field label="Context / Knowledge Base" hint="FAQ, product info, reference knowledge">
          <textarea value={config.context || ""} onChange={(e) => set("context", e.target.value)} rows={8} className={textarea} />
        </Field>
      </Section>

      {/* Voice & Speech */}
      <Section icon={<Volume2 size={16} />} title="Voice & Speech">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Field label="TTS Voice">
            <select value={config.tts_voice || "kavya"} onChange={(e) => set("tts_voice", e.target.value)} className={input}>
              {VOICES.map((v) => <option key={v} value={v}>{v}</option>)}
            </select>
          </Field>
          <Field label="TTS Language">
            <select value={config.tts_language || "hi-IN"} onChange={(e) => set("tts_language", e.target.value)} className={input}>
              <option value="hi-IN">Hindi (hi-IN)</option>
              <option value="en-IN">English India (en-IN)</option>
              <option value="bn-IN">Bengali (bn-IN)</option>
              <option value="ta-IN">Tamil (ta-IN)</option>
              <option value="te-IN">Telugu (te-IN)</option>
              <option value="mr-IN">Marathi (mr-IN)</option>
            </select>
          </Field>
          <Field label="STT Mode">
            <select value={config.stt_mode || "transcribe"} onChange={(e) => set("stt_mode", e.target.value)} className={input}>
              <option value="transcribe">Transcribe</option>
              <option value="translate">Translate</option>
            </select>
          </Field>
        </div>
      </Section>

      {/* LLM */}
      <Section icon={<Brain size={16} />} title="LLM Settings">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Field label="Provider">
            <select value={config.llm_provider || "groq"} onChange={(e) => set("llm_provider", e.target.value)} className={input}>
              <option value="groq">Groq</option>
              <option value="openai">OpenAI</option>
            </select>
          </Field>
          <Field label="Model">
            <input value={config.llm_model || ""} onChange={(e) => set("llm_model", e.target.value)} className={input} />
          </Field>
          <Field label="Temperature">
            <input type="number" step="0.1" min="0" max="2" value={config.llm_temperature ?? 0.4} onChange={(e) => set("llm_temperature", parseFloat(e.target.value))} className={input} />
          </Field>
          <Field label="Max Tokens">
            <input type="number" min="10" max="2000" value={config.llm_max_tokens ?? 50} onChange={(e) => set("llm_max_tokens", parseInt(e.target.value))} className={input} />
          </Field>
        </div>
      </Section>

      {/* Call Settings */}
      <Section icon={<Phone size={16} />} title="Call Settings">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Field label="Greeting Delay (seconds)" hint="Wait before speaking after connect">
            <input type="number" step="0.5" min="0" max="10" value={config.greeting_delay_seconds ?? 3} onChange={(e) => set("greeting_delay_seconds", parseFloat(e.target.value))} className={input} />
          </Field>
          <Field label="Silence Timeout (seconds)" hint="Hang up after this much silence">
            <input type="number" min="5" max="60" value={config.silence_timeout_seconds ?? 15} onChange={(e) => set("silence_timeout_seconds", parseInt(e.target.value))} className={input} />
          </Field>
          <Field label="Max Call Duration (minutes)">
            <input type="number" min="1" max="30" value={config.max_call_duration_minutes ?? 8} onChange={(e) => set("max_call_duration_minutes", parseInt(e.target.value))} className={input} />
          </Field>
          <Field label="Max Cost Per Call (INR)">
            <input type="number" step="0.5" min="1" max="50" value={config.max_cost_per_call_inr ?? 5} onChange={(e) => set("max_cost_per_call_inr", parseFloat(e.target.value))} className={input} />
          </Field>
          <Field label="Transfer Number" hint="Phone number for live transfers">
            <input value={config.transfer_number || ""} onChange={(e) => set("transfer_number", e.target.value)} placeholder="+919876543210" className={input} />
          </Field>
        </div>
      </Section>

      {/* Webhooks */}
      <Section icon={<Globe size={16} />} title="Webhooks">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Field label="Post-Call Webhook URL" hint="Called after every call ends">
            <input value={config.custom_post_call_url || ""} onChange={(e) => set("custom_post_call_url", e.target.value)} placeholder="https://..." className={input} />
          </Field>
          <Field label="Custom Action Webhook URL" hint="Tool-callable during live calls">
            <input value={config.custom_action_webhook_url || ""} onChange={(e) => set("custom_action_webhook_url", e.target.value)} placeholder="https://..." className={input} />
          </Field>
        </div>
      </Section>

      {/* Bottom save */}
      <div className="flex justify-end">
        <button
          onClick={save}
          disabled={saving}
          className="flex items-center gap-2 bg-brand hover:bg-brand-dark text-white px-6 py-2.5 rounded-xl font-medium transition-colors disabled:opacity-50"
        >
          <Save size={16} />
          {saving ? "Saving..." : "Save Changes"}
        </button>
      </div>
    </div>
  )
}

function Section({ icon, title, children }: { icon: React.ReactNode; title: string; children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-6 space-y-4">
      <h2 className="flex items-center gap-2 font-semibold text-gray-900">
        <span className="text-brand">{icon}</span>
        {title}
      </h2>
      {children}
    </div>
  )
}
