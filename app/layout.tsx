import type { Metadata, Viewport } from "next"
import { Bricolage_Grotesque, Geist, Instrument_Serif, JetBrains_Mono, Tiro_Devanagari_Hindi } from "next/font/google"
import { contact, festival, site } from "@/lib/data"
import "./globals.css"

const geist = Geist({ subsets: ["latin"], variable: "--font-geist", display: "swap" })
const bricolage = Bricolage_Grotesque({ subsets: ["latin"], variable: "--font-bricolage", display: "swap" })
const instrument = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
  variable: "--font-instrument",
  display: "swap",
})
const jetbrains = JetBrains_Mono({ subsets: ["latin"], variable: "--font-jetbrains", display: "swap" })
const tiro = Tiro_Devanagari_Hindi({
  subsets: ["devanagari"],
  weight: "400",
  variable: "--font-tiro",
  display: "swap",
  preload: false,
})

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: { default: site.title, template: `%s · ${site.name}` },
  description: site.description,
  applicationName: site.name,
  authors: [{ name: site.name, url: site.url }],
  creator: site.name,
  keywords: [
    "Srikar Molahalli",
    "software engineer",
    "portfolio",
    "compiler",
    "LLVM",
    "cloud",
    "quantum computing",
    "Collins Aerospace",
    "IISER Kolkata",
    "NMIMS",
    "GATE 2026",
  ],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    url: site.url,
    siteName: site.name,
    title: site.title,
    description: site.description,
    locale: "en_IN",
  },
  twitter: { card: "summary_large_image", title: site.title, description: site.description },
  robots: { index: true, follow: true },
}

export const viewport: Viewport = {
  themeColor: "#06050c",
  colorScheme: "dark",
}

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: site.name,
  url: site.url,
  email: `mailto:${contact.email}`,
  jobTitle: "Software Engineer",
  alumniOf: "NMIMS Mukesh Patel School of Technology Management & Engineering",
  sameAs: [contact.github, contact.linkedin, contact.leetcode],
  knowsAbout: ["Compilers", "LLVM", "Cloud Computing", "Quantum Computing", "Full-stack Development", "Rust"],
}

// Runs before first paint so returning visitors never see the greeting cover flash.
const greetedScript = festival.oncePerSession
  ? `try{if(sessionStorage.getItem("srikar:greeted")==="1")document.documentElement.setAttribute("data-greeted","")}catch(e){}`
  : ""

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geist.variable} ${bricolage.variable} ${instrument.variable} ${jetbrains.variable} ${tiro.variable}`}
    >
      <head>
        {greetedScript && <script dangerouslySetInnerHTML={{ __html: greetedScript }} />}
        <noscript>
          <style>{`#greeting-cover{display:none}`}</style>
        </noscript>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      </head>
      <body className="min-h-dvh">{children}</body>
    </html>
  )
}
