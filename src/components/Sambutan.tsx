"use client";

import { useState, useEffect } from "react";
import { Quote, ChevronRight, X } from "lucide-react";

export default function Sambutan() {
  const [showFull, setShowFull] = useState(false);

  // Kunci scroll latar belakang utama ketika modal terbuka
  useEffect(() => {
    if (showFull) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [showFull]);

  return (
    <section className="sticky top-0 z-10 min-h-screen bg-slate-100 text-slate-900 py-24 px-6 flex items-center justify-center">
      <div className="max-w-7xl mx-auto grid md:grid-cols-12 gap-10 items-center">
        {/* Card Foto Kepala Sekolah */}
        <div className="md:col-span-5">
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xl text-center">
            <div className="w-full h-80 bg-slate-200 rounded-2xl mb-4 flex items-center justify-center text-slate-400 font-semibold border border-slate-300">
              [ Foto Kepala Sekolah ]
            </div>
            <h4 className="font-extrabold text-slate-900 text-lg">
              Bapak Slamet Winarto, M.Pd
            </h4>
            <p className="text-xs font-bold text-amber-600 uppercase tracking-widest mt-1">
              Kepala SMKN 2 Malang
            </p>
          </div>
        </div>

        {/* Teks Sambutan Ringkas */}
        <div className="md:col-span-7 space-y-5">
          <span className="inline-block text-xs font-black text-amber-600 bg-amber-100 border border-amber-300 px-3 py-1 rounded-md uppercase tracking-wider">
            Sambutan Kepala Sekolah
          </span>

          <h3 className="text-2xl sm:text-3xl font-black text-slate-900 leading-tight">
             Website Resmi SMK Negeri 2 Malang
          </h3>

          <div className="bg-white border-l-4 border-amber-500 p-5 rounded-r-2xl shadow-sm flex gap-3 items-start">
            <Quote className="w-8 h-8 text-amber-500 shrink-0 rotate-180" />
            <p className="text-slate-800 italic text-sm leading-relaxed font-medium">
              "SMK Negeri 2 Malang berupaya mengoptimalkan penggunaan jaringan internet agar peningkatan mutu sumber daya manusia dan mutu pendidikan dapat segera tercapai."
            </p>
          </div>

          <div className="text-slate-600 text-sm leading-relaxed space-y-3">
            <p>
              <strong className="text-slate-800">Assalamualaikum Wr. Wb.</strong> Puji syukur ke hadirat Allah SWT, karena berkat karunia rahmat dan hidayah-Nya, pada akhirnya website SMK Negeri 2 Malang dapat diluncurkan di dunia maya.
            </p>
            <p>
              Perkembangan Teknologi Informasi dan Komunikasi saat ini sudah sedemikian pesat dan merambah ke semua sektor kehidupan, termasuk pendidikan. Website ini hadir sebagai wadah menyampaikan informasi sekaligus menjalin komunikasi antara pihak sekolah dengan guru, orang tua/wali murid, siswa, alumni, dan stakeholder.
            </p>
          </div>

          <button
            onClick={() => setShowFull(true)}
            className="inline-flex items-center gap-2 text-sm font-bold text-amber-600 hover:text-amber-700 hover:underline transition pt-1"
          >
            Baca Sambutan Selengkapnya <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Pop-up Modal Terkunci & Isolasi Scroll */}
      {showFull && (
        <div className="fixed inset-0 z-[100] bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 overflow-hidden">
          <div className="bg-white text-slate-900 rounded-3xl max-w-2xl w-full p-6 sm:p-8 relative shadow-2xl max-h-[85vh] flex flex-col">
            {/* Header Modal Sticky */}
            <div className="flex justify-between items-center pb-4 border-b border-slate-200 shrink-0">
              <h3 className="text-xl font-black text-slate-900">
                Sambutan Lengkap Kepala Sekolah
              </h3>
              <button
                onClick={() => setShowFull(false)}
                className="p-2 rounded-full hover:bg-slate-100 text-slate-500 transition"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Area Isi Teks Murni Scrollable */}
            <div className="text-slate-700 text-sm leading-relaxed space-y-4 font-normal overflow-y-auto pt-4 pr-2">
              <p className="font-semibold text-slate-900">Assalamualaikum Wr Wb</p>
              <p>
                Puji Syukur ke hadirat Allah SWT, karena berkat karunia rahmat dan hidayah-Nya, pada akhirnya website SMK Negeri 2 Malang dapat diluncurkan di dunia maya.
              </p>
              <p>
                Sebagaimana diketahui bersama bahwa perkembangan teknologi, khususnya teknologi Informasi dan Komunikasi saat ini sudah sedemikian pesat dan sudah merambah ke semua sektor kehidupan termasuk di dalamnya adalah sektor pendidikan. Internet sebagai salah satu bagian dari perkembangan teknologi informasi dan komunikasi dari hari ke hari juga menunjukkan perkembangan yang sangat signifikan.
              </p>
              <p>
                Melalui internet kita dapat menjumpai aneka referensi, jurnal, maupun hasil penelitian dalam jumlah yang melimpah. Materi-materi yang disajikan di internet cenderung lebih up to date dibandingkan dengan yang disajikan dalam bentuk buku. Sehubungan dengan hal tersebut SMK Negeri 2 Malang berupaya mengoptimalkan penggunaan jaringan internet yang sudah ada di sekolah, agar peningkatan mutu sumber daya manusia dan mutu pendidikan dapat segera tercapai.
              </p>
              <p>
                Kelebihan lain dari internet adalah dapat menghadirkan informasi yang dibutuhkan tanpa mengenal batas geografis. Para pengguna internet dapat tukar menukar informasi dengan berbagai pihak di segala penjuru dunia dalam waktu singkat dan dengan biaya yang relatif murah. Salah satu fasilitas yang ada di internet yang dapat dipakai untuk tukar menukar informasi adalah dengan menggunakan website. Untuk itulah website ini dibuat, tujuannya adalah agar pihak sekolah dapat menyampaikan informasi tentang SMK Negeri 2 Malang dan sekaligus menjalin komunikasi antara pihak sekolah dengan guru, orang tua/wali murid, siswa, alumni dan stakeholder.
              </p>
              <p>
                Mudah-mudahan dengan optimalisasi penggunaan internet dan website ini peningkatan mutu pendidikan dan komunikasi global dapat segera terwujud.
              </p>
              <p className="font-semibold text-slate-900 pt-2">
                Wassalamualaikum Wr Wb<br />
                <span className="text-amber-600">Kepala SMKN 2 Malang</span>
              </p>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}