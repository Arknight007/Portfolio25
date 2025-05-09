"use client"

import { useEffect, useState, useRef } from "react"

interface AsciiPortraitGridProps {
  width?: number
  height?: number
  contrast?: number
  brightness?: number
}

export function AsciiPortraitGrid({
  width = 80,
  height = 100,
  contrast = 1.4, // Fixed value as requested
  brightness = 0.7, // Fixed value as requested
}: AsciiPortraitGridProps) {
  const [pixels, setPixels] = useState<Array<{ char: string; color: string }>>([])
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Load the image
    const img = new Image()
    img.crossOrigin = "anonymous"
    img.src =
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/WhatsApp%20Image%202024-08-19%20at%2023.09.35_bb0e84d7.jpg-vNaMYkbNtPefHIRx2bZUxvJhIofxMZ.jpeg"

    img.onload = () => {
      // Calculate aspect ratio and apply better cropping
      const sourceWidth = img.width
      const sourceHeight = img.height

      // Define crop area (focus on face and upper body)
      const cropX = sourceWidth * 0.2 // Crop 20% from left
      const cropY = sourceHeight * 0.05 // Crop 5% from top
      const cropWidth = sourceWidth * 0.6 // Use 60% of width
      const cropHeight = sourceHeight * 0.7 // Use 70% of height

      const aspectRatio = cropWidth / cropHeight
      const adjustedWidth = Math.floor(height * aspectRatio)

      // Create a canvas to process the image
      const canvas = document.createElement("canvas")
      canvas.width = adjustedWidth
      canvas.height = height

      const ctx = canvas.getContext("2d", { alpha: false })
      if (!ctx) return

      // Draw image to canvas with cropping
      ctx.drawImage(
        img,
        cropX,
        cropY,
        cropWidth,
        cropHeight, // Source rectangle
        0,
        0,
        adjustedWidth,
        height, // Destination rectangle
      )

      // Get image data
      const imageData = ctx.getImageData(0, 0, adjustedWidth, height)
      const data = imageData.data

      // Apply contrast and brightness
      for (let i = 0; i < data.length; i += 4) {
        // Apply brightness
        data[i] = Math.min(255, data[i] * brightness)
        data[i + 1] = Math.min(255, data[i + 1] * brightness)
        data[i + 2] = Math.min(255, data[i + 2] * brightness)

        // Apply contrast
        data[i] = Math.min(255, Math.max(0, ((data[i] / 255 - 0.5) * contrast + 0.5) * 255))
        data[i + 1] = Math.min(255, Math.max(0, ((data[i + 1] / 255 - 0.5) * contrast + 0.5) * 255))
        data[i + 2] = Math.min(255, Math.max(0, ((data[i + 2] / 255 - 0.5) * contrast + 0.5) * 255))
      }

      ctx.putImageData(imageData, 0, 0)

      // Advanced ASCII character set with varying visual weights
      const asciiChars = [
        "@",
        "%",
        "#",
        "8",
        "&",
        "W",
        "M",
        "B",
        "O",
        "Q",
        "D",
        "X",
        "H",
        "U",
        "A",
        "K",
        "V",
        "Z",
        "Y",
        "N",
        "C",
        "L",
        "T",
        "I",
        "J",
        "F",
        "S",
        "G",
        "P",
        "E",
        "R",
        "?",
        "7",
        "1",
        "/",
        "\\",
        "|",
        "(",
        ")",
        "{",
        "}",
        "[",
        "]",
        "*",
        "+",
        "~",
        "-",
        "_",
        ":",
        ";",
        "!",
        ">",
        "<",
        '"',
        "^",
        "=",
        ",",
        ".",
        "`",
        " ",
      ]

      // Process pixels
      const newPixels = []

      for (let y = 0; y < height; y++) {
        for (let x = 0; x < adjustedWidth; x++) {
          // Get pixel color
          const i = (y * adjustedWidth + x) * 4
          const r = data[i]
          const g = data[i + 1]
          const b = data[i + 2]

          // Calculate perceived brightness
          const brightness = 0.299 * r + 0.587 * g + 0.114 * b

          // Map brightness to ASCII character with more precision
          const charIndex = Math.floor((brightness / 255) * (asciiChars.length - 1))
          const char = asciiChars[charIndex]

          // Add to pixels array with original color
          newPixels.push({
            char,
            color: `rgb(${r},${g},${b})`,
          })
        }
      }

      setPixels(newPixels)
    }
  }, [width, height, contrast, brightness])

  return (
    <div className="ascii-portrait-grid-container flex justify-center my-4">
      <div
        ref={containerRef}
        className="grid border border-primary/30 rounded p-1 bg-black shadow-lg shadow-primary/20 transition-all duration-300 hover:shadow-primary/40 relative overflow-hidden"
        style={{
          gridTemplateColumns: `repeat(${width}, 1fr)`,
          maxWidth: "100%",
          aspectRatio: "3/4",
        }}
      >
        {pixels.map((pixel, index) => (
          <div
            key={index}
            className="flex items-center justify-center font-mono leading-none"
            style={{
              color: pixel.color,
              fontSize: "4px",
              lineHeight: "100%",
              textShadow: "0 0 1px rgba(0,0,0,0.8)",
            }}
          >
            {pixel.char}
          </div>
        ))}
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300" />
      </div>
    </div>
  )
}
