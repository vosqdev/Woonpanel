import React from 'react';
import { Question } from '../../types/survey';
import { Star } from 'lucide-react';

interface Props {
  question: Question;
  value: number | undefined;
  onChange: (value: number) => void;
}

export const RatingQuestion: React.FC<Props> = ({ question, value, onChange }) => {
  const max = question.ratingMax ?? 5;
  const isStars = question.ratingType === 'stars' || max <= 5;
  const labels = question.ratingLabels ?? { low: 'Zeer laag / ontevreden', high: 'Zeer hoog / uitstekend' };

  return (
    <div className="bg-white rounded-2xl border border-stone-200 p-6 sm:p-8 space-y-8">
      {/* Visual selection area */}
      {isStars ? (
        <div className="flex flex-col items-center gap-6 py-4">
          <div className="flex items-center justify-center gap-3 sm:gap-5">
            {Array.from({ length: max }, (_, i) => i + 1).map((starNumber) => {
              const isFilled = (value ?? 0) >= starNumber;
              return (
                <button
                  key={starNumber}
                  type="button"
                  onClick={() => onChange(starNumber)}
                  className="p-2 transition-transform hover:scale-110 active:scale-95 cursor-pointer focus:outline-none"
                  aria-label={`Geef ${starNumber} sterren`}
                >
                  <Star
                    className={`w-10 h-10 sm:w-12 sm:h-12 transition-colors ${
                      isFilled
                        ? 'fill-[#171717] text-[#171717]'
                        : 'text-stone-300 hover:text-stone-400'
                    }`}
                  />
                </button>
              );
            })}
          </div>

          <div className="text-sm font-semibold text-stone-800">
            {value ? (
              <span>
                Jouw waardering:{' '}
                <strong className="text-base font-bold font-mono text-[#171717]">
                  {value} van de {max} sterren
                </strong>
              </span>
            ) : (
              <span className="text-stone-400">Klik op een ster om jouw score te geven</span>
            )}
          </div>
        </div>
      ) : (
        /* Numerical Scale 1 - 10 */
        <div className="space-y-4">
          <div className="grid grid-cols-5 sm:grid-cols-10 gap-2">
            {Array.from({ length: max }, (_, i) => i + 1).map((num) => {
              const isSelected = value === num;
              return (
                <button
                  key={num}
                  type="button"
                  onClick={() => onChange(num)}
                  className={`py-3 sm:py-4 rounded-xl border text-sm sm:text-base font-bold font-mono transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-[#171717] text-white border-[#171717] shadow-sm scale-105'
                      : 'bg-stone-50 text-stone-800 border-stone-200 hover:bg-stone-100 hover:border-stone-400'
                  }`}
                >
                  {num}
                </button>
              );
            })}
          </div>

          <div className="text-center font-semibold text-stone-800 text-sm">
            {value ? (
              <span>
                Gekozen rapportcijfer:{' '}
                <strong className="font-mono text-base">{value}</strong>
              </span>
            ) : (
              <span className="text-stone-400 text-xs">Selecteer een cijfer van 1 tot {max}</span>
            )}
          </div>
        </div>
      )}

      {/* Axis descriptive endpoints */}
      <div className="flex justify-between items-center text-xs text-stone-500 pt-4 border-t border-stone-100 font-medium">
        <span>1: {labels.low}</span>
        <span>{max}: {labels.high}</span>
      </div>
    </div>
  );
};
