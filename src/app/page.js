import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Services from "@/components/Services";
import WhyUs from "@/components/WhyUs";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main className="min-h-screen font-sans text-slate-900 bg-white">
      <Hero />
      <Services />
      <WhyUs />
    </main>
  );
}