import Link from "next/link";

export default function RegisterCTA() {
  return (
    <section
      id="register"
      className="py-20 px-4"
    >
      <div className="max-w-3xl mx-auto text-center">
        <div className="bg-gradient-to-br from-accent-dark via-accent to-accent-light rounded-3xl p-10 sm:p-14 shadow-xl relative overflow-hidden">
          <div
            className="absolute inset-0 opacity-10"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='0.3' fill-rule='evenodd'%3E%3Cpath d='M20 20c0-5.5-4.5-10-10-10S0 14.5 0 20s4.5 10 10 10 10-4.5 10-10zm20 0c0-5.5-4.5-10-10-10S20 14.5 20 20s4.5 10 10 10 10-4.5 10-10z'/%3E%3C/g%3E%3C/svg%3E")`,
            }}
          />
          <div className="relative">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Ready to Join Us?
            </h2>
            <p className="text-white/85 text-lg mb-8 max-w-lg mx-auto">
              Register now to secure your spot in this exciting event supporting
              great causes in our community.
            </p>
            <Link
              href="/register"
              className="inline-flex items-center justify-center px-8 py-4 bg-gold text-white font-bold rounded-xl text-lg hover:bg-gold-dark transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 animate-pulse-glow"
            >
              Register Now
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
