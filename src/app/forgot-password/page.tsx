"use client"

import { useState } from "react"
import Link from "next/link"
import { createClient } from "@/lib/supabase"
import { ArrowLeft } from "lucide-react"

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState("")

  async function handleReset(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError("")
    const supabase = createClient()
    const { error: err } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/login`,
    })
    if (err) { setError(err.message); setLoading(false); return }
    setSent(true)
    setLoading(false)
  }

  return (
    <div className="min-h-screen dreamy-bg flex items-center justify-center px-6 relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-20 w-72 h-72 bg-[#9DD9D2]/25 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-20 right-20 w-64 h-64 bg-[#F4D06F]/20 rounded-full blur-3xl animate-float-slow" />
      </div>

      <div className="relative z-10 w-full max-w-md">
        <Link href="/login" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-[#FF8811] mb-8 transition-colors cursor-pointer">
          <ArrowLeft size={16} />
          Back to login
        </Link>

        <div className="bg-white/80 backdrop-blur-xl rounded-2xl border border-orange-100 shadow-xl shadow-orange-100/40 p-8">
          <div className="mb-2">
            <span className="font-script text-3xl text-[#FF8811]">Sociovate</span>
          </div>
          <h2 className="text-xl font-bold text-gray-900 mt-4 mb-1">Reset your password</h2>
          <p className="text-gray-500 text-sm mb-8">
            Enter your email and we&apos;ll send you a reset link.
          </p>

          {error && (
            <div className="bg-red-50 text-red-600 text-sm rounded-xl px-4 py-3 mb-6 border border-red-100">
              {error}
            </div>
          )}

          {sent ? (
            <div className="text-center py-4">
              <div className="w-16 h-16 rounded-full bg-[#FF8811]/10 flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-[#FF8811]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <p className="text-gray-600">
                Reset link sent to <strong>{email}</strong>. Check your inbox.
              </p>
            </div>
          ) : (
            <form onSubmit={handleReset} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-orange-100 focus:border-[#FF8811] focus:ring-2 focus:ring-[#FF8811]/20 outline-none transition-all bg-white"
                  placeholder="you@company.com"
                  required
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#FF8811] hover:bg-[#E07300] text-white py-3 rounded-xl font-medium transition-colors disabled:opacity-50 cursor-pointer glow-brand-sm"
              >
                {loading ? "Sending..." : "Send Reset Link"}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}
