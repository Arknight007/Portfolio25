# ASCII Terminal Portfolio

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Next.js](https://img.shields.io/badge/Next.js-14.1.0-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.3.0-38B2AC)

A retro-inspired, terminal-based portfolio website with ASCII art and a Linux terminal interface. This interactive portfolio simulates a command-line experience while showcasing professional information in a unique and engaging way.

## 📷 Demo

![ASCII Portfolio Demo](https://placeholder.svg?height=400&width=800)

## ✨ Features

| Feature | Description |
|---------|-------------|
| 🖥️ Terminal Interface | Fully interactive command-line experience with command history |
| 🎨 ASCII Art | Custom ASCII art for section headers and portrait |
| 📱 Responsive Design | Fully responsive layout that works on mobile, tablet, and desktop |
| 🌙 Dark Mode | Terminal-inspired dark theme for optimal viewing |
| 📺 CRT Effect | Toggle CRT screen effect for retro aesthetics |
| ⌨️ Command Navigation | Navigate through sections using terminal commands |
| 🔄 Boot Sequence | Simulated boot sequence animation on initial load |
| 📊 Skills Visualization | Visual representation of skills with progress bars |
| 📝 Project Diagrams | ASCII diagrams showing project architecture |

## 🛠️ Technologies Used

| Category | Technologies |
|----------|-------------|
| **Frontend Framework** | Next.js 14, React 18 |
| **Styling** | Tailwind CSS, CSS Modules |
| **UI Components** | shadcn/ui, Radix UI |
| **Icons** | Lucide React |
| **Typography** | JetBrains Mono, Inter |
| **State Management** | React Hooks |
| **Deployment** | Vercel |
| **Development Tools** | TypeScript, ESLint |

## 🏗️ Project Architecture

The project follows a component-based architecture with Next.js App Router:

\`\`\`
                                +-------------------+
                                |    app/page.tsx   |
                                | (Main Entry Point)|
                                +--------+---------+
                                         |
                                         v
                  +---------------------+----------------------+
                  |                     |                      |
         +--------v---------+  +--------v---------+  +--------v---------+
         |  BootSequence    |  |    Terminal      |  |    CRTToggle     |
         | (Initial Loading) |  | (Main Interface) |  | (Effect Toggle)  |
         +------------------+   +--------+---------+  +------------------+
                                         |
                                         v
                  +---------------------+----------------------+
                  |                     |                      |
         +--------v---------+  +--------v---------+  +--------v---------+
         |  Section Components|  |  ASCII Art      |  |  UI Components   |
         | (Content Display)  |  | (Visual Elements)|  | (Buttons, Cards) |
         +------------------+   +------------------+  +------------------+
\`\`\`

### Core Components

1. **Terminal**: The main interface component that processes user commands and displays appropriate sections
2. **Boot Sequence**: Simulates a system boot-up with animated text
3. **ASCII Art Components**: Renders ASCII art for the portfolio sections and portrait
4. **Section Components**: Individual content sections (About, Skills, Projects, etc.)
5. **UI Components**: Reusable UI elements like buttons, cards, and toggles

### Data Flow

1. User enters commands in the Terminal component
2. Commands are processed and matched to corresponding sections
3. Appropriate section components are rendered with their content
4. User can navigate between sections using commands or navigation buttons

## 📥 Installation

Follow these steps to set up the project locally:

\`\`\`bash
# Clone the repository
git clone https://github.com/yourusername/ascii-portfolio.git

# Navigate to the project directory
cd ascii-portfolio

# Install dependencies
npm install

# Start the development server
npm run dev
\`\`\`

### Prerequisites

- Node.js 18.x or higher
- npm or yarn

## 🚀 Usage

Once the development server is running, open your browser and navigate to `http://localhost:3000` to view the portfolio.

### Available Commands

The terminal interface accepts the following commands:

\`\`\`
help        - Show available commands
about       - View personal information
education   - View educational background
skills      - View technical skills
experience  - View work experience
projects    - View projects
certifications - View certifications and achievements
contact     - View contact information
clear       - Clear the terminal
ls          - List available sections
whoami      - Display user information
date        - Display current date and time
\`\`\`

You can also use the navigation buttons at the bottom of the terminal to quickly access different sections.

### Customization

To customize the portfolio with your own information:

1. Update personal details in the section components under `components/sections/`
2. Replace the ASCII art in `components/ascii-art-component.tsx` with your own designs
3. Modify the terminal prompt in `components/terminal.tsx` to display your name/handle
4. Update the project links in `components/sections/projects-section.tsx`

## 👥 Contributing

Contributions are welcome! Please follow these steps to contribute:

1. Fork the repository
2. Create a new branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Commit your changes (`git commit -m 'Add some amazing feature'`)
5. Push to the branch (`git push origin feature/amazing-feature`)
6. Open a Pull Request

### Coding Standards

- Follow the existing code style and formatting
- Write meaningful commit messages
- Update documentation for any new features
- Add comments for complex logic
- Ensure responsive design is maintained
- Test on multiple browsers and devices

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📞 Contact

Srikar Molahalli - [srikar.molahalli@gmail.com](mailto:srikar.molahalli@gmail.com)

Project Link: [https://github.com/yourusername/ascii-portfolio](https://github.com/yourusername/ascii-portfolio)

---

<p align="center">Made with ❤️ and ASCII art</p>
