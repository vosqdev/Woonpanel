import React, { useState } from 'react';
import { Question } from '../../types/survey';
import { MapPin, AlertTriangle, Trees, Store, Home, Check, Info } from 'lucide-react';

interface Props {
  question: Question;
  value: { x: number; y: number; category: string; comment: string } | undefined;
  onChange: (value: { x: number; y: number; category: string; comment: string }) => void;
}

export const MapQuestion: React.FC<Props> = ({ question, value, onChange }) => {
  const pinCategories = question.pinCategories ?? [
    { id: 'verkeersveiligheid', label: 'Verkeersveiligheid & oversteek', color: '#EF4444', icon: 'AlertTriangle' },
    { id: 'groen_spelen', label: 'Groen, bomen & speelplek', color: '#10B981', icon: 'Trees' },
    { id: 'voorziening', label: 'Gewenste voorziening (winkel, zorg)', color: '#3B82F6', icon: 'Store' },
    { id: 'woningbouw', label: 'Idee voor woningtype of doelgroep', color: '#F59E0B', icon: 'Home' },
  ];

  const [selectedCategory, setSelectedCategory] = useState<string>(
    value?.category || pinCategories[0]?.id || 'verkeersveiligheid'
  );
  const [comment, setComment] = useState<string>(value?.comment || '');
  const [pinPosition, setPinPosition] = useState<{ x: number; y: number } | null>(
    value ? { x: value.x, y: value.y } : null
  );

  const handleMapClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = Math.round(((e.clientX - rect.left) / rect.width) * 100);
    const y = Math.round(((e.clientY - rect.top) / rect.height) * 100);

    const newPos = { x, y };
    setPinPosition(newPos);
    onChange({
      x,
      y,
      category: selectedCategory,
      comment,
    });
  };

  const handleCategoryChange = (catId: string) => {
    setSelectedCategory(catId);
    if (pinPosition) {
      onChange({
        ...pinPosition,
        category: catId,
        comment,
      });
    }
  };

  const handleCommentChange = (text: string) => {
    setComment(text);
    if (pinPosition) {
      onChange({
        ...pinPosition,
        category: selectedCategory,
        comment: text,
      });
    }
  };

  const activeCategoryObj = pinCategories.find((c) => c.id === selectedCategory);

  return (
    <div className="space-y-6">
      {/* Category selector */}
      <div>
        <label className="block text-xs font-semibold uppercase tracking-wider text-stone-500 mb-2">
          Stap 1: Kies het type markering
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          {pinCategories.map((cat) => {
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => handleCategoryChange(cat.id)}
                className={`p-3 rounded-xl border text-left flex items-center gap-2.5 transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-[#171717] text-white border-[#171717] shadow-xs'
                    : 'bg-white text-stone-800 border-stone-200 hover:border-stone-400'
                }`}
              >
                <div
                  className="w-3.5 h-3.5 rounded-full shrink-0"
                  style={{ backgroundColor: cat.color }}
                />
                <span className="text-xs font-semibold leading-tight">{cat.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Interactive Map Area */}
      <div>
        <div className="flex items-center justify-between text-xs text-stone-500 mb-2 font-medium">
          <span>Stap 2: Klik op de plattegrond om een pin te plaatsen</span>
          {pinPosition && (
            <span className="text-emerald-700 font-semibold flex items-center gap-1 font-mono">
              <Check className="w-3.5 h-3.5" />
              Pin geplaatst ({pinPosition.x}%, {pinPosition.y}%)
            </span>
          )}
        </div>

        <div
          onClick={handleMapClick}
          className="relative w-full h-80 sm:h-96 rounded-2xl border-2 border-dashed border-stone-300 hover:border-stone-500 bg-[#E8ECE9] overflow-hidden cursor-crosshair select-none transition-colors"
        >
          {/* Architectural Map Canvas SVG representation */}
          <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="grid" width="30" height="30" patternUnits="userSpaceOnUse">
                <path d="M 30 0 L 0 0 0 30" fill="none" stroke="#d5ded7" strokeWidth="1" />
              </pattern>
            </defs>

            {/* Background grid */}
            <rect width="100%" height="100%" fill="url(#grid)" />

            {question.mapAreaName?.toLowerCase().includes('dronten') ? (
              /* Dronten-Zuid Uitleggebied Layout: 4 Kwadranten + STOMP assen + Dorpsbos */
              <>
                {/* Polder tocht / watergang */}
                <path
                  d="M 0,195 Q 250,205 500,195 T 1000,200 L 1000,225 Q 750,220 500,225 T 0,220 Z"
                  fill="#cbe3f0"
                  stroke="#93c5fd"
                  strokeWidth="1.5"
                />
                <text x="25" y="212" fill="#1e40af" fontSize="10" fontFamily="sans-serif" fontWeight="bold">
                  Houtwijkertocht / Hoofdwatergang (10% waternorm)
                </text>

                {/* KWADRANT 3: Noord-West */}
                <rect x="35" y="25" width="220" height="150" rx="10" fill="#FFFFFF" stroke="#cbd5e1" strokeWidth="2" />
                <rect x="42" y="32" width="60" height="18" rx="4" fill="#f1f5f9" />
                <text x="48" y="45" fill="#475569" fontSize="10" fontWeight="bold">KWADRANT 3</text>
                <text x="45" y="70" fill="#1e293b" fontSize="12" fontWeight="bold">Noord-West (Woonbuurt)</text>
                <text x="45" y="88" fill="#64748b" fontSize="10">Aansluiting op bestaand Dronten</text>
                <text x="45" y="104" fill="#0284c7" fontSize="10">Brede school & Kindcentrum</text>

                {/* KWADRANT 1: Noord-Oost (Fase 1 / Startlocatie) */}
                <rect x="280" y="25" width="260" height="150" rx="10" fill="#f8fafc" stroke="#C4F000" strokeWidth="2.5" />
                <rect x="288" y="32" width="130" height="18" rx="4" fill="#C4F000" />
                <text x="295" y="45" fill="#171717" fontSize="10" fontWeight="bold">KWADRANT 1 (STARTFASE)</text>
                <text x="290" y="70" fill="#1e293b" fontSize="12" fontWeight="bold">Noord-Oost (1.100 woningen)</text>
                <text x="290" y="88" fill="#15803d" fontSize="10">200 Innovatieve + 300 Modulaire woningen</text>
                <text x="290" y="104" fill="#64748b" fontSize="10">Starterswoningen & Snelfietsroute</text>

                {/* KWADRANT 4: Zuid-West */}
                <rect x="35" y="240" width="220" height="130" rx="10" fill="#FFFFFF" stroke="#cbd5e1" strokeWidth="2" />
                <rect x="42" y="247" width="60" height="18" rx="4" fill="#f1f5f9" />
                <text x="48" y="260" fill="#475569" fontSize="10" fontWeight="bold">KWADRANT 4</text>
                <text x="45" y="285" fill="#1e293b" fontSize="12" fontWeight="bold">Zuid-West (Duurzame Erven)</text>
                <text x="45" y="303" fill="#64748b" fontSize="10">Boerenerven, Voedselbos & CPO</text>

                {/* KWADRANT 2: Zuid-Oost (Dorpsbos & Landschap) */}
                <rect x="280" y="240" width="260" height="130" rx="10" fill="#f0fdf4" stroke="#86efac" strokeWidth="2" />
                <rect x="288" y="247" width="145" height="18" rx="4" fill="#dcfce7" />
                <text x="295" y="260" fill="#166534" fontSize="10" fontWeight="bold">KWADRANT 2 (DORPSBOS)</text>
                <text x="290" y="285" fill="#1e293b" fontSize="12" fontWeight="bold">Zuid-Oost: 105 m² Groennorm</text>
                <text x="290" y="303" fill="#15803d" fontSize="10">45 m² Dorpsbos p.p. & Wadi's</text>

                {/* Dronterringweg / Hoofdontsluiting (Oostas) */}
                <line x1="565" y1="0" x2="565" y2="400" stroke="#94a3b8" strokeWidth="12" strokeDasharray="8 6" />
                <text x="585" y="120" fill="#475569" fontSize="10" fontWeight="bold" transform="rotate(90, 585, 120)">
                  Dronterringweg (N711 / Ontsluiting)
                </text>

                {/* STOMP Snelfietsas (Noord-Zuid door Kwadranten) */}
                <line x1="265" y1="0" x2="265" y2="400" stroke="#C4F000" strokeWidth="6" />
                <text x="245" y="25" fill="#171717" fontSize="9" fontWeight="bold" textAnchor="end">
                  STOMP Fietsas naar Station Dronten
                </text>
              </>
            ) : (
              /* Default Urban Block Canvas */
              <>
                <path
                  d="M 0,220 C 150,200 300,260 500,210 C 700,160 850,220 1000,190 L 1000,250 C 850,280 700,220 500,270 C 300,320 150,260 0,280 Z"
                  fill="#cbe3f0"
                  stroke="#a8cde3"
                />
                <text x="20" y="255" fill="#4b7899" fontSize="11" fontFamily="sans-serif" fontStyle="italic">
                  Watergang / Vaart
                </text>
                <rect x="50" y="30" width="160" height="90" rx="8" fill="#FFFFFF" stroke="#cbd5e1" strokeWidth="2" />
                <text x="65" y="65" fill="#64748b" fontSize="12" fontWeight="bold">Deelgebied Noord</text>
                <text x="65" y="85" fill="#94a3b8" fontSize="10">Woonblokken & Binnentuin</text>
                <rect x="250" y="30" width="220" height="120" rx="8" fill="#FFFFFF" stroke="#cbd5e1" strokeWidth="2" />
                <text x="270" y="65" fill="#64748b" fontSize="12" fontWeight="bold">Centraal Wijkpark (Plangebied)</text>
                <text x="270" y="85" fill="#10b981" fontSize="11">Toekomstig Stadsbos & Wadi's</text>
                <rect x="510" y="40" width="180" height="110" rx="8" fill="#FFFFFF" stroke="#cbd5e1" strokeWidth="2" />
                <text x="525" y="75" fill="#64748b" fontSize="12" fontWeight="bold">Mobiliteitshub Oost</text>
                <text x="525" y="95" fill="#94a3b8" fontSize="10">Deelauto's & Hub</text>
                <line x1="0" y1="170" x2="1000" y2="170" stroke="#94a3b8" strokeWidth="10" strokeDasharray="6 4" />
                <text x="350" y="165" fill="#475569" fontSize="11" fontWeight="bold" letterSpacing="1">
                  Hoofdas / Ontsluiting
                </text>
                <rect x="60" y="310" width="200" height="70" rx="8" fill="#FFFFFF" stroke="#cbd5e1" strokeWidth="2" />
                <text x="75" y="340" fill="#64748b" fontSize="12" fontWeight="bold">Bestaande Woonwijk</text>
                <rect x="300" y="310" width="240" height="70" rx="8" fill="#FFFFFF" stroke="#cbd5e1" strokeWidth="2" />
                <text x="315" y="340" fill="#64748b" fontSize="12" fontWeight="bold">Onderwijs & Sportzone</text>
              </>
            )}
          </svg>

          {/* Existing representative community pins from other residents */}
          <div className="absolute top-[22%] left-[32%] pointer-events-none flex items-center gap-1 opacity-70">
            <div className="w-5 h-5 rounded-full bg-emerald-500 text-white flex items-center justify-center text-[10px] font-bold shadow-xs">
              ✓
            </div>
            <span className="text-[10px] bg-white/90 px-1 rounded shadow-2xs font-medium text-stone-700">
              Veilige speelplek
            </span>
          </div>

          <div className="absolute top-[48%] left-[62%] pointer-events-none flex items-center gap-1 opacity-70">
            <div className="w-5 h-5 rounded-full bg-amber-500 text-white flex items-center justify-center text-[10px] font-bold shadow-xs">
              !
            </div>
            <span className="text-[10px] bg-white/90 px-1 rounded shadow-2xs font-medium text-stone-700">
              Oversteek fietsers
            </span>
          </div>

          {/* User's Placed Pin */}
          {pinPosition && (
            <div
              className="absolute -translate-x-1/2 -translate-y-full transition-transform duration-100 pointer-events-none"
              style={{ left: `${pinPosition.x}%`, top: `${pinPosition.y}%` }}
            >
              <div className="flex flex-col items-center">
                <div
                  className="px-2 py-0.5 rounded text-[11px] font-bold text-white shadow-md mb-1 whitespace-nowrap"
                  style={{ backgroundColor: activeCategoryObj?.color || '#EF4444' }}
                >
                  {activeCategoryObj?.label || 'Jouw pin'}
                </div>
                <div
                  className="w-8 h-8 rounded-full border-2 border-white flex items-center justify-center text-white shadow-lg animate-bounce"
                  style={{ backgroundColor: activeCategoryObj?.color || '#EF4444' }}
                >
                  <MapPin className="w-5 h-5" />
                </div>
              </div>
            </div>
          )}

          {/* Helper hint banner */}
          {!pinPosition && (
            <div className="absolute inset-x-0 bottom-4 flex justify-center pointer-events-none">
              <div className="bg-[#171717]/85 backdrop-blur-xs text-white text-xs px-4 py-2 rounded-full shadow-lg flex items-center gap-2">
                <Info className="w-4 h-4 text-[#C4F000]" />
                <span>Klik ergens op de kaart om jouw suggestie of knelpunt aan te wijzen</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Step 3: Comment description */}
      <div className="bg-white rounded-2xl border border-stone-200 p-5 space-y-2">
        <label className="block text-sm font-semibold text-stone-900">
          Stap 3: Licht jouw markering toe
        </label>
        <textarea
          rows={3}
          value={comment}
          onChange={(e) => handleCommentChange(e.target.value)}
          placeholder="Bijvoorbeeld: 'Hier is een veilige oversteekplaats nodig voor schoolgaande kinderen' of 'Goede locatie voor een ontmoetingstuin'..."
          className="w-full text-xs p-3 bg-stone-50 border border-stone-200 rounded-lg text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-[#171717] focus:bg-white resize-y"
        />
      </div>
    </div>
  );
};
