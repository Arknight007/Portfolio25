"use client"

import { useEffect, useState } from "react"

const bootMessages = [
  "Initializing system...",
  "Loading kernel...",
  "Mounting file systems...",
  "Starting services...",
  "Loading portfolio data...",
]

export default function BootSequence() {
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0)

  useEffect(() => {
    if (currentMessageIndex < bootMessages.length) {
      const timer = setTimeout(() => {
        setCurrentMessageIndex((prev) => prev + 1)
      }, 400)

      return () => clearTimeout(timer)
    }
  }, [currentMessageIndex])

  return (
    <div className="flex flex-col items-center justify-center h-full">
      <div className="w-full max-w-2xl bg-black/70 p-8 rounded-md border border-primary/30 font-mono text-primary">
        <div className="mb-6 text-center">
          <pre className="text-xs sm:text-sm md:text-base whitespace-pre overflow-x-auto">
!ASTRO~NOT
          </pre>
        </div>

        <div className="space-y-2">
          {bootMessages.slice(0, currentMessageIndex).map((message, index) => (
            <div key={index} className="flex">
              <span className="text-primary mr-2">&gt;</span>
              <span className="text-foreground/90">{message}</span>
              {index === currentMessageIndex - 1 && index !== bootMessages.length - 1 && (
                <span className="ml-1 cursor-blink">_</span>
              )}
            </div>
          ))}

          {currentMessageIndex === bootMessages.length && (
            <div className="flex mt-4">
              <span className="text-primary mr-2">&gt;</span>
              <span className="typing-animation text-foreground/90">Boot complete. Welcome to Srikar's terminal.</span>
              <span className="cursor-blink">_</span>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
