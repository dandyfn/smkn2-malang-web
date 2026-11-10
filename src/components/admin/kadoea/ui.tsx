// Komponen kecil yang dipakai bersama oleh ketiga panel admin KADOEA
import { Pencil, Trash2 } from "lucide-react";

export const inputCls =
  "w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 transition";

export type Msg = { type: "ok" | "err"; text: string } | null;

export function Pesan({ msg }: { msg: Msg }) {
  if (!msg) return null;
  return (
    <p className={`text-xs font-semibold ${msg.type === "ok" ? "text-emerald-400" : "text-rose-400"}`}>{msg.text}</p>
  );
}

export function StatusBadge({ tayang }: { tayang: boolean }) {
  return (
    <span
      className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-md ${
        tayang ? "bg-emerald-500/15 text-emerald-400" : "bg-slate-800 text-slate-400"
      }`}
    >
      {tayang ? "Tayang" : "Disembunyikan"}
    </span>
  );
}

// Tombol aksi di setiap baris daftar: tayangkan/sembunyikan, edit, hapus
export function AksiBaris({
  tayang, onToggle, onEdit, onHapus,
}: { tayang: boolean; onToggle: () => void; onEdit: () => void; onHapus: () => void }) {
  return (
    <div className="flex gap-2 shrink-0">
      <button onClick={onToggle} className="px-3 py-1.5 text-xs font-semibold border border-slate-700 text-slate-300 rounded-lg hover:bg-slate-800">
        {tayang ? "Sembunyikan" : "Tayangkan"}
      </button>
      <button onClick={onEdit} className="p-2 border border-slate-700 rounded-lg hover:bg-slate-800" aria-label="Edit">
        <Pencil className="w-4 h-4 text-slate-300" />
      </button>
      <button onClick={onHapus} className="p-2 border border-red-500/30 rounded-lg hover:bg-red-500/10" aria-label="Hapus">
        <Trash2 className="w-4 h-4 text-red-400" />
      </button>
    </div>
  );
}

// Baris centang "Tayangkan" + input urutan, dipakai di semua formulir
export function TayangDanUrutan({
  tayang, urutan, onTayang, onUrutan,
}: { tayang: boolean; urutan: number; onTayang: (v: boolean) => void; onUrutan: (v: number) => void }) {
  return (
    <div className="flex flex-wrap items-center gap-4">
      <label className="inline-flex items-center gap-2 text-sm text-slate-300">
        <input type="checkbox" checked={tayang} onChange={(e) => onTayang(e.target.checked)} />
        Tayangkan di halaman KADOEA
      </label>
      <label className="inline-flex items-center gap-2 text-sm text-slate-300">
        Urutan
        <input
          type="number"
          className="w-20 bg-slate-950 border border-slate-700 rounded-lg p-1.5 text-sm text-white"
          value={urutan}
          onChange={(e) => onUrutan(Number(e.target.value))}
        />
        <span className="text-xs text-slate-500">(kecil tampil lebih dulu)</span>
      </label>
    </div>
  );
}
