import React from 'react';
import {
  PenLine,
  BarChart3,
  Home,
  ShieldCheck,
  ExternalLink,
  MapPin,
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
              Hoe Woonpanel werkt
            </h1>

            <p className="text-stone-700 text-base sm:text-lg leading-relaxed">
              Het Woondata Woonpanel brengt de woonwensen en woonbehoeften van inwoners in kaart en zorgt ervoor dat deze onder de aandacht worden gebracht. Het panel richt zich op inwoners van Dronten, Biddinghuizen en Swifterbant, maar ook op mensen van buiten de gemeente die overwegen zich hier te vestigen.
            </p>

            {/* Lokaal Initiatief Gemeente Dronten */}
            <div className="p-5 sm:p-6 rounded-2xl bg-[#C4F000]/15 border border-[#C4F000] flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-[#C4F000] text-[#171717] flex items-center justify-center shrink-0 font-bold shadow-2xs">
                <MapPin className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <h3 className="text-sm sm:text-base font-bold text-[#171717]">
                  Lokaal initiatief binnen de gemeente Dronten
                </h3>
                <p className="text-xs sm:text-sm text-stone-700 leading-relaxed">
                  Het Woondata Woonpanel betreft een specifiek lokaal initiatief in en voor de gemeente Dronten. Samen met inwoners uit Dronten, Biddinghuizen en Swifterbant zorgen we dat de stem uit onze eigen dorpen en kernen écht doorklinkt bij beleidsmakers, woningcorporaties en ontwikkelaars. Zo bouwen we samen aan een leefbare gemeente die past bij de wensen van vandaag en morgen.
                </p>
              </div>
            </div>
          </div>

          {/* Hoe data gebruikt wordt: Standaard website tekst (niet omkaderd, geen andere achtergrondkleuren) */}
          <div className="space-y-3 pt-2">
            <h2 className="text-xl sm:text-2xl font-bold text-[#171717] tracking-tight">
              Hoe de data van de onderzoeken gebruikt wordt
            </h2>
            <p className="text-base text-stone-700 leading-relaxed">
              De resultaten uit de woononderzoeken blijven niet op zichzelf staan; deze worden gebruikt voor woondata.com. Bij Woondata.com worden de uitkomsten van het panel gecombineerd met openbare en lokale data en marktinformatie. Zo ontstaat een compleet en betrouwbaarder beeld van de werkelijke behoefte en vraag in de woningmarkt van de gemeente Dronten.
            </p>
            <p className="text-sm sm:text-base text-stone-600 leading-relaxed">
              De onderzoeksresultaten worden uitsluitend via de beheeromgeving beschikbaar gesteld aan woondata.com om zo markt en openbare data samen te laten komen.
            </p>
          </div>

          {/* De 3 stappen in één energiek, begrijpelijk en overzichtelijk stappenplan */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pt-1 items-stretch">
            {/* Kaart 1: Inwoners laten van zich horen */}
            <div className="bg-white rounded-2xl border-2 border-stone-200 hover:border-[#171717] p-6 sm:p-7 flex flex-col justify-between shadow-xs hover:shadow-md transition-all group relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-1.5 bg-[#C4F000]"></div>
              <div>
                <div className="flex items-center justify-between mb-5">
                  <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-mono font-bold uppercase bg-[#171717] text-[#C4F000]">
                    Stap 01
                  </span>
                  <span className="text-xs font-mono text-stone-500 font-semibold">
                    ⏱️ ~5 minuten
                  </span>
                </div>

                <div className="w-12 h-12 rounded-2xl bg-[#C4F000]/25 border border-[#C4F000] text-[#171717] flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                  <PenLine className="w-6 h-6 text-[#171717]" />
                </div>

                <h3 className="text-xl font-extrabold text-[#171717] mb-2 leading-snug">
                  1. Deel jouw woonwensen
                </h3>
                <p className="text-sm text-stone-700 leading-relaxed mb-4">
                  Je vult in 5 minuten een korte, eenvoudige vragenlijst in. Wat voor woning zoek je? Wat ontbreekt er nu in jouw dorp of wijk? En wat kan er volgens jou veel beter in Dronten, Biddinghuizen of Swifterbant?
                </p>

                <div className="space-y-2 pt-1 text-xs text-stone-600">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0"></span>
                    <span>Snel & makkelijk op je mobiel of computer</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0"></span>
                    <span>100% anoniem, geen gedoe met privacy</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0"></span>
                    <span>Iedere mening uit de buurt telt mee</span>
                  </div>
                </div>
              </div>

              <div className="pt-4 mt-6 border-t border-stone-100 text-xs font-mono flex items-center justify-between">
                <span className="text-stone-500 font-medium">Inwoners aan het woord</span>
                <span className="text-emerald-600 font-bold">Vrijwillig</span>
              </div>
            </div>

            {/* Kaart 2: Wensen worden duidelijke data */}
            <div className="bg-white rounded-2xl border-2 border-stone-200 hover:border-[#171717] p-6 sm:p-7 flex flex-col justify-between shadow-xs hover:shadow-md transition-all group relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-1.5 bg-[#171717]"></div>
              <div>
                <div className="flex items-center justify-between mb-5">
                  <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-mono font-bold uppercase bg-[#171717] text-[#C4F000]">
                    Stap 02
                  </span>
                  <span className="text-xs font-mono text-stone-500 font-semibold">
                    📊 Slimme data
                  </span>
                </div>

                <div className="w-12 h-12 rounded-2xl bg-[#171717] text-[#C4F000] flex items-center justify-center mb-4 group-hover:scale-105 transition-transform shadow-xs">
                  <BarChart3 className="w-6 h-6 text-[#C4F000]" />
                </div>

                <h3 className="text-xl font-extrabold text-[#171717] mb-2 leading-snug">
                  2. Wensen worden duidelijke data
                </h3>
                <p className="text-sm text-stone-700 leading-relaxed mb-4">
                  Alle reacties voegen we samen met actuele marktinformatie. Zo maken we zwart-op-wit zichtbaar waar de echte tekorten zitten: bijvoorbeeld betaalbare starterswoningen, seniorenwoningen of extra groen.
                </p>

                <div className="space-y-2 pt-1 text-xs text-stone-600">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#171717] shrink-0"></span>
                    <span>Geen aannames of giswerk, maar echte feiten</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#171717] shrink-0"></span>
                    <span>Mismatch tussen vraag en aanbod direct in beeld</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#171717] shrink-0"></span>
                    <span>Inzichten per dorp en per prijsklasse</span>
                  </div>
                </div>
              </div>

              <div className="pt-4 mt-6 border-t border-stone-100 text-xs font-mono flex items-center justify-between">
                <span className="text-stone-500 font-medium">Woondata analyse</span>
                <span className="text-[#171717] font-bold">Feiten & Cijfers</span>
              </div>
            </div>

            {/* Kaart 3: Bouwen wat écht nodig is */}
            <div className="bg-white rounded-2xl border-2 border-stone-200 hover:border-[#171717] p-6 sm:p-7 flex flex-col justify-between shadow-xs hover:shadow-md transition-all group relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-1.5 bg-[#C4F000]"></div>
              <div>
                <div className="flex items-center justify-between mb-5">
                  <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-mono font-bold uppercase bg-[#171717] text-[#C4F000]">
                    Stap 03
                  </span>
                  <span className="text-xs font-mono text-stone-500 font-semibold">
                    🏡 Echte impact
                  </span>
                </div>

                <div className="w-12 h-12 rounded-2xl bg-[#C4F000]/25 border border-[#C4F000] text-[#171717] flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                  <Home className="w-6 h-6 text-[#171717]" />
                </div>

                <h3 className="text-xl font-extrabold text-[#171717] mb-2 leading-snug">
                  3. Bouwen wat er écht nodig is
                </h3>
                <p className="text-sm text-stone-700 leading-relaxed mb-4">
                  De gemeente, woningcorporaties en bouwers krijgen deze inzichten op hun bord. Zij kunnen plannen aanpassen en bouwen voor de échte behoefte van onze dorpen, zodat nieuwbouw naadloos aansluit.
                </p>

                <div className="space-y-2 pt-1 text-xs text-stone-600">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0"></span>
                    <span>Directe invloed op nieuwbouw & woonvisies</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0"></span>
                    <span>Huizen bouwen in de juiste prijsklassen</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0"></span>
                    <span>Fijner, betaalbaarder en passender wonen</span>
                  </div>
                </div>
              </div>

              <div className="pt-4 mt-6 border-t border-stone-100 text-xs font-mono flex items-center justify-between">
                <span className="text-stone-500 font-medium">Invloed op beleid</span>
                <span className="text-emerald-600 font-bold">Passende woningen</span>
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
                  100% Veilig & Altijd Anoniem
                </div>
                <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                  Meedoen is altijd anoniem: niemand kan zien wat jij persoonlijk hebt ingevuld. We voegen alle reacties samen op één hoop om te laten zien wat inwoners belangrijk vinden. Zo blijven jouw gegevens altijd privé en veilig via Woondata.
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

