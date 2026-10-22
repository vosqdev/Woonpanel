import React from 'react';
import { Question } from '../../types/survey';
import { Check } from 'lucide-react';

interface Props {
  question: Question;
  value: string[] | undefined;
  onChange: (value: string[]) => void;
}

export const MultipleChoiceQuestion: React.FC<Props> = ({ question, value = [], onChange }) => {
  const maxSelections = question.maxSelections;

  const toggleOption = (optionId: string) => {
    if (value.includes(optionId)) {
      onChange(value.filter((id) => id !== optionId));
    } else {
      if (maxSelections && value.length >= maxSelections) {
        // If max reached, replace earliest or keep limit
        const next = [...value.slice(1), optionId];
        onChange(next);
      } else {
        onChange([...value, optionId]);
      }
    }
  };

  const isGrid2 = question.columns === 2 || (!question.columns && (question.options?.length ?? 0) >= 4 && !question.options?.some(o => o.description));
  const isGrid3 = question.columns === 3;

  return (
    <div className="space-y-3">
      {maxSelections && (
        <div className="flex items-center justify-between text-xs text-stone-500 font-mono pb-1">
          <span>Kies maximaal {maxSelections} antwoorden</span>
          <span className="font-semibold text-stone-800">
            {value.length}/{maxSelections} geselecteerd
          </span>
        </div>
      )}

      <div
        className={
          isGrid3
            ? 'grid grid-cols-1 sm:grid-cols-3 gap-3'
            : isGrid2
            ? 'grid grid-cols-1 sm:grid-cols-2 gap-3'
            : 'space-y-3'
        }
      >
        {question.options?.map((option) => {
          const isSelected = value.includes(option.id);
          return (
            <button
              key={option.id}
              type="button"
              onClick={() => toggleOption(option.id)}
              className={`w-full text-left p-4 sm:p-5 rounded-2xl border transition-all duration-150 flex items-center justify-between gap-3 cursor-pointer ${
                isSelected
                  ? 'bg-[#171717] text-white border-[#171717] shadow-sm ring-1 ring-[#171717]'
                  : 'bg-white text-stone-900 border-stone-200 hover:border-stone-400 hover:bg-stone-50'
              }`}
            >
              <div className="flex-1 min-w-0">
                <div className={`text-base font-semibold leading-snug ${isSelected ? 'text-[#C4F000]' : 'text-stone-900'}`}>
                  {option.label}
                </div>
                {option.description && (
                  <div
                    className={`text-xs mt-1 leading-relaxed ${
                      isSelected ? 'text-stone-300' : 'text-stone-500'
                    }`}
                  >
                    {option.description}
                  </div>
                )}
              </div>

              <div
                className={`w-6 h-6 rounded-md border flex items-center justify-center shrink-0 transition-colors ${
                  isSelected
                    ? 'bg-[#171717] border-[#C4F000] text-[#C4F000]'
                    : 'border-stone-300 bg-white'
                }`}
              >
                {isSelected && <Check className="w-4 h-4 stroke-[3]" />}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
