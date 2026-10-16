import React, { useState } from 'react';
import {
  BarChart3,
  TrendingUp,
  MapPin,
  ShieldCheck,
  Download,
  Building2,
  PieChart,
  Sliders,
  ArrowRight,
} from 'lucide-react';
import { AGGREGATED_INSIGHTS } from '../data/mockResults';

interface Props {
  onBackToHome: () => void;
  onStartSurvey: () => void;
}

export const PublicResults: React.FC<Props> = ({ onBackToHome, onStartSurvey }) => {
  const [selectedMunicipality, setSelectedMunicipality] = useState<string>('all');
  const [selectedTopic, setSelectedTopic] = useState<string>('all');

  const filteredInsights = AGGREGATED_INSIGHTS.filter((insight) => {
    if (selectedTopic !== 'all' && insight.category !== selectedTopic) return false;
    return true;
  });

  return (
    <main className="min-h-screen py-10 sm:py-16 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto space-y-10">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-stone-200 pb-8">
          <div>
            <div className="text-xs font-mono uppercase tracking-wider text-stone-500 mb-2 font-semibold">
              Kennisplatform & Open Onderzoeksdata
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-[#171717] tracking-tight">
              Onderzoeksresultaten & Wooninzichten
            </h1>
            <p className="text-stone-600 text-sm sm:text-base mt-2 max-w-2xl">
              Geaggregeerde resultaten uit het Woondata Bewonerspanel. Deze data ondersteunt gemeenteraden, woningcorporaties en gebiedsontwikkelaars met feitelijke burgerinbreng.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onStartSurvey}
              className="px-5 py-2.5 text-xs font-bold text-[#171717] bg-[#C4F000] hover:bg-[#b5de00] rounded-xl transition-colors cursor-pointer shadow-xs flex items-center gap-2"
            >
              <span>Zelf deelnemen</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={onBackToHome}
              className="px-4 py-2.5 text-xs font-semibold text-stone-700 bg-white border border-stone-200 hover:bg-stone-50 rounded-xl transition-colors cursor-pointer"
            >
              Terug
            </button>
          </div>
        </div>

        {/* Filter Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-stone-200 shadow-2xs">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-stone-500">Filter thema:</span>
            <div className="flex items-center gap-1 bg-stone-100 p-1 rounded-lg">
              <button
                onClick={() => setSelectedTopic('all')}
                className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors cursor-pointer ${
                  selectedTopic === 'all' ? 'bg-white text-stone-900 shadow-xs' : 'text-stone-600'
                }`}
              >
                Alles
              </button>
              <button
                onClick={() => setSelectedTopic('woonwensen')}
                className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors cursor-pointer ${
                  selectedTopic === 'woonwensen' ? 'bg-white text-stone-900 shadow-xs' : 'text-stone-600'
                }`}
              >
                Woonwensen
              </button>
              <button
                onClick={() => setSelectedTopic('woonscan')}
                className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors cursor-pointer ${
                  selectedTopic === 'woonscan' ? 'bg-white text-stone-900 shadow-xs' : 'text-stone-600'
                }`}
              >
                Woonscan
              </button>
              <button
                onClick={() => setSelectedTopic('woonopinie')}
                className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors cursor-pointer ${
                  selectedTopic === 'woonopinie' ? 'bg-white text-stone-900 shadow-xs' : 'text-stone-600'
                }`}
              >
                Woonopinie
              </button>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-stone-500">Regio / Gemeente:</span>
            <select
              value={selectedMunicipality}
              onChange={(e) => setSelectedMunicipality(e.target.value)}
              className="bg-stone-50 border border-stone-200 rounded-lg text-xs py-1.5 px-3 text-stone-800 focus:outline-none"
            >
              <option value="all">Landelijk (Alle 42 gemeenten)</option>
              <option value="utrecht">Utrecht (GM0344)</option>
              <option value="amsterdam">Amsterdam (GM0363)</option>
              <option value="rotterdam">Rotterdam (GM0599)</option>
              <option value="eindhoven">Eindhoven (GM0772)</option>
            </select>
          </div>
        </div>

        {/* High Level Key Metric Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {filteredInsights.slice(0, 3).map((item, idx) => (
            <div
              key={idx}
              className="bg-white rounded-2xl border border-stone-200 p-6 flex flex-col justify-between"
            >
              <div>
                <span className="text-xs font-mono uppercase tracking-wider text-stone-400">
                  {item.category}
                </span>
                <h3 className="text-sm font-semibold text-stone-800 mt-1 mb-4">
                  {item.metric}
                </h3>
                <div className="text-3xl font-extrabold font-mono text-[#171717] tabular-nums mb-1">
                  {item.value}
                </div>
                <div className="text-xs text-emerald-700 font-medium">
                  {item.change}
                </div>
              </div>
              <div className="pt-4 mt-4 border-t border-stone-100 text-[11px] text-stone-400 font-mono">
                {item.source}
              </div>
            </div>
          ))}
        </div>

        {/* Visual Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Chart 1: Woningtype Behoefte Verdeling */}
          <div className="bg-white rounded-3xl border border-stone-200 p-6 sm:p-8 space-y-6">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-lg font-bold text-[#171717]">
                  Woningtype voorkeur (Woonwensen)
                </h3>
                <p className="text-xs text-stone-500 mt-0.5">
                  Gewenste woningvorm onder actieve woningzoekenden (N = 8.420)
                </p>
              </div>
              <span className="text-xs font-mono text-stone-400">2026</span>
            </div>

            <div className="space-y-4">
              {[
                { type: 'Appartement met lift & balkon', pct: 36, count: '3.031' },
                { type: 'Eengezinswoning (rijwoning / hoek)', pct: 31, count: '2.610' },
                { type: 'Levensloopbestendig gelijkvloers', pct: 18, count: '1.515' },
                { type: 'Tiny House / CPO / Collectief', pct: 9, count: '757' },
                { type: 'Twee-onder-een-kap / Vrijstaand', pct: 6, count: '505' },
              ].map((row) => (
                <div key={row.type} className="space-y-1">
                  <div className="flex justify-between text-xs font-medium">
                    <span className="text-stone-800">{row.type}</span>
                    <span className="font-mono text-stone-700">
                      <strong>{row.pct}%</strong> ({row.count})
                    </span>
                  </div>
                  <div className="w-full h-3 bg-stone-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[#171717] rounded-full"
                      style={{ width: `${row.pct}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Chart 2: Betaalbaarheidsgrenzen */}
          <div className="bg-white rounded-3xl border border-stone-200 p-6 sm:p-8 space-y-6">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-lg font-bold text-[#171717]">
                  Betaalbaarheid: Maximaal Woonbudget
                </h3>
                <p className="text-xs text-stone-500 mt-0.5">
                  Verdeling maximaal haalbare koopsom vrij op naam (v.o.n.)
                </p>
              </div>
              <span className="text-xs font-mono text-stone-400">Koopsegment</span>
            </div>

            <div className="space-y-4">
              {[
                { bracket: 'Tot € 300.000 (Startersbudget)', pct: 24, label: 'Groot tekort aanbod' },
                { bracket: '€ 300.000 – € 405.000 (Betaalbaarheidsgrens NHG)', pct: 41, label: 'Hoogste zoekvolume' },
                { bracket: '€ 405.000 – € 550.000 (Middensegment)', pct: 23, label: 'Doorstromers' },
                { bracket: 'Boven € 550.000 (Hoger segment)', pct: 12, label: 'Ruim aanbod' },
              ].map((row) => (
                <div key={row.bracket} className="space-y-1">
                  <div className="flex justify-between text-xs font-medium">
                    <span className="text-stone-800">{row.bracket}</span>
                    <span className="font-mono text-stone-700">
                      <strong>{row.pct}%</strong>
                    </span>
                  </div>
                  <div className="w-full h-3 bg-stone-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${
                        row.pct > 30 ? 'bg-[#C4F000]' : 'bg-stone-800'
                      }`}
                      style={{ width: `${row.pct}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="p-3 bg-stone-50 rounded-xl text-xs text-stone-600 flex items-center justify-between">
              <span>65% zoekt binnen de wettelijke betaalbaarheidsgrens van € 405.000</span>
              <span className="font-mono font-bold text-stone-900">NHG 2026</span>
            </div>
          </div>
        </div>

        {/* Privacy Note */}
        <div className="bg-stone-50 border border-stone-200 rounded-2xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-stone-600">
          <div className="flex items-center gap-3">
            <ShieldCheck className="w-6 h-6 text-emerald-600 shrink-0" />
            <span>
              Alle getoonde statistieken zijn geaggregeerd (k-anonimiteit gewaarborgd bij n &ge; 15 per cohort). Individuele burgerantwoorden zijn conform de AVG nooit herleidbaar.
            </span>
          </div>
          <button
            onClick={onStartSurvey}
            className="px-4 py-2 bg-[#171717] text-white font-bold text-xs rounded-lg shrink-0 cursor-pointer hover:bg-black"
          >
            Doe zelf mee
          </button>
        </div>
      </div>
    </main>
  );
};
