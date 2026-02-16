import { Mail, Phone, MessageSquare } from "lucide-react";

export default function Contact() {
  return (
    <section id="contact" className="py-20 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-14">
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-3">
            Contact Us
          </h2>
          <div className="w-16 h-1 bg-accent mx-auto rounded-full" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <a
            href="mailto:JMCCharities@gmail.com"
            className="group flex flex-col items-center text-center p-6 bg-card-bg rounded-2xl border border-card-border hover:border-accent/30 hover:shadow-lg transition-all duration-300"
          >
            <div className="w-14 h-14 rounded-xl bg-accent/10 flex items-center justify-center mb-4 group-hover:bg-accent/20 transition-colors">
              <Mail size={24} className="text-accent" />
            </div>
            <p className="font-medium text-foreground mb-1">Email</p>
            <p className="text-muted text-sm">JMCCharities@gmail.com</p>
          </a>

          <a
            href="tel:3142059662"
            className="group flex flex-col items-center text-center p-6 bg-card-bg rounded-2xl border border-card-border hover:border-accent/30 hover:shadow-lg transition-all duration-300"
          >
            <div className="w-14 h-14 rounded-xl bg-accent/10 flex items-center justify-center mb-4 group-hover:bg-accent/20 transition-colors">
              <Phone size={24} className="text-accent" />
            </div>
            <p className="font-medium text-foreground mb-1">Call</p>
            <p className="text-muted text-sm">(314) 205-9662</p>
          </a>

          <a
            href="sms:3148055370"
            className="group flex flex-col items-center text-center p-6 bg-card-bg rounded-2xl border border-card-border hover:border-accent/30 hover:shadow-lg transition-all duration-300"
          >
            <div className="w-14 h-14 rounded-xl bg-accent/10 flex items-center justify-center mb-4 group-hover:bg-accent/20 transition-colors">
              <MessageSquare size={24} className="text-accent" />
            </div>
            <p className="font-medium text-foreground mb-1">Text</p>
            <p className="text-muted text-sm">(314) 805-5370</p>
          </a>
        </div>
      </div>
    </section>
  );
}
