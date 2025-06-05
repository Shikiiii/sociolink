import Link from 'next/link';
import { FaGithub } from 'react-icons/fa';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative z-10 backdrop-blur-md border-t border-opacity-20" 
      style={{
        backgroundColor: 'transparent',
        borderColor: 'var(--themed-input-border)',
      }}>
      <div className="container mx-auto px-6 py-3">
        <div className="flex items-center justify-between text-xs opacity-60 hover:opacity-100 transition-opacity duration-300">
          {/* Copyright */}
          <div className="text-muted-foreground">
            © {currentYear} SocioLink
          </div>

          {/* Links */}
          <div className="flex items-center space-x-4">
            <Link 
              href="/about" 
              className="text-muted-foreground hover:text-foreground transition-colors duration-200 hover:opacity-100"
            >
              About
            </Link>
            <Link 
              href="/terms" 
              className="text-muted-foreground hover:text-foreground transition-colors duration-200 hover:opacity-100"
            >
              Terms
            </Link>
            <a
              href="https://github.com/Shikiiii/sociolink"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-foreground transition-colors duration-200 hover:opacity-100"
              aria-label="GitHub"
            >
              <FaGithub className="w-3 h-3" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}