"use client";

import { useState } from "react";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Trophy, Calendar, Search, ArrowRight, Tag } from "lucide-react";

export const DATA_PRESTASI = [
  {
    id: "juara-1-lks-nasional-tkj-2025",
    judul: "Juara 1 Lomba Kompetensi Siswa (LKS) Tingkat Nasional Bidang IT Network Cabling",
    kategori: "Nasional",
    tanggal: "15 Oktober 2025",
    thumbnail: "/images/prestasi/lks-tkj.jpg",
    ringkasan: "Siswa SMKN 2 Malang berhasil meraih medali emas pada ajang LKS Nasional setelah menyisihkan 34 kontingen provinsi se-Indonesia.",
    banner: "/images/prestasi/lks-tkj-banner.jpg",
    deskripsiLengkap: `Prestasi membanggakan kembali diukir oleh civitas akademika SMK Negeri 2 Malang. Ahmad Rizky, siswa kelas XII Konsentrasi Keahlian Teknik Komputer dan Jaringan (TKJ), berhasil menyabet Juara 1 (Medali Emas) dalam ajang Lomba Kompetensi Siswa (LKS) Tingkat Nasional XXXIII tahun 2025.

Lomba yang berlangsung selama 4 hari di Jakarta Convention Center ini menguji ketangkasan, presisi, serta kecepatan dalam konfigurasi jaringan kabel serat optik dan administrasi server. Pembimbingan intensif selama 6 bulan oleh para guru kejuruan dan mitra industri terbukti membuahkan hasil maksimal.

Kepala SMKN 2 Malang menyampaikan apresiasi setinggi-tingginya atas dedikasi dan kerja keras seluruh tim pendamping serta doa dari keluarga besar sekolah.`,
    galeriFoto: [
      "/images/prestasi/lks-1.jpg",
      "/images/prestasi/lks-2.jpg",
      "/images/prestasi/lks-3.jpg",
    ],
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ"
  },
  {
    id: "juara-2-kuliner-provinsi-2025",
    judul: "Medali Perak Festival Kuliner Nusantara Tingkat Jawa Timur",
    kategori: "Provinsi",
    tanggal: "28 Agustus 2025",
    thumbnail: "/images/prestasi/kuliner-jatim.jpg",
    ringkasan: "Tim Konsentrasi Keahlian Kuliner menciptakan inovasi hidangan tradisional fusion berstandar internasional.",
    banner: "/images/prestasi/kuliner-banner.jpg",
    deskripsiLengkap: `Siswa jurusan Kuliner SMKN 2 Malang berhasil membawa pulang penghargaan Juara 2 dalam Festival Kuliner Nusantara tingkat Provinsi Jawa Timur. Dengan mengusung resep inovasi olahan tempe khas Malang yang disajikan dalam teknik fine dining, juri terkesan akan cita rasa dan estetika penyajian.`,
    galeriFoto: [
      "/images/prestasi/kuliner-1.jpg",
      "/images/prestasi/kuliner-2.jpg",
    ],
    videoUrl: null
  },
  {
    id: "juara-1-inovasi-pelayanan-sosial-2025",
    judul: "Juara 1 Ajang Inovasi Layanan Sosial & Keperawatan Malang Raya",
    kategori: "Kota",
    tanggal: "12 Mei 2025",
    thumbnail: "/images/prestasi/sosial-malang.jpg",
    ringkasan: "Program pendampingan lansia berbasis komunitas meraih penghargaan terbaik dalam ajang Inovasi Sosial 2025.",
    banner: "/images/prestasi/sosial-banner.jpg",
    deskripsiLengkap: `Tim Pekerjaan Sosial dan Layanan Keperawatan SMKN 2 Malang berhasil menyabet penghargaan utama atas proyek bakti sosial terpadu bagi warga usia lanjut di wilayah Malang Raya. Proyek ini memadukan pemeriksaan kesehatan rutin dan aktivitas rekreasi interaktif.`,
    galeriFoto: [
      "/images/prestasi/sosial-1.jpg"
    ],
    videoUrl: null
  }
];

export default function PrestasiPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterKategori, setFilterKategori] = useState("Semua");

  const filteredData = DATA_PRESTASI.filter((item) => {
    const matchSearch = item.judul.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        item.ringkasan.toLowerCase().includes(searchTerm.toLowerCase());
    const matchKategori = filterKategori === "Semua" || item.kategori === filterKategori;
    return matchSearch && matchKategori;
  });

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800 relative overflow-hidden">
      
      {/* CORAK GAMBAR 2D BAKAT & PRESTASI (SVG DOODLE PATTERN) */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div 
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='260' height='260' viewBox='0 0 260 260' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' stroke='%23f59e0b' stroke-width='2.2' stroke-linecap='round' stroke-linejoin='round'%3E%3C!-- 1. PIALA JUARA KELAS DENGAN BINTANG --%3E%3Cpath d='M20 20 h50 v25 a25 25 0 0 1 -50 0 z' fill='%23f59e0b' fill-opacity='0.15' /%3E%3Cpath d='M12 20 h8 M70 20 h8 M12 20 a12 12 0 0 0 12 12 M78 20 a12 12 0 0 1 -12 12 M45 45 v16 M30 61 h30 M22 69 h46' /%3E%3Cpath d='M45 27 l2 4 h4 l-3 3 l1 4 l-4 -2 l-4 2 l1 -4 l-3 -3 h4 z' fill='%23d97706' stroke='none' /%3E%3C!-- 2. BOLA SEPAK --%3E%3Ccircle cx='195' cy='45' r='20' /%3E%3Cpolygon points='195,33 204,40 200,51 190,51 186,40' fill='%23f59e0b' fill-opacity='0.3' /%3E%3Cpath d='M195 33 L195 25 M204 40 L212 36 M200 51 L206 60 M190 51 L184 60 M186 40 L178 36' /%3E%3C!-- 3. MEDALI PENGHARGAAN --%3E%3Ccircle cx='45' cy='185' r='18' fill='%23f59e0b' fill-opacity='0.2' /%3E%3Cpath d='M32 145 L41 168 M58 145 L49 168' /%3E%3Cpath d='M45 176 L48 182 L55 183 L50 188 L51 195 L45 191 L39 195 L40 188 L35 183 L42 182 Z' fill='%23f59e0b' stroke='none' /%3E%3C!-- 4. BOLA BASKET --%3E%3Ccircle cx='190' cy='190' r='20' /%3E%3Cpath d='M170 190 h40 M190 170 v40 M175 176 a20 20 0 0 1 0 28 M205 176 a20 20 0 0 0 0 28' /%3E%3C!-- 5. TOPENG MALANGAN / KESENIAN --%3E%3Cpath d='M115 110 c0-15 30-15 30 0 c0 20 -15 32 -15 32 s-15-12 -15-32 z' fill='%23f59e0b' fill-opacity='0.25' /%3E%3Ccircle cx='123' cy='105' r='2.5' fill='%23d97706' /%3E%3Ccircle cx='137' cy='105' r='2.5' fill='%23d97706' /%3E%3Cpath d='M123 124 q7 6 14 0' /%3E%3C!-- 6. PALET LUKIS & KUAS --%3E%3Cpath d='M110 30 c15-10 35 0 30 20 c-3 12 -15 15 -20 10 c-5-5 -10 5 -20 0 c-8-4 -5-20 10-30 z' /%3E%3Ccircle cx='120' cy='28' r='2' fill='%23f59e0b' /%3E%3Ccircle cx='130' cy='32' r='2' fill='%23f59e0b' /%3E%3Cline x1='132' y1='20' x2='150' y2='4' stroke-width='3' /%3E%3C!-- 7. GUITAR / MUSIK --%3E%3Cpath d='M30 105 a8 8 0 0 1 12 10 a12 12 0 0 1 -6 14 a12 12 0 0 1 -12 -6 a8 8 0 0 1 6 -18 z' /%3E%3Cline x1='38' y1='108' x2='60' y2='86' stroke-width='3' /%3E%3C!-- 8. BUKU & KACA PEMBESAR --%3E%3Cpath d='M190 100 h35 v24 h-35 z M195 95 h25 v5 h-25 z' /%3E%3Ccircle cx='235' cy='135' r='8' /%3E%3Cline x1='241' y1='141' x2='250' y2='150' stroke-width='3' /%3E%3C/g%3E%3C/svg%3E")`,
            backgroundSize: "260px 260px"
          }}
        />
      </div>

      <Header />

      <main className="flex-1 py-12 px-4 sm:px-8 max-w-7xl mx-auto w-full space-y-12 relative z-10">
        
        {/* HEADER SECTION */}
        <section className="text-center max-w-3xl mx-auto space-y-4">
          <span className="text-xs font-black text-amber-900 uppercase tracking-widest bg-amber-400/30 px-4 py-1.5 rounded-full border border-amber-400 shadow-xs inline-block">
            PENCAPAIAN & PROSES
          </span>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900">
            Prestasi Siswa SMKN 2 Malang
          </h1>
          <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
            Bukti nyata dedikasi, kerja keras, dan keunggulan kompetensi para peserta didik serta pembimbing di berbagai ajang kompetisi lokal, regional, hingga nasional.
          </p>
        </section>

        {/* SEARCH & FILTER */}
        <section className="flex flex-col sm:flex-row gap-4 justify-between items-center bg-white/95 backdrop-blur-md p-4 rounded-2xl border border-slate-200 shadow-xs">
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Cari prestasi..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-amber-500 focus:bg-white transition"
            />
          </div>

          <div className="flex gap-2 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
            {["Semua", "Nasional", "Provinsi", "Kota"].map((kat) => (
              <button
                key={kat}
                onClick={() => setFilterKategori(kat)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition shrink-0 ${
                  filterKategori === kat
                    ? "bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                {kat}
              </button>
            ))}
          </div>
        </section>

        {/* GRID CARD PRESTASI */}
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredData.map((item) => (
            <Link
              key={item.id}
              href={`/prestasi/${item.id}`}
              className="group bg-white/95 backdrop-blur-xs border border-slate-200 rounded-3xl overflow-hidden shadow-xs hover:shadow-xl hover:-translate-y-1 hover:border-amber-400 transition-all duration-300 flex flex-col"
            >
              {/* Gambar Thumbnail */}
              <div className="relative h-52 bg-slate-100 overflow-hidden">
                <img
                  src={item.thumbnail}
                  alt={item.judul}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  onError={(e) => {
                    (e.target as HTMLElement).style.display = 'none';
                  }}
                />
                <div className="absolute top-4 left-4 bg-amber-500 text-slate-950 text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-full shadow-md">
                  {item.kategori}
                </div>
              </div>

              {/* Detail Konten */}
              <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center gap-1.5 text-xs text-slate-500">
                    <Calendar className="w-3.5 h-3.5 text-amber-600" />
                    <span>{item.tanggal}</span>
                  </div>
                  <h3 className="font-bold text-slate-900 text-lg group-hover:text-amber-600 transition-colors line-clamp-2">
                    {item.judul}
                  </h3>
                  <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">
                    {item.ringkasan}
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-amber-600 group-hover:text-amber-700">
                  <span>Lihat Selengkapnya</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </Link>
          ))}
        </section>

      </main>

      <Footer />
    </div>
  );
}