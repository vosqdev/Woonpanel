import React from 'react';
import { Question } from '../../types/survey';

interface Props {
  question: Question;
  value: string | undefined;
  onChange: (value: string) => void;
}

export const TextQuestion: React.FC<Props> = ({ question, value = '', onChange }) => {
  return (
    <div className="bg-white rounded-2xl border border-stone-200 p-6 space-y-3">
      <textarea
        rows={5}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Typ hier jouw antwoord, ervaring of idee..."
        className="w-full text-sm p-4 bg-stone-50 border border-stone-200 rounded-xl text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-[#171717] focus:bg-white resize-y"
      />
      <div className="flex justify-between items-center text-xs text-stone-400">
        <span>{!question.required ? 'Optionele vraag' : 'Verplichte vraag'}</span>
        <span className="font-mono tabular-nums">{value.length} tekens</span>
      </div>
    </div>
  );
};
