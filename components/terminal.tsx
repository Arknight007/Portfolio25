"use client"

import type React from "react"
import { useState, useEffect, useRef, useCallback } from "react"
import { TerminalIcon, User, Briefcase, Code, Mail, GraduationCap, Award, Rocket } from "lucide-react"
import { Button } from "@/components/ui/button"
import { AboutSection } from "@/components/sections/about-section"
import { EducationSection } from "@/components/sections/education-section"
import { SkillsSection } from "@/components/sections/skills-section"
import { ExperienceSection } from "@/components/sections/experience-section"
import { ProjectsSection } from "@/components/sections/projects-section"
import { CertificationsSection } from "@/components/sections/certifications-section"
import { ContactSection } from "@/components/sections/contact-section"
import { ImageAsciiLogo } from "@/components/image-ascii-logo"

type Command = {
  input: string
  output: React.ReactNode
  timestamp: Date
}

export default function Terminal() {
  const [input, setInput] = useState("")
  const [commandHistory, setCommandHistory] = useState<Command[]>([])
  const [historyIndex, setHistoryIndex] = useState(-1)
  const [currentSection, setCurrentSection] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const terminalRef = useRef<HTMLDivElement>(null)

  // Use useCallback to memoize the scrollToBottom function
  const scrollToBottom = useCallback(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight
    }
  }, [])

  useEffect(() => {
    // Focus input on mount and when clicking anywhere in the terminal
    inputRef.current?.focus()

    const handleClick = () => {
      inputRef.current?.focus()
    }

    document.addEventListener("click", handleClick)

    // Add welcome message
    setCommandHistory([
      {
        input: "welcome",
        output: (
          <div className="space-y-2">
            <ImageAsciiLogo />
            <p className="font-mono text-white">
              Welcome to Srikar Molahalli's portfolio! Type <span className="text-primary font-bold">help</span> to see
              available commands.
            </p>
          </div>
        ),
        timestamp: new Date(),
      },
    ])

    return () => {
      document.removeEventListener("click", handleClick)
    }
  }, [])

  useEffect(() => {
    scrollToBottom()
  }, [commandHistory, currentSection, scrollToBottom])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!input.trim()) return

    const command = input.trim().toLowerCase()
    let output: React.ReactNode

    // Process command
    switch (command) {
      case "help":
        output = (
          <div className="space-y-2 text-white">
            <p className="font-bold">Available commands:</p>
            <ul className="space-y-1">
              <li>
                <span className="text-white font-bold">about</span> - Learn about Srikar
              </li>
              <li>
                <span className="text-white font-bold">education</span> - View educational background
              </li>
              <li>
                <span className="text-white font-bold">skills</span> - See technical skills
              </li>
              <li>
                <span className="text-white font-bold">experience</span> - View work experience
              </li>
              <li>
                <span className="text-white font-bold">projects</span> - View projects
              </li>
              <li>
                <span className="text-white font-bold">certifications</span> - View certifications and achievements
              </li>
              <li>
                <span className="text-white font-bold">contact</span> - Get contact information
              </li>
              <li>
                <span className="text-white font-bold">clear</span> - Clear the terminal
              </li>
              <li>
                <span className="text-white font-bold">help</span> - Show this help message
              </li>
              <li>
                <span className="text-white font-bold">ls</span> - List available sections
              </li>
              <li>
                <span className="text-white font-bold">whoami</span> - Display user information
              </li>
              <li>
                <span className="text-white font-bold">date</span> - Display current date and time
              </li>
            </ul>
          </div>
        )
        setCurrentSection(null)
        break

      case "about":
        output = <AboutSection />
        setCurrentSection("about")
        break

      case "education":
        output = <EducationSection />
        setCurrentSection("education")
        break

      case "skills":
        output = <SkillsSection />
        setCurrentSection("skills")
        break

      case "experience":
        output = <ExperienceSection />
        setCurrentSection("experience")
        break

      case "projects":
        output = <ProjectsSection />
        setCurrentSection("projects")
        break

      case "certifications":
        output = <CertificationsSection />
        setCurrentSection("certifications")
        break

      case "contact":
        output = <ContactSection />
        setCurrentSection("contact")
        break

      case "clear":
        setCommandHistory([])
        setCurrentSection(null)
        setInput("")
        return

      case "ls":
        output = (
          <div className="space-y-2 text-white">
            <p>Available sections:</p>
            <pre className="text-xs text-white/70">
              {`
about/         education/     skills/        experience/
projects/      certifications/contact/       
`}
            </pre>
          </div>
        )
        setCurrentSection(null)
        break

      case "whoami":
        output = (
          <div className="space-y-2 text-white">
            <p>srikar@astro~not</p>
            <p className="text-xs text-white/70">Computer Science Student & Aspiring Astronaut</p>
          </div>
        )
        setCurrentSection(null)
        break

      case "date":
        output = (
          <div className="space-y-2 text-white">
            <p>{new Date().toString()}</p>
          </div>
        )
        setCurrentSection(null)
        break

      default:
        if (command.startsWith("cd ")) {
          const section = command.split(" ")[1]
          if (
            ["about", "education", "skills", "experience", "projects", "certifications", "contact"].includes(section)
          ) {
            setInput(section)
            handleSubmit({ preventDefault: () => {} } as React.FormEvent)
            return
          } else {
            output = <p className="text-white">cd: no such directory: {section}</p>
          }
        } else {
          output = (
            <p className="text-white">
              Command not found: {command}. Type <span className="text-white font-bold">help</span> to see available
              commands.
            </p>
          )
        }
        setCurrentSection(null)
    }

    // Add command to history
    setCommandHistory((prev) => [
      ...prev,
      {
        input: command,
        output,
        timestamp: new Date(),
      },
    ])

    // Reset input and history index
    setInput("")
    setHistoryIndex(-1)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    // Handle up/down arrows for command history navigation
    if (e.key === "ArrowUp") {
      e.preventDefault()
      if (historyIndex < commandHistory.length - 1) {
        const newIndex = historyIndex + 1
        setHistoryIndex(newIndex)
        setInput(commandHistory[commandHistory.length - 1 - newIndex].input)
      }
    } else if (e.key === "ArrowDown") {
      e.preventDefault()
      if (historyIndex > 0) {
        const newIndex = historyIndex - 1
        setHistoryIndex(newIndex)
        setInput(commandHistory[commandHistory.length - 1 - newIndex].input)
      } else if (historyIndex === 0) {
        setHistoryIndex(-1)
        setInput("")
      }
    }
  }

  return (
    <div className="flex flex-col h-full">
      <div className="bg-black border border-white/30 rounded-t-md p-2 flex items-center">
        <TerminalIcon className="h-4 w-4 text-white mr-2" />
        <span className="text-sm font-mono text-white">
          srikar@astro:~ {currentSection ? `/${currentSection}` : ""}
        </span>
      </div>

      <div ref={terminalRef} className="flex-1 bg-black border-x border-white/30 p-4 overflow-y-auto font-mono text-sm">
        {commandHistory.map((cmd, index) => (
          <div key={index} className="mb-4">
            <div className="flex items-center text-white/70">
              <span className="text-white mr-2">&#62;_</span>
              <span>{cmd.input}</span>
            </div>
            <div className="mt-1 ml-4">{cmd.output}</div>
          </div>
        ))}
      </div>

      <div className="bg-black border border-white/30 rounded-b-md p-2">
        <form onSubmit={handleSubmit} className="flex items-center">
          <span className="text-white mr-2">&#62;_</span>
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            className="flex-1 bg-transparent border-none outline-none font-mono text-white"
            aria-label="Terminal input"
            autoComplete="off"
            spellCheck="false"
          />
        </form>
      </div>

      <nav className="mt-4 flex flex-wrap justify-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            setInput("about")
            handleSubmit({ preventDefault: () => {} } as React.FormEvent)
          }}
          className="text-xs bg-black/50 hover:bg-black/70 text-white border-white/30"
        >
          <User className="h-3 w-3 mr-1" />
          About
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            setInput("education")
            handleSubmit({ preventDefault: () => {} } as React.FormEvent)
          }}
          className="text-xs bg-black/50 hover:bg-black/70 text-white border-white/30"
        >
          <GraduationCap className="h-3 w-3 mr-1" />
          Education
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            setInput("skills")
            handleSubmit({ preventDefault: () => {} } as React.FormEvent)
          }}
          className="text-xs bg-black/50 hover:bg-black/70 text-white border-white/30"
        >
          <Rocket className="h-3 w-3 mr-1" />
          Skills
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            setInput("experience")
            handleSubmit({ preventDefault: () => {} } as React.FormEvent)
          }}
          className="text-xs bg-black/50 hover:bg-black/70 text-white border-white/30"
        >
          <Briefcase className="h-3 w-3 mr-1" />
          Experience
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            setInput("projects")
            handleSubmit({ preventDefault: () => {} } as React.FormEvent)
          }}
          className="text-xs bg-black/50 hover:bg-black/70 text-white border-white/30"
        >
          <Code className="h-3 w-3 mr-1" />
          Projects
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            setInput("certifications")
            handleSubmit({ preventDefault: () => {} } as React.FormEvent)
          }}
          className="text-xs bg-black/50 hover:bg-black/70 text-white border-white/30"
        >
          <Award className="h-3 w-3 mr-1" />
          Certifications
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            setInput("contact")
            handleSubmit({ preventDefault: () => {} } as React.FormEvent)
          }}
          className="text-xs bg-black/50 hover:bg-black/70 text-white border-white/30"
        >
          <Mail className="h-3 w-3 mr-1" />
          Contact
        </Button>
      </nav>
    </div>
  )
}
