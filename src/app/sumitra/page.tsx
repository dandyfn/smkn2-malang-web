import type { Metadata } from "next";
import SumitraHeader from "@/components/sumitra/SumitraHeader";
import SumitraPaket from "@/components/sumitra/SumitraPaket";
import SumitraLayanan from "@/components/sumitra/SumitraLayanan";
import SumitraTestimoni from "@/components/sumitra/SumitraTestimoni";
import SumitraFaq from "@/components/sumitra/SumitraFaq";
import {
  SumitraHero, SumitraTentang, SumitraKeunggulan, SumitraGaleri, SumitraMitra, SumitraFooter,
} from "@/components/sumitra/SumitraSections";
import { getSumitraData } from "@/lib/sumitra";
import { SUMITRA } from "@/data/sumitra";
import { SITE_URL } from "@/lib/site";

// Perubahan dari panel admin tampil paling lambat 60 detik setelah disimpan
export const revalidate = 60;

export const metadata: Metadata = {
  title: { absolute: "Sumitra Kelana Wisata | Travel Agent SMKN 2 Malang" },
  description:
    "Sumitra Kelana Wisata, travel agent unit produksi SMK Negeri 2 Malang sejak 2012. Open trip & private trip Bromo, Tumpak Sewu, tur internasional, pemandu wisata Mandarin & Jepang, rent car, dan shuttle bandara.",
  alternates: { canonical: "/sumitra" },
  openGraph: {
    title: "Sumitra Kelana Wisata",
    description: "Having fun trip with us. Travel agent unit produksi SMK Negeri 2 Malang.",
  },
};

export default async function SumitraPage() {
  const data = await getSumitraData();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "TravelAgency",
    name: SUMITRA.nama,
    slogan: SUMITRA.slogan,
    url: `${SITE_URL}/sumitra`,
    foundingDate: String(SUMITRA.berdiri),
    address: {
      "@type": "PostalAddress",
      streetAddress: "Edotel SMKN 2 Malang, Jl. Veteran No. 17, Ketawanggede, Kec. Lowokwaru",
      addressLocality: "Kota Malang",
      addressRegion: "Jawa Timur",
      postalCode: "65145",
      addressCountry: "ID",
    },
    parentOrganization: { "@type": "HighSchool", name: "SMK Negeri 2 Malang", url: SITE_URL },
  };

  return (
    <main className="scroll-smooth">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
      />
      <SumitraHeader nomorWa={data.pengaturan.nomorWa} logoUrl={data.pengaturan.logoUrl} />
      <SumitraHero pengaturan={data.pengaturan} />
      <SumitraTentang pengaturan={data.pengaturan} />
      <SumitraPaket paket={data.paket} />
      <SumitraLayanan layanan={data.layanan} pengaturan={data.pengaturan} />
      <SumitraKeunggulan />
      <SumitraGaleri galeri={data.galeri} />
      <SumitraTestimoni testimoni={data.testimoni} daftarPerjalanan={data.paket.map((p) => p.nama)} />
      <SumitraMitra mitra={data.mitra} />
      <SumitraFaq items={data.faq} />
      <SumitraFooter pengaturan={data.pengaturan} />
    </main>
  );
}
