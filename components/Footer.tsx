export function Footer() {
  return (
    <footer className="py-8 border-t border-outline-variant/40">
      <div className="max-w-6xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-secondary font-mono">
        <div>© 2026 ubim.dev — Built with Next.js, animated with Framer Motion, rendered in Three.js</div>
        <div className="flex items-center gap-4">
          <a href="mailto:ubim@systems.dev" className="hover:text-foreground transition-colors">ubim@systems.dev</a>
        </div>
      </div>
    </footer>
  );
}
