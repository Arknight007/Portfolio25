import { DiwaliGreeting } from "@/components/greeting/diwali-greeting"
import { Cosmos } from "@/components/fx/cosmos"
import { Nav } from "@/components/nav"
import { Hero } from "@/components/hero/hero"
import { About } from "@/components/sections/about"
import { Experience } from "@/components/sections/experience"
import { Projects } from "@/components/sections/projects"
import { Skills } from "@/components/sections/skills"
import { Education } from "@/components/sections/education"
import { Contact } from "@/components/sections/contact"

export default function Home() {
  return (
    <>
      <DiwaliGreeting />
      <Cosmos />
      <Nav />
      <main className="relative">
        <Hero />
        <About />
        <Experience />
        <Projects />
        <Skills />
        <Education />
        <Contact />
      </main>
    </>
  )
}
