"use client";

import { useEffect, useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { supabase } from "@/lib/supabase";
import { 
  ChevronLeft, 
  ChevronRight, 
  Calendar as CalendarIcon, 
  X, 
  Clock, 
  Info,
  Loader2
} from "lucide-react";

interface EventAkademik {
  id: string;
  judul: string;
  tanggal: string; // YYYY-MM-DD
  tanggal_selesai: string; // YYYY-MM-DD
  kategori: "Ujian" | "Kegiatan" | "Libur" | "Pengumuman";
  jam_mulai?: string;
  jam_selesai?: string;
  deskripsi?: string;
}

export default function KalenderAkademikPage() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [events, setEvents] = useState<EventAkademik[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDateEvents, setSelectedDateEvents] = useState<EventAkademik[] | null>(null);
  const [activeDateStr, setActiveDateStr] = useState<string>("");

  useEffect(() => {
    const fetchEvents = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from("kalender")
        .select("*")
        .order("tanggal", { ascending: true });

      if (!error && data) {
        setEvents(data);
      }
      setLoading(false);
    };

    fetchEvents();
  }, []);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const monthNames = [
    "Januari", "Februari", "Maret", "April", "Mei", "Juni",
    "Juli", "Agustus", "September", "Oktober", "November", "Desember"
  ];

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayIndex = new Date(year, month, 1).getDay(); // 0 = Minggu

  const handlePrevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
  const handleNextMonth = () => setCurrentDate(new Date(year, month + 1, 1));

  const formatDateString = (day: number) => {
    const m = (month + 1).toString().padStart(2, "0");
    const d = day.toString().padStart(2, "0");
    return `${year}-${m}-${d}`;
  };

  // Fungsi pengecekan apakah tanggal tertentu berada di dalam rentang agenda
  const getEventsForDate = (dateStr: string) => {
    return events.filter((e) => {
      const start = e.tanggal;
      const end = e.tanggal_selesai || e.tanggal;
      return dateStr >= start && dateStr <= end;
    });
  };

  const handleDateClick = (day: number) => {
    const dateStr = formatDateString(day);
    const dayEvents = getEventsForDate(dateStr);
    setActiveDateStr(`${day} ${monthNames[month]} ${year}`);
    setSelectedDateEvents(dayEvents);
  };

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
        
        {/* HEADER SECTION */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200 shadow-xs">
          <div className="space-y-1">
            <span className="text-xs font-bold text-amber-600 uppercase tracking-widest bg-amber-50 px-3 py-1 rounded-full border border-amber-200 inline-block">
              AKADEMIK & KEGIATAN
            </span>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900">
              Kalender Akademik SMKN 2 Malang
            </h1>
            <p className="text-xs sm:text-sm text-slate-500">
              Klik pada tanggal untuk melihat rincian agenda dan kegiatan sekolah.
            </p>
          </div>
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
          {loading ? (
            <div className="flex flex-col items-center justify-center py-24 space-y-3">
              <Loader2 className="w-8 h-8 text-amber-500 animate-spin" />
              <p className="text-xs text-slate-500 font-medium">Memuat agenda kalender...</p>
            </div>
          ) : (
            <div className="grid grid-cols-7 auto-rows-fr gap-px bg-slate-100">
              
              {/* Slot Kosong Bulan Sebelumnya */}
              {Array.from({ length: firstDayIndex }).map((_, idx) => (
                <div key={`empty-${idx}`} className="bg-white min-h-[100px] sm:min-h-[120px] p-2 opacity-30 pointer-events-none" />
              ))}

              {/* Cell Hari Bulan Ini */}
              {Array.from({ length: daysInMonth }).map((_, idx) => {
                const dayNum = idx + 1;
                const dateStr = formatDateString(dayNum);
                const dayEvents = getEventsForDate(dateStr);
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
          )}

        </div>

      </main>

      {/* POPUP MODAL: RINCIAN AGENDA */}
      {selectedDateEvents !== null && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-slate-200 max-w-lg w-full p-6 shadow-2xl space-y-6">
            
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
                      <span>
                        {ev.jam_mulai ? `${ev.jam_mulai} ${ev.jam_selesai ? `- ${ev.jam_selesai}` : ""} WIB` : "Seharian"}
                      </span>
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

      <Footer />
    </div>
  );
}