"use client";

import { useState, useEffect } from "react";
import { Quote, ChevronRight, X } from "lucide-react";

export default function Sambutan() {
  const [showFull, setShowFull] = useState(false);

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
      <div className="max-w-7xl mx-auto w-full grid md:grid-cols-12 gap-10 items-center">
        
        {/* Kolom Kiri: Card Foto Kepala Sekolah */}
        <div className="md:col-span-5 flex justify-center">
          <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-xl text-center max-w-sm w-full">
            <div className="w-full h-72 bg-slate-50 rounded-2xl mb-4 overflow-hidden border border-slate-200 flex items-center justify-center p-2">
              <img
                src="/images/kepalasekolah.png"
                alt="Bapak Slamet Winarto, M.Pd"
                className="max-h-full w-auto object-contain"
              />
            </div>
            <h4 className="font-extrabold text-slate-900 text-base sm:text-lg">
              Bapak Slamet Winarto, M.Pd
            </h4>
            <p className="text-xs font-bold text-amber-600 uppercase tracking-widest mt-1">
              Kepala SMKN 2 Malang
            </p>
          </div>
        </div>
        
        {/* Kolom Kanan: Ringkasan Sambutan Teks */}
        <div className="md:col-span-7 space-y-6">
          <div className="inline-flex items-center gap-2 bg-amber-500/10 text-amber-700 px-4 py-1.5 rounded-full text-xs font-bold">
            <Quote className="w-4 h-4" />
            <span>SAMBUTAN KEPALA SEKOLAH</span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 leading-tight">
            Selamat Datang di Website Resmi SMKN 2 Malang
          </h2>

          <div className="text-slate-600 text-sm sm:text-base leading-relaxed space-y-4 font-normal">
            <p className="italic font-medium text-slate-800">
              "Assalamualaikum Wr. Wb."
            </p>
            <p>
              Puji Syukur ke hadirat Allah SWT, karena berkat karunia rahmat dan hidayah-Nya, pada akhirnya website SMK Negeri 2 Malang dapat diluncurkan di dunia maya.
            </p>
            <p>
              Sebagaimana diketahui bersama bahwa perkembangan teknologi Informasi dan Komunikasi saat ini sudah sedemikian pesat. Melalui website ini kami berupaya mengoptimalkan komunikasi dan peningkatan mutu pendidikan.
            </p>
          </div>

          <div>
            <button
              onClick={() => setShowFull(true)}
              className="inline-flex items-center gap-2 bg-slate-900 hover:bg-amber-500 text-white hover:text-slate-950 font-bold px-6 py-3.5 rounded-xl shadow-lg transition duration-200 text-sm"
            >
              <span>Baca Sambutan Lengkap</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
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