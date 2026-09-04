"use client";

import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { 
  ChevronLeft, 
  ChevronRight, 
  Calendar as CalendarIcon, 
  Plus, 
  X, 
  Clock, 
  Tag,
  Info
} from "lucide-react";

// Tipe Data Event
interface EventAkademik {
  id: string;
  tanggal: string; // Format: YYYY-MM-DD
  judul: string;
  kategori: "Ujian" | "Kegiatan" | "Libur" | "Pengumuman";
  waktu?: string;
  deskripsi?: string;
}

// Sample Data Awal Kalender Akademik
const INITIAL_EVENTS: EventAkademik[] = [
  {
    id: "1",
    tanggal: "2026-09-07",
    judul: "Penilaian Tengah Semester (PTS) Ganjil",
    kategori: "Ujian",
    waktu: "07.00 - 12.00 WIB",
    deskripsi: "Pelaksanaan PTS Ganjil untuk seluruh siswa kelas X, XI, dan XII."
  },
  {
    id: "2",
    tanggal: "2026-09-15",
    judul: "Workshop Keahlian & Industri (Guru & Siswa)",
    kategori: "Kegiatan",
    waktu: "08.00 - 15.00 WIB",
    deskripsi: "Peningkatan kompetensi keahlian bersama mitra industri nasional."
  },
  {
    id: "3",
    tanggal: "2026-09-28",
    judul: "Libur Maulid Nabi Muhammad SAW",
    kategori: "Libur",
    waktu: "Seharian",
    deskripsi: "Hari libur nasional keagamaan."
  }
];

export default function KalenderAkademikPage() {
  const [currentDate, setCurrentDate] = useState(new Date(2026, 8, 1)); // September 2026
  const [events, setEvents] = useState<EventAkademik[]>(INITIAL_EVENTS);
  const [selectedDateEvents, setSelectedDateEvents] = useState<EventAkademik[] | null>(null);
  const [activeDateStr, setActiveDateStr] = useState<string>("");
  
  // State Form Simulasi Tambah Event (Admin)
  const [showAddModal, setShowAddModal] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newDate, setNewDate] = useState("");
  const [newCategory, setNewCategory] = useState<EventAkademik["kategori"]>("Kegiatan");
  const [newTime, setNewTime] = useState("");
  const [newDesc, setNewDesc] = useState("");

  // Helper Tanggal
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const monthNames = [
    "Januari", "Februari", "Maret", "April", "Mei", "Juni",
    "Juli", "Agustus", "September", "Oktober", "November", "Desember"
  ];

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayIndex = new Date(year, month, 1).getDay(); // 0 = Minggu

  // Navigasi Bulan
  const handlePrevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
  const handleNextMonth = () => setCurrentDate(new Date(year, month + 1, 1));

  // Format Helper ke YYYY-MM-DD
  const formatDateString = (day: number) => {
    const m = (month + 1).toString().padStart(2, "0");
    const d = day.toString().padStart(2, "0");
    return `${year}-${m}-${d}`;
  };

  // Handler Klik Tanggal
  const handleDateClick = (day: number) => {
    const dateStr = formatDateString(day);
    const dayEvents = events.filter((e) => e.tanggal === dateStr);
    setActiveDateStr(`${day} ${monthNames[month]} ${year}`);
    setSelectedDateEvents(dayEvents);
  };

  // Handler Tambah Event Baru (Simulasi)
  const handleAddEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle || !newDate) return;

    const newEventItem: EventAkademik = {
      id: Date.now().toString(),
      judul: newTitle,
      tanggal: newDate,
      kategori: newCategory,
      waktu: newTime || "Seharian",
      deskripsi: newDesc || "Tidak ada deskripsi tambahan."
    };

    setEvents([...events, newEventItem]);
    setShowAddModal(false);
    // Reset Form
    setNewTitle("");
    setNewDate("");
    setNewTime("");
    setNewDesc("");
  };

  // Badge Kategori Styling
  const getBadgeStyle = (kategori: EventAkademik["kategori"]) => {
    switch (kategori) {
      case "Ujian":
        return "bg-amber-100 text-amber-800 border-amber-300";
      case "Kegiatan":
        return "bg-blue-100 text-blue-800 border-blue-300";
      case "Libur":
        return "bg-rose-100 text-rose-800 border-rose-300";
      default:
        return "bg-emerald-100 text-emerald-800 border-emerald-300";
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800">
      <Header />

      <main className="flex-1 py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full space-y-8">
        
        {/* HEADER & SIMULASI TOMBOL TAMBAH AGENDA */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200 shadow-xs">
          <div className="space-y-1">
            <span className="text-xs font-bold text-amber-600 uppercase tracking-widest bg-amber-50 px-3 py-1 rounded-full border border-amber-200">
              AKADEMIK & KEGIATAN
            </span>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900">
              Kalender Akademik SMKN 2 Malang
            </h1>
            <p className="text-xs sm:text-sm text-slate-500">
              Klik pada tanggal untuk melihat rincian agenda dan kegiatan sekolah.
            </p>
          </div>

          <button
            onClick={() => setShowAddModal(true)}
            className="inline-flex items-center justify-center gap-2 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold px-5 py-3 rounded-2xl transition shadow-sm text-sm shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Tambah Agenda (Admin)</span>
          </button>
        </div>

        {/* KALENDER INTERAKTIF */}
        <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm">
          
          {/* NAVIGASI BULAN */}
          <div className="p-6 border-b border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <CalendarIcon className="w-6 h-6 text-amber-600" />
              <h2 className="text-xl font-extrabold text-slate-900">
                {monthNames[month]} {year}
              </h2>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handlePrevMonth}
                className="p-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-600 transition"
                title="Bulan Sebelumnya"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={handleNextMonth}
                className="p-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-600 transition"
                title="Bulan Berikutnya"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* NAMA HARI */}
          <div className="grid grid-cols-7 border-b border-slate-100 bg-slate-50 text-center text-xs font-bold text-slate-500 py-3">
            <span className="text-rose-600">Ming</span>
            <span>Sen</span>
            <span>Sel</span>
            <span>Rab</span>
            <span>Kam</span>
            <span>Jum</span>
            <span>Sab</span>
          </div>

          {/* GRID TANGGAL */}
          <div className="grid grid-cols-7 auto-rows-fr gap-px bg-slate-100">
            
            {/* Slot Kosong Bulan Sebelumnya */}
            {Array.from({ length: firstDayIndex }).map((_, idx) => (
              <div key={`empty-${idx}`} className="bg-white min-h-[100px] sm:min-h-[120px] p-2 opacity-30 pointer-events-none" />
            ))}

            {/* Cell Hari Bulan Ini */}
            {Array.from({ length: daysInMonth }).map((_, idx) => {
              const dayNum = idx + 1;
              const dateStr = formatDateString(dayNum);
              const dayEvents = events.filter((e) => e.tanggal === dateStr);
              const isToday = new Date().toDateString() === new Date(year, month, dayNum).toDateString();

              return (
                <div
                  key={dayNum}
                  onClick={() => handleDateClick(dayNum)}
                  className={`bg-white min-h-[100px] sm:min-h-[120px] p-2 flex flex-col justify-between hover:bg-amber-50/40 transition cursor-pointer group relative`}
                >
                  {/* Angka Tanggal */}
                  <div className="flex justify-between items-center">
                    <span
                      className={`text-xs sm:text-sm font-bold w-7 h-7 flex items-center justify-center rounded-full ${
                        isToday 
                          ? "bg-amber-500 text-slate-950 shadow-xs" 
                          : "text-slate-700 group-hover:text-amber-600"
                      }`}
                    >
                      {dayNum}
                    </span>
                    {dayEvents.length > 0 && (
                      <span className="w-2 h-2 rounded-full bg-amber-500 sm:hidden" />
                    )}
                  </div>

                  {/* List Event Singkat di Kalender */}
                  <div className="space-y-1 mt-1 hidden sm:block">
                    {dayEvents.slice(0, 2).map((ev) => (
                      <div
                        key={ev.id}
                        className={`text-[10px] p-1.5 rounded-lg border leading-tight truncate font-semibold ${getBadgeStyle(ev.kategori)}`}
                      >
                        {ev.judul}
                      </div>
                    ))}
                    {dayEvents.length > 2 && (
                      <span className="text-[10px] text-slate-400 font-bold block px-1">
                        +{dayEvents.length - 2} agenda lagi
                      </span>
                    )}
                  </div>
                </div>
              );
            })}

          </div>

        </div>

      </main>

      {/* POPUP MODAL: RINCIAN AGENDA (VISITOR CLICK) */}
      {selectedDateEvents !== null && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-slate-200 max-w-lg w-full p-6 shadow-2xl space-y-6 animate-in fade-in zoom-in duration-200">
            
            <div className="flex justify-between items-center border-b border-slate-100 pb-4">
              <div>
                <span className="text-xs font-bold text-amber-600">AGENDA HARI INI</span>
                <h3 className="text-lg font-black text-slate-900">{activeDateStr}</h3>
              </div>
              <button
                onClick={() => setSelectedDateEvents(null)}
                className="p-2 rounded-xl text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* DAFTAR KEGIATAN */}
            <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
              {selectedDateEvents.length > 0 ? (
                selectedDateEvents.map((ev) => (
                  <div key={ev.id} className="p-4 rounded-2xl border border-slate-200 bg-slate-50 space-y-2">
                    <div className="flex justify-between items-start gap-2">
                      <h4 className="font-bold text-slate-900 text-sm leading-snug">{ev.judul}</h4>
                      <span className={`text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full border shrink-0 ${getBadgeStyle(ev.kategori)}`}>
                        {ev.kategori}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
                      <Clock className="w-3.5 h-3.5 text-amber-600" />
                      <span>{ev.waktu}</span>
                    </div>

                    {ev.deskripsi && (
                      <p className="text-xs text-slate-600 leading-relaxed pt-1 border-t border-slate-200/60">
                        {ev.deskripsi}
                      </p>
                    )}
                  </div>
                ))
              ) : (
                <div className="text-center py-8 space-y-2">
                  <Info className="w-8 h-8 text-slate-300 mx-auto" />
                  <p className="text-sm text-slate-500">Tidak ada kegiatan/agenda pada tanggal ini.</p>
                </div>
              )}
            </div>

            <button
              onClick={() => setSelectedDateEvents(null)}
              className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl transition"
            >
              Tutup
            </button>

          </div>
        </div>
      )}

      {/* POPUP MODAL: FORM TAMBAH AGENDA (ADMIN) */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-slate-200 max-w-md w-full p-6 shadow-2xl space-y-6">
            
            <div className="flex justify-between items-center border-b border-slate-100 pb-4">
              <h3 className="text-lg font-black text-slate-900">Tambah Agenda Baru</h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-2 rounded-xl text-slate-400 hover:bg-slate-100 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddEvent} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">Nama Agenda / Kegiatan</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Rapat Wali Murid"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700">Tanggal</label>
                  <input
                    type="date"
                    required
                    value={newDate}
                    onChange={(e) => setNewDate(e.target.value)}
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700">Kategori</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value as EventAkademik["kategori"])}
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-amber-500"
                  >
                    <option value="Ujian">Ujian</option>
                    <option value="Kegiatan">Kegiatan</option>
                    <option value="Libur">Libur</option>
                    <option value="Pengumuman">Pengumuman</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">Waktu (Opsional)</label>
                <input
                  type="text"
                  placeholder="Contoh: 08.00 - 12.00 WIB"
                  value={newTime}
                  onChange={(e) => setNewTime(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">Deskripsi Ringkas</label>
                <textarea
                  rows={3}
                  placeholder="Keterangan singkat kegiatan..."
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="pt-2 flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs rounded-xl transition"
                >
                  Simpan Agenda
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}