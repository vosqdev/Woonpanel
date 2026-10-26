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
      badge: 'Vragenlijst · Woonwensen',
      title: 'Woonwensen: Hoe wil jij wonen?',
      subtitle: 'Laat weten wat voor woning jij zoekt en wat je belangrijk vindt in jouw buurt.',
      description:
        'Met dit onderzoek geef je direct jouw mening door. Zo weten de gemeente Dronten, woningcorporaties en bouwers precies welke huizen er gebouwd moeten worden, voor welke prijs en op welke plek.',
      icon: Home,
      steps: [
        {
          num: '01',
          title: 'Hoe je nu woont',
          desc: 'Met wie je woont, waar je nu woont en hoe snel je eventueel wilt verhuizen.',
        },
        {
          num: '02',
          title: 'Jouw ideale woning',
          desc: 'Wat voor huis je zoekt: een appartement, gezinswoning of gelijkvloers, en hoeveel kamers je nodig hebt.',
        },
        {
          num: '03',
          title: 'Wat het mag kosten',
          desc: 'Wat je kunt betalen aan huur of koop, zodat er woningen komen die passen bij jouw portemonnee.',
        },
        {
          num: '04',
          title: 'Jouw ideale buurt',
          desc: 'Of je houdt van veel groen, rust of juist levendigheid, en hoe belangrijk voorzieningen dichtbij zijn.',
        },
        {
          num: '05',
          title: 'Duurzaam en energiezuinig',
          desc: 'Jouw wensen voor zonnepanelen, goede isolatie, een warmtepomp en een lagere energierekening.',
        },
        {
          num: '06',
          title: 'Wat vind je het allerbelangrijkst?',
          desc: 'Kies jouw persoonlijke top 5: wat mag er écht niet ontbreken in jouw volgende woning of straat?',
        },
      ],
      impact:
        'Jouw antwoorden worden anoniem samengevoegd. Zo zien de gemeente en bouwers precies welke huizen en buurten er écht nodig zijn. Niemand kan zien wie wat heeft ingevuld.',
      ctaText: 'Start woonwensenonderzoek',
    },
    woonscan: {
      badge: 'Vragenlijst · Huidige woning',
      title: 'Woonscan: Hoe woon jij nu?',
      subtitle: 'Hoe prettig, betaalbaar en toekomstbestendig is jouw huidige huis?',
      description:
        'Met de Woonscan vertel je hoe tevreden je bent over je huidige woning. Na afloop zie je direct een helder overzicht van jouw wooncomfort, energiekosten en praktische tips.',
      icon: Search,
      steps: [
        { num: '01', title: 'Over jouw huis', desc: 'Wanneer het gebouwd is, of je huurt of koopt, en hoe groot het is.' },
        { num: '02', title: 'Wooncomfort', desc: 'Is het stil genoeg, tocht het niet en blijft het behaaglijk in zomer en winter?' },
        { num: '03', title: 'Woonlasten & energie', desc: 'Hoe ervaar je de maandlasten en de energierekening van jouw woning?' },
        { num: '04', title: 'De buurt', desc: 'Hoe veilig, groen en gezellig vind je jouw straat en omgeving?' },
        { num: '05', title: 'Klaar voor later', desc: 'Is jouw huis ook geschikt als je ouder wordt of minder goed ter been bent?' },
      ],
      impact: 'Geeft woningcorporaties en overheden inzicht in welke wijken beter geïsoleerd of opgeknapt moeten worden.',
      ctaText: 'Start jouw persoonlijke woonscan',
    },
    woonopinie: {
      badge: 'Inwonerspanel · Buurtplannen',
      title: 'Woonopinie: Denk mee over nieuwbouw',
      subtitle: 'Wat vind jij van nieuwe bouwplannen en ontwikkelingen in jouw gemeente?',
      description:
        'Bij Woonopinie geef je je mening over nieuwe wijken, groen in de buurt en verkeer. Je kunt verschillende plannen vergelijken en vertellen wat jij het beste vindt.',
      icon: MessageSquare,
      steps: [
        { num: '01', title: 'Jouw band met het gebied', desc: 'Woon je al in de buurt of wil je hier in de toekomst graag naartoe verhuizen?' },
        { num: '02', title: 'Plannen vergelijken', desc: 'Kies tussen dorps en groen wonen, een gezellige starterswijk of ruime erven.' },
        { num: '03', title: 'Verkeer en vervoer', desc: 'Wat vind je van rustige woonstraten, fietspaden en parkeren in de buurt?' },
        { num: '04', title: 'Meekijken op de kaart', desc: 'Bekijk precies waar welke woningen en parken gepland zijn.' },
        { num: '05', title: 'Belangrijke voorzieningen', desc: 'Wat heb je nodig in de wijk: een school, supermarkt of speelplekken?' },
      ],
      impact: 'Zorgt ervoor dat de gemeenteraad besluiten neemt op basis van wat inwoners daadwerkelijk willen.',
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
          className="text-xs font-semibold text-stone-600 hover:text-black transition-colors cursor-pointer flex items-center gap-1.5"
        >
          <span>&larr;</span>
          <span>Terug naar home</span>
        </button>

        {/* Hero Header */}
        <div className="bg-white rounded-3xl border border-stone-200 p-8 sm:p-12 space-y-6 shadow-xs">
          <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-stone-400 font-semibold">
            <span>{data.badge}</span>
            <span aria-hidden="true">·</span>
            <span>Gemeente Dronten</span>
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
              <Clock className="w-4 h-4 text-emerald-600" />
              <span>Ongeveer 5 minuten · 100% anoniem</span>
            </div>
          </div>
        </div>

        {/* Question Modules Breakdown (Jip en Janneke) */}
        <div className="space-y-6">
          <div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-[#171717] tracking-tight">
              Wat vragen we in deze vragenlijst?
            </h2>
            <p className="text-xs sm:text-sm text-stone-600 mt-1">
              In ongeveer 5 minuten loop je door deze 6 eenvoudige stappen:
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {data.steps.map((st) => (
              <div
                key={st.num}
                className="bg-white rounded-2xl border border-stone-200/80 p-5 sm:p-6 space-y-2 hover:border-stone-400 hover:shadow-xs transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <span className="w-8 h-8 rounded-xl bg-stone-100 text-stone-800 flex items-center justify-center font-bold text-xs font-mono shrink-0">
                      {st.num}
                    </span>
                    <h3 className="text-sm sm:text-base font-bold text-stone-900 leading-snug">
                      {st.title}
                    </h3>
                  </div>
                  <p className="text-xs sm:text-sm text-stone-600 leading-relaxed pl-11">
                    {st.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Societal impact banner */}
        <div className="bg-[#171717] text-white rounded-3xl p-6 sm:p-8 flex items-start gap-4 shadow-sm border border-stone-800">
          <div className="w-10 h-10 rounded-2xl bg-[#C4F000]/15 flex items-center justify-center text-[#C4F000] shrink-0 mt-0.5">
            <Sparkles className="w-5 h-5" />
          </div>
          <div className="space-y-1.5">
            <h4 className="text-base font-bold text-white">Wat gebeurt er met jouw antwoorden?</h4>
            <p className="text-xs sm:text-sm text-stone-300 leading-relaxed font-normal">
              {data.impact}
            </p>
          </div>
        </div>
      </div>
    </main>
  );
};
