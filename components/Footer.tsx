export function Footer() {
  return (
    <footer className="py-8 border-t border-outline-variant/40">
      <div className="max-w-6xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-secondary font-mono">
        <div>© 2026 ubim.dev. Dibangun dengan Next.js, animasi Framer Motion, render Three.js</div>
        <div className="flex items-center gap-4">
          <a href="mailto:ubimdonk@gmail.com" className="hover:text-foreground transition-colors">ubimdonk@gmail.com</a>
        </div>
      </div>
    </footer>
  );
}
