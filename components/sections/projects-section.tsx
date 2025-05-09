import { AsciiArt } from "@/components/ascii-art-component"
import { ExternalLink } from "lucide-react"

export function ProjectsSection() {
  return (
    <div className="space-y-4">
      <AsciiArt art="projects" />

      <div className="space-y-6">
        <div className="p-3 border border-primary/20 rounded bg-primary/5">
          <h3 className="text-primary font-bold flex items-center">
            Solar Positioning Equinox Simulator
            <a
              href="https://github.com/Arknight007/Solar-Positioning-Equinox-Simulator-"
              target="_blank"
              rel="noopener noreferrer"
              className="ml-2 text-xs text-primary/70 hover:text-primary inline-flex items-center"
            >
              <ExternalLink className="h-3 w-3 mr-1" />
              GitHub
            </a>
          </h3>
          <pre className="text-xs my-2 text-muted-foreground">
            {`
  +-------------+     +----------------+     +----------------+
  | Java Swing  |---->| Solar Position |---->| Astronomical   |
  | Interface   |     | Calculations   |     | Events         |
  +-------------+     +----------------+     +----------------+
        |                    |                      |
        |                    v                      |
        |             +--------------+              |
        +------------>| Seasonal     |<-------------+
                      | Simulations  |
                      +--------------+
                             |
                             v
                      +---------------+
                      | Interactive   |
                      | Visualization |
                      +---------------+
`}
          </pre>
          <p className="text-sm mb-2">
            Java-based simulation with ~12+ adjustable parameters for solar positioning based on latitude, season, and
            time. Simulates 4 major astronomical events with smooth real-time animations.
          </p>
          <p className="text-xs text-muted-foreground mb-2">Technologies: Java, Java Swing, Astronomical Algorithms</p>
        </div>

        <div className="p-3 border border-primary/20 rounded bg-primary/5">
          <h3 className="text-primary font-bold flex items-center">
            Borderless Financial Inclusion
            <a
              href="https://github.com/Arknight007/Borderless-FinTrans-Defi"
              target="_blank"
              rel="noopener noreferrer"
              className="ml-2 text-xs text-primary/70 hover:text-primary inline-flex items-center"
            >
              <ExternalLink className="h-3 w-3 mr-1" />
              GitHub
            </a>
          </h3>
          <pre className="text-xs my-2 text-muted-foreground">
            {`
  +-------------+     +----------------+     +----------------+
  | React 19    |---->| Flask Backend  |---->| Multi-Chain    |
  | Frontend    |     | API            |     | Integration    |
  +-------------+     +----------------+     +----------------+
        |                    |                      |
        v                    v                      v
  +-------------+     +--------------+      +----------------+
  | TypeScript  |     | Web3         |      | Yield Wallet   |
  | Components  |     | Libraries    |      | Strategies     |
  +-------------+     +--------------+      +----------------+
`}
          </pre>
          <p className="text-sm mb-2">
            A Flask-backed DeFi platform across 5+ blockchains reducing cross-border remittance fees by 90%. Created
            yield wallets with investment strategies, improving passive income potential for users by 40% APY.
          </p>
          <p className="text-xs text-muted-foreground mb-2">
            Technologies: React 19, Flask, TypeScript, Web3, Tailwind CSS
          </p>
        </div>

        <div className="p-3 border border-primary/20 rounded bg-primary/5">
          <h3 className="text-primary font-bold flex items-center">
            Zotion (Notion Clone)
            <a
              href="https://github.com/Arknight007/Zotion_NotionClone"
              target="_blank"
              rel="noopener noreferrer"
              className="ml-2 text-xs text-primary/70 hover:text-primary inline-flex items-center"
            >
              <ExternalLink className="h-3 w-3 mr-1" />
              GitHub
            </a>
          </h3>
          <pre className="text-xs my-2 text-muted-foreground">
            {`
  +-------------+     +----------------+     +----------------+
  | Next.js     |---->| Real-time      |---->| Block-Based    |
  | Application |     | Collaboration  |     | Editor         |
  +-------------+     +----------------+     +----------------+
        |                    |                      |
        v                    v                      v
  +-------------+     +--------------+      +----------------+
  | Tailwind    |     | Database     |      | Authentication |
  | Styling     |     | Integration  |      | System         |
  +-------------+     +--------------+      +----------------+
`}
          </pre>
          <p className="text-sm mb-2">
            A full-featured Notion clone with real-time collaboration, block-based editing, and comprehensive document
            management capabilities.
          </p>
          <p className="text-xs text-muted-foreground mb-2">
            Technologies: Next.js, React, Tailwind CSS, Prisma, PostgreSQL
          </p>
        </div>

        <div className="p-3 border border-primary/20 rounded bg-primary/5">
          <h3 className="text-primary font-bold flex items-center">
            Quiz Game
            <a
              href="https://github.com/Arknight007/quizz-game"
              target="_blank"
              rel="noopener noreferrer"
              className="ml-2 text-xs text-primary/70 hover:text-primary inline-flex items-center"
            >
              <ExternalLink className="h-3 w-3 mr-1" />
              GitHub
            </a>
          </h3>
          <pre className="text-xs my-2 text-muted-foreground">
            {`
  +-------------+     +----------------+     +----------------+
  | JavaScript  |---->| Quiz API       |---->| Score          |
  | Frontend    |     | Integration    |     | Tracking       |
  +-------------+     +----------------+     +----------------+
        |                    |                      |
        v                    v                      v
  +-------------+     +--------------+      +----------------+
  | Responsive  |     | Timer        |      | Category       |
  | Design      |     | System       |      | Selection      |
  +-------------+     +--------------+      +----------------+
`}
          </pre>
          <p className="text-sm mb-2">
            An interactive quiz application with multiple categories, difficulty levels, and score tracking. Features a
            responsive design and timed challenges.
          </p>
          <p className="text-xs text-muted-foreground mb-2">Technologies: JavaScript, HTML5, CSS3, API Integration</p>
        </div>

        <div className="p-3 border border-primary/20 rounded bg-primary/5">
          <h3 className="text-primary font-bold flex items-center">
            Inventory Management
            <a
              href="https://github.com/Arknight007/Inventory_Management-"
              target="_blank"
              rel="noopener noreferrer"
              className="ml-2 text-xs text-primary/70 hover:text-primary inline-flex items-center"
            >
              <ExternalLink className="h-3 w-3 mr-1" />
              GitHub
            </a>
          </h3>
          <pre className="text-xs my-2 text-muted-foreground">
            {`
  +-------------+     +----------------+     +----------------+
  | Node.js     |---->| Express        |---->| MongoDB        |
  | Backend     |     | API            |     | Database       |
  +-------------+     +----------------+     +----------------+
        |                    |                      |
        v                    v                      v
  +-------------+     +--------------+      +----------------+
  | React       |     | Stock Alert  |      | Reporting      |
  | Frontend    |     | System       |      | Dashboard      |
  +-------------+     +--------------+      +----------------+
`}
          </pre>
          <p className="text-sm mb-2">
            A comprehensive inventory management system with product tracking, stock alerts, and reporting capabilities.
          </p>
          <p className="text-xs text-muted-foreground mb-2">Technologies: Node.js, Express, MongoDB, React</p>
        </div>
      </div>
    </div>
  )
}
