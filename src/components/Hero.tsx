import CountdownTimer from "./CountdownTimer";

export default function Hero() {
  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
    >
      {/* Background with gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-accent-dark via-accent to-accent-light" />
      <div
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.15'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
      />

      <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
        <div className="animate-fade-in-up">
          <div className="inline-block mb-4 px-4 py-1.5 bg-white/15 backdrop-blur-sm rounded-full border border-white/25">
            <span className="text-white/90 text-sm font-medium tracking-wide">
              &#9971; September 21, 2025
            </span>
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-7xl font-extrabold text-white leading-tight mb-4">
            6th Annual JMC Charities{" "}
            <span className="text-gold">Golf Event</span>
          </h1>
          <p className="text-xl sm:text-2xl text-white/90 font-light italic mb-10">
            &ldquo;Fore the Kids!&rdquo;
          </p>
        </div>

        <div className="animate-fade-in-up stagger-2 mb-12">
          <CountdownTimer />
        </div>

        <div className="animate-fade-in-up stagger-3 flex flex-col sm:flex-row gap-4 justify-center">
          <a
            href="#register"
            className="inline-flex items-center justify-center px-8 py-3.5 bg-gold text-white font-semibold rounded-xl text-lg hover:bg-gold-dark transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5"
          >
            Register Now
          </a>
          <a
            href="#details"
            className="inline-flex items-center justify-center px-8 py-3.5 bg-white/15 backdrop-blur-sm text-white font-semibold rounded-xl text-lg border border-white/30 hover:bg-white/25 transition-all"
          >
            View Details
          </a>
        </div>
      </div>

      {/* Bottom wave */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M0 120L60 110C120 100 240 80 360 70C480 60 600 60 720 65C840 70 960 80 1080 85C1200 90 1320 90 1380 90L1440 90V120H0Z"
            fill="var(--background)"
          />
        </svg>
      </div>
    </section>
  );
}
