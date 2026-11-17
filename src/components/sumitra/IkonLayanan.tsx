// Ikon garis untuk setiap layanan Sumitra (dipakai di halaman publik dan panel admin)
import type { IkonLayanan as Jenis } from "@/data/sumitra";

const JALUR: Record<Jenis, React.ReactNode> = {
  pemandu: (
    <>
      <path d="M5 21V4" />
      <path d="M5 4h12l-2.5 4L17 12H5" />
      <circle cx="18" cy="18" r="2.5" />
      <path d="M14 21c0-2 1.8-3.5 4-3.5s4 1.5 4 3.5" />
    </>
  ),
  mobil: (
    <>
      <path d="M3 16v-3l2-5h14l2 5v3z" />
      <path d="M5 11h14" />
      <circle cx="7.5" cy="17.5" r="2" />
      <circle cx="16.5" cy="17.5" r="2" />
    </>
  ),
  pesawat: (
    <>
      <path d="M2 20h20" />
      <path d="M3 13.5l3 1 3.5-1L8 7l2 .5 4 5.5 5-1.3a2 2 0 0 1 1 3.8L5.5 18 2.5 14z" />
    </>
  ),
  tiket: (
    <>
      <path d="M3 8a2 2 0 0 0 2-2h14a2 2 0 0 0 2 2v2a2 2 0 0 0 0 4v2a2 2 0 0 0-2 2H5a2 2 0 0 0-2-2v-2a2 2 0 0 0 0-4z" />
      <path d="M15 6v12" strokeDasharray="2 2.5" />
    </>
  ),
  trail: (
    <>
      <circle cx="5" cy="17" r="3" />
      <circle cx="19" cy="17" r="3" />
      <path d="M5 17l4-6h6l4 6" />
      <path d="M9 11L7.5 8H5" />
      <path d="M15 11l1.5-4H19" />
    </>
  ),
  kereta: (
    <>
      <rect x="5" y="3" width="14" height="14" rx="3" />
      <path d="M5 11h14" />
      <path d="M8 21l2-4M16 21l-2-4" />
    </>
  ),
};

export default function IkonLayanan({ ikon, className = "w-6 h-6" }: { ikon: Jenis; className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
    >
      {JALUR[ikon] ?? JALUR.pemandu}
    </svg>
  );
}
