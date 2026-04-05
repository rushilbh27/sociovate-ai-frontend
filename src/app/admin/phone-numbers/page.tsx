"use client"

import { useEffect, useState } from "react"
import { useAuth } from "@/hooks/use-auth"
import { apiFetch } from "@/lib/api"
import type { PhoneNumber, Tenant } from "@/types"
import { Plus, Search, Trash2, Phone } from "lucide-react"

export default function PhoneNumbersPage() {
  const { apiKey } = useAuth()
  const [numbers, setNumbers] = useState<PhoneNumber[]>([])
  const [tenants, setTenants] = useState<Tenant[]>([])
  const [search, setSearch] = useState("")
  const [loading, setLoading] = useState(true)

  // New mapping form
  const [showNew, setShowNew] = useState(false)
  const [newPhone, setNewPhone] = useState("")
  const [newTenantId, setNewTenantId] = useState("")
  const [saving, setSaving] = useState(false)

  async function load() {
    if (!apiKey) return
    try {
      const [n, t] = await Promise.all([
        apiFetch<PhoneNumber[]>("/api/admin/phone-numbers", { apiKey }),
        apiFetch<Tenant[]>("/api/admin/tenants", { apiKey }),
      ])
      setNumbers(n)
      setTenants(t)
    } catch (err) {
      console.error(err)
    }
    setLoading(false)
  }

  useEffect(() => { load() }, [apiKey])

  async function addMapping() {
    if (!newPhone.trim() || !newTenantId || !apiKey) return
    setSaving(true)
    try {
      await apiFetch("/api/admin/phone-numbers", {
        method: "POST",
        apiKey,
        body: { phone_number: newPhone.trim(), tenant_id: newTenantId },
      })
      setNewPhone("")
      setNewTenantId("")
      setShowNew(false)
      await load()
    } catch (err) {
      console.error(err)
    }
    setSaving(false)
  }

  async function removeMapping(id: string) {
    if (!apiKey || !confirm("Remove this mapping?")) return
    try {
      await apiFetch(`/api/admin/phone-numbers/${id}`, { method: "DELETE", apiKey })
      setNumbers((n) => n.filter((x) => x.id !== id))
    } catch (err) {
      console.error(err)
    }
  }

  const filtered = numbers.filter(
    (n) =>
      n.phone_number.includes(search) ||
      (n.tenant_name && n.tenant_name.toLowerCase().includes(search.toLowerCase()))
  )

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-2xl font-bold text-gray-900">Phone Numbers</h1>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 pr-4 py-2 rounded-xl border border-gray-200 focus:border-brand focus:ring-2 focus:ring-brand/20 outline-none text-sm"
            />
          </div>
          <button
            onClick={() => setShowNew(true)}
            className="flex items-center gap-2 bg-brand hover:bg-brand-dark text-white px-4 py-2 rounded-xl text-sm font-medium transition-colors"
          >
            <Plus size={16} />
            Add Mapping
          </button>
        </div>
      </div>

      {showNew && (
        <div className="bg-white rounded-2xl border border-gray-100 p-5 flex flex-wrap items-end gap-4">
          <div className="flex-1 min-w-[200px]">
            <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
            <input
              value={newPhone}
              onChange={(e) => setNewPhone(e.target.value)}
              placeholder="+91 98765 43210"
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-brand focus:ring-2 focus:ring-brand/20 outline-none text-sm"
            />
          </div>
          <div className="flex-1 min-w-[200px]">
            <label className="block text-sm font-medium text-gray-700 mb-1">Tenant</label>
            <select
              value={newTenantId}
              onChange={(e) => setNewTenantId(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-brand outline-none text-sm bg-white"
            >
              <option value="">Select tenant...</option>
              {tenants.map((t) => (
                <option key={t.id} value={t.id}>{t.name}</option>
              ))}
            </select>
          </div>
          <button
            onClick={addMapping}
            disabled={saving || !newPhone.trim() || !newTenantId}
            className="bg-brand hover:bg-brand-dark text-white px-5 py-2.5 rounded-xl text-sm font-medium transition-colors disabled:opacity-50"
          >
            {saving ? "Saving..." : "Add"}
          </button>
          <button
            onClick={() => { setShowNew(false); setNewPhone(""); setNewTenantId("") }}
            className="text-gray-400 hover:text-gray-600 px-3 py-2.5 text-sm"
          >
            Cancel
          </button>
        </div>
      )}

      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="flex justify-center py-16">
            <div className="w-8 h-8 border-2 border-brand border-t-transparent rounded-full animate-spin" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16 text-gray-400">
            <Phone size={40} className="mx-auto mb-3 opacity-50" />
            <p>No phone number mappings</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left text-xs text-gray-500 uppercase tracking-wider border-b border-gray-100">
                  <th className="px-6 py-3">Phone Number</th>
                  <th className="px-6 py-3">Tenant</th>
                  <th className="px-6 py-3">Created</th>
                  <th className="px-6 py-3 w-10"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filtered.map((n) => (
                  <tr key={n.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-3 text-sm font-medium text-gray-900 font-mono">{n.phone_number}</td>
                    <td className="px-6 py-3 text-sm text-gray-600">{n.tenant_name || n.tenant_id}</td>
                    <td className="px-6 py-3 text-sm text-gray-500">
                      {new Date(n.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-3">
                      <button
                        onClick={() => removeMapping(n.id)}
                        className="text-gray-400 hover:text-red-500 transition-colors"
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
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
