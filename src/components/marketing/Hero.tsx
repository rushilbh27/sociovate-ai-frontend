import Link from "next/link"
import { ArrowRight, Play } from "lucide-react"

export function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden dreamy-bg">
      {/* Floating decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Soft circles */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-purple-200/30 rounded-full blur-3xl animate-float" />
        <div className="absolute top-40 right-20 w-96 h-96 bg-blue-200/30 rounded-full blur-3xl animate-float-slow" />
        <div className="absolute bottom-20 left-1/3 w-80 h-80 bg-orange-100/30 rounded-full blur-3xl animate-float" />
        {/* Subtle grain overlay */}
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 256 256\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noise\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.65\' numOctaves=\'3\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noise)\'/%3E%3C/svg%3E")' }} />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-6 text-center pt-32 pb-20">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 bg-white/60 backdrop-blur-sm border border-white/40 rounded-full px-4 py-1.5 mb-8 animate-fade-in-up">
          <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
          <span className="text-sm text-gray-600">Now live with 50+ businesses across India</span>
        </div>

        {/* Main headline with mixed typography */}
        <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold leading-[0.95] mb-6 animate-fade-in-up" style={{ animationDelay: "0.1s" }}>
          <span className="font-display italic text-brand">Voice</span>{" "}
          <span className="text-gray-900">agents</span>
          <br />
          <span className="text-gray-900">that sound</span>{" "}
          <span className="font-display italic text-brand">human</span>
        </h1>

        {/* Subheadline */}
        <p className="text-lg md:text-xl text-gray-500 max-w-2xl mx-auto mb-10 leading-relaxed animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
          AI-powered calling that handles lead qualification, appointment booking,
          and follow-ups — so your team can focus on closing.
        </p>

        {/* CTA buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in-up" style={{ animationDelay: "0.3s" }}>
          <Link
            href="/signup"
            className="group bg-brand hover:bg-brand-dark text-white px-8 py-4 rounded-full font-medium text-lg transition-all hover:shadow-lg hover:shadow-brand/25 flex items-center gap-2"
          >
            Start Free Trial
            <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
          </Link>
          <a
            href="#demo"
            className="group flex items-center gap-3 px-8 py-4 rounded-full text-gray-600 hover:text-brand transition-colors text-lg"
          >
            <span className="w-12 h-12 rounded-full bg-white shadow-lg flex items-center justify-center group-hover:shadow-brand/20 transition-shadow">
              <Play size={18} className="text-brand ml-0.5" />
            </span>
            Listen to a Demo
          </a>
        </div>

        {/* Trust proof */}
        <div className="mt-20 animate-fade-in-up" style={{ animationDelay: "0.5s" }}>
          <p className="text-xs uppercase tracking-widest text-gray-400 mb-6">Trusted by forward-thinking teams</p>
          <div className="flex flex-wrap items-center justify-center gap-x-12 gap-y-4 opacity-40">
            {["AutoHaus", "MedConnect", "EduReach", "PropertyPro", "FinServe"].map((name) => (
              <span key={name} className="text-lg font-semibold text-gray-400">
                {name}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom fade to white */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white to-transparent" />
    </section>
  )
}
