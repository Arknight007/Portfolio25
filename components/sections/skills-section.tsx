import { AsciiArt } from "@/components/ascii-art-component"

export function SkillsSection() {
  return (
    <div className="space-y-4">
      <AsciiArt art="skills" />

      <div className="space-y-6">
        <div>
          <h3 className="text-primary font-bold mb-2">Programming Languages & Tools</h3>
          <div className="space-y-2">
            <SkillBar name="Python" percentage={90} />
            <SkillBar name="JavaScript" percentage={85} />
            <SkillBar name="Java" percentage={80} />
            <SkillBar name="C/C++" percentage={75} />
            <SkillBar name="R" percentage={70} />
            <SkillBar name="SQL" percentage={85} />
            <SkillBar name="TypeScript" percentage={80} />
            <SkillBar name="Rust" percentage={65} />
          </div>
        </div>

        <div>
          <h3 className="text-primary font-bold mb-2">Data Science & AI</h3>
          <div className="space-y-2">
            <SkillBar name="pandas" percentage={90} />
            <SkillBar name="NumPy" percentage={85} />
            <SkillBar name="scikit-learn" percentage={80} />
            <SkillBar name="matplotlib" percentage={85} />
            <SkillBar name="seaborn" percentage={80} />
            <SkillBar name="LLMOps" percentage={85} />
            <SkillBar name="Tableau" percentage={75} />
            <SkillBar name="Power BI" percentage={75} />
          </div>
        </div>

        <div>
          <h3 className="text-primary font-bold mb-2">Web Development</h3>
          <div className="space-y-2">
            <SkillBar name="HTML/CSS" percentage={90} />
            <SkillBar name="React" percentage={85} />
            <SkillBar name="Node.js" percentage={80} />
            <SkillBar name="Express.js" percentage={80} />
            <SkillBar name="Next.js" percentage={75} />
            <SkillBar name="Angular.js" percentage={70} />
            <SkillBar name="MongoDB" percentage={80} />
            <SkillBar name="Flask" percentage={75} />
          </div>
        </div>

        <div>
          <h3 className="text-primary font-bold mb-2">DevOps & Tools</h3>
          <div className="space-y-2">
            <SkillBar name="Git" percentage={90} />
            <SkillBar name="GitLab" percentage={85} />
            <SkillBar name="Bitbucket" percentage={80} />
            <SkillBar name="CI/CD" percentage={75} />
            <SkillBar name="Apache Spark" percentage={70} />
            <SkillBar name="Kafka" percentage={65} />
            <SkillBar name="Airflow" percentage={70} />
            <SkillBar name="Docker" percentage={75} />
          </div>
        </div>

        <div>
          <h3 className="text-primary font-bold mb-2">Cloud & Databases</h3>
          <div className="space-y-2">
            <SkillBar name="Google Cloud" percentage={80} />
            <SkillBar name="BigQuery" percentage={75} />
            <SkillBar name="Snowflake" percentage={70} />
            <SkillBar name="PostgreSQL" percentage={80} />
            <SkillBar name="MySQL" percentage={85} />
            <SkillBar name="MongoDB" percentage={80} />
            <SkillBar name="Redis" percentage={70} />
          </div>
        </div>

        <div>
          <h3 className="text-primary font-bold mb-2">Specialty Areas</h3>
          <div className="space-y-2">
            <SkillBar name="Data Analysis" percentage={90} />
            <SkillBar name="Machine Learning" percentage={85} />
            <SkillBar name="Computational Modeling" percentage={80} />
            <SkillBar name="API Development" percentage={85} />
            <SkillBar name="Blockchain Development" percentage={75} />
            <SkillBar name="Space Dynamics" percentage={70} />
          </div>
        </div>
      </div>
    </div>
  )
}

function SkillBar({ name, percentage }: { name: string; percentage: number }) {
  return (
    <div>
      <div className="flex justify-between text-xs mb-1">
        <span>{name}</span>
        <span>{percentage}%</span>
      </div>
      <div className="h-2 bg-muted rounded-full overflow-hidden">
        <div
          className="h-full bg-primary rounded-full"
          style={{ width: `${percentage}%` }}
          role="progressbar"
          aria-valuenow={percentage}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label={`${name} skill level: ${percentage}%`}
        />
      </div>
    </div>
  )
}
