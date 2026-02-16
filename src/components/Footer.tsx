export default function Footer() {
  return (
    <footer className="bg-accent-dark text-white/80 py-10 px-4">
      <div className="max-w-6xl mx-auto text-center">
        <div className="flex items-center justify-center gap-2 mb-4">
          <span className="text-xl">&#9971;</span>
          <span className="text-white font-bold text-lg">JMC Charities</span>
        </div>
        <p className="text-sm text-white/60 mb-4">
          6th Annual JMC Charities Golf Event &mdash; &ldquo;Fore the
          Kids!&rdquo;
        </p>
        <div className="flex justify-center gap-6 text-sm text-white/50">
          <a href="#home" className="hover:text-white transition-colors">
            Home
          </a>
          <a href="#details" className="hover:text-white transition-colors">
            Details
          </a>
          <a href="#challenges" className="hover:text-white transition-colors">
            Challenges
          </a>
          <a href="#charities" className="hover:text-white transition-colors">
            Sponsors
          </a>
          <a href="#contact" className="hover:text-white transition-colors">
            Contact
          </a>
        </div>
        <div className="mt-6 pt-6 border-t border-white/10 text-xs text-white/40">
          &copy; {new Date().getFullYear()} JMC Charities. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
