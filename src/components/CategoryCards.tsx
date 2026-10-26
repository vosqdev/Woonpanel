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
          Actueel onderzoek: Woonwensen
        </h2>
        <p className="text-sm text-stone-600 mt-2 max-w-2xl">
          Vertel hoe jij het liefst woont. Zo weten de gemeente en bouwers precies welke huizen er nodig zijn.
        </p>
      </div>

      <div className="max-w-3xl">
        {/* KAART 1 – WOONWENSEN */}
        <div className="bg-white rounded-3xl border border-stone-200 p-7 sm:p-10 flex flex-col justify-between hover:border-stone-400 hover:shadow-md transition-all duration-200">
          <div>
            {/* Top row with icon and status pill */}
            <div className="flex items-center justify-between mb-6">
              <div className="w-12 h-12 rounded-2xl bg-stone-100 text-[#171717] flex items-center justify-center">
                <Home className="w-6 h-6 stroke-[2]" />
              </div>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#C4F000]/30 text-stone-900 border border-[#C4F000]">
                <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
                <span>Actief onderzoek</span>
              </span>
            </div>

            <div className="text-xs font-bold uppercase tracking-wider text-stone-400 mb-2">
              Vragenlijst · Woonwensen
            </div>

            <h3 className="text-2xl sm:text-3xl font-extrabold text-[#171717] mb-3 tracking-tight">
              Hoe wil jij wonen?
            </h3>

            <p className="text-base text-stone-600 leading-relaxed mb-8">
              Wat voor huis zoek je en wat vind je belangrijk in jouw buurt? Denk aan de prijs, de grootte, een tuin of balkon en winkels dichtbij. Iedereen mag meedoen: of je nu al in Dronten, Biddinghuizen of Swifterbant woont, of hier graag wilt komen wonen.
            </p>

            {/* Perfect aligned metadata cards */}
            <div className="border-t border-stone-100 pt-6 mb-8 grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="flex items-center gap-3 bg-stone-50 rounded-2xl p-3 border border-stone-200/60">
                <div className="w-8 h-8 rounded-xl bg-white flex items-center justify-center text-stone-700 shadow-2xs shrink-0">
                  <Clock className="w-4 h-4 text-emerald-600" />
                </div>
                <div>
                  <div className="text-[10px] font-bold text-stone-400 uppercase tracking-wider">Tijd</div>
                  <div className="text-xs font-bold text-stone-800">Ongeveer 5 minuten</div>
                </div>
              </div>

              <div className="flex items-center gap-3 bg-stone-50 rounded-2xl p-3 border border-stone-200/60">
                <div className="w-8 h-8 rounded-xl bg-white flex items-center justify-center text-stone-700 shadow-2xs shrink-0">
                  <Compass className="w-4 h-4 text-emerald-600" />
                </div>
                <div>
                  <div className="text-[10px] font-bold text-stone-400 uppercase tracking-wider">Onderwerp</div>
                  <div className="text-xs font-bold text-stone-800">Jouw droomhuis</div>
                </div>
              </div>

              <div className="flex items-center gap-3 bg-stone-50 rounded-2xl p-3 border border-stone-200/60">
                <div className="w-8 h-8 rounded-xl bg-white flex items-center justify-center text-stone-700 shadow-2xs shrink-0">
                  <Users className="w-4 h-4 text-emerald-600" />
                </div>
                <div>
                  <div className="text-[10px] font-bold text-stone-400 uppercase tracking-wider">Voor wie</div>
                  <div className="text-xs font-bold text-stone-800">Iedereen die (hier) wil wonen</div>
                </div>
              </div>
            </div>
          </div>

          <button
            onClick={() => onSelectCategory('woonwensen')}
            className="w-full inline-flex items-center justify-center gap-2 py-4 px-6 rounded-2xl text-base font-bold text-[#171717] bg-[#C4F000] hover:bg-[#b5de00] active:scale-[0.99] transition-all cursor-pointer shadow-sm"
          >
            <span>Start woonwensenonderzoek</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </section>
  );
};
