import React from 'react';
import { X, ShieldCheck, Lock, EyeOff, FileText, CheckCircle2 } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const PrivacyModal: React.FC<Props> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-stone-200 shadow-2xl p-6 sm:p-8 space-y-6">
        <div className="flex items-center justify-between pb-4 border-b border-stone-100">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-stone-100 flex items-center justify-center text-emerald-700">
              <ShieldCheck className="w-5 h-5 stroke-[2.5]" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-[#171717]">
                Privacy- & Gegevensbescherming (AVG / GDPR)
              </h3>
              <p className="text-xs text-stone-500 font-mono">
                Woondata Woonpanel Protocol v2.4
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

        <div className="space-y-4 text-xs sm:text-sm text-stone-600 leading-relaxed">
          <p>
            Woondata hecht de hoogste waarde aan de bescherming van jouw privacy en persoonlijke levenssfeer. Als onafhankelijk onderzoeksplatform werken wij volgens strikte wetenschappelijke en juridische normen (AVG en ISO 27001).
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            <div className="bg-stone-50 rounded-xl p-3.5 border border-stone-200 space-y-1">
              <div className="flex items-center gap-2 font-semibold text-[#171717]">
                <EyeOff className="w-4 h-4 text-emerald-600" />
                <span>Pseudonimisering</span>
              </div>
              <p className="text-xs text-stone-500">
                Jouw antwoorden worden direct ontkoppeld van IP-adressen en voorzien van een eenrichtings-hash.
              </p>
            </div>

            <div className="bg-stone-50 rounded-xl p-3.5 border border-stone-200 space-y-1">
              <div className="flex items-center gap-2 font-semibold text-[#171717]">
                <Lock className="w-4 h-4 text-emerald-600" />
                <span>Strikte Scheiding</span>
              </div>
              <p className="text-xs text-stone-500">
                Contactgegevens (bijv. e-mail voor vervolg) worden fysiek in een aparte database bewaard en nooit gekoppeld aan woonwensen.
              </p>
            </div>

            <div className="bg-stone-50 rounded-xl p-3.5 border border-stone-200 space-y-1">
              <div className="flex items-center gap-2 font-semibold text-[#171717]">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>K-Anonimiteit (&ge; 15)</span>
              </div>
              <p className="text-xs text-stone-500">
                Resultaten per CBS-buurt worden uitsluitend getoond wanneer minimaal 15 reacties zijn ontvangen, ter voorkoming van herleidbaarheid.
              </p>
            </div>

            <div className="bg-stone-50 rounded-xl p-3.5 border border-stone-200 space-y-1">
              <div className="flex items-center gap-2 font-semibold text-[#171717]">
                <FileText className="w-4 h-4 text-emerald-600" />
                <span>Geen Dataverkoop</span>
              </div>
              <p className="text-xs text-stone-500">
                Data wordt uitsluitend gebruikt voor maatschappelijke doelen van gemeenten en corporaties, nooit voor commerciële advertentiedoeleinden.
              </p>
            </div>
          </div>

          <div className="border-t border-stone-100 pt-4 space-y-2 text-xs">
            <h4 className="font-semibold text-stone-900">Bewaartermijn & Grondslag</h4>
            <p>
              Onderzoeksgegevens worden maximaal 24 maanden bewaard voor beleidscycli en evaluaties, waarna zij definitief worden geanonimiseerd voor historische trendanalyses. Deelname is te allen tijde vrijwillig op basis van expliciete toestemming (Artikel 6 lid 1 sub a AVG).
            </p>
          </div>
        </div>

        <div className="pt-4 border-t border-stone-100 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2.5 bg-[#171717] hover:bg-black text-white text-xs font-semibold rounded-xl cursor-pointer"
          >
            Begrepen & Sluiten
          </button>
        </div>
      </div>
    </div>
  );
};
