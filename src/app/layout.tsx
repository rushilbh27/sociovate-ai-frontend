import type { Metadata } from "next"
import { Inter, Playfair_Display } from "next/font/google"
import "./globals.css"

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
})

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-display",
})

export const metadata: Metadata = {
  title: "Sociovate AI — Voice Agents That Sound Human",
  description:
    "AI-powered voice calling platform that automates outbound & inbound calls for businesses. Lead qualification, appointment booking, follow-ups — all on autopilot.",
  openGraph: {
    title: "Sociovate AI — Voice Agents That Sound Human",
    description: "AI-powered voice calling that sounds indistinguishable from a real person.",
    type: "website",
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable}`}>
      <body className="font-sans">{children}</body>
    </html>
  )
}
