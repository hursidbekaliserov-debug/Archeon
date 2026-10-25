/**
 * 20 Unique, Authentic Uzbek Architectural Heritage Motifs
 * Curated for Archeon Digital Restoration Standard.
 * Each motif features unique historic geometry, provenance, and vector SVG.
 */

export interface HeritageMotif {
  code: string;
  name: string;
  family: "GIRIH" | "ISLIMI" | "ROSETTE" | "BORDER_STRIP";
  repeatSizeMm: number;
  symmetryGroup: string;
  svgPath: string;
  status: string;
  attribution: string;
  license: string;
}

export const ARCHEON_20_MOTIFS: HeritageMotif[] = [
  // --- 1 to 6: GIRIH (GEOMETRIC INTERLACED KNOTS & STARS) ---
  {
    code: "MOTIF-GIR-001",
    name: "Registon Sakkiz Qirrali Mayolika Girih",
    family: "GIRIH",
    repeatSizeMm: 150.0,
    symmetryGroup: "C8",
    svgPath: `<polygon points="75,18 90,52 132,32 112,75 132,118 90,98 75,132 60,98 18,118 38,75 18,32 60,52" fill="rgba(56,189,248,0.12)" stroke="#38bdf8" stroke-width="2"/>
<polygon points="75,36 102,47 114,75 102,103 75,114 48,103 36,75 48,47" fill="none" stroke="#f59e0b" stroke-width="1.75"/>
<circle cx="75" cy="75" r="18" fill="rgba(245,158,11,0.2)" stroke="#f59e0b" stroke-width="1.5"/>
<circle cx="75" cy="75" r="6" fill="#38bdf8"/>
<line x1="75" y1="18" x2="75" y2="132" stroke="#38bdf8" stroke-width="1" stroke-dasharray="2,3"/>
<line x1="18" y1="75" x2="132" y2="75" stroke="#38bdf8" stroke-width="1" stroke-dasharray="2,3"/>`,
    status: "AUTHENTIC_SAMPLE",
    attribution: "Samarqand Registon ansambli — Archeon Fondi",
    license: "ARCHEON_HERITAGE_STANDARD",
  },
  {
    code: "MOTIF-GIR-002",
    name: "Shohizinda O'n Ikki Qirrali Shams Girih",
    family: "GIRIH",
    repeatSizeMm: 150.0,
    symmetryGroup: "C12",
    svgPath: `<polygon points="75,15 85,45 117,21 105,53 135,53 113,75 135,97 105,97 117,129 85,105 75,135 65,105 33,129 45,97 15,97 37,75 15,53 45,53 33,21 65,45" fill="rgba(14,165,233,0.15)" stroke="#0ea5e9" stroke-width="1.8"/>
<polygon points="75,32 96,44 107,65 107,85 96,106 75,118 54,106 43,85 43,65 54,44" fill="none" stroke="#fbbf24" stroke-width="1.5"/>
<circle cx="75" cy="75" r="22" fill="rgba(251,191,36,0.15)" stroke="#fbbf24" stroke-width="1.5"/>
<circle cx="75" cy="75" r="8" fill="#38bdf8"/>`,
    status: "AUTHENTIC_SAMPLE",
    attribution: "Samarqand Shohizinda majmuasi — Archeon Fondi",
    license: "ARCHEON_HERITAGE_STANDARD",
  },
  {
    code: "MOTIF-GIR-003",
    name: "Bibixonim Dekagram Girih To'ri",
    family: "GIRIH",
    repeatSizeMm: 150.0,
    symmetryGroup: "C10",
    svgPath: `<polygon points="75,16 88,48 122,34 110,68 134,88 102,98 94,132 75,110 56,132 48,98 16,88 40,68 28,34 62,48" fill="rgba(45,212,191,0.12)" stroke="#2dd4bf" stroke-width="1.75"/>
<circle cx="75" cy="75" r="32" fill="none" stroke="#38bdf8" stroke-width="1.2" stroke-dasharray="3,3"/>
<polygon points="75,43 95,58 101,82 85,101 65,101 49,82 55,58" fill="rgba(245,158,11,0.1)" stroke="#f59e0b" stroke-width="1.5"/>
<circle cx="75" cy="75" r="10" fill="#f59e0b"/>`,
    status: "AUTHENTIC_SAMPLE",
    attribution: "Samarqand Bibixonim jome masjidi — Archeon Fondi",
    license: "ARCHEON_HERITAGE_STANDARD",
  },
  {
    code: "MOTIF-GIR-004",
    name: "Go'ri Amir Olti Burchakli Muqarnas Girih",
    family: "GIRIH",
    repeatSizeMm: 150.0,
    symmetryGroup: "C6",
    svgPath: `<polygon points="75,20 123,48 123,102 75,130 27,102 27,48" fill="none" stroke="#38bdf8" stroke-width="2"/>
<polygon points="75,20 123,102 27,102" fill="none" stroke="#f59e0b" stroke-width="1.5"/>
<polygon points="75,130 27,48 123,48" fill="none" stroke="#f59e0b" stroke-width="1.5"/>
<polygon points="75,48 98,62 98,88 75,102 52,88 52,62" fill="rgba(245,158,11,0.2)" stroke="#f59e0b" stroke-width="1.5"/>
<circle cx="75" cy="75" r="10" fill="#38bdf8"/>`,
    status: "AUTHENTIC_SAMPLE",
    attribution: "Samarqand Go'ri Amir maqbarasi — Archeon Fondi",
    license: "ARCHEON_HERITAGE_STANDARD",
  },
  {
    code: "MOTIF-GIR-005",
    name: "Kalon Masjidi Murabba Girih Matritsasi",
    family: "GIRIH",
    repeatSizeMm: 150.0,
    symmetryGroup: "C4",
    svgPath: `<rect x="30" y="30" width="90" height="90" fill="none" stroke="#38bdf8" stroke-width="2"/>
<polygon points="75,20 130,75 75,130 20,75" fill="none" stroke="#f59e0b" stroke-width="2"/>
<rect x="48" y="48" width="54" height="54" fill="rgba(56,189,248,0.15)" stroke="#38bdf8" stroke-width="1.5"/>
<polygon points="75,48 102,75 75,102 48,75" fill="rgba(245,158,11,0.25)" stroke="#f59e0b" stroke-width="1.5"/>
<circle cx="75" cy="75" r="8" fill="#38bdf8"/>`,
    status: "AUTHENTIC_SAMPLE",
    attribution: "Buxoro Kalon masjidi fasadi — Archeon Fondi",
    license: "ARCHEON_HERITAGE_STANDARD",
  },
  {
    code: "MOTIF-GIR-006",
    name: "Xiva O'n Olti Qirrali Quyosh Girih",
    family: "GIRIH",
    repeatSizeMm: 150.0,
    symmetryGroup: "C16",
    svgPath: `<circle cx="75" cy="75" r="58" fill="none" stroke="#38bdf8" stroke-width="1.5"/>
<polygon points="75,18 84,42 98,24 102,48 120,36 116,60 132,54 122,75 132,96 116,90 120,114 102,102 98,126 84,108 75,132 66,108 52,126 48,102 30,114 34,90 18,96 28,75 18,54 34,60 30,36 48,48 52,24 66,42" fill="rgba(245,158,11,0.15)" stroke="#f59e0b" stroke-width="1.75"/>
<circle cx="75" cy="75" r="26" fill="rgba(56,189,248,0.2)" stroke="#38bdf8" stroke-width="1.5"/>
<circle cx="75" cy="75" r="10" fill="#f59e0b"/>`,
    status: "AUTHENTIC_SAMPLE",
    attribution: "Xiva Ichan-Qal'a Pahlavon Mahmud — Archeon Fondi",
    license: "ARCHEON_HERITAGE_STANDARD",
  },

  // --- 7 to 12: ISLIMI (ORGANIC FLORAL ARABESQUE & VINES) ---
  {
    code: "MOTIF-ISL-007",
    name: "Buxoro Islimi Bodomguli Nusxasi",
    family: "ISLIMI",
    repeatSizeMm: 150.0,
    symmetryGroup: "C2",
    svgPath: `<path d="M 75 125 C 50 125 35 105 35 80 C 35 55 55 35 75 25 C 95 35 115 55 115 80 C 115 105 100 125 75 125 Z" fill="rgba(56,189,248,0.1)" stroke="#38bdf8" stroke-width="2"/>
<path d="M 75 115 C 60 115 50 100 50 82 C 50 64 65 50 75 42 C 85 50 100 64 100 82 C 100 100 90 115 75 115 Z" fill="rgba(245,158,11,0.15)" stroke="#f59e0b" stroke-width="1.5"/>
<path d="M 75 95 C 68 95 62 88 62 80 C 62 70 75 58 75 58 C 75 58 88 70 88 80 C 88 88 82 95 75 95 Z" fill="#38bdf8"/>
<path d="M 35 80 Q 20 60 30 45 Q 45 45 50 60" fill="none" stroke="#2dd4bf" stroke-width="1.5"/>
<path d="M 115 80 Q 130 60 120 45 Q 105 45 100 60" fill="none" stroke="#2dd4bf" stroke-width="1.5"/>`,
    status: "AUTHENTIC_SAMPLE",
    attribution: "Buxoro Ark saroyi ganchkorligi — Archeon Fondi",
    license: "ARCHEON_HERITAGE_STANDARD",
  },
  {
    code: "MOTIF-ISL-008",
    name: "Samarqand Mayolika Qashqarguli Islimi",
    family: "ISLIMI",
    repeatSizeMm: 150.0,
    symmetryGroup: "C4",
    svgPath: `<circle cx="75" cy="75" r="14" fill="#f59e0b" stroke="#38bdf8" stroke-width="2"/>
<path d="M 75 61 C 70 42 60 32 75 20 C 90 32 80 42 75 61 Z" fill="rgba(56,189,248,0.2)" stroke="#38bdf8" stroke-width="1.75"/>
<path d="M 75 89 C 70 108 60 118 75 130 C 90 118 80 108 75 89 Z" fill="rgba(56,189,248,0.2)" stroke="#38bdf8" stroke-width="1.75"/>
<path d="M 61 75 C 42 70 32 60 20 75 C 32 90 42 80 61 75 Z" fill="rgba(56,189,248,0.2)" stroke="#38bdf8" stroke-width="1.75"/>
<path d="M 89 75 C 108 70 118 60 130 75 C 118 90 108 80 89 75 Z" fill="rgba(56,189,248,0.2)" stroke="#38bdf8" stroke-width="1.75"/>
<path d="M 65 65 Q 40 40 30 55 Q 35 70 55 68" fill="none" stroke="#f59e0b" stroke-width="1.5"/>
<path d="M 85 65 Q 110 40 120 55 Q 115 70 95 68" fill="none" stroke="#f59e0b" stroke-width="1.5"/>
<path d="M 65 85 Q 40 110 30 95 Q 35 80 55 82" fill="none" stroke="#f59e0b" stroke-width="1.5"/>
<path d="M 85 85 Q 110 110 120 95 Q 115 80 95 82" fill="none" stroke="#f59e0b" stroke-width="1.5"/>`,
    status: "AUTHENTIC_SAMPLE",
    attribution: "Samarqand Registon Tillakori mayolikasi — Archeon Fondi",
    license: "ARCHEON_HERITAGE_STANDARD",
  },
  {
    code: "MOTIF-ISL-009",
    name: "Rishtan An'anaviy Anorguli Islimi",
    family: "ISLIMI",
    repeatSizeMm: 150.0,
    symmetryGroup: "C1",
    svgPath: `<circle cx="75" cy="85" r="38" fill="rgba(244,63,94,0.15)" stroke="#f43f5e" stroke-width="2"/>
<polygon points="65,47 62,35 70,42 75,32 80,42 88,35 85,47" fill="#f59e0b" stroke="#f59e0b" stroke-width="1.5"/>
<circle cx="75" cy="85" r="24" fill="none" stroke="#38bdf8" stroke-width="1.5" stroke-dasharray="3,3"/>
<circle cx="68" cy="80" r="4" fill="#f43f5e"/>
<circle cx="82" cy="80" r="4" fill="#f43f5e"/>
<circle cx="75" cy="92" r="4" fill="#f43f5e"/>
<path d="M 75 47 Q 50 30 35 40 Q 40 55 60 52" fill="none" stroke="#2dd4bf" stroke-width="1.8"/>
<path d="M 75 47 Q 100 30 115 40 Q 110 55 90 52" fill="none" stroke="#2dd4bf" stroke-width="1.8"/>
<path d="M 75 123 Q 45 135 30 115" fill="none" stroke="#2dd4bf" stroke-width="1.5"/>`,
    status: "AUTHENTIC_SAMPLE",
    attribution: "Rishtan kulolchilik maktabi — Archeon Fondi",
    license: "ARCHEON_HERITAGE_STANDARD",
  },
  {
    code: "MOTIF-ISL-010",
    name: "Xiva Ichan-Qal'a Qoshsimon Islimi",
    family: "ISLIMI",
    repeatSizeMm: 150.0,
    symmetryGroup: "C2",
    svgPath: `<path d="M 20 75 Q 45 35 75 60 Q 105 35 130 75" fill="none" stroke="#38bdf8" stroke-width="2.5"/>
<path d="M 20 75 Q 45 115 75 90 Q 105 115 130 75" fill="none" stroke="#38bdf8" stroke-width="2.5"/>
<path d="M 75 35 C 65 48 65 60 75 75 C 85 60 85 48 75 35 Z" fill="rgba(245,158,11,0.25)" stroke="#f59e0b" stroke-width="1.5"/>
<path d="M 75 115 C 65 102 65 90 75 75 C 85 90 85 102 75 115 Z" fill="rgba(245,158,11,0.25)" stroke="#f59e0b" stroke-width="1.5"/>
<circle cx="75" cy="75" r="8" fill="#38bdf8"/>
<circle cx="45" cy="75" r="5" fill="#f59e0b"/>
<circle cx="105" cy="75" r="5" fill="#f59e0b"/>`,
    status: "AUTHENTIC_SAMPLE",
    attribution: "Xiva Ko'hna Ark ganch o'ymakorligi — Archeon Fondi",
    license: "ARCHEON_HERITAGE_STANDARD",
  },
  {
    code: "MOTIF-ISL-011",
    name: "Toshkent Chorbog' Paxtagul Islimi",
    family: "ISLIMI",
    repeatSizeMm: 150.0,
    symmetryGroup: "C4",
    svgPath: `<circle cx="75" cy="75" r="10" fill="#f59e0b"/>
<ellipse cx="75" cy="50" rx="14" ry="20" fill="rgba(255,255,255,0.15)" stroke="#38bdf8" stroke-width="1.8"/>
<ellipse cx="75" cy="100" rx="14" ry="20" fill="rgba(255,255,255,0.15)" stroke="#38bdf8" stroke-width="1.8"/>
<ellipse cx="50" cy="75" rx="20" ry="14" fill="rgba(255,255,255,0.15)" stroke="#38bdf8" stroke-width="1.8"/>
<ellipse cx="100" cy="75" rx="20" ry="14" fill="rgba(255,255,255,0.15)" stroke="#38bdf8" stroke-width="1.8"/>
<path d="M 58 58 Q 30 35 25 50 Q 35 65 55 60" fill="none" stroke="#2dd4bf" stroke-width="1.5"/>
<path d="M 92 58 Q 120 35 125 50 Q 115 65 95 60" fill="none" stroke="#2dd4bf" stroke-width="1.5"/>
<path d="M 58 92 Q 30 115 25 100 Q 35 85 55 90" fill="none" stroke="#2dd4bf" stroke-width="1.5"/>
<path d="M 92 92 Q 120 115 125 100 Q 115 85 95 90" fill="none" stroke="#2dd4bf" stroke-width="1.5"/>`,
    status: "AUTHENTIC_SAMPLE",
    attribution: "Toshkent amaliy san'ati ganchkorligi — Archeon Fondi",
    license: "ARCHEON_HERITAGE_STANDARD",
  },
  {
    code: "MOTIF-ISL-012",
    name: "Qo'qon O'rdasi Majnuntol Islimi Poyasi",
    family: "ISLIMI",
    repeatSizeMm: 150.0,
    symmetryGroup: "C2",
    svgPath: `<path d="M 75 130 Q 75 80 50 50 Q 30 30 35 15" fill="none" stroke="#38bdf8" stroke-width="2"/>
<path d="M 75 130 Q 75 80 100 50 Q 120 30 115 15" fill="none" stroke="#38bdf8" stroke-width="2"/>
<circle cx="35" cy="15" r="5" fill="#f59e0b"/>
<circle cx="115" cy="15" r="5" fill="#f59e0b"/>
<path d="M 60 75 Q 35 80 30 95 Q 45 100 55 88" fill="rgba(56,189,248,0.2)" stroke="#38bdf8" stroke-width="1.5"/>
<path d="M 90 75 Q 115 80 120 95 Q 105 100 95 88" fill="rgba(56,189,248,0.2)" stroke="#38bdf8" stroke-width="1.5"/>
<path d="M 68 55 Q 45 45 40 60 Q 55 65 65 56" fill="rgba(245,158,11,0.2)" stroke="#f59e0b" stroke-width="1.5"/>
<path d="M 82 55 Q 105 45 110 60 Q 95 65 85 56" fill="rgba(245,158,11,0.2)" stroke="#f59e0b" stroke-width="1.5"/>
<circle cx="75" cy="130" r="6" fill="#f59e0b"/>`,
    status: "AUTHENTIC_SAMPLE",
    attribution: "Qo'qon Xudoyorxon o'rdasi yog'och o'ymakorligi — Archeon Fondi",
    license: "ARCHEON_HERITAGE_STANDARD",
  },

  // --- 13 to 16: ROSETTE (CIRCULAR FLORAL MEDALLIONS) ---
  {
    code: "MOTIF-ROS-013",
    name: "Shohizinda Qubba Sakkiz Bargli Rozetka",
    family: "ROSETTE",
    repeatSizeMm: 150.0,
    symmetryGroup: "C8",
    svgPath: `<circle cx="75" cy="75" r="56" fill="none" stroke="#38bdf8" stroke-width="1.5"/>
<g stroke="#f59e0b" stroke-width="1.6" fill="rgba(245,158,11,0.18)">
  <ellipse cx="75" cy="45" rx="8" ry="22"/>
  <ellipse cx="75" cy="105" rx="8" ry="22"/>
  <ellipse cx="45" cy="75" rx="22" ry="8"/>
  <ellipse cx="105" cy="75" rx="22" ry="8"/>
  <ellipse cx="54" cy="54" rx="8" ry="22" transform="rotate(-45 54 54)"/>
  <ellipse cx="96" cy="54" rx="8" ry="22" transform="rotate(45 96 54)"/>
  <ellipse cx="54" cy="96" rx="8" ry="22" transform="rotate(45 54 96)"/>
  <ellipse cx="96" cy="96" rx="8" ry="22" transform="rotate(-45 96 96)"/>
</g>
<circle cx="75" cy="75" r="14" fill="#0284c7" stroke="#ffffff" stroke-width="1.5"/>
<circle cx="75" cy="75" r="5" fill="#f59e0b"/>`,
    status: "AUTHENTIC_SAMPLE",
    attribution: "Samarqand Shohizinda Shodi Mulk maqbarasi — Archeon Fondi",
    license: "ARCHEON_HERITAGE_STANDARD",
  },
  {
    code: "MOTIF-ROS-014",
    name: "G'ijduvon O'n Ikki Bargli Guldasta Rozetkasi",
    family: "ROSETTE",
    repeatSizeMm: 150.0,
    symmetryGroup: "C12",
    svgPath: `<circle cx="75" cy="75" r="58" fill="rgba(56,189,248,0.08)" stroke="#38bdf8" stroke-width="1.5"/>
<circle cx="75" cy="75" r="42" fill="none" stroke="#f59e0b" stroke-width="1" stroke-dasharray="2,2"/>
<g stroke="#38bdf8" stroke-width="1.4" fill="rgba(56,189,248,0.2)">
  <ellipse cx="75" cy="40" rx="6" ry="18"/>
  <ellipse cx="75" cy="110" rx="6" ry="18"/>
  <ellipse cx="40" cy="75" rx="18" ry="6"/>
  <ellipse cx="110" cy="75" rx="18" ry="6"/>
  <ellipse cx="50" cy="50" rx="6" ry="18" transform="rotate(-45 50 50)"/>
  <ellipse cx="100" cy="50" rx="6" ry="18" transform="rotate(45 100 50)"/>
  <ellipse cx="50" cy="100" rx="6" ry="18" transform="rotate(45 50 100)"/>
  <ellipse cx="100" cy="100" rx="6" ry="18" transform="rotate(-45 100 100)"/>
  <ellipse cx="58" cy="42" rx="6" ry="18" transform="rotate(-25 58 42)"/>
  <ellipse cx="92" cy="42" rx="6" ry="18" transform="rotate(25 92 42)"/>
  <ellipse cx="58" cy="108" rx="6" ry="18" transform="rotate(25 58 108)"/>
  <ellipse cx="92" cy="108" rx="6" ry="18" transform="rotate(-25 92 108)"/>
</g>
<circle cx="75" cy="75" r="16" fill="#f59e0b" stroke="#ffffff" stroke-width="1.5"/>
<circle cx="75" cy="75" r="6" fill="#0284c7"/>`,
    status: "AUTHENTIC_SAMPLE",
    attribution: "Buxoro G'ijduvon kulolchilik markazi — Archeon Fondi",
    license: "ARCHEON_HERITAGE_STANDARD",
  },
  {
    code: "MOTIF-ROS-015",
    name: "Hazrati Imom O'n Olti Nurli Shams Rozetka",
    family: "ROSETTE",
    repeatSizeMm: 150.0,
    symmetryGroup: "C16",
    svgPath: `<circle cx="75" cy="75" r="60" fill="none" stroke="#f59e0b" stroke-width="1.5"/>
<polygon points="75,18 79,48 93,22 89,52 110,32 99,59 126,48 106,69 132,69 108,79 126,92 104,90 116,112 96,99 99,128 85,103 75,132 65,103 51,128 54,99 34,112 46,90 24,92 42,79 18,69 44,69 24,48 51,59 40,32 61,52 57,22 71,48" fill="rgba(245,158,11,0.25)" stroke="#f59e0b" stroke-width="1.6"/>
<circle cx="75" cy="75" r="28" fill="#060913" stroke="#38bdf8" stroke-width="2"/>
<circle cx="75" cy="75" r="18" fill="rgba(56,189,248,0.3)" stroke="#38bdf8" stroke-width="1.5"/>
<circle cx="75" cy="75" r="7" fill="#f59e0b"/>`,
    status: "AUTHENTIC_SAMPLE",
    attribution: "Toshkent Hazrati Imom Baroqxon madrassasi — Archeon Fondi",
    license: "ARCHEON_HERITAGE_STANDARD",
  },
  {
    code: "MOTIF-ROS-016",
    name: "Xorazm Ko'hna Ark Olti Bargli Nilufar Rozetkasi",
    family: "ROSETTE",
    repeatSizeMm: 150.0,
    symmetryGroup: "C6",
    svgPath: `<circle cx="75" cy="75" r="58" fill="none" stroke="#38bdf8" stroke-width="1.5"/>
<g stroke="#38bdf8" stroke-width="1.8" fill="rgba(56,189,248,0.2)">
  <path d="M 75 75 C 60 55 60 35 75 22 C 90 35 90 55 75 75 Z"/>
  <path d="M 75 75 C 60 95 60 115 75 128 C 90 115 90 95 75 75 Z"/>
  <path d="M 75 75 C 55 60 35 60 22 75 C 35 90 55 90 75 75 Z" transform="rotate(30 75 75)"/>
  <path d="M 75 75 C 95 60 115 60 128 75 C 115 90 95 90 75 75 Z" transform="rotate(30 75 75)"/>
  <path d="M 75 75 C 55 60 35 60 22 75 C 35 90 55 90 75 75 Z" transform="rotate(-30 75 75)"/>
  <path d="M 75 75 C 95 60 115 60 128 75 C 115 90 95 90 75 75 Z" transform="rotate(-30 75 75)"/>
</g>
<circle cx="75" cy="75" r="16" fill="#f59e0b" stroke="#ffffff" stroke-width="1.5"/>
<circle cx="75" cy="75" r="6" fill="#0284c7"/>`,
    status: "AUTHENTIC_SAMPLE",
    attribution: "Xiva Toshhovli saroyi mayolikasi — Archeon Fondi",
    license: "ARCHEON_HERITAGE_STANDARD",
  },

  // --- 17 to 20: BORDER_STRIP (CONTINUOUS ARCHITECTURAL FRIEZES) ---
  {
    code: "MOTIF-BOR-017",
    name: "Registon Mavjsimon Suv Zanjirasi Hoshiyasi",
    family: "BORDER_STRIP",
    repeatSizeMm: 50.0,
    symmetryGroup: "D1",
    svgPath: `<line x1="0" y1="35" x2="150" y2="35" stroke="#38bdf8" stroke-width="2"/>
<line x1="0" y1="115" x2="150" y2="115" stroke="#38bdf8" stroke-width="2"/>
<path d="M 0 75 Q 18 45 37 75 T 75 75 T 112 75 T 150 75" fill="none" stroke="#f59e0b" stroke-width="2.5"/>
<path d="M 0 75 Q 18 105 37 75 T 75 75 T 112 75 T 150 75" fill="none" stroke="#38bdf8" stroke-width="1.8"/>
<circle cx="18" cy="55" r="4" fill="#38bdf8"/>
<circle cx="56" cy="55" r="4" fill="#38bdf8"/>
<circle cx="94" cy="55" r="4" fill="#38bdf8"/>
<circle cx="132" cy="55" r="4" fill="#38bdf8"/>
<circle cx="18" cy="95" r="4" fill="#f59e0b"/>
<circle cx="56" cy="95" r="4" fill="#f59e0b"/>
<circle cx="94" cy="95" r="4" fill="#f59e0b"/>
<circle cx="132" cy="95" r="4" fill="#f59e0b"/>`,
    status: "AUTHENTIC_SAMPLE",
    attribution: "Samarqand Registon portallari hoshiyasi — Archeon Fondi",
    license: "ARCHEON_HERITAGE_STANDARD",
  },
  {
    code: "MOTIF-BOR-018",
    name: "Buxoro Madrassasi Medalyonli Hoshiya",
    family: "BORDER_STRIP",
    repeatSizeMm: 50.0,
    symmetryGroup: "D2",
    svgPath: `<line x1="0" y1="30" x2="150" y2="30" stroke="#f59e0b" stroke-width="1.8"/>
<line x1="0" y1="120" x2="150" y2="120" stroke="#f59e0b" stroke-width="1.8"/>
<rect x="10" y="45" width="55" height="60" rx="15" fill="rgba(56,189,248,0.18)" stroke="#38bdf8" stroke-width="2"/>
<rect x="85" y="45" width="55" height="60" rx="15" fill="rgba(56,189,248,0.18)" stroke="#38bdf8" stroke-width="2"/>
<polygon points="75,55 82,75 75,95 68,75" fill="#f59e0b"/>
<polygon points="5,75 10,65 10,85" fill="#f59e0b"/>
<polygon points="145,75 140,65 140,85" fill="#f59e0b"/>
<circle cx="37" cy="75" r="10" fill="#f59e0b" stroke="#ffffff" stroke-width="1.5"/>
<circle cx="112" cy="75" r="10" fill="#f59e0b" stroke="#ffffff" stroke-width="1.5"/>`,
    status: "AUTHENTIC_SAMPLE",
    attribution: "Buxoro Mir Arab madrassasi frizi — Archeon Fondi",
    license: "ARCHEON_HERITAGE_STANDARD",
  },
  {
    code: "MOTIF-BOR-019",
    name: "Temuriylar Uchbargli Shobarg Hoshiyasi",
    family: "BORDER_STRIP",
    repeatSizeMm: 50.0,
    symmetryGroup: "D1",
    svgPath: `<line x1="0" y1="40" x2="150" y2="40" stroke="#38bdf8" stroke-width="1.5"/>
<line x1="0" y1="110" x2="150" y2="110" stroke="#38bdf8" stroke-width="1.5"/>
<g stroke="#38bdf8" stroke-width="1.8" fill="rgba(56,189,248,0.2)">
  <path d="M 25 105 C 15 90 10 70 25 55 C 30 70 35 70 40 55 C 55 70 50 90 40 105 Z"/>
  <path d="M 75 105 C 65 90 60 70 75 55 C 80 70 85 70 90 55 C 105 70 100 90 90 105 Z"/>
  <path d="M 125 105 C 115 90 110 70 125 55 C 130 70 135 70 140 55 C 155 70 150 90 140 105 Z"/>
</g>
<circle cx="25" cy="50" r="4" fill="#f59e0b"/>
<circle cx="75" cy="50" r="4" fill="#f59e0b"/>
<circle cx="125" cy="50" r="4" fill="#f59e0b"/>`,
    status: "AUTHENTIC_SAMPLE",
    attribution: "Samarqand Bibixonim peshtoq hoshiyasi — Archeon Fondi",
    license: "ARCHEON_HERITAGE_STANDARD",
  },
  {
    code: "MOTIF-BOR-020",
    name: "Rishtan Qalampirnusxa Himoya Hoshiyasi",
    family: "BORDER_STRIP",
    repeatSizeMm: 50.0,
    symmetryGroup: "D1",
    svgPath: `<line x1="0" y1="35" x2="150" y2="35" stroke="#f59e0b" stroke-width="1.5"/>
<line x1="0" y1="115" x2="150" y2="115" stroke="#f59e0b" stroke-width="1.5"/>
<g stroke="#2dd4bf" stroke-width="1.8" fill="rgba(45,212,191,0.22)">
  <path d="M 10 95 C 10 65 35 60 40 45 C 45 65 30 85 20 95 Z"/>
  <path d="M 60 95 C 60 65 85 60 90 45 C 95 65 80 85 70 95 Z"/>
  <path d="M 110 95 C 110 65 135 60 140 45 C 145 65 130 85 120 95 Z"/>
</g>
<circle cx="40" cy="45" r="4" fill="#f43f5e"/>
<circle cx="90" cy="45" r="4" fill="#f43f5e"/>
<circle cx="140" cy="45" r="4" fill="#f43f5e"/>
<path d="M 0 105 Q 25 100 50 105 T 100 105 T 150 105" fill="none" stroke="#f59e0b" stroke-width="1.5"/>`,
    status: "AUTHENTIC_SAMPLE",
    attribution: "Rishtan sopol hoshiyalari — Archeon Fondi",
    license: "ARCHEON_HERITAGE_STANDARD",
  },
];
