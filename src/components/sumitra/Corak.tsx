// Corak latar belakang section halaman /sumitra (sesuai rancangan di kanvas desain).
// Semua dekoratif: aria-hidden dan tidak menangkap klik.

const lapisan = "absolute inset-0 w-full h-full pointer-events-none";

const PIN = "M0 0 C -9 -12 -14 -20 -14 -27 A 14 14 0 1 1 14 -27 C 14 -20 9 -12 0 0Z";

/** Rute perjalanan putus-putus dengan pin lokasi (section Paket & hero tanpa foto). */
export function CorakRute({ terang = false }: { terang?: boolean }) {
  const garisA = terang ? "#fbbf24" : "#f59e0b";
  const garisB = terang ? "#5eead4" : "#0f766e";
  return (
    <svg aria-hidden="true" viewBox="0 0 1200 600" preserveAspectRatio="xMidYMid slice" className={lapisan}>
      <path d="M-20 520 C 180 420 300 580 480 470 S 760 230 960 300 S 1150 160 1240 120" fill="none"
        stroke={garisA} strokeOpacity={terang ? 0.4 : 0.55} strokeWidth="3" strokeLinecap="round" strokeDasharray="2 12" />
      <path d="M-20 140 C 200 60 420 200 640 110 S 1000 40 1240 70" fill="none"
        stroke={garisB} strokeOpacity={terang ? 0.3 : 0.25} strokeWidth="2" strokeLinecap="round" strokeDasharray="2 10" />
      <g fill={garisB} fillOpacity={terang ? 0.3 : 0.22}>
        <path transform="translate(480 470)" d={PIN} />
        <path transform="translate(960 300)" d={PIN} />
        <path transform="translate(640 110)" d={PIN} />
      </g>
      <g fill={terang ? "#0f172a" : "#ffffff"}>
        <circle cx="480" cy="443" r="5" />
        <circle cx="960" cy="273" r="5" />
        <circle cx="640" cy="83" r="5" />
      </g>
    </svg>
  );
}

const BINTANG = "M0 -150 L20 -20 L150 0 L20 20 L0 150 L-20 20 L-150 0 L-20 -20Z";

/** Mata angin / kompas (section Layanan Lain). */
export function CorakKompas() {
  return (
    <svg aria-hidden="true" viewBox="0 0 1200 600" preserveAspectRatio="xMidYMid slice" className={lapisan}>
      <g fill="none" stroke="#b45309" strokeOpacity="0.18" strokeWidth="1.5">
        <g transform="translate(1070 160)">
          <circle r="190" />
          <circle r="165" strokeDasharray="2 6" />
          <circle r="40" />
          <path d={BINTANG} />
          <path transform="rotate(45) scale(0.6)" d={BINTANG} />
          <g fill="#b45309" fillOpacity="0.3" stroke="none" fontSize="16" fontWeight="800" textAnchor="middle">
            <text y="-170">U</text>
            <text y="184">S</text>
            <text x="177" y="6">T</text>
            <text x="-177" y="6">B</text>
          </g>
        </g>
        <g transform="translate(90 540) scale(0.55) rotate(20)">
          <circle r="190" />
          <circle r="165" strokeDasharray="2 6" />
          <path d={BINTANG} />
          <path transform="rotate(45) scale(0.6)" d={BINTANG} />
        </g>
      </g>
    </svg>
  );
}

/** Tepi amplop pos udara, tanda kutip, perangko & cap pos (section Testimoni). */
export function CorakPos() {
  return (
    <>
      <svg aria-hidden="true" className={lapisan}>
        <defs>
          <pattern id="sumitra-pos-udara" width="56" height="14" patternUnits="userSpaceOnUse" patternTransform="rotate(-45)">
            <rect width="14" height="14" fill="#0f766e" fillOpacity="0.35" />
            <rect x="28" width="14" height="14" fill="#f59e0b" fillOpacity="0.45" />
          </pattern>
        </defs>
        <rect width="100%" height="12" fill="url(#sumitra-pos-udara)" />
      </svg>
      <svg aria-hidden="true" className="absolute left-0 right-0 bottom-0 w-full h-3 pointer-events-none">
        <rect width="100%" height="12" fill="url(#sumitra-pos-udara)" />
      </svg>
      <svg aria-hidden="true" viewBox="0 0 1200 600" preserveAspectRatio="xMidYMid slice" className={lapisan}>
        <g fill="#0f766e" fillOpacity="0.07" fontFamily="Georgia, serif" fontWeight="700">
          <text x="960" y="260" fontSize="360">&#8221;</text>
          <text x="20" y="620" fontSize="260">&#8220;</text>
        </g>
        <g fill="none" stroke="#0f766e" strokeOpacity="0.18" strokeWidth="1.5">
          <g transform="translate(1110 470) rotate(8)">
            <rect x="-44" y="-54" width="88" height="108" rx="4" strokeDasharray="4 4" />
            <rect x="-34" y="-44" width="68" height="88" rx="2" />
          </g>
          <g transform="translate(1010 520) rotate(-6)">
            <circle r="36" />
            <path d="M-60 -8 q 10 -8 20 0 t 20 0 t 20 0 t 20 0 t 20 0 t 20 0" />
            <path d="M-60 8 q 10 -8 20 0 t 20 0 t 20 0 t 20 0 t 20 0 t 20 0" />
          </g>
        </g>
      </svg>
    </>
  );
}

/** Pola titik-titik halus (section Mitra). */
export function CorakTitik() {
  return (
    <svg aria-hidden="true" className={lapisan}>
      <defs>
        <pattern id="sumitra-titik" width="22" height="22" patternUnits="userSpaceOnUse">
          <circle cx="2" cy="2" r="1.6" fill="#0f766e" fillOpacity="0.2" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#sumitra-titik)" />
    </svg>
  );
}
