import { AsciiArt } from "@/components/ascii-art-component"
import { Mail, Phone, MapPin, Linkedin, Github, Code } from "lucide-react"

export function ContactSection() {
  return (
    <div className="space-y-4">
      <AsciiArt art="contact" />

      <div className="space-y-6">
        <div className="flex flex-col gap-3">
          <a
            href="mailto:srikar.molahalli@gmail.com"
            className="flex items-center text-sm hover:text-primary transition-colors"
          >
            <Mail className="h-4 w-4 mr-2 text-primary" />
            srikar.molahalli@gmail.com
          </a>
          <a href="tel:+919428852241" className="flex items-center text-sm hover:text-primary transition-colors">
            <Phone className="h-4 w-4 mr-2 text-primary" />
            +91 9428852241
          </a>
          <div className="flex items-center text-sm">
            <MapPin className="h-4 w-4 mr-2 text-primary" />
            Surat, Gujarat, India
          </div>
          <a
            href="https://www.linkedin.com/in/srikar-molahalli"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center text-sm hover:text-primary transition-colors"
          >
            <Linkedin className="h-4 w-4 mr-2 text-primary" />
            linkedin.com/in/srikar-molahalli
          </a>
          <a
            href="https://github.com/Srikar045"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center text-sm hover:text-primary transition-colors"
          >
            <Github className="h-4 w-4 mr-2 text-primary" />
            github.com/Srikar045
          </a>
          <a
            href="https://leetcode.com/u/ProtagonistSyndrome/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center text-sm hover:text-primary transition-colors"
          >
            <Code className="h-4 w-4 mr-2 text-primary" />
            leetcode.com/u/ProtagonistSyndrome
          </a>
        </div>
      </div>
    </div>
  )
}
