"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/hooks/use-auth"
import { apiFetch } from "@/lib/api"
import { ArrowLeft, ArrowRight } from "lucide-react"
import Link from "next/link"

export default function NewCampaignPage() {
  const { apiKey } = useAuth()
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const [form, setForm] = useState({
    name: "",
    client_name: "",
    objective: "",
    first_line: "",
    context: "",
    agent_instructions: "",
  })

  const [contactsText, setContactsText] = useState("")

  function updateField(key: string, value: string) {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  async function handleCreate() {
    if (!form.name || !form.objective) {
      setError("Campaign name and objective are required")
      return
    }
    setLoading(true)
    setError("")
    try {
      const campaign = await apiFetch<{ id: string }>("/api/campaigns", {
        method: "POST",
        apiKey,
        body: form,
      })

      // Upload contacts if provided
      if (contactsText.trim()) {
        const contacts = contactsText
          .split("\n")
          .map((line) => line.trim())
          .filter(Boolean)
          .map((line) => {
            const parts = line.split(",").map((p) => p.trim())
            return { phone: parts[0], name: parts[1] || undefined }
          })

        if (contacts.length > 0) {
          await apiFetch(`/api/campaigns/${campaign.id}/contacts`, {
            method: "POST",
            apiKey,
            body: { contacts },
          })
        }
      }

      router.push(`/dashboard/campaigns/${campaign.id}`)
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to create campaign")
      setLoading(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <Link
        href="/dashboard/campaigns"
        className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-brand transition-colors"
      >
        <ArrowLeft size={16} />
        Back to Campaigns
      </Link>

      <div>
        <h1 className="text-2xl font-bold text-gray-900">New Campaign</h1>
        <p className="text-gray-500">Set up your outbound calling campaign</p>
      </div>

      {/* Step indicator */}
      <div className="flex items-center gap-2">
        {[1, 2].map((s) => (
          <div key={s} className="flex items-center gap-2">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                step >= s ? "bg-brand text-white" : "bg-gray-100 text-gray-400"
              }`}
            >
              {s}
            </div>
            <span className={`text-sm ${step >= s ? "text-gray-900" : "text-gray-400"}`}>
              {s === 1 ? "Script & Config" : "Upload Contacts"}
            </span>
            {s < 2 && <div className="w-12 h-px bg-gray-200" />}
          </div>
        ))}
      </div>

      {error && (
        <div className="bg-red-50 text-red-600 text-sm rounded-xl px-4 py-3 border border-red-100">
          {error}
        </div>
      )}

      {/* Step 1: Script & Config */}
      {step === 1 && (
        <div className="bg-white rounded-2xl border border-gray-100 p-6 space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Campaign Name *</label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => updateField("name", e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-brand focus:ring-2 focus:ring-brand/20 outline-none transition-all bg-white text-sm"
              placeholder="e.g., March Car Mahotsav Follow-up"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Client / Brand Name</label>
            <input
              type="text"
              value={form.client_name}
              onChange={(e) => updateField("client_name", e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-brand focus:ring-2 focus:ring-brand/20 outline-none transition-all bg-white text-sm"
              placeholder="e.g., Pune Motors"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Objective *</label>
            <textarea
              value={form.objective}
              onChange={(e) => updateField("objective", e.target.value)}
              rows={2}
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-brand focus:ring-2 focus:ring-brand/20 outline-none transition-all bg-white text-sm resize-none"
              placeholder="What should the AI achieve on each call?"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Opening Line</label>
            <input
              type="text"
              value={form.first_line}
              onChange={(e) => updateField("first_line", e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-brand focus:ring-2 focus:ring-brand/20 outline-none transition-all bg-white text-sm"
              placeholder="e.g., Namaste! Main Shivani bol rahi hoon..."
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Context / Knowledge Base</label>
            <textarea
              value={form.context}
              onChange={(e) => updateField("context", e.target.value)}
              rows={4}
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-brand focus:ring-2 focus:ring-brand/20 outline-none transition-all bg-white text-sm resize-none"
              placeholder="FAQ answers, product details, pricing — anything the AI should know"
            />
          </div>

          <button
            onClick={() => setStep(2)}
            className="flex items-center gap-2 bg-brand hover:bg-brand-dark text-white px-6 py-2.5 rounded-xl text-sm font-medium transition-colors ml-auto"
          >
            Next: Upload Contacts
            <ArrowRight size={16} />
          </button>
        </div>
      )}

      {/* Step 2: Upload Contacts */}
      {step === 2 && (
        <div className="bg-white rounded-2xl border border-gray-100 p-6 space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Contacts</label>
            <p className="text-xs text-gray-400 mb-2">
              One per line: phone number, optional name (comma separated). e.g. +918149483065, Rushil
            </p>
            <textarea
              value={contactsText}
              onChange={(e) => setContactsText(e.target.value)}
              rows={8}
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-brand focus:ring-2 focus:ring-brand/20 outline-none transition-all bg-white text-sm font-mono resize-none"
              placeholder={"+918149483065, Rushil\n+919876543210, Priya\n+917890123456"}
            />
            <p className="text-xs text-gray-400 mt-1">
              {contactsText.split("\n").filter((l) => l.trim()).length} contacts entered
            </p>
          </div>

          <div className="flex items-center justify-between">
            <button
              onClick={() => setStep(1)}
              className="text-sm text-gray-500 hover:text-brand transition-colors"
            >
              ← Back
            </button>
            <button
              onClick={handleCreate}
              disabled={loading}
              className="flex items-center gap-2 bg-brand hover:bg-brand-dark text-white px-6 py-2.5 rounded-xl text-sm font-medium transition-colors disabled:opacity-50"
            >
              {loading ? "Creating..." : "Create Campaign"}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
