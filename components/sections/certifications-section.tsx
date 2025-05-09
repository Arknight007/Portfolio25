import { AsciiArt } from "@/components/ascii-art-component"
import { Award, Trophy, Flag } from "lucide-react"

export function CertificationsSection() {
  return (
    <div className="space-y-4">
      <AsciiArt art="certifications" />

      <div className="space-y-6">
        <div>
          <h3 className="text-primary font-bold mb-2 flex items-center">
            <Award className="h-4 w-4 mr-2" />
            Certifications
          </h3>
          <ul className="space-y-2 pl-6">
            <li className="flex items-start">
              <span className="text-primary mr-2">•</span>
              <div>
                <p className="font-medium">Data Analysis with Python</p>
                <p className="text-xs text-muted-foreground">IBM | Grade: 97.26%</p>
              </div>
            </li>
            <li className="flex items-start">
              <span className="text-primary mr-2">•</span>
              <div>
                <p className="font-medium">Rocket Propulsion and Space Dynamics</p>
                <p className="text-xs text-muted-foreground">ISRO</p>
              </div>
            </li>
            <li className="flex items-start">
              <span className="text-primary mr-2">•</span>
              <div>
                <p className="font-medium">Data Science</p>
                <p className="text-xs text-muted-foreground">IBM | Grade: 98.64%</p>
              </div>
            </li>
            <li className="flex items-start">
              <span className="text-primary mr-2">•</span>
              <div>
                <p className="font-medium">Deep Learning AI</p>
                <p className="text-xs text-muted-foreground">DeepLearning.AI</p>
              </div>
            </li>
            <li className="flex items-start">
              <span className="text-primary mr-2">•</span>
              <div>
                <p className="font-medium">Networking & Security in Google Cloud</p>
                <p className="text-xs text-muted-foreground">Google Cloud</p>
              </div>
            </li>
            <li className="flex items-start">
              <span className="text-primary mr-2">•</span>
              <div>
                <p className="font-medium">CS50p: Introduction to Programming with Python</p>
                <p className="text-xs text-muted-foreground">Harvard University</p>
              </div>
            </li>
            <li className="flex items-start">
              <span className="text-primary mr-2">•</span>
              <div>
                <p className="font-medium">Foundational Data and AI for ML</p>
                <p className="text-xs text-muted-foreground">Google Cloud</p>
              </div>
            </li>
            <li className="flex items-start">
              <span className="text-primary mr-2">•</span>
              <div>
                <p className="font-medium">APIs Tasks on Google Cloud</p>
                <p className="text-xs text-muted-foreground">Google Cloud</p>
              </div>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="text-primary font-bold mb-2 flex items-center">
            <Trophy className="h-4 w-4 mr-2" />
            Competitions & Achievements
          </h3>
          <ul className="space-y-2 pl-6">
            <li className="flex items-start">
              <span className="text-primary mr-2">•</span>
              <p>KVPY-SA Scholar AIR 741 (2021)</p>
            </li>
            <li className="flex items-start">
              <span className="text-primary mr-2">•</span>
              <p>NTSE Scholar (2020)</p>
            </li>
            <li className="flex items-start">
              <span className="text-primary mr-2">•</span>
              <p>JEE Advanced AIR 12287 (2023)</p>
            </li>
            <li className="flex items-start">
              <span className="text-primary mr-2">•</span>
              <p>JEE Mains 93.9 percentile (2023)</p>
            </li>
            <li className="flex items-start">
              <span className="text-primary mr-2">•</span>
              <p>IAT qualified and ranked 574 (2021-22)</p>
            </li>
            <li className="flex items-start">
              <span className="text-primary mr-2">•</span>
              <p>ANCQ HD Excellence & Plaque Award (2018, 2019)</p>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="text-primary font-bold mb-2 flex items-center">
            <Flag className="h-4 w-4 mr-2" />
            Technical Activities
          </h3>
          <ul className="space-y-2 pl-6">
            <li className="flex items-start">
              <span className="text-primary mr-2">•</span>
              <p>Coding Club Team Lead (2024-25)</p>
            </li>
            <li className="flex items-start">
              <span className="text-primary mr-2">•</span>
              <p>DSA Fellow at NextLeap</p>
            </li>
            <li className="flex items-start">
              <span className="text-primary mr-2">•</span>
              <p>Technical Team Member at AMBIORA TechFest</p>
            </li>
            <li className="flex items-start">
              <span className="text-primary mr-2">•</span>
              <p>Active contributor to open-source projects</p>
            </li>
          </ul>
        </div>
      </div>
    </div>
  )
}
