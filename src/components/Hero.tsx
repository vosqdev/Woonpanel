import React from 'react';
import { ArrowRight, Compass, Shield, UserPlus } from 'lucide-react';

interface HeroProps {
  onStartSurveyClick: () => void;
  onExploreThemesClick: () => void;
  onOpenRegisterModal: () => void;
  additionalMemberCount?: number;
}

export const Hero: React.FC<HeroProps> = ({
  onStartSurveyClick,
  onExploreThemesClick,
  onOpenRegisterModal,
  additionalMemberCount = 0,
}) => {
  return (
    <section className="relative overflow-hidden pt-12 pb-16 lg:pt-20 lg:pb-24 border-b border-stone-700/60 bg-stone-900">
      {/* Background aerial photograph with max 25% dark filter */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://www.image2url.com/r2/default/images/1793040981776-581c1e84-f85b-44dc-8ad6-73e954e5deea.jpg"
          alt="Achtergrond Woondata Woonpanel"
          className="w-full h-full object-cover object-[center_30%]"
        />
        {/* Donker filter gemaximeerd op maximaal 25% */}
        <div className="absolute inset-0 bg-black/25 pointer-events-none" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6">
        <div className="max-w-4xl">

          {/* Primary Headline with text shadow for sharp contrast */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-[1.08] text-balance mb-6 drop-shadow-[0_2px_8px_rgba(0,0,0,0.85)]">
            Jouw mening over wonen telt.
          </h1>

          {/* Required Exact Subtitle */}
          <p className="text-lg sm:text-xl text-white leading-relaxed font-medium mb-8 text-pretty max-w-3xl drop-shadow-[0_2px_6px_rgba(0,0,0,0.85)]">
            Hoe wil jij wonen? Hoe prettig woon je nu? En wat vind je van de plannen voor jouw buurt?
            Met jouw antwoorden helpen we gemeenten, woningcorporaties en ontwikkelaars om betere keuzes te maken voor de woningen en leefomgeving van morgen.
          </p>

          {/* CTAs: Alle 3 knoppen strak naast elkaar in één lijn */}
          <div className="flex items-center gap-3 sm:gap-3.5 mb-12 flex-nowrap overflow-x-auto pb-1 sm:pb-0">
            <button
              onClick={onStartSurveyClick}
              className="inline-flex items-center gap-2.5 px-5 sm:px-6 py-3.5 text-sm font-bold text-[#171717] bg-[#C4F000] hover:bg-[#b5de00] active:scale-[0.99] rounded-lg transition-all duration-150 shadow-xl cursor-pointer whitespace-nowrap shrink-0"
            >
              <span>Doe mee aan een onderzoek</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={onExploreThemesClick}
              className="inline-flex items-center gap-2 px-4.5 sm:px-5 py-3.5 text-sm font-semibold text-white bg-black/55 hover:bg-black/75 border border-white/30 rounded-lg transition-colors cursor-pointer shadow-lg backdrop-blur-md whitespace-nowrap shrink-0"
            >
              <Compass className="w-4 h-4 text-stone-200" />
              <span>Ontdek thema Woonwensen</span>
            </button>
            <button
              onClick={onOpenRegisterModal}
              className="inline-flex items-center gap-2 px-4.5 sm:px-5 py-3.5 text-sm font-semibold text-white bg-black/45 hover:bg-black/65 border border-white/25 rounded-lg transition-colors cursor-pointer shadow-lg backdrop-blur-md whitespace-nowrap shrink-0"
            >
              <UserPlus className="w-4 h-4 text-[#C4F000]" />
              <span>Aanmelden Woonpanel</span>
            </button>
          </div>

          {/* Verified Proof Strip */}
          <div className="pt-6 border-t border-white/30 grid grid-cols-1 sm:grid-cols-3 gap-6 drop-shadow-[0_2px_4px_rgba(0,0,0,0.85)]">
            <div>
              <div className="text-2xl font-bold font-mono text-white tabular-nums">
                {(3100 + additionalMemberCount).toLocaleString('nl-NL')}+
              </div>
              <div className="text-xs text-stone-100 font-semibold mt-0.5">
                Actieve panelleden
              </div>
            </div>
            <div>
              <div className="text-2xl font-bold font-mono text-white tabular-nums">
                ~5 min
              </div>
              <div className="text-xs text-stone-100 font-semibold mt-0.5">
                Gemiddelde invultijd
              </div>
            </div>
            <div>
              <div className="flex items-center gap-1.5 text-2xl font-bold font-mono text-white">
                <Shield className="w-5 h-5 text-[#C4F000]" />
                <span>100%</span>
              </div>
              <div className="text-xs text-stone-100 font-semibold mt-0.5">
                Anoniem
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
