import React, { useState, useEffect } from 'react';
import { Question } from '../../types/survey';
import { Check } from 'lucide-react';

interface Props {
  question: Question;
  value: any;
  onChange: (value: any) => void;
}

export const SingleChoiceQuestion: React.FC<Props> = ({ question, value, onChange }) => {
  // If value is stored as an object { choice: string, extra?: string }
  const selectedChoice = typeof value === 'object' && value !== null ? value.choice : value;
  const initialExtra = typeof value === 'object' && value !== null ? value.extra || '' : '';
  const [extraVal, setExtraVal] = useState<string>(initialExtra);

  useEffect(() => {
    if (typeof value === 'object' && value !== null && value.extra !== undefined) {
      setExtraVal(value.extra);
    }
  }, [value]);

  const handleSelectChoice = (optionId: string) => {
    if (question.extraInput) {
      onChange({
        choice: optionId,
        extra: extraVal,
      });
    } else {
      onChange(optionId);
    }
  };

  const handleExtraChange = (text: string) => {
    setExtraVal(text);
    if (selectedChoice) {
      onChange({
        choice: selectedChoice,
        extra: text,
      });
    }
  };

  const isGrid2 = question.columns === 2 || (!question.columns && (question.options?.length ?? 0) >= 4 && !question.options?.some(o => o.description));
  const isGrid3 = question.columns === 3;

  return (
    <div className="space-y-4">
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
          const isSelected = selectedChoice === option.id;
          return (
            <button
              key={option.id}
              type="button"
              onClick={() => handleSelectChoice(option.id)}
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
                className={`w-6 h-6 rounded-full border flex items-center justify-center shrink-0 transition-colors ${
                  isSelected
                    ? 'bg-[#171717] border-[#C4F000] text-[#C4F000]'
                    : 'border-stone-300 bg-white'
                }`}
              >
                {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
              </div>
            </button>
          );
        })}
      </div>

      {/* Extra text / postal code input (as in Screenshot 1) */}
      {question.extraInput && (
        <div className="mt-4 pt-4 border-t border-stone-200 flex flex-col sm:flex-row sm:items-center gap-3">
          <label className="text-xs font-semibold text-stone-700 whitespace-nowrap">
            {question.extraInput.label}
          </label>
          <input
            type="text"
            value={extraVal}
            onChange={(e) => handleExtraChange(e.target.value)}
            placeholder={question.extraInput.placeholder}
            maxLength={6}
            className="w-28 px-3.5 py-2 rounded-xl border border-stone-300 text-sm font-mono font-bold text-center focus:outline-none focus:ring-2 focus:ring-[#C4F000] bg-white text-stone-900 shadow-2xs"
          />
          {question.extraInput.helperText && (
            <span className="text-xs text-stone-500">
              {question.extraInput.helperText}
            </span>
          )}
        </div>
      )}
    </div>
  );
};
