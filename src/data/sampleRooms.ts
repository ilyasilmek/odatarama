import { SampleRoom } from '../types';

// Helper to create reliable SVG data URIs that work 100% offline, on GitHub Pages, and never have CORS issues
function createSvgDataUri(svgContent: string): string {
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svgContent.trim())}`;
}

const OFFICE_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 520" width="800" height="520">
  <defs>
    <linearGradient id="wallOff" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#E2E8F0"/>
      <stop offset="100%" stop-color="#CBD5E1"/>
    </linearGradient>
    <linearGradient id="floorOff" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#E7E5E4"/>
      <stop offset="100%" stop-color="#D6D3D1"/>
    </linearGradient>
    <linearGradient id="deskWood" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="#B45309"/>
      <stop offset="50%" stop-color="#D97706"/>
      <stop offset="100%" stop-color="#92400E"/>
    </linearGradient>
    <linearGradient id="screenGrad" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#1E293B"/>
      <stop offset="100%" stop-color="#0F172A"/>
    </linearGradient>
    <filter id="shadow" x="-5%" y="-5%" width="110%" height="110%">
      <feDropShadow dx="0" dy="6" stdDeviation="6" flood-opacity="0.18"/>
    </filter>
  </defs>

  <!-- Background Wall & Floor -->
  <rect width="800" height="360" fill="url(#wallOff)"/>
  <rect y="360" width="800" height="160" fill="url(#floorOff)"/>
  <line x1="0" y1="360" x2="800" y2="360" stroke="#94A3B8" stroke-width="3"/>

  <!-- Baseboard -->
  <rect y="348" width="800" height="12" fill="#F8FAFC"/>

  <!-- Wall Art / Board -->
  <rect x="80" y="50" width="180" height="110" rx="4" fill="#FEF3C7" stroke="#D97706" stroke-width="4" filter="url(#shadow)"/>
  <text x="95" y="80" font-family="sans-serif" font-size="12" font-weight="bold" fill="#92400E">📋 HAFTALIK GÖREVLER</text>
  <rect x="95" y="92" width="40" height="40" rx="2" fill="#FDE047" transform="rotate(-5 115 112)"/>
  <rect x="145" y="95" width="42" height="42" rx="2" fill="#F472B6" transform="rotate(4 166 116)"/>
  <rect x="198" y="90" width="40" height="40" rx="2" fill="#67E8F9" transform="rotate(-2 218 110)"/>

  <!-- Wall Floating Bookshelf with clutter -->
  <rect x="520" y="70" width="220" height="14" rx="2" fill="#78350F" filter="url(#shadow)"/>
  <rect x="535" y="32" width="16" height="38" fill="#DC2626"/>
  <rect x="553" y="24" width="18" height="46" fill="#2563EB"/>
  <rect x="573" y="36" width="14" height="34" fill="#059669"/>
  <rect x="590" y="28" width="20" height="42" fill="#D97706" transform="rotate(12 600 50)"/>
  <rect x="630" y="44" width="35" height="26" rx="3" fill="#E2E8F0" stroke="#94A3B8"/>
  <circle cx="700" cy="50" r="14" fill="#10B981"/>
  <path d="M700 50 Q690 35 680 42 Q695 28 700 50" fill="#059669"/>

  <!-- Desk Surface -->
  <rect x="120" y="220" width="560" height="24" rx="4" fill="url(#deskWood)" filter="url(#shadow)"/>
  <!-- Desk Legs -->
  <rect x="140" y="244" width="16" height="190" fill="#334155"/>
  <rect x="644" y="244" width="16" height="190" fill="#334155"/>
  <rect x="132" y="430" width="32" height="8" rx="2" fill="#1E293B"/>
  <rect x="636" y="430" width="32" height="8" rx="2" fill="#1E293B"/>

  <!-- Tangled Floor Cables (Clutter Point) -->
  <path d="M220 240 Q180 320 200 420 T280 430 Q360 440 330 380 Q310 320 360 240" fill="none" stroke="#1E293B" stroke-width="4" stroke-linecap="round"/>
  <path d="M240 240 Q280 330 250 410 T320 425 Q380 420 480 425" fill="none" stroke="#64748B" stroke-width="3" stroke-linecap="round"/>
  <!-- Extension Cord Outlet on floor -->
  <rect x="230" y="405" width="80" height="24" rx="4" fill="#F8FAFC" stroke="#CBD5E1" stroke-width="2"/>
  <circle cx="245" cy="417" r="4" fill="#334155"/>
  <circle cx="270" cy="417" r="4" fill="#334155"/>
  <circle cx="295" cy="417" r="4" fill="#EF4444"/>

  <!-- Dual Monitors -->
  <!-- Monitor 1 (Main) -->
  <rect x="270" y="110" width="190" height="110" rx="6" fill="url(#screenGrad)" stroke="#334155" stroke-width="4" filter="url(#shadow)"/>
  <rect x="280" y="118" width="170" height="86" fill="#0284C7"/>
  <rect x="290" y="128" width="80" height="10" rx="2" fill="#38BDF8"/>
  <rect x="290" y="144" width="120" height="6" rx="2" fill="#E0F2FE"/>
  <rect x="290" y="154" width="95" height="6" rx="2" fill="#E0F2FE"/>
  <rect x="290" y="164" width="140" height="6" rx="2" fill="#E0F2FE"/>
  <rect x="350" y="216" width="30" height="20" fill="#475569"/>
  <rect x="330" y="234" width="70" height="6" rx="2" fill="#334155"/>

  <!-- Monitor 2 (Vertical/Side) -->
  <rect x="475" y="105" width="90" height="120" rx="6" fill="url(#screenGrad)" stroke="#334155" stroke-width="4" filter="url(#shadow)"/>
  <rect x="482" y="112" width="76" height="98" fill="#1E1B4B"/>
  <rect x="488" y="120" width="64" height="4" fill="#A855F7"/>
  <rect x="488" y="128" width="50" height="4" fill="#818CF8"/>
  <rect x="488" y="136" width="60" height="4" fill="#818CF8"/>
  <rect x="488" y="144" width="45" height="4" fill="#818CF8"/>
  <rect x="512" y="222" width="16" height="14" fill="#475569"/>
  <rect x="500" y="234" width="40" height="5" rx="2" fill="#334155"/>

  <!-- Clutter on Desk: Paper Stacks, Sticky Notes, Mugs -->
  <!-- Paper stack 1 -->
  <polygon points="150,218 195,212 215,224 170,228" fill="#FFFFFF" stroke="#CBD5E1"/>
  <polygon points="148,214 192,208 214,220 170,225" fill="#F8FAFC" stroke="#CBD5E1"/>
  <polygon points="152,210 197,205 218,217 173,222" fill="#FEF08A" stroke="#EAB308"/>
  <!-- Paper stack 2 (messy) -->
  <polygon points="580,215 635,212 650,226 595,228" fill="#FFFFFF" stroke="#CBD5E1"/>
  <polygon points="575,210 630,218 642,225 587,222" fill="#F1F5F9" stroke="#94A3B8"/>
  <polygon points="582,205 640,210 652,220 594,218" fill="#FDE047" stroke="#CA8A04"/>

  <!-- Coffee Mug -->
  <rect x="225" y="206" width="18" height="22" rx="3" fill="#EF4444"/>
  <path d="M243 211 Q250 216 243 222" fill="none" stroke="#EF4444" stroke-width="3"/>

  <!-- Keyboard & Mouse -->
  <rect x="300" y="228" width="120" height="10" rx="2" fill="#1E293B"/>
  <rect x="430" y="229" width="14" height="9" rx="4" fill="#475569"/>

  <!-- Pen Cup with overflowing pens -->
  <rect x="200" y="196" width="16" height="26" rx="2" fill="#3B82F6"/>
  <line x1="202" y1="196" x2="196" y2="182" stroke="#EF4444" stroke-width="3" stroke-linecap="round"/>
  <line x1="208" y1="196" x2="208" y2="180" stroke="#10B981" stroke-width="3" stroke-linecap="round"/>
  <line x1="214" y1="196" x2="218" y2="184" stroke="#F59E0B" stroke-width="3" stroke-linecap="round"/>

  <!-- Office Chair -->
  <ellipse cx="390" cy="340" rx="55" ry="16" fill="#1E293B" filter="url(#shadow)"/>
  <rect x="345" y="270" width="90" height="65" rx="10" fill="#0F172A"/>
  <rect x="384" y="356" width="12" height="60" fill="#475569"/>
  <!-- 5-Star Base -->
  <line x1="390" y1="416" x2="340" y2="435" stroke="#1E293B" stroke-width="6" stroke-linecap="round"/>
  <line x1="390" y1="416" x2="440" y2="435" stroke="#1E293B" stroke-width="6" stroke-linecap="round"/>
  <line x1="390" y1="416" x2="390" y2="442" stroke="#1E293B" stroke-width="6" stroke-linecap="round"/>
  <circle cx="340" cy="438" r="4" fill="#0F172A"/>
  <circle cx="440" cy="438" r="4" fill="#0F172A"/>
  <circle cx="390" cy="445" r="4" fill="#0F172A"/>

  <!-- Clutter Tag Overlay -->
  <rect x="15" y="15" width="180" height="30" rx="8" fill="#1E293B" opacity="0.9"/>
  <circle cx="30" cy="30" r="6" fill="#EF4444"/>
  <text x="44" y="34" font-family="sans-serif" font-size="12" font-weight="bold" fill="#FFFFFF">Dağınıklık Puanı: 8/10</text>
</svg>`;

const LIVING_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 520" width="800" height="520">
  <defs>
    <linearGradient id="wallLiv" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#F1F5F9"/>
      <stop offset="100%" stop-color="#E2E8F0"/>
    </linearGradient>
    <linearGradient id="floorLiv" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#D5C5B5"/>
      <stop offset="100%" stop-color="#B8A493"/>
    </linearGradient>
    <linearGradient id="sofaGrad" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#0F766E"/>
      <stop offset="100%" stop-color="#115E59"/>
    </linearGradient>
    <filter id="shadowLiv" x="-5%" y="-5%" width="110%" height="110%">
      <feDropShadow dx="0" dy="6" stdDeviation="6" flood-opacity="0.16"/>
    </filter>
  </defs>

  <!-- Wall & Floor -->
  <rect width="800" height="340" fill="url(#wallLiv)"/>
  <rect y="340" width="800" height="180" fill="url(#floorLiv)"/>
  <line x1="0" y1="340" x2="800" y2="340" stroke="#94A3B8" stroke-width="2"/>

  <!-- Wall Gallery Frames (One tilted / crooked) -->
  <rect x="100" y="50" width="90" height="110" rx="3" fill="#FFFFFF" stroke="#1E293B" stroke-width="6" filter="url(#shadowLiv)"/>
  <rect x="112" y="62" width="66" height="86" fill="#FDE047"/>
  <circle cx="145" cy="100" r="18" fill="#F97316"/>

  <g transform="rotate(8 260 100)">
    <rect x="220" y="45" width="85" height="115" rx="3" fill="#FFFFFF" stroke="#B45309" stroke-width="5" filter="url(#shadowLiv)"/>
    <rect x="230" y="55" width="65" height="95" fill="#BFDBFE"/>
    <path d="M235 130 L255 90 L275 125 L290 110" stroke="#1D4ED8" stroke-width="4" fill="none"/>
  </g>

  <rect x="335" y="65" width="80" height="80" rx="3" fill="#FFFFFF" stroke="#1E293B" stroke-width="5" filter="url(#shadowLiv)"/>
  <circle cx="375" cy="105" r="24" fill="#A7F3D0"/>

  <!-- Large Plant in Corner -->
  <ellipse cx="690" cy="410" rx="30" ry="10" fill="#78350F" opacity="0.3"/>
  <polygon points="665,340 715,340 705,410 675,410" fill="#EA580C"/>
  <path d="M690 340 Q650 240 600 220 Q660 270 690 340" fill="#15803D"/>
  <path d="M690 340 Q710 210 750 190 Q720 270 690 340" fill="#16A34A"/>
  <path d="M690 340 Q680 180 670 140 Q695 240 690 340" fill="#22C55E"/>
  <path d="M690 340 Q740 260 770 280 Q720 310 690 340" fill="#15803D"/>

  <!-- Rug on Floor -->
  <ellipse cx="400" cy="430" rx="270" ry="60" fill="#F5F5F4" stroke="#E7E5E4" stroke-width="4" filter="url(#shadowLiv)"/>
  <ellipse cx="400" cy="430" rx="240" ry="48" fill="none" stroke="#CBD5E1" stroke-width="2" stroke-dasharray="8 6"/>

  <!-- Sofa -->
  <g filter="url(#shadowLiv)">
    <!-- Sofa Back -->
    <rect x="130" y="190" width="460" height="120" rx="18" fill="url(#sofaGrad)"/>
    <!-- Sofa Armrests -->
    <rect x="110" y="230" width="45" height="100" rx="14" fill="#134E4A"/>
    <rect x="565" y="230" width="45" height="100" rx="14" fill="#134E4A"/>
    <!-- Sofa Cushions / Base -->
    <rect x="145" y="270" width="430" height="60" rx="12" fill="#0D9488"/>
    <!-- Sofa Legs -->
    <line x1="140" y1="330" x2="130" y2="360" stroke="#78350F" stroke-width="8" stroke-linecap="round"/>
    <line x1="580" y1="330" x2="590" y2="360" stroke="#78350F" stroke-width="8" stroke-linecap="round"/>
  </g>

  <!-- Cushions & Messy Blanket on Sofa -->
  <!-- Throw Pillows -->
  <rect x="160" y="220" width="55" height="55" rx="10" fill="#F59E0B" transform="rotate(-10 187 247)"/>
  <rect x="495" y="225" width="55" height="55" rx="10" fill="#EC4899" transform="rotate(15 522 252)"/>
  <!-- Draped Messy Blanket -->
  <path d="M320 220 C360 220 370 290 350 330 C330 360 290 340 280 320 C270 280 290 220 320 220 Z" fill="#F43F5E" opacity="0.95"/>

  <!-- Coffee Table (Heavy Clutter Point) -->
  <rect x="230" y="380" width="310" height="16" rx="4" fill="#78350F" filter="url(#shadowLiv)"/>
  <rect x="250" y="396" width="12" height="40" fill="#451A03"/>
  <rect x="508" y="396" width="12" height="40" fill="#451A03"/>

  <!-- Clutter on Coffee Table: Magazine stacks, 2 remotes, half-empty mugs, snack plate -->
  <!-- Magazines -->
  <polygon points="260,376 310,368 335,380 285,384" fill="#3B82F6"/>
  <polygon points="258,372 308,364 333,376 283,380" fill="#10B981"/>
  <polygon points="264,367 312,360 336,372 288,376" fill="#FDE047"/>
  <!-- Laptop open -->
  <polygon points="345,378 405,374 415,382 355,384" fill="#64748B"/>
  <polygon points="355,384 415,382 410,350 350,352" fill="#334155"/>
  <!-- Coffee Cups & Plates -->
  <ellipse cx="440" cy="374" rx="10" ry="5" fill="#E2E8F0" stroke="#94A3B8"/>
  <rect x="434" y="364" width="12" height="10" fill="#F8FAFC"/>
  <ellipse cx="475" cy="375" rx="14" ry="6" fill="#FEF08A" stroke="#CA8A04"/>
  <circle cx="475" cy="375" r="3" fill="#78350F"/>
  <!-- TV Remote -->
  <rect x="495" y="372" width="28" height="9" rx="2" fill="#1E293B"/>

  <!-- Items on the Floor around Table -->
  <!-- Open Box with toys/gadgets -->
  <rect x="150" y="420" width="60" height="35" rx="3" fill="#D97706" stroke="#92400E" stroke-width="2"/>
  <circle cx="165" cy="415" r="8" fill="#EC4899"/>
  <rect x="180" y="412" width="15" height="12" fill="#3B82F6"/>
  <!-- Discarded Slippers -->
  <ellipse cx="570" cy="445" rx="18" ry="7" fill="#8B5CF6" transform="rotate(-15 570 445)"/>
  <ellipse cx="605" cy="450" rx="18" ry="7" fill="#8B5CF6" transform="rotate(25 605 450)"/>

  <!-- Clutter Tag Overlay -->
  <rect x="15" y="15" width="180" height="30" rx="8" fill="#1E293B" opacity="0.9"/>
  <circle cx="30" cy="30" r="6" fill="#F59E0B"/>
  <text x="44" y="34" font-family="sans-serif" font-size="12" font-weight="bold" fill="#FFFFFF">Dağınıklık Puanı: 6/10</text>
</svg>`;

const BEDROOM_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 520" width="800" height="520">
  <defs>
    <linearGradient id="wallBed" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#EDE9FE"/>
      <stop offset="100%" stop-color="#DDD6FE"/>
    </linearGradient>
    <linearGradient id="floorBed" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#E2E8F0"/>
      <stop offset="100%" stop-color="#CBD5E1"/>
    </linearGradient>
    <filter id="shadowBed" x="-5%" y="-5%" width="110%" height="110%">
      <feDropShadow dx="0" dy="6" stdDeviation="6" flood-opacity="0.15"/>
    </filter>
  </defs>

  <!-- Wall & Floor -->
  <rect width="800" height="340" fill="url(#wallBed)"/>
  <rect y="340" width="800" height="180" fill="url(#floorBed)"/>
  <line x1="0" y1="340" x2="800" y2="340" stroke="#94A3B8" stroke-width="2"/>

  <!-- Window with curtains -->
  <rect x="300" y="40" width="180" height="170" rx="4" fill="#BAE6FD" stroke="#F8FAFC" stroke-width="8"/>
  <line x1="390" y1="40" x2="390" y2="210" stroke="#F8FAFC" stroke-width="4"/>
  <line x1="300" y1="125" x2="480" y2="125" stroke="#F8FAFC" stroke-width="4"/>
  <!-- Drapes -->
  <path d="M285 30 Q305 130 280 230 L310 230 Q320 130 305 30 Z" fill="#C4B5FD"/>
  <path d="M495 30 Q475 130 500 230 L470 230 Q460 130 475 30 Z" fill="#C4B5FD"/>

  <!-- Wardrobe (Open with clothes popping out) -->
  <rect x="40" y="80" width="180" height="320" rx="4" fill="#475569" filter="url(#shadowBed)"/>
  <rect x="48" y="88" width="80" height="304" fill="#334155"/>
  <rect x="132" y="88" width="80" height="304" fill="#1E293B"/>
  <!-- Clothes Hanging (Messy) -->
  <line x1="50" y1="130" x2="125" y2="130" stroke="#94A3B8" stroke-width="3"/>
  <rect x="58" y="132" width="16" height="85" fill="#EF4444"/>
  <rect x="76" y="132" width="20" height="95" fill="#F59E0B"/>
  <rect x="98" y="132" width="18" height="75" fill="#10B981"/>
  <!-- Lower shelf clothes pile -->
  <ellipse cx="90" cy="350" rx="35" ry="16" fill="#3B82F6"/>
  <ellipse cx="90" cy="340" rx="30" ry="14" fill="#EC4899"/>
  <ellipse cx="90" cy="330" rx="25" ry="12" fill="#FDE047"/>

  <!-- Bed (Headboard, Mattress, Duvet, Pillows) -->
  <rect x="280" y="200" width="340" height="90" rx="8" fill="#581C87" filter="url(#shadowBed)"/>
  <!-- Pillows -->
  <rect x="300" y="240" width="90" height="40" rx="10" fill="#F8FAFC" stroke="#E2E8F0"/>
  <rect x="400" y="240" width="90" height="40" rx="10" fill="#F8FAFC" stroke="#E2E8F0"/>
  <!-- Mattress / Bed Base -->
  <rect x="270" y="280" width="360" height="100" rx="10" fill="#FFFFFF" stroke="#E2E8F0" filter="url(#shadowBed)"/>
  <!-- Unmade Duvet / Blanket (Cluttered bed) -->
  <path d="M265 310 C320 290 420 340 500 300 C580 260 635 310 635 380 L265 380 Z" fill="#7C3AED"/>
  <path d="M340 330 C380 320 440 360 480 330 C510 310 540 340 550 380 L330 380 Z" fill="#A78BFA"/>

  <!-- Nightstand (Overflowing Clutter) -->
  <rect x="645" y="270" width="95" height="110" rx="6" fill="#78350F" filter="url(#shadowBed)"/>
  <line x1="645" y1="325" x2="740" y2="325" stroke="#451A03" stroke-width="2"/>
  <circle cx="692" cy="300" r="4" fill="#FDE047"/>
  <circle cx="692" cy="355" r="4" fill="#FDE047"/>
  <!-- Lamp on Nightstand -->
  <rect x="680" y="225" width="20" height="45" fill="#E2E8F0"/>
  <polygon points="665,225 715,225 725,185 655,185" fill="#FEF08A"/>
  <!-- Clutter on Nightstand: phone charger cable dropping, glasses, water bottle, stacked books -->
  <rect x="652" y="260" width="26" height="10" rx="2" fill="#DC2626"/>
  <rect x="650" y="254" width="28" height="6" rx="1" fill="#2563EB"/>
  <rect x="718" y="248" width="12" height="22" rx="2" fill="#0284C7"/>
  <path d="M700 270 Q715 310 710 380" stroke="#1E293B" stroke-width="2" fill="none"/>

  <!-- Laundry Basket on Floor overflowing -->
  <ellipse cx="230" cy="440" rx="35" ry="14" fill="#CBD5E1"/>
  <polygon points="200,380 260,380 252,440 208,440" fill="#F8FAFC" stroke="#94A3B8" stroke-width="3"/>
  <!-- Clothes tumbling out of basket -->
  <path d="M195 385 Q220 350 255 375 Q270 410 240 400 Z" fill="#F43F5E"/>
  <path d="M210 395 Q235 365 260 390 Z" fill="#3B82F6"/>

  <!-- Accent Chair in Corner with Clothes Draped (The "Chairdrobe") -->
  <rect x="680" y="380" width="70" height="70" rx="8" fill="#F59E0B" filter="url(#shadowBed)"/>
  <!-- Clothes draped over chair -->
  <path d="M670 385 C700 365 730 370 750 390 C755 420 740 440 730 440 C700 440 680 420 670 385 Z" fill="#0284C7"/>
  <path d="M685 390 C705 380 725 385 735 410 L700 425 Z" fill="#10B981"/>

  <!-- Clutter Tag Overlay -->
  <rect x="15" y="15" width="180" height="30" rx="8" fill="#1E293B" opacity="0.9"/>
  <circle cx="30" cy="30" r="6" fill="#EF4444"/>
  <text x="44" y="34" font-family="sans-serif" font-size="12" font-weight="bold" fill="#FFFFFF">Dağınıklık Puanı: 7/10</text>
</svg>`;

const KITCHEN_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 520" width="800" height="520">
  <defs>
    <linearGradient id="wallKit" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#F8FAFC"/>
      <stop offset="100%" stop-color="#F1F5F9"/>
    </linearGradient>
    <linearGradient id="counterGrad" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#334155"/>
      <stop offset="100%" stop-color="#1E293B"/>
    </linearGradient>
    <linearGradient id="floorKit" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#E2E8F0"/>
      <stop offset="100%" stop-color="#CBD5E1"/>
    </linearGradient>
    <filter id="shadowKit" x="-5%" y="-5%" width="110%" height="110%">
      <feDropShadow dx="0" dy="6" stdDeviation="6" flood-opacity="0.15"/>
    </filter>
  </defs>

  <!-- Wall (Subway Tile Pattern) -->
  <rect width="800" height="330" fill="url(#wallKit)"/>
  <!-- Subtle Subway Tiles -->
  <g stroke="#E2E8F0" stroke-width="1.5" opacity="0.8">
    <line x1="0" y1="60" x2="800" y2="60"/>
    <line x1="0" y1="120" x2="800" y2="120"/>
    <line x1="0" y1="180" x2="800" y2="180"/>
    <line x1="0" y1="240" x2="800" y2="240"/>
  </g>

  <!-- Floor -->
  <rect y="330" width="800" height="190" fill="url(#floorKit)"/>

  <!-- Upper Kitchen Cabinets -->
  <rect x="60" y="20" width="680" height="110" rx="4" fill="#FFFFFF" stroke="#CBD5E1" stroke-width="3" filter="url(#shadowKit)"/>
  <line x1="230" y1="20" x2="230" y2="130" stroke="#E2E8F0" stroke-width="2"/>
  <line x1="400" y1="20" x2="400" y2="130" stroke="#E2E8F0" stroke-width="2"/>
  <line x1="570" y1="20" x2="570" y2="130" stroke="#E2E8F0" stroke-width="2"/>
  <!-- Cabinet Handles -->
  <rect x="215" y="65" width="5" height="30" rx="2" fill="#64748B"/>
  <rect x="240" y="65" width="5" height="30" rx="2" fill="#64748B"/>
  <rect x="385" y="65" width="5" height="30" rx="2" fill="#64748B"/>
  <rect x="410" y="65" width="5" height="30" rx="2" fill="#64748B"/>
  <rect x="555" y="65" width="5" height="30" rx="2" fill="#64748B"/>
  <rect x="580" y="65" width="5" height="30" rx="2" fill="#64748B"/>

  <!-- Floating Spice Shelf (Crowded) -->
  <rect x="180" y="160" width="300" height="10" rx="2" fill="#B45309" filter="url(#shadowKit)"/>
  <!-- Spice Jars and Bottles -->
  <rect x="195" y="132" width="14" height="28" rx="2" fill="#DC2626"/>
  <rect x="215" y="135" width="16" height="25" rx="2" fill="#F59E0B"/>
  <rect x="237" y="130" width="14" height="30" rx="2" fill="#10B981"/>
  <rect x="257" y="134" width="15" height="26" rx="2" fill="#EAB308"/>
  <rect x="278" y="128" width="18" height="32" rx="2" fill="#7C3AED"/>
  <rect x="302" y="136" width="14" height="24" rx="2" fill="#EA580C"/>
  <rect x="322" y="132" width="16" height="28" rx="2" fill="#14B8A6"/>
  <rect x="344" y="130" width="18" height="30" rx="2" fill="#F97316"/>
  <rect x="370" y="126" width="22" height="34" rx="3" fill="#0284C7"/>
  <rect x="400" y="132" width="18" height="28" rx="2" fill="#EF4444"/>
  <rect x="424" y="135" width="16" height="25" rx="2" fill="#84CC16"/>

  <!-- Countertop (Granite/Slate) -->
  <rect x="40" y="240" width="720" height="26" rx="3" fill="url(#counterGrad)" filter="url(#shadowKit)"/>
  <!-- Lower Cabinets -->
  <rect x="40" y="266" width="720" height="180" fill="#0F766E"/>
  <line x1="220" y1="266" x2="220" y2="446" stroke="#115E59" stroke-width="3"/>
  <line x1="400" y1="266" x2="400" y2="446" stroke="#115E59" stroke-width="3"/>
  <line x1="580" y1="266" x2="580" y2="446" stroke="#115E59" stroke-width="3"/>
  <!-- Lower Handles -->
  <rect x="120" y="280" width="30" height="5" rx="2" fill="#F8FAFC"/>
  <rect x="300" y="280" width="30" height="5" rx="2" fill="#F8FAFC"/>
  <rect x="480" y="280" width="30" height="5" rx="2" fill="#F8FAFC"/>
  <rect x="660" y="280" width="30" height="5" rx="2" fill="#F8FAFC"/>

  <!-- Countertop Appliances & Clutter -->
  <!-- Microwave Oven -->
  <rect x="70" y="165" width="120" height="75" rx="5" fill="#E2E8F0" stroke="#94A3B8" stroke-width="3" filter="url(#shadowKit)"/>
  <rect x="80" y="175" width="75" height="55" rx="3" fill="#1E293B"/>
  <circle cx="170" cy="185" r="6" fill="#64748B"/>
  <circle cx="170" cy="205" r="6" fill="#64748B"/>
  <rect x="162" y="222" width="16" height="8" rx="1" fill="#10B981"/>

  <!-- Mail / Paper Stack right next to Microwave -->
  <polygon points="195,236 240,230 258,238 213,244" fill="#FEF08A"/>
  <polygon points="198,232 243,226 260,234 215,240" fill="#FFFFFF"/>
  <polygon points="202,228 245,222 262,230 219,236" fill="#F1F5F9"/>

  <!-- Coffee Machine -->
  <rect x="270" y="160" width="55" height="80" rx="6" fill="#EF4444" filter="url(#shadowKit)"/>
  <rect x="280" y="170" width="35" height="30" fill="#1E293B"/>
  <rect x="282" y="210" width="30" height="25" rx="2" fill="#E2E8F0" stroke="#94A3B8"/>

  <!-- Toaster / Air Fryer -->
  <rect x="340" y="180" width="60" height="60" rx="8" fill="#1E293B" filter="url(#shadowKit)"/>
  <circle cx="370" cy="205" r="14" fill="#0F766E"/>

  <!-- Cutting Board with knife and half cut fruit -->
  <polygon points="420,234 490,228 515,238 445,244" fill="#D97706"/>
  <circle cx="465" cy="235" r="8" fill="#EF4444"/>
  <line x1="480" y1="230" x2="505" y2="242" stroke="#64748B" stroke-width="4" stroke-linecap="round"/>

  <!-- Dish Drying Rack with Mugs & Plates (Overflowing) -->
  <rect x="535" y="195" width="125" height="45" rx="4" fill="#CBD5E1" stroke="#94A3B8" stroke-width="2" filter="url(#shadowKit)"/>
  <!-- Plates -->
  <ellipse cx="555" cy="215" rx="4" ry="20" fill="#FFFFFF" stroke="#94A3B8"/>
  <ellipse cx="567" cy="215" rx="4" ry="20" fill="#FFFFFF" stroke="#94A3B8"/>
  <ellipse cx="579" cy="215" rx="4" ry="20" fill="#FFFFFF" stroke="#94A3B8"/>
  <!-- Tumblers / Glasses -->
  <rect x="600" y="200" width="16" height="28" fill="#BAE6FD" opacity="0.8"/>
  <rect x="625" y="198" width="18" height="30" fill="#BAE6FD" opacity="0.8"/>

  <!-- Open Cereal Box & Snack Packs -->
  <rect x="680" y="170" width="38" height="70" rx="2" fill="#F59E0B" filter="url(#shadowKit)"/>
  <text x="684" y="210" font-family="sans-serif" font-size="9" font-weight="bold" fill="#78350F">CRUNCH</text>

  <!-- Clutter Tag Overlay -->
  <rect x="15" y="15" width="180" height="30" rx="8" fill="#1E293B" opacity="0.9"/>
  <circle cx="30" cy="30" r="6" fill="#F59E0B"/>
  <text x="44" y="34" font-family="sans-serif" font-size="12" font-weight="bold" fill="#FFFFFF">Dağınıklık Puanı: 7/10</text>
</svg>`;

export const SAMPLE_ROOMS: SampleRoom[] = [
  {
    id: 'sample-office',
    name: 'Ev Ofisi & Çalışma Masası',
    roomType: 'Home Office',
    goal: 'Desk & Cable Management',
    description: 'Çift monitörlü masa, karışık sarkan kablolar, not kağıtları, kahve kupası, evrak yığınları ve dolu çekmeceler.',
    imageUrl: createSvgDataUri(OFFICE_SVG),
  },
  {
    id: 'sample-living',
    name: 'Oturma Odası & Salon',
    roomType: 'Living Room',
    goal: 'General Decluttering & Space Revival',
    description: 'Orta sehpa üzerinde dergiler, kumandalar, fincanlar; koltukta dağınık battaniye ve yerde açık saklama kutuları.',
    imageUrl: createSvgDataUri(LIVING_SVG),
  },
  {
    id: 'sample-bedroom',
    name: 'Yatak Odası & Gardırop',
    roomType: 'Bedroom',
    goal: 'Wardrobe & Closet Streamlining',
    description: 'Komodin üzerinde birikmiş eşyalar ve kablolar, koltuğa asılmış kıyafetler ve düzenlenmeyi bekleyen çamaşır sepeti.',
    imageUrl: createSvgDataUri(BEDROOM_SVG),
  },
  {
    id: 'sample-kitchen',
    name: 'Mutfak Tezgahı & Kiler',
    roomType: 'Kitchen',
    goal: 'Maximize Storage & Floor Space',
    description: 'Tezgahta küçük ev aletleri kalabalığı, baharat kavanozları, posta yığını, açık paketler ve dolu bulaşıklık.',
    imageUrl: createSvgDataUri(KITCHEN_SVG),
  },
];
