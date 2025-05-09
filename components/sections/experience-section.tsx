import { AsciiArt } from "@/components/ascii-art-component"

export function ExperienceSection() {
  return (
    <div className="space-y-4">
      <AsciiArt art="experience" />

      <div className="space-y-6">
        <div className="relative pl-5 border-l border-primary/30">
          <div className="absolute w-3 h-3 bg-primary rounded-full -left-[6.5px] top-1" />
          <div className="mb-1">
            <h3 className="text-primary font-bold">Technical Team Lead</h3>
            <p className="text-xs text-muted-foreground">Coding Club NMIMS | August 2024 - Present</p>
          </div>
          <ul className="text-sm space-y-1 list-disc pl-4">
            <li>Leading a team of developers and organizing technical workshops and hackathons</li>
            <li>Mentoring junior members in programming concepts and project development</li>
            <li>Coordinating with other clubs and departments for collaborative tech events</li>
          </ul>
        </div>

        <div className="relative pl-5 border-l border-primary/30">
          <div className="absolute w-3 h-3 bg-primary rounded-full -left-[6.5px] top-1" />
          <div className="mb-1">
            <h3 className="text-primary font-bold">Summer Research Intern</h3>
            <p className="text-xs text-muted-foreground">
              Indian Institute of Science Education & Research (IISER), Kolkata | May 2024 - July 2024
            </p>
          </div>
          <ul className="text-sm space-y-1 list-disc pl-4">
            <li>
              Engineered computational models of prediction and 15% improved fuel optimization in lunar/Martian descent
            </li>
            <li>
              Optimized spacecraft landing trajectories and reduced landing errors by ~10% using data-driven research
            </li>
            <li>Analyzed complex spacecraft dynamics datasets and improved landing accuracy predictions by ~12%</li>
            <li>
              Collaborated with a team of 8+ researchers and faculty members to build and test novel trajectory
              optimization algorithms
            </li>
          </ul>
        </div>

        <div className="relative pl-5 border-l border-primary/30">
          <div className="absolute w-3 h-3 bg-primary rounded-full -left-[6.5px] top-1" />
          <div className="mb-1">
            <h3 className="text-primary font-bold">Technical Team Member</h3>
            <p className="text-xs text-muted-foreground">AMBIORA TechFest | January 2024 - February 2024</p>
          </div>
          <ul className="text-sm space-y-1 list-disc pl-4">
            <li>Assisted in organizing and managing technical events and competitions</li>
            <li>Developed web applications for event registration and management</li>
            <li>Provided technical support during the fest and troubleshot issues in real-time</li>
          </ul>
        </div>

        <div className="relative pl-5 border-l border-primary/30">
          <div className="absolute w-3 h-3 bg-primary rounded-full -left-[6.5px] top-1" />
          <div className="mb-1">
            <h3 className="text-primary font-bold">Student Fellow</h3>
            <p className="text-xs text-muted-foreground">NextLeap | July 2023 - January 2024</p>
          </div>
          <ul className="text-sm space-y-1 list-disc pl-4">
            <li>Participated in intensive data structures and algorithms training program</li>
            <li>Completed multiple coding challenges and projects to enhance programming skills</li>
            <li>Collaborated with peers on group projects and coding competitions</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
