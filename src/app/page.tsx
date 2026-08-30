import Header from "@/components/Header";
import Hero from "@/components/Hero";
import MitraIndustri from "@/components/MitraIndustri";
import Sambutan from "@/components/Sambutan";
import Berita from "@/components/Berita";
import DividerWave from "@/components/DividerWave";
import FaqSection from "@/components/FaqSection";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main className="bg-slate-950 text-white font-sans antialiased">
      <Header />
      <Hero />
      <MitraIndustri />
      <Sambutan />
      <Berita />
      <DividerWave />
      {/* Testimoni SUDAH ADA di dalam FaqSection, jadi cukup panggil FaqSection saja */}
      <FaqSection />
      <Footer />
    </main>
  );
}