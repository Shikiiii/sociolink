import Link from 'next/link'
import { FaGithub, FaDiscord } from 'react-icons/fa'

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="relative z-10 border-t border-border bg-background">
      <div className="p-4 flex justify-between items-center relative z-10">
        
        {/* Left side - Logo and Copyright */}
        <div className="flex items-center space-x-2">
          <div className="text-lg font-bold">
            sociolink
          </div>
          <div className="text-xs text-muted-foreground">
            © {currentYear}
          </div>
        </div>

        {/* Right side - Links and Social */}
        <div className="flex items-center space-x-3">
          <Link 
            href="/about" 
            className="text-xs text-muted-foreground hover:text-foreground transition-colors relative group"
          >
            About
            <span className="absolute bottom-0 left-0 w-0 h-px bg-foreground transition-all duration-300 group-hover:w-full"></span>
          </Link>
          <Link 
            href="/terms" 
            className="text-xs text-muted-foreground hover:text-foreground transition-colors relative group"
          >
            Terms
            <span className="absolute bottom-0 left-0 w-0 h-px bg-foreground transition-all duration-300 group-hover:w-full"></span>
          </Link>
          <Link 
            href="/privacy" 
            className="text-xs text-muted-foreground hover:text-foreground transition-colors relative group"
          >
            Privacy
            <span className="absolute bottom-0 left-0 w-0 h-px bg-foreground transition-all duration-300 group-hover:w-full"></span>
          </Link>
          <a
            href="https://github.com/Shikiiii/sociolink"
            target="_blank"
            rel="noopener noreferrer"
            className="text-muted-foreground hover:text-foreground transition-colors relative group p-1"
            aria-label="GitHub"
          >
            <FaGithub className="w-3.5 h-3.5" />
            <span className="absolute bottom-0 left-1/2 w-0 h-px bg-foreground transition-all duration-300 group-hover:w-full group-hover:left-0"></span>
          </a>
          <a
            href="https://discord.gg/anikuro"
            target="_blank"
            rel="noopener noreferrer"
            className="text-muted-foreground hover:text-foreground transition-colors relative group p-1"
            aria-label="Discord"
          >
            <FaDiscord className="w-3.5 h-3.5" />
            <span className="absolute bottom-0 left-1/2 w-0 h-px bg-foreground transition-all duration-300 group-hover:w-full group-hover:left-0"></span>
          </a>
        </div>
      </div>
    </footer>
  )
}