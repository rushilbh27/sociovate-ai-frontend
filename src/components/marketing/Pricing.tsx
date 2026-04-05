import Link from "next/link"
import { Check } from "lucide-react"
import { cn } from "@/lib/utils"
import { Orb } from "@/components/reactbits/Orb"

const plans = [
  {
    name: "Starter",
    price: "4,999",
    period: "/month",
    description: "For small teams getting started with AI calling",
    features: ["500 outbound minutes", "Inbound call handling", "1 AI agent persona", "Call recordings & transcripts", "Basic analytics dashboard", "Email support"],
    cta: "Start Free Trial",
    href: "/signup",
    popular: false,
  },
  {
    name: "Growth",
    price: "14,999",
    period: "/month",
    description: "For teams scaling their outbound operations",
    features: ["3,000 outbound minutes", "Unlimited inbound", "5 AI agent personas", "Campaign manager", "CRM & webhook integrations", "Advanced analytics", "Calendar booking", "Priority support"],
    cta: "Start Free Trial",
    href: "/signup",
    popular: true,
  },
  {
    name: "Enterprise",
    price: "Custom",
    period: "",
    description: "For large organizations with custom requirements",
    features: ["Unlimited minutes", "Unlimited personas", "Multi-tenant management", "Custom LLM & voice", "SIP trunk & phone provisioning", "Dedicated account manager", "SLA guarantee", "On-prem deployment option"],
    cta: "Contact Sales",
    href: "#cta",
    popular: false,
  },
]

export function Pricing() {
  return (
    <section
      id="pricing"
      className="py-28 relative overflow-hidden"
      style={{ background: "linear-gradient(180deg, #FFF8F0 0%, #FFF3DC 50%, #FFF8F0 100%)" }}
    >
      <Orb className="left-1/2 top-1/2" color="rgba(255,136,17,0.12)" size={700} blur={100} />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="text-center mb-16">
          <p className="text-sm font-medium text-[#FF8811] uppercase tracking-widest mb-3">Pricing</p>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-5 leading-tight">
            Simple,{" "}
            <span className="font-script text-[#FF8811]" style={{ fontSize: "1.1em" }}>transparent</span>
            {" "}pricing
          </h2>
          <p className="text-lg text-gray-500 max-w-xl mx-auto">
            No hidden fees. No long-term contracts. Start small, scale as you grow.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 max-w-5xl mx-auto">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={cn(
                "rounded-2xl p-8 border transition-all duration-300 relative",
                plan.popular
                  ? "bg-[#FF8811] border-transparent shadow-2xl shadow-[#FF8811]/30 scale-105 animate-pulse-glow"
                  : "bg-white border-orange-100 hover:border-orange-200 hover:shadow-xl hover:shadow-orange-200/25"
              )}
            >
              {plan.popular && (
                <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-white text-[#FF8811] text-xs font-bold px-4 py-1 rounded-full shadow-sm">
                  Most Popular
                </span>
              )}

              <h3 className={cn("text-lg font-semibold mb-1", plan.popular ? "text-white" : "text-gray-900")}>
                {plan.name}
              </h3>
              <p className={cn("text-sm mb-6", plan.popular ? "text-white/65" : "text-gray-400")}>
                {plan.description}
              </p>

              <div className="mb-6">
                <span className={cn("text-4xl font-bold", plan.popular ? "text-white" : "text-gray-900")}>
                  {plan.price === "Custom" ? "Custom" : `₹${plan.price}`}
                </span>
                {plan.period && (
                  <span className={cn("text-sm ml-1", plan.popular ? "text-white/65" : "text-gray-400")}>
                    {plan.period}
                  </span>
                )}
              </div>

              <Link
                href={plan.href}
                className={cn(
                  "block text-center py-3 px-6 rounded-full font-semibold text-sm transition-all mb-8 cursor-pointer",
                  plan.popular
                    ? "bg-white text-[#FF8811] hover:bg-orange-50 shadow-md"
                    : "bg-[#FF8811]/8 text-[#FF8811] hover:bg-[#FF8811]/15 border border-[#FF8811]/25 hover:border-[#FF8811]/40"
                )}
              >
                {plan.cta}
              </Link>

              <ul className="space-y-3">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-start gap-3 text-sm">
                    <Check size={15} className={cn("mt-0.5 shrink-0", plan.popular ? "text-white/80" : "text-[#FF8811]")} />
                    <span className={plan.popular ? "text-white/80" : "text-gray-500"}>{f}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <p className="text-center text-sm text-gray-400 mt-10">
          All plans include a free demo call. No credit card required to start.
        </p>
      </div>
    </section>
  )
}
