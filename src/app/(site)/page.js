import Hero from "@/components/Hero";
import Services from "@/components/Services";
import WhyUs from "@/components/WhyUs";
import HomeBlogSection from "@/components/HomeBlogSection";
import ClientMarquee from "@/components/ClientMarquee";

export default function Home() {
  return (
    <main className="min-h-screen font-sans text-stone-900 bg-white">
      <Hero />
      <Services />
      <WhyUs />
      <ClientMarquee />
      {/* TAMBAHKAN DI SINI (Sebelum Footer) */}
      <HomeBlogSection />
      
    </main>
  );
}