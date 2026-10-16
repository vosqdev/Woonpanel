import React from 'react';
import { Home, Search, MessageSquare, ArrowRight, Clock, Users, Compass } from 'lucide-react';
import { SurveyCategory } from '../types/survey';

interface CategoryCardsProps {
  onSelectCategory: (category: SurveyCategory) => void;
}

export const CategoryCards: React.FC<CategoryCardsProps> = ({ onSelectCategory }) => {
  return (
    <section id="onderzoeksthemas" className="py-16 max-w-7xl mx-auto px-4 sm:px-6">
      <div className="mb-10">
        <h2 className="text-2xl sm:text-3xl font-extrabold text-[#171717] tracking-tight">
          Kies een onderzoeksthema
        </h2>
        <p className="text-sm text-stone-600 mt-2 max-w-2xl">
          Elke onderzoeksmodule beantwoordt een cruciaal vraagstuk voor de toekomst van onze steden, dorpen en wijken.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* KAART 1 – WOONWENSEN */}
        <div className="bg-white rounded-2xl border border-stone-200 p-8 flex flex-col justify-between hover:border-stone-400 hover:shadow-md transition-all duration-200">
          <div>
            <div className="w-12 h-12 rounded-xl bg-stone-100 text-[#171717] flex items-center justify-center mb-6">
              <Home className="w-6 h-6 stroke-[2]" />
            </div>

            <div className="text-xs font-bold uppercase tracking-wider text-stone-500 mb-2">
              Kaart 1 · Woonwensen
            </div>

            <h3 className="text-xl sm:text-2xl font-bold text-[#171717] mb-3">
              Hoe wil jij wonen?
            </h3>

            <p className="text-sm text-stone-600 leading-relaxed mb-6">
              Vertel ons hoe jouw ideale woning eruitziet. Van woningtype en betaalbaarheid tot locatie, duurzaamheid en voorzieningen.
            </p>

            <div className="border-t border-stone-100 pt-5 mb-8 space-y-2.5 text-xs text-stone-500 font-medium">
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
            className="w-full inline-flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-sm font-bold text-[#171717] bg-[#C4F000] hover:bg-[#b5de00] active:scale-[0.99] transition-colors cursor-pointer shadow-xs"
          >
            <span>Start woonwensenonderzoek</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* KAART 2 – WOONSCAN */}
        <div className="bg-white rounded-2xl border border-stone-200 p-8 flex flex-col justify-between hover:border-stone-400 hover:shadow-md transition-all duration-200">
          <div>
            <div className="w-12 h-12 rounded-xl bg-stone-100 text-[#171717] flex items-center justify-center mb-6">
              <div className="relative">
                <Home className="w-6 h-6 stroke-[2]" />
                <Search className="w-3.5 h-3.5 stroke-[2.5] absolute -bottom-1 -right-1 text-stone-900 bg-white rounded-full p-0.5" />
              </div>
            </div>

            <div className="text-xs font-bold uppercase tracking-wider text-stone-500 mb-2">
              Kaart 2 · Woonscan
            </div>

            <h3 className="text-xl sm:text-2xl font-bold text-[#171717] mb-3">
              Hoe woon jij nu?
            </h3>

            <p className="text-sm text-stone-600 leading-relaxed mb-6">
              Hoe tevreden ben je met jouw woning, energielasten, wooncomfort en leefomgeving? Met de Woonscan brengen we in beeld hoe inwoners hun huidige woonsituatie ervaren.
            </p>

            <div className="border-t border-stone-100 pt-5 mb-8 space-y-2.5 text-xs text-stone-500 font-medium">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-stone-400 shrink-0" />
                <span>Duur: circa 5 minuten</span>
              </div>
              <div className="flex items-center gap-2">
                <Compass className="w-4 h-4 text-stone-400 shrink-0" />
                <span>Onderwerp: huidige woonsituatie & kwaliteit</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-stone-400 shrink-0" />
                <span>Doelgroep: huurders en woningeigenaren</span>
              </div>
            </div>
          </div>

          <button
            onClick={() => onSelectCategory('woonscan')}
            className="w-full inline-flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-sm font-bold text-white bg-[#171717] hover:bg-black active:scale-[0.99] transition-colors cursor-pointer shadow-xs"
          >
            <span>Start jouw woonscan</span>
            <ArrowRight className="w-4 h-4 text-[#C4F000]" />
          </button>
        </div>

        {/* KAART 3 – WOONOPINIE */}
        <div className="bg-white rounded-2xl border border-stone-200 p-8 flex flex-col justify-between hover:border-stone-400 hover:shadow-md transition-all duration-200">
          <div>
            <div className="w-12 h-12 rounded-xl bg-stone-100 text-[#171717] flex items-center justify-center mb-6">
              <MessageSquare className="w-6 h-6 stroke-[2]" />
            </div>

            <div className="text-xs font-bold uppercase tracking-wider text-stone-500 mb-2">
              Kaart 3 · Woonopinie
            </div>

            <h3 className="text-xl sm:text-2xl font-bold text-[#171717] mb-3">
              Wat vind jij van jouw buurt?
            </h3>

            <p className="text-sm text-stone-600 leading-relaxed mb-6">
              Denk mee over het Ontwikkelperspectief Dronten-Zuid: 3.200 nieuwe woningen, het STOMP-principe, 105 m² groennorm en buurtvoorzieningen.
            </p>

            <div className="border-t border-stone-100 pt-5 mb-8 space-y-2.5 text-xs text-stone-500 font-medium">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-stone-400 shrink-0" />
                <span>Duur: circa 6 minuten</span>
              </div>
              <div className="flex items-center gap-2">
                <Compass className="w-4 h-4 text-stone-400 shrink-0" />
                <span>Casus: Uitleggebied Dronten-Zuid</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-stone-400 shrink-0" />
                <span>Doelgroep: bewoners en belanghebbenden</span>
              </div>
            </div>
          </div>

          <button
            onClick={() => onSelectCategory('woonopinie')}
            className="w-full inline-flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-sm font-bold text-[#171717] bg-[#C4F000] hover:bg-[#b5de00] active:scale-[0.99] transition-colors cursor-pointer shadow-xs"
          >
            <span>Geef jouw mening</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </section>
  );
};
