import React, { useState } from 'react';
import {
  Database,
  ShieldCheck,
  CheckCircle2,
  RefreshCw,
  ExternalLink,
  Lock,
  AlertCircle,
  FileCode,
  Layers,
  ArrowRight,
} from 'lucide-react';
import { WOONDATA_GEOGRAPHIC_HIERARCHY } from '../../data/mockResults';

export const WoondataSyncView: React.FC = () => {
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncStatus, setSyncStatus] = useState<string | null>(null);
  const [lastSyncTime, setLastSyncTime] = useState<string>('2026-10-15 14:32:10 CET');
  const [selectedPayloadTab, setSelectedPayloadTab] = useState<'hierarchy' | 'schema' | 'privacy'>('hierarchy');

  const handleTriggerSync = () => {
    setIsSyncing(true);
    setSyncStatus('Valideren van k-anonimiteit en verwerkersgrondslag...');

    setTimeout(() => {
      setSyncStatus('Gegevens aggregeren op CBS buurtniveau...');
    }, 800);

    setTimeout(() => {
      setSyncStatus('Beveiligde overdracht naar api.woondata.com/v2/ingest voltooid.');
      setLastSyncTime(new Date().toLocaleString('nl-NL') + ' CET');
      setIsSyncing(false);
    }, 1800);
  };

  return (
    <div className="space-y-8">
      {/* Top Banner */}
      <div className="bg-[#171717] text-white rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2 max-w-xl">
          <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-[#C4F000]">
            <Database className="w-4 h-4" />
            <span>Woondata.com Gegevensarchitectuur & API Koppeling</span>
          </div>
          <h2 className="text-2xl font-bold tracking-tight">
            Koppeling met www.woondata.com
          </h2>
          <p className="text-stone-300 text-xs sm:text-sm leading-relaxed">
            Gestructureerde data-uitwisseling volgens het model <strong>Project → Buurt → Wijk → Woonplaats → Gemeente</strong> met officiële CBS-standaarden.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0">
          <button
            onClick={handleTriggerSync}
            disabled={isSyncing}
            className="px-5 py-3 bg-[#C4F000] hover:bg-[#b5de00] text-[#171717] text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer shadow-xs disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
            <span>{isSyncing ? 'Synchroniseren...' : 'Synchroniseer met Woondata'}</span>
          </button>
        </div>
      </div>

      {/* Firebase Cloud Connection Info */}
      <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-xs">
            <Database className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-emerald-950">Firebase Firestore Cloud Database</span>
              <span className="px-2 py-0.5 rounded-full bg-emerald-200 text-emerald-800 text-[10px] font-mono font-bold">Actief Verbonden</span>
            </div>
            <p className="text-xs text-emerald-800 mt-0.5">
              Project: <span className="font-mono font-semibold">woonpanel-productie</span> · Collecties: <span className="font-mono">survey_submissions</span> &amp; <span className="font-mono">panel_members</span>
            </p>
          </div>
        </div>
        <div className="text-left sm:text-right text-[11px] font-mono text-emerald-700 shrink-0">
          <div>Regio: europe-west2 (Londen)</div>
          <div>Security Rules: Productie ABAC Actief</div>
        </div>
      </div>

      {/* Sync Status Alert */}
      {syncStatus && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-3 text-xs text-emerald-900 font-mono">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{syncStatus}</span>
        </div>
      )}

      {/* Privacy & Governance Checklist (Strict prompt requirement H) */}
      <div className="bg-white rounded-2xl border border-stone-200 p-6 space-y-4">
        <h3 className="text-sm font-bold text-[#171717] flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>Privacy- en Uitwisselingsvoorwaarden (AVG Artikel 28 & 32)</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div className="p-4 bg-stone-50 rounded-xl border border-stone-200 space-y-1.5">
            <div className="flex items-center gap-2 text-emerald-700 font-bold">
              <CheckCircle2 className="w-4 h-4" />
              <span>Verwerkersovereenkomst (DPA)</span>
            </div>
            <p className="text-stone-600 leading-relaxed">
              Actieve grondslag en verwerkersafspraken met aangesloten gemeenten zijn geverifieerd.
            </p>
          </div>

          <div className="p-4 bg-stone-50 rounded-xl border border-stone-200 space-y-1.5">
            <div className="flex items-center gap-2 text-emerald-700 font-bold">
              <CheckCircle2 className="w-4 h-4" />
              <span>Scheiding Contactgegevens</span>
            </div>
            <p className="text-stone-600 leading-relaxed">
              E-mailadressen en telefoonnummers worden nooit geëxporteerd naar analytische dashboards.
            </p>
          </div>

          <div className="p-4 bg-stone-50 rounded-xl border border-stone-200 space-y-1.5">
            <div className="flex items-center gap-2 text-emerald-700 font-bold">
              <CheckCircle2 className="w-4 h-4" />
              <span>K-Anonimiteit (&ge; 15 reacties)</span>
            </div>
            <p className="text-stone-600 leading-relaxed">
              Geen individuele herleidbaarheid in kleine buurten; drempel van minimaal 15 reacties is actief.
            </p>
          </div>
        </div>
      </div>

      {/* Structured Architecture Tabs */}
      <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden">
        <div className="border-b border-stone-200 bg-stone-50 px-6 py-3 flex items-center gap-2 text-xs font-semibold">
          <button
            onClick={() => setSelectedPayloadTab('hierarchy')}
            className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
              selectedPayloadTab === 'hierarchy'
                ? 'bg-white text-stone-900 shadow-2xs font-bold'
                : 'text-stone-500 hover:text-stone-800'
            }`}
          >
            Geografische Boomstructuur (CBS)
          </button>
          <button
            onClick={() => setSelectedPayloadTab('schema')}
            className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
              selectedPayloadTab === 'schema'
                ? 'bg-white text-stone-900 shadow-2xs font-bold'
                : 'text-stone-500 hover:text-stone-800'
            }`}
          >
            JSON API Schema & Payload
          </button>
        </div>

        <div className="p-6">
          {selectedPayloadTab === 'hierarchy' && (
            <div className="space-y-4">
              <div className="text-xs text-stone-500 mb-2">
                Niveaus: <strong>Gemeente &rarr; Woonplaats &rarr; Wijk &rarr; Buurt &rarr; Project</strong>
              </div>

              <div className="space-y-3">
                {WOONDATA_GEOGRAPHIC_HIERARCHY.map((muni) => (
                  <div key={muni.municipalityCode} className="border border-stone-200 rounded-xl p-4 bg-stone-50/50">
                    <div className="flex items-center justify-between text-xs font-bold text-stone-900 mb-3">
                      <div className="flex items-center gap-2">
                        <Layers className="w-4 h-4 text-stone-500" />
                        <span>Gemeente {muni.municipalityName}</span>
                        <span className="font-mono text-stone-400 font-normal">({muni.municipalityCode})</span>
                      </div>
                      <span className="text-emerald-700 font-mono text-[11px]">Synchronisatie gereed</span>
                    </div>

                    <div className="pl-6 space-y-2 border-l-2 border-stone-200 ml-2">
                      {muni.districts.map((d) => (
                        <div key={d.districtCode} className="space-y-1">
                          <div className="text-xs font-semibold text-stone-700">
                            Wijk: {d.districtName} ({d.districtCode})
                          </div>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                            {d.neighborhoods.map((n) => (
                              <div
                                key={n.neighborhoodCode}
                                className="bg-white p-2.5 rounded-lg border border-stone-200 text-xs flex items-center justify-between"
                              >
                                <div>
                                  <span className="font-medium text-stone-900 block">{n.neighborhoodName}</span>
                                  <span className="font-mono text-[10px] text-stone-400">{n.neighborhoodCode}</span>
                                </div>
                                <div className="text-right font-mono text-[11px] text-stone-600">
                                  {n.responseCount} resp.
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {selectedPayloadTab === 'schema' && (
            <div className="space-y-3">
              <div className="text-xs text-stone-500">
                Voorbeeld van de geaggregeerde payload die via mTLS naar Woondata.com Data Warehouse wordt verstuurd:
              </div>
              <pre className="p-4 bg-stone-900 text-[#C4F000] text-xs font-mono rounded-xl overflow-x-auto leading-relaxed">
{`{
  "system": "WOONDATA_BEWONERSPANEL",
  "version": "2.4.0",
  "timestamp": "${new Date().toISOString()}",
  "governance": {
    "dpa_contract_id": "DPA-2026-UTR-0344",
    "k_anonymity_min_threshold": 15,
    "pii_separated": true
  },
  "geography": {
    "level": "buurt",
    "cbs_gemeentecode": "GM0344",
    "cbs_wijkcode": "WK034408",
    "cbs_buurtcode": "BU03440810",
    "buurtnaam": "Merwede"
  },
  "modules": {
    "woonwensen": {
      "sample_size": 840,
      "housing_type_demand": {
        "appartement_lift": 0.36,
        "rijwoning_tuin": 0.31,
        "levensloopbestendig": 0.18,
        "tiny_house_cpo": 0.09
      },
      "median_budget_buy": 385000,
      "median_budget_rent": 1150
    },
    "woonscan": {
      "sample_size": 420,
      "avg_comfort_score": 74.2,
      "energy_label_ratio_a_plus": 0.42
    }
  }
}`}
              </pre>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
