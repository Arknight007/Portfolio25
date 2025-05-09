"use client"

import { useState, useEffect } from "react"
import { Monitor } from "lucide-react"
import { Toggle } from "@/components/ui/toggle"

export function CRTToggle() {
  const [crtEnabled, setCrtEnabled] = useState(false)

  useEffect(() => {
    const body = document.body
    if (crtEnabled) {
      body.classList.add("crt")
    } else {
      body.classList.remove("crt")
    }

    // Save preference to localStorage
    localStorage.setItem("crt-effect", crtEnabled.toString())

    return () => {
      body.classList.remove("crt")
    }
  }, [crtEnabled])

  // Load preference from localStorage on mount
  useEffect(() => {
    const savedPreference = localStorage.getItem("crt-effect")
    if (savedPreference === "true") {
      setCrtEnabled(true)
    }
  }, [])

  return (
    <Toggle
      aria-label="Toggle CRT effect"
      pressed={crtEnabled}
      onPressedChange={setCrtEnabled}
      className="data-[state=on]:bg-primary/20"
    >
      <Monitor className="h-4 w-4 mr-2" />
      CRT Effect
    </Toggle>
  )
}
