import type { Metadata } from "next";
import KadoeaHeader from "@/components/kadoea/KadoeaHeader";
import KadoeaFaq from "@/components/kadoea/KadoeaFaq";
import KadoeaStack from "@/components/kadoea/KadoeaStack";
import KadoeaFasilitasSlider from "@/components/kadoea/KadoeaFasilitasSlider";
import {
  KadoeaHero, KadoeaTentang, KadoeaPaket, KadoeaUlasan, KadoeaFooter,
} from "@/components/kadoea/KadoeaSections";
import { KADOEA_KONTAK } from "@/data/kadoea";
import { SITE_URL } from "@/lib/site";
import { getKadoeaData } from "@/lib/kadoea";

// Data dari panel admin diperbarui di halaman paling lambat 60 detik setelah disimpan
export const revalidate = 60;

export const metadata: Metadata = {
  // absolute: judul tidak ditambah akhiran "| SMKN 2 Malang" dari layout
  title: { absolute: "KADOEA Senior Living | Hotel Khusus Lansia di Malang" },
  description:
    "KADOEA Senior Living, hotel khusus lansia milik SMK Negeri 2 Malang. Layanan seperti hotel dengan pendampingan caregiver di Jl. Veteran No. 17, Malang.",
  alternates: { canonical: "/kadoea" },
  openGraph: {
    title: "KADOEA Senior Living",
    description: "Hotel khusus lansia dengan pendampingan caregiver di Kota Malang.",
    images: ["/images/pht.jpg"],
  },
};

// Data terstruktur agar Google mengenali KADOEA sebagai usaha lokal
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "LodgingBusiness",
  name: KADOEA_KONTAK.nama,
  url: `${SITE_URL}/kadoea`,
  telephone: "+62341551504",
  address: {
    "@type": "PostalAddress",
    streetAddress: "Jl. Veteran No.17, Ketawanggede, Kec. Lowokwaru",
    addressLocality: "Kota Malang",
    addressRegion: "Jawa Timur",
    postalCode: "65145",
    addressCountry: "ID",
  },
  parentOrganization: { "@type": "HighSchool", name: "SMK Negeri 2 Malang", url: SITE_URL },
};

export default async function KadoeaPage() {
  const { paket, faq, ulasan } = await getKadoeaData();

  return (
    <main className="bg-slate-950 text-white font-sans antialiased scroll-smooth">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
      />
      <KadoeaHeader />
      <KadoeaHero />
      {/* Tentang terkunci di atas, lalu "ditelan" oleh Paket yang naik menutupinya */}
      <KadoeaStack atas={<KadoeaTentang />} bawah={<KadoeaPaket paket={paket} />} />
      <KadoeaFasilitasSlider />
      <KadoeaFaq items={faq} />
      <KadoeaUlasan ulasan={ulasan} />
      <KadoeaFooter />
    </main>
  );
}
