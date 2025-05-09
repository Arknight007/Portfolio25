"use client"

import { useEffect, useRef } from "react"

interface AsciiPortraitProps {
  width?: number
  height?: number
}

export function AsciiPortrait({ width = 60, height = 80 }: AsciiPortraitProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Load the image
    const img = new Image()
    img.crossOrigin = "anonymous"
    img.src = "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/pose2.JPEG-6Ua6wNwVYcJtG1UMNf8o6wYovA9RUA.jpeg"

    img.onload = () => {
      // Calculate aspect ratio
      const aspectRatio = img.width / img.height
      const adjustedWidth = Math.floor(height * aspectRatio)

      // Draw image to canvas
      ctx.drawImage(img, 0, 0, adjustedWidth, height)

      // Get image data
      const imageData = ctx.getImageData(0, 0, adjustedWidth, height)
      const data = imageData.data

      // Clear canvas for redrawing
      ctx.clearRect(0, 0, adjustedWidth * 10, height * 10)

      // ASCII characters from darkest to lightest
      const asciiChars = ["@", "%", "#", "*", "+", "=", "-", ":", ".", " "]

      // Draw ASCII art
      ctx.fillStyle = "#000"
      ctx.fillRect(0, 0, adjustedWidth * 10, height * 10)

      for (let y = 0; y < height; y++) {
        for (let x = 0; x < adjustedWidth; x++) {
          // Get pixel color
          const i = (y * adjustedWidth + x) * 4
          const r = data[i]
          const g = data[i + 1]
          const b = data[i + 2]

          // Calculate brightness
          const brightness = 0.299 * r + 0.587 * g + 0.114 * b

          // Map brightness to ASCII character
          const charIndex = Math.floor((brightness / 255) * (asciiChars.length - 1))
          const char = asciiChars[charIndex]

          // Use color from image
          ctx.fillStyle = `rgb(${r},${g},${b})`
          ctx.font = '8px "JetBrains Mono"'
          ctx.fillText(char, x * 8, y * 8)
        }
      }
    }
  }, [width, height])

  return (
    <div className="ascii-portrait-container flex justify-center my-4 overflow-hidden">
      <div className="relative group">
        <canvas
          ref={canvasRef}
          width={width * 10}
          height={height * 10}
          className="border border-primary/30 rounded transition-all duration-300 filter hover:brightness-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>
    </div>
  )
}
