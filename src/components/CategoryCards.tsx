import React from 'react';
import { Home, Search, MessageSquare, ArrowRight, Clock, Users, Compass } from 'lucide-react';
import { SurveyCategory } from '../types/survey';

interface CategoryCardsProps {
  onSelectCategory: (category: SurveyCategory) => void;
}

export const CategoryCards: React.FC<CategoryCardsProps> = ({ onSelectCategory }) => {
  return (
    <section id="onderzoeksthemas" className="py-16 max-w-7xl mx-auto px-4 sm:px-6">
      <div className="mb-8">
        <h2 className="text-2xl sm:text-3xl font-extrabold text-[#171717] tracking-tight">
          Actueel onderzoeksthema: Woonwensen
        </h2>
        <p className="text-sm text-stone-600 mt-2 max-w-2xl">
          Breng jouw woonbehoeften in kaart en help gemeenten en ontwikkelaars bij het realiseren van passende woningen.
        </p>
      </div>

      <div className="max-w-3xl">
        {/* KAART 1 – WOONWENSEN (ALLEEN DEZE KAART IS NU ACTIEF) */}
        <div className="bg-white rounded-2xl border border-stone-200 p-8 sm:p-10 flex flex-col justify-between hover:border-stone-400 hover:shadow-md transition-all duration-200">
          <div>
            <div className="flex items-center justify-between mb-6">
              <div className="w-12 h-12 rounded-xl bg-stone-100 text-[#171717] flex items-center justify-center">
                <Home className="w-6 h-6 stroke-[2]" />
              </div>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#C4F000]/30 text-stone-900 border border-[#C4F000]">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-600"></span>
                <span>Actief onderzoek</span>
              </span>
            </div>

            <div className="text-xs font-bold uppercase tracking-wider text-stone-500 mb-2">
              Onderzoeksthema · Woonwensen
            </div>

            <h3 className="text-2xl sm:text-3xl font-bold text-[#171717] mb-3">
              Hoe wil jij wonen?
            </h3>

            <p className="text-base text-stone-600 leading-relaxed mb-6">
              Vertel ons hoe jouw ideale woning eruitziet. Van woningtype en betaalbaarheid tot locatie, duurzaamheid en voorzieningen. Gericht op inwoners van Dronten, Biddinghuizen en Swifterbant, maar ook op mensen van buiten die hier mogelijk willen wonen.
            </p>

            <div className="border-t border-stone-100 pt-5 mb-8 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-stone-500 font-medium">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-stone-400 shrink-0" />
                <span>Duur: circa 5 minuten</span>
              </div>
              <div className="flex items-center gap-2">
                <Compass className="w-4 h-4 text-stone-400 shrink-0" />
                <span>Onderwerp: toekomstig wonen & vraagdata</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-stone-400 shrink-0" />
                <span>Doelgroep: woningzoekenden en inwoners</span>
              </div>
            </div>
          </div>

          <button
            onClick={() => onSelectCategory('woonwensen')}
            className="w-full inline-flex items-center justify-center gap-2 py-3.5 px-6 rounded-xl text-base font-bold text-[#171717] bg-[#C4F000] hover:bg-[#b5de00] active:scale-[0.99] transition-colors cursor-pointer shadow-xs"
          >
            <span>Start woonwensenonderzoek</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </section>
  );
};
