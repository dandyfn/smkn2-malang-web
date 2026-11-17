// Tata letak semua halaman Sumitra: huruf Plus Jakarta Sans (disimpan di proyek, tanpa Google Fonts)
import "@fontsource-variable/plus-jakarta-sans";

export default function SumitraLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-white text-slate-900 antialiased" style={{ fontFamily: "'Plus Jakarta Sans Variable', system-ui, sans-serif" }}>
      {children}
    </div>
  );
}
