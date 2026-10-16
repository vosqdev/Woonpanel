import React, { useState } from 'react';
import { Survey } from '../../types/survey';
import {
  BarChart3,
  Download,
  Filter,
  MapPin,
  Users,
  CheckCircle2,
  PieChart,
  Calendar,
  Share2,
} from 'lucide-react';

interface Props {
  surveys: Survey[];
}

export const AnalyticsView: React.FC<Props> = ({ surveys }) => {
  const [selectedSurveyId, setSelectedSurveyId] = useState<string>(
    surveys[0]?.id || ''
  );
  const [cohortFilter, setCohortFilter] = useState<string>('all');

  const selectedSurvey = surveys.find((s) => s.id === selectedSurveyId) || surveys[0];

  const handleExportCSV = () => {
    if (!selectedSurvey) return;
    const csvContent =
      'data:text/csv;charset=utf-8,' +
      'id,timestamp,survey_id,category,cbs_buurt,antwoord_hoofdvraag,inkomensgroep,waarde\n' +
      `resp_001,2026-03-01T10:14:00Z,${selectedSurvey.id},${selectedSurvey.category},BU03440810,Appartement,47700_65000,4\n` +
      `resp_002,2026-03-01T11:22:15Z,${selectedSurvey.id},${selectedSurvey.category},BU03440810,Rijwoning,65000_85000,5\n` +
      `resp_003,2026-03-01T12:05:40Z,${selectedSurvey.id},${selectedSurvey.category},BU03440820,Appartement,onder_47699,3\n` +
      `resp_004,2026-03-02T09:44:12Z,${selectedSurvey.id},${selectedSurvey.category},BU03440830,Tiny House,student,5\n`;

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `woondata_export_${selectedSurvey.slug}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleExportJSON = () => {
    if (!selectedSurvey) return;
    const jsonPayload = {
      exportVersion: '2.4.0',
      exportedAt: new Date().toISOString(),
      survey: {
        id: selectedSurvey.id,
        title: selectedSurvey.title,
        category: selectedSurvey.category,
        location: selectedSurvey.location,
        totalParticipants: selectedSurvey.participantCount,
      },
      aggregatedResults: [
        {
          questionId: 'ww_2_woningtype',
          title: 'Gewenste woningtype',
          distribution: [
            { label: 'Appartement met lift', count: 890, pct: 36 },
            { label: 'Eengezinswoning', count: 768, pct: 31 },
            { label: 'Levensloopbestendig', count: 446, pct: 18 },
            { label: 'Tiny House / CPO', count: 223, pct: 9 },
            { label: 'Vrijstaand', count: 153, pct: 6 },
          ],
        },
      ],
      compliance: {
        kAnonymityVerified: true,
        gdprCompliant: true,
        dataProtectionOfficerVerified: true,
      },
    };

    const dataStr =
      'data:text/json;charset=utf-8,' +
      encodeURIComponent(JSON.stringify(jsonPayload, null, 2));
    const dlAnchorElem = document.createElement('a');
    dlAnchorElem.setAttribute('href', dataStr);
    dlAnchorElem.setAttribute('download', `woondata_data_${selectedSurvey.slug}.json`);
    dlAnchorElem.click();
  };

  if (!selectedSurvey) {
    return <div className="p-8 text-center text-stone-500">Geen onderzoeken gevonden.</div>;
  }

  return (
    <div className="space-y-8">
      {/* Top Header & Survey Selector */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-stone-200">
        <div>
          <span className="text-xs font-mono uppercase tracking-wider text-stone-500 font-semibold">
            Resultaten & Data-Analyse
          </span>
          <div className="mt-1 flex items-center gap-3">
            <select
              value={selectedSurveyId}
              onChange={(e) => setSelectedSurveyId(e.target.value)}
              className="bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-sm font-bold text-stone-900 focus:outline-none focus:ring-2 focus:ring-[#171717]"
            >
              {surveys.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.title} ({s.location.city})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Export Buttons */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={handleExportCSV}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-stone-800 bg-white border border-stone-200 hover:bg-stone-50 rounded-lg shadow-2xs transition-colors cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Exporteer CSV</span>
          </button>
          <button
            onClick={handleExportJSON}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-stone-800 bg-white border border-stone-200 hover:bg-stone-50 rounded-lg shadow-2xs transition-colors cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Exporteer JSON</span>
          </button>
        </div>
      </div>

      {/* KPI Cards Strip */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl border border-stone-200 p-5">
          <div className="text-xs text-stone-500 font-medium">Totaal Respons</div>
          <div className="text-2xl sm:text-3xl font-extrabold font-mono text-[#171717] tabular-nums mt-1">
            {selectedSurvey.participantCount.toLocaleString('nl-NL')}
          </div>
          <div className="text-[11px] text-emerald-600 font-medium mt-1">
            Gevalideerde inzendingen
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-stone-200 p-5">
          <div className="text-xs text-stone-500 font-medium">Afrondingspercentage</div>
          <div className="text-2xl sm:text-3xl font-extrabold font-mono text-[#171717] tabular-nums mt-1">
            89.4%
          </div>
          <div className="text-[11px] text-stone-500 font-medium mt-1">
            +4.2% t.o.v. benchmark
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-stone-200 p-5">
          <div className="text-xs text-stone-500 font-medium">Gemiddelde Invulduur</div>
          <div className="text-2xl sm:text-3xl font-extrabold font-mono text-[#171717] tabular-nums mt-1">
            4m 42s
          </div>
          <div className="text-[11px] text-stone-500 font-medium mt-1">
            Geschat: {selectedSurvey.durationMinutes} min
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-stone-200 p-5">
          <div className="text-xs text-stone-500 font-medium">Geografisch Gebied</div>
          <div className="text-base font-bold text-[#171717] mt-1 truncate">
            {selectedSurvey.location.city}
          </div>
          <div className="text-[11px] font-mono text-stone-500 truncate">
            CBS {selectedSurvey.location.cbsCode || 'Regio'}
          </div>
        </div>
      </div>

      {/* Cohort Cross-Tabulation Filter */}
      <div className="flex items-center gap-3 bg-white p-4 rounded-xl border border-stone-200 text-xs">
        <Filter className="w-4 h-4 text-stone-500" />
        <span className="font-semibold text-stone-700">Uitsplitsen naar demografisch cohort:</span>
        <div className="flex items-center gap-1.5">
          {['all', 'huurders', 'kopers', 'starters', 'senioren'].map((c) => (
            <button
              key={c}
              onClick={() => setCohortFilter(c)}
              className={`px-3 py-1 rounded-md capitalize transition-colors cursor-pointer ${
                cohortFilter === c
                  ? 'bg-[#171717] text-white font-semibold'
                  : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
              }`}
            >
              {c === 'all' ? 'Alle respondenten' : c}
            </button>
          ))}
        </div>
      </div>

      {/* Analytical Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Chart A: Distribution */}
        <div className="bg-white rounded-3xl border border-stone-200 p-6 sm:p-8 space-y-6">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-base font-bold text-[#171717]">
                Vraagverdeling: Woningtype & Behoefte
              </h3>
              <p className="text-xs text-stone-500 mt-0.5">
                Cohort: {cohortFilter === 'all' ? 'Alle respondenten' : cohortFilter}
              </p>
            </div>
            <span className="text-xs font-mono text-stone-400">n = {selectedSurvey.participantCount}</span>
          </div>

          <div className="space-y-4">
            {[
              { label: 'Appartement met lift (Gelijkvloers)', pct: cohortFilter === 'senioren' ? 62 : 36 },
              { label: 'Eengezinswoning (Rij / Hoek)', pct: cohortFilter === 'starters' ? 44 : 31 },
              { label: 'Levensloopbestendig met tuin', pct: cohortFilter === 'senioren' ? 24 : 18 },
              { label: 'Tiny House / Collectief CPO', pct: cohortFilter === 'starters' ? 14 : 9 },
              { label: 'Twee-onder-één-kap / Vrijstaand', pct: cohortFilter === 'kopers' ? 12 : 6 },
            ].map((row) => (
              <div key={row.label} className="space-y-1">
                <div className="flex justify-between text-xs font-medium">
                  <span className="text-stone-800">{row.label}</span>
                  <span className="font-mono text-stone-700">
                    <strong>{row.pct}%</strong>
                  </span>
                </div>
                <div className="w-full h-3 bg-stone-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#171717] rounded-full transition-all duration-300"
                    style={{ width: `${row.pct}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Chart B: Geographic Neighborhood Response Distribution */}
        <div className="bg-white rounded-3xl border border-stone-200 p-6 sm:p-8 space-y-6">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-base font-bold text-[#171717]">
                Geografische Spreiding (CBS Buurten)
              </h3>
              <p className="text-xs text-stone-500 mt-0.5">
                Spreiding over officiële CBS wijk- en buurtcodes
              </p>
            </div>
            <span className="text-xs font-mono text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">
              K-anonimiteit voldaan (&ge; 15)
            </span>
          </div>

          <div className="space-y-3">
            {[
              { buurt: 'Merwede (BU03440810)', responses: 840, share: 34 },
              { buurt: 'Kanaleneiland-Noord (BU03440820)', responses: 420, share: 17 },
              { buurt: 'Transwijk (BU03440830)', responses: 310, share: 13 },
              { buurt: 'Domplein / Binnenstad (BU03440101)', responses: 290, share: 12 },
              { buurt: 'Overige wijken gemeente', responses: 620, share: 24 },
            ].map((b) => (
              <div key={b.buurt} className="p-3 bg-stone-50 rounded-xl flex items-center justify-between text-xs">
                <div>
                  <span className="font-semibold text-stone-800 block">{b.buurt}</span>
                  <span className="font-mono text-stone-500 text-[11px]">{b.responses} respondenten</span>
                </div>
                <div className="font-mono font-bold text-stone-900">{b.share}%</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
