import Header from "@/components/Header";
import Hero from "@/components/Hero";
import About from "@/components/About";
import EventDetails from "@/components/EventDetails";
import Challenges from "@/components/Challenges";
import WhatsIncluded from "@/components/WhatsIncluded";
import Sponsors from "@/components/Sponsors";
import Charities from "@/components/Charities";
import Venue from "@/components/Venue";
import RegisterCTA from "@/components/RegisterCTA";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <About />
        <EventDetails />
        <Challenges />
        <WhatsIncluded />
        <RegisterCTA />
        <Sponsors />
        <Charities />
        <Venue />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
