import React from 'react';
import { Question } from '../../types/survey';
import { Check } from 'lucide-react';

interface Props {
  question: Question;
  value: string | undefined;
  onChange: (value: string) => void;
}

export const SingleChoiceQuestion: React.FC<Props> = ({ question, value, onChange }) => {
  return (
    <div className="space-y-3">
      {question.options?.map((option) => {
        const isSelected = value === option.id;
        return (
          <button
            key={option.id}
            type="button"
            onClick={() => onChange(option.id)}
            className={`w-full text-left p-4 sm:p-5 rounded-2xl border transition-all duration-150 flex items-start justify-between gap-4 cursor-pointer ${
              isSelected
                ? 'bg-[#171717] text-white border-[#171717] shadow-sm'
                : 'bg-white text-stone-900 border-stone-200 hover:border-stone-400 hover:bg-stone-50'
            }`}
          >
            <div className="flex-1">
              <div className="text-base font-semibold leading-snug">{option.label}</div>
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
              className={`w-6 h-6 rounded-full border flex items-center justify-center shrink-0 mt-0.5 transition-colors ${
                isSelected
                  ? 'bg-[#C4F000] border-[#C4F000] text-[#171717]'
                  : 'border-stone-300 bg-white'
              }`}
            >
              {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
            </div>
          </button>
        );
      })}
    </div>
  );
};
