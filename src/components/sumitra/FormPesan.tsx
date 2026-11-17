"use client";

// Formulir pemesanan Sumitra (pengganti formulir kertas).
// Alur saat tombol "Kirim pesanan via WhatsApp" ditekan:
//  1. Isian diperiksa.
//  2. Pesanan disimpan ke Supabase lewat fungsi buat_pesanan_sumitra -> dapat kode (mis. SKW-0012).
//     Data ini muncul di menu Pesanan pada panel admin.
//  3. Teks pesan disusun lalu WhatsApp dibuka lewat tautan wa.me ke nomor admin Sumitra.
//  4. Pemesan menekan Kirim di WhatsApp. Pembayaran berlanjut di chat (tidak ada pembayaran di website).
import { useState } from "react";
import { CheckCircle2 } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { nomorWaInternasional, PILIHAN_FIELD, type FieldWa } from "@/data/sumitra";

const inputCls =
  "w-full bg-white border border-slate-300 rounded-xl px-3 py-3 text-[15px] text-slate-900 placeholder-slate-400 focus:outline-none focus:border-teal-600 focus:ring-2 focus:ring-teal-100 transition";
const labelCls = "block text-[13px] font-bold text-slate-700";

type Props = {
  jenis: "paket" | "layanan";
  itemId: string | null;
  itemNama: string;
  fields: FieldWa[];
  nomorWa: string;
  /** Kalimat persetujuan di samping kotak centang */
  teksSetuju: React.ReactNode;
};

const LABEL_TANGGAL = { paket: "Tanggal berangkat", layanan: "Tanggal" };
const LABEL_JUMLAH = { paket: "Jumlah peserta", layanan: "Jumlah orang" };

function formatTanggal(iso: string) {
  if (!iso) return "-";
  const [y, m, d] = iso.split("-").map(Number);
  const bulan = ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"];
  return `${d} ${bulan[m - 1]} ${y}`;
}

export default function FormPesan({ jenis, itemId, itemNama, fields, nomorWa, teksSetuju }: Props) {
  const ada = (f: FieldWa) => fields.includes(f);
  const [nama, setNama] = useState("");
  const [noWa, setNoWa] = useState("");
  const [tanggal, setTanggal] = useState("");
  const [jumlah, setJumlah] = useState("1");
  const [lokasi, setLokasi] = useState("");
  const [lama, setLama] = useState("");
  const [bayar, setBayar] = useState("Transfer");
  const [catatan, setCatatan] = useState("");
  const [setuju, setSetuju] = useState(false);
  const [mengirim, setMengirim] = useState(false);
  const [galat, setGalat] = useState("");
  const [hasil, setHasil] = useState<{ kode: string | null; url: string | null } | null>(null);

  const nomorTujuan = nomorWaInternasional(nomorWa);
  const hariIni = new Date().toISOString().slice(0, 10);

  function susunPesan(kode: string | null) {
    const baris = [
      "Halo Sumitra Kelana Wisata, saya ingin memesan:",
      "",
      `*${itemNama}*`,
      `Nama: ${nama.trim()}`,
      `No. WhatsApp: ${noWa.trim()}`,
    ];
    if (ada("tanggal")) baris.push(`${LABEL_TANGGAL[jenis]}: ${formatTanggal(tanggal)}`);
    if (ada("jumlah")) baris.push(`${LABEL_JUMLAH[jenis]}: ${jumlah} orang`);
    if (ada("lokasi")) baris.push(`Lokasi jemput: ${lokasi.trim() || "-"}`);
    if (ada("lama")) baris.push(`Lama sewa: ${lama.trim() || "-"}`);
    if (ada("bayar")) baris.push(`Pembayaran: ${bayar}`);
    baris.push(`Catatan: ${catatan.trim() || "-"}`, "");
    baris.push(
      jenis === "paket"
        ? "Saya sudah membaca syarat pembayaran & pembatalan (DP tidak dapat dikembalikan jika batal)."
        : "Saya sudah membaca syarat pemesanan layanan.",
    );
    if (kode) baris.push("", `Kode pesanan: ${kode}`);
    return baris.join("\n");
  }

  async function kirim(e: React.FormEvent) {
    e.preventDefault();
    setGalat("");

    // 1. Periksa isian
    if (nama.trim().length < 2) return setGalat("Isi nama lengkap terlebih dahulu.");
    const angkaWa = noWa.replace(/[^0-9]/g, "");
    if (angkaWa.length < 9 || angkaWa.length > 15) return setGalat("Nomor WhatsApp belum benar. Contoh: 081234567890.");
    if (ada("tanggal") && !tanggal) return setGalat(`Pilih ${LABEL_TANGGAL[jenis].toLowerCase()}.`);
    const nJumlah = Number(jumlah);
    if (ada("jumlah") && (!Number.isInteger(nJumlah) || nJumlah < 1 || nJumlah > 500)) return setGalat("Jumlah orang minimal 1.");
    if (ada("lokasi") && lokasi.trim().length < 3) return setGalat("Isi lokasi penjemputan.");
    if (!setuju) return setGalat("Centang persetujuan syarat terlebih dahulu.");

    // Buka tab lebih dulu (sebelum menunggu server) supaya tidak diblokir pemblokir pop-up
    const tab = nomorTujuan ? window.open("", "_blank") : null;
    setMengirim(true);

    // 2. Simpan pesanan (data cadangan tanpa id tidak disimpan, langsung ke WhatsApp)
    let kode: string | null = null;
    if (itemId) {
      const { data, error } = await supabase.rpc("buat_pesanan_sumitra", {
        p_jenis: jenis,
        p_item_id: itemId,
        p_nama: nama.trim(),
        p_no_wa: noWa.trim(),
        p_tanggal: ada("tanggal") ? tanggal : null,
        p_jumlah: ada("jumlah") ? nJumlah : null,
        p_lokasi: ada("lokasi") ? lokasi.trim() : "",
        p_lama: ada("lama") ? lama.trim() : "",
        p_cara_bayar: ada("bayar") ? bayar : "",
        p_catatan: catatan.trim(),
        p_setuju: true,
      });
      if (error) {
        console.error("Gagal menyimpan pesanan:", error);
        // Kesalahan isian dari server ditampilkan; gangguan lain tidak menghalangi chat WhatsApp
        if (/tidak valid|harus disetujui|Terlalu banyak|tidak ditemukan/.test(error.message)) {
          tab?.close();
          setMengirim(false);
          return setGalat(error.message + ".");
        }
      } else {
        kode = data as string;
      }
    }

    // Tanpa nomor WA admin, pesanan hanya sah bila berhasil tersimpan
    if (!kode && !nomorTujuan) {
      setMengirim(false);
      return setGalat("Pesanan gagal dikirim. Coba lagi beberapa saat lagi atau datang ke kantor Sumitra di Edotel SMKN 2 Malang.");
    }

    // 3. Buka WhatsApp dengan pesan terisi
    const url = nomorTujuan ? `https://wa.me/${nomorTujuan}?text=${encodeURIComponent(susunPesan(kode))}` : null;
    if (url) {
      if (tab) tab.location.href = url;
      else window.location.href = url;
    }
    setMengirim(false);
    setHasil({ kode, url });
  }

  if (hasil) {
    return (
      <div className="rounded-2xl border border-teal-200 bg-teal-50 p-5 space-y-3" role="status">
        <div className="flex items-center gap-2 text-teal-800 font-extrabold">
          <CheckCircle2 className="w-5 h-5" /> Pesanan dikirim
        </div>
        <p className="text-[15px] leading-relaxed text-slate-700">
          {hasil.kode ? <>Kode pesananmu <strong>{hasil.kode}</strong>. </> : null}
          {hasil.url
            ? "Tekan Kirim di WhatsApp agar admin Sumitra menerima pesananmu dan membalas dengan rincian pembayaran."
            : "Pesananmu sudah tercatat. Admin Sumitra akan menghubungi nomor WhatsApp yang kamu isi."}
        </p>
        {hasil.url && (
          <a href={hasil.url} target="_blank" rel="noopener noreferrer"
            className="inline-flex items-center justify-center w-full rounded-xl bg-teal-700 hover:bg-teal-800 text-white font-bold py-3 transition">
            Buka WhatsApp lagi
          </a>
        )}
        <button type="button" onClick={() => { setHasil(null); setSetuju(false); }}
          className="w-full text-sm font-semibold text-slate-600 hover:text-slate-900 py-2">
          Buat pesanan lain
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={kirim} className="space-y-3.5" noValidate>
      <label className={labelCls}>
        Nama lengkap
        <input className={inputCls + " mt-1.5"} value={nama} onChange={(e) => setNama(e.target.value)} maxLength={80}
          placeholder="Nama sesuai identitas" autoComplete="name" required />
      </label>
      <label className={labelCls}>
        Nomor WhatsApp
        <input className={inputCls + " mt-1.5"} value={noWa} onChange={(e) => setNoWa(e.target.value)} maxLength={20}
          placeholder="08xx" inputMode="tel" autoComplete="tel" required />
      </label>

      {(ada("tanggal") || ada("jumlah")) && (
        <div className="grid grid-cols-2 gap-3">
          {ada("tanggal") && (
            <label className={labelCls}>
              {LABEL_TANGGAL[jenis]}
              <input type="date" min={hariIni} className={inputCls + " mt-1.5"} value={tanggal} onChange={(e) => setTanggal(e.target.value)} />
            </label>
          )}
          {ada("jumlah") && (
            <label className={labelCls}>
              {LABEL_JUMLAH[jenis]}
              <input type="number" min={1} max={500} className={inputCls + " mt-1.5"} value={jumlah} onChange={(e) => setJumlah(e.target.value)} />
            </label>
          )}
        </div>
      )}
      {ada("lokasi") && (
        <label className={labelCls}>
          {PILIHAN_FIELD.find((f) => f.id === "lokasi")?.label}
          <input className={inputCls + " mt-1.5"} value={lokasi} onChange={(e) => setLokasi(e.target.value)} maxLength={200}
            placeholder="Alamat atau nama tempat" />
        </label>
      )}
      {ada("lama") && (
        <label className={labelCls}>
          Lama sewa
          <input className={inputCls + " mt-1.5"} value={lama} onChange={(e) => setLama(e.target.value)} maxLength={60}
            placeholder="Misalnya 2 hari" />
        </label>
      )}
      {ada("bayar") && (
        <fieldset>
          <legend className={labelCls}>Cara pembayaran</legend>
          <div className="flex gap-5 mt-1.5 text-[15px] text-slate-800">
            {["Transfer", "Tunai"].map((b) => (
              <label key={b} className="flex items-center gap-2 min-h-10">
                <input type="radio" name={`bayar-${itemNama}`} checked={bayar === b} onChange={() => setBayar(b)} className="accent-teal-700 w-4 h-4" />
                {b}
              </label>
            ))}
          </div>
        </fieldset>
      )}
      <label className={labelCls}>
        Catatan (opsional)
        <textarea rows={2} className={inputCls + " mt-1.5 resize-y"} value={catatan} onChange={(e) => setCatatan(e.target.value)} maxLength={500}
          placeholder="Misalnya titik jemput atau kebutuhan khusus" />
      </label>

      <label className="flex gap-3 items-start rounded-xl border border-amber-300 bg-amber-50 p-3 text-sm leading-relaxed text-amber-950">
        <input type="checkbox" checked={setuju} onChange={(e) => setSetuju(e.target.checked)} className="mt-0.5 w-[18px] h-[18px] accent-teal-700 shrink-0" />
        <span>{teksSetuju}</span>
      </label>

      {galat && <p className="text-sm font-semibold text-rose-600" role="alert">{galat}</p>}

      <button
        type="submit"
        disabled={!setuju || mengirim}
        className="w-full inline-flex items-center justify-center gap-2 rounded-xl py-3.5 font-extrabold text-base transition bg-teal-700 hover:bg-teal-800 text-white disabled:bg-slate-200 disabled:text-slate-500 disabled:cursor-not-allowed"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M21 11.5a8.4 8.4 0 0 1-12.5 7.4L3 21l2.1-5.4A8.4 8.4 0 1 1 21 11.5z" />
        </svg>
        {mengirim ? "Menyimpan pesanan..." : setuju ? "Kirim pesanan via WhatsApp" : "Centang persetujuan dulu"}
      </button>
      {!nomorTujuan && (
        <p className="text-xs text-slate-500">Nomor WhatsApp Sumitra sedang diperbarui. Pesananmu tetap tercatat dan admin akan menghubungimu.</p>
      )}
      <p className="text-[13px] leading-relaxed text-slate-500">
        Formulir ini menggantikan formulir kertas. Data pesanan dikirim ke admin Sumitra lewat WhatsApp. Pembayaran tidak dilakukan di website.
      </p>
    </form>
  );
}
