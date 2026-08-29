import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "SMK Negeri 2 Malang",
  description: "Website Resmi SMKN 2 Malang",
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