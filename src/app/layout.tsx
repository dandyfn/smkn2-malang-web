import type { Metadata, Viewport } from "next";
import "./globals.css";
import { SITE_NAME, SITE_URL } from "@/lib/site";

const DESCRIPTION =
  "Website resmi SMK Negeri 2 Malang. Informasi konsentrasi keahlian, berita, prestasi, ekstrakurikuler, fasilitas, dan kontak sekolah di Kota Malang.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${SITE_NAME} | Website Resmi`,
    template: "%s | SMKN 2 Malang",
  },
  description: DESCRIPTION,
  applicationName: "SMKN 2 Malang",
  openGraph: {
    type: "website",
    locale: "id_ID",
    siteName: SITE_NAME,
    title: `${SITE_NAME} | Website Resmi`,
    description: DESCRIPTION,
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE_NAME} | Website Resmi`,
    description: DESCRIPTION,
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#0f172a",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <body className="antialiased bg-slate-950 text-slate-100">
        {children}
      </body>
    </html>
  );
}