"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Menu, X } from "lucide-react"
import { cn } from "@/lib/utils"

const navLinks = [
  { label: "Features", href: "#features" },
  { label: "How It Works", href: "#how-it-works" },
  { label: "Pricing", href: "#pricing" },
  { label: "FAQ", href: "#faq" },
]

export function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener("scroll", onScroll)
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  return (
    <nav className="fixed top-4 left-0 right-0 z-50 px-4">
      <div className="max-w-5xl mx-auto">
        <div
          className={cn(
            "flex items-center justify-between h-14 px-5 rounded-full transition-all duration-300",
            scrolled
              ? "bg-white/95 backdrop-blur-md shadow-xl shadow-orange-200/40 border border-orange-100"
              : "bg-white/80 backdrop-blur-md shadow-lg shadow-orange-100/30 border border-orange-100/60"
          )}
        >
          {/* Cursive logo */}
          <Link href="/" className="cursor-pointer">
            <span className="font-script text-2xl text-[#FF8811] leading-none">Sociovate</span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-6">
            {navLinks.map((l) => (
              <a
                key={l.href}
                href={l.href}
                className="text-sm text-gray-500 hover:text-[#FF8811] transition-colors cursor-pointer"
              >
                {l.label}
              </a>
            ))}
          </div>

          {/* Desktop CTA */}
          <div className="hidden md:flex items-center gap-1">
            <Link
              href="/login"
              className="text-sm text-gray-500 hover:text-[#FF8811] px-4 py-2 transition-colors cursor-pointer"
            >
              Login
            </Link>
            <Link
              href="/signup"
              className="text-sm bg-[#FF8811] hover:bg-[#E07300] text-white px-5 py-2 rounded-full font-medium transition-all cursor-pointer glow-brand-sm"
            >
              Get started
            </Link>
          </div>

          {/* Mobile toggle */}
          <button
            className="md:hidden p-1.5 text-gray-600 cursor-pointer"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <div className="md:hidden mt-2 bg-white/95 backdrop-blur-md rounded-2xl shadow-lg border border-orange-100 px-5 py-4">
            {navLinks.map((l) => (
              <a
                key={l.href}
                href={l.href}
                className="block py-2.5 text-sm text-gray-600 hover:text-[#FF8811] transition-colors cursor-pointer"
                onClick={() => setMobileOpen(false)}
              >
                {l.label}
              </a>
            ))}
            <div className="flex gap-2 mt-3 pt-3 border-t border-orange-50">
              <Link href="/login" className="text-sm text-gray-600 px-3 py-2 cursor-pointer">Login</Link>
              <Link href="/signup" className="text-sm bg-[#FF8811] text-white px-4 py-2 rounded-full font-medium cursor-pointer">
                Get started
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
