"use client"

import { useState } from "react"
import { useAuth } from "@/hooks/use-auth"
import { apiFetch } from "@/lib/api"
import { Phone, Upload, CheckCircle, AlertCircle } from "lucide-react"

export default function QuickCallPage() {
  const { apiKey } = useAuth()
  const [mode, setMode] = useState<"single" | "bulk">("single")

  // Single call state
  const [phone, setPhone] = useState("")
  const [singleStatus, setSingleStatus] = useState<"idle" | "loading" | "success" | "error">("idle")
  const [singleMsg, setSingleMsg] = useState("")

  // Bulk call state
  const [phones, setPhones] = useState("")
  const [bulkStatus, setBulkStatus] = useState<"idle" | "loading" | "success" | "error">("idle")
  const [bulkMsg, setBulkMsg] = useState("")

  async function handleSingleCall(e: React.FormEvent) {
    e.preventDefault()
    if (!phone.trim()) return
    setSingleStatus("loading")
    try {
      await apiFetch("/api/call/single", {
        method: "POST",
        apiKey,
        body: { phone: phone.trim() },
      })
      setSingleStatus("success")
      setSingleMsg("Call initiated successfully!")
      setPhone("")
    } catch (err) {
      setSingleStatus("error")
      setSingleMsg(err instanceof Error ? err.message : "Failed to initiate call")
    }
  }

  async function handleBulkCall(e: React.FormEvent) {
    e.preventDefault()
    const phoneList = phones
      .split("\n")
      .map((p) => p.trim())
      .filter(Boolean)
    if (phoneList.length === 0) return
    setBulkStatus("loading")
    try {
      await apiFetch("/api/call/bulk", {
        method: "POST",
        apiKey,
        body: { phones: phoneList },
      })
      setBulkStatus("success")
      setBulkMsg(`${phoneList.length} calls initiated!`)
      setPhones("")
    } catch (err) {
      setBulkStatus("error")
      setBulkMsg(err instanceof Error ? err.message : "Failed to initiate calls")
    }
  }

  return (
    <div className="space-y-6 max-w-2xl">
      <h1 className="text-2xl font-bold text-gray-900">Quick Call</h1>

      {/* Mode tabs */}
      <div className="flex gap-2">
        {(["single", "bulk"] as const).map((m) => (
          <button
            key={m}
            onClick={() => setMode(m)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
              mode === m
                ? "bg-brand text-white"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            {m === "single" ? "Single Call" : "Bulk Call"}
          </button>
        ))}
      </div>

      {/* Single Call */}
      {mode === "single" && (
        <form onSubmit={handleSingleCall} className="bg-white rounded-2xl border border-gray-100 p-6 space-y-4">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-brand/10 rounded-xl flex items-center justify-center">
              <Phone size={20} className="text-brand" />
            </div>
            <div>
              <h2 className="font-semibold text-gray-900">Make a Single Call</h2>
              <p className="text-sm text-gray-500">Enter a phone number to call immediately</p>
            </div>
          </div>

          <input
            type="tel"
            placeholder="+91 98765 43210"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-brand focus:ring-2 focus:ring-brand/20 outline-none text-sm"
          />

          {singleStatus !== "idle" && singleStatus !== "loading" && (
            <div className={`flex items-center gap-2 text-sm ${singleStatus === "success" ? "text-green-600" : "text-red-600"}`}>
              {singleStatus === "success" ? <CheckCircle size={16} /> : <AlertCircle size={16} />}
              {singleMsg}
            </div>
          )}

          <button
            type="submit"
            disabled={singleStatus === "loading" || !phone.trim()}
            className="w-full bg-brand hover:bg-brand-dark text-white py-3 rounded-xl font-medium transition-colors disabled:opacity-50"
          >
            {singleStatus === "loading" ? "Calling..." : "Call Now"}
          </button>
        </form>
      )}

      {/* Bulk Call */}
      {mode === "bulk" && (
        <form onSubmit={handleBulkCall} className="bg-white rounded-2xl border border-gray-100 p-6 space-y-4">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-brand/10 rounded-xl flex items-center justify-center">
              <Upload size={20} className="text-brand" />
            </div>
            <div>
              <h2 className="font-semibold text-gray-900">Bulk Call</h2>
              <p className="text-sm text-gray-500">Enter one phone number per line</p>
            </div>
          </div>

          <textarea
            placeholder={"+91 98765 43210\n+91 91234 56789\n+91 87654 32100"}
            value={phones}
            onChange={(e) => setPhones(e.target.value)}
            rows={8}
            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-brand focus:ring-2 focus:ring-brand/20 outline-none text-sm font-mono resize-y"
          />

          <p className="text-xs text-gray-400">
            {phones.split("\n").filter((p) => p.trim()).length} phone numbers entered
          </p>

          {bulkStatus !== "idle" && bulkStatus !== "loading" && (
            <div className={`flex items-center gap-2 text-sm ${bulkStatus === "success" ? "text-green-600" : "text-red-600"}`}>
              {bulkStatus === "success" ? <CheckCircle size={16} /> : <AlertCircle size={16} />}
              {bulkMsg}
            </div>
          )}

          <button
            type="submit"
            disabled={bulkStatus === "loading" || !phones.trim()}
            className="w-full bg-brand hover:bg-brand-dark text-white py-3 rounded-xl font-medium transition-colors disabled:opacity-50"
          >
            {bulkStatus === "loading" ? "Initiating..." : "Start Calls"}
          </button>
        </form>
      )}
    </div>
  )
}
