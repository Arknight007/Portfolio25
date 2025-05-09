import { AsciiArt } from "@/components/ascii-art-component"

export function EducationSection() {
  return (
    <div className="space-y-4">
      <AsciiArt art="education" />

      <div className="space-y-6">
        <div className="p-3 border border-primary/20 rounded bg-primary/5">
          <h3 className="text-primary font-bold">
            SVKM's NMIMS Mukesh Patel School of Technology Management & Engineering
          </h3>
          <p className="text-sm">B.Tech in Computer Science | CGPA: 3.93/4</p>
          <p className="text-xs text-muted-foreground">July 2023 - June 2027 (Expected)</p>
          <div className="mt-2">
            <h4 className="text-sm font-semibold">Relevant Coursework:</h4>
            <ul className="text-xs mt-1 space-y-1 list-disc pl-4">
              <li>Data Structures & Algorithms</li>
              <li>Object-Oriented Programming</li>
              <li>Database Management Systems</li>
              <li>Web Development</li>
              <li>Machine Learning Fundamentals</li>
              <li>Computer Networks</li>
              <li>Operating Systems</li>
            </ul>
          </div>
        </div>

        <div className="p-3 border border-primary/20 rounded bg-primary/5">
          <h3 className="text-primary font-bold">RMG Maheshwari English School</h3>
          <p className="text-sm">Senior Secondary | CGPA: 6.82/10</p>
          <p className="text-xs text-muted-foreground">July 2021 - July 2023</p>
          <div className="mt-2">
            <h4 className="text-sm font-semibold">Achievements:</h4>
            <ul className="text-xs mt-1 space-y-1 list-disc pl-4">
              <li>KVPY-SA Scholar AIR 741 (2021)</li>
              <li>JEE Advanced AIR 12287 (2023)</li>
              <li>JEE Mains 93.9 percentile (2023)</li>
              <li>IAT qualified and ranked 574 (2021-22)</li>
            </ul>
          </div>
        </div>

        <div className="p-3 border border-primary/20 rounded bg-primary/5">
          <h3 className="text-primary font-bold">Delhi Public School Surat</h3>
          <p className="text-sm">Secondary | CGPA: 9.78/10</p>
          <p className="text-xs text-muted-foreground">April 2009 - July 2021</p>
          <div className="mt-2">
            <h4 className="text-sm font-semibold">Achievements:</h4>
            <ul className="text-xs mt-1 space-y-1 list-disc pl-4">
              <li>NTSE Scholar (2020)</li>
              <li>ANCQ HD Excellence & Plaque Award (2018, 2019)</li>
              <li>Participated in various science and mathematics competitions</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
