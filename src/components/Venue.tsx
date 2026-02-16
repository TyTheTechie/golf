import { MapPin, Phone, Navigation, Clock, TreePine, Utensils } from "lucide-react";

const amenities = [
  { icon: TreePine, label: "18-Hole Public Course" },
  { icon: Navigation, label: "Practice Range" },
  { icon: Utensils, label: "Restaurant & Bar" },
  { icon: Clock, label: "Pro Shop" },
];

export default function Venue() {
  return (
    <section id="venue" className="py-20 px-4 bg-white">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-2">
            The Venue
          </h2>
          <p className="text-muted">
            Join us at one of St. Louis&apos; most beloved courses
          </p>
          <div className="w-16 h-1 bg-accent mx-auto rounded-full mt-3" />
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Info Card */}
          <div className="bg-card-bg border border-card-border rounded-2xl p-8">
            <h3 className="text-2xl font-bold text-foreground mb-1">
              Forest Park Golf Course
            </h3>
            <p className="text-muted mb-6">
              A beautiful 18-hole public course nestled in the heart of historic Forest Park.
            </p>

            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <MapPin size={20} className="text-accent mt-0.5 shrink-0" />
                <div>
                  <p className="font-medium text-foreground">Address</p>
                  <p className="text-sm text-muted">
                    6141 Lagoon Dr, St. Louis, MO 63112
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Phone size={20} className="text-accent mt-0.5 shrink-0" />
                <div>
                  <p className="font-medium text-foreground">Phone</p>
                  <a
                    href="tel:+13143671337"
                    className="text-sm text-accent hover:text-accent-dark transition-colors"
                  >
                    (314) 367-1337
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Navigation size={20} className="text-accent mt-0.5 shrink-0" />
                <div>
                  <p className="font-medium text-foreground">Directions</p>
                  <p className="text-sm text-muted">
                    Located off Skinker Blvd near the intersection with Forest Park Parkway.
                    Easy access from I-64/US-40 and I-170.
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-6 border-t border-card-border">
              <h4 className="text-sm font-semibold text-muted uppercase tracking-wider mb-3">
                Amenities
              </h4>
              <div className="grid grid-cols-2 gap-2">
                {amenities.map((a) => (
                  <div
                    key={a.label}
                    className="flex items-center gap-2 text-sm text-foreground bg-muted-bg px-3 py-2 rounded-lg"
                  >
                    <a.icon size={14} className="text-accent shrink-0" />
                    {a.label}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Map */}
          <div className="bg-card-bg border border-card-border rounded-2xl overflow-hidden">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3117.5!2d-90.286!3d38.637!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x87d8b4e7c3a3f2d5%3A0x1234567890abcdef!2sForest%20Park%20Golf%20Course!5e0!3m2!1sen!2sus!4v1700000000000!5m2!1sen!2sus"
              width="100%"
              height="100%"
              style={{ border: 0, minHeight: "400px" }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Forest Park Golf Course Map"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
