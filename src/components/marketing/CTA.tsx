import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { Aurora } from "@/components/reactbits/Aurora"
import { Orb } from "@/components/reactbits/Orb"

export function CTA() {
  return (
    <div style={{ background: "linear-gradient(160deg, #FFF3DC 0%, #FFF8F0 35%, #E8F7F6 70%, #FFF3DC 100%)" }}>
      <Aurora className="relative overflow-hidden grain">
        <section id="cta" className="py-28 relative">
          <Orb className="left-1/2 top-1/2" color="rgba(255,136,17,0.20)" size={800} blur={120} />
          <Orb className="left-[20%] top-[30%]" color="rgba(157,217,210,0.15)" size={400} blur={80} />

          <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
            <h2 className="text-5xl md:text-7xl font-bold text-gray-900 leading-[0.9] tracking-tight mb-6">
              Ready to{" "}
              <span className="font-script text-[#FF8811]" style={{ fontSize: "1.05em" }}>automate</span>
              <br />
              your calls?
            </h2>
            <p className="text-lg text-gray-500 max-w-xl mx-auto mb-10">
              Join 50+ businesses already using Sociovate AI to multiply their calling capacity.
              Start with a free demo call — no commitment needed.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/signup"
                className="group bg-[#FF8811] hover:bg-[#E07300] text-white px-9 py-4 rounded-full font-semibold text-base transition-all animate-pulse-glow flex items-center gap-2 cursor-pointer"
              >
                Get Started Free
                <ArrowRight size={17} className="group-hover:translate-x-0.5 transition-transform" />
              </Link>
              <Link
                href="#"
                className="text-gray-600 hover:text-[#FF8811] px-8 py-4 rounded-full text-base bg-white/60 hover:bg-white/80 border border-orange-200/60 hover:border-orange-300 transition-all cursor-pointer backdrop-blur-sm"
              >
                Talk to Sales
              </Link>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-6 mt-12">
              {["No credit card required", "48-hour setup", "Free demo call", "Cancel anytime"].map((badge) => (
                <div key={badge} className="flex items-center gap-1.5 text-sm text-gray-500">
                  <span className="w-1 h-1 bg-[#9DD9D2] rounded-full" />
                  {badge}
                </div>
              ))}
            </div>
          </div>
        </section>
      </Aurora>
    </div>
  )
}
