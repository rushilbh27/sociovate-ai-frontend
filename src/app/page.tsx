import { Navbar } from "@/components/marketing/Navbar"
import { Hero } from "@/components/marketing/Hero"
import { Stats } from "@/components/marketing/Stats"
import { Features } from "@/components/marketing/Features"
import { HowItWorks } from "@/components/marketing/HowItWorks"
import { Testimonials } from "@/components/marketing/Testimonials"
import { Pricing } from "@/components/marketing/Pricing"
import { FAQ } from "@/components/marketing/FAQ"
import { CTA } from "@/components/marketing/CTA"
import { Footer } from "@/components/marketing/Footer"

export default function HomePage() {
  return (
    <main className="min-h-screen">
      <Navbar />
      <Hero />
      <Stats />
      <Features />
      <HowItWorks />
      <Testimonials />
      <Pricing />
      <FAQ />
      <CTA />
      <Footer />
    </main>
  )
}
