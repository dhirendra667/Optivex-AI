import {Navbar} from "@/components/landing/Navbar"
import Hero from "@/components/landing/Hero"
import Footer from "@/components/landing/Footer"
import { Features } from "@/components/landing/Features";
import { HowItWorks } from "@/components/landing/HowItWorks";
import { AuditSection } from "@/components/audit/AuditSection";

export default function Home() {
  return (
    <main>
      <Navbar />
      <Hero />
      <Features/>
      <HowItWorks/>
      <AuditSection/>
      <Footer/>
    </main>
  );
}
