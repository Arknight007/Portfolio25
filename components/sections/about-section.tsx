import { AsciiArt } from "@/components/ascii-art-component"
import { StaticAsciiPortrait } from "@/components/static-ascii-portrait"

export function AboutSection() {
  return (
    <div className="space-y-4">
      <AsciiArt art="about" />

      <div className="flex flex-col md:flex-row gap-6">
        <div className="md:w-2/5">
          <StaticAsciiPortrait />
          <div className="text-center text-xs text-muted-foreground mt-2">
            Srikar Molahalli
            <br />
            <span className="text-primary/60">Computer Science Student & Aspiring Astronaut</span>
          </div>
        </div>

        <div className="space-y-3 md:w-3/5">
          <p>
            Hello! I'm Srikar Molahalli, a Computer Science sophomore at NMIMS MPSTME with a passion for technology,
            space, and innovation.
          </p>

          <p>
            As the Coding Club Team Lead for 2024-25 and a DSA Fellow at NextLeap, I focus on developing cutting-edge
            solutions and expanding my knowledge in various tech domains.
          </p>

          <div className="mt-2 p-3 border border-primary/20 rounded bg-primary/5">
            <h3 className="text-primary font-bold mb-2">Quick Facts:</h3>
            <ul className="space-y-1">
              <li>
                <span className="text-muted-foreground">Location:</span> Surat, Gujarat, India
              </li>
              <li>
                <span className="text-muted-foreground">Education:</span> B.Tech in Computer Science, NMIMS MPSTME
              </li>
              <li>
                <span className="text-muted-foreground">Specialty:</span> Data Science, Python, LLMOps
              </li>
              <li>
                <span className="text-muted-foreground">Achievements:</span> KVPY-SA Scholar AIR 741, NTSE Scholar, JEE
                Advanced AIR 12287
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
