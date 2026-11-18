// Section statis halaman /sumitra (server component).
import Image from "next/image";
import Link from "next/link";
import { Camera, MapPin, Clock, AtSign, Users } from "lucide-react";
import { SUMITRA, tautanWa, type Pengaturan, type GaleriItem, type Mitra } from "@/data/sumitra";
import { CorakTitik } from "./Corak";
import { IkonWa } from "./SumitraHeader";

export function JudulKecil({ children, gelap = false }: { children: React.ReactNode; gelap?: boolean }) {
  return (
    <p className={`text-[13px] font-extrabold tracking-[0.08em] uppercase ${gelap ? "text-amber-400" : "text-teal-700"}`}>
      {children}
    </p>
  );
}

/* ---------------- HERO ---------------- */
export function SumitraHero({ pengaturan }: { pengaturan: Pengaturan }) {
  const wa = tautanWa(pengaturan.nomorWa);
  return (
    <section id="beranda" className="relative min-h-[600px] flex items-center px-4 sm:px-6 py-20 sm:py-24 bg-slate-800 overflow-hidden">
      <Image
        src={pengaturan.heroFotoUrl || SUMITRA.heroBawaan}
        alt="Pemandangan Gunung Bromo"
        fill
        priority
        sizes="100vw"
        className="object-cover"
      />
      <div className="absolute inset-0 bg-slate-950/65 sm:bg-transparent sm:bg-gradient-to-r sm:from-slate-950/85 sm:via-slate-950/55 sm:to-slate-950/20" />
      <div className="relative max-w-[1200px] mx-auto w-full">
        <p className="inline-block bg-amber-400 text-slate-900 text-xs font-extrabold tracking-[0.08em] px-3.5 py-1.5 rounded-full">
          TRAVEL AGENT SEKOLAH SEJAK {SUMITRA.berdiri}
        </p>
        <h1 className="mt-5 mb-4 text-[44px] leading-[1.05] sm:text-[64px] font-extrabold text-white max-w-[760px]">
          Having fun trip <span className="text-amber-400">with us</span>
        </h1>
        <p className="text-lg sm:text-[19px] leading-relaxed text-slate-200 max-w-[620px] mb-8">
          Paket wisata Bromo, Tumpak Sewu, hingga luar negeri, dipandu alumni dan siswa SMKN 2 Malang dalam bahasa
          Indonesia, Inggris, Mandarin, dan Jepang.
        </p>
        <div className="flex flex-wrap gap-3.5">
          <a href="#paket" className="bg-teal-700 hover:bg-teal-600 text-white font-bold px-6 py-4 rounded-xl transition">
            Lihat Paket Wisata
          </a>
          <a
            href={wa ?? "#kontak"}
            target={wa ? "_blank" : undefined}
            rel={wa ? "noopener noreferrer" : undefined}
            className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 border border-white/35 text-white font-bold px-6 py-4 rounded-xl transition"
          >
            <IkonWa /> Tanya via WhatsApp
          </a>
        </div>
        <dl className="mt-12 grid grid-cols-3 gap-3 sm:gap-4 max-w-[760px]">
          {[
            [String(SUMITRA.berdiri), "Berdiri sejak"],
            ["4 bahasa", "Pemandu wisata"],
            ["SMKN 2", "Dikelola resmi sekolah"],
          ].map(([angka, ket]) => (
            <div key={ket} className="bg-slate-950/60 border border-slate-700 rounded-2xl px-4 py-4">
              <dt className="sr-only">{ket}</dt>
              <dd className="text-amber-400 text-xl sm:text-[26px] font-extrabold leading-tight">{angka}</dd>
              <dd className="text-slate-300 text-xs sm:text-[13px] font-semibold mt-0.5">{ket}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}

/* ---------------- TENTANG ---------------- */
export function SumitraTentang({ pengaturan }: { pengaturan: Pengaturan }) {
  return (
    <section id="tentang" className="bg-white text-slate-900 px-4 sm:px-6 py-20 sm:py-24">
      <div className="max-w-[1200px] mx-auto flex flex-wrap gap-10 lg:gap-14 items-center">
        <div className="relative flex-[1_1_420px] min-w-0 aspect-[4/3] rounded-3xl overflow-hidden bg-slate-100">
          <Image
            src={pengaturan.tentangFotoUrl || SUMITRA.tentangBawaan}
            alt="Rombongan peserta tur Sumitra Kelana Wisata di Gunung Bromo"
            fill
            sizes="(min-width: 1024px) 560px, 100vw"
            className="object-cover"
          />
        </div>
        <div className="flex-[1_1_460px] min-w-0">
          <JudulKecil>Tentang Kami</JudulKecil>
          <h2 className="mt-2.5 mb-4 text-3xl sm:text-[40px] leading-tight font-extrabold">Teman untuk berkelana, dikelola sekolah</h2>
          <p className="text-[17px] leading-relaxed text-slate-600 mb-3.5">
            Sumitra Kelana Wisata adalah unit produksi SMKN 2 Malang yang berdiri sejak {SUMITRA.berdiri}. Kami memadukan siswa,
            alumni, dan guru jurusan Pariwisata untuk merancang dan memandu paket wisata domestik maupun internasional.
          </p>
          <p className="text-[17px] leading-relaxed text-slate-600 mb-6">
            Setiap transaksi tercatat melalui BLUD SMKN 2 Malang, dan kantor kami berada di Edotel SMKN 2 Malang, Jl. Veteran No. 17.
          </p>
          <div className="flex flex-wrap gap-2.5">
            {["Kolaborasi siswa & alumni", "Tercatat di BLUD sekolah", "Kantor di Edotel"].map((t) => (
              <span key={t} className="bg-slate-100 border border-slate-200 rounded-full px-3.5 py-2 text-[13px] font-bold">{t}</span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------------- KEUNGGULAN ---------------- */
export function SumitraKeunggulan() {
  const isi = [
    {
      judul: "Pemandu Mandarin & Jepang",
      teks: "Hanya sedikit travel di Malang yang punya pemandu berbahasa Mandarin. Kami pernah memandu rombongan 25 tamu dari Yunnan selama 3 hari 2 malam.",
    },
    {
      judul: "Dikelola sekolah",
      teks: "Unit resmi SMKN 2 Malang dengan pencatatan keuangan di BLUD sekolah, sehingga pembayaranmu aman.",
    },
    {
      judul: "Fleksibel sesuai keinginan",
      teks: "Ingin petualangan di Bromo? Tersedia sewa trail. Paket private bisa disusun sesuai rombonganmu.",
    },
  ];
  return (
    <section className="bg-slate-950 px-4 sm:px-6 py-20 sm:py-24">
      <div className="max-w-[1200px] mx-auto">
        <JudulKecil gelap>Kenapa Sumitra</JudulKecil>
        <h2 className="mt-2.5 mb-8 text-3xl sm:text-[40px] leading-tight font-extrabold text-white">Yang jarang ada di travel lain</h2>
        <div className="grid gap-5 grid-cols-[repeat(auto-fill,minmax(280px,1fr))]">
          {isi.map((k) => (
            <div key={k.judul} className="border border-slate-700 rounded-[20px] p-6">
              <h3 className="text-xl font-extrabold text-amber-400 mb-2.5">{k.judul}</h3>
              <p className="text-[15px] leading-relaxed text-slate-300">{k.teks}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------------- JEJAK PERJALANAN (GALERI) ---------------- */
export function SumitraGaleri({ galeri }: { galeri: GaleriItem[] }) {
  return (
    <section
      id="dokumentasi"
      className="relative px-4 sm:px-6 py-20 sm:py-24 text-slate-900 bg-slate-50"
      style={{ backgroundImage: "url('/images/sumitra/pola-dokumentasi.png')", backgroundSize: "600px 600px" }}
    >
      <div className="max-w-[1200px] mx-auto">
        <JudulKecil>Jejak Perjalanan</JudulKecil>
        <h2 className="mt-2.5 mb-8 text-3xl sm:text-[40px] leading-tight font-extrabold">Dokumentasi tur kami</h2>
        {galeri.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white/80 p-10 text-center text-slate-600">
            <Camera className="w-8 h-8 mx-auto text-teal-700 mb-3" aria-hidden />
            Dokumentasi perjalanan segera hadir.
          </div>
        ) : (
          <ul className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {galeri.map((g, i) => (
              <li
                key={g.id}
                className={`relative rounded-2xl overflow-hidden bg-slate-200 ${
                  i === 0 ? "col-span-2 row-span-2 min-h-[280px] md:min-h-[360px]" : "min-h-[150px] md:min-h-[174px]"
                } ${i >= 3 ? "max-md:hidden" : ""}`}
              >
                <Image src={g.fotoUrl} alt={g.keterangan || "Dokumentasi perjalanan Sumitra"} fill
                  sizes={i === 0 ? "(min-width: 768px) 600px, 100vw" : "(min-width: 768px) 300px, 50vw"} className="object-cover" />
                {g.keterangan && (
                  <span className="absolute left-0 right-0 bottom-0 p-3 text-[13px] font-bold text-white bg-slate-950/55">
                    {g.keterangan}
                  </span>
                )}
              </li>
            ))}
          </ul>
        )}
        {/* Di HP hanya 3 foto terbaru yang tampil; sisanya lewat halaman dokumentasi */}
        {galeri.length > 3 && (
          <Link
            href="/sumitra/dokumentasi"
            className="md:hidden mt-5 flex items-center justify-center gap-2 w-full bg-teal-700 hover:bg-teal-800 text-white font-bold py-3.5 rounded-xl transition"
          >
            <Camera className="w-4 h-4" aria-hidden /> Lihat semua dokumentasi
          </Link>
        )}
      </div>
    </section>
  );
}

/* ---------------- MITRA ---------------- */
export function SumitraMitra({ mitra }: { mitra: Mitra[] }) {
  if (mitra.length === 0) return null;
  return (
    <section className="relative bg-white px-4 sm:px-6 py-16 sm:py-[72px] overflow-hidden">
      <CorakTitik />
      <div className="relative max-w-[1200px] mx-auto text-center">
        <JudulKecil>Mitra Kami</JudulKecil>
        <ul className="mt-6 flex flex-wrap justify-center gap-3.5">
          {mitra.map((m) => (
            <li key={m.id} className="bg-white border border-slate-200 rounded-2xl px-5 py-4 font-bold text-slate-700 flex items-center gap-3">
              {m.logoUrl && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={m.logoUrl} alt="" className="h-8 w-auto max-w-[96px] object-contain" />
              )}
              {m.nama}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

/* ---------------- FOOTER ---------------- */
export function SumitraFooter({ pengaturan }: { pengaturan: Pengaturan }) {
  const wa = tautanWa(pengaturan.nomorWa);
  return (
    <footer id="kontak" className="bg-slate-950 text-slate-300 px-4 sm:px-6 pt-16 pb-8">
      <div className="max-w-[1200px] mx-auto flex flex-wrap gap-10 justify-between">
        <div className="flex-[1_1_300px]">
          <p className="text-white font-extrabold text-xl">SUMITRA KELANA WISATA</p>
          <p className="mt-2.5 text-[15px] leading-relaxed">{SUMITRA.slogan}. Unit Produksi SMKN 2 Malang.</p>
        </div>
        <div className="flex-[1_1_260px] text-[15px] leading-relaxed space-y-2">
          <p className="text-white font-extrabold mb-1.5">Kantor</p>
          <p className="flex gap-2"><MapPin className="w-4 h-4 mt-1 shrink-0 text-amber-400" aria-hidden /> {SUMITRA.alamat}</p>
          <p className="flex gap-2">
            <Clock className="w-4 h-4 mt-1 shrink-0 text-amber-400" aria-hidden />
            {pengaturan.jamBuka ? `Jam buka ${pengaturan.jamBuka}` : "Jam buka: hubungi kami lewat WhatsApp"}
          </p>
          <a href={SUMITRA.mapsUrl} target="_blank" rel="noopener noreferrer" className="inline-block text-amber-400 font-semibold hover:underline">
            Buka di Google Maps
          </a>
        </div>
        <div className="flex-[1_1_220px] text-[15px] space-y-2.5">
          <p className="text-white font-extrabold mb-1.5">Hubungi kami</p>
          {wa && (
            <a href={wa} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:text-amber-400">
              <IkonWa className="w-4 h-4 text-amber-400" /> WhatsApp
            </a>
          )}
          {pengaturan.instagram && (
            <a href={pengaturan.instagram} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:text-amber-400">
              <AtSign className="w-4 h-4 text-amber-400" aria-hidden /> Instagram
            </a>
          )}
          {pengaturan.facebook && (
            <a href={pengaturan.facebook} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:text-amber-400">
              <Users className="w-4 h-4 text-amber-400" aria-hidden /> Facebook
            </a>
          )}
          {!wa && !pengaturan.instagram && !pengaturan.facebook && (
            <p className="text-slate-400">Kontak segera diperbarui. Kunjungi kantor kami di Edotel SMKN 2 Malang.</p>
          )}
        </div>
      </div>
      <div className="max-w-[1200px] mx-auto mt-10 pt-5 border-t border-slate-800 text-[13px] text-slate-400 flex flex-wrap justify-between gap-2">
        <span>© {new Date().getFullYear()} Sumitra Kelana Wisata · SMKN 2 Malang</span>
        <Link href="/" className="hover:text-amber-400">Website SMKN 2 Malang</Link>
      </div>
    </footer>
  );
}
