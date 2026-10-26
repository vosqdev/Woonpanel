import React from 'react';
import { X, ShieldCheck, Lock, EyeOff, FileText, CheckCircle2 } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const PrivacyModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const [showLegalDetails, setShowLegalDetails] = React.useState(false);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-stone-200 shadow-2xl p-6 sm:p-8 space-y-6">
        <div className="flex items-center justify-between pb-4 border-b border-stone-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-700">
              <ShieldCheck className="w-5 h-5 stroke-[2.5]" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-[#171717]">
                Jouw privacy & gegevens
              </h3>
              <p className="text-xs text-stone-500">
                Veilig, anoniem en volgens de strengste privacyregels (AVG)
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-stone-400 hover:text-stone-700 rounded-lg cursor-pointer"
            aria-label="Sluit modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-4 text-sm text-stone-700 leading-relaxed">
          <p className="text-stone-600">
            Bij het Woonpanel gaan we zorgvuldig om met wat je invult. We zorgen ervoor dat niemand kan zien welk antwoord van jou is. Dit werkt als volgt:
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            <div className="bg-stone-50 rounded-2xl p-4 border border-stone-200/80 space-y-1.5">
              <div className="flex items-center gap-2 font-bold text-stone-900">
                <EyeOff className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>1. Anoniem meedoen</span>
              </div>
              <p className="text-xs text-stone-600 leading-relaxed">
                Niemand kan zien wie wat heeft ingevuld. Jouw antwoorden worden direct losgekoppeld van je computer of telefoon.
              </p>
            </div>

            <div className="bg-stone-50 rounded-2xl p-4 border border-stone-200/80 space-y-1.5">
              <div className="flex items-center gap-2 font-bold text-stone-900">
                <Lock className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>2. Gegevens apart bewaard</span>
              </div>
              <p className="text-xs text-stone-600 leading-relaxed">
                Laat je je e-mailadres achter voor de uitslag? Dan wordt dit apart opgeslagen en nooit gekoppeld aan jouw antwoorden.
              </p>
            </div>

            <div className="bg-stone-50 rounded-2xl p-4 border border-stone-200/80 space-y-1.5">
              <div className="flex items-center gap-2 font-bold text-stone-900">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>3. Nooit herleidbaar naar jou</span>
              </div>
              <p className="text-xs text-stone-600 leading-relaxed">
                We tonen cijfers van een buurt pas als minstens 15 buurtgenoten hebben meegedaan. Zo kan niemand herleiden wie wat heeft gezegd.
              </p>
            </div>

            <div className="bg-stone-50 rounded-2xl p-4 border border-stone-200/80 space-y-1.5">
              <div className="flex items-center gap-2 font-bold text-stone-900">
                <FileText className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>4. Geen verkoop van gegevens</span>
              </div>
              <p className="text-xs text-stone-600 leading-relaxed">
                Gegevens worden niet verkocht of gedeeld met commerciële partijen. De uitkomsten worden alleen gebruikt voor betere woningen en buurten.
              </p>
            </div>
          </div>

          <div className="bg-emerald-50/70 border border-emerald-200/60 rounded-2xl p-4 space-y-1 text-xs text-emerald-950">
            <h4 className="font-bold text-emerald-900 flex items-center gap-1.5">
              <span>Deelname is altijd vrijwillig</span>
            </h4>
            <p className="text-emerald-800 leading-relaxed">
              Meedoen is 100% vrijwillig. We bewaren onderzoeksgegevens niet langer dan nodig (maximaal 2 jaar). Wil je dat jouw gegevens tussentijds worden verwijderd? Dan regelen we dat direct na een berichtje.
            </p>
          </div>

          {/* Toggle for legal/technical background */}
          <div className="pt-1">
            <button
              type="button"
              onClick={() => setShowLegalDetails(!showLegalDetails)}
              className="text-xs text-stone-500 hover:text-stone-800 font-medium underline underline-offset-2 cursor-pointer flex items-center gap-1"
            >
              {showLegalDetails ? 'Verberg officiële juridische teksten (AVG / ISO)' : 'Bekijk officiële juridische teksten (AVG / ISO)'}
            </button>

            {showLegalDetails && (
              <div className="mt-3 p-4 bg-stone-100 rounded-2xl text-xs text-stone-600 space-y-2 border border-stone-200">
                <p className="font-semibold text-stone-800">Officiële juridische grondslag & ISO 27001:</p>
                <p>
                  Woondata opereert conform de Algemene Verordening Gegevensbescherming (AVG / GDPR) en ISO 27001 normen.
                  Verwerking geschiedt op basis van expliciete toestemming (Artikel 6 lid 1 sub a AVG). Gegevens worden gepseudonimiseerd
                  met een cryptografische eenrichtings-hash. Statistische aggregatie hanteert een minimale k-waarde van 15 ter voorkoming van
                  re-identificatie. Bewaartermijn is gemaximeerd op 24 maanden voor beleidscycli, waarna data definitief geanonimiseerd wordt.
                </p>
              </div>
            )}
          </div>
        </div>

        <div className="pt-4 border-t border-stone-100 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2.5 bg-[#171717] hover:bg-black text-white text-xs font-semibold rounded-xl cursor-pointer"
          >
            Begrepen & sluiten
          </button>
        </div>
      </div>
    </div>
  );
};
