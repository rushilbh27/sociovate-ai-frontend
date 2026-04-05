import Link from "next/link"
import { Check } from "lucide-react"
import { cn } from "@/lib/utils"

const plans = [
  {
    name: "Starter",
    price: "4,999",
    period: "/month",
    description: "For small teams getting started with AI calling",
    features: [
      "500 outbound minutes",
      "Inbound call handling",
      "1 AI agent persona",
      "Call recordings & transcripts",
      "Basic analytics dashboard",
      "Email support",
    ],
    cta: "Start Free Trial",
    popular: false,
  },
  {
    name: "Growth",
    price: "14,999",
    period: "/month",
    description: "For teams scaling their outbound operations",
    features: [
      "3,000 outbound minutes",
      "Unlimited inbound",
      "5 AI agent personas",
      "Campaign manager",
      "CRM & webhook integrations",
      "Advanced analytics",
      "Calendar booking",
      "Priority support",
    ],
    cta: "Start Free Trial",
    popular: true,
  },
  {
    name: "Enterprise",
    price: "Custom",
    period: "",
    description: "For large organizations with custom requirements",
    features: [
      "Unlimited minutes",
      "Unlimited personas",
      "Multi-tenant management",
      "Custom LLM & voice",
      "SIP trunk & phone provisioning",
      "Dedicated account manager",
      "SLA guarantee",
      "On-prem deployment option",
    ],
    cta: "Contact Sales",
    popular: false,
  },
]

export function Pricing() {
  return (
    <section id="pricing" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <p className="text-sm font-semibold text-brand uppercase tracking-widest mb-3">Pricing</p>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Simple,{" "}
            <span className="font-display italic text-brand">transparent</span>{" "}
            pricing
          </h2>
          <p className="text-lg text-gray-500 max-w-2xl mx-auto">
            No hidden fees. No long-term contracts. Start small, scale as you grow.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={cn(
                "rounded-2xl p-8 border transition-all duration-300",
                plan.popular
                  ? "border-brand shadow-xl shadow-brand/10 scale-105 relative"
                  : "border-gray-200 hover:border-brand/30 hover:shadow-lg"
              )}
            >
              {plan.popular && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-brand text-white text-xs font-semibold px-4 py-1 rounded-full">
                  Most Popular
                </span>
              )}

              <h3 className="text-xl font-semibold text-gray-900 mb-1">{plan.name}</h3>
              <p className="text-sm text-gray-500 mb-5">{plan.description}</p>

              <div className="mb-6">
                <span className="text-4xl font-bold text-gray-900">
                  {plan.price === "Custom" ? "" : "₹"}
                  {plan.price}
                </span>
                <span className="text-gray-500">{plan.period}</span>
              </div>

              <Link
                href={plan.price === "Custom" ? "#cta" : "/signup"}
                className={cn(
                  "block text-center py-3 px-6 rounded-full font-medium transition-colors mb-8",
                  plan.popular
                    ? "bg-brand text-white hover:bg-brand-dark"
                    : "bg-gray-100 text-gray-900 hover:bg-gray-200"
                )}
              >
                {plan.cta}
              </Link>

              <ul className="space-y-3">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-start gap-3 text-sm text-gray-600">
                    <Check size={16} className="text-brand mt-0.5 shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
