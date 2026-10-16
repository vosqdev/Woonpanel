import React from 'react';
import { SurveyCategory, Survey } from '../types/survey';
import {
  Home,
  Search,
  MessageSquare,
  ArrowRight,
  CheckCircle2,
  Clock,
  Sparkles,
  BarChart,
  MapPin,
  Shield,
  Layers,
} from 'lucide-react';

interface Props {
  category: SurveyCategory;
  onStartCategorySurvey: (cat: SurveyCategory) => void;
  onBackToHome: () => void;
}

export const ModuleInfoPage: React.FC<Props> = ({
  category,
  onStartCategorySurvey,
  onBackToHome,
}) => {
  const infoMap = {
    woonwensen: {
      badge: 'Vraagdata & Toekomstvisie',
      title: 'Woonwensen Onderzoek',
      subtitle: 'Welke woningen zijn er nodig, waar, voor wie en tegen welke prijs?',
      description:
        'Het Woonwensenonderzoek geeft gemeenten, corporaties en projectontwikkelaars direct inzicht in de kwantitatieve en kwalitatieve woningbehoefte. Van betaalbaarheidsgrenzen en gewenste woonvormen tot duurzaamheid en voorzieningen in de buurt.',
      icon: Home,
      steps: [
        { num: '01', title: 'Persoonlijke woonsituatie', desc: 'Huishoudsamenstelling, levensfase en urgentie van verhuisintentie.' },
        { num: '02', title: 'Gewenste woning', desc: 'Woningtype (appartement, gezinswoning, patio), m² oppervlakte en kamers.' },
        { num: '03', title: 'Betaalbaarheid & budget', desc: 'Realistische huur- of koopsomgrenzen en inkomenscategorie.' },
        { num: '04', title: 'Locatie & leefomgeving', desc: 'Groen, bereikbaarheid met openbaar vervoer, rust of stedelijke levendigheid.' },
        { num: '05', title: 'Energie & duurzaamheid', desc: 'Warmtepomp, isolatie, zonnepanelen en aanvaardbare energielasten.' },
        { num: '06', title: 'Prioriteiten rangschikken', desc: 'Top 5 doorslaggevende criteria voor jouw volgende woning.' },
      ],
      impact: 'Wordt direct benut voor het actualiseren van gemeentelijke Woonvisies en prestatieafspraken.',
      ctaText: 'Start woonwensenonderzoek',
    },
    woonscan: {
      badge: 'Kwaliteitsanalyse Bestaande Bouw',
      title: 'Woonscan: Hoe woon jij nu?',
      subtitle: 'Hoe ervaren inwoners de kwaliteit, betaalbaarheid en toekomstbestendigheid van hun huidige woning?',
      description:
        'Met de Woonscan analyseren we de bestaande woningvoorraad vanuit het perspectief van de bewoner. Na afronding ontvang je een persoonlijk, indicatief onderzoeksrapport met scores op 5 kernthema’s en concrete handelingsperspectieven.',
      icon: Search,
      steps: [
        { num: '01', title: 'Huidige woningkenmerken', desc: 'Bouwperiode, eigendomssituatie (huur/koop) en woninggrootte.' },
        { num: '02', title: 'Wooncomfort & behaaglijkheid', desc: 'Geluidsisolatie, ventilatie, temperatuur in zomer en winter.' },
        { num: '03', title: 'Woonlasten & energierekening', desc: 'Betaalbaarheid, energielabel en lastendruk.' },
        { num: '04', title: 'Buurt & sociale omgeving', desc: 'Veiligheid, groenvoorzieningen, burencontact en leefbaarheid.' },
        { num: '05', title: 'Toekomstbestendigheid', desc: 'Geschiktheid bij ouder worden of mobiliteitsbeperkingen.' },
      ],
      impact: 'Biedt corporaties en overheden handvatten voor wijkgerichte verduurzamings- en renovatieprogramma’s.',
      ctaText: 'Start jouw persoonlijke woonscan',
    },
    woonopinie: {
      badge: 'Gebiedsgericht Inwonerspanel',
      title: 'Woonopinie & Gebiedsontwikkeling',
      subtitle: 'Wat vinden inwoners van voorgenomen ruimtelijke ontwikkelingen en welke belangen spelen er?',
      description:
        'Woonopinie is de interactieve participatiemodule voor concrete nieuwbouwlocaties, wijktransformaties, groenplannen en mobiliteitshubs. Bewoners kunnen scenario’s vergelijken, markeringen op een interactieve kaart plaatsen en ideeën aandragen.',
      icon: MessageSquare,
      steps: [
        { num: '01', title: 'Betrokkenheid bij Dronten-Zuid', desc: 'Directe omwonende, inwoner van de dorpskern of toekomstige woningzoekende.' },
        { num: '02', title: 'Scenariovergelijking (3.200 woningen)', desc: 'Keuze tussen dorps & groen wonen, compacte starterswijk of duurzame boerenerven.' },
        { num: '03', title: 'Mobiliteit & STOMP-principe', desc: 'Mening over autoluwe woonstraten en hoogwaardige snelfietsroutes.' },
        { num: '04', title: 'Kaartparticipatie op kwadranten', desc: 'Plaats markeringen direct op de plankaart van Uitleggebied Dronten-Zuid.' },
        { num: '05', title: 'Voorzieningen & Open inbreng', desc: 'Prioritering van kindcentrum, buurthub en formeel advies aan de gemeenteraad.' },
      ],
      impact: 'Versterkt de democratische legitimiteit en versnelt besluitvorming met representatieve burgerinbreng.',
      ctaText: 'Geef jouw mening in Woonopinie',
    },
  };

  const data = infoMap[category];
  const Icon = data.icon;

  return (
    <main className="min-h-screen py-10 sm:py-16 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto space-y-12">
        {/* Top return */}
        <button
          onClick={onBackToHome}
          className="text-xs font-semibold text-stone-600 hover:text-black transition-colors cursor-pointer"
        >
          &larr; Terug naar overzicht
        </button>

        {/* Hero Header */}
        <div className="bg-white rounded-3xl border border-stone-200 p-8 sm:p-12 space-y-6">
          <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-stone-500 font-semibold">
            <span>{data.badge}</span>
            <span aria-hidden="true">·</span>
            <span>Woondata Platform</span>
          </div>

          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-stone-100 flex items-center justify-center text-[#171717] shrink-0">
              <Icon className="w-6 h-6 stroke-[2]" />
            </div>
            <div>
              <h1 className="text-3xl sm:text-4xl font-extrabold text-[#171717] tracking-tight">
                {data.title}
              </h1>
              <p className="text-stone-600 text-base sm:text-lg mt-2 font-medium">
                {data.subtitle}
              </p>
            </div>
          </div>

          <p className="text-stone-700 text-sm leading-relaxed border-t border-stone-100 pt-6">
            {data.description}
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-4">
            <button
              onClick={() => onStartCategorySurvey(category)}
              className="inline-flex items-center gap-2.5 px-6 py-3.5 bg-[#C4F000] hover:bg-[#b5de00] text-[#171717] font-bold text-sm rounded-xl transition-all cursor-pointer shadow-xs active:scale-[0.99]"
            >
              <span>{data.ctaText}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <div className="text-xs text-stone-500 flex items-center gap-1.5 font-medium">
              <Clock className="w-4 h-4 text-stone-400" />
              <span>Circa 5 minuten · Volledig anoniem</span>
            </div>
          </div>
        </div>

        {/* Question Modules Breakdown */}
        <div className="space-y-6">
          <h2 className="text-xl font-bold text-[#171717] tracking-tight">
            Opbouw van deze onderzoeksmodule
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {data.steps.map((st) => (
              <div
                key={st.num}
                className="bg-white rounded-2xl border border-stone-200 p-5 space-y-2 hover:border-stone-300 transition-all"
              >
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold text-stone-400">{st.num}.</span>
                  <h3 className="text-sm font-bold text-stone-900">{st.title}</h3>
                </div>
                <p className="text-xs text-stone-600 leading-relaxed pl-6">{st.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Societal impact banner */}
        <div className="bg-[#171717] text-white rounded-2xl p-6 sm:p-8 flex items-start gap-4">
          <Sparkles className="w-6 h-6 text-[#C4F000] shrink-0 mt-0.5" />
          <div className="space-y-1">
            <h4 className="text-sm font-bold">Wat gebeurt er met jouw antwoorden?</h4>
            <p className="text-xs text-stone-300 leading-relaxed">{data.impact}</p>
          </div>
        </div>
      </div>
    </main>
  );
};
