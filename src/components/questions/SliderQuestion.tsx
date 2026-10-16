import React from 'react';
import { Question } from '../../types/survey';

interface Props {
  question: Question;
  value: number | undefined;
  onChange: (value: number) => void;
}

export const SliderQuestion: React.FC<Props> = ({ question, value, onChange }) => {
  const min = question.min ?? 0;
  const max = question.max ?? 100;
  const step = question.step ?? 1;
  const unit = question.unit ?? '';
  const currentValue = value ?? Math.round((min + max) / 2);

  return (
    <div className="bg-white rounded-2xl border border-stone-200 p-6 sm:p-8 space-y-6">
      {/* Big value readout */}
      <div className="flex flex-col items-center justify-center py-4 bg-stone-50 rounded-xl border border-stone-100">
        <span className="text-xs uppercase tracking-wider font-semibold text-stone-500 mb-1">
          Geselecteerde waarde
        </span>
        <div className="text-3xl sm:text-4xl font-extrabold font-mono text-[#171717] tabular-nums flex items-baseline gap-1.5">
          <span>{currentValue.toLocaleString('nl-NL')}</span>
          <span className="text-lg font-sans font-medium text-stone-600">{unit}</span>
        </div>
      </div>

      {/* Slider input */}
      <div className="space-y-4 pt-2">
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={currentValue}
          onChange={(e) => onChange(Number(e.target.value))}
          className="w-full h-3 bg-stone-200 rounded-lg appearance-none cursor-pointer accent-[#171717] focus:outline-none"
        />

        {/* Min / Max Labels */}
        <div className="flex justify-between text-xs text-stone-500 font-mono">
          <span>Minimaal: {min.toLocaleString('nl-NL')} {unit}</span>
          <span>Maximaal: {max.toLocaleString('nl-NL')} {unit}</span>
        </div>
      </div>

      {/* Quick preset buttons */}
      <div className="pt-2 flex flex-wrap gap-2 justify-center">
        {[
          min,
          Math.round(min + (max - min) * 0.25),
          Math.round(min + (max - min) * 0.5),
          Math.round(min + (max - min) * 0.75),
          max,
        ].map((preset) => (
          <button
            key={preset}
            type="button"
            onClick={() => onChange(preset)}
            className={`px-3 py-1 rounded-md text-xs font-mono transition-colors cursor-pointer ${
              currentValue === preset
                ? 'bg-[#171717] text-white'
                : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
            }`}
          >
            {preset.toLocaleString('nl-NL')} {unit}
          </button>
        ))}
      </div>
    </div>
  );
};
