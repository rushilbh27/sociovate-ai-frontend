"use client"

import { useEffect, useState } from "react"
import { useAuth } from "@/hooks/use-auth"
import { apiFetch } from "@/lib/api"
import { Search, Phone, User } from "lucide-react"

interface Contact {
  phone_number: string
  caller_name: string | null
  total_calls: number
  last_seen: string | null
  is_booked: boolean
}

export default function ContactsPage() {
  const { apiKey, loading: authLoading } = useAuth()
  const [contacts, setContacts] = useState<Contact[]>([])
  const [search, setSearch] = useState("")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (authLoading) return
    if (!apiKey) {
      setLoading(false)
      return
    }
    apiFetch<Contact[]>("/api/contacts", { apiKey })
      .then(setContacts)
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [apiKey, authLoading])

  const filtered = contacts.filter(
    (c) =>
      c.phone_number.includes(search) ||
      (c.caller_name && c.caller_name.toLowerCase().includes(search.toLowerCase()))
  )

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-2xl font-bold text-gray-900">Contacts</h1>
        <div className="relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search by phone or name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 pr-4 py-2 rounded-xl border border-gray-200 focus:border-brand focus:ring-2 focus:ring-brand/20 outline-none text-sm w-64"
          />
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-8 h-8 border-2 border-brand border-t-transparent rounded-full animate-spin" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16 text-gray-400">
            <User size={40} className="mx-auto mb-3 opacity-50" />
            <p>No contacts found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left text-xs text-gray-500 uppercase tracking-wider border-b border-gray-100">
                  <th className="px-6 py-3">Phone</th>
                  <th className="px-6 py-3">Name</th>
                  <th className="px-6 py-3">Calls</th>
                  <th className="px-6 py-3">Last Seen</th>
                  <th className="px-6 py-3">Booked</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filtered.map((c) => (
                  <tr key={c.phone_number} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-3 text-sm font-medium text-gray-900">
                      <div className="flex items-center gap-2">
                        <Phone size={14} className="text-gray-400" />
                        {c.phone_number}
                      </div>
                    </td>
                    <td className="px-6 py-3 text-sm text-gray-600">{c.caller_name || "—"}</td>
                    <td className="px-6 py-3 text-sm text-gray-600">{c.total_calls}</td>
                    <td className="px-6 py-3 text-sm text-gray-500">
                      {c.last_seen ? new Date(c.last_seen).toLocaleDateString() : "—"}
                    </td>
                    <td className="px-6 py-3">
                      {c.is_booked ? (
                        <span className="text-xs font-medium px-2 py-1 rounded-full text-green-600 bg-green-50">
                          Booked
                        </span>
                      ) : (
                        <span className="text-sm text-gray-400">—</span>
                      )}
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
