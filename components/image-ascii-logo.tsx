"use client"

export function ImageAsciiLogo() {
  return (
    <div className="bg-black p-1 font-mono text-white">
      <pre className="whitespace-pre-wrap overflow-x-auto text-xs sm:text-sm md:text-base">
        <span className="text-[#00FF00]">root@kali:~</span> "SRIKAR MOLAHALLI"<br />
          $ echo SRIKAR<br /><br />

        <span className="text-[#00FF00]">root@kali:~</span><br />
          $ whoami srikar@astro~not<br /><br />

        <span className="text-[#00FF00]">root@kali:~</span><br />
          $ pwd /home/srikar/portfolio<br /><br />

        <span className="text-[#00FF00]">root@kali:~</span><br />
          $ ls about  education  skills  experience  projects  certifications  contact<br /><br />
      </pre>
    </div>
  )
}
