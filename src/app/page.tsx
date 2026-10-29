import type { Metadata } from "next";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import MitraIndustri from "@/components/MitraIndustri";
import Sambutan from "@/components/Sambutan";
import Berita from "@/components/Berita";
import DividerWave from "@/components/DividerWave";
import FaqSection from "@/components/FaqSection";
import Footer from "@/components/Footer";
import { SITE_NAME, SITE_URL } from "@/lib/site";

// Canonical khusus beranda. Judul dan deskripsi tetap diambil dari layout.tsx
export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

// Tambahkan alamat jalan dan nomor telepon resmi sekolah di sini bila sudah ada datanya
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "HighSchool",
  name: SITE_NAME,
  alternateName: "SMKN 2 Malang",
  url: SITE_URL,
  logo: `${SITE_URL}/images/smkn2logo.png`,
  address: {
    "@type": "PostalAddress",
    addressLocality: "Malang",
    addressRegion: "Jawa Timur",
    addressCountry: "ID",
  },
};

export default function Home() {
  return (
    <main className="bg-slate-950 text-white font-sans antialiased">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
        }}
      />
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