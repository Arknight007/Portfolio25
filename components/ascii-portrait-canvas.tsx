"use client"

import { useEffect, useRef } from "react"

interface AsciiPortraitCanvasProps {
  width?: number
  height?: number
  contrast?: number
  brightness?: number
}

export function AsciiPortraitCanvas({
  width = 100,
  height = 120,
  contrast = 1.4, // Fixed value as requested
  brightness = 0.7, // Fixed value as requested
}: AsciiPortraitCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d", { alpha: false })
    if (!ctx) return

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

      // Create a temporary canvas for image processing
      const tempCanvas = document.createElement("canvas")
      const tempCtx = tempCanvas.getContext("2d", { alpha: false })
      if (!tempCtx) return

      tempCanvas.width = adjustedWidth
      tempCanvas.height = height

      // Draw and process the image with cropping
      tempCtx.drawImage(
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

      // Apply contrast and brightness adjustments
      const imageData = tempCtx.getImageData(0, 0, adjustedWidth, height)
      const data = imageData.data

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

      tempCtx.putImageData(imageData, 0, 0)

      // Set up the main canvas
      const charWidth = 6
      const charHeight = 10
      canvas.width = adjustedWidth * charWidth
      canvas.height = height * charHeight

      // Clear canvas and set background
      ctx.fillStyle = "#000"
      ctx.fillRect(0, 0, canvas.width, canvas.height)

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

      // Get processed image data
      const processedImageData = tempCtx.getImageData(0, 0, adjustedWidth, height)
      const processedData = processedImageData.data

      // Draw ASCII art with enhanced algorithm
      ctx.textBaseline = "top"
      ctx.font = `${charHeight}px "JetBrains Mono"`

      for (let y = 0; y < height; y++) {
        for (let x = 0; x < adjustedWidth; x++) {
          const i = (y * adjustedWidth + x) * 4
          const r = processedData[i]
          const g = processedData[i + 1]
          const b = processedData[i + 2]

          // Calculate perceived brightness (human eye is more sensitive to green)
          const brightness = 0.299 * r + 0.587 * g + 0.114 * b

          // Map brightness to ASCII character with more precision
          const charIndex = Math.floor((brightness / 255) * (asciiChars.length - 1))
          const char = asciiChars[charIndex]

          // Create gradient for each character based on surrounding pixels
          const gradient = ctx.createLinearGradient(
            x * charWidth,
            y * charHeight,
            x * charWidth + charWidth,
            y * charHeight + charHeight,
          )

          gradient.addColorStop(0, `rgba(${r},${g},${b},1)`)

          // Sample nearby pixels for gradient
          if (x < adjustedWidth - 1 && y < height - 1) {
            const i2 = ((y + 1) * adjustedWidth + (x + 1)) * 4
            gradient.addColorStop(1, `rgba(${processedData[i2]},${processedData[i2 + 1]},${processedData[i2 + 2]},1)`)
          } else {
            gradient.addColorStop(1, `rgba(${r},${g},${b},1)`)
          }

          ctx.fillStyle = gradient
          ctx.fillText(char, x * charWidth, y * charHeight)
        }
      }
    }
  }, [width, height, contrast, brightness])

  return (
    <div className="ascii-portrait-container flex justify-center my-4">
      <div className="relative group">
        <canvas
          ref={canvasRef}
          className="border border-primary/30 rounded shadow-lg shadow-primary/20 transition-all duration-300 hover:shadow-primary/40"
          style={{ maxWidth: "100%", height: "auto" }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded" />
      </div>
    </div>
  )
}
