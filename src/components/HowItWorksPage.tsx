import React from 'react';
import {
  Database,
  Building2,
  TrendingUp,
  ShieldCheck,
  ExternalLink,
} from 'lucide-react';

interface Props {
  onBackToHome: () => void;
  onStartSurvey?: () => void;
  onOpenAdminLogin?: () => void;
}

export const HowItWorksPage: React.FC<Props> = ({
  onBackToHome,
}) => {
  return (
    <main className="min-h-screen py-10 sm:py-16 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto space-y-6">
        <button
          onClick={onBackToHome}
          className="text-xs font-semibold text-stone-600 hover:text-black transition-colors cursor-pointer flex items-center gap-1.5"
        >
          <span>&larr;</span>
          <span>Terug naar overzicht</span>
        </button>

        {/* Eén duidelijk geheel: Alles in één harmonieus containerblok */}
        <div className="bg-white rounded-3xl border border-stone-200 p-8 sm:p-12 space-y-10 shadow-xs">
          {/* Hoofdsectie & Introductie */}
          <div className="space-y-4 max-w-4xl">
            <div className="text-xs font-mono uppercase tracking-wider text-stone-500 font-semibold flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#171717]"></span>
              <span>Onderzoeksmethodiek & Burgerparticipatie · Woondata.com</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#171717] tracking-tight">
              Hoe het Woondata - Woonpanel werkt
            </h1>

            <p className="text-stone-700 text-base sm:text-lg leading-relaxed">
              Het Woondata Woonpanel slaat een brug tussen de daadwerkelijke woonwensen van inwoners en behoeften maar deze ook onder de aandacht brengen. Gericht op inwoners van Dronten, Biddinghuizen en Swifterbant, maar ook op mensen van buiten die hier mogelijk willen wonen.
            </p>
          </div>

          {/* Verbindingsblok: Hoe data gebruikt wordt bij Woondata.com */}
          <div className="p-6 sm:p-8 rounded-2xl bg-stone-50 border border-stone-200/80 space-y-3">
            <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-stone-600 font-semibold">
              <Database className="w-4 h-4 text-[#171717]" />
              <span>Hoe de data van de onderzoeken gebruikt wordt bij Woondata.com</span>
            </div>
            <p className="text-sm sm:text-base text-stone-700 leading-relaxed">
              De resultaten uit de woononderzoeken blijven niet op zichzelf staan. Bij Woondata.com worden de geaggregeerde uitkomsten van het panel gecombineerd met openbare data en marktinformatie. Zo ontstaat een compleet en betrouwbaar beeld van de werkelijke behoefte en vraag.
            </p>
            <div className="pt-3 border-t border-stone-200/70 text-xs sm:text-sm text-stone-500 font-mono leading-relaxed">
              De geaggregeerde onderzoeksresultaten worden uitsluitend via de beheeromgeving beschikbaar gesteld aan woondata om zo markt en openbare data samen te laten komen.
            </div>
          </div>

          {/* De 3 stappen / pijlers in één lijn naast elkaar */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pt-1 items-stretch">
            {/* Kaart 1 (Afbeelding 2): Inwoners geven hun mening */}
            <div className="bg-white rounded-2xl border border-stone-200 p-6 sm:p-7 flex flex-col justify-between shadow-2xs hover:border-stone-400/80 transition-all">
              <div>
                <div className="w-10 h-10 rounded-xl bg-stone-100 flex items-center justify-center font-bold text-sm text-[#171717] mb-4">
                  01
                </div>
                <h3 className="text-lg font-bold text-[#171717] mb-2 leading-snug">
                  Inwoners geven hun mening
                </h3>
                <p className="text-sm text-stone-600 leading-relaxed">
                  Deelnemers vullen in circa 5 minuten een toegankelijke, mobielvriendelijke vragenlijst in over hun woonwensen, huidige woonsituatie of gebiedsplannen.
                </p>
              </div>
              <div className="pt-4 mt-6 border-t border-stone-100 text-xs font-mono flex items-center justify-between">
                <span className="text-stone-400">100% AVG-proof · Anoniem</span>
                <span className="text-emerald-600 font-semibold">Vrijwillig</span>
              </div>
            </div>

            {/* Kaart 2 (Afbeelding 1 links): Afstemming nieuwbouwprogramma’s & Mismatch-onderzoek */}
            <div className="bg-white rounded-2xl border border-stone-200 p-6 sm:p-7 flex flex-col justify-between shadow-2xs hover:border-stone-400/80 transition-all">
              <div>
                <div className="w-10 h-10 rounded-xl bg-stone-100 flex items-center justify-center text-[#171717] mb-4">
                  <Building2 className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-bold text-[#171717] mb-2 leading-snug">
                  Afstemming nieuwbouwprogramma’s & Mismatch-onderzoek
                </h3>
                <p className="text-sm text-stone-600 leading-relaxed">
                  Het gebruik van data-analyse om te helpen om nieuwbouwprogramma’s af te stemmen op reële wensen: de juiste woningtypes, prijsklassen en voorzieningen en waar nodig onderzoek van de mismatch.
                </p>
              </div>
              <div className="pt-4 mt-6 border-t border-stone-100 text-xs font-mono text-stone-400">
                Woningtypes · Prijsklassen · Voorzieningen
              </div>
            </div>

            {/* Kaart 3 (Afbeelding 1 rechts): Toetsing van beleid & omgevingsplannen */}
            <div className="bg-white rounded-2xl border border-stone-200 p-6 sm:p-7 flex flex-col justify-between shadow-2xs hover:border-stone-400/80 transition-all">
              <div>
                <div className="w-10 h-10 rounded-xl bg-stone-100 flex items-center justify-center text-[#171717] mb-4">
                  <TrendingUp className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-bold text-[#171717] mb-2 leading-snug">
                  Toetsing van beleid & omgevingsplannen
                </h3>
                <p className="text-sm text-stone-600 leading-relaxed">
                  Het benutten van gecombineerde data om ontwikkelperspectieven, gebiedsontwikkelingen, beleid, woonvisies en omgevingsplannen feitelijk te toetsen aan de stem van de burger.
                </p>
              </div>
              <div className="pt-4 mt-6 border-t border-stone-100 text-xs font-mono text-stone-400">
                Woonvisies · Omgevingsplannen · Gebiedsontwikkeling
              </div>
            </div>
          </div>

          {/* Privacy & Dataprotocol Banner */}
          <div className="p-5 sm:p-6 rounded-2xl bg-stone-100 border border-stone-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-lg bg-white border border-stone-200 text-emerald-600 shrink-0">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <div className="text-xs font-bold text-[#171717] uppercase font-mono tracking-wider">
                  Veilig & Geaggregeerd
                </div>
                <p className="text-xs text-stone-600 leading-relaxed">
                  Deelname is altijd anoniem. Data wordt nooit op individueel niveau gedeeld, maar uitsluitend als geaggregeerde trend- en marktinformatie via de beveiligde Woondata-koppeling.
                </p>
              </div>
            </div>

            <a
              href="https://www.woondata.com"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 bg-[#171717] hover:bg-stone-800 text-white rounded-xl text-xs font-semibold transition-all shrink-0 cursor-pointer"
            >
              <span>Naar woondata.com</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </div>
    </main>
  );
};

