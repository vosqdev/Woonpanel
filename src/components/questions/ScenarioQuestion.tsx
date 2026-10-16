import React, { useState } from 'react';
import { Question, ScenarioOption } from '../../types/survey';
import { Check, Trees, Car, Building, Sparkles } from 'lucide-react';

interface Props {
  question: Question;
  value: { selectedScenarioId: string; motivation: string } | undefined;
  onChange: (value: { selectedScenarioId: string; motivation: string }) => void;
}

export const ScenarioQuestion: React.FC<Props> = ({ question, value, onChange }) => {
  const scenarios = question.scenarios ?? [];
  const selectedId = value?.selectedScenarioId ?? '';
  const motivation = value?.motivation ?? '';

  const handleSelect = (scenarioId: string) => {
    onChange({
      selectedScenarioId: scenarioId,
      motivation,
    });
  };

  const handleMotivationChange = (text: string) => {
    onChange({
      selectedScenarioId: selectedId,
      motivation: text,
    });
  };

  return (
    <div className="space-y-6">
      <div className="text-xs text-stone-500 font-medium">
        Kies één van de onderstaande ontwikkelscenario’s die volgens jou het beste aansluit bij de buurt.
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {scenarios.map((scenario) => {
          const isSelected = selectedId === scenario.id;
          return (
            <div
              key={scenario.id}
              onClick={() => handleSelect(scenario.id)}
              className={`rounded-2xl border p-5 flex flex-col justify-between transition-all cursor-pointer ${
                isSelected
                  ? 'bg-stone-50 border-[#171717] ring-2 ring-[#171717] shadow-sm'
                  : 'bg-white border-stone-200 hover:border-stone-400'
              }`}
            >
              <div>
                {/* Header */}
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="text-xs font-mono font-bold uppercase tracking-wider text-stone-500">
                    {scenario.id.replace('_', ' ')}
                  </span>
                  <div
                    className={`w-6 h-6 rounded-full border flex items-center justify-center shrink-0 transition-colors ${
                      isSelected
                        ? 'bg-[#C4F000] border-[#C4F000] text-[#171717]'
                        : 'border-stone-300 bg-white'
                    }`}
                  >
                    {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                  </div>
                </div>

                <h4 className="text-base font-bold text-[#171717] mb-2 leading-snug">
                  {scenario.title}
                </h4>

                <p className="text-xs text-stone-600 leading-relaxed mb-4">
                  {scenario.description}
                </p>

                {/* Key specs */}
                <div className="bg-white rounded-xl border border-stone-200 p-3 space-y-2.5 text-xs mb-4">
                  <div className="flex items-start gap-2">
                    <Sparkles className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5" />
                    <div>
                      <span className="text-stone-400 block text-[10px] uppercase font-bold">Focus</span>
                      <span className="font-semibold text-stone-800">{scenario.highlight}</span>
                    </div>
                  </div>

                  <div className="flex items-start gap-2">
                    <Building className="w-3.5 h-3.5 text-stone-500 shrink-0 mt-0.5" />
                    <div>
                      <span className="text-stone-400 block text-[10px] uppercase font-bold">Woningbouw</span>
                      <span className="text-stone-700">{scenario.housingUnits}</span>
                    </div>
                  </div>

                  <div className="flex items-start gap-2">
                    <Trees className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                    <div>
                      <span className="text-stone-400 block text-[10px] uppercase font-bold">Groen & Park</span>
                      <span className="text-stone-700">{scenario.greenSpace}</span>
                    </div>
                  </div>

                  <div className="flex items-start gap-2">
                    <Car className="w-3.5 h-3.5 text-stone-500 shrink-0 mt-0.5" />
                    <div>
                      <span className="text-stone-400 block text-[10px] uppercase font-bold">Mobiliteit</span>
                      <span className="text-stone-700">{scenario.parkingConcept}</span>
                    </div>
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleSelect(scenario.id);
                }}
                className={`w-full py-2 px-3 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                  isSelected
                    ? 'bg-[#171717] text-white'
                    : 'bg-stone-100 text-stone-800 hover:bg-stone-200'
                }`}
              >
                {isSelected ? 'Geselecteerd scenario' : 'Kies dit scenario'}
              </button>
            </div>
          );
        })}
      </div>

      {/* Motivation text */}
      {selectedId && (
        <div className="bg-white rounded-2xl border border-stone-200 p-5 space-y-2">
          <label className="block text-sm font-semibold text-stone-900">
            Waarom kies je voor dit scenario? (Optioneel)
          </label>
          <textarea
            rows={3}
            value={motivation}
            onChange={(e) => handleMotivationChange(e.target.value)}
            placeholder="Licht jouw voorkeur toe, of deel specifieke wensen voor de inrichting..."
            className="w-full text-xs p-3 bg-stone-50 border border-stone-200 rounded-lg text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-[#171717] focus:bg-white resize-y"
          />
        </div>
      )}
    </div>
  );
};
