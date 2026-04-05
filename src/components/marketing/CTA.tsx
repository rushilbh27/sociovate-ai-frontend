import Link from "next/link"
import { ArrowRight } from "lucide-react"

export function CTA() {
  return (
    <section id="cta" className="py-24 relative overflow-hidden">
      {/* Dreamy background */}
      <div className="absolute inset-0 dreamy-bg" />
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-10 left-20 w-96 h-96 bg-purple-200/30 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-10 right-20 w-80 h-80 bg-blue-200/30 rounded-full blur-3xl animate-float-slow" />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
        <h2 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
          Ready to{" "}
          <span className="font-display italic text-brand">automate</span>
          <br />
          your calls?
        </h2>
        <p className="text-lg text-gray-500 max-w-xl mx-auto mb-10">
          Join 50+ businesses already using Sociovate AI to multiply their calling capacity.
          Start with a free demo call.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/signup"
            className="group bg-brand hover:bg-brand-dark text-white px-8 py-4 rounded-full font-medium text-lg transition-all hover:shadow-lg hover:shadow-brand/25 flex items-center gap-2"
          >
            Get Started Free
            <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
          </Link>
          <Link
            href="#"
            className="text-gray-600 hover:text-brand px-8 py-4 rounded-full text-lg transition-colors"
          >
            Talk to Sales
          </Link>
        </div>
      </div>
    </section>
  )
}
