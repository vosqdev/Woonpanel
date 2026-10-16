import React from 'react';
import { WoonscanSummary } from '../types/survey';
import {
  ShieldAlert,
  ArrowLeft,
  Download,
  Share2,
  CheckCircle2,
  AlertTriangle,
  Lightbulb,
  Building,
  Sparkles,
} from 'lucide-react';

interface Props {
  summary: WoonscanSummary;
  onBackToHome: () => void;
  onExploreSurveys: () => void;
}

export const WoonscanReport: React.FC<Props> = ({
  summary,
  onBackToHome,
  onExploreSurveys,
}) => {
  const { overallScore, categories, keyFindings } = summary;

  const categoryList = [
    categories.comfort,
    categories.betaalbaarheid,
    categories.energie,
    categories.leefomgeving,
    categories.toekomstbestendigheid,
  ];

  const handlePrint = () => {
    window.print();
  };

  return (
    <main className="min-h-screen py-10 sm:py-16 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto">
        {/* Navigation & Actions Top */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <button
            onClick={onBackToHome}
            className="inline-flex items-center gap-2 text-xs font-semibold text-stone-600 hover:text-black transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Terug naar hoofdpagina</span>
          </button>

          <div className="flex items-center gap-2.5">
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-stone-800 bg-white border border-stone-200 hover:bg-stone-50 rounded-lg shadow-2xs transition-colors cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Rapport opslaan / printen</span>
            </button>
            <button
              onClick={onExploreSurveys}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-[#171717] bg-[#C4F000] hover:bg-[#b5de00] rounded-lg shadow-2xs transition-colors cursor-pointer"
            >
              <span>Andere onderzoeken</span>
            </button>
          </div>
        </div>

        {/* Report Card Banner */}
        <div className="bg-[#171717] text-white rounded-3xl p-8 sm:p-12 mb-8 shadow-md">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
            <div className="space-y-3 max-w-xl">
              <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-stone-400">
                <Sparkles className="w-4 h-4 text-[#C4F000]" />
                <span>Persoonlijk Onderzoeksrapport · Woonscan 2026</span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
                Jouw Woonscan
              </h1>
              <p className="text-stone-300 text-sm leading-relaxed">
                Op basis van jouw antwoorden hebben we een indicatieve analyse opgesteld van jouw huidige woonsituatie, wooncomfort, energielasten en toekomstbestendigheid.
              </p>
            </div>

            {/* Big Overall Gauge */}
            <div className="bg-[#242424] border border-stone-800 rounded-2xl p-6 flex flex-col items-center justify-center shrink-0 w-full sm:w-56 text-center">
              <span className="text-xs uppercase font-mono tracking-wider text-stone-400 mb-1">
                Totaalscore Woonsituatie
              </span>
              <div className="text-5xl font-black font-mono text-[#C4F000] tabular-nums my-1">
                {overallScore}
                <span className="text-2xl text-stone-500 font-normal">/100</span>
              </div>
              <span className="text-xs text-stone-300 font-medium">
                {overallScore >= 75
                  ? 'Bovengemiddeld wooncomfort'
                  : overallScore >= 55
                  ? 'Gemiddelde woonsituatie'
                  : 'Meerdere verbeterpunten'}
              </span>
            </div>
          </div>
        </div>

        {/* Required Mandatory Disclaimer (Section F) */}
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 sm:p-5 mb-8 flex items-start gap-3.5 text-xs text-amber-900 leading-relaxed">
          <ShieldAlert className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div>
            <strong className="font-semibold block mb-0.5">Indicatieve weergave</strong>
            De score is een indicatieve weergave van uw eigen antwoorden en geen objectief kwaliteitscertificaat of bouwkundig keuringsrapport van de woning. Er kunnen geen rechten aan worden ontleend.
          </div>
        </div>

        {/* 5 Themes Detailed Breakdown */}
        <div className="mb-12 space-y-6">
          <h2 className="text-xl font-extrabold text-[#171717] tracking-tight">
            Beoordeling op 5 kernthema's
          </h2>

          <div className="grid grid-cols-1 gap-4">
            {categoryList.map((cat, idx) => {
              return (
                <div
                  key={cat.category}
                  className="bg-white rounded-2xl border border-stone-200 p-6 hover:border-stone-300 transition-all"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-3">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-mono text-xs text-stone-400">0{idx + 1}.</span>
                        <h3 className="text-base font-bold text-[#171717]">{cat.category}</h3>
                        <span className="text-stone-300">·</span>
                        <span className="text-xs font-semibold text-stone-600">{cat.label}</span>
                      </div>
                      <p className="text-xs text-stone-500">{cat.insight}</p>
                    </div>

                    <div className="flex items-center gap-4 shrink-0">
                      <div className="text-right">
                        <div className="font-mono font-bold text-lg text-[#171717] tabular-nums">
                          {cat.score}
                          <span className="text-xs text-stone-400 font-normal"> / 100</span>
                        </div>
                        <div className="text-[11px] text-stone-500 font-mono">
                          Regionaal gem: {cat.benchmarkScore}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Progress bar comparison */}
                  <div className="space-y-1 mb-4">
                    <div className="w-full h-2.5 bg-stone-100 rounded-full overflow-hidden relative">
                      {/* Benchmark marker line */}
                      <div
                        className="absolute top-0 bottom-0 w-1 bg-stone-400 z-10"
                        style={{ left: `${cat.benchmarkScore}%` }}
                        title={`Regionaal gemiddelde: ${cat.benchmarkScore}`}
                      />
                      {/* User score bar */}
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${
                          cat.score >= 70
                            ? 'bg-[#171717]'
                            : cat.score >= 50
                            ? 'bg-amber-600'
                            : 'bg-rose-600'
                        }`}
                        style={{ width: `${cat.score}%` }}
                      />
                    </div>
                  </div>

                  {/* Actionable Tips */}
                  <div className="bg-stone-50 rounded-xl p-3.5 space-y-1.5 text-xs text-stone-700">
                    <div className="flex items-center gap-1.5 font-semibold text-stone-800 text-[11px] uppercase tracking-wider">
                      <Lightbulb className="w-3.5 h-3.5 text-amber-500" />
                      <span>Handelingsperspectief & tips voor jouw woning</span>
                    </div>
                    <ul className="list-disc list-inside space-y-1 text-stone-600 pl-1">
                      {cat.tips.map((tip, tIdx) => (
                        <li key={tIdx}>{tip}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Summary Key Findings Card */}
        <div className="bg-white rounded-2xl border border-stone-200 p-8 space-y-4">
          <h3 className="text-base font-bold text-[#171717] flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
            <span>Samenvatting & Uitkomsten</span>
          </h3>
          <ul className="space-y-2 text-sm text-stone-600">
            {keyFindings.map((finding, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <span className="text-[#171717] font-bold">·</span>
                <span>{finding}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </main>
  );
};
