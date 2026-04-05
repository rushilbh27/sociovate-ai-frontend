"use client"

import { useEffect, useState } from "react"
import { useAuth } from "@/hooks/use-auth"
import { apiFetch } from "@/lib/api"
import type { Tenant } from "@/types"
import { Plus, Search, Trash2 } from "lucide-react"

export default function TenantsPage() {
  const { apiKey, loading: authLoading } = useAuth()
  const [tenants, setTenants] = useState<Tenant[]>([])
  const [search, setSearch] = useState("")
  const [loading, setLoading] = useState(true)
  const [showNew, setShowNew] = useState(false)
  const [newName, setNewName] = useState("")
  const [creating, setCreating] = useState(false)

  async function load() {
    if (!apiKey) {
      setLoading(false)
      return
    }
    try {
      const data = await apiFetch<Tenant[]>("/api/tenants", { apiKey })
      setTenants(data)
    } catch (err) {
      console.error(err)
    }
    setLoading(false)
  }

  useEffect(() => {
    if (authLoading) return
    load()
  }, [apiKey, authLoading])

  async function createTenant() {
    if (!newName.trim() || !apiKey) return
    setCreating(true)
    try {
      await apiFetch("/api/tenants", {
        method: "POST",
        apiKey,
        body: { name: newName.trim() },
      })
      setNewName("")
      setShowNew(false)
      await load()
    } catch (err) {
      console.error(err)
    }
    setCreating(false)
  }

  async function deleteTenant(id: string) {
    if (!apiKey || !confirm("Delete this tenant?")) return
    try {
      await apiFetch(`/api/admin/tenants/${id}`, { method: "DELETE", apiKey })
      setTenants((t) => t.filter((x) => x.id !== id))
    } catch (err) {
      console.error(err)
    }
  }

  const filtered = tenants.filter(
    (t) =>
      t.name.toLowerCase().includes(search.toLowerCase()) ||
      t.api_key.includes(search)
  )

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-2xl font-bold text-gray-900">Tenants</h1>
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
            New Tenant
          </button>
        </div>
      </div>

      {/* New tenant inline form */}
      {showNew && (
        <div className="bg-white rounded-2xl border border-gray-100 p-5 flex items-end gap-4">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">Tenant Name</label>
            <input
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              placeholder="Acme Corp"
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-brand focus:ring-2 focus:ring-brand/20 outline-none text-sm"
            />
          </div>
          <button
            onClick={createTenant}
            disabled={creating || !newName.trim()}
            className="bg-brand hover:bg-brand-dark text-white px-5 py-2.5 rounded-xl text-sm font-medium transition-colors disabled:opacity-50"
          >
            {creating ? "Creating..." : "Create"}
          </button>
          <button
            onClick={() => { setShowNew(false); setNewName("") }}
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
          <div className="text-center py-16 text-gray-400">No tenants found</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left text-xs text-gray-500 uppercase tracking-wider border-b border-gray-100">
                  <th className="px-6 py-3">Name</th>
                  <th className="px-6 py-3">API Key</th>
                  <th className="px-6 py-3">Created</th>
                  <th className="px-6 py-3">Status</th>
                  <th className="px-6 py-3 w-10"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filtered.map((t) => (
                  <tr key={t.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-3 text-sm font-medium text-gray-900">{t.name}</td>
                    <td className="px-6 py-3">
                      <code className="text-xs bg-gray-50 px-2 py-1 rounded font-mono text-gray-600">{t.api_key.slice(0, 12)}...</code>
                    </td>
                    <td className="px-6 py-3 text-sm text-gray-500">
                      {new Date(t.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-3">
                      <span className={`text-xs font-medium px-2 py-1 rounded-full ${t.is_active ? "bg-green-50 text-green-700" : "bg-red-50 text-red-600"}`}>
                        {t.is_active ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="px-6 py-3">
                      <button
                        onClick={() => deleteTenant(t.id)}
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
