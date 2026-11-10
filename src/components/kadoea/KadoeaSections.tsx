// Bagian-bagian statis halaman KADOEA (dirender di server, tanpa JavaScript di browser)
import Image from "next/image";
import Link from "next/link";
import {
  ArrowDown, HelpCircle, Phone, MapPin, Globe, Mail, Star, ExternalLink, Check, MessageCircle,
  BedDouble, HeartPulse, Utensils, Users, ShieldCheck, Trees, Sparkles,
} from "lucide-react";
import {
  KADOEA_KONTAK, KADOEA_STATISTIK, KADOEA_PAKET, KADOEA_FASILITAS, KADOEA_ULASAN, type Fasilitas,
} from "@/data/kadoea";

// Label kecil di atas judul section, sama dengan gaya beranda sekolah
function LabelGelap({ children }: { children: React.ReactNode }) {
  return (
    <span className="text-xs font-black uppercase tracking-widest text-amber-400 bg-slate-900/90 px-3.5 py-1.5 rounded-md border border-amber-400/30 inline-block mb-3 shadow-md">
      {children}
    </span>
  );
}
function LabelTerang({ children }: { children: React.ReactNode }) {
  return (
    <span className="text-[11px] font-bold uppercase tracking-wider text-blue-600 bg-blue-50 border border-blue-100 px-3 py-1 rounded-full inline-block mb-3">
      {children}
    </span>
  );
}

/* ---------------- 1. HERO ---------------- */
export function KadoeaHero() {
  return (
    <section id="beranda" className="relative h-[calc(100vh-5rem)] min-h-[560px] overflow-hidden">
      <Image
        src="/images/pht.jpg"
        alt="Kamar KADOEA Senior Living"
        fill
        priority
        sizes="100vw"
        className="object-cover object-center scale-105"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/70 to-slate-900/40" />

      <div className="relative z-10 h-full flex items-center justify-center px-6 text-center">
        <div className="max-w-4xl mx-auto">
          <span className="inline-block bg-amber-400 text-slate-950 text-xs sm:text-sm font-black px-4 py-1.5 rounded-full mb-6 uppercase tracking-wider shadow-lg shadow-amber-400/20">
            Hotel Khusus Lansia
          </span>
          <h1 className="text-4xl sm:text-6xl font-black text-white leading-tight tracking-tight mb-6 drop-shadow-md">
            Tempat Tinggal yang Hangat untuk{" "}
            <span className="text-amber-400">Orang Tua Tercinta</span>
          </h1>
          <p className="text-slate-200 text-base sm:text-xl leading-relaxed max-w-2xl mx-auto mb-8 drop-shadow">
            KADOEA Senior Living menghadirkan kenyamanan layanan hotel dengan pendampingan caregiver,
            di lingkungan SMK Negeri 2 Malang.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <a
              href="#paket"
              className="inline-flex items-center gap-2 bg-blue-900 hover:bg-blue-800 text-white font-bold px-7 py-3.5 rounded-xl shadow-xl transition border border-blue-700/50"
            >
              Lihat Paket Layanan <ArrowDown className="w-4 h-4" />
            </a>
            <a
              href="#faq"
              className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 backdrop-blur-md text-white border border-white/30 font-bold px-7 py-3.5 rounded-xl transition"
            >
              <HelpCircle className="w-4 h-4" /> Pertanyaan Umum
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------------- 2. TENTANG ---------------- */
export function KadoeaTentang() {
  return (
    <section id="tentang" className="bg-white text-slate-900 px-6 py-24">
      <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
        <div className="relative aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl">
          <Image src="/images/lpkc.jpg" alt="Pendampingan lansia di KADOEA" fill sizes="(min-width: 1024px) 50vw, 100vw" className="object-cover" />
          <div className="absolute bottom-4 left-4 right-4 bg-slate-950/80 backdrop-blur-md text-white rounded-2xl px-5 py-4 border border-slate-700/60">
            <p className="text-amber-400 text-xs font-black uppercase tracking-wider">Teaching Factory</p>
            <p className="text-sm mt-1">Unit produksi konsentrasi keahlian LPKC SMK Negeri 2 Malang.</p>
          </div>
        </div>

        <div>
          <LabelTerang>Tentang Kami</LabelTerang>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-5">
            Bukan Panti, Melainkan Hotel untuk Lansia
          </h2>
          <div className="space-y-4 text-slate-600 text-base sm:text-lg leading-relaxed">
            <p>
              KADOEA Senior Living adalah hotel khusus lanjut usia milik SMK Negeri 2 Malang yang diresmikan pada
              24 November 2021. Kami melayani lansia dengan standar layanan hotel, ditambah pendampingan sehari-hari
              oleh caregiver.
            </p>
            <p>
              Selain sebagai unit usaha, KADOEA menjadi tempat teaching factory bagi siswa SMK Negeri 2 Malang.
              Siswa belajar melayani lansia secara langsung dengan bimbingan pendamping yang berpengalaman.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-8">
            {KADOEA_STATISTIK.map((s) => (
              <div key={s.label} className="bg-slate-50 border border-slate-200 rounded-2xl p-4 text-center">
                <p className="text-3xl font-black text-blue-900">{s.angka}</p>
                <p className="text-xs font-semibold text-slate-500 mt-1">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------------- 3. PAKET ---------------- */
export function KadoeaPaket() {
  return (
    <section id="paket" className="bg-slate-950 px-6 py-24">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <LabelGelap>Paket Layanan</LabelGelap>
          <h2 className="text-3xl sm:text-5xl font-black text-white">Pilih Layanan yang Sesuai</h2>
          <p className="text-slate-400 mt-3 max-w-2xl mx-auto">
            Setiap paket dapat disesuaikan dengan kondisi dan kebutuhan lansia. Hubungi kami untuk konsultasi.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {KADOEA_PAKET.map((p, i) => (
            <div
              key={p.nama}
              className={`relative bg-slate-900/90 border p-8 rounded-2xl text-white shadow-2xl transition-all duration-300 group flex flex-col ${
                p.unggulan ? "border-amber-400" : "border-slate-700/80 hover:border-amber-400"
              }`}
            >
              {p.unggulan && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-amber-400 text-slate-950 text-[11px] font-black px-3 py-1 rounded-full uppercase tracking-wider">
                  Paling Diminati
                </span>
              )}
              <div className="w-12 h-12 bg-amber-400 text-slate-950 rounded-xl flex items-center justify-center font-black text-xl mb-6 shadow-md group-hover:scale-110 transition duration-300">
                {i + 1}
              </div>
              <h3 className="text-2xl font-bold mb-2">{p.nama}</h3>
              <p className="text-slate-300 text-sm leading-relaxed mb-6">{p.ringkas}</p>
              <p className="text-amber-400 text-2xl font-black">{p.harga}</p>
              <p className="text-slate-500 text-xs mb-6">{p.satuan}</p>
              <ul className="space-y-3 mb-8 flex-1">
                {p.fitur.map((f) => (
                  <li key={f} className="flex items-start gap-2.5 text-slate-200 text-sm">
                    <Check className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" /> {f}
                  </li>
                ))}
              </ul>
              <a
                href={KADOEA_KONTAK.teleponLink}
                className={`text-center font-bold px-5 py-3 rounded-xl transition ${
                  p.unggulan ? "bg-amber-400 hover:bg-amber-300 text-slate-950" : "bg-white/10 hover:bg-white/20 border border-white/20"
                }`}
              >
                Tanyakan Paket Ini
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------------- 4. FASILITAS ---------------- */
const IKON: Record<Fasilitas["ikon"], React.ElementType> = {
  bed: BedDouble, heart: HeartPulse, utensils: Utensils, users: Users,
  shield: ShieldCheck, trees: Trees, sparkles: Sparkles, phone: Phone,
};

export function KadoeaFasilitas() {
  return (
    <section id="fasilitas" className="bg-white text-slate-900 px-6 py-24">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <LabelTerang>Fasilitas</LabelTerang>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">Nyaman, Aman, dan Terawat</h2>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {KADOEA_FASILITAS.map((f) => {
            const Icon = IKON[f.ikon];
            return (
              <div
                key={f.nama}
                className="bg-slate-50/70 border border-slate-200/80 p-6 rounded-2xl hover:border-amber-400 hover:shadow-lg transition group"
              >
                <div className="w-12 h-12 rounded-xl bg-blue-900 text-amber-400 flex items-center justify-center mb-4 group-hover:scale-110 transition">
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold mb-1.5">{f.nama}</h3>
                <p className="text-slate-600 text-sm sm:text-base leading-relaxed">{f.deskripsi}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ---------------- 5. ULASAN ---------------- */
export function KadoeaUlasan() {
  const ada = KADOEA_ULASAN.length > 0;
  return (
    <section id="ulasan" className="bg-slate-50 text-slate-900 px-6 py-24">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-10">
          <LabelTerang>Ulasan Tamu</LabelTerang>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">Cerita dari Keluarga Tamu Kami</h2>
          <p className="text-slate-500 text-sm mt-2">Ulasan pilihan dari Google Maps.</p>
        </div>

        {ada ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {KADOEA_ULASAN.map((u) => (
              <div key={u.nama + u.isi.slice(0, 10)} className="bg-white border border-slate-200/80 p-6 rounded-2xl flex flex-col justify-between shadow-sm">
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <span className="font-bold text-blue-600">Google</span>
                    <div className="flex gap-0.5">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star key={i} className={`w-4 h-4 ${i < u.rating ? "fill-amber-400 text-amber-400" : "text-slate-300"}`} />
                      ))}
                    </div>
                  </div>
                  <p className="text-slate-600 text-sm sm:text-base italic leading-relaxed">“{u.isi}”</p>
                </div>
                <div className="mt-5">
                  <p className="text-sm font-bold text-slate-800">{u.nama}</p>
                  {u.waktu && <p className="text-xs text-slate-400">{u.waktu}</p>}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="max-w-xl mx-auto bg-white border border-slate-200 rounded-2xl p-8 text-center shadow-sm">
            <div className="flex justify-center gap-1 mb-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className="w-6 h-6 fill-amber-400 text-amber-400" />
              ))}
            </div>
            <p className="text-slate-600">
              Baca pengalaman keluarga yang telah mempercayakan orang tuanya kepada KADOEA di Google Maps.
            </p>
          </div>
        )}

        <div className="text-center mt-8">
          <a
            href={KADOEA_KONTAK.mapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-5 py-3 text-sm font-bold text-blue-700 bg-blue-50 border border-blue-100 rounded-xl hover:bg-blue-100 transition"
          >
            Lihat ulasan di Google Maps <ExternalLink className="w-4 h-4" />
          </a>
        </div>
      </div>
    </section>
  );
}

/* ---------------- 6. FOOTER + KONTAK ---------------- */
export function KadoeaFooter() {
  const k = KADOEA_KONTAK;
  return (
    <footer id="kontak" className="bg-slate-900 border-t border-slate-800 text-slate-400">
      {/* Ajakan reservasi */}
      <div className="border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-6 py-12 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div>
            <h2 className="text-2xl sm:text-3xl font-black text-white">Ingin berkonsultasi lebih dulu?</h2>
            <p className="text-slate-400 mt-1">Tim kami siap membantu memilih layanan yang tepat untuk orang tua Anda.</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <a href={k.teleponLink} className="inline-flex items-center gap-2 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold px-6 py-3.5 rounded-xl transition">
              <Phone className="w-4 h-4" /> Telepon Sekarang
            </a>
            {k.whatsapp && (
              <a
                href={`https://wa.me/${k.whatsapp}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white border border-white/20 font-bold px-6 py-3.5 rounded-xl transition"
              >
                <MessageCircle className="w-4 h-4" /> WhatsApp
              </a>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-14 grid grid-cols-1 md:grid-cols-3 gap-10 text-sm">
        <div className="space-y-4">
          <div className="flex flex-col">
            <span className="font-black text-white text-lg tracking-wider leading-none">KADOEA</span>
            <span className="text-[10px] font-bold text-amber-400 tracking-widest uppercase mt-1">Senior Living</span>
          </div>
          <p className="leading-relaxed">
            Hotel khusus lansia dan teaching factory SMK Negeri 2 Malang. Layanan seperti hotel dengan pendampingan caregiver.
          </p>
        </div>

        <div className="space-y-3">
          <h3 className="font-extrabold text-white uppercase tracking-wider">Kontak</h3>
          <ul className="space-y-3">
            <li className="flex items-start gap-2.5">
              <MapPin className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <a href={k.mapsUrl} target="_blank" rel="noopener noreferrer" className="hover:text-amber-400 transition">{k.alamat}</a>
            </li>
            <li className="flex items-center gap-2.5">
              <Phone className="w-4 h-4 text-amber-400 shrink-0" />
              <a href={k.teleponLink} className="hover:text-amber-400 transition">{k.telepon}</a>
            </li>
            {k.email && (
              <li className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-amber-400 shrink-0" />
                <a href={`mailto:${k.email}`} className="hover:text-amber-400 transition">{k.email}</a>
              </li>
            )}
            <li className="flex items-center gap-2.5">
              <Globe className="w-4 h-4 text-amber-400 shrink-0" />
              <span>{k.web}</span>
            </li>
          </ul>
        </div>

        <div className="space-y-3">
          <h3 className="font-extrabold text-white uppercase tracking-wider">Jelajahi</h3>
          <ul className="space-y-2">
            {[["Tentang", "#tentang"], ["Paket Layanan", "#paket"], ["Fasilitas", "#fasilitas"], ["Pertanyaan Umum", "#faq"]].map(([l, h]) => (
              <li key={h}><a href={h} className="hover:text-amber-400 transition">{l}</a></li>
            ))}
            <li><Link href="/" className="hover:text-amber-400 transition">Website SMK Negeri 2 Malang</Link></li>
          </ul>
        </div>
      </div>

      <div className="border-t border-slate-800 py-6 text-center text-slate-500 text-[11px]">
        © {new Date().getFullYear()} KADOEA Senior Living · Unit Produksi SMK Negeri 2 Malang
      </div>
    </footer>
  );
}
